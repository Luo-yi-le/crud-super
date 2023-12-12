export default {
    data() {
        return {
            eventBus: {
                sendFilterItemLength: 'cl-send-filter-item-length',
                sendFilterData: 'cl-send-filter-data',
                sendToggleData: 'cl-send-toggle-data',
            }
        }
    },
    beforeDestroy() {
        this.destroyEventBus()
    },
    
    methods: {
        initEventBus() {
            Object.keys(this.eventBus).forEach(e=> {
                this[e + 'Emit' ] = (...arg)=>{
                    this.$crud.$bus.$emit(this.eventBus[e], arg)
                }
            })
        },

        destroyEventBus() {
            Object.keys(this.eventBus).forEach(e=> {
                this[e] = ()=>{
                    this.$crud.$bus.$off(this.eventBus[e])
                }
            })
        },

        initEventBus() {
            Object.keys(this.eventBus).forEach(e=> {
                this[e + 'On' ] = (cb=Function)=>{
                    this.$crud.$bus.$on(this.eventBus[e], (...arg)=> {
                        cb(...arg)
                    })
                }
            })
        },
        sendFilterItemLength(length) {
            this.$crud.$bus.$emit('cl-send-filter-item-length', length)
        },

        sendFilterData(value) {
            this.$crud.$bus.$emit('cl-send-filter-data', value)
        },
        sendToggleData(value) {
            this.$crud.$bus.$emit('cl-send-toggle-data', value)
        },
    }
}