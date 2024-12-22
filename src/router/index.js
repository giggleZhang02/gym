import Vue from 'vue'
import VueRouter from 'vue-router'

import AdminMain from '../views/admin/AdminMain.vue'
import AdminHome from '../views/admin/AdminHome.vue'
import AdminUser from '../views/admin/AdminUser.vue'
import AdminCoach from '../views/admin/AdminCoach.vue'
import AdminCourse from '../views/admin/AdminCourse.vue'
import AdminMessage from '../views/admin/AdminMessage.vue'
import AdminEquipment from '../views/admin/AdminEquipment.vue'

import CoachMain from '../views/coach/CoachMain.vue'
// import CoachHome from '../views/coach/CoachHome.vue'
import CoachHub from '../views/coach/CoachHub.vue'
import CoachMessage from '../views/coach/CoachMessage'
import FitHubEquipment from '../views/coach/FithubEquipment'
import CoachLookCourse from '../views/coach/CoachLookCourse'
import CoachSelfCourse from '../views/coach/CoachSelfCourse'

import UserMain from '../views/user/UserMain.vue'
import UserHome from '../views/user/UserHome.vue'
import UserHub from '../views/user/UserHub.vue'
import UserBuyCourse from '../views/user/UserBuyCourse.vue'
import UserVip from '../views/user/UserVip.vue'
import UserSelfCourse from '../views/user/UserSelfCourse.vue'
import UserSelfCollect from '../views/user/UserSelfCollect.vue'
import UserMessage from '../views/user/UserMessage.vue'
import FithubEquipment from '../views/user/FithubEquipment.vue'

import AllRegister from '../views/AllRegister.vue'

import AllForget from '../views/AllForget.vue'

import Login from '../views/Login.vue'

Vue.use(VueRouter)
// 创建路由组件
// 将组件和路由进行映射
// 创建router实例
const routes = [{
		path: '/',
		name: 'login',
		component: Login,
	},
	{
		path: '/adminMain',
		name: 'adminMain',
		component: AdminMain,
		children: [{
				path: '/',
				component: AdminHome
			},
			{
				path: '/adminMath/adminUser',
				component: AdminUser
			},
			{
				path: '/adminMath/adminCoach',
				component: AdminCoach
			},
			{
				path: '/adminMath/adminCourse',
				component: AdminCourse
			},
			{
				path: '/adminMath/adminMessage',
				component: AdminMessage
			},
			{
				path: '/adminMath/adminEquipment',
				component: AdminEquipment
			},


		]
	},
	{
		path: '/coachMain',
		name: 'coachMain',
		component: CoachMain,
		children: [{
				path: '/',
				component: CoachHub
			},
			{
				path: '/coachMain/coachHub',
				component: CoachHub
			},
			{
				path: '/coachMain/coachLookCourse',
				component: CoachLookCourse
			},
			{
				path: '/coachMain/coachSelfCourse',
				component: CoachSelfCourse
			},
			{
				path: '/coachMain/fitHubEquipment',
				component: FitHubEquipment
			},
			{
				path: '/coachMain/coachMessage',
				component: CoachMessage
			},

		]
	},
	{
		path: '/userMain',
		name: 'userMain',
		component: UserMain,
		children: [{
				path: '/',
				component: UserHome
			},
			{
				path: '/userMain/userHub',
				component: UserHub
			},
			{
				path: '/userMain/userBuyCourse',
				component: UserBuyCourse
			},
			{
				path: '/userMain/userVip',
				component: UserVip
			},
			{
				path: '/userMain/userSelfCourse',
				component: UserSelfCourse
			},
			{
				path: '/userMain/userSelfCollect',
				component: UserSelfCollect
			},
			{
				path: '/userMain/userMessage',
				component: UserMessage
			},
			{
				path: '/userMain/fithubEquipment',
				component: FithubEquipment
			},
		]
	},
	{
		path: '/allRegister',
		name: 'allRegister',
		component: AllRegister,
	},
	{
		path: '/allForget',
		name: 'allForget',
		component: AllForget,
	}
]

const router = new VueRouter({
	routes // (缩写) 相当于 routes: routes
})

export default router