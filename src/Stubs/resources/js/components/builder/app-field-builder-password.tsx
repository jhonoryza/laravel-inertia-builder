import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, fieldClasses } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type Props = {
    field: FieldDefinition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    error?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AppFieldBuilderPassword({ field, value, error, handleChange }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const [copied, setCopied] = useState(false);

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
        <div key={field.name} className={`space-y-2 ${field.isInline ? 'flex items-center space-x-2' : ''} ${fieldClasses(field)}`}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <div className="relative w-full">
                {/* eye icon di kiri */}
                <button
                    type="button"
                    className="absolute inset-y-0 left-2 flex items-center text-muted-foreground"
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
                        'pr-12 pl-9', // padding kiri buat eye, kanan buat copy
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
            {error && <div className="text-sm text-destructive">{error}</div>}
        </div>
    );
}
