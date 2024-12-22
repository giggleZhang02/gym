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
				{{ isCollapse ? 'FH' : 'FitHub教练' }}
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
					// {
					// 	path: '/coachMain',
					// 	name: 'coachMain',
					// 	label: '教练首页',
					// 	icon: 's-home',
					// 	url: 'CoachHome/CoachHome'
					// },
					{
						path: '/coachMain/coachHub',
						name: 'coachHub',
						label: '教练中心',
						icon: 'user-solid',
						url: 'CoachHub/CoachHub'
					},
					{
						path: '/coachMain/coachLookCourse',
						name: 'coachLookCourse',
						label: '查看课程',
						icon: 'platform-eleme',
						url: 'CoachLookCourse/CoachLookCourse'
					},
					{
						path: '/coachMain/coachSelfCourse',
						name: 'coachSelfCourse',
						label: '我的课程',
						icon: 'paperclip',
						url: 'CoachSelfCourse/CoachSelfCourse'
					},
					{
						path: '/coachMain/fitHubEquipment',
						name: 'fitHubEquipment',
						label: '健身器材',
						icon: 'bicycle',
						url: 'FitHubEquipment/FitHubEquipment'
					},
					{
						path: '/coachMain/coachMessage',
						name: 'coachMessage',
						label: '通知信息',
						icon: 'message',
						url: 'CoachMessage/CoachMessage'
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