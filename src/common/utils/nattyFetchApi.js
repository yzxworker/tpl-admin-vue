/**
 * natty-fetch 配置
 */
import nattyFetch from 'natty-fetch'

const nattyFetchApi = nattyFetch.setGlobal({
  // 配置整个项目所有接口的参数中都包含`__token`字段
  data: {
    // __token: 'xxx',
    cookie: 'xxx'
  }
})
export default nattyFetchApi
