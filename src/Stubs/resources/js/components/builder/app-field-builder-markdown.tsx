import {useEffect, useRef, useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {cn} from '@/lib/utils';
import {marked} from 'marked';

type Props = {
    field: {
        name: string;
        label: string;
        type: string;
        placeholder?: string;
        mergeClass?: string;
    };
    value: string;
    setData: (key: string, value: string) => void;
};

export function AppFieldBuilderMarkdown({field, value, setData}: Props) {
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (tab === 'write') {
            textareaRef.current?.focus();
        }
    }, [tab]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData(field.name, e.target.value);
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
                    />
                </TabsContent>

                <TabsContent value="preview">
                    <div
                        className={cn("prose-sm dark:prose-dark max-w-none p-3 border rounded bg-muted")}
                        dangerouslySetInnerHTML={{__html: marked.parse(value || '')}}
                        placeholder={field.placeholder || 'Write markdown content here...'}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
