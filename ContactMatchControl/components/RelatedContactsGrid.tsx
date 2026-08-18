import * as React from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";

import { DataGrid } from "./DataGrid";
import { GridColumn } from "../models/GridColumn";
import { RelatedContactsModel } from "../models/RelatedContactsModel";

interface RelatedContactsGridProps {
    items: RelatedContactsModel[];

    selectedContact: RelatedContactsModel | null;
    selectedCustomer: RelatedContactsModel | null;

    onContactSelected: (
        contact: RelatedContactsModel
    ) => void;

    onCustomerSelected: (
        customer: RelatedContactsModel
    ) => void;

    onConfirm: (
        contact: RelatedContactsModel,
        customer: RelatedContactsModel
    ) => void;

    isReadOnly?: boolean;
}

export const RelatedContactsGrid: React.FC<RelatedContactsGridProps> = ({
    items,
    selectedContact,
    selectedCustomer,
    onContactSelected,
    onCustomerSelected,
    onConfirm,
    isReadOnly = false
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
        {
            key: "selectContact",
            label: "Select Contact",
            onRender: (record) => {
                const item = record as unknown as RelatedContactsModel;

                return (
                    <input
                        type="radio"
                        name="contactSelection"
                        checked={
                            selectedContact?.contactid ===
                            item.contactid
                        }
                        disabled={isReadOnly}
                        onChange={() =>
                            onContactSelected(item)
                        }
                    />
                );
            }
        },
        {
            key: "selectCustomer",
            label: "Select Customer",
            onRender: (record) => {
                const item = record as unknown as  RelatedContactsModel;

                return (
                    <input
                        type="radio"
                        name="customerSelection"
                        checked={
                            selectedCustomer?.contactid ===
                            item.contactid
                        }
                        disabled={isReadOnly}
                        onChange={() =>
                            onCustomerSelected(item)
                        }
                    />
                );
            }
        }
    ];

    return (
        <div>
            <DataGrid<RelatedContactsModel>
                title="Related Contacts"
                items={items}
                columns={columns}
                rowKeyField="contactid"
            />

            <div
                style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <PrimaryButton
                    text="Confirm"
                    disabled={
                        isReadOnly ||
                        !selectedContact ||
                        !selectedCustomer
                    }
                    onClick={() => {
                        if (
                            selectedContact &&
                            selectedCustomer
                        ) {
                            onConfirm(
                                selectedContact,
                                selectedCustomer
                            );
                        }
                    }}
                />
            </div>
        </div>
    );
};