const setting = {
  scroller: 'html'
}
let gobal = false

// 获取全部选项
function getOptions ($options) {
  return {
    ...setting,
    ...$options.keepScroll
  }
}

// 配置设置
export function configSetting (data) {
  Object.assign(setting, data)
}

const keepScroll = {
  methods: {
    // 恢复滚动位置
    restoreKeepScrollPos () {
      if (gobal && !this.$options.keepScroll) return
      if (!this.__pos) this.__pos = [0, 0]

      const options = getOptions(this.$options)
      const scroller = document.querySelector(options.scroller)
      if (!scroller) {
        console.warn(`keepScroll mixin: 未找到 ${options.scroller} Dom滚动容器`)
        return
      }
      this.__scroller = scroller
      scroller.scrollTop = this.__pos[0]
      scroller.scrollLeft = this.__pos[1]
    },
    // 记录滚动位置
    recordKeepScrollPos () {
      if (gobal && !this.$options.keepScroll) return
      if (!this.__scroller) return

      const scroller = this.__scroller
      this.__pos = [scroller.scrollTop, scroller.scrollLeft]
    },
    // 重置滚动位置
    resetKeepScrollPos () {
      if (gobal && !this.$options.keepScroll) return
      if (!this.__scroller) return

      const scroller = this.__scroller
      scroller.scrollTop = 0
      scroller.scrollLeft = 0
    }
  },
  activated () {
    this.restoreKeepScrollPos()
  },
  deactivated () {
    this.resetKeepScrollPos()
  },
  beforeRouteLeave (to, from, next) {
    this.recordKeepScrollPos()
    next()
  }
}

// 全局调用 Vue.use(keepScroll, setting)
function install (Vue, data = {}) {
  gobal = true
  Object.assign(setting, data)
  Vue.mixin(keepScroll)
}

// 支持全局或局部引入
keepScroll.install = install
export default keepScroll
