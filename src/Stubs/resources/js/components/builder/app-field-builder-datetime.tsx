/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from 'react';
import {format} from 'date-fns';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {FieldDefinition} from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
    value: string | null;
    setData: (key: string, value: any) => void;
};

export function AppFieldBuilderDatetime({field, value, setData}: Props) {
    const [datePart, setDatePart] = useState<Date | null>(value ? new Date(value) : null);
    const [timePart, setTimePart] = useState<string>(() => {
        if (value) {
            const d = new Date(value);
            return format(d, 'HH:mm:ss');
        }
        return '00:00:00';
    });

    useEffect(() => {
        if (datePart && timePart) {
            const [hours, minutes, seconds] = timePart.split(':').map(Number);
            const fullDate = new Date(datePart);
            fullDate.setHours(hours);
            fullDate.setMinutes(minutes);
            fullDate.setSeconds(seconds);
            setData(field.name, fullDate.toISOString());
        }
    }, [datePart, timePart]);

    return (
        <div className="space-y-1">
            <div className="flex gap-3">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            id={field.name}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !datePart && "text-muted-foreground",
                                field.mergeClass
                            )}
                        >
                            {datePart ? format(datePart, "dd/MM/yyyy") : (field.placeholder || "Select date")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                        <Calendar
                            mode="single"
                            selected={datePart ?? undefined}
                            captionLayout="dropdown"
                            onSelect={(date) => setDatePart(date ?? null)}
                        />
                    </PopoverContent>
                </Popover>

                <Input
                    type="time"
                    step="1"
                    value={timePart}
                    onChange={(e) => setTimePart(e.target.value)}
                    className={cn(
                        "w-[140px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden",
                        field.mergeClass
                    )}
                />
            </div>
        </div>
    );
}
