import Universally from "@/mixins/universally";
export default {
    name: 'cl-input',
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
        value: [String, Number, Boolean],
        focus: Boolean,
        blur: Boolean,
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
                "focus",
                "blur",
                "select",
            ];

            methods.forEach((n) => {
                this['on' + n] = this.$refs["input"][n];
            });
        },

        handlerInput(value) {
            this.modelValue = value
            this.$emit('input', this.modelValue)
        }
    },

    watch: {
        focus: {
            handler(value) {
                if (value) {
                    this.$nextTick(() => {
                        this.onfocus()
                    })
                }
            },
            deep: true,
            immediate: true
        },
        blur: {
            handler(value) {
                if (value) {
                    this.$nextTick(() => {
                        this.onblur()
                    })
                }
            },
            deep: true,
            immediate: true
        },
        value(value) {
            this.modelValue = value
        }
    },

    data() {
        return {
            modelValue: this.value,
        }
    },

    mounted() {
        this.bindMethods()
    },

    render() {
        const slots = Object.keys(this.$scopedSlots).map((slot) => {
            return (<template slot={slot}>
                <slot name={slot}>
                    {this.$scopedSlots[slot]?.()}
                </slot>
            </template>)
        })
        return (
            <el-input v-model={this.modelValue} ref='input' disabled={this.inputDisabled} size={this.inputSize}  {
                ...{
                    attrs: this.$attrs,
                    on: {
                        input: this.handlerInput,
                        ...this.$listeners
                    },

                }
            }>

                {slots}
            </el-input>
        );
    }
};