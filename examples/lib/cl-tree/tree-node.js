import { getNodeKey, flexColumnWidth } from '@/utils/index'
export default {
    name: 'cl-tree-node',
    inject: ['eventBus', 'crud'],
    props: {
        props: {
            type: Object,
            default() {
                return {}
            },
        },
        node: {
            type: Object,
            default() {
                return {}
            },
        },
        root: {
            type: Object,
            default() {
                return {}
            },
        },
        // 子节点是否可折叠
        showCollapsable: {
            type: Boolean,
            default: false,
        },
        // 判断是否是左子树的节点，样式需要改
        isLeftChildNode: {
            type: Boolean,
            default: false,
        },
        onlyLeft: {
            type: Boolean,
            default: false
        },
        // 树节点的内容区的渲染 Function
        renderContent: Function,
        // 展开节点的内容渲染 Function
        nodeBtnContent: Function,
        // 显示节点数
        showNodeNum: Boolean,
        // 树节点区域的宽度
        labelWidth: [String, Number],
        // 树节点区域的高度
        labelHeight: [String, Number],
        // 用来控制选择节点的字段名
        selectedKey: String,
        // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        nodeKey: String,
    },
    components: {
        NodeContent: {
            name: 'cl-node-content',
            props: {
                node: {
                    required: true,
                },
            },
            render(h) {
                const parent = this.$parent
                if (parent._props.renderContent) {
                    return parent._props.renderContent(h, this.node)
                } else {
                    return this.$scopedSlots.default(this.node)
                }
            },
        },
        // 渲染展开节点的样式
        NodeBtnContent: {
            props: {
                node: {
                    required: true,
                },
            },
            render(h) {
                const parent = this.$parent
                if (parent._props.nodeBtnContent) {
                    return parent._props.nodeBtnContent(h, this.node)
                } else {
                    if (this.$scopedSlots.default) {
                        return this.$scopedSlots.default(this.node)
                    }
                }
            },
        },
    },
    computed: {
        isLeaf() {
            if (this.node.level === 1) {
                if (
                    this.leftChildNodes.length == 0 &&
                    this.node.childNodes.length == 0
                ) {
                    return true
                } else {
                    return false
                }
            } else {
                return this.node.isLeaf
            }
        },
        leftChildNodes() {
            if (this.tree.store.onlyBothTree) {
                if (this.isLeftChildNode) {
                    return this.node.childNodes
                } else {
                    return this.node.leftChildNodes
                }
            }
            return []
        },
        animateName() {
            if (this.tree.store.animate) {
                return this.tree.store.animateName
            }
            return ''
        },
        animateDuration() {
            if (this.tree.store.animate) {
                return this.tree.store.animateDuration
            }
            return 0
        },
        // 是否显示展开按钮
        showNodeBtn() {
            if (this.isLeftChildNode) {
                return (
                    (this.tree.store.direction === 'horizontal' &&
                        this.showCollapsable &&
                        this.leftChildNodes.length > 0) ||
                    this.level === 1
                )
            }
            return (
                this.showCollapsable &&
                this.node.childNodes &&
                this.node.childNodes.length > 0
            )
        },
        showNodeLeftBtn() {
            return (
                this.tree.store.direction === 'horizontal' &&
                this.showCollapsable &&
                this.leftChildNodes.length > 0
            )
        },
        // 节点的宽度
        computeLabelStyle() {
            return (value) => {
                let { labelWidth = 'auto', labelHeight = 'auto' } = this
                if (typeof labelWidth === 'number') {
                    labelWidth = `${labelWidth}px`
                }
                if (typeof labelHeight === 'number') {
                    labelHeight = `${labelHeight}px`
                }
                return {
                    width: flexColumnWidth(value),
                    height: labelHeight,
                }
            }

        },
        computeLabelClass() {
            let clsArr = []
            const store = this.tree.store
            if (store.labelClassName) {
                if (typeof store.labelClassName === 'function') {
                    clsArr.push(store.labelClassName(this.node))
                } else {
                    clsArr.push(store.labelClassName)
                }
            }
            if (store.currentLableClassName && this.node.isCurrent) {
                if (typeof store.currentLableClassName === 'function') {
                    clsArr.push(store.currentLableClassName(this.node))
                } else {
                    clsArr.push(store.currentLableClassName)
                }
            }
            if (this.node.isCurrent) {
                clsArr.push('is-current')
            }
            return clsArr
        },
        computNodeStyle() {
            return {
                display: this.node.expanded ? '' : 'none',
            }
        },
        computLeftNodeStyle() {
            return {
                display: this.node.leftExpanded ? '' : 'none',
            }
        },
        // 是否显示左子数
        showLeftChildNode() {
            return (
                this.tree.onlyBothTree &&
                this.tree.store.direction === 'horizontal' &&
                this.leftChildNodes &&
                this.leftChildNodes.length > 0
            )
        },
    },
    watch: {
        'node.expanded'(val) {
            // this.$nextTick(() => this.expanded = val);
        },
        'node.leftExpanded'(val) {
            // this.$nextTick(() => this.expanded = val);
        },
    },
    data() {
        return {
            // node 的展开状态
            expanded: false,
            tree: null,
        }
    },
    created() {
        const parent = this.$parent
        if (parent.isTree) {
            this.tree = parent
        } else {
            this.tree = parent.tree
        }

        const tree = this.tree
        if (!tree) {
            console.warn("找不到树节点。")
        }
    },
    methods: {
        flexColumnWidth,
        getNodeKey(node) {
            return getNodeKey(this.nodeKey, node.data)
        },
        handleNodeClick() {
            const store = this.tree.store
            store.setCurrentNode(this.node)
            this.tree.$emit('node-click', this.node.data, this.node, this)
        },
        handleBtnClick(isLeft) {
            isLeft = isLeft === 'left'
            const store = this.tree.store
            // 表示是OKR飞书模式
            if (store.onlyBothTree) {
                if (isLeft) {
                    if (this.node.leftExpanded) {
                        this.node.leftExpanded = false
                        this.tree.$emit('node-collapse', this.node.data, this.node, this)
                    } else {
                        this.node.leftExpanded = true
                        this.tree.$emit('node-expand', this.node.data, this.node, this)
                    }
                    return
                }
            }
            if (this.node.expanded) {
                this.node.collapse()
                this.tree.$emit('node-collapse', this.node.data, this.node, this)
            } else {
                this.node.expand()
                this.tree.$emit('node-expand', this.node.data, this.node, this)
            }
        },
        handleContextMenu(event) {
            if (
                this.tree._events['node-contextmenu'] &&
                this.tree._events['node-contextmenu'].length > 0
            ) {
                event.stopPropagation()
                event.preventDefault()
            }
            this.tree.$emit(
                'node-contextmenu',
                event,
                this.node.data,
                this.node,
                this
            )
        }
    },

    render() {
        const leftChildNodes = this.leftChildNodes.map(child => {
            return (
                <cl-tree-node
                    show-collapsable={this.showCollapsable}
                    node={child}
                    label-width={this.labelWidth}
                    label-height={this.labelHeight}
                    renderContent={this.renderContent}
                    nodeBtnContent={this.nodeBtnContent}
                    key={this.getNodeKey(child)}
                    selected-key={this.selectedKey}
                    node-key={this.nodeKey}
                    props={this.props}
                    show-node-num={this.showNodeNum}
                    is-left-child-node
                >
                </cl-tree-node>
            )
        });

        const childNodes = this.node.childNodes.map(child => {
            return (
                <cl-tree-node
                    show-collapsable={this.showCollapsable}
                    node={child}
                    label-width={this.labelWidth}
                    label-height={this.labelHeight}
                    renderContent={this.renderContent}
                    nodeBtnContent={this.nodeBtnContent}
                    key={this.getNodeKey(child)}
                    selected-key={this.selectedKey}
                    node-key={this.nodeKey}
                    props={this.props}
                    show-node-num={this.showNodeNum}
                    is-left-child-node
                >
                </cl-tree-node>
            )
        });
        return this.node.visible && (
            <div
                class={{
                    "org-chart-node": true,
                    collapsed: !this.node.leftExpanded || !this.node.expanded,
                    'is-leaf': this.isLeaf,
                    'is-current': this.node.isCurrent,
                    'is-left-child-node': this.isLeftChildNode,
                    'is-not-child':
                        this.node.level === 1 &&
                        this.node.childNodes.length <= 0 &&
                        this.leftChildNodes.length <= 0,
                    'only-both-tree-node': this.node.level === 1 && this.tree.store.onlyBothTree,

                }}

                {
                ...{
                    on: {
                        contextmenu: ($event) => this.handleContextMenu($event)
                    }
                }
                }
            >

                <transition duration={this.animateDuration} name={this.animateName}>
                    {
                        this.showLeftChildNode && (
                            <div class="org-chart-node-left-children" style={{
                                visibility: this.node.leftExpanded ? '' : 'hidden',
                                height: this.node.leftExpanded ? '' : '0',
                            }}>
                                {leftChildNodes}
                            </div>
                        )
                    }
                </transition>

                <div class={{
                    'org-chart-node-label': true,
                    'is-root-label': this.node.level === 1,
                    'is-not-right-child': this.node.level === 1 && this.node.childNodes.length <= 0,
                    'is-not-left-child': this.node.level === 1 && this.leftChildNodes.length <= 0,
                }}>
                    {
                        this.showNodeLeftBtn && this.leftChildNodes.length > 0 && (
                            <div
                                class={{ expanded: this.node.leftExpanded, 'org-chart-node-left-btn': true }}
                                {
                                ...{
                                    on: {
                                        click: () => this.handleBtnClick('left')
                                    }
                                }
                                }
                            >


                                {

                                    this.showNodeNum && (
                                        !this.node.leftExpanded && (
                                            <span class="org-chart-node-btn-text">
                                                {
                                                    node.level === 1 && leftChildNodes.length > 0
                                                        ? leftChildNodes.length
                                                        : node.childNodes.length
                                                }
                                            </span >
                                        )
                                    )
                                }

                                {
                                    !this.showNodeNum && (
                                        <node-btn-content node={this.node}>
                                            {
                                                this.$slots.default
                                            }
                                        </node-btn-content>
                                    )
                                }
                            </div>
                        )
                    }

                    <div
                        class={['org-chart-node-label-inner', this.computeLabelClass]}
                        on-click={this.handleNodeClick}
                        style={this.computeLabelStyle(this.node.label)}>

                        <node-content node={this.node}>
                            {
                                this.$slots.default ? this.$slots.default : this.node.label
                            }

                        </node-content>
                    </div>

                    {
                        this.showNodeBtn && !this.isLeftChildNode && !this.onlyLeft && (
                            <div class={{ 'org-chart-node-btn': true, expanded: this.node.expanded }}>
                                {
                                    this.showNodeNum && (
                                        !this.node.expanded && (
                                            <span class="org-chart-node-btn-text">{this.node.childNodes.length}</span>
                                        )
                                    )


                                }
                                {
                                    !this.showNodeNum && (
                                        <node-btn-content node={this.node}>
                                            {
                                                this.$slots.default
                                            }
                                        </node-btn-content>
                                    )
                                }
                            </div>
                        )
                    }

                </div>
                {
                    !this.onlyLeft && (
                        <transition duration={this.animateDuration} name={this.animateName}>
                            {
                                this.isLeftChildNode && this.node.childNodes && this.node.childNodes.length > 0 && (
                                    <div class="org-chart-node-children" style={{
                                        visibility: this.node.expanded ? '' : 'hidden',
                                        height: this.node.expanded ? '' : '0',
                                    }}>
                                        {childNodes}

                                    </div>
                                )
                            }


                        </transition>
                    )
                }


            </div>
        )
    }
}