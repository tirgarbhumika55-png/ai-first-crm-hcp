# Testing & Verification Guide

## 1. System Status Check
Ensure both servers are running in your terminal:
- **Backend**: `uvicorn app.main:app --reload` (Port 8000)
- **Frontend**: `npm run dev` (Port 5173/3000)

## 2. Test Scenario A: Manual Interaction Logging
1. **HCP Name**: Type "Dr. Sarah Lee" (or any name).
2. **Interaction Type**: Keep as "Meeting".
3. **Date/Time**: Select today's date and a time.
4. **Attendees**: Enter "Jane Doe (MSL)".
5. **Topics Discussed**: Enter "Discussed Phase 3 clinical trial results for CardioFix."
6. **Sentiment**: Click the "Positive" 😊 radio button.
7. **Outcomes/Follow-up**: Enter simple text like "Follow up next week."
8. **Save**: Click the **"Save Log"** button at the bottom right of the form.
9. **Verification**:
    - You should see an alert: "Interaction Saved!".
    - The fields will clear (except default Type).
    - The **"Recent Logs"** widget (bottom right) will update to show "Dr. Sarah Lee".

## 3. Test Scenario B: AI Agent Interaction
1. Locate the **AI Assistant** (Right Panel).
2. Type the following message:
   > "I had a call with Dr. John Doe today. He is concerned about the side effects of OncoBoost."
3. Press Enter.
4. **Verification**:
    - The Agent should reply confirming the interaction has been logged.
    - Refresh the page (or log another manual item) to see "Dr. John Doe" appear in the "Recent Logs".

## 4. Pending Tasks for User
- **Record Video**: Create a 10-15 min video following the scenarios above.
- **GitHub Submission**: Push this code to your repository.
- **API Key**: Ensure `GROQ_API_KEY` is set in `backend/.env`.

## 5. Known Limitations (MVP)
- The "Recent Logs" list does not automatically refresh effectively *immediately* after an AI Chat log (requires manual refresh or page reload).
- "Edit" functionality is currently available via the AI Agent ("Edit the last log...") but does not have a dedicated UI button yet.
