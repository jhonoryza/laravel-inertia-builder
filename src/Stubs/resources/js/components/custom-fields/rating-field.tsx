import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingFieldProps {
    name: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
    maxStars?: number;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    activeColor?: string;
    readonly?: boolean;
}

export function RatingField({
    label,
    value = 0,
    onChange,
    maxStars = 5,
    size = 'md',
    color = '#e5e7eb',
    activeColor = '#f59e0b',
    readonly = false
}: RatingFieldProps) {
    const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    const containerSizeClasses = {
        sm: 'gap-1',
        md: 'gap-2',
        lg: 'gap-3'
    };

    return (
        <div className="space-y-2">
            <div className={cn(
                'flex items-center',
                containerSizeClasses[size],
                readonly ? 'opacity-70' : ''
            )}>
                {stars.map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={cn(
                            'focus:outline-none',
                            !readonly && 'hover:scale-110 transition-transform'
                        )}
                        onClick={() => !readonly && onChange(star)}
                        disabled={readonly}
                    >
                        <Star
                            className={sizeClasses[size]}
                            fill={star <= value ? activeColor : 'none'}
                            color={star <= value ? activeColor : color}
                            strokeWidth={1.5}
                        />
                    </button>
                ))}

                {!readonly && (
                    <button
                        type="button"
                        className="text-xs text-muted-foreground ml-2"
                        onClick={() => onChange(0)}
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="text-sm text-muted-foreground">
                {value > 0 ? `Rated ${value} of ${maxStars} stars` : 'Not rated'}
            </div>
        </div>
    );
}
