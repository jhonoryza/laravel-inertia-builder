import {FieldDefinition} from "@/types/field-builder";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (name: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderRadio({field, value, onChange}: Props) {
    return (
        <RadioGroup value={value || ''} onValueChange={(val) => onChange(field.name, val)}
                    disabled={field.isDisable}>
            {field.options?.map((opt) => (
                <div key={opt.value.toString()}
                     className={cn('flex items-center space-x-2', field.mergeClass)}>
                    <RadioGroupItem value={opt.value.toString()} id={`${field.name}-${opt.value}`}/>
                    <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
                </div>
            ))}
        </RadioGroup>
    );
}
