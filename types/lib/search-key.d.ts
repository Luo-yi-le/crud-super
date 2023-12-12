import {  InjectOptions, RenderElement, IMixins } from './options'

declare const _default: {
    mixins?: IMixins;
    name?: string;
    inject?: InjectOptions;
    methods: {
        onKeyup({ keyCode }: {
            keyCode: any;
        }): void;
        onChange(): void;
        search(): void;
    };
    render: RenderElement;
};
export default _default;
