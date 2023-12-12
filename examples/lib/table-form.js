import { isNull, renderNode, isFunction } from '@/utils/index';
import { nodeRender } from "@/utils/vnode";
export default {
    name: 'cl-table-form',

    inject: ['crud'],

    computed: {
        table() {
            return this.crud.table;
        },
        form() {
            return {
                data: this.data
            }
        }
    },

    data() {
        return {
            maxHeight: null,
            viewing: false
        };
    },

    methods: {
        columnRender() {
            const { rowView, getPermission } = this.crud;
            return this.table.columns
                .filter(e => !e.hidden)
                .map(item => {
                    const deep = item => {
                        let params = {
                            props: item,
                            on: item.on
                        };

                        if (!item.type || item.type === 'expand') {
                            params.scopedSlots = {
                                default: scope => {
                                    if (item.children) {
                                        return <div>{item.children.map(deep)}</div>;
                                    }
                                    let slot = this.$scopedSlots[`table-column-${item.prop}`];
                                    let newScope = {
                                        ...scope,
                                        ...item
                                    };
                                    // 绑定值
                                    const value = scope.row[item.prop];
                                    if (slot) {
                                        return slot({
                                            scope: newScope
                                        });
                                    } else {
                                        // elm formatter
                                        if (item.formatter) {
                                            return item.formatter(
                                                newScope.row,
                                                newScope.column,
                                                newScope.row[item.prop],
                                                newScope.$index
                                            );
                                        } else if (item.component) {
                                            return nodeRender(item.component, {
                                                prop: item.prop,
                                                scope: newScope.row
                                            });
                                        } // 字典状态
                                        else if (item.dict) {
                                            const data = item.dict.find(
                                                (d) => d.value == value
                                            );
                                            if (data) {
                                                const ElTag = (
                                                    <el-tag
                                                        disable-transitions
                                                        size="small"
                                                        type={data.type}
                                                        effect="dark">
                                                        {data.label}
                                                    </el-tag>
                                                );
                                                return ElTag
                                            } else {
                                                return value;
                                            }

                                        } //查看状态
                                        else if (item.view) {
                                            let value = scope.row[item.prop];
                                            return <el-button type="text" on-click={() => { rowView(scope.row) }}>{value}</el-button>
                                        }
                                        // cs formatter
                                        else {
                                            return (scope => {
                                                let value = scope.row[scope.prop];

                                                if (scope.dict) {
                                                    let item = scope.dict.find(
                                                        d => d.value == value
                                                    );

                                                    if (item) {
                                                        value = item.label;
                                                    }
                                                }

                                                return scope.slot
                                                    ? ''
                                                    : isNull(value)
                                                        ? scope.emptyText
                                                        : value;
                                            })(newScope);
                                        }
                                    }
                                },
                                header: scope => {
                                    let slot = this.$scopedSlots[`table-header-${item.prop}`];

                                    if (slot) {
                                        return slot({
                                            scope
                                        });
                                    } else {
                                        return scope.column.label;
                                    }
                                }
                            };
                        }
                        const childrenEl = item.children ? item.children.map(deep) : null;
                        const formItem = (
                            <el-form-item>
                                <el-table-column {...params}>{childrenEl}</el-table-column>;
                            </el-form-item>
                        )
                        return formItem
                    };

                    return deep(item);
                });
        },

        view() {
            this.viewing = true;
        },

        opRender() {
            const { rowEdit, rowView, rowDelete, getPermission, getLabel } = this.crud;
            const { on, op } = this.table;

            const render = scope => {
                if (!this.viewing) {
                    return op.layout.map(vnode => {

                        if (!op.hidden || op.hidden(scope, vnode)) {
                            if (['edit', 'update', 'delete'].includes(vnode)) {

                                // 获取权限
                                const perm = getPermission(vnode);
                                if (!perm) {
                                    // 标签名
                                    const label = getLabel(vnode);
                                    if (vnode == 'edit' || vnode == 'update') {
                                        return (
                                            <el-button size="mini" type="text" on-click={() => { rowEdit(scope.row) }}>
                                                {label}
                                            </el-button>
                                        );
                                    } else if (vnode == 'delete') {
                                        return (
                                            <el-button size="mini" type="text" on-click={() => { rowDelete(scope.row) }}>
                                                {label}
                                            </el-button>
                                        );
                                    }
                                }
                            } else {
                                return renderNode.call(this, vnode, { scope });

                            }

                        }
                    });
                } else {
                    const label = getLabel('view');
                    return (
                        <el-button plain size="mini" type="info" disabled={!this.viewing} on-click={() => { rowView(scope.row) }}>
                            {label}
                        </el-button>
                    );
                }
            };
            return (

                <el-table-column
                    {...{
                        props: op.props,
                        scopedSlots: {
                            default: scope => {
                                let el = null;

                                if (op.name == 'dropdown-menu') {
                                    const slot = this.$scopedSlots['table-op-dropdown-menu'];
                                    const { width } = op['dropdown-menu'] || {};
                                    const items = render(scope).map(e => {
                                        return <el-dropdown-item>{e}</el-dropdown-item>;
                                    });

                                    el = (
                                        <el-dropdown
                                            {...{
                                                on,
                                                props: {
                                                    trigger: 'click',
                                                    ...op.props
                                                }
                                            }}>
                                            {slot ? (
                                                slot({ scope })
                                            ) : (
                                                <span class="el-dropdown-link">
                                                    <span>更多操作</span>
                                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                                </span>
                                            )}

                                            <el-dropdown-menu
                                                style={{ width }}
                                                class="cl-crud__op-dropdown-menu"
                                                {...{ slot: 'dropdown' }}>
                                                {items}
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    );
                                } else {
                                    el = render(scope);
                                }
                                //class="column-op"
                                return (
                                    <div class={['column-op', `_${op.name}`]}>
                                        {el}
                                    </div>
                                );
                            }
                        }
                    }}
                />
            );
        },

        emptyRender(h) {
            const empty = this.$scopedSlots['table-empty'] || this.table.scopedSlots.empty;
            const scope = {
                h,
                scope: this.table
            };

            if (empty) {
                this.table.scopedSlots.empty = () => {
                    return empty(scope);
                };
            }
        },

        sort(prop, order) {
            this.$refs['table'].sort(prop, order);
        },

        clearSort() {
            this.$refs['table'].clearSort();
        },

        selectionChange(selection) {
            this.table.selection = selection;
        },

        sortChange(value) {
            this.$emit('sort-change', value);
        },

        calcHeight() {
            return this.$nextTick(() => {
                const el = this.crud.$el.parentNode;
                const { height = '' } = this.table.props || {};

                if (el) {
                    let rows = el.querySelectorAll('.cl-crud .el-row');

                    if (!rows[0].isConnected) {
                        return false;
                    }

                    let h = 20;

                    for (let i = 0; i < rows.length; i++) {
                        let f = true;

                        for (let j = 0; j < rows[i].childNodes.length; j++) {
                            if (rows[i].childNodes[j].className == 'crud-data-table') {
                                f = false;
                            }
                        }

                        if (f) {
                            h += rows[i].clientHeight + 20;
                        }
                    }

                    let h1 = Number(String(height).replace('px', ''));
                    let h2 = el.clientHeight - h;

                    this.maxHeight = h1 > h2 ? h1 : h2;
                }
            });
        },

        async resize() {
            await this.calcHeight();

            const { resize } = this.crud.fn;
            const d = { tableMaxHeight: this.maxHeight };

            if (resize) {
                resize(d);
            }

            this.crud.$emit('resize', d);
        },

        renderEl(h) {
            this.emptyRender(h);

            return {
                columnEl: this.columnRender(),
                opEl: this.opRender()
            };
        }
    },

    mounted() {
        window.removeEventListener('resize', function () { });
        window.addEventListener('resize', () => {
            this.resize();
        });

        this.resize();
    },

    render(h) {
        const { data, op, loading, on, props, scopedSlots } = this.table;
        const { columnEl, opEl } = this.renderEl(h);

        return (
            this.table.visible && (
                <div class="crud-data-table">
                    {
                        <el-form>
                            <el-table
                                ref="table"
                                data={data}
                                on-selection-change={this.selectionChange}
                                on-sort-change={this.sortChange}
                                v-loading={loading}
                                max-height={this.maxHeight + 'px'}
                                {...{
                                    on,
                                    props,
                                    scopedSlots: {
                                        ...scopedSlots
                                    }
                                }}>
                                {columnEl}
                                {op.visible && opEl}
                            </el-table>
                        </el-form>
                    }
                </div>
            )
        );
    }
};