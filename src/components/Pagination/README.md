# Pagination

Pagination 组件

## 使用

- 基础用法

```
import React from 'react'
import { Pagination } from 'wowjoy-component'

const PROPS = {
  size: "32px",
  total: 1000,
  pageSizeList: [10, 20, 30],
  defaultPageSize: 10,
  onChange: (...args)=>console.log(args)
};
const Foo = () => <Pagination {...PROPS}></Pagination>
```

## APIs

| 属性               | 描述                                                                      |  类型  |                                 默认值                                  |
| ------------------ | :------------------------------------------------------------------------ | :----: | :---------------------------------------------------------------------: |
| className          | 顶层样式 class                                                            | string |                                                                         |
| defaultStyles      | 顶层默认样式                                                              | string |                                                                         |
| children           | 内容                                                                      |  node  |                                                                         |
| viewAble           | 可见项配置; 请从默认值中删除不要字段来隐藏组件，不要修改字段              |  arr   | ['prevNext', 'pageList', 'total', 'pageSizeSelect', 'jumpTo', 'submit'] |
| staticStr          | 静态文本配置; 请从默认值中修改字段，不要改变顺序或删除                    |  arr   |               ['共', '条', '条/页', '跳至', '页', '确定']               |
| size               | 尺寸                                                                      | string |                                 '32px'                                  |
| total              | 总数，<b>必填项</b>                                                       | number |                                                                         |
| pageSize           | 每页数量， 受控  <b>pageSize,defaultPageSize 必须填写其中之一</b>         | number |                                                                       |
| defaultPageSize    | 初始每页数量， 非受控                                          | number |                                                                         |
| onPageSizeChange   | 每页数量（pageSize）改变事件<br/>( pageSize ) =>{} |  func  |                                                                        |
| pageSizeList       | 每页数量可惜列表，<b>必填项</b>                                           | arr |                                                                         |
| siblingViewSize    | 两侧可见页数量，如传入 2，则中间会显示 2+1+2 页                           | number |                                    2                                    |
| currentPage        | 当前所在页， 受控                                                         | number |                                    1                                    |
| defaultCurrentPage | 初始化当前所在页， 非受控                                                 | number |                                    1                                    |
| onChange           | 当前页改变事件，pageSize 改变也会触发本事件<br/>(currentPage, pageSize, total) =>{} |  func  |                                                                        |

## classApi

| class                 | 描述             |
| --------------------- | :--------------- |
| wjc-page-prev          | 上一页           |
| wjc-page-next          | 下一页           |
| wjc-page-item(.active) | 页码(当前页)     |
| wjc-fast-jump\_\_prev  | 左侧快速跳转     |
| wjc-fast-jump\_\_next  | 右侧快速跳转     |
| wjc-page-count         | 总页数           |
| wjc-jump-to            | 快速跳转         |
| wjc-jump-to\_\_submit  | 快速跳转确认按钮 |
