export class Dep {
  handleErrors = {};
  constructor() {}
  addSub(errors) {
    this.handleErrors[errors.type]
      ? this.handleErrors[errors.type].push(errors.cb)
      : (this.handleErrors[errors.type] = [errors.cb]);
  }

  notifiy(type, data) {
    this.handleErrors[type].forEach((cb) => {
      cb(type, data);
    });
  }
}
