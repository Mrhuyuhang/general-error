# general-error
关于这个sdk。目前只有最基本的上报错误的功能。可以上报最基本的代码报错，资源加载报错，promise错误，xhr，fetch，还有vue的报错（react的错误可以在Error Boundary组件里面进行手动上报，下面会介绍使用方法）在后续会增加其他的功能。

### 使用npm安装:

```shell
npm install general-error
```

### 想使用script标签引入，请复制这里面的代码到你的本地，然后引入：

https://github.com/Mrhuyuhang/general-error/blob/main/dist/index.js

### 使用方法：

```javascript
import GenError from "general-error";

GenError.init({url:"/report"})
```

### VUE:

```javascript
import Vue from "vue";
import GenError from "general-error";

Vue.use(GenError,{url:"/report"})
```

**general-error。使用fetch进行上报数据，默认方法是post。但是它也提供了一个自定义上报的方式：**

```javascript
Vue.use(GenError, {
  url: "",
  transport: () => {
    axios
      .get("/user", {
        params: {
          ID: 12345,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  },
});
```

**此时url这个参数就变为了非必传项，general-error会执行transport里的方法（必须为一个函数）。<u>值得注意的是，为了避免你的上报接口报错。使用axios这种地方库进行数据请求时，请考虑好边界情况，即在catch里进行错误捕获</u>**

### API:

1. GenError.init：sdk的初始化；此函数接收一个参数‘options’，即sdk的初始化参数。
2. GenError.handleLog：手动上报错误，此函数接收一个参数‘err’，即要上传的错误对象。



### options：

- url:错误上报的地址，在transport为空或者不为一个函数时，这个参数为必传；
- transport：自定义上报函数；
- filterUrl：写进此数组的url不会被监控

