<template>
	<el-dialog v-model="dialogVisual" title="快速打卡登录" width="1065px">
		
		<div class="box">
		    <video id="videoCamera" class="canvas" :width="camerainfo.videoWidth" :height="camerainfo.videoHeight" autoplay></video>
		    <canvas id="canvasCamera" class="canvas" style="display: none;" :width="camerainfo.videoWidth" :height="camerainfo.videoHeight"></canvas>
		</div>
		
		<div v-if="camerainfo.imgSrc" class="img_bg_camera">
		      <p>效果预览</p>
		      <img :src="camerainfo.imgSrc" alt class="tx_img" />
		</div>

		<div slot="footer">
			<el-row :gutter="10">
				<el-col :span="3">
					<el-button type="info" class="grid-content ep-bg-purple" @click="setImage">拍照</el-button>
				</el-col>
				<el-col :span="3">
					<el-button class="grid-content ep-bg-purple" v-model="camerainfo.open" @click="getCompetence" icon="el-icon-video-camera" size="small">打开摄像头</el-button>
				</el-col>
				<el-col :span="3">
					<el-button class="grid-content ep-bg-purple" v-model="camerainfo.open" @click="stopNavigator" icon="el-icon-switch-button" size="small">关闭摄像头</el-button>
				</el-col>
				<el-col :span="3">
					<el-button class="grid-content ep-bg-purple" @click="resetCanvas" icon="el-icon-refresh" size="small">重置</el-button>
				</el-col>
				<el-col :span="3">
					<el-button class="grid-content ep-bg-purple" @click="cancel" icon="el-icon-circle-close" size="small">取消</el-button>
				</el-col>
				<el-col :span="3">
					<el-button class="grid-content ep-bg-purple" @click="onUpload" :loading="camerainfo.loading" type="primary" icon="el-icon-upload2" size="small">上传</el-button>
				</el-col>
			</el-row>
		</div>
		
	</el-dialog>
	
</template>

<script setup lang="ts">
import { ref, reactive} from 'vue';

let dialogVisual = localStorage.getItem("ms_quickLogin") === "true" ? true:false;

const cancel = () => {
	localStorage.setItem("ms_quickLogin", "false");
}

interface cameraInfo{
	//dialogVisible: Boolean,//弹窗
	open: Boolean,//控制摄像头
	loading: Boolean,//上传
	imgSrc: String,
	thisCancas: any,
	thisContext: any,
	thisVideo: any,
	videoWidth: any,
	videoHeight: any,
};


const camerainfo = reactive<cameraInfo>({
	//dialogVisible: true,//弹窗
	open: false,//控制摄像头
	loading: false,//上传
	imgSrc: "",
	thisCancas: null,
	thisContext: null,
	thisVideo: null,
	videoWidth: 500,
	videoHeight: 400,
});

//const img_path = require('../assets/img/user');
//打开摄像头
const getCompetence = () => {
	//camerainfo.dialogVisible=true;
	camerainfo.open = false;
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
		console.log(err);
	});
};
//关闭摄像头
const stopNavigator = () => {
    camerainfo.thisVideo.srcObject.getTracks()[0].stop();
	console.log("props.showDialog="+props.showDialog);
};

//拍照
const setImage = () => {
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
	console.log(camerainfo.imgSrc);
};

 // base64转文件，此处没用到
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

//清空画布
const clearCanvas = (id) => {
	let c = document.getElementById(id);
	let cxt = c.getContext("2d");
	cxt.clearRect(0, 0, c.width, c.height);
};
//重置画布
const resetCanvas = () => {
	camerainfo.imgSrc = "";
	camerainfo.clearCanvas('canvasCamera');
};



</script>

<style>
	
.el-row {
	margin-bottom: 20px;
}
.el-row:last-child {
	margin-bottom: 0;
}
.el-col {
	border-radius: 4px;
}

.grid-content {
	border-radius: 4px;
	min-height: 36px;
}
</style>