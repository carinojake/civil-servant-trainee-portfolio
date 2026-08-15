/* ==========================================================================
   Ice Breaking & Equality Activity Forms - JavaScript Logic (icebreaking.js)
   ========================================================================== */

const defaultIceData = {
    sheet1: {
        name: "นายเจค (Jake)",
        nickname: "เจค",
        from: "สายงานเทคโนโลยีสารสนเทศ (ประสบการณ์ 13 ปี)",
        interests: "ระบบฐานข้อมูล, เครือข่ายคอมพิวเตอร์, เทคโนโลยีดิจิทัล และ AI",
        goals: {
            knowledge: true,
            workSkills: true,
            newFriends: true,
            expSharing: true,
            selfDev: true,
            confidence: true,
            careerPath: true,
            other: ""
        },
        mainGoal: "นำทักษะความรู้ไปประยุกต์ใช้ในการปฏิบัติงานภาครัฐ เพื่อพัฒนางานบริการดิจิทัลให้มีประสิทธิภาพสูงสุด"
    },
    sheet2: {
        friends: [
            { name: "คุณสมชาย (ชาย)", from: "กรุงเทพมหานคร (สายงานเอกสาร/สารบรรณ)", interests: "อ่านหนังสือประวัติศาสตร์, เทคโนโลยีสารสนเทศ", expectation: "เข้าใจระเบียบสารบรรณภาครัฐ และพัฒนางานเอกสารอิเล็กทรอนิกส์" },
            { name: "คุณกานดา (ไหม)", from: "จ.นนทบุรี (อดีตเจ้าหน้าที่ฝ่ายการเงิน)", interests: "การคำนวณ, ตาราง Excel, การทำขนม", expectation: "เรียนรู้ระบบงบประมาณภาครัฐ และสร้างเครือข่ายเพื่อนร่วมงาน" },
            { name: "คุณธนกฤต (นัท)", from: "จ.ปทุมธานี (สายงานประชาสัมพันธ์)", interests: "งานออกแบบ กราฟิก Canva, การถ่ายภาพ", expectation: "พัฒนาทักษะการสื่อสารองค์กร และนำทักษะสื่อดิจิทัลมาใช้นำเสนอผลงาน" },
            { name: "คุณวรรณิสา (ฝน)", from: "จ.สมุทรปราการ (สายงานบริหารทั่วไป)", interests: "การบริการ, จัดกิจกรรมกลุ่ม, ฟังเพลง", expectation: "ปรับตัวเข้ากับวัฒนธรรมองค์กรภาครัฐ และเพิ่มความมั่นใจในการทำงานร่วมกัน" },
            { name: "คุณณัฐพงศ์ (ท็อป)", from: "จ.ชลบุรี (สายงานสนับสนุนไอที)", interests: "ประกอบคอมพิวเตอร์, เขียนโปรแกรมพื้นฐาน", expectation: "ต่อยอดทักษะไอทีเพื่อรองรับนโยบายรัฐบาลดิจิทัล (Digital Government)" }
        ],
        deepDive: {
            name: "คุณณัฐพงศ์ (ท็อป)",
            learned: "มีความมุ่งมั่นในการพัฒนางานสายสนับสนุนไอที และสนใจเทคโนโลยีใหม่ๆ เช่นเดียวกัน",
            commonInterests: "ความสนใจในเทคโนโลยีคอมพิวเตอร์ การพัฒนาระบบ และไอทีภาครัฐ",
            impression: "การเปิดกว้างพร้อมแบ่งปันความรู้ ความเป็นกันเอง และความกระตือรือร้นในการเรียนรู้"
        }
    },
    sheet3: {
        commMethods: {
            speak: true,
            write: true,
            signLang: false,
            techDevice: true,
            assistant: false,
            visualRead: false
        },
        facilitationNeeded: "การสื่อสารที่ชัดเจน, เอกสารรูปแบบดิจิทัลที่เข้าถึงง่าย (Accessibility Format) และการเปิดโอกาสให้แลกเปลี่ยนความคิดเห็นกันอย่างทั่วถึง",
        gainedToday: {
            newFriends: true,
            inspiration: true,
            expSharing: true,
            newIdeas: true,
            confidence: true,
            futureActivities: true,
            other: ""
        },
        heartQuote: "ยินดีที่ได้รู้จักและพร้อมเติบโตไปด้วยกันครับ"
    }
};

let iceData = JSON.parse(JSON.stringify(defaultIceData));
let currentSheet = 1;
let currentZoom = 1.0;
const ICE_STORAGE_KEY = 'jake_icebreaking_data';

document.addEventListener('DOMContentLoaded', () => {
    loadIceStorage();
    selectSheet(1);
});

function loadIceStorage() {
    try {
        const saved = localStorage.getItem(ICE_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.sheet2 && parsed.sheet2.friends && parsed.sheet2.friends[0] && (parsed.sheet2.friends[0].name.includes('กรอกชื่อเพื่อน') || parsed.sheet2.friends[0].name === '')) {
                parsed.sheet2 = JSON.parse(JSON.stringify(defaultIceData.sheet2));
            }
            iceData = parsed;
        }
    } catch (e) {
        console.error('Failed to load local storage:', e);
    }
}

function saveIceStorage() {
    try {
        localStorage.setItem(ICE_STORAGE_KEY, JSON.stringify(iceData));
        showToast('💾 บันทึกข้อมูลลงเครื่องเรียบร้อยแล้ว');
    } catch (e) {
        console.error('Failed to save to local storage:', e);
    }
}

function selectSheet(sheetNum) {
    currentSheet = sheetNum;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.sheet) === sheetNum);
    });

    const titles = [
        "ใบงานที่ 1: รู้จักฉัน รู้จักเธอ",
        "ใบงานที่ 2: สมุดบันทึกเพื่อนใหม่ (5 คน)",
        "ใบงานที่ 3: แบบบันทึกการมีส่วนร่วมอย่างเท่าเทียม"
    ];
    document.getElementById('currentSheetTitle').innerText = `📄 ${titles[sheetNum - 1]}`;

    renderIceForm(sheetNum);
    renderIceCanvas(sheetNum);
}

/* ==========================================================================
   Form Editor Renderer
   ========================================================================== */
function renderIceForm(sheetNum) {
    const container = document.getElementById('iceFormContainer');
    container.innerHTML = '';

    if (sheetNum === 1) {
        container.innerHTML = `
            <div class="form-card">
                <div class="form-card-title">👤 ข้อมูลของฉัน</div>
                <div class="form-group">
                    <label>ชื่อ-นามสกุล:</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet1.name)}" oninput="updateSheet1('name', this.value)">
                </div>
                <div class="form-group">
                    <label>ชื่อที่อยากให้เพื่อนเรียก:</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet1.nickname)}" oninput="updateSheet1('nickname', this.value)">
                </div>
                <div class="form-group">
                    <label>มาจากไหน (สังกัด/หน่วยงาน/จังหวัด):</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet1.from)}" oninput="updateSheet1('from', this.value)">
                </div>
                <div class="form-group">
                    <label>สิ่งที่ฉันสนใจหรือชอบ:</label>
                    <textarea class="form-control" oninput="updateSheet1('interests', this.value)">${escapeHtml(iceData.sheet1.interests)}</textarea>
                </div>
            </div>

            <div class="form-card">
                <div class="form-card-title">🎯 เป้าหมายและความคาดหวังของฉัน</div>
                <div class="checkbox-grid">
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet1.goals.knowledge ? 'checked' : ''} onchange="updateSheet1Goal('knowledge', this.checked)"> ได้ความรู้ใหม่
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet1.goals.workSkills ? 'checked' : ''} onchange="updateSheet1Goal('workSkills', this.checked)"> ได้ทักษะการทำงาน
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet1.goals.newFriends ? 'checked' : ''} onchange="updateSheet1Goal('newFriends', this.checked)"> ได้รู้จักเพื่อนใหม่
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet1.goals.expSharing ? 'checked' : ''} onchange="updateSheet1Goal('expSharing', this.checked)"> ได้แลกเปลี่ยนประสบการณ์
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet1.goals.selfDev ? 'checked' : ''} onchange="updateSheet1Goal('selfDev', this.checked)"> พัฒนาตนเอง
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet1.goals.confidence ? 'checked' : ''} onchange="updateSheet1Goal('confidence', this.checked)"> เพิ่มความมั่นใจ
                    </label>
                    <label class="checkbox-label" style="grid-column: span 2;">
                        <input type="checkbox" ${iceData.sheet1.goals.careerPath ? 'checked' : ''} onchange="updateSheet1Goal('careerPath', this.checked)"> ได้แนวทางประกอบอาชีพ
                    </label>
                </div>
                <div class="form-group" style="margin-top:10px;">
                    <label>อื่น ๆ (ระบุเพิ่มเติม):</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet1.goals.other || '')}" oninput="updateSheet1Goal('other', this.value)">
                </div>
                <div class="form-group" style="margin-top:10px;">
                    <label>เป้าหมายสำคัญที่สุดของฉัน: หลังจบหลักสูตร:</label>
                    <textarea class="form-control" style="min-height:70px;" oninput="updateSheet1('mainGoal', this.value)">${escapeHtml(iceData.sheet1.mainGoal)}</textarea>
                </div>
            </div>
        `;
    } else if (sheetNum === 2) {
        let sampleBtnHtml = `
            <button class="btn btn-primary btn-sm" style="width:100%;margin-bottom:12px;background:linear-gradient(135deg, #0284C7, #0D9488);" onclick="loadSampleFriends()">
                <i class="fa-solid fa-wand-magic-sparkles"></i> เติมข้อมูลเพื่อนจำลอง 5 คนอัตโนมัติ
            </button>
        `;
        let friendsFormHtml = iceData.sheet2.friends.map((f, idx) => `
            <div class="form-card" style="margin-bottom:10px;">
                <div class="form-card-title">
                    <span>🤝 เพื่อนคนที่ ${idx + 1}</span>
                    <button class="btn btn-warning btn-sm" onclick="clearFriendRow(${idx})" title="ล้างข้อมูลแถวนี้"><i class="fa-solid fa-eraser"></i> ล้าง</button>
                </div>
                <div class="form-group">
                    <label>ชื่อเพื่อน:</label>
                    <input type="text" class="form-control" value="${escapeHtml(f.name)}" oninput="updateFriend(${idx}, 'name', this.value)">
                </div>
                <div class="form-group">
                    <label>มาจากไหน (หน่วยงาน/จังหวัด):</label>
                    <input type="text" class="form-control" value="${escapeHtml(f.from)}" oninput="updateFriend(${idx}, 'from', this.value)">
                </div>
                <div class="form-group">
                    <label>สิ่งที่สนใจ / ชอบ:</label>
                    <input type="text" class="form-control" value="${escapeHtml(f.interests)}" oninput="updateFriend(${idx}, 'interests', this.value)">
                </div>
                <div class="form-group">
                    <label>สิ่งที่คาดหวังจากหลักสูตร:</label>
                    <input type="text" class="form-control" value="${escapeHtml(f.expectation)}" oninput="updateFriend(${idx}, 'expectation', this.value)">
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            ${sampleBtnHtml}
            ${friendsFormHtml}
            <div class="form-card">
                <div class="form-card-title">💬 เพื่อนที่ฉันอยากรู้จักมากขึ้น</div>
                <div class="form-group">
                    <label>ชื่อเพื่อน:</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet2.deepDive.name)}" oninput="updateDeepDive('name', this.value)">
                </div>
                <div class="form-group">
                    <label>สิ่งที่ฉันได้เรียนรู้เกี่ยวกับเพื่อน:</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet2.deepDive.learned)}" oninput="updateDeepDive('learned', this.value)">
                </div>
                <div class="form-group">
                    <label>สิ่งที่เรามีความสนใจเหมือนกัน:</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet2.deepDive.commonInterests)}" oninput="updateDeepDive('commonInterests', this.value)">
                </div>
                <div class="form-group">
                    <label>สิ่งหนึ่งที่ฉันประทับใจจากการพูดคุย:</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet2.deepDive.impression)}" oninput="updateDeepDive('impression', this.value)">
                </div>
            </div>
        `;
    } else if (sheetNum === 3) {
        container.innerHTML = `
            <div class="form-card">
                <div class="form-card-title">♿ วิธีสื่อสารที่เลือกใช้</div>
                <div class="checkbox-grid">
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.commMethods.speak ? 'checked' : ''} onchange="updateSheet3Comm('speak', this.checked)"> 🗣️ พูด
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.commMethods.write ? 'checked' : ''} onchange="updateSheet3Comm('write', this.checked)"> ✍️ เขียน
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.commMethods.signLang ? 'checked' : ''} onchange="updateSheet3Comm('signLang', this.checked)"> 🤟 ภาษามือ
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.commMethods.techDevice ? 'checked' : ''} onchange="updateSheet3Comm('techDevice', this.checked)"> 🧮 อุปกรณ์สื่อสาร / คอมพิวเตอร์
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.commMethods.assistant ? 'checked' : ''} onchange="updateSheet3Comm('assistant', this.checked)"> 👥 ให้ผู้ช่วย/เพื่อนช่วยสื่อสาร
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.commMethods.visualRead ? 'checked' : ''} onchange="updateSheet3Comm('visualRead', this.checked)"> 👓 อ่าน/ดูภาพหรือข้อความ
                    </label>
                </div>
            </div>

            <div class="form-card">
                <div class="form-card-title">📝 สิ่งที่อยากให้วิทยากร/เพื่อนช่วยอำนวยความสะดวก</div>
                <div class="form-group">
                    <textarea class="form-control" style="min-height:80px;" oninput="updateSheet3('facilitationNeeded', this.value)">${escapeHtml(iceData.sheet3.facilitationNeeded)}</textarea>
                </div>
            </div>

            <div class="form-card">
                <div class="form-card-title">📡 วันนี้ฉันได้อะไรจากการรู้จักเพื่อนใหม่?</div>
                <div class="checkbox-grid">
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.gainedToday.newFriends ? 'checked' : ''} onchange="updateSheet3Gained('newFriends', this.checked)"> ได้เพื่อนใหม่
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.gainedToday.inspiration ? 'checked' : ''} onchange="updateSheet3Gained('inspiration', this.checked)"> ได้แรงบันดาลใจ
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.gainedToday.expSharing ? 'checked' : ''} onchange="updateSheet3Gained('expSharing', this.checked)"> ได้แลกเปลี่ยนประสบการณ์
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.gainedToday.newIdeas ? 'checked' : ''} onchange="updateSheet3Gained('newIdeas', this.checked)"> ได้แนวคิดใหม่
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.gainedToday.confidence ? 'checked' : ''} onchange="updateSheet3Gained('confidence', this.checked)"> รู้สึกมั่นใจมากยิ่งขึ้น
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" ${iceData.sheet3.gainedToday.futureActivities ? 'checked' : ''} onchange="updateSheet3Gained('futureActivities', this.checked)"> อยากร่วมกิจกรรมกับเพื่อนอีก
                    </label>
                </div>
                <div class="form-group" style="margin-top:10px;">
                    <label>อื่น ๆ (ระบุเพิ่มเติม):</label>
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet3.gainedToday.other || '')}" oninput="updateSheet3Gained('other', this.value)">
                </div>
            </div>

            <div class="form-card">
                <div class="form-card-title">🖤 หนึ่งคำจากใจของฉัน</div>
                <div class="form-group">
                    <input type="text" class="form-control" value="${escapeHtml(iceData.sheet3.heartQuote)}" oninput="updateSheet3('heartQuote', this.value)">
                </div>
            </div>
        `;
    }
}

/* ==========================================================================
   Live Canvas A4 Sheet Renderer
   ========================================================================== */
function renderIceCanvas(sheetNum) {
    const canvas = document.getElementById('iceA4Canvas');
    canvas.innerHTML = getSheetHtml(sheetNum);
}

function getSheetHtml(sheetNum) {
    if (sheetNum === 1) {
        const s1 = iceData.sheet1;
        const g = s1.goals;
        return `
            <div class="sheet-header-box">
                <div class="sheet-title">🌸 กิจกรรมสร้างความคุ้นเคย (Ice Breaking)</div>
                <div class="sheet-subtitle">"รู้จักฉัน รู้จักเธอ"</div>
                <div class="sheet-desc">ทำความรู้จักเพื่อนใหม่ • แบ่งปันเป้าหมาย • สร้างเครือข่าย</div>
            </div>

            <div class="rules-box">
                <div class="rules-box-title">💡 วิธีทำกิจกรรม:</div>
                <ol>
                    <li>แนะนำตัวตามความสะดวกในการสื่อสาร</li>
                    <li>พูดคุยกับเพื่อนใหม่อย่างน้อย 2 คน</li>
                    <li>บันทึกเฉพาะข้อมูลที่เพื่อนยินดีแบ่งปัน</li>
                    <li>ทุกคนเลือกได้ว่าจะ "พูด • เขียน • ใช้ภาษามือ • ใช้อุปกรณ์สื่อสาร"</li>
                </ol>
            </div>

            <div class="paper-section-title">👤 ข้อมูลของฉัน</div>
            <div class="dotted-row">
                <span class="dotted-label">ชื่อ-นามสกุล:</span>
                <span class="dotted-val">${escapeHtml(s1.name)}</span>
            </div>
            <div class="dotted-row">
                <span class="dotted-label">ชื่อที่อยากให้เพื่อนเรียก:</span>
                <span class="dotted-val">${escapeHtml(s1.nickname)}</span>
            </div>
            <div class="dotted-row">
                <span class="dotted-label">มาจากไหน:</span>
                <span class="dotted-val">${escapeHtml(s1.from)}</span>
            </div>
            <div class="dotted-row">
                <span class="dotted-label">สิ่งที่ฉันสนใจหรือชอบ:</span>
                <span class="dotted-val">${escapeHtml(s1.interests)}</span>
            </div>

            <div class="paper-section-title" style="margin-top:16px;">🎯 เป้าหมายและความคาดหวังของฉัน</div>
            <div class="paper-checkbox-grid">
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.knowledge ? 'checked' : ''}">${g.knowledge ? '✓' : ''}</span>
                    <span>ได้ความรู้ใหม่</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.workSkills ? 'checked' : ''}">${g.workSkills ? '✓' : ''}</span>
                    <span>ได้ทักษะการทำงาน</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.newFriends ? 'checked' : ''}">${g.newFriends ? '✓' : ''}</span>
                    <span>ได้รู้จักเพื่อนใหม่</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.expSharing ? 'checked' : ''}">${g.expSharing ? '✓' : ''}</span>
                    <span>ได้แลกเปลี่ยนประสบการณ์</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.selfDev ? 'checked' : ''}">${g.selfDev ? '✓' : ''}</span>
                    <span>พัฒนาตนเอง</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.confidence ? 'checked' : ''}">${g.confidence ? '✓' : ''}</span>
                    <span>เพิ่มความมั่นใจ</span>
                </div>
                <div class="paper-checkbox-item" style="grid-column: span 2;">
                    <span class="paper-checkbox-box ${g.careerPath ? 'checked' : ''}">${g.careerPath ? '✓' : ''}</span>
                    <span>ได้แนวทางประกอบอาชีพ</span>
                </div>
            </div>

            <div class="dotted-row">
                <span class="dotted-label">อื่น ๆ:</span>
                <span class="dotted-val">${escapeHtml(g.other || '')}</span>
            </div>

            <div style="margin-top:14px;">
                <div style="font-size:12px;font-weight:700;color:#0F172A;margin-bottom:4px;">
                    เป้าหมายสำคัญที่สุดของฉัน: หลังจบหลักสูตร
                </div>
                <div class="dotted-lines-box">
                    <div class="dotted-line-item">${escapeHtml(s1.mainGoal)}</div>
                    <div class="dotted-line-item"></div>
                    <div class="dotted-line-item"></div>
                </div>
            </div>
        `;
    } else if (sheetNum === 2) {
        const s2 = iceData.sheet2;
        let tableRows = s2.friends.map((f, i) => `
            <tr>
                <td class="col-num">${i + 1}</td>
                <td class="col-name">${escapeHtml(f.name)}</td>
                <td class="col-from">${escapeHtml(f.from)}</td>
                <td class="col-interests">${escapeHtml(f.interests)}</td>
                <td class="col-expect">${escapeHtml(f.expectation)}</td>
            </tr>
        `).join('');

        return `
            <div class="sheet-header-box">
                <div class="sheet-title">🤝 สมุดบันทึกเพื่อนใหม่</div>
                <div class="sheet-subtitle">"รู้จักเพื่อน 1 คน = สร้างโอกาส 1 เครือข่าย"</div>
                <div class="sheet-desc" style="margin-top:6px;background:#F8FAFC;padding:4px 10px;border-radius:4px;border:1px solid #CBD5E1;">
                    คำชี้แจง: พูดคุยกับเพื่อนตามความสะดวก และจดบันทึกเฉพาะข้อมูลที่เพื่อนยินดีแบ่งปัน
                </div>
            </div>

            <table class="friends-table">
                <thead>
                    <tr>
                        <th class="col-num">ลำดับ</th>
                        <th class="col-name">👤 ชื่อเพื่อน</th>
                        <th class="col-from">🏢 มาจากไหน</th>
                        <th class="col-interests">⭐ สิ่งที่สนใจ / ชอบ</th>
                        <th class="col-expect">🎯 สิ่งที่คาดหวังจากหลักสูตร</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>

            <div class="paper-section-title" style="margin-top:20px;">💬 เพื่อนที่ฉันอยากรู้จักมากขึ้น</div>
            <div class="dotted-row">
                <span class="dotted-label">ชื่อเพื่อน:</span>
                <span class="dotted-val">${escapeHtml(s2.deepDive.name)}</span>
            </div>
            <div class="dotted-row">
                <span class="dotted-label">สิ่งที่ฉันได้เรียนรู้เกี่ยวกับเพื่อน:</span>
                <span class="dotted-val">${escapeHtml(s2.deepDive.learned)}</span>
            </div>
            <div class="dotted-row">
                <span class="dotted-label">สิ่งที่เรามีความสนใจเหมือนกัน:</span>
                <span class="dotted-val">${escapeHtml(s2.deepDive.commonInterests)}</span>
            </div>
            <div class="dotted-row">
                <span class="dotted-label">สิ่งหนึ่งที่ฉันประทับใจจากการพูดคุย:</span>
                <span class="dotted-val">${escapeHtml(s2.deepDive.impression)}</span>
            </div>
        `;
    } else if (sheetNum === 3) {
        const s3 = iceData.sheet3;
        const c = s3.commMethods;
        const g = s3.gainedToday;

        return `
            <div class="sheet-header-box">
                <div class="sheet-title">♿ แบบบันทึกการมีส่วนร่วมอย่างเท่าเทียม</div>
                <div class="sheet-subtitle">เลือกวิธีที่สะดวกและเหมาะกับตนเองได้</div>
            </div>

            <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:6px;padding:10px;margin-bottom:14px;">
                <div class="comm-grid">
                    <div class="comm-card ${c.speak ? 'selected' : ''}">🗣️ พูด ${c.speak ? '✓' : ''}</div>
                    <div class="comm-card ${c.write ? 'selected' : ''}">✍️ เขียน ${c.write ? '✓' : ''}</div>
                    <div class="comm-card ${c.signLang ? 'selected' : ''}">🤟 ภาษามือ ${c.signLang ? '✓' : ''}</div>
                    <div class="comm-card ${c.techDevice ? 'selected' : ''}">🧮 อุปกรณ์สื่อสาร ${c.techDevice ? '✓' : ''}</div>
                    <div class="comm-card ${c.assistant ? 'selected' : ''}">👥 ให้ผู้ช่วย/เพื่อนช่วย ${c.assistant ? '✓' : ''}</div>
                    <div class="comm-card ${c.visualRead ? 'selected' : ''}">👓 อ่าน/ดูภาพหรือข้อความ ${c.visualRead ? '✓' : ''}</div>
                </div>
                <div style="font-size:10px;color:#64748B;text-align:center;">
                    ทุกวิธีก่อเกิดคุณค่าเท่าเทียมกัน และไม่จำเป็นต้องเปิดเผยประเภทหรือรายละเอียดความพิการ
                </div>
            </div>

            <div class="paper-section-title">📝 สิ่งที่ฉันอยากให้วิทยากร/เพื่อนช่วยอำนวยความสะดวก</div>
            <div class="dotted-lines-box">
                <div class="dotted-line-item">${escapeHtml(s3.facilitationNeeded)}</div>
                <div class="dotted-line-item"></div>
                <div class="dotted-line-item"></div>
            </div>

            <div class="paper-section-title" style="margin-top:18px;">📡 วันนี้ฉันได้อะไรจากการรู้จักเพื่อนใหม่?</div>
            <div class="paper-checkbox-grid">
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.newFriends ? 'checked' : ''}">${g.newFriends ? '✓' : ''}</span>
                    <span>ได้เพื่อนใหม่</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.inspiration ? 'checked' : ''}">${g.inspiration ? '✓' : ''}</span>
                    <span>ได้แรงบันดาลใจ</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.expSharing ? 'checked' : ''}">${g.expSharing ? '✓' : ''}</span>
                    <span>ได้แลกเปลี่ยนประสบการณ์</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.newIdeas ? 'checked' : ''}">${g.newIdeas ? '✓' : ''}</span>
                    <span>ได้แนวคิดใหม่</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.confidence ? 'checked' : ''}">${g.confidence ? '✓' : ''}</span>
                    <span>รู้สึกมั่นใจมากยิ่งขึ้น</span>
                </div>
                <div class="paper-checkbox-item">
                    <span class="paper-checkbox-box ${g.futureActivities ? 'checked' : ''}">${g.futureActivities ? '✓' : ''}</span>
                    <span>อยากร่วมกิจกรรมกับเพื่อนอีก</span>
                </div>
            </div>

            <div class="dotted-row">
                <span class="dotted-label">อื่น ๆ:</span>
                <span class="dotted-val">${escapeHtml(g.other || '')}</span>
            </div>

            <div class="paper-section-title" style="margin-top:18px;">🖤 หนึ่งคำจากใจของฉัน</div>
            <div class="dotted-lines-box">
                <div class="dotted-line-item" style="font-size:14px;font-weight:700;color:#0369A1;text-align:center;">${escapeHtml(s3.heartQuote)}</div>
            </div>

            <div style="margin-top:24px;text-align:center;font-size:13px;font-weight:700;color:#0F172A;">
                ขอบคุณที่เปิดใจทำความรู้จักกัน 🌸
            </div>
        `;
    }
}

/* ==========================================================================
   State Updating Helpers
   ========================================================================== */
function updateSheet1(field, val) {
    iceData.sheet1[field] = val;
    renderIceCanvas(1);
    saveIceStorage();
}

function updateSheet1Goal(goalKey, val) {
    iceData.sheet1.goals[goalKey] = val;
    renderIceCanvas(1);
    saveIceStorage();
}

function updateFriend(idx, field, val) {
    iceData.sheet2.friends[idx][field] = val;
    renderIceCanvas(2);
    saveIceStorage();
}

function clearFriendRow(idx) {
    iceData.sheet2.friends[idx] = { name: "", from: "", interests: "", expectation: "" };
    renderIceForm(2);
    renderIceCanvas(2);
    saveIceStorage();
}

function loadSampleFriends() {
    iceData.sheet2 = JSON.parse(JSON.stringify(defaultIceData.sheet2));
    saveIceStorage();
    selectSheet(2);
    showToast('✨ เติมข้อมูลเพื่อนจำลอง 5 คนเรียบร้อยแล้ว');
}

function updateDeepDive(field, val) {
    iceData.sheet2.deepDive[field] = val;
    renderIceCanvas(2);
    saveIceStorage();
}

function updateSheet3(field, val) {
    iceData.sheet3[field] = val;
    renderIceCanvas(3);
    saveIceStorage();
}

function updateSheet3Comm(key, val) {
    iceData.sheet3.commMethods[key] = val;
    renderIceCanvas(3);
    saveIceStorage();
}

function updateSheet3Gained(key, val) {
    iceData.sheet3.gainedToday[key] = val;
    renderIceCanvas(3);
    saveIceStorage();
}

/* ==========================================================================
   Zoom Controls & Utilities
   ========================================================================== */
function changeZoom(delta) {
    currentZoom = Math.min(Math.max(0.5, currentZoom + delta), 1.5);
    const canvas = document.getElementById('iceA4Canvas');
    canvas.style.transform = `scale(${currentZoom})`;
    document.getElementById('zoomLevel').innerText = `${Math.round(currentZoom * 100)}%`;
}

function resetZoom() {
    currentZoom = 1.0;
    const canvas = document.getElementById('iceA4Canvas');
    canvas.style.transform = `scale(1.0)`;
    document.getElementById('zoomLevel').innerText = `100%`;
}

function resetIceData() {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นของคุณเจคหรือไม่?')) {
        iceData = JSON.parse(JSON.stringify(defaultIceData));
        saveIceStorage();
        selectSheet(currentSheet);
        showToast('🔄 รีเซ็ตข้อมูลตั้งต้นเรียบร้อยแล้ว');
    }
}

function exportIceJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(iceData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `icebreaking_data_jake_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📥 ส่งออกข้อมูล JSON สำเร็จ');
}

function triggerImportIceJSON() {
    document.getElementById('jsonIceFileInput').click();
}

function importIceJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.sheet1 && imported.sheet2 && imported.sheet3) {
                iceData = imported;
                saveIceStorage();
                selectSheet(currentSheet);
                showToast('📤 นำเข้าข้อมูลสำเร็จ');
            } else {
                alert('รูปแบบไฟล์ JSON ไม่ถูกต้อง');
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
}

function printIceWorksheets() {
    const printContainer = document.getElementById('icePrintContainer');
    printContainer.innerHTML = `
        <div class="print-page">${getSheetHtml(1)}</div>
        <div class="print-page">${getSheetHtml(2)}</div>
        <div class="print-page">${getSheetHtml(3)}</div>
    `;
    window.print();
}

function showToast(msg) {
    const toast = document.getElementById('iceToast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function switchIceTheme(preset) {
    document.body.classList.remove('theme-style-1', 'theme-style-2', 'theme-style-3', 'theme-icebreaking', 'theme-cyber', 'theme-royal');
    
    document.querySelectorAll('.theme-preset-group .btn-theme-chip').forEach(btn => btn.classList.remove('active'));
    
    if (preset === 'style-1') {
        document.body.classList.add('theme-style-1');
        document.getElementById('btnIceStyle1')?.classList.add('active');
    } else if (preset === 'style-2') {
        document.body.classList.add('theme-style-2');
        document.getElementById('btnIceStyle2')?.classList.add('active');
    } else if (preset === 'style-3') {
        document.body.classList.add('theme-style-3');
        document.getElementById('btnIceStyle3')?.classList.add('active');
    }
    showToast(`🎨 สลับดีไซน์เป็น: ${preset === 'style-1' ? 'แบบ 1 Corporate Teal' : preset === 'style-2' ? 'แบบ 2 Cyber Dark' : 'แบบ 3 Royal Minimalist'}`);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
