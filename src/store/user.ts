import { defineStore } from "pinia";
import { ref } from "vue";
import {userBaseData } from '../api';
import { usePermissStore } from "./permiss";

export const useUserMessage = defineStore('userinfo', {
	state: () => {
        const user = ref({address: null,birthday: null,email: null,flag: null,gender: null,headshot: '/images/headshots/9999.jpg',home: null,id: null,motto: null,
			phone: "null",role: "null",username: "unkonw"});
		return {
			user:user
		};
	},
	actions: {
		fresh() {
            let uid = localStorage.getItem('ms_userId')
            if(uid === null){
                return;
            }
			const permiss = usePermissStore()
            userBaseData(uid).then((res)=>{
                this.user = res.data.data
				permiss.handleSet(permiss.defaultList[this.user.role])
            })
		}
	}
});




