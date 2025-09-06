type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

export function AppFieldInfoText({value}: Props) {
    return (
        <div
            className="flex w-full items-center text-sm text-muted-foreground">
            {typeof value === 'boolean' ? (value ? 'true' : 'false') : value || '-'}
        </div>
    );
}
