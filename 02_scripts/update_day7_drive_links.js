const fs = require('fs');
const path = require('path');

console.log('=== UPDATING DAY 7 GOOGLE DRIVE FILE NAMES & ENHANCING FILE EDITING ===');

const baseDir = path.join(__dirname, '..');
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

// Update Day 7 (19 สิงหาคม 2569) sessions with exact file names
hubData.learning_map.forEach(session => {
    if (session.date.includes('19 สิงหาคม') || session.date.includes('19 ส.ค.')) {
        if (session.id.includes('adv-m') || session.period.includes('เช้า')) {
            session.file_name = '19-8-69 ช่วงเช้า การบริหารคลังข้อมูลและแดชบอร์ด (สถิติแห่งชาติ).pdf';
            session.file_url = 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h';
        } else if (session.id.includes('adv-a') || session.period.includes('บ่าย')) {
            session.file_name = '19-8-69 ช่วงบ่าย เรื่อง งานสารบรรณและการร่างข้.pdf';
            session.file_url = 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h';
        }
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');
console.log('✓ Updated 01_data/lecturers_hub_data.json with accurate Day 7 filenames');

// ============================================================================
// Update modal-edit-session-room in index.html to allow editing file name & Drive URL
// ============================================================================
const indexPath = path.join(baseDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const targetModalFields = `                <div>
                    <label class="block font-bold text-slate-700 mb-1">หมายเหตุเพิ่มเติม (เช่น เบรค / ข้าวกลางวัน):</label>
                    <textarea id="edit-room-notes-input" rows="2" placeholder="เช่น ทานเบรคในห้อง / ทานอาหารกลางวันรวมห้อง 210" class="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>`;

const newModalFields = `                <div>
                    <label class="block font-bold text-slate-700 mb-1">ชื่อไฟล์เอกสาร / สไลด์ประกอบการเรียน:</label>
                    <input type="text" id="edit-session-filename-input" placeholder="เช่น 19-8-69 ช่วงเช้า การบริหารคลังข้อมูลและแดชบอร์ด.pdf" class="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">ลิงก์ Google Drive ประจำโฟลเดอร์/ไฟล์:</label>
                    <input type="url" id="edit-session-fileurl-input" placeholder="https://drive.google.com/drive/folders/..." class="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">หมายเหตุเพิ่มเติม (เช่น เบรค / ข้าวกลางวัน):</label>
                    <textarea id="edit-room-notes-input" rows="2" placeholder="เช่น ทานเบรคในห้อง / ทานอาหารกลางวันรวมห้อง 210" class="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>`;

if (indexHtml.includes(targetModalFields)) {
    indexHtml = indexHtml.replace(targetModalFields, newModalFields);
    console.log('✓ Added file name and Drive URL fields into edit modal in index.html');
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');

// ============================================================================
// Update app.js
// ============================================================================
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Sync master13DaysHubSessions in app.js
const updatedSessionsJson = JSON.stringify(hubData.learning_map, null, 4);
const sessionsRegex = /const master13DaysHubSessions = \[[\s\S]*?\];/;
if (appJs.match(sessionsRegex)) {
    appJs = appJs.replace(sessionsRegex, `const master13DaysHubSessions = ${updatedSessionsJson};`);
    console.log('✓ Synchronized master13DaysHubSessions in app.js');
}

// Update openEditRoomModal and saveEditedSessionRoom in app.js
const oldOpenEditCode = `function openEditRoomModal(sessionId) {
    const session = master13DaysHubSessions.find(s => s.id === sessionId);
    if (!session) return;

    setInputValue('edit-room-session-id', sessionId);
    setText('edit-room-date-label', \`กำหนดการ \${session.date} (\${session.period})\`);
    setText('edit-room-subject-display', session.subject);
    
    const presetSelect = document.getElementById('edit-room-preset-select');
    const customInput = document.getElementById('edit-room-custom-input');
    const notesInput = document.getElementById('edit-room-notes-input');

    if (customInput) customInput.value = session.room || '';
    if (notesInput) notesInput.value = session.notes || '';
    if (presetSelect) {
        presetSelect.value = '';
        Array.from(presetSelect.options).forEach(opt => {
            if (opt.value === session.room) presetSelect.value = opt.value;
        });
    }

    openModal('modal-edit-session-room');
}`;

const newOpenEditCode = `function openEditRoomModal(sessionId) {
    const session = master13DaysHubSessions.find(s => s.id === sessionId);
    if (!session) return;

    setInputValue('edit-room-session-id', sessionId);
    setText('edit-room-date-label', \`กำหนดการ \${session.date} (\${session.period})\`);
    setText('edit-room-subject-display', session.subject);
    
    const presetSelect = document.getElementById('edit-room-preset-select');
    const customInput = document.getElementById('edit-room-custom-input');
    const notesInput = document.getElementById('edit-room-notes-input');
    const filenameInput = document.getElementById('edit-session-filename-input');
    const fileurlInput = document.getElementById('edit-session-fileurl-input');

    if (customInput) customInput.value = session.room || '';
    if (notesInput) notesInput.value = session.notes || '';
    if (filenameInput) filenameInput.value = session.file_name || '';
    if (fileurlInput) fileurlInput.value = session.file_url || '';

    if (presetSelect) {
        presetSelect.value = '';
        Array.from(presetSelect.options).forEach(opt => {
            if (opt.value === session.room) presetSelect.value = opt.value;
        });
    }

    openModal('modal-edit-session-room');
}`;

if (appJs.includes(oldOpenEditCode)) {
    appJs = appJs.replace(oldOpenEditCode, newOpenEditCode);
    console.log('✓ Updated openEditRoomModal to populate file details');
}

const oldSaveEditCode = `function saveEditedSessionRoom() {
    const sessionId = document.getElementById('edit-room-session-id')?.value;
    const session = master13DaysHubSessions.find(s => s.id === sessionId);
    if (!session) return;

    const newRoom = document.getElementById('edit-room-custom-input')?.value?.trim();
    const newNotes = document.getElementById('edit-room-notes-input')?.value?.trim();

    if (!newRoom) {
        showToast('กรุณาระบุชื่อห้องเรียน', 'error');
        return;
    }

    session.room = newRoom;
    session.notes = newNotes;

    // Save custom session overrides to localStorage
    try {
        const savedOverrides = JSON.parse(localStorage.getItem('civil_custom_sessions') || '{}');
        savedOverrides[sessionId] = { room: newRoom, notes: newNotes };
        localStorage.setItem('civil_custom_sessions', JSON.stringify(savedOverrides));
    } catch (e) {
        console.warn('Could not persist room override to localStorage:', e);
    }

    closeModal('modal-edit-session-room');
    renderScheduleList();
    showToast(\`อัปเดตห้องเป็น "\${newRoom}" เรียบร้อยแล้ว 🎉\`, 'success');
}`;

const newSaveEditCode = `function saveEditedSessionRoom() {
    const sessionId = document.getElementById('edit-room-session-id')?.value;
    const session = master13DaysHubSessions.find(s => s.id === sessionId);
    if (!session) return;

    const newRoom = document.getElementById('edit-room-custom-input')?.value?.trim();
    const newNotes = document.getElementById('edit-room-notes-input')?.value?.trim();
    const newFilename = document.getElementById('edit-session-filename-input')?.value?.trim();
    const newFileurl = document.getElementById('edit-session-fileurl-input')?.value?.trim();

    if (!newRoom) {
        showToast('กรุณาระบุชื่อห้องเรียน', 'error');
        return;
    }

    session.room = newRoom;
    session.notes = newNotes;
    if (newFilename) session.file_name = newFilename;
    if (newFileurl) session.file_url = newFileurl;

    // Save custom session overrides to localStorage
    try {
        const savedOverrides = JSON.parse(localStorage.getItem('civil_custom_sessions') || '{}');
        savedOverrides[sessionId] = { 
            room: newRoom, 
            notes: newNotes,
            file_name: newFilename,
            file_url: newFileurl
        };
        localStorage.setItem('civil_custom_sessions', JSON.stringify(savedOverrides));
    } catch (e) {
        console.warn('Could not persist room override to localStorage:', e);
    }

    closeModal('modal-edit-session-room');
    renderScheduleList();
    showToast(\`อัปเดตข้อมูลและลิงก์ไฟล์เรียบร้อยแล้ว 🎉\`, 'success');
}`;

if (appJs.includes(oldSaveEditCode)) {
    appJs = appJs.replace(oldSaveEditCode, newSaveEditCode);
    console.log('✓ Updated saveEditedSessionRoom to persist file overrides');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Day 7 Google Drive file update & editing complete!');
