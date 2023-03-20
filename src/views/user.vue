<template>
	<div>
		<el-row :gutter="20">

			<el-col :span="12">
				<el-card shadow="hover">
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
					<el-form label-width="90px">
						<el-form-item label="用户名："> {{ name }} </el-form-item>
						<el-form-item label="旧密码：">
							<el-input type="password" v-model="passwordForm.old"></el-input>
						</el-form-item>
						<el-form-item label="新密码：">
							<el-input type="password" v-model="passwordForm.new" placeholder="请输入新密码"></el-input>
						</el-form-item>
            <el-form-item label="二次密码：">
              <el-input type="password" v-model="passwordForm.newsec" placeholder="请再次输入新密码"></el-input>
            </el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">保存</el-button>
						</el-form-item>
					</el-form>
				</el-card>

        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>信息编辑</span>
            </div>
          </template>
          <el-form label-width="90px">
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

              <el-button type="primary" @click="onSubmit2">提交</el-button>
              <el-button type="primary" >重置</el-button>
            </el-form-item>
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
import {FormRules} from "element-plus";

const name = localStorage.getItem('ms_username');
//密码表单
const passwordForm = reactive({
	old: '',
	new: '',
  newsec:'',
});
const rules: FormRules = {
  new: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur' ,
    },
  ],
  newsec: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if(value !== passwordForm.new){
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
});

function loadPassword(){
  passwordForm.old = '111111';
};
loadPassword();

function loadInfo(){
  // getUserInfo(userID).then((res)=>{  //??????
  //   console.log(res);
  //   for (let item of res.data.data){
  //     userForm.address = item.address;
  //     userForm.birthday = item.birthday;
  //     userForm.hometown = item.hometown;
  //     userForm.e_mail = item.e_mail;
  //   }
  // })
  userForm.phone = '180000000';
  userForm.address = '江苏省苏州市公共学院';
  userForm.birthday = '2000.04.20';
  userForm.hometown = '广东东莞';
  userForm.e_mail = '22222222@qq.com';
  userForm.motto = '一杯酒一包烟，一个bug调一天';
};
loadInfo();
const newPassword1 = ref('');
const newPassword2 = ref('');
const onSubmit = () => {
  if (!passwordForm.new){
    return;
  }
//   if ()
};

const addr = ref(userForm.address);
const birth = ref(userForm.birthday);
const home = ref(userForm.hometown);
const e_maill = ref(userForm.e_mail);
const mottoo = ref(userForm.motto);
const onSubmit2 = () => {
  userForm.address = addr.value;
  userForm.birthday = birth.value;
  userForm.hometown = home.value;
  userForm.e_mail = e_maill.value;
  userForm.motto = mottoo.value;
  // console.log(userForm.address);
};

const avatarImg = ref(avatar);
const imgSrc = ref('');
const cropImg = ref('');
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
	dialogVisible.value = true;
	imgSrc.value = avatarImg.value;
};

const setImage = (e: any) => {
	const file = e.target.files[0];
	if (!file.type.includes('image/')) {
		return;
	}
	const reader = new FileReader();
	reader.onload = (event: any) => {
		dialogVisible.value = true;
		imgSrc.value = event.target.result;
		cropper.value && cropper.value.replace(event.target.result);
	};
	reader.readAsDataURL(file);
};

const cropImage = () => {
	cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
	avatarImg.value = cropImg.value;
	dialogVisible.value = false;
};
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


</style>
