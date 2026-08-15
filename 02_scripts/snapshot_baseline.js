/**
 * Snapshot Baseline Tool (02_scripts/snapshot_baseline.js)
 * Creates a frozen snapshot of initial system state, trainees directory, and calculates SHA-256 hashes.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const snapshotsDir = path.join(rootDir, '01_data', 'snapshots');

if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true });
}

function calculateFileHash(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

console.log('================================================================');
console.log('📦 MISSION 002: CREATING SNAPSHOT BASELINE & INTEGRITY MANIFEST');
console.log('================================================================\n');

// 1. Calculate File Checksums
const trackedFiles = [
    'index.html',
    'app.js',
    'styles.css',
    'system_requirements_blueprint.html',
    '01_data/default_trainees.json',
    '01_data/backup_schema.json'
];

const fileManifest = {};
console.log('🔍 Calculating SHA-256 Checksums for core assets:');
trackedFiles.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    const hash = calculateFileHash(fullPath);
    fileManifest[relPath] = {
        sizeBytes: fs.existsSync(fullPath) ? fs.statSync(fullPath).size : 0,
        sha256: hash
    };
    console.log(`  - ${relPath}: ${hash ? hash.slice(0, 16) + '...' : 'NOT FOUND'}`);
});

// 2. Load Trainees Seed Data
const traineesPath = path.join(rootDir, '01_data', 'default_trainees.json');
const traineesData = fs.existsSync(traineesPath) ? JSON.parse(fs.readFileSync(traineesPath, 'utf8')) : [];

// 3. Build Canonical Baseline State
const baselineState = {
    schemaVersion: "2.0.0",
    snapshotId: "SNAPSHOT-BASELINE-V1",
    snapshotName: "Mission 002 Baseline Freeze",
    createdAt: new Date().toISOString(),
    fileManifest: fileManifest,
    userProfile: {
        id: "TR-001",
        fullName: "นายเจค นิติพัฒน์ คุ้มวงษ์",
        nickname: "เจค",
        track: "ADV",
        trackName: "Advanced AI & Automation",
        position: "นักวิชาการคอมพิวเตอร์",
        organization: "สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน) - BDI",
        ojtAgency: "สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน) - DGA",
        email: "nitipat.k@bdi.or.th",
        phone: "081-234-5678",
        accessibilityNeeds: "สิ่งอำนวยความสะดวก: การปรับขยายตัวอักษรและชุดสีความคมชัดสูง (High Contrast)",
        vision: "มุ่งมั่นนำความรู้และประสบการณ์ด้านเทคโนโลยีสารสนเทศ การวิเคราะห์ข้อมูล และปัญญาประดิษฐ์ (AI) มาขับเคลื่อนการพัฒนาระบบบริการภาครัฐให้มีความสะดวกรวดเร็ว ปลอดภัย มีธรรมาภิบาล และทุกคนสามารถเข้าถึงได้อย่างเท่าเทียม (Universal Accessibility) เพื่อประโยชน์สูงสุดของประชาชนและประเทศชาติ",
        experiences: [
            {
                role: "เจ้าหน้าที่พัฒนาระบบคอมพิวเตอร์และระบบอัตโนมัติ",
                agency: "สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน)",
                period: "2565 - ปัจจุบัน",
                desc: "ออกแบบและดูแลกระบวนการจัดการข้อมูล (Data Pipeline), พัฒนาโมเดล AI Automation และประสานงานระบบสารสนเทศภาครัฐ"
            },
            {
                role: "นักวิชาการสารสนเทศ",
                agency: "ศูนย์สนับสนุนบริการสุขภาพดิจิทัล",
                period: "2560 - 2565",
                desc: "บริหารจัดการฐานข้อมูล ดูแลความมั่นคงปลอดภัยทางไซเบอร์ และจัดทำรายงานวิเคราะห์ข้อมูลเชิงสถิติ"
            }
        ],
        hardSkills: [
            "Python & Fast API", "PostgreSQL & Database Architecture", "Generative AI Prompting (R-C-T-F)",
            "Data Analytics & Dashboard", "System Analysis & Design", "Docker & Linux", "Google Apps Script"
        ],
        softSkills: [
            "การสื่อสารและประสานงานภาครัฐ", "การคิดเชิงวิเคราะห์และการแก้ปัญหา", "จริยธรรมและธรรมาภิบาลข้อมูล (PDPA)",
            "การทำงานร่วมกันเป็นทีม", "การบริหารจัดการเวลาและโครงการ"
        ]
    },
    attendance: [
        {
            day: 1,
            date: "10 ส.ค. 2569",
            title: "ปฐมนิเทศ & วินัย คุณธรรม จริยธรรม และจรรยาบรรณของบุคลากรภาครัฐ",
            isCombined: true,
            room: "ห้องประชุม BB 212",
            targetGroup: "กลุ่มเป้าหมายจำนวน 40 คน",
            morning: "ปฐมนิเทศ: กิจกรรมสร้างความคุ้นเคย (Ice Breaking), แนะนำหลักสูตร, แนวทางการเรียนรู้และการประเมินผล, สำรวจความพร้อมของผู้เรียน",
            morningComputer: false,
            afternoon: "รายวิชาวินัย คุณธรรม จริยธรรม และจรรยาบรรณของบุคลากรภาครัฐ",
            afternoonComputer: true,
            status: "PRESENT",
            reflection: "เข้าร่วมกิจกรรมปฐมนิเทศ Ice Breaking ทำความคุ้นเคยกับเพื่อนร่วมรุ่น 40 คน และเรียนรู้วิชาวินัย จริยธรรม คุณธรรมของข้าราชการยุคดิจิทัล",
            actionPlan: "ยึดมั่นในวินัยและจรรยาบรรณวิชาชีพ พร้อมเปิดรับการเรียนรู้ตลอด 13 วัน"
        },
        {
            day: 2,
            date: "11 ส.ค. 2569",
            title: "ระบบราชการ & กฎหมาย (FND) / วิเคราะห์ข้อมูล & Agile & ออกแบบกระบวนงานดิจิทัล (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องประชุม BB 212",
                morning: "รายวิชาความรู้พื้นฐานเกี่ยวกับระบบราชการและการบริหารราชการแผ่นดิน",
                morningComputer: true,
                afternoon: "รายวิชากฎหมาย ระเบียบ และข้อบังคับพื้นฐานที่เกี่ยวข้องกับการปฏิบัติราชการ",
                afternoonComputer: true
            },
            advanced: {
                room: "ห้องประชุม BB 211",
                morning: "รายวิชาการวิเคราะห์ข้อมูลและการบริหารราชการยุคดิจิทัล / รายวิชาการบริหารโครงการภาครัฐและการทำงานแบบ Agile",
                morningComputer: true,
                afternoon: "รายวิชาการออกแบบกระบวนงานดิจิทัล",
                afternoonComputer: true
            },
            status: "PRESENT",
            reflection: "เรียนรู้การวิเคราะห์ข้อมูลภาครัฐ การบริหารโครงการแบบ Agile และการออกแบบกระบวนงานดิจิทัล (Digital Workflow Design)",
            actionPlan: "นำกรอบคิด Agile มาปรับใช้ในการวางแผนพัฒนาระบบไอทีเพื่อส่งมอบผลงานได้รวดเร็วและตรงจุด"
        },
        {
            day: 3,
            date: "13 ส.ค. 2569",
            title: "ทักษะบริการ & Design Thinking (FND) / การสื่อสาร & วิเคราะห์ข้อมูลตัดสินใจ (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องประชุม BB 212",
                morning: "รายวิชาทักษะพื้นฐานด้านการบริการภาครัฐ",
                morningComputer: false,
                afternoon: "รายวิชาทักษะการคิดเชิงออกแบบ (Design Thinking)",
                afternoonComputer: false
            },
            advanced: {
                room: "ห้องประชุม BB 211",
                morning: "รายวิชาเทคนิคการสื่อสารและสร้างคอนเทนต์ภาครัฐ / รายวิชาการพัฒนาความเป็นผู้นำและการขับเคลื่อนองค์กรที่ยอมรับความแตกต่าง",
                morningComputer: true,
                afternoon: "รายวิชาการบริหารและวิเคราะห์ข้อมูลเพื่อการตัดสินใจ",
                afternoonComputer: true
            },
            status: "PRESENT",
            reflection: "ฝึกเทคนิคการสื่อสารสร้างคอนเทนต์ภาครัฐ ภาวะผู้นำในองค์กรที่ยอมรับความหลากหลาย และการวิเคราะห์ข้อมูลเพื่อการตัดสินใจเชิงกลยุทธ์",
            actionPlan: "จัดทำ Data Visualization เพื่อสนับสนุนการตัดสินใจของผู้บริหารให้ชัดเจน เข้าใจง่าย"
        },
        {
            day: 4,
            date: "14 ส.ค. 2569",
            title: "การประยุกต์ใช้ AI ในงานราชการ & บริบทการบริหารและการทำงานยุคดิจิทัล",
            isCombined: true,
            room: "ห้องประชุม BB 212",
            targetGroup: "รวมทุกหลักสูตร",
            morning: "รายวิชาการฝึกปฏิบัติการประยุกต์ใช้ปัญญาประดิษฐ์ (AI) ในการปฏิบัติงานราชการ / รายวิชาการประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์",
            morningComputer: true,
            afternoon: "รายวิชาบริบทการบริหารราชการ การเปลี่ยนแปลงเชิงกระบวนทัศน์ และระบบนิเวศการทำงานในยุคดิจิทัล",
            afternoonComputer: true,
            status: "PRESENT",
            reflection: "ฝึกปฏิบัติการใช้ AI ช่วยงานเอกสารและการวิเคราะห์ข้อมูล พร้อมทำความเข้าใจระบบนิเวศการทำงานภาครัฐยุคดิจิทัล",
            actionPlan: "นำ Prompt Engineering มาเพิ่มความเร็วในการสืบค้นและสรุปข้อมูลรายงานภาครัฐอย่างปลอดภัย"
        },
        {
            day: 5,
            date: "17 ส.ค. 2569",
            title: "การใช้ภาษาราชการ & ระบบงานสารบรรณอิเล็กทรอนิกส์และกฎหมายขั้นสูง",
            isCombined: true,
            room: "ห้องประชุม BB 205",
            targetGroup: "รวมทุกหลักสูตร",
            morning: "รายวิชาทักษะพื้นฐานด้านการใช้ภาษาราชการ / รายวิชาการฝึกปฏิบัติการจัดการระบบงานสารบรรณอิเล็กทรอนิกส์",
            morningComputer: true,
            afternoon: "รายวิชางานสารบรรณและกฎหมายภาครัฐขั้นสูง",
            afternoonComputer: true,
            status: "PRESENT",
            reflection: "ฝึกทักษะการร่างหนังสือราชการ การจัดการระบบสารบรรณอิเล็กทรอนิกส์ (e-Saraban) และข้อกฎหมายที่เกี่ยวข้อง",
            actionPlan: "เขียนหนังสือราชการให้ถูกต้องตามระเบียบสารบรรณ 3 ย่อหน้ามาตรฐาน"
        },
        {
            day: 6,
            date: "18 ส.ค. 2569",
            title: "โปรแกรมสำนักงาน สารบรรณอิเล็กทรอนิกส์ & แพลตฟอร์มการทำงานร่วมกัน",
            isCombined: true,
            room: "ห้องประชุม BB 205",
            targetGroup: "รวมทุกหลักสูตร",
            morning: "รายวิชาการฝึกปฏิบัติการใช้คอมพิวเตอร์และโปรแกรมสำนักงานพื้นฐาน / รายวิชาการฝึกปฏิบัติการจัดการระบบงานสารบรรณอิเล็กทรอนิกส์",
            morningComputer: true,
            afternoon: "รายวิชาการฝึกปฏิบัติการใช้แพลตฟอร์มการสื่อสารและการทำงานร่วมกัน",
            afternoonComputer: true,
            status: "PRESENT",
            reflection: "ฝึกใช้เครื่องมือสำนักงานดิจิทัล การจัดเก็บไฟล์คลาวด์ และแพลตฟอร์มการสื่อสารร่วมกันแบบเรียลไทม์",
            actionPlan: "ใช้ Google Workspace / MS 365 ช่วยเพิ่มประสิทธิภาพการประสานงานภายในทีม"
        },
        {
            day: 7,
            date: "19 ส.ค. 2569",
            title: "การสื่อสาร & ทีมเวิร์ก (FND) / บริหารคลังข้อมูล แดชบอร์ด & สารบรรณวิเคราะห์ (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องประชุม BB 202",
                morning: "รายวิชาทักษะพื้นฐานด้านการสื่อสาร / รายวิชาทักษะการประสานงานและบริหารความสัมพันธ์ขั้นสูง",
                morningComputer: true,
                afternoon: "รายวิชาทักษะการทำงานเป็นทีมและภาวะผู้นำขั้นพื้นฐาน / รายวิชาทักษะการบริหารจัดการและผู้นำ",
                afternoonComputer: false
            },
            advanced: {
                room: "ห้องประชุม BB 211",
                morning: "รายวิชาการบริหารคลังข้อมูลและการสร้างแดชบอร์ด",
                morningComputer: true,
                afternoon: "รายวิชางานสารบรรณและการร่างข้อเสนอเชิงวิเคราะห์",
                afternoonComputer: true
            },
            status: "PRESENT",
            reflection: "ฝึกปฏิบัติการสร้างแดชบอร์ดคลังข้อมูลและการร่างเอกสารข้อเสนอโครงการเชิงวิเคราะห์",
            actionPlan: "ออกแบบแดชบอร์ดติดตามสถานะงานบริการประชาชนให้ผู้บริหารเห็นภาพรวมได้ทันที"
        },
        {
            day: 8,
            date: "20 ส.ค. 2569",
            title: "ธรรมาภิบาล & พัสดุงบประมาณ (FND) / ภาวะผู้นำ & จิตวิทยาบริการขั้นสูง (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องประชุม BB 202",
                morning: "รายวิชาหลักธรรมาภิบาล การบริหารภาครัฐแนวใหม่ (New Public Management) และการพัฒนาระบบราชการ / รายวิชาการคิดเชิงยุทธศาสตร์และการวิเคราะห์สภาพแวดล้อมภาครัฐ",
                morningComputer: true,
                afternoon: "รายวิชาการบริหารพัสดุ งบประมาณ และสินทรัพย์ดิจิทัล / รายวิชาการบริหารจัดการสำนักงานอัจฉริยะ",
                afternoonComputer: true
            },
            advanced: {
                room: "ห้องประชุม BB 211",
                morning: "รายวิชาทักษะของผู้นำด้านความคิดและการประสานงาน",
                morningComputer: false,
                afternoon: "รายวิชาจิตวิทยาการบริการขั้นสูงและการจัดการอารมณ์",
                afternoonComputer: false
            },
            status: "PRESENT",
            reflection: "เรียนรู้ภาวะผู้นำทางความคิด ทักษะการประสานงานระดับสูง และจิตวิทยาการให้บริการประชาชนเชิงรุก",
            actionPlan: "นำจิตวิทยาการบริการมาปรับใช้ในการสื่อสารกับผู้รับบริการทุกกลุ่มอย่างเข้าอกเข้าใจ"
        },
        {
            day: 9,
            date: "24 ส.ค. 2569",
            title: "Critical Thinking & IQ (FND) / จัดการข้อร้องเรียน & Customer Experience (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องประชุม BB 212",
                morning: "รายวิชาทักษะการคิดอย่างมีวิจารณญาณ (Critical Thinking)",
                morningComputer: false,
                afternoon: "รายวิชาพื้นฐานการเสริมสร้างความฉลาดรู้ทางเชาวน์ปัญญา (IQ)",
                afternoonComputer: false
            },
            advanced: {
                room: "ห้องประชุม BB 211",
                morning: "รายวิชาการบริหารจัดการข้อร้องเรียนและวิกฤตขั้นวิกฤต",
                morningComputer: false,
                afternoon: "รายวิชาการออกแบบประสบการณ์ลูกค้าและการบริหารความสัมพันธ์",
                afternoonComputer: false
            },
            status: "PRESENT",
            reflection: "ฝึกการรับมือข้อร้องเรียนในภาวะวิกฤต และการออกแบบ Citizen Experience ในงานบริการภาครัฐ",
            actionPlan: "จัดทำ Flowchart ขั้นตอนการรับมือข้อร้องเรียนทางเทคนิคให้แก่ฝ่ายสนับสนุนไอที"
        },
        {
            day: 10,
            date: "25 ส.ค. 2569",
            title: "การบริหารผลงาน PMQA (FND) / เทคโนโลยี AI & วิเคราะห์ข้อมูลปรับปรุงบริการ (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องประชุม BB 212",
                morning: "รายวิชากลไกการบริหารผลการปฏิบัติงานและการวางแผนพัฒนาอาชีพ",
                morningComputer: false,
                afternoon: "รายวิชาพื้นฐานการบริหารคุณภาพภาครัฐตามกรอบ PMQA",
                afternoonComputer: false
            },
            advanced: {
                room: "ห้องประชุม BB 211",
                morning: "รายวิชาเทคโนโลยีและปัญญาประดิษฐ์เพื่อการบริการยุคดิจิทัล / รายวิชาการประยุกต์ใช้ปัญญาประดิษฐ์เพื่อช่วยงานวิชาการขั้นสูง",
                morningComputer: true,
                afternoon: "รายวิชาการวิเคราะห์ข้อมูลเพื่อปรับปรุงงานบริการ",
                afternoonComputer: true
            },
            status: "PRESENT",
            reflection: "ฝึกใช้ AI ช่วยวิจัย วิเคราะห์ข้อมูลเพื่อปรับปรุงคุณภาพงานบริการภาครัฐตามตัวชี้วัด",
            actionPlan: "นำข้อมูลสถิติการใช้งานระบบมาวิเคราะห์หาจุดติดขัดเพื่อปรับปรุง UX/UI ต่อไป"
        },
        {
            day: 11,
            date: "26 ส.ค. 2569",
            title: "ความฉลาดรู้ทางจริยธรรม MQ (FND) / ระบบอัตโนมัติ AI & สารบรรณวิเคราะห์ (ADV)",
            isCombined: false,
            foundation: {
                room: "ห้องประชุม BB 212",
                morning: "รายวิชาพื้นฐานการเสริมสร้างความฉลาดรู้ทางจริยธรรม (MQ)",
                morningComputer: false,
                afternoon: "รายวิชาพื้นฐานการเสริมสร้างประสิทธิภาพและคุณภาพชีวิต การทำงานอย่างยั่งยืน หลักเศรษฐกิจพอเพียงด้วยศาสตร์ของพระราชา",
                afternoonComputer: false
            },
            advanced: {
                room: "ห้องประชุม BB 211",
                morning: "รายวิชาการประยุกต์ใช้เทคโนโลยีอัตโนมัติและ AI ในงานธุรการ",
                morningComputer: true,
                afternoon: "รายวิชางานสารบรรณและการเขียนเชิงวิเคราะห์ขั้นสูง",
                afternoonComputer: true
            },
            status: "PRESENT",
            reflection: "ฝึกปฏิบัติการสร้างระบบอัตโนมัติ (Automation) ในงานธุรการและการเขียนรายงานเชิงวิเคราะห์ขั้นสูง",
            actionPlan: "พัฒนาระบบ Automate ส่งออกเอกสารสรุปรายสัปดาห์เพื่อลดเวลาการทำงานซ้ำซ้อน"
        },
        {
            day: 12,
            date: "27 ส.ค. 2569",
            title: "การเสริมสร้างความฉลาดรู้ทางอารมณ์ (EQ) และความฉลาดรู้ทางสังคม (SQ)",
            isCombined: true,
            room: "ห้องประชุม BB 203",
            targetGroup: "รวมทุกหลักสูตร",
            morning: "รายวิชาพื้นฐานการเสริมสร้างความฉลาดรู้ทางอารมณ์ (EQ)",
            morningComputer: false,
            afternoon: "รายวิชาพื้นฐานการเสริมสร้างความฉลาดรู้ทางสังคม (SQ)",
            afternoonComputer: false,
            status: "PRESENT",
            reflection: "เสริมสร้างทักษะความฉลาดทางอารมณ์ (EQ) และความฉลาดทางสังคม (SQ) ในการทำงานร่วมกับเพื่อนร่วมงานหลากหลายฝ่าย",
            actionPlan: "ฝึกการบริหารอารมณ์และสร้างบรรยากาศการทำงานที่เกื้อกูลและเป็นมิตร"
        },
        {
            day: 13,
            date: "28 ส.ค. 2569",
            title: "ความฉลาดรู้ในการแก้ปัญหา (AQ), สรุปบทเรียน (Reflection) & ปิดการอบรม",
            isCombined: true,
            room: "ห้องประชุม BB 203",
            targetGroup: "รวมทุกหลักสูตร",
            morning: "รายวิชาพื้นฐานการเสริมสร้างความฉลาดรู้ทางการตอบสนองทางความคิดในการแก้ปัญหาภายใต้สถานการณ์ที่ยากลำบาก (AQ)",
            morningComputer: false,
            afternoon: "สรุปบทเรียน (Reflection) / นำเสนอผลงาน / ประเมินผล / ปิดการอบรม",
            afternoonComputer: false,
            status: "PRESENT",
            reflection: "ฝึกความฉลาดรู้ในการแก้ปัญหาภายใต้สถานการณ์ยากลำบาก (AQ) นำเสนอผลงานภาพรวมตลอด 13 วัน และรับการประเมินปิดการอบรม",
            actionPlan: "มุ่งมั่นนำความรู้ทั้งหมดไปประยุกต์ใช้ในการฝึกปฏิบัติงานจริง (OJT) ต่อไป"
        }
    ],
    ojtLogs: [
        { id: "OJT-001", date: "2026-08-28", dimension: "1", dimensionName: "งานวิเคราะห์ข้อมูลและสารสนเทศ", hours: 16, task: "วิเคราะห์โครงสร้างฐานข้อมูลและจัดทำ Data Dictionary สำหรับระบบสารสนเทศหน่วยงาน", output: "เอกสาร Data Dictionary จำนวน 1 ฉบับ ครอบคลุม 25 ตารางข้อมูล", link: "https://drive.google.com/drive/folders/sample-ojt-data-dict" },
        { id: "OJT-002", date: "2026-09-02", dimension: "2", dimensionName: "งานเอกสารราชการและสารบรรณ", hours: 18, task: "ร่างบันทึกข้อความขออนุมัติดำเนินโครงการดิจิทัล และจัดทำระเบียบวาระการประชุมคณะทำงาน", output: "บันทึกข้อความราชการ 3 ย่อหน้า และรายงานการประชุม 1 ฉบับ", link: "https://drive.google.com/drive/folders/sample-ojt-official-memo" },
        { id: "OJT-003", date: "2026-09-08", dimension: "3", dimensionName: "งานเทคนิค ระบบ และการพัฒนา", hours: 32, task: "พัฒนาสคริปต์ Python สำหรับตรวจสอบความถูกต้องของข้อมูล (Data Validation) และเชื่อมต่อ API", output: "โปรแกรม Automation Script ทำงานบน Docker และผ่านการทดสอบ 100%", link: "https://drive.google.com/drive/folders/sample-ojt-python-script" },
        { id: "OJT-004", date: "2026-09-15", dimension: "4", dimensionName: "งานประสานงาน บริการ และสื่อสาร", hours: 24, task: "ประสานงานกับผู้ใช้งานระบบเพื่อรวบรวมข้อกำหนดการใช้งาน และจัดทำคู่มือการใช้งานระบบดิจิทัล", output: "คู่มือผู้ใช้งาน (User Manual) และเอกสารสรุปความต้องการ 1 ชุด", link: "https://drive.google.com/drive/folders/sample-ojt-user-manual" }
    ],
    ojtChecklist: [
        { id: "chk-1", title: "จัดทำแผนการฝึกงานรายบุคคล (Individual Training Plan) ร่วมกับพี่เลี้ยง", done: true },
        { id: "chk-2", title: "บันทึกเวลาปฏิบัติงานและสะสมชั่วโมงครบถ้วนในแต่ละสัปดาห์", done: true },
        { id: "chk-3", title: "รับการประเมินผลการปฏิบัติงานระหว่างฝึก (Mid-term Evaluation) จากพี่เลี้ยง", done: true },
        { id: "chk-4", title: "ปฏิบัติงานครอบคลุมครบทั้ง 4 ด้านงานตามโครงสร้างหลักสูตร", done: true },
        { id: "chk-5", title: "สะสมชั่วโมงการฝึกปฏิบัติงานจริงรวมไม่น้อยกว่า 90 ชั่วโมง (≥ 90 ชม.)", done: true },
        { id: "chk-6", title: "รวบรวมเอกสารลงนามรับรองชั่วโมงและส่งหลักฐานเบิกจ่ายเบี้ยเลี้ยง", done: true }
    ],
    artifacts: [
        { id: "ART-001", title: "ภาพการนำเสนอโครงงาน AI เพื่อบริการประชาชน ณ เซ็นทารา ไลฟ์", category: "TRAINING_13DAYS", altText: "นายเจคยืนนำเสนอสไลด์บรรยายเรื่องการประยุกต์ใช้ AI ในการบริการประชาชนหน้าห้องประชุมโรงแรมเซ็นทารา ไลฟ์", link: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60" },
        { id: "ART-002", title: "ภาพถ่ายการปฏิบัติงานวิเคราะห์ข้อมูลร่วมกับพี่เลี้ยง ณ DGA", category: "OJT_WORK", altText: "ภาพขณะกำลังตรวจสอบโค้ดภาษา Python และหน้าจอแดชบอร์ดร่วมกับพี่เลี้ยงประจำหน่วยงาน OJT", link: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60" },
        { id: "ART-003", title: "เกียรติบัตรผ่านการอบรมหลักสูตรเตรียมความพร้อมภาครัฐ รุ่นที่ 1", category: "CERTIFICATE", altText: "เกียรติบัตรรับรองการผ่านการฝึกอบรมหลักสูตรข้าราชการและพนักงานรัฐคนพิการ รุ่นที่ 1 ออกโดย BDI และ พก.", link: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=500&auto=format&fit=crop&q=60" },
        { id: "ART-004", title: "Infographic สรุปผลสัมฤทธิ์โครงการและการออกแบบเพื่อคนทั้งมวล", category: "PRESENTATION", altText: "แผ่นภาพอินโฟกราฟิกสรุป 4 มิติการพัฒนาตนเองและสถิติการฝึกปฏิบัติงาน 90 ชั่วโมง", link: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60" }
    ],
    traineesList: traineesData
};

// 4. Save Canonical Snapshot
const snapshotFile = path.join(snapshotsDir, 'snapshot_baseline_v1.json');
fs.writeFileSync(snapshotFile, JSON.stringify(baselineState, null, 2), 'utf8');

console.log(`\n💾 Snapshot Saved Successfully:`);
console.log(`  Path: ${snapshotFile}`);
console.log(`  Size: ${fs.statSync(snapshotFile).size} bytes`);
console.log(`  Trainees Count: ${traineesData.length}`);
console.log(`  Schedule Days: ${baselineState.attendance.length}`);
console.log(`  OJT Initial Logs: ${baselineState.ojtLogs.length}`);

// 5. Generate Checksum Manifest File
const manifestFile = path.join(snapshotsDir, 'manifest_checksums.json');
fs.writeFileSync(manifestFile, JSON.stringify({
    generatedAt: new Date().toISOString(),
    snapshotFile: 'snapshot_baseline_v1.json',
    fileManifest: fileManifest
}, null, 2), 'utf8');
console.log(`  Manifest: ${manifestFile}`);

console.log('\n================================================================');
console.log('✅ MISSION 002: SNAPSHOT BASELINE COMPLETE!');
console.log('================================================================');
