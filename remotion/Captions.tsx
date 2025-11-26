import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Caption } from './Composition';

type CaptionsProps = {
    captions: Caption[];
    fps: number;
    stylePreset: 'bottom-centered' | 'top-bar' | 'karaoke';
    fontSize: number;
};

export const Captions: React.FC<CaptionsProps> = ({ captions, fps, stylePreset, fontSize }) => {
    const frame = useCurrentFrame();
    const currentTime = frame / fps;

    const currentCaption = captions.find(
        (cap) => currentTime >= cap.start && currentTime <= cap.end
    );

    if (!currentCaption) return null;

    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
        pointerEvents: 'none',
        padding: '20px',
    };

    let presetStyle: React.CSSProperties = {};

    switch (stylePreset) {
        case 'bottom-centered':
            presetStyle = {
                bottom: '10%',
                fontSize: `${fontSize}px`,
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                fontWeight: 'bold',
            };
            break;
        case 'top-bar':
            presetStyle = {
                top: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fbbf24', // Amber-400
                fontSize: `${fontSize}px`,
                padding: '30px',
                fontWeight: '600',
            };
            break;
        case 'karaoke':
            presetStyle = {
                bottom: '15%',
                fontSize: `${fontSize + 10}px`, // Karaoke usually bigger
                color: '#a855f7', // Purple-500
                fontWeight: '900',
                WebkitTextStroke: '2px white',
                textTransform: 'uppercase',
            };
            break;
        default:
            presetStyle = {
                bottom: '10%',
                fontSize: `${fontSize}px`,
                color: 'white',
            };
    }

    return (
        <div style={{ ...baseStyle, ...presetStyle }}>
            {currentCaption.text}
        </div>
    );
};
