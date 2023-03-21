import Vue from 'vue'

const SCROLLBOX = 'router-view-cache-scroller'

function toArray (data) {
  return Array.isArray(data) ? data : [data]
}

function install (app) {
  app.mixin({
    beforeRouteLeave (to, from, next) {
      if (this.$attrs[SCROLLBOX]) { // 必须是带有SCROLLBOX标示的路由组件
        const scrollBoxs = toArray(this.$attrs[SCROLLBOX]) // 支持传入数组
        this.$_pos = {}
        // 记录滚动位置
        scrollBoxs.forEach(box => {
          const scroller = document.querySelector(box)
          if (scroller) {
            this.$_pos[box] = {
              top: scroller.scrollTop,
              left: scroller.scrollLeft
            }
          }
        })
      }
      next()
    },
    activated () {
      if (this.$attrs[SCROLLBOX]) { // 必须是带有SCROLLBOX标示的路由组件
        const scrollBoxs = toArray(this.$attrs[SCROLLBOX])
        // 恢复滚动位置
        scrollBoxs.forEach(box => {
          const scroller = document.querySelector(box)
          const pos = (this.$_pos || {})[box] // 获取滚动位置
          if (scroller && pos) {
            scroller.scrollTop = pos.top
            scroller.scrollLeft = pos.left
          }
        })
      }
    },
    deactivated () {
      if (this.$attrs[SCROLLBOX]) { // 必须是带有SCROLLBOX标示的路由组件
        const scrollBoxs = toArray(this.$attrs[SCROLLBOX])
        // 重置滚动位置
        scrollBoxs.forEach(box => {
          const scroller = document.querySelector(box)
          if (scroller) {
            scroller.scrollTop = 0
            scroller.scrollLeft = 0
          }
        })
      }
    }
  })
}

export default function registerKeepScroll () {
  Vue.use(install)
}
