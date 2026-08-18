    interface IGridColumn {

key: string;

label: string;

}

export class GRID_Columns {
    constructor(){}

    public getHeaderColumns(gridType:string): IGridColumn[] {
        let GRID_COLUMNS:IGridColumn[] = [];
        switch (gridType) {
            case "grid1":
                console.log("grid1"); 
                GRID_COLUMNS=[
                    { key: "fullname", label: "Full Name" },
                    { key: "abdn_contacttype",label: "Contact Type"},
                    { key: "mobilephone", label: "Mobile Phone" },
                    { key: "telephone1", label: "Phone" },
                    { key: "emailaddress1", label: "Email Address" },
                    { key: "birthdate", label: "DOB" },
                    { key:"abdn_ninumber", label:"Ni Number"},
                    { key: "address1_line1", label: "Address line 1" },
                    { key: "address1_postalcode", label: "Postcode" },
                    { key: "statuscode", label: "Contact Status"},
                    {key:"abdn_adviserjobcategory" , label:"Adviser Job Category"},
                    {key:"PA_abdn_newcolumn", label:"Platform Account Number"},
                    {key:"PA_abdn_platformaccountname",label:"Platform Account Name"},
                    {key:"PA_abdn_platformaccounttype",label:"Platform Account Type"},
                    {key:"WAC_abdn_wrapadvisercode",label:"Adviser Name"},
                    {key:"A_abdn_name",label:"Firm Name"},
                    {key:"A_abdn_statuscode",label:"Firm status"}
                ];
                break;
            case "grid2":
                console.log("grid2");
                GRID_COLUMNS=[
                    { key: "abdn_newcolumn",label: "Platform Account Number"},
                    { key: "abdn_platformaccountname", label: "Platform Account Name" },
                    { key: "abdn_platformaccounttype", label: "Platform Account Type" },
                    { key: "abdn_platformaccountproposition", label: "Platform Account Proposition" },
                    { key: "abdn_platformaccountstatus", label: "Platform Account Status" },
                    { key: "WAC_abdn_newcolumn", label: "Adviser Firm" },
                    { key:"WAC_abdn_accountfcanumberonplatform", label:"FCA Number"},
                    { key:"WAC_abdn_adviseraccountonplatform", label:"Adviser Code"}
                ];
            break;
            case "grid3":
                GRID_COLUMNS=[
                    { key: "fullname", label: "Full Name" },
                    { key: "abdn_contacttype",label: "Contact Type"},
                    { key: "mobilephone", label: "Mobile Phone" },
                    { key: "telephone1", label: "Phone" },
                    { key: "emailaddress1", label: "Email Address" },
                    { key: "birthdate", label: "DOB" },
                    { key:"abdn_ninumber", label:"Ni Number"},
                    { key: "address1_line1", label: "Address line 1" },
                    { key: "address1_postalcode", label: "Postcode" },
                    { key: "statuscode", label: "Contact Status"},
                    {key:"abdn_adviserjobcategory" , label:"Adviser Job Category"},
                ];
                break;
            default:
            console.log("Unknown Status");

            break;
        }
        
        return GRID_COLUMNS;
    }
}