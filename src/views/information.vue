<template>
	<div class="container">
		<el-tabs v-model="message">
			<el-tab-pane :label="`待我处理(${datas.unread.length})`" name="first">
				<el-table :data="datas.unread" :show-header="false" style="width: 100%">
					<el-table-column width="500">
						<template #default="scope" >
							<span class="message-title">[{{ scope.row.event }}]，发起人：{{scope.row.username}}， 部门名称：{{scope.row.departmentname}}</span>
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
							<el-button size="small" @click="handle(scope.id, '拒绝')">拒绝</el-button>
							<el-button size="small" @click="handle(scope.id, '接受')">接受</el-button>
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
								<span class="message-title">[{{ scope.row.event }}]，处理人：{{scope.row.username}}， 部门名称：{{scope.row.departmentname}}</span>
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
								<span class="message-title">[{{ scope.row.event }}]，参与人：{{scope.row.username}}， 部门名称：{{scope.row.departmentname}}</span>
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
import { queryMyApplications } from '../api/index';
import { useRouter } from 'vue-router';

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
}



const message = ref('first');
const datas = reactive({
	unread: [
		{	sender_id:'0',
			process_id:'1',
			name:'test',
			departmentname:'腾讯',
			department_id:'8',
			content:'',
			event:'hr邀请员工',
			create_time:'2018-10-20 20:00:00',
			apply_time:'2018-04-19 20:00:00',
			description:'',
			state:'',
			makeup_clock:''
		}
	],
	read: [
		{	sender_id:'0',
			process_id:'1',
			name:'test',
			departmentname:'腾讯',
			department_id:'8',
			content:'',
			event:'hr邀请员工',
			create_time:'2018-10-20 20:00:00',
			apply_time:'2018-04-19 20:00:00',
			description:'',
			state:'',
			makeup_clock:''
		}
	],
	down: [
		{	sender_id:'0',
			process_id:'1',
			name:'test',
			departmentname:'腾讯',
			department_id:'8',
			content:'',
			event:'hr邀请员工',
			create_time:'2018-10-20 20:00:00',
			apply_time:'2018-04-19 20:00:00',
			description:'',
			state:'',
			makeup_clock:''
		}
	]
});
const uid = localStorage.getItem("ms_userId");
const router = useRouter()

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
		console.log(res)
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
	uid;
	getData()
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
