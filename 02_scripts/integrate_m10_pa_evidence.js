const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const indexHtmlPath = path.join(baseDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Navigation Tab Button
const m9NavBtn = `<button onclick="switchTab('m9')" id="nav-m9" class="tab-btn px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:text-white" role="tab" aria-selected="false">
                    <i class="fa-solid fa-chalkboard-user"></i>
                    <span>M9: ทำเนียบวิทยากร</span>
                </button>`;

const m10NavBtn = `${m9NavBtn}
                <button onclick="switchTab('m10')" id="nav-m10" class="tab-btn px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition border border-teal-400/40 bg-teal-500/10 text-teal-300 hover:text-white" role="tab" aria-selected="false">
                    <i class="fa-solid fa-clipboard-check"></i>
                    <span>M10: ตรวจสอบหลักฐาน PA</span>
                </button>`;

if (!indexHtml.includes('id="nav-m10"')) {
    indexHtml = indexHtml.replace(m9NavBtn, m10NavBtn);
    console.log('✓ Added M10 tab button to navigation bar');
}

// 2. Tab Section HTML
const m10SectionHtml = `
        <!-- ====================================================================
             MODULE M10: PA EVIDENCE & PERFORMANCE AGREEMENT MANAGER
             ==================================================================== -->
        <section id="tab-m10" class="tab-panel hidden space-y-6">
            <!-- Top Header & Actions -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-start sm:items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl border border-teal-200 shrink-0 shadow-xs">
                        <i class="fa-solid fa-clipboard-check"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-xl font-bold text-slate-800">ตรวจสอบหลักฐานร่องรอยรายด้าน (PA Evidence)</h2>
                            <span class="bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
                                เกณฑ์ ก.พ. / PA
                            </span>
                        </div>
                        <p class="text-xs text-slate-500 mt-1">
                            ตรวจสอบความครบถ้วนของหลักฐานร่องรอยรายตัวชี้วัด 5 ด้าน (146 รายการ) พร้อมระบบจัดเก็บไฟล์ Google Drive และสรุปสถิติสด
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2.5 flex-wrap">
                    <div class="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                        <i class="fa-regular fa-calendar text-slate-500"></i>
                        <span>ปีงบประมาณ พ.ศ. 2569</span>
                    </div>
                    <button type="button" onclick="openAllPaAspectsToggle()" id="btn-toggle-all-aspects" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
                        <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                        <span id="label-toggle-all-aspects">ขยายทั้งหมด</span>
                    </button>
                    <button type="button" onclick="generatePaAiOverviewBriefing()" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>✨ AI ประเมินความพร้อม PA</span>
                    </button>
                </div>
            </div>

            <!-- ================= 1. METRIC STAT CARDS ================= -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="pa-metric-cards-container">
                <!-- Dynamic Metric Cards populated by JS -->
            </div>

            <!-- Info Alert Box -->
            <div class="bg-teal-50/80 border border-teal-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-teal-900 shadow-2xs">
                <i class="fa-solid fa-circle-info text-teal-600 mt-0.5 text-base shrink-0"></i>
                <div class="leading-relaxed">
                    <strong>คำแนะนำการจัดเก็บหลักฐาน:</strong> รายการที่เป็น "รายงานหลักฐานร่องรอย" ที่ส่งและยังไม่ส่งจะคำนวณและแสดงเป็นตัวเลขแบบ Real-time เพื่อให้เห็นผลกระทบต่อความเสร็จสิ้นและความสมบูรณ์ของหลักฐานตามเกณฑ์ข้อตกลงในการพัฒนางาน (Performance Agreement)
                </div>
            </div>

            <!-- ================= 2. ASPECT ACCORDION LIST ================= -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-bars-staggered text-teal-600"></i>
                        <span>รายการหลักฐานร่องรอยรายด้าน (5 ด้าน • 146 รายการ)</span>
                    </h3>
                    <div class="flex items-center gap-3 text-xs font-medium">
                        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs"></span> ครบถ้วน</span>
                        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-2xs"></span> บางส่วน</span>
                        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-2xs"></span> ยังไม่ได้ใส่</span>
                    </div>
                </div>

                <div class="divide-y divide-slate-100 text-xs" id="pa-aspects-accordion-container">
                    <!-- Dynamic Accordions injected by JS -->
                </div>
            </div>

            <!-- ================= 3. DASHBOARD SUMMARY CHARTS ================= -->
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-chart-pie text-teal-600"></i>
                        <span>Dashboard สรุปภาพรวมความพร้อม PA (Chart.js Analytics)</span>
                    </h3>
                    <span class="text-xs text-slate-400">อัปเดตอัตโนมัติตามข้อมูลจริง</span>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <!-- Chart 1: Donut Chart -->
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-teal-500"></span> 1. สถานะหลักฐานรวมทั้งระบบ
                            </h4>
                            <p class="text-[11px] text-slate-400 mb-3">สัดส่วนหลักฐานครบถ้วน บางส่วน และยังไม่ได้ใส่</p>
                        </div>
                        <div class="relative flex items-center justify-center h-48 my-2">
                            <canvas id="paDonutChart"></canvas>
                        </div>
                        <div class="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs" id="pa-donut-legend-container">
                            <!-- Dynamic legend -->
                        </div>
                    </div>

                    <!-- Chart 2: Horizontal Bar Chart -->
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-blue-500"></span> 2. ความครอบคลุมรายด้าน (%)
                            </h4>
                            <p class="text-[11px] text-slate-400 mb-3">แสดงสัดส่วนความก้าวหน้าร้อยละของแต่ละด้าน (เป้าหมาย 100%)</p>
                        </div>
                        <div class="relative h-56">
                            <canvas id="paHorizontalBarChart"></canvas>
                        </div>
                        <p class="text-[10px] text-slate-400 text-center mt-2">คำนวณจากอัตราส่วนหลักฐานที่จัดทำเสร็จสิ้น</p>
                    </div>

                    <!-- Chart 3: Stacked Bar Chart -->
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 3. จำนวนหลักฐาน จำแนกตามรายด้าน
                            </h4>
                            <p class="text-[11px] text-slate-400 mb-3">เปรียบเทียบจำนวนที่มีข้อมูลแล้ว vs ยังไม่ได้ใส่ (รวม 146 รายการ)</p>
                        </div>
                        <div class="relative h-56">
                            <canvas id="paStackedBarChart"></canvas>
                        </div>
                        <div class="flex justify-center gap-4 text-[10px] font-semibold text-slate-600 mt-2">
                            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-emerald-500"></span> มีข้อมูลแล้ว</span>
                            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-rose-400"></span> ยังไม่ได้ใส่</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
`;

if (!indexHtml.includes('id="tab-m10"')) {
    indexHtml = indexHtml.replace('</main>', `${m10SectionHtml}\n    </main>`);
    console.log('✓ Injected tab-m10 section into index.html');
}

// 3. Modal HTML
const m10ModalHtml = `
    <!-- ====================================================================
         MODAL: MANAGE PA EVIDENCE ITEM & AI DRAFTING ASSISTANT
         ==================================================================== -->
    <div id="modal-pa-evidence-detail" class="fixed inset-0 bg-govNavy/70 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4 transition-all">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div class="p-5 bg-gradient-to-r from-slate-900 via-teal-900 to-govNavy text-white flex justify-between items-center shrink-0">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-teal-300">
                        <i class="fa-solid fa-file-circle-check"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold" id="modal-pa-title">จัดการหลักฐานร่องรอย</h3>
                        <p class="text-[11px] text-teal-200" id="modal-pa-subtitle">รหัสตัวชี้วัด: -</p>
                    </div>
                </div>
                <button type="button" onclick="closeModal('modal-pa-evidence-detail')" class="text-slate-300 hover:text-white text-lg cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4 text-xs">
                <input type="hidden" id="modal-pa-aspect-id">
                <input type="hidden" id="modal-pa-indicator-id">

                <div>
                    <label class="block font-bold text-slate-700 mb-1">ชื่อตัวชี้วัด / สมรรถนะ</label>
                    <input type="text" id="modal-pa-indicator-title" readonly class="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 font-semibold text-slate-800">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">จำนวนเป้าหมายร่องรอย (รายการ)</label>
                        <input type="number" id="modal-pa-target-items" min="1" max="50" class="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-govNavy">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">สถานะความครบถ้วน</label>
                        <select id="modal-pa-status" class="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-semibold">
                            <option value="COMPLETED">✅ ครบถ้วนสมบูรณ์ (Completed)</option>
                            <option value="PARTIAL">⚠️ มีรายการแต่ยังไม่ครบ / บางส่วน (Partial)</option>
                            <option value="PENDING">⏳ ยังไม่ได้ใส่ข้อมูล (Pending)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-1">
                        <label class="font-bold text-slate-700">ชื่อเอกสาร / รายละเอียดหลักฐานร่องรอย</label>
                        <button type="button" onclick="generatePaEvidenceDetailWithAi()" id="btn-pa-ai-draft" class="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            <span>✨ AI ช่วยร่างคำอธิบาย</span>
                        </button>
                    </div>
                    <input type="text" id="modal-pa-evidence-title" placeholder="เช่น รายงานสรุปผลการจัดทำหลักสูตร, วิจัยชั้นเรียน, สรุปผลสัมฤทธิ์" class="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-800">
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">ลิงก์เอกสารหลักฐาน (Google Drive / Canva / OneDrive / URL)</label>
                    <input type="url" id="modal-pa-evidence-url" placeholder="https://drive.google.com/..." class="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-blue-700 font-mono text-[11px]">
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">บันทึกหมายเหตุ / การนำไปใช้ประโยชน์</label>
                    <textarea id="modal-pa-notes" rows="3" placeholder="ระบุหมายเหตุ ผลกระทบ หรือข้อสังเกตเพิ่มเติม..." class="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-slate-700"></textarea>
                </div>
            </div>

            <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
                <button type="button" onclick="closeModal('modal-pa-evidence-detail')" class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 font-bold cursor-pointer">
                    ยกเลิก
                </button>
                <button type="button" onclick="savePaEvidenceItemModal()" class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md transition cursor-pointer flex items-center gap-1.5">
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>บันทึกหลักฐาน</span>
                </button>
            </div>
        </div>
    </div>
`;

if (!indexHtml.includes('id="modal-pa-evidence-detail"')) {
    indexHtml = indexHtml.replace('</body>', `${m10ModalHtml}\n</body>`);
    console.log('✓ Injected modal-pa-evidence-detail into index.html');
}

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Successfully finalized index.html with M10 Module!');
