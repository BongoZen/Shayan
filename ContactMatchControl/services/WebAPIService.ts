// web API service
import { IWebApiService } from "./IWebApiService";
import { IInputs, IOutputs } from "../generated/ManifestTypes";
export class WebApiService implements IWebApiService {
  private baseUrl: string;
  private context: ComponentFramework.Context<IInputs>;

  constructor(context: ComponentFramework.Context<IInputs>) {
    this.baseUrl = window.location.origin;
    console.log(`base URL:${this.baseUrl}`);
    this.context = context
  }

  async post<T>(relativeUrl: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${relativeUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "same-origin" // important for auth
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Search API error: ${error}`);
    }
    return response.json();
  }

  public async retrieveMultipleRecords(entityName: string,fetchXml:string) : Promise<any> {

    let result = await this.context.webAPI.retrieveMultipleRecords(entityName,`?fetchXml=${encodeURIComponent(fetchXml)}`);
    return result;

  }

  public async retrieveRecord(entityName: string,CurrentRecordID:string) : Promise<any> {

    let result = await this.context.webAPI.retrieveRecord(entityName,CurrentRecordID);
    return result;

  }

  public async updateRecord(entityName: string,CurrentRecordID:string, data: any) :Promise<void> {

    await this.context.webAPI.updateRecord(entityName,CurrentRecordID,data);
  }

  public async createRecord(entityname:string,data:any):Promise<ComponentFramework.LookupValue>{
    const result= await this.context.webAPI.createRecord(entityname,data);
    console.log(result.id);
    return result;
  }
  
}
