<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/dark.css';
import { format, parse } from 'date-fns';
import { Filter } from '@/types/datatable';
import { useDatatableStore } from '@/stores/datatable';

interface Props {
    filterDef: Filter;
    idx: string;
}

const props = defineProps<Props>();
const store = useDatatableStore(props.idx)();
const localValue = ref(null);

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
                'yyyy-MM-dd',
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

// Tambah computed untuk current operator
const currentOperator = computed(() => 
    store.activeFilters.find(af => af.field == props.filterDef.field)?.operator || '='
);

// Fungsi untuk inisialisasi flatpickr
const initializeFlatpickr = () => {
    if (!inputRef.value) return;

    // Destroy instance lama jika ada
    if (fpInstance) {
        fpInstance.destroy();
    }

    const config: any = {
        enableTime: false,
        time_24hr: true,
        dateFormat: 'Y-m-d',
        minuteIncrement: 1,
        allowInput: false,
        onClose: (selectedDates: Date[]) => {
            if (!selectedDates.length) return;
            const currentOperator = store.activeFilters.find(af => af.field == props.filterDef.field)?.operator || '=';
            if (selectedDates.length === 1) {
                if (props.filterDef.utcConvert === false) {
                    const formatted = format(selectedDates[0], 'yyyy-MM-dd');
                    store.handleFilterChange(props.filterDef.field, formatted, currentOperator);
                } else {
                    store.handleFilterChange(props.filterDef.field, selectedDates[0].toISOString(), currentOperator);
                }
            }
        },
        onChange: (selectedDates: Date[], dateStr: string, instance: any) => {
            const currentOperator = store.activeFilters.find(af => af.field == props.filterDef.field)?.operator || '=';
            if (instance.config.mode === 'range' && selectedDates.length < 2) return;

            if (selectedDates.length > 1) {
                instance.close();
                if (props.filterDef.utcConvert === false) {
                    const formattedOne = format(
                        selectedDates[0],
                        'yyyy-MM-dd'
                    );
                    const formattedTwo = format(
                        selectedDates[1],
                        'yyyy-MM-dd'
                    );
                    store.handleFilterChange(props.filterDef.field, `${formattedOne},${formattedTwo}`, currentOperator);
                } else {
                    store.handleFilterChange(props.filterDef.field, `${selectedDates[0].toISOString()},${selectedDates[1].toISOString()}`, currentOperator);
                }
            } else if (selectedDates.length === 1) {
                if (props.filterDef.utcConvert === false) {
                    const formatted = format(selectedDates[0], 'yyyy-MM-dd');
                    store.handleFilterChange(props.filterDef.field, formatted, currentOperator);
                } else {
                    store.handleFilterChange(props.filterDef.field, selectedDates[0].toISOString(), currentOperator);
                }
            } else if (!selectedDates.length) {
                store.handleFilterChange(props.filterDef.field, '', currentOperator);
            }
        },
    };

    // Set mode berdasarkan operator
    if (currentOperator.value === '><' || currentOperator.value === '!><') {
        config.mode = 'range';
    }

    fpInstance = flatpickr(inputRef.value, { ...props.filterDef.config, ...config });

    // Set initial value
    const initialDate = parseValue(localValue.value);
    const cleanDate = Array.isArray(initialDate)
        ? initialDate.filter((d): d is Date => d instanceof Date)
        : initialDate instanceof Date
            ? initialDate
            : null;

    if (fpInstance && cleanDate) fpInstance.setDate(cleanDate);
};

// Watch operator changes
watch(currentOperator, () => {
    initializeFlatpickr();
});

onMounted(() => {
    initializeFlatpickr();
});

watch(() => localValue, (newVal) => {
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
              class="w-full rounded-md border border-gray-300 bg-white text-sm px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              readonly
            />
    </div>
</template>
