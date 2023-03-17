<template>
<div>
    <template v-if:="items.length === 0">
        <el-empty style="align-self:center" description="还未加入公司呢！" />
      </template>
    <template v-else>
        <div class="container"  v-for="subItem in items">
                <div class="card">
                    <div class="left">
                        <el-avatar class="avatar" :style="`background:${extractColorByName(subItem.departmentName)}`" shape="square" :size="90">
                        {{ subItem.departmentName.substr(0, 4) }}
                        </el-avatar>
                    </div>
                    <div class="right">
                        <div class="card-header"> <span>{{ subItem.departmentName }}</span> </div>
                        <div style="width:auto;height:0px;border-top:1px black dashed;" />
                        <div class="text item"> <span>注册人:</span> {{ subItem.username }}&nbsp;&nbsp;&nbsp;&nbsp;
                            <span >注册资本:</span>{{ subItem.rmb }}&nbsp;&nbsp;&nbsp;&nbsp;
                            <span >注册日期:</span>{{ subItem.createTime.split(" ")[0] }}
                        </div>
                        <div class="text item"><span >公司电话:</span>{{ subItem.phone }} </div>
                        <div class="text item"><span >地址:</span>{{ subItem.address }}</div>
                        <div class="text item"><span>部门简介:</span>{{ subItem.description }}</div>
                    </div>
                </div>
        </div>
        <el-button type="primary" @click="" v-permiss="3">创建公司</el-button>
        <el-button type="primary" @click="" v-permiss="0">申请加入公司</el-button>
    </template>
</div>
  
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GetCompany } from "../api/index";
import { ElMessage } from "element-plus";
import $ from "wangeditor/dist/utils/dom-core";

let u = localStorage.getItem("user");
u = u ? u : '{"i":"1"}';
let user = JSON.parse(u);
user.id = "1";
const items = ref<any[]>([]);

items.value = [
        {address:"江苏省苏州市 工业园区文意人才公寓",
            createTime : "2023-03-15 11:25:30",
            departmentName : "白雪公组",
            departmentid: 191406,
            description: "该部门成立于315，是一所基于ai驱动的A轮融资大公司",
            phone : "025-730594",
            rmb: 15005,
            username: "李夏天"
        },
        {address:"江苏省苏州市 工业园区文意人才公寓",
            createTime : "2023-03-15 11:25:30",
            departmentName : "白雪公组",
            departmentid: 191406,
            description: "该部门成立于315，是一所基于ai驱动的A轮融资大公司",
            phone : "025-730594",
            rmb: 15005,
            username: "李夏天"
        },
        {address:"江苏省苏州市 工业园区文意人才公寓",
            createTime : "2023-03-15 11:25:30",
            departmentName : "白雪公组",
            departmentid: 191406,
            description: "该部门成立于315，是一所基于ai驱动的A轮融资大公司",
            phone : "025-730594",
            rmb: 15005,
            username: "李夏天"
        }]
// GetCompany({ uid: user.id }).then((res) => {
//     console.log(res)
//   if (res.status != 200) {
//     ElMessage.error("出错了");
//     return;
//   }
//   let data = res.data;
//   console.log(data);
//   if (data.code == 1) {
//     items.value = data.data;
//     console.log(items.value);
//   } else {
//     ElMessage.error(data.msg);
//   }
// }).catch(e => {ElMessage.error('网络超时了');});

const extractColorByName = (name: String) => {
  var temp = [];
  temp.push("#");
  for (let cha of name) {
    let unicode = cha.charCodeAt(0).toString();
    temp.push(parseInt(unicode, 10).toString(16));
  }
  return temp.slice(0, 5).join("").slice(0, 4);
};

document.getElementsByClassName;
</script>

<style scoped>
.card-header {
  font-size: x-large;
  font-weight: 600;
}
.text {
    font-weight: lighter;
    margin-top: 0.35rem;
}
.avatar {
  font-size: xx-large;
}
.left {
  width: 6.5rem;
}


.card {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-self: center;
}
.container{
    margin-bottom: 1rem;
}

</style>
