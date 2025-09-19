<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { ActiveFilter } from '@/types/datatable';
import { useDatatableStore } from '@/stores/datatable';

interface Props {
    idx: string;
    activeFilter: ActiveFilter;
}

const props = defineProps<Props>();

const store = useDatatableStore(props.idx)();

// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
const filterDef = store.tableData.filters.opt?.find(f => f.field === props.activeFilter.field)!
const operatorValue = ref(props.activeFilter.operator ?? '=');

watch(
    () => props.activeFilter.operator,
    (val) => {
        operatorValue.value = val ?? '=';
    },
    { immediate: true }
);

const handleValueChange = (value: string) => {
    store.handleFilterChange(props.activeFilter.field, '', value);
};
</script>

<template>
    <Select v-if="(filterDef.operators?.length ?? 0) > 0" v-model="operatorValue"
        @update:modelValue="handleValueChange">
        <SelectTrigger>
            <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem v-for="op in filterDef.operators" :key="op.value" :value="op.value">
                {{ op.label }}
            </SelectItem>
        </SelectContent>
    </Select>
</template>
