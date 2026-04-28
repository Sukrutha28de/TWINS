import pdfkit

config = pdfkit.configuration(
    wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
)


def generate_html(data, doc_type):
    score = data['overall_score']
    risk = data['overall_risk']
    high = data['high_risk_count']
    medium = data['medium_risk_count']
    low = data['low_risk_count']
    clauses = data['clauses']

    color = "#16a34a" if score >= 70 else "#d97706" if score >= 40 else "#dc2626"

    return f"""
    <html>
    <head>
        <meta charset="UTF-8">

        <style>
            body {{
                font-family: Arial, sans-serif;
                padding: 40px;
                color: #0f172a;
                line-height: 1.6;
            }}

            .center {{
                text-align: center;
            }}

            .brand {{
                font-size: 36px;
                font-weight: bold;
            }}

            .tagline {{
                font-size: 16px;
                color: #64748b;
                margin-top: 5px;
                margin-bottom: 20px;
            }}

            .score {{
                font-size: 80px;
                font-weight: bold;
                color: {color};
                margin-top: 20px;
            }}

            .risk {{
                font-size: 20px;
                font-weight: bold;
                color: {color};
                margin-bottom: 10px;
            }}

            .table {{
                width: 100%;
                border-collapse: collapse;
                margin-top: 30px;
            }}

            .table td {{
                border: 1px solid #e2e8f0;
                padding: 14px;
                text-align: center;
                font-size: 16px;
            }}

            .section {{
                margin-top: 30px;
            }}

            .summary {{
                font-size: 15px;
                color: #334155;
            }}

            .page-break {{
                page-break-before: always;
            }}

            .clause {{
                background: #f8fafc;
                padding: 20px;
                margin-top: 20px;
                border-left: 6px solid;
                border-radius: 6px;
            }}

            .high {{ border-color: #dc2626; }}
            .medium {{ border-color: #d97706; }}
            .low {{ border-color: #16a34a; }}

            .clause-title {{
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
            }}

            .label {{
                font-weight: bold;
                margin-top: 10px;
            }}

            .content {{
                margin-top: 4px;
                color: #334155;
            }}

        </style>
    </head>

    <body>

    <!-- PAGE 1 -->
    <div class="center">

        <div class="brand">साहीSign</div>
        <div class="tagline">Because every signature should be sahi</div>

        <hr>

        <p><b>Document:</b> {doc_type}</p>

        <div class="score">{score}</div>
        <div class="risk">{risk} DOCUMENT</div>

        <p style="font-size: 12px; color: #64748b;">
            AI-generated analysis. Not a substitute for legal advice.
        </p>

    </div>

    <table class="table">
        <tr>
            <td><b>Total</b></td>
            <td><b>High Risk</b></td>
            <td><b>Medium</b></td>
            <td><b>Low</b></td>
        </tr>
        <tr>
            <td>{data['total_clauses']}</td>
            <td style="color:#dc2626">{high}</td>
            <td style="color:#d97706">{medium}</td>
            <td style="color:#16a34a">{low}</td>
        </tr>
    </table>

    <div class="section">
        <h2>Overall Assessment</h2>
        <p class="summary">
            This document contains {high} high-risk and {medium} medium-risk clauses.
            Review carefully before signing.
        </p>
    </div>

    <!-- PAGE 2 -->
    <div class="page-break"></div>

    <h1>Clause Analysis</h1>

    {''.join([
        f'''
        <div class="clause {c['risk_level'].lower()}">
            <div class="clause-title">
                Clause {c['clause_number']} — {c['risk_level']}
            </div>

            <div class="label">Plain English</div>
            <div class="content">{c['plain_english']}</div>

            <div class="label">Law Violated</div>
            <div class="content">{c['law_violated']}</div>

            <div class="label">Negotiation Tip</div>
            <div class="content">{c['negotiation_tip']}</div>
        </div>
        '''
        for c in clauses
    ])}

    </body>
    </html>
    """


def generate_report_pdf(data, doc_type):
    html = generate_html(data, doc_type)

    options = {
        'encoding': 'UTF-8'
    }

    pdf = pdfkit.from_string(html, False, configuration=config, options=options)
    return pdf