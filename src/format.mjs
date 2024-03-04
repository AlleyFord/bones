export default class Format {
  name = 'format';

  money(v) {
    const f = new Intl.NumberFormat('us', {
      style: 'currency',
      currency: 'usd',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return f.format(v);
  }
}
