export default {
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  props: {
    // 弹窗显示控制
    visible: {
      type: Boolean,
      default: false
    },
    // 路由记录
    history: {
      type: Object
    },
    // 配置了history后，初次渲染时，如果有history记录，则自动打开弹窗
    auto: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      firstOpen: false
    }
  },
  computed: {
    // 弹窗显示控制
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('visibleChange', val)
      }
    }
  },
  methods: {
    checkAutoOpen () {
      if (this.auto && this.hasHistoryInQuery()) {
        this.dialogVisible = true
        this.firstOpen = true
      }
    },

    // 弹窗打开
    handlePopupOpen () {
      this.addHistory()
    },

    // 弹窗关闭
    handlePopupClose () {
      // 如果是用户手动关闭弹窗，而且url上存在history参数，则需清除掉
      if (!this.autoTriggleClose && this.hasHistoryInQuery()) {
        // 两种清除url上history方法：
        // （1）如果有返回记录，则go(-1)后退清除history；
        // （2）如果没有则必须通过removeHistory来手动清除history（router.replace重置query上的history参数）
        if (this.hasBackRecord()) {
          this.$router.go(-1)
        } else {
          this.removeHistory()
        }
        console.log('手动关闭弹窗')
      }
      // 重置数据
      this.firstOpen = false
      this.autoTriggleClose = false
      this.hasOpenRecord = false
    },
    
    // 是否正确的返回路径（该方法只支持vue-router@4）
    // 当前路由的query和返回路由的query参数相减，刚好是history数据，说明是正确的返回路径，则可以通过router.go(-1)返回上一页来消除query上的history数据
    hasBackRecord () {
      // vue-router@4 通过window.history.state 能获取路由的记录信息
      // vue-router@3 通过extendRouterHistoryState方法扩展出路由的记录信息
      const state = window.history.state
      if ('back' in state) {
        if (!state.back) return false
        
        const backRouteData = this.$router.resolve(state.back || '') // 解析出返回路由
        const backRoute = (backRouteData || {}).route
        if (!backRoute) return false
        if (backRoute.path === this.$route.path) {
          const backQuery = backRoute.query 
          const curQuery = { ...this.$route.query}
          
          /* 当前路由的query和返回路由的query参数相减，刚好是history数据 */
          for (let key in backQuery) {
            if (!curQuery[key]) return false
            delete curQuery[key]
          }
          for (let key in this.history) {
            if (!curQuery[key]) return false
            delete curQuery[key]
          }
          return Object.keys(curQuery).length === 0
        }
        return false
      } else {
        // 没有路由的记录信息，则通过hasOpenRecord来判断
        return this.hasOpenRecord
      }
    },

    // 路由query上有history数据
    hasHistoryInQuery () {
      if (!this.history) return false
      const { query } = this.$route
      return Object.keys(this.history).some(key => {
        return !!query[key]
      })
    },

    // 在url上添加History参数
    addHistory () {
      // 如果query上不存在history参数，则添加history参数
      if (!this.hasHistoryInQuery()) {
        this.$router.push({
          query: {
            ...this.$route.query,
            ...this.history
          }
        })
        this.hasOpenRecord = true
        console.log('手动打开弹窗')
      }
    },

    // 在url上移除History参数
    removeHistory () {
      if (!this.history) return

      // 清除query上history的值
      const resetHistory = {}
      Object.keys(this.history).forEach(key => {
        resetHistory[key] = undefined
      })
      this.$router.replace({
        query: {
          ...this.$route.query,
          ...resetHistory
        }
      })
    }
  },
  watch: {
    '$route.query' () {
      if (!this.history) return

      const hasHistory = this.hasHistoryInQuery()
      // 自动关闭弹窗(浏览器后退自动触发关闭)
      if (!hasHistory && this.dialogVisible) {
        this.dialogVisible = false
        this.autoTriggleClose = true
        this.$emit('autoClose')
        console.log('自动关闭弹窗')
        return
      }
      // 自动打开弹窗(浏览器前进自动触发打开)
      if (hasHistory && !this.dialogVisible) {
        this.dialogVisible = true
        this.hasOpenRecord = true
        this.$emit('autoOpen')
        console.log('自动打开弹窗')
      }
    },
    dialogVisible (val) {
      val ? this.handlePopupOpen() : this.handlePopupClose()
    }
  },
  created () {
    if (this.dialogVisible) {
      this.handlePopupOpen()
    } else {
      this.checkAutoOpen()
    }
  }
}