<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Star } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { useFormStore } from '@/stores/form';

interface RatingFieldProps {
    field: FieldDefinition;
    modelValue: any;
    idx: string;
    maxStars?: number;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    activeColor?: string;
    readonly?: boolean;
}

const props = defineProps<RatingFieldProps>();
const store = useFormStore(props.idx)();

const stars = computed(() => Array.from({ length: props.maxStars ?? 5 }, (_, i) => i + 1));

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
};

const containerSizeClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
};

const currentValue = ref(props.modelValue ?? 0);

watch(() => props.modelValue, (val) => {
    currentValue.value = val ?? 0;
});

const handleClick = (star: number) => {
    if (!props.readonly) {
        currentValue.value = star;
        store.onReactive(props.field.key, star);
    }
};

const clearRating = () => {
    if (!props.readonly) {
        currentValue.value = 0;
        store.onReactive(props.field.key, 0);
    }
};
</script>

<template>
    <div class="space-y-2">
        <div :class="cn('flex items-center', containerSizeClasses[size ?? 'md'], readonly ? 'opacity-70' : '')">
            <button v-for="star in stars" :key="star" type="button"
                :class="cn(!readonly && 'hover:scale-110 transition-transform')" @click="handleClick(star)"
                :disabled="readonly">
                <Star :class="sizeClasses[size ?? 'md']"
                    :fill="star <= currentValue ? activeColor ?? '#f59e0b' : 'none'"
                    :color="star <= currentValue ? activeColor ?? '#f59e0b' : color ?? '#e5e7eb'" stroke-width="1.5" />
            </button>

            <button v-if="!readonly" type="button" class="text-xs text-muted-foreground ml-2" @click="clearRating">
                Clear
            </button>
        </div>

        <div class="text-sm text-muted-foreground">
            {{ currentValue > 0 ? `Rated ${currentValue} of ${maxStars ?? 5} stars` : 'Not rated' }}
        </div>
    </div>
</template>
