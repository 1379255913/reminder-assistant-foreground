<template>
  <div class="tag-list">
    <ul>
      <li
        v-for="(item,index) in tagList"
        :key="item.id"
        :class="currentIndex===index?`active${index}`:''"
        @click="tagClick(index)"
      >
        <div class="type">
          <img :src="currentIndex===index?item.icon_active:item.icon" alt />
          <p class="title">{{item.title}}</p>
        </div>
        <div class="count">{{item.child.length}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import {reactive, toRefs , onMounted} from "vue";
import emitter from "../event";
import axios from "axios";
import {ElMessage} from "element-plus";
export default {
  setup() {
    const state = reactive({
      tagList: [
        {
          id: "quanbu",
          title: "全部",
          icon: require("../assets/jihuajindu.png"),
          icon_active: require("../assets/jihuajindu_active.png"),
          child: [],
          done:[]
        },
        {
          id: "zuijia",
          title: "最佳",
          icon: require("../assets/quanbufenlei.png"),
          icon_active: require("../assets/quanbufenlei_active.png"),
          child: [],
          done:[]
        },

        {
          id: "lingjinguoqi",
          title: "临近过期",
          icon: require("../assets/tixing.png"),
          icon_active: require("../assets/tixing_active.png"),
          child: [],
          done:[]
        },
        {
          id: "yiguoqi",
          title: "已过期",
          icon: require("../assets/yiguoqi.png"),
          icon_active: require("../assets/yiguoqi_active.png"),
          child: [],
          done:[]
        }
      ],
      currentIndex: 0
    });
    const tagClick = index => {
      state.currentIndex = index;
      emitter.emit("clickstate","")
      emitter.emit("changetitle",[state.tagList[index].title,state.tagList[index].child.length,state.tagList[index].child])
    };
    onMounted(()=>{
      emitter.on("flashdata",data=>{

        if (state.currentIndex!==-1){
          tagClick(state.currentIndex);
        }
      })
      emitter.on("clicklist",data=>{
        state.currentIndex=-1;
      })
      emitter.on("flashstate",data=>{
        axios.post("/api/queryuserobject",{
          'username' : sessionStorage.getItem('username'),
        }).then(res =>{
          if (res.data.code == 200){
            const t = res.data.data.posts;
            console.log(t);
            sessionStorage.setItem('object', JSON.stringify(t));
            for (var i =0 ; i<4 ; i++) {
              state.tagList[i].child=[];
            }
            for (i =0 ; i<t.length ; i++) {
              state.tagList[0].child.push(t[i]);
              if (t[i].state === "未过期") state.tagList[1].child.push(t[i]);
              else if (t[i].state === "快过期") state.tagList[2].child.push(t[i]);
              else if (t[i].state === "已过期") state.tagList[3].child.push(t[i]);
            }
            emitter.emit("flashdata","");
          }else {
            console.log(res.data);
            ElMessage.error("错误"+res.data.message);
          }

        }).catch(function (error) {
          console.log(error.message);
        });
      })
      emitter.emit("flashstate","");
    })
    return {
      ...toRefs(state),
      tagClick
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-list {
  margin-top: 15px;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: 115px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      margin-bottom: 15px;
      border-radius: 8px;
      padding: 10px;
      box-sizing: border-box;
      .type {
        display: flex;
        flex-direction: column;
        img {
          width: 24px;
          height: 24px;
        }
        p {
          font-size: 12px;
          margin-top: 8px;
          color: #6f6f6f;
        }
      }
      .count {
        color: #c0c0c0;
        font-weight: bold;
      }
      &.active0 {
        background: #4395d6;
        p {
          color: #fff;
        }
        .count {
          color: #fff;
        }
      }
      &.active1 {
        background: #137600;
        p {
          color: #fff;
        }
        .count {
          color: #fff;
        }
      }
      &.active2 {
        background: #f19951;
        p {
          color: #fff;
        }
        .count {
          color: #fff;
        }
      }
      &.active3 {
        background: #ff5f5f;
        p {
          color: #fff;
        }
        .count {
          color: #fff;
        }
      }
    }
  }
}
</style>