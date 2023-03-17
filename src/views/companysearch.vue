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
				<el-table-column prop="departmentid" label="departmentid" hidden></el-table-column>
				<el-table-column prop="departmentName" label="公司名"></el-table-column>
                <el-table-column prop="username" label="注册人"></el-table-column>
				<el-table-column prop="rmb" label="注册资本"></el-table-column>
				<el-table-column prop="createTime" label="注册日期"></el-table-column>
                <el-table-column prop="phone" label="公司电话"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
				
				<el-table-column label="操作" width="220" align="left">
					<template #default="scope">
                        <div>
                            <el-button text :icon="CirclePlusFilled" @click="handleJoin(scope.$index, scope.row)" v-permiss="0">
                                申请加入
                            </el-button>
                        </div>
						<div>
                            <el-button text :icon="HelpFilled" @click="handleMore(scope.$index)" v-permiss="1">
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
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, CirclePlusFilled,HelpFilled } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';

interface TableItem {
	departmentid: number;
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
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	fetchData().then(res => {
		tableData.value = res.data.list;
		pageTotal.value = res.data.pageTotal || 50;
	});
};
getData();

// 查询操作
const handleSearch = () => {
    console.log(query)
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

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	address: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.name = row.name;
	form.address = row.address;
	editVisible.value = true;
};
const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].name = form.name;
	tableData.value[idx].address = form.address;
};


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
</style>
