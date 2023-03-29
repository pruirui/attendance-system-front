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
							<el-button style="float: right; padding: 3px 0" text @click="addItem">添加</el-button>
						</div>
					</template>

					<el-table :show-header="false" :data="todoList" style="width: 100%; height:320px">
						<el-table-column width="40">
							<template #default="scope">
								<el-checkbox v-model="scope.row.status" @change="checkFinish(scope.row)"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope">
								<input  v-model="scope.row.content" class="todo-item"
									:class="{
										'todo-item-del': scope.row.status
									}" @blur="checkFinish(scope.row)" @keyup.enter="e=>enterEvent(e)"/> 
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="dashboard">
import { onMounted, reactive, ref } from 'vue';
import { useUserMessage } from '../store/user';
import path from '../api/path'
import weather from './weather.vue'
import { firstPage,userTodoLists ,updateTodoLists, addTodoLists} from '../api';
import { ElMessage } from 'element-plus';

const fistPage_val = ref({indate:'100', clock:'100', noclock:'100'});
const user = useUserMessage()
user.fresh()
const _role = localStorage.getItem('ms_role');
const role: string = _role === 'boss' ? 'boss' :  _role === 'HR'? 'HR':  _role === 'admin'? '管理员':'普通用户';

const checkFinish = (row: any)=>{
	if(row.content == '' || row.content == null){
		row.status = false;
		ElMessage.warning('请输入代表事项');
		return;
	}
	console.log('=========')
	console.log(row)
	if(row.id == ''){
		let id = user.user.id
		if( id == null){
			return;
		}
		addTodoLists(id, row.content, row.status).then(res => {
			if(id == null){
				return;
			}
			userTodoLists(id).then((res) =>{
				if(res.status != 200){
					return
				}
				todoList.value = res.data.data;
				if(todoList.value == null){
					todoList.value = []
				}
			})
		})
	}else{
		updateTodoLists(row.id, row.content, row.status).then(res => {
			if(user.user.id == null){
				return;
			}
			userTodoLists(user.user.id).then((res) =>{
				if(res.status != 200){
					return
				}
				todoList.value = res.data.data;
				if(todoList.value == null){
					todoList.value = []
				}
			})
		})
	}
}

const enterEvent = (event:any) =>{
	event.target.blur()
}
	
	
const getFistPage = () =>{
	const id = localStorage.getItem('ms_userId')
	if(id === null){
		return;
	}
	firstPage(id).then(res =>{
		fistPage_val.value =  res.data.data
	})
	userTodoLists(id).then((res) =>{
		console.log('--------')
		console.log(res);
		if(res.status != 200){
			return
		}
		todoList.value = res.data.data;
		if(todoList.value == null){
			todoList.value = []
		}
	})
}

getFistPage()

const todoList = ref([
	{
		id:'',
		content: '今天要修复100个bug',
		status: false
	},
	{	
		id:'',
		content: '今天要修复100个bug',
		status: false
	},
	{
		id:'',
		content: '今天要写100行代码加几个bug吧',
		status: false
	},
	{
		id:'',
		content: '今天要修复100个bug',
		status: false
	},
	{	
		id:'',
		content: '今天要修复100个bug',
		status: true
	}
]);

const addItem = () =>{
	todoList.value.unshift({content:'', status: false, id: ''})
}


</script>


<style scoped>


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
	border: none;
	background-color: transparent;
	width: 100%;
}

.todo-item:hover, .todo-item:focus, .todo-item:active{
	box-shadow: 0 0 0 0px;
	background-color: transparent;
	border: none;
	outline: none;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
	pointer-events: none;
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
