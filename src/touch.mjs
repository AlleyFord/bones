class TouchHandler {
  #opts = {};
  #defaults = {
    threshold: 44,
    passive: true,
  };

  #el = null;
  #cs = {};

  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
  distanceX = 0;
  distanceY = 0;
  dragging = false;


  constructor(el, opts = {}) {
    this.#el = el instanceof EventTarget ? el : document.querySelector(el);
    this.#opts = {...this.#defaults, ...opts};

    this.#el.addEventListener('touchstart', e => this.start(e), this.#opts);
    this.#el.addEventListener('touchend', e => this.end(e), this.#opts);
    this.#el.addEventListener('touchmove', e => this.move(e), this.#opts);
  }

  start(e) {
    this.dragging = true;
    this.#el.classList.add('dragging');

    this.startX = e.changedTouches[0].screenX;
    this.startY = e.changedTouches[0].screenY;

    this.#call('start', e);
  }
  end(e) {
    this.dragging = false;
    this.#el.classList.remove('dragging');

    this.endX = e.changedTouches[0].screenX;
    this.endY = e.changedTouches[0].screenY;

    this.distanceX = this.endX - this.startX;
    this.distanceY = this.endY - this.startY;

    this.handle(e);
    this.#call('end', e);
  }
  move(e) {
    if (!this.dragging) return;
    this.#call('move', e);
  }

  remove() {
    this.#el.removeEventListener('touchstart', e => this.start(e), this.#opts);
    this.#el.removeEventListener('touchend', e => this.end(e), this.#opts);
  }

  /*
    swipeLeft
    swipeRight
    swipeUp
    swipeDown
    tap
  */
  bind(name, fn) {
    if (!this.#cs.hasOwnProperty(name)) this.#cs[name] = [];
    this.#cs[name].push(fn);
    return this;
  }
  #call(name, e) {
    requestAnimationFrame(_ => {
      for (const cb of this.#cs[name] || []) {
        cb.call(this.#el, this, this.#simplifyEvent(e));
      }
    });
  }
  #simplifyEvent(e) {
    return e.touches[0];
  }

  handle(e) {
    if (this.endX + this.#opts.threshold <= this.startX) this.#call('swipeLeft', e);
    if (this.endX - this.#opts.threshold >= this.startX) this.#call('swipeRight', e);
    if (this.endY + this.#opts.threshold <= this.startY) this.#call('swipeUp', e);
    if (this.endY - this.#opts.threshold >= this.startY) this.#call('swipeDown', e);
    if (this.endY === this.startY) this.#call('tap', e);
  }
}

export default class Touch {
  name = 'touch';
  app;

  constructor(app) {
    this.app = app;
  }

  watch(el, opts = {}) {
    return new TouchHandler(el, opts);
  }
}
