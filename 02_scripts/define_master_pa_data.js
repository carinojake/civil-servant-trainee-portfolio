const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const appJsPath = path.join(baseDir, 'app.js');
const schemaPath = path.join(baseDir, '01_data/pa_evidence_schema.json');

const paSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
let appJs = fs.readFileSync(appJsPath, 'utf8');

if (!appJs.includes('const masterPaEvidenceData =')) {
    const paSchemaString = JSON.stringify(paSchema, null, 4);
    const codeToInsert = `const masterPaEvidenceData = ${paSchemaString};\n\nconst defaultAppData = {`;
    appJs = appJs.replace('const defaultAppData = {', codeToInsert);
    fs.writeFileSync(appJsPath, appJs, 'utf8');
    console.log('✓ Successfully defined masterPaEvidenceData in app.js');
} else {
    console.log('ℹ️ masterPaEvidenceData is already defined in app.js');
}
