<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { Copy, Eye, EyeOff } from 'lucide-vue-next';

type Props = {
    field: FieldDefinition;
    modelValue?: string | number;
    idx: string;
};

const props = defineProps<Props>();
const model = defineModel<typeof props.modelValue>();

const showPassword = ref(false);
const copied = ref(false);

const handleCopy = async () => {
    if (!props.modelValue) return;

    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(props.modelValue.toString());
        } else {
            // fallback lama
            const textarea = document.createElement('textarea');
            textarea.value = props.modelValue.toString();
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        copied.value = true;
        setTimeout(() => (copied.value = false), 1500);
    } catch (err) {
        console.error('Copy failed', err);
    }
};
</script>

<template>
    <div>
        <div
            class="relative flex w-full rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <!-- eye icon kiri -->
            <button type="button"
                class="cursor-pointer flex items-center border-r border-input px-3 text-sm text-muted-foreground"
                @click="showPassword = !showPassword" tabindex="-1">
                <component :is="showPassword ? EyeOff : Eye" class="h-4 w-4" />
            </button>

            <!-- input -->
            <Input :id="props.field.key" 
                :type="showPassword ? 'text' : 'password'" 
                v-model="model"
                :placeholder="props.field.placeholder || 'Fill in here..'"
                :class="cn(props.field.mergeClass, 'flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0')"
                :disabled="props.field.isDisable" />

            <!-- copy button kanan -->
            <Button v-if="props.field.copyable" type="button" variant="ghost" size="icon" @click="handleCopy"
                class="absolute inset-y-0 right-2 h-8 w-8 hover:cursor-pointer" :disabled="!props.modelValue">
                <Copy class="h-4 w-4" />
                <span class="sr-only">Copy</span>
            </Button>
        </div>
        <div v-if="copied" class="text-xs text-muted-foreground">Copied!</div>
    </div>
</template>
