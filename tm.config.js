module.exports = {
  "description": "tm demo config",
  "author": "ricopter@qq.com",
  "webpackConfig":{
    "dev":{
      // 本地代理
      "proxyTable": {
        "/api": {
          "target": "http://xxx.xxx.com",// http://127.0.0.1:8000
          "pathRewrite": {
            "^/api": ""
          },
          "changeOrigin": true
        }
      }
    },
    // 打包自定义配置
    "build": {

    }
  }
}
