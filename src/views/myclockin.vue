<template>
	<el-row :gutter="20" align="middle">
	    <el-col :span="10" :offset="2" >
			<el-card :body-style="{ padding: '0px' }" style="height: 510px; width: 380px; text-align: center;">
				<clock></clock>
				<showtime style="height:120px; width: 300px;padding-left: 45px;"></showtime>
				<div style="margin-top: 20px; margin-left:100px; margin-right: 110px;">
					<el-row :gutter="12">
					    <el-col :span="6" >
							<el-button type="primary" :disabled="handclockin|button1" @click="handclockin=true"> 签到</el-button>
							<camera v-if="handclockin" :flag="false" @changevisiable="handclockin=false"></camera>
						</el-col>
						<el-col :span="6" >
							<el-button type="primary" v-if="handclockin" @click="handlehandClockin"> 手动签到</el-button>
						</el-col>
					    <el-col :span="6" >
							<el-button type="primary" :disabled="handclockout|button2" @click="handclockout=true">签退</el-button>
							<camera v-if="handclockout" :flag="false" @changevisiable="handclockout=false" :uid="uid"></camera>
						</el-col>
						<el-col :span="6" >
							<el-button type="primary" v-if="handclockout" @click="handlehandClockout">手动签退</el-button>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-col>
	    <el-col :span="12">
			<el-card :body-style="{ padding: '0px' }" style="width: 500px;">
				<el-calendar  style="height: 400px; width: 450px; padding-top: 5px; padding-bottom: 0;" ref="calendar" >
					<template #header="{ date }">
					      <span>{{ date }}</span>
					      <el-button-group>
					        <el-button size="small" @click="selectDate('prev-month')">上个月</el-button>
					        <el-button size="small" @click="selectDate('today')">今天</el-button>
					        <el-button size="small" :disabled="nextMonth == 0" @click="selectDate('next-month')">下个月</el-button>
					      </el-button-group>
					</template>
				    <template #date-cell="{ data }">
						<p style="height: 30px; font-size: 20px;">
							{{ data.day.split('-').slice(2).join('-') }}
						</p>
						<div v-for="(item, index) in calendarData" :key="index">
							<div v-if="data.day===item.today">
								<div v-if="item.code === 1" >
									<el-row>
										<el-col :span="12" >
											<div >
												<el-tooltip :disabled="true" content="" placement="top" >
													<el-button type="success" text style="width: 50%; height: 27px;">✓</el-button>
												</el-tooltip>
											</div>
										</el-col>
										<el-col :span="12" >
											<div >
												<el-tooltip :disabled="false" content="下午未打卡" placement="top" >
													<el-popover :visible="item.second_disabled" placement="top" :width="230">
													    <p style="width: 200px; height: 40px;">你确定要补{{data.day.split('-').slice(1).join('-') }}下午的打卡吗？</p>
														<div style="width: 200px; height: 40px;">
															<el-form :inline="true" >
															    <el-form-item label="部门名" style="width: 200px;" >
																	<el-select v-model="value" class="m-2" placeholder="选择部门"   style="width: 120px; height: 32px;">
																		<el-option v-for="(item,index) in departmentids" :key="index" :label="item.label" :value="item.value"/>
																	</el-select>
															    </el-form-item>
															</el-form>
														</div>
													    <el-input v-model="input" placeholder="请输入你的补卡理由"/>
													    <div style="text-align: right; margin: 0;padding-top: 10px;">
															<el-button size="small" text @click="item.second_disabled = false">取消</el-button>
															<el-button size="small" type="primary" @click="item.second_disabled = false;handleClick(data.day,1)">确定</el-button>
													    </div>
													    <template #reference>
															<el-button @click="item.second_disabled = true" type="danger" text style="width: 50%; height: 27px;">✗</el-button>
													    </template>
													</el-popover>
												</el-tooltip>
											</div>
										</el-col>
									</el-row>
								</div>
								<div v-else-if="item.code === 2" >
									<el-row>
										<el-col :span="12" >
											<div >
												<el-tooltip :disabled="false" content="上午未打卡" placement="top" >
													<el-popover :visible="item.first_disabled" placement="top" :width="230">
													    <p style="width: 200px; height: 40px;">你确定要补{{data.day.split('-').slice(1).join('-') }}上午的打卡吗？</p>
														<div style="width: 200px; height: 40px;">
															<el-form :inline="true" >
																<el-form-item label="部门名" style="width: 200px;" >
																	<el-select v-model="value" class="m-2" placeholder="选择部门" size="small"  style="width: 120px; height: 32px;">
																		<el-option v-for="(item,index) in departmentids" :key="index" :label="item.label" :value="item.value"/>
																	</el-select>
																</el-form-item>
															</el-form>
														</div>
													    <el-input v-model="input" placeholder="请输入你的补卡理由" />
													    <div style="text-align: right; margin: 0;padding-top: 10px;">
															<el-button size="small" text @click="item.first_disabled = false">取消</el-button>
															<el-button size="small" type="primary" @click="item.first_disabled = false;handleClick(data.day,0)">确定</el-button>
													    </div>
													    <template #reference>
															<el-button @click="item.first_disabled = true" type="danger" text style="width: 50%; height: 27px;">✗</el-button>
													    </template>
													</el-popover>
												</el-tooltip>
											</div>
										</el-col>
										<el-col :span="12" >
											<div >
												<el-tooltip :disabled="true" content="" placement="top" >
													<el-button type="success" text style="width: 50%; height: 27px;">✓</el-button>
												</el-tooltip>
											</div>
										</el-col>
									</el-row>
								</div>
								<div v-else-if="item.code === 3">
									<el-row>
										<el-col :span="12">
											<div >
												<el-tooltip :disabled="false" content="上午未打卡" placement="top" >
													<el-popover :visible="item.first_disabled" placement="top" :width="230"  >
													    <p style="width: 200px; height: 40px;">你确定要补{{data.day.split('-').slice(1).join('-') }}上午的打卡吗？</p>
														<div style="width: 200px; height: 40px;">
															<el-form :inline="true" >
																<el-form-item label="部门名" style="width: 200px;" >
																	<el-select v-model="value" class="m-2" placeholder="选择部门" size="small" style="width: 120px; height: 32px;">
																		<el-option v-for="(item,index) in departmentids" :key="index" :label="item.label" :value="item.value"/>
																	</el-select>
																</el-form-item>
															</el-form>
														</div>
													    <el-input v-model="input" placeholder="请输入你的补卡理由" />
													    <div style="text-align: right; margin: 0;padding-top: 10px;">
															<el-button size="small" text @click="item.first_disabled = false">取消</el-button>
															<el-button size="small" type="primary" @click="item.first_disabled = false; handleClick(data.day,0)">确定</el-button>
													    </div>
													    <template #reference>
															<el-button @click="item.first_disabled = true" type="danger" text style="width: 50%; height: 27px;">✗</el-button>
													    </template>
													</el-popover>
												</el-tooltip>
											</div>
										</el-col>
										<el-col :span="12">
											<div >
												<el-tooltip :disabled="false" content="下午未打卡" placement="top" >
													<el-popover :visible="item.second_disabled" placement="top" :width="230">
													    <p style="width: 200px; height: 40px;">你确定要补{{data.day.split('-').slice(1).join('-') }}下午的打卡吗？</p>
														<div style="width: 200px; height: 40px;">
															<el-form :inline="true" >
																<el-form-item label="部门名"  style="width: 200px;" >
																	<el-select v-model="value" class="m-2" placeholder="选择部门" size="small" style="width: 120px; height: 32px;">
																		<el-option v-for="(item,index) in departmentids" :key="index" :label="item.label" :value="item.value"/>
																	</el-select>
																</el-form-item>
															</el-form>
														</div>
													    <el-input v-model="input" placeholder="请输入你的补卡理由" />
													    <div style="text-align: right; margin: 0;padding-top: 10px;">
															<el-button size="small" text @click="item.second_disabled = false">取消</el-button>
															<el-button size="small" type="primary" @click="item.second_disabled = false; handleClick(data.day,1)">确定</el-button>
													    </div>
													    <template #reference>
															<el-button @click="item.second_disabled = true" type="danger" text style="width: 50%; height: 27px;">✗</el-button>
													    </template>
													</el-popover>
												</el-tooltip>
											</div>
										</el-col>
									</el-row>
								</div>
								<div v-else>
									<el-row>
										<el-col :span="12" >
											<div >
												<el-tooltip :disabled="true" content="" placement="top" >
													<el-button type="success" text style="width: 50%; height: 27px;">✓</el-button>
												</el-tooltip>
											</div>
										</el-col>
										<el-col :span="12" >
											<div >
												<el-tooltip :disabled="true" content="" placement="top" >
													<el-button type="success" text style="width: 50%; height: 27px;">✓</el-button>
												</el-tooltip>
											</div>
										</el-col>
									</el-row>
								</div>
							</div>
						</div>
				    </template>
				</el-calendar>
			</el-card>
			
			<el-card  style="width: 500px; height: 170px;">
				<div style="width: 460px; height: 30px; padding-right: 20px; padding-left: 0px;padding-bottom: 0;padding-top: 5;">
						<el-descriptions class="margin-top" title="打卡日历描述" :column="2"   border>
						    <template #extra >
								<el-row :gutter="40" >
								    <el-col :span="12">
										<el-button type="primary" size="small" @click="dialogVisible = true">请假申请</el-button>
										<userleave v-if="dialogVisible" @changedialogVisible="dialogVisible = false"></userleave>
									</el-col>
								    <el-col :span="12">
										<el-button type="primary" size="small" @click="dialogVisible1 = true">加班申请</el-button>
										<overtime v-if="dialogVisible1" @changedialogVisible1="dialogVisible1 = false"></overtime>
									</el-col>
								</el-row>
							</template>
						    <el-descriptions-item>
								<template #label> <div class="cell-item" style="text-align: center; color: lawngreen;">✓</div></template>
								✓代表已经打卡
						    </el-descriptions-item>
						    <el-descriptions-item>
						      <template #label><div class="cell-item" style="text-align: center;color: red;">✗</div> </template>
						      ✗代表没有打卡
						    </el-descriptions-item>
						    <el-descriptions-item>
						      <template #label> <div class="cell-item" style="text-align: center;">  描述 </div></template>
						      点击日历上面的✗，进行补卡；请假、加班申请请点击按钮
						    </el-descriptions-item>
						  </el-descriptions>
					</div>
			</el-card>
			
			
		</el-col>

	  </el-row>
	
</template>

<script setup lang="ts">
import { ref} from 'vue'
//import {Check,Close, Notification} from '@element-plus/icons-vue'
import { getUserClockinfo,userClockDayData,handClockOut,handClockIn } from '../api/index'
import clock from './clock.vue'
import showtime from './showtime.vue'
import { ElMessage, imageProps } from "element-plus";
import { getDepartmentByUid , usermakeUpClock} from "../api/index";
import userleave from './userleave.vue'
import overtime from './overtime.vue'
import camera from './camera.vue'
const handclockin = ref(false);
const handclockout = ref(false);


const calendar = ref();
const now_date = ref(new Date().getMonth()+1);
const uid = localStorage.getItem("ms_userId");
const departmentids = ref([]);
const value = ref('');
const input = ref('');
const userinfo = ref();
const calendarData = ref([]);
const dialogVisible = ref(false);
const dialogVisible1 = ref(false);
const nextMonth = ref(0)

const button1 = ref(false);
const button2 = ref(false);

const handlehandClockin = () => {
	handClockIn(uid).then(res =>{
		if(res.data.code === 1){
			ElMessage.success(res.data.msg);
		}
		else if(res.data.code === 0){
			ElMessage.warning(res.data.msg);
		}
		else{
			ElMessage.error(res.data.msg);
		}
		console.log(res);
	})
}

const handlehandClockout = () => {
	handClockOut(uid).then(res=>{
		if(res.data.code === 1){
			ElMessage.success(res.data.msg);
		}
		else if(res.data.code === 0){
			ElMessage.warning(res.data.msg);
		}
		else{
			ElMessage.error(res.data.msg);
		}
		console.log(res);
	})
}

getDepartmentByUid(uid).then((res) => {
	if (res.status != 200) {
		ElMessage.error("出错了");
		return;
	}
	let data = res.data;
	//console.log(data);
	if (data.code == 1) {
		let len = data.data.length;
		//console.log(len);
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

const handleClick = (date, code) => {

	if(value.value === ''|| input.value === ''){
		ElMessage.info("请填写完整表单");
	}
	else{
		usermakeUpClock(uid,value.value, date, code, input.value).then((res) => {
			if(res.data.code === 1){
				ElMessage.success(res.data.msg);
			}
			else{
				ElMessage.warning(res.data.msg);
			}
			//console.log(res);
		});
	}
	input.value='';
	value.value='';
}

const getUserTodayClockin = ()=>{
	userClockDayData(uid).then(res =>{
		console.log(res.data.data);
		if(res.data.data['clockIn'] === 0){
			button1.value = false;
		}
		else{
			button1.value=true;
		}
		if(res.data.data['clockOut'] === 0){
			button2.value=false;
		}
		else{
			button2.value=true;
		}
	})
}
getUserTodayClockin();

const getUserClockin = (now_month :Number, uid :String) => {
	getUserClockinfo(now_month, uid).then(res => {
		//console.log(res);
		userinfo.value = res.data.data;
		userinfo.value=Object.entries(userinfo.value);
		let len = userinfo.value.length;
		for(var i=0;i<len;i++){
			let info = ref({});
			info.value["today"]=userinfo.value[i][0];
			info.value["code"] = userinfo.value[i][1];
			if(userinfo.value[i][1]===1){//下午未打卡
				info.value["first_disabled"] = true;
				info.value["second_disabled"] = false;
			}
			else if(userinfo.value[i][1]===2){//下午未打卡
				info.value["first_disabled"] = false;
				info.value["second_disabled"] = true;
			}
			else if(userinfo.value[i][1]===3){//下午未打卡
				info.value["first_disabled"] = false;
				info.value["second_disabled"] = false;
			}
			else{//上下午均打卡
				info.value["first_disabled"] = true;
				info.value["second_disabled"] = true;
			}
			calendarData.value.push(info.value);
		}
		//console.log(calendarData);
	});
}
getUserClockin(now_date.value, uid);

const selectDate = (val: string) => {
	if(val === "prev-month"){
		now_date.value -= 1;
		calendarData.value = [];
		nextMonth.value += 1;
		getUserClockin(now_date.value, uid);
	}
	else if(val==="today"){
		calendarData.value = [];
		now_date.value = new Date().getMonth()+1;
		nextMonth.value = 0;
		getUserClockin(now_date.value, uid);
	}
	else if(val === "next-month"){
		calendarData.value = [];
		now_date.value += 1;
		nextMonth.value -= 1
		getUserClockin(now_date.value, uid);
	}
	calendar.value.selectDate(val)

}

</script>

<style>
.header{
	height: 30px;
}
.el-col {
  border-radius: 4px;
}
.el-calendar-table {
	background-color: azure;
}
.is-selected {
  background-color: #efef77;
}
.green_color{
	background-color: #00e100;
}
.yellow_color {
	background-color: #efef77;
}
.red_color {
	background-color: #f40000;
}
.el-calendar-table .el-calendar-day{
	text-align: center; 
    height: 55px;
	padding: 0;
}
.el-form-item__label{
	padding-right: 40px;
}
.el-descriptions {
	height: 18px;
  margin-top: 0px;
}
.el-descriptions__header{
	margin-bottom: 2px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 2px;
}
.el-descriptions__body{
	height: 80px;
}
.common-layout {

	display: flex;

}
</style>

