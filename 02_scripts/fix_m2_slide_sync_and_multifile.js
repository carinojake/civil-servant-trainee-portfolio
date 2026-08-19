const fs = require('fs');
const path = require('path');

console.log('=== FIXING SLIDE LINK SYNC & MULTI-FILE SUPPORT IN M2 SCHEDULE ===');

const baseDir = path.join(__dirname, '..');

// 1. Update 01_data/lecturers_hub_data.json Day 7 Drive URL to exact 1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

hubData.learning_map.forEach(session => {
    if (session.date.includes('19 สิงหาคม') || session.date.includes('19 ส.ค.')) {
        session.file_url = 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI';
        if (session.id.includes('adv-m') || session.period.includes('เช้า')) {
            session.file_name = '19-8-69 ช่วงเช้า การบริหารคลังข้อมูลและแดชบอร์ด (สถิติแห่งชาติ).pdf';
        } else if (session.id.includes('adv-a') || session.period.includes('บ่าย')) {
            session.file_name = '19-8-69 ช่วงบ่าย เรื่อง งานสารบรรณและการร่างข้.pdf';
        }
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');

// 2. Update app.js
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Sync master13DaysHubSessions in app.js
const updatedSessionsJson = JSON.stringify(hubData.learning_map, null, 4);
const sessionsRegex = /const master13DaysHubSessions = \[[\s\S]*?\];/;
if (appJs.match(sessionsRegex)) {
    appJs = appJs.replace(sessionsRegex, `const master13DaysHubSessions = ${updatedSessionsJson};`);
    console.log('✓ Synchronized master13DaysHubSessions in app.js');
}

// Ensure default attendance for day 7 has the exact doc title and url
appJs = appJs.replace(/day:\s*7,\s*date:\s*["']19 ส\.ค\. 2569["'],[\s\S]*?reflection:/, (match) => {
    if (!match.includes('morningDocUrl')) {
        return match.replace('reflection:', 'morningDocUrl: "https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI",\n        morningDocTitle: "19-8-69 ช่วงเช้า การบริหารคลังข้อมูลและแดชบอร์ด (สถิติแห่งชาติ).pdf",\n        afternoonDocUrl: "https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI",\n        afternoonDocTitle: "19-8-69 ช่วงบ่าย เรื่อง งานสารบรรณและการร่างข้.pdf",\n        reflection:');
    }
    return match;
});

// Update renderScheduleList to dynamically use user-saved slide info & show in Action Hub
const oldSessionCardFileSection = `<div class="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 flex-wrap">
                                <div class="text-[11px] text-slate-600 truncate flex-1 min-w-[150px]" title="\${s.file_name}">
                                    📄 <strong>ไฟล์:</strong> \${s.file_name}
                                </div>
                                <a href="\${s.file_url}" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition flex items-center space-x-1 shrink-0">
                                    <i class="fa-brands fa-google-drive"></i>
                                    <span>เปิดไฟล์ Drive</span>
                                </a>
                            </div>`;

const newSessionCardFileSection = `\${(() => {
                                const isMorning = s.period.includes('เช้า') || s.id.includes('-m');
                                const customDocTitle = isMorning ? dayItem.morningDocTitle : dayItem.afternoonDocTitle;
                                const customDocUrl = isMorning ? dayItem.morningDocUrl : dayItem.afternoonDocUrl;
                                const effectiveFileName = customDocTitle || s.file_name || 'เอกสารประกอบการบรรยาย.pdf';
                                const effectiveFileUrl = customDocUrl || s.file_url || 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h';
                                
                                return \`
                                    <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 flex-wrap">
                                        <div class="text-[11px] text-slate-700 truncate flex-1 min-w-[150px]" title="\${effectiveFileName}">
                                            📄 <strong>ไฟล์:</strong> \${effectiveFileName}
                                        </div>
                                        <div class="flex items-center space-x-1 shrink-0">
                                            <a href="\${effectiveFileUrl}" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition flex items-center space-x-1">
                                                <i class="fa-brands fa-google-drive"></i>
                                                <span>เปิดไฟล์ Drive</span>
                                            </a>
                                        </div>
                                    </div>
                                \`;
                            })()}`;

if (appJs.includes(oldSessionCardFileSection)) {
    appJs = appJs.replace(oldSessionCardFileSection, newSessionCardFileSection);
    console.log('✓ Injected dynamic file name & URL resolution on session cards');
}

// Update Daily Action Hub to include Slide link badges
const oldActionHubGrid = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div class="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                            <span class="text-[11px] font-bold text-slate-700"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>ช่วงเช้า (Pre/Post-test):</span>
                            <div class="flex items-center space-x-1">
                                \${morningPreUrl ? \`<a href="\${morningPreUrl}" target="_blank" class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">Pre-test (\${morningPreScore !== undefined ? morningPreScore + 'ค.' : 'ทำ'})</a>\` : ''}
                                \${morningPostUrl ? \`<a href="\${morningPostUrl}" target="_blank" class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">Post-test (\${morningPostScore !== undefined ? morningPostScore + 'ค.' : 'ทำ'})</a>\` : ''}
                            </div>
                        </div>

                        <div class="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                            <span class="text-[11px] font-bold text-slate-700"><i class="fa-solid fa-cloud-sun text-emerald-500 mr-1"></i>ช่วงบ่าย (Pre/Post-test):</span>
                            <div class="flex items-center space-x-1">
                                \${afternoonPreUrl ? \`<a href="\${afternoonPreUrl}" target="_blank" class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">Pre-test (\${afternoonPreScore !== undefined ? afternoonPreScore + 'ค.' : 'ทำ'})</a>\` : ''}
                                \${afternoonPostUrl ? \`<a href="\${afternoonPostUrl}" target="_blank" class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">Post-test (\${afternoonPostScore !== undefined ? afternoonPostScore + 'ค.' : 'ทำ'})</a>\` : ''}
                            </div>
                        </div>
                    </div>`;

const newActionHubGrid = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div class="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                            <div class="flex items-center justify-between">
                                <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                                    <i class="fa-solid fa-sun text-amber-500"></i> ช่วงเช้า (09.00 - 12.00 น.)
                                </span>
                                <div class="flex items-center space-x-1">
                                    \${morningPreUrl ? \`<a href="\${morningPreUrl}" target="_blank" class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200 shadow-2xs hover:bg-blue-100 transition">Pre-test (\${morningPreScore !== undefined ? morningPreScore + 'ค.' : 'ทำ'})</a>\` : ''}
                                    \${morningPostUrl ? \`<a href="\${morningPostUrl}" target="_blank" class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 shadow-2xs hover:bg-emerald-100 transition">Post-test (\${morningPostScore !== undefined ? morningPostScore + 'ค.' : 'ทำ'})</a>\` : ''}
                                </div>
                            </div>
                            \${(dayItem.morningDocUrl || dayItem.morningDocTitle) ? \`
                                <div class="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                    <span class="text-slate-500 truncate max-w-[170px]" title="\${dayItem.morningDocTitle || 'สไลด์เช้า'}">
                                        📁 \${dayItem.morningDocTitle || 'สไลด์เช้า'}
                                    </span>
                                    <a href="\${dayItem.morningDocUrl || '#'}" target="_blank" class="text-emerald-700 font-bold hover:underline flex items-center gap-1 shrink-0">
                                        <i class="fa-brands fa-google-drive text-emerald-600"></i> เปิดสไลด์เช้า
                                    </a>
                                </div>
                            \` : ''}
                        </div>

                        <div class="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                            <div class="flex items-center justify-between">
                                <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                                    <i class="fa-solid fa-cloud-sun text-emerald-500"></i> ช่วงบ่าย (13.00 - 16.00 น.)
                                </span>
                                <div class="flex items-center space-x-1">
                                    \${afternoonPreUrl ? \`<a href="\${afternoonPreUrl}" target="_blank" class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200 shadow-2xs hover:bg-blue-100 transition">Pre-test (\${afternoonPreScore !== undefined ? afternoonPreScore + 'ค.' : 'ทำ'})</a>\` : ''}
                                    \${afternoonPostUrl ? \`<a href="\${afternoonPostUrl}" target="_blank" class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 shadow-2xs hover:bg-emerald-100 transition">Post-test (\${afternoonPostScore !== undefined ? afternoonPostScore + 'ค.' : 'ทำ'})</a>\` : ''}
                                </div>
                            </div>
                            \${(dayItem.afternoonDocUrl || dayItem.afternoonDocTitle) ? \`
                                <div class="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                    <span class="text-slate-500 truncate max-w-[170px]" title="\${dayItem.afternoonDocTitle || 'สไลด์บ่าย'}">
                                        📁 \${dayItem.afternoonDocTitle || 'สไลด์บ่าย'}
                                    </span>
                                    <a href="\${dayItem.afternoonDocUrl || '#'}" target="_blank" class="text-emerald-700 font-bold hover:underline flex items-center gap-1 shrink-0">
                                        <i class="fa-brands fa-google-drive text-emerald-600"></i> เปิดสไลด์บ่าย
                                    </a>
                                </div>
                            \` : ''}
                        </div>
                    </div>`;

if (appJs.includes(oldActionHubGrid)) {
    appJs = appJs.replace(oldActionHubGrid, newActionHubGrid);
    console.log('✓ Added dynamic Slide link display in Daily Action Hub');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ M2 Slide sync & Action Hub display upgrade complete!');
