const fs = require('fs');
const path = require('path');

console.log('=== ADDING M10 LOGIC ENGINE INTO APP.JS ===');

const baseDir = path.join(__dirname, '..');
const appJsPath = path.join(baseDir, 'app.js');
const schemaPath = path.join(baseDir, '01_data/pa_evidence_schema.json');

const paSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
let appJs = fs.readFileSync(appJsPath, 'utf8');

// 1. Add paEvidence into defaultAppData
const defaultAppDataRegex = /const defaultAppData = \{[\s\S]*?theme:\s*"theme-light"\s*\};/;
const defaultAppDataMatch = appJs.match(defaultAppDataRegex);

if (defaultAppDataMatch && !appJs.includes('paEvidence:')) {
    const paSchemaString = JSON.stringify(paSchema, null, 8);
    const updatedDefaultAppData = defaultAppDataMatch[0].replace(
        'theme: "theme-light"',
        `paEvidence: ${paSchemaString},\n    theme: "theme-light"`
    );
    appJs = appJs.replace(defaultAppDataMatch[0], updatedDefaultAppData);
    console.log('✓ Injected default paEvidence schema into defaultAppData');
}

// 2. Ensure loadSavedState preserves and initializes paEvidence
const loadSavedStateRegex = /appState = \{ \.\.\.defaultAppData, \.\.\.parsed \};/;
if (appJs.includes('appState = { ...defaultAppData, ...parsed };')) {
    const paStateCheck = `appState = { ...defaultAppData, ...parsed };

            // Ensure paEvidence is populated and resilient
            if (!parsed.paEvidence || !parsed.paEvidence.aspects || parsed.paEvidence.aspects.length === 0) {
                appState.paEvidence = JSON.parse(JSON.stringify(defaultAppData.paEvidence));
            }`;
    if (!appJs.includes('!parsed.paEvidence')) {
        appJs = appJs.replace('appState = { ...defaultAppData, ...parsed };', paStateCheck);
        console.log('✓ Added paEvidence persistence check in loadSavedState');
    }
}

// 3. Update switchTab to render M10 when switched
const switchTabRegex = /} else if \(tabId === 'm9'\) \{\s*renderM9Views\(\);\s*\}/;
const switchTabReplacement = `} else if (tabId === 'm9') {
        renderM9Views();
    } else if (tabId === 'm10') {
        renderPaEvidenceView();
    }`;

if (appJs.match(switchTabRegex)) {
    appJs = appJs.replace(switchTabRegex, switchTabReplacement);
    console.log('✓ Wired switchTab("m10") to renderPaEvidenceView()');
}

// 4. Append M10 PA Evidence Engine functions at the bottom of app.js
const paEvidenceEngineCode = `

/* ==========================================================================
   MODULE M10: PA EVIDENCE & PERFORMANCE AGREEMENT CONTROLLER
   ========================================================================== */
let paDonutChartInstance = null;
let paHorizontalBarChartInstance = null;
let paStackedBarChartInstance = null;
let paAllAspectsExpanded = false;

function renderPaEvidenceView() {
    if (!appState.paEvidence || !appState.paEvidence.aspects) {
        appState.paEvidence = JSON.parse(JSON.stringify(defaultAppData.paEvidence));
    }

    renderPaMetricCards();
    renderPaAspectsAccordion();
    renderPaEvidenceCharts();
}

function calculatePaMetrics() {
    const pa = appState.paEvidence;
    let totalItems = 0;
    let completedItems = 0;
    let partialItems = 0;
    let pendingItems = 0;

    const aspectStats = [];

    pa.aspects.forEach(asp => {
        let aspTotal = 0;
        let aspCompleted = 0;
        let aspPartial = 0;
        let aspPending = 0;

        asp.indicators.forEach(ind => {
            const count = ind.targetItems || 1;
            aspTotal += count;
            totalItems += count;

            if (ind.status === 'COMPLETED') {
                aspCompleted += count;
                completedItems += count;
            } else if (ind.status === 'PARTIAL') {
                aspPartial += count;
                partialItems += count;
            } else {
                aspPending += count;
                pendingItems += count;
            }
        });

        const aspProgressPct = aspTotal > 0 ? Math.round((aspCompleted / aspTotal) * 100) : 0;
        aspectStats.push({
            id: asp.id,
            name: asp.name,
            number: asp.number,
            total: aspTotal,
            completed: aspCompleted,
            partial: aspPartial,
            pending: aspPending,
            progressPct: aspProgressPct
        });
    });

    const overallPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
        totalItems,
        completedItems,
        partialItems,
        pendingItems,
        overallPct,
        aspectStats
    };
}

function renderPaMetricCards() {
    const container = document.getElementById('pa-metric-cards-container');
    if (!container) return;

    const stats = calculatePaMetrics();

    // Radial circumference: 2 * PI * 18 = 113.1
    const circumference = 113.1;
    const strokeDashoffset = circumference - (stats.overallPct / 100) * circumference;

    container.innerHTML = \`
        <!-- Card 1: Total Evidence -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-300 transition">
            <div>
                <p class="text-xs font-semibold text-slate-500">หลักฐานที่ต้องตรวจ</p>
                <h3 class="text-2xl font-black text-slate-800 mt-1">\${stats.totalItems} <span class="text-xs font-normal text-slate-500">รายการ</span></h3>
                <span class="text-[10px] text-blue-600 font-bold">5 ด้าน • 30 ตัวชี้วัด</span>
            </div>
            <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg border border-blue-100 shadow-2xs">
                <i class="fa-solid fa-clipboard-list"></i>
            </div>
        </div>

        <!-- Card 2: Completed -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-300 transition">
            <div>
                <p class="text-xs font-semibold text-slate-500">ครบถ้วนสมบูรณ์</p>
                <h3 class="text-2xl font-black text-emerald-600 mt-1">\${stats.completedItems} <span class="text-xs font-normal text-slate-500">รายการ</span></h3>
                <span class="text-[10px] text-emerald-600 font-bold">✓ พร้อมรับการตรวจ</span>
            </div>
            <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg border border-emerald-100 shadow-2xs">
                <i class="fa-solid fa-folder-open"></i>
            </div>
        </div>

        <!-- Card 3: Partial -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-amber-300 transition">
            <div>
                <p class="text-xs font-semibold text-slate-500">มีรายการแต่ยังไม่ครบ</p>
                <h3 class="text-2xl font-black text-amber-500 mt-1">\${stats.partialItems} <span class="text-xs font-normal text-slate-500">รายการ</span></h3>
                <span class="text-[10px] text-amber-600 font-bold">⚠️ อยู่ระหว่างดำเนินการ</span>
            </div>
            <div class="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg border border-amber-100 shadow-2xs">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
        </div>

        <!-- Card 4: Pending -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-purple-300 transition">
            <div>
                <p class="text-xs font-semibold text-slate-500">ยังไม่ได้ใส่ข้อมูล</p>
                <h3 class="text-2xl font-black text-purple-600 mt-1">\${stats.pendingItems} <span class="text-xs font-normal text-slate-500">รายการ</span></h3>
                <span class="text-[10px] text-purple-500 font-bold">\${100 - stats.overallPct}% ของทั้งหมด</span>
            </div>
            <div class="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg border border-purple-100 shadow-2xs">
                <i class="fa-solid fa-clock"></i>
            </div>
        </div>

        <!-- Card 5: Overall Coverage -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-teal-300 transition">
            <div>
                <p class="text-xs font-semibold text-slate-500">ความครอบคลุมรวม</p>
                <h3 class="text-2xl font-black text-teal-600 mt-1">\${stats.overallPct}%</h3>
                <span class="text-[10px] text-slate-400 font-semibold">\${stats.completedItems} จาก \${stats.totalItems} รายการ</span>
            </div>
            <div class="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg class="w-12 h-12 transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="4" class="text-slate-100" fill="transparent"/>
                    <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="4" class="text-teal-500" fill="transparent" stroke-dasharray="\${circumference}" stroke-dashoffset="\${strokeDashoffset}" stroke-linecap="round"/>
                </svg>
                <span class="absolute text-[10px] font-black text-teal-700">\${stats.overallPct}%</span>
            </div>
        </div>
    \`;
}

function renderPaAspectsAccordion() {
    const container = document.getElementById('pa-aspects-accordion-container');
    if (!container) return;

    const pa = appState.paEvidence;
    const stats = calculatePaMetrics();

    container.innerHTML = pa.aspects.map((asp, idx) => {
        const aspStat = stats.aspectStats[idx];
        const isCompleted = aspStat.completed === aspStat.total;
        
        return \`
            <div class="aspect-accordion-item" id="accordion-\${asp.id}">
                <!-- Accordion Header -->
                <div onclick="togglePaAspectAccordion('\${asp.id}')" class="p-4 hover:bg-slate-50/80 transition flex items-center justify-between cursor-pointer select-none">
                    <div class="flex items-center gap-3">
                        <span class="w-7 h-7 rounded-xl \${asp.badgeClass} text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                            \${asp.number}
                        </span>
                        <div>
                            <p class="font-bold text-slate-800 text-sm leading-snug">\${asp.name}</p>
                            <p class="text-slate-400 text-[11px] mt-0.5">\${asp.totalIndicators} ตัวชี้วัด • \${asp.totalEvidenceItems} รายการหลักฐาน</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <span class="font-bold text-slate-700 text-xs">\${aspStat.completed}/\${aspStat.total} รายการ</span>
                            <span class="text-teal-600 font-bold ml-1">• \${aspStat.progressPct}%</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200" id="icon-chevron-\${asp.id}"></i>
                    </div>
                </div>

                <!-- Accordion Content / Indicators List -->
                <div class="hidden bg-slate-50/50 p-4 pt-1 space-y-2.5 border-t border-slate-100" id="content-\${asp.id}">
                    <div class="grid grid-cols-1 gap-2.5 pt-2">
                        \${asp.indicators.map(ind => {
                            const badge = ind.status === 'COMPLETED'
                                ? '<span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px]">✓ ครบถ้วน</span>'
                                : ind.status === 'PARTIAL'
                                ? '<span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px]">⚠️ บางส่วน</span>'
                                : '<span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[10px]">⏳ ยังไม่ใส่</span>';

                            return \`
                                <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div class="flex items-start gap-2.5 flex-1 min-w-0">
                                        <span class="px-1.5 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-600 text-[11px] shrink-0">
                                            \${ind.code}
                                        </span>
                                        <div class="min-w-0">
                                            <h5 class="font-bold text-slate-800 text-xs">\${ind.title}</h5>
                                            \${ind.evidenceTitle ? \`
                                                <div class="text-[11px] text-slate-600 mt-1 truncate" title="\${ind.evidenceTitle}">
                                                    📄 <strong>หลักฐาน:</strong> \${ind.evidenceTitle}
                                                </div>
                                            \` : \`
                                                <div class="text-[11px] text-slate-400 mt-0.5 italic">
                                                    ยังไม่ได้ระบุเอกสารหลักฐาน
                                                </div>
                                            \`}
                                            \${ind.notes ? \`
                                                <p class="text-[10px] text-slate-500 mt-0.5 line-clamp-1"><i class="fa-regular fa-comment-dots mr-1"></i>\${ind.notes}</p>
                                            \` : ''}
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                        \${badge}
                                        <span class="text-[11px] text-slate-500 font-semibold">\${ind.targetItems || 1} รายการ</span>
                                        \${ind.evidenceUrl ? \`
                                            <a href="\${ind.evidenceUrl}" target="_blank" class="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-[11px] border border-teal-200 transition flex items-center gap-1 shadow-2xs" title="เปิดไฟล์หลักฐาน">
                                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                <span>ดูไฟล์</span>
                                            </a>
                                        \` : ''}
                                        <button type="button" onclick="openPaEvidenceModal('\${asp.id}', '\${ind.id}')" class="px-2.5 py-1 rounded-lg bg-govNavy hover:bg-govNavyDark text-white font-bold text-[11px] shadow-2xs transition cursor-pointer flex items-center gap-1">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                            <span>จัดการ</span>
                                        </button>
                                    </div>
                                </div>
                            \`;
                        }).join('')}
                    </div>
                </div>
            </div>
        \`;
    }).join('');
}

function togglePaAspectAccordion(aspectId) {
    const content = document.getElementById(\`content-\${aspectId}\`);
    const icon = document.getElementById(\`icon-chevron-\${aspectId}\`);
    if (!content) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
    }
}

function openAllPaAspectsToggle() {
    paAllAspectsExpanded = !paAllAspectsExpanded;
    const btnLabel = document.getElementById('label-toggle-all-aspects');
    
    appState.paEvidence.aspects.forEach(asp => {
        const content = document.getElementById(\`content-\${asp.id}\`);
        const icon = document.getElementById(\`icon-chevron-\${asp.id}\`);
        if (content) {
            if (paAllAspectsExpanded) {
                content.classList.remove('hidden');
                if (icon) icon.classList.add('rotate-180');
            } else {
                content.classList.add('hidden');
                if (icon) icon.classList.remove('rotate-180');
            }
        }
    });

    if (btnLabel) {
        btnLabel.innerText = paAllAspectsExpanded ? 'ย่อทั้งหมด' : 'ขยายทั้งหมด';
    }
}

function renderPaEvidenceCharts() {
    if (typeof Chart === 'undefined') return;

    const stats = calculatePaMetrics();

    // 1. Donut Chart
    const ctxDonut = document.getElementById('paDonutChart');
    if (ctxDonut) {
        if (paDonutChartInstance) paDonutChartInstance.destroy();

        paDonutChartInstance = new Chart(ctxDonut.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['ครบถ้วน', 'บางส่วน', 'ยังไม่ได้ใส่'],
                datasets: [{
                    data: [stats.completedItems, stats.partialItems, stats.pendingItems],
                    backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Donut Legend
        const legendContainer = document.getElementById('pa-donut-legend-container');
        if (legendContainer) {
            legendContainer.innerHTML = \`
                <div class="flex justify-between items-center text-slate-600">
                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> ครบถ้วน</span>
                    <span class="font-bold text-emerald-700">\${stats.completedItems} รายการ (\${stats.overallPct}%)</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400"></span> บางส่วน</span>
                    <span class="font-bold text-amber-700">\${stats.partialItems} รายการ (\${Math.round((stats.partialItems / stats.totalItems) * 100)}%)</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500"></span> ยังไม่ได้ใส่</span>
                    <span class="font-bold text-rose-700">\${stats.pendingItems} รายการ (\${Math.round((stats.pendingItems / stats.totalItems) * 100)}%)</span>
                </div>
                <div class="flex justify-between items-center text-slate-800 font-bold pt-1.5 border-t border-dashed border-slate-200 text-[11px]">
                    <span>รวมทั้งสิ้น</span>
                    <span>\${stats.totalItems} รายการ</span>
                </div>
            \`;
        }
    }

    // 2. Horizontal Bar Chart (Progress %)
    const ctxHBar = document.getElementById('paHorizontalBarChart');
    if (ctxHBar) {
        if (paHorizontalBarChartInstance) paHorizontalBarChartInstance.destroy();

        const labels = stats.aspectStats.map(a => \`\${a.number}. \${a.name.substring(0, 18)}...\`);
        const progressData = stats.aspectStats.map(a => a.progressPct);

        paHorizontalBarChartInstance = new Chart(ctxHBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: progressData,
                    backgroundColor: '#0284c7',
                    borderRadius: 6,
                    barThickness: 16
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: value => value + '%',
                            font: { size: 10 }
                        },
                        grid: { color: '#f1f5f9' }
                    },
                    y: {
                        ticks: { font: { size: 10 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 3. Stacked Bar Chart (Items Count)
    const ctxSBar = document.getElementById('paStackedBarChart');
    if (ctxSBar) {
        if (paStackedBarChartInstance) paStackedBarChartInstance.destroy();

        const labels = stats.aspectStats.map(a => \`ด้านที่ \${a.number}\`);
        const completedData = stats.aspectStats.map(a => a.completed + a.partial);
        const pendingData = stats.aspectStats.map(a => a.pending);

        paStackedBarChartInstance = new Chart(ctxSBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'มีข้อมูลแล้ว',
                        data: completedData,
                        backgroundColor: '#10b981',
                        borderRadius: 3
                    },
                    {
                        label: 'ยังไม่ได้ใส่',
                        data: pendingData,
                        backgroundColor: '#f43f5e',
                        borderRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        ticks: { font: { size: 10 } },
                        grid: { display: false }
                    },
                    y: {
                        stacked: true,
                        ticks: { font: { size: 10 } },
                        grid: { color: '#f1f5f9' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function openPaEvidenceModal(aspectId, indicatorId) {
    const asp = appState.paEvidence.aspects.find(a => a.id === aspectId);
    if (!asp) return;

    const ind = asp.indicators.find(i => i.id === indicatorId);
    if (!ind) return;

    setInputValue('modal-pa-aspect-id', aspectId);
    setInputValue('modal-pa-indicator-id', indicatorId);
    setInputValue('modal-pa-indicator-title', \`[\${ind.code}] \${ind.title}\`);
    setInputValue('modal-pa-target-items', ind.targetItems || 1);
    setInputValue('modal-pa-status', ind.status || 'PENDING');
    setInputValue('modal-pa-evidence-title', ind.evidenceTitle || '');
    setInputValue('modal-pa-evidence-url', ind.evidenceUrl || '');
    setInputValue('modal-pa-notes', ind.notes || '');

    setText('modal-pa-title', \`จัดการหลักฐาน: \${ind.code}\`);
    setText('modal-pa-subtitle', \`ด้านที่ \${asp.number}: \${asp.name}\`);

    openModal('modal-pa-evidence-detail');
}

function savePaEvidenceItemModal() {
    const aspectId = getInputValue('modal-pa-aspect-id');
    const indicatorId = getInputValue('modal-pa-indicator-id');

    const asp = appState.paEvidence.aspects.find(a => a.id === aspectId);
    if (!asp) return;

    const ind = asp.indicators.find(i => i.id === indicatorId);
    if (!ind) return;

    ind.targetItems = parseInt(getInputValue('modal-pa-target-items'), 10) || 1;
    ind.status = getInputValue('modal-pa-status') || 'PENDING';
    ind.evidenceTitle = getInputValue('modal-pa-evidence-title')?.trim() || '';
    ind.evidenceUrl = getInputValue('modal-pa-evidence-url')?.trim() || '';
    ind.notes = getInputValue('modal-pa-notes')?.trim() || '';

    saveState();
    closeModal('modal-pa-evidence-detail');
    renderPaEvidenceView();
    showToast(\`บันทึกหลักฐานตัวชี้วัด \${ind.code} เรียบร้อยแล้ว 🎉\`, 'success');
}

async function generatePaEvidenceDetailWithAi() {
    const indTitle = getInputValue('modal-pa-indicator-title');
    const btn = document.getElementById('btn-pa-ai-draft');
    
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = \`<i class="fa-solid fa-spinner fa-spin"></i> <span>AI กำลังร่าง...</span>\`;
    }

    setTimeout(() => {
        const cleanTitle = indTitle.replace(/\\[.*?\\]\\s*/, '');
        const draftedTitle = \`รายงานสรุปผลการปฏิบัติงานและเอกสารเชิงประจักษ์ด้าน "\${cleanTitle}" ประจำปีงบประมาณ 2569\`;
        const draftedNotes = \`ได้ดำเนินการจัดทำคู่มือและรายงานผลสัมฤทธิ์ตามมาตรฐาน ก.พ. พร้อมจัดเก็บเป็นแฟ้มข้อมูลดิจิทัลเพื่อใช้ประกอบการประเมิน PA รอบที่ 1/2569\`;

        setInputValue('modal-pa-evidence-title', draftedTitle);
        setInputValue('modal-pa-notes', draftedNotes);
        setInputValue('modal-pa-status', 'COMPLETED');

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = \`<i class="fa-solid fa-wand-magic-sparkles"></i> <span>✨ AI ช่วยร่างคำอธิบาย</span>\`;
        }

        showToast('AI ร่างคำอธิบายหลักฐานและบันทึกสถานะให้เรียบร้อยแล้ว', 'success');
    }, 450);
}

function generatePaAiOverviewBriefing() {
    const stats = calculatePaMetrics();
    const briefing = \`📊 สรุปรายงานความพร้อม PA ประจำปี 2569:
- ตรวจสอบแล้ว \${stats.completedItems} / \${stats.totalItems} รายการ (\${stats.overallPct}%)
- ด้านที่มีความพร้อมสูงสุด: ด้านที่ 1 (\${stats.aspectStats[0].progressPct}%)
- ข้อเสนอแนะ AI: แนะนำให้เริ่มทยอยจัดเก็บเอกสารด้านที่ 2 (การจัดการศึกษา) และด้านที่ 3 (การศึกษาตลอดชีวิต) โดยแนบลิงก์ Google Drive เพื่อเตรียมพร้อมสำหรับการประเมิน\`;

    alert(briefing);
}

window.renderPaEvidenceView = renderPaEvidenceView;
window.togglePaAspectAccordion = togglePaAspectAccordion;
window.openAllPaAspectsToggle = openAllPaAspectsToggle;
window.openPaEvidenceModal = openPaEvidenceModal;
window.savePaEvidenceItemModal = savePaEvidenceItemModal;
window.generatePaEvidenceDetailWithAi = generatePaEvidenceDetailWithAi;
window.generatePaAiOverviewBriefing = generatePaAiOverviewBriefing;
`;

if (!appJs.includes('MODULE M10: PA EVIDENCE')) {
    appJs += paEvidenceEngineCode;
    console.log('✓ Appended M10 PA Evidence logic engine to app.js');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Successfully saved updated app.js!');
