import { pa } from 'element-plus/es/locale';
import request from '../utils/request';
import path from './path'
export const getAllDepartmentData = (address:String, departmentName:String, pageIndex:number, pageSize:number) => {
    return request.post(path.baseUrl + path.searchAllDepartment,{address, departmentName, pageIndex, pageSize} )
};
//登录
export const Login = (data :Object) => {
    return request.post(path.baseUrl+path.login ,data);
};
//注册
export const Register = (data :Object) => {
	return request.post(path.baseUrl+path.register, data);
};


export const getDepartmentByUid = (uid: String) => {
    return request.post(path.baseUrl+path.getDepartment, {uid});
};


export const uploadImg = (data :any, config :any) => {
	return request.post(path.baseUrl+path.uploadImg, {"file": data}, config);
}
export const uploadFaceImg = (data :any, uid: any, config :any) => {
	return request.post(path.baseUrl+path.uploadFaceImg, {"file": data,"uid": uid}, config);
}
export const newerApplyDepartment = (departmentid:string, uid:string) =>{
    return request.post(path.baseUrl+path.userApplyDepartment, {departmentid, uid});
}
export const createDepartment = (departmentName: string, HRuid: string, description: string, hourPay: string, workOverPay: string, workOverLimit: string, startTime: string, endTime: string, 
    workdays: Array<string>,
    phone:string,
    address:string,
    rmb:string,
    createTime:string) =>{
    return request.post(path.baseUrl+path.createDepartment, {departmentName,HRuid,description,hourPay,workOverPay,workOverLimit,startTime,endTime,workdays,phone,address,rmb,createTime});
}

export const getDepartmentByDepartmentId = (departmentid: string) => {
    return request.post(path.baseUrl+path.queryDepartmentDetail,{departmentid});
}

export const getAllUserByDepartmentId = (departmentid: string, querystring:string, pageIndex:number, pageSize:number) => {
    return request.post(path.baseUrl+path.usersInDepartment,{departmentid, querystring, pageIndex, pageSize});
}

export const deleteDepartmentById = (departmentid: string, uid:string) => {
    return request.post(path.baseUrl+path.applyDeleteDepartment,{departmentid, uid});
}

export const grantUserHR = (HRuid: string, uid:string, departmentid:string) => {
    return request.post(path.baseUrl+path.grantUserHR,{departmentid, uid, HRuid});

}

export const queryMyApplications = (uid:string) => {
    return request.post(path.baseUrl+path.queryMyApplications,{uid});

}

export const processMyApplications = (uid:string, id:string, state:string) =>{
    return request.post(path.baseUrl+path.processMyApplications,{uid, id, state});
}



export const getUserClockinfo = (now_month: any, uid: any) => {
	return request.post(path.baseUrl+path.userClockData, {"month":now_month, "uid":uid});
}


export const updateDepartConfig = (departmentid:string, departmentName: string, HRuid: string, description: string, hourPay: string, workOverPay: string, workOverLimit: string, startTime: string, endTime: string, 
    workdays: Array<string>,
    phone:string,
    address:string,
    rmb:string,
    createTime:string) =>{
    return request.post(path.baseUrl+path.updateDepartConfig,{departmentid, departmentName,HRuid,description,hourPay,workOverPay,workOverLimit,startTime,endTime,workdays,phone,address,rmb,createTime});
}

export const queryAllUsers = (querystring:string, pageIndex:number, pageSize:number) => {
    return request.post(path.baseUrl+path.queryAllUsers,{querystring, pageIndex, pageSize});
}

export const inviteUserJoinDepart = (HRuid: string, uid:string, departmentid:string) => {
    return request.post(path.baseUrl+path.inviteUserJoinDepart,{departmentid, uid, HRuid});
}

export const userBaseData = (uid:string)=>{
    return request.post(path.baseUrl+path.userBaseData, {uid});
}

export const dismissUserInDepart = (HRuid: string, uid:string, departmentid:string)=>{
    return request.post(path.baseUrl+path.dismissUserInDepart, {HRuid,uid,departmentid})
}


export const PasswordPolish = (uid:string, password:string) => {
    return request.post(path.baseUrl+path.passwordPolish, {uid, password});
};

export const getUserInfo = (uid:string) => {
    return request.post(path.baseUrl+path.getUserInfo, {uid});
};

export const infoPolish = (uid:string, username:string, password:string, phone:string, address:string, birthday:string,
                           motto:string, gender:string, home:string, email:string,) => {
    return request.post(path.baseUrl+path.infoPolish, {uid, username, password, phone, address, birthday, motto, gender, home, email});
};

export const avatarPolish = (uid:any, file: any) => {
    let config = {
        headers:{'Content-Type':'multipart/form-data'}
    };
    return request.post(path.baseUrl+path.avatarUpload, {"uid":uid, "file":file}, config);
};

export const GetCompany = (uid:string) => {
    return request.post(path.baseUrl + path.getOnesCompany, {uid});
};

export const GetEmployee = (departmentid:string, pageIndex:any, pageSize:any, querystring:any) => {
    return request.post(path.baseUrl + path.getOnesEmployee, {departmentid, pageIndex, pageSize, querystring});
};

export const usermakeUpClock = (uid : String, departmentid: String, date:String, content: String, description:String) => {
	return request.post(path.baseUrl+path.makeUpClock, {uid, departmentid, date, content, description});
}

export const userClockInfo = (year: any, month: any, uid: any) => {
	return request.post(path.baseUrl+path.userClockInfo, {year, month, uid});
}


export const userLeave = (uid :String, departmentid: string, starttime :String, endtime :String, description :String) => {
	return request.post(path.baseUrl+path.userLeave, {uid, departmentid, starttime, endtime, description});
}

export const userOverTime = (uid :String, departmentid: string, starttime :String, endtime :String, description :String) => {
	return request.post(path.baseUrl+path.userovertime, {uid, departmentid, starttime, endtime, description});
}

