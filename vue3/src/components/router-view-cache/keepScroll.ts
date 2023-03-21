import type { App } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const SCROLLBOX = 'router-view-cache-scroller'
const ResetScroll = 'router-view-cache-reset-scroll'

function toArray (data: string[] | string) {
  return Array.isArray(data) ? data : [data]
}

function install (app: App) {
  app.mixin({
    created () {
      if (this.$attrs[SCROLLBOX]) { // 必须是带有SCROLLBOX标示的路由组件

        onBeforeRouteLeave(() => {
          const scrollBoxs = toArray(this.$attrs[SCROLLBOX]) // 支持传入数组
          this.$_pos = {}
          // 记录滚动位置
          scrollBoxs.forEach(box => {
            const scroller = document.querySelector(box)
            if (scroller) {
              const isReset = this.$attrs[ResetScroll]
              this.$_pos[box] = {
                top: isReset ? 0 : scroller.scrollTop,
                left: isReset ? 0 : scroller.scrollLeft
              }
            }
          })
        })
      }
    },
    activated () {
      if (this.$attrs[SCROLLBOX]) { // 必须是带有SCROLLBOX标示的路由组件
        const scrollBoxs = toArray(this.$attrs[SCROLLBOX])
        // 恢复滚动位置
        scrollBoxs.forEach(box => {
          const scroller = document.querySelector(box)
          const pos = this.$_pos?.[box] // 获取滚动位置
          if (scroller && pos) {
            scroller.scrollTop = pos.top
            scroller.scrollLeft = pos.left
          }
        })
      }
    }
  })
}

const installed = new Map<App, true>([])
export default function registerKeepScroll (app: App) {
  if (installed.has(app)) return // 避免重复安装
  installed.set(app, true)

  app.use(install)
}
