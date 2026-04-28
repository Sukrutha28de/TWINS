import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_document(text: str, doc_type: str) -> dict:

    system_prompt = """You are an expert Indian property lawyer specializing in Karnataka real estate law.
Analyze the following property document clause by clause.
For each clause identify:
1) Risk level - HIGH, MEDIUM, or LOW
2) Plain English explanation of what the clause means and why it is risky
3) The specific Indian law or regulation it violates - be specific with section numbers where possible.
4) A practical negotiation tip the user can use.

Return ONLY a valid JSON array. No explanation, no markdown, no backticks. Just the raw JSON array.

Format:
[
  {
    "clause_number": 1,
    "risk_level": "HIGH",
    "clause_text": "exact text from document",
    "plain_english": "what this means in simple words",
    "law_violated": "specific law and section",
    "negotiation_tip": "what the user can do"
  }
]"""

    max_chars = 4000
    if len(text) > max_chars:
        text = text[:max_chars]

    user_message = f"Document Type: {doc_type}\n\nDocument Text:\n{text}"

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.1,
        max_tokens=4000
    )

    response_text = response.choices[0].message.content.strip()

    # Find JSON array in response
    start = response_text.find("[")
    end = response_text.rfind("]") + 1
    if start != -1 and end > start:
        response_text = response_text[start:end]

    try:
        clauses = json.loads(response_text)
    except json.JSONDecodeError:
        clauses = [{
            "clause_number": 1,
            "risk_level": "MEDIUM",
            "clause_text": "Could not parse document clauses",
            "plain_english": "The document could not be fully analyzed. Please try again.",
            "law_violated": "N/A",
            "negotiation_tip": "Please consult a lawyer for this document."
        }]

    high_count = sum(1 for c in clauses if c.get("risk_level") == "HIGH")
    medium_count = sum(1 for c in clauses if c.get("risk_level") == "MEDIUM")
    low_count = sum(1 for c in clauses if c.get("risk_level") == "LOW")

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
        "total_clauses": len(clauses),
        "high_risk_count": high_count,
        "medium_risk_count": medium_count,
        "low_risk_count": low_count,
        "clauses": clauses
    }