import Universally from '@/mixins/universally'
export default {
    mixins: [Universally],
    name: 'cl-refresh-btn',

    inject: ['crud'],

    render() {
        return (
            <el-button
                plain
                size={this.isSize} 
                disabled={this.isDisabled}
                on-click={() => {
                    this.crud.refresh();
                }}>
                {this.crud.dict.label.refresh}
            </el-button>
        );
    }
};