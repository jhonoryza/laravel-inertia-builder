import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
};

export function AppFieldBuilderPassword({ field, value, onChange }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(field.key, e.target.value);
    };

    const handleCopy = async () => {
        if (!value) return;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                // fallback lama
                const textarea = document.createElement('textarea');
                textarea.value = value;
                textarea.style.position = 'fixed'; // biar gak geser scroll
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    return (
        <div>
            <div className="flex w-full rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
                {/* eye icon di kiri */}
                <button
                    type="button"
                    className="cursor-pointer flex items-center border-r border-input px-3 text-sm text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>

                {/* input */}
                <Input
                    id={field.name}
                    type={showPassword ? 'text' : 'password'}
                    value={value || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder || 'Fill in here..'}
                    className={cn(
                        field.mergeClass,
                        'flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
                    )}
                    disabled={field.isDisable}
                />

                {/* copy button di kanan */}
                {field.copyable && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        className="absolute inset-y-0 right-2 h-8 w-8"
                        disabled={!value}
                    >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                    </Button>
                )}
            </div>
            {copied && <div className="text-xs text-muted-foreground">Copied!</div>}
        </div>
    );
}
