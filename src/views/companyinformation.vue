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
                <div class="text item"><span >公司电话:</span>{{ singleDepartment.phone }} </div>
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
                <el-table-column prop="gender" label="性别"></el-table-column>
                <el-table-column prop="email" label="邮箱">
                    <template #default="scope">{{ scope.row.email?scope.row.email:'无' }}</template>
                </el-table-column>
                <el-table-column prop="birthday" label="生日">
                    <template #default="scope">{{ scope.row.birthday?scope.row.birthday:'无' }}</template>
                </el-table-column>
                <el-table-column prop="address" label="地址">
                    <template #default="scope">{{ scope.row.address?scope.row.address:'无' }}</template>
                </el-table-column>
                <el-table-column prop="role" label="角色" width="50">
                    <template #default="scope">{{ scope.row.role === 'user'?'员工':scope.row.role }}</template>
                </el-table-column>
                
                <el-table-column label="操作" width="220" align="left">
                    <template #default="scope">
                        <div>
                            <el-button text :icon="CirclePlusFilled" @click="handle(scope.$index, scope.row, 1)" v-permiss="4">
                                授予HR权限
                            </el-button>
                        </div>
                        <div>
                            <el-button text :icon="HelpFilled" @click="handle(scope.$index, scope.row, 2)" v-permiss="4">
                                删除员工
                            </el-button>
                        </div>
                        <div>
                            <el-button text :icon="HelpFilled" @click="importface(scope.row)" v-permiss="4">
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

        <el-button type="primary" @click="deleteCompany()" v-permiss="4">删除公司</el-button>
        <el-button type="primary" @click="router.push('/modifycompany')" v-permiss="4">修改公司信息</el-button>

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
    </div>
</template>

<script setup lang="ts" name="baseform">
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import {extractColorByName} from '../utils/util'
import { Search, CirclePlusFilled,HelpFilled } from '@element-plus/icons-vue';
import { useTagsStore } from '../store/tags';
import {getDepartmentByDepartmentId, getAllUserByDepartmentId, deleteDepartmentById, grantUserHR} from '../api/index'
import faceimport from './faceimport.vue'


interface TableItem {
	id: string;
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

const tableData = ref<TableItem[]>([]);
const totals = ref(1);
const uId = localStorage.getItem("ms_userId");
const departmentId = localStorage.getItem("departmentId");
const router = useRouter()
const route = useRoute();
const tags = useTagsStore();
const visible = ref(false);
const user_current = ref<TableItem>()

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
            console.log(singleDepartment);
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
                ElMessage.info(data.msg);
                tableData.value[idx].role = 'HR';
            });
			
		})
		.catch(() => {});
    }
    if(operation == 2){
        ElMessageBox.confirm('确定要删除用户 '+user.username+' 吗？', '提示', {
		    type: 'warning'
	    })
		.then(() => {

			ElMessage.success('已将删除信息发送给员工'+user.username+'，待其通过即可删除！');
            tableData.value[idx].role = '正在离职';
		})
		.catch(() => {});
    }
}

// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
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

const importface = (user: any)=>{
    user_current.value = user;
	visible.value = true;
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
 


</style>