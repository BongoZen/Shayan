import * as React from "react";

import { GridColumn } from "../models/GridColumn";
import { DataGrid } from "../components/DataGrid";
import { PlatformAccountModel } from "../models/PlatformAccountModel";

interface PlatformAccountGridProps {
    items: PlatformAccountModel[];
    onSelect?: (platformAccount: PlatformAccountModel) => void;
    isReadOnly?: boolean;
}

export const PlatformAccountGrid: React.FC<PlatformAccountGridProps> = ({
    items,
    onSelect,
    isReadOnly = false
}) => {
    const columns: GridColumn[] = [
        { key: "abdn_newcolumn", label: "Platform Account Number" },
        { key: "abdn_platformaccountname", label: "Platform Account Name" },
        { key: "abdn_platformaccountproposition", label: "Platform Account Prop" },
        { key: "abdn_platformaccounttype", label: "Platform Account Type" },
        { key: "abdn_platformaccountstatus", label: "Platform Account Status" },
        { key: "WAC_abdn_adviseraccountonplatform", label: "Adviser Firm" },
        { key: "WAC_abdn_accountfcanumberonplatform", label: "FCA Number" },
        { key: "WAC_abdn_newcolumn", label: "Adviser Code" },
    ];

    return (
        <DataGrid<PlatformAccountModel>
            items={items}
            columns={columns}
            rowKeyField="abdn_newcolumn"
            selectable={!isReadOnly}
            onSelectionChange={isReadOnly ? undefined : onSelect}
        />

    );
}