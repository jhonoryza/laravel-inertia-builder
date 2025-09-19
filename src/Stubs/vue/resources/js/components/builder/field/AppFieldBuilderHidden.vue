<script lang="ts" setup>
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';

interface Props {
    field: FieldDefinition;
    modelValue?: string | number;
    idx?: string;
}

const props = defineProps<Props>();
const model = defineModel<typeof props.modelValue>();
</script>

<template>
    <div>
        <Input :id="props.field.key" :type="props.field.type" v-model="model"
            :placeholder="props.field.placeholder || 'Fill in here..'" :class="cn(props.field.mergeClass, 'hidden')"
            :disabled="props.field.isDisable" />
    </div>
</template>
