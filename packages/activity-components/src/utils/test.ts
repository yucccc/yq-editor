const fnString = (code: string) => `function fn(props) { ${code} }`

function runCodeWithFunction(string: string, props: any) {
  const s = string.includes('function') ? string : fnString(string)
  return Function(`"use strict";return (${s})`)()(props)
}

const _renderProps = {
  emitter: {},
  totalResData: {},
}

const actionMap: any = {
  code(code: string) {
    runCodeWithFunction(code, _renderProps)
  },
}

export default (props: any) => {
  const temp: any = {}
  Object.keys(props).forEach((key) => {
    temp[key] = props[key]
    if (key.includes('CALLBACK')) {
      const cur = props[key]
      const { code, type } = cur
      temp[key] = () => {
        actionMap[type](code)
      }
    }
  })
  return temp
}
