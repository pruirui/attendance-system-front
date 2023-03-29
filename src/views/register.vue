<template>
	<div class="register-wrap">
		<div class="ms-register">
			<div class="ms-title">智慧考勤系统</div>
			<el-form :model="param" :rules="rules" ref="register" label-width="0px" class="ms-content">
				<!-- model表单数据对象；rules表单验证规则；-->
				
				<el-form-item prop="username">
					<el-input v-model="param.username" placeholder="请输入用户名">
						<template #prepend>
							<el-icon><User /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				
				<el-form-item prop="phone">
					<el-input v-model="param.phone" placeholder="请输入电话号码">
						<template #prepend>
							<el-icon><Iphone /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				
				<el-form-item prop="password">
					<el-input
						type="password"
						placeholder="请输入密码"
						v-model="param.password"
					>
						<template #prepend>
							<el-icon><Lock /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				
				<el-form-item prop="passwd">
					<el-input
						type="password"
						placeholder="请再次输入密码"
						v-model="param.passwd"
						@keyup.enter="submitForm(register)"
					>
						<template #prepend>
							<el-icon><Lock /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				
				<div class="register-btn">
					<el-button type="primary" @click="submitForm(register)">注册</el-button>
				</div>
				<li class="register-tips">
					<router-link to="/login" style="color: black;">返回首页</router-link>
				</li>
				<!-- <p class="register-tips">Tips : 请输入你的账号和密码。</p> -->
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
//import { useTagsStore } from '../store/tags';
//import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { FormInstance, FormRules } from 'element-plus';
import { Register } from '../api/index'

interface RegisterInfo {
	username: string;
	phone: string;
	password: string;
	passwd: string;
}

const param = reactive<RegisterInfo>({
	username: '',
	phone: '',
	password: '',
	passwd: '',
});

const rules: FormRules = {
	username: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		},
		{ 	//用户名正则，6到12位（字母，数字，下划线，减号）
			pattern:/^[\u4e00-\u9fa5a-zA-Z0-9]{1,8}$/,

			min: 1, max: 8,
			transform(value){return value.trim()}, 
			message: "请输入1到8位中文、字母、数字的组合", 
			trigger: "blur" ,
		},
	],
	phone: [
		{
			required: true,
			message: '请输入电话号码',
			trigger: 'blur'
		},
		{ 
			pattern:/^1[3|4|5|8|9|7]{1}[0-9]{9}$/,
			min: 2, max: 15, 
			message: "手机格式错误", 
			trigger: "blur" ,
		},
	],
	password: [
		{ 
			required: true, 
			message: '请输入密码',
			trigger: 'blur' ,
		},
	],
	passwd: [
		{ 
			required: true, 
			validator: (rule, value, callback) => {
				if(value !== param.password){
					callback(new Error("密码不一致，请重新输入！"));
				}
				else{
					callback();
				}
			},
			//message: '请再次输入密码',
			trigger: 'blur' ,
		},
	]
};

const router = useRouter();
const register = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl){
		//console.log("null");
		 return;
	}
	
	console.log("-----");
	formEl.validate((valid: boolean) => {
		console.log("-------------");
		if (valid) {
			
			//localStorage.setItem('ms_username', param.phone);
			//const keys = permiss.defaultList[param.phone == 'admin' ? 'admin' : 'user'];
			//permiss.handleSet(keys);
			//localStorage.setItem('ms_keys', JSON.stringify(keys));
			Register({"username":param.username,"phone":param.phone,"password":param.password}).then((res) =>{
				if(res.data["code"] === -1){
					ElMessage.error(res.data["msg"]);
				}
				else{
					ElMessage.success('注册成功');
					router.push('/login');
				}
			});
			
		} else {
			ElMessage.error('注册失败');
			return false;
		}
	});
}

</script>


//css
<style scoped>
.register-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/17.jpg);
	background-size: 100%;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #f00;
	border-bottom: 1px solid #ddd;
}
.ms-register {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.register-btn {
	text-align: center;
}
.register-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.register-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.register-tips {
	font-size: 12px;
	line-height: 30px;
	color: #ffff00;
}
</style>



