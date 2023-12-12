export default {
    name: 'cl-scrollbar',
    props: {
        // overflowX: $crud.getPropString(),
        // overflowY: $crud.getPropString(),
        // overflow: $crud.getPropString(),
    },
    render() {
        // let overflow = null, overflowX = null, overflowY = null;

        // if (this.overflow) {
        //     overflowX = this.overflow;
        //     overflowY = this.overflow;
        // } else {
        //     if (overflowX) {
        //         overflowX = this.overflowX;
        //     }
        //     if (overflowY) {
        //         overflowY = this.overflowY;
        //     }
        // }
        return (
            <el-scrollbar class='cl-scrollbar'>
                {
                    this.$slots.default
                }
            </el-scrollbar>
        );
    }
}