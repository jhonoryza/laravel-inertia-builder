import { ColumnDef, FieldDefinition } from "./field-builder";

export type Form = {
    columns: ColumnDef;
    fields: FieldDefinition[];
    baseRoute: string;
    routeId?: string | undefined;
    mode: string;
    formClass: string;
    modelClass: string;
    title: string;
    canEdit: boolean;
    prefix: string;
};
