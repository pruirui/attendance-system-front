<template>
	<div class="container">
		<el-tabs v-model="message">
			<el-tab-pane :label="`待我处理(${datas.unread.length})`" name="first">
				<el-table :data="datas.unread" :show-header="false" style="width: 100%">
					<el-table-column width="500">
						<template #default="scope" >
							<span class="message-title">[{{ scope.row.event }}]&nbsp;发起人:{{scope.row.sendername}}&nbsp;处理人:{{scope.row.processname}}&nbsp;部门名称:{{scope.row.departmentname}}</span>
						</template>
					</el-table-column>
					<el-table-column  width="120">
						<template #default="scope">
							<span class="state">状态：{{scope.row.state}}</span>
						</template>
					</el-table-column>
					<el-table-column>
						<template #default="scope" width="300">
							<span class="description">详细信息：{{scope.row.content?'补'+scope.row.content+"，":""}}{{scope.row.description?scope.row.description:'无描述'}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" width="180"></el-table-column>
					<el-table-column width="150" align="left">
						<template #default="scope">
							<el-button size="small" @click="handle(scope.row.id, '拒绝')">拒绝</el-button>
							<el-button size="small" @click="handle(scope.row.id, '接受')">接受</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="handle-row">
					<el-button type="primary">全部通过申请</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane :label="`我的申请(未处理)(${datas.read.length})`" name="second">
				<template v-if="message === 'second'">
					<el-table :data="datas.read" :show-header="false" style="width: 100%">
						<el-table-column width="500">
							<template #default="scope">
								<span class="message-title">[{{ scope.row.event }}]&nbsp;发起人:{{scope.row.sendername}}&nbsp;处理人:{{scope.row.processname}}&nbsp;部门名称:{{scope.row.departmentname}}</span>
							</template>
						</el-table-column>
						<el-table-column width="120">
							<template #default="scope" >
								<span class="state">状态：{{scope.row.state}}</span>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope" width="300">
								<span class="description">详细信息：{{scope.row.content?'补'+scope.row.content+"，":""}}{{scope.row.description}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="create_time" width="200"></el-table-column>
					</el-table>
				</template>
			</el-tab-pane>
			<el-tab-pane :label="`已处理事项(${datas.down.length})`" name="third">
				<template v-if="message === 'third'">
					<el-table :data="datas.down" :show-header="false" style="width: 100%">
						<el-table-column width="500">
							<template #default="scope">
								<span class="message-title">[{{ scope.row.event }}]&nbsp;发起人:{{scope.row.sendername}}&nbsp;处理人:{{scope.row.processname}}&nbsp;部门名称:{{scope.row.departmentname}}</span>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope" width="100">
								<span class="state">状态：{{scope.row.state}}</span>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope" width="300">
								<span class="description">详细信息：{{scope.row.content?'补'+scope.row.content+"，":""}}{{scope.row.description}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="apply_time" width="250"></el-table-column>
					</el-table>
				</template>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, CirclePlusFilled,HelpFilled } from '@element-plus/icons-vue';
import { queryMyApplications,processMyApplications,userBaseData } from '../api/index';
import { useRouter } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import {useBellMessage} from '../store/bell'

interface DataTemplate{
	id:string;
	sender_id:string;
	process_id:string;
	username:string;
	departmentname:string;
	department_id:string;
	content:string;
	event:string;
	create_time:string;
	apply_time:string;
	description:string;
	state:string;
	makeup_clock:string;
	sendername:string;
	processname:string;

}



const message = ref('first');
const datas = reactive({
	unread: [
		
	],
	read: [
		
	],
	down: [
	]
});
const uid = localStorage.getItem("ms_userId");
const router = useRouter()
const bell_msg = useBellMessage();

if(uid === null){
	ElMessage.error('未检测到用户登入，请登入！')
	localStorage.clear();
	router.push('/login');
}

const getData = ()=>{
	if(uid === null){
		return;
	}
	queryMyApplications(uid).then((res)=>{
		if(res.status  != 200){
			ElMessage.error("出错了");
		}
		datas.read = res.data.data.read;
		datas.unread = res.data.data.unread;
		datas.down = res.data.data.down;
	})
}

getData();


const handle = (id:string, state:string) =>{
	if(uid === null){
		return;
	}
	console.log(id,state,uid)
	processMyApplications(uid,id,state).then((res) => {
		console.log(res);
		ElMessage.success(res.data.msg);
		if(state === '接受'){
			userBaseData(uid).then(response =>{
				const permiss = usePermissStore();//权限管理

				if(response.status != 200){
					ElMessage.error('网络超时，请重新登入');
					router.push('/login')
					return;
				}
				let tmp = response.data["data"];
				if(tmp.role != localStorage.getItem("ms_role")){
					localStorage.setItem("ms_role",tmp.role )
					const keys = permiss.defaultList[tmp.role];
					permiss.handleSet(keys);
					localStorage.setItem('ms_keys', JSON.stringify(keys));
					router.push('/');

				}
				
			});
		}
		bell_msg.handle()
		getData()
	})
	//getData()
} 



</script>

<style>
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}
</style>
