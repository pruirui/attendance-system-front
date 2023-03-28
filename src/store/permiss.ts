import { defineStore } from 'pinia';

interface ObjectList {
	[key: string]: string[];
}

export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('ms_keys');
		return {
			key: keys ? JSON.parse(keys) : <string[]>[],
			defaultList: <ObjectList>{
				test: ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
				newer:['0','1','7','9'],
				user: [ '1', '2', '3', '7'],
				hr : [ '1', '2', '3', '4','6', '7'],
				boss: ['0', '1', '3', '4', '5', '6', '7'],
				admin: ['1', '3','4', '8']
			}
		};
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
		}
	}
});
