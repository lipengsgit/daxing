/**
 * 常用正则表达式
 * @type {{phone: {pattern: RegExp, message: string, label: string}}}
 */
const commonPatterns = {
  phone: {pattern: /^(((0\d{2}-)?\d{8}(-\d{1,4})?)|((0\d{3}-)?\d{7,8}(-\d{1,4})?))$/, message: '格式有误', label: '电话号码'},
  mobile: {pattern: /^1[3-9]\d{9}$/, message: '格式有误', label: '电话号码'},
  phoneAll: {pattern: /^(((0\d{2}-)?\d{8}(-\d{1,4})?)|((0\d{3}-)?\d{7,8}(-\d{1,4})?)|(1[3-9]\d{9}))$/, message: '格式有误', label: '电话号码'},
  mobileStrict: {pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '格式有误', label: '电话号码'},
  email:{pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, message: '格式有误' ,label:'邮箱'},
  idCard:{pattern: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/, message:'格式有误' ,label:'身份证'},
  name:{pattern : /^[\u4e00-\u9fa5]{2,4}$/, message :'输入不正确' ,label:'姓名'},
};

/**
 *
 * @param type
 * @param options
 * @returns {{}}
 */
export function patternRule(type, options){
  const pattern = {...commonPatterns[type]};
  if(options && options.label) pattern.label = options.label;
  pattern.message = pattern.label + pattern.message;

  if(options && options.message) pattern.message = options.message;
  return pattern;
}
