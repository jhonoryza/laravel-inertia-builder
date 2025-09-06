type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

export function AppFieldInfoTextList({value}: Props) {
    return (
        <ul className="w-full list-disc space-y-1 px-3 text-sm shadow-sm">
            {value.map(({v, i}: {v: string|boolean|number, i: string|number}) => (
                <li key={i} className="text-muted-foreground">
                    {typeof v === 'boolean' ? (v ? 'true' : 'false') : v || '-'}
                </li>
            ))}
        </ul>
    );
}
