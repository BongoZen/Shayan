import { PlatformAccountModel } from "../models/PlatformAccountModel";
import { RelatedContactsModel } from "../models/RelatedContactsModel";

export class MockSearchService {

    private readonly callerEntities: ComponentFramework.WebApi.Entity[] = [
        {
            contactid: "c001",
            fullname: "Jane Doe",
            contactType: "Account Owner",
            mobilephone: "07111111111",
            emailaddress1: "jane.doe@example.com",
            birthdate: "30/03/1991",
            address1_line1: "10 King Street",
            address1_postalcode: "EC1A 1AA",
            paNumber: "PA2001",
            paName: "Core Portfolio",
            paType: "Investment",
            accountName: "JD Holdings",
            abdn_ninumber:"12220000",
            abdn_adviserjobcategory:"Adviser",
            PA_abdn_platformaccountname:"Accoun Name 1",
            PA_abdn_newcolumn:"PL111", // Platform Account Number
            PA_abdn_platformaccounttype:"account type",
            WAC_abdn_wrapadvisercode:"6811",
            A_abdn_name:"acc",
            A_abdn_statuscode: "active",
                
        },
        {
            contactid: "c002",
            fullname: "Mark Taylor",
            contactType: "Trustee",
            telephone1: "02070000001",
            emailaddress1: "mark.taylor@example.com",
            address1_line1: "22 Oxford Road",
            address1_postalcode: "W1D 1BS",
            abdn_adviserjobcategory:"Business Writer"
        },
        {
            contactid: "c003",
            fullname: "Sophie Williams",
            contactType: "Access",
            mobilephone: "07222222222",
            birthdate: "",
            paNumber: "PA2002",
            paName: "Equity Growth",
            paType: "Equity"
        },
        {
            contactid: "c004",
            fullname: "Daniel Green",
            contactType: "Registered Contact",
            mobilephone: "07333333333",
            telephone2: "02070000002",
            emailaddress1: "daniel.green@example.com",
            address1_line1: "5 High Street",
            address1_postalcode: "SW1A 2BB"
        },
        {
            contactid: "c005",
            fullname: "Emma Brown",
            contactType: "Power of Attorney",
            mobilephone: "07444444444",
            birthdate: "",
            paNumber: "PA2003",
            paName: "Balanced Fund",
            paType: "Balanced",
            accountName: "EB Financial"
        },
        {
            contactid: "c006",
            fullname: "Oliver Scott",
            contactType: "Letter of Authority",
            telephone1: "01610000001",
            emailaddress1: "oliver.scott@example.com",
            address1_line1: "18 Market Street",
            address1_postalcode: "M1 1AE"
        },
        {
            contactid: "c007",
            fullname: "Amelia Clark",
            contactType: "Legal Personal Representative / Executor",
            mobilephone: "07555555555",
            emailaddress1: "amelia.clark@example.com",
            paNumber: "PA2004",
            paName: "Income Plan",
            paType: "Income",
            accountName: "AC Estates"
        },
        {
            contactid: "c008",
            fullname: "Jack Wilson",
            contactType: "Adviser",
            mobilephone: "07666666666",
            telephone1: "01130000001",
            birthdate: "1995-08-09",
            address1_line1: "30 Park Lane",
            address1_postalcode: "LS1 2AB"
        },
        {
            contactid: "c009",
            fullname: "Isabella Moore",
            contactType: "DFM",
            emailaddress1: "isabella.moore@example.com",
            paNumber: "PA2005",
            paName: "Multi-Asset Strategy",
            paType: "Multi-Asset"
        },
        {
            contactid: "c010",
            fullname: "Liam Harris",
            contactType: "Account Owner",
            mobilephone: "07777777777",
            telephone2: "02070000003",
            emailaddress1: "liam.harris@example.com",
            birthdate: "1987-03-17",
            address1_line1: "99 Baker Street",
            address1_postalcode: "NW1 5RT",
            accountName: "LH Investments"
        }
    ];

    private readonly platformAccountEntities: ComponentFramework.WebApi.Entity[] = [
        {
            accountid: "acc001",
            accountnumber: "PA12345678",
            accountname: "Smith & Co Wrap",
            accounttype: "Wrap",
            proposition: "Discretionary",
            status: "Active",
            adviserfirm: "Smith & Co Advisers",
            fcanumber: "123456",
            agencycode: "PHX98765"
        }
    ];

    private readonly platformAccountModels: PlatformAccountModel[] = [
        {
            abdn_platformaccountid:"",
            abdn_newcolumn: "PA12345678",
            abdn_platformaccountname: "Smith & Co Wrap",
            abdn_platformaccounttype: "Wrap",
            abdn_platformaccountproposition: "Discretionary",
            abdn_platformaccountstatus: "Active",
            WAC_abdn_adviseraccountonplatform: "Smith & Co Advisers",
            WAC_abdn_newcolumn: "123456",
            WAC_abdn_accountfcanumberonplatform: "PHX98765"
        }
    ];

    private readonly contactEntities: ComponentFramework.WebApi.Entity[] = [
        {
            contactid: "c001",
            fullname: "Jane Doe",
            contactType: "Account Owner",
            mobilephone: "07111111111",
            telephone1: "02070000001",
            emailaddress1: "jane.doe@example.com",
            birthdate: "1989-02-14",
            address1_postalcode: "EC1A 1AA",
            contactstatus: "Active"
        },
        {
            contactid: "c002",
            fullname: "Mark Taylor",
            contactType: "Trustee",
            mobilephone: "07222222222",
            telephone1: "02070000002",
            emailaddress1: "mark.taylor@example.com",
            birthdate: "1975-10-25",
            address1_postalcode: "W1D 1BS",
            contactstatus: "Active"
        },
        {
            contactid: "c003",
            fullname: "Sophie Williams",
            contactType: "Access",
            mobilephone: "07333333333",
            telephone1: "02070000003",
            emailaddress1: "sophie.williams@example.com",
            birthdate: "1992-06-30",
            address1_postalcode: "SW1A 2BB",
            contactstatus: "Active"
        }
    ];

    private readonly relatedContactEntities: RelatedContactsModel[]=[
        {
            contactid: "c002",
            fullname: "Mark Taylor",
            contactType: "Trustee",
            mobilephone: "07222222222",
            telephone1: "02070000002",
            emailaddress1: "mark.taylor@example.com",
            birthdate: "1975-10-25",
            address1_postalcode: "W1D 1BS",
            statuscode: "Active",
            abdn_ninumber: "1234",
            abdn_adviserjobcategory: "Test2"
        },
        {
            contactid: "c003",
            fullname: "Sophie Williams",
            contactType: "Access",
            mobilephone: "07333333333",
            telephone1: "02070000003",
            emailaddress1: "sophie.williams@example.com",
            birthdate: "1992-06-30",
            address1_postalcode: "SW1A 2BB",
            statuscode: "Active",
            abdn_ninumber: "54321",
            abdn_adviserjobcategory: "Test3"
        }

    ];

    private readonly verificationEntities: ComponentFramework.WebApi.Entity[] = [
        {
            verificationid: "v001",
            accountnumber: "PA12345678",
            customer: "John Doe",
            outcome: "Verified"
        },
        {
            verificationid: "v002",
            accountnumber: "PA87654321",
            customer: "Jane Doe",
            outcome: "Pending"
        }
    ];

    public async getCaller(): Promise<{
        entities: ComponentFramework.WebApi.Entity[];
    }> {

        await Promise.resolve();

        return {
            entities: this.callerEntities
        };
    }

    public async getPlatformAccounts(): Promise<{
        entities: ComponentFramework.WebApi.Entity[];
    }> {

        await Promise.resolve();

        return {
            entities: this.platformAccountEntities
        };
    }

    public async getPlatformAccountModels(): Promise<{
        entities: PlatformAccountModel[];
    }> {

        await Promise.resolve();

        return {
            entities: this.platformAccountModels
        };
    }

    public async getRelatedContactModels(): Promise<{
        entities: RelatedContactsModel[];
    }>{
        await Promise.resolve();
        return{
            entities: this.relatedContactEntities
        };
    }

    public async getContacts(): Promise<{
        entities: ComponentFramework.WebApi.Entity[];
    }> {

        await Promise.resolve();

        return {
            entities: this.contactEntities
        };
    }

    public async getVerificationOutcomes(): Promise<{
        entities: ComponentFramework.WebApi.Entity[];
    }> {

        await Promise.resolve();

        return {
            entities: this.verificationEntities
        };
    }
}