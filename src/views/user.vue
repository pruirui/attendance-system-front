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
					<el-form :model="passwordForm" :rules="rules" ref="passwordPolish" label-width="90px">
						<el-form-item label="用户名："> {{ name }} </el-form-item>
						<el-form-item label="旧密码：">
							<el-input type="password" v-model="passwordForm.oldpswd" show-password></el-input>
						</el-form-item>
						<el-form-item label="新密码：">
							<el-input type="password" v-model="passwordForm.newpswd" placeholder="请输入新密码" show-password></el-input>
						</el-form-item>
            <el-form-item prop="password2" label="二次密码：">
              <el-input type="password" v-model="passwordForm.newsecpswd" placeholder="请再次输入新密码"
                        @keyup.enter="onSubmit(passwordPolish)" show-password></el-input>
            </el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit(passwordPolish)">保存</el-button>
						</el-form-item>

            <el-form label-width="90px">
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
import avatar from '../assets/img/img.jpg';
import {ElMessage, FormInstance, FormRules} from 'element-plus';
import {getUserInfo, infoPolish, PasswordPolish, avatarPolish} from '../api/index'

const name = localStorage.getItem('ms_username');
const userId = localStorage.getItem('ms_userId');
//密码表单
interface passwordInfo {
  oldpswd : string;
  newpswd :string
  newsecpswd : string
}
const passwordForm = reactive<passwordInfo>({
  oldpswd: '',
  newpswd: '',
  newsecpswd:'',
});
const rules: FormRules = {
  password2: [
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
    console.log(res);
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
    avatarImg.value = "http://10.6.12.158:5000" + res.data.data.headshot;
  });
};
loadInfo()
// const addr = ref(userForm.address);
// const birth = ref(userForm.birthday);
// const home = ref(userForm.hometown);
// const e_maill = ref(userForm.e_mail);
// const mottoo = ref(userForm.motto);
// const genderr = ref(userForm.gender);

const passwordPolish = ref<FormInstance>();
const onSubmit = (pswdform: FormInstance | undefined) => {
  if (!pswdform){
    console.log("null");
    return;
  }
  console.log("-----");
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
    console.log('修改个人信息');
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
  console.log('cleared');
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
  console.log(file);
	if (!file.type.includes('image/jpg')) {  //r如果为非图片格式
		return;
	}
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("上传头像图片大小不能超过 2MB!");
    return;
  }
  const reader = new FileReader();  //使用 FileReader 读取文件

  //读取文件,会触发 onload 异步事件,可使用回调函数 来获取最终的值.
	reader.onload = (event: any) => {
		dialogVisible.value = true;
		imgSrc.value = event.target.result;  //图片类可将此值赋给img的src
    // cropper.value.replace(event.target.result).toDataURL();
		cropper.value && cropper.value.replace(event.target.result);
	};

};

const cropImage = () => {  //获取裁剪后的图像
	cropImg.value = cropper.value.getCroppedCanvas().toDataURL(); //获取裁剪后图像（base64）
  console.log(cropImg);
  // cropImg2.value = cropper.value.getCroppedCanvas().toDataURL("image/jpeg", 1.0);
};

// import { Base64 } from 'js-base64';
// const fs = require("fs")
//
// function base64ToImg(file:any){
//   const avatar_str = file.replace('data:image/png;base64,', '');
//   const avatar_bytes = Base64.decode(avatar_str);
//   console.log(avatar_bytes);
//   fs.writeFile("http://10.6.12.158:5000"+"demo.png", avatar_bytes, function (){
//     console.log("demo.png has been converted to complete!");
//   })
// };

const dataURLtoFile = (dataurl:any, filename:any)  => {
  var arr = dataurl.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const saveAvatar = () => {
	avatarImg.value = cropImg.value;

  if (cropImg.value === ''){
    console.log("未上传头像");
  }else {
    console.log('--------------------------');
    console.log(cropImg);
    let imgData = dataURLtoFile(cropImg.value, "demo.jpg");
    console.log('imgData', imgData);
    if (userId === null){
      return;
    }
    avatarPolish(userId, imgData).then((res) => {
      console.log(res);
      let data = res.data;
      if (data.code == 1){
        ElMessage.success('用户头像修改成功！');
        avatarImg.value = cropImg.value;
      }else {
        ElMessage.error('用户头像修改失败！');
      }
    })
  }
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
