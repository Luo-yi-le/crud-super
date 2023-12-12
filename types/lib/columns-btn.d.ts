import { InjectOptions, RenderElement, IMixins, ITable } from './options'

declare const _default: {
    mixins?: IMixins;
    inject?: InjectOptions;
    name: string;
    data(): {
        columns: any[];
        value: any[];
    };
    mounted(): void;
    computed: {
        table(): ITable;
    };
    methods: {
        setColumns(): void;
        dataChange(data: any, direction: any, movedKeys: any): void;
    };
    render: RenderElement;
};
export default _default;
