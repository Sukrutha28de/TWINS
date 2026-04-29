import pdfkit

WKHTML_PATH = r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
config = pdfkit.configuration(wkhtmltopdf=WKHTML_PATH)


def generate_summary_advice(data):
    high = data["high_risk_count"]
    medium = data["medium_risk_count"]
    total = data["total_clauses"]

    if data["overall_score"] >= 70:
        return "This agreement appears generally safe. Still review all clauses carefully before signing."

    elif data["overall_score"] >= 40:
        return f"{medium + high} clauses need attention. Review them carefully and negotiate unclear terms before signing."

    else:
        return f"{high} serious red flags found. This document is heavily one-sided. Strongly consider renegotiation or legal consultation before proceeding."


def generate_html(data, doc_type):
    clauses = data["clauses"]

    score = data["overall_score"]

    if score >= 70:
        decision = "SAFE TO PROCEED"
        meaning = "Low overall risk. Most clauses are balanced."
    elif score >= 40:
        decision = "PROCEED WITH CAUTION"
        meaning = "Moderate risk detected. Some clauses may be unfavorable."
    else:
        decision = "DO NOT SIGN AS-IS"
        meaning = "High risk detected. Multiple clauses may be harmful."

    summary_advice = generate_summary_advice(data)

    return f"""
    <html>
    <head>
        <meta charset="UTF-8">

        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #0f172a;
            }}

            .page {{
                padding: 50px;
                page-break-after: always;
            }}

            .title {{
                text-align: center;
                font-size: 50px;
                font-weight: bold;
            }}

            .subtitle {{
                text-align: center;
                font-size: 18px;
                color: #64748b;
                margin-bottom: 30px;
            }}

            .center {{
                text-align: center;
            }}

            .score {{
                font-size: 80px;
                font-weight: bold;
                color: #dc2626;
                margin: 10px 0;
            }}

            .decision {{
                font-size: 22px;
                font-weight: bold;
                color: #dc2626;
                margin-bottom: 10px;
            }}

            .meaning {{
                font-size: 16px;
                color: #475569;
                margin-bottom: 20px;
            }}

            .summary-box {{
                background: #f1f5f9;
                padding: 15px;
                border-left: 5px solid #dc2626;
                margin-top: 20px;
            }}

            .table {{
                margin-top: 40px;
                display: flex;
                border: 1px solid #e2e8f0;
            }}

            .cell {{
                flex: 1;
                text-align: center;
                padding: 20px;
                border-right: 1px solid #e2e8f0;
            }}

            .cell:last-child {{
                border-right: none;
            }}

            .number {{
                font-size: 24px;
                font-weight: bold;
            }}

            .label {{
                font-size: 14px;
                color: #64748b;
            }}

            .section-title {{
                font-size: 26px;
                font-weight: bold;
                margin-bottom: 20px;
            }}

            .clause {{
                background: #f8fafc;
                padding: 20px;
                margin-bottom: 20px;
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

            .clause-text {{
                font-style: italic;
                margin-bottom: 12px;
            }}

            .content-label {{
                font-weight: bold;
                margin-top: 10px;
            }}

            .content {{
                margin-top: 4px;
            }}

        </style>
    </head>

    <body>

        <!-- SUMMARY PAGE -->
        <div class="page">

            <div class="title">SahiSign</div>
            <div class="subtitle">Because every signature should be sahi</div>

            <hr>

            <div class="center">
                <p><b>Document:</b> {doc_type}</p>
                <p><b>Generated On:</b> {data["generated_at"]}</p>

                <div class="score">{score}/100</div>
                <div class="decision">{decision}</div>
                <div class="meaning">{meaning}</div>

                <div class="summary-box">
                    {summary_advice}
                </div>
            </div>

            <div class="table">
                <div class="cell">
                    <div class="number">{data["total_clauses"]}</div>
                    <div class="label">Total Clauses</div>
                </div>
                <div class="cell">
                    <div class="number" style="color:#dc2626">{data["high_risk_count"]}</div>
                    <div class="label">High Risk</div>
                </div>
                <div class="cell">
                    <div class="number" style="color:#d97706">{data["medium_risk_count"]}</div>
                    <div class="label">Medium Risk</div>
                </div>
                <div class="cell">
                    <div class="number" style="color:#16a34a">{data["low_risk_count"]}</div>
                    <div class="label">Low Risk</div>
                </div>
            </div>

        </div>

        <!-- CLAUSE PAGE -->
        <div class="page">

            <div class="section-title">Clause Analysis</div>

            {''.join([
                f'''
                <div class="clause {c["risk_level"].lower()}">

                    <div class="clause-title">
                        Clause {c.get("original_clause_number", c["clause_number"])} — {c["risk_level"]}
                    </div>

                    <div class="clause-text">
                        "{c.get("clause_text", "")}"
                    </div>

                    <div class="content-label">Plain English</div>
                    <div class="content">{c["plain_english"]}</div>

                    <div class="content-label">Law Violated</div>
                    <div class="content">{c["law_violated"]}</div>

                    <div class="content-label">Negotiation Tip</div>
                    <div class="content">{c["negotiation_tip"]}</div>

                </div>
                '''
                for c in clauses
            ])}

        </div>

    </body>
    </html>
    """


def generate_report_pdf(data, doc_type):
    html = generate_html(data, doc_type)

    options = {
        'encoding': 'UTF-8',
        'enable-local-file-access': ''
    }

    pdf = pdfkit.from_string(
        html,
        False,
        configuration=config,
        options=options
    )

    return pdf