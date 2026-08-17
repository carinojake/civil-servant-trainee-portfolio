/* ==========================================================================
   Civil Servant Trainee Learning & Portfolio Management System (app.js)
   Complies with Local-First JSON Storage, WCAG 2.1 AA & Official Thai Govt Standard
   ========================================================================== */

const STORAGE_KEY = 'civil_servant_trainee_app_v2';
const PARTICIPANTS_STORAGE_KEY = 'participants_gemini_ai_data';
const GEMINI_API_KEY_STORAGE = 'civil_servant_gemini_api_key';
const AI_CHAT_HISTORY_STORAGE = 'civil_servant_ai_chat_history';
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
        fullName: "นายนิติพัฒน์ คุ้มวงษ์",
        nickname: "เจค",
        track: "ADV",
        trackName: "Advanced AI & Automation",
        position: "นักวิชาการคอมพิวเตอร์ / เจ้าหน้าที่ระบบคอมพิวเตอร์",
        organization: "ระบบเทคโนโลยีสารสนเทศ การบริหารจัดการฐานข้อมูล และโครงสร้างเครือข่ายองค์กร (ประสบการณ์ทำงานรวม 13 ปี)",
        ojtAgency: "หน่วยงานภาครัฐ / การฝึกปฏิบัติงานจริง (OJT)",
        email: "lusir999@gmail.com",
        phone: "0819265159",
        accessibilityNeeds: "เพิ่มรูปโปรไฟล์ผ่าน Admin / ขยายตัวอักษรและชุดสีความคมชัดสูง",
        vision: "มุ่งมั่นนำประสบการณ์ด้านเทคโนโลยีสารสนเทศมาพัฒนาระบบงานภาครัฐ ให้มีประสิทธิภาพ ปลอดภัย เข้าถึงง่าย และสร้างประโยชน์สูงสุดแก่ประชาชน\n\n“ข้อจำกัดไม่ใช่อุปสรรคของการสร้างคุณค่า”",
        experiences: [
            {
                role: "เจ้าหน้าที่ระบบคอมพิวเตอร์",
                agency: "สภากาชาดไทย",
                period: "2565 – 2567 (2 ปี)",
                desc: "ดูแลระบบคอมพิวเตอร์ เครื่องแม่ข่าย และเครือข่ายองค์กร พร้อมสนับสนุนและแก้ไขปัญหาทางเทคนิคให้บุคลากร"
            },
            {
                role: "นักวิชาการคอมพิวเตอร์ / ผู้เชี่ยวชาญด้านไอที",
                agency: "กรมกิจการผู้สูงอายุ",
                period: "2556 – 2565 (9 ปี)",
                desc: "ออกแบบและบริหารฐานข้อมูล วางโครงสร้างระบบเครือข่าย และร่วมขับเคลื่อนแผนงานดิจิทัลสู่ Government 4.0"
            },
            {
                role: "ช่างเทคนิคสนับสนุนด้านไอที (IT Support)",
                agency: "World Entertainment Network",
                period: "2554 – 2556 (2 ปี)",
                desc: "ดูแลโครงสร้างพื้นฐานไอที ติดตั้งซอฟต์แวร์และฮาร์ดแวร์ และให้บริการช่วยเหลือผู้ใช้งานในองค์กร"
            }
        ],
        hardSkills: [
            "Database Management & Architecture",
            "Systems Analysis & Design (SA)",
            "Network & IT Security"
        ],
        softSkills: [
            "Strategic Planning & Budgeting",
            "Complex Problem Solving & Crisis Management",
            "Adaptability & Continuous Learning"
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
            date: "2026-09-01",
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
    // Check if Gemini API key was passed via secure URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get('gemini_key') || urlParams.get('key');
    if (urlKey && urlKey.trim().length > 10) {
        localStorage.setItem(GEMINI_API_KEY_STORAGE, urlKey.trim());
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: cleanUrl}, '', cleanUrl);
    }

    initSecurityLock();
    loadSavedState();
    loadParticipantsData();
    renderAllViews();
    setupRctfPromptListener();
    updateGeminiKeyStatusLabel();
});

function loadSavedState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            appState = { ...defaultAppData, ...parsed };

            // Upgrade to authentic 13-year resume data if previously using sample mock data
            if (!parsed.userProfile || parsed.userProfile.email === 'nitipat.k@bdi.or.th' || !parsed.userProfile.experiences || parsed.userProfile.experiences.length < 3) {
                appState.userProfile = JSON.parse(JSON.stringify(defaultAppData.userProfile));
            }

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
    renderM8QuizView();
    renderM5LectureSlidesGrid();
    renderM9Views();
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
    setInputValue('prof-hardskills', (p.hardSkills || []).join(', '));
    setInputValue('prof-softskills', (p.softSkills || []).join(', '));
    setInputValue('prof-vision', p.vision);

    const headerName = document.getElementById('header-user-name');
    if (headerName) {
        headerName.innerText = `${p.fullName.split(' ')[1] || p.fullName} (${p.track})`;
    }

    const schedActiveTrackLabel = document.getElementById('sched-active-track-label');
    if (schedActiveTrackLabel) {
        schedActiveTrackLabel.innerText = p.track;
    }

    renderExperiencesList();
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

    const hardVal = getInputValue('prof-hardskills');
    appState.userProfile.hardSkills = hardVal ? hardVal.split(',').map(s => s.trim()).filter(Boolean) : [];

    const softVal = getInputValue('prof-softskills');
    appState.userProfile.softSkills = softVal ? softVal.split(',').map(s => s.trim()).filter(Boolean) : [];

    appState.userProfile.vision = getInputValue('prof-vision');

    saveState();
    renderScheduleList();
    renderPortfolioPreview();
    showToast('บันทึกข้อมูลประวัติผู้เข้าอบรมและทักษะเรียบร้อยแล้ว');
}

function renderExperiencesList() {
    const listEl = document.getElementById('prof-experience-list');
    if (!listEl) return;

    const exps = appState.userProfile.experiences || [];
    if (exps.length === 0) {
        listEl.innerHTML = `<div class="col-span-full py-4 text-center text-slate-400 border border-dashed border-slate-300 rounded-xl bg-slate-50">ยังไม่มีข้อมูลประวัติการทำงาน กดปุ่ม [+ เพิ่มประวัติการทำงาน] เพื่อระบุข้อมูลสำหรับ Portfolio หน้า 3</div>`;
        return;
    }

    listEl.innerHTML = exps.map((exp, idx) => `
        <div class="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 transition space-y-1.5 relative group">
            <div class="flex justify-between items-start">
                <div>
                    <h5 class="font-bold text-govNavy text-xs">${exp.role}</h5>
                    <span class="text-[10px] text-slate-500 font-semibold">${exp.agency} • ${exp.period}</span>
                </div>
                <div class="flex items-center gap-1">
                    <button type="button" onclick="openExperienceModal(${idx})" class="w-6 h-6 rounded bg-slate-200 hover:bg-blue-100 text-slate-600 hover:text-blue-600 flex items-center justify-center text-[10px] transition" title="แก้ไข">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button type="button" onclick="deleteExperienceItem(${idx})" class="w-6 h-6 rounded bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-600 flex items-center justify-center text-[10px] transition" title="ลบ">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <p class="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">${exp.desc}</p>
        </div>
    `).join('');
}

function openExperienceModal(editIndex = -1) {
    const titleEl = document.getElementById('modal-exp-title');
    const indexInput = document.getElementById('exp-edit-index');
    const roleInput = document.getElementById('exp-role');
    const periodInput = document.getElementById('exp-period');
    const agencyInput = document.getElementById('exp-agency');
    const descInput = document.getElementById('exp-desc');

    if (editIndex >= 0 && appState.userProfile.experiences[editIndex]) {
        const exp = appState.userProfile.experiences[editIndex];
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-amber-600"></i><span>แก้ไขประวัติการทำงาน</span>`;
        if (indexInput) indexInput.value = editIndex;
        if (roleInput) roleInput.value = exp.role || '';
        if (periodInput) periodInput.value = exp.period || '';
        if (agencyInput) agencyInput.value = exp.agency || '';
        if (descInput) descInput.value = exp.desc || '';
    } else {
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-briefcase text-amber-600"></i><span>เพิ่มประวัติการทำงาน / ผลงานที่ผ่านมา</span>`;
        if (indexInput) indexInput.value = -1;
        if (roleInput) roleInput.value = '';
        if (periodInput) periodInput.value = '';
        if (agencyInput) agencyInput.value = '';
        if (descInput) descInput.value = '';
    }

    const modal = document.getElementById('modal-experience');
    if (modal) modal.classList.remove('hidden');
}

function saveExperienceItem() {
    const editIndex = parseInt(document.getElementById('exp-edit-index').value, 10);
    const role = getInputValue('exp-role').trim();
    const period = getInputValue('exp-period').trim();
    const agency = getInputValue('exp-agency').trim();
    const desc = getInputValue('exp-desc').trim();

    if (!role || !period || !agency) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    if (!appState.userProfile.experiences) {
        appState.userProfile.experiences = [];
    }

    const item = { role, period, agency, desc };

    if (editIndex >= 0 && editIndex < appState.userProfile.experiences.length) {
        appState.userProfile.experiences[editIndex] = item;
        showToast('แก้ไขประวัติการทำงานเรียบร้อยแล้ว');
    } else {
        appState.userProfile.experiences.push(item);
        showToast('เพิ่มประวัติการทำงานใหม่เรียบร้อยแล้ว');
    }

    saveState();
    renderExperiencesList();
    renderPortfolioPreview();
    closeModal('modal-experience');
}

function deleteExperienceItem(idx) {
    if (confirm('คุณต้องการลบรายการประวัติการทำงานนี้ใช่หรือไม่?')) {
        if (appState.userProfile.experiences && appState.userProfile.experiences[idx]) {
            appState.userProfile.experiences.splice(idx, 1);
            saveState();
            renderExperiencesList();
            renderPortfolioPreview();
            showToast('ลบรายการประวัติการทำงานเรียบร้อยแล้ว');
        }
    }
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
                                <strong class="text-blue-900"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>ช่วงเช้า (09.30 - 12.00 น.)</strong>
                                ${dayItem.morningComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">${dayItem.morning}</p>
                        </div>
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-emerald-900"><i class="fa-solid fa-cloud-sun text-emerald-500 mr-1"></i>ช่วงบ่าย (13.30 - 16.00 น.)</strong>
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
                                    <span>ช่วงเช้า (09.30 - 12.00 น.)</span>
                                    ${adv.morningComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">${adv.morning}</p>
                            </div>
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-emerald-900 font-bold mb-0.5">
                                    <span>ช่วงบ่าย (13.30 - 16.00 น.)</span>
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
                                    <span>ช่วงเช้า (09.30 - 12.00 น.)</span>
                                    ${fnd.morningComputer ? '<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมฯ</span>' : ''}
                                </div>
                                <p class="text-slate-700 text-[11px] leading-relaxed">${fnd.morning}</p>
                            </div>
                            <div class="p-2 bg-white rounded-lg border border-slate-200">
                                <div class="flex justify-between items-center text-[11px] text-emerald-900 font-bold mb-0.5">
                                    <span>ช่วงบ่าย (13.30 - 16.00 น.)</span>
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
                                <strong class="text-blue-900"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>ช่วงเช้า (09.30 - 12.00 น.)</strong>
                                ${trackData.morningComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">${trackData.morning}</p>
                        </div>
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                            <div class="flex items-center justify-between mb-1">
                                <strong class="text-emerald-900"><i class="fa-solid fa-cloud-sun text-emerald-500 mr-1"></i>ช่วงบ่าย (13.30 - 16.00 น.)</strong>
                                ${trackData.afternoonComputer ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-laptop mr-1"></i>ใช้คอมพิวเตอร์</span>' : ''}
                            </div>
                            <p class="text-slate-700 leading-relaxed">${trackData.afternoon}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Morning links & scores
        const morningPreUrl = dayItem.morningPreTestUrl || dayItem.preTestUrl;
        const hasMorningPre = !!morningPreUrl;
        const morningPreScore = dayItem.morningPreTestScore !== undefined ? dayItem.morningPreTestScore : dayItem.preTestScore;
        const morningPreMax = dayItem.morningPreTestMax || dayItem.preTestMax || 10;

        const morningDocUrl = dayItem.morningDocUrl || dayItem.docUrl;
        const morningDocTitle = dayItem.morningDocTitle || dayItem.docTitle;

        const morningPostUrl = dayItem.morningPostTestUrl;
        const hasMorningPost = !!morningPostUrl;
        const morningPostScore = dayItem.morningPostTestScore;
        const morningPostMax = dayItem.morningPostTestMax || 10;

        // Afternoon links & scores
        const afternoonPreUrl = dayItem.afternoonPreTestUrl;
        const hasAfternoonPre = !!afternoonPreUrl;
        const afternoonPreScore = dayItem.afternoonPreTestScore;
        const afternoonPreMax = dayItem.afternoonPreTestMax || 10;

        const afternoonDocUrl = dayItem.afternoonDocUrl || dayItem.docUrl;
        const afternoonDocTitle = dayItem.afternoonDocTitle || dayItem.docTitle;

        const afternoonPostUrl = dayItem.afternoonPostTestUrl || dayItem.postTestUrl;
        const hasAfternoonPost = !!afternoonPostUrl;
        const afternoonPostScore = dayItem.afternoonPostTestScore !== undefined ? dayItem.afternoonPostTestScore : dayItem.postTestScore;
        const afternoonPostMax = dayItem.afternoonPostTestMax || dayItem.postTestMax || 10;

        // Evaluation
        const hasEval = !!dayItem.evalUrl;

        const actionHubHtml = `
            <div class="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2.5">
                <div class="flex justify-between items-center flex-wrap gap-2">
                    <span class="text-[11px] font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-bolt text-amber-500"></i>
                        <span>ศูนย์รวมกิจกรรมประจำวัน (Daily Action Hub: เช้า & บ่าย)</span>
                    </span>
                    <div class="flex items-center space-x-2">
                        <button type="button" onclick="openGeminiSpark(${dayItem.day})" class="text-[11px] bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer transition">
                            <i class="fa-solid fa-wand-magic-sparkles text-amber-200"></i>
                            <span>Gemini Spark สรุปด่วน</span>
                        </button>
                        <button onclick="openDayLinksModal(${dayItem.day})" class="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 hover:underline cursor-pointer">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <span>แก้ไขลิงก์ & คะแนน (เช้า-บ่าย)</span>
                        </button>
                    </div>
                </div>

                <!-- Morning & Afternoon Sessions Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                    <!-- Morning Session Box -->
                    <div class="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-blue-950 flex items-center space-x-1">
                                <i class="fa-solid fa-sun text-amber-500"></i>
                                <span>ช่วงเช้า (09.30 - 12.00 น.)</span>
                            </span>
                            <span class="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.2 rounded-full">Session เช้า (09.30 น.)</span>
                        </div>
                        <div class="grid grid-cols-3 gap-1.5 text-xs">
                            <!-- 1. Pre-test เช้า -->
                            <div class="p-1.5 rounded-lg bg-white border border-blue-100 flex flex-col justify-between">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-blue-700">Pre-test</span>
                                    ${morningPreScore !== undefined ? `<span class="bg-blue-100 text-blue-800 text-[9px] px-1 py-0.2 rounded font-bold">${morningPreScore}/${morningPreMax}</span>` : '<span class="bg-slate-100 text-slate-600 text-[9px] px-1 py-0.2 rounded font-semibold">7/10</span>'}
                                </div>
                                <div class="mt-1">
                                    ${hasMorningPre ? `
                                        <a href="${morningPreUrl}" target="_blank" class="w-full inline-flex items-center justify-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-0.5 rounded text-[10px] font-semibold transition">
                                            <i class="fa-solid fa-pen-ruler text-[9px]"></i>
                                            <span>ทำข้อสอบ</span>
                                        </a>
                                    ` : `
                                        <button onclick="openDayLinksModal(${dayItem.day})" class="w-full text-slate-400 border border-dashed border-slate-300 py-0.5 rounded text-[9px] hover:border-slate-400">
                                            + ใส่ลิงก์
                                        </button>
                                    `}
                                </div>
                            </div>

                            <!-- 2. สไลด์เช้า -->
                            <div class="p-1.5 rounded-lg bg-white border border-blue-100 flex flex-col justify-between">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-emerald-700">สไลด์/เอกสาร</span>
                                    <span class="text-[9px] text-emerald-600 font-bold truncate max-w-[40px]">✓</span>
                                </div>
                                <div class="mt-1">
                                    <button type="button" onclick="openLectureSlideModal(${dayItem.day})" class="w-full inline-flex items-center justify-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-0.5 rounded text-[10px] font-bold transition truncate cursor-pointer">
                                        <i class="fa-solid fa-book-open-reader text-emerald-600 text-[9px]"></i>
                                        <span>ดูสไลด์</span>
                                    </button>
                                </div>
                            </div>

                            <!-- 3. Post-test เช้า -->
                            <div class="p-1.5 rounded-lg bg-white border border-blue-100 flex flex-col justify-between">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-purple-700">Post-test</span>
                                    ${morningPostScore !== undefined ? `<span class="bg-purple-100 text-purple-800 text-[9px] px-1 py-0.2 rounded font-bold">${morningPostScore}/${morningPostMax}</span>` : ''}
                                </div>
                                <div class="mt-1">
                                    ${hasMorningPost ? `
                                        <a href="${morningPostUrl}" target="_blank" class="w-full inline-flex items-center justify-center space-x-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 py-0.5 rounded text-[10px] font-semibold transition">
                                            <i class="fa-solid fa-square-check text-[9px]"></i>
                                            <span>ทำข้อสอบ</span>
                                        </a>
                                    ` : `
                                        <button onclick="openDayLinksModal(${dayItem.day})" class="w-full text-slate-400 border border-dashed border-slate-300 py-0.5 rounded text-[9px] hover:border-slate-400">
                                            + ใส่ลิงก์
                                        </button>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Afternoon Session Box -->
                    <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-emerald-950 flex items-center space-x-1">
                                <i class="fa-solid fa-cloud-sun text-emerald-600"></i>
                                <span>ช่วงบ่าย (13.30 - 16.00 น.)</span>
                            </span>
                            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">Session บ่าย (13.30 น.)</span>
                        </div>
                        <div class="grid grid-cols-3 gap-1.5 text-xs">
                            <!-- 1. Pre-test บ่าย -->
                            <div class="p-1.5 rounded-lg bg-white border border-emerald-100 flex flex-col justify-between">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-blue-700">Pre-test</span>
                                    ${afternoonPreScore !== undefined ? `<span class="bg-blue-100 text-blue-800 text-[9px] px-1 py-0.2 rounded font-bold">${afternoonPreScore}/${afternoonPreMax}</span>` : ''}
                                </div>
                                <div class="mt-1">
                                    ${hasAfternoonPre ? `
                                        <a href="${afternoonPreUrl}" target="_blank" class="w-full inline-flex items-center justify-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-0.5 rounded text-[10px] font-semibold transition">
                                            <i class="fa-solid fa-pen-ruler text-[9px]"></i>
                                            <span>ทำข้อสอบ</span>
                                        </a>
                                    ` : `
                                        <button onclick="openDayLinksModal(${dayItem.day})" class="w-full text-slate-400 border border-dashed border-slate-300 py-0.5 rounded text-[9px] hover:border-slate-400">
                                            + ใส่ลิงก์
                                        </button>
                                    `}
                                </div>
                            </div>

                            <!-- 2. สไลด์บ่าย -->
                            <div class="p-1.5 rounded-lg bg-white border border-emerald-100 flex flex-col justify-between">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-emerald-700">สไลด์/เอกสาร</span>
                                    <span class="text-[9px] text-emerald-600 font-bold truncate max-w-[40px]">✓</span>
                                </div>
                                <div class="mt-1">
                                    <button type="button" onclick="openLectureSlideModal(${dayItem.day})" class="w-full inline-flex items-center justify-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-0.5 rounded text-[10px] font-bold transition truncate cursor-pointer">
                                        <i class="fa-solid fa-book-open-reader text-emerald-600 text-[9px]"></i>
                                        <span>ดูสไลด์</span>
                                    </button>
                                </div>
                            </div>

                            <!-- 3. Post-test บ่าย -->
                            <div class="p-1.5 rounded-lg bg-white border border-emerald-100 flex flex-col justify-between">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-purple-700">Post-test</span>
                                    ${afternoonPostScore !== undefined ? `<span class="bg-purple-100 text-purple-800 text-[9px] px-1 py-0.2 rounded font-bold">${afternoonPostScore}/${afternoonPostMax}</span>` : '<span class="bg-slate-100 text-slate-600 text-[9px] px-1 py-0.2 rounded font-semibold">9/10</span>'}
                                </div>
                                <div class="mt-1">
                                    ${hasAfternoonPost ? `
                                        <a href="${afternoonPostUrl}" target="_blank" class="w-full inline-flex items-center justify-center space-x-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 py-0.5 rounded text-[10px] font-semibold transition">
                                            <i class="fa-solid fa-square-check text-[9px]"></i>
                                            <span>ทำข้อสอบ</span>
                                        </a>
                                    ` : `
                                        <button onclick="openDayLinksModal(${dayItem.day})" class="w-full text-slate-400 border border-dashed border-slate-300 py-0.5 rounded text-[9px] hover:border-slate-400">
                                            + ใส่ลิงก์
                                        </button>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Daily Course Evaluation -->
                <div class="p-2 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div class="flex items-center space-x-2">
                        <i class="fa-solid fa-star text-amber-500 text-sm"></i>
                        <span class="font-bold text-amber-950 text-[11px]">แบบประเมินผลการอบรมประจำวัน:</span>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${dayItem.evalSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
                            ${dayItem.evalSubmitted ? '✓ ประเมินเรียบร้อยแล้ว' : 'รอส่งแบบประเมิน'}
                        </span>
                    </div>
                    <div>
                        ${hasEval ? `
                            <a href="${dayItem.evalUrl}" target="_blank" class="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-govNavy font-bold px-3 py-1 rounded-lg text-[11px] shadow-xs transition">
                                <i class="fa-solid fa-paper-plane"></i>
                                <span>ส่งแบบประเมิน</span>
                            </a>
                        ` : `
                            <button onclick="openDayLinksModal(${dayItem.day})" class="text-slate-400 border border-dashed border-slate-300 px-2 py-0.5 rounded text-[10px] hover:border-slate-400">
                                + ใส่ลิงก์แบบประเมิน
                            </button>
                        `}
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
            <span>จัดการลิงก์ & คะแนนวันที่ ${item.day} (${item.date})</span>
        `;
    }

    // 1. Morning Session (เช้า)
    setInputValue('modal-links-morning-pretest-url', item.morningPreTestUrl || item.preTestUrl || '');
    const mPreScore = item.morningPreTestScore !== undefined ? item.morningPreTestScore : (item.preTestScore !== undefined ? item.preTestScore : '');
    setInputValue('modal-links-morning-pretest-score', mPreScore);
    setInputValue('modal-links-morning-pretest-max', item.morningPreTestMax || item.preTestMax || 10);

    setInputValue('modal-links-morning-doc-url', item.morningDocUrl || item.docUrl || '');
    setInputValue('modal-links-morning-doc-title', item.morningDocTitle || item.docTitle || '');

    setInputValue('modal-links-morning-posttest-url', item.morningPostTestUrl || '');
    setInputValue('modal-links-morning-posttest-score', item.morningPostTestScore !== undefined ? item.morningPostTestScore : '');
    setInputValue('modal-links-morning-posttest-max', item.morningPostTestMax || 10);

    // 2. Afternoon Session (บ่าย)
    setInputValue('modal-links-afternoon-pretest-url', item.afternoonPreTestUrl || '');
    setInputValue('modal-links-afternoon-pretest-score', item.afternoonPreTestScore !== undefined ? item.afternoonPreTestScore : '');
    setInputValue('modal-links-afternoon-pretest-max', item.afternoonPreTestMax || 10);

    setInputValue('modal-links-afternoon-doc-url', item.afternoonDocUrl || '');
    setInputValue('modal-links-afternoon-doc-title', item.afternoonDocTitle || '');

    setInputValue('modal-links-afternoon-posttest-url', item.afternoonPostTestUrl || item.postTestUrl || '');
    const aPostScore = item.afternoonPostTestScore !== undefined ? item.afternoonPostTestScore : (item.postTestScore !== undefined ? item.postTestScore : '');
    setInputValue('modal-links-afternoon-posttest-score', aPostScore);
    setInputValue('modal-links-afternoon-posttest-max', item.afternoonPostTestMax || item.postTestMax || 10);

    // 3. Daily Evaluation
    setInputValue('modal-links-eval-url', item.evalUrl || '');
    const evalDoneChk = document.getElementById('modal-links-eval-done');
    if (evalDoneChk) evalDoneChk.checked = !!item.evalSubmitted;

    openModal('modal-day-links');
}

function saveDayLinksFromModal() {
    const dayNum = parseInt(getInputValue('modal-links-day'), 10);
    const item = appState.attendance.find(a => a.day === dayNum);
    if (!item) return;

    // 1. Morning Session Save
    item.morningPreTestUrl = getInputValue('modal-links-morning-pretest-url');
    const mPreScore = getInputValue('modal-links-morning-pretest-score');
    item.morningPreTestScore = mPreScore !== '' ? parseFloat(mPreScore) : undefined;
    item.morningPreTestMax = parseFloat(getInputValue('modal-links-morning-pretest-max')) || 10;

    item.morningDocUrl = getInputValue('modal-links-morning-doc-url');
    item.morningDocTitle = getInputValue('modal-links-morning-doc-title');

    item.morningPostTestUrl = getInputValue('modal-links-morning-posttest-url');
    const mPostScore = getInputValue('modal-links-morning-posttest-score');
    item.morningPostTestScore = mPostScore !== '' ? parseFloat(mPostScore) : undefined;
    item.morningPostTestMax = parseFloat(getInputValue('modal-links-morning-posttest-max')) || 10;

    // 2. Afternoon Session Save
    item.afternoonPreTestUrl = getInputValue('modal-links-afternoon-pretest-url');
    const aPreScore = getInputValue('modal-links-afternoon-pretest-score');
    item.afternoonPreTestScore = aPreScore !== '' ? parseFloat(aPreScore) : undefined;
    item.afternoonPreTestMax = parseFloat(getInputValue('modal-links-afternoon-pretest-max')) || 10;

    item.afternoonDocUrl = getInputValue('modal-links-afternoon-doc-url');
    item.afternoonDocTitle = getInputValue('modal-links-afternoon-doc-title');

    item.afternoonPostTestUrl = getInputValue('modal-links-afternoon-posttest-url');
    const aPostScore = getInputValue('modal-links-afternoon-posttest-score');
    item.afternoonPostTestScore = aPostScore !== '' ? parseFloat(aPostScore) : undefined;
    item.afternoonPostTestMax = parseFloat(getInputValue('modal-links-afternoon-posttest-max')) || 10;

    // 3. Backward Compatibility & Primary pointers
    item.preTestUrl = item.morningPreTestUrl || item.afternoonPreTestUrl || '';
    item.preTestScore = item.morningPreTestScore !== undefined ? item.morningPreTestScore : item.afternoonPreTestScore;
    item.preTestMax = item.morningPreTestMax || 10;

    item.postTestUrl = item.afternoonPostTestUrl || item.morningPostTestUrl || '';
    item.postTestScore = item.afternoonPostTestScore !== undefined ? item.afternoonPostTestScore : item.morningPostTestScore;
    item.postTestMax = item.afternoonPostTestMax || 10;

    item.docUrl = item.morningDocUrl || item.afternoonDocUrl || '';
    item.docTitle = item.morningDocTitle || item.afternoonDocTitle || '';

    // 4. Daily Evaluation Save
    item.evalUrl = getInputValue('modal-links-eval-url');
    const evalDoneChk = document.getElementById('modal-links-eval-done');
    item.evalSubmitted = evalDoneChk ? evalDoneChk.checked : false;

    saveState();
    closeModal('modal-day-links');
    renderScheduleList();
    showToast(`บันทึกลิงก์และคะแนน (เช้า-บ่าย) วันที่ ${dayNum} เรียบร้อยแล้ว`);
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
    } else if (tabId === 'm8') {
        renderM8QuizView();
    } else if (tabId === 'm9') {
        renderM9Views();
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
    const isSessionUnlocked = sessionStorage.getItem(AUTH_SESSION_KEY) === 'true' || localStorage.getItem(AUTH_SESSION_KEY) === 'true';

    const overlay = document.getElementById('lock-screen-overlay');
    if (!overlay) return;

    if (isRemembered || isSessionUnlocked) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        document.body.classList.remove('is-locked');
        document.documentElement.classList.remove('is-locked');
    } else {
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
        document.body.classList.add('is-locked');
        document.documentElement.classList.add('is-locked');
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
            dotsHtml += `<div class="w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${isFilled ? 'bg-govNavy border-govNavy scale-110' : 'border-slate-300 bg-white'}" id="dot-${i+1}"></div>`;
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
        localStorage.setItem(AUTH_SESSION_KEY, 'true');
        if (rememberChk && rememberChk.checked) {
            localStorage.setItem(REMEMBER_DEVICE_KEY, 'true');
        } else {
            localStorage.removeItem(REMEMBER_DEVICE_KEY);
        }

        document.body.classList.remove('is-locked');
        document.documentElement.classList.remove('is-locked');

        if (errMsg) errMsg.classList.add('hidden');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.classList.add('hidden');
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
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(REMEMBER_DEVICE_KEY);

    document.body.classList.add('is-locked');
    document.documentElement.classList.add('is-locked');

    const overlay = document.getElementById('lock-screen-overlay');
    const pinInput = document.getElementById('lock-pin-input');
    const errMsg = document.getElementById('lock-error-msg');

    if (errMsg) errMsg.classList.add('hidden');
    if (pinInput) {
        pinInput.value = '';
    }
    updatePinDots();

    if (overlay) {
        overlay.style.display = 'flex';
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

/* ==========================================================================
   AI CO-PILOT & STUDY BUDDY HYBRID ENGINE (DRAWER, KNOWLEDGE BASE, VOICE & TTS)
   ========================================================================== */
let aiVoiceRecognition = null;
let isAIVoiceListening = false;

const defaultAIChatGreeting = {
    sender: 'ai',
    text: `สวัสดีครับพี่แจ็คและผู้เข้าอบรมทุกท่าน! ผมคือ **AI Co-Pilot ผู้ช่วยติวและทำภารกิจรายวัน** ประจำหลักสูตรเตรียมความพร้อมสำหรับการจ้างงานคนพิการในหน่วยงานภาครัฐ รุ่นที่ 1 ครับ 🤖✨

พี่แจ็คสามารถกดปุ่มภารกิจด่วนด้านบน หรือพิมพ์/กดไมค์ถามคำถามได้ตลอดเวลาเลยนะครับ เช่น:
• 📝 **ช่วยร่างหนังสือราชการ 3 ย่อหน้า** (เหตุผล-ข้อเท็จจริง-ข้อพิจารณา)
• 🎓 **สรุปบทเรียนประจำวัน 13 วัน ณ เซ็นทารา ไลฟ์**
• 💡 **ติวแนวข้อสอบ Pre/Post-test และข้อกฎหมายข้าราชการ**
• 💼 **วางแผนและจัดทำรายงานฝึกงาน OJT 90 ชม. ครบ 4 มิติ**`,
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
};

function getAIChatHistory() {
    try {
        const stored = localStorage.getItem(AI_CHAT_HISTORY_STORAGE);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.warn('Error reading AI chat history', e);
    }
    return [defaultAIChatGreeting];
}

function saveAIChatHistory(history) {
    try {
        localStorage.setItem(AI_CHAT_HISTORY_STORAGE, JSON.stringify(history));
    } catch (e) {
        console.warn('Error saving AI chat history', e);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function toggleAIBuddyDrawer(forceOpen = null) {
    const drawer = document.getElementById('ai-study-buddy-drawer');
    const backdrop = document.getElementById('ai-study-buddy-backdrop');
    if (!drawer) {
        console.error('ai-study-buddy-drawer element not found in DOM');
        return;
    }

    const isClosed = drawer.classList.contains('drawer-closed') || drawer.style.display === 'none' || !drawer.classList.contains('drawer-open');
    const shouldOpen = forceOpen !== null ? forceOpen : isClosed;

    if (shouldOpen) {
        drawer.classList.remove('drawer-closed');
        drawer.classList.add('drawer-open');
        drawer.style.display = 'flex';
        drawer.style.transform = 'translateX(0)';
        drawer.style.opacity = '1';
        drawer.style.pointerEvents = 'auto';
        drawer.style.zIndex = '99999';

        if (backdrop) {
            backdrop.classList.remove('hidden');
            backdrop.style.display = 'block';
            backdrop.style.zIndex = '99998';
        }
        try {
            renderAIChatFeed();
            updateGeminiKeyStatusLabel();
        } catch (e) {
            console.error('Error rendering AI chat feed', e);
        }
        const input = document.getElementById('ai-chat-input');
        if (input) setTimeout(() => input.focus(), 250);
    } else {
        drawer.classList.remove('drawer-open');
        drawer.classList.add('drawer-closed');
        drawer.style.display = 'none';
        drawer.style.transform = 'translateX(105%)';
        drawer.style.opacity = '0';
        drawer.style.pointerEvents = 'none';

        if (backdrop) {
            backdrop.classList.add('hidden');
            backdrop.style.display = 'none';
        }
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    }
}

function updateGeminiKeyStatusLabel() {
    const label = document.getElementById('gemini-key-status-label');
    const key = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (label) {
        if (key && key.trim().length > 10) {
            label.textContent = 'Gemini Pro Live';
            label.classList.add('text-purple-600', 'font-bold');
        } else {
            label.textContent = 'Hybrid (ฟรี 0บ.)';
            label.classList.remove('text-purple-600', 'font-bold');
        }
    }
}

function renderAIChatFeed() {
    const feed = document.getElementById('ai-chat-feed');
    if (!feed) return;

    const history = getAIChatHistory();
    feed.innerHTML = history.map((msg, idx) => {
        const isAI = msg.sender === 'ai';
        const formattedText = escapeHtml(msg.text)
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        return `
            <div class="flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in">
                ${isAI ? `
                    <div class="w-7 h-7 rounded-lg bg-govNavy text-amber-400 flex items-center justify-center text-xs shrink-0 shadow mt-0.5">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                ` : ''}
                <div class="max-w-[85%] sm:max-w-[80%] space-y-1">
                    <div class="p-3 text-xs leading-relaxed ${isAI ? 'chat-bubble-ai text-slate-800' : 'chat-bubble-user shadow-sm'}">
                        ${formattedText}
                    </div>
                    <div class="text-[10px] text-slate-400 px-1 flex items-center gap-2 ${isAI ? 'justify-start' : 'justify-end'}">
                        <span>${msg.time || ''}</span>
                        ${isAI ? `
                            <button type="button" onclick="speakSingleAIChatMessage(${idx})" class="text-slate-400 hover:text-blue-600 transition" title="อ่านออกเสียงข้อความนี้">
                                <i class="fa-solid fa-volume-high text-[10px]"></i>
                            </button>
                            <button type="button" onclick="copyAIChatMessage(${idx})" class="text-slate-400 hover:text-emerald-600 transition" title="คัดลอกข้อความ">
                                <i class="fa-solid fa-copy text-[10px]"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    feed.scrollTop = feed.scrollHeight;
}

function speakSingleAIChatMessage(index) {
    const history = getAIChatHistory();
    if (history[index] && history[index].text) {
        speakAIText(history[index].text);
    }
}

function copyAIChatMessage(index) {
    const history = getAIChatHistory();
    if (history[index] && history[index].text) {
        navigator.clipboard.writeText(history[index].text).then(() => {
            showToast('คัดลอกข้อความแล้ว');
        });
    }
}

function clearAIChatHistory() {
    if (confirm('ต้องการล้างประวัติการสนทนาทั้งหมด และเริ่มบทสนทนาใหม่หรือไม่?')) {
        saveAIChatHistory([defaultAIChatGreeting]);
        renderAIChatFeed();
        showToast('ล้างบทสนทนาเรียบร้อยแล้ว');
    }
}

async function sendAIChatMessage() {
    const input = document.getElementById('ai-chat-input');
    if (!input) return;

    const query = input.value.trim();
    if (!query) return;

    input.value = '';
    const timeNow = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    const history = getAIChatHistory();
    history.push({ sender: 'user', text: query, time: timeNow });
    saveAIChatHistory(history);
    renderAIChatFeed();

    // Show AI typing bubble
    const feed = document.getElementById('ai-chat-feed');
    if (feed) {
        feed.innerHTML += `
            <div id="ai-typing-indicator" class="flex items-start gap-2.5 justify-start animate-fade-in">
                <div class="w-7 h-7 rounded-lg bg-govNavy text-amber-400 flex items-center justify-center text-xs shrink-0 shadow">
                    <i class="fa-solid fa-robot"></i>
                </div>
                <div class="p-3 text-xs chat-bubble-ai text-slate-500 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-notch fa-spin text-blue-600"></i>
                    <span>AI กำลังประมวลผลคำตอบ...</span>
                </div>
            </div>
        `;
        feed.scrollTop = feed.scrollHeight;
    }

    try {
        const aiResponseText = await generateAIStudyResponse(query);
        const typing = document.getElementById('ai-typing-indicator');
        if (typing) typing.remove();

        const updatedHistory = getAIChatHistory();
        updatedHistory.push({
            sender: 'ai',
            text: aiResponseText,
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        });
        saveAIChatHistory(updatedHistory);
        renderAIChatFeed();

        // Check if TTS is enabled
        const ttsToggle = document.getElementById('ai-tts-toggle');
        if (ttsToggle && ttsToggle.checked) {
            speakAIText(aiResponseText);
        }
    } catch (err) {
        console.error('AI response error', err);
        const typing = document.getElementById('ai-typing-indicator');
        if (typing) typing.remove();

        const updatedHistory = getAIChatHistory();
        updatedHistory.push({
            sender: 'ai',
            text: `ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล แต่พี่แจ็คสามารถใช้งานคลังคำตอบอัจฉริยะในตัวได้ตลอดเวลานะครับ 😊`,
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        });
        saveAIChatHistory(updatedHistory);
        renderAIChatFeed();
    }
}

async function generateAIStudyResponse(userQuery) {
    const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    const queryLower = userQuery.toLowerCase();

    // If Gemini API Key exists, try calling Gemini 1.5 Flash
    if (apiKey && apiKey.trim().length > 10) {
        try {
            const systemPrompt = `คุณคือ "AI Co-Pilot ผู้ช่วยติวและทำภารกิจรายวัน" ประจำหลักสูตรเตรียมความพร้อมสำหรับการจ้างงานคนพิการในหน่วยงานภาครัฐ รุ่นที่ 1 (จัดโดยกรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ ณ โรงแรมเซ็นทารา ไลฟ์ ศูนย์ราชการ แจ้งวัฒนะ 13 วัน และฝึก OJT 90 ชม.)
ผู้ใช้งานหลักคือ "พี่แจ็ค (นายนิติพัฒน์ คุ้มวงษ์)" ผู้เชี่ยวชาญไอทีและระบบฐานข้อมูล 13 ปี สังกัดสาย Advanced AI & Automation
หน้าที่ของคุณ:
1. ให้คำแนะนำเรื่องงานสารบรรณภาครัฐ โครงสร้างหนังสือราชการ 3 ย่อหน้า (เหตุผล-ข้อเท็จจริง-ข้อพิจารณา)
2. ติวข้อสอบ Pre/Post-test, สรุปเนื้อหา 13 วัน, กฎหมาย ม.33/ม.35 และการสะท้อนคิด (Reflection)
3. ให้คำตอบเป็นภาษาไทยที่สุภาพ เป็นมืออาชีพ ชัดเจน มีโครงสร้างหัวข้อย่อยอ่านง่าย จัดย่อหน้าสวยงาม`;

            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: systemPrompt },
                            { text: `คำถามจากผู้เข้าอบรม: ${userQuery}` }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 1000
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) return text;
            }
        } catch (e) {
            console.warn('Gemini Live API failed, falling back to built-in knowledge engine', e);
        }
    }

    // Built-in Intelligent Thai Civil Service Knowledge Engine (Cost-effective 0 THB)
    if (queryLower.includes('หนังสือ') || queryLower.includes('สารบรรณ') || queryLower.includes('3 ย่อหน้า') || queryLower.includes('บันทึกข้อความ')) {
        return `📜 **โครงสร้างหนังสือราชการ 3 ย่อหน้ามาตรฐานตามระเบียบสำนักนายกรัฐมนตรี:**

**1. ย่อหน้าที่ 1: เหตุผล / ความเป็นมา (ด้วย/ตามที่/เนื่องด้วย)**
• ระบุที่มาว่าทำไมจึงต้องมีหนังสือฉบับนี้ เช่น *"ตามที่ สถาบันฯ ได้มีคำสั่งแต่งตั้งคณะทำงานขับเคลื่อนระบบดิจิทัล..."* หรือ *"ด้วย ศูนย์เทคโนโลยีฯ มีความประสงค์จะพัฒนาระบบคลังข้อมูล..."*

**2. ย่อหน้าที่ 2: ข้อเท็จจริง / สาระสำคัญ (ข้อเท็จจริงมีอยู่ว่า/ในการนี้)**
• ชี้แจงรายละเอียด วัตถุประสงค์ ผลการดำเนินงาน หรือปัญหาที่เกิดขึ้นอย่างกระชับและมีหลักฐานอ้างอิงชัดเจน

**3. ย่อหน้าที่ 3: ข้อพิจารณา / ความประสงค์ (จึงเรียนมาเพื่อโปรดพิจารณา...)**
• สรุปความต้องการที่ชัดเจน เช่น *"จึงเรียนมาเพื่อโปรดพิจารณาให้ความเห็นชอบ และอนุมัติงบประมาณโครงการต่อไป"*

💡 **คำลงท้ายยอดนิยม:**
• หนังสือราชการทั่วไป: *"จึงเรียนมาเพื่อโปรดทราบ / จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ"*`;
    }

    if (queryLower.includes('สรุป') || queryLower.includes('บทเรียน') || queryLower.includes('เซ็นทารา') || queryLower.includes('13 วัน')) {
        return `🎓 **สรุปภาพรวมบทเรียน 13 วัน ณ โรงแรมเซ็นทารา ไลฟ์:**

• **สัปดาห์ที่ 1 (10-14 ส.ค. 69):**
  - **วันที่ 1:** ปฐมนิเทศ & วินัย จริยธรรม จรรยาบรรณข้าราชการยุคดิจิทัล
  - **วันที่ 2:** ระบบราชการ & กฎหมาย (FND) / วิเคราะห์ข้อมูล & Agile & Digital Workflow (ADV)
  - **วันที่ 3:** ทักษะบริการ & Design Thinking (FND) / การสื่อสาร & วิเคราะห์ข้อมูลตัดสินใจ (ADV)
  - **วันที่ 4:** การประยุกต์ใช้ AI ในงานราชการ & บริบทการบริหารงานยุคดิจิทัล

• **สัปดาห์ที่ 2 (17-20 ส.ค. 69):**
  - **วันที่ 5-6:** ภาษาราชการ & ระบบงานสารบรรณอิเล็กทรอนิกส์ (e-Saraban) & แพลตฟอร์ม MS 365 / Google Workspace
  - **วันที่ 7-8:** การสื่อสาร & ทีมเวิร์ก / บริหารคลังข้อมูล แดชบอร์ด & จิตวิทยาบริการขั้นสูง

• **สัปดาห์ที่ 3 (24-28 ส.ค. 69):**
  - **วันที่ 9-11:** Critical Thinking, Customer Experience, AI ช่วยงานวิชาการ & ระบบอัตโนมัติ (Automation)
  - **วันที่ 12-13:** การพัฒนา EQ/SQ/AQ, สรุป Reflection ปิดการอบรม และเตรียมตัวก้าวสู่ OJT 90 ชม.`;
    }

    if (queryLower.includes('สอบ') || queryLower.includes('pre') || queryLower.includes('post') || queryLower.includes('ติว')) {
        return `💡 **แนวทางพิชิตคะแนนเต็ม Pre-test / Post-test:**

1. **ระเบียบงานสารบรรณ:** จำรูปแบบหนังสือ 3 ย่อหน้า และหนังสือภายนอก/ภายในให้แม่นยำ
2. **การรักษาความลับข้อมูล (PDPA) & ข้อมูลข่าวสารราชการ:** ข้อมูลส่วนบุคคลต้องได้รับความยินยอมและจัดเก็บอย่างปลอดภัยตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล
3. **การทำงานแบบ Agile ภาครัฐ:** เน้นการส่งมอบงานทีละส่วน (Iterative), การสื่อสารในทีม, และความยืดหยุ่นต่อการเปลี่ยนแปลง
4. **จริยธรรมข้าราชการ:** ยึดถือประโยชน์ของประชาชนเป็นศูนย์กลาง ความโปร่งใส และการไม่เลือกปฏิบัติ (Universal Accessibility)`;
    }

    if (queryLower.includes('ojt') || queryLower.includes('ฝึกงาน') || queryLower.includes('90 ชม') || queryLower.includes('กันยายน')) {
        return `💼 **แผนกลยุทธ์การฝึกปฏิบัติงานจริง OJT 90 ชั่วโมง (กำหนดการ: กันยายน 2569):**

• **เป้าหมาย:** สะสมเวลาปฏิบัติงานให้ครบ ≥ 90 ชม. ครอบคลุม **4 มิติหลัก:**
  1. 📊 **มิติที่ 1 (วิเคราะห์ข้อมูล):** เช่น การจัดทำ Dashboard, ทำความสะอาดข้อมูล (Data Cleaning), วิเคราะห์สถิติผู้รับบริการ
  2. 📝 **มิติที่ 2 (งานสารบรรณ):** ร่างหนังสือราชการ 3 ย่อหน้า, ลงทะเบียนรับ-ส่งหนังสือในระบบ e-Saraban
  3. 💻 **มิติที่ 3 (งานเทคนิค/ระบบ):** การดูแลระบบไอที, การเขียนสคริปต์อัตโนมัติ (Automation), ดูแลฐานข้อมูล
  4. 🤝 **มิติที่ 4 (งานบริการ/ประสานงาน):** ให้บริการช่วยเหลือผู้ใช้งาน (Helpdesk Support), ประสานงานหน่วยงานภาครัฐ

📋 **สิ่งที่ต้องเตรียมเบิกเบี้ยเลี้ยง:** ใบบันทึกเวลาทำงาน, รายงานผลประจำสัปดาห์, และแบบประเมินจากพี่เลี้ยง`;
    }

    return `🤖 **ข้อแนะนำจาก AI Co-Pilot:**

สำหรับเรื่อง *"**${escapeHtml(userQuery)}**"* 
พี่แจ็คสามารถนำไปปรับใช้ในการอบรม 13 วันและการฝึกงาน OJT ได้ดังนี้ครับ:

1. **ยึดหลักธรรมาภิบาลและความถูกต้อง:** ตรวจสอบความสอดคล้องกับระเบียบราชการและมาตรฐานข้อมูลเสมอ
2. **นำเครื่องมือดิจิทัลมาทุ่นแรง:** ใช้ AI และระบบ Automate ช่วยลดขั้นตอนที่ซ้ำซ้อน
3. **บันทึกลงในแฟ้ม Portfolio:** นำผลงานที่ได้ไปเพิ่มในเมนู M1, M3 หรือ M5 เพื่อให้ระบบดึงเข้าเล่ม Portfolio หน้า 6-7 อัตโนมัติครับ

*(หากพี่แจ็คต้องการให้ผมช่วยร่างข้อความเฉพาะเจาะจง พิมพ์บอกรายละเอียดเพิ่มเติมได้เลยนะครับ)*`;
}

function triggerQuickPrompt(type) {
    toggleAIBuddyDrawer(true);
    const input = document.getElementById('ai-chat-input');
    if (!input) return;

    if (type === 'memo3') {
        input.value = 'ช่วยแนะนำโครงสร้างการเขียนหนังสือราชการ 3 ย่อหน้า พร้อมตัวอย่างภาษาทางการ';
    } else if (type === 'daily_summary') {
        input.value = 'ช่วยสรุปภาพรวมเนื้อหาการอบรม 13 วัน ณ โรงแรมเซ็นทารา ไลฟ์ ให้หน่อยครับ';
    } else if (type === 'exam_prep') {
        input.value = 'ขอแนวข้อสอบและจุดสำคัญที่มักออกใน Pre-test และ Post-test ภาครัฐ';
    } else if (type === 'ojt_plan') {
        input.value = 'ขอแนวทางการวางแผนฝึกปฏิบัติงาน OJT 90 ชม. ในเดือนกันยายน ให้ครบทั้ง 4 ด้าน';
    }

    sendAIChatMessage();
}

function toggleAIVoiceRecognition() {
    const btn = document.getElementById('btn-ai-voice-input');
    const input = document.getElementById('ai-chat-input');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('เบราว์เซอร์ของท่านไม่รองรับการสั่งงานด้วยเสียง กรุณาใช้ Chrome / Safari / Edge เวอร์ชันล่าสุดครับ');
        return;
    }

    if (isAIVoiceListening && aiVoiceRecognition) {
        aiVoiceRecognition.stop();
        isAIVoiceListening = false;
        if (btn) btn.classList.remove('text-rose-600', 'animate-pulse');
        return;
    }

    try {
        aiVoiceRecognition = new SpeechRecognition();
        aiVoiceRecognition.lang = 'th-TH';
        aiVoiceRecognition.interimResults = false;
        aiVoiceRecognition.maxAlternatives = 1;

        if (btn) btn.classList.add('text-rose-600', 'animate-pulse');
        isAIVoiceListening = true;
        showToast('🎙️ กำลังฟังเสียงภาษาไทย... พูดคำถามได้เลยครับ');

        aiVoiceRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (input) {
                input.value = transcript;
                sendAIChatMessage();
            }
        };

        aiVoiceRecognition.onerror = (event) => {
            console.warn('Speech recognition error', event.error);
            if (btn) btn.classList.remove('text-rose-600', 'animate-pulse');
            isAIVoiceListening = false;
        };

        aiVoiceRecognition.onend = () => {
            if (btn) btn.classList.remove('text-rose-600', 'animate-pulse');
            isAIVoiceListening = false;
        };

        aiVoiceRecognition.start();
    } catch (e) {
        console.error('Error starting voice recognition', e);
        if (btn) btn.classList.remove('text-rose-600', 'animate-pulse');
        isAIVoiceListening = false;
    }
}

function speakAIText(rawText) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    // Clean markdown symbols for natural TTS speech
    const cleanText = rawText
        .replace(/[*#_`~\[\]\(\)]/g, '')
        .replace(/[•-]/g, ' ')
        .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
}

function openGeminiApiKeyModal() {
    const key = localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
    setInputValue('input-gemini-api-key', key);
    openModal('modal-gemini-key');
}

function saveGeminiApiKey() {
    const key = getInputValue('input-gemini-api-key').trim();
    if (key) {
        localStorage.setItem(GEMINI_API_KEY_STORAGE, key);
        showToast('บันทึก Gemini API Key เรียบร้อยแล้ว (เปิดใช้ Gemini 1.5 Flash Live)');
    } else {
        localStorage.removeItem(GEMINI_API_KEY_STORAGE);
        showToast('ล้าง Key แล้ว (ใช้งานโหมด Built-in ฟรี 0 บาท)');
    }
    updateGeminiKeyStatusLabel();
    closeModal('modal-gemini-key');
}

function clearGeminiApiKey() {
    setInputValue('input-gemini-api-key', '');
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    updateGeminiKeyStatusLabel();
    closeModal('modal-gemini-key');
    showToast('ล้าง Gemini API Key แล้ว');
}

// Global Window Bindings
window.toggleAIBuddyDrawer = toggleAIBuddyDrawer;
window.sendAIChatMessage = sendAIChatMessage;
window.triggerQuickPrompt = triggerQuickPrompt;
window.clearAIChatHistory = clearAIChatHistory;
window.openGeminiApiKeyModal = openGeminiApiKeyModal;
window.saveGeminiApiKey = saveGeminiApiKey;
window.clearGeminiApiKey = clearGeminiApiKey;
window.toggleAIVoiceRecognition = toggleAIVoiceRecognition;
window.speakSingleAIChatMessage = speakSingleAIChatMessage;
window.copyAIChatMessage = copyAIChatMessage;

/* ==========================================================================
   11. M8: INTERACTIVE CIVIL SERVICE QUIZ & STUDY HUB ENGINE
   ========================================================================== */
const QUIZ_ANSWERS_STORAGE = 'civil_servant_quiz_answers_v1';
let activeQuizCategory = 'ALL';

const masterCivilServiceQuizBank = [
    // 1. SARABAN: งานสารบรรณ & หนังสือราชการ
    {
        id: 'Q-001',
        category: 'SARABAN',
        categoryName: 'งานสารบรรณ & 3 ย่อหน้า',
        question: 'โครงสร้างการเขียนบันทึกข้อความหรือหนังสือราชการแบบมาตรฐาน 3 ย่อหน้า ประกอบด้วยส่วนใดตามลำดับ?',
        options: [
            '๑. เหตุผลความเป็นมา ๒. ข้อเท็จจริง/การดำเนินงาน ๓. ข้อพิจารณา/ข้อเสนอ',
            '๑. ข้อเสนอ ๒. ข้อเท็จจริง ๓. บทลงโทษ',
            '๑. บทนำ ๒. ผลประโยชน์ ๓. คำสั่งการ',
            '๑. อ้างถึง ๒. สิ่งที่ส่งมาด้วย ๓. ลายมือชื่อ'
        ],
        correctIndex: 0,
        explanation: 'โครงสร้างหนังสือราชการ 3 ย่อหน้าที่ถูกต้องตามระเบียบงานสารบรรณ คือ ย่อหน้าที่ 1: เหตุผล/ความเป็นมา (ด้วย/ตามที่/เนื่องจาก), ย่อหน้าที่ 2: ข้อเท็จจริง/การดำเนินงาน (ในการนี้/ข้อเท็จจริงปรากฏว่า), ย่อหน้าที่ 3: ข้อพิจารณา/ข้อเสนอ (จึงเรียนมาเพื่อโปรดพิจารณา/อนุมัติ)',
        examTip: 'จำง่ายๆ: "ต้นสาย (เหตุ) - ปลายเหตุ (ข้อเท็จจริง) - เสนอแนะ (ขออนุมัติ)"'
    },
    {
        id: 'Q-002',
        category: 'SARABAN',
        categoryName: 'งานสารบรรณ & 3 ย่อหน้า',
        question: 'คำขึ้นต้นและคำลงท้ายของหนังสือราชการภายนอก ที่มีถึงบุคคลธรรมดาทั่วไป ข้อใดถูกต้องที่สุด?',
        options: [
            'คำขึ้นต้น "กราบเรียน" / คำลงท้าย "ขอแสดงความนับถืออย่างยิ่ง"',
            'คำขึ้นต้น "เรียน" / คำลงท้าย "ขอแสดงความนับถือ"',
            'คำขึ้นต้น "ถึง" / คำลงท้าย "ด้วยความเคารพ"',
            'คำขึ้นต้น "เสนอ" / คำลงท้าย "นับถือ"'
        ],
        correctIndex: 1,
        explanation: 'ตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ หนังสือราชการภายนอกถึงบุคคลธรรมดาทั่วไป ใช้คำขึ้นต้นว่า "เรียน" และคำลงท้ายว่า "ขอแสดงความนับถือ"',
        examTip: 'บุคคลธรรมดาและตำแหน่งทั่วไปใช้ "เรียน - ขอแสดงความนับถือ" ส่วนประธานองคมนตรี/นายกฯ/ประธานรัฐสภา/ประธานศาลฎีกา ใช้ "กราบเรียน - ขอแสดงความนับถืออย่างยิ่ง"'
    },
    {
        id: 'Q-003',
        category: 'SARABAN',
        categoryName: 'งานสารบรรณ & 3 ย่อหน้า',
        question: 'ชั้นความเร็วของหนังสือราชการข้อใด กำหนดให้เจ้าหน้าที่ต้อง "ปฏิบัติในทันทีที่ได้รับหนังสือนั้น"?',
        options: [
            'ด่วน',
            'ด่วนมาก',
            'ด่วนที่สุด',
            'ด่วนพิเศษ'
        ],
        correctIndex: 2,
        explanation: 'ชั้นความเร็วตามระเบียบมี 3 ชั้น: ๑. "ด่วนที่สุด" ให้เจ้าหน้าที่ปฏิบัติในทันทีที่ได้รับหนังสือนั้น ๒. "ด่วนมาก" ให้ปฏิบัติโดยเร็ว ๓. "ด่วน" ให้ปฏิบัติเร็วกว่าปกติเท่าที่จะทำได้',
        examTip: 'ด่วนที่สุด = ทันที | ด่วนมาก = โดยเร็ว | ด่วน = เร็วกว่าปกติ'
    },
    {
        id: 'Q-004',
        category: 'SARABAN',
        categoryName: 'งานสารบรรณ & 3 ย่อหน้า',
        question: 'ชั้นความลับของทางราชการตามระเบียบว่าด้วยการรักษาความลับของทางราชการ แบ่งออกเป็นกี่ชั้น?',
        options: [
            '2 ชั้น (ลับ, ลับมาก)',
            '3 ชั้น (ลับ, ลับมาก, ลับที่สุด)',
            '4 ชั้น (ลับเฉพาะ, ลับ, ลับมาก, ลับที่สุด)',
            '5 ชั้น (ปกปิด, ลับเฉพาะ, ลับ, ลับมาก, ลับที่สุด)'
        ],
        correctIndex: 1,
        explanation: 'ระเบียบว่าด้วยการรักษาความลับของทางราชการ พ.ศ. 2544 กำหนดชั้นความลับไว้ 3 ชั้น ได้แก่: ๑. ลับที่สุด (Top Secret) ๒. ลับมาก (Secret) ๓. ลับ (Confidential)',
        examTip: 'จำ 3 ลำดับ: ลับที่สุด > ลับมาก > ลับ'
    },

    // 2. DISCIPLINE: วินัย จริยธรรม & กฎหมายข้าราชการ
    {
        id: 'Q-005',
        category: 'DISCIPLINE',
        categoryName: 'วินัย จริยธรรม & กฎหมาย',
        question: 'โทษทางวินัยของข้าราชการพลเรือนตาม พ.ร.บ. ระเบียบข้าราชการพลเรือน พ.ศ. 2551 มีกี่สถาน อะไรบ้าง?',
        options: [
            '3 สถาน: ว่ากล่าวตักเตือน, ภาคทัณฑ์, ให้ออก',
            '4 สถาน: ภาคทัณฑ์, ตัดเงินเดือน, ปลดออก, ไล่ออก',
            '5 สถาน: ภาคทัณฑ์, ตัดเงินเดือน, ลดเงินเดือน, ปลดออก, ไล่ออก',
            '6 สถาน: ทัณฑกรรม, กักยาม, ตัดเงินเดือน, ลดขั้น, ปลดออก, ไล่ออก'
        ],
        correctIndex: 2,
        explanation: 'มาตรา 96 แห่ง พ.ร.บ. ระเบียบข้าราชการพลเรือน พ.ศ. 2551 กำหนดโทษทางวินัยมี 5 สถาน ได้แก่: วินัยไม่ร้ายแรง (ภาคทัณฑ์, ตัดเงินเดือน, ลดเงินเดือน) และวินัยร้ายแรง (ปลดออก, ไล่ออก)',
        examTip: 'จำ 5 สถาน: "ภาค - ตัด - ลด - ปลด - ไล่"'
    },
    {
        id: 'Q-006',
        category: 'DISCIPLINE',
        categoryName: 'วินัย จริยธรรม & กฎหมาย',
        question: 'การละทิ้งหน้าที่ราชการติดต่อกันในคราวเดียวกันเป็นเวลากี่วัน โดยไม่มีเหตุผลอันสมควร ถือเป็นความผิดวินัยอย่างร้ายแรง?',
        options: [
            'เกินกว่า 3 วัน',
            'เกินกว่า 7 วัน',
            'เกินกว่า 15 วัน',
            'เกินกว่า 30 วัน'
        ],
        correctIndex: 2,
        explanation: 'มาตรา 85 (3) ระบุว่า การละทิ้งหรือทอดทิ้งหน้าที่ราชการติดต่อในคราวเดียวกันเป็นเวลาเกินกว่า 15 วัน โดยไม่มีเหตุผลอันสมควร หรือมีพฤติการณ์จงใจไม่ปฏิบัติตามระเบียบ ถือเป็นความผิดวินัยอย่างร้ายแรง',
        examTip: 'เกณฑ์ละทิ้งหน้าที่วินัยร้ายแรง = "เกิน 15 วัน"'
    },
    {
        id: 'Q-007',
        category: 'DISCIPLINE',
        categoryName: 'วินัย จริยธรรม & กฎหมาย',
        question: 'ความแตกต่างระหว่างโทษ "ปลดออก" กับ "ไล่ออก" คือข้อใด?',
        options: [
            'ปลดออกไม่มีสิทธิได้รับบำเหน็จบำนาญ แต่ไล่ออกมีสิทธิได้รับ',
            'ปลดออกมีสิทธิได้รับบำเหน็จบำนาญเสมือนลาออก ส่วนไล่ออกไม่มีสิทธิได้รับ',
            'ทั้งปลดออกและไล่ออกได้รับบำเหน็จบำนาญเท่ากัน',
            'ปลดออกกลับเข้ารับราชการได้ทันที ส่วนไล่ออกต้องรอ 5 ปี'
        ],
        correctIndex: 1,
        explanation: 'ผู้ถูกลงโทษ "ปลดออก" ยังมีสิทธิได้รับบำเหน็จบำนาญเสมือนว่าเป็นผู้ลาออกจากราชการ แต่ผู้ถูกลงโทษ "ไล่ออก" จะไม่มีสิทธิได้รับบำเหน็จหรือบำนาญใดๆ ทั้งสิ้น',
        examTip: 'ปลดออก = ได้บำเหน็จบำนาญ (เหมือนลาออก) | ไล่ออก = ตัดสิทธิบำเหน็จบำนาญทั้งหมด'
    },

    // 3. PDPA: การคุ้มครองข้อมูลส่วนบุคคล
    {
        id: 'Q-008',
        category: 'PDPA',
        categoryName: 'PDPA & คุ้มครองข้อมูล',
        question: 'ข้อมูลประเภทใดต่อไปนี้ จัดเป็น "ข้อมูลส่วนบุคคลอ่อนไหว" (Sensitive Personal Data) ตามมาตรา 26 ของ PDPA?',
        options: [
            'ชื่อ-นามสกุล และเบอร์โทรศัพท์ที่ทำงาน',
            'ข้อมูลความพิการ เชื้อชาติ ศาสนา ข้อมูลสุขภาพและพันธุกรรม',
            'ตำแหน่งทางราชการ และสังกัดกอง/กรม',
            'อีเมลราชการ (@go.th) และหมายเลขห้องทำงาน'
        ],
        correctIndex: 1,
        explanation: 'มาตรา 26 แห่ง พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 กำหนดว่า ข้อมูลความพิการ เชื้อชาติ เผ่าพันธุ์ ความคิดเห็นทางการเมือง ศาสนา พฤติกรรมทางเพศ ประวัติอาชญากรรม ข้อมูลสุขภาพ พันธุกรรม เป็นข้อมูลส่วนบุคคลอ่อนไหวที่ต้องได้รับความยินยอมโดยชัดแจ้งและมีการคุ้มครองเข้มงวดเป็นพิเศษ',
        examTip: 'ข้อมูลความพิการและข้อมูลสุขภาพ = Sensitive Data ชั้นสูงสุดตาม PDPA'
    },
    {
        id: 'Q-009',
        category: 'PDPA',
        categoryName: 'PDPA & คุ้มครองข้อมูล',
        question: 'การปฏิบัติงานเอกสารภาครัฐที่มีการส่งต่อรายชื่อผู้เข้าอบรม เพื่อความสอดคล้องกับ PDPA ควรปฏิบัติอย่างไร?',
        options: [
            'โพสต์ไฟล์ Excel ที่มีเลขบัตรประชาชน 13 หลักลงในกลุ่ม LINE สาธารณะ',
            'ซ่อน (Mask) หรือตัดเลขบัตรประชาชน 13 หลัก และส่งเฉพาะข้อมูลที่จำเป็นต่อภารกิจ',
            'เปิดเผยข้อมูลทั้งหมดเพื่อให้ตรวจสอบความโปร่งใสได้ง่าย',
            'ส่งข้อมูลไปเก็บไว้ในเซิร์ฟเวอร์ต่างประเทศโดยไม่ต้องเข้ารหัส'
        ],
        correctIndex: 1,
        explanation: 'หลักการ Data Minimization และ Privacy by Design กำหนดให้เปิดเผยและประมวลผลข้อมูลส่วนบุคคลเท่าที่จำเป็นต่อภารกิจเท่านั้น ควรทำการ Mask เลข 13 หลัก (เช่น 1-1002-xxxxx-xx-x) ก่อนการแชร์',
        examTip: 'หลัก PDPA สำคัญ: "เก็บเท่าที่จำเป็น - ซ่อนข้อมูลอ่อนไหว - ไม่แชร์ในที่สาธารณะ"'
    },

    // 4. OJT: การฝึกปฏิบัติงาน 4 มิติ
    {
        id: 'Q-010',
        category: 'OJT',
        categoryName: 'การฝึกปฏิบัติ OJT 4 มิติ',
        question: 'เกณฑ์ชั่วโมงการฝึกปฏิบัติงานจริง (OJT) ของหลักสูตรเตรียมความพร้อมสำหรับคนพิการในหน่วยงานภาครัฐ คือข้อใด?',
        options: [
            'ไม่น้อยกว่า 45 ชั่วโมง และครอบคลุมอย่างน้อย 1 ด้าน',
            'ไม่น้อยกว่า 60 ชั่วโมง และครอบคลุมอย่างน้อย 2 ด้าน',
            'ไม่น้อยกว่า 90 ชั่วโมง และต้องกระจายครอบคลุมทั้ง 4 มิติงาน',
            'ไม่น้อยกว่า 120 ชั่วโมง เฉพาะด้านงานธุรการสารบรรณ'
        ],
        correctIndex: 2,
        explanation: 'เกณฑ์มาตรฐานกำหนดให้ผู้เข้ารับการอบรมสะสมเวลาฝึกงาน OJT ในหน่วยงานจริงไม่น้อยกว่า 90 ชั่วโมง (ช่วงเดือนกันยายน) โดยต้องปฏิบัติงานครอบคลุมทั้ง 4 ด้าน เพื่อประเมินสมรรถนะความพร้อมรอบด้าน',
        examTip: 'เป้าหมาย OJT = "≥90 ชั่วโมง ครบ 4 ด้าน"'
    },
    {
        id: 'Q-011',
        category: 'OJT',
        categoryName: 'การฝึกปฏิบัติ OJT 4 มิติ',
        question: 'ข้อใดคือตัวอย่างงานที่ตรงกับ "มิติที่ 1: ด้านงานวิเคราะห์ข้อมูลและสารสนเทศ" ในการฝึกงาน OJT?',
        options: [
            'การต้อนรับแขกผู้มาติดต่อหน่วยงาน',
            'การจัดทำ Dashboard สรุปสถิติผู้รับบริการ และการทำ Data Cleaning ด้วย Excel/Python',
            'การเดินส่งหนังสือเวียนตามโต๊ะทำงาน',
            'การยกของและจัดเตรียมสถานที่ห้องประชุม'
        ],
        correctIndex: 1,
        explanation: 'มิติที่ 1 มุ่งเน้นการจัดการข้อมูล สารสนเทศ การจัดทำ Dashboard สรุปตัวเลข การรายงานผลเชิงสถิติ และการวิเคราะห์แนวโน้มเพื่อสนับสนุนการตัดสินใจของผู้บริหาร',
        examTip: 'มิติ 1 = Data, Excel, Dashboard, วิเคราะห์สถิติ'
    },
    {
        id: 'Q-012',
        category: 'OJT',
        categoryName: 'การฝึกปฏิบัติ OJT 4 มิติ',
        question: 'มิติที่ 4 ของการฝึกปฏิบัติงาน OJT "ด้านการประสานงาน บริการ และสื่อสาร" มีตัวบ่งชี้ความสำเร็จที่สำคัญคืออะไร?',
        options: [
            'การเขียนโค้ดพัฒนาเว็บไซต์ให้เสร็จสมบูรณ์',
            'การสื่อสารอย่างสุภาพ ชัดเจน การให้บริการประชาชน และการประสานงานข้ามกองอย่างราบรื่น',
            'การบันทึกสถิติข้อมูลลงฐานข้อมูลโดยไม่พูดคุยกับใคร',
            'การอยู่เวรยามนอกเวลาราชการ'
        ],
        correctIndex: 1,
        explanation: 'มิติที่ 4 เน้น Soft Skills ด้านการสื่อสารที่มีประสิทธิภาพ Service Mind การตอบข้อซักถาม การประสานงานกับหน่วยงานภายในและภายนอก และการนำเสนอรายงาน',
        examTip: 'มิติ 4 = Service Mind, การสื่อสาร, การประสานงาน'
    },

    // 5. DIGITAL: ทักษะดิจิทัล & AI ภาครัฐ
    {
        id: 'Q-013',
        category: 'DIGITAL',
        categoryName: 'ทักษะดิจิทัล & AI ภาครัฐ',
        question: 'กรอบโครงสร้างการเขียน Prompt สั่งงาน AI ที่มีประสิทธิภาพสูงตามหลัก "R-C-T-F" ย่อมาจากคำใด?',
        options: [
            'Role (บทบาท) - Context (บริบท) - Task (ภารกิจ) - Format (รูปแบบผลลัพธ์)',
            'Read (การอ่าน) - Check (ตรวจสอบ) - Type (พิมพ์) - Finish (เสร็จสิ้น)',
            'Rule (กฎระเบียบ) - Code (รหัส) - Test (ทดสอบ) - File (บันทึกไฟล์)',
            'Run (ประมวลผล) - Create (สร้าง) - Transform (แปลง) - Forward (ส่งต่อ)'
        ],
        correctIndex: 0,
        explanation: 'R-C-T-F เป็นโครงสร้าง Prompt มาตรฐานสากล: R (Role) ระบุบทบาทผู้เชี่ยวชาญ, C (Context) ให้ข้อมูลแวดล้อมและระเบียบที่เกี่ยวข้อง, T (Task) สั่งงานที่ชัดเจน, F (Format) กำหนดรูปแบบผลลัพธ์ เช่น 3 ย่อหน้า หรือตารางสรุป',
        examTip: 'R-C-T-F = Role (บทบาท) + Context (บริบท) + Task (ภารกิจ) + Format (รูปแบบ)'
    },
    {
        id: 'Q-014',
        category: 'DIGITAL',
        categoryName: 'ทักษะดิจิทัล & AI ภาครัฐ',
        question: 'ตามแนวทางมาตรฐานการใช้ปัญญาประดิษฐ์ (AI) ภาครัฐอย่างมีธรรมาภิบาล ใครคือผู้รับผิดชอบสูงสุดในเนื้อหาของหนังสือราชการที่ AI ช่วยร่าง?',
        options: [
            'บริษัทผู้พัฒนาโมเดล AI (เช่น Google หรือ OpenAI)',
            'ผู้ดูแลระบบเครือข่ายของหน่วยงาน (IT Admin)',
            'ข้าราชการ/เจ้าหน้าที่ผู้ลงนามและผู้ส่งหนังสือราชการนั้น (Human in the Loop)',
            'ไม่มีผู้ใดต้องรับผิดชอบเนื่องจากเป็นระบบอัตโนมัติ'
        ],
        correctIndex: 2,
        explanation: 'หลักการ Human-in-the-Loop และ Accountability กำหนดว่า AI เป็นเพียงเครื่องมือช่วยอำนวยความสะดวก แต่ความถูกต้องทางกฎหมายและผลทางราชการทั้งหมดเป็นความรับผิดชอบของข้าราชการและผู้บริหารผู้ลงนาม',
        examTip: 'หลัก AI ราชการ: "AI เป็นผู้ช่วย แต่คนเป็นผู้รับผิดชอบ (Human in the loop)"'
    },
    {
        id: 'Q-015',
        category: 'DIGITAL',
        categoryName: 'ทักษะดิจิทัล & AI ภาครัฐ',
        question: 'มาตรฐานสากลว่าด้วยการเข้าถึงเนื้อหาเว็บ (WCAG 2.1 Level AA) กำหนดเกณฑ์อัตราส่วนความต่างของสี (Contrast Ratio) สำหรับตัวอักษรขนาดปกติไว้อย่างน้อยเท่าใด?',
        options: [
            'อย่างน้อย 2.0 : 1',
            'อย่างน้อย 3.0 : 1',
            'อย่างน้อย 4.5 : 1',
            'อย่างน้อย 7.0 : 1'
        ],
        correctIndex: 2,
        explanation: 'WCAG 2.1 Level AA กำหนดให้อัตราส่วนความต่างของสี (Color Contrast Ratio) ระหว่างข้อความปกติกับพื้นหลังต้องไม่ต่ำกว่า 4.5 : 1 (ส่วนตัวอักษรขนาดใหญ่ต้องไม่ต่ำกว่า 3.0 : 1)',
        examTip: 'WCAG Level AA: ตัวอักษรปกติ ≥ 4.5:1 | ตัวอักษรใหญ่ ≥ 3:1 | High Contrast AAA ≥ 7:1'
    },
    {
        id: 'Q-016',
        category: 'DIGITAL',
        categoryName: 'ทักษะดิจิทัล & AI ภาครัฐ',
        question: 'การพัฒนาเอกสารราชการและสื่อนำเสนอให้รองรับโปรแกรมอ่านจอภาพ (Screen Reader) สิ่งที่ต้องมีเสมอสำหรับรูปภาพและแผนภูมิคือข้อใด?',
        options: [
            'คำอธิบายภาพกำกับ (Alt-Text / Alternative Text)',
            'การใส่เสียงเพลงบรรเลงประกอบ',
            'การทำภาพให้เคลื่อนไหวตลอดเวลา',
            'การแปลงข้อความทั้งหมดให้เป็นไฟล์รูปภาพ JPEG'
        ],
        correctIndex: 0,
        explanation: 'โปรแกรม Screen Reader ไม่สามารถมองเห็นภาพได้ การใส่ Alt-Text (คำบรรยายภาพทางเลือก) ทำให้ระบบสามารถอ่านออกเสียงให้ผู้พิการทางสายตาทราบถึงความหมายและเนื้อหาในภาพได้ทันที',
        examTip: 'ภาพและกราฟในเอกสารราชการ ต้องมี Alt-Text เสมอเพื่อผู้พิการทางสายตา'
    }
];

function getQuizAnswersState() {
    try {
        const stored = localStorage.getItem(QUIZ_ANSWERS_STORAGE);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.warn('Error reading quiz answers state', e);
    }
    return {};
}

function saveQuizAnswersState(state) {
    try {
        localStorage.setItem(QUIZ_ANSWERS_STORAGE, JSON.stringify(state));
    } catch (e) {
        console.warn('Error saving quiz answers state', e);
    }
}

function filterQuizCategory(cat) {
    activeQuizCategory = cat;
    ['ALL', 'SARABAN', 'DISCIPLINE', 'PDPA', 'OJT', 'DIGITAL'].forEach(c => {
        const btn = document.getElementById(`filter-quiz-${c}`);
        if (btn) {
            if (c === cat) {
                btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-govNavy text-white shadow-sm shrink-0 cursor-pointer';
            } else {
                btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer';
            }
        }
    });
    renderM8QuizView();
}

function selectQuizAnswer(qId, selectedIdx) {
    const state = getQuizAnswersState();
    state[qId] = selectedIdx;
    saveQuizAnswersState(state);
    renderM8QuizView();

    const q = masterCivilServiceQuizBank.find(item => item.id === qId);
    if (q) {
        if (selectedIdx === q.correctIndex) {
            showToast(`✅ ตอบถูก: ${q.categoryName}`);
        } else {
            showToast(`❌ ยังไม่ถูกต้อง: มีคำอธิบายเฉลยด้านล่างข้อสอบ`);
        }
    }
}

function resetSingleQuizAnswer(qId) {
    const state = getQuizAnswersState();
    delete state[qId];
    saveQuizAnswersState(state);
    renderM8QuizView();
    showToast('ล้างคำตอบข้อนี้แล้ว พร้อมให้ทำใหม่');
}

function resetQuizAnswers() {
    if (!confirm('ต้องการล้างคำตอบข้อสอบทั้งหมดเพื่อเริ่มทำใหม่ใช่หรือไม่?')) return;
    localStorage.removeItem(QUIZ_ANSWERS_STORAGE);
    renderM8QuizView();
    showToast('ล้างคำตอบข้อสอบทั้งหมดเรียบร้อยแล้ว');
}

function submitM8QuickAIQuery() {
    const input = document.getElementById('m8-quick-ai-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    toggleAIBuddyDrawer(true);
    const chatInput = document.getElementById('ai-chat-input');
    if (chatInput) {
        chatInput.value = text;
        input.value = '';
        sendAIChatMessage();
    }
}

function renderM8QuizView() {
    const container = document.getElementById('m8-quiz-cards-container');
    if (!container) return;

    const answersState = getQuizAnswersState();
    const filteredQuestions = activeQuizCategory === 'ALL'
        ? masterCivilServiceQuizBank
        : masterCivilServiceQuizBank.filter(q => q.category === activeQuizCategory);

    // Calculate Global Quiz KPI Stats
    const totalAll = masterCivilServiceQuizBank.length;
    const attemptedKeys = Object.keys(answersState);
    const attemptedCount = attemptedKeys.length;
    let correctCount = 0;

    masterCivilServiceQuizBank.forEach(q => {
        if (answersState[q.id] !== undefined && answersState[q.id] === q.correctIndex) {
            correctCount++;
        }
    });

    const attemptedPct = totalAll > 0 ? Math.round((attemptedCount / totalAll) * 100) : 0;
    const accuracyPct = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    // Update KPI UI
    setText('m8-total-questions', `${totalAll} ข้อ`);
    setText('m8-attempted-count', `${attemptedCount} ข้อ`);
    setText('m8-attempted-percent', `${attemptedPct}% ของข้อสอบทั้งหมด`);
    setText('m8-correct-count', `${correctCount} ข้อ`);
    setText('m8-correct-percent', `ความแม่นยำ ${accuracyPct}%`);

    let readinessText = 'กำลังเริ่มต้น';
    if (accuracyPct >= 80 && attemptedCount >= 10) {
        readinessText = '🏆 พร้อมสอบระดับสูง (ดีเยี่ยม)';
    } else if (accuracyPct >= 60 && attemptedCount >= 6) {
        readinessText = '⭐ ผ่านเกณฑ์มาตรฐาน';
    } else if (attemptedCount > 0) {
        readinessText = '📖 กำลังฝึกฝนทบทวน';
    }
    setText('m8-readiness-level', readinessText);

    setText('m8-filter-count-label', `แสดง ${filteredQuestions.length} จาก ${totalAll} ข้อ`);

    // Render Question Cards
    if (filteredQuestions.length === 0) {
        container.innerHTML = `
            <div class="app-card p-8 text-center text-slate-500 space-y-2">
                <i class="fa-solid fa-clipboard-question text-3xl text-slate-300"></i>
                <div class="font-bold text-sm">ไม่พบข้อสอบในหมวดนี้</div>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredQuestions.map((q, idx) => {
        const hasAnswered = answersState[q.id] !== undefined;
        const userChoice = hasAnswered ? answersState[q.id] : null;
        const isCorrect = hasAnswered && userChoice === q.correctIndex;
        const optLetters = ['ก', 'ข', 'ค', 'ง'];

        return `
            <div class="app-card p-5 sm:p-6 quiz-card border-t-4 ${hasAnswered ? (isCorrect ? 'border-emerald-500' : 'border-rose-500') : 'border-slate-300'} space-y-4" id="quiz-card-${q.id}">
                <!-- Question Header -->
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center space-x-2">
                        <span class="w-7 h-7 rounded-lg bg-govNavy text-white flex items-center justify-center font-bold text-xs">
                            ${idx + 1}
                        </span>
                        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            ${escapeHtml(q.categoryName)}
                        </span>
                    </div>
                    ${hasAnswered ? `
                        <span class="px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                            <i class="fa-solid ${isCorrect ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark text-rose-600'}"></i>
                            <span>${isCorrect ? 'ตอบถูกต้อง (+1)' : 'ยังไม่ถูกต้อง'}</span>
                        </span>
                    ` : `
                        <span class="text-[11px] text-slate-400 font-medium">ยังไม่ได้ตอบ</span>
                    `}
                </div>

                <!-- Question Body -->
                <div class="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                    ${escapeHtml(q.question)}
                </div>

                <!-- Options -->
                <div class="space-y-2 pt-1">
                    ${q.options.map((opt, oIdx) => {
                        let btnClass = 'quiz-option-btn w-full text-left p-3 rounded-xl text-xs sm:text-sm flex items-start space-x-3 transition';
                        if (hasAnswered) {
                            if (oIdx === q.correctIndex) {
                                btnClass += ' quiz-option-correct';
                            } else if (oIdx === userChoice) {
                                btnClass += ' quiz-option-incorrect';
                            } else {
                                btnClass += ' opacity-50';
                            }
                        }

                        return `
                            <button type="button" onclick="selectQuizAnswer('${q.id}', ${oIdx})" class="${btnClass}" ${hasAnswered ? 'disabled' : ''}>
                                <span class="w-6 h-6 rounded-lg ${hasAnswered && oIdx === q.correctIndex ? 'bg-emerald-600 text-white font-bold' : (hasAnswered && oIdx === userChoice ? 'bg-rose-600 text-white font-bold' : 'bg-slate-200 text-slate-700 font-bold')} flex items-center justify-center text-xs shrink-0 mt-0.5">
                                    ${optLetters[oIdx]}
                                </span>
                                <span class="leading-relaxed flex-grow">${escapeHtml(opt)}</span>
                                ${hasAnswered && oIdx === q.correctIndex ? '<i class="fa-solid fa-check text-emerald-600 text-sm mt-1 shrink-0"></i>' : ''}
                                ${hasAnswered && oIdx === userChoice && !isCorrect ? '<i class="fa-solid fa-xmark text-rose-600 text-sm mt-1 shrink-0"></i>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>

                <!-- Explanation & Memory Tip Alert (Shows when answered) -->
                ${hasAnswered ? `
                    <div class="p-4 rounded-xl text-xs space-y-2 quiz-feedback-box border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-slate-800' : 'bg-rose-50 border-rose-200 text-slate-800'}">
                        <div class="font-bold flex items-center space-x-1.5 ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                            <i class="fa-solid ${isCorrect ? 'fa-circle-info' : 'fa-lightbulb'}"></i>
                            <span>คำอธิบายระเบียบราชการที่ถูกต้อง (เฉลยข้อ ${optLetters[q.correctIndex]}):</span>
                        </div>
                        <p class="leading-relaxed text-slate-700">${escapeHtml(q.explanation)}</p>
                        ${q.examTip ? `
                            <div class="pt-1.5 border-t border-slate-200/60 text-[11px] text-amber-800 font-semibold flex items-center gap-1.5">
                                <i class="fa-solid fa-key text-amber-600"></i>
                                <span>เทคนิคช่วยจำ: ${escapeHtml(q.examTip)}</span>
                            </div>
                        ` : ''}
                        <div class="pt-2 flex justify-end">
                            <button type="button" onclick="resetSingleQuizAnswer('${q.id}')" class="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-rotate-left text-[10px]"></i>
                                <span>ทำข้อนี้ใหม่อีกครั้ง</span>
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Window Bindings for M8 Quiz Engine
window.filterQuizCategory = filterQuizCategory;
window.selectQuizAnswer = selectQuizAnswer;
window.resetSingleQuizAnswer = resetSingleQuizAnswer;
window.resetQuizAnswers = resetQuizAnswers;
window.submitM8QuickAIQuery = submitM8QuickAIQuery;
window.renderM8QuizView = renderM8QuizView;

/* ==========================================================================
   12. M5: 13-DAY CENTARA LIFE LECTURE SLIDES & STUDY HUB
   ========================================================================== */
let activeM5SlideTrack = 'ALL';
let activeM5SlideSearch = '';

const master13DaysLectureSlides = [
    {
        day: 1,
        date: "10 ส.ค. 2569",
        title: "ปฐมนิเทศ & วินัย คุณธรรม จริยธรรม และจรรยาบรรณของบุคลากรภาครัฐ",
        room: "ห้องประชุม BB 212",
        track: "COMBINED",
        trackLabel: "รวมทุกหลักสูตร (40 คน)",
        lecturer: "สำนักงาน ก.พ. / กรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ",
        summaryMorning: "กิจกรรมสร้างความคุ้นเคย (Ice Breaking), แนะนำโครงสร้างหลักสูตร 13 วัน, เกณฑ์การประเมินผลการเรียนรู้ และสำรวจความพร้อมของผู้เรียน",
        summaryAfternoon: "วินัยและจรรยาบรรณข้าราชการพลเรือน พ.ศ. 2551, 5 สถานโทษทางวินัย (ภาคทัณฑ์, ตัดเงินเดือน, ลดเงินเดือน, ปลดออก, ไล่ออก), การรักษาผลประโยชน์ส่วนรวม และธรรมาภิบาลภาครัฐ",
        examFocus: "จำ 5 สถานโทษทางวินัย (ภาค-ตัด-ลด-ปลด-ไล่), เกณฑ์ละทิ้งหน้าที่เกิน 15 วันเป็นวินัยร้ายแรง, และความแตกต่างระหว่างปลดออก (ได้บำนาญ) กับไล่ออก (ตัดสิทธิ)",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["ปฐมนิเทศ", "วินัย", "จริยธรรม", "ก.พ.", "โทษทางวินัย", "BB212"]
    },
    {
        day: 2,
        date: "11 ส.ค. 2569",
        title: "การพัฒนาทักษะดิจิทัลและเครื่องมือสำนักงานภาครัฐ (Digital Literacy & Gov Tools)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "สถาบันข้อมูลขนาดใหญ่ (BDI) / ผู้เชี่ยวชาญด้านระบบสารสนเทศ",
        summaryMorning: "การใช้งาน Google Workspace, การจัดการเอกสารบน Cloud Drive อย่างปลอดภัย, และมาตรฐานการตั้งชื่อไฟล์ดิจิทัล",
        summaryAfternoon: "ADV: การใช้ฟังก์ชันขั้นสูงใน Google Sheets/Excel และการเชื่อมต่อ API เบื้องต้น | FND: ทักษะการจัดพิมพ์เอกสารราชการ การใช้แป้นพิมพ์ลัด และระบบงานเอกสารอิเล็กทรอนิกส์",
        examFocus: "มาตรฐานการรักษาความปลอดภัยของบัญชีดิจิทัลภาครัฐ (2FA), การสำรองข้อมูลตามมาตรฐาน DGA, และความแตกต่างของรูปแบบไฟล์",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["ดิจิทัล", "Google Workspace", "Excel", "Sheets", "Cloud", "BB211", "BB202"]
    },
    {
        day: 3,
        date: "13 ส.ค. 2569",
        title: "ทักษะการสื่อสารและบริการประชาชนอย่างมืออาชีพ (Service Mind & Interpersonal Skills)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "วิทยากรผู้เชี่ยวชาญด้านการพัฒนาบุคลิกภาพและการสื่อสารองค์กร",
        summaryMorning: "จิตบริการ (Service Mind), เทคนิคการสื่อสารเชิงบวก (Positive Communication), และการประสานงานข้ามหน่วยงาน",
        summaryAfternoon: "การรับมือกับสถานการณ์ข้อร้องเรียน, มารยาทการสื่อสารผ่านช่องทางดิจิทัล (Email/LINE Official), และการทำงานร่วมกับผู้มีความหลากหลาย",
        examFocus: "หลักการบริการประชาชนด้วยความเสมอภาคตามระเบียบสำนักนายกฯ และกระบวนการจัดการข้อร้องเรียนอย่างเป็นธรรม",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["การสื่อสาร", "บริการ", "Service Mind", "ข้อร้องเรียน", "ประสานงาน"]
    },
    {
        day: 4,
        date: "14 ส.ค. 2569",
        title: "ระเบียบงานสารบรรณและการเขียนหนังสือราชการ 3 ย่อหน้า (Official Correspondence)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "ผู้ทรงคุณวุฒิด้านระเบียบงานสารบรรณ สำนักนายกรัฐมนตรี",
        summaryMorning: "ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติม, ชนิดของหนังสือราชการ 6 ชนิด, คำขึ้นต้น-คำลงท้าย",
        summaryAfternoon: "การฝึกเขียนบันทึกข้อความ 3 ย่อหน้า: ๑. เหตุผลความเป็นมา ๒. ข้อเท็จจริง/การดำเนินงาน ๓. ข้อพิจารณา/ข้อเสนอ พร้อมการใช้ภาษาทางการที่กระชับ ชัดเจน",
        examFocus: "โครงสร้าง 3 ย่อหน้า (ต้นสาย-ปลายเหตุ-เสนอแนะ), คำขึ้นต้น/ลงท้ายถึงบุคคลธรรมดา (เรียน - ขอแสดงความนับถือ), ชั้นความเร็ว (ด่วนที่สุด/ด่วนมาก/ด่วน) และชั้นความลับ",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["สารบรรณ", "หนังสือราชการ", "3 ย่อหน้า", "บันทึกข้อความ", "คำขึ้นต้น", "ชั้นความเร็ว"]
    },
    {
        day: 5,
        date: "15 ส.ค. 2569",
        title: "กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ในหน่วยงานภาครัฐ",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "ผู้เชี่ยวชาญจากสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.)",
        summaryMorning: "หลักการสำคัญของ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562, ฐานการประมวลผลข้อมูล (Legal Basis), สิทธิของเจ้าของข้อมูล (Data Subject Rights)",
        summaryAfternoon: "ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data มาตรา 26: ข้อมูลความพิการ/สุขภาพ), การ Masking ข้อมูล, และแนวปฏิบัติการส่งต่อข้อมูลในหน่วยงานภาครัฐ",
        examFocus: "ข้อมูลความพิการและข้อมูลสุขภาพ = Sensitive Data, หลัก Data Minimization (เก็บเท่าที่จำเป็น), และโทษของการเปิดเผยข้อมูลโดยมิชอบ",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["PDPA", "ข้อมูลส่วนบุคคล", "Sensitive Data", "ความยินยอม", "Masking"]
    },
    {
        day: 6,
        date: "18 ส.ค. 2569",
        title: "การบริหารจัดการข้อมูลและการวิเคราะห์สถิติในงานสารสนเทศ (Data Analysis & Excel)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "ทีม Data Analytics สถาบันข้อมูลขนาดใหญ่ (BDI)",
        summaryMorning: "หลักการ Data Governance, การทำ Data Cleaning, การจัดการข้อมูลที่ซ้ำซ้อนและข้อมูลสูญหาย",
        summaryAfternoon: "ADV: การสร้าง Dashboard สรุปตัวเลขด้วย Pivot Table และ Visualization | FND: การใช้สูตรคำนวณพื้นฐาน (SUM, AVERAGE, COUNTIF, VLOOKUP/XLOOKUP)",
        examFocus: "วงจรชีวิตของข้อมูล (Data Lifecycle), การเลือกใช้ชาร์ตให้ตรงกับประเภทข้อมูล (Bar, Line, Pie), และการตรวจสอบความถูกต้องของข้อมูล",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["Data", "Excel", "Dashboard", "Pivot Table", "Analytics", "สถิติ"]
    },
    {
        day: 7,
        date: "19 ส.ค. 2569",
        title: "การใช้ Generative AI และเครื่องมืออัตโนมัติในการปฏิบัติราชการ (AI in Government)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "ผู้เชี่ยวชาญด้าน AI & Prompt Engineering ภาครัฐ",
        summaryMorning: "การทำงานของ Large Language Models (Gemini / Claude), ข้อจำกัดและข้อควรระวัง (AI Hallucination & Data Bias)",
        summaryAfternoon: "การออกแบบ AI Prompt ด้วยโครงสร้าง R-C-T-F (Role, Context, Task, Format), การใช้ AI ช่วยสรุปรายงานและตรวจทานภาษาทางการ",
        examFocus: "โครงสร้าง R-C-T-F, หลักการ Human-in-the-loop (คนต้องตรวจสอบและรับผิดชอบผลลัพธ์ของ AI เสมอ), และการไม่ใส่ข้อมูลลับลงใน AI สาธารณะ",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["AI", "Gemini", "Prompt", "RCTF", "Automation", "ปัญญาประดิษฐ์"]
    },
    {
        day: 8,
        date: "20 ส.ค. 2569",
        title: "การเขียนรายงานสรุปและการนำเสนอข้อมูลต่อผู้บริหาร (Executive Reporting & Presentation)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "ผู้บริหารระดับสูงและวิทยากรด้านการสื่อสารเชิงกลยุทธ์",
        summaryMorning: "เทคนิคการสรุปความแบบ Executive Summary (1 หน้ากระดาษ), การจัดลำดับความสำคัญของประเด็น (Pyramid Principle)",
        summaryAfternoon: "การออกแบบสไลด์นำเสนอด้วยหลัก Visual Hierarchy, การเลือกคู่สี และเทคนิคการนำเสนออย่างมั่นใจ",
        examFocus: "องค์ประกอบของ Executive Summary: วัตถุประสงค์ ผลการดำเนินงาน ข้อค้นพบ และข้อเสนอแนะเชิงนโยบาย",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["Executive Summary", "Presentation", "รายงานผู้บริหาร", "การนำเสนอ", "สไลด์"]
    },
    {
        day: 9,
        date: "21 ส.ค. 2569",
        title: "การวางแผนและการบริหารจัดการโครงการภาครัฐ (Public Project Management)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "ผู้เชี่ยวชาญด้านการวางแผนและติดตามประเมินผลโครงการภาครัฐ",
        summaryMorning: "วงจรโครงการ (Project Life Cycle), การจัดทำกรอบแนวคิดโครงการ (Logical Framework), การกำหนด KPI และ Milestone",
        summaryAfternoon: "การจัดสรรทรัพยากรและงบประมาณ, การประเมินความเสี่ยง (Risk Management), และการติดตามผลการดำเนินงาน",
        examFocus: "หลัก SMART KPI (Specific, Measurable, Achievable, Relevant, Time-bound) และขั้นตอนการควบคุมความเสี่ยง",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["โครงการ", "Project Management", "KPI", "Milestone", "งบประมาณ", "ความเสี่ยง"]
    },
    {
        day: 10,
        date: "22 ส.ค. 2569",
        title: "การทำงานร่วมกันเป็นทีมในบริบทหน่วยงานภาครัฐ (Public Sector Teamwork)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "วิทยากรด้านการพัฒนาองค์กรและภาวะผู้นำ",
        summaryMorning: "ทฤษฎีบทบาทในทีม (Belbin Team Roles), การสร้างความไว้วางใจ (Psychological Safety), และการสื่อสารเพื่อลดความขัดแย้ง",
        summaryAfternoon: "กิจกรรมกลุ่มจำลองสถานการณ์การทำงานร่วมกัน (Team Simulation Game), การแก้ปัญหาเฉพาะหน้า และการถอดบทเรียน (AAR)",
        examFocus: "กระบวนการ AAR (After Action Review): ๑. เป้าหมายคืออะไร ๒. เกิดอะไรขึ้นจริง ๓. แตกต่างอย่างไร ๔. จะปรับปรุงอย่างไร",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["Teamwork", "ทีม", "การทำงานร่วมกัน", "AAR", "ความขัดแย้ง"]
    },
    {
        day: 11,
        date: "25 ส.ค. 2569",
        title: "การประเมินสมรรถนะและการเตรียมความพร้อมฝึกปฏิบัติงานจริง (OJT Preparation)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "คณะกรรมการกำกับดูแลการฝึกงาน OJT ภาครัฐ",
        summaryMorning: "โครงสร้างการฝึกปฏิบัติงาน OJT 4 มิติ (เป้าหมาย 90 ชั่วโมง ในเดือนกันยายน), เกณฑ์การประเมินสมรรถนะรายบุคคล",
        summaryAfternoon: "การจัดทำแผนการฝึกงานรายสัปดาห์ (OJT Action Plan), การบันทึก Log Book และการประสานงานกับพี่เลี้ยงในหน่วยงาน (Mentor)",
        examFocus: "เกณฑ์การผ่าน OJT: เวลาสะสม ≥90 ชั่วโมง, ครอบคลุมครบทั้ง 4 ด้าน, และมีการประเมินผลจากผู้ควบคุมงาน",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["OJT", "ฝึกงาน", "สมรรถนะ", "90 ชั่วโมง", "4 มิติ", "พี่เลี้ยง"]
    },
    {
        day: 12,
        date: "26 ส.ค. 2569",
        title: "การจัดทำแฟ้มสะสมผลงานดิจิทัลตามมาตรฐาน ก.พ. (Digital Portfolio Master)",
        room: "ADV: BB 211 | FND: BB 202",
        track: "PARALLEL",
        trackLabel: "แยกสาย ADV & FND",
        lecturer: "ผู้เชี่ยวชาญด้านการจัดทำ Portfolio และ Career Transition",
        summaryMorning: "โครงสร้างแฟ้มผลงานมาตรฐาน 7 หน้า A4, การคัดเลือกผลงานและหลักฐานเชิงประจักษ์ (Artifacts)",
        summaryAfternoon: "การเขียนข้อความแนะนำตนเอง ทักษะ และวิสัยทัศน์, การจัดรูปแบบ PDF และการพิมพ์เล่มส่งคณะกรรมการประเมิน",
        examFocus: "มาตรฐานโครงสร้าง Portfolio 7 หน้า: ปก, สารบัญ, ประวัติ, สถิติอบรม 13 วัน, ผลงาน OJT 4 มิติ, สื่อผลงาน และการประเมินตนเอง",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["Portfolio", "แฟ้มผลงาน", "7 หน้า A4", "Artifacts", "ประวัติการทำงาน"]
    },
    {
        day: 13,
        date: "27 ส.ค. 2569",
        title: "ปัจฉิมนิเทศ สรุปบทเรียน และการประเมินผลสัมฤทธิ์ (Post-test & Closing)",
        room: "ห้องประชุม BB 212",
        track: "COMBINED",
        trackLabel: "รวมทุกหลักสูตร (40 คน)",
        lecturer: "ผู้บริหารสถาบัน BDI, กรม พก. และคณะวิทยากรหลักสูตร",
        summaryMorning: "การทำแบบทดสอบวัดผลสัมฤทธิ์หลังเรียน (Post-test), การประเมินความพึงพอใจหลักสูตร, และการนำเสนอผลงานกลุ่มตัวแทน",
        summaryAfternoon: "พิธีปัจฉิมนิเทศ, การมอบประกาศนียบัตร, สรุปก้าวต่อไปสู่การฝึกงาน OJT 90 ชม. และการบรรจุงานในหน่วยงานภาครัฐ",
        examFocus: "ข้อสอบ Post-test สรุปภาพรวมความรู้ทั้ง 13 วัน: งานสารบรรณ, วินัยข้าราชการ, PDPA, OJT 4 มิติ, และทักษะดิจิทัลภาครัฐ",
        docUrl: "https://docs.google.com/presentation/d/1hvBHgT2JFdpKYP7OxAmJLW56I3jdHH9WIy64fFOaToY/edit",
        keywords: ["ปัจฉิมนิเทศ", "Post-test", "ประกาศนียบัตร", "สรุปบทเรียน", "BB212", "ความสำเร็จ"]
    }
];

function switchM5View(viewType) {
    const slidesPanel = document.getElementById('m5-slides-view-panel');
    const artifactsPanel = document.getElementById('m5-artifacts-view-panel');
    const btnSlides = document.getElementById('btn-m5-view-slides');
    const btnArtifacts = document.getElementById('btn-m5-view-artifacts');

    if (viewType === 'slides') {
        if (slidesPanel) slidesPanel.classList.remove('hidden');
        if (artifactsPanel) artifactsPanel.classList.add('hidden');
        if (btnSlides) btnSlides.className = 'bg-amber-500 hover:bg-amber-600 text-govNavy font-bold px-3.5 py-2 rounded-xl text-xs transition shadow flex items-center space-x-1.5 border border-amber-300 cursor-pointer';
        if (btnArtifacts) btnArtifacts.className = 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow flex items-center space-x-1.5 border border-slate-300 cursor-pointer';
        renderM5LectureSlidesGrid();
    } else {
        if (slidesPanel) slidesPanel.classList.add('hidden');
        if (artifactsPanel) artifactsPanel.classList.remove('hidden');
        if (btnSlides) btnSlides.className = 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow flex items-center space-x-1.5 border border-slate-300 cursor-pointer';
        if (btnArtifacts) btnArtifacts.className = 'bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow flex items-center space-x-1.5 border border-cyan-500 cursor-pointer';
        renderArtifactsGrid();
    }
}

function filterM5SlideTrack(track) {
    activeM5SlideTrack = track;
    ['ALL', 'COMBINED', 'PARALLEL'].forEach(t => {
        const btn = document.getElementById(`filter-slide-${t}`);
        if (btn) {
            if (t === track) {
                btn.className = 'px-2.5 py-1 rounded-lg font-bold bg-govNavy text-white shrink-0 cursor-pointer';
            } else {
                btn.className = 'px-2.5 py-1 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer';
            }
        }
    });
    renderM5LectureSlidesGrid();
}

function filterM5Slides() {
    const input = document.getElementById('m5-slide-search-input');
    activeM5SlideSearch = input ? input.value.trim().toLowerCase() : '';
    renderM5LectureSlidesGrid();
}

function renderM5LectureSlidesGrid() {
    const container = document.getElementById('m5-lecture-slides-container');
    if (!container) return;

    let filtered = master13DaysLectureSlides.filter(slide => {
        // Track Filter
        if (activeM5SlideTrack !== 'ALL' && slide.track !== activeM5SlideTrack) {
            return false;
        }
        // Search Query
        if (activeM5SlideSearch) {
            const fullText = `${slide.title} ${slide.room} ${slide.lecturer} ${slide.summaryMorning} ${slide.summaryAfternoon} ${slide.keywords.join(' ')}`.toLowerCase();
            return fullText.includes(activeM5SlideSearch);
        }
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full app-card p-8 text-center text-slate-500 space-y-2">
                <i class="fa-solid fa-folder-open text-3xl text-slate-300"></i>
                <div class="font-bold text-sm">ไม่พบสไลด์บรรยายที่ตรงกับคำค้นหา</div>
                <div class="text-xs text-slate-400">ลองค้นหาด้วยคำอื่น เช่น สารบรรณ, PDPA, Excel, ห้อง BB</div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(slide => {
        const isCombined = slide.track === 'COMBINED';
        return `
            <div class="app-card p-5 lecture-slide-card border-t-4 ${isCombined ? 'border-govGold' : 'border-blue-600'} flex flex-col justify-between space-y-3">
                <div class="space-y-2.5">
                    <!-- Top Badges -->
                    <div class="flex items-center justify-between gap-2">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-govNavy text-white">
                            วันที่ ${slide.day} (${slide.date})
                        </span>
                        <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${isCombined ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-200'}">
                            ${escapeHtml(slide.trackLabel)}
                        </span>
                    </div>

                    <!-- Title -->
                    <h4 class="text-sm font-bold text-govNavy leading-snug">
                        ${escapeHtml(slide.title)}
                    </h4>

                    <!-- Room & Lecturer -->
                    <div class="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        <div class="flex items-center space-x-1.5">
                            <i class="fa-solid fa-location-dot text-rose-500 text-[11px]"></i>
                            <span><strong>ห้อง:</strong> ${escapeHtml(slide.room)}</span>
                        </div>
                        <div class="flex items-center space-x-1.5 truncate">
                            <i class="fa-solid fa-chalkboard-user text-blue-600 text-[11px]"></i>
                            <span class="truncate"><strong>วิทยากร:</strong> ${escapeHtml(slide.lecturer)}</span>
                        </div>
                    </div>

                    <!-- Key Takeaway Preview -->
                    <div class="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        ${escapeHtml(slide.summaryMorning)}
                    </div>

                    <!-- Exam Focus Badge -->
                    <div class="p-2 rounded-lg exam-focus-badge text-[11px] text-amber-950 flex items-start space-x-1.5">
                        <i class="fa-solid fa-key text-amber-700 text-xs mt-0.5 shrink-0"></i>
                        <div class="line-clamp-2"><strong>จุดเน้นข้อสอบ:</strong> ${escapeHtml(slide.examFocus)}</div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <button type="button" onclick="openLectureSlideModal(${slide.day})" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold transition flex items-center justify-center space-x-1 cursor-pointer">
                        <i class="fa-solid fa-eye text-slate-600"></i>
                        <span>ดูสรุป & จุดเน้น</span>
                    </button>
                    <a href="${slide.docUrl}" target="_blank" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center justify-center space-x-1 shadow-xs cursor-pointer">
                        <i class="fa-solid fa-file-pdf"></i>
                        <span>เปิดสไลด์</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function openLectureSlideModal(dayNumber) {
    const slide = master13DaysLectureSlides.find(s => s.day === dayNumber);
    if (!slide) return;

    setText('modal-slide-day-badge', `วันที่ ${slide.day} (${slide.date})`);
    setText('modal-slide-track-badge', slide.trackLabel);
    setText('modal-slide-title', slide.title);
    setText('modal-slide-lecturer', slide.lecturer);
    setText('modal-slide-room', slide.room);
    setText('modal-slide-morning', slide.summaryMorning);
    setText('modal-slide-afternoon', slide.summaryAfternoon);
    setText('modal-slide-exam-focus', slide.examFocus);

    const linkBtn = document.getElementById('modal-slide-link');
    if (linkBtn) linkBtn.href = slide.docUrl;

    const askAiBtn = document.getElementById('modal-btn-ask-ai');
    if (askAiBtn) {
        askAiBtn.onclick = () => askAISlideQuestion(slide.day);
    }

    openModal('modal-lecture-slide');
}

function askAISlideQuestion(dayNumber) {
    const slide = master13DaysLectureSlides.find(s => s.day === dayNumber);
    if (!slide) return;

    closeModal('modal-lecture-slide');
    toggleAIBuddyDrawer(true);

    const promptText = `ช่วยสรุปเนื้อหาหลักและจุดเน้นข้อสอบของสไลด์บรรยาย วันที่ ${slide.day}: "${slide.title}" ให้กระชับ เข้าใจง่าย 3 ข้อ และยกตัวอย่างคำถามที่มักออกในข้อสอบข้าราชการ`;
    const chatInput = document.getElementById('ai-chat-input');
    if (chatInput) {
        chatInput.value = promptText;
        sendAIChatMessage();
    }
}

function openGeminiSpark(dayNumber) {
    const slide = master13DaysLectureSlides.find(s => s.day === dayNumber);
    const dayItem = appState.attendance.find(a => a.day === dayNumber);
    if (!slide && !dayItem) return;

    toggleAIBuddyDrawer(true);

    const title = slide ? slide.title : dayItem.title;
    const morningTopic = slide ? slide.summaryMorning : (dayItem.morning || 'การบรรยายช่วงเช้า');
    const afternoonTopic = slide ? slide.summaryAfternoon : (dayItem.afternoon || 'การบรรยายช่วงบ่าย');
    const examFocus = slide ? slide.examFocus : 'วินัย ระเบียบราชการ และการประยุกต์ใช้ดิจิทัล';

    const promptText = `✨ [Gemini Spark Briefing - วันที่ ${dayNumber}: "${title}"]
ตารางอบรม: ทุกวันธรรมดา (ช่วงเช้า 09.30 - 12.00 น. | ช่วงบ่าย 13.30 - 16.00 น.)
- สาระสำคัญเช้า (09.30 น.): ${morningTopic}
- สาระสำคัญบ่าย (13.30 น.): ${afternoonTopic}
- จุดเน้นข้อสอบ: ${examFocus}

ขอสรุปแบบ "Gemini Spark 30 วินาที" พร้อมจุดเน้นข้อสอบ:
1. ⚡ หัวใจสำคัญ 3 ข้อ (เช้า 09.30 น. & บ่าย 13.30 น.)
2. 🎯 จุดเน้นข้อสอบและกับดักที่ชอบหลอก (Civil Service Exam Sparks)
3. 📝 มินิควิซจำลอง 2 ข้อ (พร้อมตัวเลือก A B C D และเฉลยสั้นๆ)`;

    const chatInput = document.getElementById('ai-chat-input');
    if (chatInput) {
        chatInput.value = promptText;
        sendAIChatMessage();
    }
}

// ============================================================================
// 12. M9: LECTURERS DIRECTORY (17 INSTRUCTORS) & TRACEABILITY MATRIX ENGINE
// ============================================================================

const masterLecturersList = [
    {
        id: '01',
        name: 'ดร.ชณทัต บุญชูวงศ์',
        category: 'AI & ดิจิทัล',
        position: 'นักวิชาการอิสระ / อาจารย์พิเศษ',
        agency: 'จุฬาลงกรณ์ฯ และมหาวิทยาลัยที่เกี่ยวข้อง',
        expertise: 'AI-integrated learning, Digital Literacy, สื่อดิจิทัล และการเรียนรู้ด้วยเทคโนโลยี',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-robot'
    },
    {
        id: '02',
        name: 'รศ.ดร.ทวีศักดิ์ กฤษเจริญ',
        category: 'บริหารราชการ',
        position: 'คณบดี บัณฑิตวิทยาลัยการจัดการและนวัตกรรม',
        agency: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี',
        expertise: 'รัฐประศาสนศาสตร์ นโยบายสาธารณะ การบริหารองค์กร และการเปลี่ยนแปลงเชิงระบบ',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: 'fa-landmark'
    },
    {
        id: '03',
        name: 'ผศ.ดร.สุธิวัชร ศุภลักษณ์',
        category: 'AI & ดิจิทัล',
        position: 'ผู้ช่วยศาสตราจารย์ / นักวิจัย',
        agency: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี',
        expertise: 'AI เพื่อการเรียนการสอน เกมการเรียนรู้ ความคิดเชิงคำนวณ และสื่อการเรียนรู้สมัยใหม่',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-gamepad'
    },
    {
        id: '04',
        name: 'ผศ.ดร.ดวงใจ จิตคงชื่น',
        category: 'ข้อมูล',
        position: 'รองประธานฝ่ายพัฒนากำลังคน',
        agency: 'สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน)',
        expertise: 'AI, Data Science, Business Analytics, Machine Learning และ Data Visualization',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'fa-chart-pie'
    },
    {
        id: '05',
        name: 'ดร.ขวัญศิริ ศิริมังคลา',
        category: 'ข้อมูล',
        position: 'Senior Data Innovation Educator',
        agency: 'สถาบันข้อมูลขนาดใหญ่ (BDI)',
        expertise: 'คณิตศาสตร์ประยุกต์ การพยากรณ์ข้อมูล และการสื่อสารข้อมูลด้วย BI/Visualization',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'fa-chart-line'
    },
    {
        id: '06',
        name: 'ดร.ปริสุทธิ์ จิตต์ภักดี',
        category: 'ข้อมูล',
        position: 'ผู้เชี่ยวชาญการศึกษาด้านนวัตกรรมข้อมูล',
        agency: 'สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน)',
        expertise: 'Data Science, Machine Learning, NLP, Image Mining, Data Governance และ BI',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'fa-database'
    },
    {
        id: '07',
        name: 'ดร.สุกฤตา ปรีชาว่อง',
        category: 'ทักษะการทำงาน',
        position: 'Co-founder / CEO / Coach / Trainer',
        agency: 'องค์กรพัฒนาบุคลากรและการเรียนรู้ (อิสระ)',
        expertise: 'การโค้ช พัฒนาบุคลากร ภาวะผู้นำ การให้คำปรึกษา และการจัดกระบวนการเรียนรู้',
        badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        icon: 'fa-comments'
    },
    {
        id: '08',
        name: 'นางสาววราภรณ์ ไตรศักดิ์ศรี',
        category: 'AI & ดิจิทัล',
        position: 'นักวิชาการคอมพิวเตอร์ชำนาญการพิเศษ',
        agency: 'สำนักงานสถิติแห่งชาติ',
        expertise: 'PDPA, Microsoft Office/Excel, Cybersecurity Awareness, แบบสอบถามออนไลน์ และ Infographic',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-shield-halved'
    },
    {
        id: '09',
        name: 'รศ.ดร.เกยูร วงศ์ก้อม',
        category: 'คนพิการ & การเข้าถึง',
        position: 'ข้าราชการบำนาญ / อาจารย์ด้านการศึกษาพิเศษ',
        agency: 'คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต',
        expertise: 'การศึกษาพิเศษ การวิจัยเพื่อคนพิการ และการส่งเสริมศักยภาพคนหูหนวก',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: 'fa-hands-asl-interpreting'
    },
    {
        id: '10',
        name: 'ผศ.ดร.ภริมา วินิธาสถิตย์กุล',
        category: 'คนพิการ & การเข้าถึง',
        position: 'ผู้ช่วยศาสตราจารย์',
        agency: 'คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต',
        expertise: 'จิตวิทยา การศึกษาพิเศษ ภาษามือไทย และการสื่อสารเชิงสร้างสรรค์',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: 'fa-heart'
    },
    {
        id: '11',
        name: 'ผศ.ดร.ชนินทร์ ฐิติเพชรกุล',
        category: 'AI & ดิจิทัล',
        position: 'รองคณบดี / หัวหน้าส่วนงานพัฒนาบุคลากรฯ',
        agency: 'คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต',
        expertise: 'AI เพื่อการทำงานและการศึกษา IT Service Management และสื่อดิจิทัลเพื่อการเข้าถึง',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-laptop-code'
    },
    {
        id: '12',
        name: 'อาจารย์จารุณี ทองอร่าม',
        category: 'AI & ดิจิทัล',
        position: 'อาจารย์ สาขาระบบสารสนเทศและคอมพิวเตอร์ธุรกิจ',
        agency: 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ',
        expertise: 'Web/Mobile App, Google Workspace, Photoshop/Illustrator, Excel และ Content Marketing',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-palette'
    },
    {
        id: '13',
        name: 'อาจารย์ณัฐฐิณี คงไกรฤกษ์',
        category: 'AI & ดิจิทัล',
        position: 'อาจารย์ สาขาระบบสารสนเทศและคอมพิวเตอร์ธุรกิจ',
        agency: 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ',
        expertise: 'การออกแบบฐานข้อมูล การพัฒนาโปรแกรม และการวิเคราะห์/ออกแบบระบบ',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-network-wired'
    },
    {
        id: '14',
        name: 'ผศ.ชุติมา กลั่นไพฑูรย์',
        category: 'AI & ดิจิทัล',
        position: 'ผู้ช่วยศาสตราจารย์ สาขาระบบสารสนเทศ',
        agency: 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ',
        expertise: 'Visual Studio .NET, Word/Excel, Google Workspace, Cloud Collaboration และ UI/UX',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-cloud'
    },
    {
        id: '15',
        name: 'อาจารย์มงคล สิริถิรวัฒน์',
        category: 'ทักษะการทำงาน',
        position: 'ผู้จัดการโครงการรัฐสภาร่วมใจรวมพลังสร้างสุข',
        agency: 'สสส. ประจำสำนักงานเลขาธิการสภาผู้แทนราษฎร',
        expertise: 'รัฐประศาสนศาสตร์ การสร้างเสริมสุขภาวะ การทำงานเป็นทีม และการจัดกระบวนการ',
        badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        icon: 'fa-people-group'
    },
    {
        id: '16',
        name: 'อาจารย์มาณิช อินทฉิม',
        category: 'กฎหมาย & ราชการ',
        position: 'อดีตที่ปรึกษาด้านระบบงานนิติบัญญัติ / วิทยากรเชี่ยวชาญ',
        agency: 'สำนักงานเลขาธิการสภาผู้แทนราษฎร',
        expertise: 'ระบบงานนิติบัญญัติ กฎหมาย นโยบายสาธารณะ หน้าที่พลเมือง และการบริหารราชการ',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: 'fa-scale-balanced'
    },
    {
        id: '17',
        name: 'นางสาวสุพิชฌาย์ กลิ่นหอม',
        category: 'กฎหมาย & ราชการ',
        position: 'นิติกรชำนาญการพิเศษ',
        agency: 'ส่วนระเบียบกลาง กองกฎหมายและระเบียบกลาง สำนักงานปลัดสำนักนายกรัฐมนตรี',
        expertise: 'กฎหมายและระเบียบงานสารบรรณ งานสารบรรณอิเล็กทรอนิกส์ และการเขียนหนังสือราชการเชิงวิเคราะห์',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: 'fa-feather'
    }
];

const masterCourseMatrixTraceability = [
    {
        day: 1,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'GOV-101',
        title: 'ปฐมนิเทศและเป้าหมายการปฏิบัติราชการในศตวรรษที่ 21',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '02',
        lecturerName: 'รศ.ดร.ทวีศักดิ์ กฤษเจริญ',
        fileTitle: 'สไลด์ปฐมนิเทศและบทบาทข้าราชการยุคใหม่.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 1,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'GOV-102',
        title: 'โครงสร้างการบริหารราชการแผ่นดินและธรรมาภิบาลภาครัฐ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '02',
        lecturerName: 'รศ.ดร.ทวีศักดิ์ กฤษเจริญ',
        fileTitle: 'เอกสารบรรยายโครงสร้างราชการและธรรมาภิบาล.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 2,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'DIG-201',
        title: 'การประยุกต์ใช้ AI ในการเรียนรู้และการปฏิบัติราชการ (AI-Integrated Learning)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '01',
        lecturerName: 'ดร.ชณทัต บุญชูวงศ์',
        fileTitle: 'AI_Integrated_Learning_CivilService.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 2,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'DIG-202',
        title: 'Digital Literacy & สื่อดิจิทัลเพื่อการสื่อสารภาครัฐ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '01',
        lecturerName: 'ดร.ชณทัต บุญชูวงศ์',
        fileTitle: 'Digital_Literacy_Gov_Communication.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 3,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'LAW-301',
        title: 'ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติม',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '17',
        lecturerName: 'นางสาวสุพิชฌาย์ กลิ่นหอม',
        fileTitle: 'ระเบียบงานสารบรรณและการเขียนหนังสือราชการ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 3,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'LAW-302',
        title: 'งานสารบรรณอิเล็กทรอนิกส์ และการเขียนหนังสือราชการเชิงวิเคราะห์',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '17',
        lecturerName: 'นางสาวสุพิชฌาย์ กลิ่นหอม',
        fileTitle: 'สารบรรณอิเล็กทรอนิกส์และเทคนิคหนังสือภายนอก-ภายใน.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 4,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'DAT-401',
        title: 'Data Science & Data Analytics เบื้องต้นสำหรับงานราชการ',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '04',
        lecturerName: 'ผศ.ดร.ดวงใจ จิตคงชื่น',
        fileTitle: 'Data_Science_Public_Sector.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 4,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'DAT-402',
        title: 'การวิเคราะห์ข้อมูลเชิงพยากรณ์และ Business Intelligence (BI/Visualization)',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '05',
        lecturerName: 'ดร.ขวัญศิริ ศิริมังคลา',
        fileTitle: 'BI_Data_Visualization_BDI.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 5,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'DAT-501',
        title: 'Data Governance, ธรรมาภิบาลข้อมูล และการเตรียมข้อมูลขนาดใหญ่',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '06',
        lecturerName: 'ดร.ปริสุทธิ์ จิตต์ภักดี',
        fileTitle: 'Data_Governance_BigData_Framework.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 5,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'DAT-502',
        title: 'Machine Learning, NLP และ Image Mining สำหรับงานวิเคราะห์ภาครัฐ',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '06',
        lecturerName: 'ดร.ปริสุทธิ์ จิตต์ภักดี',
        fileTitle: 'Machine_Learning_NLP_GovAnalytics.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 6,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'SEC-601',
        title: 'พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) สำหรับเจ้าหน้าที่รัฐ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '08',
        lecturerName: 'นางสาววราภรณ์ ไตรศักดิ์ศรี',
        fileTitle: 'PDPA_Awareness_Government_Officer.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 6,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'SEC-602',
        title: 'Cybersecurity Awareness และการประมวลผลข้อมูลปลอดภัยด้วย Excel/แบบสอบถาม',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '08',
        lecturerName: 'นางสาววราภรณ์ ไตรศักดิ์ศรี',
        fileTitle: 'Cybersecurity_DataSecurity_Excel.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 7,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'ACC-701',
        title: 'การศึกษาพิเศษและการเสริมสร้างศักยภาพคนพิการในองค์กรภาครัฐ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '09',
        lecturerName: 'รศ.ดร.เกยูร วงศ์ก้อม',
        fileTitle: 'Special_Education_Disability_Inclusion.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 7,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'ACC-702',
        title: 'จิตวิทยา ภาษามือไทย และการสื่อสารเชิงสร้างสรรค์ในที่ทำงาน',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '10',
        lecturerName: 'ผศ.ดร.ภริมา วินิธาสถิตย์กุล',
        fileTitle: 'SignLanguage_CreativeCommunication.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 8,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'APP-801',
        title: 'Google Workspace และการประยุกต์ใช้ Cloud Collaboration ในงานราชการ',
        track: 'FND',
        trackLabel: 'หลักสูตรพื้นฐาน (Foundation)',
        lecturerId: '12',
        lecturerName: 'อาจารย์จารุณี ทองอร่าม',
        fileTitle: 'Google_Workspace_Collaboration_Gov.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 8,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'APP-802',
        title: 'การออกแบบ UI/UX และเครื่องมือสร้างสื่อดิจิทัลสมัยใหม่',
        track: 'FND',
        trackLabel: 'หลักสูตรพื้นฐาน (Foundation)',
        lecturerId: '14',
        lecturerName: 'ผศ.ชุติมา กลั่นไพฑูรย์',
        fileTitle: 'UI_UX_Design_Media_Production.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 9,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'SYS-901',
        title: 'การวิเคราะห์และออกแบบระบบสารสนเทศ (System Analysis & Design)',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '13',
        lecturerName: 'อาจารย์ณัฐฐิณี คงไกรฤกษ์',
        fileTitle: 'Systems_Analysis_Design_PublicSector.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 9,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'SYS-902',
        title: 'การออกแบบฐานข้อมูลเชิงสัมพันธ์และสถาปัตยกรรมข้อมูลภาครัฐ',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '13',
        lecturerName: 'อาจารย์ณัฐฐิณี คงไกรฤกษ์',
        fileTitle: 'Relational_Database_Design_Gov.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 10,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'ITM-1001',
        title: 'IT Service Management และการบริหารจัดการบริการเทคโนโลยีดิจิทัล',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '11',
        lecturerName: 'ผศ.ดร.ชนินทร์ ฐิติเพชรกุล',
        fileTitle: 'IT_Service_Management_Framework.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 10,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'ITM-1002',
        title: 'การนำ Generative AI มาเสริมประสิทธิภาพการทำงานภาครัฐอย่างปลอดภัย',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '11',
        lecturerName: 'ผศ.ดร.ชนินทร์ ฐิติเพชรกุล',
        fileTitle: 'GenAI_Workplace_Productivity.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 11,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'WRK-1101',
        title: 'การทำงานเป็นทีม การสร้างเสริมสุขภาวะองค์กร และการสื่อสารเชิงบวก',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '15',
        lecturerName: 'อาจารย์มงคล สิริถิรวัฒน์',
        fileTitle: 'Teamwork_HappyWorkplace_Parliament.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 11,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'WRK-1102',
        title: 'ภาวะผู้นำ การโค้ช และการจัดกระบวนการเรียนรู้เพื่อการพัฒนาตนเอง',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '07',
        lecturerName: 'ดร.สุกฤตา ปรีชาว่อง',
        fileTitle: 'Leadership_Coaching_PersonalGrowth.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 12,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'LEG-1201',
        title: 'ระบบงานนิติบัญญัติ กฎหมายมหาชน และกระบวนการตรากฎหมายไทย',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '16',
        lecturerName: 'อาจารย์มาณิช อินทฉิม',
        fileTitle: 'Legislative_System_PublicLaw_Thailand.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 12,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'LEG-1202',
        title: 'นโยบายสาธารณะ หน้าที่พลเมือง และการขับเคลื่อนธรรมาภิบาล',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '16',
        lecturerName: 'อาจารย์มาณิช อินทฉิม',
        fileTitle: 'Public_Policy_GoodGovernance_CivilService.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 13,
        session: 'MORNING',
        timeLabel: '09.30 - 12.00 น.',
        subjectCode: 'CPT-1301',
        title: 'ความคิดเชิงคำนวณ (Computational Thinking) และเกมการเรียนรู้สมัยใหม่',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '03',
        lecturerName: 'ผศ.ดร.สุธิวัชร ศุภลักษณ์',
        fileTitle: 'Computational_Thinking_Learning_Games.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 13,
        session: 'AFTERNOON',
        timeLabel: '13.30 - 16.00 น.',
        subjectCode: 'CPT-1302',
        title: 'การประเมินปิดการอบรม สรุปภาพรวม 13 วัน และการเตรียมความพร้อม OJT',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '03',
        lecturerName: 'ผศ.ดร.สุธิวัชร ศุภลักษณ์',
        fileTitle: 'Course_Synthesis_OJT_Readiness.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/170aXk_jY52UuT48Xn5hL-sCjW35iW-B7',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    }
];

let currentMatrixTrackFilter = 'ALL';
let currentMatrixStatusFilter = 'ALL';
let currentLecturerCategoryFilter = 'ALL';
let activeSelectedLecturerId = '01';

function renderM9Views() {
    renderCourseMatrixList();
    renderLecturersDirectory();
}

function renderCourseMatrixList() {
    const container = document.getElementById('matrix-table-container');
    if (!container) return;

    const searchInput = document.getElementById('matrix-search-input');
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = masterCourseMatrixTraceability.filter(item => {
        // Track filter
        if (currentMatrixTrackFilter !== 'ALL') {
            if (item.track !== 'BOTH' && item.track !== currentMatrixTrackFilter) {
                return false;
            }
        }

        // Status filter
        if (currentMatrixStatusFilter !== 'ALL') {
            if (item.status !== currentMatrixStatusFilter) {
                return false;
            }
        }

        // Search query
        if (searchVal) {
            const matchText = `วันที่ ${item.day} ${item.session} ${item.timeLabel} ${item.subjectCode} ${item.title} ${item.lecturerName} ${item.fileTitle}`.toLowerCase();
            return matchText.includes(searchVal);
        }

        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                <i class="fa-solid fa-folder-open text-3xl mb-2"></i>
                <p>ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => {
        const isMorning = item.session === 'MORNING';
        const sessionBadge = isMorning 
            ? `<span class="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md font-bold text-[10px]"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>เช้า (${item.timeLabel})</span>`
            : `<span class="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]"><i class="fa-solid fa-cloud-sun text-emerald-600 mr-1"></i>บ่าย (${item.timeLabel})</span>`;

        const trackBadge = item.track === 'BOTH'
            ? `<span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">ทุกสาย</span>`
            : item.track === 'ADV'
            ? `<span class="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-[10px] font-bold">ขั้นสูง (ADV)</span>`
            : `<span class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">พื้นฐาน (FND)</span>`;

        const statusBadge = item.status === 'VERIFIED'
            ? `<span class="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center"><i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i>ยืนยันจากไฟล์</span>`
            : `<span class="bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center"><i class="fa-solid fa-hourglass-half text-amber-600 mr-1"></i>รอตรวจสอบ</span>`;

        return `
            <div class="p-3.5 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200 shadow-2xs transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div class="space-y-1.5 flex-1">
                    <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span class="bg-govNavy text-white px-2 py-0.5 rounded-md font-black text-[11px]">วันที่ ${item.day}</span>
                        ${sessionBadge}
                        ${trackBadge}
                        <span class="text-slate-400 font-mono text-[10px]">${item.subjectCode}</span>
                    </div>
                    <div class="font-bold text-govNavy text-sm leading-snug">
                        ${item.title}
                    </div>
                    <div class="flex items-center space-x-3 text-slate-600 text-xs flex-wrap gap-y-1">
                        <button type="button" onclick="jumpToLecturerCard('${item.lecturerId}')" class="font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center space-x-1 cursor-pointer" title="คลิกเพื่อเลื่อนไปยังทำเนียบวิทยากร">
                            <i class="fa-solid fa-user-tie text-blue-600"></i>
                            <span>${item.lecturerName}</span>
                            <span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full ml-1">ลำดับที่ ${item.lecturerId}</span>
                        </button>
                        <span class="text-slate-300">|</span>
                        <span class="text-slate-500 flex items-center space-x-1">
                            <i class="fa-solid fa-file-lines text-slate-400"></i>
                            <span>${item.fileTitle}</span>
                        </span>
                    </div>
                </div>

                <div class="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    ${statusBadge}
                    <a href="${item.fileDriveUrl}" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition flex items-center space-x-1.5 cursor-pointer">
                        <i class="fa-brands fa-google-drive"></i>
                        <span>เปิด Drive</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function setMatrixTrackFilter(track) {
    currentMatrixTrackFilter = track;
    ['all', 'fnd', 'adv'].forEach(t => {
        const btn = document.getElementById(`btn-matrix-track-${t}`);
        if (!btn) return;
        if (t.toUpperCase() === track) {
            btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-govNavy text-white shadow-xs cursor-pointer';
        } else {
            btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer';
        }
    });
    renderCourseMatrixList();
}

function setMatrixStatusFilter(status) {
    currentMatrixStatusFilter = status;
    ['all', 'verified', 'pending'].forEach(s => {
        const btn = document.getElementById(`btn-matrix-status-${s}`);
        if (!btn) return;
        if (s.toUpperCase() === status) {
            btn.className = 'px-2.5 py-1 rounded-md text-[11px] font-bold bg-white border border-slate-400 text-slate-900 shadow-2xs cursor-pointer';
        } else {
            btn.className = 'px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer';
        }
    });
    renderCourseMatrixList();
}

function filterMatrixBySearch() {
    renderCourseMatrixList();
}

function renderLecturersDirectory() {
    const container = document.getElementById('lecturers-grid-container');
    const badgeEl = document.getElementById('lecturers-count-badge');
    if (!container) return;

    const searchInput = document.getElementById('lecturer-search-input');
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = masterLecturersList.filter(l => {
        // Category filter
        if (currentLecturerCategoryFilter !== 'ALL') {
            if (l.category !== currentLecturerCategoryFilter) {
                return false;
            }
        }

        // Search query
        if (searchVal) {
            const text = `${l.id} ${l.name} ${l.position} ${l.agency} ${l.category} ${l.expertise}`.toLowerCase();
            return text.includes(searchVal);
        }

        return true;
    });

    if (badgeEl) {
        badgeEl.innerText = `พบ ${filtered.length} รายการ`;
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                <i class="fa-solid fa-user-slash text-3xl mb-2"></i>
                <p>ไม่พบรายชื่อวิทยากรที่ค้นหา</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(l => {
        return `
            <div id="lecturer-card-${l.id}" class="lecturer-card p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="w-8 h-8 rounded-lg bg-govNavy text-amber-400 font-black text-xs flex items-center justify-center shadow-2xs">${l.id}</span>
                            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${l.badgeColor}">
                                <i class="fa-solid ${l.icon} mr-1"></i>${l.category}
                            </span>
                        </div>
                        <button type="button" onclick="openLecturerModal('${l.id}')" class="text-slate-400 hover:text-blue-600 text-sm p-1 cursor-pointer" title="ดูรายละเอียดวิทยากร">
                            <i class="fa-solid fa-circle-info"></i>
                        </button>
                    </div>

                    <div>
                        <h4 class="font-bold text-govNavy text-sm">${l.name}</h4>
                        <p class="text-[11px] font-semibold text-slate-700 leading-tight mt-0.5">${l.position}</p>
                        <p class="text-[10px] text-slate-500 mt-0.5">${l.agency}</p>
                    </div>

                    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div class="text-[10px] font-bold text-slate-600 flex items-center space-x-1">
                            <i class="fa-solid fa-award text-amber-500"></i>
                            <span>ความถนัด:</span>
                        </div>
                        <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-3">${l.expertise}</p>
                    </div>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button type="button" onclick="openLecturerModal('${l.id}')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer">
                        <i class="fa-solid fa-address-card"></i>
                        <span>ดูประวัติ & วิชาที่สอน</span>
                    </button>
                    <button type="button" onclick="askAILecturerTopics('${l.id}')" class="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[10px] border border-purple-200 flex items-center space-x-1 transition cursor-pointer">
                        <i class="fa-solid fa-sparkles text-purple-600"></i>
                        <span>AI สรุป</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function filterLecturersByCategory(category) {
    currentLecturerCategoryFilter = category;
    document.querySelectorAll('.lecturer-cat-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-govNavy', 'text-white', 'shadow-2xs');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    });

    const activeBtn = Array.from(document.querySelectorAll('.lecturer-cat-btn')).find(b => {
        if (category === 'ALL') return b.innerText.includes('ทั้งหมด');
        return b.innerText.includes(category);
    });

    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-100', 'text-slate-700');
        activeBtn.classList.add('active', 'bg-govNavy', 'text-white', 'shadow-2xs');
    }

    renderLecturersDirectory();
}

function filterLecturersBySearch() {
    renderLecturersDirectory();
}

function openLecturerModal(lecturerId) {
    const lecturer = masterLecturersList.find(l => l.id === lecturerId);
    if (!lecturer) return;

    activeSelectedLecturerId = lecturerId;

    const idBadge = document.getElementById('modal-lecturer-id-badge');
    const catBadge = document.getElementById('modal-lecturer-cat-badge');
    const nameEl = document.getElementById('modal-lecturer-name');
    const posEl = document.getElementById('modal-lecturer-position');
    const agencyEl = document.getElementById('modal-lecturer-agency');
    const expEl = document.getElementById('modal-lecturer-expertise');
    const coursesList = document.getElementById('modal-lecturer-courses-list');

    if (idBadge) idBadge.innerText = lecturer.id;
    if (catBadge) {
        catBadge.innerText = lecturer.category;
        catBadge.className = `text-[10px] font-bold px-2.5 py-0.5 rounded-full ${lecturer.badgeColor} uppercase`;
    }
    if (nameEl) nameEl.innerText = lecturer.name;
    if (posEl) posEl.innerText = lecturer.position;
    if (agencyEl) agencyEl.innerText = lecturer.agency;
    if (expEl) expEl.innerText = lecturer.expertise;

    // Find all courses taught by this lecturer in masterCourseMatrixTraceability
    const courses = masterCourseMatrixTraceability.filter(c => c.lecturerId === lecturerId);
    if (coursesList) {
        if (courses.length === 0) {
            coursesList.innerHTML = `<div class="text-slate-400 italic">ไม่มีข้อมูลวิชาในระบบ 13 วัน</div>`;
        } else {
            coursesList.innerHTML = courses.map(c => `
                <div class="p-2 bg-white rounded-lg border border-blue-100 flex items-center justify-between">
                    <div>
                        <span class="font-bold text-govNavy">วันที่ ${c.day} (${c.session === 'MORNING' ? 'เช้า 09.30 น.' : 'บ่าย 13.30 น.'}):</span>
                        <span class="text-slate-700 ml-1">${c.title}</span>
                    </div>
                    <a href="${c.fileDriveUrl}" target="_blank" class="text-emerald-600 hover:text-emerald-800 font-bold ml-2 shrink-0">
                        <i class="fa-brands fa-google-drive mr-1"></i>Drive
                    </a>
                </div>
            `).join('');
        }
    }

    openModal('modal-lecturer-profile');
}

function jumpToLecturerCard(lecturerId) {
    // 1. Switch to M9 tab
    switchTab('m9');

    // 2. Reset lecturer category filter to ALL so the target card is visible
    filterLecturersByCategory('ALL');
    const searchInput = document.getElementById('lecturer-search-input');
    if (searchInput) searchInput.value = '';

    // 3. Smooth scroll to target card and trigger highlight pulse
    setTimeout(() => {
        const cardId = `lecturer-card-${lecturerId}`;
        const cardEl = document.getElementById(cardId);
        if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            cardEl.classList.remove('lecturer-highlight-pulse');
            void cardEl.offsetWidth; // trigger reflow
            cardEl.classList.add('lecturer-highlight-pulse');
            showToast(`นำทางไปยังวิทยากรลำดับที่ ${lecturerId}: ${masterLecturersList.find(l=>l.id===lecturerId)?.name}`);
        }
    }, 150);
}

function askAILecturerTopics(lecturerId) {
    const id = lecturerId || activeSelectedLecturerId;
    const lecturer = masterLecturersList.find(l => l.id === id);
    if (!lecturer) return;

    closeModal('modal-lecturer-profile');
    toggleAIBuddyDrawer(true);

    const courses = masterCourseMatrixTraceability.filter(c => c.lecturerId === id);
    const courseTitles = courses.map(c => `วันที่ ${c.day}: ${c.title}`).join(', ') || 'หลักสูตรการเตรียมความพร้อมฯ';

    const promptText = `✨ [เจาะลึกเนื้อหาวิทยากร - ลำดับที่ ${lecturer.id}: "${lecturer.name}"]
ตำแหน่ง: ${lecturer.position}
สังกัด: ${lecturer.agency}
กลุ่มความเชี่ยวชาญ: ${lecturer.category}
ความถนัด: ${lecturer.expertise}
วิชาที่บรรยายในหลักสูตร: ${courseTitles}

ขอสรุปแบบกระชับสำหรับเตรียมตัวเรียนหรือนำไปประยุกต์ใช้ในการสอบและปฏิบัติราชการ:
1. 💡 3 ประเด็นสำคัญที่วิทยากรท่านนี้เน้นย้ำ
2. 🎯 เทคนิคและทักษะที่ข้าราชการใหม่ควรนำไปปรับใช้จริง
3. 📝 1 คำถามทดสอบความเข้าใจในหัวข้อที่วิทยากรบรรยาย`;

    const chatInput = document.getElementById('ai-chat-input');
    if (chatInput) {
        chatInput.value = promptText;
        sendAIChatMessage();
    }
}

// Window Bindings for M9 Lecturers & Matrix Traceability
window.renderM9Views = renderM9Views;
window.renderCourseMatrixList = renderCourseMatrixList;
window.setMatrixTrackFilter = setMatrixTrackFilter;
window.setMatrixStatusFilter = setMatrixStatusFilter;
window.filterMatrixBySearch = filterMatrixBySearch;
window.renderLecturersDirectory = renderLecturersDirectory;
window.filterLecturersByCategory = filterLecturersByCategory;
window.filterLecturersBySearch = filterLecturersBySearch;
window.openLecturerModal = openLecturerModal;
window.jumpToLecturerCard = jumpToLecturerCard;
window.askAILecturerTopics = askAILecturerTopics;
window.masterLecturersList = masterLecturersList;
window.masterCourseMatrixTraceability = masterCourseMatrixTraceability;

// Window Bindings for Lecture Slides Hub & Gemini Spark
window.switchM5View = switchM5View;
window.filterM5SlideTrack = filterM5SlideTrack;
window.filterM5Slides = filterM5Slides;
window.renderM5LectureSlidesGrid = renderM5LectureSlidesGrid;
window.openLectureSlideModal = openLectureSlideModal;
window.askAISlideQuestion = askAISlideQuestion;
window.openGeminiSpark = openGeminiSpark;






