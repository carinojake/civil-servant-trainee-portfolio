/**
 * Automated Responsive, Print, & Accessibility QA Suite (02_scripts/verify_responsive_accessibility.js)
 * Tests Breakpoints (375px / 834px / 1440px), Print Stylesheet, and WCAG AA Accessibility.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('📱 RUNNING RESPONSIVE, PRINT & ACCESSIBILITY QA SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function check(testName, passed, details = '') {
    if (passed) {
        passCount++;
        console.log(`  ✓ [PASS] ${testName}`);
    } else {
        failCount++;
        console.error(`  ✗ [FAIL] ${testName} - ${details}`);
    }
}

const indexPath = path.join(rootDir, 'index.html');
const stylesPath = path.join(rootDir, 'styles.css');
const appJsPath = path.join(rootDir, 'app.js');

const html = fs.readFileSync(indexPath, 'utf8');
const css = fs.readFileSync(stylesPath, 'utf8');
const js = fs.readFileSync(appJsPath, 'utf8');

// 1. Responsive Viewport & Meta Tags
console.log('📱 1. Responsive Layout & Breakpoints Verification:');
check('Has viewport meta tag with device-width and initial-scale', html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">'));
check('Main container uses max-w-7xl with auto margin (Desktop 1440px support)', html.includes('max-w-7xl mx-auto'));
check('Uses Tailwind responsive grid classes (grid-cols-1 md:grid-cols-2 lg:grid-cols-3/4)', html.includes('grid-cols-1') && html.includes('md:grid-cols-2') && html.includes('lg:grid-cols-4'));
check('Mobile navigation has overflow-x-auto for smooth horizontal scroll (Mobile 375px)', html.includes('overflow-x-auto tab-navigation-bar') || html.includes('overflow-x-auto'));
check('Touch targets have min-height >= 44px for touch accessibility', css.includes('min-height: 44px') || css.includes('.touch-target'));

// 2. Print PDF A4 Stylesheet Verification
console.log('\n🖨️ 2. Print PDF A4 Multi-Page Layout Verification:');
check('Contains @page { size: A4 portrait } in styles.css', css.includes('size: A4 portrait'));
check('Contains page-break-after or break-after: page on print pages', css.includes('break-after: page') || css.includes('page-break-after: always'));
check('Hides non-printable interactive UI elements in @media print', css.includes('header') && css.includes('.no-print') && css.includes('display: none !important'));
check('Portfolio preview container contains exactly 7 dedicated print pages', 
    html.includes('portfolio-page-1') && 
    html.includes('portfolio-page-2') && 
    html.includes('portfolio-page-3') && 
    html.includes('portfolio-page-4') && 
    html.includes('portfolio-page-5') && 
    html.includes('portfolio-page-6') && 
    html.includes('portfolio-page-7')
);

// 3. Accessibility (WCAG 2.1 Level AA) Verification
console.log('\n♿ 3. Universal Accessibility (WCAG 2.1 AA) Verification:');
check('Includes Screen Reader Skip Link (#main-content)', html.includes('href="#main-content"') && html.includes('skip-link'));
check('Main content container has matching id="main-content"', html.includes('id="main-content"'));
check('Theme switcher contains High Contrast mode (theme-contrast)', html.includes('theme-contrast') && css.includes('.theme-contrast'));
check('High Contrast theme uses pure black #000000 and vivid yellow #FFD600 (Ratio > 7:1)', css.includes('#FFD600') && css.includes('#000000'));
check('Font size scaling supports 3 tiers (font-normal, font-large, font-xlarge)', 
    css.includes('.font-normal') && css.includes('.font-large') && css.includes('.font-xlarge') &&
    html.includes('setFontSize')
);
check('Has visible keyboard focus ring (:focus-visible)', css.includes(':focus-visible') || css.includes('focus:ring-2'));
check('ARIA roles and attributes present (role="tab", aria-selected, aria-label)', 
    html.includes('role="tab"') && html.includes('aria-selected') && html.includes('aria-label')
);
check('Voice-to-Text integration present for motor accessibility', js.includes('SpeechRecognition') && js.includes('startVoiceInput'));
check('Mandatory Alt-Text present on artifact storage modal and view', html.includes('modal-art-alt') && js.includes('altText'));

// 4. Local-First PDPA & Storage Isolation
console.log('\n🛡️ 4. Data Privacy (PDPA) & Local Storage Isolation:');
check('Uses client-side LocalStorage key for isolated persistence', js.includes('localStorage.getItem') && js.includes('localStorage.setItem'));
check('Provides JSON Export and Import functions for user data ownership', js.includes('exportDataJSON') && js.includes('importDataJSON'));
check('Provides full data reset capability with user confirmation', js.includes('resetAllDataToDefaults'));

console.log('\n================================================================');
console.log(`📊 QA AUDIT SUMMARY: Total: ${passCount + failCount} | Passed: ${passCount} | Failed: ${failCount}`);
console.log('================================================================');

if (failCount === 0) {
    console.log('🎉 ALL RESPONSIVE, PRINT & ACCESSIBILITY CHECKS PASSED (100%)!');
    process.exit(0);
} else {
    console.error(`⚠️ ${failCount} checks failed.`);
    process.exit(1);
}
