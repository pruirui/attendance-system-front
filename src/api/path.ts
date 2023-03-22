const path = {
	baseUrl : "http://10.6.12.158:5000",
	login : "/user/login",
	register: "/user/register",
	uploadImg: "/user/clockIn",
	uploadFaceImg: "/HR/createUserFace",
	searchAllDepartment:'/user/queryAllDepartments',
	getDepartment:'/user/userInDepartment',
	userApplyDepartment:"/user/userApplyDepartment",
	createDepartment: "/HR/createDepartment",
	queryDepartmentDetail: "/user/queryDepartmentDetail",
	usersInDepartment: "/HR/usersInDepartment",
	applyDeleteDepartment: "/HR/applyDeleteDepartment",
	grantUserHR: "/HR/grantUserHR",
	queryMyApplications: "/user/queryMyApplications",
	processMyApplications:"/user/processMyApplications",
	userClockData: "/user/userClockData",
}
export default path;