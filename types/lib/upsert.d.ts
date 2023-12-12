import { IUpsert, InjectOptions, RenderElement, IMixins } from './options';
import {ComponentOptions} from 'vue'
declare const _default: {
    mixins?: IMixins;
    inject?: InjectOptions;
    components: {
        Flex1: any;
    };
    data(): {
        visible: boolean;
        loading: boolean;
        saving: boolean;
        isEdit: boolean;
        viewing: boolean;
        items: any[];
        op: {};
        hdr: {};
        form: {};
        props: {};
        sync: boolean;
    };
    methods: {
        open(callback: any): Promise<void>;
        show(...args: any[]): void;
        view(d: any): void;
        close(): void;
        clear(): void;
        reset(): void;
        emit(name: any, ...args: any[]): void;
        edit(data: any): void;
        add(): void;
        append(data: any): void;
        save(): Promise<unknown>;
    };
    render: RenderElement;
};
export default _default;
