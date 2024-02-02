import { cloneDeep } from 'lodash';
import flat from 'array.prototype.flat';
import vue from './vue';
import makeFormat from './make'

import { __vue, __plugins } from '@/options';
export function debounce(fn, delay) {
    let timer = null;

    return function () {
        let args = arguments;
        let context = this;

        if (timer) {
            clearTimeout(timer);

            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
}
export const make = {
    ...makeFormat
}
export function isArray(value) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === '[object Array]';
    }
}

export function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

export function isNumber(value) {
    return !isNaN(Number(value));
}

export function isFunction(value) {
    return typeof value === 'function';
}

export function isString(value) {
    return typeof value === 'string';
}

export function isNull(value) {
    return !value && value !== 0;
}

export function isBoolean(value) {
    return typeof value === 'boolean';
}

export function isEmpty(value) {
    if (isArray(value)) {
        return value.length === 0;
    }

    if (isObject(value)) {
        return Object.keys(value).length === 0;
    }

    return value === '' || value === undefined || value === null;
}

export function clone(obj) {
    return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

export function certainProperty(obj, keys) {
    return keys.reduce((result, key) => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }

        return result;
    }, {});
}

export function getParent(name) {
    let parent = this.$parent;

    while (parent) {
        if (parent.$options.componentName !== name) {
            parent = parent.$parent;
        } else {
            return parent;
        }
    }

    return null;
}

export function dataset(obj, key, value) {
    const isGet = value === undefined;
    let d = obj;

    let arr = flat(
        key.split('.').map((e) => {
            if (e.includes('[')) {
                return e.split('[').map((e) => e.replace(/"/g, ''));
            } else {
                return e;
            }
        })
    );

    try {
        for (let i = 0; i < arr.length; i++) {
            let e = arr[i];
            let n = null;

            if (e.includes(']')) {
                let [k, v] = e.replace(']', '').split(':');

                if (v) {
                    n = d.findIndex((x) => x[k] == v);
                } else {
                    n = Number(n);
                }
            } else {
                n = e;
            }

            if (i != arr.length - 1) {
                d = d[n];
            } else {
                if (isGet) {
                    return d[n];
                } else {
                    d[n] = value;
                }
            }
        }

        return obj;
    } catch (e) {
        console.error('格式错误', `${key}`);
        return {};
    }
}

export function print(title, value) {
    if (process?.env?.NODE_ENV !== 'development') return
    if (value) {
        if (typeof value == 'object') {
            let obj = {};

            for (let i in value) {
                obj[i] = value[i];
            }

            if (console.table) {
                console.table(obj);
            } else {
                console.log(obj);
            }
        } else {
            console.log(value);
        }
    } else {
        console.log(value);
    }
}

export function resetForm(items, form) {
    items.forEach((e) => {
        if (isArray(e.value)) {
            form[e.prop] = [];
        } else if (isObject(e.value)) {
            form[e.prop] = {};
        } else {
            form[e.prop] = undefined;
        }
    });
}

export function clearForm(form) {
    for (let i in form) {
        if (isArray(form[i])) {
            form[i] = [];
        } else if (isObject(form[i])) {
            form[i] = {};
        } else {
            form[i] = undefined;
        }
    }
}

export function deepMerge(a, b) {
    let k;
    for (k in b) {
        a[k] =
            a[k] && a[k].toString() === '[object Object]' ? deepMerge(a[k], b[k]) : (a[k] = b[k]);
    }
    return a;
}

export function renderNode(vnode, options = {}) {
    const h = this.$createElement;
    const { scope } = options;
    if (isFunction(vnode)) {
        return vnode({ scope, h });
    } else if (isString(vnode)) {
        if (vnode.includes('slot-')) {
            let rn = this.crud ? this.crud.$scopedSlots[vnode] : this.$scopedSlots[vnode];

            if (rn) {
                return rn({ scope: scope || this.form, done: this.close, upsert: { ...this } });
            }
        } else {
            return h(vnode);
        }
    } else {
        if (vnode.render) {
            if (!vnode.name) {
                console.error('Component name is required');
                return <span />;
            }

            if (!this.$root.$options.components[vnode.name]) {
                __vue.component(vnode.name, vnode);
            }

            return h(vnode.name, vnode);
        } else if (vnode.context) {
            return vnode;
        } else {
            console.error('Component invalid');
            return <span />;
        }
    }
}

let formItemNameIndex = 0;

export function renderForm(options = {}) {
    const h = this.$createElement;
    const scope = this.form;
    const { appendEl, forceUpdate, isfilter, refs } = options;

    const items = this.items.map((e, i) => {
        if (!e.hidden || e.hidden({ scope })) {
            let vnode = null;

            if (isFunction(e.component)) {
                vnode = e.component({ scope, h });
            } else {


                let {
                    vm,
                    name,
                    attrs = {},
                    props,
                    on = {},
                    options = [],
                    children = [],
                    context,
                    render,
                    domProps = {},
                    style = {},
                    ['class']: _class = {},
                    nativeOn = {},
                    directives = {},
                    scopedSlots = {},
                    slot,
                    key,
                    ref,
                    buttonText = '按钮',
                    refInFor,
                    width = '100%',
                } = e.component || {};
                let disabled = false

                if (typeof props?.disabled == 'function') {
                    disabled = props.disabled({ scope })
                } else {
                    disabled = props?.disabled
                }
                if (typeof attrs?.disabled == 'function') {
                    disabled = attrs.disabled({ scope })
                } else {
                    disabled = attrs?.disabled
                }


                if (!style.width) {
                    style.width = width;
                }
                let jsx = {
                    ...e.component,
                    ['class']: _class,
                    domProps,
                    style,
                    nativeOn,
                    directives,
                    scopedSlots,
                    slot,
                    key,
                    ref,
                    buttonText,
                    refInFor,
                    attrs: Object.assign({}, {
                        ...attrs,
                        value: this.form[e.prop],
                    }, { disabled: disabled }),
                    props: Object.assign({}, {
                        ...props,
                    }, { disabled: disabled }),
                    on: {
                        input: (val) => {
                            this.$set(this.form, e.prop, val)
                            // this.form[e.prop] = val;
                        },
                        change: (val) => {
                            this.$set(this.form, e.prop, val)
                        },
                        ...on,
                    },
                };
                if (vm && isFunction(vm)) {
                    vnode = vm({ scope, h, view: this.viewing });
                } else if (context) {
                    vnode = e.component;
                } else if (render) {
                    if (!name) {
                        name = 'error-text';
                        jsx.domProps.innerHTML = 'Component name is required';
                        jsx.style.color = 'red';
                    }


                    const fn = function () {
                        name = name + '-' + formItemNameIndex++;
                    };

                    if (isBoolean(e.forceUpdate)) {
                        if (e.forceUpdate) {
                            fn();
                        }
                    } else {
                        if (forceUpdate) {
                            fn();
                        }
                    }
                    if (!this.$root.$options.components[name]) {
                        __vue.component(name, jsx);
                    }

                    // Delete jsx props, avoid props is null.
                    delete jsx.props;
                    vnode = h(name, jsx);
                } else if (name) {
                    if (name == 'el-button') {
                        vnode = h(name, jsx, buttonText);
                    } else if (name.includes('slot-')) {
                        let rn = this.crud ? this.crud.$scopedSlots[name] : this.$scopedSlots[name];
                        if (rn) {
                            vnode = rn({ scope });
                        }
                    } else {
                        children = (e.component.options || []).map((e, i) => {
                            switch (name) {
                                case 'el-select':
                                    return (
                                        <el-option
                                            key={i}
                                            label={e.label}
                                            value={e.value}
                                            {...{ props: e.props }}
                                        />
                                    );

                                case 'el-radio-group':
                                    return (
                                        <el-radio key={i} label={e.value} {...{ props: e.props }}>
                                            {e.label}
                                        </el-radio>
                                    );

                                case 'el-checkbox-group':
                                    return (
                                        <el-checkbox
                                            key={i}
                                            label={e.value}
                                            {...{ props: e.props }}>
                                            {e.label}
                                        </el-checkbox>
                                    );
                            }
                        });

                        if (this.viewing) {
                            const value = make.format({ h, scope, nextTick: this.$nextTick, child: children }, e, jsx);
                            vnode = (<cl-text value={value}></cl-text>)
                        } else {
                            vnode = h(name, jsx, children);

                        }
                    }
                }

            }
            // console.log(this, vnode)

            const formItem = (<el-form-item
                key={i}
                prop={e.prop}
                rules={e.rules}
                {...{
                    ...e.props, ...e.component
                    ,
                }}

            >
                <template {...{ slot: "label" }}>
                    {e.label}
                </template>

                {vnode}
            </el-form-item>)

            let formEl = null
            if (isfilter && isBoolean(isfilter)) {
                formEl = formItem
            } else {
                formEl = (
                    <el-col
                        xs={e.xs}
                        sm={e.sm}
                        md={e.md}
                        lg={e.lg}
                        xl={e.xl}
                        span={e.span}
                        offset={e.offset}
                        key={i}>
                        {
                            formItem
                        }
                    </el-col>
                );
            }
            return formEl
        }
    });

    let form = null;

    if (isfilter && isBoolean(isfilter)) {
        form = (
            <el-form
                ref="form"
                class="cl-form"
                {...{
                    props: {
                        disabled: this.saving,
                        model: this.form,
                        ...this.props,
                    },
                }}>

                {items}
                {appendEl}
            </el-form>
        )
    } else {
        form = (
            <el-form
                ref="form"
                class="cl-form"
                {...{
                    props: {
                        disabled: this.saving,
                        model: this.form,
                        ...this.props,
                    },
                }}>
                <el-row
                    v-loading={this.loading}
                    {...{
                        attrs: {
                            ...this['v-loading'],
                        },
                    }}>
                    {items}
                    {appendEl}
                </el-row>
            </el-form>
        )
    }

    return form;
}

export function contains(parent, node) {
    if (document.documentElement.contains) {
        return parent !== node && parent.contains(node);
    } else {
        while (node && (node = node.parentNode)) if (node === parent) return true;
        return false;
    }
}

export function getInstance(component) {
    const ComponentConstructor = __vue.extend(component);
    return new ComponentConstructor({
        el: document.createElement("div")
    });
}

export { cloneDeep, flat, vue };


export const NODE_KEY = "$treeNodeId";

export const markNodeData = function (node, data) {
    if (!data || data[NODE_KEY]) return;
    Object.defineProperty(data, NODE_KEY, {
        value: node.id,
        enumerable: false,
        configurable: false,
        writable: false
    });
};

export const getNodeKey = function (key, data) {
    if (!key) return data[NODE_KEY];
    return data[key];
};

export const findNearestComponent = (element, componentName) => {
    let target = element;
    while (target && target.tagName !== "BODY") {
        if (target.__vue__ && target.__vue__.$options.name === componentName) {
            return target.__vue__;
        }
        target = target.parentNode;
    }
    return null;
};

export const flexColumnWidth = (str) => {
    let flexWidth = 0
    for (const char of str) {
        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
            // 如果是英文字符，为字符分配8个单位宽度
            flexWidth += 8
        } else if (char >= '\u4e00' && char <= '\u9fa5') {
            // 如果是中文字符，为字符分配20个单位宽度
            flexWidth += 20
        } else {
            // 其他种类字符，为字符分配5个单位宽度
            flexWidth += 5
        }
    }
    if (flexWidth < 50) {
        // 设置最小宽度
        flexWidth = 200
    }
    if (flexWidth > 250) {
        // 设置最大宽度
        flexWidth = 250
    }
    return flexWidth + 'px'
}

export function throttle(func, delay) {
    let flag = true;
    return function () {
        const _this = this;
        const args = arguments;
        if (!flag) {
            return false
        }

        func.apply(_this, args)
        flag = true

        setTimeout(() => {
            flag = true
        }, delay)
    }
}