import {ActiveFilter, Filter as FilterType} from '@/types/datatable';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface FilterInputProps {
    filterDef: FilterType;
    activeFilter: ActiveFilter;
    onFilterChange: (field: string, value: string | string[], operator: string) => void;
}

export function AppDatatableFilterOperator({filterDef, activeFilter, onFilterChange}: FilterInputProps) {
    const handleValueChange = (field: string, value: string | string[], operator: string) => {
        onFilterChange(field, value, operator);
    };
    return (
        (filterDef?.operators?.length ?? 0) > 0 && (
            <Select
                value={activeFilter.operator ?? ''}
                onValueChange={(value) => {
                    handleValueChange(activeFilter.field, activeFilter.value ?? '', value);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select operator"/>
                </SelectTrigger>
                <SelectContent>
                    {filterDef?.operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                            {op.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )
    )
}
