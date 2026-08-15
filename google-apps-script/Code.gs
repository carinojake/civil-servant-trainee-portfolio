/**
 * Nitipat Government Portfolio Sync API
 * Deploy as a Web App: Execute as owner, access limited to the owner.
 * Keep the Script URL private. This MVP uses one portfolioId per owner.
 */
const CONFIG = {
  portfolioId: 'nitipat-default',
  rootFolder: 'Nitipat Government Portfolio',
  spreadsheet: 'Nitipat Government Portfolio Index',
  maxFileBytes: 10 * 1024 * 1024
};

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'health';
    const portfolioId = (e && e.parameter && e.parameter.portfolioId) || CONFIG.portfolioId;
    assertPortfolio(portfolioId);
    if (action === 'health') return json({ ok: true, status: 'healthy', portfolioId });
    if (action === 'getLatest') return json(getLatest());
    if (action === 'listSnapshots') return json({ ok: true, snapshots: listSnapshots() });
    return json({ ok: false, status: 'error', message: 'Unknown GET action' });
  } catch (error) {
    logSync('GET', 'error', error.message);
    return json({ ok: false, status: 'error', message: error.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = body.action;
    assertPortfolio(body.portfolioId || CONFIG.portfolioId);
    if (action === 'saveSnapshot') return json(saveSnapshot(body));
    if (action === 'uploadFile') return json(uploadFile(body));
    if (action === 'restoreSnapshot') return json(restoreSnapshot(body));
    return json({ ok: false, status: 'error', message: 'Unknown POST action' });
  } catch (error) {
    logSync('POST', 'error', error.message);
    return json({ ok: false, status: 'error', message: error.message });
  }
}

function saveSnapshot(body) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const latest = getLatest();
    const currentRevision = Number(latest.revision || 0);
    const baseRevision = Number(body.baseRevision || 0);
    if (baseRevision !== currentRevision) {
      logSync('saveSnapshot', 'conflict', `client=${baseRevision};server=${currentRevision}`);
      return {
        ok: false,
        status: 'conflict',
        serverRevision: currentRevision,
        clientRevision: baseRevision,
        serverSnapshotId: latest.snapshotId || null,
        data: latest.data || null
      };
    }
    validatePortfolioData(body.data);
    const nextRevision = currentRevision + 1;
    const snapshotId = Utilities.getUuid();
    const timestamp = new Date().toISOString();
    const folder = getFolder('snapshots');
    const file = folder.createFile(
      `snapshot-${String(nextRevision).padStart(6, '0')}-${snapshotId}.json`,
      JSON.stringify({ portfolioId: CONFIG.portfolioId, snapshotId, revision: nextRevision, updatedAt: timestamp, contentHash: body.contentHash || null, data: body.data }, null, 2),
      MimeType.JSON
    );
    appendRow('Snapshots', [snapshotId, nextRevision, timestamp, body.contentHash || '', file.getId(), 'active']);
    logSync('saveSnapshot', 'success', `revision=${nextRevision}`);
    return { ok: true, status: 'synced', revision: nextRevision, snapshotId, updatedAt: timestamp };
  } finally {
    lock.releaseLock();
  }
}

function getLatest() {
  const rows = getRows('Snapshots');
  if (!rows.length) return { ok: true, revision: 0, snapshotId: null, data: null };
  const row = rows[rows.length - 1];
  const file = DriveApp.getFileById(row[4]);
  const snapshot = JSON.parse(file.getBlob().getDataAsString());
  return { ok: true, revision: Number(row[1]), snapshotId: row[0], updatedAt: row[2], contentHash: row[3], data: snapshot.data };
}

function listSnapshots() {
  return getRows('Snapshots').map(function(row) {
    return { snapshotId: row[0], revision: Number(row[1]), updatedAt: row[2], contentHash: row[3], fileId: row[4], status: row[5] };
  });
}

function uploadFile(body) {
  const bytes = Utilities.base64Decode(String(body.base64 || '').replace(/^data:[^;]+;base64,/, ''));
  if (!bytes.length || bytes.length > CONFIG.maxFileBytes) throw new Error('File is empty or exceeds 10 MB');
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowed.indexOf(body.mimeType) === -1) throw new Error('Unsupported file type');
  const folder = getFolder(body.category === 'documents' ? 'documents' : 'images');
  const file = folder.createFile(Utilities.newBlob(bytes, body.mimeType, safeName(body.filename)));
  appendRow('Files', [file.getName(), body.mimeType, file.getId(), body.relatedField || '', new Date().toISOString()]);
  logSync('uploadFile', 'success', file.getId());
  return { ok: true, status: 'uploaded', fileId: file.getId(), filename: file.getName() };
}

function restoreSnapshot(body) {
  const file = DriveApp.getFileById(body.fileId);
  const snapshot = JSON.parse(file.getBlob().getDataAsString());
  return saveSnapshot({ portfolioId: CONFIG.portfolioId, baseRevision: Number(body.baseRevision || getLatest().revision || 0), contentHash: snapshot.contentHash, data: snapshot.data });
}

function getRootFolder() {
  const folders = DriveApp.getFoldersByName(CONFIG.rootFolder);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.rootFolder);
}

function getFolder(name) {
  const root = getRootFolder();
  const folders = root.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : root.createFolder(name);
}

function getSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.create(CONFIG.spreadsheet);
  props.setProperty('SPREADSHEET_ID', ss.getId());
  ['Snapshots', 'Files', 'SyncLog'].forEach(function(sheetName) {
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    if (sheet.getLastRow() === 0) sheet.appendRow(headers(sheetName));
  });
  return ss;
}

function headers(sheetName) {
  if (sheetName === 'Snapshots') return ['snapshotId', 'revision', 'updatedAt', 'contentHash', 'fileId', 'status'];
  if (sheetName === 'Files') return ['filename', 'mimeType', 'fileId', 'relatedField', 'uploadedAt'];
  return ['action', 'result', 'timestamp', 'message'];
}

function getRows(sheetName) {
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
}

function appendRow(sheetName, values) {
  getSpreadsheet().getSheetByName(sheetName).appendRow(values);
}

function logSync(action, result, message) {
  try { appendRow('SyncLog', [action, result, new Date().toISOString(), String(message || '')]); } catch (ignored) {}
}

function validatePortfolioData(data) {
  if (!data || typeof data !== 'object' || !data.theme || !data.page1) throw new Error('Invalid portfolio snapshot');
}

function assertPortfolio(portfolioId) {
  if (portfolioId !== CONFIG.portfolioId) throw new Error('Unknown portfolioId');
}

function safeName(name) {
  return String(name || 'upload').replace(/[^a-zA-Z0-9._-ก-๙]/g, '_').slice(0, 120);
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
