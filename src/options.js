import { validateKey, getType } from './until';
class Option {
  constructor() {
    //初始化参数
    this.url = '';
    this.filterUrl = [];
    this.transport = null;
  }
  bindData(op) {
    const { url, filterUrl, transport } = op;
    validateKey(op, 'url', 'string') && (this.url = url);
    validateKey(op, 'filterUrl', 'array') && (this.filterUrl = filterUrl);
    validateKey(op, 'transport', 'function') && (this.transport = transport);
  }
  isOpUrl(sourceUrl) {
    return this.url === sourceUrl;
  }
  isFilterUrl(sourceUrl) {
    return this.filterUrl.indexOf(sourceUrl) > -1;
  }
}

let _option = new Option();

export function initOptions(options) {
  if (!options) {
    console.error('general-error：请传入参数');
    return;
  }
  if (!options.url && getType(options.transport) !== 'function') {
    console.error('general-error：参数url不能为空');
    return;
  }
  _option.bindData(options);
}

export { _option };
