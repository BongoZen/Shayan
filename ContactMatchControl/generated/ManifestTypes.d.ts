/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    selectedContactId: ComponentFramework.PropertyTypes.StringProperty;
    UserConfirmed: ComponentFramework.PropertyTypes.TwoOptionsProperty;
}
export interface IOutputs {
    selectedContactId?: string;
    Customer?: string;
    UserConfirmed?: boolean;
}
