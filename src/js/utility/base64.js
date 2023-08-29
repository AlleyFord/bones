import { Utility, Interface } from '../core/utility.js';


export default class Base64 extends Utility {
  name = 'base64';
  description = 'Encode & decode Base64';
  route = '/base64';

  constructor(app) {
    super(app);

    this.addMethod({
      name: 'Encode',
      method: this.encode,
      description: "Encodes a string to base64",
      interface: Interface.textarea({
        maxLength: 1000,
        properties: 'example',
      }),
    });
    this.addMethod({
      name: 'Decode',
      method: this.decode,
      description: "Decodes a base64 string to text",
      interface: Interface.textarea({
        maxLength: 900,
      }),
    });
  }

  index() {
    this.app().log('base64.index');
  }

  encode(input) {
    return btoa(String(input));
  }

  decode(input) {
    return atob(String(input));
  }
}
