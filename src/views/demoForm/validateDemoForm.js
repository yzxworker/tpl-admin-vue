/**
 *  页面表单验证规则
 */
import {validateSpecial, validateNumber,validateURL,validateChineseID } from '@/common/utils/validate'
/**
 * 验证输入名称 中英文 必填
 * @param isMust
 * @returns {Function}
 */
export const validateInputName = (isMust=false)=>{
  return (rule, value, callback) => {
    const reg = /[\u4e00-\u9fa5]|[A-Z]|[a-z]+$/i;
    const maxWord = 10;
    if(isMust && (!value || value.length ===0)){
      callback(new Error('请输入此字段'))
      return
    }
    if (value && (validateSpecial(value) || !reg.test(value))) {
      callback(new Error('非法字符,请重新输入!'))
    }else if(value && !reg.test(value) && value.length>maxWord){
      callback(new Error(`最多可输入${maxWord}字!`))
    }else {
      callback()
    }
  };
}

/**
 * 验证联系方式
 * @param isMust 是否必填
 * @returns {Function}
 */
export const validateLinkPhone = (isMust=false)=>{
  return (rule, value, callback) => {
    const reg = /^[0-9|\-|/|_]+$/ig;
    const maxWord = 30;
    if(isMust && (!value || value.length ===0)){
      callback(new Error('请输入此字段'))
      return
    }
    if (value && !reg.test(value)) {
      callback(new Error('请输入有效联系方式!'))
    }else if(value && !reg.test(value) && value.length>maxWord){
      callback(new Error(`最多可输入${maxWord}字!`))
    }else {
      callback()
    }
  };
};


/***最终页面引用***/
export const filterFormRules ={
  userName: [
    {validator: validateInputName(), trigger: 'blur'}
  ],
  userPhoneNumber:[
    {validator: validateLinkPhone(), trigger: 'blur'}
  ]
};

export const dialogFormRules ={
  userName: [
    {required: true,validator: validateInputName(true), trigger: 'blur'}
  ],
  userPhoneNumber:[
    {required: true,validator: validateLinkPhone(true), trigger: 'blur'}
  ],
  userJob: [
    {required: true,message: '请输入岗位', trigger: 'blur'}
  ],
};
