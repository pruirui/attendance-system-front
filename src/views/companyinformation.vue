<template>
    <div class="container">
        <div class="card">
            <div class="left">
                <el-avatar class="avatar" :style="`background:${extractColorByName(singleDepartment.departmentName)}`" shape="square" :size="90">
                {{ singleDepartment.departmentName.substr(0, 4) }}
                </el-avatar>
            </div>
            <div class="right">
                <div class="card-header"> <span>{{ singleDepartment.departmentName }}</span> </div>
                <div style="width:auto;height:0px;border-top:1px black dashed;" />
                <div class="text item"> <span>注册人:</span> {{ singleDepartment.username }}&nbsp;&nbsp;&nbsp;&nbsp;
                    <span >注册资本:</span>{{ singleDepartment.rmb }}&nbsp;&nbsp;&nbsp;&nbsp;
                    <span >注册日期:</span>{{ singleDepartment.createTime}}
                </div>
                <div class="text item"><span >团队电话:</span>{{ singleDepartment.phone }} </div>
                <div class="text item"><span >地址:</span>{{ singleDepartment.address }}</div>
                <div class="text item"><span>部门简介:</span>{{ singleDepartment.description }}</div>
            </div>
        </div>
        <el-divider />

        <el-scrollbar height="400px">
            <div class="handle-box">
				
				<el-input v-model="query.querystring" placeholder="员工名或者员工手机号" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<!-- <el-button type="primary" :icon="Plus">新增</el-button> -->
			</div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="username" label="用户名" ></el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="gender" label="性别"  width="80px"></el-table-column>
                <el-table-column prop="email" label="邮箱">
                    <template #default="scope">{{ scope.row.email?scope.row.email:'无' }}</template>
                </el-table-column>
                <el-table-column prop="birthday" label="生日">
                    <template #default="scope">{{ scope.row.birthday?scope.row.birthday:'无' }}</template>
                </el-table-column>
                <el-table-column prop="address" label="地址">
                    <template #default="scope">{{ scope.row.address?scope.row.address:'无' }}</template>
                </el-table-column>
                <el-table-column prop="role" label="角色" width="100px">
                    <template #default="scope">{{ scope.row.role === 'user'?'员工':scope.row.role === 'hr'?'HR': scope.row.role}}</template>
                </el-table-column>
                
                <el-table-column label="操作" width="220" align="left">
                    <template #default="scope">
                        <div>
                            <el-button text :icon="CirclePlusFilled"  v-if="showButton" @click="handle(scope.$index, scope.row, 1)" v-permiss="5">
                                授予HR权限
                            </el-button>
                        </div>
                        <div>
                            <el-button text :icon="DeleteFilled"  v-if="showButton" @click="handle(scope.$index, scope.row, 2)" v-permiss="6">
                                删除员工
                            </el-button>
                        </div>
                        <div>
                            <el-button text :icon="HelpFilled"  v-if="showButton" @click="importface(scope.row)" v-permiss="6">
                                人脸导入
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>

        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="query.pageIndex"
                :page-size="query.pageSize"
                :total="totals"
                :pager-count="6"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <el-button type="primary" @click="deleteCompany()" v-if="showButton" v-permiss="5">删除团队</el-button>
        <el-button type="primary" @click="modifyCompany()"  v-if="showButton" v-permiss="6">修改团队信息</el-button>
        <el-button type="primary" @click="invite()" v-if="showButton"  v-permiss="6">邀请员工加入团队</el-button>

        <el-dialog :title="'为员工 '+user_current?.username+' 录入人脸'" v-model="visible" width="1000px" destroy-on-close>
			<div class="faceimp">
				<faceimport :uid="user_current?.id"></faceimport>
        	</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="visible = false">取 消</el-button>
					<el-button type="primary" @click="visible = false">确 定</el-button>
				</span>
			</template>
		</el-dialog>


        <el-dialog title="邀请用户加入团队" v-model="visible2" destroy-on-close>
            
            <div class="handle-box">
				
				<el-input v-model="query2.querystring" placeholder="员工名或者员工手机号" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch2">搜索</el-button>
				<!-- <el-button type="primary" :icon="Plus">新增</el-button> -->
			</div>
            <el-scrollbar height="400px">
                <el-card shadow="hover" class="usercard" v-for="item in inviteTable" @click="inviteUser(item)">
                    <div class="info">
                        <div class="info-image">
                            <el-avatar :size="70" :src="path.baseUrl + item.headshot" />
                        </div>
                        <div class="userright">
                            <div class="username"> <span style="font-size: large;">{{ item.username}}</span> </div>
                            <div class="text2"> <span>手机号:</span> {{item.phone}}&nbsp;&nbsp;&nbsp;&nbsp;
                                <template v-if="item.email">
                                    <span >邮箱:</span>{{ item.email }}&nbsp;&nbsp;&nbsp;&nbsp;
                                </template>
                                <template v-if="item.address">
                                    <span >地址:</span>{{ item.address}}&nbsp;&nbsp;&nbsp;&nbsp;
                                </template>
                            </div>
                           
                        </div>
                    </div>
                </el-card>
            </el-scrollbar>
			<div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query2.pageIndex"
                    :page-size="query2.pageSize"
                    :total="totals2"
                    :pager-count="4"
                    @current-change="handlePageChange2"
                ></el-pagination>
            </div>
		</el-dialog>
    </div>
</template>

<script setup lang="ts" name="baseform">
import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import {extractColorByName} from '../utils/util'
import { Search, CirclePlusFilled,HelpFilled, DeleteFilled} from '@element-plus/icons-vue';
import { useTagsStore } from '../store/tags';
import {getDepartmentByDepartmentId, getAllUserByDepartmentId, deleteDepartmentById, grantUserHR, queryAllUsers, inviteUserJoinDepart, dismissUserInDepart, isUidInDepartment} from '../api/index'
import faceimport from './faceimport.vue'
import Modifycompany from './modifycompany.vue';
import path from '../api/path'


interface TableItem {
	id: string;
    headshot:string;
	username: string;
	phone: string;
    gender:string;
	email:string;
	birthday: string;
	address: string;
	role: string;
}

const singleDepartment = reactive({
	departmentid: '',
	departmentName: '',
	username: '',
	rmb: '',
	createTime: '',
	phone: '',
	address: '',
	description: ''
});

const query = reactive({
	querystring: '',
	pageIndex: 1,
	pageSize: 10
});
const query2 = reactive({
	querystring: '',
	pageIndex: 1,
	pageSize: 5
});
const tableData = ref<TableItem[]>([]);
const inviteTable = ref<TableItem[]>([]);
const totals = ref(0);
const totals2 = ref(0);
const uId = localStorage.getItem("ms_userId");
const departmentId = localStorage.getItem("departmentId");
const router = useRouter()
const route = useRoute();
const tags = useTagsStore();
const visible = ref(false);
const visible2 = ref(false)
const user_current = ref<TableItem>()
const showButton = ref(true)
// 关闭单个标签
const closeThisTag = () => {
    let index = tags.list.length - 1;
    const delItem = tags.list[index];
    tags.delTagsItem(index);
    const item = tags.list[index] ? tags.list[index] : tags.list[index - 1];
    if (item) {
        delItem.path === route.fullPath && router.push(item.path);
    } else {
        router.push('/');
    }
};

if(uId === null){
	ElMessage.error('未检测到用户登入，请登入！')
	localStorage.clear();
	router.push('/login');
}
if(departmentId === null){
    ElMessage.error('未检测到部门！');
    closeThisTag();
}

const getDepartment = ()=>{
    if(departmentId === null){
        ElMessage.error('未检测到部门！');
        closeThisTag();
        return;
    }
    getDepartmentByDepartmentId(departmentId).then((res) =>{
        if (res.status != 200) {
            ElMessage.error("出错了");
            return;
        }
        let data = res.data;
        if (data.code == 1) {
            console.log(data)
            singleDepartment.departmentid = data.data.departmentid;
            singleDepartment.departmentName = data.data.departmentName;
            singleDepartment.username = data.data.username;
            singleDepartment.rmb = data.data.rmb;
            singleDepartment.createTime = data.data.createTime;
            singleDepartment.phone = data.data.phone;
            singleDepartment.address = data.data.address;
            singleDepartment.description = data.data.description;
            if(uId == null){return;}
            isUidInDepartment(singleDepartment.departmentid, uId).then(res =>{
                if(res.data.data.flag){
                    showButton.value = true;;
                }else{
                    showButton.value = false;
                }
            })

        } else {
            ElMessage.error(data.msg);
        }

    }).catch((e)=>{ElMessage.error("网路超时！");})
}

getDepartment();

// 获取表格数据
const getData = () => {
    if(departmentId === null){
        ElMessage.error('未检测到部门！');
        closeThisTag();
        return;
    }
    console.log(query)
	getAllUserByDepartmentId(departmentId, query.querystring, query.pageIndex, query.pageSize).then(res => {
        console.log(res)
		tableData.value = res.data.data;
		totals.value = res.data.totals;
	});
};
// 获取表格数据
const getData2 = () => {

    console.log(query2)
	queryAllUsers(query2.querystring, query2.pageIndex, query2.pageSize).then(res => {
        console.log(res)
		inviteTable.value = res.data.data;
		totals2.value = res.data.totals;
	});
};
getData();

const handle= (idx:number, user: any, operation: number)=>{
    if(operation == 1){
        ElMessageBox.confirm('确定要授予用户 '+user.username+' HR权限吗？', '提示', {
		    type: 'warning'
	    })
		.then(() => {
            if(departmentId === null || uId === null){
                ElMessage.error('未检测到部门或者无用户！');
                closeThisTag();
                return;
            }
            grantUserHR(uId, user.id, departmentId).then((res)=>{
                if (res.status != 200) {
                    ElMessage.error("出错了");
                    return;
                }
                let data = res.data;
                ElMessage.success(data.msg);
                getData();
            });
			
		})
		.catch(() => {});
    }
    if(operation == 2){
        ElMessageBox.confirm('确定要删除用户 '+user.username+' 吗？', '提示', {
		    type: 'warning'
	    })
		.then(() => {
            if(uId === null || departmentId === null){
                return false;
            }
            dismissUserInDepart(uId, user.id, departmentId).then(res =>{
                console.log(res);
                ElMessage.success(res.data.msg);
            })
			
		})
		.catch(() => {});
    }
}

// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};

// 查询操作
const handleSearch2 = () => {
	query.pageIndex = 1;
	getData2();
};

// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};
// 分页导航
const handlePageChange2 = (val: number) => {
	query2.pageIndex = val;
	getData2();
};

const deleteCompany = ()=>{
    ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
		    type: 'warning'
	    })
		.then(() => {
            if(departmentId === null || uId === null){
                ElMessage.error('未检测到部门或者无用户！');
                closeThisTag();
                return;
            }
            deleteDepartmentById(departmentId,uId).then((res) => {
                if (res.status != 200) {
                    ElMessage.error("出错了");
                    return;
                }
                let data = res.data;
                ElMessage.info(data.msg);
            });
		})
		.catch(() => {});
}
const modifyCompany  = () => {
    if(departmentId === null){
        return;
    }
    localStorage.setItem('departmentId',departmentId);
    router.push('/modifycompany');
}
const importface = (user: any)=>{
    user_current.value = user;
	visible.value = true;
}


const inviteUser = (user:any)=>{
    if(departmentId === null){
        return;
    }
    ElMessageBox.confirm('确定邀请用户 '+user.username+' 到 '+singleDepartment.departmentName+' 吗？', '提示', {
		    type: 'warning'
	    })
		.then(() => {
            if(departmentId === null || uId === null){
                ElMessage.error('未检测到部门或者无用户！');
                closeThisTag();
                return;
            }
            inviteUserJoinDepart(uId, user.id, departmentId).then((res)=>{
                if (res.status != 200) {
                    ElMessage.error("出错了");
                    return;
                }
                ElMessage.success(res.data.msg);
                getData2();
            });
			
		})
		.catch(() => {});
}
const invite = () =>{
    visible2.value = true
    getData2()
}

const changevisible = () => {
	visible.value=false;
}





</script>


<style scoped>

.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}

.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}

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
  .faceimp{
  	height: 340px;
  	width: 1000px;
  }
  
  .card {
	display: flex;
	width: 100%;
	gap: 1rem;
	align-self: center;
  }
 

.info {
    display: flex;
	width: 100%;
	gap: 1.3rem;
	align-self: center;
}

.info-image {
	position: relative;
	width: 70px;
	height: 70px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}
.usercard{
    text-align: left;
    margin-bottom: 0.2rem;
}
.username{
    margin-top: 5px;
}
.text2 {
    font-weight: lighter;
    margin-top: 0.45rem;
}
</style>