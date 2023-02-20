/**
 * @description 判断window是否存在
 */
export function isWindow() {
  return typeof window === "object" ? window : null;
}

export const _global = isWindow();
export const errorType = ["Error", "XHR", "Fetch", "Promise"];
/**
 * @description 通用监听方法
 * @param ctx {object} 上下文
 * @param eventName {string} 事件名称
 * @param hander {function} 事件函数
 * @param option {blooean}
 * @return void
 */
export function listen(ctx, eventName, hander, option = false) {
  ctx.addEventListener(eventName, hander, option);
}

/**
 * @description 通用重写函数 重写对象里的某一个属性
 * @param source {object} 重写的源对象
 * @param key {string} 需要重写的key
 * @param replaceFn {function} aop函数
 * @param isFoce {boolean} 是否强制重写
 */
export function replaceAop(source, key, replaceFn, isFoce = false) {
  console.log(2);
  if (source === undefined) return;
  if (key in source || isFoce) {
    const original = source[key]; //原始函数
    const wrapped = replaceFn(original); //触发aop操作
    //覆盖对象原有的属性
    if (typeof wrapped === "function") {
      source[key] = wrapped;
    }
  }
}
