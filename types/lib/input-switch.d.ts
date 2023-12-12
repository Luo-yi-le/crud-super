import { InjectOptions, RenderElement, IMixins, Props } from './options'

declare const _default: {
    mixins?: IMixins;
    inject?: InjectOptions;
    name?: string;
    props?: Props;
    data(): {
        switchValue: boolean;
    };
    methods: {
        change(value: any): void;
    };
    render: RenderElement;
};
export default _default;
