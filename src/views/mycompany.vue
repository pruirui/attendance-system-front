<template>
<div>
  
    <template v-if:="items.length === 0">
      <el-button type="primary" @click="router.push('/createcompany')" v-permiss="0">创建公司</el-button>
      <el-button type="primary" @click="router.push('/companysearch')" v-permiss="1">搜索公司</el-button>
        <el-empty style="align-self:center" description="还未加入公司呢！" />
      </template>
    <template v-else>
        <div class="container"  v-for="subItem in items" @click="showCompany(subItem.departmentid)">
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
		<div class="pagination">
		    <el-pagination
		        background
		        layout="total, prev, pager, next"
		        :current-page="query.pageIndex"
		        :page-size="query.pageSize"
		        :total="totals"
		        :pager-count="6"
		        @current-change="handlePageChange"></el-pagination>
		</div>
        <el-button type="primary" @click="router.push('/createcompany')" v-permiss="0">创建公司</el-button>
        <el-button type="primary" @click="router.push('/companysearch')" v-permiss="1">搜索公司</el-button>
    </template>
   
</div>
  
</template>

<script setup lang="ts">
import { ref , reactive} from "vue";
import { getDepartmentByUid,getAllDepartmentData } from "../api/index";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
import { extractColorByName } from "../utils/util";


let uId = localStorage.getItem("ms_userId");

const items = ref<any[]>([]);

const router = useRouter()

const query = reactive({
	querystring: '',
	pageIndex: 1,
	pageSize: 5
});
const totals = ref(0);


const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

const getData = ()=>{
	if(uId === null){
	  ElMessage.error('未检测到用户登入，请登入！')
	  localStorage.clear();
	  router.push('/login');
	}else{
	  getAllDepartmentData('', '',query.pageIndex,query.pageSize).then((res) => {
	    console.log(res)
	    if (res.status != 200) {
	      ElMessage.error("出错了");
	      return;
	    }
	    let data = res.data;
	    console.log(data);
	    if (data.code == 1) {
	      items.value = data.data;
		  totals.value = data.totals
	    } else {
	      ElMessage.error(data.msg);
	    }
	  }).catch(e => {ElMessage.error('网络超时了');});
	}
}
getData()
// if(uId === null){
//   ElMessage.error('未检测到用户登入，请登入！')
//   localStorage.clear();
//   router.push('/login');
// }else{
//   getDepartmentByUid(uId).then((res) => {
//     console.log(res)
//     if (res.status != 200) {
//       ElMessage.error("出错了");
//       return;
//     }
//     let data = res.data;
//     console.log(data);
//     if (data.code == 1) {
//       items.value = data.data;
//     } else {
//       ElMessage.error(data.msg);
//     }
//   }).catch(e => {ElMessage.error('网络超时了');});
// }


const showCompany = (companyId:string)=>{
  localStorage.setItem("departmentId", companyId);
	router.push('/companyinformation')
}

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
    transform: scale(1);
}
.container:active{
    transform: scale(0.99);
}
.container:hover{
    background: #f0f0f0;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.2);
    color: #262323;
    text-decoration: none;
    text-shadow: -0.5px -0.5px 0 #353434;
    -webkit-transition: all 250ms linear;
    transition: all 250ms linear;
}

</style>
