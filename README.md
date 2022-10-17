# 给弹窗加上历史记录

## 背景

大多数情况下，一个弹窗是不需要有状态的，也就是说弹窗打开后，刷新页面弹窗会消失，浏览器后退则返回上一页，与弹窗无关联；而有状态的弹窗是弹窗打开后，刷新页面，弹窗会保持打开状态，浏览器后退则弹窗消失但是页面不会返回上一页。有状态弹窗在某些场景会有一个很好的用户体验，例如一个很重要的列表页，详情内容是通过侧边弹窗打开显示，用户可以通过url打开页面，同时详情内容弹窗自动打开显示。

## 状态弹窗实现方案

经过我的一番考虑，决定使用查询参数query实现有状态的弹窗。因为给url加上查询参数，浏览器会多加一条历史记录，那么浏览器后退的时候，就会去掉新加的查询参数，而仍然停留在当前页面。

举个例子：有一个页面 `demo/page`，打开弹窗时，在url上加上query：`?dialog=true` ，变为`demo/page?dialog=true`，返回上一页，就会回到原来的页面 `demo/page`。

> hash也可以添加路是记录，但是使用 `query` 而不用 `hash` 的原因是 `query` 通过 `?key=value` 方式看着更加顺眼，而且通过 `Vue` 操作 `query` 更加简单方便。

查看demo：

vue2: https://xiaocheng555.github.io/history-popup/vue2/

vue3: https://xiaocheng555.github.io/history-popup/

## Vue3实现方式

``` js
// useHistoryPopup.ts
import { ref, watch, onBeforeMount, Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export interface Option {
  history: Ref<object>, // URL上的记录
  dialogVisible: Ref<boolean>, // 控制弹窗显示
  auto?: boolean, // 初次渲染，如果url上存在记录则自动打开
  onAutoOpen?: Function, // 自动打开回调
  onAutoClose?: Function, // 自动关闭回调
}

export default (option: Option) => {
  const router = useRouter()
  const route = useRoute()
  const firstOpen = ref(false) // 是否首次打开弹窗
  const { dialogVisible } = option
  
  let hasOpenRecord = false // 是否有打开弹窗的记录
  let autoTriggleClose = false // 是否自动关闭弹窗

  // 初次渲染时，检测是否需要打开弹窗，url存在history参数则打开
  function checkAutoOpen () {
    if (option.auto && hasHistoryInQuery()) {
      dialogVisible.value = true
      firstOpen.value = true
    }
  }
  
  // 弹窗打开
  function handleOpen () {
    addHistory()
  } 

  // 弹窗关闭
  function handleClose () {    
    // 如果是用户手动关闭弹窗，而且url上存在history参数，则需清除掉
    if (!autoTriggleClose && hasHistoryInQuery()) {
      // 两种清除url上history方法：
      // （1）如果有返回记录，则go(-1)后退清除history；
      // （2）如果没有则必须通过removeHistory来手动清除history（router.replace重置query上的history参数）
      if (hasBackRecord()) {
        router.go(-1)
      } else {
        removeHistory()
      }
      console.log('手动关闭弹窗')
    }
    // 重置数据
    firstOpen.value = false
    autoTriggleClose = false
    hasOpenRecord = false
  }
  
  // 是否正确的返回路径（该方法只支持vue-router@4）
  // 当前路由的query和返回路由的query参数相减，刚好是history数据，说明是正确的返回路径，则可以通过router.go(-1)返回上一页来消除query上的history数据
  function hasBackRecord () {
    // vue-router@4 通过window.history.state 能获取路由的记录信息
    const state = window.history?.state
    if (state) {
      if (!state.back) return false
      
      const backRoute = router.resolve(state.back || '') // 解析出返回路由
      if (backRoute.path === route.path) {
        const backQuery = backRoute.query 
        const curQuery = {...route.query}
        
        /* 当前路由的query和返回路由的query参数相减，刚好是history数据 */
        for (let key in backQuery) {
          if (!curQuery[key]) return false
          delete curQuery[key]
        }
        for (let key in option.history.value) {
          if (!curQuery[key]) return false
          delete curQuery[key]
        }
        return Object.keys(curQuery).length === 0
      }
      return false
    } else {
      // 非vue-router@4是没有back的，则通过hasOpenRecord来判断
      return hasOpenRecord
    }
  }
  
  // 路由query上有history数据
  function hasHistoryInQuery () {
    if (!option.history.value) return false

    const { query } = route
    return Object.keys(option.history.value).some(key => {
      return !!query[key]
    })
  }

  // 在url上添加History参数
  function addHistory () {
    // 如果query上不存在history参数，则添加history参数
    if (!hasHistoryInQuery()) {
      router.push({
        query: {
          ...route.query,
          ...option.history.value
        }
      })
      hasOpenRecord = true
      console.log('手动打开弹窗')
    }
  }

  // 在url上移除History参数
  function removeHistory () {
    if (!option.history.value) return

    // 清除query上history的值
    const resetHistory: any = {}
    Object.keys(option.history.value).forEach(key => {
      resetHistory[key] = undefined
    })
    router.replace({
      query: {
        ...route.query,
        ...resetHistory
      }
    })
  }

  onBeforeMount(() => {
    if (dialogVisible.value) {
      handleOpen()
    } else {
      checkAutoOpen()
    }
  })

  watch(() => route.query, () => {
    if (!option.history.value) return

    const hasHistory = hasHistoryInQuery()
    // 自动关闭弹窗(浏览器后退自动触发关闭)
    if (!hasHistory && dialogVisible.value) {
      dialogVisible.value = false
      autoTriggleClose = true
      option?.onAutoClose?.()
      console.log('自动关闭弹窗')
      return
    }
    // 自动打开弹窗(浏览器前进自动触发打开)
    if (hasHistory && !dialogVisible.value) {
      dialogVisible.value = true
      hasOpenRecord = true
      option?.onAutoOpen?.()
      console.log('自动打开弹窗')
    }
  })
  
  watch(() => dialogVisible.value, (val) => {
    val ? handleOpen() : handleClose()
  })
  
  return {
    firstOpen
  }
}
```

### 调用
``` vue
// HistoryDrawer.vue
<template>
  <!-- firstOpen: 页面渲染时，触发自动打开弹窗，如果线程忙时，弹窗打开动画会卡顿，所以要将动画给去掉 -->
  <el-drawer
    v-model="dialogVisible"
    :size="size"
    :custom-class="`history-dialog ${firstOpen && 'history-dialog_no-anim'}`">
    <slot slot="title" name="title"></slot>
    <slot></slot>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import useHistoryPopup from './useHistoryPopup'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 路由记录
  history: {
    type: Object
  },
  // 配置了history后，初次渲染时，如果有url上有history参数，则自动打开弹窗
  auto: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: '50%'
  }
})
const emit = defineEmits(
  ['update:modelValue', 'autoOpen', 'autoClose']
)

const dialogVisible = computed<boolean>({ // 控制弹窗显示
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})

const { firstOpen } = useHistoryPopup({
  history: computed(() => props.history),
  auto: props.auto,
  dialogVisible: dialogVisible,
  onAutoOpen: emit('autoOpen'),
  onAutoOpen: emit('autoClose')
})
</script>

<style lang='less'>
.history-dialog {
  &.history-dialog_no-anim {
    transition: none !important;
  }
}
</style>
```

## Vue2实现方式（mixin）

``` js
// historyPopup.js
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
        if (this.hasOpenRecord) {
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
```

### 调用

``` vue
<template>
  <!-- firstOpen: 页面渲染时，触发自动打开弹窗，如果线程忙时，弹窗打开动画会卡顿，所以要将动画给去掉 -->
  <el-drawer
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    :visible.sync="dialogVisible"
    :custom-class="`history-dialog ${firstOpen && 'history-dialog_no-anim'}`">
    <slot></slot>
  </el-drawer>
</template>

<script>
import HistoryPopupMixin from '../mixins/historyPopup'

export default {
  name: 'HistoryDrawer',
  mixins: [HistoryPopupMixin],
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang='less'>
.history-dialog {
  &.history-dialog_no-anim {
    animation: none !important;
  }
}
</style>
```

## Vue2实现存在的问题

1、多出一条历史记录

为了方便理解，先拟定两个场景。

> 场景1: 打开弹窗（添加弹窗历史记录），然后刷新页面，弹窗会自动打开，此时url为：`demo/page?dialog=true`。

> 场景2: 在浏览器空白页打开 `demo/page?dialog=true`，页面打开后弹窗会自动打开。

此时，手动关闭弹窗，为了消除弹窗历史记录，如果使用this.$router.back()，场景1没问题，但对于场景2来说，会返回到空白页，而关闭弹窗并返回到空白页明显不合理。因此采用了折中的方案，使用 this.$router.replace 将当前url上的弹窗query重置掉，那么场景2就没问题，但对于场景1来说，弹窗历史记录没有被消除，而只是被更改了，最后会有两条 `demo/page` 的历史记录，需要点两次后退才能返回到上一页，***这个结果是可以接受的***。

2、多层嵌套

多个历史记录弹窗嵌套的话，会有问题。

举个例子：当连续打开三个嵌套的弹窗，此时添加了三个历史记录，刷新页面之后，弹窗自动打开，然后手动关闭全部弹窗，根据问题1可以得出，弹窗全部关闭之后，还会都多出了三个历史记录，如[`/demo/page`, `/demo/page?dailog1=true`, `/demo/page?dailog1=true&dailog2=true`, `/demo/page`]，此时后退会回到第二个弹窗打开的状态，再后退回到第一个弹窗打开的状态，第三次后退才会回到原来页面。

### Vue3的解决方案

Vue3 中使用Vue-Router@4，而Vue-Router@4 会将前一个页面的路由信息存到 `history.state` 中，其中`history.state.back` 记录了前一个页面的路由信息，那么前页面非空白页，则使用 `router.back()` 返回上一页消除历史记录；前页面是空白页，则使用 `router.replace()` 修改历史记录。

github地址：https://github.com/xiaocheng555/history-popup/

查看demo：

vue2: https://xiaocheng555.github.io/history-popup/vue2/

vue3: https://xiaocheng555.github.io/history-popup/
