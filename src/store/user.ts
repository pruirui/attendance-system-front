import { defineStore } from "pinia";
import { ref } from "vue";
import {userBaseData } from '../api';

export const useUserMessage = defineStore('userinfo', {
	state: () => {
        const user = ref();
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
            userBaseData(uid).then((res)=>{
                this.user = res.data.data
            })
		}
	}
});


