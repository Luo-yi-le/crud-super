
import { IBootstrap, App, Context } from './lib/options'
import AddBtn from './lib/add-btn';
import AdvBtn from './lib/adv-btn';
import AdvSearch from './lib/adv-search';
import ColumnsBtn from './lib/columns-btn';
import ContextMenu from './lib/context-menu';
import ErrorMessage from './lib/error-message';
import ExpandaAllBtn from './lib/expand-all-btn';
import Flex1 from './lib/flex';
import ClForm from './lib/form';
import InputSearch from './lib/input-search';
import InputSwitch from './lib/input-switch';
import MenuTree from './lib/menu-tree';
import MultiDeleteBtn from './lib/multi-delete-btn';
import ClPagination from './lib/pagination';
import Query from './lib/query';
import RefreshBtn from './lib/refresh-btn';
import SearchKey from './lib/search-key';
import ClTabale from './lib/table';
import TreeNode from './lib/tree-node';
import ClTree from './lib/tree';
import ClUpsert from './lib/upsert';
import ClCrud from './lib/crud';
import ClScrollbar from './lib/scrollbar';
import ClDivider from './lib/divider';
import { bootstrap } from './lib/app'

export {
  AddBtn,
  AdvBtn,
  AdvSearch,
  ColumnsBtn,
  ContextMenu,
  ErrorMessage,
  ExpandaAllBtn,
  Flex1,
  ClForm,
  InputSearch,
  InputSwitch,
  MenuTree,
  MultiDeleteBtn,
  ClPagination,
  Query,
  RefreshBtn,
  SearchKey,
  ClTabale,
  TreeNode,
  ClTree,
  ClUpsert,
  ClScrollbar,
  ClDivider,
  bootstrap,
  ClCrud,
  IBootstrap,
  App,
  Context
};

export declare const CRUD: {
  version: string;

  install: (Vue: Vue, options: any) => {};
};
export default CRUD;
