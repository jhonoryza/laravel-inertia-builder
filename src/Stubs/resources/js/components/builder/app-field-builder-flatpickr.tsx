/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useCallback, useEffect, useRef} from 'react';
import {Input} from '@/components/ui/input';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/dark.css';
import {cn} from "@/lib/utils";
import {format, parse} from "date-fns";
import {FieldDefinition} from "@/types/field-builder";

interface FlatpickrFieldProps {
    field: FieldDefinition;
    value: any;
    operator?: string;
    setData: (field: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderFlatpickr({field, value, operator, setData}: FlatpickrFieldProps) {
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
                        setData(field.name, `${formattedOne},${formattedTwo}`, currentOperator);
                        return;
                    }
                    const tmpValue = `${selectedDates[0].toISOString()},${selectedDates[1].toISOString()}`;
                    setData(field.name, tmpValue, currentOperator);
                } else if (selectedDates.length == 1) {
                    if (field.utcConvert === false) {
                        const formatted = format(
                            selectedDates[0],
                            field.withTime === false ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
                        );
                        setData(field.name, formatted, currentOperator);
                        return;
                    }
                    setData(field.name, selectedDates[0].toISOString(), currentOperator);
                } else {
                    setData(field.name, null, currentOperator);
                }
            },
        };

        let config = {...defaultConfig, ...field.config};
        if (operatorRef.current === '><' || operatorRef.current === '!><') {
            config = {...config, ...{mode: 'range'}};
        }
        flatpickrInstance.current = flatpickr(inputRef.current, config);

        const initialDate = parseValue(value);
        if (initialDate) {
            flatpickrInstance.current.setDate(initialDate);
        }

    }, [field.config, field.name, operator, field.utcConvert, field.withTime, parseValue, setData, value]);

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
            />
        </div>
    );
}
