<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
}
html, body {
  overflow-y: hidden;
}
@media (max-width: 768px) {
  #app {
    width: 300%;
  }
}
</style>