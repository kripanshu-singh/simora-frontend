import { AbsoluteFill, Video, useVideoConfig } from 'remotion';
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
    fontSize: number;
};

export const MyComposition: React.FC<MyCompositionProps> = ({ videoUrl, captions, stylePreset, fontSize }) => {
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
            <Video src={videoUrl} />
            <Captions captions={captions} fps={fps} stylePreset={stylePreset} fontSize={fontSize} />
        </AbsoluteFill>
    );
};
