<script lang="ts" setup>
import { ref } from 'vue';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";
import { useFormStore } from '@/stores/form';

interface Props {
    field: FieldDefinition;
    modelValue: any[];
    idx: string;
}

const props = defineProps<Props>();
const store = useFormStore(props.idx)();

const selectedValues = ref<Array<any>>(props.modelValue || []);

const toggleOption = (optValue: any) => {
    const set = new Set(selectedValues.value);
    if (set.has(optValue)) {
        set.delete(optValue);
    } else {
        set.add(optValue);
    }
    selectedValues.value = Array.from(set);
    store.onReactive(props.field.key, selectedValues.value);
};
</script>

<template>
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" :disabled="field.isDisable"
                :class="cn('w-full justify-start text-muted-foreground hover:text-muted-foreground', field.mergeClass)">
                <span v-if="selectedValues.length > 0">{{ selectedValues.length }} selected</span>
                <span v-else>{{ field.placeholder || 'Select options' }}</span>
            </Button>
        </PopoverTrigger>

        <PopoverContent class="min-w-[--radix-popover-trigger-width] p-2" align="start" >
            <div class="w-full flex max-h-60 flex-col gap-2 overflow-y-auto">
                <label v-for="opt in field.options" :key="opt.id"
                    class="flex cursor-pointer items-center space-x-2">
                    <Checkbox :model-value="selectedValues.includes(opt.value)"
                        @update:model-value="() => toggleOption(opt.value)" />
                    <span class="text-sm">{{ opt.label }}</span>
                </label>
            </div>
        </PopoverContent>
    </Popover>
</template>
