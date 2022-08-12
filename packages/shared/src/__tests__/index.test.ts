import { describe, expect, test } from 'vitest'

import { bgUrlToSrc, getURLParameters, groupBy, srcToBgUrl, stringToJson, stringify } from '../index'
const url = 'http://dl.hfrong.cn/hd_activities/1655292611730-vue-color-avatar(1).png?a=1&b=2&c=3'
const bgUrl = 'url(\'http://dl.hfrong.cn/hd_activities/1655292611730-vue-color-avatar(1).png?a=1&b=2&c=3\')'
const gTest = [{ index: '1', name: 'a' }, { index: '1', name: 'b' }, { index: '2', name: 'c' }]
const gTest2 = [{ name: 'a' }, { index: '1', name: 'b' }, { index: '2', name: 'c' }]
const gTest3 = [{ index: '', name: 'a' }, { index: '1', name: 'b' }, { index: '2', name: 'c' }]

describe('@shared/index', () => {
  test('groupBy1', () => {
    expect(groupBy(gTest, 'index')).toEqual({
      1: [{ index: '1', name: 'a' }, { index: '1', name: 'b' }],
      2: [{ index: '2', name: 'c' }],
    })
  })

  test('groupBy 测试空值', () => {
    const t = groupBy(gTest2, 'index', { filterNull: true })
    const r = {
      1: [{ index: '1', name: 'b' }],
      2: [{ index: '2', name: 'c' }],
    }
    expect(t).toEqual(r)
  })

  test('groupBy 带有空返回', () => {
    expect(groupBy(gTest2, 'index')).toEqual({
      undefined: [{ name: 'a' }],
      1: [{ index: '1', name: 'b' }],
      2: [{ index: '2', name: 'c' }],
    })
  })
  test('groupBy 带有空返回2', () => {
    expect(groupBy(gTest3, 'index')).toEqual({
      '': [{ name: 'a', index: '' }],
      '1': [{ index: '1', name: 'b' }],
      '2': [{ index: '2', name: 'c' }],
    })
  })

  test('fixBgUrlToUrl', () => {
    expect(bgUrlToSrc(bgUrl)).toEqual(url)
  })

  test('srcToBgUrl', () => {
    expect(srcToBgUrl(url)).toEqual(bgUrl)
  })
  const o = { a: 1, b: 2, c: 3 }
  test('stringify', () => {
    expect(stringify(o)).toBe('a=1&b=2&c=3')
  })

  test('stringToJson', () => {
    expect(stringToJson('')).toEqual({})
    expect(stringToJson('{"result":true, "count":42}')).toEqual({ result: true, count: 42 })
    expect(stringToJson('{"a":true, "b":42}')).toEqual({ a: true, b: 42 })
  })
})

test('getURLParameters', () => {
  expect(getURLParameters('http://sso.hfrong.cn:81/login?targetUrl=http://localhost:9990')).toEqual({ targetUrl: 'http://localhost:9990' })
  expect(getURLParameters('https://gitlab.haifurong.cn/editor/biz-editor/tree/refactor-monorepo')).toEqual({})
})

