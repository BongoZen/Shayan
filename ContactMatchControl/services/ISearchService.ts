// services/ISearchService.ts

import  {SearchRequest} from "../models/SearchRequest";
import  {SearchReponse} from "../models/SearchResponse";
import  {CallerGridModel} from "../models/CallerGrid";

export interface ISearchService{
    // searchContacts(request:SearchRequest):Promise<SearchReponse>;
      PhoneNumberContact(callerNumber: string): Promise<CallerGridModel[]>;
      SearchPlatformAccounts(platformNumber: string): Promise<any>;
      PlatformAccount_contacts(platformAccountID: string,fcaNumber:string): Promise<any>;
}