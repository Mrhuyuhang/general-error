import { _global, listen, errorType } from "./until";
import { Dep } from "./handleEvents";
/**
 * @description 普通错误监听
 * @param {object} global this
 * @param {*function} hander 执行函数
 */
function listenError(global, hander) {
  listen(global, "error", hander);
}
/**
 * @description 重写xhr
 */
function repalceXhr() {
  if (!("XMLHttpRequest" in _global)) return;
  const originalXhrProto = XMLHttpRequest.prototype;
  replaceAop(originalXhrProto, "open", (originalOpen) => {
    return function (...args) {
      //在调用原函数之前。可以做点事情
      originalOpen.apply(this, args);
    };
  });
}

function getHandler(type, data) {
  switch (type) {
    case "Error":
      //普通错误
      console.log("2222");
      console.log(data);
      break;
  }
}

const dep = new Dep();

export function initReplaceHandle() {
  for (const value of errorType) {
    let typeObj = {
      type: value,
      cb: getHandler,
    };
    dep.addSub(typeObj);
  }
  listenError(_global, function (error) {
    dep.notifiy("Error", error);
  });
}
