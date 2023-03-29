<template>
	<div> 
        <el-select
            v-model="departments"
            multiple
            collapse-tags
            placeholder="选择团队"
            style="width: 240px;margin:1%"
            @visible-change="selectCompany"
        >
            <el-option
            v-for="item in departmentsOptions"
            :key="item.departmentid"
            :label="item.departmentName"
            :value="item.departmentid"
            />
        </el-select>
        <el-select v-model="employee" filterable placeholder="选择员工" clearable style="margin:1%" @change="selectUser">
            <el-option
                v-for="item in employeeOptions"
                :key="item.id"
                :label="item.username"
                :value="item.id"
            />
        </el-select>
        <el-date-picker
            v-model="date"
            :default-value="date"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            format="YYYY-MM"
            style="margin:1%;"
            :disabled-date="disabledDate"
            @change="onDateChange"
        />
        <el-button type="primary" @click="exportXlsx">导出Excel</el-button>
		<el-row gutter="20" >
            <el-col :span="6">
                <el-card shadow="always" class="card">
                    <div class="grid-content grid-con-1">
                        <div class="grid-cont-right">
                            <div class="up">
                                <span class="green">打卡</span>
                                <span class="lighter">&nbsp;/&nbsp;</span>
                                <span class="red">缺卡</span></div>
                            <div class="down">
                                {{ paramUp.daka }}
                                <span class="lighter">/</span>
                                {{ paramUp.weidaka }}
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="always" class="card">
                    <div class="grid-content grid-con-1">
                        <div class="grid-cont-right">
                            <div class="up">
                                <span class="green">加班</span>
                                <span class="lighter">&nbsp;/&nbsp;</span>
                                <span class="red">请假</span></div>
                            <div class="down">
                                {{ paramUp.jiaban }}
                                <span class="lighter">/</span>
                                {{ paramUp.qingjia }}
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="always" class="card">
                    <div class="grid-content grid-con-1">
                        <div class="grid-cont-right">
                            <div class="up">
                                <span class="red">迟到</span>
                                <span class="lighter">&nbsp;/&nbsp;</span>
                                <span class="red">早退</span></div>
                            <div class="down">
                                {{ paramUp.chidao }}
                                <span class="lighter">/</span>
                                {{ paramUp.zaotui }}
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="always" class="card">
                    <div class="grid-content grid-con-1">
                        <div class="grid-cont-right">
                            <div class="up">
                                <span class="blue">考勤薪资</span>
                            </div>
                            <div class="down">
                                {{ paramUp.xinzi }}
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
		</el-row>
       
		<el-row :gutter="20">
			<el-col :span="9">
               
				<el-card shadow="hover">
					<div class="echarts-box">
                        <div id="pie" style="height:600px; width:100%"></div>
                    </div>
				</el-card>
			</el-col>
			<el-col :span="15">
				<el-card shadow="hover">
                    <div class="echarts-box">
                        <div id="line" style="height:600px; width:100%"></div>
                    </div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart';
import { onMounted, provide, reactive, ref } from 'vue';
import {usersInDepartments, getDepartmentByUid, allDepartmentsClockData,userClockInfo, exportExcel} from '../api/index'
import imgurl from '../assets/img/img.jpg';
import * as echarts from "echarts";
import { ElMessage, imageEmits } from 'element-plus';
import { PieChart } from '@element-plus/icons-vue';
import { time2value, value2time} from '../utils/util';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';



const paramUp = ref({chidao: 5,
                daka: 1,
                weidaka: 39,
                zaotui: 1,
                jiaban: 0,
                qingjia:0,
                xinzi:0})

const piechartDom = ref()
const linechartDom = ref()
const pieChart = ref()
const lineChart = ref()

onMounted(() =>{
    piechartDom.value = document.getElementById('pie')!;
    pieChart.value = echarts.init(piechartDom.value);
    linechartDom.value = document.getElementById('line')!;
    lineChart.value = echarts.init(linechartDom.value);
    if(uid === null){
      ElMessage.error('未检测到用户登入，请登入！')
      localStorage.clear();
      router.push('/login');
    }else{
      getDepartmentByUid(uid).then((res) => {
        if (res.status != 200) {
          ElMessage.error("出错了");
          return;
        }
        let data = res.data;
        if (data.code == 1) {
            departmentsOptions.value = data.data.map((_item: any) => {return {departmentid:_item.departmentid,departmentName:_item.departmentName}});
            departments.value = departmentsOptions.value.map((item: any) => item.departmentid)
            usersInDepartments(departments.value).then((res) => {
              let data =  res.data.data;
              employeeOptions.value = data.map((_item: any) => {return {id: _item.id, username: _item.username}});
            updatePage()
        });
            updatePage()
        } else {
          ElMessage.error(data.msg);
        }
      }).catch(_e => {ElMessage.error('网络超时了');});
    }
})

const disabledDate = (time:any) =>{
      return time.getTime() > Date.now(); // 禁止选择未来的日期
}

const departments = ref([])
const departmentsOptions = ref()
const employee = ref()
const employeeOptions = ref()

const date = ref((new Date().getFullYear()).toString() + '-' +( new Date().getMonth()+1).toString())
const uid = localStorage.getItem('ms_userId');
const router = useRouter()


const exportXlsx = () => {
    if(departments.value.length != 1){
        ElMessage.warning('请选择一个团队！');
        return;
    }
    let list = [['姓名', '手机号', '打卡次数', '缺卡次数', '加班次数', '请假次数', '迟到次数', '早退次数', '考勤薪资']];
    exportExcel(departments.value[0], date.value).then(res =>{
        if(res.status != 200){
            ElMessage.error('网络异常！')
            return;
        }
        let data = res.data.data
        data.map((item:any, i:number)=>{
            let arr: any[] = []
            arr.push(...[item.username, item.phone, item.bing.daka, item.bing.weidaka, item.bing.jiaban, item.bing.qingjia, item.bing.chidao, item.bing.zaotui, item.bing.xinzi]);
            list.push(arr);
        });
        let WorkSheet = XLSX.utils.aoa_to_sheet(list);
        let new_workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页');
        XLSX.writeFile(new_workbook, `表格.xlsx`);
    })
    
};



const selectCompany = (v:any) =>{
    if(!v){
      usersInDepartments(departments.value).then((res) => {
            let data =  res.data.data;
            employeeOptions.value = data.map((_item: any) => {return {id: _item.id, username: _item.username}});
            updatePage()
        });
    }
}
const selectUser = () =>{
  updatePage();
}


const onDateChange = (_value:any)=> {
    updatePage();
}
const updatePage = ()=>{
    allDepartmentsClockData(departments.value, employee.value , date.value).then(res => {
        if(res.status != 200){
            ElMessage.error('网络错误')
        }
        let opt1;
        let opt2;
        if(typeof(employee.value) != "undefined" && employee.value != null && employee.value != ''){
          let data = res.data.data;
          paramUp.value = data.bing;
          opt1 = {
              title: {
                  text: '考勤比率图',
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item'
              },
              legend: {
                  orient: 'vertical',
                  left: 'left'
              },
              series: [
                  {
                  name: 'Access From',
                  type: 'pie',
                  radius: '50%',
                  data: [ {value:data.bing.zaotui, name:'早退次数'},{value: data.bing.daka, name:'打卡次数'},
                      {value:data.bing.chidao, name:'迟到次数'},{value:data.bing.weidaka, name:'缺卡次数'}, 
                      {value:data.bing.qingjia, name:'请假次数'}, {value:data.bing.jiaban, name:'加班次数'}],
                  emphasis: {
                      itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
                  }
              ]
          }
         
          opt2 = {
              title: {
                  text: '签到签退时间图'
              },
              tooltip: {
                  trigger: 'axis',
                  valueFormatter: (value:any) => value2time(value)
              },
              legend: {},
              toolbox: {
                  show: true,
                  feature: {
                  dataZoom: {
                      yAxisIndex: 'none'
                  },
                  dataView: { readOnly: true },
                  saveAsImage: {}
                  },

              },
              xAxis: {
                  type: 'category',
                  data: data.zhexiantu.clockin[0]
              },
              yAxis: {
                  type: 'value',
                  axisLabel: {
                      formatter: (value:any)=>value2time(value)
                  }
              },
              series: [
                  {
                  name: '签到时间',
                  type: 'line',
                  data:  data.zhexiantu.clockin[1].map((item: any) => time2value(item)),
                  markPoint: {
                      data: [
                      { type: 'max', name: 'Max' },
                      { type: 'min', name: 'Min' }
                      ],
                      label:{
                        formatter: (params:any) => value2time(params.value)
                      }
                  },
                  markLine: {
                      data: [{name: '上班平均时间' , yAxis:time2value(data.zhexiantu.front)}],
                      label:{
                          formatter:  (params:any) => value2time(params.value)
                      }
                  }
                  },
                  {
                  name: '签退时间',
                  type: 'line',
                  data: data.zhexiantu.clockout[1].map((item: any) => time2value(item)),
                  markPoint: {
                      data: [{ type: 'max', name: 'Max' },{ type: 'min', name: 'Min' }],
                      label:{
                        formatter: (params:any) => value2time(params.value)
                      }
                  },
                  markLine: {
                      data: [{name: '下班平均时间' , yAxis:time2value(data.zhexiantu.end)}],
                      label:{
                          formatter:  (params:any) => value2time(params.value)
                      }
                  }
                  }
              ]
          };
          
        }else{
            let data = res.data.data;
            paramUp.value = data.kapian;
            opt1 = {
                title: {
                    text: '考勤比率图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: [ {value:data.bing.zaotui, name:'早退次数'},{value: data.bing.daka, name:'打卡次数'},
                        {value:data.bing.chidao, name:'迟到次数'},{value:data.bing.weidaka, name:'缺卡次数'}, 
                        {value:data.bing.qingjia, name:'请假次数'}, {value:data.bing.jiaban, name:'加班次数'}],
                    emphasis: {
                        itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                    }
                ]
            }
            let zhexiantu = data.zhexiantu
            const departments = []
            const chidaoRates = []
            const dakaRates = []
            const zaotuiRates = []
            const weidakaRates = []
            for(let k in zhexiantu){
                for(let item of departmentsOptions.value){
                    if(item.departmentid == k){
                        departments.push(item.departmentName)
                        break;
                    }
                }
                chidaoRates.push(zhexiantu[k].chidaoRate)
                dakaRates.push(zhexiantu[k].dakaRate)
                zaotuiRates.push(zhexiantu[k].zaotuiRate)
                weidakaRates.push(zhexiantu[k].weidakaRate)
            }
            
          opt2 = {
              title: {
                  text: '各团队考勤数据'
              },
              tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                    }
              },
              legend: {},
              toolbox: {
                  show: true,
                  feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: true },
                    saveAsImage: {}
                  },
              },
              xAxis: {
                  type: 'category',
                  data: departments
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                {
                    name: '早退率',
                    type: 'bar',
                    data: zaotuiRates,
                    markPoint: {
                        data: [{ type: 'max', name: '最大' },{ type: 'min', name: '最小' }]
                    },
                    markLine: {
                        data: [{name: '平均早退率' , type: 'average'}],
                    }
                },
                {
                    name: '正常打卡率',
                    type: 'bar',
                    data:  dakaRates,
                    markPoint: {
                        data: [
                        { type: 'max', name: '最大' },
                        { type: 'min', name: '最小' }
                        ]
                    },
                    markLine: {
                        data: [{name: '平均打卡率' , type: 'average'}],
                    }
                },
                {
                    name: '迟到率',
                    type: 'bar',
                    data: chidaoRates,
                    markPoint: {
                        data: [{ type: 'max', name: '最大' },{ type: 'min', name: '最小' }]
                    },
                    markLine: {
                        data: [{name: '平均迟到率' , type: 'average'}],
                    }
                },
                 {
                    name: '未打卡率',
                    type: 'bar',
                    data: weidakaRates,
                    markPoint: {
                        data: [{ type: 'max', name: '最大' },
                            { type: 'min', name: '最小' }]
                    },
                    markLine: {
                        data: [{name: '平均未打卡率' , type: 'average'}],
                        
                    }
                },
            ]
          };

        //   opt2 ={
        //         title: {
        //             text: '各团队考勤数据'
        //         },
        //         tooltip: {
        //             trigger: 'axis'
        //         },
        //         legend: {
        //             data: ['早退率', '正常打卡率', '迟到率', '未打卡率']
        //         },
        //         toolbox: {
        //             show: true,
        //             feature: {
        //                 dataView: { show: true, readOnly: false },
        //                 magicType: { show: true, type: ['line', 'bar'] },
        //                 restore: { show: true },
        //                 saveAsImage: { show: true }
        //             }
        //         },
        //         calculable: true,
        //         xAxis: [
        //             {
        //             type: 'category',
        //             // prettier-ignore
        //             data: departments
        //             }
        //         ],
        //         yAxis: [
        //             {
        //             type: 'value'
        //             }
        //         ],
        //         series: [
        //             {
        //             name: '早退率',
        //             type: 'bar',
        //             data: zaotuiRates,
        //             markPoint: {
        //                 data: [
        //                 { type: 'max', name: 'Max' },
        //                 { type: 'min', name: 'Min' }
        //                 ]
        //             },
        //             markLine: {
        //                 data: [{ type: 'average', name: 'Avg' }]
        //             }
        //             },
        //             {
        //             name: '正常打卡率',
        //             type: 'bar',
        //             data: dakaRates,
                    
        //             markLine: {
        //                 data: [{ type: 'average', name: 'Avg' }]
        //             }
        //             },
        //             {
        //             name: '迟到率',
        //             type: 'bar',
        //             data: chidaoRates,
                    
        //             markLine: {
        //                 data: [{ type: 'average', name: 'Avg' }]
        //             }
        //             }
        //             ,
        //             {
        //             name: '未打卡率',
        //             type: 'bar',
        //             data: weidakaRates,
        //             markLine: {
        //                 data: [{ type: 'average', name: 'Avg' }]
        //             }
        //             }
        //         ]
        //     };

        }
        pieChart.value.clear()
        lineChart.value.clear()
       
        pieChart.value.setOption(opt1)
        lineChart.value.setOption(opt2)
    });
   
}


</script>

<style scoped>

.chart {
    height: 100vh;
  }
.el-row {
	margin-bottom: 20px;
}
.card{
    border-radius:10%;
}
.grid-content {
	display: flex;
	align-items: center;
	height: 180px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}
.lighter{
    color:#999
}

.up{
    font-size: large;
    font-weight: bold;
    margin-bottom: 4%;
}
.down{
    font-family: Arial, sans-serif;
    font-size: 2.2rem;
    font-weight:500;
}

.green{
    color: rgb(100, 213, 114);
}
.red{
    color: rgb(242, 94, 67);
}

.blue{
    color: rgb(45, 140, 240);
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

.schart {
	width: 100%;
	height: 300px;
}
</style>
