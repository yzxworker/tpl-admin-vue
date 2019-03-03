/**
 * 应用配置
 */
// 后端注入配置
let INJECTION_CONFIG = {}
const default_config = {
  dev: {
    urlPrefix: 'http://127.0.0.1:5000', // api请求前缀
    uploadUrl: 'http://127.0.0.1:5000/uploadImgs' // 上传地址
  },
  // 开发联调
  union: {
    // urlPrefix: 'http://172.16.11.76:8238',
    // uploadUrl: 'http://172.16.11.76:8238/uploadImgs'
    urlPrefix: 'http://areaboss.dev2.xsyxsc.cn/',
    uploadUrl: 'http://areaboss.dev2.xsyxsc.cn/uploadImgs'
  },
  // 正式部署
  prod: {
    urlPrefix: 'http://172.16.11.76:8238', // api请求前缀
    uploadUrl: 'http://172.16.11.76:8238/uploadImgs' // 上传地址
  }
}
// api 请求地址
let API_BASE_URL
switch (process.env.APP_ENV) {
  case 'development':
    INJECTION_CONFIG = Object.assign({}, default_config.dev)
    API_BASE_URL = INJECTION_CONFIG.urlPrefix
    break

  case 'union':
    INJECTION_CONFIG = Object.assign({}, default_config.union)
    API_BASE_URL = INJECTION_CONFIG.urlPrefix
    break

  case 'production':
    INJECTION_CONFIG = Object.assign({}, default_config.prod, g_config)
    API_BASE_URL = INJECTION_CONFIG.urlPrefix
    break

  default:
    API_BASE_URL = 'http://localhost:5000/'
}
// 上传配置 uploadImgs
const UPLOAD_CONFIG = {
  uploadUrl: INJECTION_CONFIG.uploadUrl,
  uploadDir: {
    systemAdImg: 'systemAdImg',
    systemFootNavImg: 'systemFootNavImg'
  }
}
console.log(`injection_config:`, INJECTION_CONFIG)
export {
  API_BASE_URL,
  UPLOAD_CONFIG
}
