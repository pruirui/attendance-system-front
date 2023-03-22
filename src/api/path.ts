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
<<<<<<< HEAD
	userClockData: "/user/userClockData",
=======
	updateDepartConfig : "/HR/updateDepartConfig",
	queryAllUsers:"/HR/queryAllUsers",
	inviteUserJoinDepart:"/HR/inviteUserJoinDepart",
	userBaseData: "/user/userBaseData",
	dismissUserInDepart:"/HR/dismissUserInDepart"
>>>>>>> 04e566698bcaf2356b959c820fb0d034d0da7cc4
}
export default path;