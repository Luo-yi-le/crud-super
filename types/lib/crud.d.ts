import { RenderElement, ITable, IUpsert, DictLabel } from './options'
export default function ({ __crud, __components, __permission }: {
    __crud: any;
    __components: any;
    __permission: any;
}): {
    name: string;
    componentName: string;
    props: {
        name: StringConstructor;
        contextMenu: {
            type: (BooleanConstructor | ArrayConstructor)[];
            default: any;
        };
    };
    provide(): {
        crud: any;
    };
    data(): {
        id: any;
        service: any;
        viewing: boolean;
        permissionRole: any;
        conf: {
            UPSERT_REFRESH: boolean;
            DELETE_REFRESH: boolean;
        };
        permission: {};
        fn: {
            open: any;
            close: any;
            submit: any;
            refresh: any;
            delete: any;
            info: any;
            permission: any;
            advSearch: any;
            advReset: any;
            advOpen: any;
            advClose: any;
            resize: any;
            done: any;
            view: any;
        };
        event: {};
        dict: {
            api: {
                list: string;
                add: string;
                update: string;
                delete: string;
                info: string;
                page: string;
            };
            pagination: {
                page: string;
                size: string;
            };
            search: {
                keyWord: string;
                query: string;
            };
            sort: {
                order: string;
                prop: string;
            };
            label: {
                add: string;
                delete: string;
                update: string;
                refresh: string;
                advSearch: string;
                view: string;
                isExpandAll: string;
            };
        };
        tips: {
            add: {
                success: string;
                error: string;
            };
            update: {
                success: string;
                error: string;
            };
            delete: {
                confirm: string;
                success: string;
                error: string;
            };
        };
        table: ITable;
        search: {
            query: {
                list: any[];
                value: any;
                multiple: boolean;
                callback: any;
            };
            key: {
                placeholder: string;
                selected: string;
                value: string;
                list: any[];
                props: {};
            };
            adv: {
                title: string;
                visible: boolean;
                type: string;
                items: any[];
                form: {};
                props: {
                    size: string;
                    'label-width': string;
                };
                op: {
                    visible: boolean;
                    confirmButtonText: string;
                    resetButtonText: string;
                    'label-width': string;
                };
            };
        };
        upsert: IUpsert;
        pagination: {
            props: {
                background: boolean;
                small: boolean;
                layout: string;
                'page-sizes': number[];
            };
            pageSize: number;
            pageNum: number;
            total: number;
        };
        layout: string[][];
        refs: {};
        params: {};
        temp: {
            refreshRd: any;
            sortLock: boolean;
        };
        process: {
            status: boolean;
        };
    };
    components: any;
    beforeCreate(): void;
    created(): void;
    mounted(): void;
    methods: {
        getPermission(key: any): any;
        getLabel(key: DictLabel): any;
        tableView(): void;
        rowView(e: any): void;
        rowView(e: any): void;
        rowAdd(e: any): void;
        rowEdit(e: any): void;
        rowAppend(e: any): void;
        rowClose(): void;
        rowDelete(...selection: any[]): void;
        deleteMulti(): void;
        openAdvSearch(): void;
        closeAdvSearch(): void;
        changeSort(prop: any, order: any): void;
        sortChange({ prop, order }: {
            prop: any;
            order: any;
        }): void;
        clearSort(): void;
        paramsReplace(params: any): any;
        toggleExpandAll(d: any): void;
        refresh(newParams: any): any;
        done(): void;
    };
    render: RenderElement;
};
