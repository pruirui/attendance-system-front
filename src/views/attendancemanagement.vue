<template>
  <div>
    <div>
      <span class="demonstration">公司</span>
      <el-select v-model="department" placeholder="请选择公司" style="margin-right: 10px" class="box-select">
        <el-option
            v-for="item in departmentOptions"
            :key="item.department_id"
            :label="item.department_name"
            :value="item.department_id">
          <!--       label:下拉框展示的内容，对应元素的名字  -->
          <!--       value：传递到后台的值，对应元素的值-->
        </el-option>
      </el-select>

      <el-button type="primary"
                 class="el-button"
                 @click="checkDepartment()"
                 style="margin-right: 30px">确定</el-button>

      <span class="demonstration">员工</span>
      <el-select v-model="employee" placeholder="请选择员工" style="margin-right: 10px" class="box-select">
        <el-option
            v-for="item in employeeOptions"
            :key="item.employee_id"
            :label="item.employee_name"
            :value="item.employee_id">
        </el-option>
      </el-select>

      <el-button type="primary"
                 class="el-button"
                 @click="checkEmployee()"
                 style="margin-right: 30px">确定</el-button>

    </div>
    <br>
    <div>
      <span class="demonstration">查看</span>
      <el-select v-model="selectedDate" placeholder="请选择查看方式" @change="changeDateSelect">
        <el-option label="日" value="1"></el-option>
        <el-option label="周" value="2"></el-option>
        <el-option label="月" value="3"></el-option>
        <el-option label="年" value="4"></el-option>
      </el-select>

      <el-date-picker
          v-if="selectedDate === '1'"
          v-model="selectedDay"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          type="date"
          :picker-options="dayDateOption"
          placeholder="选择日"
          @change="changeDay">
      </el-date-picker>

      <el-date-picker
          v-if="selectedDate === '2'"
          v-model="selectedWeek"
          format="yyyy 第 WW 周"
          value-format="yyyy 第 WW 周"
          type="week"
          :picker-options="weekDateOption"
          placeholder="选择周"
          @change="changeWeek">
      </el-date-picker>

      <el-date-picker
          v-if="selectedDate === '3'"
          v-model="selectedMonth"
          format="YYYY-MM"
          value-format="YYYY-MM"
          type="month"
          :picker-options="monthDateOption"
          placeholder="选择月"
          @change="changeMonth">
      </el-date-picker>

      <el-date-picker
          v-if="selectedDate === '4'"
          v-model="selectedYear"
          format="YYYY"
          value-format="YYYY"
          type="year"
          :picker-options="yearDateOption"
          placeholder="选择年"
          @change="changeYear">
      </el-date-picker>

      <el-button type="primary" class="loadDate" @click="loadDate">确定</el-button>

    </div>












  </div>
</template>


<script>
// import axios from "axios"
// import VueAxios from 'vue-axios'
// Vue.use(VueAxios, axios)

//import {GetCompany, GetEmployee} from "../api/index";
import * as moment from 'moment'

export default {
  name:"Attendancemanagement",
  data:function() {
    return {
      department: '',
      employee:'',
      // departmentOptions:[{
      //   department_id:'',
      //   department_name:'',
      // }],
      departmentOptions: [{
        department_id: '001',
        department_name: '请选择'
      }, {
        department_id: '002',
        department_name: '所有部门'
      }, {
        department_id: '003',
        department_name: '天猫'
      }, {
        department_id: '004',
        department_name: '京东'
      }, {
        department_id: '005',
        department_name: '腾讯'
      }],

      // employeeOptions:[{
      //   employee_id:'',
      //   employee_name:'',
      // }],
      employeeOptions: [{
        employee_id: 'E001',
        employee_name: '请选择'
      }, {
        employee_id: 'E002',
        employee_name: '黄蓉'
      }, {
        employee_id: 'E003',
        employee_name: '张无忌'
      }, {
        employee_id: 'E004',
        employee_name: '欧阳锋'
      }, {
        employee_id: 'E005',
        employee_name: '张三丰'
      }],

      selectedDate:'',
      selectedDay:'',
      selectedWeek:'',
      selectedMonth:'',
      selectedYear:'',



    }
  },
  created() {  //页面加载时调用
    this.loadAllDepartmets(); // 加载部门下拉菜单所需数据
    // datatimestatus()
    // {
    //   this.pickerOptions.disabledDate = (time) => {
    //     // 一天
    //     let tempTime = 3600 * 1000 * 24
    //     return time.getTime() < new Date() - tempTime
    //   },


    },

  methods: {
    // 加载部门下拉菜单所需数据
    loadAllDepartmets(){
      this.departmentOptions=[];
      let userId = localStorage.getItem('ms_userId');
      console.log(userId)
      GetCompany(userId).then((res) =>{
          console.log(res);
          for(let item of res.data.data){
              this.departmentOptions.push({department_id: item.departmentid, department_name: item.departmentName})
          } //名称要与后端相同
      })
    },

    // 加载员工下拉菜单所需数据
    loadAllEployees(){
      this.employeeOptions = [];
      // let userId = localStorage.getItem('ms_userId');
      let d_id = this.department;
      console.log(d_id); //打印第一个下拉框的公司id
      // GetEmployee(d_id).then((res) => {
      //   console.log(res);
      //   for (let items of res.data.data){
      //     this.employeeOptions.push({employee_id: items.id, employee_name: items.name})
      //   }  //用户名和用户id,根据后端改名
      // })
    },

    //向后端传送公司id
    checkDepartment(){
      let d_id = this.department;  //如果选择所有公司，公司id？前/后端判断？
      console.log(d_id);
      submitCompany(d_id).then((res) => {  //submitCompany？？？
        console.log(res);
        if (res.data.code == 200){
          this.$message.success(res.data.msg);
          this.loadAllEployees();  //调用加载公司员工接口
        }else{
          this.$message.error(res.data.msg);
        }
      })
    },

    // 加载员工考勤信息页面
    checkEmployee(){
      let e_id = this.employee;
      console.log(e_id);
      submitEmployee(e_id).then((res) => {
        console.log(res);
        if (res.data.code == 200){
          this.$message.success(res.data.msg);
          this.$router.push({  //push？？
            path: '/attendance',  //跳转到个人考勤信息页面
            query: {
              id: e_id,
            }
          })
        }else {
          this.$message.error(res.data.msg);
        }
      })
    },



    // dateGet(){
    //   // 默认昨日所在的日
    //   this.day = moment().subtract(1, 'days').format('YYYY-MM-DD');
    //   // 直接计算具体的年,周
    //   this.week = moment(this.day).format('YYYY') + ' 第 ' + Number(moment(this.day).format('WW')) + ' 周';
    //   // 借用element自带周组件回显
    //   this.selectedWeek = moment(this.day).format('yyyy-MM-DD');
    //   this.month = moment(this.day).format('YYYY') + '-' + Number(moment(this.day).format('MM'));
    //   this.selectedMonth = moment(this.day).format('MM')
    //   this.selectedYear = moment(this.day).format('yyyy');
    // },


    // cascadeChange(){
    //   this.options2 = {
    //
    //   }
    // }

    },
  mounted() {
  }


}
</script>

<style scoped>

.box-select .el-input__inner{
  width: 200px;
  height:50px;
  /*color: red;*/
}
.loadAllDepartmets{
  height:50px;
}
.loadAllEployees{
  height:50px;
}



</style>