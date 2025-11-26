# Simora Frontend

This is the frontend application for Simora, a video captioning tool powered by Remotion and Gemini AI.

## 🎥 Demo
Watch the demo video here: [Simora Demo](https://drive.google.com/file/d/1AehFdPraarwIihotpun0Pl1TCtUghw5N/view?usp=sharing)

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

## Project Structure

The frontend is built using a component-based architecture:

- **`components/`**: Reusable UI components.
    - `UploadSection`: Handles video file selection and upload.
    - `StyleSelector`: Allows users to switch between caption styles.
    - `GenerateControls`: Triggers the AI transcription process.
    - `PreviewPlayer`: Wraps the Remotion player for video playback.
    - `CaptionList`: Displays editable captions in the sidebar.
- **`hooks/`**: Custom hooks for business logic.
    - `useVideoEditor`: Manages the entire state of the editor (video URL, captions, playback time, etc.).
- **`remotion/`**: Contains the video rendering logic and composition.
- **`app/`**: Next.js App Router pages.

## How Caption Generation Works

1.  **Upload**: The user uploads a video file (`.mp4`) via the `UploadSection`.
2.  **Storage**: The video is sent to the backend (`/upload`) and stored locally.
3.  **Transcription**: The `useVideoEditor` hook triggers the transcription request (`/transcribe`).
4.  **AI Processing**: The backend sends the video audio to Google Gemini AI to generate timestamped captions.
5.  **Rendering**: The frontend receives the captions and uses **Remotion** (via `PreviewPlayer`) to overlay them on the video, synchronized with the playback.

## Deployment

### Vercel (Recommended)

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the following **Environment Variable** in Vercel project settings:
    -   `NEXT_PUBLIC_BASE_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`).
4.  Deploy.

### Other Platforms

You can deploy this Next.js app to any platform that supports Node.js (Render, Netlify, AWS, etc.). Ensure you set the `NEXT_PUBLIC_BASE_URL` environment variable in your production environment.
