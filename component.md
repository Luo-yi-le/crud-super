### 组件
---
### ClDivider
##### 区隔内容的分割线.

**Attribute**
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:-----|:-----|:-----|:-----|:-----|
| direction | 分割线的方向，默认水平horizontal | String | horizontal/vertical | horizontal |
| content-position | 文本内容位置，默认居中（仅当分割线为水平方向时，才渲染对应内容） | String | left/center/right/top/bottom | center |
| line-type | 分割线线条类型，默认实线，可选虚线，圆点线 | String | solid/dashed/dotted | solid |

**Slot**
| 参数 | 说明 |
|:-----|:-----|
| — | 内容 |

---

### ClInputSearch
##### 搜索输入框.
**Attribute**
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:-----|:-----|:-----|:-----|:-----|
| icon | 按钮图标（查看element-ui可用图标） | String | - | el-icon-search |
| button | 是否设置按钮 | Boolean | true/false | true |
| type | 按钮显示前后 | String | prepend/append | append |


**Events**
| 事件名称 | 说明 | 类型 |
|:-----|:-----|:-----|
| click | button点击事件 | — |

**Input Events**  [参考地址](https://element.eleme.cn/#/zh-CN/component/input#input-events)

---
### ClInputSwitch
##### 自动填充输入框.
**Attribute**
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:-----|:-----|:-----|:-----|:-----|
| switch | [填充组件props](https://element.eleme.cn/#/zh-CN/component/switch#attributes) | Object | - | { 'active-color':"#13ce66", 'active-text': "自动生成",  'label-width': "0" } |
| button | 是否设置按钮 | Boolean | true/false | true |
| type | 按钮显示前后 | String | prepend/append | append |


**Events**
| 事件名称 | 说明 | 类型 |
|:-----|:-----|:-----|
| switch-change | switch 状态发生变化时的回调函数 | 新状态的值 |

**Input Events**  [参考地址](https://element.eleme.cn/#/zh-CN/component/input#input-events)

---


### ClText
##### 文本显示.
**Attribute**
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:-----|:-----|:-----|:-----|:-----|
| value | 显示文本值 | String/Number/Boolean | - | -- |


**Slot**
| 参数 | 说明 |
|:-----|:-----|
| — | 内容 |


---