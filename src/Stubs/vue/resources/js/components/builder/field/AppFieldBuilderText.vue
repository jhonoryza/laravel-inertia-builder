<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { FieldDefinition } from '@/types/field-builder'
import { Copy } from 'lucide-vue-next'

interface Props {
    field: FieldDefinition
    modelValue?: string | number,
    idx: string,
}

const props = defineProps<Props>()
const copied = ref(false)

const model = defineModel<typeof props.modelValue>();

const handleCopy = async () => {
    if (!props.modelValue) return

    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(props.modelValue.toString())
        } else {
            // fallback lama
            const textarea = document.createElement('textarea')
            textarea.value = props.modelValue.toString()
            textarea.style.position = 'fixed'
            document.body.appendChild(textarea)
            textarea.focus()
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
        }

        copied.value = true
        setTimeout(() => (copied.value = false), 1500)
    } catch (err) {
        console.error('Copy failed', err)
    }
}
</script>

<template>
    <div>
        <div class="flex w-full rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <span v-if="props.field.prefix" class="flex items-center border-r border-input px-3 text-sm text-muted-foreground">
                {{ props.field.prefix }}
            </span>

            <Input 
                :id="props.field.key" 
                :type="props.field.type" 
                v-model="model"
                :placeholder="props.field.placeholder || 'Fill in here..'"
                :class="cn(props.field.mergeClass, 'flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0')"
                :disabled="props.field.isDisable" 
            />

            <span v-if="props.field.suffix"
                class="flex items-center border-l border-input px-3 text-sm text-muted-foreground">
                {{ props.field.suffix }}
            </span>

            <Button v-if="props.field.copyable" type="button" variant="ghost" size="icon" @click="handleCopy"
                class="ml-1 h-9 w-9 hover:cursor-pointer" :disabled="!modelValue">
                <Copy class="h-4 w-4" />
                <span class="sr-only">Copy</span>
            </Button>
        </div>

        <div v-if="copied" class="text-xs text-muted-foreground">Copied!</div>
    </div>
</template>
