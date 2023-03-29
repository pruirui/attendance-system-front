<template>
    <div class="container">
        <div class="form-box">

            <el-form ref="formRef" :rules="rules" :model="form" label-width="130px">
                <el-form-item label="公司名" prop="departmentName">
                    <el-input v-model="form.departmentName"></el-input>
                </el-form-item>
                <el-form-item label="公司电话" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="注册资本(万元)" prop="rmb">
                    <el-input v-model="form.rmb"></el-input>
                </el-form-item>
                 <el-form-item label="详细地址" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="注册日期">
                    <el-col :span="12">
                        <el-form-item prop="createTime">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.createTime"
                                style="width: 100%"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                
                <el-form-item label="工作日" prop="workdays">
                    <el-checkbox-group v-model="form.workdays">
                        <el-checkbox label="星期一" name="0"></el-checkbox>
                        <el-checkbox label="星期二" name="1"></el-checkbox>
                        <el-checkbox label="星期三" name="2"></el-checkbox>
                        <el-checkbox label="星期四" name="3"></el-checkbox>
                        <el-checkbox label="星期五" name="4"></el-checkbox>
                        <el-checkbox label="星期六" name="5"></el-checkbox>
                        <el-checkbox label="星期日" name="6"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="上班时间" prop="startTime">
                    <el-col :span="11">
                        <el-form-item prop="startTime">
                            <el-time-picker placeholder="选择时间" v-model="form.startTime" style="width: 100%" format="HH:mm" value-format="HH:mm">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="下班时间" prop="endTime">
                    <el-col :span="11">
                        <el-form-item prop="endTime">
                            <el-time-picker placeholder="选择时间" v-model="form.endTime" style="width: 100%"  format="HH:mm" value-format="HH:mm">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="上班时薪" prop="hourPay">
                    <el-input v-model="form.hourPay"></el-input>
                </el-form-item>
                <el-form-item label="加班时薪" prop="workOverPay">
                    <el-input v-model="form.workOverPay"></el-input>
                </el-form-item>
                <el-form-item label="加班最长时长(h)" prop="workOverLimit">
                    <el-input v-model="form.workOverLimit"></el-input>
                </el-form-item>

                <el-form-item label="公司简介" prop="description">
                    <el-input type="textarea" rows="5" v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(formRef)">提交更新</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts" name="baseform">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { updateDepartConfig, getDepartmentByDepartmentId} from '../api';
import {regions} from '../utils/util'

const rules: FormRules = {
    departmentName: [{ required: true, message: '请输入公司名称', trigger: 'blur' },
        {
            min: 4, max: 15, message: '公司名称不能短于4个字，长于15字', trigger: 'blur'
        }],
    phone: [{ required: true, message: '请输入电话', trigger: 'blur' },
            { 
			pattern:/^0\d{2,3}-[1-9]\d{6,7}$/,
			min: 2, max: 15, 
			message: "电话格式错误", 
			trigger: "blur" ,
		},],
    region: [{ required: true, message: '请选择所在区域', trigger: 'blur' }],
    address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
    rmb: [{ required: true, message: '请输入注册资本', trigger: 'blur' },
            {
                pattern:/^([1-9]\d*)(\.\d+)?$/,
                message: '请输入正确的注册资本', 
                trigger: 'blur'
            }],
    description: [{ required: true, message: '请输入公司简介', trigger: 'blur' }],
    startTime: [{ required: true, message: '请输入上班时间', trigger: 'blur' }],
    endTime: [{ required: true, message: '请输入下班时间', trigger: 'blur' }],
    workdays: [{ required: true, message: '请选择工作日', trigger: 'blur' }],
    workOverLimit: [{ required: true, message: '请输入最长加班时长', trigger: 'blur' },
        {
            pattern:/^([1-9]\d*)(\.\d+)?$/,
            message: '请输入正确的数值', 
            trigger: 'blur'
        }],
    hourPay:[{
            pattern:/^([1-9]\d*)(\.\d+)?$/,
            message: '请输入正确的数值', 
            trigger: 'blur'
        }],
        workOverPay:[{
        pattern:/^([1-9]\d*)(\.\d+)?$/,
        message: '请输入正确的数值', 
        trigger: 'blur'
    }],
};
const formRef = ref<FormInstance>();
const form = reactive({
    departmentid:'',
    departmentName: '',
    HRuid: '',
    description: '',
    hourPay: '',
    workOverPay: '',
    workOverLimit: '',
    startTime: '',
    endTime: '',
    workdays: [],
    phone:'',
    address:'',
    rmb:'',
    region: [],
    createTime: ''
});
const uId = localStorage.getItem("ms_userId");
const departmentId = localStorage.getItem("departmentId");
const router = useRouter()

if(uId === null){
	ElMessage.error('未检测到用户登入，请登入！');
	localStorage.clear();
	router.push('/login')
}
const getData = ()=>{
    if(departmentId===null){
        return;
    }
    getDepartmentByDepartmentId(departmentId).then(res =>{
        console.log(res);
        if (res.status != 200) {
            ElMessage.error("出错了");
            return;
        }
        let data = res.data.data;
        form.departmentid = data.departmentid
        form.departmentName = data.departmentName
        form.HRuid = data.HRuid
        form.description = data.description
        form.hourPay = data.hourPay
        form.workOverPay = data.workOverPay
        form.workOverLimit = data.workOverLimit
        form.startTime = data.startTime
        form.endTime = data.endTime
        form.workdays = data.workdays
        form.phone = data.phone
        form.address = data.address
        form.rmb = data.rmb
        let length = data.rmb.length
        form.rmb = data.rmb.substr(0, length-1)
        form.createTime = data.createTime
        console.log(form)
    })
}
getData()

// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            if(uId === null){
                return false;
            }
            form.HRuid = uId;
            form.address = form.region.join('') +  form.address;

            updateDepartConfig(form.departmentid, form.departmentName, form.HRuid, form.description, 
                form.hourPay, form.workOverPay, form.workOverLimit, form.startTime,
                form.endTime, form.workdays,form.phone, form.address, form.rmb, form.createTime).then((res) => {
                if (res.status != 200) {
                    ElMessage.error("出错了");
                    return;
                }
                let data = res.data;
                if (data.code == 1) {
                    ElMessage.success(data.msg);
                    getData();
                } else {
                    ElMessage.error(data.msg);
                }
            }).catch((e)=>{ElMessage.error("网路超时！");})
        } else {
            return false;
        }
    });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>
