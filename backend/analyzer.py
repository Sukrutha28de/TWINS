import os
import json
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def split_text(text, chunk_size=3000):
    paragraphs = text.split("\n")
    chunks = []
    current = ""

    for p in paragraphs:
        if len(current) + len(p) < chunk_size:
            current += p + "\n"
        else:
            if current:
                chunks.append(current)
            current = p + "\n"

    if current:
        chunks.append(current)

    return chunks


def analyze_document(text: str, doc_type: str) -> dict:

    if not text or len(text.strip()) < 50:
        return {
            "overall_score": 0,
            "overall_risk": "High Risk",
            "total_clauses": 0,
            "high_risk_count": 0,
            "medium_risk_count": 0,
            "low_risk_count": 0,
            "summary": "Invalid or empty document.",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "clauses": []
        }

    chunks = split_text(text)
    all_clauses = []
    MAX_CHUNKS = min(len(chunks), 12)

    rera_number = None
    rera_status = None
    rera_warning = None

    for i, chunk in enumerate(chunks[:MAX_CHUNKS]):
        try:
            system_prompt = f"""You are a highly experienced Indian property lawyer specializing in Karnataka real estate law, banking regulations, and property transactions.

You are analyzing a {doc_type} document in chunks due to size. This is chunk {i+1} of {len(chunks)}.

LEGAL FRAMEWORK TO APPLY:

Builder Agreement:
- RERA Act 2016 (Section 18 — possession delay penalty, Section 19 — buyer rights)
- Karnataka Apartment Ownership Act
- Consumer Protection Act 2019
- Focus: delay penalties, one-sided cancellation, hidden charges, super built-up area fraud, no RERA number

Sale Deed:
- Transfer of Property Act 1882
- Registration Act 1908
- Karnataka Land Revenue Act
- Focus: title clarity, encumbrances, undisclosed loans, vague boundaries, stamp duty evasion

Home Loan Sanction Letter:
- RBI Guidelines 2012 (no prepayment penalty on floating rate loans)
- Consumer Protection Act 2019
- Banking Regulation Act
- Focus: prepayment penalties, forced insurance, vague charges, unilateral rate changes

RERA EXTRACTION (Builder Agreement only, chunk 1 only):
Extract RERA registration number if present.
Patterns: PRM/KA/RERA/..., P[number], DLRERA[number], KA/RERA/...
If not found, note as missing — this is a HIGH RISK flag.

CLAUSE ANALYSIS RULES:
- Analyze every clause in this chunk thoroughly
- Do not skip clauses even if they seem standard
- Be specific with law references including section numbers
- Negotiation tips must be practical and actionable
- Plain English must be understood by a non-lawyer

Return ONLY valid JSON, no explanation, no markdown:

{{
  "rera_number": null,
  "rera_status": null,
  "rera_warning": null,
  "clauses": [
    {{
      "clause_number": 1,
      "risk_level": "HIGH",
      "clause_text": "exact or near-exact clause text",
      "plain_english": "simple explanation of what this means and why it matters",
      "law_violated": "specific law name and section number",
      "negotiation_tip": "practical advice on what to do or ask for"
    }}
  ]
}}"""

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

            # Clean markdown if present
            if "```" in response_text:
                parts = response_text.split("```")
                for part in parts:
                    part = part.strip()
                    if part.startswith("json"):
                        part = part[4:].strip()
                    if part.startswith("{"):
                        response_text = part
                        break

            # Extract JSON object
            start = response_text.find("{")
            end = response_text.rfind("}") + 1
            if start != -1 and end > start:
                response_text = response_text[start:end]

            parsed = json.loads(response_text)

            # Extract RERA from first chunk
            if i == 0 and parsed.get("rera_number"):
                rera_number = parsed.get("rera_number")
                rera_status = parsed.get("rera_status")
                rera_warning = parsed.get("rera_warning")

            chunk_clauses = parsed.get("clauses", [])
            if isinstance(chunk_clauses, list):
                all_clauses.extend(chunk_clauses)

        except Exception as e:
            print(f"Error on chunk {i+1}: {e}")
            continue

    # Fallback
    if not all_clauses:
        return {
            "overall_score": 0,
            "overall_risk": "High Risk",
            "total_clauses": 0,
            "high_risk_count": 0,
            "medium_risk_count": 0,
            "low_risk_count": 0,
            "summary": "Unable to process the document. Please try again.",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "clauses": [{
                "clause_number": 1,
                "original_clause_number": 1,
                "risk_level": "HIGH",
                "clause_text": "Analysis failed",
                "plain_english": "The document could not be analyzed.",
                "law_violated": "N/A",
                "negotiation_tip": "Please consult a lawyer directly."
            }]
        }

    # Deduplicate
    unique_clauses = []
    seen = set()
    for c in all_clauses:
        text_val = c.get("clause_text", "")[:100]
        if text_val not in seen:
            seen.add(text_val)
            unique_clauses.append(c)
    all_clauses = unique_clauses

    # Add original numbering
    for idx, clause in enumerate(all_clauses, start=1):
        clause["original_clause_number"] = idx

    # Sort by risk priority
    all_clauses.sort(
        key=lambda c: {"HIGH": 0, "MEDIUM": 1, "LOW": 2}.get(c.get("risk_level"), 3)
    )

    # Renumber
    for idx, clause in enumerate(all_clauses, start=1):
        clause["clause_number"] = idx

    high_count = sum(1 for c in all_clauses if c.get("risk_level") == "HIGH")
    medium_count = sum(1 for c in all_clauses if c.get("risk_level") == "MEDIUM")
    low_count = sum(1 for c in all_clauses if c.get("risk_level") == "LOW")

    score = max(0, 100 - (high_count * 10) - (medium_count * 5))

    if score >= 70:
        overall_risk = "Low Risk"
    elif score >= 40:
        overall_risk = "Medium Risk"
    else:
        overall_risk = "High Risk"

    summary = f"This document contains {high_count} high-risk and {medium_count} medium-risk clauses out of {len(all_clauses)} total clauses analyzed."

    return {
        "overall_score": score,
        "overall_risk": overall_risk,
        "rera_number": rera_number,
        "rera_status": rera_status,
        "rera_warning": rera_warning,
        "total_clauses": len(all_clauses),
        "high_risk_count": high_count,
        "medium_risk_count": medium_count,
        "low_risk_count": low_count,
        "summary": summary,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "clauses": all_clauses
    }