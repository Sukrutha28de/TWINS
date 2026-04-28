Progress Log

Frontend:
SahiSign — Progress Log

Hours 0-4
- Set up Next.js with TypeScript and Tailwind
- Installed lucide-react and recharts
- Made folder structure for app, components, lib
- Built homepage with hero, document cards, and services sections
- Set up layout with Hindi + English fonts for the SahiSign logo

 Next Steps
- Build upload page with drag-and-drop
- Build dashboard with risk chart and clause cards
- Make 3 isometric SVGs (building, land, house)
- Add navbar and footer
- Connect frontend to Vaishnav's backend
- Test with a real PDF

Challenges
- v0.dev credits ran out, switched approach
- Frontend and backend on different laptops, need same WiFi for demo
- Groq takes 5-15 sec to analyze, need good loading state
- Hand-coding isometric SVGs is harder than using a design tool
- Backend gives a summary PDF, not a real redlined doc — had to rename the button

Backend :
Set up Flask server with API endpoints
- Implemented PDF text extraction using pdfplumber
- Integrated Groq AI (LLaMA 3.3 70B) for clause analysis
- Built clause-by-clause risk analysis system
- Implemented risk scoring logic (High / Medium / Low)
- Developed HTML-based PDF report generation using pdfkit
- Fixed encoding issues and improved PDF readability

 In Progress
- Improving UI/UX of dashboard and report display
- Final testing of backend and frontend integration
- Fixing minor bugs and performance issues

Next Steps
- Finalize PDF report design and styling
- Optimize user experience and responsiveness
- Prepare demo flow and presentation
- Add screenshots and documentation to GitHub

 Constraints / Challenges
- Token limits in Groq API required text truncation
- Initial PDF generation using ReportLab caused layout issues
- Switched to HTML-based PDF generation for better design control
- Ensuring accurate JSON parsing from AI responses