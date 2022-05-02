<template>
  <router-view></router-view>
<!--  <button @click="$router.push('Register')">a</button>-->
<!--  <button @click="$router.push('Login')">b</button>-->
</template>

<script>
  import index from "./Layout/index"
  export default {
    components: {
      index
    },
  };
</script>
<style lang="scss">
  ul,
  li,p {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  @import "~normalize.css/normalize.css"; // normalize.css 样式格式化
</style>
