
import Universally from '@/mixins/universally';
import Bus from '@/mixins/bus';

export default {
    name: 'cl-toggle-btn',
    inject: ['crud'],
    mixins: [Universally, Bus],
    data() {
        return {
            showSearch: false,
        }
    },
    computed: {
        filter() {
            return this?.crud?.filter || { items: [] }
        },

        filterItem() {
            return this?.filter.items
        }
    },

    methods: {
        // 搜索
        toggleSearch() {
            this.showSearch = !this.showSearch;
        },
    },
    watch: {
        showSearch: {
            handler(value) {
                this.sendToggleData(value)

            },
            deep: true,
            immediate: true,
        },
        filterItem: {
            handler(value) {
                // console.log(value)
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.showSearch = this?.filter?.items?.length < this.crud.toggleHideNum
        })
    },

    render() {
        const showSearch = this?.filter?.items?.length < this.crud.toggleHideNum
        return showSearch && (
            <div class='cl-toggle-btn'>
                <el-tooltip class="item" effect="dark" content={this.showSearch ? '隐藏搜索条件' : '显示搜索条件'} placement="top">
                    <el-button {...{ on: { click: this.toggleSearch } }} circle icon="el-icon-search" size={this.isSize} />
                </el-tooltip>
            </div>
        );
    }
};