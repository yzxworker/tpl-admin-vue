/**
 * 系统配置-橱窗
 */
import request from '@/common/utils/request'

/**
 * 橱窗列表
 * @param foo
 */
export function windowList(foo = null) {
  return request({
    url: '/brandHouseWindow/windowList',
    method: 'get',
    params: { foo }
  })
}

export function testApi() {
  return request({
    url: '/index/index',
    method: 'get',
    params: { }
  })
}
