<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent, type Editor } from '@tiptap/vue-3';
import { watch } from 'vue';

interface RichTextFieldProps {
    field: {
        name: string;
        label: string;
        type: string;
        placeholder?: string;
        toolbar?: string[];
        minHeight?: number;
        maxHeight?: number;
        mergeClass?: string;
    };
    modelValue?: string;
    idx: string;
}

const props = defineProps<RichTextFieldProps>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const editor = useEditor({
    extensions: [
        StarterKit,
        Image,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: props.modelValue || '',
    onUpdate: ({ editor }: { editor: Editor }) => {
        emit('update:modelValue', editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: `prose dark:prose-invert prose-sm sm:prose focus:outline-none p-4`,
            style: `min-height: ${props.field.minHeight || 200}px; ${props.field.maxHeight ? `max-height: ${props.field.maxHeight}px; overflow-y:auto;` : ''
                }`,
        },
    },
});

// Sync external modelValue to editor
watch(() => props.modelValue, (val) => {
    if (editor && val !== editor.value?.getHTML()) {
        editor.value?.commands.setContent(val || '');
    }
});

const availableTools = {
    bold: {
        icon: '𝐁',
        action: () => editor.value?.chain().focus().toggleBold().run(),
        isActive: () => editor.value?.isActive('bold') ?? false,
    },
    italic: {
        icon: '𝐼',
        action: () => editor.value?.chain().focus().toggleItalic().run(),
        isActive: () => editor.value?.isActive('italic') ?? false,
    },
    underline: {
        icon: '𝑈',
        action: () => editor.value?.chain().focus().toggleUnderline().run(),
        isActive: () => editor.value?.isActive('underline') ?? false,
    },
    strike: {
        icon: '𝐒',
        action: () => editor.value?.chain().focus().toggleStrike().run(),
        isActive: () => editor.value?.isActive('strike') ?? false,
    },
    h1: {
        icon: 'H1',
        action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.value?.isActive('heading', { level: 1 }) ?? false,
    },
    h2: {
        icon: 'H2',
        action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.value?.isActive('heading', { level: 2 }) ?? false,
    },
    h3: {
        icon: 'H3',
        action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => editor.value?.isActive('heading', { level: 3 }) ?? false,
    },
    h4: {
        icon: 'H4',
        action: () => editor.value?.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: () => editor.value?.isActive('heading', { level: 4 }) ?? false,
    },
    h5: {
        icon: 'H5',
        action: () => editor.value?.chain().focus().toggleHeading({ level: 5 }).run(),
        isActive: () => editor.value?.isActive('heading', { level: 5 }) ?? false,
    },
    bulletList: {
        icon: '•',
        action: () => editor.value?.chain().focus().toggleBulletList().run(),
        isActive: () => editor.value?.isActive('bulletList') ?? false,
    },
    orderedList: {
        icon: '1.',
        action: () => editor.value?.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.value?.isActive('orderedList') ?? false,
    },
    alignLeft: {
        icon: '⟵',
        action: () => editor.value?.chain().focus().setTextAlign('left').run(),
        isActive: () => editor.value?.isActive({ textAlign: 'left' }) ?? false,
    },
    alignCenter: {
        icon: '⟷',
        action: () => editor.value?.chain().focus().setTextAlign('center').run(),
        isActive: () => editor.value?.isActive({ textAlign: 'center' }) ?? false,
    },
    alignRight: {
        icon: '⟶',
        action: () => editor.value?.chain().focus().setTextAlign('right').run(),
        isActive: () => editor.value?.isActive({ textAlign: 'right' }) ?? false,
    },
    link: {
        icon: '🔗',
        action: () => {
            const url = window.prompt('URL');
            if (url) editor.value?.chain().focus().setLink({ href: url }).run();
            else editor.value?.chain().focus().unsetLink().run();
        },
        isActive: () => editor.value?.isActive('link') ?? false,
    },
    code: {
        icon: '<code>',
        action: () => editor.value?.chain().focus().toggleCode().run(),
        isActive: () => editor.value?.isActive('code') ?? false,
    },
    codeBlock: {
        icon: '⌨️',
        action: () => editor.value?.chain().focus().toggleCodeBlock().run(),
        isActive: () => editor.value?.isActive('codeBlock') ?? false,
    },
    blockquote: {
        icon: '❝',
        action: () => editor.value?.chain().focus().toggleBlockquote().run(),
        isActive: () => editor.value?.isActive('blockquote') ?? false,
    },
    clear: {
        icon: '✕',
        action: () => editor.value?.chain().focus().clearNodes().unsetAllMarks().run(),
        isActive: () => true,
    },
};

const toolbarItems = props.field.toolbar || [
    'bold', 'italic', 'underline', 'strike',
    'h1', 'h2', 'h3',
    'bulletList', 'orderedList',
    'alignLeft', 'alignCenter', 'alignRight',
    'link', 'code', 'blockquote', 'clear'
];
</script>

<template>
    <div class="space-y-2">
        <div class="border border-input rounded-md overflow-hidden">
            <!-- Toolbar -->
            <div class="flex flex-wrap gap-1 p-1 border-b bg-muted/50">
                <Button v-for="item in toolbarItems" :key="item" type="button" size="sm" variant="ghost"
                    :class="cn('h-8 px-2 py-1 text-sm', availableTools[item]?.isActive() ? 'bg-accent text-foreground' : '')"
                    @click="availableTools[item]?.action()">
                    {{ availableTools[item]?.icon }}
                </Button>
            </div>

            <!-- Editor -->
            <div v-if="editor">
                <EditorContent  :editor="editor" :class="props.field.mergeClass" />
            </div>
            <div v-else>Loading editor...</div>
        </div>
    </div>
</template>
