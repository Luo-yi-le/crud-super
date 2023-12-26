import { clearForm, resetForm, cloneDeep, clone, isFunction, isBoolean, renderForm, deepMerge, dataset, certainProperty } from '@/utils';
import Universally from '@/mixins/universally';
import BusMixins from '@/mixins/bus';
export default {
    name: 'cl-filter',
    mixins: [Universally, BusMixins],
    inject: ['crud'],
    props: {
        auto: {
            type: Boolean,
            default: true
        },
        column: {
            default: 5,
            type: Number
        }
    },

    data() {
        return {
            items: [],
            buttons: [],
            form: {},
            props: {},
            toggleShow: true,
        }
    },
    watch: {
        form: {
            handler(value) {
                this.$emit('data', value)
                this.$nextTick(() => {
                    this.sendFilterData(value)
                })
            },
            deep: true
        }
    },
    created() {

    },
    computed: {
        upsertItems() {
            return [].concat(this.crud.upsert.items)
        }
    },
    mounted() {
        const { items, form, buttons, props } = this.crud.filter;
        const size = this.size || props.size || this.isSize
        const p = Object.assign({}, this.props, props, { size })
        this.$set(this, 'form', Object.assign({}, this.form, form));
        this.$set(this, 'buttons', clone(buttons));
        this.$set(this, 'props', clone(p));
        this.$set(this, 'items', clone(items));
        // 设置表单值

        this.setFormKey()
        this.$nextTick(() => {
            this.getUpsertItems()
        })
        this.sendFilterItemLength(this.items.length)
        this.sendBus()
    },
    methods: {
        sendBus() {
            this.$crud && this.$crud.$bus && this.$crud.$bus.$on('cl-send-toggle-data', value => {
                this.toggleShow = value
            })
        },
        renderForm(options) {
            return renderForm.call(this, options)
        },
        setData(p, d) {
            deepMerge(
                this,
                dataset(
                    certainProperty(this, [
                        'items',
                        'buttons',
                        'form',
                        'props',
                    ]),
                    p,
                    d
                )
            );
        },
        hiddenItem(k, v = true) {
            this.setData(`items[prop:${k}].hidden`, v);
        },
        setFormKey() {
            this.$nextTick(() => {
                const items = clone(this.items);
                const map = items.map(item => {
                    this.$set(this.form, item.prop, item.value);
                    return {
                        hidden: item.hidden,
                        isfilter: item.isfilter,
                        label: item.label,
                        component: item.component,
                        prop: item.prop,
                    }
                })

                this.$set(this, 'items', map)
            })
        },
        getUpsertItems() {

            let upsertItems = this.upsertItems

            const items = upsertItems.filter(item => (isBoolean(item.isfilter) && item.isfilter))
            this.items = [...clone(this.items)].concat([...items])
            this.setFormKey();
        },
        reset() {
            resetForm(this.items, this.form)
            clearForm(this.form);
            if (this.auto) {
                this.done(this.form)
            }
            this.$emit('reset', { data: this.form, done: this.done })
        },
        done(params) {
            const next = (params) => {
                this.crud.refresh({
                    ...params,
                    pageNum: 1,
                });
            };
            next(params)
        },
        search() {
            const params = clone(this.form);
            const { pageNum, pageSize } = this.crud.pagination;
            if (this.auto) {
                this.done(params);
            }
            this.$emit('search', { data: params, done: this.done })
        },

        get() {
            return this.form
        },
    },

    render(h, context) {
        const buttonsEl = this.buttons.map((item, index) => {
            if (item == 'search') {
                return <el-button type="primary" icon="el-icon-search" size={this.isSize} disabled={this.isDisabled} on-click={this.search}>搜 索</el-button>
            } else if (item == 'reset') {
                return <el-button icon="el-icon-refresh" size={this.isSize} disabled={this.isDisabled} on-click={this.reset}>重 置</el-button>
            } else if (item.includes('slot-')) {
                let rn = this.crud ? this.crud.$scopedSlots[item] : this.$scopedSlots[item];

                if (rn) {
                    return rn({ scope: scope || this.form, filter: { ...this } });
                }
            } else {
                return h(item);
            }

        });
        const appendEl = (
            <el-form-item label-width='0'>{buttonsEl}</el-form-item>
        )


        const formEl = this.renderForm({ appendEl, isfilter: true })



        return this.toggleShow && (<div class="cl-filter" ref='clFilter'>
            {formEl}
        </div>)
    }
}