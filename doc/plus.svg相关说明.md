# svg 相关说明
`svg` 动画可以说是 `anime.js` 中的卖点功能，按照其文档说明，其提供了三种 `svg` 相关的动画，分别是:  
1. 沿着 svg 路径运动的动画  
1. svg 变形动画  
1. 按照 svg 路径进行绘画

## 沿着 svg 路径运动动画
// TODO 需要完成这块的工作

## svg 变形动画
本质上是采用将关键的点作为 `array`，然后按照通用的计算规则，获取在不同时间，相应点的值

## 按照 svg 路径进行绘画
采用修改 `svg` 的 `strokeDashoffset` 属性实现，具体原理可以参考 [svg-line-animation-works](https://css-tricks.com/svg-line-animation-works/)