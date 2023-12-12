
import Universally from "@/mixins/universally";
export default {
    mixins: [Universally],
    name: 'cl-input-switch',
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
        switch: {
            type: Object,
            default: () => {
                return {
                    'active-color': "#13ce66",
                    'active-text': "自动生成",
                    'label-width': "0",
                }
            }
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
    data() {
        return {
            switchValue: false,
        }
    },

    methods: {
        change(value) {
            this.$emit('switch-change', value)
        }
    },
    render() {
        return (
            <el-input disabled={this.inputDisabled} size={this.inputSize} {
                ...{
                    attrs: this.$attrs,
                    on: this.$listeners
                }
            }>
                {
                    this.button && <el-switch disabled={this.inputDisabled} size={this.inputSize} v-model={this.switchValue}   {...{
                        slot: this.type,
                        props: this.$attrs.switch.props || this.switch, on: {
                            change: this.change
                        }
                    }}></el-switch>
                }
            </el-input>
        );
    }
};