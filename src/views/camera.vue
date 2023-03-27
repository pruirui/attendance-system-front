<template>
	<el-dialog v-model="dialogVisible" title="快速打卡" width="1000px" @opened="getCompetence">
		<div class="login-cav">
			<div class="camera-box" style="width: 1000px; height: 340px;">
				<el-row :gutter="20">
					<el-col :span="12">
						<div style="text-align: center;font-size: 14px;font-weight: bold;margin-bottom: 10px; width: 400px;">摄像头{{"  "+ camerainfo.Tips}}</div>
						
						<video id="videoCamera" width="400" height="320"></video>
						<div class="iCenter" >
							<el-button type='primary' size='small' @click="getCompetence" style="margin-top: 10px;">打开摄像头</el-button>
							<el-button type='primary' size='small' :icon="Camera" @click="setImage" style="margin-top: 10px;">人脸拍照</el-button>
							<el-button type='primary' size='small' @click="stopNavigator" style="margin-top: 10px;">关闭摄像头</el-button>
						</div>
					</el-col>
					<el-col :span="12">
						<div style="text-align: center;font-size: 14px;font-weight: bold;margin-bottom: 10px; width: 400px;">拍摄效果</div>
						<canvas id='canvasCamera' width='400' height='320' style="display: block;"></canvas>
						<el-button :icon="Check" type='primary' size='small' @click="onUpload" style="margin-top: 10px;">打卡登录</el-button>
					</el-col>
				</el-row>
			</div>	
		</div>
	    
	    
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="dialogVisible = false; handleClose()">取消</el-button>
	        <el-button type="primary" @click="dialogVisible = false; handleClose()">确定 </el-button>
	      </span>
	    </template>
	  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount , onMounted, onBeforeUpdate} from 'vue';
import { usePermissStore } from '../store/permiss';
import { ElMessageBox,ElMessage } from 'element-plus'
import { uploadImg,clockOut } from '../api/index'
import type {Action} from 'element-plus'
import "../assets/js/tracking-min.js"
import "../assets/js/face-min.js"
import "../assets/js/eye-min.js"
import "../assets/js/mouth-min.js"

const emits = defineEmits(["changeclose","getLoginUserData","changevisiable"]);
const dialogVisible = ref(true);


const props = defineProps({
	flag:{
		type: Boolean,
		default:false
	},
	clock_flag:{
		type: Boolean,
		default:false
	}
});

const handleClose = () =>{
	emits("changeclose");
}

interface cameraInfo{
	countNum: any,//计数器
	open: Boolean,//控制摄像头
	loading: Boolean,//上传
	imgSrc: String,
	Tips: String,
	TipsFlag: Boolean,//false 追踪人脸，true不追踪
	faceFlag: Boolean,//false 拍照，true不拍照
	//streamIns: any,
	tracker: any,	//人脸追踪
	trackertask: any,
	thisCancas: any,
	thisContext: any,
	thisVideo: any,
	videoWidth: any,
	videoHeight: any,
};

const camerainfo = reactive<cameraInfo>({
	countNum: 0,//计数器
	open: false,//控制摄像头
	loading: false,//上传
	imgSrc: "",
	Tips: "未检测到人脸",
	TipsFlag: false,
	faceFlag: false,
	//streamIns: null,
	tracker: null,
	trackertask: null,
	thisCancas: null,
	thisContext: null,
	thisVideo: null,
	videoWidth: 400,
	videoHeight: 320,
});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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
		setTimeout(() => {
			camerainfo.thisVideo.play()
			initTrack()
		},10);
	}).catch(err => {
		camerainfo.Tips="访问用户媒体失败";
		console.log(err);
	});
	camerainfo.open = true;
};


onBeforeUnmount(() => {
	stopNavigator();
	camerainfo.countNum=0;
	camerainfo.open=false;
	camerainfo.loading=false;
	camerainfo.imgSrc="";
	camerainfo.Tips="未检测到人脸";
	camerainfo.TipsFlag=false;
	camerainfo.faceFlag=false;
	//camerainfo.streamIns=null;
	camerainfo.tracker=null;
	camerainfo.trackertask=null;
	camerainfo.thisCancas=null;
	camerainfo.thisVideo=null;
	camerainfo.thisContext=null;
});



const initTrack = () => {

	camerainfo.tracker = new window.tracking.ObjectTracker('face');
	camerainfo.tracker.setInitialScale(4);
    camerainfo.tracker.setStepSize(2); // 设置步长
    camerainfo.tracker.setEdgesDensity(0.1); 
	camerainfo.trackertask = window.tracking.track("#videoCamera", camerainfo.tracker, { camera: true });//开始使用追踪器对象tracker来追踪视频流中的人脸。
	
	camerainfo.tracker.on('track',(event) => {
		if(!camerainfo.TipsFlag){
			camerainfo.thisContext.clearRect(0,0, camerainfo.thisCancas.width, camerainfo.thisCancas.height);
			
			if(event.data.length === 0){
				camerainfo.Tips = "人脸识别中...";
			}
			else if(event.data.length === 1){
				if(!camerainfo.TipsFlag){
					event.data.forEach((rect) => {
						camerainfo.thisContext.strokeRect(rect.x, rect.y, rect.width, rect);
						camerainfo.thisContext.strokeStyle = '#ff7146'
						camerainfo.thisContext.fillStyle = '#ff7146'
					});
					
					if(!camerainfo.faceFlag){
						(async function() {
							await sleep(500);
							camerainfo.Tips = "检测成功，请保持两秒不动";
						})();
						
						camerainfo.faceFlag=true;
						//camerainfo.Tips = "检测成功，请保持两秒不动";
						(async function() {
							await sleep(900);
							camerainfo.Tips = "拍照中...";
							
						})();
						
						setTimeout(() => {
							camerainfo.TipsFlag = true;
							
							setImage();
							
							camerainfo.Tips = "拍照成功";
						}, 1000);
					}
				}
			}
			else{
				if(!camerainfo.TipsFlag){
					ElMessage.error('只能对一个人脸检测.');
				}
			}
		}
	});
};


//关闭摄像头
const stopNavigator = () => {
	if(camerainfo.open){
		camerainfo.open=false;
		camerainfo.thisVideo.srcObject.getTracks()[0].stop();
	}
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
		camerainfo.countNum += 1;
		if(camerainfo.countNum>2){
			camerainfo.Tips = "拍照成功";
		}
		camerainfo.imgSrc = image;//赋值并预览图片
		if(camerainfo.TipsFlag&&camerainfo.faceFlag&&camerainfo.countNum<=2){
			let config = {
			          headers:{'Content-Type':'multipart/form-data'}
			        }; 
			if(props.clock_flag){
				uploadImg(dataURLtoFile(camerainfo.imgSrc, "file.jpg"),config).then(res => {
					console.log(res);
					if(res.data["data"]){	//打卡成功
						if(res.data.code===1){
							ElMessage.success(res.data["msg"]);
						}
						else if(res.data.code === 0){
							ElMessage.warning(res.data["msg"]);
						}
						camerainfo.loading=true;
						if(props.flag){
							emits("getLoginUserData",res);
						}
						else{
							emits("changevisiable");
							//console.log(props.flag);
						}
					}
					else{
						if(camerainfo.countNum<2){
							ElMessageBox.alert(res.data["msg"], 'Error',{
								center: true,
								type: 'error'
							});
							(async function() {
							  await sleep(2000);
							  camerainfo.TipsFlag=false;
							  camerainfo.faceFlag=false;
							})();
						}
						else{
							ElMessageBox.alert(
							    '你的自动人脸打卡检测已失败2次！<br/>'+"请你手动拍照打卡登录!",
							    'Error',
							    {
							      dangerouslyUseHTMLString: true,
								  type: 'error',
								  center: true
							    }
							)
							//ElMessageBox.alert(res.data["msg"]+"请你手动打卡登录!", 'Error');
							camerainfo.Tips = "请你手动拍照";
							camerainfo.thisContext.clearRect(0, 0, camerainfo.videoWidth, camerainfo.videoHeight);
						}
					}
				});
			}
			else{
				clockOut(dataURLtoFile(camerainfo.imgSrc, "file.jpg"),config).then(res => {
					console.log(res);
					if(res.data["data"]){	//打卡成功
						if(res.data.code===1){
							ElMessage.success(res.data["msg"]);
						}
						else if(res.data.code === 0){
							ElMessage.warning(res.data["msg"]);
						}
						camerainfo.loading=true;
						if(props.flag){
							//emits("getLoginUserData",res);
						}
						else{
							emits("changevisiable");
							//console.log(props.flag);
						}
					}
					else{
						if(camerainfo.countNum<2){
							ElMessageBox.alert(res.data["msg"], 'Error',{
								center: true,
								type: 'error'
							});
							(async function() {
							  await sleep(2000);
							  camerainfo.TipsFlag=false;
							  camerainfo.faceFlag=false;
							})();
						}
						else{
							ElMessageBox.alert(
							    '你的自动人脸打卡检测已失败2次！<br/>'+"请你手动拍照打卡登录!",
							    'Error',
							    {
							      dangerouslyUseHTMLString: true,
								  type: 'error',
								  center: true
							    }
							)
							//ElMessageBox.alert(res.data["msg"]+"请你手动打卡登录!", 'Error');
							camerainfo.Tips = "请你手动拍照";
							camerainfo.thisContext.clearRect(0, 0, camerainfo.videoWidth, camerainfo.videoHeight);
						}
					}
				});
			}
		}
	}
	else{
		ElMessage.error('你没有打开摄像头，请打开摄像头.');
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

//上传图片
const onUpload = () => {

	if(camerainfo.imgSrc===""){

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
		if(props.clock_flag){
			uploadImg(dataURLtoFile(camerainfo.imgSrc, "file.jpg"),config).then(res => {
				console.log(res);
				if(res.data["data"]){	//打卡成功
					ElMessage.success(res.data["msg"]);
					camerainfo.loading=true;
					emits("getLoginUserData",res, props.flag);
				}
				else{
					ElMessageBox.alert(res.data["msg"], 'Error',{
						center: true,
						type: 'error'
					});
					camerainfo.Tips = "请你手动拍照";
				}
			})
		}
		else{
			
		}
		
	}
}


</script>

<style>
	.el-row {
		margin-bottom: 20px;
		&:last-child {
		  margin-bottom: 0;
		}
	}
	.el-col {
		border-radius: 4px;
	}
	.row-bg {
		padding: 10px 0;
	}
		
	.camera-box #canvas{
		border: 1px solid #DCDFE6;
	}
	
	.quciklogin-tips {
		font-size: 12px;
		line-height: 30px;
		color: #fff;
	}
	.dialog-footer button:first-child {
	
		margin-right: 10px;
	}
	
	.login-cav{
		
		height: 340px;
		width: 1000px;
	}
</style>