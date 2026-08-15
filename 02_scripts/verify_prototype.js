/**
 * Verification Script for Government Project Prototype Suite
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const htmlFile = path.join(baseDir, 'gov_prototype.html');
const cssFile = path.join(baseDir, 'gov_styles.css');
const jsFile = path.join(baseDir, 'gov_app.js');
const dataFile = path.join(baseDir, '01_data', 'sample_mock_data.json');

console.log('🔍 Starting Comprehensive Prototype Verification...\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failCount++;
  }
}

// 1. Check Files Exist
assert(fs.existsSync(htmlFile), 'gov_prototype.html exists');
assert(fs.existsSync(cssFile), 'gov_styles.css exists');
assert(fs.existsSync(jsFile), 'gov_app.js exists');
assert(fs.existsSync(dataFile), 'sample_mock_data.json exists');

// 2. Inspect JS Content
const jsContent = fs.readFileSync(jsFile, 'utf8');

// Check 16 Modules
const expectedModules = [
  'dashboard', 'projects', 'proposal', 'memo', 'press', 'visual',
  'form', 'survey', 'analytics', 'charts', 'presentation', 'video',
  'a11y', 'pdpa', 'review', 'audit'
];

expectedModules.forEach(mod => {
  assert(jsContent.includes(`id: '${mod}'`), `Module '${mod}' is registered in MODULES list`);
});

// Check 3 Styles Supported
assert(jsContent.includes("'style-a'") && jsContent.includes("'style-b'") && jsContent.includes("'style-c'"), 'Supports Style A, B, and C');

// Check Workflow State Machine
const workflowStates = ['DRAFT', 'AI_DRAFT', 'IN_REVIEW', 'REVISION_REQUIRED', 'PENDING_APPROVAL', 'APPROVED'];
workflowStates.forEach(st => {
  assert(jsContent.includes(`'${st}'`) || jsContent.includes(`"${st}"`), `Workflow state '${st}' exists in engine`);
});

// Check Standard Placeholders
assert(jsContent.includes('[ตราหน่วยงาน]'), 'Uses standard placeholder [ตราหน่วยงาน]');
assert(jsContent.includes('[รอกรอก]'), 'Uses standard placeholder [รอกรอก]');

// Check Presentation 5 Slides
assert(jsContent.includes('SLIDES = [') && jsContent.includes('no: 5'), 'Presentation has 5 interactive slides');

// Check 30s Video Script
assert(jsContent.includes('00:00 - 00:05') && jsContent.includes('00:25 - 00:30'), '30-second Video Script has complete 4-part storyboard');

// 3. Inspect CSS Content
const cssContent = fs.readFileSync(cssFile, 'utf8');
assert(cssContent.includes('.theme-style-a'), 'CSS contains Style A theme');
assert(cssContent.includes('.theme-style-b'), 'CSS contains Style B theme');
assert(cssContent.includes('.theme-style-c'), 'CSS contains Style C theme');
assert(cssContent.includes('body.high-contrast'), 'CSS contains WCAG High Contrast mode');
assert(cssContent.includes(':focus-visible'), 'CSS contains visible focus indicator');

// Summary
console.log(`\n========================================`);
console.log(`Verification Complete: ${passCount} Passed, ${failCount} Failed.`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
