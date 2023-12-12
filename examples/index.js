import { __crud, __vue, __components, __plugins, __event, __store, __getters } from '@/options';
import { deepMerge, vue, getInstance } from '@/utils';
import * as utils from '@/utils';
import validator from '@/utils/validator'
import { DialogDrag, hasPermi, hasRole, contextmenu } from '@/directive';
import Crud from '@/crud';
import Form from '@/lib/form';
import Table from '@/lib/table';
import Upsert from '@/lib/upsert';
import MenuTree from '@/lib/menu-tree';
import Tree from '@/lib/cl-tree/tree'
import TreeNode from '@/lib/cl-tree/tree-node'
import flex1 from '@/lib/flex1';
import ContextMenu from "@/lib/context-menu";
import Scrollbar from "@/lib/scrollbar";
import { InputSearch, InputSwitch } from '@/lib/inputs/index';
import Filter from '@/lib/filter';
import Divider from '@/lib/divider';
import '@/assets/css/index.css'
import filters from '@/filters';
import ClText from '@/lib/text'
require('@/common/index');
const version = require('../package.json').version;

export const CRUD = {
    version: version,

    install: function (Vue, options) {        
        const { crud, components, plugins, store, getters } = options || {};

        // 合并参数
        deepMerge(__crud, crud);
        deepMerge(__vue, Vue);
        deepMerge(__components, components);
        deepMerge(__plugins, plugins);
        deepMerge(__event, new Vue());
        deepMerge(__store, store);
        deepMerge(__getters, getters);
        

        // 窗口拖动指令
        Vue.directive('dialog-drag', DialogDrag);

        Vue.directive('check-premi', hasPermi);
        Vue.directive('check-role', hasRole);

        // crud 组件
        Vue.component('cl-crud', Crud({ __crud, __components, __store, version }));

        // 自定义表单组件
        Vue.component('cl-form', Form);

        Vue.component('cl-flex', flex1);

        Vue.component('cl-tree', Tree);
        Vue.component('cl-tree-node', TreeNode);

        // 自定义表单组件
        Vue.component('cl-upsert', Upsert);
        Vue.component('cl-table', Table);
        Vue.component('cl-filter', Filter);
        
        Vue.component('cl-menu-tree', MenuTree)
        Vue.component("cl-context-menu", ContextMenu);
        Vue.component("cl-input-search", InputSearch);
        Vue.component("cl-input-switch", InputSwitch);
        Vue.component('cl-text', ClText);
        Vue.component('cl-divider', Divider);

        // 挂载 $crud
        const contextMenu = getInstance(ContextMenu);
        Vue.directive("contextmenu", contextmenu(contextMenu));


        Object.keys(filters).forEach(key => {
            __vue.filter(key, filters[key])
        })

        const $crud = {
            version,
            emit: (name, callback) => {
                __event.$emit(name, callback);
            },
            $bus: new Vue(),
            ...vue,
            ...utils,
            validator,
            // $store: __store,
            openContextMenu: contextMenu.open
        };
        window.$crud = $crud

        Vue.prototype.$crud = $crud
        Vue.component('cl-scrollbar', Scrollbar);
    },
};

export default CRUD;