import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

DISCLAIMER_TEXT = (
    "MEDICAL DISCLAIMER: This system provides an AI-based risk assessment for early awareness "
    "and does not provide a medical diagnosis. The results should not replace professional medical advice. "
    "If you have concerns about your health, please consult a qualified healthcare professional."
)

def generate_assessment_pdf(user_name: str, user_email: str, assessment_data: dict, previous_data: dict = None) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Styles
    primary_color = colors.HexColor("#0F9D9A")
    text_color = colors.HexColor("#12263A")
    bg_light = colors.HexColor("#F6F9FB")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=15
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=text_color,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=text_color
    )

    disclaimer_style = ParagraphStyle(
        'DisclaimerText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        alignment=1 # Center
    )

    elements = []

    # 1. Header
    elements.append(Paragraph("VitaScreen — Personal Health Risk Assessment", title_style))
    elements.append(Paragraph("AI-Powered Early Chronic Disease Risk Screening Report", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=12))

    # 2. User & Assessment Meta Box
    date_str = assessment_data.get("created_at")
    if isinstance(date_str, datetime):
        date_str = date_str.strftime("%B %d, %Y - %H:%M UTC")
    else:
        date_str = str(date_str)[:19]

    meta_table_data = [
        [
            Paragraph(f"<b>Patient / User:</b> {user_name or 'Anonymous User'}", body_style),
            Paragraph(f"<b>Assessment Date:</b> {date_str}", body_style)
        ],
        [
            Paragraph(f"<b>User Email:</b> {user_email}", body_style),
            Paragraph(f"<b>Model Pipeline Version:</b> {assessment_data.get('model_version', '1.0.0')}", body_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 10))

    # 3. Overall Primary Result Banner
    overall_level = assessment_data.get("overall_risk_level", "Low")
    risk_score = assessment_data.get("risk_score", 0.0)
    primary_cat = assessment_data.get("primary_category", "").title()
    
    if overall_level == "Elevated":
        badge_bg = colors.HexColor("#FEE2E2")
        badge_border = colors.HexColor("#EF4444")
        badge_text = colors.HexColor("#B91C1C")
    elif overall_level == "Moderate":
        badge_bg = colors.HexColor("#FEF3C7")
        badge_border = colors.HexColor("#F59E0B")
        badge_text = colors.HexColor("#B45309")
    else:
        badge_bg = colors.HexColor("#D1FAE5")
        badge_border = colors.HexColor("#10B981")
        badge_text = colors.HexColor("#047857")

    result_banner_data = [
        [
            Paragraph(f"<b>Primary Focus Category:</b> {primary_cat}", body_style),
            Paragraph(f"<b>Screening Risk Result:</b> <font color='{badge_text}'><b>{overall_level.upper()} RISK ({int(risk_score * 100)}%)</b></font>", body_style)
        ]
    ]
    result_banner = Table(result_banner_data, colWidths=[270, 270])
    result_banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), badge_bg),
        ('BOX', (0,0), (-1,-1), 1, badge_border),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(result_banner)
    elements.append(Spacer(1, 10))

    # 4. All 5 Categories Risk Table
    elements.append(Paragraph("Multi-Category Screening Overview", h2_style))
    
    table_rows = [
        [
            Paragraph("<b>Chronic Disease Category</b>", body_style),
            Paragraph("<b>Screening Score</b>", body_style),
            Paragraph("<b>Risk Category</b>", body_style),
            Paragraph("<b>Status / Context</b>", body_style)
        ]
    ]

    all_cats = assessment_data.get("stage1_results") or {}
    for cat_id, cat_info in all_cats.items():
        c_name = cat_info.get("category_name", cat_id.title())
        c_score = int(cat_info.get("score", 0) * 100)
        c_level = cat_info.get("level", "Low")
        
        row_color = colors.HexColor("#10B981") if c_level == "Low" else (colors.HexColor("#F59E0B") if c_level == "Moderate" else colors.HexColor("#EF4444"))
        
        table_rows.append([
            Paragraph(c_name, body_style),
            Paragraph(f"{c_score}%", body_style),
            Paragraph(f"<font color='{row_color}'><b>{c_level}</b></font>", body_style),
            Paragraph(cat_info.get("summary", "Screened normal"), body_style)
        ])

    cats_table = Table(table_rows, colWidths=[150, 75, 85, 230])
    cats_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(cats_table)
    elements.append(Spacer(1, 10))

    # 5. Contributing Influential Factors
    elements.append(Paragraph("Factors That Influenced This Screening (SHAP / Feature Weights)", h2_style))
    factors = assessment_data.get("top_contributing_factors", [])
    if factors:
        factor_rows = [
            [
                Paragraph("<b>Identified Factor</b>", body_style),
                Paragraph("<b>Relative Impact</b>", body_style),
                Paragraph("<b>Clinical Insight Description</b>", body_style)
            ]
        ]
        for fac in factors[:5]:
            f_name = fac.get("factor", "")
            f_imp = f"{fac.get('impact', 0)}%"
            f_text = fac.get("plain_text", "")
            factor_rows.append([
                Paragraph(f_name, body_style),
                Paragraph(f_imp, body_style),
                Paragraph(f_text, body_style)
            ])
        fac_table = Table(factor_rows, colWidths=[160, 80, 300])
        fac_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0,0), (-1,-1), 5),
        ]))
        elements.append(fac_table)
    else:
        elements.append(Paragraph("No significant adverse risk factors identified during this evaluation.", body_style))
    elements.append(Spacer(1, 10))

    # 6. Recommendation & Specialist Referral
    elements.append(Paragraph("Recommended Next Steps & Specialist Guidance", h2_style))
    specialist = assessment_data.get("specialist_referral") or "General Physician"
    recom_text = assessment_data.get("consultation_recommendation") or (
        f"Consider scheduling a routine health check-up with a {specialist} for general wellness verification."
    )
    rec_box_data = [
        [
            Paragraph(f"<b>Suggested Specialist Type:</b> {specialist}<br/><br/>{recom_text}", body_style)
        ]
    ]
    rec_box = Table(rec_box_data, colWidths=[540])
    rec_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, primary_color),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(rec_box)
    elements.append(Spacer(1, 12))

    # 7. Comparison with Previous Assessment (if present)
    if previous_data:
        prev_date = previous_data.get("created_at", "Previous")
        if isinstance(prev_date, datetime):
            prev_date = prev_date.strftime("%B %d, %Y")
        prev_level = previous_data.get("overall_risk_level", "Unknown")
        prev_score = int(previous_data.get("risk_score", 0) * 100)
        curr_score = int(risk_score * 100)

        diff = curr_score - prev_score
        change_text = f"+{diff}% increase" if diff > 0 else (f"{diff}% decrease" if diff < 0 else "No change")

        comp_data = [
            [
                Paragraph("<b>Metric</b>", body_style),
                Paragraph(f"<b>Previous ({prev_date})</b>", body_style),
                Paragraph("<b>Current Assessment</b>", body_style),
                Paragraph("<b>Longitudinal Trend</b>", body_style)
            ],
            [
                Paragraph("Overall Risk Level", body_style),
                Paragraph(f"{prev_level} ({prev_score}%)", body_style),
                Paragraph(f"{overall_level} ({curr_score}%)", body_style),
                Paragraph(f"<b>{assessment_data.get('trend_status', 'Stable')}</b> ({change_text})", body_style)
            ]
        ]
        comp_table = Table(comp_data, colWidths=[140, 130, 130, 140])
        comp_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('PADDING', (0,0), (-1,-1), 5),
        ]))
        elements.append(Paragraph("Longitudinal Risk Comparison", h2_style))
        elements.append(comp_table)
        elements.append(Spacer(1, 12))

    # 8. Medical Disclaimer Footer (Mandatory per PRD)
    elements.append(KeepTogether([
        HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#CBD5E1"), spaceAfter=6),
        Paragraph(DISCLAIMER_TEXT, disclaimer_style)
    ]))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
