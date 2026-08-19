import os
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

# 1. Page Configuration
st.set_page_config(
    page_title="Dashboard ภาพรวมอาหารไทย",
    page_icon="🍛",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# 2. Custom Styling for Power BI Look & Feel
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
    
    .block-container {
        padding-top: 1.2rem;
        padding-bottom: 1.5rem;
        padding-left: 2rem;
        padding-right: 2rem;
        max-width: 1400px;
    }
    
    /* Top Header Bar */
    .top-header-bar {
        background: linear-gradient(135deg, #0a2540 0%, #0d3b66 100%);
        border-radius: 12px;
        padding: 14px 24px;
        color: white;
        margin-bottom: 16px;
        box-shadow: 0 4px 12px rgba(10, 37, 64, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .header-title-text {
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: #ffffff;
        margin: 0;
    }

    /* KPI Cards */
    .kpi-card {
        background: #ffffff;
        border-radius: 12px;
        padding: 16px 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 16px;
        height: 88px;
    }
    
    .kpi-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
    }
    
    .kpi-label {
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 2px;
    }
    
    .kpi-val {
        font-size: 22px;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.1;
    }
    
    /* Chart Boxes */
    .chart-container-card {
        background: #ffffff;
        border-radius: 12px;
        padding: 14px 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid #e2e8f0;
        margin-bottom: 16px;
    }
    
    .chart-title {
        font-size: 15px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
    }

    /* Power BI Style Table */
    .pbi-table-container {
        width: 100%;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
    }
    
    table.pbi-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        font-family: 'Sarabun', sans-serif;
    }
    
    table.pbi-table thead tr {
        background-color: #0a2540;
        color: #ffffff;
    }
    
    table.pbi-table th {
        padding: 8px 12px;
        font-weight: 700;
        text-align: left;
    }
    
    table.pbi-table td {
        padding: 7px 12px;
        border-bottom: 1px solid #f1f5f9;
        color: #1e293b;
    }
    
    table.pbi-table tbody tr:first-child {
        background-color: #fef9c3;
        font-weight: 700;
    }
    
    table.pbi-table tbody tr:hover {
        background-color: #f8fafc;
    }
</style>
""", unsafe_allow_html=True)

# 3. Data Loading
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "clean_thai_food.csv")

@st.cache_data
def get_clean_data():
    df = pd.read_csv(DATA_FILE)
    
    spice_mapping = {
        "Not Spicy": "1_ไม่เผ็ด",
        "Mild": "2_เผ็ดน้อย",
        "Medium": "3_เผ็ดปานกลาง",
        "Hot": "4_เผ็ด",
        "Very Hot": "5_เผ็ดมาก"
    }
    df["spice_th"] = df["spice_level"].map(spice_mapping).fillna("ไม่ระบุ")
    
    def format_veg(v):
        if pd.isna(v):
            return "ไม่ระบุ"
        s = str(v).strip().lower()
        if s in ["true", "1"]:
            return "ใช่"
        elif s in ["false", "0"]:
            return "ไม่ใช่"
        return "ไม่ระบุ"
        
    df["veg_th"] = df["is_vegetarian"].apply(format_veg)
    return df

df_base = get_clean_data()

# 4. Top Header & Slicers
head_c1, head_c2, head_c3, head_c4 = st.columns([1.6, 0.8, 0.8, 0.8])

with head_c1:
    st.markdown("""
        <div style="padding-top: 4px;">
            <div class="header-title-text" style="color:#0a2540;">Dashboard ภาพรวมอาหารไทย</div>
            <div style="font-size:12px; color:#64748b; font-weight:500;">ระบบติดตามและวิเคราะห์ข้อมูลเมนูอาหารไทย</div>
        </div>
    """, unsafe_allow_html=True)

with head_c2:
    course_list = ["ทั้งหมด"] + sorted(df_base["course"].dropna().unique().tolist())
    sel_course = st.selectbox("ประเภทอาหาร", course_list, index=0)

with head_c3:
    spice_list = ["ทั้งหมด", "1_ไม่เผ็ด", "2_เผ็ดน้อย", "3_เผ็ดปานกลาง", "4_เผ็ด", "5_เผ็ดมาก"]
    sel_spice = st.selectbox("ระดับความเผ็ด", spice_list, index=0)

with head_c4:
    veg_list = ["ทั้งหมด", "ไม่ใช่", "ใช่", "ไม่ระบุ"]
    sel_veg = st.selectbox("มังสวิรัติ", veg_list, index=0)

# Filter Data
df_filtered = df_base.copy()
if sel_course != "ทั้งหมด":
    df_filtered = df_filtered[df_filtered["course"] == sel_course]
if sel_spice != "ทั้งหมด":
    df_filtered = df_filtered[df_filtered["spice_th"] == sel_spice]
if sel_veg != "ทั้งหมด":
    df_filtered = df_filtered[df_filtered["veg_th"] == sel_veg]

# 5. KPI Cards (Row 1)
k1, k2, k3, k4 = st.columns(4)

total_count = len(df_filtered)
total_sales_m = (df_filtered["sales_2025"].sum() / 1_000_000) if not df_filtered["sales_2025"].isna().all() else 0.0
mean_price = df_filtered["price_baht"].mean() if not df_filtered["price_baht"].isna().all() else 0.0
mean_rating = df_filtered["rating_out_of_5"].mean() if not df_filtered["rating_out_of_5"].isna().all() else 0.0

with k1:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-icon" style="background:#e0f2fe; color:#0284c7;">📋</div>
        <div>
            <div class="kpi-label">จำนวนเมนูทั้งหมด</div>
            <div class="kpi-val">{total_count:,} <span style="font-size:15px; font-weight:600; color:#64748b;">เมนู</span></div>
        </div>
    </div>
    """, unsafe_allow_html=True)

with k2:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-icon" style="background:#fef3c7; color:#d97706;">📈</div>
        <div>
            <div class="kpi-label">ยอดขายรวม</div>
            <div class="kpi-val">{total_sales_m:.2f} <span style="font-size:15px; font-weight:600; color:#64748b;">ล้าน</span></div>
        </div>
    </div>
    """, unsafe_allow_html=True)

with k3:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-icon" style="background:#ccfbf1; color:#0f766e;">🏷️</div>
        <div>
            <div class="kpi-label">ราคาเฉลี่ย</div>
            <div class="kpi-val">฿{mean_price:.2f}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

with k4:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-icon" style="background:#fef9c3; color:#a16207;">⭐</div>
        <div>
            <div class="kpi-label">คะแนนเฉลี่ย</div>
            <div class="kpi-val">{mean_rating:.2f} <span style="font-size:15px; font-weight:600; color:#64748b;">/ 5</span></div>
            <div style="color:#eab308; font-size:12px; margin-top:2px;">⭐⭐⭐⭐☆</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<div style='margin-bottom: 16px;'></div>", unsafe_allow_html=True)

# 6. Charts Row 1 (Menu Count by Course & Sales by Course)
col_top1, col_top2 = st.columns(2)

with col_top1:
    st.markdown("<div class='chart-container-card'><div class='chart-title'>จำนวนเมนูตามประเภทอาหาร</div>", unsafe_allow_html=True)
    c_counts = df_filtered["course"].value_counts().reset_index()
    c_counts.columns = ["course", "count"]
    
    order_dict = {"main dish": 1, "snack": 2, "dessert": 3, "salad": 4, "soup": 5}
    c_counts["sort_key"] = c_counts["course"].map(order_dict).fillna(99)
    c_counts = c_counts.sort_values("sort_key", ascending=False)
    
    fig1 = px.bar(
        c_counts,
        x="count",
        y="course",
        orientation="h",
        text="count",
        color_discrete_sequence=["#139a8c"]
    )
    fig1.update_traces(textposition="outside", cliponaxis=False)
    fig1.update_layout(
        margin=dict(l=10, r=35, t=5, b=5),
        height=250,
        xaxis=dict(title="", showgrid=True, gridcolor="#f1f5f9", range=[0, max(c_counts["count"].max() * 1.2, 10) if not c_counts.empty else 10]),
        yaxis=dict(title="", tickfont=dict(size=13, color="#1e293b")),
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)"
    )
    st.plotly_chart(fig1, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

with col_top2:
    st.markdown("<div class='chart-container-card'><div class='chart-title'>ยอดขายตามประเภทอาหาร <span style='font-size:12px; font-weight:normal; color:#64748b;'>■ ยอดขาย (ล้านบาท) &nbsp; ■ อื่น ๆ (ล้านบาท)</span></div>", unsafe_allow_html=True)
    c_sales = df_filtered.groupby("course")["sales_2025"].sum().reset_index()
    c_sales["sales_m"] = c_sales["sales_2025"] / 1_000_000
    
    # Ensure all standard courses exist
    for c in ["main dish", "snack", "dessert", "salad", "soup"]:
        if c not in c_sales["course"].values:
            c_sales = pd.concat([c_sales, pd.DataFrame([{"course": c, "sales_2025": 0, "sales_m": 0.0}])], ignore_index=True)
            
    c_sales["sort_key"] = c_sales["course"].map({"main dish": 1, "snack": 2, "dessert": 3, "salad": 4, "soup": 5}).fillna(99)
    c_sales = c_sales.sort_values("sort_key", ascending=True)
    
    bar_colors = ["#e5a93b" if c == "main dish" else "#139a8c" for c in c_sales["course"]]
    
    fig2 = go.Figure()
    fig2.add_trace(go.Bar(
        x=c_sales["course"],
        y=c_sales["sales_m"],
        text=[f"{v:.2f}M" if v > 0.01 else "0" for v in c_sales["sales_m"]],
        textposition="outside",
        marker_color=bar_colors,
        cliponaxis=False
    ))
    fig2.update_layout(
        margin=dict(l=10, r=10, t=5, b=5),
        height=250,
        yaxis=dict(title="ล้านบาท", showgrid=True, gridcolor="#f1f5f9", range=[0, max(c_sales["sales_m"].max() * 1.25, 10) if not c_sales.empty else 10]),
        xaxis=dict(title="", tickfont=dict(size=13, color="#1e293b")),
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)"
    )
    st.plotly_chart(fig2, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

# 7. Charts Row 2 (Rating by Spice, Vegetarian Donut, Top 5 Table)
col_b1, col_b2, col_b3 = st.columns([1.1, 0.9, 1.0])

with col_b1:
    st.markdown("<div class='chart-container-card'><div class='chart-title'>คะแนนเฉลี่ยตามระดับความเผ็ด</div>", unsafe_allow_html=True)
    spice_df = df_filtered[df_filtered["spice_th"] != "ไม่ระบุ"].groupby("spice_th")["rating_out_of_5"].mean().reset_index()
    
    spice_order = ["5_เผ็ดมาก", "4_เผ็ด", "3_เผ็ดปานกลาง", "2_เผ็ดน้อย", "1_ไม่เผ็ด"]
    color_map = {
        "1_ไม่เผ็ด": "#1b998b",
        "2_เผ็ดน้อย": "#52b788",
        "3_เผ็ดปานกลาง": "#a7c957",
        "4_เผ็ด": "#f4a261",
        "5_เผ็ดมาก": "#e76f51"
    }
    
    spice_df["sort_key"] = spice_df["spice_th"].map({k: i for i, k in enumerate(spice_order)})
    spice_df = spice_df.sort_values("sort_key", ascending=True)
    spice_df["bar_color"] = spice_df["spice_th"].map(color_map).fillna("#139a8c")
    
    fig3 = go.Figure()
    fig3.add_trace(go.Bar(
        x=spice_df["rating_out_of_5"],
        y=spice_df["spice_th"],
        orientation="h",
        text=[f"{v:.2f}" if pd.notna(v) else "" for v in spice_df["rating_out_of_5"]],
        textposition="outside",
        marker_color=spice_df["bar_color"],
        cliponaxis=False
    ))
    fig3.update_layout(
        margin=dict(l=10, r=30, t=5, b=5),
        height=260,
        xaxis=dict(title="", range=[0, 5.0], showgrid=True, gridcolor="#f1f5f9"),
        yaxis=dict(title="", tickfont=dict(size=12, color="#1e293b")),
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)"
    )
    st.plotly_chart(fig3, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

with col_b2:
    st.markdown("<div class='chart-container-card'><div class='chart-title'>สัดส่วนอาหารมังสวิรัติ</div>", unsafe_allow_html=True)
    v_counts = df_filtered["veg_th"].value_counts().reset_index()
    v_counts.columns = ["veg_th", "count"]
    
    v_colors = {
        "ไม่ใช่": "#139a8c",
        "ใช่": "#f4b41a",
        "ไม่ระบุ": "#cbd5e1"
    }
    v_counts["sort_key"] = v_counts["veg_th"].map({"ไม่ใช่": 1, "ใช่": 2, "ไม่ระบุ": 3}).fillna(99)
    v_counts = v_counts.sort_values("sort_key")
    
    fig4 = px.pie(
        v_counts,
        names="veg_th",
        values="count",
        hole=0.55,
        color="veg_th",
        color_discrete_map=v_colors
    )
    fig4.update_traces(
        textposition="outside",
        textinfo="percent",
        hovertemplate="<b>%{label}</b>: %{value} เมนู (%{percent})<extra></extra>",
        marker=dict(line=dict(color="#ffffff", width=2))
    )
    fig4.update_layout(
        margin=dict(l=5, r=5, t=5, b=5),
        height=260,
        legend=dict(orientation="v", yanchor="middle", y=0.5, xanchor="left", x=1.02, font=dict(size=11)),
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)"
    )
    st.plotly_chart(fig4, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

with col_b3:
    st.markdown("<div class='chart-container-card'><div class='chart-title'>Top 5 เมนูยอดขายสูงสุด</div>", unsafe_allow_html=True)
    top_5 = df_filtered.dropna(subset=["sales_2025"]).sort_values("sales_2025", ascending=False).head(5)
    
    # Render table via clean Plotly go.Table for 100% bug-free rendering & pixel perfection
    fig_table = go.Figure(data=[go.Table(
        header=dict(
            values=["<b>เมนู</b>", "<b>ยอดขาย</b>", "<b>คะแนน</b>"],
            fill_color="#0a2540",
            font=dict(color="#ffffff", size=13, family="Sarabun"),
            align=["left", "right", "center"],
            height=32
        ),
        cells=dict(
            values=[
                top_5["th_name"].tolist() if not top_5.empty else ["-"],
                [f"{int(x):,}" for x in top_5["sales_2025"]] if not top_5.empty else ["-"],
                [f"{x:.1f}" if pd.notna(x) else "-" for x in top_5["rating_out_of_5"]] if not top_5.empty else ["-"]
            ],
            fill_color=[
                ["#fef9c3" if i == 0 else "#ffffff" for i in range(len(top_5))] if not top_5.empty else ["#ffffff"],
                ["#fef9c3" if i == 0 else "#ffffff" for i in range(len(top_5))] if not top_5.empty else ["#ffffff"],
                ["#fef9c3" if i == 0 else "#ffffff" for i in range(len(top_5))] if not top_5.empty else ["#ffffff"]
            ],
            font=dict(color="#1e293b", size=12, family="Sarabun"),
            align=["left", "right", "center"],
            height=28
        )
    )])
    fig_table.update_layout(
        margin=dict(l=0, r=0, t=5, b=5),
        height=260
    )
    st.plotly_chart(fig_table, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)
