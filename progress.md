SahiSign — Progress Log

Hours 4-6:
- Added backend folder with Vaishnav's Flask code (analyzer, extractor, app, pdf_generator)
- Built upload page with drag-and-drop and document type selector
- Built dashboard page with risk donut chart, stats cards, and clause breakdown
- Created navbar, footer, and logo components (Hindi + English wordmark)
- Made 3 isometric SVG illustrations (building, land, house)
- Added api.ts to manage backend URL in one place
- Set up .gitignore to keep .env and venv out of repo

Next
- Connect frontend to backend on same WiFi
- Test end-to-end with real PDF
- Polish edge cases and mobile responsiveness

Challenges
- GitHub blocked first push due to API key in .env, had to clean and reset commits
- Generating isometric illustrations without a design tool meant hand-coding SVGs
- Dashboard only opens after real upload by design, used preview mockup for testing

Backend (Vaishnav)
- Built Flask backend with API endpoints for document analysis and PDF generation
- Implemented PDF text extraction using pdfplumber
- Integrated Groq AI (LLaMA 3.3 70B) for clause-level analysis
- Designed structured JSON response for clause breakdown
- Implemented risk scoring system (High / Medium / Low)
- Switched from ReportLab to HTML-based PDF generation using pdfkit for better layout and design
- Fixed encoding issues and improved PDF readability

Recent Improvements
- Implemented chunk-based document processing to overcome AI token limits
- Enabled analysis of larger documents by splitting text into multiple segments
- Aggregated results from multiple AI calls into a single unified response
- Increased chunk processing limit from 5 to 10 for better document coverage
- Enhanced system prompt to be domain-specific for different document types:
  Builder Agreements (RERA, Consumer Protection Act)
  Sale Deeds (Transfer of Property Act, Registration Act)
  Loan Sanction Letters (RBI Guidelines)
- Improved clause detection, legal reasoning, and negotiation suggestions

In Progress
- Testing accuracy and performance on large multi-page documents
- Optimizing response time for chunk-based processing
- Improving consistency of AI-generated outputs

Next Steps
- Add summary insights such as top critical risks
- Improve frontend visualization of analysis results
- Optimize chunking strategy for better balance between coverage and speed
- Final testing and demo preparation

Constraints and Challenges
- Token limits in AI models required chunk-based processing
- Multiple API calls increase response time for large documents
- Ensuring consistent and valid JSON output from AI responses
- Balancing performance with full document coverage

Goal
Deliver a reliable AI-powered system that helps users understand property documents and identify legal risks before signing