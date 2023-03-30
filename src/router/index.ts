import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '个人首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/information',
                name: 'information',
                meta: {
                    title: '消息通知',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/information.vue'),
            },
            {
                path: '/mycompany',
                name: 'mycompany',
                meta: {
                    title: '我的团队',
                    permiss: '7',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/company.vue'),
            },
            {
                path: '/admincompany',
                name: 'admincompany',
                meta: {
                    title: '所有团队',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/companyAdmin.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                    permiss: '1'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            {
                path: '/myclockin',
                name: 'myclockin',
                meta: {
                    title: '我的打卡',
                    permiss: '2'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/clockin.vue'),
            },
            {
                path: '/attendance',
                name: 'attendance',
                meta: {
                    title: '考勤信息',
                    permiss: '2'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/attendance.vue'),
            },
            {
                path: '/attendancemanagement',
                name: 'attendancemanagement',
                meta: {
                    title: '考勤信息管理',
                    permiss: '4'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/attendanceManagement.vue'),
            },
            {
                path: '/companysearch',
                name: 'companysearch',
                meta: {
                    title: '团队搜索',
                    permiss: '1'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/companySearch.vue'),
            },
            {
                path: '/createcompany',
                name: 'createcompany',
                meta: {
                    title: '创建团队',
                    permiss: '0'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/companyCreate.vue'),
            },
            {
                path: '/companyinformation',
                name: 'companyinformation',
                meta: {
                    title: '团队信息',
                    permiss: '1'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/companyInformation.vue'),
            },
            {
                path: '/modifycompany',
                name: 'modifycompany',
                meta: {
                    title: '修改团队信息',
                    permiss: '6'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/companyModify.vue'),
            }
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
	{
		path: '/register',
		name: 'register',
		meta: {
			title: '注册',
		},
		component:() => import(/* webpackChunkName: "dashboard" */ '../views/register.vue'),
	},
	
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 智慧考勤系统`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
		if(to.path === '/register' || to.path === '/quicklogin'){
			next();
		}else{
			next('/login');   
		}
    } 
	else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
