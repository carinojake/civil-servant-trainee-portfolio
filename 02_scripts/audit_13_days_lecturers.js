const fs = require('fs');
const path = require('path');

const hubData = JSON.parse(fs.readFileSync(path.join(__dirname, '../01_data/lecturers_hub_data.json'), 'utf8'));
const sessions = hubData.learning_map;

console.log('=== AUDITING 13 DAYS SESSIONS & LECTURERS ===');
console.log('Total sessions in database:', sessions.length);

const grouped = {};
sessions.forEach(s => {
    if (!grouped[s.date]) grouped[s.date] = [];
    grouped[s.date].push(s);
});

const report = [];
Object.keys(grouped).forEach((dateStr, idx) => {
    const list = grouped[dateStr];
    console.log(`\n📅 วันที่ ${idx + 1}: ${dateStr} (${list.length} ช่วงการเรียนรู้)`);
    list.forEach(s => {
        const lect = s.lecturers && s.lecturers.length > 0 ? s.lecturers.join(', ') : '⚠️ รอตรวจสอบ';
        const subCount = s.subtopics ? s.subtopics.length : 0;
        console.log(`  • [${s.track_label}] ${s.period} | ${s.room}`);
        console.log(`    วิชา: ${s.subject}`);
        console.log(`    วิทยากร: ${lect}`);
        console.log(`    หัวข้อย่อย: ${subCount} ข้อ | ไฟล์: ${s.file_name}`);
    });
});
