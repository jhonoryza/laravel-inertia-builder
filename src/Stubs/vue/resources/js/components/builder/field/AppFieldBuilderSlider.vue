<script setup lang="ts">
import { Slider } from "@/components/ui/slider";
import type { FieldDefinition } from "@/types/field-builder";

interface Props {
    modelValue?: number[] | null;
    field: FieldDefinition;
    idx: string;
}

const props = defineProps<Props>();
const model = defineModel<typeof props.modelValue>();

</script>

<template>
    <div class="pt-4">
        <Slider :id="props.field.key" :min="props.field.min ?? 0" :max="props.field.max ?? 100"
            :step="props.field.step ?? 1" v-model="model"
            :class="props.field.mergeClass" :disabled="props.field.isDisable" />
        <div class="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{{ props.field.min ?? 0 }}</span>
            <span>{{ modelValue?.[0] || 0 }}</span>
            <span>{{ props.field.max ?? 100 }}</span>
        </div>
    </div>
</template>
