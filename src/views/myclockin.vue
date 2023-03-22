<template>
	<div class="common-layout">
		<el-container>
			<el-header style="height: 30px; padding-left: 10px; padding-right: 5px;" >
				<el-row >
					<el-col :span="24">
						<div>
							<p style="height: 27px;font-weight: bold ;font-size: 18px;">今天又是元气满满的一天</p>
						</div>
					</el-col>
				</el-row>
			</el-header>
			
			<el-main style="padding-top: 5px; height: 560px; padding-bottom: 5px;  padding-left: 10px; padding-right: 5px;" >
				<el-tabs type="border-card" style="height: 545px;">
					<el-tab-pane label="我的打卡">
						<el-container>
							<el-aside style="width: 50%; height:480px; padding-top: 5px; padding-right: 5px; padding-left: 5px; padding-bottom: 5px;">
								<div style="margin-top: 160px; margin-left:90px;">
									<clock></clock>
								</div>
								
							</el-aside>
							<el-main style="width: 50%; height:480px; padding-top: 5px; padding-right: 5px; padding-left: 5px; padding-bottom: 5px;">
								<el-calendar  style="height: 500px; width: 550px;" ref="calendar">
									<template #header="{ date }">
									      <span>{{ date }}</span>
									      <el-button-group>
									        <el-button size="small" @click="selectDate('prev-month')">上个月</el-button>
									        <el-button size="small" @click="selectDate('today')">今天</el-button>
									        <el-button size="small" @click="selectDate('next-month')">下个月</el-button>
									      </el-button-group>
									</template>
								    <template #date-cell="{ data }">
										<p style="height: 30px; font-size: 20px;">
											{{ data.day.split('-').slice(1).join('-') }}
										</p>

										<div v-for="(item, index) in calendarData" :key="index">
											<div v-if="data.day===item.today" >
													<div v-if="item.code === 1" >
														<el-row>
														    <el-col :span="12" >
																<div class="red_color" >
																	<el-tooltip content="下午未打卡" placement="top">
																		✗
																	</el-tooltip>
																</div>
															</el-col>
														    <el-col :span="12">
																<div class="green_color" >
																	<p>
																		✓
																	</p>
																</div>
															</el-col>
														</el-row>
													</div>
													<div v-else-if="item.code === 2" >
														<el-row>
														    <el-col :span="12" >
																<div class="green_color" >
																	<p>
																		✓
																	</p>
																</div>
															</el-col>
														    <el-col :span="12">
																<div class="red_color" >
																	<el-tooltip content="下午未打卡" placement="top">
																		✗
																	</el-tooltip>
																</div>
															</el-col>
														</el-row>
													</div>
													<div v-else-if="item.code === 3">
														<el-row>
														    <el-col :span="12" >
																<div class="red_color" >
																	<el-tooltip content="上午未打卡" placement="top">
																		✗
																	</el-tooltip>
																</div>
															</el-col>
														    <el-col :span="12">
																<div class="red_color" >
																	<el-tooltip content="下午未打卡" placement="top">
																		✗
																	</el-tooltip>
																</div>
															</el-col>
														</el-row>
													</div>
													<div v-else>
														<el-row>
														    <el-col :span="12" >
																<div class="green_color" >
																	<p>
																		✓
																	</p>
																</div>
															</el-col>
														    <el-col :span="12">
																<div class="green_color" >
																	<p>
																		✓
																	</p>
																</div>
															</el-col>
														</el-row>
													</div>
												</div>
										</div>
								    </template>
								</el-calendar>
							</el-main>
						</el-container>
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
	</div>
</template>

<script setup lang="ts">
import { columns } from 'element-plus/es/components/table-v2/src/common';
import { now } from 'moment';
import { ref, onMounted } from 'vue'
import { getUserClockinfo } from '../api/index'
import clock from './clock.vue'

const calendar = ref();
const now_date = ref(new Date().getMonth()+1);
const uid = localStorage.getItem("ms_userId");


const getCustomClass = (num :Number) => {
	if (num === 0) {
		return 'green_color'; // 根据不同日期返回不同的样式名
	}
	else if(num === 1 ||num === 2){
		return 'yellow_color';
	}
	else if(num === 3){
		return 'red_color';
	}
	return ''; // 如果没有定义样式，则返回空字符串
}

const userinfo = ref();
const calendarData = ref([]);

const getUserClockin = (now_month :Number, uid :String) => {
	getUserClockinfo(now_month, uid).then(res => {
		console.log(res);
		userinfo.value = res.data.data;
		userinfo.value=Object.entries(userinfo.value);
		let len = userinfo.value.length;
		for(var i=0;i<len;i++){
			let info = ref({});
			info.value["today"]=userinfo.value[i][0];
			info.value["code"] = userinfo.value[i][1];
			let clr =getCustomClass(userinfo.value[i][1]);
			info.value["color"]=clr;
			if(clr==='red_color'){
				info.value["msg"] = "error";
			}
			calendarData.value.push(info.value);
		}
		calendarData.value[1].color="green_color";
		calendarData.value[1].code = 0;
		calendarData.value[2].code = 2;
		//转为字典格式
		// calendarData.value = userinfo.value.reduce((obj, item) => {
		//   obj[item[0]] = getCustomClass(item[1]);
		//   return obj;
		// }, {});
		//calendarData.value["2023-03-01"] = 'green_color';
		console.log(calendarData);
	});
}
getUserClockin(now_date.value, uid);

const selectDate = (val: string) => {
	if(val === "prev-month"){
		now_date.value -= 1;
		getUserClockin(now_date.value, uid);
	}
	else if(val==="today"){
		now_date.value = new Date().getMonth()+1;
		getUserClockin(now_date.value, uid);
	}
	else if(val === "next-month"){
		now_date.value += 1;
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

</style>



