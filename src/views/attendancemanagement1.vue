<template>
    <div>
  
      <div class="location1">
        <span class="demonstration">公司</span>
        <el-select v-model="selectedCompany" placeholder="请选择公司" class="box-select" @change="backId(selectedCompany)">
          <el-option
              v-for="item in companyOptions"
              :key="item.company_id"
              :label="item.company_name"
              :value="item.company_id">
          </el-option>
        </el-select>
  
        <span class="demonstration">员工</span>
        <el-select v-model="selectedEmployee" placeholder="请选择员工" class="box-select"
                   @focus="loadEmployee"
                   @change="employeeId(selectedEmployee)">
          <el-option
              v-for="item in employeeOptions"
              :key="item.employee_id"
              :label="item.employee_name"
              :value="item.employee_id">
          </el-option>
        </el-select>
  
        <span class="demonstration">时间</span>
        <el-date-picker
            v-model="selectedTime"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="To"
            start-placeholder="请选择起始时间"
            end-placeholder="请选择结束时间"
            size="large"
            :disabled-date="disabledDate"
            @change="backDate(selectedTime)"
        />
  
        <el-button type="primary" class="el-button" @click="checkSelect">确定</el-button>
      </div>
  
  
    </div>
  </template>
  
  <script setup lang="ts" name="attendancemanagement">
  import { reactive, ref } from 'vue';
  import {ElMessage, FormInstance, FormRules} from 'element-plus';
  import moment from 'moment';
  import {GetCompany, GetEmployee} from "../api/index";
  import {start} from "repl";
  
  const uId = localStorage.getItem("ms_userId");
  const selectedCompany = ref('');
  const selectedEmployee = ref('');
  const companyOptions = ref();
  const companyID = ref('');
  const employeeOptions = ref();
  const employeeID = ref('');
  const selectedTime = ref('');
  const backTime = ref();
  
  const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
  }
  
  const shortcuts = [
    {
      text: 'Last week',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: 'Last month',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      },
    },
    {
      text: 'Last 3 months',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
  ]
  
  function loadCompany(){
    if (uId === null) {
      return;
    }
    GetCompany(uId).then((res)=>{
      // console.log(res);
      let data =  res.data.data;
      let tmp = [];
      for(let item of data){
        tmp.push({'company_id':item['departmentid'], 'company_name':item['departmentName']});
      }
      companyOptions.value = tmp;
      // console.log('--------');
      // console.log(tmp);
    });
  };
  loadCompany();
  
  const backId = (val:any) => {
    companyID.value = val;
    // alert(companyID.value);
  }
  
  const loadEmployee = () => {
    GetEmployee(companyID.value, 1, 10000, '').then((res) => {
      console.log(res);
      let data =  res.data.data;
      let tmp = [];
      for(let item of data){
        tmp.push({'employee_id':item['id'], 'employee_name':item['username']});
      }
      employeeOptions.value = tmp;
    });
  }
  
  const employeeId = (val:any) => {
    employeeID.value = val;
    // alert(employeeID.value);
  }
  
  const backDate = (val:any) => {
    backTime.value = val;
    alert(backTime.value);
  }
  
  //日期相关模块
  // const changeDay = (val:any) => {
  //   dayTime.value = val;
  //   // alert(dayTime.value);
  // }
  //
  // // function setDate(choosedMonthLastDay) {
  // //   let setdate =
  // //       choosedMonthLastDay.getFullYear() +
  // //       '-' +
  // //       (choosedMonthLastDay.getMonth() + 1) +
  // //       '-' +
  // //       choosedMonthLastDay.getDate() +
  // //       ' ' +
  // //       choosedMonthLastDay.getHours() +
  // //       ':' +
  // //       choosedMonthLastDay.getMinutes() +
  // //       ':' +
  // //       choosedMonthLastDay.getSeconds();
  // //   let resdate = moment(setdate, 'YYYY/MM/DD HH:mm:ss');//转换自己想要的日期格式
  // //   return resdate;
  // // };
  // const changeMonth = (val:any) => {
  //   monthTime.value = val;
  //   // let y = monthTime.value.split(' ')[0].split('-')[0];
  //   let m = monthTime.value.split(' ')[0].split('-')[1];
  //   // let startTime = new Date( parseInt(y),  parseInt(m), 0);
  //   alert(m);
  // }
  
  </script>
  
  <style scoped>
  .location1{
    margin-top: 20px;
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
  }
  
  .demonstration{
    margin-left: 20px;
    margin-right: 20px;
  }
  
  .box-select .el-input__inner{
    width: 150px;
    height:40px;
    margin-right: 20px;
    /*color: red;*/
  }
  
  .el-button{
    height:40px;
    width: 100px;
    margin-left: 20px;
    margin-right: 20px;
  }
  
  
  </style>