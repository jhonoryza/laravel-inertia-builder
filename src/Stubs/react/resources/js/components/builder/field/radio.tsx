import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderRadio({ field, value, onChange }: Props) {
    return (
        <RadioGroup value={value || ''} onValueChange={(val) => onChange(field.key, val)}
            disabled={field.isDisable}>
            {field.options?.map((opt) => (
                <div key={opt.value.toString()}
                    className={cn('flex items-center space-x-2', field.mergeClass)}>
                    <RadioGroupItem value={opt.value.toString()} id={`${field.key}-${opt.value}`} />
                    <Label htmlFor={`${field.key}-${opt.value}`}>{opt.label}</Label>
                </div>
            ))}
        </RadioGroup>
    );
}
