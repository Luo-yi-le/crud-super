import { __crud, __vue, __components, __plugins, __event, __store, __getters } from '@/options';
import { deepMerge, vue, getInstance } from '@/utils';
import * as utils from '@/utils';
import validator from '@/utils/validator'
import { DialogDrag, hasPermi, hasRole, contextmenu } from '@/directive';
import Crud from '@/crud';
import ContextMenu from "@/lib/context-menu";
import filters from '@/filters';
import component from './component'
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

        component(Vue);

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
        
    },
};

export default CRUD;