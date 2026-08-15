/* ==========================================================================
   Civil Servant Trainee Learning & Portfolio Management System (app.js)
   Complies with Local-First JSON Storage, WCAG 2.1 AA & Official Thai Govt Standard
   ========================================================================== */

const STORAGE_KEY = 'civil_servant_trainee_app_v2';

// --------------------------------------------------------------------------
// 1. Initial Default Seed Data
// --------------------------------------------------------------------------
const defaultAppData = {
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
            title: "ปฐมนิเทศ ระเบียบวินัย และค่านิยมข้าราชการยุคใหม่",
            speaker: "คณะผู้ทรงคุณวุฒิ สำนักงาน ก.พ.",
            date: "10 ส.ค. 2569",
            status: "PRESENT",
            reflection: "ได้รับทราบทิศทางการพัฒนาระบบราชการ 4.0 ความสำคัญของการเป็นข้าราชการที่มีจิตสาธารณะ และระเบียบวินัยการปฏิบัติงาน",
            actionPlan: "นำแนวคิดการทำงานแบบ Agile และยึดประชาชนเป็นศูนย์กลางมาประยุกต์ใช้ในทุกขั้นตอนของงานสารสนเทศ"
        },
        {
            day: 2,
            title: "การสื่อสารที่มีประสิทธิภาพและการประสานงานในองค์กรภาครัฐ",
            speaker: "ผู้เชี่ยวชาญด้านจิตวิทยาองค์กร",
            date: "11 ส.ค. 2569",
            status: "PRESENT",
            reflection: "ฝึกทักษะการฟังอย่างเข้าอกเข้าใจ (Active Listening) และเทคนิคการสื่อสารข้ามสายงานเพื่อลดความขัดแย้ง",
            actionPlan: "ใช้การสื่อสารที่ชัดเจน ตรงประเด็น และเลือกใช้ช่องทางดิจิทัลที่เหมาะสมกับกลุ่มผู้รับสาร"
        },
        {
            day: 3,
            title: "ทักษะดิจิทัลพื้นฐานและระบบสารบรรณอิเล็กทรอนิกส์ (e-Document)",
            speaker: "ผู้แทนสำนักงานพัฒนารัฐบาลดิจิทัล (DGA)",
            date: "12 ส.ค. 2569",
            status: "PRESENT",
            reflection: "เรียนรู้ระเบียบงานสารบรรณอิเล็กทรอนิกส์ การลงลายมือชื่อดิจิทัล และการรักษาความปลอดภัยของเอกสารราชการ",
            actionPlan: "จัดทำคู่มือการใช้งานระบบ e-Document สรุปเป็นขั้นตอนเข้าใจง่ายสำหรับเพื่อนร่วมงาน"
        },
        {
            day: 4,
            title: "ความมั่นคงปลอดภัยไซเบอร์และ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
            speaker: "สำนักงานคณะกรรมการการรักษาความมั่นคงปลอดภัยไซเบอร์แห่งชาติ (สกมช.)",
            date: "13 ส.ค. 2569",
            status: "PRESENT",
            reflection: "ตระหนักถึงภัยคุกคามทางไซเบอร์ในหน่วยงานรัฐ และหลักการคุ้มครองข้อมูลส่วนบุคคลตามเกณฑ์ PDPA",
            actionPlan: "นำมาตรการคุ้มครองข้อมูลส่วนบุคคลมาปรับใช้ในการออกแบบฐานข้อมูล ไม่เก็บข้อมูลเกินความจำเป็น"
        },
        {
            day: 5,
            title: "การบริหารจัดการข้อมูลและการใช้เครื่องมือดิจิทัลในสำนักงาน",
            speaker: "ผู้เชี่ยวชาญเทคโนโลยีสารสนเทศ",
            date: "14 ส.ค. 2569",
            status: "PRESENT",
            reflection: "ฝึกปฏิบัติการใช้ Google Workspace, Spreadsheet ขั้นสูง และการเชื่อมต่อข้อมูลอัตโนมัติ",
            actionPlan: "สร้างเทมเพลต Spreadsheet สำหรับติดตามงานในฝ่ายเพื่อลดขั้นตอนงานเอกสารซ้ำซ้อน"
        },
        {
            day: 6,
            title: "การประยุกต์ใช้ Generative AI ในงานราชการ (Prompt R-C-T-F)",
            speaker: "ทีมวิทยากร BDI & Tech Innovators",
            date: "17 ส.ค. 2569",
            status: "PRESENT",
            reflection: "ได้เรียนรู้เทคนิคการตั้งคำถาม AI ด้วยกรอบ Role-Context-Task-Format และการตรวจสอบความถูกต้องของข้อมูล",
            actionPlan: "นำกรอบ R-C-T-F มาใช้ช่วยร่างบันทึกข้อความราชการและสรุปรายงานการประชุมอย่างมีประสิทธิภาพ"
        },
        {
            day: 7,
            title: "การวิเคราะห์ข้อมูลเพื่อการตัดสินใจเชิงนโยบาย (Data Analytics)",
            speaker: "นักวิทยาศาสตร์ข้อมูลอาวุโส BDI",
            date: "18 ส.ค. 2569",
            status: "PRESENT",
            reflection: "เข้าใจกระบวนการ Data Pipeline, การทำ Data Cleaning และการสร้าง Data Dashboard สรุปผลเชิงบริหาร",
            actionPlan: "พัฒนาแดชบอร์ดสรุปสถิติงานบริการของหน่วยงานเพื่อให้ผู้บริหารเห็นข้อมูลแบบ Real-time"
        },
        {
            day: 8,
            title: "การออกแบบ Infographic และการประชาสัมพันธ์ภาครัฐ (Canva Pro)",
            speaker: "ผู้เชี่ยวชาญด้านสื่อสร้างสรรค์",
            date: "19 ส.ค. 2569",
            status: "PRESENT",
            reflection: "เรียนรู้หลักการจัดวาง Visual Hierarchy, คู่สีที่เข้าถึงได้ และการสื่อสารข้อมูลซับซ้อนให้เข้าใจง่าย",
            actionPlan: "ออกแบบ Infographic สรุปสิทธิประโยชน์ของประชาชนโดยคำนึงถึงความคมชัดของสีเพื่อผู้มีสายตาเลือนราง"
        },
        {
            day: 9,
            title: "การผลิตสื่อวิดีโอสั้น 1 นาทีเพื่อการสื่อสารสาธารณะ",
            speaker: "โปรดิวเซอร์สื่อดิจิทัล",
            date: "20 ส.ค. 2569",
            status: "PRESENT",
            reflection: "ฝึกเขียน Storyboard 4 ช่วงเวลา (Hook, Story, Impact, CTA) และการตัดต่อวิดีโอสั้น",
            actionPlan: "จัดทำคลิปวิดีโอสั้น 1 นาทีแนะนำการใช้งานระบบบริการออนไลน์ของหน่วยงาน"
        },
        {
            day: 10,
            title: "การจัดทำรายงานผลสัมฤทธิ์และหนังสือราชการ 3 ย่อหน้า",
            speaker: "ผู้ทรงคุณวุฒิด้านงานสารบรรณ",
            date: "21 ส.ค. 2569",
            status: "PRESENT",
            reflection: "ฝึกเขียนบันทึกข้อความ 3 ย่อหน้า: 1. ความเป็นมา 2. การดำเนินการ 3. ข้อพิจารณาและประโยชน์",
            actionPlan: "ใช้โครงสร้าง 3 ย่อหน้านี้ในการเขียนสรุปผลงานและการเสนอโครงการทุกครั้ง"
        },
        {
            day: 11,
            title: "การเตรียมความพร้อมสู่การฝึกปฏิบัติงานจริง (OJT Onboarding)",
            speaker: "คณะทำงานกำกับดูแลหลักสูตร",
            date: "24 ส.ค. 2569",
            status: "PRESENT",
            reflection: "รับทราบเป้าหมายการสะสมชั่วโมง OJT 4 ด้าน (รวม ≥ 90 ชม.) และข้อตกลงร่วมกับหน่วยงานรับฝึก",
            actionPlan: "วางแผนการฝึกงานรายสัปดาห์ร่วมกับพี่เลี้ยง OJT เพื่อให้ครอบคลุมภารกิจทั้ง 4 ด้าน"
        },
        {
            day: 12,
            title: "การนำเสนอผลงานกลุ่ม นวัตกรรมดิจิทัล และการประเมินผล",
            speaker: "คณะกรรมการประเมินผลสัมฤทธิ์",
            date: "25 ส.ค. 2569",
            status: "PRESENT",
            reflection: "นำเสนอผลงานต้นแบบระบบจัดการข้อมูลและรับฟังข้อเสนอแนะเพื่อนำไปปรับปรุง",
            actionPlan: "ปรับปรุงโค้ดและเพิ่มฟังก์ชันคำบรรยายภาพ (Alt-Text) ตามคำแนะนำของคณะกรรมการ"
        },
        {
            day: 13,
            title: "ปัจฉิมนิเทศ สรุปบทเรียน และพิธีมอบสัมฤทธิบัตร",
            speaker: "ผู้บริหารระดับสูงและผู้แทนกระทรวง พม.",
            date: "26 ส.ค. 2569",
            status: "PRESENT",
            reflection: "ทบทวนการเรียนรู้ตลอด 13 วัน และสร้างพันธสัญญาในการนำความรู้ไปพัฒนางานราชการอย่างต่อเนื่อง",
            actionPlan: "มุ่งมั่นปฏิบัติหน้าที่ในการฝึก OJT และจัดทำแฟ้มสะสมผลงาน (Portfolio) 7 หน้าให้สมบูรณ์แบบ"
        }
    ],
    ojtLogs: [
        {
            id: "OJT-001",
            date: "2026-08-28",
            dimension: "1",
            dimensionName: "งานวิเคราะห์ข้อมูลและสารสนเทศ",
            hours: 16,
            task: "วิเคราะห์โครงสร้างฐานข้อมูลและจัดทำ Data Dictionary สำหรับระบบสารสนเทศหน่วยงาน",
            output: "เอกสาร Data Dictionary จำนวน 1 ฉบับ ครอบคลุม 25 ตารางข้อมูล",
            link: "https://drive.google.com/drive/folders/sample-ojt-data-dict"
        },
        {
            id: "OJT-002",
            date: "2026-09-02",
            dimension: "2",
            dimensionName: "งานเอกสารราชการและสารบรรณ",
            hours: 18,
            task: "ร่างบันทึกข้อความขออนุมัติดำเนินโครงการดิจิทัล และจัดทำระเบียบวาระการประชุมคณะทำงาน",
            output: "บันทึกข้อความราชการ 3 ย่อหน้า และรายงานการประชุม 1 ฉบับ",
            link: "https://drive.google.com/drive/folders/sample-ojt-official-memo"
        },
        {
            id: "OJT-003",
            date: "2026-09-08",
            dimension: "3",
            dimensionName: "งานเทคนิค ระบบ และการพัฒนา",
            hours: 32,
            task: "พัฒนาสคริปต์ Python สำหรับตรวจสอบความถูกต้องของข้อมูล (Data Validation) และเชื่อมต่อ API",
            output: "โปรแกรม Automation Script ทำงานบน Docker และผ่านการทดสอบ 100%",
            link: "https://drive.google.com/drive/folders/sample-ojt-python-script"
        },
        {
            id: "OJT-004",
            date: "2026-09-15",
            dimension: "4",
            dimensionName: "งานประสานงาน บริการ และสื่อสาร",
            hours: 24,
            task: "ประสานงานกับผู้ใช้งานระบบเพื่อรวบรวมข้อกำหนดการใช้งาน และจัดทำคู่มือการใช้งานระบบดิจิทัล",
            output: "คู่มือผู้ใช้งาน (User Manual) และเอกสารสรุปความต้องการ 1 ชุด",
            link: "https://drive.google.com/drive/folders/sample-ojt-user-manual"
        }
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
        {
            id: "ART-001",
            title: "ภาพการนำเสนอโครงงาน AI เพื่อบริการประชาชน ณ เซ็นทารา ไลฟ์",
            category: "TRAINING_13DAYS",
            altText: "นายเจคยืนนำเสนอสไลด์บรรยายเรื่องการประยุกต์ใช้ AI ในการบริการประชาชนหน้าห้องประชุมโรงแรมเซ็นทารา ไลฟ์",
            link: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60"
        },
        {
            id: "ART-002",
            title: "ภาพถ่ายการปฏิบัติงานวิเคราะห์ข้อมูลร่วมกับพี่เลี้ยง ณ DGA",
            category: "OJT_WORK",
            altText: "ภาพขณะกำลังตรวจสอบโค้ดภาษา Python และหน้าจอแดชบอร์ดร่วมกับพี่เลี้ยงประจำหน่วยงาน OJT",
            link: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60"
        },
        {
            id: "ART-003",
            title: "เกียรติบัตรผ่านการอบรมหลักสูตรเตรียมความพร้อมภาครัฐ รุ่นที่ 1",
            category: "CERTIFICATE",
            altText: "เกียรติบัตรรับรองการผ่านการฝึกอบรมหลักสูตรข้าราชการและพนักงานรัฐคนพิการ รุ่นที่ 1 ออกโดย BDI และ พก.",
            link: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=500&auto=format&fit=crop&q=60"
        },
        {
            id: "ART-004",
            title: "Infographic สรุปผลสัมฤทธิ์โครงการและการออกแบบเพื่อคนทั้งมวล",
            category: "PRESENTATION",
            altText: "แผ่นภาพอินโฟกราฟิกสรุป 4 มิติการพัฒนาตนเองและสถิติการฝึกปฏิบัติงาน 90 ชั่วโมง",
            link: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60"
        }
    ],
    traineesList: []
};

let appState = JSON.parse(JSON.stringify(defaultAppData));

// --------------------------------------------------------------------------
// 2. Initialization & Lifecycle
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    loadSavedState();
    await loadTraineesData();
    renderAllViews();
    setupRctfPromptListener();
});

function loadSavedState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            appState = { ...defaultAppData, ...parsed };
        }
    } catch (e) {
        console.warn('Error loading localStorage, using defaults', e);
        appState = JSON.parse(JSON.stringify(defaultAppData));
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        updateKpiMetrics();
        renderPortfolioPreview();
    } catch (e) {
        console.error('Error saving state to localStorage', e);
    }
}

async function loadTraineesData() {
    if (appState.traineesList && appState.traineesList.length >= 40) {
        return;
    }
    try {
        const res = await fetch('01_data/default_trainees.json');
        if (res.ok) {
            const list = await res.json();
            appState.traineesList = list;
            saveState();
        }
    } catch (e) {
        console.warn('Could not fetch default_trainees.json directly, fallback embedded.');
    }
}

// --------------------------------------------------------------------------
// 3. UI View Rendering Engine
// --------------------------------------------------------------------------
function renderAllViews() {
    renderUserProfileForm();
    renderTraineeDirectory();
    renderScheduleList();
    renderOjtTable();
    renderOjtChecklist();
    renderArtifactsGrid();
    updateKpiMetrics();
    renderPortfolioPreview();
    generateVideoScript('profile');
    updateRctfPrompt();
}

function updateKpiMetrics() {
    // 1. Attendance Calculation (>=80% pass criteria)
    const totalDays = appState.attendance.length || 13;
    const presentDays = appState.attendance.filter(a => a.status === 'PRESENT' || a.status === 'ONLINE').length;
    const attendancePct = Math.round((presentDays / totalDays) * 100);

    const pctEl = document.getElementById('kpi-attendance-pct');
    const daysEl = document.getElementById('kpi-attendance-days');
    const barEl = document.getElementById('kpi-attendance-bar');
    const statusEl = document.getElementById('kpi-attendance-status');
    const m2SummaryEl = document.getElementById('m2-attendance-summary');

    if (pctEl) pctEl.innerText = `${attendancePct}%`;
    if (daysEl) daysEl.innerText = `(${presentDays}/${totalDays} วัน)`;
    if (barEl) barEl.style.width = `${attendancePct}%`;
    if (m2SummaryEl) m2SummaryEl.innerText = `${presentDays} / ${totalDays} วัน (${attendancePct}%)`;

    if (statusEl) {
        if (attendancePct >= 80) {
            statusEl.innerText = "ผ่านเกณฑ์มาตรฐาน (≥80%)";
            statusEl.className = "font-bold text-emerald-600";
        } else {
            statusEl.innerText = `ต้องเข้าเรียนเพิ่ม (${attendancePct}% < 80%)`;
            statusEl.className = "font-bold text-amber-600";
        }
    }

    // 2. OJT Hours Calculation (>=90 hours target)
    let dim1 = 0, dim2 = 0, dim3 = 0, dim4 = 0;
    appState.ojtLogs.forEach(log => {
        const hrs = parseFloat(log.hours) || 0;
        if (log.dimension === '1') dim1 += hrs;
        else if (log.dimension === '2') dim2 += hrs;
        else if (log.dimension === '3') dim3 += hrs;
        else if (log.dimension === '4') dim4 += hrs;
    });
    const totalOjtHrs = dim1 + dim2 + dim3 + dim4;
    const ojtPct = Math.min(100, Math.round((totalOjtHrs / 90) * 100));

    const ojtHrsEl = document.getElementById('kpi-ojt-hours');
    const ojtBarEl = document.getElementById('kpi-ojt-bar');
    const ojtStatusEl = document.getElementById('kpi-ojt-status');

    if (ojtHrsEl) ojtHrsEl.innerText = `${totalOjtHrs} ชม.`;
    if (ojtBarEl) ojtBarEl.style.width = `${ojtPct}%`;
    if (ojtStatusEl) {
        if (totalOjtHrs >= 90) {
            ojtStatusEl.innerText = `ครบตามเกณฑ์ (${totalOjtHrs}/90 ชม.)`;
            ojtStatusEl.className = "font-bold text-emerald-600";
        } else {
            ojtStatusEl.innerText = `สะสมแล้ว ${ojtPct}% (เหลือ ${90 - totalOjtHrs} ชม.)`;
            ojtStatusEl.className = "font-bold text-amber-600";
        }
    }

    // 4 Dimensions Badges & Bars
    const d1El = document.getElementById('dim-1-hours');
    const d2El = document.getElementById('dim-2-hours');
    const d3El = document.getElementById('dim-3-hours');
    const d4El = document.getElementById('dim-4-hours');

    if (d1El) d1El.innerText = `${dim1} ชม.`;
    if (d2El) d2El.innerText = `${dim2} ชม.`;
    if (d3El) d3El.innerText = `${dim3} ชม.`;
    if (d4El) d4El.innerText = `${dim4} ชม.`;

    const maxDim = Math.max(dim1, dim2, dim3, dim4, 30);
    const b1 = document.getElementById('dim-1-bar');
    const b2 = document.getElementById('dim-2-bar');
    const b3 = document.getElementById('dim-3-bar');
    const b4 = document.getElementById('dim-4-bar');
    if (b1) b1.style.width = `${(dim1 / maxDim) * 100}%`;
    if (b2) b2.style.width = `${(dim2 / maxDim) * 100}%`;
    if (b3) b3.style.width = `${(dim3 / maxDim) * 100}%`;
    if (b4) b4.style.width = `${(dim4 / maxDim) * 100}%`;

    const bDim1 = document.getElementById('ojt-badge-dim1');
    const bDim2 = document.getElementById('ojt-badge-dim2');
    const bDim3 = document.getElementById('ojt-badge-dim3');
    const bDim4 = document.getElementById('ojt-badge-dim4');
    if (bDim1) bDim1.innerText = `${dim1} ชม.`;
    if (bDim2) bDim2.innerText = `${dim2} ชม.`;
    if (bDim3) bDim3.innerText = `${dim3} ชม.`;
    if (bDim4) bDim4.innerText = `${dim4} ชม.`;

    // 3. Artifacts count
    const artCount = appState.artifacts.length;
    const artCountEl = document.getElementById('kpi-artifacts-count');
    const artBadgeEl = document.getElementById('artifacts-total-badge');
    if (artCountEl) artCountEl.innerText = `${artCount} รายการ`;
    if (artBadgeEl) artBadgeEl.innerText = `${artCount} รายการ`;

    // 4. Recent Activities list on Dashboard
    renderRecentActivities();
}

function renderRecentActivities() {
    const listEl = document.getElementById('recent-activities-list');
    if (!listEl) return;

    let items = [];
    appState.ojtLogs.slice(-3).reverse().forEach(log => {
        items.push({
            type: 'OJT',
            title: `บันทึกฝึกงาน ${log.dimensionName} (${log.hours} ชม.)`,
            desc: log.task,
            date: log.date
        });
    });
    appState.attendance.filter(a => a.reflection).slice(-2).reverse().forEach(att => {
        items.push({
            type: 'TRAINING',
            title: `สรุปการอบรมวันที่ ${att.day}: ${att.title}`,
            desc: att.reflection,
            date: att.date
        });
    });

    if (items.length === 0) {
        listEl.innerHTML = `<div class="p-4 text-center text-slate-400">ยังไม่มีรายการบันทึกล่าสุด</div>`;
        return;
    }

    listEl.innerHTML = items.map(item => `
        <div class="py-3 flex items-start space-x-3">
            <span class="w-7 h-7 rounded-lg ${item.type === 'OJT' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'} flex items-center justify-center text-xs shrink-0 mt-0.5">
                <i class="fa-solid ${item.type === 'OJT' ? 'fa-briefcase' : 'fa-graduation-cap'}"></i>
            </span>
            <div class="flex-grow">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-800">${item.title}</span>
                    <span class="text-[11px] text-slate-400">${item.date}</span>
                </div>
                <p class="text-slate-600 text-[11px] mt-0.5 line-clamp-1">${item.desc}</p>
            </div>
        </div>
    `).join('');
}

// --------------------------------------------------------------------------
// 4. M1: Profile & Trainee Directory (40 Trainees)
// --------------------------------------------------------------------------
function renderUserProfileForm() {
    const p = appState.userProfile;
    setInputValue('prof-fullname', p.fullName);
    setInputValue('prof-nickname', p.nickname);
    setInputValue('prof-track', p.track);
    setInputValue('prof-position', p.position);
    setInputValue('prof-org', p.organization);
    setInputValue('prof-ojt-agency', p.ojtAgency);
    setInputValue('prof-email', p.email);
    setInputValue('prof-phone', p.phone);
    setInputValue('prof-accessibility', p.accessibilityNeeds);
    setInputValue('prof-vision', p.vision);

    const headerName = document.getElementById('header-user-name');
    if (headerName) {
        headerName.innerText = `${p.fullName.split(' ')[1] || p.fullName} (${p.track})`;
    }
}

function saveUserProfile() {
    appState.userProfile.fullName = getInputValue('prof-fullname');
    appState.userProfile.nickname = getInputValue('prof-nickname');
    appState.userProfile.track = getInputValue('prof-track');
    appState.userProfile.trackName = appState.userProfile.track === 'ADV' ? 'Advanced AI & Automation' : 'Foundation Digital Skills';
    appState.userProfile.position = getInputValue('prof-position');
    appState.userProfile.organization = getInputValue('prof-org');
    appState.userProfile.ojtAgency = getInputValue('prof-ojt-agency');
    appState.userProfile.email = getInputValue('prof-email');
    appState.userProfile.phone = getInputValue('prof-phone');
    appState.userProfile.accessibilityNeeds = getInputValue('prof-accessibility');
    appState.userProfile.vision = getInputValue('prof-vision');

    saveState();
    showToast('บันทึกข้อมูลประวัติผู้เข้าอบรมเรียบร้อยแล้ว');
}

function renderTraineeDirectory() {
    const grid = document.getElementById('trainee-directory-grid');
    if (!grid) return;

    const list = appState.traineesList || [];
    const query = (document.getElementById('trainee-search')?.value || '').toLowerCase().trim();
    const trackFilter = document.getElementById('trainee-track-filter')?.value || 'ALL';

    const filtered = list.filter(t => {
        const matchesQuery = !query || t.name.toLowerCase().includes(query) ||
            t.position.toLowerCase().includes(query) ||
            t.organization.toLowerCase().includes(query) ||
            t.ojtAgency.toLowerCase().includes(query);
        const matchesTrack = trackFilter === 'ALL' || t.track === trackFilter;
        return matchesQuery && matchesTrack;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 bg-slate-50 rounded-xl">ไม่พบข้อมูลผู้เข้าอบรมตามเงื่อนไข</div>`;
        return;
    }

    grid.innerHTML = filtered.map((t, idx) => `
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition space-y-2">
            <div class="flex justify-between items-start">
                <div class="flex items-center space-x-2">
                    <span class="w-8 h-8 rounded-full ${t.track === 'ADV' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'} flex items-center justify-center text-xs font-bold">
                        ${idx + 1}
                    </span>
                    <div>
                        <h4 class="font-bold text-govNavy text-xs">${t.name}</h4>
                        <div class="text-[11px] text-slate-500">${t.position}</div>
                    </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${t.track === 'ADV' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}">
                    ${t.track}
                </span>
            </div>
            <div class="text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200/60 pt-2">
                <div><i class="fa-solid fa-building text-slate-400 mr-1"></i> <strong>สังกัด:</strong> ${t.organization}</div>
                <div><i class="fa-solid fa-briefcase text-slate-400 mr-1"></i> <strong>OJT:</strong> ${t.ojtAgency}</div>
            </div>
            <div class="flex flex-wrap gap-1 pt-1">
                ${(t.skills || []).slice(0, 3).map(s => `<span class="bg-white border border-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded">${s}</span>`).join('')}
            </div>
            <div class="pt-2 flex justify-between items-center border-t border-slate-100 text-[11px]">
                <span class="text-slate-400"><i class="fa-solid fa-envelope mr-1"></i>${t.email}</span>
                <button onclick="selectAsCurrentUser('${t.id}')" class="text-blue-600 hover:text-blue-800 font-bold hover:underline">
                    สลับเป็นผู้ใช้นี้
                </button>
            </div>
        </div>
    `).join('');
}

function filterTraineeDirectory() {
    renderTraineeDirectory();
}

function selectAsCurrentUser(traineeId) {
    const found = (appState.traineesList || []).find(t => t.id === traineeId);
    if (!found) return;

    appState.userProfile.id = found.id;
    appState.userProfile.fullName = found.name;
    appState.userProfile.nickname = found.nickname || "";
    appState.userProfile.track = found.track;
    appState.userProfile.trackName = found.trackName || (found.track === 'ADV' ? 'Advanced AI & Automation' : 'Foundation Digital Skills');
    appState.userProfile.position = found.position;
    appState.userProfile.organization = found.organization;
    appState.userProfile.ojtAgency = found.ojtAgency;
    appState.userProfile.email = found.email;
    appState.userProfile.phone = found.phone || "081-234-5678";
    appState.userProfile.accessibilityNeeds = found.accessibilityNeeds || "ไม่มี";

    saveState();
    renderUserProfileForm();
    showToast(`สลับการแสดงผลเป็น: ${found.name}`);
}

// --------------------------------------------------------------------------
// 5. M2: Schedule & Daily Reflection (13 Days Centara Life)
// --------------------------------------------------------------------------
function renderScheduleList() {
    const container = document.getElementById('schedule-days-container');
    if (!container) return;

    container.innerHTML = appState.attendance.map(dayItem => {
        const isPresent = dayItem.status === 'PRESENT' || dayItem.status === 'ONLINE';
        return `
            <div class="app-card p-5 border-l-4 ${isPresent ? 'border-emerald-500' : 'border-slate-300'} transition">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                    <div class="flex items-center space-x-3">
                        <span class="w-10 h-10 rounded-xl ${isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} flex items-center justify-center font-bold text-sm shrink-0">
                            วันที่ ${dayItem.day}
                        </span>
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="text-xs text-slate-400"><i class="fa-solid fa-calendar mr-1"></i>${dayItem.date}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                    ${dayItem.status === 'PRESENT' ? 'เข้าเรียนปกติ' : dayItem.status === 'ONLINE' ? 'เรียนออนไลน์' : 'ไม่ได้เข้าอบรม'}
                                </span>
                            </div>
                            <h4 class="font-bold text-govNavy text-sm mt-0.5">${dayItem.title}</h4>
                            <div class="text-xs text-slate-500"><i class="fa-solid fa-chalkboard-user mr-1"></i>วิทยากร: ${dayItem.speaker}</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 self-end sm:self-center">
                        <button onclick="toggleAttendanceStatus(${dayItem.day})" class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${isPresent ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'border-slate-300 bg-slate-100 text-slate-600'}">
                            <i class="fa-solid ${isPresent ? 'fa-check' : 'fa-xmark'} mr-1"></i> สลับสถานะ
                        </button>
                        <button onclick="openReflectionModal(${dayItem.day})" class="px-3 py-1.5 rounded-lg bg-govNavy hover:bg-govNavyDark text-white text-xs font-semibold shadow">
                            <i class="fa-solid fa-pen-to-square mr-1"></i> บันทึกโน้ต
                        </button>
                    </div>
                </div>

                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-2">
                    <div>
                        <strong class="text-slate-700 font-semibold"><i class="fa-solid fa-lightbulb text-amber-500 mr-1.5"></i>สรุปการเรียนรู้ (Reflection):</strong>
                        <p class="text-slate-600 mt-0.5 leading-relaxed">${dayItem.reflection || '<span class="text-slate-400 italic">ยังไม่มีการบันทึกสรุป</span>'}</p>
                    </div>
                    ${dayItem.actionPlan ? `
                    <div class="border-t border-slate-200 pt-1.5">
                        <strong class="text-slate-700 font-semibold"><i class="fa-solid fa-arrow-right-to-bracket text-emerald-500 mr-1.5"></i>สิ่งที่นำไปปรับใช้:</strong>
                        <p class="text-slate-600 mt-0.5">${dayItem.actionPlan}</p>
                    </div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function toggleAttendanceStatus(dayNum) {
    const dayItem = appState.attendance.find(a => a.day === dayNum);
    if (!dayItem) return;

    dayItem.status = (dayItem.status === 'PRESENT') ? 'ABSENT' : 'PRESENT';
    saveState();
    renderScheduleList();
    showToast(`อัปเดตสถานะวันที่ ${dayNum} เรียบร้อยแล้ว`);
}

function quickCheckInToday() {
    const firstUnchecked = appState.attendance.find(a => a.status === 'ABSENT');
    if (firstUnchecked) {
        firstUnchecked.status = 'PRESENT';
        saveState();
        renderScheduleList();
        showToast(`เช็กอินวันที่ ${firstUnchecked.day} สำเร็จแล้ว`);
    } else {
        showToast('คุณได้เช็กอินครบทั้ง 13 วันแล้ว');
    }
}

function openReflectionModal(dayNum) {
    const item = appState.attendance.find(a => a.day === dayNum);
    if (!item) return;

    document.getElementById('modal-ref-day').value = item.day;
    document.getElementById('modal-reflection-title').innerText = `บันทึกสรุปการเรียนรู้วันที่ ${item.day}: ${item.title}`;
    document.getElementById('modal-ref-status').value = item.status || 'PRESENT';
    document.getElementById('modal-ref-notes').value = item.reflection || '';
    document.getElementById('modal-ref-action').value = item.actionPlan || '';

    openModal('modal-reflection');
}

function saveReflectionFromModal() {
    const dayNum = parseInt(document.getElementById('modal-ref-day').value, 10);
    const item = appState.attendance.find(a => a.day === dayNum);
    if (!item) return;

    item.status = document.getElementById('modal-ref-status').value;
    item.reflection = document.getElementById('modal-ref-notes').value.trim();
    item.actionPlan = document.getElementById('modal-ref-action').value.trim();

    saveState();
    closeModal('modal-reflection');
    renderScheduleList();
    showToast(`บันทึกสรุปการเรียนรู้วันที่ ${dayNum} เรียบร้อยแล้ว`);
}

// --------------------------------------------------------------------------
// 6. M3: OJT Tracker & Checklist (4 Dimensions & >=90 Hours)
// --------------------------------------------------------------------------
function renderOjtTable() {
    const tbody = document.getElementById('ojt-logs-table-body');
    if (!tbody) return;

    const filterDim = document.getElementById('ojt-dimension-filter')?.value || 'ALL';
    const filtered = appState.ojtLogs.filter(l => filterDim === 'ALL' || l.dimension === filterDim);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-400 bg-slate-50">ไม่พบรายการบันทึกการฝึกงาน</td></tr>`;
        return;
    }

    const dimBadges = {
        '1': 'bg-blue-100 text-blue-800 border-blue-200',
        '2': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        '3': 'bg-purple-100 text-purple-800 border-purple-200',
        '4': 'bg-amber-100 text-amber-800 border-amber-200'
    };

    tbody.innerHTML = filtered.map(log => `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 whitespace-nowrap font-medium text-slate-600">${log.date}</td>
            <td class="p-3 whitespace-nowrap">
                <span class="px-2 py-1 rounded text-[11px] font-bold border ${dimBadges[log.dimension] || 'bg-slate-100 text-slate-700'}">
                    ${log.dimensionName}
                </span>
            </td>
            <td class="p-3 font-bold text-govNavy text-center">${log.hours} ชม.</td>
            <td class="p-3">
                <div class="font-semibold text-slate-800">${log.task}</div>
                ${log.output ? `<div class="text-[11px] text-slate-500 mt-0.5"><i class="fa-solid fa-award text-amber-500 mr-1"></i>ผลลัพธ์: ${log.output}</div>` : ''}
            </td>
            <td class="p-3 text-center">
                ${log.link ? `<a href="${log.link}" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm" title="เปิดเอกสาร"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : '<span class="text-slate-300">-</span>'}
            </td>
            <td class="p-3 text-center whitespace-nowrap">
                <button onclick="editOjtLog('${log.id}')" class="text-slate-500 hover:text-blue-600 mr-2" title="แก้ไข"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteOjtLog('${log.id}')" class="text-slate-400 hover:text-rose-600" title="ลบ"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function filterOjtLogs() {
    renderOjtTable();
}

function renderOjtChecklist() {
    const container = document.getElementById('ojt-checklist-container');
    if (!container) return;

    container.innerHTML = appState.ojtChecklist.map(chk => `
        <label class="p-3 rounded-xl border ${chk.done ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'} flex items-start space-x-3 cursor-pointer hover:bg-slate-100 transition">
            <input type="checkbox" ${chk.done ? 'checked' : ''} onchange="toggleOjtChecklist('${chk.id}')" class="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500">
            <div>
                <div class="font-bold ${chk.done ? 'text-emerald-900' : 'text-slate-700'}">${chk.title}</div>
                <div class="text-[11px] text-slate-500">${chk.done ? '✓ ตรวจสอบและดำเนินการเรียบร้อยแล้ว' : 'รอดำเนินการให้ครบถ้วน'}</div>
            </div>
        </label>
    `).join('');
}

function toggleOjtChecklist(chkId) {
    const item = appState.ojtChecklist.find(c => c.id === chkId);
    if (!item) return;

    item.done = !item.done;
    saveState();
    renderOjtChecklist();
    showToast('อัปเดตรายการ Checklist เรียบร้อยแล้ว');
}

function openNewOjtModal() {
    document.getElementById('modal-ojt-id').value = '';
    document.getElementById('modal-ojt-title').innerText = 'เพิ่มบันทึกการฝึกปฏิบัติงานจริง (OJT)';
    document.getElementById('modal-ojt-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-ojt-hours').value = 8;
    document.getElementById('modal-ojt-dimension').value = '1';
    document.getElementById('modal-ojt-task').value = '';
    document.getElementById('modal-ojt-output').value = '';
    document.getElementById('modal-ojt-link').value = '';

    openModal('modal-ojt');
}

function editOjtLog(logId) {
    const log = appState.ojtLogs.find(l => l.id === logId);
    if (!log) return;

    document.getElementById('modal-ojt-id').value = log.id;
    document.getElementById('modal-ojt-title').innerText = 'แก้ไขบันทึกการฝึกปฏิบัติงานจริง (OJT)';
    document.getElementById('modal-ojt-date').value = log.date;
    document.getElementById('modal-ojt-hours').value = log.hours;
    document.getElementById('modal-ojt-dimension').value = log.dimension;
    document.getElementById('modal-ojt-task').value = log.task;
    document.getElementById('modal-ojt-output').value = log.output || '';
    document.getElementById('modal-ojt-link').value = log.link || '';

    openModal('modal-ojt');
}

function saveOjtFromModal() {
    const logId = document.getElementById('modal-ojt-id').value;
    const date = document.getElementById('modal-ojt-date').value;
    const hours = parseFloat(document.getElementById('modal-ojt-hours').value) || 0;
    const dimension = document.getElementById('modal-ojt-dimension').value;
    const task = document.getElementById('modal-ojt-task').value.trim();
    const output = document.getElementById('modal-ojt-output').value.trim();
    const link = document.getElementById('modal-ojt-link').value.trim();

    const dimNames = {
        '1': 'งานวิเคราะห์ข้อมูลและสารสนเทศ',
        '2': 'งานเอกสารราชการและสารบรรณ',
        '3': 'งานเทคนิค ระบบ และการพัฒนา',
        '4': 'งานประสานงาน บริการ และสื่อสาร'
    };

    if (logId) {
        // Edit existing
        const existing = appState.ojtLogs.find(l => l.id === logId);
        if (existing) {
            existing.date = date;
            existing.hours = hours;
            existing.dimension = dimension;
            existing.dimensionName = dimNames[dimension];
            existing.task = task;
            existing.output = output;
            existing.link = link;
        }
    } else {
        // Create new
        const newLog = {
            id: `OJT-${Date.now().toString().slice(-4)}`,
            date,
            hours,
            dimension,
            dimensionName: dimNames[dimension],
            task,
            output,
            link
        };
        appState.ojtLogs.push(newLog);
    }

    saveState();
    closeModal('modal-ojt');
    renderOjtTable();
    showToast('บันทึกข้อมูล OJT เรียบร้อยแล้ว');
}

function deleteOjtLog(logId) {
    if (!confirm('คุณต้องการลบรายการฝึกงานนี้ใช่หรือไม่?')) return;
    appState.ojtLogs = appState.ojtLogs.filter(l => l.id !== logId);
    saveState();
    renderOjtTable();
    showToast('ลบรายการฝึกงานเรียบร้อยแล้ว');
}

// --------------------------------------------------------------------------
// 7. M4: AI Magic Polish & R-C-T-F Engine
// --------------------------------------------------------------------------
function runAiPolish() {
    const raw = (document.getElementById('ai-raw-input')?.value || '').trim();
    const outEl = document.getElementById('ai-polished-output');
    if (!raw) {
        alert('กรุณากรอกข้อความเบื้องต้นที่ต้องการให้ AI ช่วยขัดเกลา');
        return;
    }

    // Transform into standard 3-paragraph Official Civil Service Memo Structure
    const p1 = `๑. ความเป็นมา: ด้วยข้าพเจ้าได้ดำเนินภารกิจในความรับผิดชอบตามแผนงาน โดยได้ดำเนินการ${raw.slice(0, 80)}... ซึ่งมีความสำคัญต่อการเพิ่มประสิทธิภาพการปฏิบัติราชการ`;
    const p2 = `๒. การดำเนินงาน: ในการนี้ ข้าพเจ้าได้ประสานงานและประยุกต์ใช้เทคโนโลยีดิจิทัลในการปฏิบัติงานอย่างเป็นระบบ โดยคำนึงถึงความถูกต้องตามระเบียบ ความมั่นคงปลอดภัย และการรักษาความลับของทางราชการอย่างเคร่งครัด`;
    const p3 = `๓. ข้อพิจารณาและประโยชน์: ผลจากการดำเนินงานดังกล่าว ส่งผลให้การปฏิบัติงานมีความรวดเร็ว ถูกต้อง แม่นยำ และสามารถนำข้อมูลไปใช้ประกอบการตัดสินใจเชิงนโยบายของหน่วยงานได้อย่างมีประสิทธิภาพสูงสุด`;

    const fullResult = `${p1}\n\n${p2}\n\n${p3}`;
    if (outEl) {
        outEl.innerText = fullResult;
    }
    showToast('ขัดเกลาเป็นภาษาราชการ 3 ย่อหน้าเรียบร้อยแล้ว');
}

function generateVideoScript(theme) {
    const container = document.getElementById('video-script-timeline');
    if (!container) return;

    const p = appState.userProfile;
    let hook = "", story = "", impact = "", cta = "";

    if (theme === 'profile') {
        hook = `(0-5s Hook) "สวัสดีครับ ผม ${p.fullName} ผู้พร้อมนำทักษะดิจิทัลและ AI มาขับเคลื่อนบริการภาครัฐสู่ประชาชน"`;
        story = `(5-15s Story) "ตลอดการฝึกอบรม 13 วัน และการฝึก OJT ${appState.userProfile.ojtAgency} ผมได้พัฒนาตนเองครบ 4 ด้าน ทั้งงานสารบรรณและการพัฒนาระบบ"`;
        impact = `(15-25s Impact) "ผลงานที่ภาคภูมิใจคือการพัฒนากระบวนการจัดการข้อมูลอัตโนมัติ ช่วยลดเวลาการทำงานได้จริงและมีความโปร่งใส"`;
        cta = `(25-30s CTA) "พร้อมแล้วที่จะนำศักยภาพทั้งหมดมาร่วมสร้างสรรค์ประโยชน์สูงสุดให้แก่องค์กรภาครัฐครับ"`;
    } else if (theme === 'ojt') {
        hook = `(0-5s Hook) "90 ชั่วโมงแห่งการลงมือปฏิบัติจริง ที่เปลี่ยนโจทย์ราชการเป็นนวัตกรรมดิจิทัลที่จับต้องได้"`;
        story = `(5-15s Story) "ผมได้ร่วมวิเคราะห์ฐานข้อมูล ร่างเอกสารราชการ และเขียนสคริปต์ตรวจสอบข้อมูลให้แก่หน่วยงาน OJT"`;
        impact = `(15-25s Impact) "สร้างผลลัพธ์เป็นเอกสาร Data Dictionary และระบบอัตโนมัติที่ช่วยให้เพื่อนร่วมงานทำงานได้เร็วขึ้น"`;
        cta = `(25-30s CTA) "ความมุ่งมั่นและความพร้อมเต็มร้อย เพื่อการเติบโตในสายงานราชการอย่างยั่งยืน"`;
    } else {
        hook = `(0-5s Hook) "ก้าวทันยุค AI ภาครัฐ ด้วยการประยุกต์ใช้ Prompt Engineering R-C-T-F อย่างปลอดภัย"`;
        story = `(5-15s Story) "เรียนรู้การใช้ AI ช่วยงานสารบรรณ การวิเคราะห์ข้อมูล และการสร้างสื่อสารสนเทศตามหลักธรรมาภิบาล"`;
        impact = `(15-25s Impact) "ผลักดันให้หน่วยงานมีเครื่องมือดิจิทัลที่ทุกคนเข้าถึงได้ (Universal Accessibility)"`;
        cta = `(25-30s CTA) "ร่วมขับเคลื่อนองค์กรสู่ Smart Government ไปด้วยกันครับ"`;
    }

    container.innerHTML = `
        <div class="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <span class="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded">0-5 วินาที</span>
            <div class="font-bold text-xs text-govNavy mt-1">1. Hook ดึงดูดความสนใจ</div>
            <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">${hook}</p>
        </div>
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span class="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">5-15 วินาที</span>
            <div class="font-bold text-xs text-govNavy mt-1">2. Story เล่าเรื่อง & ประสบการณ์</div>
            <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">${story}</p>
        </div>
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span class="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">15-25 วินาที</span>
            <div class="font-bold text-xs text-govNavy mt-1">3. Impact ผลลัพธ์ & ชิ้นงาน</div>
            <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">${impact}</p>
        </div>
        <div class="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <span class="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded">25-30 วินาที</span>
            <div class="font-bold text-xs text-govNavy mt-1">4. CTA สรุป & สร้างความประทับใจ</div>
            <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">${cta}</p>
        </div>
    `;
}

function setupRctfPromptListener() {
    ['rctf-role', 'rctf-context', 'rctf-task', 'rctf-format'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateRctfPrompt);
    });
}

function updateRctfPrompt() {
    const role = getInputValue('rctf-role') || "ผู้เชี่ยวชาญด้านระบบสารสนเทศภาครัฐ";
    const context = getInputValue('rctf-context') || "หลักสูตรเตรียมความพร้อมสำหรับการจ้างงานคนพิการในหน่วยงานภาครัฐ";
    const task = getInputValue('rctf-task') || "สรุปรายงานผลการปฏิบัติงาน 4 ด้าน";
    const format = getInputValue('rctf-format') || "บันทึกข้อความราชการ 3 ย่อหน้า";

    const promptText = `[ROLE]: คุณคือ ${role}\n[CONTEXT]: ${context}\n[TASK]: ${task}\n[FORMAT]: ${format}\n[CONSTRAINTS]: ใช้ภาษาราชการที่เป็นทางการ ถูกต้องตามระเบียบงานสารบรรณ และไม่มีการเปิดเผยข้อมูลส่วนบุคคลที่เป็นความลับ (PDPA Strict)`;

    const preEl = document.getElementById('rctf-generated-prompt');
    if (preEl) preEl.innerText = promptText;
}

function copyPromptRCTF() {
    const text = document.getElementById('rctf-generated-prompt')?.innerText;
    if (text) {
        navigator.clipboard.writeText(text);
        showToast('คัดลอก Prompt มาตรฐาน R-C-T-F แล้ว');
    }
}

// --------------------------------------------------------------------------
// 8. M5: Drive & Artifacts Storage (+ Alt-Text)
// --------------------------------------------------------------------------
function renderArtifactsGrid() {
    const grid = document.getElementById('artifacts-grid-container');
    if (!grid) return;

    if (appState.artifacts.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 bg-slate-50 rounded-xl">ยังไม่มีผลงานในคลัง กรุณากดปุ่มเพิ่มภาพผลงาน</div>`;
        return;
    }

    grid.innerHTML = appState.artifacts.map(art => `
        <div class="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div class="relative h-36 bg-slate-100 overflow-hidden">
                <img src="${art.link}" alt="${art.altText}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&auto=format&fit=crop&q=60'">
                <span class="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    ${art.category === 'TRAINING_13DAYS' ? 'อบรม 13 วัน' : art.category === 'OJT_WORK' ? 'ฝึกงาน OJT' : 'เกียรติบัตร'}
                </span>
            </div>
            <div class="p-3 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                    <h4 class="font-bold text-xs text-govNavy line-clamp-2">${art.title}</h4>
                    <div class="mt-1 p-1.5 bg-slate-50 rounded border border-slate-200 text-[10px] text-slate-600">
                        <strong class="text-slate-800">Alt-Text:</strong> ${art.altText}
                    </div>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                    <a href="${art.link}" target="_blank" class="text-blue-600 hover:underline">
                        <i class="fa-solid fa-up-right-from-square mr-1"></i>เปิดดู
                    </a>
                    <button onclick="deleteArtifact('${art.id}')" class="text-rose-500 hover:text-rose-700 font-bold">
                        <i class="fa-solid fa-trash mr-1"></i>ลบ
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openNewArtifactModal() {
    document.getElementById('modal-art-title').value = '';
    document.getElementById('modal-art-category').value = 'TRAINING_13DAYS';
    document.getElementById('modal-art-alt').value = '';
    document.getElementById('modal-art-link').value = '';
    openModal('modal-artifact');
}

function saveArtifactFromModal() {
    const title = document.getElementById('modal-art-title').value.trim();
    const category = document.getElementById('modal-art-category').value;
    const altText = document.getElementById('modal-art-alt').value.trim();
    let link = document.getElementById('modal-art-link').value.trim();

    if (!title || !altText) {
        alert('กรุณากรอกชื่อผลงานและ Alt-Text ให้ครบถ้วน');
        return;
    }

    if (!link) {
        link = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&auto=format&fit=crop&q=60';
    }

    const newArt = {
        id: `ART-${Date.now().toString().slice(-4)}`,
        title,
        category,
        altText,
        link
    };

    appState.artifacts.push(newArt);
    saveState();
    closeModal('modal-artifact');
    renderArtifactsGrid();
    showToast('เพิ่มหลักฐานผลงานเข้าคลังเรียบร้อยแล้ว');
}

function deleteArtifact(artId) {
    if (!confirm('คุณต้องการลบรายการสื่อนี้ใช่หรือไม่?')) return;
    appState.artifacts = appState.artifacts.filter(a => a.id !== artId);
    saveState();
    renderArtifactsGrid();
    showToast('ลบรายการผลงานเรียบร้อยแล้ว');
}

// --------------------------------------------------------------------------
// 9. M6: Portfolio Master Exporter (7 Pages Rendering)
// --------------------------------------------------------------------------
function renderPortfolioPreview() {
    const p = appState.userProfile;

    // Page 1: Cover
    setText('pv-p1-name', p.fullName);
    setText('pv-p1-track', `สายหลักสูตร: ${p.trackName || (p.track === 'ADV' ? 'Advanced AI & Automation' : 'Foundation Digital Skills')}`);
    setText('pv-p1-position', `ตำแหน่ง: ${p.position}`);
    setText('pv-p1-org', `สังกัด: ${p.organization}`);

    // Page 2: Profile & Vision
    setText('pv-p2-name', p.fullName);
    setText('pv-p2-position-org', `${p.position} / ${p.organization}`);
    setText('pv-p2-contact', `อีเมล: ${p.email} | โทร: ${p.phone}`);
    setText('pv-p2-ojt-agency', p.ojtAgency);
    setText('pv-p2-accessibility', p.accessibilityNeeds || 'ไม่มี');
    setText('pv-p2-vision', p.vision);

    // Page 3: Experiences
    const expList = document.getElementById('pv-p3-experience-list');
    if (expList) {
        expList.innerHTML = (p.experiences || []).map(exp => `
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-govNavy text-sm">${exp.role}</h4>
                    <span class="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">${exp.period}</span>
                </div>
                <div class="text-xs text-slate-600 font-semibold mt-0.5">${exp.agency}</div>
                <p class="text-slate-600 text-xs mt-1.5 leading-relaxed">${exp.desc}</p>
            </div>
        `).join('');
    }

    // Page 4: Skills
    const hardContainer = document.getElementById('pv-p4-hard-skills');
    const softContainer = document.getElementById('pv-p4-soft-skills');
    if (hardContainer) {
        hardContainer.innerHTML = (p.hardSkills || []).map(s => `<span class="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-lg font-medium">${s}</span>`).join('');
    }
    if (softContainer) {
        softContainer.innerHTML = (p.softSkills || []).map(s => `<span class="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-medium">${s}</span>`).join('');
    }

    // Page 5: 13-day summary
    const p5AttStat = document.getElementById('pv-p5-attendance-stat');
    const presentDays = appState.attendance.filter(a => a.status === 'PRESENT' || a.status === 'ONLINE').length;
    if (p5AttStat) p5AttStat.innerText = `${presentDays}/13 วัน (${Math.round((presentDays / 13) * 100)}%)`;

    const schedContainer = document.getElementById('pv-p5-schedule-summary');
    if (schedContainer) {
        schedContainer.innerHTML = appState.attendance.map(a => `
            <div class="py-2 flex items-start justify-between gap-2">
                <div>
                    <span class="font-bold text-slate-800">วันที่ ${a.day}: ${a.title}</span>
                    <p class="text-[11px] text-slate-500 line-clamp-1">${a.reflection || '-'}</p>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded ${a.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'} shrink-0">
                    ${a.status === 'PRESENT' ? 'เข้าเรียน' : 'ขาด/ลา'}
                </span>
            </div>
        `).join('');
    }

    // Page 6: OJT summary table
    let totalHrs = 0;
    appState.ojtLogs.forEach(l => totalHrs += (parseFloat(l.hours) || 0));
    const p6HrsStat = document.getElementById('pv-p6-hours-stat');
    if (p6HrsStat) p6HrsStat.innerText = `${totalHrs}/90 ชั่วโมง (บรรลุเกณฑ์)`;

    const ojtTableContainer = document.getElementById('pv-p6-ojt-summary-table');
    if (ojtTableContainer) {
        ojtTableContainer.innerHTML = `
            <table class="w-full text-xs text-left border-collapse">
                <thead>
                    <tr class="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <th class="p-2 font-bold">วันที่</th>
                        <th class="p-2 font-bold">ด้านงาน (4 ด้าน)</th>
                        <th class="p-2 font-bold text-center">ชั่วโมง</th>
                        <th class="p-2 font-bold">ภารกิจและผลสัมฤทธิ์</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    ${appState.ojtLogs.map(log => `
                        <tr>
                            <td class="p-2 whitespace-nowrap text-slate-600">${log.date}</td>
                            <td class="p-2 whitespace-nowrap font-bold text-govNavy">${log.dimensionName}</td>
                            <td class="p-2 text-center font-bold text-emerald-700">${log.hours} ชม.</td>
                            <td class="p-2 text-slate-700">${log.task} (${log.output || 'เอกสารผลงาน'})</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Page 7: Sign-off
    setText('pv-p7-sign-name', p.fullName);
}

function copyFullPortfolioText() {
    const p = appState.userProfile;
    let text = `=== แฟ้มสะสมผลงานดิจิทัล (PORTFOLIO 7 หน้า) ===\n`;
    text += `ผู้จัดทำ: ${p.fullName} (${p.position})\n`;
    text += `สังกัด: ${p.organization} | OJT: ${p.ojtAgency}\n\n`;
    text += `[วิสัยทัศน์]:\n${p.vision}\n\n`;
    text += `[ทักษะความเชี่ยวชาญ]:\n- Hard Skills: ${(p.hardSkills || []).join(', ')}\n- Soft Skills: ${(p.softSkills || []).join(', ')}\n\n`;
    text += `[สถิติการฝึกอบรม 13 วัน เซ็นทารา ไลฟ์]:\nเข้าเรียน ${appState.attendance.filter(a => a.status === 'PRESENT').length}/13 วัน\n\n`;
    text += `[ผลการฝึกปฏิบัติงานจริง OJT]:\nชั่วโมงรวม: ${appState.ojtLogs.reduce((acc, cur) => acc + (parseFloat(cur.hours) || 0), 0)} ชั่วโมง\n`;

    navigator.clipboard.writeText(text);
    showToast('คัดลอกข้อความ Portfolio ทั้งหมดสำหรับวางใน Canva/Word แล้ว');
}

// --------------------------------------------------------------------------
// 10. M7: Accessibility, Voice Input & PDPA Storage
// --------------------------------------------------------------------------
function setTheme(themeName) {
    document.body.classList.remove('theme-dynamic', 'theme-slate', 'theme-contrast');
    document.body.classList.add(themeName);

    ['btn-theme-dynamic', 'btn-theme-slate', 'btn-theme-contrast'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.classList.remove('bg-white/20', 'text-white');
            btn.classList.add('text-slate-300');
        }
    });

    const activeBtn = document.getElementById(`btn-${themeName.replace('theme-', 'theme-')}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-white/20', 'text-white');
        activeBtn.classList.remove('text-slate-300');
    }
}

function setFontSize(sizeClass) {
    document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.body.classList.add(sizeClass);

    ['btn-font-normal', 'btn-font-large', 'btn-font-xlarge'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.classList.remove('bg-white/20', 'text-white');
            btn.classList.add('text-slate-300');
        }
    });

    const activeBtn = document.getElementById(`btn-${sizeClass.replace('font-', 'font-')}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-white/20', 'text-white');
        activeBtn.classList.remove('text-slate-300');
    }
}

function startVoiceInput(targetId) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('เบราว์เซอร์นี้ยังไม่รองรับ Web Speech API กรุณาใช้งานบน Chrome หรือ Edge');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'th-TH';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    showToast('กำลังฟังเสียงพูดของคุณ... กรุณาพูดข้อความ');

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.value = (targetEl.value ? targetEl.value + " " : "") + transcript;
            showToast(`พิมพ์ด้วยเสียงสำเร็จ: "${transcript.slice(0, 30)}..."`);
        }
    };

    recognition.onerror = (event) => {
        console.warn('Speech recognition error', event.error);
        showToast('เกิดข้อผิดพลาดในการฟังเสียง หรือไม่ได้ให้สิทธิ์ไมโครโฟน');
    };

    recognition.start();
}

function exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `civil_servant_trainee_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('ดาวน์โหลดไฟล์สำรองข้อมูล JSON เรียบร้อยแล้ว');
}

function importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            appState = { ...defaultAppData, ...parsed };
            saveState();
            renderAllViews();
            showToast('นำเข้าข้อมูลสำรองเรียบร้อยแล้ว');
        } catch (err) {
            alert('ไฟล์ JSON ไม่ถูกต้องหรือไม่ตรงตามรูปแบบ');
        }
    };
    reader.readAsText(file);
}

function resetAllDataToDefaults() {
    if (!confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่? (ข้อมูลที่บันทึกไว้จะถูกล้าง)')) return;
    localStorage.removeItem(STORAGE_KEY);
    appState = JSON.parse(JSON.stringify(defaultAppData));
    saveState();
    renderAllViews();
    showToast('รีเซ็ตข้อมูลทั้งหมดเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
}

// --------------------------------------------------------------------------
// 11. Navigation Tab Switching & Modals Helper
// --------------------------------------------------------------------------
function switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });

    const targetPanel = document.getElementById(`tab-${tabId}`);
    const targetNav = document.getElementById(`nav-${tabId}`);

    if (targetPanel) targetPanel.classList.remove('hidden');
    if (targetNav) {
        targetNav.classList.add('active');
        targetNav.setAttribute('aria-selected', 'true');
    }

    if (tabId === 'm6') {
        renderPortfolioPreview();
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3200);
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text || '';
}

function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        navigator.clipboard.writeText(el.innerText);
        showToast('คัดลอกข้อความลงคลิปบอร์ดแล้ว');
    }
}
