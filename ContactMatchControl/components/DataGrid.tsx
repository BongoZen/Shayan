import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
    DetailsList,
    IColumn,
    ColumnActionsMode,
    Selection,
    SelectionMode
} from "@fluentui/react/lib/DetailsList";

import { TextField } from "@fluentui/react/lib/TextField";

import {
    PrimaryButton,
    DefaultButton,
    IconButton,
    ActionButton
} from "@fluentui/react/lib/Button";

import {
    Callout,
    DirectionalHint
} from "@fluentui/react/lib/Callout";

import {
    Spinner,
    SpinnerSize
} from "@fluentui/react/lib/Spinner";

import {
    MessageBar,
    MessageBarType
} from "@fluentui/react/lib/MessageBar";

import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";

import { GridColumn } from "../models/GridColumn";

type SortDirection = "asc" | "desc";

const PAGE_SIZE = 5;

export interface DataGridProps<T extends object> {
    title?: string;
    items: T[];
    columns: GridColumn[];
    rowKeyField: keyof T;
    selectable?: boolean;
    showConfirmButton?: boolean;
    isConfirmed?: boolean;
    isLoading?: boolean;
    onConfirm?: (selectedId: string) => void;
    onSelectionChange?: (selectedId: T) => void;
}

export function DataGrid<T extends object>({
    title,
    items,
    columns,
    rowKeyField,
    selectable = false,
    showConfirmButton = false,
    isConfirmed = false,
    isLoading = false,
    onConfirm,
    onSelectionChange
}: DataGridProps<T>): React.ReactElement {

    const [columnFilters, setColumnFilters] =
        useState<Record<string, string>>({});

    const [sortColumn, setSortColumn] =
        useState<string>("");

    const [sortDirection, setSortDirection] =
        useState<SortDirection>("asc");

    const [openFilterColumn, setOpenFilterColumn] =
        useState<string | null>(null);

    const [draftFilter, setDraftFilter] =
        useState<string>("");

    const [currentPage, setCurrentPage] =
        useState<number>(1);

    const [selectedKey, setSelectedKey] =
        useState<string>("");

    const calloutTargetRef =
        useRef<HTMLElement | null>(null);

    const getCellValue = (
        item: T,
        key: string
    ): string => {

        const record = item as Record<string, unknown>;

        const value = record[key];

        if (typeof value === "string") {
            return value;
        }

        if (typeof value === "number") {
            return value.toString();
        }

        if (typeof value === "boolean") {
            return value.toString();
        }

        return "";
    };

    const filteredItems = useMemo(() => {

        const filters =
            Object.entries(columnFilters);

        if (filters.length === 0) {
            return items;
        }

        return items.filter((item) =>
            filters.every(([key, value]) =>
                getCellValue(item, key)
                    .toLowerCase()
                    .includes(value.toLowerCase())
            )
        );

    }, [items, columnFilters]);

    const sortedItems = useMemo(() => {

        if (!sortColumn) {
            return filteredItems;
        }

        return [...filteredItems].sort((a, b) => {

            const aValue =
                getCellValue(a, sortColumn);

            const bValue =
                getCellValue(b, sortColumn);

            const comparison =
                aValue.localeCompare(
                    bValue,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );

            return sortDirection === "asc"
                ? comparison
                : -comparison;
        });

    }, [
        filteredItems,
        sortColumn,
        sortDirection
    ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(sortedItems.length / PAGE_SIZE)
        );

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredItems]);

    const pagedItems = useMemo(() => {

        const start =
            (currentPage - 1) * PAGE_SIZE;

        return sortedItems.slice(
            start,
            start + PAGE_SIZE
        );

    }, [
        sortedItems,
        currentPage
    ]);

    const selection = useRef(
        new Selection({
            selectionMode:
                selectable
                    ? SelectionMode.single
                    : SelectionMode.none,

            getKey: (item) =>
                String(
                    (item as T)[rowKeyField]
                ),

            onSelectionChanged: () => {

                const selected =
                    selection.current.getSelection();

                if (selected.length > 0) {

                    const item = selected[0] as T;

                    const key =
                        String(
                            (
                                selected[0] as T
                            )[rowKeyField]
                        );

                    setSelectedKey(key);
                    onSelectionChange?.(item);
                } else {
                    setSelectedKey("");
                }
            }
        })
    );

    useEffect(() => {
        selection.current.setItems(
            pagedItems,
            false
        );
    }, [pagedItems]);

    const fluentColumns: IColumn[] =
        useMemo(() =>
            columns.map((column) => ({

                key: column.key,

                name: column.label,

                fieldName: column.key,

                minWidth: 120,

                maxWidth: 250,

                isResizable: true,

                columnActionsMode:
                    ColumnActionsMode.hasDropdown,

                isSorted:
                    sortColumn === column.key,

                isSortedDescending:
                    sortColumn === column.key &&
                    sortDirection === "desc",

                iconName:
                    columnFilters[column.key]
                        ? "FilterSolid"
                        : undefined,

                onColumnClick: (
                    ev,
                    clickedColumn
                ) => {

                    calloutTargetRef.current =
                        ev.currentTarget;

                    setOpenFilterColumn(
                        clickedColumn.key
                    );

                    setDraftFilter(
                        columnFilters[
                        clickedColumn.key
                        ] ?? ""
                    );
                }
            })),
            [
                columns,
                columnFilters,
                sortColumn,
                sortDirection
            ]
        );

    return (
        <div>

            {title && <h3>{title}</h3>}

            {showConfirmButton && (
                <Stack
                    horizontal
                    tokens={{ childrenGap: 10 }}
                    style={{ marginBottom: 10 }}
                >
                    <PrimaryButton
                        text="Confirm"
                        disabled={
                            !selectedKey ||
                            isConfirmed
                        }
                        onClick={() =>
                            onConfirm?.(
                                selectedKey
                            )
                        }
                    />

                    <DefaultButton
                        text="Clear Filters"
                        onClick={() =>
                            setColumnFilters({})
                        }
                    />
                </Stack>
            )}

            {isLoading && (
                <Spinner
                    size={SpinnerSize.medium}
                    label="Loading..."
                />
            )}

            {!isLoading &&
                sortedItems.length === 0 && (
                    <MessageBar
                        messageBarType={
                            MessageBarType.info
                        }
                    >
                        No records found
                    </MessageBar>
                )}

            {!isLoading &&
                sortedItems.length > 0 && (
                    <>
                        <DetailsList
                            items={pagedItems}
                            columns={fluentColumns}
                            selection={
                                selection.current
                            }
                            selectionMode={
                                selectable
                                    ? SelectionMode.single
                                    : SelectionMode.none
                            }
                            onRenderItemColumn={(
                                item,
                                _index,
                                column
                            ) => {

                                const gridColumn =
                                    columns.find(
                                        c => c.key === column?.key
                                    );

                                if (gridColumn?.onRender) {
                                    return gridColumn.onRender(
                                        item as Record<string, unknown>
                                    );
                                }

                                return getCellValue(
                                    item as T,
                                    column?.fieldName ?? ""
                                );
                            }}
                        />

                        <Stack
                            horizontal
                            horizontalAlign="space-between"
                            verticalAlign="center"
                        >
                            <Text>
                                Page {currentPage} of{" "}
                                {totalPages}
                            </Text>

                            <Stack
                                horizontal
                                tokens={{
                                    childrenGap: 5
                                }}
                            >
                                <IconButton
                                    iconProps={{
                                        iconName:
                                            "ChevronLeft"
                                    }}
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (p) => p - 1
                                        )
                                    }
                                />

                                <IconButton
                                    iconProps={{
                                        iconName:
                                            "ChevronRight"
                                    }}
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (p) => p + 1
                                        )
                                    }
                                />
                            </Stack>
                        </Stack>
                    </>
                )}

            {openFilterColumn &&
                calloutTargetRef.current && (
                    <Callout
                        target={
                            calloutTargetRef.current
                        }
                        directionalHint={
                            DirectionalHint.bottomLeftEdge
                        }
                        onDismiss={() =>
                            setOpenFilterColumn(
                                null
                            )
                        }
                    >
                        <div
                            style={{
                                padding: 16,
                                width: 250
                            }}
                        >
                            <ActionButton
                                text="Sort A-Z"
                                onClick={() => {
                                    setSortColumn(
                                        openFilterColumn
                                    );
                                    setSortDirection(
                                        "asc"
                                    );
                                    setOpenFilterColumn(
                                        null
                                    );
                                }}
                            />

                            <ActionButton
                                text="Sort Z-A"
                                onClick={() => {
                                    setSortColumn(
                                        openFilterColumn
                                    );
                                    setSortDirection(
                                        "desc"
                                    );
                                    setOpenFilterColumn(
                                        null
                                    );
                                }}
                            />

                            <TextField
                                label="Contains"
                                value={draftFilter}
                                onChange={(_, v) =>
                                    setDraftFilter(
                                        v ?? ""
                                    )
                                }
                            />

                            <Stack
                                horizontal
                                horizontalAlign="end"
                                tokens={{
                                    childrenGap: 8
                                }}
                            >
                                <DefaultButton
                                    text="Clear"
                                    onClick={() => {

                                        setColumnFilters(
                                            (
                                                prev
                                            ) => {

                                                const next =
                                                {
                                                    ...prev
                                                };

                                                delete next[
                                                    openFilterColumn
                                                ];

                                                return next;
                                            }
                                        );

                                        setOpenFilterColumn(
                                            null
                                        );
                                    }}
                                />

                                <PrimaryButton
                                    text="Apply"
                                    onClick={() => {

                                        setColumnFilters(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,
                                                [
                                                    openFilterColumn
                                                ]:
                                                    draftFilter
                                            })
                                        );

                                        setOpenFilterColumn(
                                            null
                                        );
                                    }}
                                />
                            </Stack>
                        </div>
                    </Callout>
                )}
        </div>
    );
}