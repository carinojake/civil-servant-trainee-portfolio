const fs = require('fs');
const path = require('path');

console.log('=== UPDATING ROOM ASSIGNMENT FOR 19 AUG (DAY 7) TO BB 211 & LUNCH BB 210 ===');

const baseDir = path.join(__dirname, '..');
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

// Update room for Day 7 (19 สิงหาคม 2569)
hubData.learning_map.forEach(session => {
    if (session.date.includes('19 สิงหาคม') || session.date.includes('19 ส.ค.')) {
        if (session.track === 'advanced' || session.id.includes('adv')) {
            session.room = 'ห้อง BB 211 (ห้อง 2 - สายสีแดง)';
            session.notes = '📢 ประกาศย้ายห้อง: ห้องอบรม 211 (ทานเบรคในห้อง / ทานอาหารกลางวันรวมกันที่ห้อง 210)';
        } else if (session.track === 'foundation' || session.id.includes('fnd')) {
            session.room = 'ห้อง BB 202 (ห้อง 1 - สายสีน้ำเงิน)';
            session.notes = '📢 ห้องอบรม 202 (ทานเบรคในห้อง / ทานอาหารกลางวันรวมกันที่ห้อง 210)';
        }
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');

// Synchronize into app.js
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const updatedSessionsJson = JSON.stringify(hubData.learning_map, null, 4);
const sessionsRegex = /const master13DaysHubSessions = \[[\s\S]*?\];/;
if (appJs.match(sessionsRegex)) {
    appJs = appJs.replace(sessionsRegex, `const master13DaysHubSessions = ${updatedSessionsJson};`);
    console.log('✓ Successfully synchronized room update into app.js');
}

// Update default attendance Day 7 room in app.js if present
appJs = appJs.replace(/date:\s*["']19 ส\.ค\. 2569["'],[\s\S]*?room:\s*["'][^"']+["']/, (match) => {
    return match.replace(/room:\s*["'][^"']+["']/, 'room: "ห้อง BB 211 (ห้อง 2 - ขั้นสูง)"');
});

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Room update complete!');
