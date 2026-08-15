/* ==========================================================================
   Civil Servant Trainee Learning & Portfolio Management System (app.js)
   Complies with Local-First JSON Storage, WCAG 2.1 AA & Official Thai Govt Standard
   ========================================================================== */

const STORAGE_KEY = 'civil_servant_trainee_app_v2';
const PARTICIPANTS_STORAGE_KEY = 'participants_gemini_ai_data';
let activeScheduleFilter = 'AUTO'; // 'AUTO', 'ADV', 'FND', 'BOTH'
let currentParticipantView = 'table'; // 'table', 'card', 'analytics'
let filteredParticipantsData = [];
let deleteTargetParticipantId = null;
let lastExecSummaryText = '';

// Chart.js Instances
let interestChartInstance = null;
let courseChartInstance = null;

// --------------------------------------------------------------------------
// 1. Initial Default Seed Data (Authentic 13-Day Centara Life Schedule + Trainees)
// --------------------------------------------------------------------------
const initialMasterParticipants = [
    { id: 1, cardNo: "CARD-001", courseType: "Advanced Course", courseNo: "ADV-01", name: "สุริยา ชูวิลัย", nickname: "อาร์ม", province: "สุราษฎร์ธานี", interests: "พัฒนาทักษะดิจิทัลและการปฏิบัติงานสำนักงานอย่างมืออาชีพ เพื่อความมั่นคงในอาชีพ", categories: ["งานราชการ/ความมั่นคง", "พัฒนาตนเอง"] },
    { id: 2, cardNo: "CARD-002", courseType: "Foundation Course", courseNo: "FND-01", name: "ยศกร บุญจันทร์", nickname: "แม็ก / โนอาห์", province: "กทม.", interests: "คอสเพลย์, รถเมล์/รถไฟ, สเกิลขนส่งมวลชน", categories: ["ความบันเทิง/งานอดิเรก", "พัฒนาตนเอง"] },
    { id: 3, cardNo: "CARD-003", courseType: "Advanced Course", courseNo: "ADV-02", name: "สุรสิทธิ์ ปานทอง", nickname: "ตั๊ก", province: "น่าน", interests: "ทำอาหาร, เกม, หางานทำมั่นคง", categories: ["เกม/ไอที", "งานราชการ/ความมั่นคง"] },
    { id: 4, cardNo: "CARD-004", courseType: "Advanced Course", courseNo: "ADV-03", name: "ธนภัทร จาดดี", nickname: "แคท / ต๊าก", province: "ไม่ระบุ", interests: "คอมพิวเตอร์, ทำอาหาร, งานผู้ช่วยเภสัช", categories: ["คอมพิวเตอร์/AI", "งานธุรการ/เอกสาร"] },
    { id: 5, cardNo: "CARD-005", courseType: "Advanced Course", courseNo: "ADV-04", name: "ชัยยุทธ ผอมมี", nickname: "ต้อม", province: "ขอนแก่น", interests: "เกมคอมพิวเตอร์, งานราชการเพื่อครอบครัว", categories: ["เกม/ไอที", "งานราชการ/ความมั่นคง"] },
    { id: 6, cardNo: "CARD-006", courseType: "Foundation Course", courseNo: "FND-02", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "นิว", province: "นครปฐม", interests: "อ่านหนังสือ, รัฐศาสตร์, พัฒนาบุคลากร", categories: ["งานราชการ/ความมั่นคง", "พัฒนาตนเอง"] },
    { id: 7, cardNo: "CARD-007", courseType: "Foundation Course", courseNo: "FND-03", name: "พัชรกาย์ หงษ์นพพัทธ์", nickname: "นิว", province: "กทม. (หนองจอก)", interests: "นายหน้าติดต่อ, งานที่มั่นคง", categories: ["งานราชการ/ความมั่นคง", "พัฒนาตนเอง"] },
    { id: 8, cardNo: "CARD-008", courseType: "Foundation Course", courseNo: "FND-04", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "จ๋า", province: "นนทบุรี", interests: "ฟังเพลง, สกิลใหม่ๆ ไปประกอบอาชีพ", categories: ["ศิลปะ/ดนตรี/นิยาย", "พัฒนาตนเอง"] },
    { id: 9, cardNo: "CARD-009", courseType: "Advanced Course", courseNo: "ADV-05", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "จั๊ม", province: "กทม.", interests: "คอมพิวเตอร์, หางานทำ", categories: ["คอมพิวเตอร์/AI", "พัฒนาตนเอง"] },
    { id: 10, cardNo: "CARD-010", courseType: "Foundation Course", courseNo: "FND-05", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "น้ำเพชร", province: "นนทบุรี", interests: "ฟังเพลง, พอดแคสต์พัฒนาตนเอง, เรียนต่อ", categories: ["ศิลปะ/ดนตรี/นิยาย", "พัฒนาตนเอง"] },
    { id: 11, cardNo: "CARD-011", courseType: "Foundation Course", courseNo: "FND-06", name: "ว่าที่ร้อยตรี ปึ้มจิต นิสสราพงศ์", nickname: "ปึ้ม", province: "กทม.", interests: "วาดรูป, งานระยะยาวเลี้ยงชีพ", categories: ["ศิลปะ/ดนตรี/นิยาย", "งานราชการ/ความมั่นคง"] },
    { id: 12, cardNo: "CARD-012", courseType: "Foundation Course", courseNo: "FND-07", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "นัท", province: "กทม.", interests: "กีฬา, ความแข็งแรง, แนวคิดใหม่ๆ", categories: ["กีฬา/สุขภาพ", "พัฒนาตนเอง"] },
    { id: 13, cardNo: "CARD-013", courseType: "Advanced Course", courseNo: "ADV-06", name: "ภรณี ปัญญาแจ่ม", nickname: "พี่แอ๋น", province: "นนทบุรี", interests: "เจ้าแม่อีเวนต์กีฬา, เรียนรู้ระบบราชการ", categories: ["กีฬา/สุขภาพ", "งานราชการ/ความมั่นคง"] },
    { id: 14, cardNo: "CARD-014", courseType: "Advanced Course", courseNo: "ADV-07", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "เมย์", province: "เชียงใหม่", interests: "เทคโนโลยีใหม่ๆ, นำทักษะไปใช้ทำงาน", categories: ["คอมพิวเตอร์/AI", "พัฒนาตนเอง"] },
    { id: 15, cardNo: "CARD-015", courseType: "Foundation Course", courseNo: "FND-08", name: "เสริฐพงษ์", nickname: "เจ", province: "กทม.", interests: "เลี้ยงปลาสวยงาม, สกิลการทำงาน", categories: ["ความบันเทิง/งานอดิเรก", "พัฒนาตนเอง"] },
    { id: 16, cardNo: "CARD-016", courseType: "Foundation Course", courseNo: "FND-09", name: "อัครโชติ ชูประดิษฐ์", nickname: "เอ็ม", province: "ไม่ระบุ", interests: "ทำเพลง, เล่นดนตรี, ทำคลิปวิดีโอ", categories: ["ศิลปะ/ดนตรี/นิยาย", "พัฒนาตนเอง"] },
    { id: 17, cardNo: "CARD-017", courseType: "Foundation Course", courseNo: "FND-10", name: "ยศสิริ คำชั่งข้าว", nickname: "เกื้อ", province: "ลำพูน", interests: "พัฒนาตนเอง, งานราชการและเอกชน", categories: ["พัฒนาตนเอง", "งานราชการ/ความมั่นคง"] },
    { id: 18, cardNo: "CARD-018", courseType: "Advanced Course", courseNo: "ADV-08", name: "ก้าน ชยานันท์ ยะติ๊บ", nickname: "ก้าน", province: "ฉะเชิงเทรา", interests: "เล่นเกม, ขายของ, ความมั่นคงช่วยครอบครัว", categories: ["เกม/ไอที", "งานราชการ/ความมั่นคง"] },
    { id: 19, cardNo: "CARD-019", courseType: "Advanced Course", courseNo: "ADV-09", name: "จิรวรรณ สินพรหมเทศ", nickname: "พลอย", province: "ไม่ระบุ", interests: "เล่นเกม, นิยาย, ฟังเพลง, สกิลใหม่ๆ", categories: ["เกม/ไอที", "ศิลปะ/ดนตรี/นิยาย"] },
    { id: 20, cardNo: "CARD-020", courseType: "Foundation Course", courseNo: "FND-11", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "นิว", province: "ไม่ระบุ", interests: "อ่านหนังสือภาษาต่างประเทศ", categories: ["พัฒนาตนเอง"] },
    { id: 21, cardNo: "CARD-021", courseType: "Foundation Course", courseNo: "FND-12", name: "ณัชพล สุขสงวน", nickname: "พจน์", province: "ไม่ระบุ", interests: "การเมือง, ทำเพจ/อินฟลูเอนเซอร์", categories: ["พัฒนาตนเอง", "ศิลปะ/ดนตรี/นิยาย"] },
    { id: 22, cardNo: "CARD-022", courseType: "Advanced Course", courseNo: "ADV-10", name: "กัญจิรา กิจเชง", nickname: "เจน", province: "กทม.", interests: "นิยายออนไลน์, เกม, เทคโนโลยี AI", categories: ["คอมพิวเตอร์/AI", "เกม/ไอที", "ศิลปะ/ดนตรี/นิยาย"] },
    { id: 23, cardNo: "CARD-023", courseType: "Foundation Course", courseNo: "FND-13", name: "ภควัต เดชะอุดม", nickname: "ไพ", province: "กทม.", interests: "งานเอกสาร, งานธุรการ, รายได้ดูแลตนเอง", categories: ["งานธุรการ/เอกสาร", "พัฒนาตนเอง"] },
    { id: 24, cardNo: "CARD-024", courseType: "Foundation Course", courseNo: "FND-14", name: "อ้น ลาภเกียรติศิริ", nickname: "อ้น", province: "กทม. (พระราม 2)", interests: "ท่องเที่ยว, ดูหนัง, ทักษะอาชีพใหม่", categories: ["ความบันเทิง/งานอดิเรก", "พัฒนาตนเอง"] },
    { id: 25, cardNo: "CARD-025", courseType: "Advanced Course", courseNo: "ADV-11", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "นุก", province: "นครราชสีมา", interests: "เขียนโปรแกรม, โค้ดดิ้ง, สร้าง AI", categories: ["คอมพิวเตอร์/AI"] },
    { id: 26, cardNo: "CARD-026", courseType: "Foundation Course", courseNo: "FND-15", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "พลอย", province: "กทม.", interests: "วาดรูป, แต่งนิยายขาย, ออกแบบคาแรกเตอร์", categories: ["ศิลปะ/ดนตรี/นิยาย"] },
    { id: 27, cardNo: "CARD-027", courseType: "Advanced Course", courseNo: "ADV-12", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "ปลื้ม", province: "กทม.", interests: "คอมพิวเตอร์, ฟังเพลง, พัฒนาทักษะ", categories: ["คอมพิวเตอร์/AI", "ศิลปะ/ดนตรี/นิยาย"] },
    { id: 28, cardNo: "CARD-028", courseType: "Foundation Course", courseNo: "FND-16", name: "ภูวดล สุวรรณธาดา", nickname: "ไอ้โต้ง", province: "ไม่ระบุ", interests: "ด้านพัฒนาสังคม, ทักษะงานภาครัฐ", categories: ["งานราชการ/ความมั่นคง", "พัฒนาตนเอง"] },
    { id: 29, cardNo: "CARD-029", courseType: "Foundation Course", courseNo: "FND-17", name: "พัชรดนัย", nickname: "แบม", province: "ไม่ระบุ", interests: "ดูหนัง, ฟังเพลง, รายได้ช่วยครอบครัว", categories: ["ความบันเทิง/งานอดิเรก", "ศิลปะ/ดนตรี/นิยาย"] },
    { id: 30, cardNo: "CARD-030", courseType: "Advanced Course", courseNo: "ADV-13", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "ไฮ้", province: "ไม่ระบุ", interests: "เล่นเกม, งานหารายได้ช่วยพ่อแม่", categories: ["เกม/ไอที", "พัฒนาตนเอง"] },
    { id: 31, cardNo: "CARD-031", courseType: "Foundation Course", courseNo: "FND-18", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "ซิง", province: "กทม.", interests: "ท่องเที่ยว, ดูบอล, ทำคลิปท่องเที่ยว", categories: ["ความบันเทิง/งานอดิเรก", "กีฬา/สุขภาพ"] },
    { id: 32, cardNo: "CARD-032", courseType: "Advanced Course", courseNo: "ADV-14", name: "นงชุดา ศิริโชควัฒนานันท์", nickname: "ไม่ระบุ", province: "กทม.", interests: "คอมพิวเตอร์, กีฬา, รับราชการ", categories: ["คอมพิวเตอร์/AI", "งานราชการ/ความมั่นคง", "กีฬา/สุขภาพ"] },
    { id: 33, cardNo: "CARD-033", courseType: "Advanced Course", courseNo: "ADV-15", name: "พิมลพรรณ บุญแก้ว", nickname: "พิม", province: "ไม่ระบุ", interests: "คอมพิวเตอร์, เทคโนโลยีใหม่ๆ", categories: ["คอมพิวเตอร์/AI"] },
    { id: 34, cardNo: "CARD-034", courseType: "Advanced Course", courseNo: "ADV-16", name: "ศุภกร สุขหน้า", nickname: "ติ๊ก", province: "นครสวรรค์", interests: "เทคโนโลยี AI, ความรู้อนาคต", categories: ["คอมพิวเตอร์/AI"] },
    { id: 35, cardNo: "CARD-035", courseType: "Foundation Course", courseNo: "FND-19", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "เอ๋", province: "ศรีสะเกษ", interests: "จัดการเอกสาร, บรรจุข้อมูล, งานภาครัฐ", categories: ["งานธุรการ/เอกสาร", "งานราชการ/ความมั่นคง"] },
    { id: 36, cardNo: "CARD-036", courseType: "Foundation Course", courseNo: "FND-20", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "ม่อน", province: "นนทบุรี", interests: "ท่องเที่ยว, กีฬา, มุมมองงานราชการ", categories: ["ความบันเทิง/งานอดิเรก", "กีฬา/สุขภาพ", "งานราชการ/ความมั่นคง"] },
    { id: 37, cardNo: "CARD-037", courseType: "Foundation Course", courseNo: "FND-21", name: "ไม่ระบุชื่อ-นามสกุล", nickname: "อ๋อม", province: "กทม.", interests: "อ่านหนังสือแนวลึกลับ, หางานทำ", categories: ["พัฒนาตนเอง", "ความบันเทิง/งานอดิเรก"] }
];

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
            actionPlan: "ยึดมั่นในวินัยและจรรยาบรรณวิชาชีพ พร้อมเปิดรับการเรียนรู้ตลอด 13 วัน",
            preTestUrl: "",
            preTestScore: 8,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "",
            docTitle: "เอกสารปฐมนิเทศและคู่มือหลักสูตร.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "นำกรอบคิด Agile มาปรับใช้ในการวางแผนพัฒนาระบบไอทีเพื่อส่งมอบผลงานได้รวดเร็วและตรงจุด",
            preTestUrl: "",
            preTestScore: 7,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 9,
            postTestMax: 10,
            docUrl: "",
            docTitle: "สไลด์ Agile & Digital Workflow.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "จัดทำ Data Visualization เพื่อสนับสนุนการตัดสินใจของผู้บริหารให้ชัดเจน เข้าใจง่าย",
            preTestUrl: "https://forms.gle/9YocowbsaVH1XHBU8",
            preTestScore: 8,
            preTestMax: 10,
            postTestUrl: "https://forms.gle/pXguq9mtYvUzKMzB9",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "https://dg.th/w8t7s3v09o",
            docTitle: "13-8-69 เทคนิคการสื่อสารและสร้างคอนเทนต์ภาครัฐ / สไลด์_Excel_Database_V3.pdf",
            evalUrl: "https://dg.th/9lh134n27b",
            evalSubmitted: true
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
            actionPlan: "นำ Prompt Engineering มาเพิ่มความเร็วในการสืบค้นและสรุปข้อมูลรายงานภาครัฐอย่างปลอดภัย",
            preTestUrl: "https://forms.gle/eDgmSY5FBeUEac6q7",
            preTestScore: 8,
            preTestMax: 10,
            postTestUrl: "https://forms.gle/SzTuFFHS4GzohSVG9",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "https://canva.link/0qr0v3izj7sow8l",
            docTitle: "Canva สไลด์การประยุกต์ใช้ AI ในงานราชการ",
            evalUrl: "https://forms.gle/mLAWR382QyMz5q5P6",
            evalSubmitted: true
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
            actionPlan: "เขียนหนังสือราชการให้ถูกต้องตามระเบียบสารบรรณ 3 ย่อหน้ามาตรฐาน",
            preTestUrl: "",
            preTestScore: 7,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 9,
            postTestMax: 10,
            docUrl: "",
            docTitle: "คู่มือระบบงานสารบรรณอิเล็กทรอนิกส์.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "ใช้ Google Workspace / MS 365 ช่วยเพิ่มประสิทธิภาพการประสานงานภายในทีม",
            preTestUrl: "",
            preTestScore: 8,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "",
            docTitle: "เอกสารปฏิบัติการ Collaboration Tools.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "ออกแบบแดชบอร์ดติดตามสถานะงานบริการประชาชนให้ผู้บริหารเห็นภาพรวมได้ทันที",
            preTestUrl: "",
            preTestScore: 7,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "",
            docTitle: "Workshop Data Warehouse & Dashboard.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "นำจิตวิทยาการบริการมาปรับใช้ในการสื่อสารกับผู้รับบริการทุกกลุ่มอย่างเข้าอกเข้าใจ",
            preTestUrl: "",
            preTestScore: 8,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 9,
            postTestMax: 10,
            docUrl: "",
            docTitle: "สไลด์จิตวิทยาบริการและการบริหารอารมณ์.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "จัดทำ Flowchart ขั้นตอนการรับมือข้อร้องเรียนทางเทคนิคให้แก่ฝ่ายสนับสนุนไอที",
            preTestUrl: "",
            preTestScore: 8,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "",
            docTitle: "Customer Experience in Public Sector.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "นำข้อมูลสถิติการใช้งานระบบมาวิเคราะห์หาจุดติดขัดเพื่อปรับปรุง UX/UI ต่อไป",
            preTestUrl: "",
            preTestScore: 8,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "",
            docTitle: "AI for Academic & Service Improvement.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "พัฒนาระบบ Automate ส่งออกเอกสารสรุปรายสัปดาห์เพื่อลดเวลาการทำงานซ้ำซ้อน",
            preTestUrl: "",
            preTestScore: 9,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "",
            docTitle: "Automation & Analytical Writing.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "ฝึกการบริหารอารมณ์และสร้างบรรยากาศการทำงานที่เกื้อกูลและเป็นมิตร",
            preTestUrl: "",
            preTestScore: 8,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "",
            docTitle: "EQ & SQ Development in Workplace.pdf",
            evalUrl: "",
            evalSubmitted: true
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
            actionPlan: "มุ่งมั่นนำความรู้ทั้งหมดไปประยุกต์ใช้ในการฝึกปฏิบัติงานจริง (OJT) ต่อไป",
            preTestUrl: "",
            preTestScore: 9,
            preTestMax: 10,
            postTestUrl: "",
            postTestScore: 10,
            postTestMax: 10,
            docUrl: "",
            docTitle: "AQ & Final Reflection Summary.pdf",
            evalUrl: "",
            evalSubmitted: true
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
    participants: [...initialMasterParticipants]
};

let appState = JSON.parse(JSON.stringify(defaultAppData));

// --------------------------------------------------------------------------
// 2. Initialization & Lifecycle
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    loadSavedState();
    loadParticipantsData();
    renderAllViews();
    setupRctfPromptListener();
});

function loadSavedState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            appState = { ...defaultAppData, ...parsed };
            // Ensure attendance data includes the updated rich structure & daily action hub properties
            if (parsed.attendance && parsed.attendance.length === 13) {
                appState.attendance = defaultAppData.attendance.map((defDay, idx) => {
                    const saved = parsed.attendance[idx];
                    return {
                        ...defDay,
                        status: saved?.status || defDay.status,
                        reflection: saved?.reflection || defDay.reflection,
                        actionPlan: saved?.actionPlan || defDay.actionPlan,
                        preTestUrl: saved?.preTestUrl || defDay.preTestUrl,
                        preTestScore: saved?.preTestScore !== undefined ? saved.preTestScore : defDay.preTestScore,
                        preTestMax: saved?.preTestMax || defDay.preTestMax,
                        postTestUrl: saved?.postTestUrl || defDay.postTestUrl,
                        postTestScore: saved?.postTestScore !== undefined ? saved.postTestScore : defDay.postTestScore,
                        postTestMax: saved?.postTestMax || defDay.postTestMax,
                        docUrl: saved?.docUrl || defDay.docUrl,
                        docTitle: saved?.docTitle || defDay.docTitle,
                        evalUrl: saved?.evalUrl || defDay.evalUrl,
                        evalSubmitted: saved?.evalSubmitted !== undefined ? saved.evalSubmitted : defDay.evalSubmitted
                    };
                });
            }
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

// --------------------------------------------------------------------------
// 3. UI View Rendering Engine
// --------------------------------------------------------------------------
function renderAllViews() {
    renderUserProfileForm();
    applyParticipantFilters();
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
// 4. M1: Profile Management
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

    const schedActiveTrackLabel = document.getElementById('sched-active-track-label');
    if (schedActiveTrackLabel) {
        schedActiveTrackLabel.innerText = p.track;
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
    renderScheduleList();
    showToast('บันทึกข้อมูลประวัติผู้เข้าอบรมเรียบร้อยแล้ว');
}

// --------------------------------------------------------------------------
// 4.1 M1: Master Trainee Directory, 3-Mode Views, CRUD & AI Studio
// --------------------------------------------------------------------------
const participantAvatarColors = [
    'bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600',
    'bg-emerald-600', 'bg-teal-600', 'bg-amber-600', 'bg-rose-600'
];

function getParticipantAvatarColor(id) {
    return participantAvatarColors[id % participantAvatarColors.length];
}

function loadParticipantsData() {
    try {
        const stored = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
        if (stored) {
            appState.participants = JSON.parse(stored);
        } else if (!appState.participants || appState.participants.length === 0) {
            appState.participants = JSON.parse(JSON.stringify(initialMasterParticipants));
            localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(appState.participants));
        }
    } catch (e) {
        console.warn('Error loading participants data, using defaults', e);
        appState.participants = JSON.parse(JSON.stringify(initialMasterParticipants));
    }
}

function saveParticipantsToStorage() {
    try {
        localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(appState.participants));
        saveState();
        applyParticipantFilters();
    } catch (e) {
        console.error('Error saving participants to storage', e);
    }
}

function switchParticipantView(viewName) {
    currentParticipantView = viewName;

    document.querySelectorAll('.participant-view-content').forEach(el => el.classList.add('hidden'));
    const targetView = document.getElementById(`view-participant-${viewName}`);
    if (targetView) targetView.classList.remove('hidden');

    const filterContainer = document.getElementById('participant-filter-container');
    if (filterContainer) {
        if (viewName === 'analytics') {
            filterContainer.classList.add('hidden');
        } else {
            filterContainer.classList.remove('hidden');
        }
    }

    ['table', 'card', 'analytics'].forEach(v => {
        const btn = document.getElementById(`btn-pview-${v}`);
        if (btn) {
            btn.className = 'pview-btn px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60';
            btn.setAttribute('aria-selected', 'false');
        }
    });

    const activeBtn = document.getElementById(`btn-pview-${viewName}`);
    if (activeBtn) {
        activeBtn.className = 'pview-btn px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-blue-600 text-white shadow-sm';
        activeBtn.setAttribute('aria-selected', 'true');
    }

    if (viewName === 'analytics') {
        renderParticipantAnalytics();
    }
}

function applyParticipantFilters() {
    const query = (document.getElementById('participantSearchInput')?.value || '').trim().toLowerCase();
    const courseFilter = document.getElementById('participantCourseFilter')?.value || 'ALL';
    const provFilter = document.getElementById('participantProvinceFilter')?.value || 'ALL';
    const catFilter = document.getElementById('participantCategoryFilter')?.value || 'ALL';

    const clearBtn = document.getElementById('clearParticipantSearchBtn');
    if (clearBtn) clearBtn.classList.toggle('hidden', query === '');

    const list = appState.participants || [];

    filteredParticipantsData = list.filter(p => {
        const matchQuery = query === '' ||
            (p.cardNo && p.cardNo.toLowerCase().includes(query)) ||
            (p.courseNo && p.courseNo.toLowerCase().includes(query)) ||
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.nickname && p.nickname.toLowerCase().includes(query)) ||
            (p.province && p.province.toLowerCase().includes(query)) ||
            (p.interests && p.interests.toLowerCase().includes(query));

        let matchCourse = true;
        if (courseFilter !== 'ALL') {
            matchCourse = p.courseType === courseFilter;
        }

        let matchProvince = true;
        if (provFilter !== 'ALL') {
            if (provFilter === 'กทม.') matchProvince = (p.province || '').includes('กทม');
            else if (provFilter === 'นนทบุรี') matchProvince = (p.province || '').includes('นนทบุรี');
            else if (provFilter === 'ปริมณฑล/ภาคกลาง') matchProvince = ['นครปฐม', 'ฉะเชิงเทรา', 'นครสวรรค์'].some(x => (p.province || '').includes(x));
            else if (provFilter === 'ภาคเหนือ') matchProvince = ['เชียงใหม่', 'น่าน', 'ลำพูน'].some(x => (p.province || '').includes(x));
            else if (provFilter === 'ภาคอีสาน') matchProvince = ['ขอนแก่น', 'นครราชสีมา', 'ศรีสะเกษ'].some(x => (p.province || '').includes(x));
            else if (provFilter === 'ภาคใต้') matchProvince = (p.province || '').includes('สุราษฎร์');
            else if (provFilter === 'ไม่ระบุ') matchProvince = p.province === '-' || p.province === 'ไม่ระบุ';
        }

        let matchCategory = true;
        if (catFilter !== 'ALL') {
            matchCategory = p.categories && p.categories.includes(catFilter);
        }

        return matchQuery && matchCourse && matchProvince && matchCategory;
    });

    const visCount = document.getElementById('participant-visible-count');
    const totCount = document.getElementById('participant-total-count');
    if (visCount) visCount.innerText = filteredParticipantsData.length;
    if (totCount) totCount.innerText = list.length;

    renderParticipantTableView();
    renderParticipantCardView();
    if (currentParticipantView === 'analytics') renderParticipantAnalytics();
}

function clearParticipantSearch() {
    const input = document.getElementById('participantSearchInput');
    if (input) input.value = '';
    applyParticipantFilters();
}

function resetParticipantFilters() {
    setInputValue('participantSearchInput', '');
    setInputValue('participantCourseFilter', 'ALL');
    setInputValue('participantProvinceFilter', 'ALL');
    setInputValue('participantCategoryFilter', 'ALL');
    applyParticipantFilters();
}

// VIEW 1: DATA TABLE
function renderParticipantTableView() {
    const tbody = document.getElementById('participant-table-body');
    const emptyState = document.getElementById('participant-table-empty');
    if (!tbody) return;

    if (filteredParticipantsData.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    tbody.innerHTML = filteredParticipantsData.map(p => {
        const displayName = p.name === 'ไม่ระบุชื่อ-นามสกุล' ? `<span class="text-slate-400 font-normal">ไม่ระบุชื่อจริง</span>` : p.name;
        const displayNick = p.nickname === 'ไม่ระบุ' ? `<span class="text-slate-400">-</span>` : `<span class="font-bold text-govNavy">${p.nickname}</span>`;
        const displayProv = (p.province === '-' || p.province === 'ไม่ระบุ')
            ? `<span class="inline-flex items-center gap-1 text-slate-400 text-xs"><i class="fa-solid fa-location-dot"></i> ไม่ระบุ</span>`
            : `<span class="inline-flex items-center gap-1 text-slate-700 text-xs bg-slate-100 px-2 py-0.5 rounded-md"><i class="fa-solid fa-location-dot text-rose-500"></i> ${p.province}</span>`;

        const categoryBadges = (p.categories || []).map(c => `<span class="inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 mr-1 mb-1">${c}</span>`).join('');

        const isAdvanced = p.courseType === "Advanced Course";
        const courseBadge = isAdvanced
            ? `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 border border-purple-200"><i class="fa-solid fa-rocket text-purple-500"></i> ${p.courseNo || 'ADV'}</span>`
            : `<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 border border-sky-200"><i class="fa-solid fa-book-open text-sky-500"></i> ${p.courseNo || 'FND'}</span>`;

        return `
            <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
                <td class="py-2.5 px-3 text-center font-medium text-slate-400 text-xs">${p.id}</td>
                <td class="py-2.5 px-3 font-mono font-bold text-slate-700 text-xs">${p.cardNo || '-'}</td>
                <td class="py-2.5 px-3">${courseBadge}</td>
                <td class="py-2.5 px-3 font-medium text-slate-800">${displayName}</td>
                <td class="py-2.5 px-3">${displayNick}</td>
                <td class="py-2.5 px-3">${displayProv}</td>
                <td class="py-2.5 px-3 text-slate-600 leading-relaxed text-xs">${p.interests}</td>
                <td class="py-2.5 px-3">${categoryBadges}</td>
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="recommendAICareer(${p.id})" title="วิเคราะห์สายงาน OJT ด้วย AI" class="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition border border-purple-200 bg-purple-50">
                            <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                        </button>
                        <button onclick="openParticipantModal(${p.id})" title="แก้ไขข้อมูล" class="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button onclick="openDeleteParticipantModal(${p.id})" title="ลบรายชื่อ" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// VIEW 2: PROFILE CARDS
function renderParticipantCardView() {
    const grid = document.getElementById('participant-card-grid');
    const emptyState = document.getElementById('participant-card-empty');
    if (!grid) return;

    if (filteredParticipantsData.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = filteredParticipantsData.map(p => {
        const avatarBg = getParticipantAvatarColor(p.id);
        const initial = p.nickname !== 'ไม่ระบุ' ? p.nickname.charAt(0) : (p.name !== 'ไม่ระบุชื่อ-นามสกุล' ? p.name.charAt(0) : 'N');
        const displayName = p.name === 'ไม่ระบุชื่อ-นามสกุล' ? 'ไม่ระบุชื่อจริง' : p.name;
        const displayNick = p.nickname === 'ไม่ระบุ' ? 'ผู้เข้าอบรม' : p.nickname;

        const isAdvanced = p.courseType === "Advanced Course";
        const courseTag = isAdvanced
            ? `<span class="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-200">🚀 ${p.courseNo || 'Advanced'}</span>`
            : `<span class="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-sky-200">📘 ${p.courseNo || 'Foundation'}</span>`;

        const categoryTags = (p.categories || []).map(c => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">${c}</span>`).join(' ');

        return `
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3 group relative">
                <div class="space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-mono font-bold text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">🆔 ${p.cardNo || 'CARD-000'}</span>
                        <div class="flex items-center gap-1">
                            ${courseTag}
                            <button onclick="openParticipantModal(${p.id})" title="แก้ไข" class="p-1 text-slate-400 hover:text-blue-600 transition">
                                <i class="fa-solid fa-pen-to-square text-xs"></i>
                            </button>
                            <button onclick="openDeleteParticipantModal(${p.id})" title="ลบ" class="p-1 text-slate-400 hover:text-rose-600 transition">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl ${avatarBg} text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
                            ${initial}
                        </div>
                        <div>
                            <div class="text-[10px] text-slate-400">ลำดับที่ ${p.id}</div>
                            <h4 class="font-bold text-govNavy text-sm leading-tight">${displayNick}</h4>
                            <div class="text-xs text-slate-500 mt-0.5 line-clamp-1">${displayName}</div>
                        </div>
                    </div>

                    <div>
                        <span class="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                            <i class="fa-solid fa-map-pin text-rose-500 text-xs"></i>
                            <span>${p.province === '-' ? 'ไม่ระบุภูมิลำเนา' : p.province}</span>
                        </span>
                    </div>

                    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <div class="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                            <i class="fa-solid fa-star text-amber-500"></i> สิ่งที่สนใจ / ความคาดหวัง
                        </div>
                        <p class="text-xs text-slate-700 leading-relaxed line-clamp-3">${p.interests}</p>
                    </div>
                </div>

                <div class="space-y-2 pt-2 border-t border-slate-100">
                    <div class="flex flex-wrap gap-1">
                        ${categoryTags}
                    </div>
                    <button onclick="recommendAICareer(${p.id})" class="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
                        <i class="fa-solid fa-wand-magic-sparkles text-purple-600"></i>
                        <span>✨ วิเคราะห์สายงาน AI</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// VIEW 3: ANALYTICS & CHARTS
function renderParticipantAnalytics() {
    const list = appState.participants || [];
    const total = list.length;

    setText('kpi-part-total', total);

    let countAdv = 0;
    let countFnd = 0;
    let countGov = 0;

    list.forEach(p => {
        if (p.courseType === "Advanced Course") countAdv++;
        else countFnd++;

        if (p.categories && p.categories.includes("งานราชการ/ความมั่นคง")) countGov++;
    });

    setText('kpi-part-adv', countAdv);
    setText('kpi-part-adv-pct', total > 0 ? `(${Math.round((countAdv/total)*100)}%)` : '(0%)');

    setText('kpi-part-fnd', countFnd);
    setText('kpi-part-fnd-pct', total > 0 ? `(${Math.round((countFnd/total)*100)}%)` : '(0%)');

    setText('kpi-part-gov', countGov);
    setText('kpi-part-gov-pct', total > 0 ? `(${Math.round((countGov/total)*100)}%)` : '(0%)');

    renderParticipantGroupBreakdown();

    if (typeof Chart === 'undefined') return;

    // Category Counts
    const catCounts = {
        "คอมพิวเตอร์/AI": 0,
        "งานราชการ/ความมั่นคง": 0,
        "เกม/ไอที": 0,
        "ศิลปะ/ดนตรี/นิยาย": 0,
        "กีฬา/สุขภาพ": 0,
        "ความบันเทิง/งานอดิเรก": 0,
        "งานธุรการ/เอกสาร": 0,
        "พัฒนาตนเอง": 0
    };

    list.forEach(p => {
        if (p.categories) {
            p.categories.forEach(c => {
                if (catCounts[c] !== undefined) catCounts[c]++;
            });
        }
    });

    // 1. Interest Bar Chart
    const chart1El = document.getElementById('interestChart');
    if (chart1El) {
        const ctxInterest = chart1El.getContext('2d');
        if (interestChartInstance) interestChartInstance.destroy();

        interestChartInstance = new Chart(ctxInterest, {
            type: 'bar',
            data: {
                labels: ['คอมพิวเตอร์/AI', 'งานราชการ', 'พัฒนาตนเอง', 'ศิลปะ/ดนตรี', 'เกม/ไอที', 'ความบันเทิง', 'กีฬา/สุขภาพ', 'ธุรการ'],
                datasets: [{
                    label: 'จำนวนผู้สนใจ (คน)',
                    data: [
                        catCounts["คอมพิวเตอร์/AI"],
                        catCounts["งานราชการ/ความมั่นคง"],
                        catCounts["พัฒนาตนเอง"],
                        catCounts["ศิลปะ/ดนตรี/นิยาย"],
                        catCounts["เกม/ไอที"],
                        catCounts["ความบันเทิง/งานอดิเรก"],
                        catCounts["กีฬา/สุขภาพ"],
                        catCounts["งานธุรการ/เอกสาร"]
                    ],
                    backgroundColor: '#1B365D',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }

    // 2. Course Track Doughnut Chart
    const chart2El = document.getElementById('courseChart');
    if (chart2El) {
        const ctxCourse = chart2El.getContext('2d');
        if (courseChartInstance) courseChartInstance.destroy();

        courseChartInstance = new Chart(ctxCourse, {
            type: 'doughnut',
            data: {
                labels: ['Advanced Course (ขั้นสูง)', 'Foundation Course (พื้นฐาน)'],
                datasets: [{
                    data: [countAdv, countFnd],
                    backgroundColor: ['#7C3AED', '#0284C7']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

function renderParticipantGroupBreakdown() {
    const list = appState.participants || [];
    const groups = [
        {
            title: "🚀 สมาชิกหลักสูตรขั้นสูง (Advanced Course)",
            color: "border-purple-500 bg-purple-50/30",
            badgeColor: "bg-purple-100 text-purple-800",
            members: list.filter(p => p.courseType === "Advanced Course")
        },
        {
            title: "📘 สมาชิกหลักสูตรขั้นพื้นฐาน (Foundation Course)",
            color: "border-sky-500 bg-sky-50/30",
            badgeColor: "bg-sky-100 text-sky-800",
            members: list.filter(p => p.courseType === "Foundation Course")
        },
        {
            title: "💻 สายคอมพิวเตอร์ & เทคโนโลยี AI",
            color: "border-blue-500 bg-blue-50/30",
            badgeColor: "bg-blue-100 text-blue-800",
            members: list.filter(p => p.categories && p.categories.includes("คอมพิวเตอร์/AI"))
        }
    ];

    const container = document.getElementById('participant-group-containers-list');
    if (!container) return;

    container.innerHTML = groups.map(g => `
        <div class="rounded-xl p-3.5 border-l-4 shadow-sm ${g.color} space-y-2">
            <div class="flex items-center justify-between">
                <h5 class="font-bold text-govNavy text-xs">${g.title}</h5>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${g.badgeColor}">${g.members.length} คน</span>
            </div>
            <div class="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                ${g.members.length === 0 ? '<div class="text-[11px] text-slate-400 py-2 text-center">ไม่มีสมาชิกในกลุ่มนี้</div>' : ''}
                ${g.members.map(m => `
                    <div class="text-xs bg-white p-1.5 rounded-lg border border-slate-200/80 flex items-center justify-between">
                        <div class="flex items-center gap-1.5">
                            <span class="font-mono font-bold text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">${m.cardNo}</span>
                            <span class="font-medium text-slate-800 text-[11px]">${m.nickname !== 'ไม่ระบุ' ? m.nickname : m.name}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="font-mono text-[10px] font-bold text-indigo-600">${m.courseNo}</span>
                            <button onclick="recommendAICareer(${m.id})" title="วิเคราะห์ AI" class="text-purple-600 hover:text-purple-800">
                                <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// --------------------------------------------------------------------------
// 4.2 CRUD Handlers
// --------------------------------------------------------------------------
function openParticipantModal(id = null) {
    const modal = document.getElementById('participantModal');
    const form = document.getElementById('participantForm');
    const modalTitle = document.getElementById('participantModalTitle');
    const editIdInput = document.getElementById('editParticipantId');

    if (form) form.reset();
    document.querySelectorAll('input[name="formCategories"]').forEach(cb => cb.checked = false);

    if (id) {
        const p = (appState.participants || []).find(item => item.id === id);
        if (!p) return;

        if (modalTitle) modalTitle.innerHTML = `<i class="fa-solid fa-user-pen text-blue-600"></i> <span>แก้ไขข้อมูลผู้เข้าอบรม (ลำดับที่ ${id})</span>`;
        if (editIdInput) editIdInput.value = id;
        setInputValue('formCardNo', p.cardNo || `CARD-${String(id).padStart(3, '0')}`);
        setInputValue('formCourseType', p.courseType || 'Advanced Course');
        setInputValue('formCourseNo', p.courseNo || (p.courseType === 'Advanced Course' ? 'ADV-01' : 'FND-01'));
        setInputValue('formName', p.name);
        setInputValue('formNickname', p.nickname);
        setInputValue('formProvince', p.province);
        setInputValue('formInterests', p.interests);

        if (p.categories) {
            document.querySelectorAll('input[name="formCategories"]').forEach(cb => {
                cb.checked = p.categories.includes(cb.value);
            });
        }
    } else {
        const list = appState.participants || [];
        const nextId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
        if (modalTitle) modalTitle.innerHTML = `<i class="fa-solid fa-user-plus text-emerald-600"></i> <span>เพิ่มผู้เข้าร่วมอบรมใหม่</span>`;
        if (editIdInput) editIdInput.value = '';
        setInputValue('formCardNo', `CARD-${String(nextId).padStart(3, '0')}`);
        setInputValue('formCourseType', 'Advanced Course');
        setInputValue('formCourseNo', `ADV-${String(nextId).padStart(2, '0')}`);

        const devCb = document.querySelector('input[name="formCategories"][value="พัฒนาตนเอง"]');
        if (devCb) devCb.checked = true;
    }

    if (modal) modal.classList.remove('hidden');
}

function closeParticipantModal() {
    const modal = document.getElementById('participantModal');
    if (modal) modal.classList.add('hidden');
}

function handleParticipantFormSubmit(e) {
    e.preventDefault();

    const editId = getInputValue('editParticipantId');
    const cardNo = getInputValue('formCardNo').toUpperCase();
    const courseType = document.getElementById('formCourseType')?.value || 'Advanced Course';
    const courseNo = getInputValue('formCourseNo').toUpperCase();
    const name = getInputValue('formName');
    const nickname = getInputValue('formNickname');
    const province = getInputValue('formProvince');
    const interests = getInputValue('formInterests');

    const categories = [];
    document.querySelectorAll('input[name="formCategories"]:checked').forEach(cb => {
        categories.push(cb.value);
    });

    if (categories.length === 0) categories.push("พัฒนาตนเอง");

    if (editId) {
        const targetIndex = (appState.participants || []).findIndex(p => p.id === parseInt(editId));
        if (targetIndex !== -1) {
            appState.participants[targetIndex] = {
                ...appState.participants[targetIndex],
                cardNo,
                courseType,
                courseNo,
                name,
                nickname,
                province,
                interests,
                categories
            };
            showToast(`แก้ไขข้อมูลของคุณ ${nickname} เรียบร้อยแล้ว`);
        }
    } else {
        const list = appState.participants || [];
        const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
        const newParticipant = {
            id: newId,
            cardNo: cardNo || `CARD-${String(newId).padStart(3, '0')}`,
            courseType,
            courseNo: courseNo || (courseType === 'Advanced Course' ? `ADV-${newId}` : `FND-${newId}`),
            name,
            nickname,
            province,
            interests,
            categories
        };
        appState.participants.unshift(newParticipant);
        showToast(`เพิ่มคุณ ${nickname} (${cardNo}) เรียบร้อยแล้ว`);
    }

    saveParticipantsToStorage();
    closeParticipantModal();
}

function openDeleteParticipantModal(id) {
    const p = (appState.participants || []).find(item => item.id === id);
    if (!p) return;

    deleteTargetParticipantId = id;
    setText('deleteTargetParticipantName', `${p.nickname} [${p.cardNo || ''}] (${p.name})`);
    const modal = document.getElementById('deleteParticipantModal');
    if (modal) modal.classList.remove('hidden');
}

function closeDeleteParticipantModal() {
    deleteTargetParticipantId = null;
    const modal = document.getElementById('deleteParticipantModal');
    if (modal) modal.classList.add('hidden');
}

function confirmDeleteParticipant() {
    if (!deleteTargetParticipantId) return;

    const targetIndex = (appState.participants || []).findIndex(p => p.id === deleteTargetParticipantId);
    if (targetIndex !== -1) {
        const deletedName = appState.participants[targetIndex].nickname;
        appState.participants.splice(targetIndex, 1);
        saveParticipantsToStorage();
        showToast(`ลบรายชื่อคุณ ${deletedName} เรียบร้อยแล้ว`);
    }

    closeDeleteParticipantModal();
}

function copyParticipantDataList() {
    const textToCopy = filteredParticipantsData.map((p, idx) =>
        `${idx + 1}. [บัตร: ${p.cardNo || '-'}] [หลักสูตร: ${p.courseNo || '-'}] ${p.name} (ชื่อเล่น: ${p.nickname}) | จังหวัด: ${p.province} | สิ่งที่สนใจ: ${p.interests}`
    ).join('\n');

    navigator.clipboard.writeText(textToCopy);
    showToast(`คัดลอกข้อมูล ${filteredParticipantsData.length} รายการแล้ว`);
}

function restoreDefaultParticipantsData() {
    if (confirm("คุณต้องการคืนค่าข้อมูลเริ่มต้น 37 รายชื่อใช่หรือไม่? (ข้อมูลที่แก้ไขหรือเพิ่มจะถูกรีเซ็ต)")) {
        appState.participants = JSON.parse(JSON.stringify(initialMasterParticipants));
        saveParticipantsToStorage();
        showToast("คืนค่าข้อมูลเริ่มต้นเรียบร้อยแล้ว");
    }
}

// --------------------------------------------------------------------------
// 4.3 Gemini AI Studio & Intelligence Engine
// --------------------------------------------------------------------------
async function polishInterestsWithAI() {
    const textarea = document.getElementById('formInterests');
    const btn = document.getElementById('btn-polish-ai');
    const originalText = textarea ? textarea.value.trim() : '';

    if (!originalText) {
        alert("กรุณากรอกข้อความความสนใจเบื้องต้นก่อนกดขัดเกลา");
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-purple-600"></i> <span>กำลังขัดเกลา...</span>`;
    }

    // High quality official civil service phrasing generator
    setTimeout(() => {
        const polished = `มุ่งมั่นพัฒนาทักษะการปฏิบัติงานสารสนเทศและกระบวนการดิจิทัลภาครัฐ (${originalText}) เพื่อขับเคลื่อนงานบริการประชาชนอย่างมีประสิทธิภาพและสร้างความมั่นคงในอาชีพ`;
        if (textarea) textarea.value = polished;
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles text-purple-600"></i> <span>✨ ขัดเกลาด้วย AI</span>`;
        }
        showToast("ขัดเกลาภาษาด้วย AI เรียบร้อยแล้ว");
    }, 450);
}

function recommendAICareer(id) {
    const p = (appState.participants || []).find(item => item.id === id);
    if (!p) return;

    setText('aiTargetName', `${p.nickname} (${p.name === 'ไม่ระบุชื่อ-นามสกุล' ? 'ผู้เข้าอบรม' : p.name}) - [${p.cardNo}]`);
    const contentDiv = document.getElementById('aiCareerContent');
    const modal = document.getElementById('aiCareerModal');

    if (modal) modal.classList.remove('hidden');

    if (contentDiv) {
        const isAdv = p.courseType === "Advanced Course";
        contentDiv.innerHTML = `
            <div class="space-y-3">
                <div class="p-3 bg-white rounded-xl border border-purple-200">
                    <h4 class="font-bold text-purple-900 text-xs mb-1"><i class="fa-solid fa-bullseye text-purple-600 mr-1.5"></i>1. ตำแหน่งงานและหน่วยงานภาครัฐที่เหมาะสม</h4>
                    <ul class="list-disc list-inside space-y-1 text-slate-700">
                        <li><strong>${isAdv ? 'เจ้าหน้าที่พัฒนาระบบคอมพิวเตอร์ / นักวิเคราะห์ข้อมูล' : 'เจ้าพนักงานธุรการ / เจ้าหน้าที่บันทึกข้อมูล'}:</strong> เหมาะสำหรับปฏิบัติงานใน ${p.province !== '-' ? `หน่วยงานราชการประจำจังหวัด${p.province}` : 'หน่วยงานภาครัฐส่วนกลางและภูมิภาค'}</li>
                        <li><strong>เจ้าหน้าที่สนับสนุนงานสารบรรณอิเล็กทรอนิกส์ (e-Saraban):</strong> ดูแลเอกสารดิจิทัลและหนังสือราชการ</li>
                    </ul>
                </div>

                <div class="p-3 bg-white rounded-xl border border-blue-200">
                    <h4 class="font-bold text-blue-900 text-xs mb-1"><i class="fa-solid fa-lightbulb text-blue-600 mr-1.5"></i>2. ทักษะดิจิทัลที่ควรฝึกฝนเน้นย้ำช่วง OJT</h4>
                    <ul class="list-disc list-inside space-y-1 text-slate-700">
                        <li><strong>${isAdv ? 'Prompt Engineering (R-C-T-F) & Data Visualization Dashboard' : 'การพิมพ์เอกสารราชการ 3 ย่อหน้า & การใช้ Microsoft Excel / Google Sheets ขั้นกลาง'}</strong></li>
                        <li><strong>การรักษาความมั่นคงปลอดภัยข้อมูลและธรรมาภิบาลข้อมูลภาครัฐ (PDPA)</strong></li>
                    </ul>
                </div>

                <div class="p-3 bg-white rounded-xl border border-emerald-200">
                    <h4 class="font-bold text-emerald-900 text-xs mb-1"><i class="fa-solid fa-comment-dots text-emerald-600 mr-1.5"></i>3. ร่างบทแนะนำตนเองสำหรับสัมภาษณ์งานราชการ</h4>
                    <p class="text-slate-700 italic bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                        "สวัสดีครับ/ค่ะ ผม/ดิฉันมีความพร้อมและมุ่งมั่นที่จะนำทักษะดิจิทัลที่ผ่านการฝึกอบรมเข้มข้น 13 วัน และการฝึกงานจริง OJT มาช่วยขับเคลื่อนงานบริการของหน่วยงานให้มีความรวดเร็ว ถูกต้อง และพร้อมเรียนรู้สิ่งใหม่อยู่เสมอครับ/ค่ะ"
                    </p>
                </div>
            </div>
        `;
    }
}

function closeAICareerModal() {
    const modal = document.getElementById('aiCareerModal');
    if (modal) modal.classList.add('hidden');
}

function generateAIExecutiveSummary() {
    const contentDiv = document.getElementById('aiExecContent');
    const modal = document.getElementById('aiExecModal');
    if (modal) modal.classList.remove('hidden');

    const list = appState.participants || [];
    const total = list.length;
    const advCount = list.filter(p => p.courseType === "Advanced Course").length;
    const fndCount = total - advCount;

    const summaryText = `
### 📊 1. สรุปภาพรวมและศักยภาพของผู้เข้าอบรม (Cohort Executive Summary)
- **จำนวนผู้เข้าอบรมทั้งหมด:** ${total} คน (หลักสูตรขั้นสูง Advanced: ${advCount} คน, หลักสูตรขั้นพื้นฐาน Foundation: ${fndCount} คน)
- **การกระจายตัว:** ครอบคลุมผู้เรียนจากกรุงเทพฯ, ปริมณฑล, ภาคเหนือ, ภาคอีสาน และภาคใต้
- **จุดเด่นสำคัญ:** ผู้เรียนมีความมุ่งมั่นสูงในการยกระดับทักษะดิจิทัล (Digital Upskilling) โดยเฉพาะการประยุกต์ใช้ AI ในงานสารบรรณและการวิเคราะห์ข้อมูลเพื่อบริการประชาชน

### 🏛️ 2. ยุทธศาสตร์การจัดวางตำแหน่งฝึกงานจริง (OJT Placement Strategy)
1. **กลุ่ม Advanced AI & Automation (${advCount} คน):** ควรจัดวางในหน่วยงานด้านเทคโนโลยีสารสนเทศ (IT Center) หรือศูนย์ข้อมูล เพื่อร่วมทำ Data Cleaning, Dashboard และสคริปต์อัตโนมัติ
2. **กลุ่ม Foundation Digital Skills (${fndCount} คน):** ควรจัดวางในงานสารบรรณกลาง งานประชาสัมพันธ์ และงานบริการประชาชนหน้าร้าน (One Stop Service) เพื่อฝึกใช้ระบบ e-Saraban และการสื่อสารเชิงบวก

### 🚀 3. แนวทางการส่งเสริมและพัฒนาต่อเนื่องหลังจบโครงการ
- จัดตั้งกลุ่มเครือข่ายดิจิทัลคนพิการภาครัฐ (Community of Practice) เพื่อแลกเปลี่ยนเทคนิค Prompting
- ติดตามผลการจ้างงานตามมาตรา 35 และมาตรา 33 เพื่อให้เกิดการบรรจุงานที่มั่นคงและยั่งยืน
    `;

    lastExecSummaryText = summaryText;

    if (contentDiv) {
        contentDiv.innerHTML = formatMarkdownToHTML(summaryText);
    }
}

function closeAIExecModal() {
    const modal = document.getElementById('aiExecModal');
    if (modal) modal.classList.add('hidden');
}

function copyExecSummaryText() {
    if (!lastExecSummaryText) return;
    navigator.clipboard.writeText(lastExecSummaryText);
    showToast("คัดลอกบทสรุปรายงานผู้บริหารเรียบร้อยแล้ว");
}

function formatMarkdownToHTML(md) {
    return md
        .replace(/^### (.*$)/gim, '<h4 class="text-sm font-bold text-govNavy mt-3 mb-1 flex items-center gap-1.5"><i class="fa-solid fa-chevron-right text-emerald-600 text-xs"></i> $1</h4>')
        .replace(/^## (.*$)/gim, '<h3 class="text-base font-bold text-slate-800 mt-3 mb-2 border-b border-slate-200 pb-1">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
        .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 my-0.5">$1</li>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 my-0.5">$1</li>')
        .replace(/\n\n/g, '<br/>');
}

// --------------------------------------------------------------------------
// 5. M2: Schedule & Daily Action Hub (13 Days Centara Life)
// --------------------------------------------------------------------------
function setScheduleTrackFilter(filterType) {
    activeScheduleFilter = filterType;
    ['auto', 'adv', 'fnd', 'both'].forEach(key => {
        const btn = document.getElementById(`btn-sched-track-${key}`);
        if (btn) {
            btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-slate-100 text-slate-700 hover:bg-slate-200';
        }
    });

    const activeBtn = document.getElementById(`btn-sched-track-${filterType.toLowerCase()}`);
    if (activeBtn) {
        activeBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-govNavy text-white shadow-sm';
    }

    renderScheduleList();
}

function renderScheduleList() {
    const container = document.getElementById('schedule-days-container');
    if (!container) return;

    const userTrack = appState.userProfile.track || 'ADV';
    const effectiveFilter = activeScheduleFilter === 'AUTO' ? userTrack : activeScheduleFilter;

    container.innerHTML = appState.attendance.map(dayItem => {
        const isPresent = dayItem.status === 'PRESENT' || dayItem.status === 'ONLINE';
        const isCombined = dayItem.isCombined;

        let sessionHtml = '';

        if (isCombined) {
            sessionHtml = `
                <div class="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                    <div class="flex justify-between items-center flex-wrap gap-2">
                        <span class="bg-govNavy text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <i class="fa-solid fa-users mr-1"></i> รวมทุกหลักสูตร (40 คน)
                        </span>
                        <span class="bg-white border border-slate-300 text-govNavy text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i> ${dayItem.room || 'ห้องประชุมเซ็นทารา'}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-blue-900"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>ช่วงเช้า (09.00 - 12.00 น.)</strong>
                                ${dayItem.morningComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">${dayItem.morning}</p>
                        </div>
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-emerald-900"><i class="fa-solid fa-cloud-sun text-emerald-500 mr-1"></i>ช่วงบ่าย (13.00 - 16.00 น.)</strong>
                                ${dayItem.afternoonComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">${dayItem.afternoon}</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (effectiveFilter === 'BOTH') {
            const fnd = dayItem.foundation;
            const adv = dayItem.advanced;
            sessionHtml = `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div class="p-3 bg-blue-50/80 rounded-xl border border-blue-300 space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                <i class="fa-solid fa-laptop-code mr-1"></i> สาย Advanced AI
                            </span>
                            <span class="bg-white border border-blue-200 text-blue-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i> ${adv.room}
                            </span>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-blue-900 font-bold mb-0.5">
                                    <span>ช่วงเช้า (09.00 - 12.00 น.)</span>
                                    ${adv.morningComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">${adv.morning}</p>
                            </div>
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-emerald-900 font-bold mb-0.5">
                                    <span>ช่วงบ่าย (13.00 - 16.00 น.)</span>
                                    ${adv.afternoonComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">${adv.afternoon}</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 bg-emerald-50/80 rounded-xl border border-emerald-300 space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                <i class="fa-solid fa-book-open mr-1"></i> สาย Foundation
                            </span>
                            <span class="bg-white border border-emerald-200 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i> ${fnd.room}
                            </span>
                        </div>
                        <div class="space-y-2 text-xs">
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-blue-900 font-bold mb-0.5">
                                    <span>ช่วงเช้า (09.00 - 12.00 น.)</span>
                                    ${fnd.morningComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">${fnd.morning}</p>
                            </div>
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-emerald-900 font-bold mb-0.5">
                                    <span>ช่วงบ่าย (13.00 - 16.00 น.)</span>
                                    ${fnd.afternoonComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">${fnd.afternoon}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const trackData = (effectiveFilter === 'FND') ? dayItem.foundation : dayItem.advanced;
            const isAdv = effectiveFilter === 'ADV';
            sessionHtml = `
                <div class="p-3 ${isAdv ? 'bg-blue-50/70 border-blue-200' : 'bg-emerald-50/70 border-emerald-200'} rounded-xl border space-y-2">
                    <div class="flex justify-between items-center flex-wrap gap-2">
                        <span class="${isAdv ? 'bg-blue-600' : 'bg-emerald-600'} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <i class="fa-solid ${isAdv ? 'fa-laptop-code' : 'fa-book-open'} mr-1"></i> หลักสูตร${isAdv ? 'ขั้นสูง (Advanced Course)' : 'ขั้นพื้นฐาน (Foundation Course)'}
                        </span>
                        <span class="bg-white border border-slate-300 text-govNavy text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i> ${trackData.room}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-blue-900"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>ช่วงเช้า (09.00 - 12.00 น.)</strong>
                                ${trackData.morningComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">${trackData.morning}</p>
                        </div>
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-emerald-900"><i class="fa-solid fa-cloud-sun text-emerald-500 mr-1"></i>ช่วงบ่าย (13.00 - 16.00 น.)</strong>
                                ${trackData.afternoonComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">${trackData.afternoon}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        const hasPreTest = !!dayItem.preTestUrl;
        const hasPostTest = !!dayItem.postTestUrl;
        const hasDoc = !!dayItem.docUrl;
        const hasEval = !!dayItem.evalUrl;

        const actionHubHtml = `
            <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <div class="flex justify-between items-center flex-wrap gap-2">
                    <span class="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                        <i class="fa-solid fa-bolt text-amber-500"></i>
                        <span>ศูนย์รวมกิจกรรมประจำวัน (Daily Action Hub)</span>
                    </span>
                    <button onclick="openDayLinksModal(${dayItem.day})" class="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 hover:underline">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <span>แก้ไขลิงก์ & คะแนน</span>
                    </button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div class="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold text-blue-700">1. Pre-test</span>
                            ${dayItem.preTestScore !== undefined ? `<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded font-bold">${dayItem.preTestScore}/${dayItem.preTestMax || 10}</span>` : ''}
                        </div>
                        <div class="mt-1.5">
                            ${hasPreTest ? `
                                <a href="${dayItem.preTestUrl}" target="_blank" class="w-full inline-flex items-center justify-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-1 rounded text-[11px] font-semibold transition">
                                    <i class="fa-solid fa-pen-ruler"></i>
                                    <span>ทำ Pre-test</span>
                                </a>
                            ` : `
                                <button onclick="openDayLinksModal(${dayItem.day})" class="w-full text-slate-400 border border-dashed border-slate-300 py-1 rounded text-[10px] hover:border-slate-400">
                                    + ใส่ลิงก์
                                </button>
                            `}
                        </div>
                    </div>

                    <div class="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold text-emerald-700">2. เอกสาร/สไลด์</span>
                            <span class="text-[10px] text-slate-400 truncate max-w-[70px]">${dayItem.docTitle ? '✓ มีไฟล์' : '-'}</span>
                        </div>
                        <div class="mt-1.5">
                            ${hasDoc ? `
                                <a href="${dayItem.docUrl}" target="_blank" class="w-full inline-flex items-center justify-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-1 rounded text-[11px] font-semibold transition truncate">
                                    <i class="fa-solid fa-file-pdf"></i>
                                    <span>เปิดสไลด์</span>
                                </a>
                            ` : `
                                <button onclick="openDayLinksModal(${dayItem.day})" class="w-full text-slate-400 border border-dashed border-slate-300 py-1 rounded text-[10px] hover:border-slate-400">
                                    + ใส่ลิงก์
                                </button>
                            `}
                        </div>
                    </div>

                    <div class="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold text-purple-700">3. Post-test</span>
                            ${dayItem.postTestScore !== undefined ? `<span class="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.2 rounded font-bold">${dayItem.postTestScore}/${dayItem.postTestMax || 10}</span>` : ''}
                        </div>
                        <div class="mt-1.5">
                            ${hasPostTest ? `
                                <a href="${dayItem.postTestUrl}" target="_blank" class="w-full inline-flex items-center justify-center space-x-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 py-1 rounded text-[11px] font-semibold transition">
                                    <i class="fa-solid fa-square-check"></i>
                                    <span>ทำ Post-test</span>
                                </a>
                            ` : `
                                <button onclick="openDayLinksModal(${dayItem.day})" class="w-full text-slate-400 border border-dashed border-slate-300 py-1 rounded text-[10px] hover:border-slate-400">
                                    + ใส่ลิงก์
                                </button>
                            `}
                        </div>
                    </div>

                    <div class="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold text-amber-700">4. แบบประเมิน</span>
                            <span class="text-[10px] font-bold ${dayItem.evalSubmitted ? 'text-emerald-600' : 'text-slate-400'}">${dayItem.evalSubmitted ? '✓ ประเมินแล้ว' : 'รอส่ง'}</span>
                        </div>
                        <div class="mt-1.5">
                            ${hasEval ? `
                                <a href="${dayItem.evalUrl}" target="_blank" class="w-full inline-flex items-center justify-center space-x-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 py-1 rounded text-[11px] font-semibold transition">
                                    <i class="fa-solid fa-star"></i>
                                    <span>ทำแบบประเมิน</span>
                                </a>
                            ` : `
                                <button onclick="openDayLinksModal(${dayItem.day})" class="w-full text-slate-400 border border-dashed border-slate-300 py-1 rounded text-[10px] hover:border-slate-400">
                                    + ใส่ลิงก์
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return `
            <div class="app-card p-5 border-l-4 ${isPresent ? 'border-emerald-500' : 'border-slate-300'} transition space-y-3">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div class="flex items-center space-x-3">
                        <span class="w-10 h-10 rounded-xl ${isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} flex items-center justify-center font-bold text-sm shrink-0">
                            วันที่ ${dayItem.day}
                        </span>
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="text-xs text-slate-500 font-semibold"><i class="fa-solid fa-calendar mr-1"></i>${dayItem.date}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                    ${dayItem.status === 'PRESENT' ? 'เข้าเรียนปกติ' : dayItem.status === 'ONLINE' ? 'เรียนออนไลน์' : 'ไม่ได้เข้าอบรม'}
                                </span>
                            </div>
                            <h4 class="font-bold text-govNavy text-sm mt-0.5">${dayItem.title}</h4>
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

                ${sessionHtml}
                ${actionHubHtml}

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

    const userTrack = appState.userProfile.track || 'ADV';
    const isCombined = item.isCombined;

    setInputValue('modal-ref-day', item.day);
    setText('modal-reflection-title', `บันทึกสรุปการเรียนรู้วันที่ ${item.day} (${item.date})`);

    const infoBox = document.getElementById('modal-ref-course-info');
    if (infoBox) {
        let roomText = '';
        let morningText = '';
        let afternoonText = '';

        if (isCombined) {
            roomText = item.room || 'ห้องประชุมเซ็นทารา';
            morningText = item.morning;
            afternoonText = item.afternoon;
        } else {
            const trackObj = (userTrack === 'FND') ? item.foundation : item.advanced;
            roomText = `${trackObj.room} (${userTrack === 'FND' ? 'สาย Foundation' : 'สาย Advanced'})`;
            morningText = trackObj.morning;
            afternoonText = trackObj.afternoon;
        }

        infoBox.innerHTML = `
            <div class="flex justify-between items-center text-xs font-bold text-emerald-900 border-b border-emerald-200 pb-1 mb-1.5">
                <span><i class="fa-solid fa-book-bookmark text-emerald-600 mr-1"></i>วิชาประจำวัน</span>
                <span class="bg-white px-2 py-0.5 rounded border border-emerald-300 text-[11px]"><i class="fa-solid fa-location-dot text-rose-500 mr-1"></i>${roomText}</span>
            </div>
            <div class="text-[11px] text-slate-700 leading-snug"><strong>เช้า:</strong> ${morningText}</div>
            <div class="text-[11px] text-slate-700 leading-snug mt-1"><strong>บ่าย:</strong> ${afternoonText}</div>
        `;
    }

    setInputValue('modal-ref-status', item.status || 'PRESENT');
    setInputValue('modal-ref-notes', item.reflection || '');
    setInputValue('modal-ref-action', item.actionPlan || '');

    openModal('modal-reflection');
}

function saveReflectionFromModal() {
    const dayNum = parseInt(getInputValue('modal-ref-day'), 10);
    const item = appState.attendance.find(a => a.day === dayNum);
    if (!item) return;

    item.status = getInputValue('modal-ref-status');
    item.reflection = getInputValue('modal-ref-notes');
    item.actionPlan = getInputValue('modal-ref-action');

    saveState();
    closeModal('modal-reflection');
    renderScheduleList();
    showToast(`บันทึกสรุปการเรียนรู้วันที่ ${dayNum} เรียบร้อยแล้ว`);
}

function openDayLinksModal(dayNum) {
    const item = appState.attendance.find(a => a.day === dayNum);
    if (!item) return;

    setInputValue('modal-links-day', item.day);
    const titleEl = document.getElementById('modal-day-links-title');
    if (titleEl) {
        titleEl.innerHTML = `
            <i class="fa-solid fa-link text-emerald-600 mr-1.5"></i>
            <span>จัดการกิจกรรม & ลิงก์วันที่ ${item.day} (${item.date})</span>
        `;
    }

    setInputValue('modal-links-pretest-url', item.preTestUrl || '');
    setInputValue('modal-links-pretest-score', item.preTestScore !== undefined ? item.preTestScore : '');
    setInputValue('modal-links-pretest-max', item.preTestMax || 10);

    setInputValue('modal-links-doc-url', item.docUrl || '');
    setInputValue('modal-links-doc-title', item.docTitle || '');

    setInputValue('modal-links-posttest-url', item.postTestUrl || '');
    setInputValue('modal-links-posttest-score', item.postTestScore !== undefined ? item.postTestScore : '');
    setInputValue('modal-links-posttest-max', item.postTestMax || 10);

    setInputValue('modal-links-eval-url', item.evalUrl || '');
    const evalDoneChk = document.getElementById('modal-links-eval-done');
    if (evalDoneChk) evalDoneChk.checked = !!item.evalSubmitted;

    openModal('modal-day-links');
}

function saveDayLinksFromModal() {
    const dayNum = parseInt(getInputValue('modal-links-day'), 10);
    const item = appState.attendance.find(a => a.day === dayNum);
    if (!item) return;

    item.preTestUrl = getInputValue('modal-links-pretest-url');
    const preScore = getInputValue('modal-links-pretest-score');
    item.preTestScore = preScore !== '' ? parseFloat(preScore) : undefined;
    item.preTestMax = parseFloat(getInputValue('modal-links-pretest-max')) || 10;

    item.docUrl = getInputValue('modal-links-doc-url');
    item.docTitle = getInputValue('modal-links-doc-title');

    item.postTestUrl = getInputValue('modal-links-posttest-url');
    const postScore = getInputValue('modal-links-posttest-score');
    item.postTestScore = postScore !== '' ? parseFloat(postScore) : undefined;
    item.postTestMax = parseFloat(getInputValue('modal-links-posttest-max')) || 10;

    item.evalUrl = getInputValue('modal-links-eval-url');
    const evalDoneChk = document.getElementById('modal-links-eval-done');
    item.evalSubmitted = evalDoneChk ? evalDoneChk.checked : false;

    saveState();
    closeModal('modal-day-links');
    renderScheduleList();
    showToast(`บันทึกลิงก์และผลการทดสอบวันที่ ${dayNum} เรียบร้อยแล้ว`);
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
    setInputValue('modal-ojt-id', '');
    setText('modal-ojt-title', 'เพิ่มบันทึกการฝึกปฏิบัติงานจริง (OJT)');
    setInputValue('modal-ojt-date', new Date().toISOString().split('T')[0]);
    setInputValue('modal-ojt-hours', 8);
    setInputValue('modal-ojt-dimension', '1');
    setInputValue('modal-ojt-task', '');
    setInputValue('modal-ojt-output', '');
    setInputValue('modal-ojt-link', '');

    openModal('modal-ojt');
}

function editOjtLog(logId) {
    const log = appState.ojtLogs.find(l => l.id === logId);
    if (!log) return;

    setInputValue('modal-ojt-id', log.id);
    setText('modal-ojt-title', 'แก้ไขบันทึกการฝึกปฏิบัติงานจริง (OJT)');
    setInputValue('modal-ojt-date', log.date);
    setInputValue('modal-ojt-hours', log.hours);
    setInputValue('modal-ojt-dimension', log.dimension);
    setInputValue('modal-ojt-task', log.task);
    setInputValue('modal-ojt-output', log.output || '');
    setInputValue('modal-ojt-link', log.link || '');

    openModal('modal-ojt');
}

function saveOjtFromModal() {
    const logId = getInputValue('modal-ojt-id');
    const date = getInputValue('modal-ojt-date');
    const hours = parseFloat(getInputValue('modal-ojt-hours')) || 0;
    const dimension = getInputValue('modal-ojt-dimension');
    const task = getInputValue('modal-ojt-task');
    const output = getInputValue('modal-ojt-output');
    const link = getInputValue('modal-ojt-link');

    const dimNames = {
        '1': 'งานวิเคราะห์ข้อมูลและสารสนเทศ',
        '2': 'งานเอกสารราชการและสารบรรณ',
        '3': 'งานเทคนิค ระบบ และการพัฒนา',
        '4': 'งานประสานงาน บริการ และสื่อสาร'
    };

    if (logId) {
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
        story = `(5-15s Story) "ตลอดการฝึกอบรม 13 วัน ณ โรงแรมเซ็นทารา ไลฟ์ และการฝึก OJT ${appState.userProfile.ojtAgency} ผมได้พัฒนาตนเองครบ 4 ด้าน ทั้งงานสารบรรณและการพัฒนาระบบ"`;
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
    setInputValue('modal-art-title', '');
    setInputValue('modal-art-category', 'TRAINING_13DAYS');
    setInputValue('modal-art-alt', '');
    setInputValue('modal-art-link', '');
    openModal('modal-artifact');
}

function saveArtifactFromModal() {
    const title = getInputValue('modal-art-title');
    const category = getInputValue('modal-art-category');
    const altText = getInputValue('modal-art-alt');
    let link = getInputValue('modal-art-link');

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
    const userTrack = p.track || 'ADV';

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

    // Page 5: 13-day summary with Authentic Subjects & Pre/Post Scores
    const p5AttStat = document.getElementById('pv-p5-attendance-stat');
    const presentDays = appState.attendance.filter(a => a.status === 'PRESENT' || a.status === 'ONLINE').length;
    if (p5AttStat) p5AttStat.innerText = `${presentDays}/13 วัน (${Math.round((presentDays / 13) * 100)}%)`;

    const schedContainer = document.getElementById('pv-p5-schedule-summary');
    if (schedContainer) {
        schedContainer.innerHTML = appState.attendance.map(a => {
            let courseSummary = '';
            let roomLabel = '';

            if (a.isCombined) {
                roomLabel = a.room || 'ห้องประชุมเซ็นทารา';
                courseSummary = `(เช้า) ${a.morning.slice(0, 55)}... | (บ่าย) ${a.afternoon.slice(0, 55)}...`;
            } else {
                const trackData = (userTrack === 'FND') ? a.foundation : a.advanced;
                roomLabel = `${trackData.room} (${userTrack})`;
                courseSummary = `(เช้า) ${trackData.morning.slice(0, 55)}... | (บ่าย) ${trackData.afternoon.slice(0, 55)}...`;
            }

            const preScoreStr = a.preTestScore !== undefined ? `Pre: ${a.preTestScore}/${a.preTestMax || 10}` : '';
            const postScoreStr = a.postTestScore !== undefined ? `Post: ${a.postTestScore}/${a.postTestMax || 10}` : '';
            const testScoreBadge = (preScoreStr || postScoreStr) ? `<span class="bg-blue-50 text-blue-800 text-[10px] px-1.5 py-0.2 rounded border border-blue-200 font-semibold">${[preScoreStr, postScoreStr].filter(Boolean).join(' ➔ ')}</span>` : '';

            return `
                <div class="py-2 flex items-start justify-between gap-2">
                    <div class="flex-grow">
                        <div class="flex items-center space-x-2 flex-wrap gap-1">
                            <span class="font-bold text-slate-800">วันที่ ${a.day} (${a.date}): ${a.title}</span>
                            <span class="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded font-semibold">${roomLabel}</span>
                            ${testScoreBadge}
                        </div>
                        <p class="text-[11px] text-slate-600 mt-0.5">${courseSummary}</p>
                        <p class="text-[10px] text-slate-400 italic">สรุป: ${a.reflection || '-'}</p>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded ${a.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'} shrink-0">
                        ${a.status === 'PRESENT' ? 'เข้าเรียน' : 'ขาด/ลา'}
                    </span>
                </div>
            `;
        }).join('');
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
            saveParticipantsToStorage();
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
    localStorage.removeItem(PARTICIPANTS_STORAGE_KEY);
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

// --------------------------------------------------------------------------
// 12. Security & Passcode Access Control Engine
// --------------------------------------------------------------------------
const PIN_CODE_KEY = 'civil_servant_security_pin';
const AUTH_SESSION_KEY = 'civil_servant_session_unlocked';
const REMEMBER_DEVICE_KEY = 'civil_servant_remember_device';
const DEFAULT_PIN = '2569';

function initSecurityLock() {
    const isRemembered = localStorage.getItem(REMEMBER_DEVICE_KEY) === 'true';
    const isSessionUnlocked = sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';

    const overlay = document.getElementById('lock-screen-overlay');
    if (!overlay) return;

    if (isRemembered || isSessionUnlocked) {
        overlay.classList.add('hidden');
    } else {
        overlay.classList.remove('hidden');
        const pinInput = document.getElementById('lock-pin-input');
        if (pinInput) {
            pinInput.value = '';
            pinInput.addEventListener('input', () => {
                updatePinDots();
                const currentPin = getStoredPin();
                if (pinInput.value.length === currentPin.length) {
                    submitPinUnlock();
                }
            });
            setTimeout(() => pinInput.focus(), 200);
        }
        updatePinDots();
    }
}

function getStoredPin() {
    return localStorage.getItem(PIN_CODE_KEY) || DEFAULT_PIN;
}

function updatePinDots() {
    const pinInput = document.getElementById('lock-pin-input');
    const val = pinInput ? pinInput.value : '';
    const currentPin = getStoredPin();
    const len = currentPin.length || 4;

    const container = document.getElementById('pin-dots-container');
    if (container) {
        let dotsHtml = '';
        for (let i = 0; i < len; i++) {
            const isFilled = i < val.length;
            dotsHtml += `<div class="w-4 h-4 rounded-full border-2 transition-all duration-200 ${isFilled ? 'bg-govNavy border-govNavy scale-110' : 'border-slate-300 bg-white'}" id="dot-${i+1}"></div>`;
        }
        container.innerHTML = dotsHtml;
    }
}

function keypadPress(digit) {
    const pinInput = document.getElementById('lock-pin-input');
    if (!pinInput) return;

    const currentPin = getStoredPin();
    if (pinInput.value.length < currentPin.length) {
        pinInput.value += digit;
        updatePinDots();
        if (pinInput.value.length === currentPin.length) {
            submitPinUnlock();
        }
    }
}

function keypadClear() {
    const pinInput = document.getElementById('lock-pin-input');
    if (pinInput) {
        pinInput.value = '';
        updatePinDots();
        const err = document.getElementById('lock-error-msg');
        if (err) err.classList.add('hidden');
    }
}

function keypadBackspace() {
    const pinInput = document.getElementById('lock-pin-input');
    if (pinInput && pinInput.value.length > 0) {
        pinInput.value = pinInput.value.slice(0, -1);
        updatePinDots();
    }
}

function submitPinUnlock() {
    const pinInput = document.getElementById('lock-pin-input');
    const entered = pinInput ? pinInput.value.trim() : '';
    const correctPin = getStoredPin();
    const errMsg = document.getElementById('lock-error-msg');
    const overlay = document.getElementById('lock-screen-overlay');
    const rememberChk = document.getElementById('lock-remember-device');

    if (entered === correctPin) {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        if (rememberChk && rememberChk.checked) {
            localStorage.setItem(REMEMBER_DEVICE_KEY, 'true');
        } else {
            localStorage.removeItem(REMEMBER_DEVICE_KEY);
        }

        if (errMsg) errMsg.classList.add('hidden');
        if (overlay) {
            overlay.classList.add('opacity-0');
            setTimeout(() => {
                overlay.classList.add('hidden');
                overlay.classList.remove('opacity-0');
            }, 250);
        }
        showToast('ปลดล็อคเข้าสู่ระบบสำเร็จ ยินดีต้อนรับครับ');
    } else {
        if (errMsg) {
            errMsg.classList.remove('hidden');
        }
        if (pinInput) {
            pinInput.value = '';
            pinInput.classList.add('border-rose-500', 'animate-shake');
            setTimeout(() => {
                pinInput.classList.remove('border-rose-500', 'animate-shake');
                updatePinDots();
            }, 600);
        }
    }
}

function lockAppImmediately() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(REMEMBER_DEVICE_KEY);

    const overlay = document.getElementById('lock-screen-overlay');
    const pinInput = document.getElementById('lock-pin-input');
    const errMsg = document.getElementById('lock-error-msg');

    if (errMsg) errMsg.classList.add('hidden');
    if (pinInput) {
        pinInput.value = '';
    }
    updatePinDots();

    if (overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            if (pinInput) pinInput.focus();
        }, 200);
    }
    showToast('ล็อคหน้าจอระบบเรียบร้อยแล้ว');
}

function openChangePinModal() {
    setInputValue('pin-old', '');
    setInputValue('pin-new', '');
    setInputValue('pin-confirm', '');
    openModal('modal-change-pin');
}

function saveNewSecurityPin() {
    const oldPin = getInputValue('pin-old');
    const newPin = getInputValue('pin-new');
    const confirmPin = getInputValue('pin-confirm');
    const storedPin = getStoredPin();

    if (oldPin !== storedPin) {
        alert('รหัส PIN ปัจจุบันไม่ถูกต้อง');
        return;
    }

    if (!newPin || newPin.length < 4 || newPin.length > 8) {
        alert('รหัส PIN ใหม่ต้องเป็นตัวเลข 4-8 หลัก');
        return;
    }

    if (newPin !== confirmPin) {
        alert('รหัส PIN ใหม่และการยืนยันไม่ตรงกัน');
        return;
    }

    localStorage.setItem(PIN_CODE_KEY, newPin);
    closeModal('modal-change-pin');
    showToast('เปลี่ยนรหัสผ่าน PIN ใหม่เรียบร้อยแล้ว');
}

function clearRememberedDevice() {
    localStorage.removeItem(REMEMBER_DEVICE_KEY);
    showToast('ล้างสิทธิ์การจำเครื่อง 30 วันแล้ว (จะถามรหัส PIN เมื่อเปิดแอปใหม่)');
}
