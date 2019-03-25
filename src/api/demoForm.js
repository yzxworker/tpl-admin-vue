/**
 *  demoform api
 */
import request from '@/common/utils/request'

/**
 * 分页查询列表
 * @param params
 * @returns {*}
 */
export function list(params) {
  return request.getApi('/demoForm/list',params)
}

/**
 * 添加
 * @param userName
 * @param userPhoneNumber
 * @param status
 * @returns {*}
 */
export function addDialogForm(userName,userPhoneNumber,status) {
  return request.postJsonApi('/demoForm/addForm',{
    userName,userPhoneNumber,status
  })
}

/**
 * 编辑更新
 * @param userName
 * @param userPhoneNumber
 * @param status
 * @returns {*}
 */
export function updateDialogForm(userName,userPhoneNumber,status) {
  return request.postJsonApi('/demoForm/updateForm',{
    userName,userPhoneNumber,status
  })
}

/**
 * id获取单条记录详情
 * @param id
 * @returns {*}
 */
export function getRowById(id) {
  return request.postJsonApi('/demoForm/getRowById',{
    id
  })
}
