import {Button} from '@/components/ui/button';
import {Pagination, PaginationContent, PaginationItem} from '@/components/ui/pagination';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {DataTableProps} from '@/types/datatable';
import {router, usePage} from '@inertiajs/react';
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';

interface AppDataTablePaginationProps {
    name: DataTableProps['name'];
    prefix: DataTableProps['prefix'];
    items: DataTableProps['items'];
    perPage?: DataTableProps['perPage'];
    perPageOptions?: DataTableProps['perPageOptions'];
    selectedIds: (string | number)[];
    toggleSelectAll: (checked: boolean) => void;
}

export function AppDataTablePagination({
                                           name,
                                           prefix,
                                           items,
                                           perPage,
                                           perPageOptions,
                                           selectedIds,
                                           toggleSelectAll
                                       }: AppDataTablePaginationProps) {
    const hasSimplePagination = true;
    const {url} = usePage();

    const handlePerPageChange = (value: string) => {
        const perPageParam = prefix + 'perPage';
        router.get(
            url,
            {[perPageParam]: value},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 space-y-2 sm:space-y-0 border-t px-4 py-3 text-sm">
            <div className="flex flex-col items-start">
                <div>
                    {selectedIds.length > 0 && (
                        <Button variant="link"
                                onClick={() => toggleSelectAll(false)} type="button"
                                className="cursor-pointer"
                        >
                            Deselect all
                        </Button>
                    )}
                </div>
                <div>
                    {selectedIds.length === items.total ? (
                        `All ${items.total} rows selected`
                    ) : selectedIds.length > 0 ? (
                        `${selectedIds.length} ${items.total ? 'of' : ''} ${items.total ? items.total : ''} rows selected`
                    ) : (
                        'No rows selected.'
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select value={`${perPage}`} onValueChange={handlePerPageChange}>
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={`${perPage}`}/>
                    </SelectTrigger>
                    <SelectContent side="top">
                        {perPageOptions?.map(option => (
                            <SelectItem key={option} value={`${option}`}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-4">
                {items?.total > 0 && (
                    <div>
                        Page {items.from} of {items.total}
                    </div>
                )}
                {hasSimplePagination ? (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() =>
                                items.first_page_url &&
                                router.get(items.first_page_url, {}, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    only: [name]
                                })
                            }
                            disabled={!items.prev_page_url || !items.first_page_url}>
                            <ChevronsLeft/>
                        </Button>
                        <Button
                            variant="ghost"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() =>
                                items.prev_page_url &&
                                router.get(items.prev_page_url, {}, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    only: [name]
                                })
                            }
                            disabled={!items.prev_page_url}>
                            <ChevronLeft/>
                        </Button>
                        <Button
                            variant="ghost"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() =>
                                items.next_page_url &&
                                router.get(items.next_page_url, {}, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    only: [name]
                                })
                            }
                            disabled={!items.next_page_url}>
                            <ChevronRight/>
                        </Button>
                        <Button
                            variant="ghost"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() =>
                                items.last_page_url &&
                                router.get(items.last_page_url, {}, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    only: [name]
                                })
                            }
                            disabled={!items.next_page_url || !items.last_page_url}>
                            <ChevronsRight/>
                        </Button>
                    </div>
                ) : (
                    <div>
                        {items?.links && (
                            <Pagination>
                                <PaginationContent>
                                    {items.links.map((link, i) => (
                                        <PaginationItem key={i}>
                                            <Button
                                                className="hover:cursor-pointer"
                                                key={i}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() =>
                                                    link.url &&
                                                    router.get(
                                                        link.url,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                            only: [name]
                                                        },
                                                    )
                                                }
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{__html: link.label}}
                                            />
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
