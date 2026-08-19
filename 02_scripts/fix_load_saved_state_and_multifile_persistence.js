const fs = require('fs');
const path = require('path');

console.log('=== FIXING LOAD SAVED STATE TO PRESERVE MULTI-FILE AND DRIVE URLS ===');

const baseDir = path.join(__dirname, '..');
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const dailyDriveMapping = {
    1: 'https://drive.google.com/drive/folders/1fd257IWGbfXw6caWmIlVTnYtqBzNGdkg', // 10 ส.ค.
    2: 'https://drive.google.com/drive/folders/1QcQisBHyrBYWF3zVQ6WCxJVbOqlqDATn', // 11 ส.ค.
    3: 'https://drive.google.com/drive/folders/1bVD5wtbeGsLQUVUxlWZItT95nckzhYxU', // 13 ส.ค.
    4: 'https://drive.google.com/drive/folders/16Pr6akVs5ILWS2ImP4psQfgX1uFL0U1d', // 14 ส.ค.
    5: 'https://drive.google.com/drive/folders/1czX-tPtKqs6xXln3VqOzjZIlboDo3Gp2', // 17 ส.ค.
    7: 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI'  // 19 ส.ค.
};

// Target the exact loadSavedState attendance mapper
const oldAttendanceMappingRegex = /if \(parsed\.attendance && parsed\.attendance\.length === 13\) \{[\s\S]*?appState\.attendance = defaultAppData\.attendance\.map\(\(defDay, idx\) => \{[\s\S]*?return \{[\s\S]*?\};\s*\}\);\s*\}/;

const newAttendanceMappingCode = `if (parsed.attendance && parsed.attendance.length === 13) {
                const dailyDriveUrls = {
                    1: 'https://drive.google.com/drive/folders/1fd257IWGbfXw6caWmIlVTnYtqBzNGdkg',
                    2: 'https://drive.google.com/drive/folders/1QcQisBHyrBYWF3zVQ6WCxJVbOqlqDATn',
                    3: 'https://drive.google.com/drive/folders/1bVD5wtbeGsLQUVUxlWZItT95nckzhYxU',
                    4: 'https://drive.google.com/drive/folders/16Pr6akVs5ILWS2ImP4psQfgX1uFL0U1d',
                    5: 'https://drive.google.com/drive/folders/1czX-tPtKqs6xXln3VqOzjZIlboDo3Gp2',
                    7: 'https://drive.google.com/drive/folders/1Y_krySxHGiwvRFK_2x0bZ3utqtdl5TzI'
                };

                appState.attendance = defaultAppData.attendance.map((defDay, idx) => {
                    const saved = parsed.attendance[idx];
                    const dayNum = defDay.day;
                    const defaultDayDrive = dailyDriveUrls[dayNum] || 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h';

                    const mDocUrl = saved?.morningDocUrl || defDay.morningDocUrl || defaultDayDrive;
                    const mDocTitle = saved?.morningDocTitle || defDay.morningDocTitle || '';
                    const aDocUrl = saved?.afternoonDocUrl || defDay.afternoonDocUrl || defaultDayDrive;
                    const aDocTitle = saved?.afternoonDocTitle || defDay.afternoonDocTitle || '';

                    // Construct or preserve morningFiles (1, 2, 3, 4...)
                    let morningFiles = (saved?.morningFiles && saved.morningFiles.length > 0) ? saved.morningFiles : [];
                    if (morningFiles.length === 0 && (mDocTitle || mDocUrl)) {
                        morningFiles = [{ title: mDocTitle || 'เอกสารบรรยายช่วงเช้า.pdf', url: mDocUrl }];
                    }

                    // Construct or preserve afternoonFiles (1, 2, 3, 4...)
                    let afternoonFiles = (saved?.afternoonFiles && saved.afternoonFiles.length > 0) ? saved.afternoonFiles : [];
                    if (afternoonFiles.length === 0 && (aDocTitle || aDocUrl)) {
                        afternoonFiles = [{ title: aDocTitle || 'เอกสารบรรยายช่วงบ่าย.pdf', url: aDocUrl }];
                    }

                    return {
                        ...defDay,
                        status: saved?.status || defDay.status,
                        reflection: saved?.reflection || defDay.reflection,
                        actionPlan: saved?.actionPlan || defDay.actionPlan,

                        // Morning Hub
                        morningPreTestUrl: saved?.morningPreTestUrl || defDay.morningPreTestUrl || saved?.preTestUrl || defDay.preTestUrl || '',
                        morningPreTestScore: saved?.morningPreTestScore !== undefined ? saved.morningPreTestScore : (saved?.preTestScore !== undefined ? saved.preTestScore : defDay.preTestScore),
                        morningPreTestMax: saved?.morningPreTestMax || defDay.morningPreTestMax || saved?.preTestMax || 10,
                        morningPostTestUrl: saved?.morningPostTestUrl || defDay.morningPostTestUrl || '',
                        morningPostTestScore: saved?.morningPostTestScore !== undefined ? saved.morningPostTestScore : defDay.morningPostTestScore,
                        morningPostTestMax: saved?.morningPostTestMax || defDay.morningPostTestMax || 10,
                        morningDocUrl: mDocUrl,
                        morningDocTitle: mDocTitle,
                        morningFiles: morningFiles,

                        // Afternoon Hub
                        afternoonPreTestUrl: saved?.afternoonPreTestUrl || defDay.afternoonPreTestUrl || '',
                        afternoonPreTestScore: saved?.afternoonPreTestScore !== undefined ? saved.afternoonPreTestScore : defDay.afternoonPreTestScore,
                        afternoonPreTestMax: saved?.afternoonPreTestMax || defDay.afternoonPreTestMax || 10,
                        afternoonPostTestUrl: saved?.afternoonPostTestUrl || defDay.afternoonPostTestUrl || saved?.postTestUrl || defDay.postTestUrl || '',
                        afternoonPostTestScore: saved?.afternoonPostTestScore !== undefined ? saved.afternoonPostTestScore : (saved?.postTestScore !== undefined ? saved.postTestScore : defDay.postTestScore),
                        afternoonPostTestMax: saved?.afternoonPostTestMax || defDay.afternoonPostTestMax || saved?.postTestMax || 10,
                        afternoonDocUrl: aDocUrl,
                        afternoonDocTitle: aDocTitle,
                        afternoonFiles: afternoonFiles,

                        // Compatibility & Evaluation
                        preTestUrl: saved?.preTestUrl || defDay.preTestUrl,
                        preTestScore: saved?.preTestScore !== undefined ? saved.preTestScore : defDay.preTestScore,
                        preTestMax: saved?.preTestMax || defDay.preTestMax,
                        postTestUrl: saved?.postTestUrl || defDay.postTestUrl,
                        postTestScore: saved?.postTestScore !== undefined ? saved.postTestScore : defDay.postTestScore,
                        postTestMax: saved?.postTestMax || defDay.postTestMax,
                        docUrl: mDocUrl || aDocUrl || saved?.docUrl || defDay.docUrl,
                        docTitle: mDocTitle || aDocTitle || saved?.docTitle || defDay.docTitle,
                        evalUrl: saved?.evalUrl || defDay.evalUrl,
                        evalSubmitted: saved?.evalSubmitted !== undefined ? saved.evalSubmitted : defDay.evalSubmitted
                    };
                });
            }`;

if (appJs.match(oldAttendanceMappingRegex)) {
    appJs = appJs.replace(oldAttendanceMappingRegex, newAttendanceMappingCode);
    console.log('✓ Successfully upgraded loadSavedState with full morning/afternoon & multi-file persistence!');
} else {
    console.error('❌ Could not find old attendance mapping in loadSavedState');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
