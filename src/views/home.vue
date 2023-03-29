<template>



	<v-header />
	<v-sidebar />
	<div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
		<v-tags></v-tags>
		<div class="content">
			<router-view v-slot="{ Component }">
				<transition name="move" mode="out-in">
					<keep-alive :include="tags.nameList">
						<component :is="Component"></component>
					</keep-alive>
				</transition>
			</router-view>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '../store/sidebar';
import { useTagsStore } from '../store/tags';
import vHeader from '../components/header.vue';
import vSidebar from '../components/sidebar.vue';
import vTags from '../components/tags.vue';
import { userBaseData } from '../api';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { usePermissStore } from '../store/permiss';

const sidebar = useSidebarStore();
const tags = useTagsStore();
const uid = localStorage.getItem("ms_userId");
const router = useRouter()

const getUser = ()=>{
	if(uid === null){
		ElMessage.error('未检测到用户登入，请登入！')
		localStorage.clear();
		router.push('/login');
		return
	}

	userBaseData(uid).then(response =>{
					const permiss = usePermissStore();//权限管理
					if(response.status != 200){
						ElMessage.error('网络超时，请重新登入');
						router.push('/login')
						return;
					}
					let tmp = response.data["data"];
					if(tmp.role != localStorage.getItem("ms_role")){
						localStorage.setItem("ms_role",tmp.role )
						const keys = permiss.defaultList[tmp.role];
						permiss.handleSet(keys);
						localStorage.setItem('ms_keys', JSON.stringify(keys));
						router.push('/');

					}
	});
}

getUser()

</script>
