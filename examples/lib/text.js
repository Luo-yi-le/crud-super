export default {
    functional: true,
    name: 'cl-text',
    props: {
        value: {
            type : [String, Array, Number, Date, Function, Object, Boolean],
            default: '--'
        },
    },

    render(h, ctx) {
        return <div class='cl-text' {... {
            attrs: ctx.data.attrs,
            on: ctx.listeners,
            class: ctx?.data?.class,
            style: ctx.data.style
        }}>
            {ctx.slots().default ? ctx.slots().default : ctx.props.value}
        </div>
    }
};