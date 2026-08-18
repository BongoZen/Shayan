export interface GridColumn {
    key: string;
    label: string;
    onRender?:(item: Record<string,unknown>)=>React.ReactNode
}
