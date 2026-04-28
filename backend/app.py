from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from extractor import extract_text_from_pdf
from analyzer import analyze_document
import io

app = Flask(__name__)
CORS(app)

@app.route("/")
def health():
    return jsonify({"status": "DocSafe backend running"})

@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    doc_type = request.form.get("document_type", "Builder Agreement")
    
    file_bytes = file.read()
    
    # Extract text
    text = extract_text_from_pdf(file_bytes)
    
    if not text or len(text) < 50:
        return jsonify({"error": "Could not extract text from document"}), 400
    
    # Analyze
    results = analyze_document(text, doc_type)
    
    return jsonify(results)

@app.route("/generate-redlined-pdf", methods=["POST"])
def generate_pdf():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    doc_type = data.get("document_type", "Builder Agreement")
    analysis_results = data.get("analysis_results")
    
    if not analysis_results:
        return jsonify({"error": "No analysis results provided"}), 400
    
    from pdf_generator import generate_report_pdf
    pdf_bytes = generate_report_pdf(analysis_results, doc_type)
    
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name="docsafe_report.pdf"
    )

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")

