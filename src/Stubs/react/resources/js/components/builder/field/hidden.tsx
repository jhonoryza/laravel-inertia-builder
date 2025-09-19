import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderHidden({ field, value, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(field.key, e.target.value);
    };

    return (
        <div>
            <Input
                id={field.name}
                type={field.type}
                value={value || ''}
                onChange={handleChange}
                placeholder={field.placeholder || 'Fill in here..'}
                className={cn(field.mergeClass, 'hidden')}
                disabled={field.isDisable}
            />
        </div>
    )
}
