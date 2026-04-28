import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def split_text(text, chunk_size=3000):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]


def analyze_document(text: str, doc_type: str) -> dict:

    system_prompt = f"""
You are a highly experienced Indian property lawyer specializing in Karnataka real estate law, banking regulations, and property transactions.

You are analyzing a legal document in chunks due to size constraints. Each chunk may contain partial sections of the full document.

DOCUMENT TYPE:
{doc_type}

Builder Agreement:
Check RERA Act 2016 (Sec 18, 19), Karnataka Apartment Ownership Act, Consumer Protection Act 2019.
Focus on delay penalties, one-sided clauses, hidden charges, possession terms.

Sale Deed:
Check Transfer of Property Act 1882, Registration Act 1908, Karnataka Land Revenue Act.
Focus on ownership clarity, encumbrances, missing obligations.

Home Loan Sanction Letter:
Check RBI Guidelines, Consumer Protection Act 2019.
Focus on interest rate terms, hidden charges, prepayment penalties, default clauses.

For each clause:
- Assign risk level: HIGH, MEDIUM, LOW
- Provide clause text
- Provide plain English explanation
- Provide law violated or "None identified"
- Provide negotiation tip

Rules:
- Only analyze this chunk
- Do not assume missing clauses
- Do not hallucinate laws

Return only valid JSON array:

[
  {{
    "clause_number": 1,
    "risk_level": "HIGH",
    "clause_text": "...",
    "plain_english": "...",
    "law_violated": "...",
    "negotiation_tip": "..."
  }}
]
"""

    chunks = split_text(text)
    all_clauses = []
    MAX_CHUNKS = 10

    for i, chunk in enumerate(chunks[:MAX_CHUNKS]):
        try:
            user_message = f"Document Type: {doc_type}\n\nDocument Chunk {i+1}:\n{chunk}"

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.1,
                max_tokens=2000
            )

            response_text = response.choices[0].message.content.strip()

            start = response_text.find("[")
            end = response_text.rfind("]") + 1

            if start != -1 and end > start:
                response_text = response_text[start:end]

            chunk_clauses = json.loads(response_text)

            if isinstance(chunk_clauses, list):
                all_clauses.extend(chunk_clauses)

        except:
            continue

    if not all_clauses:
        return {
            "overall_score": 0,
            "overall_risk": "High Risk",
            "total_clauses": 0,
            "high_risk_count": 0,
            "medium_risk_count": 0,
            "low_risk_count": 0,
            "clauses": [{
                "clause_number": 1,
                "risk_level": "HIGH",
                "clause_text": "Analysis failed",
                "plain_english": "Unable to process the document.",
                "law_violated": "N/A",
                "negotiation_tip": "Please consult a lawyer."
            }]
        }

    for idx, clause in enumerate(all_clauses, start=1):
        clause["clause_number"] = idx

    high_count = sum(1 for c in all_clauses if c.get("risk_level") == "HIGH")
    medium_count = sum(1 for c in all_clauses if c.get("risk_level") == "MEDIUM")
    low_count = sum(1 for c in all_clauses if c.get("risk_level") == "LOW")

    score = 100 - (high_count * 10) - (medium_count * 5)
    score = max(0, score)

    if score >= 70:
        overall_risk = "Low Risk"
    elif score >= 40:
        overall_risk = "Medium Risk"
    else:
        overall_risk = "High Risk"

    return {
        "overall_score": score,
        "overall_risk": overall_risk,
        "total_clauses": len(all_clauses),
        "high_risk_count": high_count,
        "medium_risk_count": medium_count,
        "low_risk_count": low_count,
        "clauses": all_clauses
    }