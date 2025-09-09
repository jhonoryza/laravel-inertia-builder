/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

interface FileFieldProps {
    value: any;
}

interface FilePreview {
    name: string;
    url: string;
    type: string;
    isFromServer?: boolean;
}

export function AppFieldInfoFile({ value }: FileFieldProps) {
    const [serverPreviews, setServerPreviews] = useState<FilePreview[]>([]);

    // generate preview awal dari server
    useEffect(() => {
        if (!value) {
            setServerPreviews([]);
            return;
        }

        let previews: FilePreview[] = [];

        if (typeof value === 'string') {
            previews = [{
                name: value.split('/').pop() || 'file',
                url: value,
                type: guessFileType(value),
                isFromServer: true
            }];
        } else if (Array.isArray(value) && typeof value[0] === 'string') {
            previews = value.map((url: string) => ({
                name: url.split('/').pop() || 'file',
                url,
                type: guessFileType(url),
                isFromServer: true
            }));
        }

        setServerPreviews(previews);
    }, [value]);

    const guessFileType = (url: string) => {
        const ext = url.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return `image/${ext}`;
        if (ext === 'pdf') return 'application/pdf';
        return 'application/octet-stream';
    };

    return (
        <div className="space-y-2">
            {serverPreviews.length > 0 && (
                <div className="mt-2 space-y-2">
                    <ul className="text-sm text-muted-foreground mt-1 space-y-2">
                        {serverPreviews.map((file, index) => (
                            <li key={index} className="flex flex-col gap-1">
                                <span>{file.name}</span>
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-32 h-32 object-cover rounded border"
                                    />
                                ) : (
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        Preview
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
