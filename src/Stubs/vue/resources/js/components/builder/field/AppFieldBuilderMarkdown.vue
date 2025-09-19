<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { marked } from 'marked';

interface Props {
    field: FieldDefinition;
    modelValue?: string;
    idx: string;
}

const props = defineProps<Props>();
const model = defineModel<typeof props.modelValue>();

const tab = ref<'write' | 'preview'>('write');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

watch(tab, (newTab) => {
    if (newTab === 'write') {
        textareaRef.value?.focus();
    }
});

</script>

<template>
    <div class="space-y-1">
        <Tabs v-model="tab">
            <TabsList class="mb-2">
                <TabsTrigger class="hover:cursor-pointer" value="write">Write</TabsTrigger>
                <TabsTrigger class="hover:cursor-pointer" value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="write">
                <Textarea :id="props.field.key" v-model="model" ref="textareaRef"
                    :placeholder="'Write markdown here...'" :rows="10" :class="props.field.mergeClass"
                    :disabled="props.field.isDisable" />
            </TabsContent>

            <TabsContent value="preview">
                <div :class="cn('prose-sm dark:prose-dark max-w-none p-3 border rounded bg-muted')"
                    v-html="marked.parse(modelValue || '')" />
            </TabsContent>
        </Tabs>
    </div>
</template>
