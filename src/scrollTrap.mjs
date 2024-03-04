class ScrollHandler {
  #tick = false;
  #listener = null;
  #e = false;

  constructor(node, cb) {
    this.#e = node;

    if (typeof cb !== 'undefined') {
      return this.create(cb);
    }
  }

  create(cb) {
    this.#listener = e => {
      if (!this.#tick) {
        const tick = _ => {
          const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

          const position = this.#e.position();
          const dimensions = this.#e.dimensions();

          // percent scrolling complete of activator
          let percentComplete = 0;
          let percent =
            (-(position.top) /
              (this.#e.outerHeight() - document.documentElement.clientHeight)
            );

          if (percent < 0) percentComplete = 0;
          else if (percent > 1) percentComplete = 1;
          else percentComplete = percent;

          cb.call(this.#e, {
            position: position,
            dimensions: dimensions,
            percentComplete: percentComplete,
            y: window.scrollY,
            x: window.scrollX,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight,
          });

          this.#tick = false;
        };

        window.requestAnimationFrame(tick);
        this.#tick = true;
      }
    };

    document.addEventListener('scroll', this.#listener);
    this.#listener();
  }

  destroy() {
    document.removeEventListener('scroll', this.#listener);
  }
}


export default class ScrollTrap {
  name = 'scrollTrap';

  app;
  data = {};

  constructor(app) {
    this.app = app;
  }

  init(opts) {
    let defaults = {
      activator: null,
      bar: false,
      watchInView: true,
      inViewClass: 'scrolled',
      inViewTolerance: .5,
      destroyAfterInView: false,
    };

    opts = {...defaults, ...opts};

    this.data[opts.activator] = {
      numElements: 0,
      numInView: 0,
      numOutOfView: 0,
      allInView: false,
      allOutOfView: false,
    };

    const $e = this.app.dom(opts.activator);
    const self = this;

    $e.each(function(node) {
      self.data[opts.activator].numElements++;

      const handler = new ScrollHandler(this);

      handler.create(function(data) {
        if (opts.hasOwnProperty('watchInView') && opts.watchInView) {
          const inViewClass = opts.inViewClass;
          const inViewTolerance = opts.inViewTolerance * data.viewportHeight;

          if (
               (data.position.top >= 0 && data.viewportHeight - data.position.top > inViewTolerance)
            || (data.position.top < 0 && data.dimensions.height + data.position.top > inViewTolerance)
          ) {
            data.inView = true;
            this.addClass(inViewClass);

            if (opts.hasOwnProperty('destroyAfterInView') && opts.destroyAfterInView) {
              handler.destroy();
            }
          }

          else {
            data.inView = false;
            this.removeClass(inViewClass);
          }

          self.data[opts.activator].numInView = $e.filter('.scrolled').length;
          self.data[opts.activator].numOutOfView = self.data[opts.activator].numElements - $e.filter('.scrolled').length;
          self.data[opts.activator].allInView = self.data[opts.activator].numInView === self.data[opts.activator].numElements;
          self.data[opts.activator].allOutOfView = self.data[opts.activator].numOutOfView === self.data[opts.activator].numElements;
        }

        if (opts.hasOwnProperty('callback')) {
          opts.callback.call(this, {...data, ...{data: self.data[opts.activator]}});
        }
      });
    });
  }
}
