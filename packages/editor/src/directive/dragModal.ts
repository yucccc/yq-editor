import { nextTick } from 'vue'
// 注册自定义modal拖拽指令 注册在modal父元素上，避免找到dom
export const dragModal = {
  // 当被绑定的元素挂载到 DOM 中时……
  updated(el: HTMLElement | null, bindings: Object, vnode: Object) {
    nextTick(() => {
      if (!document.querySelector('.ant-modal')) { return }
      const dialogHeaderEls = document.querySelectorAll(
        '.ant-modal-header',
      ) as NodeListOf<HTMLElement>
      const dragDoms: any = document.querySelectorAll('.ant-modal')
      dialogHeaderEls.forEach((el: HTMLElement, i: number) => {
        const dragDom = dragDoms[i]
        const sty = dragDom.style
        el.style.cursor = 'move'
        el.onmousedown = (e: MouseEvent) => {
          const lf = dragDom.offsetLeft
          const tp = dragDom.offsetTop
          // 鼠标按下，计算当前元素距离可视区的距离
          const X = e.clientX // 鼠标位置
          const Y = e.clientY
          dragDom.style.position = 'absolute'
          dragDom.style.left = `${lf}px`
          dragDom.style.top = `${tp}px`
          // 获取到的值带px 正则匹配替换
          let styL: number,
            styT: number,
            dragDomWidth: number,
            dragDomHeight: number

          // //注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
          if (sty.left.includes('%')) {
            styL
              = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100)
            styT
              = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100)
          }
          else {
            styL = +sty.left.replace(/px/g, '')
            styT = +sty.top.replace(/px/g, '')
            dragDomWidth = +sty.width.replace(/px/g, '')
            dragDomHeight = +sty.height.replace(/px/g, '')
          }

          document.onmousemove = function (e: MouseEvent) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - X
            const t = e.clientY - Y
            // 移动当前元素
            dragDom.style.left = `${l + styL}px`
            dragDom.style.top = `${t + styT}px`
            const screenWidth = document.body.clientWidth
            const screenHeight = document.body.clientHeight
            if (l + styL <= 0) {
              dragDom.style.left = 0
            }
            else if (l + styL >= screenWidth - dragDomWidth) {
              dragDom.style.left = `${screenWidth - dragDomWidth}px`
            }
            if (t + styT <= 0) {
              dragDom.style.top = 0
            }
            else if (t + styT >= screenHeight - dragDomHeight) {
              dragDom.style.top = `${screenHeight - dragDomHeight}px`
            }

            // 将此时的位置传出去
            // binding.value({x:e.pageX,y:e.pageY})
          }

          document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      })
    })
  },
}
