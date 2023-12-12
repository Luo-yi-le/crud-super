import { InjectOptions, RenderElement, IMixins } from './options'

declare const _default: {
    mixins?: IMixins;
    inject?: InjectOptions;
    name: string;
    data(): {
        visible: boolean;
        index: string;
        style: {
            left: number;
            top: number;
        };
        list: any[];
        $store: any;
    };
    methods: {
        open(event: any, options: any, $store: any): {
            close: any;
        };
        close(): void;
        clickRow(e: any): any;
        hiddenChildren(): void;
        stopDefault(e: any): void;
    };
    mounted(): void;
    render: RenderElement;
};
export default _default;
