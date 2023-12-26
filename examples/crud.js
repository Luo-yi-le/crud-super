/**!
 * @description 组件处理逻辑
 * @author	wulingshan
 * @license ISC
 */


import {
    deepMerge,
    print,
    renderNode,
    cloneDeep,
    isArray,
    getParent,
    isObject,
    isFunction,
    isBoolean,
    clone,
} from '@/utils';
import { __event } from '@/options';
import Query from '@/lib/query';
import AdvSearch from '@/lib/adv-search';
import DataTable from '@/lib/table';
import Upsert from '@/lib/upsert';
import Flex1 from '@/lib/flex1';
import { MultiDeleteBtn, AddBtn, ColumnsBtn, RefreshBtn, AdvBtn, ExpandAllBtn, ToggleBtn } from '@/lib/btns/index'
import Pagination from '@/lib/pagination';
import SearchKey from '@/lib/search-key';
import ErrorMessage from '@/lib/error-message';
import MenuTree from '@/lib/menu-tree';
import { InputSearch, InputSwitch } from '@/lib/inputs/index';
import { bootstrap } from '@/app';
import ClFilter from '@/lib/filter';
import EdiTable from '@/lib/editable';
import Universally from '@/mixins/universally'
require('./assets/css/index.css');
export default function ({ __crud, __components, __store, version }) {
    return {
        mixins: [Universally],
        name: 'cl-crud',
        componentName: 'ClCrud',

        props: {
            toggleHideNum: {
                default: 4,
                type: Number
            },
            name: String,
            // 开启右键菜单
            contextMenu: {
                type: [Boolean, Array],
                default: undefined
            },
            size: {
                type: String,
                default: 'small'
            }
        },

        provide() {
            return {
                crud: this,
            };
        },

        data() {
            return {
                version,
                id: this.name,
                service: null,
                viewing: false,
                __store: __store,
                conf: {
                    UPSERT_REFRESH: true,
                    DELETE_REFRESH: true,
                },
                permission: {},
                fn: {
                    open: null,
                    close: null,
                    submit: null,
                    refresh: null,
                    delete: null,
                    info: null,
                    permission: null,
                    advSearch: null,
                    advReset: null,
                    advOpen: null,
                    advClose: null,
                    resize: null,
                    done: null,
                    view: null,

                },
                event: {},
                dict: {
                    api: {
                        list: 'list',
                        add: 'add',
                        update: 'update',
                        delete: 'delete',
                        info: 'info',
                        page: 'page',
                    },
                    pagination: {
                        page: 'pageNum',
                        size: 'pageSize',
                    },
                    search: {
                        keyWord: 'keyWord',
                        query: 'query',
                    },
                    sort: {
                        order: 'order',
                        prop: 'prop',
                    },
                    label: {
                        add: '新 增',
                        delete: '删 除',
                        update: '修 改',
                        refresh: '刷 新',
                        advSearch: '高级搜索',
                        view: '查 看',
                        isExpandAll: '展开/折叠'
                    },
                },
                closeTips: {
                    // all: false,
                    add: false,
                    delete: false,
                    update: false
                },
                tips: {
                    add: {
                        success: '新增成功',
                        error: '',
                    },
                    update: {
                        success: '修改成功',
                        error: '',
                    },
                    delete: {
                        confirm: '此操作将永久删除选中数据，是否继续？',
                        success: '删除成功',
                        error: '',
                    },
                },
                table: {
                    menu: {
                        visible: false,
                        buttons: ["view", "refresh", "check", "edit", "delete", "order-asc", "order-desc"]
                    },
                    sortable: {
                        sort: false,
                        columns: [],
                    },

                    refresh: true,
                    visible: true,
                    loading: false,
                    data: [],
                    columns: [],
                    selection: [],
                    props: {
                        border: true,
                        stripe: false,
                        size: this.isSize,
                        'default-expand-all': true,
                        'element-loading-text': '拼命加载中...',
                        'element-loading-background': 'rgba(255, 255, 255, 0.7)',
                        'element-loading-spinner': 'el-icon-loading',
                    },
                    on: {},
                    op: {
                        view: false,
                        props: {
                            width: 150,
                            align: 'center',
                            fixed: 'right',
                            label: '操作',
                        },
                        visible: true,
                        layout: ['edit', 'delete'],
                    },
                    scopedSlots: {},
                },
                search: {
                    query: {
                        list: [],
                        value: null,
                        multiple: false,
                        callback: null,
                    },

                    key: {
                        placeholder: '请输入关键字',
                        selected: '',
                        value: '',
                        list: [],
                        props: {},
                    },

                    adv: {
                        title: '高级搜索',
                        visible: false,
                        type: 'drawer',
                        items: [],
                        form: {},
                        props: {
                            size: this.isSize,
                            'label-width': '120px',
                        },
                        op: {
                            visible: false,
                            confirmButtonText: '确定',
                            resetButtonText: '重置',
                            'label-width': '120px',
                        },
                    },
                },
                upsert: {
                    form: {},
                    items: [],
                    props: {
                        drag: true,
                        width: '',
                        size: this.isSize,
                        'label-width': '80px',
                        'append-to-body': true,
                        'close-on-click-modal': false,
                        'destroy-on-close': true,
                    },
                    hdr: {
                        layout: ['fullscreen', 'close'],
                    },
                    op: {
                        confirmButtonText: '保存',
                        cancelButtonText: '取消',
                        visible: true,
                        layout: ['cancel', 'confirm'],
                    },
                },
                pagination: {
                    props: {
                        background: true,
                        small: false,
                        layout: 'total, sizes, prev, pager, next, jumper',
                        'page-sizes': [10, 20, 30, 40, 50],
                    },
                    pageSize: 10,
                    pageNum: 1,
                    total: 0,
                },
                layout: [
                    [
                        'refresh-btn',
                        'add-btn',
                        'multi-delete-btn',
                        'query',
                        'flex1',
                        'search-key',
                        'adv-btn',
                    ],
                    ['data-table'],
                    ['flex1', 'pagination'],
                ],
                filter: {
                    form: {

                    },
                    items: [],
                    props: {
                        inline: true,
                        size: this.isSize,
                        labelWidth: '80px',
                    },
                    btnCol: {
                        span: 12,
                    },
                    buttons: ['search', 'reset'],
                },
                refs: {},
                params: {},
                temp: {
                    refreshRd: null,
                    sortLock: false,
                },
                process: {
                    status: false,
                },

                editable: {
                    menu: {
                        visible: false,
                        buttons: ["view", "refresh", "check", "edit", "delete", "order-asc", "order-desc"]
                    },
                    sortable: {
                        sort: false,
                        columns: [],
                    },

                    refresh: true,
                    visible: true,
                    loading: false,
                    data: [],
                    columns: [],
                    selection: [],
                    props: {
                        border: true,
                        stripe: false,
                        size: this.isSize,
                        'default-expand-all': true,
                        'element-loading-text': '拼命加载中...',
                        'element-loading-background': 'rgba(255, 255, 255, 0.7)',
                        'element-loading-spinner': 'el-icon-loading',
                    },
                    on: {},
                    op: {
                        view: false,
                        props: {
                            width: 150,
                            align: 'center',
                            fixed: 'right',
                            label: '操作',
                        },
                        visible: true,
                        layout: ['edit', 'delete'],
                    },
                    scopedSlots: {},
                },

            };
        },

        components: {
            Query,
            AdvSearch,
            DataTable,
            Upsert,
            RefreshBtn,
            AddBtn,
            MultiDeleteBtn,
            SearchKey,
            AdvBtn,
            Pagination,
            Flex1,
            ErrorMessage,
            MenuTree,
            ExpandAllBtn,
            ColumnsBtn,
            InputSearch,
            InputSwitch,
            ClFilter,
            ToggleBtn,
            EdiTable,
            ...__components,
        },

        beforeCreate() {
            // 注入 $crud
            for (let i in __components) {
                const { beforeCreate } = __components[i];

                __components[i].beforeCreate = function (flag) {
                    if (flag) {
                        return false;
                    }

                    this.$crud = {
                        ...this.$crud,
                        ...bootstrap(getParent.call(this, 'ClCrud')),
                    };

                    if (beforeCreate) {
                        if (isArray(beforeCreate)) {
                            beforeCreate.map((e) => {
                                e.call(this, true);
                            });
                        } else {
                            beforeCreate.call(this, true);
                        }
                    }
                };
            }
        },
        created() {
            this.$on("table.selection-change", ({ selection }) => {
                this.table.selection = selection;
            });
            this.$on("editable.selection-change", ({ selection }) => {
                this.editable.selection = selection;
            });
        },


        mounted() {
            // 相应参数
            const res = bootstrap(deepMerge(this, __crud));
            // 加载回调
            this.$emit('load', res);

            // 注册事件
            for (let i in this.event) {
                let d = this.event[i];
                let mode = null;
                let callback = null;

                if (isObject(d)) {
                    mode = d.mode;
                    callback = d.callback;
                } else {
                    mode = 'on';
                    callback = d;
                }

                if (!['on', 'once'].includes(mode)) {
                    return console.error(`Event[${i}].mode must be (on / once)`);
                }

                if (!isFunction(callback)) {
                    return console.error(`Event[${i}].callback is not a function`);
                }

                __event[`$${mode}`](i, (data) => {
                    callback(data, res);
                });
            }
        },

        methods: {
            // 检查是否有权限
            getPermission(key) {
                switch (key) {
                    case 'edit':
                    case 'update':
                        return this.permission['update'];
                    default:
                        return this.permission[key];
                }
            },

            // 获取标签
            getLabel(key) {
                switch (key) {
                    case 'edit':
                    case 'update':
                        return this.dict.label['update'];
                    default:
                        return this.dict.label[key];
                }
            },

            tableView() {
                this.viewing = true
                this.$refs['table'].view();
            },

            rowView(e) {
                this.viewing = true
                this.$refs['upsert'].view(e);
            },

            // 新增
            rowAdd(e) {
                this.$refs['upsert'].add(e);
            },

            filterData() {
                this.$refs['clFilter'] && this.$refs['clFilter'].get();
            },
            // 编辑
            rowEdit(e) {
                this.$refs['upsert'].edit(e);
            },

            // 查看
            rowView(e) {
                this.viewing = true
                this.$refs['upsert'].view(e);
            },


            // 追加
            rowAppend(e) {
                this.$refs['upsert'].append(e);
            },

            // 关闭
            rowClose() {
                this.viewing = false
                this.$refs['upsert'].close();
            },

            // 删除
            rowDelete(...selection) {
                const tips = this.tips.delete;
                let params = {
                    ids: selection.map((e) => e.id).join(','),
                    // index
                };
                const closeTips = this.closeTips;
                const next = (params) => {
                    return new Promise((resolve, reject) => {
                        if (!closeTips.delete) {
                            this.$confirm(tips.confirm, '提示', {
                                type: 'warning',
                            })
                                .then((res) => {
                                    if (res === 'confirm') {
                                        const reqName = this.dict.api.delete;

                                        if (typeof reqName === 'function') {
                                            reqName(selection, params)
                                                .then((res) => {
                                                    if (res.type == 'warning') {
                                                        this.$message.warning(res.msg);
                                                    } else {
                                                        this.$message.success(tips.success)

                                                        resolve(res);
                                                    }

                                                })
                                                .catch((err) => {
                                                    this.$message.error(tips.error || err);
                                                    reject(err);
                                                });
                                        } else

                                            if (!this.service[reqName]) {
                                                return reject(`Request function '${reqName}' is not fount`);
                                            } else {

                                                this.service[reqName](params)
                                                    .then((res) => {
                                                        this.$message.success(tips.success);

                                                        if (this.conf['DELETE_REFRESH']) {
                                                            this.refresh();
                                                        }

                                                        resolve(res);
                                                    })
                                                    .catch((err) => {
                                                        this.$message.error(tips.error || err);
                                                        reject(err);
                                                    });
                                            }
                                    }
                                })
                                .catch(() => { });
                        } else {
                            const reqName = this.dict.api.delete;
                            const messageType = ['warning', 'error']
                            if (typeof reqName === 'function') {
                                reqName(selection, params)
                                    .then((res) => {
                                        const type = res.type ? res.type.toLowerCase(): 'success';
                                        if (messageType.includes(type)) {
                                            this.$message[type](res.msg);
                                        } else {
                                            resolve(res);
                                        }

                                    })
                                    .catch((err) => {
                                        this.$message.error(tips.error || err);
                                        reject(err);
                                    });
                            } else

                                if (!this.service[reqName]) {
                                    return reject(`Request function '${reqName}' is not fount`);
                                } else {

                                    this.service[reqName](params)
                                        .then((res) => {
                                            this.$message.success(tips.success);

                                            if (this.conf['DELETE_REFRESH']) {
                                                this.refresh();
                                            }

                                            resolve(res);
                                        })
                                        .catch((err) => {
                                            this.$message.error(tips.error || err);
                                            reject(err);
                                        });
                                }
                        }

                    });
                };

                if (this.fn.delete) {
                    this.fn.delete(selection, { next });
                } else {
                    next(params);
                }
            },

            // 批量删除
            deleteMulti() {
                this.rowDelete.apply(this, this.table.selection || []);
            },

            // 打开高级搜索
            openAdvSearch() {
                this.$refs['adv-search'].open();
            },

            // 关闭高级搜索
            closeAdvSearch() {
                this.$refs['adv-search'].close();
            },

            // 改变排序
            changeSort(prop, order) {
                if (order === 'desc') {
                    order = 'descending';
                }

                if (order === 'asc') {
                    order = 'ascending';
                }

                this.$refs['table'].sort(this.table.sort.prop, '');
                this.$refs['table'].sort(prop, order);

                this.table.sort = {
                    prop,
                    order,
                };
            },

            // 排序刷新
            sortChange({ prop, order }) {
                if (order === 'descending') {
                    order = 'desc';
                }

                if (order === 'ascending') {
                    order = 'asc';
                }

                if (this.temp.sortLock) {
                    this.refresh({
                        sort: order,
                        order: prop,
                        // order,
                        page: 1,
                    });
                }
            },

            setTitle(title) {
                this.$set(this.upsert.props, 'title', title);
            },
            setUpsertBtns(btns = ['cancel', 'confirm']) {
                this.$set(this.upsert.op, 'layout', btns);
            },

            // 清空排序条件
            clearSort() {
                this.$refs['table'].clearSort();
            },

            // 替换请求参数字典
            paramsReplace(params) {
                const { pagination, search, sort } = this.dict;
                let a = { ...params };
                let b = { ...pagination, ...search, ...sort };

                for (let i in b) {
                    if (a.hasOwnProperty(i)) {
                        if (i != b[i]) {
                            a[`_${b[i]}`] = a[i];

                            delete a[i];
                        }
                    }
                }

                for (let i in a) {
                    if (i[0] === '_') {
                        a[i.substr(1)] = a[i];

                        delete a[i];
                    }
                }

                return a;
            },

            toggleExpandAll(d) {
                this.table.refresh = false;
                this.table.props['default-expand-all'] = isBoolean(d) || !this.table.props['default-expand-all'];
                this.$nextTick(() => {
                    this.table.refresh = true;
                });

            },
            refresh(newParams) {
                const { page, size } = this.dict.pagination
                // 分页属性
                this.params[page] = this.pagination[page];
                this.params[size] = this.pagination[size];

                // 设置参数
                let params = this.paramsReplace(deepMerge(this.params, newParams));

                print('请求参数', params);

                // Loading
                this.table.loading = true;

                // 预防脏数据
                let rd = (this.temp.refreshRd = Math.random());

                // 完成事件
                const done = () => {
                    this.table.loading = false;
                };

                // 渲染
                const render = (list, pagination) => {
                    // 设置分页
                    if (pagination) {
                        Object.assign(this.pagination, pagination);
                    }

                    // 渲染列表
                    this.table.data = list;
                    done();
                };
                // 请求执行
                const next = (params) => {
                    return new Promise((resolve, reject) => {
                        const reqName = this.dict.api.page;

                        if (!this.service[reqName]) {
                            this.table.loading = false;

                            return reject(`Request function '${reqName}' is not fount`);
                        }

                        this.service[reqName](params)
                            .then((res) => {
                                if (rd != this.temp.refreshRd) {
                                    return false;
                                }
                                render(cloneDeep(res.rows), res.pagination);
                                resolve(res);
                            })
                            .catch((err) => {
                                this.$message.error(err);
                                reject(err);
                            })
                            .done(() => {
                                done();
                                this.temp.sortLock = true;
                            });
                    });
                };

                if (this.fn.refresh) {
                    return this.fn.refresh(params, { next, done, render });
                } else {
                    return next(params);
                }
            },

            done() {
                this.process.status = true;

                this.$nextTick(() => {
                    if (this.fn.done) {
                        this.fn.done();
                    }
                });
            },
        },

        render() {
            const rn = (vnode) => {
                if (vnode === 'data-table') {
                    return (
                        <data-table
                            ref="table"
                            {...{
                                scopedSlots: this.$scopedSlots,
                                on: {
                                    'sort-change': (event) => { this.sortChange(event) },
                                },
                            }}
                        />
                    );
                } else {
                    return renderNode.call(this, vnode);
                }
            };

            const template = this.layout.map((e, i) => {
                // if(this.viewing && i ===0) return null;
                if (e instanceof Array) {
                    return (
                        <el-row type="flex" class={`el-row--${i}`}>
                            {e.map(rn)}

                        </el-row>

                    );
                } else {
                    return rn(e);
                }
            });

            return (
                this.process.status && (
                    <el-row>
                        <el-col >
                            {this.$slots.default}
                        </el-col>
                        <el-col>
                            <div class="cl-crud" >
                                {template}

                                <adv-search ref="adv-search" />
                                <upsert ref="upsert" />
                            </div>
                        </el-col>
                    </el-row>


                )
            );
        },
    };
}