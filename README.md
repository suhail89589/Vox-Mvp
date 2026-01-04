# GFGBQ-Team-losers
Repository for losers - Vibe Coding Hackathon

VisionTutor is an AI-powered, voice-first learning platform designed to make PDF-based educational content accessible to visually impaired students.
The platform allows users to upload any PDF (textbook, notes, study material) and interact with it through natural language questions and voice responses, without requiring login or complex navigation.

This project was built as a session-based, single-page experience optimized for accessibility, speed, and simplicity — ideal for learners who rely on audio interaction.

🎯 Problem Statement
Visually impaired students often struggle with:
Static PDFs that screen readers don’t handle well
Lack of interactive explanations
Cognitive overload caused by multi-page navigation
No easy way to ask questions about study material
VisionTutor solves this by turning any PDF into a conversational, voice-enabled tutor.

💡 Solution
VisionTutor enables users to:
Upload a PDF
Automatically extract and segment text
Ask questions about the content
Receive AI-generated answers
Hear responses through real-time voice output
All within a single-page flow, without authentication or setup friction.

🧠 How It Works (High Level)
1️⃣ PDF Upload
User uploads a PDF file
Backend extracts readable text using pdfjs
Text is stored temporarily in an in-memory session
AI starts speaking paragraph wise 
you can interupt it and ask question by clicking blank space button for your query 
and close it when ur query u asked is complete .

2️⃣ Session-Based Learning

A unique sessionId is generated per upload

Session expires automatically after 5 minutes

No database or user account required

3️⃣ AI-Powered Q&A

User asks questions related to the PDF

AI responds strictly based on uploaded content

Uses Groq LLM for fast, low-latency responses

4️⃣ Voice Interaction

AI responses are converted to speech using Deepgram TTS

Optimized for accessibility and hands-free learning

🛠️ Tech Stack
Frontend

React + Vite
Tailwind CSS
Single-page, accessibility-first UI
No routing complexity (reduces cognitive load)
Backend
Node.js + Express
Multer (memory storage) for PDF uploads
pdfjs-dist for text extraction
Groq API for AI responses
Deepgram API for text-to-speech
In-memory session store (Map)

♿ Accessibility-First Design
Single-page flow (no navigation confusion)
Large buttons and simple layout
Voice-based learning interaction
Minimal visual dependency
Designed specifically with visually impaired users in mind

🚀 Key Features

📄 Upload any PDF

🧠 Ask questions about the content

🔊 Voice-based AI answers

⏱️ Auto-expiring sessions (privacy-friendly)

⚡ Fast response times

🔐 No authentication required

🔒 Privacy & Security

No user accounts

No data persistence

PDFs and sessions auto-delete after 5 minutes

Rate-limited API endpoints

🧪 Hackathon Scope & Constraints

This MVP focuses on:

Core accessibility

End-to-end functionality

Simplicity over scale

Future enhancements could include:

Persistent user acounts
Bookmarking progress
Multilingual voice support
Offline audio playback
Mobile-first optimizations
