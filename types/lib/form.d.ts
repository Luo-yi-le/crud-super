import { InjectOptions, RenderElement, IMixins } from './options'
declare const _default: {
    inject?: InjectOptions;
    mixins?: IMixins;
    name: string;
    components: {
        Flex1: any;
    };
    data(): {
        items: any[];
        hdr: {
            layout: string[];
        };
        op: {
            visible: boolean;
            confirmButtonText: string;
            cancelButtonText: string;
            layout: string[];
        };
        props: {
            drag: boolean;
            size: string;
            'append-to-body': boolean;
            'close-on-click-modal': boolean;
            'destroy-on-close': boolean;
        };
        form: {};
        on: {
            load: any;
            submit: any;
            close: any;
        };
        fn: {};
        saving: boolean;
        viewing: boolean;
        loading: boolean;
        visible: boolean;
        'v-loading': {
            'element-loading-text': string;
            'element-loading-spinner': string;
            'element-loading-background': string;
        };
        aid: {
            forceUpdate: any;
        };
    };
    computed: {
        crud(): any;
    };
    watch: {
        form(val: any): void;
    };
    methods: {
        open(options: any): any;
        done(): void;
        reset(): void;
        close(): void;
        showLoading(text: any): void;
        hideLoading(): void;
        getRef(): any;
        getData(p: any): any;
        setData(p: any, d: any): void;
        getForm(prop: any): any;
        setForm(prop: any, value: any): void;
        hiddenItem(prop: any, flag?: boolean): void;
        cb(): any;
        save(): void;
    };
    render: RenderElement;
};
export default _default;
