<template>
	
	<div class="login-wrap">
		<!-- <div class="ms-quickLogin">
			<div class="quickLogin-btn">
				<el-button type="primary" size="large" round=true @click="quickLogin">快速登录</el-button>
			</div>
		</div> -->
		<div class="ms-login">
			<div class="ms-title">智慧考勤系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<!-- model表单数据对象；rules表单验证规则；-->
				<el-form-item prop="phone">
					<el-input v-model="param.phone" placeholder="请输入账号">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				
				<el-form-item prop="password">
					<el-input
						type="password"
						placeholder="请输入密码"
						v-model="param.password"
						@keyup.enter="submitForm(login)"
					>
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">登录</el-button>
				</div>
				<div class="register-btn">
					<el-button type="primary" @click="registerUser">注册</el-button>
				</div>
				<p class="login-tips">Tips : 请输入你的账号和密码。</p>
				
				<el-button type= "primary" text @click="quickLogin = true">快速登录</el-button>
				<el-dialog v-model="quickLogin" title="快速打卡登录" width="1000px" align-center destroy-on-close>
					<div class="login-cav">
						<camera v-if="quickLogin" :quickLogin="quickLogin" @changequickLogin="getLoginUserData"></camera>
					</div>
						
						<template #footer>
						    <span class="dialog-footer">
						        <el-button @click="quickLogin = false">Cancel</el-button>
						        <el-button type="primary" @click="quickLogin = false">
									Confirm
						        </el-button>
						    </span>
						</template>
					
					
				</el-dialog>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { Login } from '../api/index'
import camera from './camera.vue'
interface LoginInfo {
	phone: string;
	password: string;
};

const router = useRouter();
const param = reactive<LoginInfo>({
	phone: '',
	password: ''
});

const rules: FormRules = {
	phone: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	password: [
		{ 
			required: true, 
			message: '请输入密码',
			trigger: 'blur' ,
		},
	]
};

const permiss = usePermissStore();//权限管理
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			if(param.phone === 'test'){
				localStorage.setItem('ms_userId', '0')
				localStorage.setItem('ms_username', 'test');
				const keys = permiss.defaultList['test'];
					permiss.handleSet(keys);
					localStorage.setItem('ms_keys', JSON.stringify(keys));
					router.push('/');
				return;
			}
			//验证通过，请求登录
			Login(param).then(res =>{
				
				if(res.data["code"] === 1){
					ElMessage.success('登录成功');
					//console.log(typeof(res.data["data"]));
					let tmp = res.data["data"];
					delete tmp.password;
					localStorage.setItem('ms_userId', res.data["data"]['id'])
					localStorage.setItem('ms_username', res.data["data"]["username"]);
					localStorage.setItem("ms_userInfo", JSON.stringify(tmp));
					// localStorage.setItem('ms_phone', res.data["data"]["phone"]);
					// localStorage.setItem('ms_motto', res.data["data"]["motto"]);
					// localStorage.setItem('ms_id', res.data["data"]["id"]);
					// localStorage.setItem('ms_home', res.data["data"]["home"]);
					// localStorage.setItem('ms_headshot', res.data["data"]["headshot"]);
					// localStorage.setItem('ms_gender', res.data["data"]["gender"]);
					// localStorage.setItem('ms_email', res.data["data"]["email"]);
					// localStorage.setItem('ms_birthday', res.data["data"]["birthday"]);
					// localStorage.setItem('ms_address', res.data["data"]["address"]);
					// localStorage.setItem('ms_role', res.data["data"]["role"]);
					const keys = permiss.defaultList[res.data["data"]["role"]];
					permiss.handleSet(keys);
					localStorage.setItem('ms_keys', JSON.stringify(keys));
					router.push('/');
				}
				else{
					//console.log(res.data);
					ElMessage.error(res.data["msg"]);
					param.phone='';
					param.password='';
					//router.push("/login");
					return false;
				}
			});
			
		} else {
			ElMessage.error('登录失败');
			return false;
		}
	});
};


const registerUser = () => {
	router.push('/register');
};

const quickLogin = ref(false);

const getLoginUserData = (res :any) => {
	quickLogin.value = false;
	let tmp = res.data["data"];
	delete tmp.password;
	localStorage.setItem('ms_userId', res.data["data"]['id'])
	localStorage.setItem('ms_username', res.data["data"]["username"]);
	localStorage.setItem("ms_userInfo", JSON.stringify(tmp));
	const keys = permiss.defaultList[res.data["data"]["role"]];
	permiss.handleSet(keys);
	localStorage.setItem('ms_keys', JSON.stringify(keys));
	router.push('/');
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.el-dialog-div{
	height: 700px;
}
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/login-bg.jpg);
	background-size: 100%;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #010414;
	border-bottom: 1px solid #ddd;
}
.ms-login {
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
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.register-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
.login-cav{
	
	height: 340px;
	width: 1000px;
}

.quciklogin-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
.dialog-footer button:first-child {

	margin-right: 10px;
}

</style>
