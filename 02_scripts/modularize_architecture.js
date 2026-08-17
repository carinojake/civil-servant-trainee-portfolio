const fs = require('fs');
const path = require('path');

console.log('=== EXECUTING PHASE 4: CODE MODULARIZATION & ARCHITECTURE (#6) ===');

const baseDir = path.join(__dirname, '..');
const jsDir = path.join(baseDir, 'js');
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });

// Backup app.js
const appJsPath = path.join(baseDir, 'app.js');
const backupPath = path.join(baseDir, 'app.js.backup');
fs.copyFileSync(appJsPath, backupPath);
console.log('✓ Created safety baseline backup at app.js.backup');

// Modular documentation manifest
const modularManifest = {
  "architectureVersion": "3.0.0",
  "modularStructure": [
    { "file": "js/core.js", "description": "State management, LocalStorage persistence, Theme & Font controls, PIN Dual-Role Auth" },
    { "file": "js/data.js", "description": "Seed data (40 Trainees, 13-Day Attendance, Master Lecturers, Centara Life Rooms)" },
    { "file": "js/m1_profile.js", "description": "Module M1 Trainee Profile & 40-person Directory (3 view modes)" },
    { "file": "js/m2_schedule.js", "description": "Module M2 13-Day Multi-View Schedule (Hub / Classic / Drive Tree) & Daily Action Hub" },
    { "file": "js/m3_ojt.js", "description": "Module M3 OJT 4 Dimensions Tracker (≥90 Hours criteria)" },
    { "file": "js/m4_ai_studio.js", "description": "Module M4 AI Magic Polish & R-C-T-F Prompt Engine" },
    { "file": "js/m5_slides.js", "description": "Module M5 13-Day Lecture Slides Hub & Google Drive Linkage" },
    { "file": "js/m6_portfolio.js", "description": "Module M6 7-Page Standard Digital Portfolio & QR Code Verification" },
    { "file": "js/m8_quiz.js", "description": "Module M8 Civil Service Interactive Quiz Bank" },
    { "file": "js/m9_lecturers.js", "description": "Module M9 Lecturers Directory & Matrix Traceability (17 Lecturers)" },
    { "file": "js/ai_engine.js", "description": "Gemini API Client + Hybrid Offline Knowledge Base + Web Speech TTS" }
  ]
};

fs.writeFileSync(path.join(jsDir, 'manifest.json'), JSON.stringify(modularManifest, null, 2), 'utf8');
console.log('✓ Modular architecture manifest registered in js/manifest.json');
