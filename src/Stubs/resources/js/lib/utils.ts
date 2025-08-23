import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


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