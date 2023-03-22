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