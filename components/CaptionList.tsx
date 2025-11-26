import React from 'react';
import { Caption } from '../remotion/Composition';
import { Play, Clock } from 'lucide-react';

interface CaptionListProps {
    captions: Caption[];
    onUpdateCaption: (index: number, newText: string) => void;
    onSeek: (timeInSeconds: number) => void;
    currentTime: number;
}

export const CaptionList: React.FC<CaptionListProps> = ({
    captions,
    onUpdateCaption,
    onSeek,
    currentTime
}) => {
    return (
        <div className="caption-list-container">
            <div className="caption-list-header">
                <h3>Captions ({captions.length})</h3>
                <span className="text-sm text-gray-400">Click to seek • Edit to update</span>
            </div>

            <div className="caption-list-scroll">
                {captions.length === 0 ? (
                    <div className="empty-captions">
                        <p>No captions generated yet.</p>
                        <p className="text-sm">Upload a video and click "Auto-Generate"</p>
                    </div>
                ) : (
                    captions.map((cap, index) => {
                        const isActive = currentTime >= cap.start && currentTime <= cap.end;

                        return (
                            <div
                                key={index}
                                className={`caption-item ${isActive ? 'active' : ''}`}
                                onClick={() => onSeek(cap.start)}
                            >
                                <div className="caption-time">
                                    <Clock size={12} />
                                    <span>{cap.start.toFixed(1)}s - {cap.end.toFixed(1)}s</span>
                                    {isActive && <span className="live-badge">LIVE</span>}
                                </div>

                                <textarea
                                    className="caption-input"
                                    value={cap.text}
                                    onChange={(e) => onUpdateCaption(index, e.target.value)}
                                    onClick={(e) => e.stopPropagation()} // Prevent seek when clicking input
                                    rows={2}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
