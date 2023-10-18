class DOM {
  nodes = [];
  firstNodes = [];

  CLASS_ACTIVE = 'active';
  CLASS_INACTIVE = 'inactive';


  constructor(expr) {
    if (expr instanceof HTMLElement || Array.isArray(expr) || this.isNodeList(expr)) {
      this.setNodes(this.flatten(expr), true);
    }
    else {
      this.setNodes(this.flatten(document.querySelectorAll(expr)), true);
    }

    return this;
  }


  isNodeList(nodes) {
    return NodeList.prototype.isPrototypeOf(nodes);
  }


  flatten(nodes) {
    let newNodes = [];

    if (this.isNodeList(nodes)) {}
    else if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }

    nodes.forEach(node => {
      if (Array.isArray(node)) {
        node.forEach(_node => {
          newNodes.push(_node);
        });
      }
      else {
        newNodes.push(node);
      }
    });

    return newNodes;
  }


  setNodes(nodes, replaceFirst = false) {
    this.nodes = nodes;

    if (replaceFirst) {
      this.firstNodes = nodes;
    }
  }


  activate() {
    return this.removeClass(this.CLASS_INACTIVE).addClass(this.CLASS_ACTIVE);
  }
  deactivate() {
    return this.removeClass(this.CLASS_ACTIVE).addClass(this.CLASS_INACTIVE);
  }
  isActive() {
    return this.hasClass(this.CLASS_ACTIVE);
  }


  clone() {
    let newDOM = new DOM();

    newDOM.firstNodes = this.firstNodes;
    newDOM.nodes = this.nodes;

    return newDOM;
  }


  static(callback) {
    let ret = [];

    this.nodes.forEach(node => {
      ret.push(callback(node));
    });

    return (ret.length === 1) ? ret[0] : ret;
  }


  get length() {
    return this.nodes.length;
  }


  apply(callback) {
    return this.nodes.forEach((node, i) => {
      callback(node, i);
    });
  }


  each(callback) {
    this.apply((node, i) => {
      callback.call(this.eq(i), node, i);
    });

    return this;
  }


  eq(i) {
    let newDOM = this.clone();

    if (this.nodes.length && typeof this.nodes[i] !== 'undefined') {
      newDOM.setNodes(newDOM.flatten([this.nodes[i]]));
    }

    return newDOM;
  }


  on(event, isolated, callback, opts) {
    if (typeof isolated === 'function') {
      callback = isolated;
      isolated = false;
    }

    let options = {
      capture: false,
      once: false,
      passive: false,
    };

    this.apply((node, i) => {
      const eopts = {...options, ...opts};

      if (isolated) {
        node.addEventListener(event, el => {
          if (el.target.matches(isolated)) {
            callback.call(new DOM(el.target), el);
          }
        }, eopts);
      }

      else {
        node.addEventListener(event, el => {
          callback.call(this.clone().eq(i), el);
        }, eopts);
      }
    });

    return this;
  }

  enter(callback) {
    return this.on('keyup', null, function(e) {
      if (e.keyCode === 13) callback.call(this, e);
    });
  }

  click(callback) {
    if (typeof callback === 'undefined') {
      this.apply((node, i) => {
        const e = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });

        const canceled = !node.dispatchEvent(e);
      });

      return this;
    }

    return this.on('click', null, callback);
  }


  filter(expr, match_descendants) {
    let newDOM = this.clone();
    let nodes = [];

    newDOM.apply(node => {
      let descendants = [];

      if (match_descendants) {
        descendants = node.querySelectorAll(expr);
      }

      const match = node.matches(expr);

      if (match) {
        nodes.push(newDOM.flatten(node));
      }

      if (match_descendants) {
        if (descendants && descendants.length) {
          nodes.push(newDOM.flatten(descendants));
        }
      }
    });

    newDOM.setNodes(newDOM.flatten(nodes));

    return newDOM;
  }


  find(expr) {
    return this.filter(expr, true);
  }


  parent(expr) {
    if (typeof expr !== 'undefined') return this.parents(expr);

    let newDOM = this.clone();
    let nodes = [];

    newDOM.apply(node => {
      nodes.push(node.parentNode);
    });

    newDOM.setNodes(newDOM.flatten(nodes));

    return newDOM;
  }

  parents(expr) {
    let newDOM = this.clone();
    let nodes = [];

    this.apply(node => {
      while (node.parentNode) {
        node = node.parentNode;

        if (node && typeof node.matches === 'function' && node.matches(expr)) {
          nodes.push(node);
        }
      }
    });

    newDOM.setNodes(newDOM.flatten(nodes));

    return newDOM;
  }

  addClass(...cls) {
    this.apply(node => {
      cls.forEach(c => {
        if (String(c).trim().length) {
          node.classList.add(c);
        }
      });
    });

    return this;
  }
  removeClass(...cls) {
    this.apply(node => {
      cls.forEach(c => {
        if (String(c).trim().length) {
          node.classList.remove(c);
        }
      });
    });

    return this;
  }
  hasClass(...cls) {
    let flag = 1;

    this.apply(node => {
      cls.forEach(c => {
        if (c[0] === '.') c = c.substring(1, 99);
        if (node.classList.contains(c)) flag &= 1;
        else flag &= 0;
      });
    });

    return flag;
  }

  val(v) {
    if (typeof v === 'undefined') {
      return this.static(node => {
        return node.value;
      });
    }

    this.apply(node => {
      node.value = v;
    });

    return this;
  }

  serialize() {
    let data = {};
    const form = new FormData(this.nodes[0]);

    for (const [k, v] of form) {
      if (!data.hasOwnProperty(k)) {
        data[k] = v;
      }
      else {
        if (!Array.isArray(data[k])) {
          data[k] = [data[k]];
        }

        data[k].push(v);
      }
    }

    return data;
  }

  html(v) {
    if (typeof v === 'undefined') {
      return this.static(node => {
        return node.innerHTML;
      });
    }

    this.apply(node => {
      node.innerHTML = v;
    });

    return this;
  }

  data(k, v) {
    return this.attr(`data-${k}`, v);
  }

  attr(k, v) {
    if (typeof v === 'undefined') {
      return this.static(node => {
        return node.getAttribute(k);
      });
    }

    this.apply(node => {
      node.setAttribute(k, v);
    });

    return this;
  }

  removeAttr(k) {
    this.apply(node => {
      node.removeAttribute(k);
    });

    return this;
  }

  append(v) {
    this.apply(node => {
      node.insertAdjacentHTML('beforeend', v);
    });

    return this;
  }

  template(sel, vars) {
    // Example usage:
    // <template id="template">
    //   <div>%%name%%</div>
    //   <div>%%age%%</div>
    // </template>
    //
    // const html = $b().template('#template', {name: 'John', age: 30});
    //
    // -or-
    //
    // const html = $b().template('%%name%% is old', {name: 'John'});

    // template variable literals
    const TL_L = '%%';
    const TL_R = '%%';
    let html = '';

    if (sel.includes(TL_L)) {
      html = sel;
    }
    else {
      const t = new DOM(sel);
      html = t.html() || '';
    }

    for (const [k, v] of Object.entries(vars || {})) {
      html = html.replace(new RegExp(`${TL_L}\\s*${k}\\s*${TL_R}`, 'gm'), v);
    }

    // cleanup. there may be empty values, replace the template strings with nothing
    html = html.replace(new RegExp(`${TL_L}\\s*.*?\\s*${TL_R}`, 'gm'), '');

    if (this.nodes?.length > 0) {
      return this.html(html);
    }

    // allows direct invocation
    return html;
  }
}



export default class Dom {
  name = 'dom';

  loader(app) {
    app.dom = expr => new DOM(expr);
    window.$b = app.dom;
  }
}
