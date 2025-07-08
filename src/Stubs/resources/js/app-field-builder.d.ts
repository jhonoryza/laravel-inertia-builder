import { ComponentType } from 'react';

declare module '@/components/app-field-builder-custom' {
  export function registerCustomComponent(name: string, component: ComponentType<any>): void;
}
