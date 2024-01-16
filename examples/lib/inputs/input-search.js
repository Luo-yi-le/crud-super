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
        focus: Boolean,
        blur: Boolean,
        value: [String, Number, Boolean],
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

    methods: {
        bindMethods() {
            const methods = [
                "onfocus",
                "onblur",
                "onselect",
            ];

            methods.forEach((n) => {
                this[n] = this.$refs["input"][n];
            });
        },
        handlerInput(value) {
            this.modelValue = value
            this.$emit('input', this.modelValue)
        }
    },

    watch: {
        value(value) {
            this.modelValue = value
        }
    },

    mounted () {
        this.bindMethods()
    },
    data() {
        return {
            modelValue: this.value
        }
    },

    render() {
        const scopedSlots = this.$scopedSlots;
        let defaultSlots = {
            [this.type] : ()=>this.button ? ( <el-button disabled={this.inputDisabled} size={this.inputSize} {...{ slot: this.type, attrs: this.$attrs, on: this.$listeners, props: { icon: this.icon } }}></el-button>): null
        };
        const slot = Object.assign({},defaultSlots, scopedSlots)
        return (
            <cl-input ref='input' v-model={this.modelValue} blur={this.blur} focus={this.focus} disabled={this.inputDisabled} size={this.inputSize}  {
                ...{
                    attrs: this.$attrs,
                    on: {
                        input: this.handlerInput,
                        ...this.$listeners
                    },
                    scopedSlots: slot,
                }
            }>

            </cl-input>
        );
    }
};