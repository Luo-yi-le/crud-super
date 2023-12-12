export default {
    functional: true,
    name: 'cl-divider',

    props: {
        // 分割线的方向，默认水平horizontal（垂直vertical可选）
        direction: {
            type: String,
            default: "horizontal",
            validator(val) {
                return ["horizontal", "vertical"].includes(val);
            },
        },
        // 文本内容位置，默认居中（仅当分割线为水平方向时，才渲染对应内容）
        contentPosition: {
            type: String,
            default: "center",
            validator(val) {
                return ["left", "center", "right", 'top', 'bottom'].includes(val);
            },
        },
        // 分割线线条类型，默认实线，可选虚线，圆点线
        lineType: {
            type: String,
            default: "solid",
            validator(val) {
                return ["solid", "dashed", "dotted"].includes(val);
            },
        }
    },


    render(h, context) {
        let slots = null;
        if (context.slots().default) {
            slots = (<div {...{
                // class: ['text', `${context.props.contentPosition}`]
                class: [context.props.direction == 'vertical' ? 'ver_text' : 'text', `${context.props.contentPosition}`]
            }}>
                {
                    context.slots().default
                }
            </div>)
        }
        return (
            <div {...{
                attrs: context.data.attrs,
                on: context.listeners,
                class: [
                    'cl-divider', 
                    context.data.staticClass, 
                    `${context.props.direction}`, 
                    `cl-divider-${context.props.lineType}`,
                    context.props.direction == 'vertical' ? `cl-divider-${context.props.lineType}-${context.props.contentPosition}` : '',
                ],
                style: context.data.staticStyle
            }}>
                {
                    slots
                }

            </div>
        )
    }
}