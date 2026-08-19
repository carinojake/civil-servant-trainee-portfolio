const fs = require('fs');
const path = require('path');

console.log('=== STRICTLY REPLACING M2 SCHEDULE DATA TO MATCH GOOGLE DOC ===');

const baseDir = path.join(__dirname, '..');
const hubDataPath = path.join(baseDir, '01_data/lecturers_hub_data.json');
const hubData = JSON.parse(fs.readFileSync(hubDataPath, 'utf8'));

// Update all learning_map sessions accurately
hubData.learning_map.forEach(session => {
    // 19 ส.ค. 2569 (Day 7)
    if (session.id === 'session-19-am' || session.id === 'session-19-adv-m') {
        session.id = 'session-19-adv-m';
        session.date = '19 สิงหาคม 2569';
        session.period = 'ช่วงเช้า (09:00 – 12:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '3.2 การบริหารคลังข้อมูลและการสร้างแดชบอร์ด';
        session.subtopics = [
            "3.2.1 เทคนิคการทำความสะอาดข้อมูล (Data Cleaning) และการวิเคราะห์สถิติขั้นสูงด้วยโปรแกรมคำนวณเพื่อการวางแผน",
            "3.2.2 การสร้างแดชบอร์ดอัจฉริยะ (เช่น Power BI, Looker Studio) เพื่อเปลี่ยนข้อมูลตัวเลขหนาเตอะของราชการให้เป็นภาพที่ผู้บริหารเข้าใจทันที",
            "3.2.3 หลักธรรมาภิบาลข้อมูล (Data Governance) พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) และความปลอดภัยไซเบอร์ในการจัดการข้อมูลรัฐ"
        ];
        session.lecturers = [
            "นางสาวธัญมาศ ทองมูลเล็ก",
            "นายศราวุฒิ ศรีทอง",
            "นางสาวภัทรศยา จำจองวุฒิ"
        ];
        session.file_name = "เอกสารบรรยาย_3.2_การบริหารคลังข้อมูลและแดชบอร์ด_สถิติแห่งชาติ.pdf";
        session.notes = "วิทยากรจากสำนักงานสถิติแห่งชาติ (ใช้คอมพิวเตอร์)";
    } else if (session.id === 'session-19-pm' || session.id === 'session-19-adv-a') {
        session.id = 'session-19-adv-a';
        session.date = '19 สิงหาคม 2569';
        session.period = 'ช่วงบ่าย (13:00 – 16:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '3.4 งานสารบรรณและการร่างข้อเสนอเชิงวิเคราะห์';
        session.subtopics = [
            "3.4.1 ศิลปะการเขียน 'บันทึกข้อความนำเสนอผู้บริหาร' ระดับสูง (ต้นเรื่อง -> ข้อเท็จจริง -> ข้อพิจารณา -> ข้อเสนอแนะ)",
            "3.4.2 การเขียนข้อเสนอโครงการภาครัฐตามหลักเหตุและผล (Logical Framework Matrix) และการกำหนดงบประมาณเชิงกลยุทธ์",
            "3.4.3 การออกแบบระบบและตัวชี้วัดความสำเร็จที่วัดผลสัมฤทธิ์ได้จริง (KPIs & OKRs ภาครัฐ) พร้อมเครื่องมือติดตามงานดิจิทัล"
        ];
        session.lecturers = [
            "รศ.ดร.ปรัชญา ชุ่มนาเสียว"
        ];
        session.file_name = "เอกสารบรรยาย_3.4_งานสารบรรณและการร่างข้อเสนอเชิงวิเคราะห์_ม.รามคำแหง.pdf";
        session.notes = "วิทยากรจากคณะรัฐศาสตร์ มหาวิทยาลัยรามคำแหง";
    }

    // 20 ส.ค. 2569 (Day 8)
    else if (session.id === 'session-20-am' || session.id === 'session-20-adv-m') {
        session.id = 'session-20-adv-m';
        session.date = '20 สิงหาคม 2569';
        session.period = 'ช่วงเช้า (09:00 – 12:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '4.1 จิตวิทยาการบริการขั้นสูงและการจัดการอารมณ์';
        session.subtopics = [
            "4.1.1 จิตวิทยาการอ่านพฤติกรรมและความต้องการเชิงลึกของลูกค้า (Customer Psychology)",
            "4.1.2 ทักษะการฟังเชิงลึก (Deep Listening) เพื่อจับประเด็นซ่อนเร้นและความรู้สึกที่แท้จริง",
            "4.1.3 การบริหารอารมณ์ตนเองและการฟื้นฟูจิตใจจากภาวะความเครียดในการบริการ (Resilience & Emotional Regulation)"
        ];
        session.lecturers = [
            "ดร.สุกฤตา ปรีชาว่อง"
        ];
        session.file_name = "เอกสารบรรยาย_4.1_จิตวิทยาการบริการขั้นสูงและการจัดการอารมณ์.pdf";
        session.notes = "บรรยายโดย ดร.สุกฤตา ปรีชาว่อง";
    } else if (session.id === 'session-20-pm' || session.id === 'session-20-adv-a') {
        session.id = 'session-20-adv-a';
        session.date = '20 สิงหาคม 2569';
        session.period = 'ช่วงบ่าย (13:00 – 16:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '3.5 ทักษะของผู้นำด้านความคิดและการประสานงาน';
        session.subtopics = [
            "3.5.1 เทคนิคการนำเสนอและเล่าเรื่องด้วยข้อมูล (Data Storytelling) เพื่อโน้มน้าวใจผู้บริหารระดับสูง (Executive Pitching)",
            "3.5.2 ทักษะการประสานงานและการเจรจาต่อรองข้ามหน่วยงาน (Inter-agency Coordination) เพื่อผลักดันนโยบายร่วมกัน",
            "3.5.3 กฎหมายการปฏิบัติราชการทางอิเล็กทรอนิกส์ขั้นสูง เพื่อสร้างความเชี่ยวชาญในการบริหารงานนโยบายแบบไร้กระดาษ"
        ];
        session.lecturers = [
            "รศ.ดร.ทวีศักดิ์ กฤษเจริญ"
        ];
        session.file_name = "เอกสารบรรยาย_3.5_ทักษะของผู้นำด้านความคิดและการประสานงาน_KMUTT.pdf";
        session.notes = "วิทยากรจากคณบดี บัณฑิตวิทยาลัยการจัดการและนวัตกรรม มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี";
    }

    // 24 ส.ค. 2569 (Day 9)
    else if (session.id === 'session-24-am' || session.id === 'session-24-adv-m') {
        session.id = 'session-24-adv-m';
        session.date = '24 สิงหาคม 2569';
        session.period = 'ช่วงเช้า (09:00 – 12:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '4.2 การบริหารจัดการข้อร้องเรียนและวิกฤตขั้นวิกฤต';
        session.subtopics = [
            "4.2.1 เทคนิคการเจรจาต่อรองและการคลี่คลายสถานการณ์ตึงเครียด (De-escalation Techniques) กับลูกค้าที่โกรธจัดหรือมีพฤติกรรมรับมือยาก",
            "4.2.2 กระบวนการเยียวยาและเปลี่ยนลูกค้าที่ติดลบให้กลับมาพึงพอใจ (Service Recovery Paradox)",
            "4.2.3 การบริหารจัดการวิกฤตบนโลกออนไลน์ (Social Media Crisis Management) สำหรับงานบริการสาธารณะ"
        ];
        session.lecturers = [
            "นางสาวนันทพร มากมูล",
            "นายวิศรุต เสรีนิราช"
        ];
        session.file_name = "เอกสารบรรยาย_4.2_การบริหารจัดการข้อร้องเรียนและวิกฤตขั้นวิกฤต.pdf";
        session.notes = "บรรยายโดย อ.นันทพร มากมูล และ อ.วิศรุต เสรีนิราช";
    } else if (session.id === 'session-24-pm' || session.id === 'session-24-adv-a') {
        session.id = 'session-24-adv-a';
        session.date = '24 สิงหาคม 2569';
        session.period = 'ช่วงบ่าย (13:00 – 16:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '4.3 การออกแบบประสบการณ์ลูกค้าและการบริหารความสัมพันธ์';
        session.subtopics = [
            "4.3.1 การออกแบบและวิเคราะห์เส้นทางการรับบริการ (Customer Journey Mapping) เพื่ออุดรอยรั่วและลดขั้นตอนที่ซับซ้อน",
            "4.3.2 การบริหารความสัมพันธ์ระยะยาว (Customer Relationship Management - CRM) ในระบบบริการภาครัฐ",
            "4.3.3 การส่งมอบบริการเชิงรุก (Proactive Service) ที่ตอบสนองความต้องการก่อนที่ลูกค้าจะร้องขอ"
        ];
        session.lecturers = [
            "รศ.ดร.วันชัย ปานจันทร์"
        ];
        session.file_name = "เอกสารบรรยาย_4.3_การออกแบบประสบการณ์ลูกค้าและCRMภาครัฐ.pdf";
        session.notes = "บรรยายโดย รศ.ดร.วันชัย ปานจันทร์";
    }

    // 25 ส.ค. 2569 (Day 10)
    else if (session.id === 'session-25-am' || session.id === 'session-25-adv-m') {
        session.id = 'session-25-adv-m';
        session.date = '25 สิงหาคม 2569';
        session.period = 'ช่วงเช้า (09:00 – 12:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '4.4 เทคโนโลยีและปัญญาประดิษฐ์เพื่อการบริการ & 3.3 AI เพื่อช่วยงานวิชาการขั้นสูง';
        session.subtopics = [
            "4.4.1 การบริหารจัดการระบบบริการแบบไร้รอยต่อ (Omnichannel Service) เชื่อมโยงช่องทางออฟไลน์และออนไลน์",
            "4.4.2 ทักษะการเป็นผู้ควบคุมและพัฒนา AI Chatbot (AI Prompting & Training for Service)",
            "4.4.3 การใช้ระบบฐานข้อมูลและประวัติผู้รับบริการ (CRM Tools) เพื่อให้บริการจำเพาะเจาะจงบุคคล (Personalized Service)",
            "3.3.1 เทคนิคการสั่งงาน AI (Prompt Engineering) เพื่อสืบค้น แปล และรวบรวมงานวิจัยจากทั่วโลก",
            "3.3.2 การใช้ AI ช่วยสรุปรายงานวิเคราะห์/รายงานการประชุมยาวๆ ให้เหลือเฉพาะบทสรุปผู้บริหาร (Executive Summary)",
            "3.3.3 การใช้ AI ช่วยจำลองฉากทัศน์ความเสี่ยงและวิเคราะห์แนวโน้มเพื่อประกอบข้อเสนอเชิงนโยบาย"
        ];
        session.lecturers = [
            "ผศ.ดร.สุธิวัชร ศุภลักษณ์",
            "ดร.ชณทัต บุญชูวงศ์"
        ];
        session.file_name = "เอกสารบรรยาย_4.4_3.3_AIบริการและงานวิชาการขั้นสูง_KMUTT.pdf";
        session.notes = "วิทยากรจาก มจธ. (ใช้คอมพิวเตอร์)";
    } else if (session.id === 'session-25-pm' || session.id === 'session-25-adv-a') {
        session.id = 'session-25-adv-a';
        session.date = '25 สิงหาคม 2569';
        session.period = 'ช่วงบ่าย (13:00 – 16:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '4.5 การวิเคราะห์ข้อมูลเพื่อปรับปรุงงานบริการ';
        session.subtopics = [
            "4.5.1 การวัดผลและวิเคราะห์ดัชนีชี้วัดความพึงพอใจขั้นสูง (เช่น CSAT, NPS, CES - Customer Effort Score)",
            "4.5.2 การเปลี่ยนข้อมูลข้อร้องเรียน (Voice of Customer) ให้กลายเป็นข้อมูลเชิงลึก (Insights) เพื่อเสนอแนะแนวทางพัฒนาองค์กร",
            "4.5.3 การสร้างแดชบอร์ดสรุปสถิติตัวชี้วัดงานบริการ (Service Dashboard) เพื่อรายงานต่อผู้บริหาร"
        ];
        session.lecturers = [
            "ผศ.ดร.สุธิวัชร ศุภลักษณ์",
            "ดร.ชณทัต บุญชูวงศ์"
        ];
        session.file_name = "เอกสารบรรยาย_4.5_การวิเคราะห์ข้อมูลเพื่อปรับปรุงงานบริการ_KMUTT.pdf";
        session.notes = "วิทยากรจาก มจธ. (ใช้คอมพิวเตอร์)";
    }

    // 26 ส.ค. 2569 (Day 11)
    else if (session.id === 'session-26-am' || session.id === 'session-26-adv-m') {
        session.id = 'session-26-adv-m';
        session.date = '26 สิงหาคม 2569';
        session.period = 'ช่วงเช้า (09:00 – 12:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '5.2 การประยุกต์ใช้เทคโนโลยีอัตโนมัติและ AI ในงานธุรการ';
        session.subtopics = [
            "5.2.1 การสร้างระบบทำงานอัตโนมัติขั้นพื้นฐาน (Power Automate, Google Apps Script) เชื่อมโยงงานเอกสาร การแจ้งเตือน และการอนุมัติ",
            "5.2.2 เทคนิคการสั่งงาน AI (Prompt Engineering) เพื่อช่วยร่าง จัดรูปแบบ และตรวจทานหนังสือราชการ",
            "5.2.3 การบริหารจัดการเครื่องมือประชุมทางไกลและการจัดงานอีเวนต์เสมือนจริง (Virtual & Hybrid Event Management)"
        ];
        session.lecturers = [
            "ผศ.ดร.สุธิวัชร ศุภลักษณ์",
            "ดร.ชณทัต บุญชูวงศ์"
        ];
        session.file_name = "เอกสารบรรยาย_5.2_เทคโนโลยีอัตโนมัติและAIในงานธุรการ_KMUTT.pdf";
        session.notes = "วิทยากรจาก มจธ. (ใช้คอมพิวเตอร์)";
    } else if (session.id === 'session-26-pm' || session.id === 'session-26-adv-a') {
        session.id = 'session-26-adv-a';
        session.date = '26 สิงหาคม 2569';
        session.period = 'ช่วงบ่าย (13:00 – 16:00 น.)';
        session.track = 'advanced';
        session.track_label = 'หลักสูตรขั้นสูง';
        session.room = 'ห้อง BB 203 (ห้อง 2)';
        session.subject = '5.3 งานสารบรรณและการเขียนเชิงวิเคราะห์ขั้นสูง';
        session.subtopics = [
            "การเขียนบันทึกข้อความเสนอผู้บังคับบัญชาเชิงวิเคราะห์",
            "การเขียนข้อเสนอเพื่อประกอบการตัดสินใจของผู้บริหาร",
            "Workshop งานสารบรรณและการเขียนเชิงวิเคราะห์ขั้นสูง"
        ];
        session.lecturers = [
            "นางสาวสุพิชฌาย์ กลิ่นหอม"
        ];
        session.file_name = "เอกสารบรรยาย_5.3_งานสารบรรณและการเขียนเชิงวิเคราะห์ขั้นสูง_สปน.pdf";
        session.notes = "วิทยากรจากส่วนระเบียบกลาง กองกฎหมายและระเบียบกลาง สำนักงานปลัดสำนักนายกรัฐมนตรี";
    }
});

fs.writeFileSync(hubDataPath, JSON.stringify(hubData, null, 2), 'utf8');
console.log('✓ Updated lecturers_hub_data.json completely');

// Now sync master13DaysHubSessions into app.js
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const updatedSessionsJson = JSON.stringify(hubData.learning_map, null, 4);
const sessionsRegex = /const master13DaysHubSessions = \[[\s\S]*?\];/;
if (appJs.match(sessionsRegex)) {
    appJs = appJs.replace(sessionsRegex, `const master13DaysHubSessions = ${updatedSessionsJson};`);
    console.log('✓ Successfully synchronized master13DaysHubSessions in app.js');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ All M2 schedule data strictly matches the Google Doc!');
