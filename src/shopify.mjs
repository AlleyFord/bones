export default class Shopify {
  name = 'shopify';

  add(pl = []) {
    if (!Array.isArray(pl)) pl = [pl];
    let items = [];

    for (const item of pl) {
      if (!item.vid) continue;
      if (!item.quantity || parseInt(item.quantity) <= 0) item.quantity = 1;

      item.id = parseInt(item.vid);
      delete item.vid;

      items.push(item);
    }

    return app.post(app.route('cart.add'), {items});
  }

  update(pl = {}, qty = null) {
    if (qty !== null && typeof qty !== 'undefined') { // shorthand
      let vid = pl;
      pl = {};
      pl[vid] = qty;
    }

    return app.post(app.route('cart.update'), {updates: pl});
  }

  cart() {
    return app.get(app.route('cart.url'));
  }

  makePriceString(price, msrp, quantity = 1) {
    let save = '';

    if (msrp && msrp > 0 && price < msrp) {
      msrp = this.money(msrp * quantity);
      save = ` <s>${msrp}</s>`;
    }

    price = this.money(price * quantity);

    return `${price}${save}`;
  }

  money(v) {
    return app.format.money(parseInt(v) / 100);
  }
}
