/**
 * 可用组件列表配置
 */import type { ActionSetType } from '@yq-editor/global-types'
// 重新请求下回显接口
const reloadState = (): ActionSetType => ({
  type: 'request',
  request: { apiName: '信息' },
})
const defaultTextTemplates = [
  {
    name: 'y-text',
    layerName: '标题组件',
    text: '大标题',
    fontSize: '30px',
    fontFamily: 'initial',
    fontWeight: 'bold',
    tag: 'h2',
    width: '100px',
    height: '36px',
    actionConfig: { type: '' },
    // 会被删掉
    __showComponent: {
      src: 'http://dl.hfrong.cn/hd_activities/1652932224291-title.png',
    },
  },
  {
    name: 'y-text',
    layerName: '文本组件',
    text: '正文内容',
    tag: 'p',
    width: '100px',
    height: '14px',
    actionConfig: { type: '' },
    // 会被删掉
    __showComponent: {
      src: 'http://dl.hfrong.cn/hd_activities/1652940735314-text.png',
    },
  },
  {
    name: 'y-button',
    layerName: '按钮组件',
    text: '按钮内容',
    color: '#ffffff',
    backgroundColor: '#1890ff',
    borderWidth: '1px',
    borderColor: '#1890ff',
    borderStyle: 'solid',
    borderRadius: '2px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    width: '100px',
    height: '40px',
    tag: 'button',
    textAlign: 'center',
    position: 'absolute',
    backgroundImage: '',
    backgroundSize: '100% 100%',
    actionConfig: { type: '' },
    isLockScale: true,
    // 会被删掉
    __showComponent: {
      src: 'http://dl.hfrong.cn/hd_activities/1652940921183-16-botton.png',
    },
  },
]
const text = defaultTextTemplates.map(template => ({
  // ...textDefaultProps,
  // size
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  boxShadow: '0 0 0 #000000',
  opacity: '1',
  // position and x,y
  position: 'absolute',
  left: '0',
  top: '0',
  right: '0',
  backgroundColor: 'transparent',
  backgroundSize: 'auto auto',
  backgroundImage: 'none',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundAttachment: 'scroll',
  fontSize: '14px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'left',
  color: '#000000',
  ...template,
  sourceDataKey: '',
}))
const defaultImageTemplates = [
  {
    name: 'y-image',
    width: '100px',
    layerName: '图片组件',
    height: '100px',
    src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    actionConfig: { type: '' },
    isLockScale: true,
    // 会被删掉
    __showComponent: {
      src: 'http://dl.hfrong.cn/hd_activities/1652941072238-image@2x.png',
    },
  },
]
// 领取状态按钮
const defaultSignComponentTemplate = {
  layerName: '基础状态组件',
  name: 'act-state-btn',
  // 获取数据的字段
  width: '100px',
  height: '54px',
  position: 'absolute',
  left: '10px',
  top: '10px',
  // 给一张默认的签到图 根据sourceData变化而变化
  currentImgSrc:
    'http://dl.hfrong.cn/osstest/1632898696039-getBtn.0df26f80.png',
  isNeedGrayClass: false,
  disabled: false,
  stateConfig: [],
  sourceDataKey: '',
  // 会被删掉
  __showComponent: {
    src: 'http://dl.hfrong.cn/osstest/1632898696039-getBtn.0df26f80.png',
  },
}

// 抽奖回调
const defaultLotteryCallback = {
  type: 'popup',
  code: 'function fn(props) {\r\n    console.log(props)\r\n}',
  popup: {
    popupConfig: {
      popup1: {
        template: 'gift',
        content: '',
        width: '300px',
        title: '',
        backgroundImage:
          'url(\'http://dl.hfrong.cn/osstest/1646102051250-恭喜大人獲得以下道具.png\')',
        contentStyle: '{\r\n    "paddingTop":"70px"\r\n}',
        templateProps: {
          list: {
            arrange: [
              {
                key: 'imgUrl',
                style: '',
                type: 'img',
                _key: 'd5365ffa-1d97-4af1-bc99-0966bc65fe5f',
              },
            ],
          },
        },
      },
    },
    currentUsePopupKey: 'popup1',
    requestConfig: {
      apiName: 'luck',
      isClickRequest: false,
      sourceDataKey: 'luck.data.giftList',
      useCache: false,
      successPopupKey: 'popup1',
      errorPopupKey: '',
      finallyPopupKey: '',
    },
  },
}
// 轨道
const defaultTrackComponentTemplate = {
  name: 'act-track',
  layerName: '轨道组件',
  position: 'absolute',
  left: '10px',
  top: '10px',
  width: '300px',
  height: '400px',
  circle: 3,
  direction: 'observe',
  execCbDuration: 500,
  subComponentName: 'act-base-image',
  CALLBACK_END: {
    ...defaultLotteryCallback,
  },
  fromZero: false,
  subComponent: [
    {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '40px',
      height: '40px',
      src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    },
    {
      width: '40px',
      height: '40px',
      position: 'absolute',
      left: '130px',
      top: '0px',

      src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    },
    {
      width: '40px',
      height: '40px',
      position: 'absolute',
      left: '250px',
      top: '0px',
      src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    },
    {
      width: '40px',
      height: '40px',

      position: 'absolute',
      left: '250px',
      top: '80px',
      src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    },
    {
      width: '40px',
      height: '40px',

      position: 'absolute',
      left: '250px',
      top: '170px',
      src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    },
    {
      width: '40px',
      height: '40px',

      position: 'absolute',
      left: '130px',
      top: '170px',
      src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    },
    {
      width: '40px',
      height: '40px',

      position: 'absolute',
      left: '0px',
      top: '170px',
      src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    },
    {
      width: '40px',
      height: '40px',

      position: 'absolute',
      left: '0px',
      top: '80px',
      src: 'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png',
    },
  ],
  __showComponent: {
    src: 'http://dl.hfrong.cn/osstest/1630463369085-luck.gif',
  },
}

const defaultTurntableComponentTemplate = {
  name: 'act-turntable',
  layerName: '转盘组件',
  position: 'absolute',
  left: '0',
  top: '0',
  width: '350px',
  height: '350px',
  CALLBACK: {
    ...defaultLotteryCallback,
  },
  num: 8,
  isPointerRotate: 1,
  direction: 0,
  coronaImg:
    'http://dl.hfrong.cn/osstest/1638253687910-turntable-bg.77e19392.png',
  pointerImg: 'http://dl.hfrong.cn/osstest/1646970424929-1.png',
  pointerWidth: '130px',
  pointerLeft: '50%',
  pointerTop: '50%',
  pointerStyle: '',
  __showComponent: {
    src: 'http://dl.hfrong.cn/osstest/1638253687910-turntable-bg.77e19392.png',
  },
}

const defaultTurnEggComponentTemplate = {
  layerName: '扭蛋组件',
  name: 'act-egg',
  position: 'absolute',
  left: '10px',
  top: '100px',
  width: '150px',
  height: '150px',
  eggImgAry: [
    'http://dl.hfrong.cn/osstest/1638519276393-c1-0bd05bcc59.png',
    'http://dl.hfrong.cn/osstest/1638519293912-c2-6506b08801.png',
    'http://dl.hfrong.cn/osstest/1638519314078-c3-e81abfa2c2.png',
    'http://dl.hfrong.cn/osstest/1638519334811-c4-5448cb87bc.png',
    'http://dl.hfrong.cn/osstest/1638519354267-c5-0c78cdbcb3.png',
    'http://dl.hfrong.cn/osstest/1638519293912-c2-6506b08801.png',
  ],
  CALLBACK: {
    ...defaultLotteryCallback,
  },
  __showComponent: {
    src: 'http://dl.hfrong.cn/osstest/1638518375716-turnEgg.png',
  },
}

const defaultMagnifierComponentTemplate = {
  name: 'act-magnifier',
  position: 'absolute',
  layerName: '放大镜组件',
  left: '10px',
  top: '10px',
  width: '350px',
  height: '350px',
  giftImgs: [
    'http://dl.hfrong.cn/osstest/1646904669064-id5.png',
    'http://dl.hfrong.cn/osstest/1646904706055-id6.png',
    'http://dl.hfrong.cn/osstest/1646904725349-id7.png',
    'http://dl.hfrong.cn/osstest/1646904738728-id8.png',
    'http://dl.hfrong.cn/osstest/1646904755061-id9.png',
    'http://dl.hfrong.cn/osstest/1646904767417-id10.png',
    'http://dl.hfrong.cn/osstest/1646904781368-id11.png',
    'http://dl.hfrong.cn/osstest/1646904795287-id12.png',
  ],
  iconWidth: '40px',
  runningTime: 4,
  minTurns: 5,
  scale: 1.4,
  CALLBACK: {
    type: 'code',
    code: 'function fn(props) {\r\n    console.log(334545)\r\n}',
  },
  __showComponent: {
    src: 'http://dl.hfrong.cn/osstest/1646984151794-企业微信20220310-112033.png',
  },
}

const image = defaultImageTemplates.map(template => ({
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  boxShadow: '0 0 0 #000000',
  opacity: '1',
  // position and x,y
  position: 'absolute',
  left: '0',
  top: '0',
  right: '0',
  backgroundColor: 'transparent',
  backgroundSize: 'auto auto',
  backgroundImage: 'none',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundAttachment: 'scroll',
  ...template,
}))

export default {
  base: [...text, ...image],
  business: [
    defaultSignComponentTemplate,
    defaultTurntableComponentTemplate,
    defaultTrackComponentTemplate,
    defaultTurnEggComponentTemplate,
    defaultMagnifierComponentTemplate,
  ],
}
