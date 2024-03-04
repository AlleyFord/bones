export default class Observer {
  name = 'observer';
  app;

  constructor(app) {
    this.app = app;
  }

  // assuming always executed after dom loaded
  init(opts = {}) {
    if (!('IntersectionObserver' in window)) return false;

    let defaults = {
      activator: null,
      callback: null,
      enter: null,
      exit: null,
    };

    opts = {...defaults, ...opts};

    const dom = this.app.dom(opts.activator);

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(element => {
        if (opts.callback) opts.callback.call(app.dom(element.target), element, io);

        if (element.isIntersecting) {
          if (opts.enter) opts.enter.call(app.dom(element.target), element, io);
          if (opts.destroyAfter) io.unobserve(element.target);
        }
        else if (opts.exit) opts.exit.call(app.dom(element.target), element, io);
      });
    });

    dom.each(element => {
      io.observe(element);
    });
  }
}
