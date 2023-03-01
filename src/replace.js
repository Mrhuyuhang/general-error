import { _global, listen, errorType, replaceAop, getType } from './until';
import { Dep } from './dep';
import { _option } from './options';
import { getHandler } from './hander';

export const dep = new Dep();

/**
 * @description 普通错误监听
 */
function listenError() {
  listen(_global, 'error', function (error) {
    dep.notifiy('Error', error);
  });
}

/**
 * @description promise错误
 */
function promiseError() {
  listen(_global, 'unhandledrejection', function (error) {
    dep.notifiy('Promise', error);
    console.log(11);
  });
}

/**
 * @description 重写xhr
 */
function replaceXhr() {
  if (!('XMLHttpRequest' in _global)) return;
  const originalXhrProto = XMLHttpRequest.prototype;
  //改写open
  replaceAop(originalXhrProto, 'open', (originalOpen) => {
    return function (...args) {
      //在调用原函数之前。可以做点事情。这里在this新增一些我们自定义的属性，以备后面可能会用到
      this.info_xhr = {
        method: args[0],
        url: args[1],
        sTime: Date.now(),
        type: 'XHR',
      };
      originalOpen.apply(this, args);
    };
  });
  //改写send
  replaceAop(originalXhrProto, 'send', (originalSend) => {
    return function (...args) {
      //监听loadend事件。这个事件不管失败成功。都会触发
      const { url } = this.info_xhr;
      listen(this, 'loadend', function () {
        if (
          _option.isOpUrl(url) ||
          _option.isFilterUrl(url) ||
          getType(_option.transport) === 'function'
        )
          return;
        //请求数据
        this.info_xhr.reqData = args[0];
        //状态
        this.info_xhr.status = this.status;
        //接口执行时长
        this.info_xhr.elapsedTime = Date.now() - this.info_xhr.sTime;
        //订阅通知
        dep.notifiy(this.info_xhr.type, this.info_xhr);
      });
      originalSend.apply(this, args);
    };
  });
}

/**
 * @description 重写fetch
 */
function replaceFetch() {
  if (!('fetch' in _global)) return;
  replaceAop(_global, 'fetch', (originalFetch) => {
    return function (url, config) {
      const sTime = Date.now();
      const method = (config && config.method) || 'GET';
      let info_fetch = {
        type: 'Fetch',
        method,
        reqData: config && config.body,
        url,
        sTime,
      };
      return originalFetch.apply(this, [url, config]).then(
        (res) => {
          //这里为了不污染原始的数据，clone一份进行操作
          let cloneRes = res.clone();
          cloneRes.text().then(() => {
            if (
              _option.isOpUrl(url) ||
              _option.isFilterUrl(url) ||
              getType(_option.transport) === 'function'
            )
              return;
            info_fetch.elapsedTime = Date.now() - sTime;
            info_fetch.status = res.status;
            dep.notifiy(info_fetch.type, info_fetch);
          });
          return res;
        },
        (err) => {
          if (
            _option.isOpUrl(url) ||
            _option.isFilterUrl(url) ||
            getType(_option.transport) === 'function'
          )
            return;
          info_fetch.elapsedTime = Date.now() - sTime;
          info_fetch.status = 0;
          dep.notifiy(info_fetch.type, info_fetch);
          throw err;
        },
      );
    };
  });
}

export function initReplaceHandle() {
  for (const value of errorType) {
    let typeObj = {
      type: value,
      cb: getHandler,
    };
    dep.addSub(typeObj);
  }
  listenError();
  promiseError();
  replaceXhr();
  replaceFetch();
}
