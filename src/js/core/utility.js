import Interface from './interface.js';


class Utility {
  name = 'utility';
  description = 'A generic utility';
  route = '/default';

  methods = [];

  #app = {};
  #methodPrototype = {
    name: '',
    method: '',
    description: '',
  };


  constructor(app) {
    this.#app = app;
  }

  init() {
    this.app().router.add(this.route, this.index, this);
  }

  app() {
    return this.#app;
  }

  addMethod(opts) {
    this.methods.push({...this.#methodPrototype, ...opts});
  }

  in(v) {
  }

  out(v) {
  }

  index() {
    this.app().log(`utility.index`);
  }
}


export { Utility, Interface };
