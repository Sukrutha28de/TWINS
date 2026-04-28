import pdfplumber

def extract_text_from_pdf(file_bytes: bytes) -> str:
    import io
    full_text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
    return full_text.strip()
    