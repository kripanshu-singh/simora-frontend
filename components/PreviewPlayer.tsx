import React from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Play } from 'lucide-react';
import { MyComposition, Caption } from '../remotion/Composition';

interface PreviewPlayerProps {
    videoUrl: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    playerRef: React.RefObject<PlayerRef | null>;
    durationInFrames: number;
    compositionWidth: number;
    compositionHeight: number;
    inputProps: any;
    handleLoadedMetadata: () => void;
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
    videoUrl,
    videoRef,
    playerRef,
    durationInFrames,
    compositionWidth,
    compositionHeight,
    inputProps,
    handleLoadedMetadata,
}) => {
    return (
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
                            compositionWidth={compositionWidth}
                            compositionHeight={compositionHeight}
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
    );
};
