// 扩展路由历史记录的状态信息
export function extendRouterHistoryState (router) {
  // 设置history.state的值
  function setHistoryState (state) {
    history.replaceState({
      ...history.state,
      ...state
    }, '')
  }
  
  // 首次进入页面记录当前路由信息
  let once = true
  function setRouteStateAtFirst () {
    // 此处不能销毁afterEach，如果销毁了，在其他地方使用afterEach勾子，首次不会触发改勾子回调
    router.afterEach((route) => {
      if (!once) return
      once = false
      setHistoryState({
        back: history.state?.back || null,
        current: route.fullPath,
        forward: history.state?.forward || null
      })
    })
  }
  
  // 监听popstate，当手动输入地址跳转其他页面时，记录路由信息
  function handlePopstate () {
    if (history.state?.current) return
    
    const from = router.currentRoute
    // 记录跳转后的路由信息
    const destroy = router.afterEach((to) => {
      setHistoryState({
        back: from.fullPath,
        current: to.fullPath,
        forward: null
      })
      destroy()
    })
  }
    
  const { push, replace  } = router
  
  // 重写router.push
  function routerPush (location, onComplete, ...rest) {
    const to = router.resolve(location)
    const fromPath = router.currentRoute.fullPath
    // 记录跳转前的路由信息
    if (to) {
      setHistoryState({
        back: history.state?.back || null,
        current: fromPath,
        forward: to.route.fullPath
      })
    }
    // 记录跳转后的路由信息
    const complete = (...args) => {
      const curPath = router.currentRoute.fullPath
      setHistoryState({
        back: fromPath,
        current: curPath,
        forward: null
      })
      onComplete && onComplete.apply(router, args)
    }
    return push.apply(router, [location, complete, ...rest])
  }
  
  // 重写router.replace
  function routerReplace (location, onComplete, ...rest) {
    // 记录跳转后的路由信息
    const complete = (...args) => {
      const curPath = router.currentRoute.fullPath
      setHistoryState({
        back: history.state?.back || null,
        current: curPath,
        forward: history.state?.forward || null
      })
      onComplete && onComplete.apply(router, args)
    }
    return replace.apply(router, [location, complete, ...rest])
  }
  
  setRouteStateAtFirst()
  window.addEventListener('popstate', handlePopstate)
  router.push = routerPush
  router.replace = routerReplace
}