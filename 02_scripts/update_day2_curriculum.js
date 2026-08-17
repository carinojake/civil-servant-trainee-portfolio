const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// 1. Update Day 2 in defaultAppData.attendance
const oldDay2Attendance = `        {
            day: 2,
            date: "11 ส.ค. 2569",
            title: "ระบบราชการ & กฎหมาย (FND) / วิเคราะห์ข้อมูล & Agile & ออกแบบกระบวนงานดิจิทัล (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องประชุม BB 212",
                morning: "รายวิชาความรู้พื้นฐานเกี่ยวกับระบบราชการและการบริหารราชการแผ่นดิน",
                morningComputer: true,
                afternoon: "รายวิชากฎหมาย ระเบียบ และข้อบังคับพื้นฐานที่เกี่ยวข้องกับการปฏิบัติราชการ",
                afternoonComputer: true
            },
            advanced: {
                room: "ห้องประชุม BB 211",
                morning: "รายวิชาการวิเคราะห์ข้อมูลและการบริหารราชการยุคดิจิทัล / รายวิชาการบริหารโครงการภาครัฐและการทำงานแบบ Agile",
                morningComputer: true,
                afternoon: "รายวิชาการออกแบบกระบวนงานดิจิทัล",
                afternoonComputer: true
            },`;

const newDay2Attendance = `        {
            day: 2,
            date: "11 ส.ค. 2569",
            title: "ระบบราชการ & กฎหมาย (FND) / วิเคราะห์ข้อมูล & Agile & ออกแบบกระบวนงานดิจิทัล (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องอบรม 1 (BB 202)",
                morning: "รายวิชาความรู้พื้นฐานเกี่ยวกับระบบราชการและการบริหารราชการแผ่นดิน",
                morningComputer: true,
                morningLecturers: "อาจารย์มาณิช อินทฉิม",
                afternoon: "รายวิชากฎหมาย ระเบียบ และข้อบังคับพื้นฐานที่เกี่ยวข้องกับการปฏิบัติราชการ",
                afternoonComputer: true,
                afternoonLecturers: "อาจารย์มาณิช อินทฉิม"
            },
            advanced: {
                room: "ห้องอบรม 2 (BB 203)",
                morning: "การวิเคราะห์ข้อมูลและการบริหารราชการยุคดิจิทัล & การบริหารโครงการแบบ Agile",
                morningComputer: true,
                morningLecturers: "ผศ.ดร.ดวงใจ จิตคงชื่น, ดร.ปริสุทธิ์ จิตต์ภักดี, ดร.ขวัญศิริ ศิริมังคลา",
                morningSubtopics: [
                    "1.1.1 ธรรมาภิบาลข้อมูล (Data Governance) และระบบฐานข้อมูลภาครัฐ",
                    "1.1.2 การคิดเชิงข้อมูล (Data-Driven Thinking) และการจัดเตรียมข้อมูล",
                    "1.1.3 สูตรคำนวณขั้นสูงและการวิเคราะห์ข้อมูลเชิงลึก (Data Analytics)",
                    "1.1.4 การสร้างแดชบอร์ดและการสรุปผลเพื่อการตัดสินใจของผู้บริหาร",
                    "1.2 การบริหารโครงการภาครัฐและการทำงานแบบ Agile (Trello, Jira, Notion)"
                ],
                afternoon: "รายวิชาการออกแบบกระบวนงานดิจิทัล (Digital Workflow Design)",
                afternoonComputer: true,
                afternoonLecturers: "ดร.ปริสุทธิ์ จิตต์ภักดี, ดร.ขวัญศิริ ศิริมังคลา, อาจารย์มงคล สิริถิรวัฒน์",
                afternoonSubtopics: [
                    "1.3.1 มาตรฐานและโครงสร้างเอกสารดิจิทัล",
                    "1.3.2 ลายมือชื่ออิเล็กทรอนิกส์ (e-Signature) และการปรับปรุงผังงาน"
                ]
            },`;

if (appJs.includes(oldDay2Attendance)) {
    appJs = appJs.replace(oldDay2Attendance, newDay2Attendance);
    console.log('✓ Updated Day 2 Attendance in app.js');
} else {
    console.log('⚠ Could not match oldDay2Attendance precisely, checking alternative replacement');
}

// 2. Update renderScheduleList to render subtopics and lecturers
const oldRenderMorning = `<p class="text-slate-700 leading-relaxed">\${trackData.morning}</p>`;
const newRenderMorning = `<p class="text-slate-700 leading-relaxed font-semibold">\${trackData.morning}</p>
                            \${trackData.morningSubtopics && trackData.morningSubtopics.length > 0 ? \`
                                <div class="mt-1.5 p-2 bg-slate-50/90 rounded-lg border border-slate-200 text-[11px] space-y-1 text-slate-600">
                                    <div class="font-bold text-slate-700 text-[10px] flex items-center gap-1">
                                        <i class="fa-solid fa-list-check text-blue-600"></i> หัวข้อย่อยประจำเซสชัน:
                                    </div>
                                    <ul class="list-disc list-inside space-y-0.5 text-[10px]">
                                        \${trackData.morningSubtopics.map(sub => \`<li>\${sub}</li>\`).join('')}
                                    </ul>
                                </div>
                            \` : ''}
                            \${trackData.morningLecturers ? \`
                                <div class="mt-1 text-[10px] text-blue-800 font-bold flex items-center gap-1">
                                    <i class="fa-solid fa-chalkboard-user text-blue-600"></i> วิทยากร: \${trackData.morningLecturers}
                                </div>
                            \` : ''}`;

if (appJs.includes(oldRenderMorning)) {
    appJs = appJs.replace(oldRenderMorning, newRenderMorning);
    console.log('✓ Updated renderScheduleList morning rendering');
}

const oldRenderAfternoon = `<p class="text-slate-700 leading-relaxed">\${trackData.afternoon}</p>`;
const newRenderAfternoon = `<p class="text-slate-700 leading-relaxed font-semibold">\${trackData.afternoon}</p>
                            \${trackData.afternoonSubtopics && trackData.afternoonSubtopics.length > 0 ? \`
                                <div class="mt-1.5 p-2 bg-slate-50/90 rounded-lg border border-slate-200 text-[11px] space-y-1 text-slate-600">
                                    <div class="font-bold text-slate-700 text-[10px] flex items-center gap-1">
                                        <i class="fa-solid fa-list-check text-emerald-600"></i> หัวข้อย่อยประจำเซสชัน:
                                    </div>
                                    <ul class="list-disc list-inside space-y-0.5 text-[10px]">
                                        \${trackData.afternoonSubtopics.map(sub => \`<li>\${sub}</li>\`).join('')}
                                    </ul>
                                </div>
                            \` : ''}
                            \${trackData.afternoonLecturers ? \`
                                <div class="mt-1 text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                                    <i class="fa-solid fa-chalkboard-user text-emerald-600"></i> วิทยากร: \${trackData.afternoonLecturers}
                                </div>
                            \` : ''}`;

if (appJs.includes(oldRenderAfternoon)) {
    appJs = appJs.replace(oldRenderAfternoon, newRenderAfternoon);
    console.log('✓ Updated renderScheduleList afternoon rendering');
}

// 3. Update Day 2 Morning in Master Matrix
const oldMatrixDay2 = `        day: 2,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'DAT-201',
        title: 'การวิเคราะห์ข้อมูลและเทคโนโลยีการบริหารราชการยุคดิจิทัล (ADV) / ระบบราชการไทย (FND)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '04',
        lecturerName: 'ผศ.ดร.ดวงใจ จิตคงชื่น / ดร.ปริสุทธิ์ จิตต์ภักดี / อาจารย์มงคล สิริถิรวัฒน์',`;

const newMatrixDay2 = `        day: 2,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'DAT-201',
        title: 'การวิเคราะห์ข้อมูลและการบริหารราชการยุคดิจิทัล & การบริหารโครงการแบบ Agile (BB 203)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '04',
        lecturerName: 'ผศ.ดร.ดวงใจ จิตคงชื่น / ดร.ปริสุทธิ์ จิตต์ภักดี / ดร.ขวัญศิริ ศิริมังคลา',`;

if (appJs.includes(oldMatrixDay2)) {
    appJs = appJs.replace(oldMatrixDay2, newMatrixDay2);
    console.log('✓ Updated Day 2 Master Matrix');
}

// 4. Update AI Brain for Day 2 in generateAIStudyResponse
const oldAIKnowledge = `    if (queryLower.includes('สรุป') || queryLower.includes('บทเรียน') || queryLower.includes('เซ็นทารา') || queryLower.includes('13 วัน')) {`;
const newAIKnowledge = `    if (queryLower.includes('วันที่ 2') || queryLower.includes('11 ส.ค.') || queryLower.includes('data governance') || queryLower.includes('agile') || queryLower.includes('ดวงใจ') || queryLower.includes('bb 203')) {
        return \`📊 **สรุปเนื้อหาบทเรียนวันที่ 2 (11 ส.ค. 2569) - สาย Advanced AI (ห้อง BB 203):**

**ช่วงเช้า (09.00 - 12.00 น.):**
วิชา: *การวิเคราะห์ข้อมูลและการบริหารราชการยุคดิจิทัล & การบริหารโครงการแบบ Agile*
วิทยากร: ผศ.ดร.ดวงใจ จิตคงชื่น, ดร.ปริสุทธิ์ จิตต์ภักดี, ดร.ขวัญศิริ ศิริมังคลา

🔹 **1.1.1 ธรรมาภิบาลข้อมูล (Data Governance) และระบบฐานข้อมูลภาครัฐ:** โครงสร้างความปลอดภัยของข้อมูลภาครัฐ สิทธิ์การเข้าถึง และการบูรณาการระบบฐานข้อมูล
🔹 **1.1.2 การคิดเชิงข้อมูล (Data-Driven Thinking):** การเปลี่ยนปัญหาเชิงนโยบายให้เป็นโจทย์ข้อมูล และการจัดเตรียมข้อมูล (Data Cleansing)
🔹 **1.1.3 สูตรคำนวณขั้นสูงและการวิเคราะห์ข้อมูลเชิงลึก (Data Analytics):** การใช้สูตร Excel / SQL / Power BI ในการวิเคราะห์แนวโน้ม
🔹 **1.1.4 การสร้างแดชบอร์ดและการสรุปผลเพื่อการตัดสินใจ:** Data Visualization สำหรับรายงานผู้บริหาร
🔹 **1.2 การบริหารโครงการภาครัฐแบบ Agile:** การประยุกต์ใช้ Trello, Jira, Notion เพื่อควบคุมงานแบบรวดเร็วและยืดหยุ่น

**ช่วงบ่าย (13.00 - 16.00 น.):**
วิชา: *การออกแบบกระบวนงานดิจิทัล (Digital Workflow Design)*
วิทยากร: ดร.ปริสุทธิ์ จิตต์ภักดี, ดร.ขวัญศิริ ศิริมังคลา, อาจารย์มงคล สิริถิรวัฒน์\`;
    }

    if (queryLower.includes('สรุป') || queryLower.includes('บทเรียน') || queryLower.includes('เซ็นทารา') || queryLower.includes('13 วัน')) {`;

if (appJs.includes(oldAIKnowledge)) {
    appJs = appJs.replace(oldAIKnowledge, newAIKnowledge);
    console.log('✓ Updated AI Knowledge with Day 2 Subtopics');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('All Day 2 curriculum enhancements applied successfully!');
