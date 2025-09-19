import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { format } from "date-fns";

type Props = {
    field: FieldDefinition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderDate({ field, value, onChange }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    id={field.name}
                    disabled={field.isDisable}
                    className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground', field.mergeClass)}
                >
                    {value ? format(new Date(value), 'dd/MM/yyyy') : 'select date'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar mode="single" selected={value} captionLayout="dropdown"
                    onSelect={(date) => onChange(field.key, date)} />
            </PopoverContent>
        </Popover>
    )
}
