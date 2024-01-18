
import elFormProp from '@/mixins/elFormProp'
export default {
    model: {
        prop: 'modelValue',
        event: 'change'
    },
    name: 'cl-select',
    mixins: [elFormProp],
    props: {
        value: [String, Boolean, Number, Object, Array],
        option: {
            default: () => [],
            type: Array
        },
        props: {
            default: () => {
                return {
                    value: 'value',
                    label: 'label',
                    disabled: 'disabled',
                }
            },
            type: Object
        },
        prefixIcon: String,
        prefixText: String,
        empty: [String, Boolean, Number]
    },

    data() {
        return {
            modelValue: this.value,
        }
    },

    watch: {
        value(value) {
            this.modelValue = value;
        }
    },

    methods: {
        change(value){
            this.modelValue = value;
            this.$emit('change',this.modelValue)
        },

        bindMethods() {
            const methods = [
                "focus",
                "blur",
            ];

            methods.forEach((n) => {
                this['on'+n] = this.$refs["selectRef"][n];
            });
        }
    },

    render() {
        const { empty, prefix } = this.$scopedSlots;
        const { value, label, disabled } = this.props;

        const prefixIcon = this.prefixIcon ? (<i class={this.prefixIcon}></i>) : null;
        const prefixText = this.prefixText ? (<cl-text valie={prefixText} />) : null;
        const opEl = this.option.map((e, index) => {
            return (<el-option
                label={e[label]}
                value={e[value]}
                disabled={e[disabled]}
                key={index}>
                    {this.$scopedSlots?.default && this.$scopedSlots.default({ scope: e, index })}
            </el-option>)
        })
        return (
            <el-select
                ref='selectRef'
                {...{
                    attrs: this.$attrs,
                    on: Object.assign({}, {
                        change: this.change
                    }, this.$listeners || {})
                }}
                v-model={this.modelValue}
                disabled={this.elDisabled}
                size={this.elSize}
            >
                {prefix ? prefix() : (prefixIcon || prefixText)}
                {empty ? empty() : (<cl-text v-model={this.empty} />)}
                {opEl}
            </el-select>
        )
    }
}