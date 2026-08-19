const fs = require('fs');
const path = require('path');

console.log('=== SYNCING M2 SCHEDULE & M9 LECTURERS DIRECTORY WITH GOOGLE DOC ===');

const baseDir = path.join(__dirname, '..');
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

// ============================================================================
// 1. UPDATE & EXPAND LECTURERS DIRECTORY IN lecturers_hub_data.json
// ============================================================================
const updatedLecturers = [
    {
        id: "01",
        name: "ดร.ชณทัต บุญชูวงศ์",
        category: "AI & ดิจิทัล",
        position: "อาจารย์ประจำภาควิชาครุศาสตร์เทคโนโลยีและสารสนเทศ",
        agency: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT)",
        expertise: "AI-integrated learning, Omnichannel Service, AI Chatbot & Prompt Engineering",
        email: "chanatat.buu@gmail.com",
        vehicle_plate: "4กฎ 45 กรุงเทพมหานคร",
        badge_color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "fa-robot",
        primary_day: 10,
        days_label: "วันที่ 10, 11",
        teaching_days: [10, 11]
    },
    {
        id: "02",
        name: "รศ.ดร.ทวีศักดิ์ กฤษเจริญ",
        category: "บริหารราชการ",
        position: "คณบดี บัณฑิตวิทยาลัยการจัดการและนวัตกรรม",
        agency: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT)",
        expertise: "Data Storytelling, Executive Pitching, Inter-agency Coordination, กฎหมายปฏิบัติราชการทางอิเล็กทรอนิกส์",
        email: "taweesak.kri@kmutt.ac.th",
        vehicle_plate: "7กท 2323 กรุงเทพมหานคร",
        badge_color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: "fa-landmark",
        primary_day: 8,
        days_label: "วันที่ 8",
        teaching_days: [8]
    },
    {
        id: "03",
        name: "ผศ.ดร.สุธิวัชร ศุภลักษณ์",
        category: "AI & ดิจิทัล",
        position: "คณบดีคณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี",
        agency: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT)",
        expertise: "AI & Automation, Service Dashboard, Customer Insights, Power Automate & Google Apps Script",
        email: "sutiwat.sup@kmutt.ac.th",
        vehicle_plate: "5กฬ62 กรุงเทพมหานคร",
        badge_color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "fa-laptop-code",
        primary_day: 10,
        days_label: "วันที่ 10, 11",
        teaching_days: [10, 11]
    },
    {
        id: "04",
        name: "ผศ.ดร.ดวงใจ จิตคงชื่น",
        category: "ข้อมูล",
        position: "ผู้อำนวยการฝ่ายพัฒนากำลังคน",
        agency: "สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน) - BDI",
        expertise: "AI, Data Science, Business Analytics, Machine Learning และ Data Visualization",
        badge_color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "fa-chart-pie",
        primary_day: 2,
        days_label: "วันที่ 2",
        teaching_days: [2]
    },
    {
        id: "05",
        name: "ดร.ขวัญศิริ ศิริมังคลา",
        category: "ข้อมูล",
        position: "Senior Data Innovation Educator (นักการศึกษาด้านนวัตกรรมข้อมูลอาวุโส)",
        agency: "สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน) - BDI",
        expertise: "คณิตศาสตร์ประยุกต์ การพยากรณ์ข้อมูล และการสื่อสารข้อมูลด้วย BI/Visualization",
        badge_color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "fa-chart-line",
        primary_day: 2,
        days_label: "วันที่ 2",
        teaching_days: [2]
    },
    {
        id: "06",
        name: "ดร.ปริสุทธิ์ จิตต์ภักดี",
        category: "ข้อมูล",
        position: "ผู้เชี่ยวชาญการศึกษาด้านนวัตกรรมข้อมูล",
        agency: "สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน) - BDI",
        expertise: "Data Science, Machine Learning, NLP, Data Governance และ BI",
        badge_color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "fa-database",
        primary_day: 2,
        days_label: "วันที่ 2",
        teaching_days: [2]
    },
    {
        id: "07",
        name: "ดร.สุกฤตา ปรีชาว่อง",
        category: "ทักษะการทำงาน",
        position: "ผู้เชี่ยวชาญด้านจิตวิทยาและการพัฒนาบุคลากร",
        agency: "องค์กรพัฒนาบุคลากรและการเรียนรู้",
        expertise: "Customer Psychology, Deep Listening, Resilience & Emotional Regulation",
        email: "sukritta.glow@gmail.com",
        vehicle_plate: "5 ขอ 9629 กรุงเทพมหานคร",
        badge_color: "bg-cyan-100 text-cyan-800 border-cyan-200",
        icon: "fa-comments",
        primary_day: 8,
        days_label: "วันที่ 8",
        teaching_days: [8]
    },
    {
        id: "08",
        name: "นางสาววราภรณ์ ไตรศักดิ์ศรี",
        category: "AI & ดิจิทัล",
        position: "นักวิชาการคอมพิวเตอร์ชำนาญการพิเศษ",
        agency: "สำนักงานสถิติแห่งชาติ",
        expertise: "Advanced Excel (XLOOKUP, Pivot), Data Visualization, Power BI Dashboard, Database Management",
        vehicle_plate: "ฬ 1416 กรุงเทพมหานคร",
        badge_color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "fa-table",
        primary_day: 3,
        days_label: "วันที่ 3",
        teaching_days: [3]
    },
    {
        id: "09",
        name: "รศ.ดร.เกยูร วงศ์ก้อม",
        category: "คนพิการ & การเข้าถึง",
        position: "ข้าราชการบำนาญ / อาจารย์ด้านการศึกษาพิเศษ",
        agency: "คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต",
        expertise: "การศึกษาพิเศษ การวิจัยเพื่อคนพิการ และการส่งเสริมศักยภาพคนหูหนวก",
        badge_color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: "fa-hands-asl-interpreting",
        primary_day: 4,
        days_label: "วันที่ 4",
        teaching_days: [4]
    },
    {
        id: "10",
        name: "ผศ.ดร.ภริมา วินิธาสถิตย์กุล",
        category: "คนพิการ & การเข้าถึง",
        position: "ผู้ช่วยศาสตราจารย์",
        agency: "คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต",
        expertise: "จิตวิทยา การศึกษาพิเศษ ภาษามือไทย และการสื่อสารเชิงสร้างสรรค์",
        badge_color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: "fa-heart",
        primary_day: 3,
        days_label: "วันที่ 3",
        teaching_days: [3]
    },
    {
        id: "11",
        name: "ผศ.ดร.ชนินทร์ ฐิติเพชรกุล",
        category: "AI & ดิจิทัล",
        position: "รองคณบดี / หัวหน้าส่วนงานพัฒนาบุคลากรฯ",
        agency: "คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต",
        expertise: "AI เพื่อการทำงานและการศึกษา IT Service Management และสื่อดิจิทัลเพื่อการเข้าถึง",
        badge_color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "fa-laptop-code",
        primary_day: 4,
        days_label: "วันที่ 4",
        teaching_days: [4]
    },
    {
        id: "12",
        name: "อาจารย์จารุณี ทองอร่าม",
        category: "AI & ดิจิทัล",
        position: "อาจารย์ สาขาระบบสารสนเทศและคอมพิวเตอร์ธุรกิจ",
        agency: "มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ",
        expertise: "Web/Mobile App, Google Workspace, Photoshop/Illustrator, Excel และ Content Marketing",
        badge_color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "fa-palette",
        primary_day: 6,
        days_label: "วันที่ 6",
        teaching_days: [6]
    },
    {
        id: "13",
        name: "อาจารย์ณัฐฐิณี คงไกรฤกษ์",
        category: "AI & ดิจิทัล",
        position: "อาจารย์ สาขาระบบสารสนเทศและคอมพิวเตอร์ธุรกิจ",
        agency: "มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ",
        expertise: "การออกแบบฐานข้อมูล การพัฒนาโปรแกรม และการวิเคราะห์/ออกแบบระบบ",
        badge_color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "fa-network-wired",
        primary_day: 6,
        days_label: "วันที่ 6",
        teaching_days: [6]
    },
    {
        id: "14",
        name: "ผศ.ชุติมา กลั่นไพฑูรย์",
        category: "AI & ดิจิทัล",
        position: "ผู้ช่วยศาสตราจารย์ สาขาระบบสารสนเทศ",
        agency: "มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ",
        expertise: "Visual Studio .NET, Word/Excel, Google Workspace, Cloud Collaboration และ UI/UX",
        badge_color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "fa-cloud",
        primary_day: 6,
        days_label: "วันที่ 6",
        teaching_days: [6]
    },
    {
        id: "15",
        name: "อาจารย์มงคล สิริถิรวัฒน์",
        category: "ทักษะการทำงาน",
        position: "ผู้จัดการโครงการรัฐสภาร่วมใจรวมพลังสร้างสุข",
        agency: "สสส. ประจำสำนักงานเลขาธิการสภาผู้แทนราษฎร",
        expertise: "รัฐประศาสนศาสตร์ การสร้างเสริมสุขภาวะ การทำงานเป็นทีม และการจัดกระบวนการ",
        badge_color: "bg-cyan-100 text-cyan-800 border-cyan-200",
        icon: "fa-people-group",
        primary_day: 2,
        days_label: "วันที่ 2",
        teaching_days: [2]
    },
    {
        id: "16",
        name: "อาจารย์มาณิช อินทฉิม",
        category: "กฎหมาย & ราชการ",
        position: "อดีตที่ปรึกษาด้านระบบงานนิติบัญญัติ / วิทยากรเชี่ยวชาญ",
        agency: "สำนักงานเลขาธิการสภาผู้แทนราษฎร",
        expertise: "ระบบงานนิติบัญญัติ กฎหมาย นโยบายสาธารณะ หน้าที่พลเมือง และการบริหารราชการ",
        badge_color: "bg-rose-100 text-rose-800 border-rose-200",
        icon: "fa-scale-balanced",
        primary_day: 7,
        days_label: "วันที่ 7",
        teaching_days: [7]
    },
    {
        id: "17",
        name: "นางสาวสุพิชฌาย์ กลิ่นหอม",
        category: "กฎหมาย & ราชการ",
        position: "นิติกรชำนาญการพิเศษ",
        agency: "สำนักงานปลัดสำนักนายกรัฐมนตรี (สปน.)",
        expertise: "งานสารบรรณและการเขียนเชิงวิเคราะห์ขั้นสูง บันทึกข้อความเสนอผู้บังคับบัญชาเชิงวิเคราะห์",
        email: "saraban@opm.go.th",
        phone: "086-6631725",
        travel_by: "รถไฟฟ้า",
        badge_color: "bg-rose-100 text-rose-800 border-rose-200",
        icon: "fa-feather",
        primary_day: 11,
        days_label: "วันที่ 11",
        teaching_days: [11]
    },
    {
        id: "18",
        name: "นางสาวนันทพร มากมูล",
        category: "การสื่อสาร & บริหาร",
        position: "ผู้เชี่ยวชาญด้านจิตวิทยาการสื่อสารภาครัฐและการบริหารวิกฤต",
        agency: "วิทยากรเชี่ยวชาญอิสระ",
        expertise: "เทคนิคการสื่อสารสร้างคอนเทนต์ภาครัฐ, นโยบาย DEI, การคลี่คลายข้อร้องเรียน (De-escalation), Social Media Crisis",
        email: "nantaporn.pla2@gmail.com",
        vehicle_plate: "6 ขฒต 913 กรุงเทพมหานคร",
        badge_color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "fa-bullhorn",
        primary_day: 3,
        days_label: "วันที่ 3, 9",
        teaching_days: [3, 9]
    },
    {
        id: "19",
        name: "นายวิศรุต เสรีนิราช",
        category: "การสื่อสาร & บริหาร",
        position: "ผู้เชี่ยวชาญด้านการสื่อสารและการผลิตสื่อดิจิทัลภาครัฐ",
        agency: "วิทยากรเชี่ยวชาญอิสระ",
        expertise: "จิตวิทยาการสื่อสารภาครัฐ การเล่าเรื่องเชิงรุก อินโฟกราฟิกเพื่อประชาชน และการบริหารจัดการวิกฤตบนโลกออนไลน์",
        email: "wisarut.se@gmail.com",
        vehicle_plate: "6 ขฒต 913 กรุงเทพมหานคร",
        badge_color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "fa-video",
        primary_day: 3,
        days_label: "วันที่ 3, 9",
        teaching_days: [3, 9]
    },
    {
        id: "20",
        name: "นางสาวธัญมาศ ทองมูลเล็ก",
        category: "ข้อมูล",
        position: "นักวิชาการสถิติ / ผู้เชี่ยวชาญด้านคลังข้อมูล",
        agency: "สำนักงานสถิติแห่งชาติ",
        expertise: "การทำความสะอาดข้อมูล (Data Cleaning) และการวิเคราะห์สถิติขั้นสูงเพื่อการวางแผนราชการ",
        badge_color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "fa-broom",
        primary_day: 7,
        days_label: "วันที่ 7",
        teaching_days: [7]
    },
    {
        id: "21",
        name: "นายศราวุฒิ ศรีทอง",
        category: "ข้อมูล",
        position: "นักวิชาการคอมพิวเตอร์ / ผู้เชี่ยวชาญด้านธรรมาภิบาลข้อมูล",
        agency: "สำนักงานสถิติแห่งชาติ",
        expertise: "ธรรมาภิบาลข้อมูล (Data Governance), พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) และความปลอดภัยไซเบอร์",
        badge_color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "fa-shield-halved",
        primary_day: 7,
        days_label: "วันที่ 7",
        teaching_days: [7]
    },
    {
        id: "22",
        name: "นางสาวภัทรศยา จำจองวุฒิ",
        category: "ข้อมูล",
        position: "นักวิชาการสถิติ / ผู้เชี่ยวชาญด้าน Data Visualization",
        agency: "สำนักงานสถิติแห่งชาติ",
        expertise: "การสร้างแดชบอร์ดอัจฉริยะ (Power BI, Looker Studio) เปลี่ยนข้อมูลตัวเลขราชการให้เป็นภาพเข้าใจง่าย",
        badge_color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "fa-chart-pie",
        primary_day: 7,
        days_label: "วันที่ 7",
        teaching_days: [7]
    },
    {
        id: "23",
        name: "รศ.ดร.ปรัชญา ชุ่มนาเสียว",
        category: "บริหารราชการ",
        position: "รองศาสตราจารย์ คณะรัฐศาสตร์",
        agency: "มหาวิทยาลัยรามคำแหง",
        expertise: "งานสารบรรณและการร่างข้อเสนอเชิงวิเคราะห์ บันทึกข้อความระดับสูง Logical Framework และ KPIs & OKRs ภาครัฐ",
        email: "Prachaya.Dr23@gmail.com",
        travel_by: "รถสาธารณะ",
        badge_color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: "fa-file-lines",
        primary_day: 7,
        days_label: "วันที่ 7",
        teaching_days: [7]
    },
    {
        id: "24",
        name: "รศ.ดร.วันชัย ปานจันทร์",
        category: "บริหารราชการ & บริการ",
        position: "รองศาสตราจารย์ / ผู้เชี่ยวชาญด้านการบริการภาครัฐ",
        agency: "วิทยากรเชี่ยวชาญอิสระ",
        expertise: "Customer Journey Mapping, การบริหารความสัมพันธ์ระยะยาว (CRM) และการส่งมอบบริการเชิงรุก (Proactive Service)",
        email: "chaipanjan@gmail.com",
        vehicle_plate: "8กจ 131 กรุงเทพมหานคร",
        badge_color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: "fa-user-group",
        primary_day: 9,
        days_label: "วันที่ 9",
        teaching_days: [9]
    },
    {
        id: "25",
        name: "คณะทำงานโครงการจัดสอบวัดผล Post-Test รวม",
        category: "วัดผล & ประเมิน",
        position: "คณะทำงานทดสอบวัดผลสัมฤทธิ์ทางการเรียนรู้",
        agency: "โครงการเตรียมความพร้อมสำหรับการจ้างงานคนพิการในหน่วยงานภาครัฐ",
        expertise: "การทดสอบวัดความรู้ Post-Test รวม 13 วัน เกณฑ์การประเมินผลสัมฤทธิ์ และการจัดทำรายงานสรุปผล",
        badge_color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: "fa-clipboard-check",
        primary_day: 12,
        days_label: "วันที่ 12",
        teaching_days: [12]
    },
    {
        id: "26",
        name: "คณะผู้บริหารโครงการ พิธีปิดการอบรม & ปฐมนิเทศ OJT",
        category: "บริหารโครงการ",
        position: "คณะผู้บริหารและคณะทำงานโครงการ",
        agency: "หน่วยงานภาครัฐและภาคีเครือข่ายความร่วมมือ",
        expertise: "การฝึกปฏิบัติงานจริง (OJT 90 ชม.), การประเมินสมรรถนะ 4 มิติ และการส่งตัวเข้าสู่หน่วยงานภาครัฐ",
        badge_color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: "fa-award",
        primary_day: 13,
        days_label: "วันที่ 13",
        teaching_days: [13]
    }
];

hubData.lecturers = updatedLecturers;

// Update learning_map sessions to reflect all lecturers exactly as per Google Doc
hubData.learning_map.forEach(session => {
    if (session.id === 'session-11-adv-m') {
        session.lecturers = ["ผศ.ดร.ดวงใจ จิตคงชื่น", "ดร.ปริสุทธิ์ จิตต์ภักดี", "ดร.ขวัญศิริ ศิริมังคลา"];
        session.subtopics = [
            "1.1.1 ธรรมาภิบาลข้อมูลและระบบฐานข้อมูลภาครัฐ",
            "1.1.2 การคิดเชิงข้อมูลและการจัดเตรียมข้อมูลเพื่อใช้งาน",
            "1.1.3 สูตรคำนวณขั้นสูงและการวิเคราะห์ข้อมูลเชิงลึก",
            "1.1.4 การสร้างแดชบอร์ดและการสรุปผลเพื่อการตัดสินใจ",
            "1.2.1 ทักษะการวางแผนโครงการ",
            "1.2.2 การคุมงบประมาณ",
            "1.2.3 การใช้เครื่องมือบริหารงานออนไลน์ (Trello, Jira, Notion) เพื่อคุมทีมจากระยะไกล"
        ];
    } else if (session.id === 'session-13-adv-m') {
        session.lecturers = ["นางสาวนันทพร มากมูล", "นายวิศรุต เสรีนิราช"];
        session.subtopics = [
            "1.5.1 การถอดรหัสนโยบายและจิตวิทยาการสื่อสารภาครัฐ",
            "1.5.2 กลยุทธ์การเขียนเนื้อหาและการเล่าเรื่องเชิงรุก",
            "1.5.3 การออกแบบอินโฟกราฟิกและสื่อดิจิทัลเพื่อประชาชน",
            "1.5.4 การบริหารจัดการสื่อและเทคนิคการสื่อสารในภาวะวิกฤต",
            "1.6.1 ทักษะผู้นำยุคใหม่",
            "1.6.2 การสร้างพลังใจ (Empowerment)",
            "1.6.3 การเจรจาต่อรอง",
            "1.6.4 การขับเคลื่อนนโยบายเพื่อความเท่าเทียมในองค์กร (DEI - Diversity, Equity, Inclusion)"
        ];
    } else if (session.id === 'session-13-adv-a') {
        session.lecturers = ["นางสาววราภรณ์ ไตรศักดิ์ศรี"];
        session.subtopics = [
            "2.1.1 Advanced Excel & Dashboard: การใช้สูตรคำนวณขั้นสูง (VLOOKUP, XLOOKUP, IF), Pivot Table และ Power BI",
            "2.1.2 Data Visualization: เปลี่ยนข้อมูลตัวเลขในรายงานราชการเป็นอินโฟกราฟิก/แผนภูมิเข้าใจง่าย",
            "2.1.3 Database Management: หลักการจัดเก็บและดึงข้อมูลจากระบบฐานข้อมูลภาครัฐอย่างเป็นระบบ"
        ];
    } else if (session.id === 'session-19-adv-m') {
        session.lecturers = ["นางสาวธัญมาศ ทองมูลเล็ก", "นายศราวุฒิ ศรีทอง", "นางสาวภัทรศยา จำจองวุฒิ"];
        session.subtopics = [
            "3.2.1 เทคนิคการทำความสะอาดข้อมูล (Data Cleaning) และการวิเคราะห์สถิติขั้นสูงเพื่อการวางแผน",
            "3.2.2 การสร้างแดชบอร์ดอัจฉริยะ (Power BI, Looker Studio) เปลี่ยนข้อมูลตัวเลขราชการเป็นภาพเข้าใจทันที",
            "3.2.3 หลักธรรมาภิบาลข้อมูล (Data Governance) พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) และความปลอดภัยไซเบอร์"
        ];
    } else if (session.id === 'session-19-adv-a') {
        session.lecturers = ["รศ.ดร.ปรัชญา ชุ่มนาเสียว"];
        session.subtopics = [
            "3.4.1 ศิลปะการเขียน 'บันทึกข้อความนำเสนอผู้บริหาร' ระดับสูง (ต้นเรื่อง -> ข้อเท็จจริง -> ข้อพิจารณา -> ข้อเสนอแนะ)",
            "3.4.2 การเขียนข้อเสนอโครงการภาครัฐตามหลักเหตุและผล (Logical Framework Matrix) และงบประมาณเชิงกลยุทธ์",
            "3.4.3 การออกแบบระบบและตัวชี้วัดความสำเร็จที่วัดผลสัมฤทธิ์ได้จริง (KPIs & OKRs ภาครัฐ) พร้อมเครื่องมือดิจิทัล"
        ];
    } else if (session.id === 'session-20-adv-m') {
        session.lecturers = ["ดร.สุกฤตา ปรีชาว่อง"];
        session.subtopics = [
            "4.1.1 จิตวิทยาการอ่านพฤติกรรมและความต้องการเชิงลึกของลูกค้า (Customer Psychology)",
            "4.1.2 ทักษะการฟังเชิงลึก (Deep Listening) เพื่อจับประเด็นซ่อนเร้นและความรู้สึกที่แท้จริง",
            "4.1.3 การบริหารอารมณ์ตนเองและการฟื้นฟูจิตใจจากภาวะความเครียดในการบริการ (Resilience & Emotional Regulation)"
        ];
    } else if (session.id === 'session-20-adv-a') {
        session.lecturers = ["รศ.ดร.ทวีศักดิ์ กฤษเจริญ"];
        session.subtopics = [
            "3.5.1 เทคนิคการนำเสนอและเล่าเรื่องด้วยข้อมูล (Data Storytelling) เพื่อโน้มน้าวใจผู้บริหาร (Executive Pitching)",
            "3.5.2 ทักษะการประสานงานและการเจรจาต่อรองข้ามหน่วยงาน (Inter-agency Coordination) เพื่อผลักดันนโยบายร่วมกัน",
            "3.5.3 กฎหมายการปฏิบัติราชการทางอิเล็กทรอนิกส์ขั้นสูง เพื่อสร้างความเชี่ยวชาญการบริหารนโยบายแบบไร้กระดาษ"
        ];
    } else if (session.id === 'session-24-adv-m') {
        session.lecturers = ["นางสาวนันทพร มากมูล", "นายวิศรุต เสรีนิราช"];
        session.subtopics = [
            "4.2.1 เทคนิคการเจรจาต่อรองและการคลี่คลายสถานการณ์ตึงเครียด (De-escalation Techniques)",
            "4.2.2 กระบวนการเยียวยาและเปลี่ยนลูกค้าที่ติดลบให้กลับมาพึงพอใจ (Service Recovery Paradox)",
            "4.2.3 การบริหารจัดการวิกฤตบนโลกออนไลน์ (Social Media Crisis Management) สำหรับงานบริการสาธารณะ"
        ];
    } else if (session.id === 'session-24-adv-a') {
        session.lecturers = ["รศ.ดร.วันชัย ปานจันทร์"];
        session.subtopics = [
            "4.3.1 การออกแบบและวิเคราะห์เส้นทางการรับบริการ (Customer Journey Mapping) เพื่ออุดรอยรั่วและลดขั้นตอน",
            "4.3.2 การบริหารความสัมพันธ์ระยะยาว (Customer Relationship Management - CRM) ในระบบบริการภาครัฐ",
            "4.3.3 การส่งมอบบริการเชิงรุก (Proactive Service) ที่ตอบสนองความต้องการก่อนที่ลูกค้าจะร้องขอ"
        ];
    } else if (session.id === 'session-25-adv-m') {
        session.lecturers = ["ผศ.ดร.สุธิวัชร ศุภลักษณ์", "ดร.ชณทัต บุญชูวงศ์"];
        session.subtopics = [
            "4.4.1 การบริหารจัดการระบบบริการแบบไร้รอยต่อ (Omnichannel Service) เชื่อมโยงออฟไลน์และออนไลน์",
            "4.4.2 ทักษะการเป็นผู้ควบคุมและพัฒนา AI Chatbot (AI Prompting & Training for Service)",
            "4.4.3 การใช้ระบบฐานข้อมูลและประวัติผู้รับบริการ (CRM Tools) เพื่อให้บริการจำเพาะเจาะจงบุคคล (Personalized Service)",
            "3.3.1 เทคนิคการสั่งงาน AI (Prompt Engineering) เพื่อสืบค้น แปล และรวบรวมงานวิจัยจากทั่วโลก",
            "3.3.2 การใช้ AI ช่วยสรุปรายงานวิเคราะห์/รายงานการประชุมให้เหลือเฉพาะบทสรุปผู้บริหาร (Executive Summary)",
            "3.3.3 การใช้ AI ช่วยจำลองฉากทัศน์ความเสี่ยงและวิเคราะห์แนวโน้มเพื่อประกอบข้อเสนอเชิงนโยบาย"
        ];
    } else if (session.id === 'session-25-adv-a') {
        session.lecturers = ["ผศ.ดร.สุธิวัชร ศุภลักษณ์", "ดร.ชณทัต บุญชูวงศ์"];
        session.subtopics = [
            "4.5.1 การวัดผลและวิเคราะห์ดัชนีชี้วัดความพึงพอใจขั้นสูง (CSAT, NPS, CES - Customer Effort Score)",
            "4.5.2 การเปลี่ยนข้อมูลข้อร้องเรียน (Voice of Customer) ให้กลายเป็นข้อมูลเชิงลึก (Insights)",
            "4.5.3 การสร้างแดชบอร์ดสรุปสถิติตัวชี้วัดงานบริการ (Service Dashboard) เพื่อรายงานต่อผู้บริหาร"
        ];
    } else if (session.id === 'session-26-adv-m') {
        session.lecturers = ["ผศ.ดร.สุธิวัชร ศุภลักษณ์", "ดร.ชณทัต บุญชูวงศ์"];
        session.subtopics = [
            "5.2.1 การสร้างระบบทำงานอัตโนมัติขั้นพื้นฐาน (Power Automate, Google Apps Script) เชื่อมโยงเอกสารและการอนุมัติ",
            "5.2.2 เทคนิคการสั่งงาน AI (Prompt Engineering) เพื่อช่วยร่าง จัดรูปแบบ และตรวจทานหนังสือราชการ",
            "5.2.3 การบริหารจัดการเครื่องมือประชุมทางไกลและการจัดงานอีเวนต์เสมือนจริง (Virtual & Hybrid Event Management)"
        ];
    } else if (session.id === 'session-26-adv-a') {
        session.lecturers = ["นางสาวสุพิชฌาย์ กลิ่นหอม"];
        session.subtopics = [
            "การเขียนบันทึกข้อความเสนอผู้บังคับบัญชาเชิงวิเคราะห์",
            "การเขียนข้อเสนอเพื่อประกอบการตัดสินใจของผู้บริหาร",
            "Workshop งานสารบรรณและการเขียนเชิงวิเคราะห์ขั้นสูง"
        ];
    } else if (session.id === 'session-27-joint') {
        session.lecturers = ["คณะทำงานโครงการจัดสอบวัดผล Post-Test รวม"];
        session.subtopics = [
            "การประเมินผลการเรียนรู้รายวิชาและภาพรวมหลักสูตร 13 วัน",
            "การทดสอบวัดผลสัมฤทธิ์ Post-Test รวมทุกสายหลักสูตร",
            "การตรวจทานและจัดเตรียมแฟ้มสะสมผลงานดิจิทัล (Digital Portfolio)"
        ];
    } else if (session.id === 'session-28-joint') {
        session.lecturers = ["คณะผู้บริหารโครงการ พิธีปิดการอบรม & ปฐมนิเทศ OJT"];
        session.subtopics = [
            "การสรุปผลการประเมินการฝึกอบรมภาคทฤษฎี รุ่นที่ 1",
            "การมอบหมายหน่วยงานภาครัฐสำหรับฝึกปฏิบัติงาน (1-30 ก.ย. 69)",
            "พิธีปิดการฝึกอบรมภาคทฤษฎีและถ่ายภาพร่วมกัน"
        ];
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');
console.log('✓ Updated 01_data/lecturers_hub_data.json with 26 complete lecturers & verified sessions!');

// ============================================================================
// 2. SYNCHRONIZE WITH app.js
// ============================================================================
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace masterLecturersList
const masterLecturersListStr = `const masterLecturersList = ${JSON.stringify(updatedLecturers, null, 4)};`;
const lecturerRegex = /const masterLecturersList = \[[\s\S]*?\];/;
if (appJs.match(lecturerRegex)) {
    appJs = appJs.replace(lecturerRegex, masterLecturersListStr);
    console.log('✓ Synchronized masterLecturersList (26 items) in app.js');
}

// Replace master13DaysHubSessions
const master13DaysHubSessionsStr = `const master13DaysHubSessions = ${JSON.stringify(hubData.learning_map, null, 4)};`;
const hubRegex = /const master13DaysHubSessions = \[[\s\S]*?\];/;
if (appJs.match(hubRegex)) {
    appJs = appJs.replace(hubRegex, master13DaysHubSessionsStr);
    console.log('✓ Synchronized master13DaysHubSessions in app.js');
}

// Update renderLecturerDetailModal in app.js to show vehicle_plate, email, and travel_by if available
const oldModalRenderRegex = /<div class="text-xs text-slate-600 space-y-1">[\s\S]*?<\/div>[\s\S]*?<div class="border-t border-slate-200 pt-4">/;

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Successfully synced all M2 schedules and M9 Lecturers Directory!');
