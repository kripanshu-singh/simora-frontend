'use client';

import React from 'react';
import { CaptionList } from '../components/CaptionList';
import { FileUp, FileDown } from 'lucide-react';
import './globals.css';
import { useVideoEditor } from '../hooks/useVideoEditor';
import { UploadSection } from '../components/UploadSection';
import { StyleSelector } from '../components/StyleSelector';
import { GenerateControls } from '../components/GenerateControls';
import { PreviewPlayer } from '../components/PreviewPlayer';

export default function Home() {
  const {
    videoUrl,
    captions,
    isUploading,
    isTranscribing,
    loadingStatus,
    stylePreset,
    setStylePreset,
    durationInFrames,
    compositionWidth,
    compositionHeight,
    currentTime,
    fileInputRef,
    captionInputRef,
    videoRef,
    playerRef,
    handleLoadedMetadata,
    handleFileChange,
    handleTranscribe,
    handleUpdateCaption,
    handleSeek,
    handleExport,
    handleImport,
    inputProps
  } = useVideoEditor();

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
          <div className="caption-actions">
            <h3>Manage Captions</h3>
            <div className="action-buttons">
              <button className="secondary-btn" onClick={() => captionInputRef.current?.click()}>
                <FileUp size={16} /> Import
              </button>
              <input
                type="file"
                ref={captionInputRef}
                onChange={handleImport}
                accept=".srt,.vtt"
                hidden
              />
              <button className="secondary-btn" onClick={() => handleExport('srt')} disabled={captions.length === 0}>
                <FileDown size={16} /> Export SRT
              </button>
              <button className="secondary-btn" onClick={() => handleExport('vtt')} disabled={captions.length === 0}>
                <FileDown size={16} /> Export VTT
              </button>
            </div>
          </div>
        </div>

        <div className="controls-panel">
          <UploadSection
            isUploading={isUploading}
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />

          <StyleSelector
            stylePreset={stylePreset}
            setStylePreset={setStylePreset}
          />

          <GenerateControls
            isTranscribing={isTranscribing}
            loadingStatus={loadingStatus}
            videoUrl={videoUrl}
            onTranscribe={handleTranscribe}
          />
        </div>

        <PreviewPlayer
          videoUrl={videoUrl}
          videoRef={videoRef}
          playerRef={playerRef}
          durationInFrames={durationInFrames}
          compositionWidth={compositionWidth}
          compositionHeight={compositionHeight}
          inputProps={inputProps}
          handleLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </main>
  );
}
