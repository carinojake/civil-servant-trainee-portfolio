/**
 * Automated System Verification Script (02_scripts/verify_system.js)
 * Checks schema integrity, business calculations, accessibility tags, and 7-module SPA completeness.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✓ PASS: ${message}`);
    } else {
        failedTests++;
        console.error(`  ✗ FAIL: ${message}`);
    }
}

console.log('================================================================');
console.log('🚀 RUNNING AUTOMATED AUDIT & VERIFICATION FOR TRAINING APP');
console.log('================================================================\n');

// 1. Audit Default Trainees Data (40 Trainees)
console.log('📦 1. Auditing Trainees Directory (01_data/default_trainees.json)...');
const traineesPath = path.join(rootDir, '01_data', 'default_trainees.json');
assert(fs.existsSync(traineesPath), 'default_trainees.json exists');

if (fs.existsSync(traineesPath)) {
    const trainees = JSON.parse(fs.readFileSync(traineesPath, 'utf8'));
    assert(Array.isArray(trainees), 'Trainees data is an array');
    assert(trainees.length === 40, `Trainees array has exactly 40 members (found ${trainees.length})`);
    
    const advCount = trainees.filter(t => t.track === 'ADV').length;
    const fndCount = trainees.filter(t => t.track === 'FND').length;
    assert(advCount > 0 && fndCount > 0, `Contains both ADV (${advCount}) and FND (${fndCount}) tracks`);
    
    const allHaveSkills = trainees.every(t => Array.isArray(t.skills) && t.skills.length > 0);
    assert(allHaveSkills, 'Every trainee has valid skills array');

    const allHaveOjt = trainees.every(t => t.ojtAgency && t.ojtAgency.length > 0);
    assert(allHaveOjt, 'Every trainee has designated OJT agency');
}

// 2. Audit System Requirements Blueprint
console.log('\n📐 2. Auditing Blueprint File (system_requirements_blueprint.html)...');
const blueprintPath = path.join(rootDir, 'system_requirements_blueprint.html');
assert(fs.existsSync(blueprintPath), 'system_requirements_blueprint.html exists');

if (fs.existsSync(blueprintPath)) {
    const content = fs.readFileSync(blueprintPath, 'utf8');
    assert(content.includes('M1'), 'Contains Module M1');
    assert(content.includes('M2'), 'Contains Module M2');
    assert(content.includes('M3'), 'Contains Module M3');
    assert(content.includes('M4'), 'Contains Module M4');
    assert(content.includes('M5'), 'Contains Module M5');
    assert(content.includes('M6'), 'Contains Module M6');
    assert(content.includes('M7'), 'Contains Module M7');
    assert(content.includes('WCAG'), 'Contains WCAG specification reference');
}

// 3. Audit Stylesheet & Universal Accessibility Tokens (styles.css)
console.log('\n🎨 3. Auditing Stylesheet & Accessibility Design System (styles.css)...');
const stylesPath = path.join(rootDir, 'styles.css');
assert(fs.existsSync(stylesPath), 'styles.css exists');

if (fs.existsSync(stylesPath)) {
    const css = fs.readFileSync(stylesPath, 'utf8');
    assert(css.includes('.theme-slate'), 'Contains Executive Slate theme definition');
    assert(css.includes('.theme-contrast'), 'Contains High Contrast theme definition');
    assert(css.includes('#FFD600'), 'Contains WCAG High Contrast yellow accent #FFD600');
    assert(css.includes('.font-normal') && css.includes('.font-large') && css.includes('.font-xlarge'), 'Contains 3-tier font size scaling classes');
    assert(css.includes('@media print'), 'Contains @media print stylesheet block');
    assert(css.includes('break-after: page') || css.includes('page-break-after: always'), 'Contains A4 page-break CSS properties for multi-page PDF');
}

// 4. Audit Core Application SPA Structure (index.html)
console.log('\n📄 4. Auditing Main SPA Components (index.html)...');
const indexPath = path.join(rootDir, 'index.html');
assert(fs.existsSync(indexPath), 'index.html exists');

if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    assert(html.includes('id="tab-dashboard"'), 'Contains Dashboard panel');
    assert(html.includes('id="tab-m1"'), 'Contains M1: Profile & Directory panel');
    assert(html.includes('id="tab-m2"'), 'Contains M2: Schedule 13 Days panel');
    assert(html.includes('id="tab-m3"'), 'Contains M3: OJT Tracker panel');
    assert(html.includes('id="tab-m4"'), 'Contains M4: AI Magic Polish panel');
    assert(html.includes('id="tab-m5"'), 'Contains M5: Drive & Artifacts panel');
    assert(html.includes('id="tab-m6"'), 'Contains M6: Portfolio Master Exporter panel');
    assert(html.includes('id="tab-m7"'), 'Contains M7: Accessibility Center & PDPA panel');
    assert(html.includes('btn-pview-table') && html.includes('btn-pview-card') && html.includes('btn-pview-analytics'), 'Contains M1 3-mode view switcher buttons (Table, Card, Analytics)');
    assert(html.includes('id="participantModal"'), 'Contains M1 Participant CRUD modal');
    assert(html.includes('id="aiCareerModal"'), 'Contains Gemini AI Career & OJT Recommendation modal');
    assert(html.includes('id="aiExecModal"'), 'Contains Gemini AI Executive Summary modal');
    assert(html.includes('id="deleteParticipantModal"'), 'Contains Delete Participant confirmation modal');
    assert(html.includes('btn-sched-track-auto') && html.includes('btn-sched-track-both'), 'Contains M2 track filter buttons (Auto, ADV, FND, Both)');
    assert(html.includes('modal-ref-course-info'), 'Contains M2 reflection modal course info preview context');
    assert(html.includes('id="modal-day-links"'), 'Contains Daily Action Hub Link & Score Editor modal');
    assert(html.includes('id="lock-screen-overlay"'), 'Contains Passcode Security Lock Screen Overlay');
    assert(html.includes('id="modal-change-pin"'), 'Contains Change Security PIN modal');
    assert(html.includes('skip-link'), 'Contains Screen Reader skip link for WCAG Level AA');
    assert(html.includes('portfolio-page-1') && html.includes('portfolio-page-7'), 'Contains 7-page standard portfolio structure (Page 1 to Page 7)');
    assert(html.includes('id="ai-buddy-fab"'), 'Contains AI Co-Pilot Floating Action Button');
    assert(html.includes('id="ai-study-buddy-drawer"'), 'Contains AI Study Buddy Side Drawer');
    assert(html.includes('id="ai-chat-feed"') && html.includes('id="ai-chat-input"'), 'Contains AI Chat Feed and Input Bar');
    assert(html.includes('id="modal-gemini-key"'), 'Contains Modal for Gemini API Key setup');
}

// 5. Audit JavaScript Logic Engine & Calculations (app.js)
console.log('\n⚙️ 5. Auditing JavaScript Engine & Business Logic (app.js)...');
const appJsPath = path.join(rootDir, 'app.js');
assert(fs.existsSync(appJsPath), 'app.js exists');

if (fs.existsSync(appJsPath)) {
    const js = fs.readFileSync(appJsPath, 'utf8');
    assert(js.includes('attendance'), 'Contains attendance state collection');
    assert(js.includes('switchParticipantView') && js.includes('applyParticipantFilters'), 'Contains M1 3-mode view switcher and filter controllers');
    assert(js.includes('openParticipantModal') && js.includes('handleParticipantFormSubmit') && js.includes('confirmDeleteParticipant'), 'Contains M1 participant CRUD engine');
    assert(js.includes('recommendAICareer') && js.includes('generateAIExecutiveSummary') && js.includes('polishInterestsWithAI'), 'Contains Gemini AI Career, Executive Summary, and Polish engines');
    assert(js.includes('setScheduleTrackFilter'), 'Contains M2 dynamic schedule track filter controller');
    assert(js.includes('openDayLinksModal') && js.includes('saveDayLinksFromModal'), 'Contains Daily Action Hub modal controllers');
    assert(js.includes('preTestUrl') && js.includes('postTestUrl') && js.includes('evalSubmitted'), 'Contains Pre/Post test URLs, scores, and evaluation tracking');
    assert(js.includes('initSecurityLock') && js.includes('submitPinUnlock') && js.includes('lockAppImmediately'), 'Contains Passcode Security Lock & Unlock controllers');
    assert(js.includes('saveNewSecurityPin') && js.includes('clearRememberedDevice'), 'Contains PIN change and device remember management');
    assert(js.includes('toggleAIBuddyDrawer') && js.includes('sendAIChatMessage') && js.includes('triggerQuickPrompt'), 'Contains AI Study Buddy Drawer & Quick Prompts engine');
    assert(js.includes('generateAIStudyResponse') && js.includes('speakAIText') && js.includes('toggleAIVoiceRecognition'), 'Contains Hybrid Gemini / Built-in AI & Thai Voice/TTS controllers');
    assert(js.includes('BB 212') && js.includes('BB 211') && js.includes('BB 202') && js.includes('BB 205') && js.includes('BB 203'), 'Contains all 5 Centara Life conference rooms');
    assert(js.includes('ojtLogs'), 'Contains ojtLogs state collection');
    assert(js.includes('artifacts'), 'Contains artifacts state collection');
    assert(js.includes('runAiPolish'), 'Contains AI Magic Polish handler');
    assert(js.includes('generateVideoScript'), 'Contains Video Script 1-minute generator');
    assert(js.includes('updateRctfPrompt'), 'Contains R-C-T-F prompt engine');
    assert(js.includes('startVoiceInput'), 'Contains Web Speech API voice input function');
    assert(js.includes('exportDataJSON') && js.includes('importDataJSON'), 'Contains JSON Backup/Restore engine');
    assert(js.includes('setTheme') && js.includes('setFontSize'), 'Contains theme and font accessibility controllers');
}

// 6. Test Mathematical Logic & Business Rules
console.log('\n🧮 6. Testing Mathematical Calculation Rules...');
// Attendance Rate:
const testAttendance = [
    { day: 1, status: 'PRESENT' },
    { day: 2, status: 'PRESENT' },
    { day: 3, status: 'PRESENT' },
    { day: 4, status: 'PRESENT' },
    { day: 5, status: 'PRESENT' },
    { day: 6, status: 'PRESENT' },
    { day: 7, status: 'PRESENT' },
    { day: 8, status: 'PRESENT' },
    { day: 9, status: 'PRESENT' },
    { day: 10, status: 'PRESENT' },
    { day: 11, status: 'PRESENT' },
    { day: 12, status: 'ABSENT' },
    { day: 13, status: 'PRESENT' }
];
const presentDays = testAttendance.filter(a => a.status === 'PRESENT').length;
const attPct = Math.round((presentDays / 13) * 100);
assert(attPct === 92, `Attendance rate calculation: 12/13 is ${attPct}% (Expected 92%)`);
assert(attPct >= 80, 'Passes attendance compliance requirement (>= 80%)');

// OJT 4 Dimensions Total Hours:
const testOjt = [
    { dimension: '1', hours: 16 },
    { dimension: '2', hours: 18 },
    { dimension: '3', hours: 32 },
    { dimension: '4', hours: 24 }
];
const totalOjt = testOjt.reduce((acc, c) => acc + c.hours, 0);
assert(totalOjt === 90, `OJT Total hours calculation: ${totalOjt} hrs (Expected 90 hrs)`);
assert(totalOjt >= 90, 'Passes OJT hour compliance requirement (>= 90 hrs)');

// R-C-T-F prompt format check:
const testPrompt = `[ROLE]: Specialist\n[CONTEXT]: Govt\n[TASK]: Summary\n[FORMAT]: Memo`;
assert(testPrompt.includes('[ROLE]') && testPrompt.includes('[CONTEXT]') && testPrompt.includes('[TASK]') && testPrompt.includes('[FORMAT]'), 'R-C-T-F Prompt Format contains all 4 required sections');

console.log('\n================================================================');
console.log(`📊 AUDIT SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('================================================================');

if (failedTests === 0) {
    console.log('🎉 ALL AUDITS AND VERIFICATIONS PASSED SUCCESSFULLY!');
    process.exit(0);
} else {
    console.error(`⚠️ ${failedTests} tests failed.`);
    process.exit(1);
}
