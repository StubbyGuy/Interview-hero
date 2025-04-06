# 🧠 InView

> An AI-powered interview assistant to help you ace your next opportunity — built in 36 hours at [WildHacks 2025](https://wildhacks.net) by Northwestern University.

🔗 [Devpost Submission](https://devpost.com/software/inview-d9tnhw)

---

## 💡 Overview

**InView** is a smart, real-time interview assistant that simulates technical interviews, evaluates your answers, and provides emotion-based feedback. It's designed to help job seekers build confidence, improve communication, and get actionable insights into their performance.

---

## 🎯 Features

- **AI-Generated Interview Questions**  
  Automatically tailored to the job description or role (e.g., *React Developer*, *Data Scientist*).

- **Real-time Answer Evaluation (Gemini API)**  
  Evaluates responses with detailed scoring, feedback, and suggestions.

- **Live Emotion Detection via Webcam (FER)**  
  - Analyzes facial expressions frame-by-frame.
  - Tracks stress level, confusion, confidence, focus, and presence.

- **Post-Interview Summary Dashboard**
  - Emotion metrics (stress/confidence/confusion/focus).
  - AI-based technical evaluation.
  - Replay session and review answers.

- **Custom JD Input + Role Selector**
  Choose predefined job roles or paste your own job description.

- **Privacy-First Approach**  
  All video processing is local unless the user chooses to upload.

---

## 🔧 Tech Stack

| Layer       | Technology                          |
|------------|--------------------------------------|
| Frontend   | **React.js**, MUI (Material UI)      |
| Backend    | **FastAPI** (Python)                 |
| AI/ML APIs | **Google Gemini API**, **FER Library** |
| Video/Emotion | **WebRTC**, MediaRecorder API, OpenCV |
| Database (Planned) | MongoDb Atlas                      |

---

## 🛠 How It Works

1. **User selects a job role or enters a custom JD**  
2. **LLM (Gemini) generates tailored technical questions**
3. **User answers in text while webcam records live video**
4. **Emotion snapshots captured every second via FER**
5. **After interview ends**:
   - Answers are evaluated by Gemini
   - Emotion data analyzed
   - Final feedback is displayed with insights and scores

---

## 👨‍💻 Team InView

- **Mohammed Saalim Kartapillai**  
- **Derick Johnson**  
- **Eric Somogyi**  
- **Salvador Ortiz**  

---

## 🚀 Try It Locally

```bash
# Frontend
cd interview-ai-frontend
npm install
npm start

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs on http://localhost:8000
Frontend runs on http://localhost:3000
