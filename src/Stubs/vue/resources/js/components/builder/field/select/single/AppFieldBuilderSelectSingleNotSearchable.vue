<script lang="ts" setup>
import { ref, watch } from 'vue';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { FieldDefinition } from '@/types/field-builder';
import { useFormStore } from '@/stores/form';

interface Props {
    field: FieldDefinition;
    modelValue?: string;
    idx: string;
}

const props = defineProps<Props>();
const store = useFormStore(props.idx)();

const selectedValue = ref(props.modelValue);

// watch untuk emit perubahan ke parent atau store
watch(selectedValue, (newVal) => {
    store.onReactive(props.field.key, newVal)
});
</script>

<template>
    <Select v-model="selectedValue" :disabled="field.isDisable">
        <SelectTrigger class="w-full">
            <SelectValue :placeholder="field.placeholder || 'Select an option'" />
        </SelectTrigger>
        <SelectContent class="min-w-[var(--radix-popover-trigger-width)] max-h-60 overflow-y-auto">
            <SelectItem v-for="opt in field.options" :key="opt.id"
                :value="opt.value.toString()" :class="field.mergeClass">
                {{ opt.label }}
            </SelectItem>
        </SelectContent>
    </Select>
</template>
