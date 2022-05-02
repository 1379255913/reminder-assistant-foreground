<template>
  <div class="task-list">
    <text style="font-size: 20px">标签</text>
    <div class="list">
      <ul>
        <li
           @click="taskClick(index)"
           v-for="(item,index) in tagList"
           :class="index===currentIndex?'active':''"
           :key="index"
        >
          <div style="font-size: 20px;">{{item.type}}</div>
          <div class="type">
            <div class="delete" @click.native="open(item.id)"> </div>
            <div class="modify" @click="modify(item.id,item.type)"> </div>
            <div class="count" style="float: right; font-size: 20px;color: #2f7cf6">{{item.count}}</div>
          </div>
        </li>
      </ul>
<!--      <ul>-->
<!--        <li-->
<!--          @click="taskClick(index)"-->
<!--          @dblclick="editeTask(item)"-->
<!--          :class="index===currentIndex?'active':''"-->
<!--          :data-index="index"-->
<!--          v-for="(item,index) in taskList"-->
<!--          :key="index"-->
<!--        >-->
<!--          <div class="name">-->
<!--            <input-->
<!--              v-if="item.isEdite"-->
<!--              type="text"-->
<!--              autofocus-->
<!--              @blur="inputEditeBlur(item)"-->
<!--              v-model="item.title"-->
<!--            />-->
<!--            <span v-else>{{item.title}}</span>-->
<!--          </div>-->
<!--          <div class="count">{{item.child?item.child.length:0}}</div>-->
<!--        </li>-->
<!--        <li class="active" v-if="isCreated">-->
<!--          <div class="name">-->
<!--            <input type="text" autofocus @blur="inputBlur" v-model="createName" />-->
<!--          </div>-->
<!--          <div class="count">0</div>-->
<!--        </li>-->
<!--      </ul>-->
    </div>
    <div class="add-todo" @click="addTask()">添加标签</div>
  </div>
  <create-label></create-label>
  <modify-lable></modify-lable>
</template>

<script>
import CreateLabel from "./CreateLabel";
import ModifyLable from "./ModifyLable";
import {toRefs, reactive, onMounted} from "vue"
import emitter from '../event'
import axios from "axios";
import {ElMessage,ElMessageBox} from "element-plus";
export default {
    components:{
      CreateLabel,
      ModifyLable
    },
    setup(){
      const state = reactive({
        isCreated : false,
        tagList:[

        ],
        currentIndex: -1
      })
      const addTask = () => {
        console.log("点击增加按钮");
        emitter.emit("addlabel","");
      };
      const taskClick = index => {
        state.currentIndex = index;
        emitter.emit("clicklist","");
        var ans = [];
        const t = JSON.parse(sessionStorage.getItem("object"));
        for (var i = 0; i <t.length ; i++){
          if (t[i].type_id===state.tagList[index].id){
            ans.push(t[i]);
          }
        }
        emitter.emit("changetitle",[state.tagList[index].type,state.tagList[index].count,ans])
      };
      const open = index => {
        console.log(index);
        ElMessageBox.confirm(
                '你确定要删除吗？',
                '警告',
                {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning',
                }
        )
                .then(() => {
                  delete1(index)
                })
                .catch(() => {
                  ElMessage({
                    type: 'info',
                    message: '取消删除',
                  })
                })
      }
      const modify = (id,type) =>{
        emitter.emit("modifylabel",[id,type]);
      }
      const delete1 = index =>{
        console.log("删除标签");
        axios.post("/api/deleteobjecttype",{
          'id' : index,
        }).then(res =>{
          if (res.data.code == 200){
            console.log(res.data.data);
            console.log(state.tagList);
            ElMessage({
              message: '删除成功',
              type: 'success',
            })
            state.currentIndex = -1;
            emitter.emit("flashlabel","");
            emitter.emit("flashstate","");
          }else {
            console.log(res.data);
            ElMessage.error("错误"+res.data.message);
          }

        }).catch(function (error) {
          console.log(error.message);
        });
      }
      onMounted(() => {
        emitter.on("flashdata",data=>{
          if (state.currentIndex!==-1){
            taskClick(state.currentIndex);
          }
        })
        emitter.on("clickstate",data=>{
          state.currentIndex=-1;
        })
        emitter.on("flashlabel",data=>{
          axios.post("/api/queryallobjecttype",{
            'username' : sessionStorage.getItem('username'),
          }).then(res =>{
            if (res.data.code == 200){
              console.log(res.data.data);
              if (res.data.data){
                state.tagList=res.data.data;
              }
              sessionStorage.setItem('objecttype', JSON.stringify(state.tagList));
              emitter.emit("flashdata","")
            }else {
              console.log(res.data);
              ElMessage.error("错误"+res.data.message);
            }

          }).catch(function (error) {
            console.log(error.message);
          });
        })

        emitter.emit("flashlabel","");
      });
      return{
        ...toRefs(state),
        addTask,
        taskClick,
        delete1,
        open,
        modify
      };
    }
};
</script>

<style lang="scss" scoped>
.task-list {
  position: relative;
  height: 560px;
  .title {
    font-size: 20px;
    color: #0059ff;
    float: right;
  }
  .list {
    margin-top: 15px;
    max-height: 500px;
    overflow-y: auto;
    li {
      cursor: pointer;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      color: #313031;
      padding: 5px;
      padding-left: 28px;
      input {
        width: 200px;
        border-radius: 3px;
        outline: none;
        font-size: 12px;
        padding-left: 5px;
        box-sizing: border-box;
        color: #606266;
      }
      &.active {
        background-color: #ff8b00;
        color: #fff;
      }
    }
    li:after {
      position: absolute;
      left: 0;
      top: 0px;
      content: "";
      width: 24px;
      height: 24px;
      background: url(../assets/woyaozuode.png) no-repeat;
      background-size: 100% 100%;
      border-radius: 100%;
    }
  }
  .add-todo {
    position: absolute;
    bottom: 0;
    left: 0;
    padding-left: 20px;
    font-size: 14px;
    cursor: pointer;
  }
  .add-todo:after {
    position: absolute;
    left: -4px;
    top: -2px;
    content: "";
    width: 20px;
    height: 20px;
    background: url(../assets/tianjia.png) no-repeat;
    background-size: 100% 100%;
  }
  .modify{
    float:  right;
    left: 0;
    top: 0px;
    content: "";
    width: 24px;
    height: 24px;
    background: url(../assets/modify.png) no-repeat;
    background-size: 100% 100%;
    border-radius: 100%;
  }
  .delete{
    float:  right;
    left: 0;
    top: 0px;
    content: "";
    width: 24px;
    height: 24px;
    background: url(../assets/delete.png) no-repeat;
    background-size: 100% 100%;
    border-radius: 100%;
  }
}
</style>