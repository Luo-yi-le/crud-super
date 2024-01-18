export default {
    name: 'cl-teleport',
    props: {
        to: {
            type: String,
            default: '#app',
            required: true
        }
    },
    mounted() {
        const toEl = document.querySelector(this.to)
        if (toEl) {
            toEl.appendChild(this.$el)
        }
    },
    destroyed() {
        const toEl = document.querySelector(this.to)
        if (toEl) {
            toEl.removeChild(this.$el)
        }
    },

    render() {
        console.log(this)
        return (
            <div>
                {this.$slots.default}
            </div>
        )
    }
}