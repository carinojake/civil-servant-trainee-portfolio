# คู่มือการสร้าง Dashboard ภาพรวมอาหารไทย บน Power BI Desktop

เอกสารชุดนี้จัดทำขึ้นเพื่อเป็นแนวทางและสูตรคำนวณสำหรับนำเข้าชุดข้อมูลไปสร้าง **Dashboard ภาพรวมอาหารไทย** ในโปรแกรม **Power BI Desktop** ตามต้นแบบการอบรม

---

## 📂 1. ไฟล์ชุดข้อมูลสำหรับนำเข้า (Data Source Files)

| ไฟล์ | ลิงก์ / ตำแหน่งจัดเก็บ | คำอธิบาย |
|---|---|---|
| **Excel Workbook (แนะนำ)** | [`thai_food_powerbi.xlsx`](file:///Users/Shared/my_ai_project/01_ACTIVE_PROJECTS/ห้องเรียน/thai_food_cleansing/thai_food_powerbi.xlsx) | มีตารางข้อมูลที่คลีนแล้ว, คอลัมน์ตัวช่วยภาษาไทย, Data Dictionary และแท็บสูตร DAX |
| **Clean CSV (UTF-8)** | [`clean_thai_food.csv`](file:///Users/Shared/my_ai_project/01_ACTIVE_PROJECTS/ห้องเรียน/thai_food_cleansing/clean_thai_food.csv) | ข้อมูลคลีนมาตรฐาน สสช. สำหรับนำเข้าผ่าน Text/CSV |

---

## ⚡ 2. โค้ด Power Query (M Code) ใน Advanced Editor

หากนำเข้าไฟล์ดิบ สามารถคัดลอกโค้ด M ด้านล่างนี้ไปวางใน **Power Query > Advanced Editor** เพื่อคลีนอัตโนมัติ:

```powerquery
let
    // 1. นำเข้าไฟล์ CSV
    Source = Csv.Document(File.Contents("clean_thai_food.csv"),[Delimiter=",", Columns=12, Encoding=65001, QuoteStyle=QuoteStyle.None]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    
    // 2. ปรับเปลี่ยน Data Types
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"en_name", type text},
        {"th_name", type text},
        {"course", type text},
        {"province", type text},
        {"region", type text},
        {"calories_kcal", Int64.Type},
        {"prep_time_minutes", Int64.Type},
        {"is_vegetarian", type logical},
        {"sales_2025", Int64.Type},
        {"price_baht", Int64.Type},
        {"spice_level", type text},
        {"rating_out_of_5", type number}
    }),
    
    // 3. เพิ่มคอลัมน์ภาษาไทยสำหรับจัดลำดับความเผ็ด
    #"Added Spice TH" = Table.AddColumn(#"Changed Type", "ระดับความเผ็ด_TH", each 
        if [spice_level] = "Not Spicy" then "1_ไม่เผ็ด"
        else if [spice_level] = "Mild" then "2_เผ็ดน้อย"
        else if [spice_level] = "Medium" then "3_เผ็ดปานกลาง"
        else if [spice_level] = "Hot" then "4_เผ็ด"
        else if [spice_level] = "Very Hot" then "5_เผ็ดมาก"
        else "ไม่ระบุ", type text),
        
    // 4. เพิ่มคอลัมน์ภาษาไทยสำหรับมังสวิรัติ
    #"Added Veg TH" = Table.AddColumn(#"Added Spice TH", "มังสวิรัติ_TH", each 
        if [is_vegetarian] = true then "ใช่"
        else if [is_vegetarian] = false then "ไม่ใช่"
        else "ไม่ระบุ", type text)
in
    #"Added Veg TH"
```

---

## 🧮 3. สูตร DAX Measures ที่ต้องสร้าง (Calculated Measures)

สร้างตาราง Measures หรือ New Measure ใน Power BI:

### 1) จำนวนเมนูทั้งหมด
```dax
จำนวนเมนูทั้งหมด = COUNTROWS('clean_thai_food')
```

### 2) ยอดขายรวม (บาท)
```dax
ยอดขายรวม = SUM('clean_thai_food'[sales_2025])
```

### 3) ยอดขายรวม (ล้านบาท)
```dax
ยอดขายรวม (ล้านบาท) = [ยอดขายรวม] / 1000000
```

### 4) ราคาเฉลี่ย
```dax
ราคาเฉลี่ย = AVERAGE('clean_thai_food'[price_baht])
```

### 5) คะแนนเฉลี่ย
```dax
คะแนนเฉลี่ย = AVERAGE('clean_thai_food'[rating_out_of_5])
```

---

## 📊 4. ขั้นตอนการสร้าง Visuals บนหน้า Canvas

1. **Slicers (ตัวกรองด้านบน 3 ตัว):**
   - Slicer 1: ฟิลด์ `course` (ประเภทอาหาร) -> ตั้งค่าเป็น Dropdown
   - Slicer 2: ฟิลด์ `ระดับความเผ็ด_TH` -> ตั้งค่าเป็น Dropdown
   - Slicer 3: ฟิลด์ `มังสวิรัติ_TH` -> ตั้งค่าเป็น Dropdown
2. **KPI Cards (การ์ด 4 ตัวด้านบน):**
   - Card 1: Measure `[จำนวนเมนูทั้งหมด]` (Callout Value: 324 เมนู)
   - Card 2: Measure `[ยอดขายรวม (ล้านบาท)]` (Display units: Millions / 76.04 ล้าน)
   - Card 3: Measure `[ราคาเฉลี่ย]` (Format Currency: ฿67.83)
   - Card 4: Measure `[คะแนนเฉลี่ย]` (Format Decimal 2 ตำแหน่ง: 3.74 / 5)
3. **Clustered Bar Chart (จำนวนเมนูตามประเภทอาหาร):**
   - Y-Axis: `course`
   - X-Axis: `Count of course` หรือ `[จำนวนเมนูทั้งหมด]`
   - Data Labels: เปิด (On)
4. **Clustered Column Chart (ยอดขายตามประเภทอาหาร):**
   - X-Axis: `course`
   - Y-Axis: `[ยอดขายรวม (ล้านบาท)]`
   - Data Labels: เปิด (On)
   - Color: กำหนดสีหลัก `main dish` เป็นสีเหลืองทอง และแท่งอื่นเป็นสีเขียวอมฟ้า
5. **Clustered Bar Chart (คะแนนเฉลี่ยตามระดับความเผ็ด):**
   - Y-Axis: `ระดับความเผ็ด_TH`
   - X-Axis: `[คะแนนเฉลี่ย]`
   - X-Axis Range: 0 ถึง 5
6. **Donut Chart (สัดส่วนอาหารมังสวิรัติ):**
   - Legend: `มังสวิรัติ_TH`
   - Values: `[จำนวนเมนูทั้งหมด]`
7. **Table Visual (Top 5 เมนูยอดขายสูงสุด):**
   - Columns: `th_name`, `sales_2025`, `rating_out_of_5`
   - Filters on this visual: `Top N` -> Top 5 ตาม `sales_2025`
