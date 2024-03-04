export default class Cookie {
  name = 'cookie';

  DURATION_DAY = 86400;
  DURATION_WEEK = 604800;
  DURATION_MONTH = 18144000;
  DURATION_YEAR = 217728000;

  defaults = {
    duration: this.DURATION_MONTH,
    strict: true,
    domain: false,
    path: '/',
    key: false,
    value: false,
  };

  remove(opts) {
    this.set({
      ...opts,
      ...{
        duration: this.DURATION_YEAR * -1
      }
    });
  }

  get(k) {
    const m = document.cookie.match(RegExp(`(?:^|;\\s*)${k}=([^;]*)`));
    if (m) return decodeURIComponent(m[1]);
    return null;
  }

  set(opts) {
    opts = {...this.defaults, ...opts};

    let args = [];

    if (opts.key === false) return false;

    if (opts.path !== false) {
      args.push('path=' + opts.path);
    }

    if (opts.duration !== false) {
      let exp = new Date;

      args.push('max-age=' + opts.duration);
      args.push('expires=' + exp.setTime(exp.getTime() + opts.duration));
    }

    if (opts.domain !== false) {
      args.push('domain=' + opts.domain);
    }

    if (opts.strict === true) {
      args.push('SameSite=Strict');
    }

    document.cookie = opts.key + '=' + encodeURIComponent(opts.value) + (args.length ? ';' + args.join(';') : '');

    return true;
  }
}
