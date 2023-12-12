// import request from '@/utils/request'


/**
 * @description 接口返回值 IResult
 * @typedef {Object} IResult
 * @property {number} [code = 200]
 * @property {any | any[]} [data = [] || {}]
 * @property {any | any[]} [rows = [] || {}]
 * @property {number} [total = 0]
 * @property {string} [msg = "成功"]
 */

/**
 * @description IPaged
 * @typedef {Object} IPaged
 * @property {boolean} countable
 * @property {boolean} emptyOrders
 * @property {boolean} morePage
 * @property {number} nextPage
 * @property {number} pageCount
 * @property {number} pageNo
 * @property {number} pageSize
 * @property {boolean} pageable
 * @property {number} previousPage
 * @property {number} total
 */

/**
 * @description 接口返回值 IRecords
 * @typedef {Object} IRecords
 * @property {IPaged} paged
 * @property {any[]} records
 */

/**
 * @description 字典列 IDictItems
 * @typedef {object} IDictItems
 * @property {string} caption
 * @property {string} key
 * @property {string} searchIndex
 */

/**
 * @description 字典接口返回值 IDict
 * @typedef {Object} IDict
 * @property {string} caption
 * @property {IDictItems[]} items
 * @property {string} name
 */

/**
 * @description 接口返回值 IResult
 * @typedef {Object} IURL
 * @property {string} get           获取详情
 * @property {string} list          获取列表
 * @property {string} update        编辑
 * @property {string} delete        删除
 * @property {string} add           新增
 * @property {string} import        导出
 * @property {string} autocode      发码系统自动获取码
 * @property {string} selectable     公共接口
 */


/**
 * @description         API接口基类
 * @method get          查询详细
 * @method add          新增
 * @method list         查询列表
 * @method update       编辑
 * @method delete       删除
 * @method import       导出
 * @method rulesCode    规则码
 *
 */
class Base {

    /**
     * @name Axios
     * @description Axios请求函数,
     * @property {url: string, data: any}
     */
    request = request;
    url = {
        get: '',
        list: '',
        update: '',
        delete: '',
        add: '',
        import: '',
        autocode: '/mone-code/code/autocode/get/',
        selectable: '',
        dict: '/mes/api/meta/enum/type',
    }

    method = {
        GET: 'get',
        PUT: 'put',
        POST: 'post',
        DELETE: 'delete',
    }

    /**
     *
     * @param {IURL} url
     */
    constructor(url) {
        this.url = Object.assign({}, this.url, url);
        // this.getClassName()
        // this.ExpApi()
    }

    /**
     * @name 新增
     * @description 无ID
     * @param {object} data
     * @param {{headers?: object}} options
     * @returns {Promise<IResult>}
     */
    async add(data, options = { headers: {} }) {
        return await this.request({
            url: this.url.add,
            method: this.method.POST,
            headers: options.headers || {},
            data
        })
    }

    /**
     * @name 获取详情
     * @description 根据ID获取详情
     * @param {any} data
     * @param {{headers?: object}} options
     * @returns {Promise<IResult | IRecords>}
     */
    async get(data, options = { headers: {} }) {
        const id = window.$crud.isObject(data) ? (data.id || data.ids) : data
        return await this.request({
            url: this.url.get + id,
            method: this.method.GET,
            headers: options.headers || {},
        })
    }

    /**
     * @description 查询列表--分页
     * @param {object} params
     * @param {{headers?: object}} options
     * @returns {Promise<IResult | IRecords>}
     */
    async list(params, options = { headers: {} }) {
        return await this.request({
            url: this.url.list,
            method: this.method.GET,
            headers: options.headers || {},
            params,
        })
    }

    /**
     * @name 编辑
     * @description 根据Id编辑
     * @param {object} data
     * @param {{headers?: object}} options
     * @returns {Promise<IResult>}
     */
    async update(data, options = { headers: {} }) {
        return await this.request({
            url: this.ExpApi(this.url.update, data),
            method: this.method.PUT,
            headers: options.headers || {},
            data
        })
    }

    /**
     * @name 删除
     * @description 根据Id删除
     * @param {any} data
     * @param {{headers?: object}} options
     * @property {code: string, data: any}
     * @returns {Promise<IResult>}
     */
    async delete(data, options = { headers: {} }) {
        const id = window.$crud.isObject(data) ? (data.id || data.ids) : data
        return await this.request({
            url: this.url.delete + id,
            method: this.method.DELETE,
            headers: options.headers || {},
        })


    }

    /**
     * @description 导出
     * @param {object} data
     * @param {{headers?: object}} options
     * @returns {Promise<IResult>}
     */
    async import({ method, headers = {} }) {
        return await this.request({
            url: this.url.import,
            method: method ? method : this.method.POST,
            headers
        })
    }

    /**
     * @description 根据规则获取编号
     * @param {string} rules
     * @param {{headers: object}} options
     * @returns {Promise<string>}
     */
    async rulesCode(rules, options = { headers: {} }) {
        return await this.request({
            url: this.url.autocode + rules,
            method: this.method.GET,
            headers: options.headers || {},
        })
    }


    /**
     * @description 开放接口--查询列表--分页
     * @param {object} params
     * @param {{headers?: object}} options
     * @returns {Promise<IResult>}
     */
    async selectable(params, options = { headers: {} }) {
        return await this.request({
            url: this.url.selectable,
            method: this.method.GET,
            headers: options.headers || {},
            params,
        })
    }

    /**
     * @description 查询字典---单条
     * @param {string} type
     * @param {{headers?: object}} options
     * @returns {Promise<IDict>}
     */
    async getDict(type, options = {}) {
        return await this.request({
            url: this.url.dict,
            method: this.method.GET,
            headers: options.headers || {},
            params: { name: type },
        })
    }

    /**
     * @description 查询字典--多条
     * @param {string[]} type
     * @param {{headers?: object}} options
     * @returns {Promise<{[key: string]: IDictItems[]}>}
     */
    async getDicts(type = [], options = {}) {
        if (type.length) {
            let apis = []
            type.forEach(e => {
                apis.push(this.getDict(e, options))
            })
            const dicts = {};
            (await Promise.all(apis)).forEach(e => {
                dicts[e.name] = e.items
            })
            return dicts
        }
    }

    getClassName() {
        if (process.env.NODE_ENV == "development") {
            console.log(this.constructor.name + '.js')
        }
    }

    ExpApi(url, data) {
        if (new RegExp(/:\w+|\/d/gi).test(url)) {
            return this.setApiUrl(url, data)
        } else {
            return url
        }
    }

    setApiUrl(url, data) {
        let uri = url;
        const Keys = url.match(/:\w+|\/d/gi) || [];
        let paramKeys = [];
        Keys.forEach(e => paramKeys.push(e.split(':')[1]));

        if (paramKeys.length && window.$crud.isObject(data) && Object.keys(data).length) {
            paramKeys.forEach(e => {
                uri = uri.replace(':' + e, data[e])
            })
        } else {
            uri = url
        }

        return uri
    }

}

export default Base;

