export default class Norm {
  int(v) {
    if (typeof v === 'undefined' || v === null || Number.isNaN(parseInt(v))) return null;
    return parseInt(v);
  }
}
