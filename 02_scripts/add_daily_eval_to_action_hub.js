const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Target the actionHubHtml in renderScheduleList
const oldActionHubTarget = `                    <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 flex-wrap gap-2 text-xs">
                        <button type="button" onclick="openReflectionModal(\${dayItem.day})" class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition flex items-center space-x-1">
                            <i class="fa-solid fa-pen-nib"></i>
                            <span>✍️ บันทึกสะท้อนคิด (Reflection)</span>
                        </button>
                        <button type="button" onclick="askAILecturerTopics('\${dayItem.day}')" class="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition flex items-center space-x-1">
                            <i class="fa-solid fa-sparkles text-purple-600"></i>
                            <span>✨ AI สรุปบทเรียนวันนี้</span>
                        </button>
                    </div>
                </div>`;

const newActionHubTarget = `                    <!-- 3. Daily Course Evaluation (แบบประเมินผลประจำวัน) -->
                    <div class="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div class="flex items-center space-x-2 flex-wrap gap-1.5">
                            <i class="fa-solid fa-star text-amber-500 text-sm"></i>
                            <span class="font-bold text-amber-950 text-[11px]">3. แบบประเมินผลการอบรมประจำวัน (Daily Evaluation):</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full \${dayItem.evalSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
                                \${dayItem.evalSubmitted ? '✓ ประเมินเรียบร้อยแล้ว' : 'รอส่งแบบประเมิน'}
                            </span>
                        </div>
                        <div class="flex items-center space-x-1.5">
                            \${(dayItem.evalUrl && dayItem.evalUrl.trim().length > 5) ? \`
                                <a href="\${dayItem.evalUrl}" target="_blank" class="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-govNavy font-bold px-3 py-1 rounded-lg text-[11px] shadow-xs transition">
                                    <i class="fa-solid fa-paper-plane"></i>
                                    <span>ส่งแบบประเมิน (Google Form) ↗</span>
                                </a>
                            \` : \`
                                <button type="button" onclick="openDayLinksModal(\${dayItem.day})" class="text-slate-500 bg-white border border-dashed border-amber-300 hover:border-amber-500 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer">
                                    <i class="fa-solid fa-plus mr-1"></i>ใส่ลิงก์แบบประเมิน
                                </button>
                            \`}
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 flex-wrap gap-2 text-xs">
                        <button type="button" onclick="openReflectionModal(\${dayItem.day})" class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition flex items-center space-x-1">
                            <i class="fa-solid fa-pen-nib"></i>
                            <span>✍️ บันทึกสะท้อนคิด (Reflection)</span>
                        </button>
                        <button type="button" onclick="askAILecturerTopics('\${dayItem.day}')" class="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition flex items-center space-x-1">
                            <i class="fa-solid fa-sparkles text-purple-600"></i>
                            <span>✨ AI สรุปบทเรียนวันนี้</span>
                        </button>
                    </div>
                </div>`;

if (appJs.includes(oldActionHubTarget)) {
    appJs = appJs.replace(oldActionHubTarget, newActionHubTarget);
    console.log('✓ Successfully inserted 3. Daily Course Evaluation into actionHubHtml!');
} else {
    console.log('⚠ Could not find exact oldActionHubTarget');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('Daily Evaluation integration complete!');
