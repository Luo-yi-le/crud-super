import { InjectOptions, RenderElement, IMixins } from './options'

declare const _default: {
    mixins?: IMixins;
    inject?: InjectOptions;
    name?: string;
    model: {
        event: string;
        porp: string;
    };
    props: {
        value: (StringConstructor | NumberConstructor)[];
    };
    data(): {
        keyname: string;
        keyword: string;
        list: any[];
        expandedKeys: any[];
    };
    methods: {
        onCurrentChange({ id, name }: {
            id: any;
            name: any;
        }, node: any): void;
        refresh(): void;
        filterNode(value: any, { name }: {
            name: any;
        }, node: any): boolean;
        checkNode(): void;
    };
    computed: {
        name(): any;
        treeList(): any;
    };
    watch: {
        keyword(val: any): void;
    };
    mounted(): void;
    emits: string[];
    render?: RenderElement
};
export default _default;
