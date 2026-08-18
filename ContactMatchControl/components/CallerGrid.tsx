import * as React from "react";

import { CallerGridModel } from "../models/CallerGrid";
import { GridColumn } from "../models/GridColumn";
import { DataGrid } from "../components/DataGrid";

interface CallerGridProps {
    items: CallerGridModel[];
    onConfirm?: (callerId: string) => void;
}

export const CallerGrid: React.FC<CallerGridProps> = ({
    items,
    onConfirm
}) => {

    const columns: GridColumn[] = [
        { key: "fullname", label: "Full Name" },
        { key: "abdn_contacttype",label: "Contact Type"},
        { key: "mobilephone", label: "Mobile Phone" },
        { key: "telephone1", label: "Phone" },
        { key: "emailaddress1", label: "Email Address" },
        { key: "birthdate", label: "DOB" },
        { key:"abdn_ninumber", label:"Ni Number"},
        { key: "address1_line1", label: "Address line 1" },
        { key: "address1_postalcode", label: "Postcode" },
        {key:"abdn_adviserjobcategory" , label:"Adviser Job Category"},
        {key:"PA_abdn_newcolumn", label:"Platform Account Number"},
        {key:"PA_abdn_platformaccountname",label:"Platform Account Name"},
        {key:"PA_abdn_platformaccounttype",label:"Platform Account Type"},
        {key:"WAC_abdn_wrapadvisercode",label:"Adviser Name"},
        {key:"A_abdn_name",label:"Firm Name"},
        {key:"A_abdn_statuscode",label:"Firm status"}
                
    ];

    return (
        <DataGrid<CallerGridModel>
            title="Caller"
            items={items}
            columns={columns}
            rowKeyField="contactid"
            selectable={true}
            showConfirmButton={true}
            onConfirm={onConfirm}
        />
    );
};