import { Slider } from "@/components/ui/slider";
import { FieldDefinition } from "@/types/field-builder";

type Props = {
    value: number;
    field: FieldDefinition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderSlider({ field, value, onChange }: Props) {
    const handleChange = (value: number) => {
        onChange(field.key, value);
    };
    return (
        <div className="pt-4">
            <Slider
                id={field.name}
                min={field.min || 0}
                max={field.max || 100}
                step={field.step || 1}
                value={[value || 0]}
                onValueChange={(vals) => handleChange(vals[0])}
                className={field.mergeClass}
                disabled={field.isDisable}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{field.min || 0}</span>
                <span>{value || 0}</span>
                <span>{field.max || 100}</span>
            </div>
        </div>
    );
}
