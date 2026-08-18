import * as React from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";

import { DataGrid } from "./DataGrid";
import { GridColumn } from "../models/GridColumn";
import { VerificationOutcome } from "../models/VerificationOutcomeModel";

interface IVerificationContactGridProps {
    records: VerificationOutcome[];
    isLoading: boolean;
    onRefresh: () => void;
}

const COLUMNS: GridColumn[] = [
    {key:"contact",label: "Contact"},
    { key: "platformAccount", label: "Platform Account" },
    { key: "customer", label: "Customer" },
    { key: "verificationStatus", label: "Verification Status" },
];

export const VerificationContactGrid: React.FC<IVerificationContactGridProps> = ({
    records,
    isLoading, 
    onRefresh
}) => { 
    return (
        <div>
            <DataGrid<VerificationOutcome>
                title="Verification Outcomes"
                columns={COLUMNS}
                items={records}
                rowKeyField="contact"
                isLoading={isLoading}
            />
        </div>
    );
};



