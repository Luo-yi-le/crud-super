export default {
    inject: {
        elForm: {
            default: ''
        },
        elFormItem: {
            default: ''
        },
        crud: {
            default: ''
        },
    },
    props: {
        size: String,
        disabled: Boolean,
    },

    computed: {
        _elFormItemSize() {
            return (this.elFormItem || {}).elFormItemSize;
        },
        elSize() {
            return this.isSize || this._elFormItemSize || (this.$ELEMENT || {}).size;
        },
        elDisabled() {
            return this.$options.propsData.hasOwnProperty('disabled') ? this.isDisabled : (this.elForm || {}).disabled;
        },
        isSize() {
            return this.size || ((this.crud || {}).size);
        },

        isDisabled() {
            return this.disabled || (this.crud || {}).disabled;
        }
    },
}