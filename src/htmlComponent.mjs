export default class HTMLComponent extends HTMLElement {
  static tag = 'component';
  static observedAttributes = [];

  name = 'htmlComponent';
  display = 'block';
  shadow;
  id = null;


  constructor() {
    return super();
  }

  register() {
    app[this.name] = this;
  }

  setId(id) {
    this.id = id || app.makeId();
  }
  getId() {
    return this.id;
  }
  matches(obj) {
    let id = '';

    if (typeof obj === 'string') id = obj;
    else if (typeof obj === 'object' && obj !== null) id = obj.getId();

    return this.id === id;
  }

  map(kvs = {}) {
    this.$self = $b(this);

    for (let [k, qs] of Object.entries(kvs)) {
      let root = false;

      if (/::root\s*$/.test(qs)) {
        root = true;
        qs = qs.replace(/::root\s*$/, '');

      this[`$${k}`] = this.$self.find(qs);

      if (root) {
        this[`$${k}`] = this[`$${k}`].root();
      }
    }
  }

  useStorage(...ks) {
    for (const k of ks) {
      if (!app.storage.has(k)) app.storage.set(k, '');
    }
  }

  feedbackError(msg) {
    this.$self.find('.hideOnError').hide();
    return this.feedback(msg, 'error');
  }
  feedbackSuccess(msg) {
    this.$self.find('.hideOnSuccess').hide();
    return this.feedback(msg, 'success');
  }
  feedbackReset() {
    this.$self.find('.feedback').removeClass('success', 'error').html('');
    this.$self.find('.hideOnError').show();
    this.$self.find('.hideOnSuccess').show();
  }

  feedback(msg, type) {
    if (type === 'error') {
      this.$self.find('.feedback').removeClass('success').addClass('error');
    }
    else {
      this.$self.find('.feedback').removeClass('error').addClass('success');
    }

    this.$self.find('.feedback').html(msg);

    if (type === 'error') return false;
    return true;
  }

  disable() {
    this.$self.attr('disabled', 'disabled');
  }
  enable() {
    this.$self.removeAttr('disabled');
  }

  connectedCallback() {
    if (typeof app[this.name] !== 'undefined') app.event(`${this.name}.ready`).publish(this);
    this.setId();
    return this.connected(this.getId());
  }
  disconnectedCallback() { return this.disconnected(); }
  adoptedCallback() { return this.adopted(); }
  attributeChangedCallback(name, oldv, newv) {
    if (name === 'checked') this.setAttribute('aria-checked', newValue);
    return this.attributeChanged(name, oldv, newv);
  }

  // overload
  connected() {}
  disconnected() {}
  adopted() {}
  attributeChanged(name, oldv, newv) {}
}
