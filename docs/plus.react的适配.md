# react 的适配
在使用 `requestAnimationFrame` 获取时间戳并渲染动画帧时，渲染步骤需要是实时的，所以在 `react` 使用时，就不能使用 `setState` 方式修改元素属性实现渲染。

`react` 中提供了 `refs` 策略让我们可以直接获取 `render` 方法中的 DOM 节点，从而使得我们可以通过修改获取节点的属性来实现实时渲染

## 参考
[refs and the dom](https://reactjs.org/docs/refs-and-the-dom.html)