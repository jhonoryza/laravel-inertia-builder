<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { customFieldsComponents } from '@/components/builder/custom-fields';
import { cn } from '@/lib/utils';
import { useFormStore } from '@/stores/form';
import { FieldDefinition } from '@/types/field-builder';

interface Props {
    field: FieldDefinition;
    modelValue: any;
    idx: string;
}

const props = defineProps<Props>();
const store = useFormStore(props.idx)();

const initialized = ref(false);

onMounted(() => {
    if (!initialized.value && props.modelValue === undefined && props.field.state !== undefined) {
        store.onReactive(props.field.key, props.field.state);
        initialized.value = true;
    }
});

const Component = props.field.component
    ? customFieldsComponents[props.field.component]
    : null;
</script>

<template>
    <div v-if="Component" :class="cn('space-y-2', field.mergeClass)">
        <component :is="Component" :field="field" :idx="idx"
            :modelValue="modelValue"
            v-bind="field.extraAttributes" />
    </div>

    <div v-else-if="field.component" class="text-sm text-destructive">
        Custom component '{{ field.component }}' not found. Make sure to register it using
        registerCustomComponent.
    </div>

    <div v-else class="text-sm text-amber-500 p-3 bg-amber-50 rounded-md border border-amber-200">
        No component specified for custom field '{{ field.key }}'. Use the 'component' property to specify a Vue
        component.
    </div>
</template>
