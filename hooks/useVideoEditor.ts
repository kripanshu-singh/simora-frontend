import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { PlayerRef } from '@remotion/player';
import { Caption } from '../remotion/Composition';
import { parseSRT, parseVTT, toSRT, toVTT } from '../utils/captionUtils';

export const useVideoEditor = () => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [filename, setFilename] = useState<string>('');
    const [captions, setCaptions] = useState<Caption[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState<string>('');
    const [stylePreset, setStylePreset] = useState<'bottom-centered' | 'top-bar' | 'karaoke'>('bottom-centered');
    const [durationInFrames, setDurationInFrames] = useState<number>(30 * 60); // Default to 60s
    const [compositionWidth, setCompositionWidth] = useState<number>(1080);
    const [compositionHeight, setCompositionHeight] = useState<number>(1920);
    const [fontSize, setFontSize] = useState<number>(50);
    const [currentTime, setCurrentTime] = useState<number>(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const captionInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<PlayerRef>(null);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const duration = videoRef.current.duration;
            const width = videoRef.current.videoWidth;
            const height = videoRef.current.videoHeight;

            console.log('Video Metadata Loaded:', duration, 'seconds', width, 'x', height);

            if (width && height) {
                setCompositionWidth(width);
                setCompositionHeight(height);
            }

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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/upload`, formData, {
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/transcribe`, { filename }, {
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

    const handleExport = (format: 'srt' | 'vtt') => {
        if (captions.length === 0) return;
        const content = format === 'srt' ? toSRT(captions) : toVTT(captions);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `captions.${format}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (file.name.endsWith('.srt')) {
                setCaptions(parseSRT(content));
            } else if (file.name.endsWith('.vtt')) {
                setCaptions(parseVTT(content));
            } else {
                alert('Unsupported file format. Please upload .srt or .vtt');
            }
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current) {
                const frame = playerRef.current.getCurrentFrame();
                if (frame !== null) {
                    setCurrentTime(frame / 30);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const inputProps = useMemo(() => ({
        videoUrl,
        captions,
        stylePreset,
        fontSize,
    }), [videoUrl, captions, stylePreset, fontSize]);

    return {
        videoUrl,
        filename,
        captions,
        isUploading,
        isTranscribing,
        loadingStatus,
        stylePreset,
        setStylePreset,
        fontSize,
        setFontSize,
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
    };
};
