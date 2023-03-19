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
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '表格',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            },
            {
                path: '/charts',
                name: 'basecharts',
                meta: {
                    title: '图表',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            },
            {
                path: '/form',
                name: 'baseform',
                meta: {
                    title: '表单',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            },
            {
                path: '/permission1',
                name: 'permission1',
                meta: {
                    title: '权限管理1',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission1.vue'),
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传插件',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/icon',
                name: 'icon',
                meta: {
                    title: '自定义图标',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            },
            
            {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            },
            {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            },
            {
                path: '/export',
                name: 'export',
                meta: {
                    title: '导出Excel',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "export" */ '../views/export.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '导入Excel',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
            {
                path: '/test',
                name: 'test',
                meta: {
                    title: '导入Excel',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/test.vue'),
            },
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
                    title: '我的公司',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/mycompany.vue'),
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
                component: () => import(/* webpackChunkName: "user" */ '../views/myclockin.vue'),
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
                path: '/leave',
                name: 'leave',
                meta: {
                    title: '我的请假',
                    permiss: '2'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/leave.vue'),
            },
            {
                path: '/attendancemanagement',
                name: 'attendancemanagement',
                meta: {
                    title: '考勤信息管理',
                    permiss: '3'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/attendancemanagement.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '3'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/permission.vue'),
            },
            {
                path: '/faceimport',
                name: 'faceimport',
                meta: {
                    title: '人脸导入',
                    permiss: '4'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/faceimport.vue'),
            },
            {
                path: '/companysearch',
                name: 'companysearch',
                meta: {
                    title: '公司搜索',
                    permiss: '1'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/companysearch.vue'),
            },
            {
                path: '/createcompany',
                name: 'createcompany',
                meta: {
                    title: '创建公司',
                    permiss: '0'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/createcompany.vue'),
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
	{
		path: '/quicklogin',
		name: 'quicklogin',
		meta: {
			title: '快速打卡登录',
		},
		component:() => import(/* webpackChunkName: "dashboard" */ '../views/quicklogindialog.vue'),
	}
	
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
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
