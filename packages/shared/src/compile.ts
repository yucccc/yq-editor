import { isFunction, isString } from 'lodash-es'

/**
 * 字符串代码执行
 * 相关文档 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval#don.27t_use_eval.21
 * @code string
 * "console.log(123)" 输出 123
 */

const fnString = (code: string) => `function fn(params) { ${code} }`
/**
 * 执行代码编辑器代码
 * @param string 方法
 * @param params 传给方法的值
 */
export function runCodeWithFunction<T>(code: string | Function, params?: T) {
  try {
    if (isString(code)) {
      if (code.includes('script')) {
        console.log('%c [ 传递了非法数据 ]-23-「compile」', 'font-size:13px; background:pink; color:#bf2c9f;', code)
        return null
      }
      // 如果传递进来已经包含了 function 则不再包装执行
      const s = code.includes('function') ? code : fnString(code)
      return Function(` "use strict"; return (${s})`)()(params)
    }
    else if (isFunction(code)) {
      return code(params)
    }
    // 传递了对象或者其他直接返回
    else {
      return code
    }
  }
  catch (error) {
    console.log('%c [ 执行字符串函数报错 ]-35-「compile」', 'font-size:13px; background:pink; color:#bf2c9f;', error, code, params)
    throw error
  }
}
