 SahiSign — Progress Log

Frontend 
 Setup :

- Set up Next.js with TypeScript and Tailwind
- Built homepage and root layout with bilingual सही Sign branding
- Pushed initial frontend skeleton to GitHub

 Pages and Components :

- Added Vaishnav's backend folder (analyzer, extractor, app, pdf_generator)
- Built upload page with drag-and-drop and document type selector
- Built first version of dashboard with risk donut chart and clause cards
- Created navbar, footer, logo, and 3 isometric SVG illustrations
- Set up .gitignore to keep .env and venv out of repo
- Got blocked by GitHub once because .env had Groq key, cleaned commit history and pushed again

  Dashboard Rebuild and Homepage Polish :

- Rebuilt the dashboard from scratch into a cleaner two-column layout
- Stats row at the top — total clauses plus high, medium, low risk counts in colored cards
- Sticky black score card on the left with donut chart, legend, and download button — stays visible as user scrolls
- Collapsible clause cards on the right — each card opens to show the full clause, plain English, law violated, and negotiation tip
- Color-coded everything by risk level (red, orange, green)
- Added a "+ New Analysis" button so users can quickly start over
- Replaced the small "AI-Powered Risk Analysis" badge on the homepage hero with the actual सही Sign logo, way more on-brand
- Increased navbar logo size from sm to md so the wordmark reads properly

 Next
- Connect frontend to backend on the same WiFi
- Test full upload-to-dashboard flow with a real builder agreement PDF
- Polish edge cases (long file names, very long clause text, many clauses)
- Mobile responsiveness pass

 Challenges
- Spent time on a fake-data debug flow because the dashboard auto-redirects to upload when localStorage is empty — had to use F12 console tricks to preview design
- Hand-coding isometric SVGs (building, land, house) was slower than expected since v0.dev ran out of credits early
- Had to undo a commit and reset history when GitHub blocked the .env push — pushed protection caught the API key before it leaked publicly, which was actually a save

Backend

- Built Flask backend with API endpoints for document analysis and PDF report generation
- Implemented PDF text extraction using pdfplumber
- Integrated Groq AI (LLaMA 3.3 70B) for clause-level legal analysis
- Designed structured JSON output for clause-wise risk analysis
- Implemented risk scoring system (High / Medium / Low)

Recent Improvements
- Implemented chunk-based document processing to overcome AI token limits
- Enabled analysis of larger documents by splitting text into multiple segments
- Aggregated results from multiple AI responses into a single unified output
- Increased chunk processing limit from 5 to 10 for improved document coverage
- Enhanced system prompt to be domain-specific for:
  Builder Agreements (RERA Act, Consumer Protection Act)
  Sale Deeds (Transfer of Property Act, Registration Act)
  Home Loan Sanction Letters (RBI Guidelines)
- Improved clause detection, legal reasoning, and negotiation suggestions

Data Processing Enhancements
- Removed duplicate clauses from AI output
- Sorted clauses by risk level (High → Medium → Low)
- Preserved original clause numbering alongside sorted results
- Added document summary generation based on risk distribution
- Added timestamp for analysis generation

PDF Report Improvements
- Redesigned PDF layout using HTML-based generation (pdfkit)
- Added dedicated summary first page with:
  overall score, risk level, clause counts, and summary text
- Improved branding with larger "सहीSign" title and subtitle
- Added structured clause analysis section starting from second page
- Included original clause numbers in report for traceability
- Displayed full clause text along with explanation, law violated, and negotiation tips
- Improved spacing, typography, and readability for professional output

In Progress
- Testing performance and accuracy on large multi-page documents
- Optimizing response time for chunk-based processing
- Improving consistency of AI-generated outputs

Next Steps
- Add highlighting for top critical risk clauses
- Improve frontend visualization and integration with backend data
- Optimize chunking strategy for better balance between coverage and speed
- Final testing and demo preparation

Constraints and Challenges
- Token limits in AI models required implementation of chunk-based processing
- Multiple API calls increase response time for large documents
- Ensuring consistent and valid JSON output from AI responses
- Maintaining balance between performance and full document coverage

Currently Working On

Connecting the frontend to the backend for live end-to-end testing. Vaishnav's Flask backend is running on his laptop, and we're updating `lib/api.ts` with his local IP so my frontend can hit `/analyze` and `/generate-redlined-pdf` over the same WiFi. Testing with real builder agreements, sale deeds, and home loan letters to make sure the full flow holds up — upload, AI analysis, dashboard render, PDF download. Tweaking edge cases as we hit them.
