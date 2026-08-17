const fs = require('fs');
const path = require('path');

const hubData = JSON.parse(fs.readFileSync(path.join(__dirname, '../01_data/lecturers_hub_data.json'), 'utf8'));
const sessions = hubData.learning_map;

console.log('| วันที่ | วัน-เดือน-ปี | ช่วงเวลา | สายหลักสูตร | ห้อง | วิชาที่สอน | วิทยากรผู้สอน | สถานะไฟล์ |');
console.log('|---|---|---|---|---|---|---|---|');

sessions.forEach(s => {
    const lect = s.lecturers.length > 0 ? s.lecturers.join(', ') : 'คณะทำงานโครงการ';
    console.log(`| ${s.date} | ${s.period} | ${s.track_label} | ${s.room} | ${s.subject} | ${lect} | ${s.status_label} |`);
});
