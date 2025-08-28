from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from datetime import datetime

def generate_pdf_report(data, user, options=None):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        spaceAfter=30,
        alignment=1
    )

    story = []

    story.append(Paragraph("Hydration Report", title_style))

    story.append(Paragraph(f"User: {user.username}", styles['Normal']))
    story.append(Paragraph(f"Daily Goal: {user.daily_goal}ml", styles['Normal']))
    story.append(Paragraph(f"Report Date: {datetime.now().strftime('%Y-%m-%d')}", styles['Normal']))
    story.append(Spacer(1, 0.2*inch))

    total_intake = sum(entry['amount'] for entry in data)
    days_met_goal = sum(1 for entry in data if entry['met_goal'])
    success_rate = (days_met_goal / len(data)) * 100 if data else 0

    story.append(Paragraph("Summary Statistics", styles['Heading2']))
    story.append(Paragraph(f"Total Intake: {total_intake}ml", styles['Normal']))
    story.append(Paragraph(f"Days Tracked: {len(data)}", styles['Normal']))
    story.append(Paragraph(f"Days Met Goal: {days_met_goal} ({success_rate:.1f}%)", styles['Normal']))
    story.append(Spacer(1, 0.2*inch))

    if data:
        story.append(Paragraph("Daily Intake Details", styles['Heading2']))

        table_data = [['Date', 'Amount (ml)', 'Goal Met']]
        for entry in data:
            table_data.append([
                entry['date'],
                str(entry['amount']),
                'Yes' if entry['met_goal'] else 'No'
            ])

        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        story.append(table)

    doc.build(story)
    buffer.seek(0)
    return buffer

