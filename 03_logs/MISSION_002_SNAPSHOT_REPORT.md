# รายงานการบันทึก Snapshot Baseline และโครงสร้างการสำรองข้อมูล (Mission 002 Report)

**โครงการ:** ระบบบันทึกการอบรมและแฟ้มสะสมผลงานดิจิทัล (Civil Servant Trainee Learning & Portfolio Management System)  
**วันที่บันทึก:** 15 สิงหาคม 2569  
**ผู้จัดทำ:** ทีมน้องฟ้า เลขาหน้าห้อง (5.11) ร่วมกับ เซียน SA (5.2) และ โค้ดเดอร์หลังบ้าน (5.5)

---

## 1. วัตถุประสงค์ (Mission 002 Objective)
1. ดำเนินการบันทึก **Snapshot Baseline v1.0** เพื่อ Freeze สถานะเริ่มต้นของระบบและชุดข้อมูลมาตรฐาน
2. จัดทำโครงสร้างการสำรองและกู้คืนข้อมูลแบบ **JSON Backup & Schema Definition**
3. สร้างจุดตรวจสอบความถูกต้อง (Verification Checkpoints) ทั้งในระดับ Schema, Business Logic, และ File Integrity Hash (SHA-256)

---

## 2. โครงสร้างโฟลเดอร์และไฟล์ที่จัดทำใน Mission 002

| โฟลเดอร์ / ไฟล์ | คำอธิบาย |
|---|---|
| `01_data/snapshots/snapshot_baseline_v1.json` | ไฟล์ Snapshot Baseline ข้อมูลระบบครบ 7 โมดูล พร้อมทำเนียบ 40 คน |
| `01_data/snapshots/manifest_checksums.json` | บันทึกลายนิ้วมือดิจิทัล (SHA-256 Hashes) ของทุกไฟล์หลักในระบบ |
| `01_data/backup_schema.json` | JSON Schema มาตรฐาน (Draft-07) สำหรับตรวจสอบโครงสร้างไฟล์สำรอง |
| `02_scripts/snapshot_baseline.js` | สคริปต์สร้าง Snapshot และคำนวณ Checksum แบบอัตโนมัติ |
| `02_scripts/validate_backup.js` | สคริปต์ตรวจสอบความถูกต้องของไฟล์สำรองข้อมูล (23 จุดตรวจสอบ) |

---

## 3. รายการจุดตรวจสอบความถูกต้อง (23 Verification Checkpoints)

### หมวดที่ 1: Schema & Data Collections
1. ตรวจสอบเวอร์ชัน `schemaVersion: "2.0.0"`
2. ตรวจสอบ Object `userProfile` ครบถ้วน
3. ตรวจสอบ Array `attendance` ครบ 13 วัน
4. ตรวจสอบ Array `ojtLogs`
5. ตรวจสอบ Array `ojtChecklist` (6 รายการ)
6. ตรวจสอบ Array `artifacts`
7. ตรวจสอบ Array `traineesList` (40 รายการ)

### หมวดที่ 2: User Profile & Track Verification
8. ชื่อ-นามสกุลถูกต้อง
9. สายหลักสูตรตรงตามเกณฑ์ (`ADV` หรือ `FND`)
10. ระบุหน่วยงานต้นสังกัด
11. ระบุหน่วยงานฝึกปฏิบัติงาน OJT
12. มีวิสัยทัศน์การปฏิบัติงาน (Vision Statement)
13. มี Hard Skills ไม่น้อยกว่า 3 ทักษะ
14. มี Soft Skills ไม่น้อยกว่า 3 ทักษะ

### หมวดที่ 3: Business Logic & Compliance Rules
15. ตารางอบรม 13 วันเรียงลำดับต่อเนื่อง พร้อมหัวข้อและสถานะ
16. อัตราการเข้าเรียนผ่านเกณฑ์ $\ge 80\%$
17. บันทึก OJT มีระบุด้านงาน (1-4) และชั่วโมงถูกต้อง
18. ชั่วโมง OJT รวมผ่านเกณฑ์เป้าหมาย $\ge 90$ ชั่วโมง
19. บันทึก OJT ครอบคลุมครบทั้ง 4 ด้านงาน

### หมวดที่ 4: Universal Accessibility (WCAG 2.1 AA)
20. ภาพและสื่อผลงานทุกชิ้นมี Alt-Text อธิบายภาพไม่น้อยกว่า 10 ตัวอักษร สำหรับโปรแกรมอ่านจอ

### หมวดที่ 5: File Checksum Integrity (SHA-256)
21. ตรวจสอบ Hash ของ `index.html` ตรงกับ Manifest
22. ตรวจสอบ Hash ของ `app.js` และ `styles.css` ตรงกับ Manifest
23. ตรวจสอบ Hash ของ `default_trainees.json` และ Blueprint ตรงกับ Manifest

---

## 4. ผลการรันชุดทดสอบ (Verification Execution Log)

```
================================================================
🔍 RUNNING BACKUP AND SNAPSHOT INTEGRITY VALIDATOR
📁 Target File: .../01_data/snapshots/snapshot_baseline_v1.json
================================================================

  ✓ [PASS] Target file exists on disk
  ✓ [PASS] Valid JSON document

📋 1. Validating Core Schema Properties:
  ✓ [PASS] Has schemaVersion property ("2.0.0")
  ✓ [PASS] Has userProfile object
  ✓ [PASS] Has attendance array (13 items)
  ✓ [PASS] Has ojtLogs array
  ✓ [PASS] Has ojtChecklist array (6 items)
  ✓ [PASS] Has artifacts array
  ✓ [PASS] Has traineesList array (40 items)

👤 2. Validating User Profile & Experience:
  ✓ [PASS] Profile fullName is valid
  ✓ [PASS] Profile track is ADV or FND
  ✓ [PASS] Profile organization is specified
  ✓ [PASS] Profile OJT agency is specified
  ✓ [PASS] Profile vision statement is specified
  ✓ [PASS] Profile has hard skills array
  ✓ [PASS] Profile has soft skills array

📅 3. Validating 13-Days Centara Life Attendance:
  ✓ [PASS] All 13 days are sequential (1-13) with valid titles, reflections and statuses
  ✓ [PASS] Attendance rate passes >= 80% criteria (100%)

⏱️ 4. Validating OJT 4 Dimensions & Hours Accumulation:
  ✓ [PASS] All OJT logs have valid dimension (1-4), positive hours, and task descriptions
  ✓ [PASS] OJT total hours meets target >= 90 hrs (90 hrs)
  ✓ [PASS] OJT covers all 4 dimensions (1, 2, 3, 4)

🖼️ 5. Validating Artifacts & Universal Accessibility (Alt-Text):
  ✓ [PASS] All artifacts have meaningful Alt-Text (length >= 10) for Screen Readers

🔒 6. Verifying File Integrity Manifest Checksums:
  ✓ Hash verified for index.html
  ✓ Hash verified for app.js
  ✓ Hash verified for styles.css
  ✓ Hash verified for system_requirements_blueprint.html
  ✓ Hash verified for 01_data/default_trainees.json
  ✓ Hash verified for 01_data/backup_schema.json
  ✓ [PASS] All core asset SHA-256 hashes match manifest

================================================================
📊 VALIDATION SUMMARY: Total Checkpoints: 23 | Passed: 23 | Failed: 0
================================================================
🎉 SNAPSHOT / BACKUP DATA IS 100% VALID AND COMPLIANT!
```

---

## 5. วิธีการกู้คืนข้อมูลหรือตรวจสอบในอนาคต (Recovery & Validation Guide)
- **สร้าง Snapshot ใหม่:** `node 02_scripts/snapshot_baseline.js`
- **ตรวจสอบไฟล์สำรอง:** `node 02_scripts/validate_backup.js [path/to/backup.json]`
- **ทดสอบระบบเต็มรูปแบบ:** `node 02_scripts/verify_system.js`
