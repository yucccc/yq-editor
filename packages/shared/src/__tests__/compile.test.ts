import { describe, expect, test } from 'vitest'
import { runCodeWithFunction } from '../compile'

describe('@shared/compile', () => {
  test('runCodeWithFunction 正常传递', () => {
    const res = runCodeWithFunction('function a() { return 1 }', 'a')
    expect(res).toBe(1)
  })
  test('runCodeWithFunction 解析参数', () => {
    const res = runCodeWithFunction('function a(a) { return a }', '1')
    expect(res).toBe('1')
  })

  test('runCodeWithFunction 未传递function 返回简单类型', () => {
    const res = runCodeWithFunction(' return 1 ', 'a')
    expect(res).toBe(1)
  })

  test('runCodeWithFunction 未传递function 返回复杂类型', () => {
    const res = runCodeWithFunction(' return {a: 1} ', 'a')
    expect(res).toEqual({
      a: 1,
    })
  })

  test('runCodeWithFunction 传递了函数', () => {
    const fn = function (params) {
      return params
    }
    const res = runCodeWithFunction(fn, { 参数1: 1 })
    expect(res).toEqual({ 参数1: 1 })
  })

  test('runCodeWithFunction 传递了函数', () => {
    const fn = function (params) {
      return params
    }
    const res = runCodeWithFunction(fn)
    expect(res).toEqual(undefined)
  })
})
