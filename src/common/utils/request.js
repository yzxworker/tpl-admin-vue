import axios from 'axios'
import { Message } from 'element-ui' // MessageBox
import Qs from 'qs'
// import store from '../../store'
// import { getToken } from '@/common/utils/auth'
import { API_BASE_URL } from '../../config'

// 全局的 axios 默认值1
axios.defaults.baseURL = API_BASE_URL
axios.defaults.timeout = 20000 // 20s 防止上传api超时
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

let LOADING
/**
 * 拦截请求数据
 */
axios.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   environment.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    if (!LOADING) {
      LOADING = Loading.service({
        fullscreen: true,
        text: '拼命加载中...',
        background: 'rgba(255,255,255,0)'
      })
    }

    // 超时处理
    setTimeout(() => {
      LOADING && LOADING.close()
      LOADING = null
    }, 15000)

    return config
  },
  error => {
    LOADING && LOADING.close()
    LOADING = null
    console.log(error) // for debug
    Promise.reject(error)
  }
);

// response 拦截器
axios.interceptors.response.use(
  response => {
    LOADING && LOADING.close()
    LOADING = null
    /**
     * code为非success是抛错 todo结合自己业务进行修改
     */
    const res = response.data
    const resStatus = response.status
    if (res.rspCode !== 'success') {
      Message({
        message: res.rspDesc || res.message || '出错了',
        type: 'error',
        duration: 5 * 1000
      })
      //todo 登陆过期判断
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err:' + error) // for debug
    Message({
      message: error.rspDesc || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

/**
 * 自定义 post方法
 * @param url
 * @param params
 * @param opts
 * @returns {AxiosPromise<any>}
 */
axios.postApi = function(url, params, opts = {}) {
  return axios.post(url, Qs.stringify(params), ...opts)
};

export default axios
