<template>
    <div id="home">
        <Slide/>
        <Main/>
    </div>
</template>

<script>
import Main from "../Layout/Main"
import Slide from "../Layout/Slide";
import axios from 'axios'
import { toRefs,reactive,onMounted } from 'vue'
import {ElMessage} from "element-plus";
import emitter from "../event";
export default {
    components: {
        Main,
        Slide
    },
    name: "Home",
    setup(){
        onMounted(()=>{

        })
    }
}
</script>

<style scoped>

</style>