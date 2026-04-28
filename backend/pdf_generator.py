import pdfkit

config = pdfkit.configuration(
    wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
)


def generate_html(data, doc_type):
    clauses = data['clauses']

    return f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                color: #0f172a;
                margin: 0;
                padding: 0;
            }}

            .page {{
                padding: 50px;
                page-break-after: always;
            }}

            .title {{
                text-align: center;
                font-size: 48px;
                font-weight: bold;
                margin-bottom: 5px;
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
                color: #16a34a;
                margin: 10px 0;
            }}

            .risk-text {{
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
            }}

            .summary {{
                margin-top: 20px;
                font-size: 16px;
                color: #334155;
            }}

            .table {{
                margin-top: 40px;
                display: flex;
                justify-content: space-between;
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
                color: #334155;
            }}

            .content-label {{
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

        <!-- PAGE 1: SUMMARY -->
        <div class="page">

            <div class="title">सहीSign</div>
            <div class="subtitle">Because every signature should be sahi</div>

            <hr>

            <div class="center">
                <p><b>Document:</b> {doc_type}</p>
                <p><b>Generated On:</b> {data['generated_at']}</p>

                <div class="score">{data['overall_score']}</div>
                <div class="risk-text">{data['overall_risk']}</div>

                <div class="summary">{data['summary']}</div>
            </div>

            <div class="table">
                <div class="cell">
                    <div class="number">{data['total_clauses']}</div>
                    <div class="label">Total Clauses</div>
                </div>
                <div class="cell">
                    <div class="number" style="color:#dc2626">{data['high_risk_count']}</div>
                    <div class="label">High Risk</div>
                </div>
                <div class="cell">
                    <div class="number" style="color:#d97706">{data['medium_risk_count']}</div>
                    <div class="label">Medium Risk</div>
                </div>
                <div class="cell">
                    <div class="number" style="color:#16a34a">{data['low_risk_count']}</div>
                    <div class="label">Low Risk</div>
                </div>
            </div>

        </div>

        <!-- PAGE 2: CLAUSE ANALYSIS -->
        <div class="page">

            <div class="title">Clause Analysis</div>

            {''.join([
                f'''
                <div class="clause {c['risk_level'].lower()}">

                    <div class="clause-title">
                        Original Clause {c.get('original_clause_number', c['clause_number'])} — {c['risk_level']} RISK
                    </div>

                    <div class="clause-text">
                        "{c.get('clause_text', '')}"
                    </div>

                    <div class="content-label">Plain English</div>
                    <div class="content">{c['plain_english']}</div>

                    <div class="content-label">Law Violated</div>
                    <div class="content">{c['law_violated']}</div>

                    <div class="content-label">Negotiation Tip</div>
                    <div class="content">{c['negotiation_tip']}</div>

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
    pdf = pdfkit.from_string(html, False, configuration=config)
    return pdf