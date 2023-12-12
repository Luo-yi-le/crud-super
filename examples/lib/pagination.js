export default {
    name: 'cl-pagination',

    inject: ['crud'],

    methods: {
        currentChange(index) {
            this.crud.refresh({
                page: index
            });
        },

        sizeChange(size) {
            this.crud.pagination.size = size;
            this.crud.pagination.pageSize = size;
            this.crud.refresh({
                size,
                pageSize: size
            });
        }
    },

    render() {
        const { props, page, size, total } = this.crud.pagination;

        return (
            <el-pagination
                on-size-change={this.sizeChange}
                on-current-change={this.currentChange}
                {...{
                    props: {
                        ...props
                    }
                }}
                current-page={page}
                page-size={size}
                total={total}
            />
        );
    }
};