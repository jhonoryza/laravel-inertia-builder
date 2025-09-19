<script lang="ts" setup>
import { FieldDefinition } from '@/types/field-builder';
import { Label } from '@/components/ui/label';
import { fieldClasses } from '@/lib/utils';

interface Props {
    field: FieldDefinition;
    error?: string;
}
const props = defineProps<Props>();
</script>

<template>
    <div :key="props.field.key" :class="[
        'space-y-2',
        props.field.isInline ? 'flex items-center space-x-2' : '',
        fieldClasses(props.field)
    ]">
        <Label :for="props.field.key">{{ props.field.label }}</Label>
        <slot />
        <div v-if="props.error" class="text-xs text-destructive">{{ props.error }}</div>
    </div>
</template>
