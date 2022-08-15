// 是否数字
export function isNumber(v: any): boolean {
  return typeof v === 'number'
}
// 是否字符串
export function isString(v: any): boolean {
  return typeof v === 'string'
}
// 是否对象
export function isObject(v: any): boolean {
  return Object.prototype.toString.call(v) === '[object Object]'
}
// 是否函数
export function isFunction(v: any): boolean {
  return typeof v === 'function'
}
// 是否undefined
export function isUndefined(v: any): boolean {
  return v === undefined
}
// 布尔
export function isBoolean(v: any): boolean {
  return typeof v === 'boolean'
}
// 数组
export function isArray(v: any): boolean {
  return Array.isArray(v)
}

// 空对象
export function isEmptyObject(v: any): boolean {
  if (!isObject(v)) { return true }
  return Object.keys(v).length === 0
}

// ----------
const class2type: any = {}
const toString = class2type.toString // =>Object.prototype.toString

'Boolean Number String Function Array Date RegExp Object Error Symbol'
  .split(' ')
  .forEach((item) => {
    class2type[`[object ${item}]`] = item.toLowerCase()
  })
// ----------

/**
 * 输出输入的是什么类型
 * @param obj
 * @returns type
 */
export function toType(obj: any): string {
  if (obj === null || obj === undefined) {
    return `${obj}`
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object'
    : typeof obj
}
