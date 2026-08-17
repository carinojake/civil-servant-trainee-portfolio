const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// Verified masterLecturersList
const verifiedLecturers = `const masterLecturersList = [
    {
        id: '01',
        name: 'ดร.ชณทัต บุญชูวงศ์',
        category: 'AI & ดิจิทัล',
        position: 'อาจารย์ประจำภาควิชาครุศาสตร์เทคโนโลยีและสารสนเทศ',
        agency: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT)',
        expertise: 'AI-integrated learning, Digital Literacy, สื่อดิจิทัล และการเรียนรู้ด้วยเทคโนโลยี',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-robot',
        primaryDay: 10,
        daysLabel: 'วันที่ 10, 11'
    },
    {
        id: '02',
        name: 'รศ.ดร.ทวีศักดิ์ กฤษเจริญ',
        category: 'บริหารราชการ',
        position: 'คณบดี บัณฑิตวิทยาลัยการจัดการและนวัตกรรม',
        agency: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี',
        expertise: 'รัฐประศาสนศาสตร์ นโยบายสาธารณะ การบริหารองค์กร และการเปลี่ยนแปลงเชิงระบบ',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: 'fa-landmark',
        primaryDay: 8,
        daysLabel: 'วันที่ 8'
    },
    {
        id: '03',
        name: 'ผศ.ดร.สุธิวัชร ศุภลักษณ์',
        category: 'AI & ดิจิทัล',
        position: 'ผู้ช่วยศาสตราจารย์ / นักวิจัย',
        agency: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี',
        expertise: 'AI เพื่อการเรียนการสอน เกมการเรียนรู้ ความคิดเชิงคำนวณ และสื่อการเรียนรู้สมัยใหม่',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-gamepad',
        primaryDay: 10,
        daysLabel: 'วันที่ 10, 11'
    },
    {
        id: '04',
        name: 'ผศ.ดร.ดวงใจ จิตคงชื่น',
        category: 'ข้อมูล',
        position: 'รองประธานฝ่ายพัฒนากำลังคน',
        agency: 'สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน)',
        expertise: 'AI, Data Science, Business Analytics, Machine Learning และ Data Visualization',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'fa-chart-pie',
        primaryDay: 2,
        daysLabel: 'วันที่ 2'
    },
    {
        id: '05',
        name: 'ดร.ขวัญศิริ ศิริมังคลา',
        category: 'ข้อมูล',
        position: 'Senior Data Innovation Educator',
        agency: 'สถาบันข้อมูลขนาดใหญ่ (BDI)',
        expertise: 'คณิตศาสตร์ประยุกต์ การพยากรณ์ข้อมูล และการสื่อสารข้อมูลด้วย BI/Visualization',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'fa-chart-line',
        primaryDay: 2,
        daysLabel: 'วันที่ 2'
    },
    {
        id: '06',
        name: 'ดร.ปริสุทธิ์ จิตต์ภักดี',
        category: 'ข้อมูล',
        position: 'ผู้เชี่ยวชาญการศึกษาด้านนวัตกรรมข้อมูล',
        agency: 'สถาบันข้อมูลขนาดใหญ่ (องค์การมหาชน)',
        expertise: 'Data Science, Machine Learning, NLP, Image Mining, Data Governance และ BI',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'fa-database',
        primaryDay: 2,
        daysLabel: 'วันที่ 2'
    },
    {
        id: '07',
        name: 'ดร.สุกฤตา ปรีชาว่อง',
        category: 'ทักษะการทำงาน',
        position: 'Co-founder / CEO / Coach / Trainer',
        agency: 'องค์กรพัฒนาบุคลากรและการเรียนรู้ (อิสระ)',
        expertise: 'การโค้ช พัฒนาบุคลากร ภาวะผู้นำ การให้คำปรึกษา และการจัดกระบวนการเรียนรู้',
        badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        icon: 'fa-comments',
        primaryDay: 6,
        daysLabel: 'วันที่ 6, 8, 9'
    },
    {
        id: '08',
        name: 'นางสาววราภรณ์ ไตรศักดิ์ศรี',
        category: 'AI & ดิจิทัล',
        position: 'นักวิชาการคอมพิวเตอร์ชำนาญการพิเศษ',
        agency: 'สำนักงานสถิติแห่งชาติ',
        expertise: 'PDPA, Microsoft Office/Excel, Cybersecurity Awareness, แบบสอบถามออนไลน์ และ Infographic',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-shield-halved',
        primaryDay: 3,
        daysLabel: 'วันที่ 3'
    },
    {
        id: '09',
        name: 'รศ.ดร.เกยูร วงศ์ก้อม',
        category: 'คนพิการ & การเข้าถึง',
        position: 'ข้าราชการบำนาญ / อาจารย์ด้านการศึกษาพิเศษ',
        agency: 'คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต',
        expertise: 'การศึกษาพิเศษ การวิจัยเพื่อคนพิการ และการส่งเสริมศักยภาพคนหูหนวก',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: 'fa-hands-asl-interpreting',
        primaryDay: 4,
        daysLabel: 'วันที่ 4'
    },
    {
        id: '10',
        name: 'ผศ.ดร.ภริมา วินิธาสถิตย์กุล',
        category: 'คนพิการ & การเข้าถึง',
        position: 'ผู้ช่วยศาสตราจารย์',
        agency: 'คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต',
        expertise: 'จิตวิทยา การศึกษาพิเศษ ภาษามือไทย และการสื่อสารเชิงสร้างสรรค์',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: 'fa-heart',
        primaryDay: 3,
        daysLabel: 'วันที่ 3'
    },
    {
        id: '11',
        name: 'ผศ.ดร.ชนินทร์ ฐิติเพชรกุล',
        category: 'AI & ดิจิทัล',
        position: 'รองคณบดี / หัวหน้าส่วนงานพัฒนาบุคลากรฯ',
        agency: 'คณะครุศาสตร์ มหาวิทยาลัยสวนดุสิต',
        expertise: 'AI เพื่อการทำงานและการศึกษา IT Service Management และสื่อดิจิทัลเพื่อการเข้าถึง',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-laptop-code',
        primaryDay: 4,
        daysLabel: 'วันที่ 4'
    },
    {
        id: '12',
        name: 'อาจารย์จารุณี ทองอร่าม',
        category: 'AI & ดิจิทัล',
        position: 'อาจารย์ สาขาระบบสารสนเทศและคอมพิวเตอร์ธุรกิจ',
        agency: 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ',
        expertise: 'Web/Mobile App, Google Workspace, Photoshop/Illustrator, Excel และ Content Marketing',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-palette',
        primaryDay: 6,
        daysLabel: 'วันที่ 6'
    },
    {
        id: '13',
        name: 'อาจารย์ณัฐฐิณี คงไกรฤกษ์',
        category: 'AI & ดิจิทัล',
        position: 'อาจารย์ สาขาระบบสารสนเทศและคอมพิวเตอร์ธุรกิจ',
        agency: 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ',
        expertise: 'การออกแบบฐานข้อมูล การพัฒนาโปรแกรม และการวิเคราะห์/ออกแบบระบบ',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-network-wired',
        primaryDay: 6,
        daysLabel: 'วันที่ 6'
    },
    {
        id: '14',
        name: 'ผศ.ชุติมา กลั่นไพฑูรย์',
        category: 'AI & ดิจิทัล',
        position: 'ผู้ช่วยศาสตราจารย์ สาขาระบบสารสนเทศ',
        agency: 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ',
        expertise: 'Visual Studio .NET, Word/Excel, Google Workspace, Cloud Collaboration และ UI/UX',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'fa-cloud',
        primaryDay: 6,
        daysLabel: 'วันที่ 6'
    },
    {
        id: '15',
        name: 'อาจารย์มงคล สิริถิรวัฒน์',
        category: 'ทักษะการทำงาน',
        position: 'ผู้จัดการโครงการรัฐสภาร่วมใจรวมพลังสร้างสุข',
        agency: 'สสส. ประจำสำนักงานเลขาธิการสภาผู้แทนราษฎร',
        expertise: 'รัฐประศาสนศาสตร์ การสร้างเสริมสุขภาวะ การทำงานเป็นทีม และการจัดกระบวนการ',
        badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        icon: 'fa-people-group',
        primaryDay: 2,
        daysLabel: 'วันที่ 2'
    },
    {
        id: '16',
        name: 'อาจารย์มาณิช อินทฉิม',
        category: 'กฎหมาย & ราชการ',
        position: 'อดีตที่ปรึกษาด้านระบบงานนิติบัญญัติ / วิทยากรเชี่ยวชาญ',
        agency: 'สำนักงานเลขาธิการสภาผู้แทนราษฎร',
        expertise: 'ระบบงานนิติบัญญัติ กฎหมาย นโยบายสาธารณะ หน้าที่พลเมือง และการบริหารราชการ',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: 'fa-scale-balanced',
        primaryDay: 7,
        daysLabel: 'วันที่ 7'
    },
    {
        id: '17',
        name: 'นางสาวสุพิชฌาย์ กลิ่นหอม',
        category: 'กฎหมาย & ราชการ',
        position: 'นิติกรชำนาญการพิเศษ',
        agency: 'ส่วนระเบียบกลาง กองกฎหมายและระเบียบกลาง สำนักงานปลัดสำนักนายกรัฐมนตรี',
        expertise: 'กฎหมายและระเบียบงานสารบรรณ งานสารบรรณอิเล็กทรอนิกส์ และการเขียนหนังสือราชการเชิงวิเคราะห์',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: 'fa-feather',
        primaryDay: 5,
        daysLabel: 'วันที่ 5, 11'
    }
];`;

// Verified masterCourseMatrixTraceability
const verifiedMatrix = `const masterCourseMatrixTraceability = [
    {
        day: 1,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'GOV-101',
        title: 'ปฐมนิเทศและทำความเข้าใจหลักสูตร / กิจกรรม Ice Breaking',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '02',
        lecturerName: 'รศ.ดร.ศุภชัย เหมือนโพธิ์ / ผศ.ชุดาพร สอนภักดี',
        fileTitle: 'กิจกรรม_Ice_Breaking_รู้จักฉันรู้จักเธอ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 1,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'GOV-102',
        title: 'วินัย คุณธรรม จริยธรรม และจรรยาบรรณของบุคลากรภาครัฐ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '02',
        lecturerName: 'ดร.นพพร บุญแก้ว',
        fileTitle: 'วินัย_คุณธรรม_จริยธรรม_ข้าราชการ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 2,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'DAT-201',
        title: 'การวิเคราะห์ข้อมูลและเทคโนโลยีการบริหารราชการยุคดิจิทัล (ADV) / ระบบราชการไทย (FND)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '04',
        lecturerName: 'ผศ.ดร.ดวงใจ จิตคงชื่น / ดร.ปริสุทธิ์ จิตต์ภักดี / อาจารย์มงคล สิริถิรวัฒน์',
        fileTitle: 'การวิเคราะห์ข้อมูลและการบริหารราชการยุคดิจิทัล.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 2,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'DAT-202',
        title: 'การออกแบบกระบวนงานดิจิทัล (Digital Workflow Design) / กฎหมายระเบียบราชการ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '06',
        lecturerName: 'ดร.ปริสุทธิ์ จิตต์ภักดี / ดร.ขวัญศิริ ศิริมังคลา / อาจารย์มงคล สิริถิรวัฒน์',
        fileTitle: 'Digital_Workflow_Design.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 3,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'COM-301',
        title: 'เทคนิคการสื่อสารและสร้างคอนเทนต์ภาครัฐ (ADV) / ทักษะพื้นฐานด้านการบริการภาครัฐ (FND)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '10',
        lecturerName: 'ผศ.ดร.ภริมา วินิธาสถิตย์กุล / นางสาวนันทพร มากมูล',
        fileTitle: 'เทคนิคการสื่อสารและสร้างคอนเทนต์ภาครัฐ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 3,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'DAT-302',
        title: 'การบริหารและวิเคราะห์ข้อมูลเพื่อการตัดสินใจ & PDPA (ADV) / Design Thinking (FND)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '08',
        lecturerName: 'นางสาววราภรณ์ ไตรศักดิ์ศรี / นายวิศรุต เสรีนิราช',
        fileTitle: 'การบริหารและวิเคราะห์ข้อมูลเพื่อการตัดสินใจ_PDPA.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 4,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'AI-401',
        title: 'การฝึกปฏิบัติการประยุกต์ใช้ปัญญาประดิษฐ์ (AI) ในการปฏิบัติงานราชการ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '11',
        lecturerName: 'ผศ.ดร.ชนินทร์ ฐิติเพชรกุล',
        fileTitle: 'Canva_สไลด์การประยุกต์ใช้_AI_ในงานราชการ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 4,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'GOV-402',
        title: 'บริบทการบริหารราชการ การเปลี่ยนแปลงเชิงกระบวนทัศน์ และระบบนิเวศการทำงานในยุคดิจิทัล',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '09',
        lecturerName: 'รศ.ดร.เกยูร วงศ์ก้อม / ดร.สุชีรา พลราชม',
        fileTitle: 'บริบทการบริหารราชการยุคดิจิทัล.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 5,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'LAW-501',
        title: 'ทักษะพื้นฐานด้านการใช้ภาษาราชการ / การฝึกปฏิบัติการจัดการระบบงานสารบรรณอิเล็กทรอนิกส์ (e-Saraban)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '17',
        lecturerName: 'นางสาวสุพิชฌาย์ กลิ่นหอม',
        fileTitle: 'ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ_eSaraban.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 5,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'LAW-502',
        title: 'งานสารบรรณและกฎหมายภาครัฐขั้นสูง / การเขียนหนังสือราชการเชิงวิเคราะห์',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '17',
        lecturerName: 'นางสาวสุพิชฌาย์ กลิ่นหอม',
        fileTitle: 'การเขียนหนังสือราชการเชิงวิเคราะห์และข้อกฎหมายสารบรรณ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 6,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'PER-601',
        title: 'การปรับตัวและสร้างสัมพันธภาพในการทำงานมืออาชีพ (ADV) / พัฒนาบุคลิกภาพและการสื่อสาร (FND)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '13',
        lecturerName: 'อาจารย์ณัฐฐิณี คงไกรฤกษ์ / ดร.สุกฤตา ปรีชาว่อง / อาจารย์จารุณี ทองอร่าม / ผศ.ชุติมา กลั่นไพฑูรย์',
        fileTitle: 'การปรับตัวและการสร้างสัมพันธภาพในการทำงาน.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 6,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'PER-602',
        title: 'เทคนิคการสื่อสารและการทำงานร่วมกับผู้อื่นในองค์กรภาครัฐ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '07',
        lecturerName: 'ดร.สุกฤตา ปรีชาว่อง / อาจารย์จารุณี ทองอร่าม',
        fileTitle: 'เทคนิคการสื่อสารองค์กรภาครัฐ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 7,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'ADM-701',
        title: 'การจัดการกระบวนการทำงานและผลิตภาพภาครัฐ (ADV) / บริหารงานสำนักงานและสารบรรณ (FND)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '16',
        lecturerName: 'รศ.ดร.เรือโท ทวีศักดิ์ รูปสิงห์ / รศ.ดร.ปรัชญา ชุ่มนาเสียว / นางสาวอริสรา ขุนพิทักษ์',
        fileTitle: 'การจัดการกระบวนการทำงานและผลิตภาพภาครัฐ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 7,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'ADM-702',
        title: 'การบริหารจัดการองค์กรภาครัฐสู่ความเป็นเลิศ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '16',
        lecturerName: 'รศ.ดร.เรือโท ทวีศักดิ์ รูปสิงห์ / รศ.ดร.ปรัชญา ชุ่มนาเสียว',
        fileTitle: 'การบริหารจัดการองค์กรภาครัฐสู่ความเป็นเลิศ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 8,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'LEA-801',
        title: 'การพัฒนาภาวะผู้นำและการทำงานเป็นทีมในองค์กรภาครัฐ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '02',
        lecturerName: 'รศ.ดร.ทวีศักดิ์ กฤษเจริญ / ดร.สุกฤตา ปรีชาว่อง',
        fileTitle: 'การพัฒนาภาวะผู้นำและการทำงานเป็นทีม.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 8,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'LEA-802',
        title: 'การบริหารจัดการสำนักงานอัจฉริยะ และการฝึกอบรมงานสารบรรณสำหรับคนพิการ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '02',
        lecturerName: 'รศ.ดร.ทวีศักดิ์ กฤษเจริญ',
        fileTitle: 'การบริหารจัดการสำนักงานอัจฉริยะ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 9,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'DAT-901',
        title: 'การจัดการข้อมูลและเทคโนโลยีดิจิทัลขั้นสูง & จิตวิทยาการทำงาน (ADV) / การสื่อสารเชิงสร้างสรรค์ (FND)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '07',
        lecturerName: 'ผศ.ดร.สุปรียส์ กาญจนพิศศาล / ดร.สุกฤตา ปรีชาว่อง / นายวิศรุต เสรีนิราช / นางสาวนันทพร มากมูล',
        fileTitle: 'การจัดการข้อมูลและเทคโนโลยีดิจิทัลขั้นสูง.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 9,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'DAT-902',
        title: 'การประยุกต์ใช้จิตวิทยาและการสื่อสารในการปฏิบัติงานราชการ',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '07',
        lecturerName: 'ดร.สุกฤตา ปรีชาว่อง / รศ.ดร.วันชัย ปานจันทร์',
        fileTitle: 'จิตวิทยาการทำงานราชการ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 10,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'DBA-1001',
        title: '4.4 การบริหารจัดการฐานข้อมูลและสถาปัตยกรรมข้อมูลภาครัฐ',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '01',
        lecturerName: 'ผศ.ดร.สุธิวัชร ศุภลักษณ์ / ดร.ชณทัต บุญชูวงศ์',
        fileTitle: 'การบริหารจัดการฐานข้อมูลและสถาปัตยกรรมข้อมูลภาครัฐ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 10,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'DBA-1002',
        title: '4.5 การวิเคราะห์ข้อมูลเพื่อปรับปรุงงานบริการ (Data Analytics for Service Improvement)',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '01',
        lecturerName: 'ผศ.ดร.สุธิวัชร ศุภลักษณ์ / ดร.ชณทัต บุญชูวงศ์',
        fileTitle: 'Data_Analytics_Service_Improvement.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 11,
        session: 'MORNING',
        timeLabel: '09.00 - 12.00 น.',
        subjectCode: 'AUT-1101',
        title: '5.2 การประยุกต์ใช้เทคโนโลยีอัตโนมัติและ AI ในงานธุรการ',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '01',
        lecturerName: 'ผศ.ดร.สุธิวัชร ศุภลักษณ์ / ดร.ชณทัต บุญชูวงศ์',
        fileTitle: 'การประยุกต์ใช้เทคโนโลยีอัตโนมัติและAIในงานธุรการ.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 11,
        session: 'AFTERNOON',
        timeLabel: '13.00 - 16.00 น.',
        subjectCode: 'LAW-1102',
        title: '5.3 งานสารบรรณและการเขียนเชิงวิเคราะห์ขั้นสูง',
        track: 'ADV',
        trackLabel: 'หลักสูตรขั้นสูง (Advanced)',
        lecturerId: '17',
        lecturerName: 'นางสาวสุพิชฌาย์ กลิ่นหอม',
        fileTitle: 'งานสารบรรณและการเขียนเชิงวิเคราะห์ขั้นสูง.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 12,
        session: 'ALL_DAY',
        timeLabel: '09.00 - 16.00 น.',
        subjectCode: 'TST-1201',
        title: 'การเตรียมความพร้อมและการทดสอบประเมินผลหลังการอบรม (Post-Test)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '02',
        lecturerName: 'คณะทำงานโครงการ / BDI / พก.',
        fileTitle: 'แบบทดสอบ_Post_Test_ประจำหลักสูตร.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    },
    {
        day: 13,
        session: 'ALL_DAY',
        timeLabel: '09.00 - 16.00 น.',
        subjectCode: 'CLS-1301',
        title: 'พิธีปิดการฝึกอบรมภาคทฤษฎี และปฐมนิเทศการฝึกปฏิบัติงานจริง (OJT 90 ชม.)',
        track: 'BOTH',
        trackLabel: 'รวมทุกสาย (ADV & FND)',
        lecturerId: '02',
        lecturerName: 'ผู้บริหารกระทรวง พม. / BDI / คณะวิทยากร',
        fileTitle: 'คู่มือการฝึกปฏิบัติงานจริง_OJT_Guide.pdf',
        fileDriveUrl: 'https://drive.google.com/drive/folders/1NKpmB-N9p4tTS4g72aLKhsC9lGPSEK7h',
        status: 'VERIFIED',
        statusLabel: 'ยืนยันจากไฟล์'
    }
];`;

// Regex replace masterLecturersList
const startLecturersMarker = 'const masterLecturersList = [';
const endLecturersMarker = 'const masterCourseMatrixTraceability = [';
const endMatrixMarker = 'let currentMatrixTrackFilter = \'ALL\';';

const startIndex = code.indexOf(startLecturersMarker);
const middleIndex = code.indexOf(endLecturersMarker);
const endIndex = code.indexOf(endMatrixMarker);

if (startIndex === -1 || middleIndex === -1 || endIndex === -1) {
    console.error('Markers not found!');
    process.exit(1);
}

const newCode = code.slice(0, startIndex) +
    verifiedLecturers + '\n\n' +
    verifiedMatrix + '\n\n' +
    code.slice(endIndex);

fs.writeFileSync(appJsPath, newCode, 'utf8');
console.log('Successfully updated app.js with verified matrix and lecturers!');
