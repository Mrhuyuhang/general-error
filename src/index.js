import { initReplaceHandle } from "./replace";
import { initOptions } from "./options";

function init(options) {
  initOptions(options);
  initReplaceHandle();
}

export default {
  init,
};
