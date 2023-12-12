/**
 * @description 表格列隐藏显示组件
 * @name ColumnsBtn
 * @author	wulingshan
 * @license ISC
 */
import Universally from "@/mixins/universally";

export default {
    name: 'cl-columns-btn',
    mixins: [Universally],
    inject: ['crud'],
    data() {
        return {
            columns: [],
            value: [],
        }
    },

    mounted() {
        this.setColumns()
    },

    computed: {

        table() {
            return this.crud.table;
        }
    },


    methods: {
        setColumns() {
            this.columns = []
            const { columns } = this.table;
            const types = ['selection', 'index','expand', 'radio']
            const props = ['radio']
            columns.forEach((item, index) => {
                if (!item.type && item.prop && !types.includes(item.prop)) {
                    if(typeof item.furl == 'boolean' && item.furl) {
                        this.value.push(item.prop)
                    }
                    this.columns.push({
                        key: item.prop,
                        ...item,
                        disabled: item.hidden ? item.hidden : false,
                    })
                }
            })


        },
        dataChange(data, direction, movedKeys) {
            // console.log(data, direction, movedKeys)
            const { columns } = this.table;
            for (let item in this.columns) {
                const prop = this.columns[item].prop;
                this.columns[item].hide = data.includes(prop);
            }

            columns.forEach((item, index) => {
                if (!item.type && item.prop) {
                    const prop = columns[index].prop;
                    columns[index].hide = data.includes(prop);
                }

            })
            this.crud.toggleExpandAll();
            this.crud.$refs.table.doLayout()
        }
    },

    render() {
        // let { dict, table, permission } = this.crud;
        return (
            <el-form>
                <el-tooltip class="item" effect="dark" content='显示隐藏表格列' placement="top">
                    <el-popover
                        placement="left"
                        width="610"
                        trigger="click">
                        <el-transfer
                            titles={['已显示', '已隐藏']}
                            props={{
                                key: 'prop',
                                label: 'label',
                                disabled: 'disabled'
                            }}
                            v-model={this.value}
                            data={this.columns}
                            on-change={this.dataChange}
                        ></el-transfer>

                        <el-button disabled={this.isDisabled} size={this.isSize} circle icon="el-icon-menu" slot="reference"></el-button>
                    </el-popover>
                </el-tooltip>
            </el-form>

        );
    },

};