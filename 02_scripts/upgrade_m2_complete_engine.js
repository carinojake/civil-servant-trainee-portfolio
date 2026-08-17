const fs = require('fs');
const path = require('path');

// 1. Read hub data
const hubData = JSON.parse(fs.readFileSync(path.join(__dirname, '../01_data/lecturers_hub_data.json'), 'utf8'));
const learningMapJson = JSON.stringify(hubData.learning_map, null, 2);

// 2. Read app.js
const appJsPath = path.join(__dirname, '../app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Define the comprehensive renderScheduleList function
const newRenderScheduleList = `function renderScheduleList() {
    const container = document.getElementById('schedule-days-container');
    if (!container) return;

    // Update M2 View Mode toggle button active styles
    const btnHub = document.getElementById('btn-m2-view-hub');
    const btnClassic = document.getElementById('btn-m2-view-classic');
    const btnTree = document.getElementById('btn-m2-view-tree');

    [btnHub, btnClassic, btnTree].forEach(b => {
        if (!b) return;
        b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition text-slate-600 hover:text-slate-900 cursor-pointer flex items-center space-x-1';
    });

    if (activeM2ViewMode === 'HUB' && btnHub) {
        btnHub.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-govNavy text-white shadow-xs cursor-pointer flex items-center space-x-1';
    } else if (activeM2ViewMode === 'CLASSIC' && btnClassic) {
        btnClassic.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-govNavy text-white shadow-xs cursor-pointer flex items-center space-x-1';
    } else if (activeM2ViewMode === 'TREE' && btnTree) {
        btnTree.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-govNavy text-white shadow-xs cursor-pointer flex items-center space-x-1';
    }

    // 1. If in TREE Mode, render visual Drive Tree
    if (activeM2ViewMode === 'TREE') {
        renderM2DriveTreeView(container, appState.attendance);
        return;
    }

    const userTrack = appState.userProfile.track || 'ADV';
    const effectiveFilter = activeScheduleFilter === 'AUTO' ? userTrack : activeScheduleFilter;

    // Map day 1-13 to day of month in August
    const dayToDateMap = {
        1: '10', 2: '11', 3: '13', 4: '14', 5: '17', 
        6: '18', 7: '19', 8: '20', 9: '24', 10: '25', 
        11: '26', 12: '27', 13: '28'
    };

    // 2. If in HUB Mode (Rich Lecturer Hub Cards - Default)
    if (activeM2ViewMode === 'HUB') {
        container.innerHTML = appState.attendance.map(dayItem => {
            const isPresent = dayItem.status === 'PRESENT' || dayItem.status === 'ONLINE';
            const targetDatePrefix = dayToDateMap[dayItem.day] || String(dayItem.day);

            // Find matching sessions from master13DaysHubSessions
            let matchingSessions = master13DaysHubSessions.filter(s => {
                return s.date.startsWith(targetDatePrefix + ' ') || 
                       s.date.includes(targetDatePrefix + ' สิงหาคม') || 
                       s.date.includes(targetDatePrefix + ' ส.ค.');
            });

            // Filter sessions by effectiveFilter (ADV / FND / BOTH)
            if (effectiveFilter === 'ADV') {
                matchingSessions = matchingSessions.filter(s => s.track === 'advanced' || s.track === 'joint');
            } else if (effectiveFilter === 'FND') {
                matchingSessions = matchingSessions.filter(s => s.track === 'foundation' || s.track === 'joint');
            }

            const sessionsCountLabel = matchingSessions.length > 0 ? \`\${matchingSessions.length} ช่วงการเรียนรู้\` : '2 ช่วงการเรียนรู้';
            const isDual = matchingSessions.length > 1;

            let sessionsGridHtml = '';

            if (matchingSessions.length > 0) {
                sessionsGridHtml = \`
                    <div class="grid grid-cols-1 \${isDual ? 'lg:grid-cols-2' : ''} gap-3 pt-1">
                \`;

                matchingSessions.forEach(s => {
                    const isAdv = s.track === 'advanced';
                    const isFnd = s.track === 'foundation';
                    const cardBorderBg = isAdv ? 'bg-blue-50/70 border-blue-200' : isFnd ? 'bg-emerald-50/70 border-emerald-200' : 'bg-indigo-50/70 border-indigo-200';
                    const trackBadgeBg = isAdv ? 'bg-blue-600 text-white' : isFnd ? 'bg-emerald-600 text-white' : 'bg-govNavy text-white';

                    const subtopicsHtml = (s.subtopics && s.subtopics.length > 0) ? \`
                        <ul class="space-y-1 text-[11px] text-slate-600 bg-white/90 p-2.5 rounded-lg border border-slate-200">
                            \${s.subtopics.map(sub => \`<li class="flex items-start gap-1.5"><span class="text-blue-500 font-bold">•</span><span>\${sub}</span></li>\`).join('')}
                        </ul>
                    \` : '';

                    const lecturersDisplay = s.lecturers && s.lecturers.length > 0
                        ? s.lecturers.map(name => \`<span class="font-bold text-slate-800 hover:text-blue-700 cursor-pointer" onclick="switchTab('m9'); filterLecturersBySearch();">\${name}</span>\`).join(', ')
                        : '<span class="text-slate-400 italic">คณะทำงานโครงการ</span>';

                    sessionsGridHtml += \`
                        <div class="p-3.5 rounded-xl border \${cardBorderBg} shadow-2xs space-y-2.5 flex flex-col justify-between">
                            <div class="space-y-2">
                                <div class="flex items-center justify-between flex-wrap gap-1.5">
                                    <div class="flex items-center space-x-1.5">
                                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full \${trackBadgeBg}">\${s.track_label}</span>
                                        <span class="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">\${s.period}</span>
                                    </div>
                                    <span class="text-[10px] font-bold text-govNavy bg-white px-2 py-0.5 rounded-md border border-slate-300">
                                        <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i>\${s.room}
                                    </span>
                                </div>

                                <h4 class="font-bold text-govNavy text-sm leading-snug">\${s.subject}</h4>

                                \${subtopicsHtml}

                                <div class="p-2 bg-white/80 rounded-lg border border-slate-200/80 text-[11px]">
                                    <div class="text-[10px] font-bold text-slate-500 mb-0.5 flex items-center gap-1">
                                        <i class="fa-solid fa-chalkboard-user text-blue-600"></i> อาจารย์ผู้สอน / วิทยากร:
                                    </div>
                                    <div class="text-xs">\${lecturersDisplay}</div>
                                </div>
                            </div>

                            <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 flex-wrap">
                                <div class="text-[11px] text-slate-600 truncate flex-1 min-w-[150px]" title="\${s.file_name}">
                                    📄 <strong>ไฟล์:</strong> \${s.file_name}
                                </div>
                                <a href="\${s.file_url}" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition flex items-center space-x-1 shrink-0">
                                    <i class="fa-brands fa-google-drive"></i>
                                    <span>เปิดไฟล์ Drive</span>
                                </a>
                            </div>
                        </div>
                    \`;
                });

                sessionsGridHtml += \`</div>\`;
            } else {
                sessionsGridHtml = \`
                    <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                        \${dayItem.title}
                    </div>
                \`;
            }

            // Morning & Afternoon Action Hub items
            const morningPreUrl = dayItem.morningPreTestUrl || dayItem.preTestUrl;
            const morningPreScore = dayItem.morningPreTestScore !== undefined ? dayItem.morningPreTestScore : dayItem.preTestScore;
            const morningPostUrl = dayItem.morningPostTestUrl;
            const morningPostScore = dayItem.morningPostTestScore;
            const afternoonPreUrl = dayItem.afternoonPreTestUrl;
            const afternoonPreScore = dayItem.afternoonPreTestScore;
            const afternoonPostUrl = dayItem.afternoonPostTestUrl || dayItem.postTestUrl;
            const afternoonPostScore = dayItem.afternoonPostTestScore !== undefined ? dayItem.afternoonPostTestScore : dayItem.postTestScore;

            const actionHubHtml = \`
                <div class="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2.5 mt-2">
                    <div class="flex justify-between items-center flex-wrap gap-2">
                        <span class="text-[11px] font-bold text-slate-800 flex items-center space-x-1.5">
                            <i class="fa-solid fa-bolt text-amber-500"></i>
                            <span>ศูนย์รวมกิจกรรมประจำวัน (Daily Action Hub: เช้า & บ่าย)</span>
                        </span>
                        <div class="flex items-center space-x-2">
                            <button type="button" onclick="openGeminiSpark(\${dayItem.day})" class="text-[11px] bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer transition">
                                <i class="fa-solid fa-wand-magic-sparkles text-amber-200"></i>
                                <span>Gemini Spark สรุปด่วน</span>
                            </button>
                            <button type="button" onclick="openDayLinksModal(\${dayItem.day})" class="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1">
                                <i class="fa-solid fa-pen-to-square"></i>
                                <span>จัดการลิงก์ & คะแนน</span>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
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
                </div>
            \`;

            return \`
                <div class="app-card p-5 border-l-4 \${isPresent ? 'border-emerald-500' : 'border-slate-300'} space-y-3">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/80 pb-2.5">
                        <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span class="bg-govNavy text-amber-400 font-bold text-xs px-2.5 py-0.5 rounded-md">กำหนดการ</span>
                            <h3 class="text-base font-bold text-govNavy">\${dayItem.date} (วันที่ \${dayItem.day})</h3>
                            <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">\${sessionsCountLabel}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full \${isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                                \${isPresent ? '✓ เข้าเรียนแล้ว' : 'ยังไม่เช็กอิน'}
                            </span>
                            <button type="button" onclick="toggleAttendanceStatus(\${dayItem.day})" class="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
                                สลับสถานะ
                            </button>
                        </div>
                    </div>

                    \${sessionsGridHtml}
                    \${actionHubHtml}

                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-2">
                        <div>
                            <strong class="text-slate-700 font-semibold"><i class="fa-solid fa-lightbulb text-amber-500 mr-1.5"></i>สรุปการเรียนรู้ (Reflection):</strong>
                            <p class="text-slate-600 mt-0.5 leading-relaxed">\${dayItem.reflection || '<span class="text-slate-400 italic">ยังไม่มีการบันทึกสรุป</span>'}</p>
                        </div>
                        \${dayItem.actionPlan ? \`
                        <div class="border-t border-slate-200 pt-1.5">
                            <strong class="text-slate-700 font-semibold"><i class="fa-solid fa-arrow-right-to-bracket text-emerald-500 mr-1.5"></i>สิ่งที่นำไปปรับใช้:</strong>
                            <p class="text-slate-600 mt-0.5">\${dayItem.actionPlan}</p>
                        </div>\` : ''}
                    </div>
                </div>
            \`;
        }).join('');

        return;
    }

    // 3. If in CLASSIC Mode (Original Accordion / Compact List)
    container.innerHTML = appState.attendance.map(dayItem => {
        const isPresent = dayItem.status === 'PRESENT' || dayItem.status === 'ONLINE';
        const isCombined = dayItem.isCombined;

        let sessionHtml = '';

        if (isCombined) {
            sessionHtml = \`
                <div class="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                    <div class="flex justify-between items-center flex-wrap gap-2">
                        <span class="bg-govNavy text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <i class="fa-solid fa-users mr-1"></i> รวมทุกหลักสูตร (40 คน)
                        </span>
                        <span class="bg-white border border-slate-300 text-govNavy text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i> \${dayItem.room || 'ห้องประชุมเซ็นทารา'}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-blue-900"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>ช่วงเช้า (09.30 - 12.00 น.)</strong>
                                \${dayItem.morningComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">\${dayItem.morning}</p>
                        </div>
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-emerald-900"><i class="fa-solid fa-cloud-sun text-emerald-500 mr-1"></i>ช่วงบ่าย (13.30 - 16.00 น.)</strong>
                                \${dayItem.afternoonComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">\${dayItem.afternoon}</p>
                        </div>
                    </div>
                </div>
            \`;
        } else if (effectiveFilter === 'BOTH') {
            const fnd = dayItem.foundation;
            const adv = dayItem.advanced;
            sessionHtml = \`
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div class="p-3 bg-blue-50/80 rounded-xl border border-blue-300 space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                <i class="fa-solid fa-laptop-code mr-1"></i> สาย Advanced AI
                            </span>
                            <span class="bg-white border border-blue-200 text-blue-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i> \${adv.room}
                            </span>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-blue-900 font-bold mb-0.5">
                                    <span>ช่วงเช้า (09.30 - 12.00 น.)</span>
                                    \${adv.morningComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">\${adv.morning}</p>
                            </div>
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-emerald-900 font-bold mb-0.5">
                                    <span>ช่วงบ่าย (13.30 - 16.00 น.)</span>
                                    \${adv.afternoonComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">\${adv.afternoon}</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 bg-emerald-50/80 rounded-xl border border-emerald-300 space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                <i class="fa-solid fa-book-open mr-1"></i> สาย Foundation
                            </span>
                            <span class="bg-white border border-emerald-200 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i> \${fnd.room}
                            </span>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-blue-900 font-bold mb-0.5">
                                    <span>ช่วงเช้า (09.30 - 12.00 น.)</span>
                                    \${fnd.morningComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">\${fnd.morning}</p>
                            </div>
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-emerald-900 font-bold mb-0.5">
                                    <span>ช่วงบ่าย (13.30 - 16.00 น.)</span>
                                    \${fnd.afternoonComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">\${fnd.afternoon}</p>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        } else {
            const trackData = (effectiveFilter === 'FND') ? dayItem.foundation : dayItem.advanced;
            const isAdv = effectiveFilter === 'ADV';
            sessionHtml = \`
                <div class="p-3 \${isAdv ? 'bg-blue-50/70 border-blue-200' : 'bg-emerald-50/70 border-emerald-200'} rounded-xl border space-y-2">
                    <div class="flex justify-between items-center flex-wrap gap-2">
                        <span class="\${isAdv ? 'bg-blue-600' : 'bg-emerald-600'} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <i class="fa-solid \${isAdv ? 'fa-laptop-code' : 'fa-book-open'} mr-1"></i> หลักสูตร\${isAdv ? 'ขั้นสูง (Advanced Course)' : 'ขั้นพื้นฐาน (Foundation Course)'}
                        </span>
                        <span class="bg-white border border-slate-300 text-govNavy text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i> \${trackData.room}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-blue-900"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>ช่วงเช้า (09.30 - 12.00 น.)</strong>
                                \${trackData.morningComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed font-semibold">\${trackData.morning}</p>
                        </div>
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-emerald-900"><i class="fa-solid fa-cloud-sun text-emerald-500 mr-1"></i>ช่วงบ่าย (13.30 - 16.00 น.)</strong>
                                \${trackData.afternoonComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed font-semibold">\${trackData.afternoon}</p>
                        </div>
                    </div>
                </div>
            \`;
        }

        return \`
            <div class="app-card p-4 border-l-4 \${isPresent ? 'border-emerald-500' : 'border-slate-300'} space-y-3">
                <div class="flex justify-between items-center">
                    <div class="font-bold text-govNavy text-sm">
                        วันที่ \${dayItem.day}: \${dayItem.date}
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs font-bold px-2 py-0.5 rounded \${isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                            \${isPresent ? '✓ เข้าเรียน' : 'ยังไม่เช็กอิน'}
                        </span>
                    </div>
                </div>
                \${sessionHtml}
            </div>
        \`;
    }).join('');
}`;

// Find the position of function renderScheduleList() at line 1753
const targetStart = appJs.indexOf('function renderScheduleList() {');
const targetEnd = appJs.indexOf('function toggleAttendanceStatus(dayNum) {');

if (targetStart !== -1 && targetEnd !== -1) {
    appJs = appJs.substring(0, targetStart) + newRenderScheduleList + '\n\n' + appJs.substring(targetEnd);
    console.log('✓ Successfully spliced new renderScheduleList into app.js!');
} else {
    console.log('⚠ Could not find targetStart or targetEnd for splicing');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('M2 Schedule Engine upgrade script complete!');
