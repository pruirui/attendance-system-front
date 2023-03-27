<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20" style="height: 252px">
					<div class="user-info">
						<el-avatar :size="120" :src="path.baseUrl + user.user.headshot" />
						<div class="user-info-cont">
							<div class="user-info-name">{{ user.user.username }}</div>
							<div>{{ role }}</div>
						</div>
					</div>
					<div class="user-info-list">
						<span style="margin-left: 0px;">手机号：{{user.user.phone}}</span>
					</div>
					<div class="user-info-list">
						<span style="margin-left: 0px;">个性签名：{{ user.user.motto }}</span>
					</div>
				</el-card>
				<el-card shadow="hover" style="height: 252px">
					<template #header>
						<div class="clearfix">
							<span>天气详情</span>
						</div>
					</template>
					<div>
						<weather class="weather"/>
					</div>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<el-icon class="grid-con-icon"><User /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{fistPage_val.indate}}</div>
									<div>入职时长</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<el-icon class="grid-con-icon"><SuccessFilled /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{fistPage_val.clock}}</div>
									<div>打卡次数</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<el-icon class="grid-con-icon"><WarningFilled /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{fistPage_val.noclock}}</div>
									<div>缺卡次数</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-card shadow="hover" style="height: 403px">
					<template #header>
						<div class="clearfix">
							<span>待办事项</span>
							<el-button style="float: right; padding: 3px 0" text>添加</el-button>
						</div>
					</template>

					<el-table :show-header="false" :data="todoList" style="width: 100%">
						<el-table-column width="40">
							<template #default="scope">
								<el-checkbox v-model="scope.row.status"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope">
								<div
									class="todo-item"
									:class="{
										'todo-item-del': scope.row.status
									}"
								>
									{{ scope.row.title }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
		<!-- <el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
				</el-card>
			</el-col>
		</el-row> -->
	</div>
</template>

<script setup lang="ts" name="dashboard">
import { onMounted, reactive, ref } from 'vue';
import { useUserMessage } from '../store/user';
import path from '../api/path'
import weather from './weather.vue'
import { firstPage } from '../api';

const fistPage_val = ref({indate:'100', clock:'100', noclock:'100'});
const user = useUserMessage()
user.fresh()
const _role = localStorage.getItem('ms_role');
const role: string = _role === 'boss' ? 'boss' :  _role === 'HR'? 'HR':  _role === 'admin'? '管理员':'普通用户';



const getFistPage = () =>{
	console.log("=======getFirstPage=====")
	const id = localStorage.getItem('ms_userId')
	if(id === null){
		return;
	}
	firstPage(id).then(res =>{
		console.log('======request=======')
		console.log(res.data)
		fistPage_val.value =  res.data.data
	})
}

getFistPage()

const todoList = reactive([
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要写100行代码加几个bug吧',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: true
	},
	{
		title: '今天要写100行代码加几个bug吧',
		status: true
	}
]);
</script>


<style scoped>
.el-row {
	margin-bottom: 20px;
}

.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	display: flex;
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 20px;
}

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.weather{
	width: 80px;
	height: 40px;
}
.weather_div{
	width: 80px;
	height: 40px;
}
</style>
