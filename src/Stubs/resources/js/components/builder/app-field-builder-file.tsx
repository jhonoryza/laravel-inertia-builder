/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {FieldDefinition} from "@/types/field-builder";

interface FileFieldProps {
    field: FieldDefinition & {
        accept?: string[];
        multiple?: boolean;
    };
    value: any;
    setData: (field: string, value: any) => void;
}

export function AppFieldBuilderFile({ field, value, setData }: FileFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileNames, setFileNames] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setData(field.name, field.multiple ? files : files[0]);

            // Update displayed file names
            const names = Array.from(files).map(file => file.name);
            setFileNames(names);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const acceptAttribute = field.accept ? field.accept.join(',') : undefined;

    return (
        <div className="space-y-2">
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

            {fileNames.length > 0 && (
                <div className="mt-2">
                    <Label>Selected {field.multiple ? 'Files' : 'File'}:</Label>
                    <ul className="text-sm text-muted-foreground mt-1">
                        {fileNames.map((name, index) => (
                            <li key={index}>{name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
