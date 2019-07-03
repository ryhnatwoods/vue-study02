import Vue from "vue";

function createRouteRecord(child) {
  if (child.children && child.children.length > 0) {
    let path = child.path;
    if (arguments[1]) {
      path = [arguments[1].parentPath, path].join("/");
    }
    createRouteRecord.call(this, child.children, { path });
  } else {
    let parentPath = arguments[1] ? arguments[1].parentPath : "";
    child = [].concat(child);
    child.forEach(item => {
      // eslint-disable-next-line
      const path = [parentPath, item.path].join("/").replace(/[\/]{2,}/g, "/");
      this.routeMap[path] = item.component;
    });
  }
}

class SRouter {
  constructor(options) {
    this.$options = options || {};
    this.routeMap = {};

    //路由响应,借助于Vue的响应式原理，依赖于Vue框架，不具有广泛的适用性
    this.app = new Vue({
      data: {
        current: "/"
      }
    });
  }

  init() {
    this.bindEvents(); //监听url的变化
    // @ts-ignore
    this.createRouteMap(this.$options); //解析路由配置
    this.initComponent(); //实现两个内置组件
  }

  bindEvents() {
    window.addEventListener("load", this.onHashChange.bind(this));
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  onHashChange() {
    this.app.current = window.location.hash.slice(1) || "/";
  }

  createRouteMap(options) {
    options.routes.forEach(
      function(item) {
        createRouteRecord.call(this, item);
      }.bind(this)
    );
  }

  initComponent() {
    Vue.component("router-link", {
      props: {
        to: String
      },
      render(h) {
        return h("a", { attrs: { href: "#" + this.to } }, [
          this.$slots.default
        ]);
      }
    });

    Vue.component("router-view", {
      render: h => {
        const comp = this.routeMap[this.app.current];
        return h(comp);
      }
    });
  }

  addRoutes(routes) {
    this.$options.routes = routes;
    // @ts-ignore
    this.createRouteMap(this.$options); //解析路由配置
  }
}

SRouter.install = function(Vue) {
  Vue.mixin({
    beforeCreate() {
      const _router = this.$options.router;
      if (_router) {
        Vue.prototype.$router = _router;
        _router.init();
      }
    }
  });
};

export default SRouter;
