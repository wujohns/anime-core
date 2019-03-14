# requestAnimationFrame
在前端的 `js` 中为了方便实现帧动画，在浏览器中提供了 `requestAnimationFrame` 方法，使用该方法可以在每帧的动画中获取相对的时间戳，便于确定动画需要展现的进度

## 简单案例
```js
let startTime
step = (timestamp) => {
  startTime = startTime ? startTime : timestamp
  console.log(timestamp, timestamp - start)
  // 处理动画计算以及渲染
  requestAnimationFrame(step)
}
requestAnimationFrame(step)
```

## 说明
上述案例中每次的 `requestAnimationFrame` 的执行都会在其回调中返回一个时间戳，该时间戳即为动画的绝对参考时间，依据这个可以计算出下一帧中需要渲染的动画的参数的值，从而实现动画的播放

## 具体参考
[MDN requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)