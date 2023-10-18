export default class Component {
  name = 'component';
  cs = [];
  defaults = {};
  app = null;
  loaded = false;

  constructor(app) {
    this.app = app;
  }

  apply(opts) {
    opts = opts || {};
    opts = {...this.defaults, ...opts};

    for (const [k, v] of Object.entries(opts)) {
      this[k] = v;
    }

    return this;
  }

  init(opts) {
    return this.apply(opts).ready();
  }

  ready(fn) {
    if (typeof fn === 'function') this.cs.push(fn);

    if (this.loaded) {
      for (const cb of this.cs) {
        cb.call();
      }

      this.cs = [];
    }

    return this;
  }
}
