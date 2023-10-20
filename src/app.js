import Event from './event';



export default class App {
  #event = null;
  #cs = [];

  constructor(...classes) {
    this.#event = new Event();

    for (const cls of classes) {
      this.load(cls);
    }

    if (window.app && window.app.cs) {
      this.#cs = window.app.cs;
    }

    this.event('app.ready').subscribe(_ => {
      for (const cb of this.#cs) {
        cb.call();
      }
    });

    this.event('app.loaded').publish();
    this.ready(_ => this.event('app.ready').publish());
  }

  load(cls) {
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

    this.event(`${inst.name}.loaded`).publish();
  }

  use(name) {
    if (!name) return this.error('no lib specified');
    if (this.name) return this[name];
    return this.error(`no lib found: ${name}`);
  }

  event(...name) {
    return this.#event.init(name);
  }

  ready(cb) {
    if (document.readyState !== 'loading') cb();
    else document.addEventListener('DOMContentLoaded', cb);
  }

  die(...v) {
    if (v.length) console.log(...v);
    process.exit();
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
}
