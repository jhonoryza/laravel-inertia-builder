import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FieldDefinition } from '@/types/field-builder';
import { marked } from 'marked';
import { useEffect, useRef, useState } from 'react';

type Props = {
    field: FieldDefinition;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (key: string, value: any, operator?: string) => void;
};

export function AppFieldBuilderMarkdown({ field, value, onChange }: Props) {
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (tab === 'write') {
            textareaRef.current?.focus();
        }
    }, [tab]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(field.key, e.target.value);
    };

    return (
        <div className="space-y-1">
            <Tabs value={tab} onValueChange={(val) => setTab(val as 'write' | 'preview')}>
                <TabsList className="mb-2">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="write">
                    <Textarea
                        id={field.name}
                        value={value}
                        onChange={handleChange}
                        placeholder="Write markdown here..."
                        rows={10}
                        className={field.mergeClass}
                        disabled={field.isDisable}
                    />
                </TabsContent>

                <TabsContent value="preview">
                    <div
                        className={cn("prose-sm dark:prose-invert max-w-none p-3 border rounded bg-muted")}
                        dangerouslySetInnerHTML={{ __html: marked.parse(value || '') }}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
