<template>
	<el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
		:collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
		<h3>{{ isCollapse ? 'FitHub' : 'FitHub管理员中心'}}</h3>
		<el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :key="item.name" :index="item.name">
			<i :class="`el-icon-${item.icon}`"></i>
			<span slot="title">{{item.label}}</span>
		</el-menu-item>

		<el-submenu v-for="item in hasChildren" :key="item.label" :index="item.label">
			<template slot="title">
				<i :class="`el-icon-${item.icon}`"></i>
				<span slot="title">{{item.label}}</span>
			</template>
			<el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
				<el-menu-item @click="clickMenu(subItem)" :index="subItem.path">{{subItem.label}}</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
	</el-menu>
</template>

<style lang="less" scoped>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
	}

	.el-menu {
		height: 100vh;

		h3 {
			color: #fff;
			text-align: center;
			line-height: 48px;
			font-size: 16px;
			font-weight: 400;
		}
	}
</style>


<script>
	export default {
		data() {
			return {

				menuData: [
					{
						path: '/adminMain',
						name: 'adminHome',
						label: '首页',
						icon: 's-home',
						url: 'AdminHome/AdminHome'
					},
					{
						path: '/adminMath/adminUser',
						name: 'adminUser',
						label: '用户管理',
						icon: 'user-solid',
						url: 'AdminUser/AdminUser'
					},
					{
						path: '/adminMath/adminCoach',
						name: 'adminCoach',
						label: '教练管理',
						icon: 's-check',
						url: 'AdminCoach/AdminCoach'
					},
					{
						path: '/adminMath/adminCourse',
						name: 'adminCourse',
						label: '课程管理',
						icon: 'link',
						url: 'AdminCourse/AdminCourse'
					},
					{
						path: '/adminMath/adminMessage',
						name: 'adminMessage',
						label: '通知信息管理',
						icon: 'message',
						url: 'AdminMessage/AdminMessage'
					},
					{
						path: '/adminMath/adminEquipment',
						name: 'adminEquipmentr',
						label: '健身器材管理',
						icon: 'bicycle',
						url: 'AdminEquipmentr/AdminEquipmentr'
					},
				]
			};
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			clickMenu(item) {
				console.log(item);
				//页面路由跳转 不是当前页面才跳转
				if (this.$route.path !== item.path &&
					!(this.$route.path === '/adminHome' &&
						(item.path === '/adminMain'))) {
					this.$router.push(item.path);
				}
			}
		},
		computed: {
			// 没有子菜单
			noChildren() {
				return this.menuData.filter(item => !item.children)
			},
			// 有子菜单
			hasChildren() {
				return this.menuData.filter(item => item.children)
			},
			isCollapse() {
				return this.$store.state.tab.isCollapse
			}
		}
	}
</script>
<style lang="less" scoped>
	.el-menu {
		border-right: none;
	}
</style>