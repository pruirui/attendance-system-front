<template>
	<div>
       
        <div style="margin-top: 0.5%;">

        </div>
        <el-date-picker
            v-model="date"
            :default-value="date"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            format="YYYY-MM"
            style="margin-bottom:1%"
            :disabled-date="disabledDate"
            @change="onDateChange"
        />
		<el-row gutter="20" >
            <el-col :span="6">
                <el-card shadow="always" class="card">
                    <div class="grid-content grid-con-1">
                        <div class="grid-cont-right">
                            <div class="up">
                                <span class="green">打卡次数</span>
                                <span class="lighter">&nbsp;/&nbsp;</span>
                                <span class="red">缺卡次数</span></div>
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
                                <span class="green">加班次数</span>
                                <span class="lighter">&nbsp;/&nbsp;</span>
                                <span class="red">请假次数</span></div>
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
                                <span class="red">迟到次数</span>
                                <span class="lighter">&nbsp;/&nbsp;</span>
                                <span class="red">早退次数</span></div>
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
                        <div id="pie" style="height:500px; width:100%"></div>
                    </div>
				</el-card>
			</el-col>
			<el-col :span="15">
				<el-card shadow="hover">
                    <div class="echarts-box">
                        <div id="line" style="height:500px; width:100%"></div>
                    </div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart';
import { onMounted, provide, reactive, ref } from 'vue';
import {userClockInfo} from '../api/index'
import imgurl from '../assets/img/img.jpg';
import * as echarts from "echarts";
import { ElMessage } from 'element-plus';
import { PieChart } from '@element-plus/icons-vue';
import { time2value, value2time } from '../utils/util';

const name = localStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';

const params = reactive({
    "code": 1,
    "data": {
        "bing": {
            "chidao": 5,
            "daka": 1,
            "weidaka": 39,
            "zaotui": 1,
             jiaban: 0,
             qingjia:0,
             xinzi:0
        },
        "zhexiantu": {
            "clockin": [
                [
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                    "16",
                    "17",
                    "18",
                    "19",
                    "23",
                    "13",
                    "14",
                    "15",
                    "20",
                    "21",
                    "22"
                ],
                [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    "20:22:40",
                    "15:12:16",
                    "10:40:54",
                    "15:38:50",
                    "11:44:48",
                    "09:15:04"
                ]
            ],
            "clockout": [
                [
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "19",
                    "20",
                    "21",
                    "22",
                    "23",
                    "13"
                ],
                [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    "21:15:20"
                ]
            ],
            "end": "23:00:00",
            "front": "10:00:00"
        }
    }
});


const option1 = {
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
      data: [{value: 100, name:'打卡次数'}, {value:100, name:'缺卡次数'}, 
            {value:100, name:'加班次数'},{value:100, name:'请假次数'},
            {value:100, name:'迟到次数'},{value:100, name:'早退次数'}],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};


const option2 = {
  title: {
    text: '签到签退时间图'
  },
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value:any) => {
     let h = String(Math.floor(value/60));
        let m = String(value % 60);
        return h+":"+m
   }
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      dataView: { readOnly: false },
      magicType: { type: ['line', 'bar'] },
      restore: {},
      saveAsImage: {}
    },

  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
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
      data: [],
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
        data: [{name: '上班平均时间' , yAxis:450}],
        label:{
            formatter:  (params:any) => value2time(params.value)
        }
      }
    },
    {
      name: '签退时间',
      type: 'line',
      data: [],
      markPoint: {
        data: [{ type: 'max', name: 'Max' },{ type: 'min', name: 'Min' }]
      },
      markLine: {
        data: [{name: '下班平均时间' , yAxis:900}],
        label:{
            formatter:  (params:any) => value2time(params.value)
        }
      }
    }
  ]
};
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
    pieChart.value.setOption(option1)
    lineChart.value.setOption(option2)
    updatePage()
})
const disabledDate = (time:any) =>{
      return time.getTime() > Date.now(); // 禁止选择未来的日期
}

const date = ref((new Date().getFullYear()).toString() + '-' +( new Date().getMonth()+1).toString())
const uid = localStorage.getItem('ms_userId');

const onDateChange = (value:any)=> {
    updatePage();
}
const updatePage = ()=>{
    userClockInfo(date.value.split('-')[0], date.value.split('-')[1], uid).then(res => {
        if(res.status != 200){
            ElMessage.error('网络错误')
        }
        let data = res.data.data;
        console.log(data)
        paramUp.value = data.bing;
        let opt1 = {
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
        pieChart.value.setOption(opt1)
        let opt2 = {
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
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
                },

            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
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
                    data: [{ type: 'max', name: 'Max' },{ type: 'min', name: 'Min' }]
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
        console.log(opt2)
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
