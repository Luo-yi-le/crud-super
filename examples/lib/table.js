import { isNull, renderNode, isFunction, isArray, isEmpty } from '@/utils/index';
import Sortable from 'sortablejs';
import { nodeRender } from "@/utils/vnode";
import Universally from '@/mixins/universally'

export default {
    name: 'cl-data-table',
    mixins: [Universally],
    inject: ['crud'],
    computed: {
        table() {
            return this.crud.table;
        },
    },

    data() {
        return {
            maxHeight: null,
            viewing: false,
            filterData: {}
        };
    },

    methods: {
        columnRender() {
            const { rowView, getPermission } = this.crud;
            const createElement = this.$createElement;
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
                                                scope: newScope,
                                                slots: slot,
                                                h: createElement
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
                                                        size={this.isSize}
                                                        type={data.type}
                                                        effect="dark">
                                                            <cl-text value={data.label}></cl-text>
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
                                                        ? (<cl-text v-model={scope.emptyText}/>)
                                                        : (<cl-text v-model={value} />);
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
                        return (!item.hide && <el-table-column {...params}>{childrenEl}</el-table-column>);
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
                            if (['edit', 'update', 'delete', 'view'].includes(vnode)) {

                                // 获取权限
                                const perm = getPermission(vnode);

                                // 标签名
                                const label = getLabel(vnode);
                                if (vnode == 'edit' || vnode == 'update') {
                                    return (perm &&
                                        <el-button v-check-premi={perm} size={this.isSize} type="text" on-click={() => { rowEdit(scope.row) }}>
                                            {label}
                                        </el-button>
                                    );
                                } else if (vnode == 'delete') {
                                    return (perm &&
                                        <el-button v-check-premi={perm} size={this.isSize} type="text" on-click={() => { rowDelete(scope.row) }}>
                                            {label}
                                        </el-button>
                                    );
                                }
                                else if (vnode == 'view') {
                                    const label_view = getLabel('view');
                                    return (perm &&
                                        <el-button v-check-premi={perm} size={this.isSize} type="text" on-click={() => { rowView(scope.row) }}>
                                            {label_view}
                                        </el-button>
                                    );
                                }
                            } else {
                                return renderNode.call(this, vnode, { scope });

                            }

                        }
                    });
                } else {
                    const label = getLabel('view');
                    return (
                        <el-button plain size={this.isSize} type="info" disabled={!this.viewing} on-click={() => { rowView(scope.row) }}>
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
        // 绑定 el-table 事件
        bindMethods() {
            const methods = [
                "clearSelection",
                "toggleRowSelection",
                "toggleAllSelection",
                "toggleRowExpansion",
                "setCurrentRow",
                "clearFilter",
                "doLayout",
            ];

            methods.forEach((n) => {
                this[n] = this.$refs["table"][n];
            });
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
        },
        onRowContextMenu(row, column, event, store) {
            const $store = this.$store || store;
            const { selection, columns, menu } = this.table
            const { refresh, rowEdit, rowDelete, rowView, permission, getPermission, table = {}, contextMenu } = this.crud;
            const cm =
                isEmpty(contextMenu) && !isArray(contextMenu)
                    ? menu.visible
                    : contextMenu;

            let buttons = [...menu.buttons]
            let enable = false;


            if (cm) {
                if (isArray(cm)) {
                    buttons = cm || [];
                    enable = Boolean(buttons.length > 0);
                } else {
                    enable = true;
                }
            }
            if (menu.selectable && typeof menu.selectable == 'function') {
                buttons = menu.selectable(row, buttons) || []
            }


            if (enable) {
                // 解析按钮
                let list = buttons
                    .map((e) => {
                        switch (e) {
                            case "view":
                                return {
                                    label: "查看",
                                    permission: permission.query,
                                    'prefix-icon': 'el-icon-view',
                                    callback: (_, done) => {
                                        rowView(row);
                                        done();
                                    }
                                };
                            case "refresh":
                                return {
                                    label: "刷新",
                                    permission: permission.list,
                                    'prefix-icon': 'el-icon-refresh',
                                    callback: (_, done) => {
                                        refresh(this.filterData);
                                        done();
                                    }
                                };
                            case "edit":
                            case "update":
                                return {
                                    label: "编辑",
                                    'prefix-icon': 'el-icon-edit',
                                    permission: permission.update,
                                    hidden: !getPermission("update"),
                                    callback: (_, done) => {
                                        rowEdit(row);
                                        done();
                                    }
                                };
                            case "delete":
                                return {
                                    label: "删除",
                                    'prefix-icon': 'el-icon-delete',
                                    permission: permission.delete,
                                    hidden: !getPermission("delete"),
                                    callback: (_, done) => {
                                        rowDelete(row);
                                        done();
                                    }
                                };
                            case "check":
                                return {
                                    permission: permission.multiDelete,
                                    label: Boolean(selection.find((e) => e.id == row.id))
                                        ? "取消选择"
                                        : "选择",
                                    'prefix-icon': Boolean(selection.find((e) => e.id == row.id)) ? 'el-icon-close' : 'el-icon-check',
                                    hidden: !Boolean(
                                        columns.find((e) => e.type === "selection")
                                    ),
                                    callback: (_, done) => {
                                        this.toggleRowSelection(row);
                                        done();
                                    }
                                };
                            case "order-desc":
                                return {
                                    label: `${column.label} - 降序`,
                                    hidden: !column.sortable,
                                    'prefix-icon': 'el-icon-bottom',
                                    callback: (_, done) => {
                                        this.sort(column.property, "desc");
                                        done();
                                    }
                                };
                            case "order-asc":
                                return {
                                    label: `${column.label} - 升序`,
                                    hidden: !column.sortable,
                                    'prefix-icon': 'el-icon-top',

                                    callback: (_, done) => {
                                        this.sort(column.property, "asc");
                                        done();
                                    }
                                };
                            default:
                                if (isFunction(e)) {
                                    return e(row, column, event, $store);
                                } else {
                                    return e;
                                }
                        }
                    })
                    .filter((e) => Boolean(e) && !e.hidden);

                // 打开右键菜单
                if (!isEmpty(list)) {
                    this.$crud.openContextMenu(event, {
                        list
                    }, $store);
                }
            }


            if (this.table.on['row-contextmenu']) {
                this.table.on['row-contextmenu'](row, column, event, $store);
            }
        },

        //行拖拽
        rowDrop() {
            const { data } = this.table;

            const tbody = document.querySelector('.el-table__body tbody');
            const _this = this;

            Sortable.create(tbody, {
                onEnd({ newIndex, oldIndex }) {
                    const currRow = data.splice(oldIndex, 1)[0]
                    data.splice(newIndex, 0, currRow)
                }
            })
        },

        //列拖拽
        columnDrop() {
            //         <el-table-column v-for="(item, index) in col"
            //     :key="`col_${index}`"
            //     :prop="dropCol[index].prop"
            //     :label="item.label"> 
            //   </el-table-column>
            const wrapperTr = document.querySelector('.el-table__header-wrapper tr');
            this.sortable = Sortable.create(wrapperTr, {
                animation: 180,
                delay: 0,
                onEnd: (event) => {
                    // const oldItem = this.dropCol[evt.oldIndex]
                    // this.dropCol.splice(evt.oldIndex, 1)
                    // this.dropCol.splice(evt.newIndex, 0, oldItem)
                }
            })
        }
    },

    mounted() {
        window.removeEventListener('resize', function () { });
        window.addEventListener('resize', () => {
            this.resize();
        });
        // document.body.ondrag = function (event) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // }

        this.resize();
        this.bindMethods();
        this.$nextTick(()=>setTimeout(()=> {
            
            window.$crud && window.$crud.$bus && window.$crud.$bus.$on('cl-send-filter-data', value => {
                this.filterData = value
            })
        }, 200))


        // setTimeout(()=> {
        //     this.rowDrop()
        // }, 2000)
    },
    beforeDestroy() {
        window.$crud && window.$crud.$bus && window.$crud.$bus?.$off('cl-send-filter-data')
    },

    render(h) {
        const { data, op, loading, on, props, refresh, scopedSlots } = this.table;
        const { columnEl, opEl } = this.renderEl(h);

        return (
            this.table.visible && (
                <div class="crud-data-table">
                    {
                        refresh && (<el-table
                            ref="table"
                            data={data}
                            on-row-contextmenu={this.onRowContextMenu}
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
                        </el-table>)
                    }
                </div>

            )
        );
    }
};