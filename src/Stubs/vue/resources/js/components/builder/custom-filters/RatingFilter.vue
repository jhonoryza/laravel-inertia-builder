<script setup lang="ts">
import RatingField from '@/components/builder/custom-fields/RatingField.vue';
import { FieldDefinition } from '@/types/field-builder';

interface CustomFilterComponentProps {
    field: FieldDefinition;
    modelValue?: string | number;
    idx: string;
    filterDef: {
        field: string;
        label: string;
    };
}

defineProps<CustomFilterComponentProps>();

</script>

<template>
    <RatingField :field="field" :idx="idx" :modelValue="Number(modelValue) || 0" />
</template>
