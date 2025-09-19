import { format } from "date-fns";

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

export function AppFieldInfoDate({ value }: Props) {
    return (
        <div
            className="flex w-full items-center text-sm text-muted-foreground">
            {value ? format(new Date(value), 'dd/MM/yyyy') : 'select date'}
        </div>
    );
}
