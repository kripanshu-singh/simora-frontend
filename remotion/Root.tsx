import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="CaptionedVideo"
                component={MyComposition}
                durationInFrames={300} // Default, will be dynamic
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    videoUrl: '',
                    captions: [],
                    stylePreset: 'bottom-centered',
                    fontSize: 50,
                }}
            />
        </>
    );
};
