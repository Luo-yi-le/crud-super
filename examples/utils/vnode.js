import script from "./script";
import { h, toRaw, defineComponent } from "vue";

/**
 * 解析节点
 * @param {*} vnode
 * @param {{scope,prop,children}} options
 */
const parseNode = (vnode, options) => {
	const { scope, prop, slots } = options || [];
	// 插槽模式渲染
	if (vnode.name.indexOf("slot-") == 0) {
		const rn = slots[vnode.name];

		if (rn) {
			return rn({ scope });
		} else {
			return <cl-error-message title={`组件渲染失败，未找到插槽：${vnode.name}`} />;
		}
	}

	if (scope) {
		// 添加双向绑定
		vnode.modelValue = scope[prop];
		vnode["onUpdate:modelValue"] = function(val) {
			scope[prop] = val;
		};
	}

	// 组件实例渲染，转普通对象
	if (vnode.render) {
		return h(toRaw(vnode));
	}

	// 组件参数
	const props = {
		...vnode,
		...vnode.props
	};

	delete props._children;


	// // @ts-ignore
    return h(vnode.name, props, {
		default: () => {
			return vnode._children;
		}
	});
    
    return h(a)
};

/**
 * 渲染节点
 * @param {*} vnode
 * @param {*} options
 */
export function nodeRender(vnode, options) {
	const { prop, scope, slots, h } = options
	if (!vnode) {
		return null;
	}

	if (vnode.__v_isVNode) {
		return vnode;
	}

	// 组件名渲染
	if (script.isString(vnode)) {
		return parseNode({ name: vnode }, { scope, slots });
	}

	// 方法回调
	if (script.isFunction(vnode)) {
		return vnode({ scope, h });
	}

	// jsx 模式
	if (script.isObject(vnode)) {
		if (vnode.name) {
			// 扩展组件
			const keys = ["el-select", "el-radio-group", "el-checkbox-group"];

			if (keys.includes(vnode.name)) {
				// 设置内容
				vnode._children = (
					<div>
						{(vnode.options || []).map((e, i) => {
							// 下拉框
							if (vnode.name == "el-select") {
								let label, value;

								if (script.isString(e)) {
									label = value = e;
								} else if (script.isObject(e)) {
									label = e.label;
									value = e.value;
								} else {
									return (
										<cl-error-message
											title={`组件渲染失败，options 参数错误`}
										/>
									);
								}

								return (
									<el-option key={i} label={label} value={value} {...e.props} />
								);
							}
							// 单选框组
							else if (vnode.name == "el-radio-group") {
								return h(<el-radio key={i} label={e.value}></el-radio>, e.props, {
									default() {
										return <span>{e.label}</span>;
									}
								});
							}
							// 多选框组
							else if (vnode.name == "el-checkbox-group") {
								return (
									<el-checkbox key={i} label={e.value} {...e.props}>
										{e.label}
									</el-checkbox>
								);
							} else {
								return null;
							}
						})}
					</div>
				);

				return parseNode(vnode, { prop, scope });
			} else if(vnode.name.indexOf('image')) {
				return <el-image src={scope[prop]} attrs={vnode.props} />
            }
             else {
				return parseNode(vnode, { prop, scope, slots });
			}
		} else {
			return <cl-error-message title={`组件渲染失败，组件 name 不能为空`} />;
		}
	}
}
