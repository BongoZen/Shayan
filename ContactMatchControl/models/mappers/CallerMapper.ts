import { CallerGridModel } from "../CallerGrid";
import { ContactModel } from "../ContactModel";
import { DataverseEntity } from "../DataverseEntity";

export class CallerMapper {

    private static asString(value: unknown): string {
        return typeof value === "string" ? value : "";
    }

    public static map(entity: DataverseEntity): CallerGridModel {

        return {
            fullname: this.asString(entity.fullname),
            contactType: this.asString(entity.contactType),
            mobilephone: this.asString(entity.mobilephone),
            telephone1: this.asString(entity.telephone1),
            emailaddress1: this.asString(entity.emailaddress1),
            birthdate: this.asString(entity.birthdate),
            abdn_ninumber: this.asString(entity.abdn_ninumber),
            address1_line1: this.asString(entity.address1_line1),
            address1_postalcode: this.asString(entity.address1_postalcode),
            abdn_adviserjobcategory: this.asString(entity.abdn_adviserjobcategory),
            statuscode: this.asString(entity.statuscode),
            contactid: this.asString(entity.contactid),

            PA_abdn_platformaccountname: this.asString(entity.PA_abdn_platformaccountname),
            PA_abdn_newcolumn: this.asString(entity.PA_abdn_newcolumn),
            PA_abdn_platformaccounttype: this.asString(entity.PA_abdn_platformaccounttype),
            WAC_abdn_wrapadvisercode: this.asString(entity.WAC_abdn_wrapadvisercode),
            A_abdn_name: this.asString(entity.A_abdn_name),
            A_abdn_statuscode: this.asString(entity.A_abdn_statuscode)
        };
    }
}