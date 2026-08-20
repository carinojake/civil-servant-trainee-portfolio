const fs = require('fs');
const path = require('path');

console.log('=== UPDATING DAY 8 (20 ส.ค. 2569) ROOMS AND NOTES ===');

const baseDir = path.join(__dirname, '..');

// 1. Update 01_data/lecturers_hub_data.json
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

hubData.learning_map.forEach(session => {
    if (session.date.includes('20 สิงหาคม') || session.date.includes('20 ส.ค.')) {
        if (session.track === 'foundation' || session.id.includes('fnd')) {
            session.room = 'ห้อง BB 212 (ห้อง 1 - สายสีน้ำเงิน)';
            session.notes = '📢 ห้องอบรม 1: ใช้ห้อง 212 (ใช้ Computer Notebook และ Email ส่วนตัว) / ทานเบรคในห้อง / ทานอาหารกลางวันรวมกันที่ห้อง 210';
        } else {
            session.room = 'ห้อง BB 211 (ห้อง 2 - สายสีแดง)';
            session.notes = '📢 ห้องอบรม 2: ใช้ห้อง 211 (สายคล้องคอสีแดง) / ทานเบรคในห้อง / ทานอาหารกลางวันรวมกันที่ห้อง 210';
        }
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');
console.log('✓ Updated 01_data/lecturers_hub_data.json for Day 8 (20 ส.ค.)');

// 2. Update app.js
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Update master13DaysHubSessions
const updatedSessionsJson = JSON.stringify(hubData.learning_map, null, 4);
const sessionsRegex = /const master13DaysHubSessions = \[[\s\S]*?\];/;
if (appJs.match(sessionsRegex)) {
    appJs = appJs.replace(sessionsRegex, `const master13DaysHubSessions = ${updatedSessionsJson};`);
    console.log('✓ Synchronized master13DaysHubSessions in app.js');
}

// Update defaultAppData.attendance for Day 8
const day8AttendanceRegex = /(\{\s*day:\s*8,[\s\S]*?foundation:\s*\{[\s\S]*?room:\s*)"[^"]*"([\s\S]*?advanced:\s*\{[\s\S]*?room:\s*)"[^"]*"/;
if (appJs.match(day8AttendanceRegex)) {
    appJs = appJs.replace(day8AttendanceRegex, `$1"ห้อง BB 212 (ใช้ Notebook & อีเมลตนเอง)"$2"ห้อง BB 211 (ห้อง 2 - สายสีแดง)"`);
    console.log('✓ Updated Day 8 room definitions in defaultAppData.attendance');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Successfully updated Day 8 rooms in app.js!');
