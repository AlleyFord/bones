import { Utility, Interface } from '../core/utility.js';


export default class Index extends Utility {
  name = 'index';
  description = 'bones.io';
  route = '/';

  constructor(app) {
    super(app);

    this.app().router.add('/404', this.notFound, this);
  }

  notFound() {
    this.app().log('index.404');
  }

  index() {
    this.app().log('index.index');
  }
}
