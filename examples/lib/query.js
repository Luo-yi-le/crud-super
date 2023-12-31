export default {
    inject: ['crud'],

    computed: {
        list() {
            const { value, multiple, list } = this.crud.search.query;
            let arr = [];

            if (value instanceof Array) {
                arr = value;
            } else {
                arr = [value];
            }

            if (!multiple) {
                arr.splice(1);
            }
            return list.map(e => {
                this.$set(e, 'active', arr.some(v => v === e.value));

                return e;
            });
        }
    },

    methods: {
        selectRow(item) {
            const { list, multiple, callback } = this.crud.search.query;

            if (item.active) {
                item.active = false;
            } else {
                if (multiple) {
                    item.active = true;
                } else {
                    list.map(e => {
                        e.active = e.value == item.value;
                    });
                }
            }

            const value = list.filter(e => e.active).map(e => e.value);

            if (callback) {
                callback(value);
            } else {
                this.crud.refresh({
                    query: multiple ? value : value[0]
                });
            }
        }
    },

    render() {
        return (
            <div class="crud-query">
                {this.list.map((item, index) => {
                    return (
                        <button
                            plain
                            class={{ active: item.active }}
                            on-click={event => {
                                this.selectRow(item);
                                event.preventDefault();
                            }}
                            key={index}>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        );
    }
};