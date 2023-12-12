import { InjectOptions, RenderElement, IMixins } from './options'

declare const _default: {
    mixins?: IMixins;
    inject?: InjectOptions;
    name: string;
    props: {
        props: {
            type: ObjectConstructor;
            default(): {};
        };
        node: {
            type: ObjectConstructor;
            default(): {};
        };
        root: {
            type: ObjectConstructor;
            default(): {};
        };
        showCollapsable: {
            type: BooleanConstructor;
            default: boolean;
        };
        isLeftChildNode: {
            type: BooleanConstructor;
            default: boolean;
        };
        onlyLeft: {
            type: BooleanConstructor;
            default: boolean;
        };
        renderContent: FunctionConstructor;
        nodeBtnContent: FunctionConstructor;
        showNodeNum: BooleanConstructor;
        labelWidth: (StringConstructor | NumberConstructor)[];
        labelHeight: (StringConstructor | NumberConstructor)[];
        selectedKey: StringConstructor;
        nodeKey: StringConstructor;
    };
    components: {
        NodeContent: {
            props: {
                node: {
                    required: boolean;
                };
            };
            render(h: any): any;
        };
        NodeBtnContent: {
            props: {
                node: {
                    required: boolean;
                };
            };
            render(h: any): any;
        };
    };
    computed: {
        isLeaf(): any;
        leftChildNodes(): any;
        animateName(): any;
        animateDuration(): any;
        showNodeBtn(): boolean;
        showNodeLeftBtn(): boolean;
        computeLabelStyle(): (value: any) => {
            width: any;
            height: any;
        };
        computeLabelClass(): any[];
        computNodeStyle(): {
            display: string;
        };
        computLeftNodeStyle(): {
            display: string;
        };
        showLeftChildNode(): boolean;
    };
    watch: {
        'node.expanded'(val: any): void;
        'node.leftExpanded'(val: any): void;
    };
    data(): {
        expanded: boolean;
        tree: any;
    };
    created(): void;
    methods: {
        flexColumnWidth: any;
        getNodeKey(node: any): any;
        handleNodeClick(): void;
        handleBtnClick(isLeft: any): void;
        handleContextMenu(event: any): void;
    };
    render: RenderElement;
};
export default _default;
