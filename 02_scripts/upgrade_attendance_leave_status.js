const fs = require('fs');
const path = require('path');

console.log('=== UPGRADING ATTENDANCE STATUS SELECTOR WITH MEDICAL LEAVE SUPPORT ===');

const baseDir = path.join(__dirname, '..');
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace toggleAttendanceStatus to cycle through 4 clean statuses
const newToggleFunc = `function toggleAttendanceStatus(dayNum) {
    const dayItem = appState.attendance.find(a => a.day === dayNum);
    if (!dayItem) return;

    if (dayItem.status === 'PRESENT') {
        dayItem.status = 'LEAVE';
        showToast(\`อัปเดตวันที่ \${dayNum}: ลาไปพบแพทย์ / ลาป่วย 🏥\`, 'warning');
    } else if (dayItem.status === 'LEAVE') {
        dayItem.status = 'ONLINE';
        showToast(\`อัปเดตวันที่ \${dayNum}: เรียนออนไลน์ 🌐\`, 'info');
    } else if (dayItem.status === 'ONLINE') {
        dayItem.status = 'ABSENT';
        showToast(\`อัปเดตวันที่ \${dayNum}: ยังไม่เช็กอิน\`, 'info');
    } else {
        dayItem.status = 'PRESENT';
        showToast(\`อัปเดตวันที่ \${dayNum}: เข้าเรียนแล้ว ✓\`, 'success');
    }

    saveState();
    renderScheduleList();
    renderKPIs();
}`;

appJs = appJs.replace(/function toggleAttendanceStatus\(dayNum\) \{[\s\S]*?renderScheduleList\(\);\s*showToast\([^)]+\);\s*\}/, newToggleFunc);

// Update status badge rendering in renderScheduleList for both HUB and CLASSIC views
const hubBadgeCode = `                        <div class="flex items-center space-x-2">
                            \${dayItem.status === 'PRESENT' ? \`
                                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <i class="fa-solid fa-check mr-1 text-emerald-600"></i> เข้าเรียนแล้ว
                                </span>
                            \` : dayItem.status === 'LEAVE' ? \`
                                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                    <i class="fa-solid fa-hospital-user mr-1 text-amber-600"></i> ลาไปพบแพทย์ / ลาป่วย
                                </span>
                            \` : dayItem.status === 'ONLINE' ? \`
                                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                                    <i class="fa-solid fa-laptop mr-1 text-blue-600"></i> เรียนออนไลน์
                                </span>
                            \` : \`
                                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                                    ยังไม่เช็กอิน
                                </span>
                            \`}
                            <button type="button" onclick="toggleAttendanceStatus(\${dayItem.day})" class="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer px-2 py-0.5 rounded-md hover:bg-blue-50 border border-blue-200 transition" title="คลิกเพื่อสลับสถานะ (เข้าเรียน / ลาไปหาหมอ / ออนไลน์ / ยังไม่เช็กอิน)">
                                <i class="fa-solid fa-repeat text-blue-500 mr-1"></i>สลับสถานะ
                            </button>
                        </div>`;

appJs = appJs.replace(/<div class="flex items-center space-x-2">\s*<span class="text-xs font-bold px-2\.5 py-0\.5 rounded-full \${isPresent \? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">[\s\S]*?<\/div>/, hubBadgeCode);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Successfully upgraded attendance status toggler with Medical Leave support!');
