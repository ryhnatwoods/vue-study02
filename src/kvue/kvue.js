/* eslint-disable no-unused-vars */
class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.observe(this.$data);

    new Compiler(this, options.el);

    if (options.created) {
      options.created.call(this);
    }
  }

  observe(value) {
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(key => {
      this.defineReactive(value, key, value[key]);
      this.proxyData(key);
    });
  }
  proxyData(key) {
    //将data上的数据代理到创建的vue实例的属性上，这样外部就可以直接通过this去获取
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      }
    });
  }
  defineReactive(obj, key, val) {
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal;
          dep.notify();
        }
      }
    });
    //递归的监控属性
    this.observe(val);
  }
}

class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(watcher) {
    this.deps.push(watcher);
  }

  notify() {
    this.deps.forEach(watcher => watcher.update());
  }
}

Dep.target = undefined;

class watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    //定义一个静态属性
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }
  update() {
    this.cb.call(this.vm, this.vm[this.key]);
  }
}

//compiler
class Compiler {
  constructor(vm, el) {
    this.$vm = vm;
    this.$el = document.querySelector(el);

    if ((this, this.$el)) {
      this.$fragment = this.node2Fragament(this.$el);

      this.compile(this.$fragment);

      this.$el.appendChild(this.$fragment);
    }
  }
  node2Fragament(el) {
    const fragment = document.createDocumentFragment();
    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      //element node
      if (node.nodeType === 1) {
        this.compileElement(node);
      } else if (this.isInterpolation(node)) {
        this.compileText(node);
      }

      if (node.childNodes && node.childNodes.length) this.compile(node);
    });
  }
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  compileElement(node) {
    let nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name;
      const exp = attr.value;
      if (this.isDirective(attrName)) {
        const dir = attrName.slice(2);
        this[dir] && this[dir](node, this.$vm, exp);
      }
      if (this.isEvent(attrName)) {
        const dir = attrName.slice(1);
        this.eventHandler(node, this.$vm, exp, dir);
      }
    });
  }
  isDirective(attr) {
    return attr.indexOf("k-") === 0;
  }

  isEvent(attr) {
    return attr.indexOf("@") === 0;
  }

  compileText(node) {
    this.update(node, this.$vm, RegExp.$1, "text");
  }

  update(node, vm, exp, dir) {
    let updateFn = this[dir + "Updater"];
    exp = exp.trim();
    updateFn && updateFn(node, vm[exp]);
    new watcher(vm, exp, function(value) {
      updateFn && updateFn(node, value);
    });
  }

  eventHandler(node, vm, exp, dir) {
    const fn = vm.$options.methods && vm.$options.methods[exp];
    if (dir && fn) node.addEventListener(dir, fn.bind(vm));
  }

  text(node, vm, exp) {
    this.update(node, vm, exp, "text");
  }

  html(node, vm, exp) {
    this.update(node, vm, exp, "html");
  }

  model(node, vm, exp) {
    this.update(node, vm, exp, "model");
    node.addEventListener("input", e => {
      vm[exp] = e.target.value;
    });
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  modelUpdater(node, value) {
    node.value = value;
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }
}
