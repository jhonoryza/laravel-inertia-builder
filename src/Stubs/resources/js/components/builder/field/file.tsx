/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { FieldDefinition } from "@/types/field-builder";
import React, { useEffect, useRef, useState } from 'react';

interface FileFieldProps {
    field: FieldDefinition & {
        accept?: string[];
        multiple?: boolean;
    };
    value: any;
    onChange: (key: string, value: any, operator?: string) => void;
}

interface FilePreview {
    name: string;
    url: string;
    type: string;
    isFromServer?: boolean;
}

export function AppFieldBuilderFile({ field, value, onChange }: FileFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [serverPreviews, setServerPreviews] = useState<FilePreview[]>([]);
    const [localPreviews, setLocalPreviews] = useState<FilePreview[]>([]);

    const preview = field.preview;

    // generate preview awal dari server
    useEffect(() => {
        if (!preview) {
            setServerPreviews([]);
            return;
        }

        let previews: FilePreview[] = [];

        if (typeof preview === 'string') {
            previews = [{
                name: preview.split('/').pop() || 'file',
                url: preview,
                type: guessFileType(preview),
                isFromServer: true
            }];
        } else if (Array.isArray(preview) && typeof preview[0] === 'string') {
            previews = preview.map((url: string) => ({
                name: url.split('/').pop() || 'file',
                url,
                type: guessFileType(url),
                isFromServer: true
            }));
        }

        setServerPreviews(previews);
    }, [preview]);

    const guessFileType = (url: string) => {
        const ext = url.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return `image/${ext}`;
        if (ext === 'pdf') return 'application/pdf';
        return 'application/octet-stream';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            onChange(field.key, field.multiple ? files : files[0]);

            // buat preview URL
            const previews: FilePreview[] = Array.from(files).map(file => ({
                name: file.name,
                url: URL.createObjectURL(file),
                type: file.type,
                isFromServer: false
            }));
            setLocalPreviews(previews);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const acceptAttribute = field.accept ? field.accept.join(',') : undefined;

    useEffect(() => {
        return () => {
            localPreviews.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [localPreviews]);

    const previewsToShow = localPreviews.length > 0 ? localPreviews : serverPreviews;

    return (
        <div className="space-y-2">
            {previewsToShow.length > 0 && (
                <div className="mt-2 space-y-2">
                    <ul className="text-sm text-muted-foreground mt-1 space-y-2">
                        {previewsToShow.map((file, index) => (
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
            <input
                ref={fileInputRef}
                type="file"
                id={field.name}
                name={field.name}
                accept={acceptAttribute}
                multiple={field.multiple}
                onChange={handleFileChange}
                className="hidden"
            />

            <Button
                type="button"
                variant="outline"
                onClick={handleButtonClick}
                className={field.mergeClass}
            >
                {field.placeholder || (field.multiple ? 'Choose Files' : 'Choose File')}
            </Button>
        </div>
    );
}
