export default class Ajax {
  name = 'ajax';

  MIME_JSON = 'application/json';
  MIME_JS = 'application/javascript';
  MIME_TXT_JSON = 'text/json';
  MIME_TXT_JS = 'text/javascript';
  MIME_FORM = 'application/x-www-form-urlencoded';

  loader(app) {
    app.get = (...args) => this.get(...args);
    app.post = (...args) => this.post(...args);
    app.put = (...args) => this.put(...args);
    app.del = (...args) => this.del(...args);
    app.isOk = (req) => this.isOk(req);
  }

  get(url, args) {
    return this.request('get', url, args);
  }
  post(url, args) {
    return this.request('post', url, args);
  }
  put(url, args) {
    return this.request('put', url, args);
  }
  del(url, args) {
    return this.request('del', url, args);
  }

  isOk(res) {
    return res?._request?.ok === true;
  }

  request(method, url, args = {}) {
    method = String(method).toLowerCase();

    let body = null;

    const headers = {...args.headers || {}};
    if (args.headers) delete args.headers;

    if (method === 'get') {
      if (Object.keys(args).length) {
        url += '?' + new URLSearchParams(args).toString();
      }
    }
    if (['post', 'put'].includes(method)) {
      body = args;
    }

    if (headers.hasOwnProperty('content-type') && headers['content-type'] === this.MIME_FORM) {
      if (body) {
        let encoded = [];

        for (const [k, v] of Object.entries(body)) {
          encoded.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }

        body = body ? encoded.join('&') : null;
      }
    }
    else {
      headers['content-type'] = this.MIME_JSON;
      body = body ? JSON.stringify(body) : null;
    }

    return fetch(url, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      headers: headers,
      redirect: 'follow',
      body: body,
    })
    .then(async res => {
      const request = {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        redirected: res.redirected,
      };

      const mime = res.headers.get('content-type');
      let body = false;

      if (mime && (
           mime.indexOf(this.MIME_JSON) !== -1
        || mime.indexOf(this.MIME_TXT_JSON) !== -1
        || mime.indexOf(this.MIME_JS) !== -1
        || mime.indexOf(this.MIME_TXT_JS) !== -1
      )) {
        try {
          body = await res.json();
        }
        catch(e) {
          body = {};
        }
        try {
          body._request = request;
        }
        catch(e) {}
      }

      else {
        body = await res.text();
      }

      return body;
    });
  }
}
