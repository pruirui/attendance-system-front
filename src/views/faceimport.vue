<template>
<div class="camera-box" style="width: 1000px; ">
	    <el-row :gutter="20">
			<el-col :span="12">
				<div style="text-align: center;font-size: 14px;font-weight: bold;margin-bottom: 10px; width: 400px;">摄像头</div>
				<!-- 这里就是摄像头显示的画面 -->
				<video id="videoCamera" width="400" height="320"></video>
				<div class="iCenter" >
					<el-button type='primary' size='small' @click="getCompetence" style="margin-top: 10px;">打开摄像头</el-button>
					<el-button type='primary' size='small' :icon="Camera" @click="setImage" style="margin-top: 10px;">拍    照</el-button>
					<el-button type='primary' size='small' @click="stopNavigator" style="margin-top: 10px;">关闭摄像头</el-button>
				</div>
			</el-col>
			
			<el-col :span="12">
				<div style="text-align: center;font-size: 14px;font-weight: bold;margin-bottom: 10px; width: 400px;">拍摄效果</div>
				<!-- 这里是点击拍照显示的图片画面 -->
				<canvas id='canvasCamera' width='400' height='320' style="display: block;"></canvas>
					<el-button :icon="Check" type='primary' size='small' @click="onUpload" style="margin-top: 10px;">保存</el-button>
			</el-col>
	    </el-row>
	</div>	
  </template>
  
  
<script setup lang="ts">
import { ref, reactive, onBeforeUnmount , onMounted} from 'vue';
import { Camera ,Check } from '@element-plus/icons-vue'
import { ElMessageBox,ElMessage } from 'element-plus'
import type {Action} from 'element-plus'
import { uploadFaceImg } from '../api/index'

const props = defineProps(['uid']);


interface cameraInfo{
	open: Boolean,//控制摄像头
	loading: Boolean,//上传
	imgSrc: String,
	faceFlag: Boolean,
	thisCancas: any,
	thisContext: any,
	thisVideo: any,
	videoWidth: any,
	videoHeight: any,
};
  
const camerainfo = reactive<cameraInfo>({
	open: false,//控制摄像头
	loading: false,//上传
	imgSrc: "",
	faceFlag: false,
	thisCancas: null,
	thisContext: null,
	thisVideo: null,
	videoWidth: 400,
	videoHeight: 320,
});

onMounted(() => {
	getCompetence();
})

onBeforeUnmount(() => {
	stopNavigator();
	camerainfo.open=false;
	camerainfo.loading=false;
	camerainfo.imgSrc="";
	camerainfo.faceFlag=false;

	camerainfo.thisCancas=null;
	camerainfo.thisVideo=null;
	camerainfo.thisContext=null;
});
  
//关闭摄像头
const stopNavigator = () => {
	if(camerainfo.open){
		camerainfo.open=false;
		camerainfo.thisVideo.srcObject.getTracks()[0].stop();
	}
};

//打开摄像头
const getCompetence = () => {
  	
	camerainfo.thisCancas = document.getElementById("canvasCamera");
  	camerainfo.thisContext = camerainfo.thisCancas.getContext("2d");
  	camerainfo.thisVideo = document.getElementById("videoCamera");
  	camerainfo.thisVideo.style.dispaly = 'block';
  	
  	if(navigator.mediaDevices === undefined){
  		navigator.mediaDevices = {};
  	}
  	
  	if(navigator.mediaDevices.getUserMedia === undefined){
  		navigator.mediaDevices.getUserMedia = function(constraints){
  			var getUserMedia = navigator.webkitGetUserMedia ||navigator.mozGetUserMedia || navigator.getUserMedia;
  			
  			if(!getUserMedia){
  				return Promise.reject( new Error("getUserMedia is not implemented in this browser"));
  			}
  			return new Promise(function(resolve, reject){
  				getUserMedia.call(navigator, constraints, resolve, reject);
  			});
  		}
  	}
  	var constraints = {
  		audio: false,
  		video: {
  			width: camerainfo.videoWidth,
  			height: camerainfo.videoHeight,
  			transform: "scaleX(-1)"
  		}
  	};
  	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  		  // 旧的浏览器可能没有srcObject
  		if ("srcObject" in camerainfo.thisVideo) {
  			camerainfo.thisVideo.srcObject = stream;
  		} 
  		else {
  			// 避免在新的浏览器中使用它，因为它正在被弃用。
  			camerainfo.thisVideo.src = window.URL.createObjectURL(stream);
  		}
  		camerainfo.thisVideo.onloadedmetadata = function(e) {
  			camerainfo.thisVideo.play();
  		};
		
  	}).catch(err => {
  		ElMessage.error("请在有摄像头的电脑上允许浏览器中的隐私设置使用摄像头，建议使用IE10以上及最新版谷歌、QQ、火狐等游浏览器。");
  	});
	camerainfo.open = true;
};

//拍照
const setImage = () => {
	if(camerainfo.open){
		// canvas画图
		camerainfo.thisContext.drawImage(
			camerainfo.thisVideo,
			0,
			0,
			camerainfo.videoWidth,
			camerainfo.videoHeight
		);
		// 获取图片base64链接
		var image = camerainfo.thisCancas.toDataURL("image/png");
		
		camerainfo.imgSrc = image;//赋值并预览图片
		camerainfo.loading=true;
	}
	else{
		ElMessage.error('请打开摄像头.');
	}
};


//上传图片
const onUpload = () => {

	if(camerainfo.imgSrc === ""){
		console.log("null");
		ElMessageBox.alert('你没有拍照', 'Error', {
		    // if you want to disable its autofocus
		    // autofocus: false,
		    confirmButtonText: 'OK',
		    callback: (action: Action) => {
		      ElMessage({
		        type: 'error',
		        message: `action: ${action}`,
		      })
		    },
		});
	}
	else{
		let config = {
		          headers:{'Content-Type':'multipart/form-data'}
		        }; 
		console.log(props.uid);
		uploadFaceImg(dataURLtoFile(camerainfo.imgSrc, "file.jpg"),props.uid, config).then(res => {
			console.log(res);
			if(res.data["data"]){	//打卡成功
				ElMessage.success(res.data["msg"]);
				camerainfo.loading=true;
			}
			else{
				ElMessageBox.alert(res.data["msg"], 'Error');
			}
		});
	}
}

const dataURLtoFile = (dataurl, filename)  => {
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

  
</script>
  <style lang="less" scoped>
 
  </style>