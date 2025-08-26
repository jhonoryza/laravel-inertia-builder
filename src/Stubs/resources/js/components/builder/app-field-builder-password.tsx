import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { Eye, EyeOff } from 'lucide-react';
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

    return (
        <div key={field.name} className={`space-y-2 ${field.isInline ? 'flex items-center space-x-2' : ''}`}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <div className="relative w-full">
                <Input
                    id={field.name}
                    type={showPassword ? 'text' : 'password'}
                    value={value || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder || 'Fill in here..'}
                    className={cn(field.mergeClass, 'pr-10')} // kasih padding kanan biar gak ketimpa icon
                    disabled={field.isDisable }
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1} // biar gak ganggu tab navigation
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
        </div>
    );
}
