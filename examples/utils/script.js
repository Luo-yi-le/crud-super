// @flow
import _ from 'lodash';

export default {
    getType(v) {
        return Object.prototype.toString.call(v);
    },
    // 格式化字符串 fontSize => font-size
    toKebab(v) {
        return v.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },
    // 格式化字符串 fontSize => font_size
    _toKebab(v) {
        return v.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    },
    isArray(v) {
        return this.getType(v) === '[object Array]';
    },
    isObject(v) {
        return this.getType(v) === '[object Object]';
    },
    clone(v) {
        if (this.getType(v) == '[object Null]' || this.getType(v) == '[object Undefined]') return '';
        return JSON.parse(JSON.stringify(v));
    },
    isFunction(value) {
        return typeof value === "function";
    },
    formatTausends(num) {
        return String(num).replace(/^(\s+|-)?\d+(?=.?\d*($|\s))/g, (m) => {
            return m.replace(/(?=(?!\b)(\d{3})+$)/g, ',');
        });
    },
    // 删除数组多元素
    forDeleteArray(arr) {
        for (let len = arr.length, i = len - 1; i >= 0; i--) {
            for (let j = 0; j < delarr.length; j++) {
                if (i === delarr[j]) {
                    arr.splice(i, 1);
                }
            }
        }
        return arr;
    },
    // 递归遍历数组对象是否相等
    compare(a, b) {
        if (a === b) {
            return true;
        }

        if (typeof a !== typeof b || a === null || b === null) {
            return false;
        }

        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            return this.compareArray(a, b);
        }

        if (typeof a === "object") {
            return this.compareObject(a, b);
        }

        // console.log("value", a, b);
        return false;
    },
    compareObject(a, b) {
        // console.log("object", a, b);
        const keya = Object.keys(a);
        const keyb = Object.keys(b);

        if (keya.length !== keyb.length) {
            return false;
        }

        return keya.every(key => {
            if (!this.compare(a[key], b[key])) {
                return false;
            }
            return true;
        });
    },
    compareArray(a, b) {
        // console.log("array", a, b);
        if (a.length !== b.length) {
            return false;
        }
        const length = a.length;
        for (let i = 0; i < length; i++) {
            if (!this.compare(a[i], b[i])) {
                return false;
            }
        }
        return true;
    },
    // 转意符换成普通字符
    escape2Html(str) {
        var arrEntities = {
            'lt': '<',
            'gt': '>',
            'nbsp': ' ',
            'amp': '&',
            'quot': '"'
        };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    },
    isString(value) {
        return typeof value === "string";
    },
    // 路径名称
    basename(path) {
        let index = path.lastIndexOf("/");
        index = index > -1 ? index : path.lastIndexOf("\\");
        if (index < 0) {
            return path;
        }
        return path.substring(index + 1);
    },
    deepPaths(paths, splitor) {
        const list = [];

        paths.forEach((e) => {
            const arr = e.split(splitor || "/").filter(Boolean);

            let c = list;

            arr.forEach((a, i) => {
                let d = c.find((e) => e.label == a);

                if (!d) {
                    d = {
                        label: a,
                        value: a,
                        children: arr[i + 1] ? [] : null
                    };

                    c.push(d);
                }

                if (d.children) {
                    c = d.children;
                }
            });
        });

        return list;
    },
    contains(parent, node) {
        return parent !== node && parent && parent.contains(node);
    },
    //普通字符转换成转意符
    html2Escape(sHtml) {
        return sHtml.replace(/[<>&"]/g, function (c) {
            return {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;'
            }[c];
        });
    },
    exec(script, component, args) {
        let func = null;
        if (typeof script === 'string') {
            eval(`func=function(ctx){
        try{
          var result = null;
          ${script}
          return result;
        }catch(err){
          return null;
        }
      }`);
        } else if (typeof script === 'function') {
            func = script;
        } else {
            func = () => {
                return {};
            };
        }
        return func.call(component, {
            component,
            args,
        });
    },
    // 深拷贝 merge 对象
    updateState(target, source) {
        let newTarget = {
            ...target
        };
        for (let sKey in source) {
            if (source.hasOwnProperty(sKey)) {
                if (newTarget[sKey]) {
                    if (newTarget.hasOwnProperty(sKey)) {
                        if (_.isArray(source[sKey]) && _.isArray(newTarget[sKey])) {
                            newTarget[sKey] = [].concat(source[sKey]);
                        } else if (_.isFunction(source[sKey]) && _.isFunction(newTarget[sKey])) {
                            newTarget[sKey] = source[sKey];
                        } else if (_.isObject(source[sKey]) && _.isObject(newTarget[sKey])) {
                            newTarget[sKey] = this.updateState(newTarget[sKey], source[sKey]);
                        } else {
                            newTarget[sKey] = source[sKey];
                        }
                    }
                } else {
                    newTarget[sKey] = source[sKey];
                }
            }
        }
        return newTarget;
    },
    // 深拷贝 merge 对象 (数组合并不覆盖)
    updateState_arraymerge(target, source) {
        let newTarget = {
            ...target
        };
        for (let sKey in source) {
            if (source.hasOwnProperty(sKey)) {
                if (newTarget[sKey]) {
                    if (newTarget.hasOwnProperty(sKey)) {
                        if (_.isArray(source[sKey]) && _.isArray(newTarget[sKey])) {
                            newTarget[sKey] = [...newTarget[sKey]].concat(source[sKey]);
                            // newTarget[sKey] = _.cloneDeep(newTarget[sKey]).concat(source[sKey]);
                        } else if (_.isFunction(source[sKey]) && _.isFunction(newTarget[sKey])) {
                            newTarget[sKey] = source[sKey];
                        } else if (_.isObject(source[sKey]) && _.isObject(newTarget[sKey])) {
                            newTarget[sKey] = this.updateState(newTarget[sKey], source[sKey]);
                        } else {
                            newTarget[sKey] = source[sKey];
                        }
                    }
                } else {
                    newTarget[sKey] = source[sKey];
                }
            }
        }
        return newTarget;
    },
    //千分符
    formatNum(num) {
        num = num + '';
        if (/\./.test(num)) {
            var arr = num.split('.');
            return arr[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '.' + arr[1];
        }
        return num.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    },
    // 列表转树形
    deepTree(list) {
        const newList = [];
        const map = {};

        list.forEach((e) => (map[e.id] = e));

        list.forEach((e) => {
            const parent = map[e.parentId];

            if (parent) {
                (parent.children || (parent.children = [])).push(e);
            } else {
                newList.push(e);
            }
        });

        const fn = (list) => {
            list.map((e) => {
                if (script.isArray(e.children)) {
                    e.children = _.orderBy(e.children, "orderNum");
                    fn(e.children);
                }
            });
        };

        fn(newList);

        return _.orderBy(newList, "orderNum");
    }

}