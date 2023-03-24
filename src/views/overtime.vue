<template>
	<el-dialog v-model="dialogVisible" title="加班表单" width="40%" center>
		<el-form >
		    <el-form-item label="加班时间段" :label-width="formLabelWidth">
		        <div class="demo-time-range">
		          <el-time-select v-model="startTime" :max-time="endTime" class="mr-4" placeholder="开始时间" size="small"
		            start="08:30"
		            step="00:30"
		            end="18:30"
		          />
		          <el-time-select v-model="endTime" :min-time="startTime"  placeholder="结束时间" size="small"
		            start="08:30"
		            step="00:30"
		            end="18:30"
		          />
		        </div>
		    </el-form-item>
		    <el-form-item label="加班原因" :label-width="formLabelWidth">
		        <el-input v-model="description" autocomplete="off" />
		    </el-form-item>
			<el-form-item label="部门ID"  :label-width="formLabelWidth" >
				<el-select v-model="departmentvalue" class="m-2" placeholder="选择部门" >
					<el-option v-for="(item,index) in departmentids" :key="index" :label="item.label" :value="item.value"/>
				</el-select>
			</el-form-item>
		</el-form>
		
		<template #footer>
		  <span class="dialog-footer">
		    <el-button @click="dialogVisible = false; handleClose()">取消</el-button>
		    <el-button type="primary" @click="dialogVisible = false; handleClose();handleovertime()">确定</el-button>
		  </span>
		</template>
	</el-dialog>
  
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getDepartmentByUid , userOverTime} from "../api/index";
import { ElMessage } from "element-plus";

const dialogVisible = ref(true);
const formLabelWidth = '140px'
const departmentvalue = ref('');
const startTime = ref('')
const endTime = ref('')
const emits = defineEmits(['changedialogVisible1']);
const departmentids = ref([]);
const uid = localStorage.getItem("ms_userId");
const description = ref('')

getDepartmentByUid(uid).then((res) => {
	if (res.status != 200) {
		ElMessage.error("出错了");
		return;
	}
	let data = res.data;
	if (data.code == 1) {
		let len = data.data.length;
		for(let i=0;i<len;i++){
			let info=ref({});
			info.value["label"]=data.data[i].departmentName;
			info.value["value"]=data.data[i].departmentid;
			departmentids.value.push(info.value);
		}
	} else {
		ElMessage.error(data.msg);
	}
}).catch(e => {ElMessage.error('网络超时了');});

const handleClose = () => {
	emits("changedialogVisible1");
}

const handleovertime = () => {
	
	if(startTime.value === '' || endTime.value === '' || description.value === ''){
		ElMessage.info("加班申请表单不能为空！");
	}
	else{
		// userOverTime(uid, departmentvalue.value, startTime.value, endTime.value, description).then(res => {
		// 	console.log(res);
		// })
	}
	
}
</script>