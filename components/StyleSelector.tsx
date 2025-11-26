import React from 'react';

interface StyleSelectorProps {
    stylePreset: 'bottom-centered' | 'top-bar' | 'karaoke';
    setStylePreset: (style: 'bottom-centered' | 'top-bar' | 'karaoke') => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ stylePreset, setStylePreset }) => {
    return (
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
    );
};
