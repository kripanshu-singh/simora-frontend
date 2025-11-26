# Simora Frontend

This is the frontend application for Simora, a video captioning tool powered by Remotion and Gemini AI.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher

## Setup

1.  Clone the repository.
2.  Navigate to the `simora-frontend` directory.
3.  Install dependencies:

```bash
npm install
```

4.  Create a `.env.local` file in the root directory and add your backend URL:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
```

## Running Locally

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How Caption Generation Works

1.  **Upload**: The user uploads a video file (`.mp4`).
2.  **Storage**: The video is sent to the backend (`/upload`) and stored locally.
3.  **Transcription**: The frontend requests transcription (`/transcribe`).
4.  **AI Processing**: The backend sends the video audio to Google Gemini AI to generate timestamped captions.
5.  **Rendering**: The frontend receives the captions and uses **Remotion** to overlay them on the video, synchronized with the playback.

## Deployment

### Vercel (Recommended)

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the following **Environment Variable** in Vercel project settings:
    -   `NEXT_PUBLIC_BASE_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`).
4.  Deploy.

### Other Platforms

You can deploy this Next.js app to any platform that supports Node.js (Render, Netlify, AWS, etc.). Ensure you set the `NEXT_PUBLIC_BASE_URL` environment variable in your production environment.
