import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ColumnDef, FieldDefinition } from "@/types/field-builder";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentType = React.FC<any>
const registry: Record<string, ComponentType> = {}

export function registerComponent(name: string, component: ComponentType) {
    registry[name] = component
}

export function getComponent(name: string): ComponentType | undefined {
    return registry[name];
}

export function registerComponentsFromContext(modules: Record<string, { default: ComponentType }>) {
    Object.entries(modules).forEach(([path, module]) => {
        // Ambil nama file dari path, buang .tsx
        const fileName = path.split("/").pop()?.replace(/\.tsx$/, "") || ""
        // Ubah ke kebab-case (BadgeCell -> badge-cell)
        const componentName = fileName
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // pasang strip
            .toLowerCase()

        registerComponent(componentName, module.default)
    })
}

// const components = import.meta.glob<{
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   default: React.FC<any>
// }>("./components/dynamic/*.tsx", { eager: true })

// registerComponentsFromContext(components)

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

const colSizes = Array.from({ length: 12 }, (_, i) => i + 1);

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
