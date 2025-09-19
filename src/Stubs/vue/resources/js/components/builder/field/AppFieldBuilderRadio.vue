<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FieldDefinition } from "@/types/field-builder";

type Props = {
    field: FieldDefinition;
    modelValue?: string;
    idx: string;
};

const props = defineProps<Props>();
const model = defineModel<typeof props.modelValue>()

</script>

<template>
    <RadioGroup v-model="model" :disabled="props.field.isDisable">
        <div v-for="opt in props.field.options" :key="opt.value.toString()"
            :class="cn('flex items-center space-x-2', props.field.mergeClass)">
            <RadioGroupItem :value="opt.value.toString()" :id="`${props.field.key}-${opt.value}`" />
            <Label :for="`${props.field.key}-${opt.value}`">{{ opt.label }}</Label>
        </div>
    </RadioGroup>
</template>
