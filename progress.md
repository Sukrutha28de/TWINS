SahiSign — Frontend Progress Log

 Hours 0-4 — Setup
- Set up Next.js with TypeScript and Tailwind
- Built homepage and root layout with bilingual सही Sign branding
- Pushed initial frontend skeleton to GitHub

Hours 4-7 — Pages and Components
- Built upload page with drag-and-drop and document type selector
- Built first version of dashboard with risk donut chart and clause cards
- Created navbar, footer, logo, and 3 hand-coded isometric SVG illustrations (building, land, house)
- Set up .gitignore to keep .env and venv out of repo
- Got blocked by GitHub once because .env had the Groq key, cleaned commit history and pushed again

Hours 7-10 — Dashboard Rebuild and Homepage Polish
- Rebuilt the dashboard from scratch into a cleaner two-column layout
- Stats row at the top — total clauses plus high, medium, low risk counts in colored cards
- Sticky black score card on the left with donut chart, legend, and download button
- Collapsible clause cards on the right with color-coded info blocks (gray for plain English, blue for law, green for negotiation tip)
- Added a "+ New Analysis" button so users can start over
- Replaced the small "AI-Powered Risk Analysis" badge on the homepage hero with the actual सही Sign logo
- Increased navbar logo size from sm to md so the wordmark reads properly

 Hours 10-13 — UI Fixes and Connection Prep
- Fixed dashboard showing stale data — now clears old analysis from localStorage before each new upload
- Fixed invisible text in the upload drop zone — made the font color dark and readable
- Renamed "PDF Document" to "Upload your PDF document" for clarity
- Cleaned up wording across pages
- Set up `lib/api.ts` to read the backend URL from a single constant so we only update the IP in one place

 Hours 13-16 — Connecting Frontend to Backend
- Connected the Next.js frontend to Vaishnav's Flask backend, both running on the same laptop
- Frontend at localhost:3000 hits the backend at localhost:5000
- Upload flow — frontend sends file plus doc type to /analyze, backend returns structured JSON, dashboard renders it
- Tested end-to-end with a real demo document, full analysis flow worked
- PDF download flow — frontend sends analysis JSON to /generate-redlined-pdf, backend returns PDF blob

 Hours 16-19 — Dashboard Verdict System
- Made the score card more meaningful instead of just a number
- Added a clear verdict at the top — "Looks Safe" / "Proceed With Caution" / "Do Not Sign As-Is" — based on score
- Added a color-coded message box explaining what to do in plain English
- Donut chart center now shows clause count instead of repeating the score
- Compact legend with just numbers and labels
- Whole card now feels like advice from a friend rather than a corporate dashboard

Hours 19-22 — RERA Verification UI
- Added a RERA verification banner at the top of the dashboard for Builder Agreements
- Green banner with the RERA number when found, red banner with warning when missing
- Updated TypeScript interfaces to handle the new RERA fields from backend
- Added validation_failed handling so users get a clear alert if the wrong document type is uploaded
- Removed validation_failed check after testing showed it was too strict and rejecting valid PDFs — kept the UI ready for when validation is reintroduced

 Final Touches
- Added test PDFs for demo (Builder Agreement with RERA, Builder Agreement without RERA, Sale Deed, Home Loan Sanction Letter)
- Updated README with screenshots, architecture diagram, comparison table, and clean repository structure
- Multiple GitHub pushes throughout the hackathon — every 3 hours as per the rules

Challenges
- F12 console fake data trick was needed to preview the dashboard before the backend was ready
- Hand-coded the isometric SVGs because v0.dev credits ran out early
- GitHub push protection caught the .env leak twice — minor scares but a save in the end since both meant rotating the API key before any real exposure
- Stale localStorage was showing old results in the dashboard, fixed by clearing on each new upload
- AI validation was too aggressive on test documents — temporarily removed validation to keep the demo flow clean
- PDF generation initially failed because Hindi font wasn't rendering in wkhtmltopdf, switched to plain English title in the PDF report

Backend Progress – SahiSign

The backend system for SahiSign has been fully implemented and stabilized for the hackathon.

Core Functionality
- Built Flask-based API with endpoints for document analysis and PDF report generation
- Implemented PDF text extraction using pdfplumber
- Integrated Groq LLM (llama-3.3-70b-versatile) for clause-level legal analysis

Chunk-Based Processing
- Implemented document chunking to handle large PDFs
- Each chunk is analyzed independently and results are aggregated
- Supports multi-page legal documents without token overflow

AI Analysis Features
- Clause-by-clause risk classification (HIGH, MEDIUM, LOW)
- Plain English explanation for each clause
- Identification of relevant Indian laws
- Actionable negotiation tips for users

RERA Extraction
- Extracts RERA registration number from Builder Agreements
- Flags missing RERA as a compliance warning
- Performed only on the first chunk for consistency

Risk Prioritization
- Clauses sorted by severity: HIGH → MEDIUM → LOW
- Maintains original clause numbering for reference

Scoring System
- Risk score calculated out of 100
- High risk: -10 per clause
- Medium risk: -5 per clause
- Generates overall risk category (Low / Medium / High)

Summary Generation
- Generates overall summary based on risk distribution
- Includes clause counts and quick insights for users
- Timestamp added for report generation

PDF Report Generation
- Implemented using pdfkit and wkhtmltopdf
- Clean, structured report layout
- Summary page includes:
  - Risk score with clear meaning
  - Decision guidance (Safe / Caution / Do Not Sign)
  - Clause statistics
- Detailed clause analysis pages included

Stability Improvements
- Robust JSON parsing using regex extraction
- Prevented crashes from malformed AI responses
- Handled empty or failed analysis gracefully
- Reduced silent failures by adding controlled error handling

System Integration
- Backend successfully connected with frontend via REST APIs
- Supports full workflow:
  Upload → Analyze → View Dashboard → Download PDF

Final Status
- Backend is fully functional and stable
- Handles real-world legal documents
- Produces structured, explainable, and actionable outputs

What's Next
- Final demo polish and pitch practice
- Mobile responsiveness pass
- Add validation back with a better classifier model after the hackathon
- Eventually — multilingual support, WhatsApp bot, builder reputation database