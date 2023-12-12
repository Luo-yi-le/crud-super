export default {
    props: {
        size: String,
        disabled: Boolean,
    },

    computed: {
        isSize() {
            return this.size || ((this.crud || {}).size) || (this.$ELEMENT || {}).size;
        },

        isDisabled() {
            return this.$options.propsData.hasOwnProperty('disabled') ? this.disabled : (this.crud || {}).disabled;
        }
    },
}