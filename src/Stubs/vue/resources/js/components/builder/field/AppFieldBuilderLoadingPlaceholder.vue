<script setup lang="ts">
import { gridClasses } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';

defineProps<{
    field: FieldDefinition;
}>();
</script>

<template>
    <div :key="field.key" :class="[
        'space-y-2',
        field.isInline ? 'flex items-center space-x-2' : '',
        gridClasses(field.gridCol)
    ]">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />

        <div className="flex w-full rounded-md bg-muted animate-pulse h-6" />
    </div>
</template>
