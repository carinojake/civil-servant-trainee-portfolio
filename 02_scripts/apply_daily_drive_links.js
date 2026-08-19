const fs = require('fs');
const path = require('path');

console.log('=== APPLYING SPECIFIC GOOGLE DRIVE FOLDER URLS FOR DAYS 1 TO 5 & 7 ===');

const baseDir = path.join(__dirname, '..');

const dailyDriveMapping = {
    1: 'https://drive.google.com/drive/folders/1fd257IWGbfXw6caWmIlVTnYtqBzNGdkg', // 10 ส.ค. 2569
    2: 'https://drive.google.com/drive/folders/1QcQisBHyrBYWF3zVQ6WCxJVbOqlqDATn', // 11 ส.ค. 2569
    3: 'https://drive.google.com/drive/folders/1bVD5wtbeGsLQUVUxlWZItT95nckzhYxU', // 13 ส.ค. 2569
    4: 'https://drive.google.com/drive/folders/16Pr6akVs5ILWS2ImP4psQfgX1uFL0U1d', // 14 ส.ค. 2569
    5: 'https://drive.google.com/drive/folders/1czX-tPtKqs6xXln3VqOzjZIlboDo3Gp2', // 17 ส.ค. 2569
    7: 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI'  // 19 ส.ค. 2569
};

const dateToDayMap = {
    '10 สิงหาคม': 1, '10 ส.ค.': 1,
    '11 สิงหาคม': 2, '11 ส.ค.': 2,
    '13 สิงหาคม': 3, '13 ส.ค.': 3,
    '14 สิงหาคม': 4, '14 ส.ค.': 4,
    '17 สิงหาคม': 5, '17 ส.ค.': 5,
    '19 สิงหาคม': 7, '19 ส.ค.': 7
};

// 1. Update 01_data/lecturers_hub_data.json
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

hubData.learning_map.forEach(session => {
    for (const [dateStr, dayNum] of Object.entries(dateToDayMap)) {
        if (session.date.includes(dateStr)) {
            session.file_url = dailyDriveMapping[dayNum];
            break;
        }
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');
console.log('✓ Updated 01_data/lecturers_hub_data.json with daily Drive links');

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

// Update initial attendance default state in app.js for days 1 to 5
Object.entries(dailyDriveMapping).forEach(([dayNumStr, driveUrl]) => {
    const dayNum = parseInt(dayNumStr, 10);
    const dayRegex = new RegExp(`(\\{\\s*day:\\s*${dayNum},[\\s\\S]*?)(reflection:)`, 'm');
    appJs = appJs.replace(dayRegex, (match, p1, p2) => {
        let updatedBlock = p1;
        if (!updatedBlock.includes('morningDocUrl')) {
            updatedBlock += `morningDocUrl: "${driveUrl}",\n        `;
        } else {
            updatedBlock = updatedBlock.replace(/morningDocUrl:\s*"[^"]*"/, `morningDocUrl: "${driveUrl}"`);
        }
        if (!updatedBlock.includes('afternoonDocUrl')) {
            updatedBlock += `afternoonDocUrl: "${driveUrl}",\n        `;
        } else {
            updatedBlock = updatedBlock.replace(/afternoonDocUrl:\s*"[^"]*"/, `afternoonDocUrl: "${driveUrl}"`);
        }
        return updatedBlock + p2;
    });
});

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Successfully applied all specific daily Google Drive URLs into app.js!');
