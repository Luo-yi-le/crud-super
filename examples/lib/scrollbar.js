export default {
    name: 'cl-scrollbar',
    props: {
        overflowX: String,
        overflowY: String,
        overflow: String,
        height: {
            type:String,
            default: '100%'
        },
        className:  {
            type:String,
            default: ''
        },
    },
    render() {
        const overflowX = this.overflowX ? 'cl-overflow-x' : '';
        const overflowY = this.overflowY ? 'cl-overflow-y' : '';
        const overflow = this.overflow ? 'cl-overflow-x-y' : '';
        const style = {
            height: this.height,
            '--cl-overflow-x' : this.overflowX,
            '--cl-overflow-y' : this.overflowY,
            '--cl-overflow-x-y' : this.overflow,
        }
        return (
            <div class={['cl-scrollbar', this.className]} style={style}>
                <el-scrollbar class={[overflowX ,overflowY, overflow]}>
                    {
                        this.$slots.default
                    }
                </el-scrollbar>
            </div>

        );
    }
}