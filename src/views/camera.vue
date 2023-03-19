<template>
	<div class="camera-box" style="width: 900px;">
	    <el-row :gutter="20">
	      <el-col :span="12">
	        <div style="text-align: center;font-size: 14px;font-weight: bold;margin-bottom: 10px;">摄像头</div>
	        <!-- 这里就是摄像头显示的画面 -->
	        <video id="videoCamera" width="400" height="300"></video>
	        <div class="iCenter" >
				<el-button type='primary' size='small' @click="getCompetence" style="margin-top: 10px;">打开摄像头</el-button>
				<el-button type='primary' size='small' :icon="Camera" @click="setImage" style="margin-top: 10px;">拍 照</el-button>
				<el-button type='primary' size='small' @click="stopNavigator" style="margin-top: 10px;">关闭摄像头</el-button>
			</div>
	      </el-col>
	      <el-col :span="12">
	        <div style="text-align: center;font-size: 14px;font-weight: bold;margin-bottom: 10px;">拍摄效果</div>
	        <!-- 这里是点击拍照显示的图片画面 -->
	        <canvas id='canvasCamera' width='400' height='300' style="display: block;"></canvas>
			<el-form>
				<el-form-item>
					<el-button :icon="Check" type='primary' size='small' @click="onUpload" style="margin-top: 10px;">保存</el-button>
				</el-form-item>
			</el-form>
	      </el-col>
	    </el-row>
	</div>	
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount , onUnmounted, onBeforeMount, onMounted} from 'vue';
import { ElMessageBox } from 'element-plus'
import { Login, uploadImg } from '../api/index'
import { Camera ,CaretBottom,Check } from '@element-plus/icons-vue'
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

const props = defineProps({
	quickLogin:{
		type: Boolean,
		default:false
	}
});

const emits = defineEmits(["changequickLogin"]);

onMounted(() => {
	getCompetence();
	console.log(props.quickLogin);
})

onBeforeUnmount(() => {
	camerainfo.open=false;
	camerainfo.loading=false;
	camerainfo.imgSrc="";
	camerainfo.thisCancas=null;
	camerainfo.thisVideo=null;
	camerainfo.thisContext=null;
});

//const img_path = require('../assets/img/user');
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
		console.log(err);
	});
	camerainfo.open = true;
};
//关闭摄像头
const stopNavigator = () => {
	camerainfo.open=false;
	camerainfo.thisVideo.srcObject.getTracks()[0].stop();
};

//拍照
const setImage = (done: () => void) => {
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
		//camerainfo.loading=true;
	}
	else{
		ElMessageBox.confirm('你没有打开摄像头').then(() => {
		    done()
		}).catch(() => {
		      // catch error
		})
	}
	
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


const onUpload = (done: () => void) => {
	if(camerainfo.imgSrc===""){
		ElMessageBox.confirm('你没有拍照').then(() => {
		    done()
		}).catch(() => {
		      // catch error
		})
	}
	else{
		let config = {
		          headers:{'Content-Type':'multipart/form-data'}
		        }; 
		uploadImg(dataURLtoFile(camerainfo.imgSrc, "file"),config).then(res => {
			console.log(res);
		})
		//emits("changequickLogin","ni");
	}
}

</script>

<style>

.el-form-item{
	
}
.camera-box #canvas{
border: 1px solid #DCDFE6;
}
</style>