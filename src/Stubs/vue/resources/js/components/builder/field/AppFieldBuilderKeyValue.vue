<script lang="ts" setup>
import { ref, watch } from 'vue';
import { FieldDefinition } from '@/types/field-builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVertical, PlusCircle, Trash2 } from 'lucide-vue-next';
// import { useFormStore } from '@/stores/form';

interface Props {
    field: FieldDefinition;
    modelValue: Record<string, string> | null;
    idx: string;
}

const props = defineProps<Props>();
const model = defineModel<typeof props.modelValue>();
// const store = useFormStore(props.idx)();

// Convert object to array for internal state
const items = ref<Array<{ key: string; value: string }>>(
    Object.entries(props.modelValue || {}).map(([key, val]) => ({ 
        key, 
        value: String(val) 
    }))
);

// Update both model and store
const updateData = (newItems: Array<{ key: string; value: string }>) => {
    const newData = newItems.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key] = value;
        return acc;
    }, {} as Record<string, string>);
    items.value = newItems;
    model.value = newData;
};

const addItem = () => {
    const newItems = [...items.value, { key: '', value: '' }];
    updateData(newItems);
};

const removeItem = (index: number) => {
    const newItems = [...items.value];
    newItems.splice(index, 1);
    updateData(newItems);
};

// const updateItem = (index: number, keyOrValue: 'key' | 'value', newValue: string) => {
//     const newItems = [...items.value];
//     newItems[index][keyOrValue] = newValue;
//     items.value = newItems; // trigger items watcher
// };

const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.value.length) return;
    const newItems = [...items.value];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    updateData(newItems);
};
const draggedIndex = ref<number | null>(null);
const handleDragStart = (index: number) => (draggedIndex.value = index);
const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex.value === null || draggedIndex.value === index) return;
    moveItem(draggedIndex.value, index);
    draggedIndex.value = index;
};
const handleDragEnd = () => (draggedIndex.value = null);

// Watch external changes
watch(() => props.modelValue, (newVal) => {
    if (newVal && JSON.stringify(newVal) !== JSON.stringify(model.value)) {
        items.value = Object.entries(newVal).map(([key, val]) => ({ 
            key, 
            value: String(val) 
        }));
    }
}, { deep: true });
</script>

<template>
    <div class="space-y-2">
        <div class="rounded-md border">
            <!-- Header -->
            <div class="flex items-center p-2 bg-muted/40 border-b">
                <div v-if="props.field.reorderable" class="w-8" />
                <div class="flex-1 font-medium text-sm">{{ props.field.keyLabel || 'Key' }}</div>
                <div class="flex-1 font-medium text-sm">{{ props.field.valueLabel || 'Value' }}</div>
                <div v-if="props.field.removable" class="w-8" />
            </div>

            <!-- Items -->
            <div class="divide-y">
                <div v-if="items.length === 0" class="p-4 text-center text-sm text-muted-foreground italic">
                    No items added yet.
                </div>

                <div v-for="(item, index) in items" :key="index" class="flex items-center p-2 gap-2"
                    :class="draggedIndex === index ? 'bg-muted/20' : ''" :draggable="props.field.reorderable"
                    @dragstart="handleDragStart(index)" @dragover.prevent="handleDragOver($event, index)"
                    @dragend="handleDragEnd">
                    <div v-if="props.field.reorderable" class="flex-none cursor-move">
                        <GripVertical class="h-4 w-4 text-muted-foreground" />
                    </div>

                    <Input class="flex-1" 
                        v-model="item.key"
                        :placeholder="props.field.keyPlaceholder || 'Enter key'"
                        :disabled="!props.field.editable || props.field.isDisable"
                        @change="updateData(items)" 
                    />

                    <Input class="flex-1" 
                        v-model="item.value"
                        :placeholder="props.field.valuePlaceholder || 'Enter value'"
                        :disabled="!props.field.editable || props.field.isDisable"
                        @change="updateData(items)"
                    />

                    <Button v-if="props.field.removable" type="button" variant="ghost" size="icon"
                        class="flex-none h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        @click="removeItem(index)" :disabled="props.field.isDisable">
                        <Trash2 class="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

        <Button v-if="props.field.addable" type="button" variant="outline" size="sm" class="mt-2" @click="addItem"
            :disabled="props.field.isDisable">
            <PlusCircle class="h-4 w-4 mr-2" />
            {{ props.field.addButtonLabel || 'Add Item' }}
        </Button>
    </div>
</template>
