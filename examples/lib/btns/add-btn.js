/**
 * @description 表格添加按钮
 * @name addBtn
 * @author	wulingshan
 * @license ISC
 */
import Universally from '@/mixins/universally'
export default {
    mixins: [Universally],
    name: 'cl-add-btn',
    inject: ['crud'],

    render() {
        const { rowAdd, dict, permission } = this.crud;
        return (
            permission.add && (
                <el-button plain disabled={this.isDisabled} v-check-premi={permission.add} size={this.isSize} type="primary" on-click={rowAdd}>
                    {dict.label.add}
                </el-button>
            )
        );
    }
};