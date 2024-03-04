import Event from './event.mjs';
import Norm from './norm.mjs';



export default class App {
  norm = {};
  #event = null;
  #cs = [];

  #e = null;
  #debug = true;

  constructor(...classes) {
    this.norm = new Norm(this);
    this.#event = new Event(this);

    if (window?.app) {
      if (window.app?.cs) { // preserve initial callstack
        this.#cs = window.app.cs;
        delete window.app.cs;
      }

      // port the placeholder event object
      if (window.app?._event) {
        this.#event.cs = window.app._event.cs;
        delete window.app._event;
      }

      ['copy', 'url', 'routes'].forEach(k => { // OK vars to load in from env
        if (window.app[k]) this[k] = window.app[k];
      });
    }

    // set the main window obj and obliterate the loader obj
    try {
      delete window.app;
      window.app = this;
    }
    catch(e) {}

    for (const cls of classes) {
      this.load(cls);
    }

    this.event('app.ready').subscribe(_ => {
      for (const cb of this.#cs) {
        cb.call();
      }
    });

    this.ready(_ => this.event('app.ready').publish());
  }

  makeId() {
    return 'app-' + Array.from(window.crypto.getRandomValues(new Uint32Array(4)), v => v.toString(16).padStart(8, '0')).join('');
  }

  stopDefault(e) {
    try {
      e?.preventDefault();
      e?.stopPropagation();
    }
    catch(err) {}
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  load(...cls) {
    for (const c of cls) {
      this.#loadCls(c);
    }
  }
  #loadCls(cls) {
    if (!cls) return this.error('no class specified');

    let inst;

    try {
      inst = new cls(this);
    }
    catch(e) {
      return this.error(e);
    }

    if (typeof inst.loader === 'function') inst.loader(this);
    else {
      inst.loaded = true;
      this[inst.name] = inst;
    }

    this.event(`${inst.name}.ready`).publish();

    return this[inst.name];
  }

  use(name) {
    if (!name) return this.error('no lib specified');
    if (this.name) return this[name];
    return this.error(`no lib found: ${name}`);
  }

  event(...name) {
    return this.#event.init(name);
  }

  defer(cb) {
    if (document.readyState === 'complete') cb();
    else document.addEventListener('readystatechange', e => {
      if (document.readyState === 'complete') cb();
    });
  }

  ready(cb) {
    //if (document.readyState !== 'loading') cb();
    if (document.readyState !== 'complete') cb();
    else document.addEventListener('DOMContentLoaded', cb);
  }

  die(...v) {
    if (v.length) console.log(...v);
    process.exit();
  }

  debug(...v) {
    if (this.#debug) console.debug(...v);
  }
  setDebug(b) {
    this.#debug = b === true;
  }

  log(...v) {
    console.log(...v);
  }

  out(...v) {
    process.stdout.write(...v);
  }

  line(v) {
    process.stdout.write(`${v}\n`);
  }

  error(str) {
    throw new Error(str);
    return false;
  }

  decodeEntities(v, sanitize = true) {
    if (!v || typeof v === 'undefined' || v === null) return '';
    if (this.#e === null) this.#e = document.createElement('div');

    if (sanitize) {
      v = v
        .replace(/<script[^>]*>([\S\s]*?)<\/script>/mig, '')
        .replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/mig, '');
    }

    this.#e.innerHTML = v;
    v = this.#e.textContent;
    this.#e.textContent = '';

    return v;
  }

  localize(k, def) { return this._(k, def); }
  _(k, def) {
    const defaultCopy = def ?? '';

    if (!this.copy || !this.copy[k]) return defaultCopy;
    return this.decodeEntities(this.copy[k]);
  }

  route(dotpath) {
    const path = dotpath.split('.').reduce((a, b) => a[b], this.routes);
    return `${path}.js`;
  }
}
