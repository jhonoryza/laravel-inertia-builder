import { cn } from '@/lib/utils';
import { marked } from 'marked';

type Props = {
    value: string;
};

export function AppFieldInfoMarkdown({ value }: Props) {
    return (
        <div className="space-y-1">

            <div
                className={cn("prose-sm dark:prose-dark max-w-none p-3 border rounded bg-muted")}
                dangerouslySetInnerHTML={{ __html: marked.parse(value || '') }}
            />
        </div>
    );
}
