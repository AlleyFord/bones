/* core */
import Router from './core/router.js';

/* utilities */
import Index from './utility/index.js'; // required route. sets up 404
import Base64 from './utility/base64.js';



class App {
  router = new Router();
  debug = false;


  constructor(opts) {
    this.apply(opts);

    // load any utilities here
    this.load(Index).init();
    this.load(Base64).init();

    // default behavior
    this.router.go('/');
  }


  apply(opts) {
    for (const [k, v] of Object.entries(opts || {})) {
      this[k] = v;
    }
  }

  log(v) {
    if (this.debug) console.log(v);
  }

  load(cls) {
    if (this.hasOwnProperty(cls.name)) return this[cls.name];

    const inst = new cls(this);
    return this[inst.name] = inst;
  }
}



const app = new App({
  debug: true,
});

if (typeof window !== 'undefined') window.app = app;
export default app;
