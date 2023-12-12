import AdvSearch from '../adv-search.js';

import Universally from '@/mixins/universally'
export default {
    mixins: [Universally],
    name: 'cl-adv-btn',
    inject: ['crud'],

    components: {
        AdvSearch
    },

    render() {
        const { openAdvSearch, dict, permission } = this.crud;

        return permission.advSearch && (
            <div v-check-premi={permission.advSearch} class="crud-adv-btn">
                <el-button plain size={this.isSize} disabled={this.isDisabled}  on-click={openAdvSearch}>
                    <i class="el-icon-search" />
                    {dict.label.advSearch}
                </el-button>
            </div>
        );
    }
};