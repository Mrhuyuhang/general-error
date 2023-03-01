import { initReplaceHandle, dep } from './replace';
import { initOptions } from './options';
import { handleLog } from './hander';

function init(options) {
  initOptions(options);
  initReplaceHandle();
}

//vue使用插件的方式进行错误上报
function install(Vue, options = {}) {
  //初始化参数
  init(options);
  //首先缓存原先的handler
  let handler = Vue.config.errorHandler;
  Vue.config.errorHandler = function (err, vm, info) {
    // 处理错误上报
    dep.notifiy('Vue', err);
    //执行handler
    if (handler) {
      handler.apply(null, [err, vm, info]);
    }
  };
}

export default {
  init,
  install,
  handleLog,
};
