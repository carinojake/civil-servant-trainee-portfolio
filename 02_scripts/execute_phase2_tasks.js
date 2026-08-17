const fs = require('fs');
const path = require('path');

console.log('=== EXECUTING PHASE 2: PWA (#5), ONBOARDING TOUR (#4), ACHIEVEMENT BADGES (#7) ===');

const baseDir = path.join(__dirname, '..');

// ============================================================================
// 1. TASK #5: PWA (manifest.json, Service Worker sw.js, Icons)
// ============================================================================
const manifestJson = {
  "name": "แฟ้มสะสมผลงานดิจิทัล ข้าราชการพลเรือน",
  "short_name": "Portfolio",
  "description": "ระบบบันทึกการอบรมและแฟ้มผลงานดิจิทัล สำหรับข้าราชการผู้เข้ารับการอบรม รุ่นที่ 1",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#F4F7FB",
  "theme_color": "#1B365D",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "./icons/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "./icons/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 'manifest.json'), JSON.stringify(manifestJson, null, 2), 'utf8');

// Ensure icons directory exists
const iconsDir = path.join(baseDir, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="#1B365D"/>
  <circle cx="256" cy="256" r="190" fill="#2563EB" opacity="0.2"/>
  <path d="M256 128L64 224L256 320L448 224L256 128Z" fill="#F59E0B"/>
  <path d="M128 260V340C128 340 176 384 256 384C336 384 384 340 384 340V260L256 324L128 260Z" fill="#10B981"/>
  <path d="M416 240V340H432V240H416Z" fill="#F59E0B"/>
  <circle cx="424" cy="356" r="14" fill="#F59E0B"/>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), iconSvg, 'utf8');
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), iconSvg, 'utf8');

// Service Worker (sw.js)
const swCode = `// Service Worker for Civil Servant Portfolio PWA (Cache & Offline Support)
const CACHE_NAME = 'civil-portfolio-cache-v2.9.5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass-through external API / Gemini / Google Drive calls
  if (event.request.url.includes('googleapis.com') || 
      event.request.url.includes('google.com') ||
      event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
`;

fs.writeFileSync(path.join(baseDir, 'sw.js'), swCode, 'utf8');
console.log('✓ [Task #5] PWA manifest.json, icons, and sw.js created!');

// ============================================================================
// 2. TASK #4 & #7: Update index.html for Onboarding Tour & Achievement Badges
// ============================================================================
const indexPath = path.join(baseDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Add PWA meta tags in <head>
if (!indexHtml.includes('manifest.json')) {
    const pwaMeta = `    <!-- PWA & Mobile Web App Meta Tags -->
    <link rel="manifest" href="manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Portfolio">
    <link rel="apple-touch-icon" href="icons/icon-192.svg">
    <meta name="theme-color" content="#1B365D">
</head>`;
    indexHtml = indexHtml.replace('</head>', pwaMeta);
}

// Add Achievement Badges Section on Dashboard under KPI Cards
const kpiEndTarget = `                    <!-- Attendance & OJT Metrics Cards -->`;
const badgeSectionHtml = `                    <!-- Achievement Badges (Gamification - Task #7) -->
                    <div class="app-card p-5 bg-gradient-to-r from-indigo-900/5 via-blue-900/5 to-slate-900/5 border border-indigo-200/80 space-y-3">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-indigo-100 pb-2.5">
                            <div class="flex items-center space-x-2">
                                <span class="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                                    <i class="fa-solid fa-medal mr-1 text-amber-300"></i> เหรียญรางวัลความสำเร็จ (Badges)
                                </span>
                                <h3 class="text-sm font-bold text-govNavy">เกียรติบัตรและความก้าวหน้าในการอบรม</h3>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span id="badge-unlocked-count" class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">ปลดล็อค 0 / 8 เหรียญ</span>
                                <button type="button" onclick="startWelcomeTour()" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition flex items-center space-x-1 cursor-pointer border border-blue-200">
                                    <i class="fa-solid fa-compass text-blue-600"></i>
                                    <span>🎯 ทัวร์แนะนำระบบ</span>
                                </button>
                            </div>
                        </div>

                        <!-- 8 Badges Grid -->
                        <div id="achievement-badges-grid" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
                            <!-- Populated by JS -->
                        </div>
                    </div>

                    <!-- Attendance & OJT Metrics Cards -->`;

if (!indexHtml.includes('id="achievement-badges-grid"') && indexHtml.includes(kpiEndTarget)) {
    indexHtml = indexHtml.replace(kpiEndTarget, badgeSectionHtml);
    console.log('✓ [Task #7] Added Achievement Badges Section to Dashboard in index.html');
}

// Add Welcome Tour Modal/Overlay to index.html before </body>
const tourModalHtml = `
    <!-- ====================================================================
         WELCOME TOUR / ONBOARDING MODAL & OVERLAY (Task #4)
         ==================================================================== -->
    <div id="welcome-tour-overlay" class="fixed inset-0 bg-govNavy/70 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4 transition-all">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-fade-in relative">
            <div class="p-6 bg-gradient-to-r from-govNavy to-blue-900 text-white relative">
                <div class="flex justify-between items-center">
                    <span id="tour-step-badge" class="bg-amber-500 text-govNavy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        ขั้นตอนที่ 1 / 5
                    </span>
                    <button type="button" onclick="closeWelcomeTour()" class="text-slate-300 hover:text-white text-lg transition cursor-pointer">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <h3 id="tour-step-title" class="text-xl font-bold mt-3 leading-snug">ยินดีต้อนรับสู่ระบบแฟ้มผลงานดิจิทัล</h3>
                <p id="tour-step-subtitle" class="text-xs text-blue-200 mt-1">คู่มือแนะนำการใช้งานระบบเบื้องต้น 5 จุดสำคัญ</p>
            </div>

            <div class="p-6 space-y-4">
                <div id="tour-step-content" class="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <!-- Step content by JS -->
                </div>

                <div class="flex justify-between items-center pt-2">
                    <button type="button" onclick="closeWelcomeTour()" class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer">
                        ข้ามคำแนะนำ
                    </button>
                    <div class="flex items-center space-x-2">
                        <button type="button" id="btn-tour-prev" onclick="prevTourStep()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer hidden">
                            <i class="fa-solid fa-arrow-left mr-1"></i> ย้อนกลับ
                        </button>
                        <button type="button" id="btn-tour-next" onclick="nextTourStep()" class="px-5 py-2.5 rounded-xl bg-govNavy hover:bg-govNavyDark text-white text-xs font-bold shadow-md transition flex items-center space-x-1 cursor-pointer">
                            <span>ถัดไป</span>
                            <i class="fa-solid fa-arrow-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

if (!indexHtml.includes('id="welcome-tour-overlay"')) {
    indexHtml = indexHtml.replace('</body>', tourModalHtml + '\n</body>');
    console.log('✓ [Task #4] Added Welcome Tour Overlay to index.html');
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');

// ============================================================================
// 3. TASK #4, #5, #7: Update app.js
// ============================================================================
const appJsPath = path.join(baseDir, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const phase2EngineCode = `
/* ==========================================================================
   PHASE 2: PWA, ONBOARDING TOUR & ACHIEVEMENT BADGES ENGINE
   ========================================================================== */

// 1. Service Worker Registration (Task #5)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[PWA] Service Worker registered successfully:', reg.scope))
            .catch(err => console.warn('[PWA] Service Worker registration failed:', err));
    });
}

// 2. Achievement Badges (Task #7)
const MASTER_BADGES = [
    {
        id: 'badge-attend-7',
        icon: 'fa-star',
        color: 'text-amber-500 bg-amber-50 border-amber-300',
        title: 'นักเรียนขยัน',
        desc: 'เข้าเรียนครบอย่างน้อย 7 วัน',
        check: (state) => state.attendance.filter(a => a.status === 'PRESENT' || a.status === 'ONLINE').length >= 7
    },
    {
        id: 'badge-attend-13',
        icon: 'fa-trophy',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-300',
        title: 'เรียนจบครบ',
        desc: 'เข้าเรียนครบทั้ง 13 วัน (100%)',
        check: (state) => state.attendance.filter(a => a.status === 'PRESENT' || a.status === 'ONLINE').length >= 13
    },
    {
        id: 'badge-reflection-5',
        icon: 'fa-pen-nib',
        color: 'text-blue-600 bg-blue-50 border-blue-300',
        title: 'นักสะท้อนคิด',
        desc: 'บันทึก Reflection ครบ 5 วัน',
        check: (state) => state.attendance.filter(a => a.reflection && a.reflection.trim().length > 10).length >= 5
    },
    {
        id: 'badge-quiz-master',
        icon: 'fa-brain',
        color: 'text-purple-600 bg-purple-50 border-purple-300',
        title: 'สอบผ่านฉลุย',
        desc: 'คะแนน Post-test เฉลี่ย ≥ 8.0 คะแนน',
        check: (state) => {
            const scores = state.attendance.map(a => a.afternoonPostTestScore || a.postTestScore).filter(s => s !== undefined);
            if (scores.length === 0) return false;
            const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
            return avg >= 8.0;
        }
    },
    {
        id: 'badge-ojt-30',
        icon: 'fa-stopwatch',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-300',
        title: 'OJT Starter',
        desc: 'สะสมชั่วโมง OJT ครบ 30 ชม.',
        check: (state) => {
            const total = (state.ojtLogs || []).reduce((sum, l) => sum + (l.hours || 0), 0);
            return total >= 30;
        }
    },
    {
        id: 'badge-ojt-90',
        icon: 'fa-bullseye',
        color: 'text-teal-600 bg-teal-50 border-teal-300',
        title: 'OJT Master',
        desc: 'สะสมชั่วโมง OJT ครบ 90 ชม. (ผ่านเกณฑ์)',
        check: (state) => {
            const total = (state.ojtLogs || []).reduce((sum, l) => sum + (l.hours || 0), 0);
            return total >= 90;
        }
    },
    {
        id: 'badge-ai-explorer',
        icon: 'fa-wand-magic-sparkles',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-300',
        title: 'AI Explorer',
        desc: 'ใช้งาน AI Co-Pilot & ขัดเกลาภาษา',
        check: (state) => true
    },
    {
        id: 'badge-knowledge-hub',
        icon: 'fa-book-open-reader',
        color: 'text-rose-600 bg-rose-50 border-rose-300',
        title: 'คลังความรู้',
        desc: 'เข้าถึงสไลด์และเอกสารการเรียนรู้',
        check: (state) => true
    }
];

function renderAchievementBadges() {
    const container = document.getElementById('achievement-badges-grid');
    const counterEl = document.getElementById('badge-unlocked-count');
    if (!container) return;

    let unlockedCount = 0;

    container.innerHTML = MASTER_BADGES.map(badge => {
        const isUnlocked = badge.check(appState);
        if (isUnlocked) unlockedCount++;

        if (isUnlocked) {
            return \`
                <div class="p-3 rounded-2xl border \${badge.color} shadow-xs text-center flex flex-col items-center justify-between space-y-1.5 transition-all hover:scale-105" title="\${badge.desc}">
                    <div class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-base shadow-xs">
                        <i class="fa-solid \${badge.icon}"></i>
                    </div>
                    <div class="font-bold text-xs text-slate-800 leading-tight">\${badge.title}</div>
                    <span class="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">✓ ปลดล็อค</span>
                </div>
            \`;
        } else {
            return \`
                <div class="p-3 rounded-2xl border border-slate-200 bg-slate-100/70 opacity-60 text-center flex flex-col items-center justify-between space-y-1.5" title="\${badge.desc}">
                    <div class="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-base text-slate-400">
                        <i class="fa-solid fa-lock"></i>
                    </div>
                    <div class="font-bold text-xs text-slate-600 leading-tight">\${badge.title}</div>
                    <span class="text-[9px] text-slate-400 bg-slate-200 px-1.5 py-0.2 rounded">ล็อกอยู่</span>
                </div>
            \`;
        }
    }).join('');

    if (counterEl) {
        counterEl.innerText = \`ปลดล็อค \${unlockedCount} / \${MASTER_BADGES.length} เหรียญ\`;
    }
}

// 3. Welcome Tour Engine (Task #4)
let currentTourStep = 1;
const TOUR_STEPS = [
    {
        step: 1,
        title: '📊 แดชบอร์ดภาพรวม & ตัวชี้วัด KPI',
        subtitle: 'ติดตามสถานะการเข้าเรียน, กราฟคะแนน Pre/Post-test 13 วัน และชั่วโมง OJT สะสม',
        content: 'หน้าแรกจะสรุปผลความก้าวหน้าทั้งหมดของท่าน รวมถึงเกณฑ์การผ่านหลักสูตร (เข้าเรียน ≥80% และ OJT ≥90 ชม.) พร้อมกราฟเปรียบเทียบคะแนนและเหรียญรางวัลความสำเร็จ'
    },
    {
        step: 2,
        title: '📅 แท็บ M2: ตารางอบรม 13 วัน & Reflection',
        subtitle: 'ศูนย์รวมตารางเรียน สไลด์จาก Google Drive และ Daily Action Hub',
        content: 'ท่านสามารถดูรายละเอียดวิชาช่วงเช้า-บ่าย ห้องอบรมจริง วิทยากรผู้สอน ลิงก์ทำข้อสอบ Pre/Post-test และบันทึกสรุปการเรียนรู้ (Reflection) ประจำวันได้ที่นี่'
    },
    {
        step: 3,
        title: '🤖 ผู้ช่วยอัจฉริยะ AI Co-Pilot (น้องฟ้า)',
        subtitle: 'ติวเตอร์ AI ถาม-ตอบเนื้อหาบทเรียน 13 วัน และช่วยร่างสคริปต์วิดีโอ',
        content: 'กดปุ่ม AI Co-Pilot สีทองมุมขวาล่าง เพื่อเปิดหน้าต่างสนทนา ถามคำถามเกี่ยวกับข้อสอบ กฎระเบียบราชการ หรือให้ AI ช่วยสรุปเนื้อหาบทเรียนรายวันได้ตลอด 24 ชม.'
    },
    {
        step: 4,
        title: '📋 แท็บ M6: แฟ้มสะสมผลงานเล่มดิจิทัล 7 หน้า',
        subtitle: 'รวมเล่มอัตโนมัติ พร้อมตราครุฑ QR Code ตรวจสอบเล่ม และพิมพ์ PDF A4',
        content: 'ระบบจะนำประวัติ ผลงาน OJT และการสะท้อนคิดของท่านมาร้อยเรียงเป็นแฟ้มดิจิทัล 7 หน้ามาตรฐาน พร้อมปุ่มพิมพ์ PDF สำหรับส่งหน่วยงานต้นสังกัด'
    },
    {
        step: 5,
        title: '💾 สำรอง & กู้คืนข้อมูล (JSON Backup)',
        subtitle: 'ความปลอดภัยและความเป็นส่วนตัว 100% ตามมาตรฐาน PDPA',
        content: 'ข้อมูลทั้งหมดจะถูกบันทึกไว้ในเครื่องของท่านอย่างปลอดภัย ท่านสามารถกดปุ่ม [สำรอง JSON] ที่แถบด้านบนเพื่อเก็บไฟล์สำรองไว้ใช้งานบนอุปกรณ์อื่นได้ทุกเวลา'
    }
];

function startWelcomeTour() {
    currentTourStep = 1;
    updateTourView();
    const overlay = document.getElementById('welcome-tour-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

function closeWelcomeTour() {
    const overlay = document.getElementById('welcome-tour-overlay');
    if (overlay) overlay.classList.add('hidden');
    localStorage.setItem('civil_tour_completed', 'true');
}

function updateTourView() {
    const stepData = TOUR_STEPS.find(s => s.step === currentTourStep);
    if (!stepData) return;

    const badge = document.getElementById('tour-step-badge');
    const title = document.getElementById('tour-step-title');
    const subtitle = document.getElementById('tour-step-subtitle');
    const content = document.getElementById('tour-step-content');
    const btnPrev = document.getElementById('btn-tour-prev');
    const btnNext = document.getElementById('btn-tour-next');

    if (badge) badge.innerText = \`ขั้นตอนที่ \${stepData.step} / \${TOUR_STEPS.length}\`;
    if (title) title.innerText = stepData.title;
    if (subtitle) subtitle.innerText = stepData.subtitle;
    if (content) content.innerHTML = \`<p class="leading-relaxed">\${stepData.content}</p>\`;

    if (btnPrev) {
        if (currentTourStep > 1) btnPrev.classList.remove('hidden');
        else btnPrev.classList.add('hidden');
    }

    if (btnNext) {
        if (currentTourStep === TOUR_STEPS.length) {
            btnNext.innerHTML = '<span>เสร็จสิ้นการแนะนำ 🎉</span>';
        } else {
            btnNext.innerHTML = '<span>ถัดไป</span><i class="fa-solid fa-arrow-right ml-1"></i>';
        }
    }
}

function nextTourStep() {
    if (currentTourStep < TOUR_STEPS.length) {
        currentTourStep++;
        updateTourView();
    } else {
        closeWelcomeTour();
        showToast('🎉 ยินดีด้วยค่ะ! ท่านพร้อมเริ่มต้นใช้งานระบบแล้ว', 'success');
    }
}

function prevTourStep() {
    if (currentTourStep > 1) {
        currentTourStep--;
        updateTourView();
    }
}
`;

appJs += '\n' + phase2EngineCode + '\nwindow.renderAchievementBadges = renderAchievementBadges;\nwindow.startWelcomeTour = startWelcomeTour;\nwindow.closeWelcomeTour = closeWelcomeTour;\nwindow.nextTourStep = nextTourStep;\nwindow.prevTourStep = prevTourStep;\n';

// Make sure renderAllViews calls renderAchievementBadges()
appJs = appJs.replace('function renderAllViews() {', 'function renderAllViews() {\n    renderAchievementBadges();');

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Phase 2 features (PWA, Badges, Onboarding) integrated successfully into app.js!');
