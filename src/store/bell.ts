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
				if(res.data.code === -1){
					this.count = 0
				}else{
					this.count = res.data.data.read.length + res.data.data.unread.length
				}
            })
		}
	}
});
