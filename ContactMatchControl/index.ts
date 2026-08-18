/// <reference types="powerapps-component-framework" />
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { CallerGridModel } from "./models/CallerGrid";
import { Main } from "./hooks/Main";
import { PCFState } from "./hooks/PCFState";
 
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
 
 
export class DataGrid implements ComponentFramework.StandardControl<
  IInputs,
  IOutputs
> {
  private root: Root;
  private notifyOutputChanged: () => void;
  private context: ComponentFramework.Context<IInputs>;
 
  private CurrentRecordID = "";
  private EntityName = "";
  private currentRecordDetails: ComponentFramework.WebApi.Entity;
  private isConfirmed = false;
  private currentSelectedContactId = "";
 
  private isLoading = false;
  private hasLoadedOnce = false;
  private main!: Main;
  

  public init(context: ComponentFramework.Context<IInputs>,notifyOutputChanged: () => void,state: ComponentFramework.Dictionary,container: HTMLDivElement,): void {
    this.context = context;
    this.notifyOutputChanged = notifyOutputChanged;
    this.root = createRoot(container);
    this.main = new Main(this.root);
    console.log("init() method");
    PCFState.notifyOutputChanged = notifyOutputChanged;
  }
 
  public async updateView(context: ComponentFramework.Context<IInputs>,): Promise<void> {
    this.context = context; 
    if (!this.hasLoadedOnce) {
      this.hasLoadedOnce = true;
       console.log("updatView() method");
      await this.main.loadInitialMatches(context);
      
    }
 
    this.root.render(this.main.renderComponent(context));
  }
 
 
  public getOutputs(): IOutputs {
    return {
      Customer: PCFState.Customer,
      UserConfirmed:PCFState.userConfirmed
    };
  }
 
  public destroy(): void {
    this.root.unmount();
  }
}