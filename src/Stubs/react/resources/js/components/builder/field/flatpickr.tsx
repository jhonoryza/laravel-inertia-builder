/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { format, parse } from "date-fns";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/dark.css';
import { useCallback, useEffect, useRef } from 'react';

interface FlatpickrFieldProps {
    field: FieldDefinition;
    value: any;
    operator?: string;
    onChange: (key: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderFlatpickr({ field, value, operator, onChange }: FlatpickrFieldProps) {
    const operatorRef = useRef(operator);
    operatorRef.current = operator;

    const inputRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<any>(null);

    const parseValue = useCallback((val: any): Date | null | Array<Date | null> => {
        if (!val) return null;

        if (val instanceof Date && !isNaN(val.getTime())) {
            return val;
        }

        const parseSingleDate = (dateStr: string): Date | null => {
            const trimmedDateStr = dateStr.trim();
            if (!trimmedDateStr) return null;

            // First, try parsing by standardizing the string for new Date()
            // This handles 'YYYY-MM-DD HH:mm:ss' by replacing the space with a 'T',
            // making it a format that new Date() can parse reliably across browsers.
            const standardizedDateStr = trimmedDateStr.replace(' ', 'T');
            const date = new Date(standardizedDateStr);
            if (!isNaN(date.getTime())) {
                return date;
            }

            // If native parsing fails, fall back to date-fns for specific formats.
            try {
                const parsedDate = parse(
                    trimmedDateStr,
                    field.withTime === false ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss',
                    new Date()
                );

                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate;
                }
            } catch {
                // date-fns parse can throw on weird inputs, though it usually returns Invalid Date.
            }

            console.warn('Failed to parse date:', trimmedDateStr);
            return null;
        };

        if (typeof val === 'string') {
            if (val.includes(',')) {
                return val.split(',').map(v => parseSingleDate(v));
            }
            return parseSingleDate(val);
        }

        return null;
    }, [field.withTime]);

    useEffect(() => {
        if (!inputRef.current) return;

        const defaultConfig = {
            enableTime: field.withTime !== false,
            time_24hr: true,
            dateFormat: field.withTime === false ? 'Y-m-d' : 'Y-m-d H:i:S',
            minuteIncrement: 1,
            allowInput: false,
            onClose: (selectedDates: Date[], dateStr: string, instance: any) => {
                // Handle final value when popup closes
                const currentOperator = operatorRef.current;

                if (selectedDates.length === 1 && field.withTime === true) {
                    if (field.utcConvert === false) {
                        const formatted = format(
                            selectedDates[0],
                            'yyyy-MM-dd HH:mm:ss'
                        );
                        onChange(field.key, formatted, currentOperator);
                        return;
                    }
                    onChange(field.key, selectedDates[0].toISOString(), currentOperator);
                }
            },
            onChange: (selectedDates: Date[], dateStr: string, instance: any) => {
                // console.log(selectedDates, dateStr, instance);
                const currentOperator = operatorRef.current;
                if (
                    (instance.config.mode === 'range') &&
                    selectedDates.length < 2
                ) {
                    return;
                }

                if (selectedDates.length > 1) {
                    instance.close();
                    if (field.utcConvert === false) {
                        const formattedOne = format(
                            selectedDates[0],
                            field.withTime === false ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
                        );
                        const formattedTwo = format(
                            selectedDates[1],
                            field.withTime === false ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
                        );
                        onChange(field.key, `${formattedOne},${formattedTwo}`, currentOperator);
                        return;
                    }
                    const tmpValue = `${selectedDates[0].toISOString()},${selectedDates[1].toISOString()}`;
                    onChange(field.key, tmpValue, currentOperator);
                } else if (selectedDates.length == 1) {
                    // For date-only fields, trigger onChange immediately
                    if (field.withTime === false) {
                        if (field.utcConvert === false) {
                            const formatted = format(
                                selectedDates[0],
                                'yyyy-MM-dd'
                            );
                            onChange(field.key, formatted, currentOperator);
                            return;
                        }
                        onChange(field.key, selectedDates[0].toISOString(), currentOperator);
                        return;
                    }

                    // For time picker fields, don't trigger onChange here
                    // Let onClose handle it when user is done selecting time
                    return;
                } else {
                    onChange(field.key, null, currentOperator);
                }
            },
        };

        let config = { ...defaultConfig, ...field.config };
        if (operatorRef.current === '><' || operatorRef.current === '!><') {
            config = { ...config, ...{ mode: 'range' } };
        }
        flatpickrInstance.current = flatpickr(inputRef.current, config);

        const initialDate = parseValue(value);
        if (initialDate) {
            flatpickrInstance.current.setDate(initialDate);
        }

    }, [field.config, field.key, operator, field.utcConvert, field.withTime, parseValue, onChange, value]);

    useEffect(() => {
        if (flatpickrInstance.current && flatpickrInstance.current.operator !== operatorRef.current) {
            flatpickrInstance.current.clear();
        }
    }, [operator]);

    return (
        <div>
            <Input
                ref={inputRef}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder || 'Pick a date'}
                readOnly
                autoComplete="off"
                className={cn("cursor-pointer", field.mergeClass)}
                disabled={field.isDisable}
            />
        </div>
    );
}
