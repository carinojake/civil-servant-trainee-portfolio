const fs = require('fs');
const path = require('path');

console.log('=== ADDING EDIT ROOM MODAL & BUTTON IN M2 SCHEDULE ===');

const baseDir = path.join(__dirname, '..');
const indexPath = path.join(baseDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Add Edit Room Modal before </body>
const editRoomModalHtml = `
    <!-- ====================================================================
         MODAL: EDIT SESSION ROOM & NOTES (ปรับเปลี่ยนห้องเรียน & หมายเหตุ)
         ==================================================================== -->
    <div id="modal-edit-session-room" class="fixed inset-0 bg-govNavy/70 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4 transition-all">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-fade-in">
            <div class="p-5 bg-gradient-to-r from-govNavy to-blue-900 text-white flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <div class="w-9 h-9 rounded-xl bg-amber-500 text-govNavy flex items-center justify-center text-base font-bold shadow-xs">
                        <i class="fa-solid fa-door-open"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">ปรับเปลี่ยนห้องเรียน & หมายเหตุ</h3>
                        <p class="text-[11px] text-blue-200" id="edit-room-date-label">กำหนดการวันที่ 19 ส.ค. 2569</p>
                    </div>
                </div>
                <button type="button" onclick="closeModal('modal-edit-session-room')" class="text-slate-300 hover:text-white text-lg p-1 cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="p-6 space-y-4 text-xs">
                <input type="hidden" id="edit-room-session-id">

                <div>
                    <label class="block font-bold text-slate-700 mb-1">รายวิชา:</label>
                    <div id="edit-room-subject-display" class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-[11px]"></div>
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>เลือกห้องอบรม (เซ็นทารา ไลฟ์):</span>
                        <span class="text-[10px] text-blue-600 font-normal">หรือพิมพ์ระบุเองได้</span>
                    </label>
                    <div class="space-y-2">
                        <select id="edit-room-preset-select" onchange="onPresetRoomSelected(this.value)" class="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-blue-500">
                            <option value="">-- เลือกห้องตามประกาศ --</option>
                            <option value="ห้อง BB 211 (ห้อง 2 - สายสีแดง)">ห้อง BB 211 (ห้อง 2 - สายสีแดง / ย้ายใหม่)</option>
                            <option value="ห้อง BB 202 (ห้อง 1 - สายสีน้ำเงิน)">ห้อง BB 202 (ห้อง 1 - พื้นฐาน)</option>
                            <option value="ห้อง BB 203 (ห้อง 2 - สายสีแดง)">ห้อง BB 203 (ห้อง 2 - ขั้นสูงเดิม)</option>
                            <option value="ห้อง BB 210 (ห้องอาหารกลางวัน)">ห้อง BB 210 (ห้องอาหารกลางวัน)</option>
                            <option value="ห้องประชุมเซ็นทารา ไลฟ์ (ห้องรวม)">ห้องประชุมเซ็นทารา ไลฟ์ (ห้องรวม 40 คน)</option>
                            <option value="CUSTOM">พิมพ์ระบุชื่อห้องเอง...</option>
                        </select>
                        <input type="text" id="edit-room-custom-input" placeholder="ระบุชื่อห้อง เช่น ห้อง BB 211 หรือ อาคาร 2" class="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">หมายเหตุเพิ่มเติม (เช่น เบรค / ข้าวกลางวัน):</label>
                    <textarea id="edit-room-notes-input" rows="2" placeholder="เช่น ทานเบรคในห้อง / ทานอาหารกลางวันรวมห้อง 210" class="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>

                <div class="flex justify-end items-center space-x-2 pt-2 border-t border-slate-100">
                    <button type="button" onclick="closeModal('modal-edit-session-room')" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer">
                        ยกเลิก
                    </button>
                    <button type="button" onclick="saveEditedSessionRoom()" class="px-5 py-2 rounded-xl bg-govNavy hover:bg-govNavyDark text-white font-bold shadow-md transition flex items-center space-x-1.5 cursor-pointer">
                        <i class="fa-solid fa-floppy-disk"></i>
                        <span>บันทึกการเปลี่ยนห้อง</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

if (!indexHtml.includes('id="modal-edit-session-room"')) {
    indexHtml = indexHtml.replace('</body>', editRoomModalHtml + '\n</body>');
    console.log('✓ Added modal-edit-session-room to index.html');
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');

// ============================================================================
// Add Edit Room Logic and Button to app.js
// ============================================================================
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Add edit button next to room badge in renderScheduleList
const oldRoomBadge = `<span class="text-[10px] font-bold text-govNavy bg-white px-2 py-0.5 rounded-md border border-slate-300">
                                        <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i>\${s.room}
                                    </span>`;

const newRoomBadge = `<div class="flex items-center space-x-1">
                                        <span class="text-[10px] font-bold text-govNavy bg-white px-2 py-0.5 rounded-md border border-slate-300 shadow-2xs">
                                            <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i>\${s.room}
                                        </span>
                                        <button type="button" onclick="openEditRoomModal('\${s.id}')" class="text-[10px] text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 transition cursor-pointer font-bold flex items-center space-x-1" title="คลิกเพื่อแก้ไขห้องเรียน">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                            <span>ย้ายห้อง</span>
                                        </button>
                                    </div>`;

if (appJs.includes(oldRoomBadge)) {
    appJs = appJs.replace(oldRoomBadge, newRoomBadge);
    console.log('✓ Injected [ย้ายห้อง] button next to room badge in app.js');
}

// Add JS functions for Edit Room
const editRoomJsCode = `
/* ==========================================================================
   EDIT SESSION ROOM & NOTES CONTROLLER (On-the-Fly Customization)
   ========================================================================== */
function openEditRoomModal(sessionId) {
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
}

function onPresetRoomSelected(val) {
    const customInput = document.getElementById('edit-room-custom-input');
    if (!customInput) return;
    if (val && val !== 'CUSTOM') {
        customInput.value = val;
    }
}

function saveEditedSessionRoom() {
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
}

// Load persisted room overrides on startup
(function loadPersistedRoomOverrides() {
    try {
        const savedOverrides = JSON.parse(localStorage.getItem('civil_custom_sessions') || '{}');
        Object.keys(savedOverrides).forEach(id => {
            const s = master13DaysHubSessions.find(sess => sess.id === id);
            if (s) {
                if (savedOverrides[id].room) s.room = savedOverrides[id].room;
                if (savedOverrides[id].notes) s.notes = savedOverrides[id].notes;
            }
        });
    } catch (e) {
        console.warn('Could not load room overrides:', e);
    }
})();
`;

appJs += '\n' + editRoomJsCode + '\nwindow.openEditRoomModal = openEditRoomModal;\nwindow.onPresetRoomSelected = onPresetRoomSelected;\nwindow.saveEditedSessionRoom = saveEditedSessionRoom;\n';

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Injected Edit Room controller into app.js');
