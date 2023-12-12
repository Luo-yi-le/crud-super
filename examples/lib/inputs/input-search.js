import Universally from "@/mixins/universally";
export default {
    name: 'cl-input-search',
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
    mixins: [Universally],
    props: {
        icon: {
            default: 'el-icon-search',
            type: String
        },
        button: {
            default: true,
            type: Boolean
        },
        type: {
            default: 'append',
            type: String
        },
    },

    computed: {
        _elFormItemSize() {
            return (this.elFormItem || {}).elFormItemSize;
        },
        inputSize() {
            return this.isSize || this._elFormItemSize || (this.$ELEMENT || {}).size;
        },
        inputDisabled() {
            return this.$options.propsData.hasOwnProperty('disabled') ? this.isDisabled : (this.elForm || {}).disabled;
        }
    },

    render() {
        return (
            <el-input disabled={this.inputDisabled} size={this.inputSize}  {
                ...{
                    attrs: this.$attrs,
                    on: this.$listeners
                }
            }>
                {
                    this.button && <el-button disabled={this.inputDisabled} size={this.inputSize} {...{ slot: this.type, attrs: this.$attrs, on: this.$listeners, props: { icon: this.icon } }}></el-button>
                }
            </el-input>
        );
    }
};