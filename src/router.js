import Vue from "vue";
// import Router from "vue-router";
import Router from "./plugins/srouter";
import Home from "./views/home.vue";
import List from "./views/list.vue";
import Detail from "./views/detail.vue";

//挂载插件 -- 如何实现？？
Vue.use(Router);

const routes = [
  {
    path: "/home",
    name: "home",
    component: Home,
    children: [
      {
        path: "product/list",
        name: "list",
        component: List
      },
      {
        path: "product/detail/:id",
        name: "detail",
        component: Detail,
        props: true
      }
    ]
  },
  {
    path: "/about",
    name: "about",
    meta: { auth: true },
    component: () => import(/* webpackChunkName: "about" */ "./views/about.vue")
  }
];

const router = new Router();
router.addRoutes(routes);

//路由的全局守卫
// router.beforeEach((to, from, next) => {
//   if (to.meta.auth && !window.isLogin) {
//     if (window.confirm("Login")) {
//       window.isLogin = true;
//       next();
//     } else {
//       next("/");
//     }
//   } else {
//     next();
//   }
// });
export default router;
