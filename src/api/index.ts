import request from '../utils/request';
import path from './path'
export const getAllDepartmentData = (address:String, departmentName:String) => {
    return request.post(path.baseUrl + path.searchAllDepartment,{address:address,
        departmentName: departmentName} )
};
//登录
export const Login = (data :Object) => {
    return request.post(path.baseUrl+path.login ,data);
};
//注册
export const Register = (data :Object) => {
	return request.post(path.baseUrl+path.register, data);
};


export const GetCompany = (data :any) => {
    return request.post(path.baseUrl+path.getDepartment, data);
};

