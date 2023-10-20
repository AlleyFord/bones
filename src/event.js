export default class Event {
  name = null;
  cs = {};

  #debug = true;

  #_(v) {
    if (this.#debug) console.debug(v);
  }

  init(...name) {
    this.name = name;
    return this;
  }

  sub(cb) {
    return this.subscribe(cb);
  }
  subscribe(cb) {
    for (const name of this.name) {
      if (this.cs.name) {
        this.cs[name].push(cb);
      }
      else {
        this.cs[name] = [cb];
      }

      this.#_(`event.subscribe(${name})`);
    }

    return this;
  }

  pub(context) {
    return this.publish(context);
  }
  publish(context) {
    for (const name of this.name) {
      if (this.cs[name]) {
        this.cs[name].forEach(cb => {
          cb.call(context);
        });
      }

      this.#_(`event.publish(${name})`);
    }

    return this;
  }
}
