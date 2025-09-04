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

export function fieldClasses(field: FieldDefinition): string {
    const span = field.columnSpan || {} as ColumnDef;
    const order = field.columnOrder || {} as ColumnDef;

    const colSpanMap: Record<number, string> = {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        7: "col-span-7",
        8: "col-span-8",
        9: "col-span-9",
        10: "col-span-10",
        11: "col-span-11",
        12: "col-span-12",
    };

    const orderMap: Record<number, string> = {
        1: "order-1",
        2: "order-2",
        3: "order-3",
        4: "order-4",
        5: "order-5",
        6: "order-6",
        7: "order-7",
        8: "order-8",
        9: "order-9",
        10: "order-10",
        11: "order-11",
        12: "order-12",
        13: "order-13",
        14: "order-14",
        15: "order-15",
        16: "order-16",
        17: "order-17",
        18: "order-18",
        19: "order-19",
        20: "order-20",
    };

    return [
        span.default && `${colSpanMap[span.default]}`,
        span.sm && `sm:${colSpanMap[span.sm]}`,
        span.md && `md:${colSpanMap[span.md]}`,
        span.xl && `xl:${colSpanMap[span.xl]}`,
        span['2xl'] && `2xl:${colSpanMap[span['2xl']]}`,
        order.default && `${orderMap[order.default]}`,
        order.sm && `sm:${orderMap[order.sm]}`,
        order.md && `md:${orderMap[order.md]}`,
        order.xl && `xl:${orderMap[order.xl]}`,
        order['2xl'] && `2xl:${orderMap[order['2xl']]}`,
    ].filter(Boolean).join(" ");
}


export function gridClasses(columns?: ColumnDef): string {
    const gridColsMap: Record<number, string> = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        7: "grid-cols-7",
        8: "grid-cols-8",
        9: "grid-cols-9",
        10: "grid-cols-10",
        11: "grid-cols-11",
        12: "grid-cols-12",
    };
    return clsx(
        "grid gap-4",
        columns?.default && gridColsMap[columns.default],
        columns?.sm && `sm:${gridColsMap[columns.sm]}`,
        columns?.md && `md:${gridColsMap[columns.md]}`,
        columns?.xl && `xl:${gridColsMap[columns.xl]}`,
        columns?.["2xl"] && `2xl:${gridColsMap[columns["2xl"]]}`
    );
}
