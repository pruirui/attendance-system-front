<template>
	<div>
		<el-row :gutter="20">

			<el-col :span="12">
				<el-card shadow="hover" class="el-card">
					<template #header>
						<div class="clearfix">
							<span>基础信息</span>
						</div>
					</template>

					<div class="info">
						<div class="info-image" @click="showDialog">
							<el-avatar :size="100" :src="avatarImg" />
							<span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
						</div>
						<div class="info-name">{{ name }}</div>
						<div class="info-motto">{{ userForm.motto }}</div>
					</div>


          <el-descriptions title="" class="el-descriptions">
            <el-descriptions-item label="性别" v-model="userForm.gender">{{userForm.gender}}</el-descriptions-item>
            <el-descriptions-item label="手机号" v-model="userForm.phone">{{userForm.phone}}</el-descriptions-item>
            <el-descriptions-item label="籍贯" v-model="userForm.hometown">{{userForm.hometown}}</el-descriptions-item>
            <el-descriptions-item label="生日" v-model="userForm.birthday" value-format="YYYY-MM-DD">{{userForm.birthday}}</el-descriptions-item>
            <el-descriptions-item label="E-mail" v-model="userForm.e_mail">{{userForm.e_mail}}</el-descriptions-item>
            <el-descriptions-item label="地址" v-model="userForm.address">{{userForm.address}}</el-descriptions-item>
          </el-descriptions>
				</el-card>
			</el-col>

			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>账户编辑</span>
						</div>
					</template>
					<el-form :model="passwordForm" :rules="rules" ref="passwordPolish" label-width="100px">
						<el-form-item label="用户名："  prop="oldname"> 
					        <el-input v-model="passwordForm.oldname"></el-input> 
					    </el-form-item>
						<el-form-item label="旧密码：">
							<el-input type="password" v-model="passwordForm.oldpswd" show-password></el-input>
						</el-form-item>
						<el-form-item label="新密码：" prop="newpswd">
							<el-input type="password" v-model="passwordForm.newpswd" placeholder="请输入新密码" show-password></el-input>
						</el-form-item>
						<el-form-item prop="newsecpswd" label="二次密码：">
						  <el-input type="password" v-model="passwordForm.newsecpswd" placeholder="请再次输入新密码"
									@keyup.enter="onSubmit(passwordPolish)" show-password></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit(passwordPolish)">保存</el-button>
						</el-form-item>
					            
					            <el-form label-width="100px">
					              <el-form-item label="性别：">
					                <el-input v-model="genderr"></el-input>
					              </el-form-item>
					              <el-form-item label="籍贯：">
					                <el-input v-model="home"></el-input>
					              </el-form-item>
					              <el-form-item label="生日：">
					                <el-date-picker v-model="birth" type="date" value-format="YYYY-MM-DD" placeholder="选择日期">
					                </el-date-picker>
					              </el-form-item>
					              <el-form-item label="E-mail：">
					                <el-input v-model="e_maill"></el-input>
					              </el-form-item>
					              <el-form-item label="地址：">
					                <el-input v-model="addr"></el-input>
					              </el-form-item>
					              <el-form-item label="个性签名：">
					                <el-input v-model="mottoo"></el-input>
					              </el-form-item>
					              <el-form-item>
					                <el-button type="primary" @click="onSubmit2">保存</el-button>
					                <el-button type="primary" @click="clearInputs">重置</el-button>
					              </el-form-item>
					            </el-form>
					
					</el-form>
				</el-card>
			</el-col>
		</el-row>

		<el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
			<vue-cropper
				ref="cropper"
				:src="imgSrc"
				:ready="cropImage"
				:zoom="cropImage"
				:cropmove="cropImage"
				style="width: 100%; height: 400px"
			></vue-cropper>

			<template #footer>
				<span class="dialog-footer">
					<el-button class="crop-demo-btn" type="primary"
						>选择图片
						<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
					</el-button>

					<el-button type="primary" @click="saveAvatar">上传并保存</el-button>
				</span>
			</template>
		</el-dialog>


	</div>
</template>

<script setup lang="ts" name="user">
import { reactive, ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import avatar from '../assets/img/unknow.png';
import {ElMessage, FormInstance, FormRules} from 'element-plus';
import {getUserInfo, infoPolish, PasswordPolish, avatarPolish} from '../api/index'
import {base64toFile} from '../utils/util'
import { useUserMessage } from '../store/user';
import path from '../api/path';

const name = localStorage.getItem('ms_username');
const userId = localStorage.getItem('ms_userId');
//密码表单
interface passwordInfo {
	oldname: String,
  oldpswd : string;
  newpswd :string
  newsecpswd : string
}
const passwordForm = reactive<passwordInfo>({
	oldname: name?name:'',
  oldpswd: '',
  newpswd: '',
  newsecpswd:'',
});
const rules: FormRules = {
  name: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
  newpswd: [
		{ 
			required: true, 
			message: '请输入密码',
			trigger: 'blur' ,
		},
	],
  newsecpswd: [
    {
      required: true,
      validator: (rule, value, callback) => {
        value = passwordForm.newsecpswd;
        // console.log(value);
        // console.log(passwordForm.newpswd);
        if(value !== passwordForm.newpswd){
          callback(new Error("两次输入密码不一致，请重新输入！"));
        }
        else{
          callback();
        }
      },
      trigger: 'blur' ,
    },
  ]
};

//用户信息表单
const userForm = reactive({
  phone:'',
  address:'',
  birthday:'',
  hometown:'',
  e_mail:'',
  motto:'',
  gender:'',
});

const addr = ref('');
const birth = ref('');
const home = ref('');
const e_maill = ref('');
const mottoo = ref('');
const genderr = ref('');
const avatarImg = ref(avatar); //后端传来头像


function loadInfo() {
  if (userId === null) {
    return;
  }
  getUserInfo(userId).then((res)=> {
    userForm.address = res.data.data.address;
    userForm.birthday = res.data.data.birthday;
    userForm.hometown = res.data.data.home;
    userForm.e_mail = res.data.data.email;
    userForm.motto = res.data.data.motto;
    userForm.gender = res.data.data.gender;
    userForm.phone = res.data.data.phone;
    passwordForm.oldpswd = res.data.data.password;
    addr.value = userForm.address;
    birth.value = userForm.birthday;
    home.value = userForm.hometown;
    e_maill.value = userForm.e_mail;
    mottoo.value = userForm.motto;
    genderr.value = userForm.gender;
    avatarImg.value = path.baseUrl + res.data.data.headshot;
  });
};
loadInfo()

const passwordPolish = ref<FormInstance>();
const onSubmit = (pswdform: FormInstance | undefined) => {
  if (!pswdform){
    return;
  }
  pswdform.validate((valid: boolean) => {
    if (valid) {
      passwordForm.oldpswd = passwordForm.newpswd;
      if (userId === null){
        return
      }
      PasswordPolish(userId, passwordForm.oldpswd).then((res)=>{
        if (res.status != 200) {
          ElMessage.error("修改出错了");
          return;
        }
        let data = res.data;
        let u = useUserMessage();
        u.fresh();
        if (data.code == 1) {
          ElMessage.success("修改密码成功！");
          passwordForm.newpswd = '';
          passwordForm.newsecpswd = '';
        }else {
          ElMessage.error('修改密码失败');
        }
      });
    }else {
      ElMessage.error('修改密码失败');
      return false;
    }
  });
};

const onSubmit2 = () => {
  if (userId === null){
    return
  }
  if (name === null){
    return
  }
  infoPolish(userId, name, passwordForm.oldpswd, userForm.phone, addr.value, birth.value,
      mottoo.value, genderr.value, home.value, e_maill.value).then((res) =>{
    if (res.status != 200) {
      ElMessage.error("修改出错了");
      return;
    }
    let u = useUserMessage();
    u.fresh();
    
    let data = res.data;
    if (data.code == 1) {
      ElMessage.success("修改成功！");
      loadInfo();
    }else {
      ElMessage.error("修改失败！")
    }
  });
};

//重置表单数据
const clearInputs = () => {
  addr.value = userForm.address;
  birth.value = userForm.birthday;
  home.value = userForm.hometown;
  e_maill.value = userForm.e_mail;
  mottoo.value = userForm.motto;
  genderr.value = userForm.gender;
};

const imgSrc = ref('');  //本地图片
const cropImg = ref(''); //裁剪后图片（base64）
const dialogVisible = ref(false);  //是否弹框
const cropper: any = ref();


const showDialog = () => {
	dialogVisible.value = true;
	imgSrc.value = avatarImg.value;  //本地图片地址赋给imgSrc
};

const setImage = (e: any) => {  //选择、读取图片
	const file = e.target.files[0];
	if (!file.type.includes('image/')) {
		alert('请传入图像！');
        return false;
	}
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("上传头像图片大小不能超过 2MB!");
    return;
  }
  const reader = new FileReader();  //使用 FileReader 读取文件

  //读取文件,会触发 onload 异步事件,可使用回调函数 来获取最终的值.
	reader.onload = (event: any) => {
		let data;
		if(typeof event.target.result === 'object'){
			 // 把Array Buffer转化为blob 如果是base64不需要
			imgSrc.value = window.URL.createObjectURL(new Blob([e.target.result]))
		}else{
			imgSrc.value = event.target.result;
		}
	
		cropper.value && cropper.value.replace(event.target.result);
	};
	// 转化为base64
    // reader.readAsDataURL(file)
    // 转化为blob
    //reader.readAsArrayBuffer(file);
	reader.readAsDataURL(file);
};

const cropImage = () => {
	cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
	avatarImg.value = cropImg.value;

  let imgData = base64toFile(cropImg.value, "demo.jpg");
  if (userId === null){
    return;
  }
  avatarPolish(userId, imgData).then((res) => {
      let data = res.data;
      let u = useUserMessage();
      u.fresh();
      if (data.code == 1){
        ElMessage.success('用户头像修改成功！');
      }else {
        ElMessage.error('用户头像修改失败！');
      }
  })
  dialogVisible.value = false;
}



</script>

<style scoped>
.info {
	text-align: center;
	padding: 35px 0;
}
.info-image {
	position: relative;
	margin: auto;
	width: 100px;
	height: 100px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}

.info-edit {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.3s ease;
}
.info-edit i {
	color: #eee;
	font-size: 25px;
}
.info-image:hover .info-edit {
	opacity: 1;
}
.info-name {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}
.crop-demo-btn {
	position: relative;
}
.crop-input {
	position: absolute;
	width: 100px;
	height: 40px;
	left: 0;
	top: 0;
	opacity: 0;
	cursor: pointer;
}

.el-descriptions{
}

.el-card{
  height: 100%;
}

</style>