<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, PlusCircle, X } from 'lucide-vue-next'; // versi Vue dari lucide-react

interface Field {
    key: string;
    name: string;
    label: string;
    type: string;
    suggestions?: string[];
    separator?: string;
    addButtonLabel?: string;
    maxTags?: number;
    tagPrefix?: string;
    placeholder?: string;
    mergeClass?: string;
}

interface Props {
    field: Field;
    modelValue: string[] | null;
    idx: string;
}

const props = defineProps<Props>()
const model = defineModel<typeof props.modelValue>()

const tags = ref<string[]>(props.modelValue || [])
const inputValue = ref('')
const showSuggestions = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const suggestionsRef = ref<HTMLDivElement | null>(null)

// update tags and emit change
const updateTags = (newTags: string[]) => {
    tags.value = newTags
    model.value = newTags
}

const addTag = (tag: string) => {
    if (!tag.trim()) return
    if (props.field.maxTags !== undefined && tags.value.length >= props.field.maxTags) return

    const formattedTag = props.field.tagPrefix ? `${props.field.tagPrefix}${tag}` : tag
    if (!tags.value.includes(formattedTag)) updateTags([...tags.value, formattedTag])

    inputValue.value = ''
    showSuggestions.value = false
    inputRef.value?.focus()
}

const removeTag = (tagToRemove: string) => {
    updateTags(tags.value.filter(tag => tag !== tagToRemove))
}

// Filter suggestions based on input
const filteredSuggestions = computed(() => {
    if (!props.field.suggestions) return []
    return props.field.suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.value.toLowerCase()) &&
        !tags.value.includes(props.field.tagPrefix ? `${props.field.tagPrefix}${suggestion}` : suggestion)
    )
})

const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        addTag(inputValue.value)
    }
    if (e.key === 'Backspace' && inputValue.value === '' && tags.value.length > 0) {
        removeTag(tags.value[tags.value.length - 1])
    }
    if (props.field.separator && inputValue.value.includes(props.field.separator)) {
        e.preventDefault()
        const newTags = inputValue.value.split(props.field.separator).filter(tag => tag.trim() !== '')
        newTags.forEach(tag => {
            if (props.field.maxTags === undefined || tags.value.length < props.field.maxTags) {
                addTag(tag.trim())
            }
        })
    }
}

const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion)
    showSuggestions.value = false
}

const handleInputFocus = () => {
    if (inputValue.value.length > 0 && props.field.suggestions?.length) showSuggestions.value = true
}

// handle click outside for suggestions dropdown
onMounted(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (suggestionsRef.value && !suggestionsRef.value.contains(event.target as Node)) {
            showSuggestions.value = false
        }
    }
    document.addEventListener('mousedown', handleClickOutside)
    // cleanup
    onUnmounted(() => {
        document.removeEventListener('mousedown', handleClickOutside)
    })
})
</script>

<template>
    <div class="space-y-2">
        <div class="flex flex-wrap gap-2 p-2 border rounded-md min-h-[38px]">
            <div v-for="(tag, index) in tags" :key="index"
                class="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                <span>{{ tag }}</span>
                <Button type="button" variant="ghost" size="icon" class="h-4 w-4 rounded-full hover:bg-primary/20"
                    @click="removeTag(tag)">
                    <X class="h-3 w-3" />
                </Button>
            </div>

            <div class="flex-1 min-w-[180px] relative">
                <Input ref="inputRef" type="text" v-model="inputValue"
                    :placeholder="tags.length === 0 ? props.field.placeholder || 'Add tags...' : ''"
                    class="border-0 shadow-none focus-visible:ring-0 px-0 py-0 h-auto min-h-[24px]"
                    :disabled="props.field.maxTags !== undefined && tags.length >= props.field.maxTags"
                    @keydown="handleInputKeyDown" @focus="handleInputFocus" />

                <div v-if="showSuggestions && filteredSuggestions.length > 0" ref="suggestionsRef"
                    class="absolute z-50 mt-1 w-full max-w-[280px] rounded-md border bg-card shadow-md overflow-hidden">
                    <div class="max-h-[200px] overflow-y-auto py-1">
                        <button v-for="(suggestion, index) in filteredSuggestions" :key="index" type="button"
                            class="w-full flex items-center justify-between px-3 py-1.5 hover:bg-muted text-sm"
                            @click="handleSuggestionClick(suggestion)">
                            {{ suggestion }}
                            <Check class="h-4 w-4 opacity-70" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Button v-if="props.field.maxTags === undefined || tags.length < props.field.maxTags" type="button"
            variant="outline" size="sm" @click="inputValue.trim() ? addTag(inputValue) : inputRef?.focus()"
            class="mt-1">
            <PlusCircle class="h-4 w-4 mr-2" />
            {{ props.field.addButtonLabel || 'Add Tag' }}
        </Button>

        <div v-if="props.field.separator" class="text-xs text-muted-foreground mt-1">
            Separate multiple tags with "{{ props.field.separator }}"
        </div>

        <div v-if="props.field.maxTags !== undefined" class="text-xs text-muted-foreground">
            {{ tags.length }} of {{ props.field.maxTags }} tags used
        </div>
    </div>
</template>
