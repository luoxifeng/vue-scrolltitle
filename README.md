# Vue-Scrolltitle
vue scroll title

# Screenshots
场景|说明|截图| 
:------:|:------:|:------
 no animate（默认效果）|默认不启动过渡，不可滑动， |![no animate](./imgs/no_animate.gif)
 animate（启动动画过渡效果）| 设置`animate`属性，启动过渡，不可滑动 |![animate](./imgs/animate.gif)
 slide（启动滑动效果）| 设置`slidable`属性，可以滑动，此设置会忽略`animate`属性,因为滑动必须启用过渡 |![animate](./imgs/slidable.gif)


# Usage

demo.vue
```html
<template>
    <div>
        <scroll-title v-model="s"
            animate
            showCount="5"
            speed="300">
            <scroll-title-item v-for="(v, i) in arr" :key="i" >
                {{v}}
            </scroll-title-item>
        </scroll-title>
    </div>
</template>
```

```javascript
import {ScrollTitle, ScrollTitleItem } from "./index"
export default {
    data(){
        return {
            arr: Array.from({length: 8}).map((t,k) => k),
            s: 3
        }
    },
    components: {
        ScrollTitle,
        ScrollTitleItem
    }
}
```
# Settings
 
 属性 | 用法说明 | 可选类型 | 可设置的值 | 默认值| 依赖的属性 | 影响的属性  | 其他说明
 :------|:------|:-----------:|:----------:|:---------:|:---------:| :-----:|:-------
 `wrapperCls` | 最外层容器的自定义样式class | `String` | `样式class` | `""` |`无` | `无` | 用来覆盖默认样式，允许用户自定义样式
 `showCount` | 可是区域显示的个数 | `Number`, `String` | 数字或者可转换为数字的字符串 | `3` | `无` |  `无` | 设置此属性可视区域显示个数，注意：当不可滑动的时候，如果总个数大于等于3个，此属性不能设置为2，因为这样就不能显示第三个了，同时此值不能大于总个数
 `speed` | 切换速度 | `Number`, `String` | 数字或者可转换为数字的字符串 | `300` | `animate` |  `无` | 当设置了`animate`属性后，在切换时会按照这个速度移动
 `animate` | 启动动画设置 | `Boolean`, `String` | `false`,`true`,`动画函数的名称` | `false` | `无` | `无` | 设置此属性后切换的时候会出现过渡效果
 `value` | 初始化显示位置 | `Number` | 数字 | `0` |  `无` | `无` | 初始化以后设置第几个为active状态
 `slidable` | 可滑动 | `Boolean` | `true`,`false` | `false` | `无` | `animate` | 设置此属性后可以滑动，此属性设置以后忽略animate属性，此属性设置后默认启动动画
