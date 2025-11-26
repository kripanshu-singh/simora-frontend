import React from 'react';

interface StyleSelectorProps {
    stylePreset: 'bottom-centered' | 'top-bar' | 'karaoke';
    setStylePreset: (style: 'bottom-centered' | 'top-bar' | 'karaoke') => void;
    fontSize: number;
    setFontSize: (size: number) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ stylePreset, setStylePreset, fontSize, setFontSize }) => {
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

            <div className="font-size-control" style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>
                    Font Size: {fontSize}px
                </label>
                <input
                    type="range"
                    min="20"
                    max="100"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};
