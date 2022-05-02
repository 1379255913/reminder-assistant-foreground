<template>
<!--  <div class="layout" v-if="localStorage['session']">-->

<!--  </div>-->
  <div class="layout">
    <router-view></router-view>
  </div>

</template>

<script>
import { getCurrentInstance } from 'vue'
import Slide from "./Slide";
import Main from "./Main";
export default {
  components: {
    Slide,
    Main,
  },
  data(){

  },
  setup(){
    const { ctx } = getCurrentInstance()
  }
};
</script>

<style lang='scss' scoped>
    .layout{
        width: 1000px;
        height: 800px;
        border:1px solid #e2e2e3;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border-radius: 8px;
        overflow: hidden;
        margin:0 auto;
        margin-top:100px;
    }
</style>