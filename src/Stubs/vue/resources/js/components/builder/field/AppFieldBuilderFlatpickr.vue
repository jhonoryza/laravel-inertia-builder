<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/dark.css';
import { format, parse } from 'date-fns';
import { useFormStore } from '@/stores/form';

interface Props {
    field: FieldDefinition;
    modelValue?: any;
    idx: string;
}

const props = defineProps<Props>();
const store = useFormStore(props.idx)();

const inputRef = ref<HTMLInputElement | null>(null);
let fpInstance: flatpickr.Instance | null = null;

const parseValue = (val: any): Date | null | Array<Date | null> => {
    if (!val) return null;

    const parseSingleDate = (dateStr: string): Date | null => {
        const trimmed = dateStr.trim();
        if (!trimmed) return null;

        const standardized = trimmed.replace(' ', 'T');
        const date = new Date(standardized);
        if (!isNaN(date.getTime())) return date;

        try {
            const parsed = parse(
                trimmed,
                props.field.withTime === false ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss',
                new Date()
            );
            if (!isNaN(parsed.getTime())) return parsed;
        } catch { }
        console.warn('Failed to parse date:', trimmed);
        return null;
    };

    if (typeof val === 'string') {
        if (val.includes(',')) return val.split(',').map(parseSingleDate);
        return parseSingleDate(val);
    }

    return null;
};

onMounted(() => {
    if (!inputRef.value) return;

    const config: any = {
        enableTime: props.field.withTime !== false,
        time_24hr: true,
        dateFormat: props.field.withTime === false ? 'Y-m-d' : 'Y-m-d H:i:S',
        minuteIncrement: 1,
        allowInput: false,
        onClose: (selectedDates: Date[]) => {
            if (!selectedDates.length) return;
            if (selectedDates.length === 1 && props.field.withTime) {
                if (props.field.utcConvert === false) {
                    const formatted = format(selectedDates[0], 'yyyy-MM-dd HH:mm:ss');
                    store.onReactive(props.field.key, formatted);
                    return;
                }
                store.onReactive(props.field.key, selectedDates[0].toISOString());
            }
        },
        onChange: (selectedDates: Date[], dateStr: string, instance: any) => {
            if (instance.config.mode === 'range' && selectedDates.length < 2) return;

            if (selectedDates.length > 1) {
                instance.close();
                if (props.field.utcConvert === false) {
                    const formattedOne = format(
                        selectedDates[0],
                        props.field.withTime === false ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
                    );
                    const formattedTwo = format(
                        selectedDates[1],
                        props.field.withTime === false ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
                    );
                    store.onReactive(props.field.key, `${formattedOne},${formattedTwo}`);
                    return;
                }
                store.onReactive(props.field.key, `${selectedDates[0].toISOString()},${selectedDates[1].toISOString()}`);
            } else if (selectedDates.length === 1 && props.field.withTime === false) {
                if (props.field.utcConvert === false) {
                    const formatted = format(selectedDates[0], 'yyyy-MM-dd');
                    store.onReactive(props.field.key, formatted);

                    return;
                }
                store.onReactive(props.field.key, selectedDates[0].toISOString());
            } else if (!selectedDates.length) {
                store.onReactive(props.field.key, null);
            }
            // console.log(selectedDates, dateStr, selectedDates.length, props.field);
        },
    };

    fpInstance = flatpickr(inputRef.value, { ...config, ...props.field.config });

    const initialDate = parseValue(props.modelValue);
    const cleanDate = Array.isArray(initialDate)
        ? initialDate.filter((d): d is Date => d instanceof Date)
        : initialDate instanceof Date
            ? initialDate
            : null;

    if (fpInstance && cleanDate) fpInstance.setDate(cleanDate);
});

watch(() => props.modelValue, (newVal) => {
    const initialDate = parseValue(newVal);
    const cleanDate = Array.isArray(initialDate)
        ? initialDate.filter((d): d is Date => d instanceof Date)
        : initialDate instanceof Date
            ? initialDate
            : null;

    if (fpInstance && cleanDate) fpInstance.setDate(cleanDate);
});
</script>

<template>
    <div>
        <input
              ref="inputRef"
              type="text"
              autocomplete="off"
              :id="props.field.key"
              :name="props.field.key"
              :placeholder="props.field.placeholder || 'Pick a date'"
              :disabled="props.field.isDisable"
              :class="cn('w-full rounded-md border border-gray-300 bg-white text-sm px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400', props.field.mergeClass)"
              readonly
            />
    </div>
</template>
