import { InjectOptions, RenderElement, IMixins } from './options'
declare const _default: {
    inject?: InjectOptions;
    mixins?: IMixins;
    functional: boolean;
    name: string;
    props: {
        direction: {
            type: StringConstructor;
            default: string;
            validator(val: any): boolean;
        };
        contentPosition: {
            type: StringConstructor;
            default: string;
            validator(val: any): boolean;
        };
        lineType: {
            type: StringConstructor;
            default: string;
            validator(val: any): boolean;
        };
    };
    render:RenderElement;
};
export default _default;
