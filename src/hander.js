import { _option } from './options';
import { getType } from './until';
/**
 *
 * @param {string} type 错误类型
 * @param {*} data 错误信息
 */

export function getHandler(type, data) {
  let tansData = { type };
  switch (type) {
    case 'Error':
      //普通错误
      tansData.filename = data.filename;
      tansData.message = data.message;
      tansData.souceType = data.type;
      break;
    case 'XHR':
    case 'Fetch':
      tansData = { type, ...data };
      break;
    case 'Promise':
      tansData.reason = data.reason;
      tansData.message = data.message;
      tansData.souceType = data.type;
      break;
    case 'Vue':
      tansData.message = data.message;
      tansData.stack = data.stack;
      break;
  }
  report(_option.url, tansData);
}

/**
 *
 * @param {string} url   接口地址
 * @param {object} data 上传的数据
 */
export function report(url, data) {
  if (getType(_option.transport) === 'function') {
    _option.transport(data);
    return;
  }
  //这里进行默认的上传操作,默认用fetch，post
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * @description 手动上报
 * @param {*} err 手动上报的错误
 */
export function handleLog(err) {
  if (err) {
    report(_option.url, err);
  }
}
