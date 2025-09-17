def parse_pdf(file_path: str) -> str:
    import pdfplumber

    with pdfplumber.open(file_path) as pdf:
        text = ''
        for page in pdf.pages:
            text += page.extract_text() + '\n'
    return text.strip()


def parse_docx(file_path: str) -> str:
    from docx import Document

    doc = Document(file_path)
    text = '\n'.join(paragraph.text for paragraph in doc.paragraphs)
    return text.strip()