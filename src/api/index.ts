import { reactive } from 'vue';
import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

export const Login = (data :Object) => {
    return request.post("http://10.6.12.158:5000/user/login", data);
};