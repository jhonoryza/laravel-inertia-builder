/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
    value: any;
}

export function AppFieldInfoTextList({ value }: Props) {
    return (
        <ul className="w-full list-disc space-y-1 px-3 text-sm shadow-sm">
            {value.map((v: any, i: any) => (
                <li key={i} className="text-muted-foreground">
                    {typeof v === 'boolean' ? (v ? 'true' : 'false') : v || '-'}
                </li>
            ))}
        </ul>
    );
}
