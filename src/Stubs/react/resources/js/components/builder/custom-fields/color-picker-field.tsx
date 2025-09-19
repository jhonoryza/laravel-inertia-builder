import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorPickerFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    presetColors?: string[];
    showOpacity?: boolean;
    allowCustom?: boolean;
}

export function ColorPickerField({
    label,
    value = '#000000',
    onChange,
    presetColors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'],
    showOpacity = false,
    allowCustom = true
}: ColorPickerFieldProps) {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Default to #000000 if empty
    const currentColor = value || '#000000';

    // Determine if the color is light to use dark text
    const isLightColor = (color: string) => {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Calculate luminance - if > 0.5, it's a light color
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <div
                    className="flex items-center cursor-pointer border rounded-md overflow-hidden"
                    onClick={() => setShowPicker(!showPicker)}
                >
                    <div
                        className="w-12 h-8"
                        style={{ backgroundColor: currentColor }}
                    />
                    <div className="px-3 flex-1">
                        {currentColor.toUpperCase()}
                    </div>
                </div>

                {showPicker && (
                    <div
                        ref={pickerRef}
                        className="absolute z-50 mt-1 w-72 rounded-md border bg-card shadow-md overflow-hidden p-3"
                    >
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {presetColors.map((color, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={cn(
                                        'w-8 h-8 rounded-md flex items-center justify-center',
                                        color === currentColor && 'ring-2 ring-primary'
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        onChange(color);
                                        setShowPicker(false);
                                    }}
                                >
                                    {color === currentColor && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={isLightColor(color) ? '#000000' : '#ffffff'}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>

                        {allowCustom && (
                            <div className="mt-3">
                                <Input
                                    type="color"
                                    value={currentColor}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="w-full h-8"
                                />
                            </div>
                        )}

                        {showOpacity && (
                            <div className="mt-3 space-y-1">
                                <div className="text-xs">Opacity</div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="100"
                                    className="w-full"
                                    onChange={() => {/* Opacity handling */}}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
