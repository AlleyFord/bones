export default class Router {
  #routes = new Map();


  add(path, method, binding = null) {
    this.#routes.set(path, {
      method: method,
      binding: binding,
    });
  }

  go(path) {
    if (this.#routes.has(path)) {
      const handler = this.#routes.get(path);
      return handler.method.call(handler.binding);
    }
    else if (this.#routes.has('/404')) return this.go('/404');

    return false;
  }

  debug() {
    console.log(this.#routes);
  }
}
