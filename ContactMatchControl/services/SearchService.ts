import { CallerGridModel } from "../models/CallerGrid";
import { SearchRequest } from "../models/SearchRequest";
import { SearchReponse } from "../models/SearchResponse";
import { ISearchService } from "./ISearchService";
import { WebApiService } from "./WebAPIService";
import { IInputs, IOutputs } from "../generated/ManifestTypes";
import { PlatformAccountModel } from "../models/PlatformAccountModel";
import { RelatedContactsModel } from "../models/RelatedContactsModel";
import { PCFState } from "../hooks/PCFState";
import { VerificationOutcome } from "../models/VerificationOutcomeModel";

interface SessionContext {
  parameters: {
    customerName: string;
    LiveWorkItemId?: string;
    [key: string]: unknown;
  };
}
interface ApmSession {
  getContext(): Promise<SessionContext>;
}
interface Apm {
  getFocusedSession(): ApmSession;
  refreshTab(tabId: string): Promise<void>;
}
interface Omnichannel {
    linkToConversation(
        entityLogicalName: string,
        recordId: string,
        conversationId: string
    ): Promise<any>;
}

declare const Microsoft: {
    Apm: Apm;
    Omnichannel: Omnichannel;
};

export class SearchService implements ISearchService{
    private context: ComponentFramework.Context<IInputs>;
    private conversationID:string;
    constructor(context: ComponentFramework.Context<IInputs>) {
        this.context = context;
        this.webApiService = new WebApiService(this.context);

    }
    private webApiService!: WebApiService;
    //obsolete or not in use
    public async searchContacts(request:SearchRequest): Promise<SearchReponse> {

        // step 1: build dataverse search query based on inputs
        
        const payload = {
            search: request.searchText,
            entities: JSON.stringify(["contact"]),
            searchMode: "any",
            top: 50
        };

        console.log(JSON.stringify(payload));

        // steps 2: call dataverse search api

        /// step 3: Extract IDs

        // step 4: Hydrate the list of IDs using FetchXML

        // return the list of contacts as ContactModel contract
        const contacts: CallerGridModel[] = [];
        const result:SearchReponse = {contacts:contacts};
        return Promise.resolve(result);
    }

    //grid1
    public async PhoneNumberContact(callerNumber: string): Promise<CallerGridModel[]>{
        const fetchXml = `
                <fetch top="50">
                    <entity name="contact">
                        <attribute name="mobilephone" />
                        <attribute name="abdn_customerrole" />
                        <attribute name="abdn_platformaccount" />
                        <attribute name="address1_line1" />
                        <attribute name="fullname" />
                        <attribute name="address1_postalcode" />
                        <attribute name="birthdate" />
                        <attribute name="abdn_contacttype" />
                        <attribute name="emailaddress1" />
                        <attribute name="parentcustomerid" />
                        <attribute name="telephone1" />
                        <attribute name="abdn_fcareference" />
                        <attribute name="contactid" />
                        <attribute name="abdn_ninumber" />
                        <attribute name="abdn_adviserjobcategory" />
                        <filter type="or">
                        <condition attribute="mobilephone" operator="eq" value="${callerNumber}" />
                        <condition attribute="telephone1" operator="eq" value="${callerNumber}" />
                        <condition attribute="telephone2" operator="eq" value="${callerNumber}" />
                        </filter>
                        <link-entity name="abdn_platformaccount" from="abdn_platformaccountid" to="abdn_platformaccount" link-type="outer" alias="PA">
                        <attribute name="abdn_newcolumn" />
                        <attribute name="abdn_platformaccountname" />
                        <attribute name="abdn_platformaccounttype" />
                        <attribute name="abdn_platformaccountproposition" />
                        <attribute name="abdn_platformaccountstatus" />
                        <link-entity name="abdn_wrapadvisorcode" from="abdn_wrapadvisorcodeid" to="abdn_wrapadvisercode" link-type="outer" alias="WAC">
                            <attribute name="abdn_accountfcanumberonplatform" />
                        </link-entity>
                        </link-entity>
                        <link-entity name="abdn_wrapadvisorcode" from="abdn_contactid" to="contactid" link-type="outer" alias="WA">
                        <link-entity name="account" from="accountid" to="abdn_accountid" alias="A" link-type="outer">
                            <attribute name="name" />
                            <attribute name="customertypecode" />
                            <attribute name="abdn_fcanumber" />
                            <attribute name="accountcategorycode" />
                            <attribute name="statuscode" />
                        </link-entity>
                        </link-entity>
                    </entity>
                    </fetch>
                `;
        let contacts= await this.webApiService.retrieveMultipleRecords("contact",fetchXml);
        //let contactRecord: ContactModel=new ContactModel(); 
        const contactsModel: CallerGridModel[] = [];

        contacts.entities.forEach((record: ComponentFramework.WebApi.Entity) => {
            let DOB="" ;
            if (record.birthdate) {
                DOB= this.DOBformat(record.birthdate)
            }
            //console.log("birthday: " , DOB);
            contactsModel.push({
                contactid: record.contactid ?? "",
                fullname: record.fullname ?? "",
                contactType:record["abdn_contacttype@OData.Community.Display.V1.FormattedValue"] ?? "",
                mobilephone: record.mobilephone ?? "",
                telephone1: record.telephone1 ?? "",
                emailaddress1: record.emailaddress1 ?? "",
                birthdate: DOB ?? "",
                abdn_ninumber:record.abdn_ninumber??"",
                address1_line1: record.address1_line1 ?? "",
                address1_postalcode: record.address1_postalcode ?? "",
                statuscode:record["statuscode@OData.Community.Display.V1.FormattedValue"] ?? "",
                abdn_adviserjobcategory:record["abdn_adviserjobcategory@OData.Community.Display.V1.FormattedValue"] ?? "",
                PA_abdn_platformaccountname:record["PA.abdn_platformaccountname"] ?? "",
                PA_abdn_newcolumn:record["PA.abdn_newcolumn"] ?? "", // Platform Account Number
                PA_abdn_platformaccounttype:record["PA.abdn_platformaccounttype@OData.Community.Display.V1.FormattedValue"] ?? "",
                WAC_abdn_wrapadvisercode:record["WAC.abdn_advisercodeonplatform"]??"",
                A_abdn_name: record["A.accountcategorycode@OData.Community.Display.V1.FormattedValue"] ?? "",
                A_abdn_statuscode: record["A.statuscode@OData.Community.Display.V1.FormattedValue"] ?? "",
                
            });
        });
        
        return contactsModel;

    }

    //grid2
    public async SearchPlatformAccounts(platformNumber: string): Promise<any>{
        const fetchXml =`
        <fetch top="1">
            <entity name="abdn_platformaccount">
                <attribute name="abdn_platformaccountid" />
                <attribute name="abdn_newcolumn" />
                <attribute name="abdn_platformaccountname" />
                <attribute name="abdn_platformaccounttype" />
                <attribute name="abdn_platformaccountproposition" />
                <attribute name="abdn_platformaccountstatus" />
                <filter type="and">
                <condition attribute="abdn_newcolumn" operator="eq" value="${platformNumber}" />
                </filter>
                    <link-entity name="abdn_wrapadvisorcode" from="abdn_wrapadvisorcodeid" to="abdn_wrapadvisercode" link-type="outer" alias="WAC">
                    <attribute name="abdn_newcolumn" />
                    <attribute name="abdn_adviseraccountonplatform" />
                    <attribute name="abdn_accountfcanumberonplatform" />
                    </link-entity>
            </entity>
        </fetch>` ;

        let platformAccounts = await this.webApiService.retrieveMultipleRecords("abdn_platformaccount",fetchXml);
        const platformAccountsModel: PlatformAccountModel[] = [];
        let platformAccountID="";
        let fcaNumber="";

        platformAccounts.entities.forEach((record: ComponentFramework.WebApi.Entity) => {
            platformAccountID=record.abdn_platformaccountid;
            fcaNumber= record.abdn_accountfcanumberonplatform;
            platformAccountsModel.push({
                abdn_platformaccountid:record.abdn_platformaccountid,
                abdn_newcolumn: record.abdn_newcolumn ?? "",
                abdn_platformaccountname: record.abdn_platformaccountname ?? "",
                abdn_platformaccountproposition: record["abdn_platformaccountproposition@OData.Community.Display.V1.FormattedValue"] ?? "",
                abdn_platformaccounttype: record["abdn_platformaccounttype@OData.Community.Display.V1.FormattedValue"] ?? "",
                abdn_platformaccountstatus: record["abdn_platformaccountstatus@OData.Community.Display.V1.FormattedValue"] ?? "",
                WAC_abdn_accountfcanumberonplatform: record["WAC.abdn_accountfcanumberonplatform"]??"",
                WAC_abdn_adviseraccountonplatform:record["WAC.abdn_adviseraccountonplatform"]??"",
                WAC_abdn_newcolumn: record["WAC.abdn_newcolumn"] ?? "",

            });
        });
        //let relatedContactsModel= this.PlatformAccount_contacts(platformAccountID,fcaNumber);
        //console.log(relatedContactsModel)
        //return [platformAccountsModel,relatedContactsModel];
        console.log("platformaccountsbasedon search:",platformAccounts);
        return platformAccountsModel;


    }
    //grid3
    public async PlatformAccount_contacts(platformAccountID: string , fcaNumber:string): Promise<any>{
        const fetchXml = `
                 <fetch top="50">
                    <entity name="contact">
                        <attribute name="mobilephone" />
                        <attribute name="abdn_customerrole" />
                        <attribute name="abdn_platformaccount" />
                        <attribute name="address1_line1" />
                        <attribute name="fullname" />
                        <attribute name="address1_postalcode" />
                        <attribute name="birthdate" />
                        <attribute name="abdn_contacttype" />
                        <attribute name="emailaddress1" />
                        <attribute name="telephone1" />
                        <attribute name="contactid" />
                        <attribute name="statuscode" />
                        <attribute name="abdn_ninumber" />
                        <attribute name="abdn_adviserjobcategory" />
                        <attribute name="parentcustomerid" />
                        <order attribute="abdn_contacttype" descending="false" />
                        <filter type="or">
                            <condition attribute="abdn_platformaccount" operator="eq" value="${platformAccountID}" uitype="abdn_platformaccount" />
                            <condition entityname="af" attribute="abdn_fcanumber" operator="eq" value="${fcaNumber}" />
                        </filter>
                        <link-entity name="account" from="accountid" to="parentcustomerid" link-type="outer" alias="af">
                            <attribute name="abdn_fcanumber" />
                            <attribute name="name" />
                        </link-entity>
                    </entity>
                    </fetch>
                `;

        let relatedContacts= await this.webApiService.retrieveMultipleRecords("contact",fetchXml);
        console.log(relatedContacts);

        const relatedContactsModel: RelatedContactsModel[] = [];

        relatedContacts.entities.forEach((record: ComponentFramework.WebApi.Entity) => {
            let DOB="" ;
            if (record.birthdate) {
                DOB= this.DOBformat(record.birthdate)
            }
            relatedContactsModel.push({
                contactid: record.contactid ?? "",
                fullname: record.fullname ?? "",
                contactType:record["abdn_contacttype@OData.Community.Display.V1.FormattedValue"] ?? "",
                mobilephone: record.mobilephone ?? "",
                telephone1: record.telephone1 ?? "",
                emailaddress1: record.emailaddress1 ?? "",
                birthdate: DOB ?? "",
                abdn_ninumber:record.abdn_ninumber??"",
                address1_line1: record.address1_line1 ?? "",
                address1_postalcode: record.address1_postalcode ?? "",
                statuscode:record["statuscode@OData.Community.Display.V1.FormattedValue"] ?? "",
                abdn_adviserjobcategory:record["abdn_adviserjobcategory@OData.Community.Display.V1.FormattedValue"] ?? "",                
            });
        });

        return relatedContactsModel;

    }

    //grid4 - on confirm

    public async createVerificationOutcome(
        conversationId: string,
        contact: any,
        platformAccount: string,
        customer: string
    ): Promise<void> {
        const verificationOutcomeRecord = {
            
            "abdn_Contact@odata.bind": `/contacts(${contact.contactid})`,
            "abdn_PlatformAccount@odata.bind":"",
            "abdn_Customer@odata.bind": "",
            "abdn_Conversation@odata.bind":`/msdyn_ocliveworkitems(${conversationId})`,
        };
        let data = {};
        //confirm logic against grid3 - confirm button
        if(platformAccount && customer){
            verificationOutcomeRecord["abdn_PlatformAccount@odata.bind"]= `/abdn_platformaccounts(${platformAccount})`;
            verificationOutcomeRecord["abdn_Customer@odata.bind"] = `/contacts(${customer})`
            data = {
                [`msdyn_customer_msdyn_ocliveworkitem_contact@odata.bind`]:`/contacts(${customer})`,
            };
        }
        //confirm logic against grid1 - confirm button
        else{
            data = {
                [`msdyn_customer_msdyn_ocliveworkitem_contact@odata.bind`]:`/contacts(${contact.contactid})`,
            };
        }
    

        await this.webApiService.createRecord("abdn_idv",verificationOutcomeRecord);
        
        this.webApiService.updateRecord("msdyn_ocliveworkitem",conversationId,data);

        PCFState.Customer = customer;
        PCFState.userConfirmed = true;

        PCFState.notifyOutputChanged?.();

        
        
    }
    //grid 4 display
    public async getVerificationOutcomes( conversationId: string): Promise<VerificationOutcome[]> {
        
        const fetchXml = `
        <fetch top="50">
            <entity name="abdn_idv">
                <attribute name="abdn_idvid" />
                <attribute name="abdn_name" />
                <attribute name="createdon" />
                <attribute name="statuscode" />
                <attribute name="statecode" />
                <attribute name="overriddencreatedon" />
                <attribute name="abdn_platformaccount" />
                <attribute name="owningbusinessunit" />
                <attribute name="ownerid" />
                <attribute name="modifiedon" />
                <attribute name="modifiedonbehalfby" />
                <attribute name="modifiedby" />
                <attribute name="abdn_customer" />
                <attribute name="createdonbehalfby" />
                <attribute name="createdby" />
                <attribute name="abdn_conversation" />
                <attribute name="abdn_contact" />
                <order attribute="abdn_name" descending="false" />
                <filter type="and">
                    <condition attribute="abdn_conversation" operator="eq" value="${conversationId}" />
                </filter>
    
            </entity>
        </fetch>`;

        const result = await this.webApiService.retrieveMultipleRecords("abdn_idv", fetchXml);

        console.log("verification outcomes:",result);
        const verificationOutcomesModel: VerificationOutcome[] = [];
        result.entities.forEach((record: ComponentFramework.WebApi.Entity) => {

        verificationOutcomesModel.push({
            abdn_idvid: record.abdn_idvid ?? "",
            contact: record["_abdn_contact_value@OData.Community.Display.V1.FormattedValue"] ??"",
            platformAccount: record["_abdn_platformaccount_value@OData.Community.Display.V1.FormattedValue"] ??"",
            customer: record["_abdn_customer_value@OData.Community.Display.V1.FormattedValue"] ??"" ,
            verificationStatus: record["statuscode@OData.Community.Display.V1.FormattedValue"] ?? "",
        });
        console.log(verificationOutcomesModel);
            /*
            const getFirstString = (keys: string[]): string => {
                for (const key of keys) {
                    const value = (record as Record<string, unknown>)[key];
                    if (typeof value === "string" && value.trim() !== "") {
                        return value;
                    }
                }
                return "";
            };

            const getFormattedByToken = (token: string): string => {
                const recordMap = record as Record<string, unknown>;
                const lowerToken = token.toLowerCase();

                for (const key of Object.keys(recordMap)) {
                    if (
                        key.toLowerCase().includes(lowerToken) &&
                        key.includes("@OData.Community.Display.V1.FormattedValue")
                    ) {
                        const value = recordMap[key];
                        if (typeof value === "string" && value.trim() !== "") {
                            return value;
                        }
                    }
                }

                return "";
            };

            const contactDisplay =
                getFirstString([
                    "ct.fullname",
                    "abdn_contactname",
                    "_abdn_contact_value@OData.Community.Display.V1.FormattedValue",
                    "abdn_contact@OData.Community.Display.V1.FormattedValue"
                ]) ||
                getFormattedByToken("abdn_contact") ||
                getFirstString([
                    "abdn_contact",
                    "_abdn_contact_value"
                ]);

            const platformAccountDisplay =
                getFirstString([
                    "pa.abdn_platformaccountname",
                    "abdn_platformaccountname",
                    "_abdn_platformaccount_value@OData.Community.Display.V1.FormattedValue",
                    "abdn_platformaccount@OData.Community.Display.V1.FormattedValue"
                ]) ||
                getFormattedByToken("abdn_platformaccount") ||
                getFirstString([
                    "abdn_platformaccount",
                    "_abdn_platformaccount_value"
                ]);

            const customerDisplay =
                getFirstString([
                    "cu.fullname",
                    "abdn_customername",
                    "_abdn_customer_value@OData.Community.Display.V1.FormattedValue",
                    "abdn_customer@OData.Community.Display.V1.FormattedValue"
                ]) ||
                getFormattedByToken("abdn_customer") ||
                getFirstString([
                    "abdn_customer",
                    "_abdn_customer_value"
                ]);
                

            verificationOutcomesModel.push({
                abdn_idvid: record.abdn_idvid ?? "",
                contact: String(contactDisplay),
                platformAccount: String(platformAccountDisplay),
                customer: String(customerDisplay),
                verificationStatus: record["statuscode@OData.Community.Display.V1.FormattedValue"] ?? "",
            });
            */


        });
        return verificationOutcomesModel;
    }

    public DOBformat(DOB:string):string{
        const date = new Date(DOB);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        let Birthdate = `${day}/${month}/${year}`;

        return Birthdate;
    }
}