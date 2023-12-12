import Vue, { ComponentOptions, VNode } from "vue";
import { CreateElement, RenderContext } from 'vue'
type DefaultProps = Record<string, any>;
export type Props = DefaultProps | any
export type InjectKey = string | symbol;

export type InjectOptions = {
    [key: string]: InjectKey | { from?: InjectKey, default?: any }
} | string[];


export type RenderHack = (createElement: CreateElement, hack: RenderContext<DefaultProps | Props>) => VNode
export type Render = (this: undefined, createElement: CreateElement, context: RenderContext<DefaultProps | Props>) => VNode | VNode[];
export type RenderElement = Render | RenderHack | any;


export type IMixins = (ComponentOptions<Vue> | typeof Vue)[]
export interface ITable {
    menu: {
        visible: boolean;
        buttons: string[];
    };
    refresh: boolean;
    visible: boolean;
    loading: boolean;
    data: any[];
    columns: any[];
    selection: any[];
    props: {
        border: boolean;
        stripe: boolean;
        size: string;
        'default-expand-all': boolean;
        'element-loading-text': string;
        'element-loading-background': string;
        'element-loading-spinner': string;
    };
    on: {};
    op: {
        view: boolean;
        props: {
            width: number;
            align: string;
            fixed: string;
            label: string;
        };
        visible: boolean;
        layout: string[];
    };
    scopedSlots: {};
}

export interface IUpsert {
    form: {};
    items: any[];
    props: {
        drag: boolean;
        width: string;
        size: string;
        'label-width': string;
        'append-to-body': boolean;
        'close-on-click-modal': boolean;
        'destroy-on-close': boolean;
    };
    hdr: {
        layout: string[];
    };
    op: {
        confirmButtonText: string;
        cancelButtonText: string;
        visible: boolean;
        layout: string[];
    };
}

export type DateSetKey = 'service' | 'conf' | 'tips' | 'dict' | 'table' | 'search' | 'upsert' | 'pagination' | 'params' | 'layout';

export interface Context {
    (data: any): any;
    id: any;
    conf(d: any): any;
    service(d: any): any;
    dict(d?: {}): any;
    permission(x: any): any;
    set(n: any, x: any): any;
    on(name: any, cb: any): any;
    once(name: any, cb: any): any;
    done(cb: any): Promise<void>;
}

export interface App {
    refs(k: any): any;
    component(): any;
    getData(p: DateSetKey): any;
    setData(p: DateSetKey, d: any): void;
    setForm(k: any, v: any): void;
    setAdvForm(k: any, v: any): void;
    getForm(k: any): any;
    getAdvForm(k: any): any;
    hiddenItem(k: any, v?: boolean): void;
    hiddenColumn(k: any, v?: boolean): void;
    hiddenAdvItem(k: any, v?: boolean): void;
    getItemRef(prop: any): any;
    getAdvItemRef(prop: any): any;
    changeSort(prop: any, order: any): void;
    clearSort(): void;
    delete(...d: any[]): void;
    info(d: any): any;
    add(d: any): void;
    append(d: any): void;
    view(d: any): void;
    edit(d: any): void;
    rowView(d: any): void;
    close(): void;
    reset(): void;
    submit(): any;
    tableView(): any;
    renderList(d: any): void;
    setPagination(d: any): void;
    refresh(d: any): any;
    toggleExpandAll(d: any): void;
    doLayout(key: any): void;
    paramsReplace(p: any): any;
}


export type DictLabel = 'add' | 'delete' | 'update' | 'refresh' | 'advSearch' | 'view' | 'isExpandAll';


export interface IBootstrap {
    ctx?: Context;
    app?: App
}