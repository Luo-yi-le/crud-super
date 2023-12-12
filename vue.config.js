const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    // entry: './src/index.js',
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        open: true,
    },
    configureWebpack: {
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
            alias: {
                '@': resolve('examples'),
            }
        },
        output: {
            library: 'crud-super',
            libraryTarget: 'umd',
            umdNamedDefine: true,
        }
    },
    // publicPath: './lib/',
    // pages: {
    //     index: {
    //         entry: './src/index.js',
    //         // path: path.resolve(__dirname, './lib'),
    //         // publicPath: '/dist/',
    //         // filename: 'index.js',
    //         // library: 'index.js',
    //         // libraryTarget: 'umd',
    //         // umdNamedDefine: true
    //     }
    // },
    productionSourceMap: false,

}