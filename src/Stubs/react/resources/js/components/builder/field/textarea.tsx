import { Textarea } from "@/components/ui/textarea";
import { FieldDefinition } from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderTextarea({ field, value, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(field.key, e.target.value);
    };

    return (
        <div>
            <Textarea
                id={field.name}
                value={value || ''}
                onChange={handleChange}
                cols={field.cols}
                rows={field.rows}
                placeholder={field.placeholder || 'Fill in here..'}
                className={field.mergeClass}
                disabled={field.isDisable}
            />
        </div>
    )
}
