<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
					<el-option v-for="p in provinces" :label="p" :value="p" ></el-option>
				</el-select>
				<el-input v-model="query.departmentName" placeholder="公司名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<!-- <el-button type="primary" :icon="Plus">新增</el-button> -->
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<!-- <el-table-column prop="departmentid" label="公司编号" ></el-table-column> -->
				<el-table-column prop="departmentName" label="公司名"></el-table-column>
                <el-table-column prop="username" label="注册人"></el-table-column>
				<el-table-column prop="rmb" label="注册资本"></el-table-column>
				<el-table-column prop="createTime" label="注册日期"></el-table-column>
                <el-table-column prop="phone" label="公司电话"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
				
				<el-table-column label="操作" width="220" align="left">
					<template #default="scope">
                        <div>
                            <el-button text :icon="CirclePlusFilled" @click="handleJoin(scope.row)" v-permiss="0">
                                申请加入
                            </el-button>
                        </div>
						<div>
                            <el-button text :icon="HelpFilled" @click="handleMore(scope.row.departmentid)" v-permiss="1">
                                查看详细信息
                            </el-button>
                        </div>
						
					</template>
				</el-table-column>
			</el-table>
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
		</div>

		<!-- 弹出框 -->
		<el-dialog title="申请加入公司" v-model="visible" width="60%">
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

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="visible = false">取 消</el-button>
					<el-button type="primary" @click="join">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, CirclePlusFilled,HelpFilled } from '@element-plus/icons-vue';
import { getAllDepartmentData } from '../api/index';
import { useRouter } from 'vue-router';
import { extractColorByName } from '../utils/util';
import {NewerApplyDepartment} from '../api/index'

interface TableItem {
	departmentid: string;
	departmentName: string;
	username: string;
	rmb: string;
	createTime: string;
	phone: string;
	address: string;
	description: string;
}

const query = reactive({
	address: '',
	departmentName: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const totals = ref(1);
const uId = localStorage.getItem("ms_userId");
if(uId === null){
	ElMessage.error('未检测到用户登入，请登入！')
	localStorage.clear();
	let router = useRouter()
	router.push('/login');
}

// 获取表格数据
const getData = () => {
    console.log(query)
	getAllDepartmentData(query.address, query.departmentName,query.pageIndex, query.pageSize).then(res => {
        console.log(res)
		tableData.value = res.data.data;
		totals.value = res.data.totals;
	});
};
getData();

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

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			ElMessage.success('删除成功');
			tableData.value.splice(index, 1);
		})
		.catch(() => {});
};

// 申请加入公司时弹窗和保存
const visible = ref(false);
let singleDepartment = reactive({
	departmentid: '',
	departmentName: '',
	username: '',
	rmb: '',
	createTime: '',
	phone: '',
	address: '',
	description: ''
});


const handleMore = (departmentId: String)=>{

}

const handleJoin = (row: any) =>{
	singleDepartment.departmentid = row.departmentid;
	singleDepartment.departmentName = row.departmentName;
	singleDepartment.username = row.username;
	singleDepartment.rmb = row.rmb;
	singleDepartment.createTime = row.createTime;
	singleDepartment.phone = row.phone;
	singleDepartment.address = row.address;
	singleDepartment.description = row.description;
	visible.value = true;

}

const join = ()=>{
	if(uId == null){
		return;
	}
	console.log(singleDepartment);
	NewerApplyDepartment(singleDepartment.departmentid, uId).then((res) => {
		console.log(res);
		ElMessage.info(res.data.msg);
	})
	visible.value = false;
}



const provinces =  ['河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', ' 福建', ' 江西', '山东', '河南', '湖北', '湖南', '广东', '    海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '北京', '天津', '上海', '重庆', '香港特别行政区', '澳门特别行政区']

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
  
  
  .card {
	display: flex;
	width: 100%;
	gap: 1rem;
	align-self: center;
  }
 


</style>
