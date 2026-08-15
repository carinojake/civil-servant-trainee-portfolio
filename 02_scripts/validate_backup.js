/**
 * Backup and Snapshot Integrity Validator (02_scripts/validate_backup.js)
 * Verifies JSON structure, business compliance rules, and checksum integrity.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const targetFile = process.argv[2] || path.join(rootDir, '01_data', 'snapshots', 'snapshot_baseline_v1.json');

console.log('================================================================');
console.log('🔍 RUNNING BACKUP AND SNAPSHOT INTEGRITY VALIDATOR');
console.log(`📁 Target File: ${targetFile}`);
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function check(desc, condition) {
    if (condition) {
        passCount++;
        console.log(`  ✓ [PASS] ${desc}`);
    } else {
        failCount++;
        console.error(`  ✗ [FAIL] ${desc}`);
    }
}

function calculateFileHash(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

// 1. File existence & JSON parsing
check('Target file exists on disk', fs.existsSync(targetFile));
if (!fs.existsSync(targetFile)) {
    console.error('Target file not found. Exiting.');
    process.exit(1);
}

let data;
try {
    data = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    check('Valid JSON document', true);
} catch (e) {
    check('Valid JSON document', false);
    console.error(e);
    process.exit(1);
}

// 2. Schema structure check
console.log('\n📋 1. Validating Core Schema Properties:');
check('Has schemaVersion property ("2.0.0")', data.schemaVersion === '2.0.0');
check('Has userProfile object', typeof data.userProfile === 'object' && data.userProfile !== null);
check('Has attendance array (13 items)', Array.isArray(data.attendance) && data.attendance.length === 13);
check('Has ojtLogs array', Array.isArray(data.ojtLogs));
check('Has ojtChecklist array (6 items)', Array.isArray(data.ojtChecklist) && data.ojtChecklist.length === 6);
check('Has artifacts array', Array.isArray(data.artifacts));
check('Has traineesList array (40 items)', Array.isArray(data.traineesList) && data.traineesList.length === 40);

// 3. User Profile validation
console.log('\n👤 2. Validating User Profile & Experience:');
const p = data.userProfile || {};
check('Profile fullName is valid', typeof p.fullName === 'string' && p.fullName.length > 5);
check('Profile track is ADV or FND', p.track === 'ADV' || p.track === 'FND');
check('Profile organization is specified', typeof p.organization === 'string' && p.organization.length > 0);
check('Profile OJT agency is specified', typeof p.ojtAgency === 'string' && p.ojtAgency.length > 0);
check('Profile vision statement is specified', typeof p.vision === 'string' && p.vision.length > 20);
check('Profile has hard skills array', Array.isArray(p.hardSkills) && p.hardSkills.length >= 3);
check('Profile has soft skills array', Array.isArray(p.softSkills) && p.softSkills.length >= 3);

// 4. Attendance 13-Days validation
console.log('\n📅 3. Validating 13-Days Centara Life Attendance:');
const validAttendanceStatus = ['PRESENT', 'ONLINE', 'LEAVE', 'ABSENT'];
const allValidDays = (data.attendance || []).every((d, idx) => {
    return d.day === (idx + 1) &&
        typeof d.title === 'string' &&
        validAttendanceStatus.includes(d.status) &&
        typeof d.reflection === 'string';
});
check('All 13 days are sequential (1-13) with valid titles, reflections and statuses', allValidDays);

const presentCount = (data.attendance || []).filter(d => d.status === 'PRESENT' || d.status === 'ONLINE').length;
const attPct = Math.round((presentCount / 13) * 100);
check(`Attendance rate passes >= 80% criteria (${attPct}%)`, attPct >= 80);

// 5. OJT 4 Dimensions & Hours validation
console.log('\n⏱️ 4. Validating OJT 4 Dimensions & Hours Accumulation:');
const validDims = ['1', '2', '3', '4'];
const allValidOjt = (data.ojtLogs || []).every(log => {
    return typeof log.id === 'string' &&
        validDims.includes(log.dimension) &&
        typeof log.hours === 'number' && log.hours > 0 &&
        typeof log.task === 'string' && log.task.length > 0;
});
check('All OJT logs have valid dimension (1-4), positive hours, and task descriptions', allValidOjt);

const ojtTotalHours = (data.ojtLogs || []).reduce((acc, cur) => acc + cur.hours, 0);
check(`OJT total hours meets target >= 90 hrs (${ojtTotalHours} hrs)`, ojtTotalHours >= 90);

const coveredDims = new Set((data.ojtLogs || []).map(l => l.dimension));
check('OJT covers all 4 dimensions (1, 2, 3, 4)', coveredDims.size === 4);

// 6. Artifacts Alt-Text & WCAG compliance
console.log('\n🖼️ 5. Validating Artifacts & Universal Accessibility (Alt-Text):');
const allHaveAltText = (data.artifacts || []).every(art => {
    return typeof art.title === 'string' &&
        typeof art.altText === 'string' && art.altText.trim().length >= 10 &&
        typeof art.link === 'string';
});
check('All artifacts have meaningful Alt-Text (length >= 10) for Screen Readers', allHaveAltText);

// 7. Checksum Manifest Verification (if available)
if (data.fileManifest) {
    console.log('\n🔒 6. Verifying File Integrity Manifest Checksums:');
    let checksumMatches = true;
    for (const [relPath, info] of Object.entries(data.fileManifest)) {
        const fullPath = path.join(rootDir, relPath);
        const currentHash = calculateFileHash(fullPath);
        if (currentHash !== info.sha256) {
            checksumMatches = false;
            console.error(`  ✗ Hash mismatch for ${relPath}: Expected ${info.sha256}, got ${currentHash}`);
        } else {
            console.log(`  ✓ Hash verified for ${relPath}`);
        }
    }
    check('All core asset SHA-256 hashes match manifest', checksumMatches);
}

console.log('\n================================================================');
console.log(`📊 VALIDATION SUMMARY: Total Checkpoints: ${passCount + failCount} | Passed: ${passCount} | Failed: ${failCount}`);
console.log('================================================================');

if (failCount === 0) {
    console.log('🎉 SNAPSHOT / BACKUP DATA IS 100% VALID AND COMPLIANT!');
    process.exit(0);
} else {
    console.error(`⚠️ ${failCount} checkpoints failed.`);
    process.exit(1);
}
