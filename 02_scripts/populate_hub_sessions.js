const fs = require('fs');
const path = require('path');

// 1. Read lecturers_hub_data.json
const hubDataPath = path.join(__dirname, '../01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

// 2. Read app.js
const appJsPath = path.join(__dirname, '../app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Insert raw sessions data from lecturers_hub_data.json learning_map into app.js
const sessionsDataJson = JSON.stringify(hubData.learning_map, null, 2);

// Replace master13DaysHubSessions definition in app.js
const oldHubDefRegex = /const master13DaysHubSessions = [^;]+;/;
const newHubDef = `const master13DaysHubSessions = ${sessionsDataJson};`;

if (appJs.match(oldHubDefRegex)) {
    appJs = appJs.replace(oldHubDefRegex, newHubDef);
    console.log('✓ Successfully populated master13DaysHubSessions with all 30 sessions!');
} else {
    console.log('⚠ Could not match oldHubDefRegex in app.js');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('Hub sessions data injection complete!');
