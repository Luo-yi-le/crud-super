import moment from 'moment';
import { isArray, isNumber, isString } from '.';

const defaultFormats = {
    'el-input'({ args: [h, value, items, options, jsx] }) {
        return h('cl-text', jsx, value)
    },
    'el-input-number'({ args: [h, value, items, options, jsx] }) {
        return h('cl-text', jsx, value)
    },
    'cl-input-search'({ args: [h, value, items, options, jsx] }) {
        return h('cl-text', Object.assign(jsx, { props: { button: false } }), value)
    },
    'cl-input-switch'({ args: [h, value, items, options = [], jsx] }) {
        return h('cl-text', Object.assign(jsx, { props: { button: false } }), value)
    },
    'el-checkbox'({ args: [h, value, items, options = [], jsx] }) {
        if (value) {
            const d = options.find(item => item.value === value);
            return h('cl-text', jsx, d?.label)
        }
    },
    'el-checkbox-group'({ args: [h, value, items, options = [], jsx] }) {
        let array = [];
        if (value && isString(value)) {
            array = value.split(',')
        }
        if (value && isArray(value)) {
            array = value
        }

        const d = options.filter(item => array.includes(item.value)).map(i => i.value);
        const txt = (d && d.length) ? d.join(',') : ''
        return h('cl-text', jsx, txt)
    },

    'el-radio-group'({ args: [h, value, items, options, jsx] }) {
        const d = options.find(item => item.value === value);
        return h('cl-text', jsx, d?.label)
    },
    'el-color-picker'({ args: [h, value, items, options, jsx] }) {
        return h('el-color-picker', jsx, String(value))
    },
    'el-select'({ args: [h, value, items, options, jsx] }) {
        const { attrs, props } = items.component || {}
        if (attrs?.multiple || props?.multiple) {
            let array = [];
            if (value.includes(',')) {
                array = value.split(',');
            }
            if (isArray(value)) {
                array = value
            }

            const d = options.filter(item => array.includes(item.value)).map(i => i.value);
            const txt = (d && d.length) ? d.join(',') : ''
            return h('cl-text', jsx, txt)

        } else {
            const d = options.find(i => String(i.value) === String(value));

            return h('cl-text', jsx, d?.label)
        }

    },

    'el-date-picker'({ args: [h, value, items, options, jsx, scope] }) {
        const { attrs, props } = items.component || {};
        let d = '--';
        const keys = attrs?.keys || props?.keys || ['startDate', 'endDate'];
        if (attrs?.type == 'date' || props?.type == 'date') {
            d = moment(value).format("YYYY-MM-DD")
        } else if (attrs?.type == 'month' || props?.type == 'month') {
            d = moment(value).format("YYYY-MM")
        } else if (attrs?.type == 'year' || props?.type == 'year') {
            d = moment(value).format("YYYY")
        } else if (attrs?.type == 'datetime' || props?.type == 'datetime') {
            d = moment(value).format("YYYY-MM-DD HH:mm:ss")
        } else if (attrs?.type == 'datetimerange' || props?.type == 'datetimerange') {
            const rangeSeparator = attrs?.rangeSeparator || attrs['range-separator'] || props?.rangeSeparator || props['range-separator'] || ' 至 ';
            d = moment(scope[keys[0]]).format("YYYY-MM-DD HH:mm:ss") + rangeSeparator + moment(scope[keys[1]]).format("YYYY-MM-DD HH:mm:ss")
        } else if (attrs?.type == 'daterange' || props?.type == 'daterange') {
            const rangeSeparator = attrs?.rangeSeparator || attrs['range-separator'] || props?.rangeSeparator || props['range-separator'] || ' 至 ';
            d = moment(scope[keys[0]]).format("YYYY-MM-DD") + rangeSeparator + moment(scope[keys[1]]).format("YYYY-MM-DD")
        } else {
            if(value) {
                d = value
            }
        }
        return h('cl-text', jsx, d)
    },

    'el-cascader'({ args: [h, value, items, options, jsx] }) {
        const { attrs, props } = items.component || {}
        const option = attrs?.options || props?.options || options
        const labelkey = attrs?.props?.label || props?.props?.label || 'label';
        const valuekey = attrs?.props?.value || props?.props?.value || 'value';
        const childrenkey = attrs?.props?.children || props?.props?.children || 'children';
        let cascader = [];

        const deep = (list = [], val = [], index = 0) => {
            if (!list && !list.length) return
            list.forEach(l => {
                if (l[valuekey] == val[index]) {
                    cascader.push(l[labelkey])
                    deep(l[childrenkey], val, index + 1)
                }
            })
        }

        if (value && (isString(value) || isNumber(value))) {
            const val = isNumber(value) ? [value] : value.split(',');
            deep(option, val)
        }
        if (value && isArray(value)) {
            deep(option, value)
        }
        let txt = null
        if (cascader.length) {
            txt = cascader.join('/')

        }
        return h('cl-text', jsx, txt);
    }

}

export default {
    format({ h, scope, child, nextTick }, items, jsx) {
        let {
            name,
            attrs = {},
            props,
            options = [],
            children = [],
        } = items.component || {};
        const params = [h, scope[items.prop], items, options, jsx, scope]
        if (defaultFormats[name]) {
            return defaultFormats[name]({ args: params })
        }
        return h(name, jsx, child);
    }
}
