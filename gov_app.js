/**
 * GOVERNMENT PROJECT MANAGEMENT SYSTEM - INTERACTIVE PROTOTYPE ENGINE
 * Supports 3 Distinct Presentation Paradigms:
 * - Style A: Government Classic (Top Nav, Document-Centric, Formal Sarabun)
 * - Style B: Modern Command Center (Sidebar, KPI Dashboard, Workflow Pipeline)
 * - Style C: Accessible Guided Flow (Step Wizard, Big Typography, High Contrast)
 */

(function () {
  'use strict';

  // --- Initial Mock Data State ---
  const INITIAL_PROJECT_DATA = {
    code: "PRJ-2569-[รอกรอก]",
    title: "โครงการยกระดับทักษะดิจิทัลและการประยุกต์ใช้ปัญญาประดิษฐ์เพื่อการบริการประชาชน",
    agency: "[ชื่อหน่วยงานภาครัฐ]",
    department: "[กลุ่มงานพัฒนาระบบเทคโนโลยีสารสนเทศ]",
    fiscalYear: "2569",
    budget: 2500000,
    budgetFormatted: "2,500,000.00 บาท",
    status: "DRAFT", // DRAFT, AI_DRAFT, IN_REVIEW, REVISION_REQUIRED, PENDING_APPROVAL, APPROVED
    revisionNote: "",
    proposal: {
      background: "เนื่องจากปัจจุบันการให้บริการประชาชนมีความจำเป็นต้องปรับตัวสู่ระบบดิจิทัล เพื่อลดขั้นตอนและเพิ่มความรวดเร็ว จึงมีความจำเป็นต้องพัฒนาทักษะบุคลากรในด้านปัญญาประดิษฐ์และการจัดการข้อมูลภาครัฐตามหลักธรรมาภิบาล",
      objectives: [
        "1. เพื่อพัฒนาทักษะด้าน AI และ Data Analytics แก่บุคลากรจำนวน 500 คน",
        "2. เพื่อสร้างต้นแบบนวัตกรรมการบริการประชาชนอัจฉริยะไม่น้อยกว่า 10 ต้นแบบ",
        "3. เพื่อยกระดับความพึงพอใจในการรับบริการของประชาชนไม่น้อยกว่าร้อยละ 85"
      ],
      targetGroup: "ข้าราชการและเจ้าหน้าที่ผู้ปฏิบัติงานด้านบริการประชาชน และประชาชนกลุ่มเป้าหมาย",
      expectedOutcome: "กระบวนการบริการประชาชนลดระยะเวลาดำเนินการลงร้อยละ 40 และบุคลากรมีสมรรถนะดิจิทัลตามมาตรฐานสากล"
    },
    memo: {
      docNumber: "ที่ [รอกรอก]/[กท.xxxx/xxxx]",
      docDate: "[วันที่รอกรอก]",
      subject: "ขออนุมัติดำเนินโครงการยกระดับทักษะดิจิทัลและการประยุกต์ใช้ปัญญาประดิษฐ์เพื่อการบริการประชาชน ประจำปีงบประมาณ พ.ศ. 2569",
      to: "เรียน [หัวหน้าส่วนราชการ/ผู้มีอำนาจอนุมัติ]",
      para1: "ด้วย [ชื่อหน่วยงานภาครัฐ] มีความประสงค์จะดำเนินโครงการยกระดับทักษะดิจิทัลและการประยุกต์ใช้ปัญญาประดิษฐ์เพื่อการบริการประชาชน เพื่อส่งเสริมให้บุคลากรและเจ้าหน้าที่สามารถประยุกต์ใช้เทคโนโลยีสมัยใหม่ในการให้บริการประชาชนได้อย่างมีประสิทธิภาพและรวดเร็ว ตามแผนยุทธศาสตร์การพัฒนาองค์กรสู่องค์กรดิจิทัล",
      para2: "ในการนี้ [กลุ่มงานพัฒนาระบบเทคโนโลยีสารสนเทศ] ได้จัดทำรายละเอียดโครงการ แบบเสนอขออนุมัติ แผนวิเคราะห์ข้อมูล และกำหนดการฝึกอบรมเรียบร้อยแล้ว โดยมีวงเงินงบประมาณดำเนินการรวมทั้งสิ้น [2,500,000.00] บาท (สองล้านห้าแสนบาทถ้วน) ตามเอกสารแนบ",
      para3: "จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบโปรดอนุมัติให้ดำเนินโครงการและลงนามในเอกสารที่แนบมาพร้อมนี้"
    },
    pressRelease: {
      headline: "[ชื่อหน่วยงานภาครัฐ] เปิดตัวโครงการนำร่องยกระดับทักษะดิจิทัล มุ่งสู่การบริการภาครัฐที่เข้าถึงง่ายและโปร่งใส",
      subtitle: "ก้าวสำคัญสู่นวัตกรรมบริการประชาชนยุคดิจิทัล เสริมแกร่งบุคลากรด้วยทักษะ AI และ Data Analytics",
      body: "[ชื่อหน่วยงานภาครัฐ] ประกาศเปิดตัว 'โครงการยกระดับทักษะดิจิทัลและการประยุกต์ใช้ปัญญาประดิษฐ์เพื่อการบริการประชาชน' ประจำปีงบประมาณ พ.ศ. 2569 มุ่งเน้นการเสริมสร้างทักษะจริงแก่บุคลากรในการประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์อย่างมีธรรมาภิบาล ปลอดภัย และสอดคล้องกับ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
      channels: ["เว็บไซต์ทางการ", "LINE Official Account", "บอร์ดข่าวสารดิจิทัล", "จดหมายข่าวอิเล็กทรอนิกส์"]
    }
  };

  // --- App State ---
  let appState = {
    currentStyle: 'style-a', // 'style-a', 'style-b', 'style-c'
    currentModule: 'dashboard',
    currentSlideIndex: 0,
    deviceView: 'responsive', // 'responsive', 'desktop', 'tablet'
    fontSize: 'md', // 'sm', 'md', 'lg', 'xl'
    highContrast: false,
    isGeneratingAI: false,
    project: JSON.parse(JSON.stringify(INITIAL_PROJECT_DATA)),
    auditLogs: [
      {
        version: "v1.0",
        timestamp: "2569-08-14 09:30:00",
        actor: "เจ้าหน้าที่วิเคราะห์นโยบายและแผน (ตำแหน่งสมมติ)",
        action: "สร้างร่างโครงการเริ่มต้น",
        status: "DRAFT",
        detail: "กรอกข้อมูลพื้นฐาน วงเงินงบประมาณ 2,500,000 บาท"
      }
    ]
  };

  // Module Definition Registry
  const MODULES = [
    { id: 'dashboard', name: 'Dashboard ภาพรวม', icon: 'fa-chart-pie', category: 'overview' },
    { id: 'projects', name: 'ทะเบียนและสร้างโครงการ', icon: 'fa-folder-plus', category: 'overview' },
    { id: 'proposal', name: 'ร่างโครงการ (Proposal)', icon: 'fa-file-lines', category: 'planning' },
    { id: 'memo', name: 'บันทึกข้อความขออนุมัติ', icon: 'fa-stamp', category: 'planning' },
    { id: 'press', name: 'ข่าวประชาสัมพันธ์ (PR)', icon: 'fa-bullhorn', category: 'publicity' },
    { id: 'visual', name: 'แนวคิดภาพ & Infographic', icon: 'fa-palette', category: 'publicity' },
    { id: 'form', name: 'แบบฟอร์มลงทะเบียน', icon: 'fa-clipboard-list', category: 'engagement' },
    { id: 'survey', name: 'แบบประเมินความพึงพอใจ', icon: 'fa-star-half-stroke', category: 'engagement' },
    { id: 'analytics', name: 'แผนวิเคราะห์ข้อมูล', icon: 'fa-network-wired', category: 'analytics' },
    { id: 'charts', name: 'กราฟ & สรุปผู้บริหาร', icon: 'fa-chart-simple', category: 'analytics' },
    { id: 'presentation', name: 'Presentation 5 สไลด์', icon: 'fa-person-chalkboard', category: 'presentation' },
    { id: 'video', name: 'Script วิดีโอ 30 วินาที', icon: 'fa-film', category: 'presentation' },
    { id: 'a11y', name: 'Accessibility Checklist', icon: 'fa-universal-access', category: 'governance' },
    { id: 'pdpa', name: 'PDPA & จริยธรรม AI', icon: 'fa-shield-halved', category: 'governance' },
    { id: 'review', name: 'หน้าตรวจเอกสารและอนุมัติ', icon: 'fa-signature', category: 'workflow' },
    { id: 'audit', name: 'Audit Log และประวัติรุ่น', icon: 'fa-clock-rotate-left', category: 'workflow' }
  ];

  // Presentation Slide Deck Mock
  const SLIDES = [
    {
      no: 1,
      title: "โครงการยกระดับทักษะดิจิทัลและ AI ภาครัฐ",
      subtitle: "ประจำปีงบประมาณ พ.ศ. 2569",
      body: "แบบเสนอขออนุมัติโครงการเพื่อการบริการประชาชนที่สะดวก รวดเร็ว และเข้าถึงได้ทุกคน\n\n[ชื่อหน่วยงานภาครัฐ]\n[กลุ่มงานพัฒนาระบบเทคโนโลยีสารสนเทศ]",
      notes: "ผู้บรรยายกล่าวทักทายคณะกรรมการ ชี้แจงที่มาและวัตถุประสงค์หลักใน 1 นาที"
    },
    {
      no: 2,
      title: "หลักการ เหตุผล และ Pain Points",
      subtitle: "ทำไมต้องยกระดับทักษะบุคลากรด้วย AI?",
      body: "• ขั้นตอนการบริการแบบเดิมใช้เวลาเฉลี่ย 3-5 วันต่อคำขอ\n• ความต้องการบริการดิจิทัลของประชาชนเพิ่มขึ้นอย่างต่อเนื่อง\n• การประยุกต์ใช้ AI ภายใต้การควบคุมของมนุษย์ (Human-in-the-loop) ช่วยลดภาระงานซ้ำซ้อนลงได้กว่า 40%",
      notes: "เน้นย้ำถึงความคุ้มค่าของการลงทุน และการรักษามาตรฐานความปลอดภัยข้อมูลส่วนบุคคล"
    },
    {
      no: 3,
      title: "แผนกิจกรรมและกระบวนการฝึกอบรม",
      subtitle: "3 ระยะการเรียนรู้เชิงปฏิบัติการ (Action Learning)",
      body: "ระยะที่ 1: การประเมิน Digital Baseline & AI Literacy (10 ชม.)\nระยะที่ 2: Hands-on Workshop พัฒนาต้นแบบบริการจริง (30 ชม.)\nระยะที่ 3: Hackathon & Sandbox นำร่องบริการประชาชน 10 โครงการ (20 ชม.)",
      notes: "ชี้แจงความพร้อมของหลักสูตรและวิทยากรผู้ทรงคุณวุฒิ"
    },
    {
      no: 4,
      title: "กรอบงบประมาณและแผนเวลา",
      subtitle: "งบประมาณรวม 2,500,000.00 บาท",
      body: "• ไตรมาส 1: เตรียมการ ออกแบบหลักสูตร และเปิดรับสมัคร (500,000 บาท)\n• ไตรมาส 2-3: ดำเนินการฝึกอบรมและพัฒนา Sandbox (1,500,000 บาท)\n• ไตรมาส 4: ประเมินผลสัมฤทธิ์ ขยายผล และรายงานผู้บริหาร (500,000 บาท)",
      notes: "ยืนยันความโปร่งใสตามระเบียบการจัดซื้อจัดจ้างภาครัฐ"
    },
    {
      no: 5,
      title: "ผลสัมฤทธิ์และข้อเสนอเพื่อโปรดพิจารณา",
      subtitle: "ผลลัพธ์ที่จับต้องได้เพื่อประชาชน",
      body: "1. บุคลากร 500 คนมีทักษะพร้อมใช้งานจริง\n2. ประชาชนได้รับบริการรวดเร็วขึ้น 40%\n3. ผ่านเกณฑ์มาตรฐานการเข้าถึง WCAG 2.1 AA\n\nจึงเรียนมาเพื่อโปรดพิจารณาอนุมัติโครงการ",
      notes: "เปิดโอกาสให้คณะกรรมการซักถามและลงนามอนุมัติ"
    }
  ];

  // Helper: Format Status Badge
  function getStatusBadge(status) {
    const map = {
      'DRAFT': { text: 'ร่างเอกสาร (DRAFT)', class: 'status-draft' },
      'AI_DRAFT': { text: 'AI ช่วยร่าง (AI_DRAFT)', class: 'status-ai_draft' },
      'IN_REVIEW': { text: 'อยู่ระหว่างตรวจ (IN_REVIEW)', class: 'status-in_review' },
      'REVISION_REQUIRED': { text: 'ส่งกลับแก้ไข (REVISION_REQUIRED)', class: 'status-revision_required' },
      'PENDING_APPROVAL': { text: 'รออนุมัติ (PENDING_APPROVAL)', class: 'status-pending_approval' },
      'APPROVED': { text: 'อนุมัติแล้ว (APPROVED)', class: 'status-approved' }
    };
    const s = map[status] || { text: status, class: 'status-draft' };
    return `<span class="status-pill ${s.class}">${s.text}</span>`;
  }

  // --- Main Render Dispatcher ---
  function renderApp() {
    const root = document.getElementById('prototype-app-root');
    if (!root) return;

    // Apply class to body for font size & high contrast
    document.body.className = `${appState.currentStyle} font-${appState.fontSize} ${appState.highContrast ? 'high-contrast' : ''}`;
    
    // Set simulator container mode
    const container = document.getElementById('viewport-simulator');
    if (container) {
      container.className = `viewport-simulator-container mode-${appState.deviceView}`;
    }

    let innerHtml = '';
    if (appState.currentStyle === 'style-a') {
      innerHtml = renderStyleA();
    } else if (appState.currentStyle === 'style-b') {
      innerHtml = renderStyleB();
    } else if (appState.currentStyle === 'style-c') {
      innerHtml = renderStyleC();
    }

    root.innerHTML = innerHtml;
    attachEventListeners();
  }

  // ==========================================================================
  // STYLE A: GOVERNMENT CLASSIC RENDERER
  // ==========================================================================
  function renderStyleA() {
    return `
      <div class="theme-style-a app-frame">
        <!-- Top Official Header -->
        <header class="app-header">
          <div class="header-container">
            <div class="agency-brand">
              <div class="emblem-box" title="ตราสัญลักษณ์ทางการ">[ตราหน่วยงาน]</div>
              <div>
                <h1 class="brand-title">ระบบสารบรรณและบริหารโครงการภาครัฐอิเล็กทรอนิกส์</h1>
                <p class="brand-subtitle">${appState.project.agency} | กลุ่มงานพัฒนาระบบเทคโนโลยีสารสนเทศ</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              ${getStatusBadge(appState.project.status)}
              <button class="btn-secondary" style="background:white; color:#1E3A5F; font-size:12px; padding:6px 12px;" onclick="window.govApp.quickExport('A')">
                <i class="fa-solid fa-print"></i> พิมพ์แบบราชการ
              </button>
            </div>
          </div>
        </header>

        <!-- Top Navigation Bar -->
        <nav class="top-nav-bar" aria-label="เมนูหลักราชการ">
          <ul class="nav-list">
            ${MODULES.map(m => `
              <li>
                <button class="nav-item-btn ${appState.currentModule === m.id ? 'active' : ''}" 
                        onclick="window.govApp.switchModule('${m.id}')">
                  <i class="fa-solid ${m.icon}"></i>
                  <span>${m.name}</span>
                </button>
              </li>
            `).join('')}
          </ul>
        </nav>

        <!-- Main Content Area (Document Centric Sheet) -->
        <main class="main-content-layout" id="main-content">
          ${renderCurrentModuleContent()}
        </main>
      </div>
    `;
  }

  // ==========================================================================
  // STYLE B: MODERN COMMAND CENTER RENDERER
  // ==========================================================================
  function renderStyleB() {
    return `
      <div class="theme-style-b app-frame">
        <div class="app-body-container">
          <!-- Sidebar Navigation -->
          <aside class="sidebar-nav" aria-label="แถบควบคุมคำสั่ง">
            <div class="sidebar-header">
              <div class="sidebar-logo"><i class="fa-solid fa-gauge-high"></i></div>
              <div>
                <div style="font-weight:700; font-size:15px; color:white;">GovCommand OS</div>
                <div style="font-size:11px; color:#94A3B8;">ศูนย์บริหารโครงการดิจิทัล</div>
              </div>
            </div>
            
            <ul class="sidebar-menu">
              <li class="menu-category-label">ภาพรวม & บริหาร</li>
              ${MODULES.filter(m => m.category === 'overview').map(m => renderSidebarItem(m)).join('')}

              <li class="menu-category-label">เอกสาร & วางแผน</li>
              ${MODULES.filter(m => m.category === 'planning').map(m => renderSidebarItem(m)).join('')}

              <li class="menu-category-label">สื่อสาร & การมีส่วนร่วม</li>
              ${MODULES.filter(m => m.category === 'publicity' || m.category === 'engagement').map(m => renderSidebarItem(m)).join('')}

              <li class="menu-category-label">วิเคราะห์ & นำเสนอ</li>
              ${MODULES.filter(m => m.category === 'analytics' || m.category === 'presentation').map(m => renderSidebarItem(m)).join('')}

              <li class="menu-category-label">ธรรมาภิบาล & Workflow</li>
              ${MODULES.filter(m => m.category === 'governance' || m.category === 'workflow').map(m => renderSidebarItem(m)).join('')}
            </ul>

            <div style="padding:16px; border-top:1px solid rgba(255,255,255,0.1); font-size:12px; color:#94A3B8;">
              <div>รหัสโครงการ: <span style="color:white; font-family:monospace;">${appState.project.code}</span></div>
              <div style="margin-top:4px;">งบประมาณ: <span style="color:#86EFAC; font-weight:bold;">${appState.project.budgetFormatted}</span></div>
            </div>
          </aside>

          <!-- Main View Area -->
          <div class="main-view-area">
            <!-- Command Topbar -->
            <header class="command-topbar">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-weight:700; color:#1B365D; font-size:16px;">
                  <i class="fa-solid fa-folder-open"></i> ${appState.project.title}
                </span>
              </div>
              <div style="display:flex; align-items:center; gap:12px;">
                ${getStatusBadge(appState.project.status)}
                <button class="btn-primary" style="font-size:13px; padding:6px 14px;" onclick="window.govApp.switchModule('review')">
                  <i class="fa-solid fa-signature"></i> สเตชันตรวจอนุมัติ
                </button>
              </div>
            </header>

            <!-- Command Center Content -->
            <main class="command-content" id="main-content">
              <!-- Workflow Pipeline Tracker Bar -->
              <div class="workflow-pipeline">
                <div class="pipeline-step ${['DRAFT', 'AI_DRAFT', 'IN_REVIEW', 'REVISION_REQUIRED', 'PENDING_APPROVAL', 'APPROVED'].includes(appState.project.status) ? 'done' : ''}">
                  <i class="fa-solid fa-pencil"></i> 1. ร่างโครงการ
                </div>
                <div class="pipeline-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                <div class="pipeline-step ${appState.project.status === 'AI_DRAFT' ? 'active' : (['IN_REVIEW', 'REVISION_REQUIRED', 'PENDING_APPROVAL', 'APPROVED'].includes(appState.project.status) ? 'done' : '')}">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> 2. AI Assist Draft
                </div>
                <div class="pipeline-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                <div class="pipeline-step ${appState.project.status === 'IN_REVIEW' ? 'active' : (['PENDING_APPROVAL', 'APPROVED'].includes(appState.project.status) ? 'done' : '')}">
                  <i class="fa-solid fa-user-check"></i> 3. ตรวจสอบเนื้อหา
                </div>
                <div class="pipeline-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                <div class="pipeline-step ${appState.project.status === 'PENDING_APPROVAL' ? 'active' : (appState.project.status === 'APPROVED' ? 'done' : '')}">
                  <i class="fa-solid fa-signature"></i> 4. รอผู้บริหารอนุมัติ
                </div>
                <div class="pipeline-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                <div class="pipeline-step ${appState.project.status === 'APPROVED' ? 'done' : ''}">
                  <i class="fa-solid fa-stamp"></i> 5. อนุมัติและล็อกฉบับจริง
                </div>
              </div>

              ${renderCurrentModuleContent()}
            </main>
          </div>
        </div>
      </div>
    `;
  }

  function renderSidebarItem(module) {
    const isActive = appState.currentModule === module.id;
    return `
      <li>
        <button class="sidebar-btn ${isActive ? 'active' : ''}" onclick="window.govApp.switchModule('${module.id}')">
          <div class="sidebar-btn-left">
            <i class="fa-solid ${module.icon}" style="width:18px; text-align:center;"></i>
            <span>${module.name}</span>
          </div>
          ${module.id === 'review' && appState.project.status === 'IN_REVIEW' ? '<span class="badge-count" style="background:#E11D48;">1</span>' : ''}
        </button>
      </li>
    `;
  }

  // ==========================================================================
  // STYLE C: ACCESSIBLE GUIDED FLOW RENDERER
  // ==========================================================================
  function renderStyleC() {
    // 6-step Guided Flow mapping
    const steps = [
      { num: 1, title: 'ภาพรวม & ทะเบียน', target: 'dashboard', icon: 'fa-house' },
      { num: 2, title: 'ร่างข้อเสนอ & บันทึก', target: 'proposal', icon: 'fa-file-signature' },
      { num: 3, title: 'สื่อประชาสัมพันธ์ & ฟอร์ม', target: 'press', icon: 'fa-bullhorn' },
      { num: 4, title: 'วิเคราะห์ & พรีเซนต์', target: 'analytics', icon: 'fa-chart-line' },
      { num: 5, title: 'เกณฑ์ความเข้าถึง & PDPA', target: 'a11y', icon: 'fa-universal-access' },
      { num: 6, title: 'ตรวจทาน & อนุมัติ', target: 'review', icon: 'fa-check-double' }
    ];

    return `
      <div class="theme-style-c app-frame">
        <!-- High Legibility Header -->
        <header class="guided-header">
          <div class="guided-header-content">
            <div>
              <div style="font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#FDE047; font-weight:700;">
                คู่มือนำทางระบบราชการดิจิทัลเพื่อทุกคน (Universal Accessible Flow)
              </div>
              <h1 style="font-size:26px; font-weight:800; margin-top:4px;">
                ระบบบริหารโครงการภาครัฐ - แบบทีละขั้นตอน
              </h1>
            </div>
            <div>
              ${getStatusBadge(appState.project.status)}
            </div>
          </div>
        </header>

        <!-- Step-by-Step Wizard Bar -->
        <div class="wizard-progress-bar" role="navigation" aria-label="แถบขั้นตอนการทำงาน">
          <div class="wizard-steps-wrapper">
            ${steps.map(s => {
              const isCurrent = appState.currentModule === s.target || 
                (s.num === 1 && (appState.currentModule === 'dashboard' || appState.currentModule === 'projects')) ||
                (s.num === 2 && (appState.currentModule === 'proposal' || appState.currentModule === 'memo')) ||
                (s.num === 3 && (appState.currentModule === 'press' || appState.currentModule === 'visual' || appState.currentModule === 'form' || appState.currentModule === 'survey')) ||
                (s.num === 4 && (appState.currentModule === 'analytics' || appState.currentModule === 'charts' || appState.currentModule === 'presentation' || appState.currentModule === 'video')) ||
                (s.num === 5 && (appState.currentModule === 'a11y' || appState.currentModule === 'pdpa')) ||
                (s.num === 6 && (appState.currentModule === 'review' || appState.currentModule === 'audit'));

              return `
                <button class="wizard-step-btn ${isCurrent ? 'active' : ''}" 
                        onclick="window.govApp.switchModule('${s.target}')"
                        aria-current="${isCurrent ? 'step' : 'false'}">
                  <div class="step-num-bubble">${s.num}</div>
                  <div>
                    <div style="font-size:12px; color:#64748B; font-weight:600;">ขั้นตอนที่ ${s.num}</div>
                    <div style="font-size:15px; font-weight:700; color:#0F172A;">${s.title}</div>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Guided Content Area -->
        <main class="guided-main-container" id="main-content">
          <!-- Guidance Hint Banner -->
          <div class="guidance-callout" role="note">
            <i class="fa-solid fa-circle-info" style="font-size:24px; margin-top:2px;"></i>
            <div>
              <strong>คำแนะนำสำหรับผู้ใช้งาน:</strong> 
              คุณกำลังอยู่ที่โมดูล <u>${MODULES.find(m => m.id === appState.currentModule)?.name}</u> 
              สามารถกดปุ่ม "ให้ AI ช่วยร่าง" เพื่อเติมข้อมูลอัตโนมัติ หรือเลือกกดปุ่มด้านล่างเพื่อไปยังขั้นตอนถัดไป
            </div>
          </div>

          <!-- Direct Submenu Quick Switcher for Accessibility -->
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
            ${MODULES.map(m => `
              <button class="ctrl-btn ${appState.currentModule === m.id ? 'active' : ''}" 
                      style="font-size:14px; padding:6px 12px; border-radius:6px;"
                      onclick="window.govApp.switchModule('${m.id}')">
                <i class="fa-solid ${m.icon}"></i> ${m.name}
              </button>
            `).join('')}
          </div>

          <div class="guided-card">
            ${renderCurrentModuleContent()}
          </div>
        </main>
      </div>
    `;
  }

  // ==========================================================================
  // MODULE CONTENT RENDERERS (16 SCREENS / 12 CORE MODULES)
  // ==========================================================================
  function renderCurrentModuleContent() {
    switch (appState.currentModule) {
      case 'dashboard': return renderDashboard();
      case 'projects': return renderProjects();
      case 'proposal': return renderProposal();
      case 'memo': return renderMemo();
      case 'press': return renderPressRelease();
      case 'visual': return renderVisualConcept();
      case 'form': return renderRegistrationForm();
      case 'survey': return renderSatisfactionSurvey();
      case 'analytics': return renderAnalyticsPlan();
      case 'charts': return renderChartsAndSummary();
      case 'presentation': return renderPresentationDeck();
      case 'video': return renderVideoScript();
      case 'a11y': return renderAccessibilityChecklist();
      case 'pdpa': return renderPdpaAiEthics();
      case 'review': return renderReviewAndApproval();
      case 'audit': return renderAuditLog();
      default: return renderDashboard();
    }
  }

  // 1. Dashboard Module
  function renderDashboard() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-chart-pie" style="color:#2563EB;"></i> ศูนย์รวมข้อมูลภาพรวมโครงการ (Project Dashboard)</h2>
            <p>ติดตามสถานะคำขออนุมัติ วงเงินงบประมาณ และระดับความเสี่ยงของโครงการภาครัฐ</p>
          </div>
          <div class="actions-row">
            <button class="btn-primary" onclick="window.govApp.switchModule('proposal')">
              <i class="fa-solid fa-file-pen"></i> แก้ไขร่างโครงการ
            </button>
            <button class="btn-ai" onclick="window.govApp.triggerAIDraft()">
              <i class="fa-solid fa-wand-magic-sparkles"></i> ให้ AI ช่วยประมวลผล
            </button>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-label">งบประมาณรวมทั้งสิ้น</div>
              <div class="kpi-icon-badge" style="background:#EFF6FF; color:#2563EB;"><i class="fa-solid fa-baht-sign"></i></div>
            </div>
            <div class="kpi-value">${appState.project.budgetFormatted}</div>
            <div style="font-size:12px; color:#10B981; margin-top:6px;"><i class="fa-solid fa-circle-check"></i> จัดสรรครบ 100% ประจำปี 2569</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-label">สถานะเอกสารปัจจุบัน</div>
              <div class="kpi-icon-badge" style="background:#FEF3C7; color:#D97706;"><i class="fa-solid fa-file-signature"></i></div>
            </div>
            <div style="margin:6px 0;">${getStatusBadge(appState.project.status)}</div>
            <div style="font-size:12px; color:#64748B;">ผู้จัดทำ: ${appState.project.creator || 'เจ้าหน้าที่ (สมมติ)'}</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-label">กลุ่มเป้าหมายผู้เข้าร่วม</div>
              <div class="kpi-icon-badge" style="background:#ECFDF5; color:#10B981;"><i class="fa-solid fa-users"></i></div>
            </div>
            <div class="kpi-value">500 <span style="font-size:16px; font-weight:normal; color:#64748B;">คน</span></div>
            <div style="font-size:12px; color:#64748B; margin-top:6px;">เป้าหมายความพึงพอใจ: >= 85%</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-label">ความเสี่ยงโครงการ (Risk Index)</div>
              <div class="kpi-icon-badge" style="background:#FEE2E2; color:#DC2626;"><i class="fa-solid fa-triangle-exclamation"></i></div>
            </div>
            <div class="kpi-value" style="color:#16A34A;">ต่ำ (Low)</div>
            <div style="font-size:12px; color:#64748B; margin-top:6px;">มาตรการควบคุมความเสี่ยง: พร้อม 100%</div>
          </div>
        </div>

        <!-- Split View: Overview Chart & Action Items -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
          <div class="card-base">
            <h3 style="font-size:16px; font-weight:700; margin-bottom:14px; color:#1E293B;">
              <i class="fa-solid fa-chart-column" style="color:#2563EB;"></i> แผนการจัดสรรงบประมาณรายกิจกรรม
            </h3>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
                  <span>1. จัดอบรมเชิงปฏิบัติการ (Workshop 60 ชม.)</span>
                  <span style="font-weight:700;">1,200,000 บาท (48%)</span>
                </div>
                <div style="background:#E2E8F0; border-radius:4px; height:8px; overflow:hidden;">
                  <div style="background:#2563EB; width:48%; height:100%;"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
                  <span>2. พัฒนาต้นแบบนวัตกรรม Sandbox (10 ต้นแบบ)</span>
                  <span style="font-weight:700;">800,000 บาท (32%)</span>
                </div>
                <div style="background:#E2E8F0; border-radius:4px; height:8px; overflow:hidden;">
                  <div style="background:#10B981; width:32%; height:100%;"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
                  <span>3. ประเมินผล วัดสมรรถนะ และเผยแพร่</span>
                  <span style="font-weight:700;">500,000 บาท (20%)</span>
                </div>
                <div style="background:#E2E8F0; border-radius:4px; height:8px; overflow:hidden;">
                  <div style="background:#F59E0B; width:20%; height:100%;"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-base">
            <h3 style="font-size:16px; font-weight:700; margin-bottom:14px; color:#1E293B;">
              <i class="fa-solid fa-shield-check" style="color:#10B981;"></i> แผนภูมิการจัดการความเสี่ยง (Risk Matrix)
            </h3>
            <table class="table-formal" style="margin:0;">
              <thead>
                <tr>
                  <th>ความเสี่ยง</th>
                  <th>ระดับ</th>
                  <th>มาตรการป้องกัน</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ข้อมูลส่วนบุคคลรั่วไหล</td>
                  <td><span style="color:#DC2626; font-weight:700;">สูง</span></td>
                  <td>ใช้ Mockup Data / Anonymization</td>
                </tr>
                <tr>
                  <td>ผู้เรียนไม่ผ่านเกณฑ์วัดผล</td>
                  <td><span style="color:#D97706; font-weight:700;">กลาง</span></td>
                  <td>มีระบบแบบฝึกหัดทบทวนและพี่เลี้ยง</td>
                </tr>
                <tr>
                  <td>งบประมาณเบิกจ่ายล่าช้า</td>
                  <td><span style="color:#16A34A; font-weight:700;">ต่ำ</span></td>
                  <td>กำกับติดตามรายสัปดาห์ตาม Milestone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 2. Project Registry Module
  function renderProjects() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-folder-plus" style="color:#2563EB;"></i> ทะเบียนและสร้างโครงการใหม่ (Project Registry)</h2>
            <p>ระบบบันทึกโครงการ จัดการหมวดหมู่งบประมาณ และเรียกดูสถานะโครงการทั้งหมด</p>
          </div>
          <div class="actions-row">
            <button class="btn-success" onclick="alert('จำลองการเปิดฟอร์มสร้างโครงการใหม่ด้วย Preset สำเร็จ')">
              <i class="fa-solid fa-plus"></i> + สร้างโครงการใหม่ (Preset)
            </button>
          </div>
        </div>

        <div class="card-base">
          <div style="display:flex; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
            <input type="text" class="form-input" style="max-width:320px;" placeholder="🔍 ค้นหาตามชื่อโครงการ / รหัส..." value="ยกระดับทักษะดิจิทัล">
            <select class="form-select" style="max-width:200px;">
              <option>ปีงบประมาณ 2569</option>
              <option>ปีงบประมาณ 2568</option>
            </select>
          </div>

          <table class="table-formal">
            <thead>
              <tr>
                <th>รหัสโครงการ</th>
                <th>ชื่อโครงการ</th>
                <th>หน่วยงาน</th>
                <th>งบประมาณ</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${appState.project.code}</strong></td>
                <td>${appState.project.title}</td>
                <td>${appState.project.agency}</td>
                <td>${appState.project.budgetFormatted}</td>
                <td>${getStatusBadge(appState.project.status)}</td>
                <td>
                  <button class="btn-secondary" style="font-size:12px; padding:4px 8px;" onclick="window.govApp.switchModule('proposal')">
                    <i class="fa-solid fa-eye"></i> เปิดดู
                  </button>
                </td>
              </tr>
              <tr>
                <td><strong>PRJ-2569-[รอกรอก-02]</strong></td>
                <td>โครงการพัฒนาระบบคลาวด์กลางและฐานข้อมูลความปลอดภัยภาครัฐ</td>
                <td>[ชื่อหน่วยงานภาครัฐ]</td>
                <td>5,000,000.00 บาท</td>
                <td>${getStatusBadge('APPROVED')}</td>
                <td>
                  <button class="btn-secondary" style="font-size:12px; padding:4px 8px;" onclick="alert('โครงการนี้ได้รับการอนุมัติเรียบร้อยแล้ว')">
                    <i class="fa-solid fa-lock"></i> ดูฉบับล็อก
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. Project Proposal Module
  function renderProposal() {
    const isLocked = appState.project.status === 'APPROVED';
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-file-lines" style="color:#2563EB;"></i> ร่างแบบเสนอโครงการ (Project Proposal)</h2>
            <p>รายละเอียดสาระสำคัญ วัตถุประสงค์ ตัวชี้วัด และวงเงินงบประมาณ</p>
          </div>
          <div class="actions-row">
            ${!isLocked ? `
              <button class="btn-ai" onclick="window.govApp.triggerAIDraft()">
                <i class="fa-solid fa-wand-magic-sparkles"></i> ให้ AI ช่วยร่างเนื้อหา
              </button>
              <button class="btn-primary" onclick="window.govApp.submitForReview()">
                <i class="fa-solid fa-paper-plane"></i> ส่งให้ผู้ตรวจทาน
              </button>
            ` : ''}
          </div>
        </div>

        ${isLocked ? `
          <div class="locked-banner">
            <i class="fa-solid fa-lock"></i>
            <div>เอกสารนี้ได้รับการอนุมัติแล้ว (APPROVED) และถูกล็อกไม่สามารถแก้ไขเนื้อหาได้</div>
          </div>
        ` : ''}

        <div class="card-base">
          <div class="form-group">
            <label class="form-label">ชื่อโครงการ</label>
            <input type="text" id="prop-title" class="form-input" value="${appState.project.title}" ${isLocked ? 'disabled' : ''}>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">หน่วยงานเจ้าของโครงการ</label>
              <input type="text" class="form-input" value="${appState.project.agency}" ${isLocked ? 'disabled' : ''}>
            </div>
            <div class="form-group">
              <label class="form-label">วงเงินงบประมาณ (บาท)</label>
              <input type="text" class="form-input" value="${appState.project.budgetFormatted}" ${isLocked ? 'disabled' : ''}>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">1. หลักการและเหตุผล</label>
            <textarea id="prop-bg" class="form-textarea" rows="4" ${isLocked ? 'disabled' : ''}>${appState.project.proposal.background}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">2. วัตถุประสงค์โครงการ</label>
            <textarea id="prop-obj" class="form-textarea" rows="4" ${isLocked ? 'disabled' : ''}>${appState.project.proposal.objectives.join('\n')}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">3. ผลสัมฤทธิ์ที่คาดว่าจะได้รับ (Expected Outcomes)</label>
            <textarea id="prop-out" class="form-textarea" rows="3" ${isLocked ? 'disabled' : ''}>${appState.project.proposal.expectedOutcome}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Official Memo Module
  function renderMemo() {
    const isLocked = appState.project.status === 'APPROVED';
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-stamp" style="color:#2563EB;"></i> บันทึกข้อความขออนุมัติโครงการ (Official Memo)</h2>
            <p>โครงสร้างหนังสือราชการภายในตามระเบียบงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติม</p>
          </div>
          <div class="actions-row">
            ${!isLocked ? `
              <button class="btn-ai" onclick="window.govApp.triggerAIDraft()">
                <i class="fa-solid fa-wand-magic-sparkles"></i> AI ปรับสำนวนราชการ
              </button>
              <button class="btn-primary" onclick="window.govApp.submitForReview()">
                <i class="fa-solid fa-paper-plane"></i> ส่งให้ผู้ตรวจทาน
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Official Thai Document Sheet Preview -->
        <div class="official-doc-sheet">
          ${isLocked ? '<div style="position:absolute; right:40px; top:40px;"><span class="official-stamp">อนุมัติแล้ว</span></div>' : ''}
          
          <div class="official-crest-header">
            <div class="crest-icon">[ตราหน่วยงาน]</div>
            <div style="font-size:24px; font-weight:bold; letter-spacing:2px;">บันทึกข้อความ</div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:20px; font-size:15px;">
            <div><strong>ส่วนราชการ:</strong> ${appState.project.department} โทร [รอกรอก]</div>
            <div><strong>ที่:</strong> ${appState.project.memo.docNumber}</div>
            <div><strong>วันที่:</strong> ${appState.project.memo.docDate}</div>
            <div><strong>เรื่อง:</strong> ${appState.project.memo.subject}</div>
          </div>

          <div style="margin-bottom:20px; font-size:15px;">
            <strong>เรียน:</strong> ${appState.project.memo.to}
          </div>

          <div style="display:flex; flex-direction:column; gap:16px; font-size:15px; text-align:justify; line-height:1.8;">
            <p style="text-indent: 2.5cm;">${appState.project.memo.para1}</p>
            <p style="text-indent: 2.5cm;">${appState.project.memo.para2}</p>
            <p style="text-indent: 2.5cm;">${appState.project.memo.para3}</p>
          </div>

          <div style="margin-top:40px; float:right; text-align:center; min-width:240px;">
            <div style="margin-bottom:40px;">(ลงชื่อ)...........................................................</div>
            <div>( [รอกรอกชื่อ-สกุลผู้เสนอ] )</div>
            <div style="color:#64748B; font-size:13px;">เจ้าหน้าที่วิเคราะห์นโยบายและแผน</div>
          </div>
          <div style="clear:both;"></div>
        </div>
      </div>
    `;
  }

  // 5. Press Release Module
  function renderPressRelease() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-bullhorn" style="color:#2563EB;"></i> ข่าวประชาสัมพันธ์โครงการ (Press Release)</h2>
            <p>เนื้อหาข่าวประชาสัมพันธ์สำหรับเผยแพร่สู่สาธารณะและช่องทางดิจิทัล</p>
          </div>
          <div class="actions-row">
            <button class="btn-ai" onclick="window.govApp.triggerAIDraft()">
              <i class="fa-solid fa-wand-magic-sparkles"></i> AI ย่อยเนื้อหาสำหรับ Social Media
            </button>
          </div>
        </div>

        <div class="card-base">
          <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:18px; margin-bottom:20px;">
            <span class="status-pill status-approved" style="margin-bottom:8px;">พร้อมเผยแพร่ (Ready for PR)</span>
            <h3 style="font-size:20px; font-weight:800; color:#1E3A8A; margin-top:6px;">
              ${appState.project.pressRelease.headline}
            </h3>
            <p style="font-size:15px; color:#2563EB; font-weight:600; margin-top:4px;">
              ${appState.project.pressRelease.subtitle}
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">เนื้อหาข่าวฉบับเต็ม (Press Body)</label>
            <textarea class="form-textarea" rows="6">${appState.project.pressRelease.body}</textarea>
          </div>

          <div style="margin-top:20px;">
            <label class="form-label">ช่องทางการเผยแพร่เป้าหมาย</label>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${appState.project.pressRelease.channels.map(c => `
                <span style="background:#F1F5F9; border:1px solid #CBD5E1; padding:6px 12px; border-radius:20px; font-size:13px; font-weight:600;">
                  <i class="fa-solid fa-check" style="color:#10B981;"></i> ${c}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 6. Visual Concept & Infographic Spec Module
  function renderVisualConcept() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-palette" style="color:#2563EB;"></i> แนวคิดภาพและ Infographic Spec (Visual Storyboard)</h2>
            <p>ข้อกำหนด Mood & Tone, การจับคู่สีที่ผ่านมาตรฐาน Contrast และคำสั่ง Prompt จำลอง</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
          <div class="card-base">
            <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">🎨 Color Harmony Palette (WCAG Compliant)</h3>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:40px; height:40px; background:#1B365D; border-radius:6px;"></div>
                <div><strong>#1B365D - Gov Navy</strong><div style="font-size:12px; color:#64748B;">ความมั่นคง โปร่งใส น่าเชื่อถือ (Contrast 12.8:1)</div></div>
              </div>
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:40px; height:40px; background:#2E8B57; border-radius:6px;"></div>
                <div><strong>#2E8B57 - Emerald Green</strong><div style="font-size:12px; color:#64748B;">การพัฒนาอย่างยั่งยืน นวัตกรรม (Contrast 5.4:1)</div></div>
              </div>
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:40px; height:40px; background:#D4AF37; border-radius:6px;"></div>
                <div><strong>#D4AF37 - Gold Accent</strong><div style="font-size:12px; color:#64748B;">จุดเน้นสำคัญ พิธีการและความเป็นเลิศ</div></div>
              </div>
            </div>
          </div>

          <div class="card-base">
            <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">📐 Infographic Layout Architecture</h3>
            <div style="border:2px dashed #94A3B8; border-radius:8px; padding:16px; text-align:center; background:#F8FAFC;">
              <div style="background:#1B365D; color:white; padding:8px; border-radius:4px; font-size:12px; margin-bottom:8px;">ส่วนบน: [ตราหน่วยงาน] + ชื่อโครงการ</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
                <div style="background:#E2E8F0; padding:16px 8px; border-radius:4px; font-size:11px;">1. ปัญหา & ความจำเป็น</div>
                <div style="background:#DCFCE7; padding:16px 8px; border-radius:4px; font-size:11px;">2. นวัตกรรม AI ช่วยงาน</div>
              </div>
              <div style="background:#FEF3C7; padding:8px; border-radius:4px; font-size:11px;">3. สรุปผลสัมฤทธิ์ & QR Code ลงทะเบียน</div>
            </div>
          </div>
        </div>

        <div class="card-base">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:8px;">✨ คำสั่ง Prompt จำลองสำหรับ Generative AI (Prompt Spec)</h3>
          <div style="background:#1E293B; color:#E2E8F0; padding:14px; border-radius:6px; font-family:monospace; font-size:13px; line-height:1.6;">
            "A modern, clean government infographic visual concept in Thai context. Primary deep navy (#1B365D) and subtle emerald green (#2E8B57) accents on pure white background. Minimalist icons representing public digital services, data analytics, and inclusive community participation. High accessibility contrast ratio >= 4.5:1, uncluttered negative space."
          </div>
        </div>
      </div>
    `;
  }

  // 7. Registration Form Builder / Preview
  function renderRegistrationForm() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-clipboard-list" style="color:#2563EB;"></i> แบบฟอร์มลงทะเบียนเข้าร่วมโครงการ (Registration Form)</h2>
            <p>ฟอร์มรับสมัครผู้เข้าร่วมฝึกอบรม พร้อมระบบตรวจสอบเงื่อนไขความยินยอมตาม PDPA</p>
          </div>
        </div>

        <div class="card-base" style="max-width:700px; margin:0 auto;">
          <div style="text-align:center; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid #E2E8F0;">
            <div style="font-size:13px; color:#2563EB; font-weight:700;">[ชื่อหน่วยงานภาครัฐ]</div>
            <h3 style="font-size:18px; font-weight:700; color:#1E293B; margin-top:4px;">แบบลงทะเบียนเข้ารับการอบรมโครงการยกระดับทักษะดิจิทัล</h3>
          </div>

          <form onsubmit="event.preventDefault(); alert('จำลองการส่งข้อมูลลงทะเบียนสำเร็จ (บันทึกข้อมูลจำลองเรียบร้อย)');">
            <div style="display:grid; grid-template-columns: 140px 1fr; gap:12px;" class="form-group">
              <div>
                <label class="form-label">คำนำหน้า *</label>
                <select class="form-select" required>
                  <option>นาย</option>
                  <option>นาง</option>
                  <option>นางสาว</option>
                </select>
              </div>
              <div>
                <label class="form-label">ชื่อ - นามสกุล *</label>
                <input type="text" class="form-input" placeholder="[รอกรอก ชื่อ-นามสกุล]" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">ตำแหน่งและหน่วยงานสังกัด *</label>
              <input type="text" class="form-input" placeholder="[รอกรอก ตำแหน่งและหน่วยงาน]" required>
            </div>

            <div class="form-group">
              <label class="form-label">อีเมลสำหรับติดต่อ *</label>
              <input type="email" class="form-input" placeholder="[รอกรอก example@agency.go.th]" required>
            </div>

            <div class="form-group">
              <label class="form-label">ความต้องการพิเศษด้านสิ่งอำนวยความสะดวก (Accessibility)</label>
              <select class="form-select">
                <option>ไม่มีความต้องการพิเศษ</option>
                <option>ต้องการเอกสารสำหรับ Screen Reader</option>
                <option>ต้องการล่ามภาษามือ / คำบรรยายสด</option>
                <option>ต้องการพื้นที่รองรับเก้าอี้รถเข็น (Wheelchair)</option>
              </select>
            </div>

            <div style="background:#F8FAFC; border:1px solid #CBD5E1; padding:14px; border-radius:6px; margin:20px 0;">
              <label style="display:flex; align-items:flex-start; gap:10px; font-size:13.5px; cursor:pointer;">
                <input type="checkbox" required style="margin-top:3px; width:18px; height:18px;">
                <span>ข้าพเจ้ายินยอมให้ [ชื่อหน่วยงานภาครัฐ] เก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลข้างต้นเพื่อวัตถุประสงค์ในการจัดฝึกอบรมและประเมินผลโครงการตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</span>
              </label>
            </div>

            <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:12px; font-size:16px;">
              <i class="fa-solid fa-paper-plane"></i> ยืนยันการลงทะเบียน (จำลอง)
            </button>
          </form>
        </div>
      </div>
    `;
  }

  // 8. Satisfaction Survey Module
  function renderSatisfactionSurvey() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-star-half-stroke" style="color:#2563EB;"></i> แบบประเมินความพึงพอใจโครงการ (Satisfaction Survey)</h2>
            <p>เครื่องมือวัดผลสัมฤทธิ์ตามเกณฑ์ 5 ระดับ (Likert Scale) และรายงานสรุปคะแนน</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
          <!-- Survey Form Builder -->
          <div class="card-base">
            <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">📋 ตัวอย่างข้อคำถามประเมิน</h3>
            <div style="display:flex; flex-direction:column; gap:16px; font-size:14px;">
              <div>
                <strong>1. ความรู้ความเข้าใจที่ได้รับจากโครงการ</strong>
                <div style="display:flex; justify-content:space-between; margin-top:6px; color:#64748B; font-size:12px;">
                  <span>น้อยที่สุด (1)</span>
                  <span>ปานกลาง (3)</span>
                  <span>มากที่สุด (5)</span>
                </div>
              </div>
              <div>
                <strong>2. ประโยชน์และคุณค่าในการนำไปใช้ปฏิบัติงานจริง</strong>
                <div style="display:flex; justify-content:space-between; margin-top:6px; color:#64748B; font-size:12px;">
                  <span>น้อยที่สุด (1)</span>
                  <span>ปานกลาง (3)</span>
                  <span>มากที่สุด (5)</span>
                </div>
              </div>
              <div>
                <strong>3. ความพร้อมของวิทยากรและระบบเทคโนโลยี</strong>
                <div style="display:flex; justify-content:space-between; margin-top:6px; color:#64748B; font-size:12px;">
                  <span>น้อยที่สุด (1)</span>
                  <span>ปานกลาง (3)</span>
                  <span>มากที่สุด (5)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Live Score Preview -->
          <div class="card-base" style="background:#F0FDF4; border-color:#86EFAC;">
            <h3 style="font-size:16px; font-weight:700; color:#166534; margin-bottom:12px;">
              <i class="fa-solid fa-trophy"></i> สรุปผลคะแนนจำลอง (Summary Score)
            </h3>
            <div style="font-size:42px; font-weight:800; color:#15803D;">
              4.62 <span style="font-size:18px; font-weight:normal; color:#4B5563;">/ 5.00</span>
            </div>
            <div style="font-size:14px; font-weight:600; color:#166534; margin:8px 0;">
              คิดเป็นร้อยละ 92.4 (เกินเป้าหมายโครงการที่ตั้งไว้ 85%)
            </div>
            <p style="font-size:12.5px; color:#374151; line-height:1.5;">
              ผลการประเมินชี้ให้เห็นว่า ผู้เข้าร่วมโครงการมีความพร้อมในการนำ AI มาช่วยจัดเตรียมเอกสารและวิเคราะห์ข้อมูลเพื่อบริการประชาชน
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // 9. Data Analytics Plan Module
  function renderAnalyticsPlan() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-network-wired" style="color:#2563EB;"></i> แผนวิเคราะห์ข้อมูลและตัวชี้วัด (Data Analytics Plan)</h2>
            <p>พจนานุกรมข้อมูล (Data Dictionary), สูตรคำนวณ KPI และ Data Pipeline Flow</p>
          </div>
        </div>

        <div class="card-base">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">📊 โครงสร้าง Data Pipeline & ตัวชี้วัดสำคัญ</h3>
          <table class="table-formal">
            <thead>
              <tr>
                <th>ตัวชี้วัด (KPI)</th>
                <th>สูตรคำนวณ</th>
                <th>เป้าหมาย</th>
                <th>ความถี่ในการวัด</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>อัตราการสำเร็จหลักสูตร</strong></td>
                <td>(ผู้สอบผ่านสมรรถนะ / ผู้ลงทะเบียนทั้งหมด) x 100</td>
                <td>>= 90%</td>
                <td>สิ้นสุดการอบรม</td>
              </tr>
              <tr>
                <td><strong>คะแนนพัฒนาการ (Learning Gain)</strong></td>
                <td>Post-test Average - Pre-test Average</td>
                <td>>= +25 คะแนน</td>
                <td>ก่อนและหลังการอบรม</td>
              </tr>
              <tr>
                <td><strong>การลดเวลาบริการประชาชน</strong></td>
                <td>(เวลาเดิม - เวลาใหม่) / เวลาเดิม x 100</td>
                <td>>= 40%</td>
                <td>รายไตรมาสหลังเริ่มใช้จริง</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 10. Charts & Executive Summary Module
  function renderChartsAndSummary() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-chart-simple" style="color:#2563EB;"></i> กราฟและบทสรุปผู้บริหาร (Charts & Exec Summary)</h2>
            <p>รายงานภาพรวมเชิงสถิติและการสรุปความคุ้มค่าของการดำเนินโครงการ</p>
          </div>
          <div class="actions-row">
            <button class="btn-secondary" onclick="alert('จำลองการส่งออกรายงานบทสรุปผู้บริหารเป็น PDF สำเร็จ')">
              <i class="fa-solid fa-file-pdf" style="color:#DC2626;"></i> ส่งออกรายงาน PDF
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
          <!-- SVG Bar Chart -->
          <div class="card-base">
            <h3 style="font-size:15px; font-weight:700; margin-bottom:12px;">แผนผังเปรียบเทียบคะแนน Pre-Test vs Post-Test</h3>
            <div style="padding:10px 0;">
              <svg viewBox="0 0 400 180" style="width:100%; height:auto;">
                <!-- Grid Lines -->
                <line x1="50" y1="140" x2="380" y2="140" stroke="#CBD5E1" stroke-width="1"/>
                <line x1="50" y1="80" x2="380" y2="80" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4"/>
                <line x1="50" y1="20" x2="380" y2="20" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4"/>

                <!-- Labels -->
                <text x="40" y="145" font-size="10" text-anchor="end" fill="#64748B">0</text>
                <text x="40" y="85" font-size="10" text-anchor="end" fill="#64748B">50</text>
                <text x="40" y="25" font-size="10" text-anchor="end" fill="#64748B">100</text>

                <!-- Module 1 Bars -->
                <rect x="90" y="76" width="30" height="64" fill="#94A3B8" rx="3"/>
                <rect x="125" y="24" width="30" height="116" fill="#2563EB" rx="3"/>
                <text x="122" y="158" font-size="11" text-anchor="middle" fill="#334155">AI Literacy</text>

                <!-- Module 2 Bars -->
                <rect x="210" y="88" width="30" height="52" fill="#94A3B8" rx="3"/>
                <rect x="245" y="16" width="30" height="124" fill="#10B981" rx="3"/>
                <text x="242" y="158" font-size="11" text-anchor="middle" fill="#334155">Data Ops</text>

                <!-- Module 3 Bars -->
                <rect x="315" y="96" width="30" height="44" fill="#94A3B8" rx="3"/>
                <rect x="350" y="28" width="30" height="112" fill="#7C3AED" rx="3"/>
                <text x="347" y="158" font-size="11" text-anchor="middle" fill="#334155">Gov Ethics</text>
              </svg>
              <div style="display:flex; justify-content:center; gap:16px; font-size:12px; margin-top:8px;">
                <span><span style="display:inline-block; width:12px; height:12px; background:#94A3B8; border-radius:2px;"></span> ก่อนอบรม (Pre)</span>
                <span><span style="display:inline-block; width:12px; height:12px; background:#2563EB; border-radius:2px;"></span> หลังอบรม (Post)</span>
              </div>
            </div>
          </div>

          <!-- Executive Summary Brief -->
          <div class="card-base" style="background:#F8FAFC;">
            <h3 style="font-size:15px; font-weight:700; margin-bottom:12px; color:#1E3A8A;">
              <i class="fa-solid fa-file-invoice" style="color:#2563EB;"></i> บทสรุปย่อสำหรับผู้บริหาร (Executive Brief)
            </h3>
            <p style="font-size:14px; line-height:1.7; color:#334155;">
              โครงการนี้เป็นกลไกสำคัญในการขับเคลื่อน <strong>${appState.project.agency}</strong> สู่องค์กรดิจิทัลเต็มรูปแบบ ด้วยงบประมาณ 2.5 ล้านบาท สามารถยกระดับสมรรถนะบุคลากรได้ 500 คน ก่อให้เกิดผลตอบแทนทางสังคมและประหยัดเวลาการให้บริการประชาชนกว่าร้อยละ 40 ผ่านเกณฑ์ความคุ้มค่าและพร้อมดำเนินการ
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // 11. Presentation 5 Slides Player Module
  function renderPresentationDeck() {
    const slide = SLIDES[appState.currentSlideIndex];
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-person-chalkboard" style="color:#2563EB;"></i> การนำเสนอ 5 สไลด์ (Interactive Presentation Deck)</h2>
            <p>ชุดสไลด์นำเสนอขออนุมัติโครงการ 5 หน้า พร้อมระบบบันทึกคำบรรยายผู้พูด (Slide Notes)</p>
          </div>
        </div>

        <div class="slide-player-container">
          <!-- Slide Canvas -->
          <div class="slide-canvas">
            <div class="slide-badge">สไลด์ที่ ${slide.no} จาก 5 : ${slide.subtitle || ''}</div>
            <div class="slide-title">${slide.title}</div>
            <div class="slide-body">${slide.body}</div>
          </div>

          <!-- Slide Controls Bar -->
          <div class="slide-controls">
            <button class="btn-secondary" style="color:white; border-color:#475569;" 
                    onclick="window.govApp.prevSlide()" ${appState.currentSlideIndex === 0 ? 'disabled' : ''}>
              <i class="fa-solid fa-arrow-left"></i> สไลด์ก่อนหน้า
            </button>

            <div style="display:flex; gap:6px;">
              ${SLIDES.map((s, idx) => `
                <button onclick="window.govApp.jumpSlide(${idx})" 
                        style="width:28px; height:28px; border-radius:50%; border:none; cursor:pointer; font-size:12px; font-weight:bold; background:${idx === appState.currentSlideIndex ? '#2563EB' : '#334155'}; color:white;">
                  ${s.no}
                </button>
              `).join('')}
            </div>

            <button class="btn-primary" 
                    onclick="window.govApp.nextSlide()" ${appState.currentSlideIndex === SLIDES.length - 1 ? 'disabled' : ''}>
              สไลด์ถัดไป <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <!-- Slide Speaker Notes -->
          <div class="slide-notes-box">
            <strong><i class="fa-solid fa-note-sticky" style="color:#D97706;"></i> โน้ตสำหรับผู้นำเสนอ (Speaker Notes):</strong> 
            <span>${slide.notes}</span>
          </div>
        </div>
      </div>
    `;
  }

  // 12. 30s Video Script & Storyboard Module
  function renderVideoScript() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-film" style="color:#2563EB;"></i> Script วิดีโอ 30 วินาที & Storyboard</h2>
            <p>บทภาพยนตร์โฆษณาประชาสัมพันธ์โครงการความยาว 30 วินาที</p>
          </div>
        </div>

        <div class="card-base">
          <table class="table-formal">
            <thead>
              <tr>
                <th style="width:110px;">ช่วงเวลา</th>
                <th style="width:130px;">โครงสร้าง (Hook)</th>
                <th>ภาพและกราฟิกจำลอง (Visual)</th>
                <th>บทบรรยายเสียง (Voiceover)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>00:00 - 00:05</strong></td>
                <td><span class="status-pill status-ai_draft">เปิดหัวเร้าความสนใจ</span></td>
                <td>ประชาชนและเจ้าหน้าที่ยิ้มอย่างมีความสุขกับหน้าจอบริการที่สะดวก รวดเร็ว</td>
                <td><em>"จะดีแค่ไหน... ถ้างานบริการภาครัฐ สะดวก รวดเร็ว และเข้าถึงได้ทุกคน?"</em></td>
              </tr>
              <tr>
                <td><strong>00:05 - 00:15</strong></td>
                <td><span class="status-pill status-pending_approval">ปัญหาและทางออก</span></td>
                <td>อนิเมชันแสดงขั้นตอนเอกสารดิจิทัลที่มีระบบ AI ช่วยตรวจสอบความถูกต้อง</td>
                <td><em>"[ชื่อหน่วยงานภาครัฐ] ขับเคลื่อนนวัตกรรมบริการดิจิทัล ผสานพลังปัญญาประดิษฐ์เพื่อคนไทยทุกคน"</em></td>
              </tr>
              <tr>
                <td><strong>00:15 - 00:25</strong></td>
                <td><span class="status-pill status-in_review">ผลกระทบเชิงบวก</span></td>
                <td>เจ้าหน้าที่ฝึกทักษะและให้คำปรึกษาประชาชนอย่างมั่นใจและปลอดภัย</td>
                <td><em>"เรียนรู้ง่าย ใช้งานจริง โปร่งใส ปลอดภัย และได้มาตรฐานสากล"</em></td>
              </tr>
              <tr>
                <td><strong>00:25 - 00:30</strong></td>
                <td><span class="status-pill status-approved">Call To Action</span></td>
                <td>แสดง [ตราหน่วยงาน] และช่องทางเว็บไซต์ [รอกรอก URL]</td>
                <td><em>"ร่วมสร้างอนาคตบริการรัฐดิจิทัลไปด้วยกันวันนี้ ที่ [รอกรอก]"</em></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 13. Accessibility Checklist Module
  function renderAccessibilityChecklist() {
    const checks = [
      { id: "WCAG-1.1.1", name: "Non-text Content (Alt Text)", desc: "มีคำอธิบายข้อความสำหรับรูปภาพและไอคอนทั้งหมด", status: "ผ่านเกณฑ์" },
      { id: "WCAG-1.4.3", name: "Contrast (Minimum 4.5:1)", desc: "อัตราส่วนความต่างสีของตัวอักษรกับพื้นหลังมากกว่า 4.5:1", status: "ผ่านเกณฑ์" },
      { id: "WCAG-2.1.1", name: "Keyboard Accessible", desc: "สามารถควบคุมและกดปุ่มทั้งหมดได้ด้วยคีย์บอร์ด (Tab / Enter / Space)", status: "ผ่านเกณฑ์" },
      { id: "WCAG-2.4.7", name: "Focus Visible", desc: "มีเส้นกรอบ Focus Indicator ชัดเจนขณะกดปุ่ม Tab", status: "ผ่านเกณฑ์" },
      { id: "WCAG-1.4.1", name: "Use of Color", desc: "ไม่ใช้สีเพียงอย่างเดียวในการสื่อความหมาย (มีไอคอนและข้อความกำกับเสมอ)", status: "ผ่านเกณฑ์" },
      { id: "WCAG-1.4.4", name: "Resize Text (200%)", desc: "รองรับการขยายตัวอักษรโดยไม่เกิดการทับซ้อนหรือตัดทอนเนื้อหา", status: "ผ่านเกณฑ์" }
    ];

    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-universal-access" style="color:#2563EB;"></i> แบบตรวจสอบมาตรฐานการเข้าถึง (Accessibility Checklist)</h2>
            <p>การประเมินความสอดคล้องตามมาตรฐานสากล WCAG 2.1 Level AA</p>
          </div>
        </div>

        <div class="card-base">
          <table class="table-formal">
            <thead>
              <tr>
                <th>รหัสเกณฑ์</th>
                <th>รายการตรวจสอบ</th>
                <th>รายละเอียดการทดสอบ</th>
                <th>ผลการประเมิน</th>
              </tr>
            </thead>
            <tbody>
              ${checks.map(c => `
                <tr>
                  <td><strong>${c.id}</strong></td>
                  <td>${c.name}</td>
                  <td>${c.desc}</td>
                  <td><span class="status-pill status-approved"><i class="fa-solid fa-check"></i> ${c.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 14. PDPA & AI Ethics Module
  function renderPdpaAiEthics() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-shield-halved" style="color:#2563EB;"></i> PDPA และจริยธรรมปัญญาประดิษฐ์ (AI Ethics & Governance)</h2>
            <p>กรอบธรรมาภิบาลข้อมูล การรักษาความลับ และความโปร่งใสของระบบ AI ภาครัฐ</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
          <div class="card-base">
            <h3 style="font-size:16px; font-weight:700; color:#1E3A8A; margin-bottom:12px;">
              <i class="fa-solid fa-user-shield"></i> มาตรการคุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </h3>
            <ul style="padding-left:20px; font-size:14px; line-height:1.8; color:#334155;">
              <li><strong>Data Minimization:</strong> จัดเก็บเฉพาะข้อมูลที่จำเป็นต่อการฝึกอบรมเท่านั้น</li>
              <li><strong>Explicit Consent:</strong> มีกล่องข้อความขอความยินยอมที่ชัดเจนและแยกต่างหาก</li>
              <li><strong>Anonymization:</strong> ระบบจำลองใช้ [ตราหน่วยงาน] และ [รอกรอก] ปราศจากข้อมูลระบุตัวบุคคลจริง</li>
            </ul>
          </div>

          <div class="card-base">
            <h3 style="font-size:16px; font-weight:700; color:#7C3AED; margin-bottom:12px;">
              <i class="fa-solid fa-brain"></i> ธรรมาภิบาล AI (AI Governance Pillars)
            </h3>
            <ul style="padding-left:20px; font-size:14px; line-height:1.8; color:#334155;">
              <li><strong>Human-in-the-Loop:</strong> AI มีหน้าที่เพียงช่วยร่าง (AI_DRAFT) เจ้าหน้าที่ต้องตรวจทานเสมอ</li>
              <li><strong>Transparency & Explainability:</strong> ระบุแหล่งที่มาและตรรกะการประมวลผลชัดเจน</li>
              <li><strong>Fairness & Inclusion:</strong> รองรับการเข้าถึงของผู้พิการและประชาชนทุกกลุ่ม</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // 15. Review & Approval Station Module
  function renderReviewAndApproval() {
    const status = appState.project.status;
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-signature" style="color:#2563EB;"></i> สเตชันตรวจเอกสารและอนุมัติ (Review & Approval Station)</h2>
            <p>ศูนย์ตรวจสอบความถูกต้อง ให้ความเห็น ส่งกลับแก้ไข หรือลงนามอนุมัติโครงการ</p>
          </div>
        </div>

        <div class="card-base">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid #E2E8F0;">
            <div>
              <div style="font-size:13px; color:#64748B;">สถานะปัจจุบันของโครงการ</div>
              <div style="margin-top:4px;">${getStatusBadge(status)}</div>
            </div>
            <div>
              <strong>วงเงินขออนุมัติ:</strong> <span style="font-size:18px; color:#2563EB; font-weight:bold;">${appState.project.budgetFormatted}</span>
            </div>
          </div>

          ${appState.project.revisionNote ? `
            <div style="background:#FEE2E2; border:1px solid #FCA5A5; color:#991B1B; padding:14px; border-radius:6px; margin-bottom:20px;">
              <strong><i class="fa-solid fa-circle-exclamation"></i> หมายเหตุส่งกลับแก้ไขล่าสุด:</strong>
              <div style="margin-top:4px; font-size:14px;">${appState.project.revisionNote}</div>
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">ความเห็น / ข้อเสนอแนะของผู้ตรวจทาน</label>
            <textarea id="review-comments" class="form-textarea" placeholder="กรอกความเห็นประกอบการพิจารณา..." ${status === 'APPROVED' ? 'disabled' : ''}>เอกสารมีรายละเอียดครบถ้วน สอดคล้องกับยุทธศาสตร์ดิจิทัลภาครัฐ</textarea>
          </div>

          <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:24px; padding-top:16px; border-top:1px solid #E2E8F0;">
            ${status !== 'APPROVED' ? `
              <button class="btn-warning" onclick="window.govApp.promptRevision()">
                <i class="fa-solid fa-rotate-left"></i> ส่งกลับเพื่อแก้ไขพร้อมหมายเหตุ
              </button>
              <button class="btn-primary" onclick="window.govApp.submitForApproval()">
                <i class="fa-solid fa-paper-plane"></i> ส่งต่อผู้อนุมัติ (Pending Approval)
              </button>
              <button class="btn-success" style="font-size:15px; padding:10px 22px;" onclick="window.govApp.approveProject()">
                <i class="fa-solid fa-stamp"></i> ลงนามอนุมัติโครงการ (Approve & Lock)
              </button>
            ` : `
              <div style="display:flex; align-items:center; gap:10px; color:#15803D; font-weight:700;">
                <i class="fa-solid fa-circle-check" style="font-size:24px;"></i>
                โครงการนี้ได้รับการอนุมัติอย่างเป็นทางการเรียบร้อยแล้ว
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  // 16. Audit Log & Version History Module
  function renderAuditLog() {
    return `
      <div>
        <div class="module-header">
          <div class="module-title-group">
            <h2><i class="fa-solid fa-clock-rotate-left" style="color:#2563EB;"></i> Audit Log และประวัติรุ่นเอกสาร (Version History)</h2>
            <p>บันทึกประวัติการแก้ไข การเปลี่ยนสถานะ และร่องรอยการทำงานทั้งหมดอย่างโปร่งใส</p>
          </div>
        </div>

        <div class="card-base">
          <table class="table-formal">
            <thead>
              <tr>
                <th style="width:70px;">รุ่น (Ver)</th>
                <th style="width:160px;">วัน-เวลา</th>
                <th>ผู้ดำเนินการ</th>
                <th>การกระทำ (Action)</th>
                <th>สถานะ</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              ${appState.auditLogs.map(log => `
                <tr>
                  <td><strong>${log.version}</strong></td>
                  <td><span style="font-family:monospace; font-size:12px;">${log.timestamp}</span></td>
                  <td>${log.actor}</td>
                  <td><strong>${log.action}</strong></td>
                  <td>${getStatusBadge(log.status)}</td>
                  <td style="font-size:13px; color:#475569;">${log.detail}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // WORKFLOW & ACTION HANDLERS
  // ==========================================================================
  function switchStyle(styleName) {
    appState.currentStyle = styleName;
    renderApp();
  }

  function switchModule(moduleId) {
    appState.currentModule = moduleId;
    renderApp();
    // Scroll to main content
    const el = document.getElementById('main-content');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function triggerAIDraft() {
    if (appState.isGeneratingAI) return;
    appState.isGeneratingAI = true;

    // Show loading popup
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'ai-loading-modal';
    overlay.innerHTML = `
      <div class="modal-card" style="text-align:center;">
        <div class="ai-generating-overlay">
          <div class="ai-spinner"></div>
          <h3 style="font-size:18px; font-weight:700; color:#4338CA;">ระบบ AI จำลองกำลังช่วยร่างข้อความ...</h3>
          <p style="font-size:13.5px; color:#64748B;">กำลังวิเคราะห์วัตถุประสงค์ คำนวณงบประมาณ และจัดรูปแบบตามระเบียบงานสารบรรณ</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      // Remove loading popup
      const m = document.getElementById('ai-loading-modal');
      if (m) m.remove();

      // Update State to AI_DRAFT
      appState.isGeneratingAI = false;
      appState.project.status = 'AI_DRAFT';
      appState.project.proposal.background = "ด้วยสถานการณ์การเปลี่ยนแปลงทางเทคโนโลยีอย่างก้าวกระโดด [ชื่อหน่วยงานภาครัฐ] จึงมีความจำเป็นเร่งด่วนในการพัฒนากำลังคนให้มีความรู้ความเข้าใจในการประยุกต์ใช้ AI ในกระบวนการทำงานราชการอย่างปลอดภัย โปร่งใส และลดระยะเวลาบริการประชาชน";
      
      addAuditLog("AI Assist Engine (จำลอง)", "AI ช่วยร่างเนื้อหาโครงการและบันทึกข้อความ", "AI_DRAFT", "ปรับปรุงเนื้อหา 3 ย่อหน้าและแผนกิจกรรมสมบูรณ์");
      
      renderApp();
      alert("✨ AI ช่วยร่างเนื้อหาโครงการและบันทึกข้อความเรียบร้อยแล้ว (สถานะเปลี่ยนเป็น AI_DRAFT)");
    }, 1200);
  }

  function submitForReview() {
    appState.project.status = 'IN_REVIEW';
    addAuditLog("เจ้าหน้าที่วิเคราะห์นโยบายและแผน", "ส่งเอกสารให้ผู้ตรวจทาน", "IN_REVIEW", "ส่งต่อหัวหน้ากลุ่มงานเพื่อตรวจสอบ");
    renderApp();
    alert("📤 ส่งเอกสารให้ผู้ตรวจทานเรียบร้อยแล้ว (สถานะเปลี่ยนเป็น IN_REVIEW)");
  }

  function promptRevision() {
    const note = prompt("กรุณาระบุหมายเหตุ/ข้อที่ต้องปรับปรุงแก้ไข:", "โปรดปรับเพิ่มรายละเอียดหัวข้อการประเมินความพึงพอใจและชี้แจงกรอบงบประมาณในส่วนที่ 2");
    if (note !== null) {
      appState.project.status = 'REVISION_REQUIRED';
      appState.project.revisionNote = note;
      addAuditLog("ผู้ตรวจทาน (ตำแหน่งสมมติ)", "ส่งกลับเพื่อแก้ไขพร้อมหมายเหตุ", "REVISION_REQUIRED", note);
      renderApp();
      alert("⚠️ ส่งกลับเอกสารเพื่อแก้ไขเรียบร้อยแล้ว");
    }
  }

  function submitForApproval() {
    appState.project.status = 'PENDING_APPROVAL';
    addAuditLog("ผู้ตรวจทาน (ตำแหน่งสมมติ)", "ส่งต่อผู้บริหารเพื่อพิจารณาอนุมัติ", "PENDING_APPROVAL", "ผ่านการตรวจทานความถูกต้องสมบูรณ์");
    renderApp();
    alert("📑 ส่งต่อผู้บริหารเพื่อพิจารณาอนุมัติเรียบร้อยแล้ว (PENDING_APPROVAL)");
  }

  function approveProject() {
    appState.project.status = 'APPROVED';
    addAuditLog("ผู้บริหารระดับสูง (ตำแหน่งสมมติ)", "ลงนามอนุมัติโครงการและล็อกเอกสาร", "APPROVED", "อนุมัติวงเงินงบประมาณ 2,500,000 บาท มีผลสมบูรณ์ตามระเบียบ");
    renderApp();
    alert("🎉 ลงนามอนุมัติโครงการเรียบร้อยแล้ว! (เอกสารถูกประทับตราและล็อกการแก้ไข)");
  }

  function addAuditLog(actor, action, status, detail) {
    const now = new Date();
    const ts = `${now.getFullYear() + 543}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const nextVer = `v1.${appState.auditLogs.length}`;
    appState.auditLogs.unshift({
      version: nextVer,
      timestamp: ts,
      actor: actor,
      action: action,
      status: status,
      detail: detail
    });
  }

  function resetDemoData() {
    if (confirm("ต้องการรีเซ็ตข้อมูลการทดสอบกลับเป็นค่าเริ่มต้นหรือไม่?")) {
      appState.project = JSON.parse(JSON.stringify(INITIAL_PROJECT_DATA));
      appState.currentModule = 'dashboard';
      appState.currentSlideIndex = 0;
      appState.auditLogs = [
        {
          version: "v1.0",
          timestamp: "2569-08-14 09:30:00",
          actor: "เจ้าหน้าที่วิเคราะห์นโยบายและแผน (ตำแหน่งสมมติ)",
          action: "สร้างร่างโครงการเริ่มต้น",
          status: "DRAFT",
          detail: "กรอกข้อมูลพื้นฐาน วงเงินงบประมาณ 2,500,000 บาท"
        }
      ];
      renderApp();
      alert("รีเซ็ตข้อมูลสำเร็จ");
    }
  }

  // Accessibility & Viewport Helpers
  function setDeviceView(mode) {
    appState.deviceView = mode;
    renderApp();
  }

  function setFontSize(size) {
    appState.fontSize = size;
    renderApp();
  }

  function toggleHighContrast() {
    appState.highContrast = !appState.highContrast;
    renderApp();
  }

  function nextSlide() {
    if (appState.currentSlideIndex < SLIDES.length - 1) {
      appState.currentSlideIndex++;
      renderApp();
    }
  }

  function prevSlide() {
    if (appState.currentSlideIndex > 0) {
      appState.currentSlideIndex--;
      renderApp();
    }
  }

  function jumpSlide(idx) {
    appState.currentSlideIndex = idx;
    renderApp();
  }

  function quickExport(type) {
    window.print();
  }

  function attachEventListeners() {
    // Keep controllers sync
    const styleBtns = document.querySelectorAll('.style-btn');
    styleBtns.forEach(btn => {
      if (btn.dataset.style === appState.currentStyle) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const devBtns = document.querySelectorAll('.dev-btn');
    devBtns.forEach(btn => {
      if (btn.dataset.view === appState.deviceView) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Expose API to window
  window.govApp = {
    switchStyle,
    switchModule,
    triggerAIDraft,
    submitForReview,
    promptRevision,
    submitForApproval,
    approveProject,
    resetDemoData,
    setDeviceView,
    setFontSize,
    toggleHighContrast,
    nextSlide,
    prevSlide,
    jumpSlide,
    quickExport,
    getState: () => appState
  };

  // Initialize App on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    renderApp();
  });
})();
