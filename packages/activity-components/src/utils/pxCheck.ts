import { isNumber } from './isType'

export const pxCheck = (value: string | number): string => {
  return isNaN(Number(value)) ? String(value) : `${value}px`
}

export const string2numAndUnit = (v: string): [number, string] => {
  const n = parseInt(v)
  if (isNumber(v)) { return [n, 'px'] }
  const str = v.match(/[a-z|A-Z]+/gi)?.join() || 'px'
  return [n, str]
}
