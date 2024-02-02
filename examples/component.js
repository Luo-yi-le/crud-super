import { getInstance } from '@/utils';
import Form from '@/lib/form';
import Table from '@/lib/table';
import Upsert from '@/lib/upsert';
import MenuTree from '@/lib/menu-tree';
import Tree from '@/lib/cl-tree/tree'
import TreeNode from '@/lib/cl-tree/tree-node'
import flex1 from '@/lib/flex1';
import Scrollbar from "@/lib/scrollbar";
import { InputSearch, InputSwitch, ClInput } from '@/lib/inputs/index';
import Filter from '@/lib/filter';
import Divider from '@/lib/divider';
import '@/assets/css/index.css'
import ClText from '@/lib/text'
import ClTeleport from '@/lib/teleport';
import TableVirtualScroll from '@/lib/table-virtual-scroll';
import ClSelect from '@/lib/select';
import ContextMenu from "@/lib/context-menu";
import ClTreeSelect from '@/lib/tree-select';
export default  (Vue, option) => {
    
    // 自定义表单组件
    Vue.component('cl-input', ClInput);
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
    Vue.component('cl-teleport', ClTeleport)
    Vue.component('cl-scrollbar', Scrollbar);



    Vue.component(ClSelect.name, ClSelect);
    Vue.component(ClTreeSelect.name, ClTreeSelect);

    Vue.component(TableVirtualScroll.name, TableVirtualScroll);
}