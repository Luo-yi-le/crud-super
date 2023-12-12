import { RenderElement, IMixins } from './options'

declare const _default: {
    mixins?: IMixins;
    name?: string;
    provide(): {
        okrEventBus: any;
    };
    props: {
        data: {
            required: boolean;
        };
        leftData: {
            type: ArrayConstructor;
        };
        direction: {
            type: StringConstructor;
            default: string;
        };
        showCollapsable: {
            type: BooleanConstructor;
            default: boolean;
        };
        onlyBothTree: {
            type: BooleanConstructor;
            default: boolean;
        };
        onlyLeft: {
            type: BooleanConstructor;
            default: boolean;
        };
        orkstyle: {
            type: BooleanConstructor;
            default: boolean;
        };
        renderContent: FunctionConstructor;
        nodeBtnContent: FunctionConstructor;
        showNodeNum: BooleanConstructor;
        labelWidth: (StringConstructor | NumberConstructor)[];
        labelHeight: (StringConstructor | NumberConstructor)[];
        labelClassName: (FunctionConstructor | StringConstructor)[];
        currentLableClassName: (FunctionConstructor | StringConstructor)[];
        selectedKey: StringConstructor;
        defaultExpandAll: {
            type: BooleanConstructor;
            default: boolean;
        };
        currentNodeKey: (StringConstructor | NumberConstructor)[];
        nodeKey: StringConstructor;
        defaultExpandedKeys: {
            type: ArrayConstructor;
        };
        filterNodeMethod: FunctionConstructor;
        props: {
            default(): {
                leftChildren: string;
                children: string;
                label: string;
                disabled: string;
            };
        };
        animate: {
            type: BooleanConstructor;
            default: boolean;
        };
        animateName: {
            type: StringConstructor;
            default: string;
        };
        animateDuration: {
            type: NumberConstructor;
            default: number;
        };
    };
    computed: {
        ondeClass(): {
            findNode: any;
        };
    };
    data(): {
        okrEventBus: any;
        store: any;
        root: any;
    };
    created(): void;
    watch: {
        data(newVal: any): void;
        leftData(newVal: any): void;
        defaultExpandedKeys(newVal: any): void;
    };
    methods: {
        filter(value: any): void;
        getNodeKey(node: any): any;
        setCurrentNode(node: any): void;
        getNode(data: any): any;
        setCurrentKey(key: any): void;
        remove(data: any): void;
        getCurrentNode(): any;
        getCurrentKey(): any;
        append(data: any, parentNode: any): void;
        insertBefore(data: any, refNode: any): void;
        insertAfter(data: any, refNode: any): void;
        updateKeyChildren(key: any, data: any): void;
    };
    render: RenderElement;
};
export default _default;
