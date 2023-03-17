import request from '../utils/request';
import path from './path'
export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};
//登录
export const Login = (data :Object) => {
    return request.post(path.baseUrl+path.login ,data);
};
//注册
export const Register = (data :Object) => {
	return request.post(path.baseUrl+path.register, data);
}
