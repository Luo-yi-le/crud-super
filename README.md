# CrudSuper

### <a href="CHANGELOG.md">更新日志</a>
### [更新日志](/CHANGELOG.md)
### [组件](/component.md)

## 封装增删改查 Vue 2.X + ElementUI 2.X

## 安装
```shell
npm install crud-super
yarn add crud-super

```

## 快速引入
``` javascript
import Vue from 'vue'
import Element from 'element-ui'
import crudSuper from 'crud-super'          //引入组件 
require('crud-super/lib/crud-super.css')    //引入样式

Vue.use(crudSuper)                          //使用样式

```


## 使用组件
``` vue
<template>
    <cl-crud @load="load">
        <!-- auto 默认为true 自动获取查询或者清除查询条件 -->
        <cl-filter :auto='true'/>

        <!-- auto 为false 时 可自定查询、清除事件 @search  @reset -->
         <cl-filter :auto='false' @search='search' @reset='reset'/>
        <!-- 重写某表格某字段 -->
        <template #table-column-code="{ scope }">
            <div>{{scope.row.code}}</div>
        </template>


        <template #slot-copy="{ scope }">
            <el-button @click="copy(scope.row)">复制</el-button>
        </template>

        <template #slot-component="{ scope }">
            <el-input v-model="scope.code"></el-input>
        </template>
        
        
    </cl-crud>
</template>

<script>
    export default {
        data() {
            return {
                crud: null,
            }
        },

        methods: {
            load({ ctx, app }) {
                this.crud = app;
                //设置表格
                ctx.set('layout', [
                    [
                        ['add-btn', 'multi-delete-btn', 'flex1', 'columns-btn'], 
                        ['data-table'], 
                        ['flex1', 'pagination']
                    ]
                ])
                //设置权限，与dict下的api中的函数同名， multiDelete除外
                .set('permission', {
                    add: ['xxx:xxx', 'add'],
                    multiDelete: ['delete'], //批量删除按钮权限
                    ...
                })
                .dict({
                    api: {
                        add:(data)=>{
                            //提交错误后的处理: 下同； return Promise.resolve({ type: 'warning', msg: '请填写完整' })
                            return Promise.resolve()
                        },
                        info:(data)=>{
                            return Promise.resolve()
                        },
                        update:(data)=>{
                            return Promise.resolve()
                        },
                        delete:(data)=>{
                            return Promise.resolve()
                        },
                    }
                })
                .set('filter', {
                    // 默认按钮 可自定义 
                    // 例如 slot-xxx
                    buttons: ['search', 'reset'],
                    // 表单参数
                    form: {},
                    // el-form 属性
                    props: {
                        
                    },
                    // 筛选条件
                    // 与upsert中items相同
                    items: [
                        {
                            prop: "code",
                            label: "编号",
                            isfilter: true, //是否为筛选条件，自动被<cl-filter/>组件捕获
                            span: 8,        //el-col 属性
                            hidden: (scope)=>{ return false }, //条件显示
                            component: {
                                name: "el-input",  //组件名称
                                //组件可用属性
                                attrs: {
                                    placeholder: "请输入编号",
                                },
                                //组件事件
                                on: {

                                }
                            },
                            //表单校验
                            rules: [{
                                required: true,
                                message: "编号不能为空",
                            },]
                        },
                    ]
                })
                .set('table', {
                    //表格右键菜单事件
                    menu: {
                        visible: false, //是否启用

                        //按钮列表 order-asc对应el-table筛选属性
                        buttons: ["view", "refresh", "check", "edit", "delete", "order-asc", "order-desc"]
                    },
                    //是否显示
                    visible: true, 
                    columns: [
                        {
                            type: "selection",
                            align: "center",
                            width: "60",
                        },
                         {
                            prop: "code",
                            label: "编号",
                            align: "left",
                            view: true,       //是否可点击查看
                            "min-width": 150,
                            formatter: (row) => {
                                // do...
                            },
                            dict: [{value: '值', lable: '显示文本'}] //针对表格数据中存在选择项 例如：select

                            //... 可查询el-table可用属性
                        },
                    ],
                    //可查询el-table可用属性
                    props: {
                        rowKey: 'id'
                    },
                    //可查询el-table可用事件
                    on: {
                        "selection-change": ()=> {},
                    },
                    //表格操作项： 修改删除
                    op: {
                        props: {
                            width: 150,
                            align: 'center',
                            fixed: 'right',
                            label: '操作',
                        },
                        visible: true, //是否显示
                        layout: ['edit', 'delete', 'slot-copy'], //按钮组件，可自定义。例如： slot-copy
                        hidden: ({ row }, btn)=> {} //针对业务对按钮显示、隐藏。可以使用：hidden: false
                    }
                })
                //弹出框
                .set('upsert', {
                    //el-dialog 可用属性
                    props: {
                        // 追加标题，不重设title前提可以
                        renderTitle: 'xxx',
                        //标题， 不与renderTitle同时使用
                        title: '标题'
                    },
                    items: [
                        {
                            prop: "code",
                            label: "编号",
                            isfilter: true, //是否为筛选条件，自动被<cl-filter/>组件捕获
                            span: 8,        //el-col 属性
                            hidden: (scope)=>{ return false }, //条件显示
                            component: {
                                name: "el-input",  //组件名称
                                //组件可用属性
                                attrs: {
                                    placeholder: "请输入编号",
                                },
                                //组件事件
                                on: {

                                }
                            },
                            //表单校验
                            rules: [{
                                required: true,
                                message: "编号不能为空",
                            },]
                        },
                        {
                            prop: "code",
                            label: "编号",
                            span: 8,        //el-col 属性
                            hidden: (scope)=>{ return false }, //条件显示
                            component: {
                                name: "slot-component",  //自定义组件，必须使用"slot-"前缀
                            },
                            //表单校验
                            rules: [{
                                required: true,
                                message: "编号不能为空",
                            },]
                        },

                        {
                            prop: "code",
                            label: "编号",
                            span: 8,        //el-col 属性
                            hidden: (scope)=>{ return false }, //条件显示
                            component: {
                                vm:({ scope, h }) => { //自定义
                                    return h('div', {
                                    }, scope.code)
                                },
                                //或者使用jsx 语法
                                vm: ({ scope, h }) => {
                                    return (
                                        <el-input v-model={scope.code} />
                                    )
                                },
                            },
                            //表单校验，请参考el-form表单校验
                            rules: [{
                                required: true,
                                message: "编号不能为空",
                            },]
                        },
                    ]
                })
                //关闭弹框后的事件
                .on('close', () => {
                })
                //打开弹框前的事件
                .on('open', () => {
                })
                //重写提交事件
                .on('submit', () => {
                })
                //刷新
                .on('refresh', async (params/**默认参数 */, { render }) => {
                    render([] /**数据 */, { total: 0, pageSize: 1 }/**分页 */)
                })
                .done() //结束

                app.refresh(); //刷新
            },
            copy(data) {},

            search({data, done}) {
                Object.assign(data, {test: '自定义'})
                done(data)
            },
            reset({data, done}) {
                Object.assign(data, {test: '自定义'})
                done(data)
            },
        }
    }
</script>
```
