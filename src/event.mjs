export default class Event {
  name = null;
  cs = {};

  #app;

  constructor(app) {
    this.#app = app;
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
      if (this.cs[name]) {
        this.cs[name].push(cb);
      }
      else {
        this.cs[name] = [cb];
      }

      this.#app.debug(`event.subscribe(${name})`);
    }

    return this;
  }

  pub(context) {
    return this.publish(context);
  }
  publish(context) {
    let count = 0;

    for (const name of this.name) {
      if (this.cs[name]) {
        this.cs[name].forEach(cb => {
          cb.call(context, context);
          count++;
        });
      }

      this.#app.debug(`event.publish(${name}): ${count} calls`);
    }

    return this;
  }
}
