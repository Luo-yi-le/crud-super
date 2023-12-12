module.exports = {
  "presets": [
    ["@babel/preset-env", { "modules": false }],
    "@vue/babel-preset-jsx" // 支持jsx语法
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties", // 支持classProperties语法
    "syntax-dynamic-import",
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
 
}