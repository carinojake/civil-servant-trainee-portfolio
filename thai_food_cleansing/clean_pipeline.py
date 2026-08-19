#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Data Cleansing Pipeline for Thai Food Dataset
Complies with Thailand National Statistical Office (NSO) Machine-Readable Data Standards.
"""

import os
import re
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_PATH = os.path.join(SCRIPT_DIR, "raw_thai_food.csv")
CLEAN_DATA_PATH = os.path.join(SCRIPT_DIR, "clean_thai_food.csv")
DATA_DICT_CSV = os.path.join(SCRIPT_DIR, "data_dictionary.csv")
DATA_DICT_MD = os.path.join(SCRIPT_DIR, "data_dictionary.md")
QUALITY_REPORT_MD = os.path.join(SCRIPT_DIR, "data_quality_report.md")


def clean_price(val: Any) -> float:
    """Clean price_baht column by removing currency symbol and whitespace."""
    if pd.isna(val):
        return np.nan
    s = str(val).strip()
    if not s or s.upper() in ["N/A", "NA", "NULL", "NONE", "-"]:
        return np.nan
    # Remove currency symbol ฿ and spaces
    s = re.sub(r"[฿,\s]", "", s)
    try:
        return float(s)
    except ValueError:
        return np.nan


def clean_rating(val: Any) -> float:
    """Clean rating_out_of_5 column: strip 'stars', filter out-of-range (<0 or >5)."""
    if pd.isna(val):
        return np.nan
    s = str(val).strip()
    if not s or s.upper() in ["N/A", "NA", "NULL", "NONE", "-"]:
        return np.nan
    # Remove 'stars' word
    s = re.sub(r"stars?", "", s, flags=re.IGNORECASE).strip()
    try:
        rating = float(s)
        # Validation: Scale is 0.0 - 5.0
        if rating < 0.0 or rating > 5.0:
            return np.nan
        return round(rating, 2)
    except ValueError:
        return np.nan


def clean_spice_level(val: Any) -> str:
    """Standardize spice_level to 5 discrete categories: Not Spicy, Mild, Medium, Hot, Very Hot."""
    if pd.isna(val):
        return np.nan
    s = str(val).strip().lower()
    if not s or s in ["n/a", "na", "null", "-"]:
        return np.nan
    
    if s in ["none", "not spicy", "no spicy", "non-spicy"]:
        return "Not Spicy"
    elif s in ["mild"]:
        return "Mild"
    elif s in ["med", "medium"]:
        return "Medium"
    elif s in ["hot", "spicy"]:
        return "Hot"
    elif s in ["very hot", "extra spicy", "very spicy"]:
        return "Very Hot"
    else:
        # Fallback to Title Case if unknown
        return s.title()


def clean_boolean(val: Any) -> Any:
    """Standardize boolean column is_vegetarian."""
    if pd.isna(val):
        return pd.NA
    s = str(val).strip().upper()
    if s in ["TRUE", "T", "1", "YES", "Y"]:
        return True
    elif s in ["FALSE", "F", "0", "NO", "N"]:
        return False
    return pd.NA


def clean_numeric(val: Any) -> float:
    """Standardize general numeric columns."""
    if pd.isna(val):
        return np.nan
    s = str(val).strip()
    if not s or s.upper() in ["N/A", "NA", "NULL", "NONE", "-"]:
        return np.nan
    s = re.sub(r"[,\s]", "", s)
    try:
        return float(s)
    except ValueError:
        return np.nan


def clean_text(val: Any) -> str:
    """Clean text column: strip whitespace."""
    if pd.isna(val):
        return np.nan
    s = str(val).strip()
    if not s or s.upper() in ["N/A", "NA", "NULL"]:
        return np.nan
    return s


def run_pipeline() -> Tuple[pd.DataFrame, pd.DataFrame, Dict[str, Any]]:
    print("=" * 60)
    print("Starting Thai Food Data Cleansing Pipeline")
    print("=" * 60)

    # 1. Load Raw Data
    df_raw = pd.read_csv(RAW_DATA_PATH)
    print(f"[1/5] Loaded raw dataset: {df_raw.shape[0]} rows, {df_raw.shape[1]} columns")

    # Keep track of anomalies & fixes
    metrics = {
        "total_rows": len(df_raw),
        "total_columns": len(df_raw.columns),
        "raw_missing_by_col": df_raw.isna().sum().to_dict(),
        "price_currency_symbol_count": df_raw["price_baht"].dropna().str.contains("฿").sum(),
        "price_na_strings": df_raw["price_baht"].dropna().str.contains(r"N/A", case=False).sum(),
        "rating_stars_suffix_count": df_raw["rating_out_of_5"].dropna().str.contains(r"stars?", case=False).sum(),
        "rating_negative_count": (pd.to_numeric(df_raw["rating_out_of_5"].astype(str).str.replace(r"[^\d.-]", "", regex=True), errors="coerce") < 0).sum(),
        "rating_overflow_count": (pd.to_numeric(df_raw["rating_out_of_5"].astype(str).str.replace(r"[^\d.-]", "", regex=True), errors="coerce") > 5).sum(),
    }

    # 2. Transform & Clean
    df_clean = df_raw.copy()

    # Clean text columns
    text_cols = ["en_name", "th_name", "course", "province", "region"]
    for col in text_cols:
        df_clean[col] = df_clean[col].apply(clean_text)

    # Clean numeric columns
    df_clean["calories_kcal"] = df_clean["calories_kcal"].apply(clean_numeric).astype("Int64")
    df_clean["prep_time_minutes"] = df_clean["prep_time_minutes"].apply(clean_numeric).astype("Int64")
    df_clean["sales_2025"] = df_clean["sales_2025"].apply(clean_numeric).astype("Int64")

    # Clean boolean column
    df_clean["is_vegetarian"] = df_clean["is_vegetarian"].apply(clean_boolean).astype("boolean")

    # Clean price
    df_clean["price_baht"] = df_clean["price_baht"].apply(clean_price).astype("Int64")

    # Clean rating
    df_clean["rating_out_of_5"] = df_clean["rating_out_of_5"].apply(clean_rating).astype("Float64")

    # Clean spice level
    df_clean["spice_level"] = df_clean["spice_level"].apply(clean_spice_level)

    print(f"[2/5] Transformation completed.")

    # 3. Export Clean Data (UTF-8-SIG for Excel/Cross-platform compatibility)
    df_clean.to_csv(CLEAN_DATA_PATH, index=False, encoding="utf-8-sig")
    print(f"[3/5] Saved clean dataset to: {CLEAN_DATA_PATH}")

    # 4. Generate Data Dictionary (NSO Standard: 3 components - หลัก, ประเภท, รายละเอียด)
    dict_records = [
        {"หลัก (ชื่อมิติข้อมูล)": "en_name", "ประเภท (Data Type)": "text", "รายละเอียด (คำอธิบายมิติข้อมูล)": "ชื่อรายการอาหารภาษาอังกฤษ"},
        {"หลัก (ชื่อมิติข้อมูล)": "th_name", "ประเภท (Data Type)": "text", "รายละเอียด (คำอธิบายมิติข้อมูล)": "ชื่อรายการอาหารภาษาไทย"},
        {"หลัก (ชื่อมิติข้อมูล)": "course", "ประเภท (Data Type)": "text", "รายละเอียด (คำอธิบายมิติข้อมูล)": "หมวดหมู่อาหาร (main dish, snack, dessert, salad, soup)"},
        {"หลัก (ชื่อมิติข้อมูล)": "province", "ประเภท (Data Type)": "text", "รายละเอียด (คำอธิบายมิติข้อมูล)": "จังหวัดต้นกำเนิดหรือแหล่งขึ้นชื่อ (หากไม่ระบุเป็น Various/Unknown)"},
        {"หลัก (ชื่อมิติข้อมูล)": "region", "ประเภท (Data Type)": "text", "รายละเอียด (คำอธิบายมิติข้อมูล)": "ภูมิภาค (Central, North, Northeast, South, Various, Unknown)"},
        {"หลัก (ชื่อมิติข้อมูล)": "calories_kcal", "ประเภท (Data Type)": "numeric", "รายละเอียด (คำอธิบายมิติข้อมูล)": "ปริมาณพลังงานของอาหาร (หน่วย: กิโลแคลอรี / kcal)"},
        {"หลัก (ชื่อมิติข้อมูล)": "prep_time_minutes", "ประเภท (Data Type)": "numeric", "รายละเอียด (คำอธิบายมิติข้อมูล)": "ระยะเวลาในการจัดเตรียมและปรุงอาหาร (หน่วย: นาที)"},
        {"หลัก (ชื่อมิติข้อมูล)": "is_vegetarian", "ประเภท (Data Type)": "boolean", "รายละเอียด (คำอธิบายมิติข้อมูล)": "สถานะอาหารมังสวิรัติ / เจ (True = ใช่, False = ไม่ใช่)"},
        {"หลัก (ชื่อมิติข้อมูล)": "sales_2025", "ประเภท (Data Type)": "numeric", "รายละเอียด (คำอธิบายมิติข้อมูล)": "ยอดจำหน่ายประจำปี 2568 (หน่วย: บาท หรือจำนวนยอดขาย)"},
        {"หลัก (ชื่อมิติข้อมูล)": "price_baht", "ประเภท (Data Type)": "numeric", "รายละเอียด (คำอธิบายมิติข้อมูล)": "ราคาจำหน่ายต่อหน่วย (หน่วย: บาท)"},
        {"หลัก (ชื่อมิติข้อมูล)": "spice_level", "ประเภท (Data Type)": "text", "รายละเอียด (คำอธิบายมิติข้อมูล)": "ระดับความเผ็ด (Not Spicy, Mild, Medium, Hot, Very Hot)"},
        {"หลัก (ชื่อมิติข้อมูล)": "rating_out_of_5", "ประเภท (Data Type)": "numeric", "รายละเอียด (คำอธิบายมิติข้อมูล)": "คะแนนความพึงพอใจและรีวิว (สเกลมาตรฐาน 0.0 - 5.0)"},
    ]
    df_dict = pd.DataFrame(dict_records)
    df_dict.to_csv(DATA_DICT_CSV, index=False, encoding="utf-8-sig")

    with open(DATA_DICT_MD, "w", encoding="utf-8") as f:
        f.write("# พจนานุกรมข้อมูล (Data Dictionary)\n\n")
        f.write("อ้างอิงตามมาตรฐานชุดข้อมูลเปิดภาครัฐและการจัดทำพจนานุกรมข้อมูลของสำนักงานสถิติแห่งชาติ (สสช.)\n\n")
        f.write(df_dict.to_markdown(index=False))
        f.write("\n")
    print(f"[4/5] Generated Data Dictionary: {DATA_DICT_MD} & {DATA_DICT_CSV}")

    # 5. Generate Data Quality & Cleansing Report
    metrics["clean_missing_by_col"] = df_clean.isna().sum().to_dict()
    spice_distribution = df_clean["spice_level"].value_counts(dropna=False).to_dict()
    course_distribution = df_clean["course"].value_counts(dropna=False).to_dict()

    with open(QUALITY_REPORT_MD, "w", encoding="utf-8") as f:
        f.write("# รายงานผลการตรวจสอบและทำความสะอาดข้อมูล (Data Quality & Cleansing Report)\n\n")
        f.write(f"- **จำนวนแถวทั้งหมด (Total Rows):** {metrics['total_rows']} แถว\n")
        f.write(f"- **จำนวนคอลัมน์ทั้งหมด (Total Columns):** {metrics['total_columns']} คอลัมน์\n\n")
        
        f.write("## 1. สรุปความผิดปกติที่ตรวจพบและมาตรการแก้ไข (Identified Anomalies & Solutions)\n\n")
        f.write("| คอลัมน์ (Column) | รูปแบบความผิดปกติที่พบในข้อมูลดิบ | จำนวนรายการ | การดำเนินการแก้ไข (Action Taken) |\n")
        f.write("|---|---|---|---|\n")
        f.write(f"| `price_baht` | มีสัญลักษณ์สกุลเงิน `฿` และช่องว่างนำหน้า/ต่อท้าย | {metrics['price_currency_symbol_count']} รายการ | ตัดสัญลักษณ์ `฿` และช่องว่างออก แปลงเป็นตัวเลขจำนวนเต็ม (Int64) |\n")
        f.write(f"| `price_baht` | มีสตริง `'N/A'` หรือค่าว่างกำกวม | {metrics['price_na_strings']} รายการ | ปรับเป็นค่าว่างมาตรฐาน (`<NA>`) ตามกฎ Machine Readable |\n")
        f.write(f"| `rating_out_of_5` | มีคำว่า `'stars'` ต่อท้ายตัวเลข เช่น `4.0 stars` | {metrics['rating_stars_suffix_count']} รายการ | ตัดคำว่า `'stars'` ออก คงเหลือเฉพาะค่าตัวเลขทศนิยม |\n")
        f.write(f"| `rating_out_of_5` | ค่าคะแนนผิดปกติเกินสเกล 0-5 (เช่น `10`) | {metrics['rating_overflow_count']} รายการ | ปรับเป็นค่าว่าง (`<NA>`) เนื่องจากเป็นค่า Outlier/ผิดสเกล |\n")
        f.write(f"| `rating_out_of_5` | ค่าคะแนนติดลบ (เช่น `-1`) | {metrics['rating_negative_count']} รายการ | ปรับเป็นค่าว่าง (`<NA>`) ตามเกณฑ์คะแนนต้อง >= 0.0 |\n")
        f.write(f"| `spice_level` | ตัวพิมพ์เล็ก-ใหญ่ไม่ตรงกัน (เช่น `MILD`, `mild`), มีคำย่อ `Med` และ `None` | หลากหลายแถว | Standardize เป็น 5 ระดับมาตรฐาน: `Not Spicy`, `Mild`, `Medium`, `Hot`, `Very Hot` |\n")
        f.write(f"| `is_vegetarian` | สตริง `'TRUE'`, `'FALSE'` และค่าว่าง | ทั่วทั้งตาราง | แปลงเป็นชนิดข้อมูล Boolean (`True`, `False`, `<NA>`) |\n")
        f.write(f"| `calories_kcal`, `prep_time_minutes`, `sales_2025` | ตัวเลขปะปนช่องว่าง/ค่าว่าง | ทั่วทั้งตาราง | แปลงเป็นตัวเลขจำนวนเต็ม (Int64) ค่าว่างปล่อยว่างไม่มีสัญลักษณ์อื่นปน |\n\n")

        f.write("## 2. การเปรียบเทียบค่าว่าง (Missing Values Comparison)\n\n")
        f.write("| ชื่อคอลัมน์ (Column) | ค่าว่างก่อนคลีน (Raw Missing) | ค่าว่างหลังคลีน (Clean Missing) | สัดส่วนความสมบูรณ์ (Completeness) |\n")
        f.write("|---|---|---|---|\n")
        for col in df_clean.columns:
            raw_m = metrics["raw_missing_by_col"].get(col, 0)
            clean_m = metrics["clean_missing_by_col"].get(col, 0)
            completeness = ((metrics['total_rows'] - clean_m) / metrics['total_rows']) * 100
            f.write(f"| `{col}` | {raw_m} | {clean_m} | {completeness:.1f}% |\n")
        
        f.write("\n## 3. สรุปการกระจายตัวของข้อมูลหลังคลีน (Post-Cleansing Distribution)\n\n")
        f.write("### การกระจายตัวตามระดับความเผ็ด (Spice Level Distribution)\n")
        for k, v in spice_distribution.items():
            f.write(f"- **{k if pd.notna(k) else 'Missing / Unspecified'}**: {v} รายการ\n")

        f.write("\n### สถิติเชิงพรรณนาที่สำคัญ (Key Descriptive Statistics)\n")
        f.write(f"- **ราคาเฉลี่ย (Average Price):** {df_clean['price_baht'].mean():.2f} บาท (ต่ำสุด: {df_clean['price_baht'].min()}, สูงสุด: {df_clean['price_baht'].max()})\n")
        f.write(f"- **คะแนนรีวิวเฉลี่ย (Average Rating):** {df_clean['rating_out_of_5'].mean():.2f} / 5.0 (ต่ำสุด: {df_clean['rating_out_of_5'].min()}, สูงสุด: {df_clean['rating_out_of_5'].max()})\n")
        f.write(f"- **ปริมาณแคลอรี่เฉลี่ย (Average Calories):** {df_clean['calories_kcal'].mean():.2f} kcal\n")
        f.write(f"- **เวลาเตรียมอาหารเฉลี่ย (Average Prep Time):** {df_clean['prep_time_minutes'].mean():.2f} นาที\n")
        veg_count = (df_clean['is_vegetarian'] == True).sum()
        f.write(f"- **รายการอาหารมังสวิรัติ (Vegetarian Items):** {veg_count} รายการ (คิดเป็น {(veg_count / metrics['total_rows']) * 100:.1f}%)\n")

    print(f"[5/5] Generated Quality Report: {QUALITY_REPORT_MD}")
    print("=" * 60)
    print("Thai Food Cleansing Pipeline executed successfully!")
    print("=" * 60)

    return df_raw, df_clean, metrics


if __name__ == "__main__":
    run_pipeline()
