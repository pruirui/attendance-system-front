import { defineStore } from "pinia";
import { queryMyApplications } from '../api';

export const useBellMessage = defineStore('messages', {
	state: () => {
		return {
			count:0
		};
	},
	actions: {
		handle() {
            let uid = localStorage.getItem('ms_userId')
            if(uid === null){
                return;
            }
            queryMyApplications(uid).then((res)=>{
                this.count = res.data.data.read.length + res.data.data.unread.length
            })
		}
	}
});
