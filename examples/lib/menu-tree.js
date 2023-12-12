import script from "@/utils/script";
export default {
    name: 'cl-menu-tree',
    model: {
        event: 'change',
        porp: 'update:value'
    },
	props: {
		value: [Number, String]
	},

    data() {
        return {
          keyname: '',
          keyword: '',
          list: [],
          expandedKeys: [],
        }
    },

    methods: {
        onCurrentChange({id, name}, node) {
            this.keyname = name;
            this.$emit('change', id)
			this.$crud.emit("update:value", id);
            
		},
        refresh() {
			this.$api.menu.list().then((res) => {
				const _list = res.filter((e) => e.type != 2);

				_list.unshift({
					name: "一级菜单",
					id: null,
                    // parentId: null,
				});

				this.list = _list;
			});
		},
        filterNode(value, { name }, node) {
			if (!value) return true;
			return name.indexOf(value) !== -1;
		},

        checkNode() {
            this.$refs.treeRef.setCurrentKey(this.value)
        },

    },
    computed: {
        name() {
           const item = this.list.find(e => e.id == this.value);
           return this.keyname ? this.keyname : (item ? item.name : "一级菜单")
			return item ? item.name : "一级菜单"; 
        },
        treeList() {
            return script.deepTree(this.list)
        },
    },

    watch: {
        keyword(val) {
            this.$refs.treeRef.filter(val);
        }
    },

    mounted() {
        this.refresh()
    },

	emits: ["update:value"],

    inject: ['crud'],

    render(h, cxt) {
        let { dict, deleteMulti, table, permission,  } = this.crud;
        return (
            <div class="cl-menu-tree">
                <el-popover
                    placement="bottom-start"
                    trigger="click"
                    width="500px"
                    popper-class="popper-menu-tree"
                >
                    
                    <el-input {...{
                        props: {
                            value: this.keyword,
                        },
                        attrs: {
                            readonly: false,
                            size: 'small',
                        },
                        on: {
                            input: ( event )=>{
                                this.keyword = event
                            },
                        }
                    }}>
                       <i {...{
                        slot: 'prefix'
                       }} class="el-input__icon el-icon-search"></i>
                    </el-input>
        
                    <el-tree
                        ref="treeRef"
                        {
                            ... {
                                attrs: {
                                    data: this.treeList,
                                    'node-key': 'parentId',
                                    'default-checked-keys': [],
                                    'highlight-current': true,
                                    'expand-on-click-node': false,
                                    'default-expanded-keys': this.expandedKeys,
                                    'filter-node-method': (value, data, node)=>{ return this.filterNode(value, data, node)},
                                    props:{
                                            label: 'name',
                                            children: 'children'
                                    }
                                    
                                },
                                on: {
                                    'current-change': (data, Node)=> {
                                        this.onCurrentChange(data, Node)
                                    },

                                }
                            }
                        }
                    >
                    </el-tree>
                    <el-input {...{
                        slot: 'reference',
                        attrs: {
                            readonly: true,
                            placeholder: '请选择',
                            value: this.name
                        }
                    }}/>
                </el-popover>
                
            </div>
        );
    }
};