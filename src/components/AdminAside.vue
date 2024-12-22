<template>
	<el-menu
		:default-active="$route.path"
		class="el-menu-vertical"
		@open="handleOpen"
		@close="handleClose"
		:collapse="isCollapse"
		background-color="#001529"
		text-color="#fff"
		active-text-color="#1890ff">
		
		<div class="logo-container">
			<h3 :class="{'logo-title': true, 'logo-title-collapse': isCollapse}">
				{{ isCollapse ? 'FH' : 'FitHub管理' }}
			</h3>
		</div>

		<el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :key="item.name" :index="item.path">
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
.el-menu-vertical:not(.el-menu--collapse) {
	width: 256px;
	min-height: 400px;
}

.el-menu {
	height: 100vh;
	border-right: none;

	.logo-container {
		height: 64px;
		line-height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.logo-title {
		color: #fff;
		font-size: 20px;
		font-weight: 600;
		transition: all 0.3s;
		white-space: nowrap;
	}

	.logo-title-collapse {
		font-size: 16px;
	}
}

.el-menu-item {
	&:hover {
		background-color: #1890ff !important;
		color: #fff !important;
	}

	&.is-active {
		background-color: #1890ff !important;
		color: #fff !important;
		
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 3px;
			background: #fff;
		}
		
		i {
			color: #fff !important;
		}
	}

	transition: all 0.3s ease;
	
	i {
		transition: all 0.3s ease;
	}
	
	span {
		transition: all 0.3s ease;
	}
}

.el-submenu {
	.el-menu-item {
		background-color: #000c17 !important;
		
		&:hover, &.is-active {
			background-color: #1890ff !important;
			color: #fff !important;
		}
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