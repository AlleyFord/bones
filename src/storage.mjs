export default class Storage {
  name = 'storage';

  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    }
    catch(e) {}
  }
  get(k) {
    let v = null;

    try {
      v = JSON.parse(localStorage.getItem(k));
    }
    catch(e) {}

    return v;
  }

  del(k) {
    return this.remove(k);
  }
  remove(k) {
    localStorage.removeItem(k);
  }
  clear() {
    localStorage.clear();
  }

  exists(k) {
    return this.has(k);
  }
  has(k) {
    return this.get(k) !== null;
  }

  hasValue(k, v) {
    if (!this.has(k)) return false;
    const curv = this.get(k) || [];
    return curv.includes(v);
  }

  appendUnique(k, v) {
    return this.concat(k, v, true);
  }
  append(k, v) {
    return this.concat(k, v);
  }
  concat(k, v, unique = false) {
    const curv = this.get(k) || [];
    if (unique && curv.includes(v)) return;
    this.set(k, [...curv, v]);
  }
}
