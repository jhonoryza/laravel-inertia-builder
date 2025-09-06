type Props = {
    count: number;
}

export function AppDatatableLoadingPlaceholder({ count }: Props) {
    return (
        <div className="p-4 space-y-3">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="h-6 w-full rounded bg-muted animate-pulse"
                />
            ))}
        </div>

    );
}
