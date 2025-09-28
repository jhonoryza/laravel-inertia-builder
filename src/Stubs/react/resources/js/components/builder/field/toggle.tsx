import { Switch } from "@/components/ui/switch";
import { FieldDefinition } from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderToggle({ field, value, onChange }: Props) {
    const defValue = value ? true : false;
    return (
        <div>
            <Switch
                id={field.name}
                checked={defValue}
                onCheckedChange={(checked) => onChange(field.key, checked)}
                className={field.mergeClass}
                disabled={field.isDisable}
            />
        </div>
    );
}
