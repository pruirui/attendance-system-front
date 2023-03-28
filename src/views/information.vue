<template>
	<div class="container">
		<el-tabs v-model="message" @tab-click="getData">
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
							<span class="description">详细信息：{{scope.row.content?scope.row.content+".  ":""}}{{scope.row.description?'描述: '+scope.row.description:'无描述'}}</span>
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
								<span class="description">详细信息：{{scope.row.content?scope.row.content+". ":""}}{{"描述: "+scope.row.description}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="create_time" width="200"></el-table-column>
					</el-table>
				</template>
			</el-tab-pane>
			<el-tab-pane :label="`已处理事项(${datas.down.length})`" name="third">
				<template v-if="message === 'third'">
					<el-table :data="datas.down" :show-header="false" style="width: 100%">
						<el-table-column width="400">
							<template #default="scope">
								<el-popover placement="top-start" width="600px" trigger="click">
									
								    <template #reference>
										<span class="message-title">[{{ scope.row.event }}]&nbsp;发起人:{{scope.row.sendername}}&nbsp;处理人:{{scope.row.processname}}&nbsp;部门名称:{{scope.row.departmentname}}</span>
									</template>
									<el-descriptions :title="scope.row.event" :column="3" border size="small">
									    <el-descriptions-item label="发起人" label-align="right" align="center" >{{scope.row.sendername}}</el-descriptions-item>
									    <el-descriptions-item label="处理人" label-align="right" align="center">{{scope.row.processname}}</el-descriptions-item>
									    <el-descriptions-item label="部门名称" label-align="right" align="center">{{scope.row.departmentname}}</el-descriptions-item >
									    <el-descriptions-item label="状态" label-align="right" align="center">{{scope.row.state}}</el-descriptions-item>
									    <el-descriptions-item label="详细信息" label-align="right" align="center">{{scope.row.content?scope.row.content+". ":""}}{{"描述: "+scope.row.description}}</el-descriptions-item>
										<el-descriptions-item label="处理时间" label-align="right" align="center">{{scope.row.apply_time}}</el-descriptions-item>
									  </el-descriptions>
								  </el-popover>

							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope" width="70">
								<span class="state">状态：{{scope.row.state}}</span>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope" width="400">
								<span class="description">详细信息：{{scope.row.content?scope.row.content+". ":""}}{{"描述: "+scope.row.description}}</span>
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

const handleclick = () =>{
	
}
const visible = ref(false);
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
		console.log(res);
		datas.read = res.data.data.read;
		datas.unread = res.data.data.unread;
		datas.down = res.data.data.down;
		
		let len = datas.unread.length
		for(let i =0;i<len;i++){
			
			if(datas.unread[i].event === "员工申请请假"){
				let len1 =datas.unread[i].content.length 
				let temp = "请假开始时间:"
				for (let j = 0; j < len1; j++) {
					temp = temp.concat(datas.unread[i].content[j])
					if(j===9){
						temp=temp.concat(" 请假结束时间:")
					}
				}
				datas.unread[i].content=temp;
			}
			else if(datas.unread[i].event === "员工申请补打卡"){
				let temp ="补";
				temp=temp.concat(datas.unread[i].content);
				datas.unread[i].content=temp;
			}
			else if(datas.unread[i].event === "员工申请加班"){
				let temp = "加班开始时间:"
				let timea = datas.unread[i].content.split(" ")
				temp = temp.concat(timea[0])
				temp = temp.concat(" 加班结束时间:")
				if(timea[1]==="00:00"){
					temp = temp.concat("24:00")
				}
				else{
					temp = temp.concat(timea[1])
				}
				datas.unread[i].content = temp
			}
		}
		
		let len1 = datas.down.length
		for(let i =0;i<len1;i++){
			
			if(datas.down[i].event === "员工申请请假"){
				let len11 =datas.down[i].content.length 
				let temp = "请假开始时间:"
				for (let j = 0; j < len11; j++) {
					temp = temp.concat(datas.down[i].content[j])
					if(j===9){
						temp=temp.concat(" 请假结束时间:")
					}
				}
				datas.down[i].content=temp;
			}
			else if(datas.down[i].event === "员工申请补打卡"){
				let temp ="补";
				temp=temp.concat(datas.down[i].content);
				datas.down[i].content=temp;
			}
			else if(datas.down[i].event === "员工申请加班"){
				let temp = "加班开始时间:"
				let timea = datas.down[i].content.split(" ")
				temp = temp.concat(timea[0])
				temp = temp.concat(" 加班结束时间:")
				if(timea[1]==="00:00"){
					temp = temp.concat("24:00")
				}
				else{
					temp = temp.concat(timea[1])
				}
				datas.down[i].content = temp
			}
		}
		//console.log(datas.down)
		let len2 = datas.read.length
		for(let i =0;i<len2;i++){
			
			if(datas.read[i].event === "员工申请请假"){
				let len11 =datas.read[i].content.length 
				let temp = "请假开始时间:"
				for (let j = 0; j < len11; j++) {
					temp = temp.concat(datas.read[i].content[j])
					if(j===9){
						temp=temp.concat(" 请假结束时间:")
					}
				}
				datas.read[i].content=temp;
			}
			else if(datas.read[i].event === "员工申请补打卡"){
				let temp ="补";
				temp=temp.concat(datas.read[i].content);
				datas.read[i].content=temp;
			}
			else if(datas.read[i].event === "员工申请加班"){
				let temp = "加班开始时间:"
				let timea = datas.read[i].content.split(" ")
				temp = temp.concat(timea[0])
				temp = temp.concat(" 加班结束时间:")
				if(timea[1]==="00:00"){
					temp = temp.concat("24:00")
				}
				else{
					temp = temp.concat(timea[1])
				}
				datas.read[i].content = temp
			}
		}
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
