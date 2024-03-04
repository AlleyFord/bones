// BROKEN
import path from 'node:path';



export default class Cli {
  name = 'cli';
  args = {};
  env = [];

  REQUIRED = 'required';
  OPTIONAL = 'optional';

  helperText = null;
  app = null;

  constructor(app) {
    this.app = app;
    this.setEnvArgs(process.argv);
  }

  helper(v) {
    this.helperText = v;
  }

  usage(v) {
    if (this.helperText) {
      this.app.log(this.helperText);
    }

    return this.app.die(`usage: node ${path.basename(this.getEnvArg(1))} ${v}`);
  }

  async need(...keys) {
    return new Promise((resolve, reject) => {
      for (const key of keys) {
        if (this.getArg(key) === null) {
          reject(this.#errorRequired(key));
        }
      }
      resolve(true);
    });
  }

  #errorRequired(key) {
    return `${key} is required`;
  }

  async parse(args, offset = 0) {
    return new Promise((resolve, reject) => {
      let index = parseInt(offset) || 0;

      for (const [k, type] of Object.entries(args)) {
        const value = self.getEnvArg(2 + index++);

        this.args[k] = value;

        if (type === self.REQUIRED && !value) reject(this.#errorRequired(key));
      }

      resolve(true);
    });
  }

  setEnvArgs(env) {
    this.env = env;
  }

  getEnvArg(index) {
    return this.env[index] || null;
  }

  get(key) {
    return this.getArg(key);
  }
  getArg(key) {
    return this.args[key] || null;
  }

  has(key) {
    return this.args.hasOwnProperty(key);
  }
}
