<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { useFormStore } from '@/stores/form';

interface ColorPickerFieldProps {
    field: FieldDefinition;
    modelValue: any;
    idx: string;
    presetColors?: string[];
    showOpacity?: boolean;
    allowCustom?: boolean;
}

const props = defineProps<ColorPickerFieldProps>();
const store = useFormStore(props.idx)();

const showPicker = ref(false);
const pickerRef = ref<HTMLDivElement | null>(null);

const currentColor = ref(props.modelValue || '#000000');

watch(() => props.modelValue, (val) => {
    currentColor.value = val || '#000000';
});

const togglePicker = () => {
    showPicker.value = !showPicker.value;
};

const handleClickOutside = (event: MouseEvent) => {
    if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
        showPicker.value = false;
    }
};

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});

const handleSelectColor = (color: string) => {
    currentColor.value = color;
    showPicker.value = false;
    store.onReactive(props.field.key, color);
};

const isLightColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
};
</script>

<template>
    <div class="space-y-2">
        <div class="relative">
            <div class="flex items-center cursor-pointer border rounded-md overflow-hidden" @click="togglePicker">
                <div class="w-12 h-8" :style="{ backgroundColor: currentColor }" />
                <div class="px-3 flex-1">{{ currentColor.toUpperCase() }}</div>
            </div>

            <div v-if="showPicker" ref="pickerRef"
                class="absolute z-50 mt-1 w-72 rounded-md border bg-card shadow-md overflow-hidden p-3">
                <div class="grid grid-cols-7 gap-1 mb-2">
                    <button v-for="(color, index) in presetColors || []" :key="index" type="button" :class="cn(
                        'w-8 h-8 rounded-md flex items-center justify-center',
                        color === currentColor && 'ring-2 ring-primary'
                    )" :style="{ backgroundColor: color }" @click="handleSelectColor(color)">
                        <svg v-if="color === currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            fill="none" :stroke="isLightColor(color) ? '#000000' : '#ffffff'" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                </div>

                <div v-if="allowCustom" class="mt-3">
                    <Input type="color" v-model="currentColor" @input="store.onReactive(field.key, currentColor)"
                        class="w-full h-8" />
                </div>

                <div v-if="showOpacity" class="mt-3 space-y-1">
                    <div class="text-xs">Opacity</div>
                    <input type="range" min="0" max="100" value="100" class="w-full" @input="() => { }" />
                </div>
            </div>
        </div>
    </div>
</template>
