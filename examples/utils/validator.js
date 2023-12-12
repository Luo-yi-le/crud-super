// validator: (a,b,c)=>this.$crud.validator.decimal(a,b,c, {max: 3}),
export default {
    zeroOrAbove: function (rule, value, callback = Function, _options) {
        const { message, pattern } = _options || { message: '请输入0或大于0的数字', pattern: /^(0|([1-9]\d*))(\.\d+)?$/g }

        const msg = message || '请输入0或大于0的数字';
        const pn = pattern || /^(0|([1-9]\d*))(\.\d+)?$/g;

        const isnull = this.isNull(rule, value, callback)
        const ispattern = this.isPattern(pn, value);

        if (isnull) {
            if (ispattern) {
                return callback()
            } else {
                return callback(new Error(msg))

            }

        } else {
            return callback(new Error('不能为空'))
        }
    },

    decimal: function (rule, value, callback = Function, _options) {
        const { message, pattern, max, min } = _options || { message: '只能输入{min}-{max}两位小数', pattern: /^(\+)?\d+(\.\d{1,2})*$/g, max: 2, min: 1 }
        const _max = max || 2;
        const _min = min || 1;

        const pn = pattern || new RegExp(`^(\\+)?\\d+(\\.\\d{${_min},${_max}})*$`);
        const msg = (message || '只能输入{min}到{max}两位小数').replace('{min}', _min).replace('{max}', _max);


        const isnull = this.isNull(rule, value, callback)
        const ispattern = this.isPattern(pn, value);

        if (isnull) {
            if (ispattern) {
                return callback()
            } else {
                return callback(new Error(msg))

            }

        } else {
            return callback(new Error('不能为空'))
        }
    },
    // burdenDecimal: function (rule, value, callback = Function, _options) {
    //     return this.decimal(rule, value, callback = Function, { pattern: `/^(\-)?\d+(\.\d{${_min},${_max}})*$/g` })
    // },

    isNull(rule, value, callback) {
        if (rule.required && !value) {
            return false
        } else {
            return true
        }
    },

    isPattern(pattern, value) {
        if (pattern && !pattern.test(value)) {
            return false
        } else {
            return true
        }
    },

    rules: {
        number: {
            pattern: /^-?\d*\.?\d+$/,
            message: '请输入数字',
            tip: '纯数字'
        },
        nDigitNumber: {
            pattern: (min) => {
                return new RegExp(`^\\d{${min}}$/`)
            },
            message: '请输入{min}位正整数',
            tip: '固定n位的数字'
        },
        birth: {
            pattern: (min = 2) => {
                return new RegExp(`^\\d{${min}}$/`)
            },
            message: `请输入至少{min}位正整数`,
            tip: '至少n位数字'
        },
        digitsRange: {
            pattern: (min, max) => {
                return new RegExp(`^\\d{${min},${max}}$/`)
            },
            message: '请输入{min}到{max}位正整数',
            tip: ' m-n位的数字'
        },

        integer: {
            pattern: /^-?\d+$/,
            message: '请输入整数',
            tip: '包含正、负整数'
        },

        positiveInteger: {
            pattern: /^\d+$/,
            message: '请输入正整数',
            tip: ' 正整数'
        },

        nonPositiveInteger: {
            pattern: /^-[1-9]\d*|0$/,
            message: '请输入0或小于0的整数',
            tip: ' 非正整数（负整数 + 0）'
        },

        negtiveInteger: {
            pattern: /^-\d+$/,
            message: '请输入负整数',
            tip: ' 负整数'
        },

        positive: {
            pattern: /^\d*\.?\d+$/,
            message: '请输入0或大于0数',
            tip: ' 正数，包含0'
        },

        positiveNegative: {
            pattern: /^(\-|\+)?\d+(\.\d+)?$/,
            message: '请输入数字',
            tip: ' 正数、负数、和小数'
        },

        digitNumber: {
            pattern: /^[+-]*(\d)*(\.\d{0,2})*$/,
            message: '只能输入{max}位小数',
            tip: '小数点后只能有最多两位数字（可以有正负号）'
        },
    }
}
