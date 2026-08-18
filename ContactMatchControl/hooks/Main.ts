/// <reference types="powerapps-component-framework" />
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { IInputs, IOutputs } from "../generated/ManifestTypes";

import { MockSearchService } from "../services/MockService";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { CallerGridModel } from "../models/CallerGrid";
import { SearchService } from "../services/SearchService";
import { WebApiService } from "../services/WebAPIService";
import { GridController } from "../components/GridController";

import { GRID_Columns } from "./GRID_Columns";

interface SessionContext {
  parameters: {
    customerName: string;
    LiveWorkItemId?: string;
    [key: string]: unknown;
  };
}

// Fix: Declare Microsoft.Apm so TS doesn't error
interface ApmSession {
  getContext(): Promise<SessionContext>;
}
interface Apm {
  getFocusedSession(): ApmSession;
}
declare const Microsoft: {
  Apm: Apm;
};
initializeIcons();
interface ContextInfoMode extends ComponentFramework.Mode {
  contextInfo: {
    entityId: string;
    entityTypeName: string;
  };
}

interface SearchApiRecord {
  "@search.entityname": string;
  "@search.objectid": string;
}

interface SearchApiResponse {
  value: SearchApiRecord[];
}

// Same 20 columns as the original headers array, in the same order. __dob is a
// computed field added in withComputedFields() below, not a raw record property.


export class Main {
  private root: Root;
  private notifyOutputChanged: () => void;
  private context: ComponentFramework.Context<IInputs>;
  private callerNumber: string;
  private CurrentRecordID = "";
  private isConfirmed = false;
  private currentSelectedContactId = "";

  private records: ComponentFramework.WebApi.Entity[] = [];
  private isLoading = false;
  private hasLoadedOnce = false;
  private webApiService!: WebApiService;
  private searchService!: SearchService;
  private conversationId = "";
  constructor(root: Root) {
    console.log("Main constructor called");
    this.root = root;
    this.callerNumber = "";
  }

  // Data changes can arrive from async work triggered by the React component's callbacks
  // (search, confirm) as well as from updateView itself, so those handlers call this
  // directly to re-render after they update this.records / this.isLoading / this.isConfirmed.

  public async renderComponent(context: ComponentFramework.Context<IInputs>): Promise<React.ReactElement> {

    return React.createElement(GridController, {

      context,
      callerNumber: this.callerNumber,
      conversationId: this.conversationId,

    })
  }

  // Identical logic to the original updateView's phone-number lookup - same fetchXml,
  // same filter conditions, same joins. 
  public async loadInitialMatches(context: ComponentFramework.Context<IInputs>): Promise<void> {

    console.log("loadInitalMatches() method");
    this.searchService = new SearchService(context);
    // Local PCF Test Harness
    if (typeof Microsoft === "undefined" || !Microsoft.Apm) {
      console.log("Running in Mock Mode");

      this.isLoading = true;

      this.callerNumber = "+441313729338"; // Hardcoded for testing

      this.isLoading = false;
      this.renderComponent(context);

      return;
    }
    console.log("this is where the dataverse logic will trigger");
    // -----------------------------
    // Dynamics 365 / CSW starts here
    // -----------------------------  

    const session = Microsoft.Apm.getFocusedSession();
    const ctx: SessionContext = await session.getContext();
    //this.callerNumber = String(ctx.parameters.CallerNumber);

    this.callerNumber = "+441313729338"; // Hardcoded for testing
    this.conversationId = String(ctx.parameters.LiveWorkItemId);
    this.isLoading = true;
    this.renderComponent(context);
    this.isLoading = false;

  }




  // Called from the search TextField's Enter handler in the React component - same
  // trigger condition (isConfirmed guard, Enter key) as the original keydown listener.
  /*  public async handleSearch(searchText: string): Promise<void> {
     try {
       this.isLoading = true;
       this.renderComponent(this.context);
  
       let result = { entities: [] as ComponentFramework.WebApi.Entity[] };
       if (searchText) {
         //const mockService = new MockSearchService();
         result = await mockService.searchContacts(searchText);
       }
  
       this.records = result.entities;
       this.isLoading = false;
       this.renderComponent();
     } catch (error) {
       this.isLoading = false;
       this.renderComponent();
       throw new Error(`search error: ${String(error)}`);
     }
   } */

  // Called from the Confirm button in the React component with whichever contact id
  // the grid currently has selected. Same updateRecord call, same schema-name branching,
  // same lockdown afterward, as the original confirmButton click handler.
  /* public async handleConfirm(contactId: string): Promise<void> {
     if (!contactId) {
       return;
     }
     try {
       const entityName = (this.context.mode as ContextInfoMode).contextInfo
         .entityTypeName;
       const contactSchemaName =
         entityName === "msdyn_ocliveworkitem"
           ? "msdyn_customer_msdyn_ocliveworkitem_contact"
           : "abdn_contact";
  
       const data = {
         [`${contactSchemaName}@odata.bind`]: `/contacts(${contactId})`,
         abdn_customeruserconfirmed: true,
       };
  
       await this.context.webAPI.updateRecord(
         "msdyn_ocliveworkitem",
         this.CurrentRecordID,
         data,
       );
  
       this.isConfirmed = true;
       this.currentSelectedContactId = contactId;
       this.notifyOutputChanged();
       this.renderComponent();
     } catch (error) {
       throw new Error(`Update failed: ${String(error)}`);
     }
   }*/

}