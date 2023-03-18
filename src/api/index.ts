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


export const GetCompany = (uid: String) => {
    return request.post(path.baseUrl+path.getDepartment, {uid});
};

export const NewerApplyDepartment = (departmentid:string, uid:string) =>{
    return request.post(path.baseUrl+path.userApplyDepartment, {departmentid, uid});
}
export const CreateDepartment = (params:{departmentName: string, HRuid: string, description: string, hourPay: string, workOverPay: string, workOverLimit: string, startTime: string, endTime: string, 
    workdays: Array<string>,
    phone:string,
    address:string,
    rmb:string,
    createTime:string}) =>{
    return request.post(path.baseUrl+path.createDepartment, {...params});
}


