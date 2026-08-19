const fs = require('fs');
const path = require('path');

console.log('=== IMPLEMENTING DYNAMIC MULTI-FILE ATTACHMENT SYSTEM (1, 2, 3, 4...) ===');

const baseDir = path.join(__dirname, '..');
const indexPath = path.join(baseDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Update 1.2 and 2.2 in modal-day-links in index.html to support dynamic multi-file list
const oldMorningDocSection = `                    <!-- 1.2 สไลด์/เอกสาร เช้า -->
                    <div class="p-2.5 bg-white rounded-lg border border-blue-100 space-y-2">
                        <div class="font-bold text-emerald-800 text-[11px] flex items-center justify-between">
                            <span><i class="fa-solid fa-file-pdf text-emerald-600 mr-1"></i>1.2 เอกสาร / สไลด์บรรยายช่วงเช้า</span>
                            <span class="text-[10px] text-slate-400 font-normal">Canva / PDF / Drive</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label class="block text-slate-600 font-semibold mb-1" for="modal-links-morning-doc-url">URL สไลด์เช้า</label>
                                <input type="url" id="modal-links-morning-doc-url" placeholder="https://drive.google.com/..." class="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white">
                            </div>
                            <div>
                                <label class="block text-slate-600 font-semibold mb-1" for="modal-links-morning-doc-title">ชื่อไฟล์ / หัวข้อสไลด์เช้า</label>
                                <input type="text" id="modal-links-morning-doc-title" placeholder="เช่น สไลด์บรรยายเช้า.pdf" class="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white">
                            </div>
                        </div>
                    </div>`;

const newMorningDocSection = `                    <!-- 1.2 สไลด์/เอกสาร เช้า (รองรับหลายไฟล์ 1, 2, 3, 4...) -->
                    <div class="p-2.5 bg-white rounded-lg border border-blue-100 space-y-2">
                        <div class="font-bold text-emerald-800 text-[11px] flex items-center justify-between">
                            <span class="flex items-center gap-1.5"><i class="fa-solid fa-file-pdf text-emerald-600"></i>1.2 เอกสาร / สไลด์บรรยายช่วงเช้า (Canva / PDF / Drive)</span>
                            <button type="button" onclick="addMorningFileRow('', '')" class="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 cursor-pointer transition">
                                <i class="fa-solid fa-plus"></i> เพิ่มไฟล์ที่ 2, 3, 4...
                            </button>
                        </div>
                        
                        <div id="morning-files-container" class="space-y-2">
                            <!-- Dynamic File Rows (1, 2, 3, 4...) will be injected here -->
                        </div>
                    </div>`;

if (indexHtml.includes(oldMorningDocSection)) {
    indexHtml = indexHtml.replace(oldMorningDocSection, newMorningDocSection);
    console.log('✓ Updated morning files section in modal to dynamic list');
}

// Update 2.2 Afternoon Doc Section in index.html
const oldAfternoonDocSection = `                    <!-- 2.2 สไลด์/เอกสาร บ่าย -->
                    <div class="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-2">
                        <div class="font-bold text-emerald-800 text-[11px] flex items-center justify-between">
                            <span><i class="fa-solid fa-file-pdf text-emerald-600 mr-1"></i>2.2 เอกสาร / สไลด์บรรยายช่วงบ่าย</span>
                            <span class="text-[10px] text-slate-400 font-normal">Canva / PDF / Drive</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label class="block text-slate-600 font-semibold mb-1" for="modal-links-afternoon-doc-url">URL สไลด์บ่าย</label>
                                <input type="url" id="modal-links-afternoon-doc-url" placeholder="https://drive.google.com/..." class="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white">
                            </div>
                            <div>
                                <label class="block text-slate-600 font-semibold mb-1" for="modal-links-afternoon-doc-title">ชื่อไฟล์ / หัวข้อสไลด์บ่าย</label>
                                <input type="text" id="modal-links-afternoon-doc-title" placeholder="เช่น สไลด์บรรยายบ่าย.pdf" class="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white">
                            </div>
                        </div>
                    </div>`;

const newAfternoonDocSection = `                    <!-- 2.2 สไลด์/เอกสาร บ่าย (รองรับหลายไฟล์ 1, 2, 3, 4...) -->
                    <div class="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-2">
                        <div class="font-bold text-emerald-800 text-[11px] flex items-center justify-between">
                            <span class="flex items-center gap-1.5"><i class="fa-solid fa-file-pdf text-emerald-600"></i>2.2 เอกสาร / สไลด์บรรยายช่วงบ่าย (Canva / PDF / Drive)</span>
                            <button type="button" onclick="addAfternoonFileRow('', '')" class="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 cursor-pointer transition">
                                <i class="fa-solid fa-plus"></i> เพิ่มไฟล์ที่ 2, 3, 4...
                            </button>
                        </div>
                        
                        <div id="afternoon-files-container" class="space-y-2">
                            <!-- Dynamic File Rows (1, 2, 3, 4...) will be injected here -->
                        </div>
                    </div>`;

if (indexHtml.includes(oldAfternoonDocSection)) {
    indexHtml = indexHtml.replace(oldAfternoonDocSection, newAfternoonDocSection);
    console.log('✓ Updated afternoon files section in modal to dynamic list');
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');

// ============================================================================
// Update app.js
// ============================================================================
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace openDayLinksModal, saveDayLinksFromModal and add file helper functions
const multiFileJsLogic = `
/* ==========================================================================
   DYNAMIC MULTI-FILE ATTACHMENTS CONTROLLER (1, 2, 3, 4...)
   ========================================================================== */
function addMorningFileRow(title = '', url = '') {
    const container = document.getElementById('morning-files-container');
    if (!container) return;

    const rowId = 'm-file-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const count = container.querySelectorAll('.file-row').length + 1;

    const div = document.createElement('div');
    div.id = rowId;
    div.className = 'file-row p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 transition';
    div.innerHTML = \`
        <div class="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span><i class="fa-solid fa-file-lines text-emerald-600 mr-1"></i>ไฟล์/สไลด์ชุดที่ \${count}</span>
            \${count > 1 ? \`
                <button type="button" onclick="document.getElementById('\${rowId}').remove()" class="text-rose-500 hover:text-rose-700 text-[10px] font-semibold cursor-pointer">
                    <i class="fa-solid fa-trash mr-0.5"></i>ลบไฟล์นี้
                </button>
            \` : ''}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
                <input type="text" value="\${title.replace(/"/g, '&quot;')}" placeholder="ชื่อไฟล์ เช่น Workshop Dashboard.pdf" class="m-file-title w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium">
            </div>
            <div>
                <input type="url" value="\${url.replace(/"/g, '&quot;')}" placeholder="URL ลิงก์ (Drive / Canva / PDF)" class="m-file-url w-full p-2 text-xs rounded-lg border border-slate-300 bg-white">
            </div>
        </div>
    \`;
    container.appendChild(div);
}

function addAfternoonFileRow(title = '', url = '') {
    const container = document.getElementById('afternoon-files-container');
    if (!container) return;

    const rowId = 'a-file-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const count = container.querySelectorAll('.file-row').length + 1;

    const div = document.createElement('div');
    div.id = rowId;
    div.className = 'file-row p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 transition';
    div.innerHTML = \`
        <div class="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span><i class="fa-solid fa-file-lines text-emerald-600 mr-1"></i>ไฟล์/สไลด์ชุดที่ \${count}</span>
            \${count > 1 ? \`
                <button type="button" onclick="document.getElementById('\${rowId}').remove()" class="text-rose-500 hover:text-rose-700 text-[10px] font-semibold cursor-pointer">
                    <i class="fa-solid fa-trash mr-0.5"></i>ลบไฟล์นี้
                </button>
            \` : ''}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
                <input type="text" value="\${title.replace(/"/g, '&quot;')}" placeholder="ชื่อไฟล์ เช่น สไลด์วิชา 3.4.pdf" class="a-file-title w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium">
            </div>
            <div>
                <input type="url" value="\${url.replace(/"/g, '&quot;')}" placeholder="URL ลิงก์ (Drive / Canva / PDF)" class="a-file-url w-full p-2 text-xs rounded-lg border border-slate-300 bg-white">
            </div>
        </div>
    \`;
    container.appendChild(div);
}

function openDayLinksModal(dayNum) {
    const item = appState.attendance.find(a => a.day === dayNum);
    if (!item) return;

    setInputValue('modal-links-day', item.day);
    const titleEl = document.getElementById('modal-day-links-title');
    if (titleEl) {
        titleEl.innerHTML = \`
            <i class="fa-solid fa-link text-emerald-600 mr-1.5"></i>
            <span>จัดการลิงก์ \${item.day === 7 ? '& ไฟล์เอกสาร' : '& คะแนน'}วันที่ \${item.day} (\${item.date})</span>
        \`;
    }

    // 1. Morning Session (เช้า)
    setInputValue('modal-links-morning-pretest-url', item.morningPreTestUrl || item.preTestUrl || '');
    const mPreScore = item.morningPreTestScore !== undefined ? item.morningPreTestScore : (item.preTestScore !== undefined ? item.preTestScore : '');
    setInputValue('modal-links-morning-pretest-score', mPreScore);
    setInputValue('modal-links-morning-pretest-max', item.morningPreTestMax || item.preTestMax || 10);

    setInputValue('modal-links-morning-posttest-url', item.morningPostTestUrl || '');
    setInputValue('modal-links-morning-posttest-score', item.morningPostTestScore !== undefined ? item.morningPostTestScore : '');
    setInputValue('modal-links-morning-posttest-max', item.morningPostTestMax || 10);

    // Populate Morning Multi-Files
    const mContainer = document.getElementById('morning-files-container');
    if (mContainer) {
        mContainer.innerHTML = '';
        const mFiles = (item.morningFiles && item.morningFiles.length > 0) ? item.morningFiles : [
            { title: item.morningDocTitle || (item.day === 7 ? '19-8-69 ช่วงเช้า การบริหารคลังข้อมูลและแดชบอร์ด (สถิติแห่งชาติ).pdf' : ''), url: item.morningDocUrl || (item.day === 7 ? 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI' : '') }
        ];
        mFiles.forEach(f => addMorningFileRow(f.title, f.url));
    }

    // 2. Afternoon Session (บ่าย)
    setInputValue('modal-links-afternoon-pretest-url', item.afternoonPreTestUrl || '');
    setInputValue('modal-links-afternoon-pretest-score', item.afternoonPreTestScore !== undefined ? item.afternoonPreTestScore : '');
    setInputValue('modal-links-afternoon-pretest-max', item.afternoonPreTestMax || 10);

    setInputValue('modal-links-afternoon-posttest-url', item.afternoonPostTestUrl || item.postTestUrl || '');
    const aPostScore = item.afternoonPostTestScore !== undefined ? item.afternoonPostTestScore : (item.postTestScore !== undefined ? item.postTestScore : '');
    setInputValue('modal-links-afternoon-posttest-score', aPostScore);
    setInputValue('modal-links-afternoon-posttest-max', item.afternoonPostTestMax || item.postTestMax || 10);

    // Populate Afternoon Multi-Files
    const aContainer = document.getElementById('afternoon-files-container');
    if (aContainer) {
        aContainer.innerHTML = '';
        const aFiles = (item.afternoonFiles && item.afternoonFiles.length > 0) ? item.afternoonFiles : [
            { title: item.afternoonDocTitle || (item.day === 7 ? '19-8-69 ช่วงบ่าย เรื่อง งานสารบรรณและการร่างข้.pdf' : ''), url: item.afternoonDocUrl || (item.day === 7 ? 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI' : '') }
        ];
        aFiles.forEach(f => addAfternoonFileRow(f.title, f.url));
    }

    // 3. Daily Evaluation
    setInputValue('modal-links-eval-url', item.evalUrl || '');
    const evalDoneChk = document.getElementById('modal-links-eval-done');
    if (evalDoneChk) evalDoneChk.checked = !!item.evalSubmitted;

    openModal('modal-day-links');
}

function saveDayLinksFromModal() {
    const dayNum = parseInt(getInputValue('modal-links-day'), 10);
    const item = appState.attendance.find(a => a.day === dayNum);
    if (!item) return;

    // 1. Morning Session Save
    item.morningPreTestUrl = getInputValue('modal-links-morning-pretest-url');
    const mPreScore = getInputValue('modal-links-morning-pretest-score');
    item.morningPreTestScore = mPreScore !== '' ? parseFloat(mPreScore) : undefined;
    item.morningPreTestMax = parseFloat(getInputValue('modal-links-morning-pretest-max')) || 10;

    item.morningPostTestUrl = getInputValue('modal-links-morning-posttest-url');
    const mPostScore = getInputValue('modal-links-morning-posttest-score');
    item.morningPostTestScore = mPostScore !== '' ? parseFloat(mPostScore) : undefined;
    item.morningPostTestMax = parseFloat(getInputValue('modal-links-morning-posttest-max')) || 10;

    // Collect Morning Files (1, 2, 3, 4...)
    const mRows = document.querySelectorAll('#morning-files-container .file-row');
    const mFiles = [];
    mRows.forEach(row => {
        const title = row.querySelector('.m-file-title')?.value?.trim() || '';
        const url = row.querySelector('.m-file-url')?.value?.trim() || '';
        if (title || url) mFiles.push({ title, url });
    });
    item.morningFiles = mFiles;
    item.morningDocTitle = mFiles.length > 0 ? mFiles[0].title : '';
    item.morningDocUrl = mFiles.length > 0 ? mFiles[0].url : '';

    // 2. Afternoon Session Save
    item.afternoonPreTestUrl = getInputValue('modal-links-afternoon-pretest-url');
    const aPreScore = getInputValue('modal-links-afternoon-pretest-score');
    item.afternoonPreTestScore = aPreScore !== '' ? parseFloat(aPreScore) : undefined;
    item.afternoonPreTestMax = parseFloat(getInputValue('modal-links-afternoon-pretest-max')) || 10;

    item.afternoonPostTestUrl = getInputValue('modal-links-afternoon-posttest-url');
    const aPostScore = getInputValue('modal-links-afternoon-posttest-score');
    item.afternoonPostTestScore = aPostScore !== '' ? parseFloat(aPostScore) : undefined;
    item.afternoonPostTestMax = parseFloat(getInputValue('modal-links-afternoon-posttest-max')) || 10;

    // Collect Afternoon Files (1, 2, 3, 4...)
    const aRows = document.querySelectorAll('#afternoon-files-container .file-row');
    const aFiles = [];
    aRows.forEach(row => {
        const title = row.querySelector('.a-file-title')?.value?.trim() || '';
        const url = row.querySelector('.a-file-url')?.value?.trim() || '';
        if (title || url) aFiles.push({ title, url });
    });
    item.afternoonFiles = aFiles;
    item.afternoonDocTitle = aFiles.length > 0 ? aFiles[0].title : '';
    item.afternoonDocUrl = aFiles.length > 0 ? aFiles[0].url : '';

    // 3. Compatibility pointers
    item.preTestUrl = item.morningPreTestUrl || item.afternoonPreTestUrl || '';
    item.preTestScore = item.morningPreTestScore !== undefined ? item.morningPreTestScore : item.afternoonPreTestScore;
    item.preTestMax = item.morningPreTestMax || 10;

    item.postTestUrl = item.afternoonPostTestUrl || item.morningPostTestUrl || '';
    item.postTestScore = item.afternoonPostTestScore !== undefined ? item.afternoonPostTestScore : item.morningPostTestScore;
    item.postTestMax = item.afternoonPostTestMax || 10;

    item.docUrl = item.morningDocUrl || item.afternoonDocUrl || '';
    item.docTitle = item.morningDocTitle || item.afternoonDocTitle || '';

    // 4. Daily Evaluation Save
    item.evalUrl = getInputValue('modal-links-eval-url');
    const evalDoneChk = document.getElementById('modal-links-eval-done');
    item.evalSubmitted = evalDoneChk ? evalDoneChk.checked : false;

    saveState();
    closeModal('modal-day-links');
    renderScheduleList();
    renderKPIs();
    showToast(\`บันทึกข้อมูลและไฟล์ทั้งหมด (\${mFiles.length + aFiles.length} ไฟล์) วันที่ \${dayNum} เรียบร้อยแล้ว 🎉\`, 'success');
}
`;

// Replace existing openDayLinksModal & saveDayLinksFromModal in app.js
appJs = appJs.replace(/function openDayLinksModal\(dayNum\) \{[\s\S]*?function saveDayLinksFromModal\(\) \{[\s\S]*?showToast\([^)]+\);\s*\}/, multiFileJsLogic);

// Now update session card file rendering in renderScheduleList to render multiple files seamlessly
const multiFileCardHtml = `\${(() => {
                                const isMorning = s.period.includes('เช้า') || s.id.includes('-m');
                                const filesList = isMorning 
                                    ? ((dayItem.morningFiles && dayItem.morningFiles.length > 0) ? dayItem.morningFiles : [{ title: dayItem.morningDocTitle || s.file_name || 'เอกสารบรรยาย.pdf', url: dayItem.morningDocUrl || s.file_url || 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI' }])
                                    : ((dayItem.afternoonFiles && dayItem.afternoonFiles.length > 0) ? dayItem.afternoonFiles : [{ title: dayItem.afternoonDocTitle || s.file_name || 'เอกสารบรรยาย.pdf', url: dayItem.afternoonDocUrl || s.file_url || 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI' }]);
                                
                                return \`
                                    <div class="pt-2 border-t border-slate-200/60 space-y-1.5">
                                        \${filesList.map((f, fIdx) => \`
                                            <div class="flex items-center justify-between gap-2 flex-wrap bg-slate-50/80 p-1.5 rounded-lg border border-slate-200/70">
                                                <div class="text-[11px] text-slate-700 truncate flex-1 min-w-[140px]" title="\${f.title || 'เอกสาร'}">
                                                    📄 \${filesList.length > 1 ? \`<strong class="text-blue-700">[\${fIdx + 1}]</strong>\` : ''} <strong>ไฟล์:</strong> \${f.title || 'เอกสารประกอบการบรรยาย.pdf'}
                                                </div>
                                                <a href="\${f.url || '#'}" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs transition flex items-center space-x-1 shrink-0">
                                                    <i class="fa-brands fa-google-drive"></i>
                                                    <span>เปิดไฟล์ Drive</span>
                                                </a>
                                            </div>
                                        \`).join('')}
                                    </div>
                                \`;
                            })()}`;

// Replace single file row with multi-file card section in app.js
appJs = appJs.replace(/\$\{\(\(\) => \{\s*const isMorning = s\.period\.includes\('เช้า'\) \|\| s\.id\.includes\('-m'\);[\s\S]*?\}\)\(\)\}/, multiFileCardHtml);

// Expose functions on window
appJs += '\nwindow.addMorningFileRow = addMorningFileRow;\nwindow.addAfternoonFileRow = addAfternoonFileRow;\n';

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Successfully implemented Dynamic Multi-file system in app.js!');
