import { Caption } from '../remotion/Composition';

// Helper to format seconds to HH:MM:SS,ms or HH:MM:SS.ms
const formatTime = (seconds: number, separator: ',' | '.') => {
    const pad = (num: number, size: number) => ('000' + num).slice(size * -1);
    const time = parseFloat(seconds.toFixed(3));
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60) % 60;
    const secs = Math.floor(time % 60);
    const ms = Math.round((time % 1) * 1000);

    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}${separator}${pad(ms, 3)}`;
};

// Helper to parse time string to seconds
const parseTime = (timeString: string) => {
    const parts = timeString.replace(',', '.').split(':');
    const hours = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
};

export const toSRT = (captions: Caption[]): string => {
    return captions
        .map((cap, index) => {
            return `${index + 1}\n${formatTime(cap.start, ',')} --> ${formatTime(cap.end, ',')}\n${cap.text}\n`;
        })
        .join('\n');
};

export const toVTT = (captions: Caption[]): string => {
    return 'WEBVTT\n\n' + captions
        .map((cap) => {
            return `${formatTime(cap.start, '.')} --> ${formatTime(cap.end, '.')}\n${cap.text}\n`;
        })
        .join('\n');
};

export const parseSRT = (content: string): Caption[] => {
    const captions: Caption[] = [];
    const blocks = content.trim().split(/\n\s*\n/);

    blocks.forEach(block => {
        const lines = block.split('\n');
        if (lines.length >= 3) {
            // SRT format:
            // 1
            // 00:00:01,000 --> 00:00:04,000
            // Text
            const timeLine = lines[1].includes('-->') ? lines[1] : lines[2]; // Handle potential index line missing or extra
            if (timeLine && timeLine.includes('-->')) {
                const [startStr, endStr] = timeLine.split('-->').map(s => s.trim());
                const text = lines.slice(lines.indexOf(timeLine) + 1).join(' ');

                captions.push({
                    start: parseTime(startStr),
                    end: parseTime(endStr),
                    text: text.trim()
                });
            }
        }
    });
    return captions;
};

export const parseVTT = (content: string): Caption[] => {
    const captions: Caption[] = [];
    const lines = content.trim().split('\n');
    let currentStart = 0;
    let currentEnd = 0;
    let currentText = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === 'WEBVTT' || line === '') continue;

        if (line.includes('-->')) {
            const [startStr, endStr] = line.split('-->').map(s => s.trim());
            currentStart = parseTime(startStr);
            currentEnd = parseTime(endStr);

            // Get text from next lines until empty line
            let textLines = [];
            let j = i + 1;
            while (j < lines.length && lines[j].trim() !== '') {
                textLines.push(lines[j].trim());
                j++;
            }
            currentText = textLines.join(' ');

            captions.push({
                start: currentStart,
                end: currentEnd,
                text: currentText
            });
            i = j; // Skip processed lines
        }
    }
    return captions;
};
