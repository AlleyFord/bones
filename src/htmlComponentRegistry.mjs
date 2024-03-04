export default class HTMLComponentRegistry {
  static connect(...cls) {
    for (const c of cls) {
      if (!window.customElements.get(c.tag)) {
        window.customElements.define(c.tag, c);
      }
    }
  }
}
