<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { FieldDefinition } from "@/types/field-builder";
import { ChevronDown, ChevronUp, GripVertical, PlusCircle, Trash2 } from 'lucide-vue-next';
import AppFieldBuilder from '../AppFieldBuilder.vue';
import { useFormStore } from '@/stores/form'

interface RepeaterFieldProps {
    field: FieldDefinition & {
        schema?: FieldDefinition[];
        minItems?: number;
        maxItems?: number;
        addButtonLabel?: string;
        itemLabel?: string;
        collapsible?: boolean;
        collapsed?: boolean;
        reorderable?: boolean;
    };
    modelValue: any[];
    idx: string;
}

const props = defineProps<RepeaterFieldProps>();
const model = defineModel<typeof props.modelValue>();
const store = useFormStore(props.idx)();

// Initialize items from store or props
const items = ref(Array.isArray(props.modelValue) ? [...props.modelValue] : []);

// Single watch untuk handle perubahan dari props
watch(() => props.modelValue, (newVal) => {
    if (Array.isArray(newVal) && JSON.stringify(newVal) !== JSON.stringify(items.value)) {
        items.value = [...newVal];
    }
}, { deep: true });

// Function untuk update store dan model
const updateStore = (newItems: any[]) => {
    const value = [...newItems];
    store.onReactive(props.field.key, value);
    model.value = value;
};

const openItems = reactive<Record<number, boolean>>({});

// Drag state
const draggedIndex = ref<number | null>(null);

// Initialize openItems
watch(
    () => [props.field.collapsible, props.field.collapsed, items.value.length],
    () => {
        if (props.field.collapsible) {
            items.value.forEach((_, idx) => {
                openItems[idx] = !props.field.collapsed;
            });
        }
    },
    { immediate: true }
);

const addItem = () => {
    if (props.field.maxItems !== undefined && items.value.length >= props.field.maxItems) return;

    const newItem = props.field.schema?.reduce((acc, f) => {
        if (['checkbox', 'toggle'].includes(f.type)) acc[f.key] = false;
        else if (f.type === 'checkbox-list') acc[f.key] = [];
        else acc[f.key] = '';
        return acc;
    }, {} as Record<string, any>) || {};

    items.value = [...items.value, newItem];
    updateStore(items.value);

    if (props.field.collapsible) {
        openItems[items.value.length - 1] = true;
    }
};

const removeItem = (index: number) => {
    if (props.field.minItems !== undefined && items.value.length <= props.field.minItems) return;
    const newItems = [...items.value];
    newItems.splice(index, 1);
    items.value = newItems;
    updateStore(newItems);
};

const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.value.length) return;
    const newItems = [...items.value];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    items.value = newItems;
    updateStore(newItems);
};

const handleDragStart = (index: number) => {
    draggedIndex.value = index;
};

const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex.value === null || draggedIndex.value === index) return;
    moveItem(draggedIndex.value, index);
    draggedIndex.value = index;
};

const handleDragEnd = () => {
    draggedIndex.value = null;
};

const getItemLabel = (item: Record<string, any>, index: number) => {
    if (!props.field.itemLabel) return `Item ${index + 1}`;
    let label = props.field.itemLabel.replace(':index', String(index + 1));
    const matches = label.match(/\{([^}]+)\}/g) || [];
    matches.forEach(match => {
        const key = match.slice(1, -1);
        label = label.replace(match, item[key] || '');
    });
    return label;
};

// Tambahkan prefix untuk nested field key
const getNestedFieldKey = (schemaField: FieldDefinition, index: number) => {
    // Ambil parent section index dari field.key jika ada (misal: sections.0.fields)
    const sectionMatch = props.field.key.match(/sections\.(\d+)\./)
    const sectionPrefix = sectionMatch ? `sections.${sectionMatch[1]}.` : ''
    
    return {
        ...schemaField,
        key: `${sectionPrefix}${props.field.key}.${index}.${schemaField.key}`
    }
}
</script>

<template>
    <div class="space-y-4">
        <Card v-for="(item, index) in items" :key="index"
            :class="cn('border relative', draggedIndex === index ? 'border-primary opacity-70' : '')"
            :draggable="props.field.reorderable" @dragstart="() => handleDragStart(index)"
            @dragover="(e: any) => handleDragOver(e, index)" @dragend="handleDragEnd">
            <div v-if="props.field.reorderable" class="absolute left-2 top-1/2 -translate-y-1/2 cursor-move">
                <GripVertical class="h-5 w-5 text-muted-foreground" />
            </div>

            <Collapsible v-if="props.field.collapsible" v-model:open="openItems[index]">
                <CardHeader class="py-3 px-4">
                    <div class="flex items-center justify-between">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" class="p-0 h-auto">
                                <CardTitle class="text-sm font-medium flex items-center gap-1">
                                    <ChevronUp v-if="openItems[index]" class="h-4 w-4" />
                                    <ChevronDown v-else class="h-4 w-4" />
                                    {{ getItemLabel(item, index) }}
                                </CardTitle>
                            </Button>
                        </CollapsibleTrigger>
                        <Button variant="ghost" size="icon" @click="removeItem(index)"
                            :disabled="props.field.minItems !== undefined && items.length <= props.field.minItems"
                            class="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent class="pt-0">
                        <div class="space-y-4">
                            <AppFieldBuilder
                                v-for="schemaField in props.field.schema"
                                :key="`${index}-${schemaField.key}-${props.field.key}`"
                                :field="getNestedFieldKey(schemaField, index)"
                                :idx="idx"
                            />
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

            <template v-else>
                <CardHeader class="py-3 px-4">
                    <div class="flex items-center justify-between">
                        <CardTitle class="text-sm font-medium">{{ getItemLabel(item, index) }}</CardTitle>
                        <Button variant="ghost" size="icon" @click="removeItem(index)"
                            :disabled="props.field.minItems !== undefined && items.length <= props.field.minItems"
                            class="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div class="space-y-4">
                        <AppFieldBuilder
                            v-for="schemaField in props.field.schema"
                            :key="`${index}-${schemaField.key}`"
                            :field="getNestedFieldKey(schemaField, index)"
                            :idx="idx"
                        />
                    </div>
                </CardContent>
            </template>
        </Card>

        <Button type="button" variant="outline" size="sm" @click="addItem"
            :disabled="props.field.maxItems !== undefined && items.length >= props.field.maxItems" class="mt-2">
            <PlusCircle class="h-4 w-4 mr-2" />
            {{ props.field.addButtonLabel || 'Add Item' }}
        </Button>
    </div>
</template>
