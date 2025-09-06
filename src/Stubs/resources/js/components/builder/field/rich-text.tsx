/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    value: string;
    onChange: (name: string, value: any, operator?: string) => void;
}

export function AppFieldBuilderRichText({ field, value, onChange }: RichTextFieldProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(field.name, editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose focus:outline-none max-w-none p-4 border rounded-md',
                style: `min-height: ${field.minHeight || 200}px; ${field.maxHeight ? `max-height: ${field.maxHeight}px; overflow-y: auto;` : ''}`
            }
        }
    });

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    const availableTools = {
        bold: {
            icon: '𝐁',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        italic: {
            icon: '𝐼',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        underline: {
            icon: '𝑈',
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: () => editor.isActive('underline'),
        },
        strike: {
            icon: '𝐒',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        h1: {
            icon: 'H1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        h2: {
            icon: 'H2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        h3: {
            icon: 'H3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        bulletList: {
            icon: '•',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        orderedList: {
            icon: '1.',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        alignLeft: {
            icon: '⟵',
            action: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: () => editor.isActive({ textAlign: 'left' }),
        },
        alignCenter: {
            icon: '⟷',
            action: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: () => editor.isActive({ textAlign: 'center' }),
        },
        alignRight: {
            icon: '⟶',
            action: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: () => editor.isActive({ textAlign: 'right' }),
        },
        link: {
            icon: '🔗',
            action: () => {
                const url = window.prompt('URL');
                if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                } else {
                    editor.chain().focus().unsetLink().run();
                }
            },
            isActive: () => editor.isActive('link'),
        },
        code: {
            icon: '</>',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        codeBlock: {
            icon: '⌨️',
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor.isActive('codeBlock'),
        },
        blockquote: {
            icon: '❝',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        clear: {
            icon: '✕',
            action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
            isActive: () => false,
        },
    };

    // Default toolbar if not specified
    const toolbarItems = field.toolbar || [
        'bold', 'italic', 'underline', 'strike',
        'h1', 'h2', 'h3',
        'bulletList', 'orderedList',
        'alignLeft', 'alignCenter', 'alignRight',
        'link', 'code', 'blockquote', 'clear'
    ];

    return (
        <div className="space-y-2">
            <div className="border border-input rounded-md overflow-hidden">
                <div className="flex flex-wrap gap-1 p-1 border-b bg-muted/50">
                    {toolbarItems.map((item) => {
                        const tool = availableTools[item as keyof typeof availableTools];
                        if (!tool) return null;

                        return (
                            <Button
                                key={item}
                                type="button"
                                size="sm"
                                variant="ghost"
                                className={cn(
                                    'h-8 px-2 py-1 text-sm',
                                    tool.isActive() ? 'bg-accent text-accent-foreground' : ''
                                )}
                                onClick={tool.action}
                            >
                                {tool.icon}
                            </Button>
                        );
                    })}
                </div>

                <EditorContent editor={editor} className={field.mergeClass} />
            </div>
        </div>
    );
}
