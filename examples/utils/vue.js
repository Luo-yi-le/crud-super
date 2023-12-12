
export default {
    getPropObject(suggestion = {}, required = false) {
        return {
            type: Object,
            default: () => {
                return suggestion;
            },
            required: required
        };
    },
    getPropArray(suggestion = [], required = false) {
        return {
            type: Array,
            default: () => suggestion,
            required: required
        };
    },
    getPropString(suggestion = '', required = false) {
        return {
            type: String,
            default: suggestion,
            required: required
        };
    },
    getPropNumber(suggestion = 0, required = false) {
        return {
            type: Number,
            default: suggestion,
            required: required
        };
    },
    getPropBoolean(suggestion = false, required = false) {
        return {
            type: Boolean,
            default: suggestion,
            required: required
        };
    },
    getPropFunction(suggestion = () => { }, required = false) {
        return {
            type: Function,
            default: suggestion,
            required: required
        };
    },
    findFieldEnv(component) {
        let now = component;
        while (now) {
            if (now.$options.FIELD_ENV) {
                break;
            }
            now = now.$parent;
        }
        return now;
    },
    getOptions(defaults, meta, getMetaData) {
        const { type } = meta;
        let metaData = [];
        try {
            metaData = getMetaData(meta) || [];
            if (metaData && !Array.isArray(metaData)) {
                metaData = [metaData];
            }
        } catch (e) {
            e;
        }
        let result = [];
        if (!Array.isArray(defaults)) {
            if (defaults != null) {
                let { ALL } = defaults;
                if (ALL) {
                    if (!Array.isArray(ALL)) {
                        ALL = [ALL];
                    }
                    result = result.concat(ALL);
                }
                let ONE = defaults[type];
                if (ONE) {
                    if (!Array.isArray(ONE)) {
                        ONE = [ONE];
                    }
                    result = result.concat(ONE);
                }
            }
        } else {
            result = defaults.slice();
        }
        result = result.concat(metaData);
        return result;
    },
};