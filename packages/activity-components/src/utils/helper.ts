import { isObject } from './isType'

export const stringStyleToStyle = (
  jsonStringStyle?: string | object,
): object => {
  if (!jsonStringStyle) { return {} }
  try {
    if (isObject(jsonStringStyle)) { return jsonStringStyle as object }
    return JSON.parse(jsonStringStyle as string)
  }
  catch (e) {
    console.error('不是合格的json合格 请检查', jsonStringStyle)
    return { jsonStringStyle }
  }
}
