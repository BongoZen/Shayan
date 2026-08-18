// models/ContactModel.ts
export interface CallerGridModel{
fullname:string;
contactType:string;
mobilephone?:string;
telephone1?:string;
emailaddress1?:string;
birthdate?:string; // DOB
abdn_ninumber?:string; //Ni Number
address1_line1?:string;
address1_postalcode?:string;
abdn_adviserjobcategory?:string;
statuscode?:string;
contactid:string;
PA_abdn_platformaccountname?:string; 
PA_abdn_newcolumn?:string; // Platform Account Number
PA_abdn_platformaccounttype?:string;
WAC_abdn_wrapadvisercode?:string;
A_abdn_name?:string;
A_abdn_statuscode?:string;
}