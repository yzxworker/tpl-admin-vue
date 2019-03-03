/**
 * 系统配置-导航配置
 */
import request from '@/common/utils/request'

/**
 * 底部导航信息
 */
export function footNavInfo() {
  return request({
    url: '/navigation/footNavInfo',
    method: 'get',
    params: { }
  })
}

/**
 * 底部导航修改
 * tmpPublish
 * backgroundUrl
 * navItem [] json 字符串
 */
export function updateFootNav({ tmPublish, backgroundUrl, navItem }) {
  return request({
    url: '/navigation/updateFootNav',
    method: 'post',
    params: { tmPublish, backgroundUrl, navItem }
  })
}
