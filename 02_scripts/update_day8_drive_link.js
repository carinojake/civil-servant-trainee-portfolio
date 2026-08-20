const fs = require('fs');
const path = require('path');

console.log('=== UPDATING DAY 8 (20 ส.ค. 2569) GOOGLE DRIVE URL ===');

const baseDir = path.join(__dirname, '..');
const day8DriveUrl = 'https://drive.google.com/drive/folders/1G11yDmsqXsiSQqXaK_VNeNhLahezLwOx';

// 1. Update 01_data/lecturers_hub_data.json
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

hubData.learning_map.forEach(session => {
    if (session.date.includes('20 สิงหาคม') || session.date.includes('20 ส.ค.')) {
        session.file_url = day8DriveUrl;
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');
console.log('✓ Updated 01_data/lecturers_hub_data.json with Day 8 Drive URL');

// 2. Update app.js
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Update dailyDriveUrls in loadSavedState
appJs = appJs.replace(
    /7:\s*'https:\/\/drive\.google\.com\/drive\/folders\/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI'/,
    `7: 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI',\n                    8: '${day8DriveUrl}'`
);

// Update defaultAppData.attendance for Day 8
const day8SearchPattern = /(\{\s*day:\s*8,[\s\S]*?docUrl:\s*)"[^"]*"/;
if (appJs.match(day8SearchPattern)) {
    appJs = appJs.replace(day8SearchPattern, `$1"${day8DriveUrl}"`);
}

// Update morningDocUrl & afternoonDocUrl for Day 8 in defaultAppData if present or inject them
const day8AttendanceFullRegex = /\{\s*day:\s*8,[\s\S]*?title:\s*"[^"]*",[\s\S]*?status:\s*"PRESENT"[\s\S]*?docUrl:\s*"[^"]*",[\s\S]*?evalSubmitted:\s*true\s*\}/;
const day8Match = appJs.match(day8AttendanceFullRegex);
if (day8Match) {
    const originalBlock = day8Match[0];
    let updatedBlock = originalBlock;
    
    if (!updatedBlock.includes('morningDocUrl:')) {
        updatedBlock = updatedBlock.replace(
            /docUrl:\s*"[^"]*",/,
            `morningDocTitle: "เอกสารบรรยาย_3.5_ทักษะของผู้นำด้านความคิดและการประสานงาน_KMUTT.pdf",\n            morningDocUrl: "${day8DriveUrl}",\n            afternoonDocTitle: "เอกสารบรรยาย_4.1_จิตวิทยาการบริการขั้นสูงและการจัดการอารมณ์.pdf",\n            afternoonDocUrl: "${day8DriveUrl}",\n            morningFiles: [\n                {\n                    title: "เอกสารบรรยาย_3.5_ทักษะของผู้นำด้านความคิดและการประสานงาน_KMUTT.pdf",\n                    url: "${day8DriveUrl}"\n                }\n            ],\n            afternoonFiles: [\n                {\n                    title: "เอกสารบรรยาย_4.1_จิตวิทยาการบริการขั้นสูงและการจัดการอารมณ์.pdf",\n                    url: "${day8DriveUrl}"\n                }\n            ],\n            docUrl: "${day8DriveUrl}",`
        );
    } else {
        updatedBlock = updatedBlock.replace(/morningDocUrl:\s*"[^"]*"/, `morningDocUrl: "${day8DriveUrl}"`);
        updatedBlock = updatedBlock.replace(/afternoonDocUrl:\s*"[^"]*"/, `afternoonDocUrl: "${day8DriveUrl}"`);
        updatedBlock = updatedBlock.replace(/docUrl:\s*"[^"]*"/, `docUrl: "${day8DriveUrl}"`);
    }
    
    appJs = appJs.replace(originalBlock, updatedBlock);
    console.log('✓ Updated Day 8 attendance object in app.js');
}

// Synchronize master13DaysHubSessions in app.js
const updatedSessionsJson = JSON.stringify(hubData.learning_map, null, 4);
const sessionsRegex = /const master13DaysHubSessions = \[[\s\S]*?\];/;
if (appJs.match(sessionsRegex)) {
    appJs = appJs.replace(sessionsRegex, `const master13DaysHubSessions = ${updatedSessionsJson};`);
    console.log('✓ Synchronized master13DaysHubSessions in app.js');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Successfully updated app.js with Day 8 Drive link!');
