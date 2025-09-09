import { Checkbox } from "@/components/ui/checkbox";
import { FieldDefinition } from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderCheckbox({ field, value, onChange }: Props) {
    return (
        <div>
            <Checkbox
                id={field.key}
                checked={!!value}
                onCheckedChange={(checked) => onChange(field.key, checked)}
                className={field.mergeClass}
                disabled={field.isDisable}
            />
        </div>
    )
}
