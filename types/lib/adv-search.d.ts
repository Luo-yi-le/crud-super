import { InjectOptions, RenderElement, IMixins } from './options'

declare const _default: {
    mixins?: IMixins;
    inject?: InjectOptions;
    data(): {
        items: any[];
        props: {};
        visible: boolean;
    };
    mounted(): void;
    methods: {
        search(): void;
        open(): void;
        close(): void;
        reset(): void;
    };
    render?:RenderElement;
};
export default _default;
