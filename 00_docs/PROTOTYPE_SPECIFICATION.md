# ข้อกำหนดการออกแบบ Prototype ระบบบริหารโครงการภาครัฐ 3 รูปแบบ (12 โมดูล + Workflow)

## 1. วัตถุประสงค์
จัดทำ Interactive Prototype สำหรับระบบบริหารโครงการภาครัฐครบ 12 โมดูล พร้อมระบบตรวจทาน อนุมัติ ตรวจสอบประวัติ และมาตรฐานการเข้าถึง (Accessibility & PDPA) โดยจำลองข้อมูลเสมือนจริง ไม่มีการเชื่อมต่อภายนอก และรองรับการสลับมุมมอง 3 สไตล์:
1. **Style A: Government Classic** (เป็นทางการ เมนูบน เอกสารเป็นศูนย์กลาง)
2. **Style B: Modern Command Center** (Dashboard บริหารงาน Sidebar, KPI Pipeline)
3. **Style C: Accessible Guided Flow** (Wizard นำทางทีละขั้น ตัวอักษรใหญ่ High Contrast)

## 2. โมดูลและหน้าจอทั้ง 16 รายการ
1. **Dashboard ภาพรวมโครงการ**: KPI โครงการ, สถานะงานค้างตรวจ/อนุมัติ, แผนภูมิงบประมาณ, Risk Matrix
2. **ทะเบียนและสร้างโครงการ**: ทะเบียนโครงการค้นหา/กรอง, ฟอร์มสร้างโครงการใหม่พร้อม Preset จำลอง
3. **ร่างโครงการ (Project Proposal)**: วัตถุประสงค์, เป้าหมาย, ตัวชี้วัด, วงเงินงบประมาณ, กิจกรรม
4. **บันทึกข้อความขออนุมัติ (Official Memo)**: โครงสร้างหนังสือราชการ ตราครุฑจำลอง `[ตราหน่วยงาน]`, 3 ย่อหน้ามาตรฐาน
5. **ข่าวประชาสัมพันธ์ (Press Release)**: ข่าวสารทางการ 3 รูปแบบ, เนื้อหาสำหรับสื่อ, ช่องทางเผยแพร่
6. **แนวคิดภาพและ Infographic (Visual Concept)**: Storyboard, Mood & Tone, Infographic layout, AI prompt spec
7. **แบบฟอร์มลงทะเบียน (Registration Form)**: Form builder / Live preview พร้อม PDPA consent
8. **แบบประเมินความพึงพอใจ (Satisfaction Survey)**: 5-point Likert scale, ข้อคิดเห็น, กราฟสรุปผลประเมิน
9. **แผนวิเคราะห์ข้อมูล (Data Analytics Plan)**: Data Dictionary, metrics, data pipeline, collection strategy
10. **กราฟและ Executive Summary**: interactive charts (SVG/Canvas), AI-generated summary brief
11. **Presentation 5 สไลด์ (Interactive Deck)**: สไลด์พรีเซนต์ 5 หน้า พร้อมปุ่มเปลี่ยนสไลด์และ Slide Notes
12. **Script วิดีโอ 30 วินาที (Video Storyboard)**: Hook (0-5s), Story (5-15s), Solution (15-25s), CTA (25-30s)
13. **Accessibility Checklist**: ตรวจสอบเกณฑ์ WCAG 2.1 Level AA ครบ 15 รายการ
14. **PDPA และจริยธรรม AI**: มาตรการคุ้มครองข้อมูลส่วนบุคคล + ธรรมาภิบาล AI 5 มิติ
15. **หน้าตรวจเอกสารและอนุมัติ (Review & Approval)**: สเตชันตรวจงาน, ส่งแก้ไขพร้อมบันทึก, อนุมัติล็อกเอกสาร
16. **Audit Log และประวัติรุ่นเอกสาร**: บันทึกกิจกรรมระบบ, ประวัติ Version, Diff summary

## 3. วงจรสถานะจำลอง (State Machine)
- `DRAFT` -> `AI_DRAFT` (ปุ่ม "ให้ AI ช่วยร่าง")
- `AI_DRAFT` -> `IN_REVIEW` (ปุ่ม "ส่งให้ผู้ตรวจ")
- `IN_REVIEW` -> `REVISION_REQUIRED` (ปุ่ม "ส่งกลับเพื่อแก้ไขพร้อมหมายเหตุ")
- `IN_REVIEW` -> `REVIEWED` / `PENDING_APPROVAL` (ปุ่ม "ส่งต่อผู้อนุมัติ")
- `PENDING_APPROVAL` -> `APPROVED` (ปุ่ม "อนุมัติโครงการ" + ล็อกเนื้อหา)
