const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// 1. Update renderLecturersDirectory to use getCombinedLecturersList()
const oldLecturerFilter = `    let filtered = masterLecturersList.filter(l => {`;
const newLecturerFilter = `    const combinedList = getCombinedLecturersList();
    let filtered = combinedList.filter(l => {`;

if (code.includes(oldLecturerFilter)) {
    code = code.replace(oldLecturerFilter, newLecturerFilter);
}

// 2. Add Edit/Delete button on Lecturer Card if admin/mentor or custom
const oldCardButtons = `                    <button type="button" onclick="openLecturerModal('\${l.id}')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer">
                        <i class="fa-solid fa-address-card"></i>
                        <span>ดูประวัติ & วิชาที่สอน</span>
                    </button>`;

const newCardButtons = `                    <div class="flex items-center space-x-2">
                        <button type="button" onclick="openLecturerModal('\${l.id}')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer">
                            <i class="fa-solid fa-address-card"></i>
                            <span>ดูประวัติ</span>
                        </button>
                        \${(currentAuthRole === 'mentor' || l.isCustom) ? \`
                        <button type="button" onclick="openAddLecturerModal('\${l.id}')" class="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center space-x-1 cursor-pointer" title="แก้ไขข้อมูลวิทยากร">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <span>แก้ไข</span>
                        </button>
                        \` : ''}
                    </div>`;

if (code.includes(oldCardButtons)) {
    code = code.replace(oldCardButtons, newCardButtons);
}

// 3. Append CRUD & File Management Engine and Window Bindings
const engineCode = `
/* ==========================================================================
   13. M9 CRUD ENGINE & SESSION FILE MANAGEMENT (ADMIN & AI ASSISTANT)
   ========================================================================== */
const CUSTOM_LECTURERS_STORAGE = 'civil_custom_lecturers_v1';
const CUSTOM_SESSION_FILES_STORAGE = 'civil_custom_session_files_v1';

function getCustomLecturers() {
    try {
        const raw = localStorage.getItem(CUSTOM_LECTURERS_STORAGE);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveCustomLecturers(list) {
    localStorage.setItem(CUSTOM_LECTURERS_STORAGE, JSON.stringify(list));
}

function getCombinedLecturersList() {
    const custom = getCustomLecturers();
    const masterIds = new Set(masterLecturersList.map(l => l.id));
    const customFiltered = custom.filter(c => !masterIds.has(c.id));
    return [...masterLecturersList, ...customFiltered];
}

function openAddLecturerModal(editId = null) {
    const modalTitle = document.getElementById('modal-lecturer-form-title');
    const idInput = document.getElementById('crud-lecturer-id');
    const nameInput = document.getElementById('crud-lecturer-name');
    const catSelect = document.getElementById('crud-lecturer-category');
    const posInput = document.getElementById('crud-lecturer-position');
    const agencyInput = document.getElementById('crud-lecturer-agency');
    const dayInput = document.getElementById('crud-lecturer-primary-day');
    const daysLabelInput = document.getElementById('crud-lecturer-days-label');
    const expInput = document.getElementById('crud-lecturer-expertise');
    const iconSelect = document.getElementById('crud-lecturer-icon');
    const badgeSelect = document.getElementById('crud-lecturer-badge');
    const btnDelete = document.getElementById('btn-crud-delete-lecturer');

    if (editId) {
        const list = getCombinedLecturersList();
        const item = list.find(l => l.id === editId);
        if (!item) return;
        if (modalTitle) modalTitle.innerText = \`แก้ไขข้อมูลวิทยากร (\${item.name})\`;
        if (idInput) idInput.value = item.id;
        if (nameInput) nameInput.value = item.name || '';
        if (catSelect) catSelect.value = item.category || 'AI & ดิจิทัล';
        if (posInput) posInput.value = item.position || '';
        if (agencyInput) agencyInput.value = item.agency || '';
        if (dayInput) dayInput.value = item.primaryDay || 1;
        if (daysLabelInput) daysLabelInput.value = item.daysLabel || \`วันที่ \${item.primaryDay}\`;
        if (expInput) expInput.value = item.expertise || '';
        if (iconSelect) iconSelect.value = item.icon || 'fa-user-tie';
        if (badgeSelect) badgeSelect.value = item.badgeColor || 'bg-purple-100 text-purple-800 border-purple-200';
        if (btnDelete) {
            const isMaster = masterLecturersList.some(m => m.id === editId);
            if (isMaster) {
                btnDelete.classList.add('hidden');
            } else {
                btnDelete.classList.remove('hidden');
            }
        }
    } else {
        if (modalTitle) modalTitle.innerText = 'เพิ่มวิทยากรท่านใหม่ในหลักสูตร';
        const list = getCombinedLecturersList();
        const maxNumericId = list.reduce((max, l) => {
            const n = parseInt(l.id, 10);
            return isNaN(n) ? max : Math.max(max, n);
        }, 17);
        const nextId = String(maxNumericId + 1).padStart(2, '0');
        if (idInput) idInput.value = nextId;
        if (nameInput) nameInput.value = '';
        if (catSelect) catSelect.value = 'AI & ดิจิทัล';
        if (posInput) posInput.value = '';
        if (agencyInput) agencyInput.value = '';
        if (dayInput) dayInput.value = 5;
        if (daysLabelInput) daysLabelInput.value = 'วันที่ 5';
        if (expInput) expInput.value = '';
        if (iconSelect) iconSelect.value = 'fa-robot';
        if (badgeSelect) badgeSelect.value = 'bg-purple-100 text-purple-800 border-purple-200';
        if (btnDelete) btnDelete.classList.add('hidden');
    }

    openModal('modal-add-lecturer');
}

function saveLecturerForm() {
    const id = document.getElementById('crud-lecturer-id')?.value || '';
    const name = document.getElementById('crud-lecturer-name')?.value.trim() || '';
    const category = document.getElementById('crud-lecturer-category')?.value || 'AI & ดิจิทัล';
    const position = document.getElementById('crud-lecturer-position')?.value.trim() || '-';
    const agency = document.getElementById('crud-lecturer-agency')?.value.trim() || '-';
    const primaryDay = parseInt(document.getElementById('crud-lecturer-primary-day')?.value, 10) || 1;
    const daysLabel = document.getElementById('crud-lecturer-days-label')?.value.trim() || \`วันที่ \${primaryDay}\`;
    const expertise = document.getElementById('crud-lecturer-expertise')?.value.trim() || '-';
    const icon = document.getElementById('crud-lecturer-icon')?.value || 'fa-user-tie';
    const badgeColor = document.getElementById('crud-lecturer-badge')?.value || 'bg-purple-100 text-purple-800 border-purple-200';

    if (!name) {
        showToast('กรุณาระบุชื่อ-นามสกุลวิทยากร');
        return;
    }

    const customList = getCustomLecturers();
    const existingIdx = customList.findIndex(l => l.id === id);

    const newObj = {
        id,
        name,
        category,
        position,
        agency,
        primaryDay,
        daysLabel,
        expertise,
        icon,
        badgeColor,
        isCustom: true
    };

    if (existingIdx >= 0) {
        customList[existingIdx] = newObj;
    } else {
        customList.push(newObj);
    }

    saveCustomLecturers(customList);
    closeModal('modal-add-lecturer');
    renderLecturersDirectory();
    updateM9TotalCount();
    showToast(\`✅ บันทึกข้อมูลวิทยากร: \${name} (ลำดับที่ \${id}) เรียบร้อยแล้ว\`);
}

function deleteCurrentCustomLecturer() {
    const id = document.getElementById('crud-lecturer-id')?.value || '';
    if (!id) return;
    if (!confirm(\`คุณต้องการลบวิทยากรลำดับที่ \${id} ใช่หรือไม่?\`)) return;

    let customList = getCustomLecturers();
    customList = customList.filter(l => l.id !== id);
    saveCustomLecturers(customList);
    closeModal('modal-add-lecturer');
    renderLecturersDirectory();
    updateM9TotalCount();
    showToast(\`🗑️ ลบวิทยากรลำดับที่ \${id} สำเร็จแล้ว\`);
}

function updateM9TotalCount() {
    const countEl = document.getElementById('m9-lecturers-total-count');
    if (countEl) {
        const total = getCombinedLecturersList().length;
        countEl.innerText = \`\${total} ท่าน (8 หมวด)\`;
    }
}

// Session Files Management
function getCustomSessionFiles() {
    try {
        const raw = localStorage.getItem(CUSTOM_SESSION_FILES_STORAGE);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function saveCustomSessionFiles(obj) {
    localStorage.setItem(CUSTOM_SESSION_FILES_STORAGE, JSON.stringify(obj));
}

function openManageSessionFilesModal(dayNum = 5) {
    const select = document.getElementById('manage-file-day-select');
    if (select) select.value = String(dayNum);
    renderManageFilesList(dayNum);
    openModal('modal-manage-session-files');
}

function onManageFileDayChange(dayVal) {
    renderManageFilesList(parseInt(dayVal, 10) || 1);
}

function renderManageFilesList(dayNum) {
    const container = document.getElementById('manage-files-list-container');
    const countBadge = document.getElementById('manage-files-current-count');
    if (!container) return;

    const matrixItems = masterCourseMatrixTraceability.filter(m => m.day === dayNum);
    const customMap = getCustomSessionFiles();
    const customFiles = customMap[dayNum] || [];

    const totalCount = matrixItems.length + customFiles.length;
    if (countBadge) countBadge.innerText = \`\${totalCount} ไฟล์\`;

    let html = '';

    matrixItems.forEach((m) => {
        const periodLabel = m.session === 'MORNING' ? 'เช้า' : (m.session === 'AFTERNOON' ? 'บ่าย' : 'ทั้งวัน');
        html += \`
            <div class="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                <div class="space-y-0.5 flex-1 min-w-0">
                    <div class="flex items-center space-x-1.5">
                        <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded">\${periodLabel}</span>
                        <span class="font-bold text-slate-800 truncate">\${m.fileTitle}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 truncate">\${m.title}</div>
                </div>
                <a href="\${m.fileDriveUrl}" target="_blank" class="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 hover:bg-emerald-100 flex items-center space-x-1 shrink-0">
                    <i class="fa-brands fa-google-drive"></i>
                    <span>เปิด</span>
                </a>
            </div>
        \`;
    });

    customFiles.forEach((f, idx) => {
        const periodLabel = f.session === 'MORNING' ? 'เช้า' : (f.session === 'AFTERNOON' ? 'บ่าย' : 'ทั้งวัน');
        html += \`
            <div class="p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-200 flex items-center justify-between gap-2">
                <div class="space-y-0.5 flex-1 min-w-0">
                    <div class="flex items-center space-x-1.5">
                        <span class="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">\${periodLabel}</span>
                        <span class="font-bold text-indigo-950 truncate">\${f.title}</span>
                        <span class="text-[9px] bg-amber-200 text-amber-900 font-bold px-1 rounded">เพิ่มเอง</span>
                    </div>
                    <div class="text-[10px] text-indigo-600 truncate">\${f.url}</div>
                </div>
                <div class="flex items-center space-x-1 shrink-0">
                    <a href="\${f.url}" target="_blank" class="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-700">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <button type="button" onclick="deleteCustomSessionFile(\${dayNum}, \${idx})" class="px-2 py-1 rounded bg-rose-100 text-rose-700 font-bold text-[10px] hover:bg-rose-200 cursor-pointer">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        \`;
    });

    container.innerHTML = html || \`<div class="text-slate-400 italic text-center p-3">ไม่มีรายการไฟล์สำหรับวันนี้</div>\`;
}

function submitAddSessionFile() {
    const daySelect = document.getElementById('manage-file-day-select');
    const dayNum = parseInt(daySelect ? daySelect.value : '5', 10) || 5;
    const session = document.getElementById('new-file-session')?.value || 'MORNING';
    const track = document.getElementById('new-file-track')?.value || 'BOTH';
    const title = document.getElementById('new-file-title')?.value.trim() || '';
    const url = document.getElementById('new-file-url')?.value.trim() || '';

    if (!title || !url) {
        showToast('กรุณากรอกชื่อไฟล์และลิงก์ Google Drive');
        return;
    }

    const map = getCustomSessionFiles();
    if (!map[dayNum]) map[dayNum] = [];
    map[dayNum].push({
        session,
        track,
        title,
        url,
        addedAt: new Date().toISOString()
    });
    saveCustomSessionFiles(map);

    const titleInput = document.getElementById('new-file-title');
    const urlInput = document.getElementById('new-file-url');
    if (titleInput) titleInput.value = '';
    if (urlInput) urlInput.value = '';

    renderManageFilesList(dayNum);
    renderCourseMatrixList();
    showToast(\`✅ เพิ่มไฟล์ "\${title}" ในวันที่ \${dayNum} เรียบร้อยแล้ว\`);
}

function deleteCustomSessionFile(dayNum, fileIndex) {
    const map = getCustomSessionFiles();
    if (map[dayNum] && map[dayNum][fileIndex]) {
        const removed = map[dayNum].splice(fileIndex, 1);
        saveCustomSessionFiles(map);
        renderManageFilesList(dayNum);
        renderCourseMatrixList();
        showToast(\`🗑️ ลบไฟล์ "\${removed[0]?.title || ''}" สำเร็จ\`);
    }
}

function updateAdminButtonsVisibility() {
    const isAdminOrMentor = currentAuthRole === 'mentor' || sessionStorage.getItem(AUTH_ROLE_KEY) === 'mentor';
    document.querySelectorAll('.admin-only-btn').forEach(el => {
        if (isAdminOrMentor) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

// Window Bindings
window.getCombinedLecturersList = getCombinedLecturersList;
window.openAddLecturerModal = openAddLecturerModal;
window.saveLecturerForm = saveLecturerForm;
window.deleteCurrentCustomLecturer = deleteCurrentCustomLecturer;
window.openManageSessionFilesModal = openManageSessionFilesModal;
window.onManageFileDayChange = onManageFileDayChange;
window.submitAddSessionFile = submitAddSessionFile;
window.deleteCustomSessionFile = deleteCustomSessionFile;
window.updateAdminButtonsVisibility = updateAdminButtonsVisibility;
`;

code += '\n' + engineCode;

// Update renderMentorStatusBanner to call updateAdminButtonsVisibility
const bannerCall = 'renderMentorStatusBanner();';
if (code.includes(bannerCall)) {
    code = code.replace(/renderMentorStatusBanner\(\);/g, 'renderMentorStatusBanner(); updateAdminButtonsVisibility();');
}

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('Successfully updated app.js with Lecturer CRUD and Session File Management engines!');
