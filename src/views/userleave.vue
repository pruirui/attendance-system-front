<template>

	<el-dialog v-model="dialogVisible" title="请假表单" width="40%" center>

		<el-form >
		    <el-form-item label="请假起始日期" :label-width="formLabelWidth">
		        <el-date-picker v-model="value" type="daterange"
		        		range-separator="To"
		        		start-placeholder="Start date"
		        		end-placeholder="End date"
		        		:disabled-date="disabledDate">
		        </el-date-picker>
		    </el-form-item>
		    <el-form-item label="请假原因" :label-width="formLabelWidth">
		        <el-input v-model="reason" autocomplete="off" />
		    </el-form-item>
			<el-form-item label="部门ID"  :label-width="formLabelWidth" >
				<el-select v-model="departmentvalue" class="m-2" placeholder="选择部门" >
					<el-option v-for="(item,index) in departmentids" :key="index" :label="item.label" :value="item.value"/>
				</el-select>
			</el-form-item>
		</el-form>
	
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false;handleClose()">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false; handleClose();handleLeave()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getDepartmentByUid , userLeave} from "../api/index";
import { ElMessage } from "element-plus";
const disabledDate = (time:any) =>{
      return time.getTime() < Date.now()- 8.64e7; // 禁止选择未来的日期
}
const formLabelWidth = '140px'
const departmentvalue = ref('');
const reason = ref('')
const emits = defineEmits(['changedialogVisible']);
const dialogVisible = ref(true);
const value=ref<[Date, Date]>();
const departmentids = ref([]);
const uid = localStorage.getItem("ms_userId");

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
	emits("changedialogVisible");
}

const handleLeave = () => {
	
	if(value.value === undefined || departmentvalue.value === '' || reason.value === ''){
		ElMessage.info("请假申请表单不能为空！");
	}
	else{
		userLeave(uid, departmentvalue.value, setDay(value.value[0]),setDay(value.value[1]), reason.value).then(res =>{
			if(res.data.code === 1){
				ElMessage.success("请假申请成功，请等待审核！");
			}
			else if(res.data.code === -1){
				ElMessage.warning("申请已提交，请勿重复提交！");
			}
			else{
				ElMessage.error("请假申请失败，请等待审核！");
			}
		});
	}
	
}

const setDay  = (d :Date) => {
	
	// 获取日期的年份（getFullYear返回一个四位数）
	var year = d.getFullYear();
	
	// 获取日期的月份（getMonth返回0-11，需要加1）
	var month = d.getMonth() + 1;
	
	// 获取日期的日数
	var day = d.getDate();
	
	// 将月份和日数转换为字符串，并且保证它们的长度为2位
	month = ("0" + month).slice(-2);
	day = ("0" + day).slice(-2);
	
	// 组合字符串，格式为"yyyy-mm-d"
	var dateStr = year + "-" + month + "-" + day;
	return dateStr
}
</script>


<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
