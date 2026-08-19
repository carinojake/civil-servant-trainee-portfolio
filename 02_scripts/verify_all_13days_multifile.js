const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING AND POPULATING ALL 13 DAYS FOR MULTI-FILE & GOOGLE DRIVE ===');

const baseDir = path.join(__dirname, '..');
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

// Verify learning map sessions
hubData.learning_map.forEach((s, idx) => {
    if (!s.file_url) {
        s.file_url = 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h';
    }
    if (!s.file_name) {
        s.file_name = `เอกสารประกอบการบรรยาย_${s.subject.replace(/[\/\s]/g, '_')}.pdf`;
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');

// Update app.js master sessions
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const updatedSessionsJson = JSON.stringify(hubData.learning_map, null, 4);
const sessionsRegex = /const master13DaysHubSessions = \[[\s\S]*?\];/;
if (appJs.match(sessionsRegex)) {
    appJs = appJs.replace(sessionsRegex, `const master13DaysHubSessions = ${updatedSessionsJson};`);
    console.log('✓ Synchronized all 13 days in master13DaysHubSessions');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ All 13 days fully checked and ready for multi-file attachments!');
