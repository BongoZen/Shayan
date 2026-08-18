import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MockSearchService } from "../services/MockService";
import { CallerGridModel } from "../models/CallerGrid";
import { ContactModel } from "../models/ContactModel";
import {
    DetailsList,
    IColumn as IFluentColumn,
    ColumnActionsMode,
    SelectionMode,
    Selection,
} from "@fluentui/react/lib/DetailsList";
import { TextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { PrimaryButton, DefaultButton, IconButton, ActionButton } from "@fluentui/react/lib/Button";
import { Callout, DirectionalHint } from "@fluentui/react/lib/Callout";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
//import "../components/ContactMatchGrid.css";
//import { CallerGridModel } from "../models/CallerGrid";
import { PlatformAccountSearch } from "./PlatformAccountSearch";
import { CallerMapper } from "../models/mappers/CallerMapper";
import { CallerGrid } from "./CallerGrid";
import { IInputs } from "../generated/ManifestTypes";
import { SearchService } from "../services/SearchService";
import { PlatformAccountGrid } from "./PlatformAccountGrid";
import { PlatformAccountModel } from "../models/PlatformAccountModel";
import { RelatedContactsGrid } from "./RelatedContactsGrid";
import { RelatedContactsModel } from "../models/RelatedContactsModel";
import { VerificationContactGrid } from "./VerificationContactGrid";
import { VerificationOutcome } from "../models/VerificationOutcomeModel";

interface GridControllerProps {

    context: ComponentFramework.Context<IInputs>;
    callerNumber: string;
    conversationId?: string;
}

interface ControllerState {
    callers: CallerGridModel[];
    selectedCaller: CallerGridModel | null;
    platformAccounts: PlatformAccountModel[];
    selectedAccount: PlatformAccountModel | null;
    relatedContacts: RelatedContactsModel[];
    selectedContact: RelatedContactsModel | null;
    selectedCustomer: RelatedContactsModel | null;
    verificationOutcomes: VerificationOutcome[];
}

export const GridController: React.FC<GridControllerProps> = ({

    context,

    callerNumber,
    conversationId = ""

}) => {

    const storageKey = conversationId ? "ConversatinIdMatch_" + conversationId : "";

    const [callers, setCallers] = React.useState<CallerGridModel[]>([]);
    const [selectedCaller, setSelectedCaller] = React.useState<CallerGridModel | null>(null);
    const [platformAccounts, setAccounts] = React.useState<PlatformAccountModel[]>([]);
    const [selectedAccount, setSelectedaccount] = React.useState<PlatformAccountModel | null>(null);
    const [relatedContacts, setRelatedContacts] = React.useState<RelatedContactsModel[]>([]);
    const [selectedContact, setSelectedContact] = React.useState<RelatedContactsModel | null>(null);
    const [selectedCustomer, setSelectedCustomer] = React.useState<RelatedContactsModel | null>(null);
    const [verificationOutcomes, setVerificationOutcomes] = React.useState<VerificationOutcome[]>([]);
    const [isVerificationLoading, setIsVerificationLoading] = React.useState<boolean>(false);
    const [isConfirmedLocked, setIsConfirmedLocked] = React.useState<boolean>(false);
    const useMock = false; // Set to true to use mock data for testing

    React.useEffect(() => {
        const state: ControllerState = {
            callers,
            selectedCaller,
            platformAccounts,
            selectedAccount,
            relatedContacts,
            selectedContact,
            selectedCustomer,
            verificationOutcomes
        };
        sessionStorage.setItem(storageKey, JSON.stringify(state));
    }, [callers, selectedCaller, platformAccounts, selectedAccount, relatedContacts, selectedContact, selectedContact, verificationOutcomes, storageKey]
    );

    const [accountSearchText, setAccountSearchText] = React.useState("");
    React.useEffect(() => {
        console.log("Grid controller mounted");

        return () => {
            console.log("Grid controller unmounted");
        }
    }, []);

    React.useEffect(() => {
        console.log("Platform accounts changed", platformAccounts.length);
    }, [platformAccounts]);

    React.useEffect(() => {
        console.log("replated contact changed", relatedContacts.length);
    }, [relatedContacts]);

    React.useEffect(() => {
        console.log("V outcome changed", verificationOutcomes.length);
    }, [verificationOutcomes]);

    React.useEffect(() => {
        const initialise = async (): Promise<void> => {
            if (!conversationId || conversationId == "") {
                await loadData();
                return;
            }
            const savedState = sessionStorage.getItem(storageKey);
            if (savedState) {
                console.log("Attempting to store state ", storageKey);

                const state = JSON.parse(savedState) as ControllerState;
                console.log(state);

                setCallers(state.callers);
                setSelectedCaller(state.selectedCaller);
                setAccounts(state.platformAccounts);
                setSelectedaccount(state.selectedAccount);
                setRelatedContacts(state.relatedContacts);
                setSelectedContact(state.selectedContact);
                setSelectedCustomer(state.selectedCustomer);
                setVerificationOutcomes(state.verificationOutcomes);

                return;
            }
            console.log("no saved data found");
            await loadData();

        };


        const loadData = async (): Promise<void> => {

            if (useMock) {
                const service = new MockSearchService();
                const callers = await service.getCaller();
                setCallers(callers.entities.map((entity) => CallerMapper.map(entity)));
                return;
            }
            const service = new SearchService(context);

            const callerResult = await service.PhoneNumberContact(callerNumber);
            console.log("caller Records fetch:", callerResult);
            setCallers(callerResult);
            // setCallers(
            //     callerResult.entities.map((entity) =>
            //         CallerMapper.map(entity)
            //     )
            // );


        };

        //void loadData();
        void initialise()
    }, [storageKey]);



    const handlePlatformSearch = async (
        searchText: string
    ): Promise<void> => {
        console.log("Search text: ", searchText);
        if (searchText == null || searchText == "") {
            handlePlatformSearchClear();
            return;
        }
        if (useMock) {
            const service = new MockSearchService();
            const accounts = await service.getPlatformAccountModels();
            setAccounts(accounts.entities);

            const firstAccount = accounts.entities[0] ?? null;
            setSelectedaccount(firstAccount);

            if (firstAccount) {
                const relatedContacts = await service.getRelatedContactModels();
                setRelatedContacts(relatedContacts.entities);
            } else {
                setRelatedContacts([]);
            }

            return;
        }
        const service = new SearchService(context);
        const platformAccountResult = await service.SearchPlatformAccounts(searchText);
        setAccounts(platformAccountResult);

        const firstAccount = platformAccountResult[0] ?? null;
        setSelectedaccount(firstAccount);

        if (firstAccount) {
            const accountNumber = firstAccount.abdn_platformaccountid ?? "";
            const fcaNumber = firstAccount.WAC_abdn_accountfcanumberonplatform ?? "";
            const relatedContactsResult = await service.PlatformAccount_contacts(accountNumber, fcaNumber);
            setRelatedContacts(relatedContactsResult);
        } else {
            setRelatedContacts([]);
        }

        return;
    };

    const handlePlatformSearchClear = (): void => {
        setAccounts([]);
        setSelectedaccount(null);
        setRelatedContacts([]);
        setSelectedContact(null);
        setSelectedCustomer(null);
        setIsConfirmedLocked(false);
        setIsVerificationLoading(false);
    };

    const handleCallerConfirm = async (
        callerId: string
    ): Promise<void> => {
        console.log("Caller confirmed:", callerId);
        const caller = callers.find(c => c.contactid == callerId) ?? null;
        setSelectedCaller(caller);
        console.log("Selected Called set", caller);
        const platforAccountName = caller?.PA_abdn_platformaccountname; // UG - change this to the correct field
        console.log("Platform account Name: ", platforAccountName);
        if (platforAccountName != null && platforAccountName != "") {
            if (useMock) {
                const service = new MockSearchService();
                const accounts = await service.getPlatformAccountModels();
                setAccounts(accounts.entities);
                return;
            }
            const service = new SearchService(context);
            const platformAccountResult = await service.SearchPlatformAccounts(platforAccountName);
            setAccounts(platformAccountResult);
            return;
        }
        else {
            console.log("Attempt to set empty state for Acocunts");
            setAccounts([]);
        }
    };

    const handlePlatformAccountSelected = async (
        platformAccountId: PlatformAccountModel
    ): Promise<void> => {
        console.log("platform account selected", platformAccountId);
        setSelectedaccount(platformAccountId);
        const accountNumber = platformAccountId.abdn_platformaccountid ?? "";
        console.log(accountNumber);
        const fcaNumber = platformAccountId.WAC_abdn_accountfcanumberonplatform ?? "";
        console.log(fcaNumber);
        if (useMock) {
            const service = new MockSearchService();
            const relatedContacts = await service.getRelatedContactModels();
            setRelatedContacts(relatedContacts.entities);
            return;
        }
        const service = new SearchService(context);
        const relatedContactsResult = await service.PlatformAccount_contacts(accountNumber, fcaNumber);
        setRelatedContacts(relatedContactsResult);

    };

    const handleRelatedContactsConfirm = async (
        contact: RelatedContactsModel,
        customer: RelatedContactsModel
    ): Promise<void> => {

        console.log("Contact", contact);
        console.log("Customer", customer);

        await handleContactConfirm(
            contact,
            selectedAccount,
            customer
        );
    };

    const handleContactConfirm = async (
        contact: RelatedContactsModel,
        platformAccount: PlatformAccountModel | null,
        customer: RelatedContactsModel
    ): Promise<void> => {
        setIsVerificationLoading(true);

        try {
            const platformAccountValue = platformAccount?.abdn_platformaccountid ?? "";

            if (useMock) {
                setVerificationOutcomes([
                    {
                        abdn_idvid: "",
                        contact: contact.contactid,
                        platformAccount: platformAccountValue,
                        customer: customer.contactid,
                        verificationStatus: "in progress"
                    }
                ]);

                setIsConfirmedLocked(true);

                return;
            }

            const service = new SearchService(context);
            await service.createVerificationOutcome(
                conversationId,
                contact,
                platformAccountValue,
                customer.contactid
            );

            const verificationOutcomerecord =
                await service.getVerificationOutcomes(
                    conversationId
                );

            setVerificationOutcomes(verificationOutcomerecord);
            setIsConfirmedLocked(true);
        } finally {
            setIsVerificationLoading(false);
        }
    };

    const handleVerificationRefresh = async (): Promise<void> => {
        if (!conversationId) {
            return;
        }

        setIsVerificationLoading(true);

        try {
            const service = new SearchService(context);
            const records = await service.getVerificationOutcomes(
                conversationId
            );
            setVerificationOutcomes(records);
        } finally {
            setIsVerificationLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "24px"
            }}
        >
            <CallerGrid
                items={callers}
                onConfirm={handleCallerConfirm}
            />

            <PlatformAccountSearch
                onSearch={handlePlatformSearch}
                onClear={handlePlatformSearchClear}
            />

            <PlatformAccountGrid
                items={platformAccounts}
                onSelect={handlePlatformAccountSelected}
                isReadOnly={isConfirmedLocked}

            />

            <RelatedContactsGrid
                items={relatedContacts}
                selectedContact={selectedContact}
                selectedCustomer={selectedCustomer}
                onContactSelected={setSelectedContact}
                onCustomerSelected={setSelectedCustomer}
                onConfirm={handleRelatedContactsConfirm}
                isReadOnly={isConfirmedLocked}
            />
            <VerificationContactGrid
                records={verificationOutcomes}
                isLoading={isVerificationLoading}
                onRefresh={handleVerificationRefresh}
            />


        </div>
    );
};