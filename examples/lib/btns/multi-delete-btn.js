
import Universally from '@/mixins/universally'
export default {
    mixins: [Universally],
    name: 'cl-multi-delete-btn',

    inject: ['crud'],

    render() {
        let { dict, deleteMulti, table, permission } = this.crud;

        return (
            permission.multiDelete && (
                <el-button
                    v-check-premi={permission.multiDelete}
                    plain
                    size={this.isSize} 
                    type="danger"
                    disabled={table.selection.length == 0 || this.isDisabled}
                    on-click={deleteMulti}>
                    {dict.label.delete}
                </el-button>
            )
        );
    }
};