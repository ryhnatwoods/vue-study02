vue-router 的基本使用
配置 routes: [
{
path: '/',
name: 'xxx',
component: xxx(vue 组件的描述对象，实际是一个{...args})
//路由嵌套
children: [{
path: '/xxx',
name: 'xxx',
component: xxx
}]
},
{
...,
...,
component: () => import(/_ webpackChunkName: "xxx" _/ './xxx/xx.vue') //异步组件路由，目的：加快首屏渲染，按需加载组件
}
]
将插件 vue-router 指定在 vue 的实例中

built-in 插件有 router-view， router-link

动态路由
{ path: "detail/:id", component: Detail， props: true}

在目标页面获取路由信息 \$route.params.id,也可以通过属性传递,设置 props=true

路由守卫
全局守卫， 独享守卫， 组建内守卫

动态路由 1.从服务器端获取路由的配置 2.将配置信息递归的映射成对应组件的描述对象 3.将映射完成的配置添加进 router

路由的案例： 面包屑组件 -> elementui breadcum.vue

理解 vue-router 实现原理
实现插件
url 变化监听
路由配置解析
实现全局组件

理解 vuex 的理念和核心用法

vuex 原理解析
vuex 也是一个插件
实现 4 个东西：state/mutations/actions/getters
创建 store
数据响应式
