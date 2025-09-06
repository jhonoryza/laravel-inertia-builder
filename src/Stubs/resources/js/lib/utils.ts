import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {ColumnDef, FieldDefinition} from "@/types/field-builder";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const breakpoints = ["", "sm", "md", "lg", "xl", "2xl"] as const;

export function toColumnDefKey(bp: (typeof breakpoints)[number]): keyof ColumnDef {
    return bp === "" ? "default" : (bp as keyof ColumnDef);
}

function makeResponsiveClasses(
    def: ColumnDef,
    prefix: string,
    max: number
): string[] {
    return breakpoints.flatMap(bp => {
        const key = toColumnDefKey(bp);
        const val = def?.[key];
        if (!val || val > max) return [];
        const className = `${prefix}-${val}`;
        return bp === "" ? [className] : [`${bp}:${className}`];
    });
}

export function fieldClasses(field: FieldDefinition): string {
    const span = field.columnSpan || {} as ColumnDef;
    const order = field.columnOrder || {} as ColumnDef;

    return clsx(
        makeResponsiveClasses(span, "col-span", 12),
        makeResponsiveClasses(order, "order", 20),
    );
}

const colSizes = Array.from({length: 12}, (_, i) => i + 1);

export function gridClasses(columns?: ColumnDef): string {
    return clsx(
        "grid",
        ...breakpoints.flatMap(bp =>
            colSizes.map(size => {
                const key = toColumnDefKey(bp);
                const colValue = columns?.[key];
                const className = bp === "" ? `grid-cols-${size}` : `${bp}:grid-cols-${size}`;

                return colValue === size && className;
            })
        )
    );
}

export const sortByOrder = <T extends { order?: number }>(arr: T[]) =>
    [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const maxOrder = <T extends { order?: number }>(arr: T[]) =>
    Math.max(...arr.map(f => f.order ?? 0), 0);
