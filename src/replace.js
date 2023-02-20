import { _global, listen, errorType, replaceAop } from "./until";
import { Dep } from "./Dep";
const dep = new Dep();
/**
 * @description 普通错误监听
 */
function listenError() {
  listen(_global, "error", function () {
    dep.notifiy("Error", error);
  });
}
/**
 * @description 重写xhr
 */
function replaceXhr() {
  if (!("XMLHttpRequest" in _global)) return;
  const originalXhrProto = XMLHttpRequest.prototype;
  //改写open
  replaceAop(originalXhrProto, "open", (originalOpen) => {
    return function (...args) {
      //在调用原函数之前。可以做点事情。这里在this新增一些我们自定义的属性，以备后面可能会用到
      this.info_xhr = {
        method: args[0],
        url: args[1],
        sTime: Date.now(),
        type: "XHR",
      };
      originalOpen.apply(this, args);
    };
  });
  //改写send
  replaceAop(originalXhrProto, "send", (originalSend) => {
    return function (...args) {
      console.log(this);
      //监听loadend事件。这个事件不管失败成功。都会触发
      const { url } = this.info_xhr;
      listen(this, "loadend", function () {
        //状态
        this.websee_xhr.status = this.status;
        //接口执行时长
        this.websee_xhr.elapsedTime = Date.now() - this.websee_xhr.sTime;
        //订阅通知
        dep.notifiy(this.websee_xhr.type, this.websee_xhr);
      });
      originalSend.apply(this, args);
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

export function initReplaceHandle() {
  for (const value of errorType) {
    let typeObj = {
      type: value,
      cb: getHandler,
    };
    dep.addSub(typeObj);
  }
  listenError();
  replaceXhr();
}
