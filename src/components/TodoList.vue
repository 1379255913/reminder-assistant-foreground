<template>
  <div class="todo-list">
    <div class="add-todo" @click="addobject()">
      <img src="../assets/jia.png" alt />
    </div>
    <div class="title">
      <p>{{ title }}</p>
      <p>{{ number }}</p>
    </div>
    <div class="list-item" v-if="title">
      <el-table  :data="dataList" style="width: 100%;" :row-class-name="tableRowClassName" height="700">
        <el-table-column prop="information" label="物品名称" width="150"></el-table-column>
        <el-table-column prop="type" label="标签" width="120"></el-table-column>
        <el-table-column prop="expiration_time" label="过期时间" width="150"></el-table-column>
        <el-table-column prop="reminder_time" label="提醒时间" width="150"></el-table-column>
        <el-table-column prop="action" label="操作" width="80">
          <template v-slot="scope">
            <div class="delete" @click="open(scope.$index)"> </div>
            <div class="modify" @click="modify(scope.$index)"> </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    <div class="empty-tip" v-if="!dataList">暂时没有物品记录</div>-->
  </div>
  <create-object></create-object>
  <modify-object></modify-object>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import axios from 'axios'
import CreateObject from "./CreateObject";
import ModifyObject from "./ModifyObject";
import emitter from "../event";
import {ElMessage, ElMessageBox} from "element-plus";
export default {
  components:{
    CreateObject,
    ModifyObject
  },
  setup(){
    const state = reactive({
      title : "",
      number : "",
      dataList : [],
      dataListStore : []
    })
    const tableRowClassName = (row) => {
      if (row.row.state==="快过期") {
        return 'warning-row'
      } else if (row.row.state==="已过期") {
        return 'danger-row'
      }else if (row.row.state==="未过期") {
        return 'success-row'
      }
      return ''
    }
    const modify = obj =>{
      console.log(state.dataList[obj]);
      emitter.emit("modifyobject",state.dataList[obj]);
    }
    const open = index => {
      console.log(index);
      console.log(state.dataList[index].id);
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
                delete1(state.dataList[index].id)
              })
              .catch(() => {
                ElMessage({
                  type: 'info',
                  message: '取消删除',
                })
              })
    }
    const delete1 = index =>{
      axios.post("/api/deleteobject",{
        'id' : index,
      }).then(res =>{
        if (res.data.code == 200){
          console.log(res.data.data);
          ElMessage({
            message: '删除成功',
            type: 'success',
          })
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
    const addobject = () =>{
        emitter.emit("createobject","");
    }
    onMounted(()=>{
      emitter.on("changetitle",data=>{
        state.title = data[0];
        state.number = data[1];
        state.dataList = data[2];
        state.dataListStore = data[2];
      })
      emitter.on("search1",data=>{
        state.dataList = [];
        for (let i =0; i <state.dataListStore.length ; i++){
          if (state.dataListStore[i].information.includes(data)||state.dataListStore[i].type.includes(data)){
            state.dataList.push(state.dataListStore[i]);
          }
        }
      })
    })
    return{
      ...toRefs(state),
      addobject,
      tableRowClassName,
      open,
      modify
    }
  }
};
</script>

<style lang='scss'>
.todo-list {
  position: relative;
  .keywords {
    width: 100%;
    word-wrap: break-word;
    font-size: 24px;
    color: #5c6269;
    margin-bottom: 15px;
  }
  .add-todo {
    position: absolute;
    right: 0px;
    top: -20px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    font-size: 24px;
    color: #2f7cf6;
    display: flex;
    font-weight: bold;
    margin-bottom: 15px;
    justify-content: space-between;
  }
  .task-finish {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
    p {
      font-size: 14px;
    }
    .toggle-btn {
      cursor: pointer;
      font-size: 14px;
      color: #2f7cf6;
    }
  }
  .list-item {
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    font-size: 14px;
    input[type="checkbox"] {
      margin-right: 15px;
      width: 16px;
      height: 16px;
    }
    p {
      position: relative;
      width: 100%;
    }
    p:after {
      position: absolute;
      bottom: -10px;
      left: 0;
      content: "";
      height: 1px;
      width: 100%;
      background: #e6e6e6;
    }
    .todo-input {
      width: 100%;
      border: none;
      outline: none;
      border-bottom: 1px solid #409eff;
      outline: none;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      padding: 5px;
    }
    .todo-input:focus {
      border: none;
      border-color: transparent;
    }
  }
  .empty-tip {
    position: absolute;
    top: 200px;
    left: 25%;
    font-size: 32px;
    color: #c0c0c0;
  }
  .done-list {
    margin-bottom: 24px;
    .disabled-box {
      position: relative;
      width: 14px;
      height: 14px;
      appearance: none;
      -webkit-appearance: none;
      border: 1px solid #e97531;
      border-radius: 100%;
    }
    .disabled-box:after {
      content: "";
      position: absolute;
      width: 8px;
      height: 8px;
      background: #e97531;
      border-radius: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .el-table .warning-row {
    background: #fdf5e6;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-table .danger-row {
    background: #f9ebeb;
  }
  .modify{
    float:  left;
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