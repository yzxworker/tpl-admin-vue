/**
 * 系统配置-弹窗模块
 */
import request from '@/common/utils/request'

/**
 * 弹窗列表
 * adName 弹窗名称
 * tmAd 弹窗上线时间
 * page
 * rows 页数
 */
export function queryAdPage(obj) {
  const _params = {
    page: 1,
    rows: 10,
    adName: null,
    tmAd: null
  }
  const params = Object.assign({}, _params, obj)
  return request({
    url: '/advertisement/queryAdPage',
    method: 'get',
    params: params
  })
}

/**
 * 弹窗详情查询
 * @param adId
 */
export function adInfo(adId) {
  return request({
    url: '/advertisement/adInfo',
    method: 'get',
    params: { adId }
  })
}

/**
 * 新增弹窗
 * adName 弹窗名称
 * tmAdStart 弹窗开始时间
 * tmAdEnd 弹窗结束时间
 * adUrl 弹窗图片地址
 * link  是否可跳转 TRUE FALSE
 * linkAddress 跳转地址 橱窗id
 * @param params
 */
export function saveAd(params) {
  return request({
    url: '/advertisement/saveAd',
    method: 'post',
    params
  })
}

/**
 * 删除广告
 * @param adId
 */
export function delAd(adId) {
  return request({
    url: '/advertisement/delAd',
    method: 'get',
    params: { adId }
  })
}

/**
 * 修改弹窗
 * adName 弹窗名称
 * tmAdStart 弹窗开始时间
 * tmAdEnd 弹窗结束时间
 * adUrl 弹窗图片地址
 * link  是否可跳转 TRUE FALSE
 * linkAddress 跳转地址 橱窗id
 * @param params
 */
export function updateAd(params) {
  return request({
    url: '/advertisement/updateAd',
    method: 'post',
    params
  })
}
