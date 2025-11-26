import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface UploadSectionProps {
    isUploading: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ isUploading, onFileChange, fileInputRef }) => {
    return (
        <div className="card upload-section">
            <h2>1. Upload Video</h2>
            <div
                className="upload-box"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    accept="video/mp4"
                    hidden
                />
                {isUploading ? (
                    <Loader2 className="animate-spin" size={48} />
                ) : (
                    <>
                        <Upload size={48} />
                        <p>Click to upload .mp4</p>
                    </>
                )}
            </div>
        </div>
    );
};
