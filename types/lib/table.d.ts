import { ITable, InjectOptions, RenderElement, IMixins } from './options'
declare const _default: {
    mixins?: IMixins;
    name?: string;
    inject?: InjectOptions;
    computed: {
        table(): ITable;
    };
    data(): {
        maxHeight: any;
        viewing: boolean;
    };
    methods: {
        clearSelection(): void;
        toggleRowSelection(row: object, selected?: boolean): void;
        toggleAllSelection(): void;
        setCurrentRow(row?: object): void;
        toggleRowExpansion(row: object, expanded?: boolean): void;
        clearFilter(): void;
        doLayout(): void;
        columnRender(): any;
        view(): void;
        opRender(): any;
        emptyRender(h: any): void;
        sort(prop: any, order: any): void;
        clearSort(): void;
        bindMethods(): void;
        selectionChange(selection: any): void;
        sortChange(value: any): void;
        calcHeight(): any;
        resize(): Promise<void>;
        renderEl(h: any): {
            columnEl: any;
            opEl: any;
        };
        onRowContextMenu(row: any, column: any, event: any, store: any): void;
    };
    mounted(): void;
    // render(createElement: typeof Vue.prototype.$createElement): VNode;
    render: RenderElement
};
export default _default;
