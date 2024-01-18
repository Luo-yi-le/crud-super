
import elFormProp from '@/mixins/elFormProp'
import { isArray } from '@/utils';
export default {
    model: {
        prop: 'value',
        event: 'change'
    },
    name: 'cl-tree-select',
    mixins: [elFormProp],
    props: {
        /* 初始选中值 */
        value: [String, Number, Array],
        /* 树形结构数据 */
        data: {
            type: Array,
            default: () => {
                return [];
            },
        },
        multiple: {
            type: Boolean,
            default: true,
        },

        checkStrictly: {
            type: Boolean,
            default: false,
        },

        /* 可清空选项 */
        clearable: {
            type: Boolean,
            default: true,
        },
        nodeKey: {
            type: String,
            default: 'id'
        },
        props: {
            type: Object,
            default: () => {
                return { children: 'children', label: 'name', disabled: 'disabled' }
            },
        },
        highlightCurrent: {
            type: Boolean,
            default: true
        },

        checkOnClickNode: {
            type: Boolean,
            default: true
        },

        checkIcon: {
            type: String,
            default: 'el-icon-check'
        },
        lazy: {
            type: Boolean,
            default: false
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        treeProps: {
            type: Object,
            default: () => {
                return {}
            }
        },
        selectProps: {
            type: Object,
            default: () => {
                return {}
            }
        },

        placeholder: {
            type: String,
            default: '请选择'
        },

        displayType: {
            type: String,
            default: 'text', // tag
        },
        tagType: {
            type: String,
            default: ''
        },

        textJoin: {
            type: String,
            default: ', '
        },
        nodeJoin: {
            type: String,
            default: '/'
        },
        intactNode: {
            type: Boolean,
            default: false
        },

        renderContent: Function,
        load: Function,
    },

    data() {
        return {
            defaultSelectedKeys: [], //初始选中值数组
            currentNodeKey: "",
            selectedLabel: null,
            modelValue: this.value
        }
    },

    watch: {
        value: {
            immediate: true,

            async handler(val) {
                await this.$nextTick()
                if (val && !this.elDisabled) {
                    let treeModelValue = []
                    if (isArray(val)) {
                        treeModelValue = val
                    } else {
                        treeModelValue = [val]
                    }

                    if (this.multiple) {
                        this.setCurrentKey(treeModelValue);

                    } else {
                        this.currentNodeKey = val
                        this.setCheckedKeys(treeModelValue);
                    }
                    this.defaultSelectedKeys = treeModelValue;
                }
            }
        },
        data(dt) {
            this.selectedLabel = this.getNodesText(dt, isArray(this.value) ? this.value : [this.value])
        }
    },
    async mounted() {
        await this.$nextTick()
        this.bindMethods()
    },

    methods: {
        bindMethods() {
            this.$nextTick(() => {
                const methods = [
                    "updateKeyChildren",
                    "filter",
                    "getCheckedNodes",
                    "setCheckedNodes",
                    "getCheckedKeys",
                    "setCheckedKeys",
                    "setChecked",
                    "getHalfCheckedNodes",
                    "getHalfCheckedKeys",
                    "getCurrentKey",
                    "getCurrentNode",
                    "setCurrentKey",
                    "setCurrentNode",
                    "getNode",
                    "remove",
                    "insertBefore",
                    "append",
                    "insertAfter",
                ];
                if (!this.elDisabled) {
                    methods.forEach((n) => {
                        this[n] = this.$refs["tree"][n];
                    });
                }

            })
        },

        getNodesText(data = this.data, modelValue = this.value, intactNode = this.intactNode, nodeJoin = this.nodeJoin) {
            let nodeText = [];
            const { label, children } = this.props
            const deep = (tree, modelValue, text) => {
                if (tree && tree.length) {
                    tree.forEach(e => {
                        const txt= (intactNode && text) ?  text + nodeJoin + e[label]: e[label]
                        if (modelValue.includes(e[this.nodeKey])) {
                            nodeText.unshift(txt)
                        }
                        deep(e[children], modelValue, txt)
                    })
                }
            }

            deep(data, modelValue)
            return nodeText
        },
        // 清除选中
        clearHandle() {
            this.selectedLabel = null;
            this.modelValue = "";
            this.defaultSelectedKeys = [];
            this.currentNodeKey = "";
            this.clearSelected();
            this.setCheckedKeys([]);
            this.setCurrentKey(""); // 设置默认选中
            this.$emit('change', this.modelValue)
        },
        /* 清空选中样式 */
        clearSelected() {
            const allNode = document.querySelectorAll("#clSelectTree .el-tree-node");
            allNode.forEach((element) => element.classList.remove("is-current"));
        },
        // select多选时移除某项操作
        removeTag(val) {
            this.setCheckedKeys([]);
        },
        // 点击叶子节点
        nodeClick(data, node, el) {
            const { label } = this.props
            this.selectedLabel = data[label];
            this.modelValue = data[this.nodeKey];
            this.$emit('change', this.modelValue)
        },
        // 节点选中操作
        checkNode(data, node, el) {
            const { label } = this.props
            const checkedNodes = this.getCheckedNodes();
            const keyArr = [];
            const valueArr = [];
            checkedNodes.forEach((item) => {
                keyArr.push(item[this.nodeKey]);
                valueArr.push(item[label]);
            });
            this.selectedLabel = valueArr;
            this.modelValue = keyArr;
            this.$emit('change', this.modelValue)
        },

        renderTreeContent(h, { node, data, store }) {
            return this.renderContent ? this.renderContent(h, { node, data, store })
                : this.$scopedSlots.default
                    ? this.$scopedSlots.default({ node, data, store })
                    : (<span class={['el-tree-node__label', (!this.multiple && node.checked) ? 'cl-tree-node-is-checked' : null]}>
                        {
                            !this.multiple && node.checked && (
                                <span style='margin-right: 10px;' class={['cl-tree-node-icon', this.checkIcon]}></span>
                            )
                        }
                        <span>{node.label}</span>
                    </span>)
        }
    },

    render() {
        const checkStrictly = this.multiple ? (this.checkStrictly) : true
        const treeEl = (
            <el-tree
                ref="tree"
                {
                ...{
                    attrs: this.$attrs,

                    props: Object.assign({
                        data: this.data,
                        props: this.props,
                        lazy: this.lazy,
                        load: this.load,
                        'empty-text': this.emptyText,
                        'highlight-current': this.highlightCurrent,
                        'node-key': this.nodeKey,
                        'check-strictly': checkStrictly,
                        'default-checked-keys': this.defaultSelectedKeys,
                        'default-expanded-keys': this.defaultSelectedKeys,
                        'render-content': this.renderTreeContent,
                        'show-checkbox': this.multiple,
                        'current-node-key': this.currentNodeKey,
                        'check-on-click-node': this.multiple,
                    }, this.treeProps),
                    on: {
                        check: this.checkNode,
                        'node-click': this.nodeClick
                    }
                }
                }
                id="clSelectTree" />
        );

        if (this.elDisabled) {
            const selectedLabel = this.selectedLabel ? (isArray(this.selectedLabel) ? this.selectedLabel : [this.selectedLabel]) : []
            const text = (<cl-text value={selectedLabel.join(this.textJoin)} />);
            let tag = (<cl-text value={selectedLabel.join(this.textJoin)} />);
            if (selectedLabel.length) {
                tag = selectedLabel.map(e => {
                    return <el-tag size={this.elSize} type={this.tagType}>{e}</el-tag>
                })
            }

            return this.displayType == 'tag' ? (<div class="cl-select-content">{tag}</div>) : text
        } else {
            return (
                <div class='cl-select-content'>
                    <el-select
                        ref='ClSelectTree'
                        {
                        ...{
                            props: Object.assign({
                                placeholder: this.placeholder,
                                disabled: this.elDisabled,
                                size: this.elSize,
                                multiple: this.multiple,
                                clearable: this.clearable,
                                'collapse-tags': this.multiple,
                                'popper-class': 'cl-tree-select',
                                'value-key': this.nodeKey,
                            }, this.selectProps)
                        }
                        }
                        v-model={this.selectedLabel}
                        on-clear={this.clearHandle}
                        on-remove-tag={this.removeTag}
                    >
                        <el-option value={this.selectKey}>
                            {treeEl}
                        </el-option>
                    </el-select>

                </div>)
        }
    }
}