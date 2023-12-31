import { cloneDeep, renderForm, resetForm, certainProperty } from '@/utils';

import Universally from '@/mixins/universally'
export default {
    mixins: [Universally],
    inject: ['crud'],

    data() {
        return {
            items: [],
            props: {},
            visible: false,
        };
    },

    mounted() {
        if (this.crud.search.adv.visible) {
            this.open();
        }
    },

    methods: {
        search() {
            const params = cloneDeep(this.form);

            const next = (params) => {
                this.crud.refresh({
                    ...params,
                    page: 1,
                });
            };

            if (this.crud.fn.advSearch) {
                this.crud.fn.advSearch(params, { next });
            } else {
                next(params);
            }

            this.close();
        },

        open() {
            let { items, props, form } = this.crud.search.adv;

            if (items) {
                this.items = items;
            }

            if (props) {
                this.props = props;
            }

            this.visible = true;
            this.form = form;

            this.items.map((e) => {
                if (this.form[e.prop] === undefined) {
                    this.$set(this.form, e.prop, cloneDeep(e.value));
                }
            });

            if (this.crud.fn.advOpen) {
                this.crud.fn.advOpen(form, {
                    close: this.close,
                    reset: () => {
                        resetForm(this.items, this.form);
                    },
                });
            }
        },

        close() {
            this.visible = false;

            if (this.crud.fn.advClose) {
                this.crud.fn.advClose();
            }
        },

        reset() {
            resetForm(this.items, this.form);

            if (this.crud.fn.advReset) {
                this.crud.fn.advReset(this.form, {
                    close: this.close,
                });
            }
        },
    },

    render() {
        let { on, props = {}, attrs, title, op } = this.crud.search.adv;
        let form = renderForm.call(this);

        return (
            this.visible && (
                <el-drawer
                    {...{
                        attrs,
                        props: {
                            direction: 'rtl',
                            title,
                            ...props,
                            visible: this.visible,
                        },
                        on: {
                            'update:visible': (f) => {
                                this.visible = f;
                                this.close();
                            },
                            ...on,
                        },
                    }}>
                    <div class="crud-adv-search">
                        <div class="crud-adv-search__container">{form}</div>

                        <div class="crud-adv-search__footer">
                            <el-button plain size={this.isSize} disabled={this.isDisabled} type="primary" on-click={this.search}>
                                {op.confirmButtonText}
                            </el-button>
                            <el-button plain size={this.isSize} disabled={this.isDisabled} on-click={this.reset}>
                                {op.resetButtonText}
                            </el-button>
                        </div>
                    </div>
                </el-drawer>
            )
        );
    },
};