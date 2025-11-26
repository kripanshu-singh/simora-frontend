'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Player } from '@remotion/player';
import { MyComposition, Caption } from '../remotion/Composition';
import { CaptionList } from '../components/CaptionList';
import axios from 'axios';
import { Upload, Type, Download, Play, Loader2 } from 'lucide-react';
import { PlayerRef } from '@remotion/player';
import './globals.css';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [stylePreset, setStylePreset] = useState<'bottom-centered' | 'top-bar' | 'karaoke'>('bottom-centered');
  const [durationInFrames, setDurationInFrames] = useState<number>(30 * 60); // Default to 60s
  const [currentTime, setCurrentTime] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<PlayerRef>(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      console.log('Video Metadata Loaded:', duration, 'seconds');
      if (!isNaN(duration)) {
        const frames = Math.ceil(duration * 30);
        console.log('Setting duration to:', frames, 'frames');
        setDurationInFrames(frames);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVideoUrl(response.data.url);
      setFilename(response.data.filename);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTranscribe = async () => {
    if (!filename) return;
    setIsTranscribing(true);
    setLoadingStatus('Initializing...');

    // Status update simulation
    const statusInterval = setInterval(() => {
      setLoadingStatus(prev => {
        if (prev === 'Initializing...') return 'Uploading to Gemini...';
        if (prev === 'Uploading to Gemini...') return 'Analyzing Audio...';
        if (prev === 'Analyzing Audio...') return 'Generating Captions (this may take a minute)...';
        return prev;
      });
    }, 3000);

    try {
      const response = await axios.post('http://localhost:5000/transcribe', { filename }, {
        timeout: 300000 // 5 minutes timeout
      });
      setCaptions(response.data.captions);
    } catch (error) {
      console.error('Transcription failed', error);
      alert('Transcription failed or timed out. Please try a shorter video.');
    } finally {
      clearInterval(statusInterval);
      setIsTranscribing(false);
      setLoadingStatus('');
    }
  };

  const handleUpdateCaption = (index: number, newText: string) => {
    const newCaptions = [...captions];
    newCaptions[index] = { ...newCaptions[index], text: newText };
    setCaptions(newCaptions);
  };

  const handleSeek = (timeInSeconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds * 30); // Seek to frame (30fps)
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const frame = playerRef.current.getCurrentFrame();
        if (frame !== null) {
          setCurrentTime(frame / 30);
        }
      }
    }, 100);
    return () => clearInterval(interval);
    return () => clearInterval(interval);
  }, []);

  const inputProps = useMemo(() => ({
    videoUrl,
    captions,
    stylePreset,
  }), [videoUrl, captions, stylePreset]);

  return (
    <main className="container">
      <header className="header">
        <img src="/icon.png" alt="Simora.ai" className="app-logo" />
      </header>

      <div className="content-grid with-sidebar">
        <div className="left-sidebar">
          <CaptionList
            captions={captions}
            onUpdateCaption={handleUpdateCaption}
            onSeek={handleSeek}
            currentTime={currentTime}
          />
        </div>

        <div className="controls-panel">
          <div className="card upload-section">
            <h2>1. Upload Video</h2>
            <div
              className="upload-box"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/mp4"
                hidden
              />
              {isUploading ? (
                <Loader2 className="animate-spin" size={48} />
              ) : (
                <>
                  <Upload size={48} />
                  <p>Click to upload .mp4</p>
                </>
              )}
            </div>
          </div>

          <div className="card style-section">
            <h2>2. Choose Style</h2>
            <div className="style-options">
              <button
                className={`style-btn ${stylePreset === 'bottom-centered' ? 'active' : ''}`}
                onClick={() => setStylePreset('bottom-centered')}
              >
                Standard
              </button>
              <button
                className={`style-btn ${stylePreset === 'top-bar' ? 'active' : ''}`}
                onClick={() => setStylePreset('top-bar')}
              >
                News / Top Bar
              </button>
              <button
                className={`style-btn ${stylePreset === 'karaoke' ? 'active' : ''}`}
                onClick={() => setStylePreset('karaoke')}
              >
                Karaoke
              </button>
            </div>
          </div>

          <div className="card action-section">
            <h2>3. Generate</h2>
            <button
              className="primary-btn"
              onClick={handleTranscribe}
              disabled={!videoUrl || isTranscribing}
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm">{loadingStatus}</span>
                </>
              ) : (
                <>
                  <Type size={20} /> Auto-Generate Captions
                </>
              )}
            </button>
          </div>
        </div>

        <div className="preview-panel">
          <div className="player-wrapper">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onLoadedMetadata={handleLoadedMetadata}
                  style={{ display: 'none' }}
                  preload="auto"
                />
                <Player
                  ref={playerRef}
                  component={MyComposition}
                  durationInFrames={durationInFrames}
                  compositionWidth={1080}
                  compositionHeight={1920}
                  fps={30}
                  controls
                  loop={false}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  inputProps={inputProps}
                />
              </>
            ) : (
              <div className="placeholder-player">
                <Play size={64} />
                <p>Preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
