# Nitipat Portfolio Sync Setup

## 1. Deploy Google Apps Script

1. เปิด [script.google.com](https://script.google.com) และสร้างโปรเจกต์ใหม่
2. คัดลอก `google-apps-script/Code.gs` ไปวางในไฟล์ `Code.gs`
3. Deploy → New deployment → Web app
4. ตั้งค่า `Execute as: Me` และ `Who has access: Only myself`
5. คัดลอก URL ที่ลงท้ายด้วย `/exec`

Apps Script จะสร้างโฟลเดอร์ Drive และ Spreadsheet ให้เองเมื่อเรียกใช้งานครั้งแรก:

```text
Nitipat Government Portfolio/
├── snapshots/
├── images/
├── documents/
└── exports/
```

## 2. Connect the web app

เปิด Portfolio แล้วกดปุ่มไอคอน Link บริเวณ Header จากนั้นวาง Web App URL

ข้อมูลจะยังทำงานแบบ Local-only หากยังไม่ได้ตั้งค่า URL หรือไม่มี Internet

## 3. Sync behavior

- `Pending changes`: มีการแก้ไขในเครื่องที่ยังไม่ได้ Sync
- `Synced`: Local revision ตรงกับ Online
- `Conflict detected`: Online ถูกแก้ไขจาก revision ที่ Local เคยอ่าน ระบบจะไม่เขียนทับให้อัตโนมัติ
- ทุก snapshot ถูกเก็บเป็นไฟล์ JSON ใน Drive ก่อนสร้าง revision ใหม่

> ข้อมูลและเอกสารเป็น Private ตามการตั้งค่า Web App และ Drive ของ Google Account เจ้าของระบบ ห้ามนำ URL ไปเผยแพร่สาธารณะ
