export default class Interface {
  static textarea(opts) {
    return {
      ...{
        type: 'textarea',
      },
      ...opts,
    };
  }

  static text(opts) {
    return {
      ...{
        type: 'text',
      },
      ...opts,
    };
  }
}
