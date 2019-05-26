# anime-core
`anime-core` 是将 [anime.js](https://github.com/juliangarnier/anime/) 核心逻辑做抽取并进行分析的一个项 目

## 项目结构
```
+- docs - 相关说明文档目录
+- example - 案例目录
+- lib
  +- easings.js - 动画计算函数汇总，包含各种动画效果里时间与对应比例值的换算关系
  +- tween.js - tween 结构的构建，将初始动画配置格式化为目标的 tween 格式，方便后续的动画计算
  +- utils.js - 动画计算中依赖的各种工具方法
  +- index.js - 入口文件，包含全局动画引擎管理（基于requestAnimationFrame），以及动画类
+- rollup.config.js - rollup 编译配置，这里采用 umd 方式
```

## 解析说明文档目录
[1.格式转换记录.md](/docs/1.格式转换记录.md)  
[2.时间控制策略.md](/docs/2.时间控制策略.md)  
[plus.react的适配.md](/docs/plus.react的适配.md)  
[plus.requestAnimationFrame.md](/docs/plus.requestAnimationFrame.md)  
[plus.svg相关说明.md](/docs/plus.svg相关说明.md)  

## 案例
参考 [example](/example) 目录下的实现