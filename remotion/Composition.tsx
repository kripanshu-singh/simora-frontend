import React from 'react';
import { AbsoluteFill, OffthreadVideo, useVideoConfig } from 'remotion';
import { Captions } from './Captions';

export type Caption = {
    start: number;
    end: number;
    text: string;
};

export type MyCompositionProps = {
    videoUrl: string;
    captions: Caption[];
    stylePreset: 'bottom-centered' | 'top-bar' | 'karaoke';
};

export const MyComposition: React.FC<MyCompositionProps> = ({ videoUrl, captions, stylePreset }) => {
    const { fps } = useVideoConfig();

    if (!videoUrl) {
        return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', color: 'white' }}>
                <h1>No Video Selected</h1>
            </AbsoluteFill>
        );
    }

    return (
        <AbsoluteFill>
            <OffthreadVideo src={videoUrl} />
            <Captions captions={captions} fps={fps} stylePreset={stylePreset} />
        </AbsoluteFill>
    );
};
