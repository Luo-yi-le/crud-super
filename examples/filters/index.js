export default {
    filterJoin: function (value = [], { str = ',', format = false }) {
        const j = str ? str : ','
        const f = format ? format : false;
        if (value && value.length) {
            const label = value.filter(item => !!item)
            return f ? label.join(j) : value.join(j)
        }
    },

    filterSplit: function (value = '', { str = ',', format = false }) {
        const j = str ? str : ','
        const f = format ? format : false;
        if (value) {
            const label = value.split(j);

            return f ? label.filter(item => !!item) : label

        }
    },
}