/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FieldDefinition } from "@/types/field-builder";
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

type Props = {
    field: FieldDefinition;
    value: string | null;
    onChange: (key: string, value: any, operator?: string) => void;
};

export function AppFieldBuilderDatetime({ field, value, onChange }: Props) {
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
            onChange(field.key, fullDate.toISOString());
        }
    }, [datePart, timePart]);

    return (
        <div className="space-y-1">
            <div className="flex gap-3">
                <div className='w-full'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                id={field.name}
                                className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !datePart && 'text-muted-foreground',
                                    field.mergeClass,
                                )}
                            >
                                {datePart
                                    ? format(datePart, 'dd/MM/yyyy')
                                    : field.placeholder || 'Select date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="overflow-hidden p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={datePart ?? undefined}
                                captionLayout="dropdown"
                                onSelect={(date) => setDatePart(date ?? null)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Input
                    type="time"
                    step="1"
                    value={timePart}
                    onChange={(e) => setTimePart(e.target.value)}
                    className={cn(
                        'w-[140px] appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden',
                        field.mergeClass,
                    )}
                />
            </div>
        </div>
    );
}
