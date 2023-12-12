import Universally from '@/mixins/universally'
export default {
    mixins: [Universally],
    name: 'cl-expand-all-btn',

    inject: ['crud'],

    render() {
        return (
            <el-button
                plain
                size={this.isSize} 
                disabled={this.isDisabled}
                on-click={() => {
                    this.crud.toggleExpandAll();
                }}>
                {this.crud.dict.label.isExpandAll}
            </el-button>
        );
    }
};