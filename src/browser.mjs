export default class Browser {
  name = 'browser';

  qs;
  hash;

  constructor() {
    this.parse();
  }

  parse(obj) {
    if (!obj) obj = window.location;
    this.qs = new URLSearchParams(obj.search || '');
    this.hash = obj.hash || '';
  }

  go(url) {
    window.location.href = url;
  }
}
