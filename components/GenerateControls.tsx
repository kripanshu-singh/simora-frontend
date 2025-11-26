import React from 'react';
import { Type, Loader2 } from 'lucide-react';

interface GenerateControlsProps {
    isTranscribing: boolean;
    loadingStatus: string;
    videoUrl: string;
    onTranscribe: () => void;
}

export const GenerateControls: React.FC<GenerateControlsProps> = ({ isTranscribing, loadingStatus, videoUrl, onTranscribe }) => {
    return (
        <div className="card action-section">
            <h2>3. Generate</h2>
            <button
                className="primary-btn"
                onClick={onTranscribe}
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
    );
};
