<template>
	<el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen()" @close="handleClose()"
		:collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
		<h3>{{ isCollapse ? 'FitHub' : 'FitHub用户中心'}}</h3>
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
				menuData: [{
						path: '/userMain',
						name: 'userMain',
						label: '用户首页',
						icon: 's-home',
						url: 'UserHome/UserHome'
					},
					{
						path: '/userMain/userHub',
						name: 'userHub',
						label: '用户中心',
						icon: 'user-solid',
						url: 'UserHub/UserHub'
					},
					{
						path: '/userMain/userBuyCourse',
						name: 'userBuyCourse',
						label: '购买课程',
						icon: 'shopping-cart-full',
						url: 'UserBuyCourse/UserBuyCourse'
					},
					{
						path: '/userMain/userVip',
						name: 'userVip',
						label: '办理会员',
						icon: 'user',
						url: 'UserVip/UserVip'
					},
					{
						path: '/userMain/userSelfCourse',
						name: 'userSelfCourse',
						label: '我的课程',
						icon: 'paperclip',
						url: 'UserSelfCourse/UserSelfCourse'
					},
					{
						path: '/userMain/userSelfCollect',
						name: 'userSelfCollect',
						label: '我的收藏',
						icon: 'star-off',
						url: 'UserSelfCollect/UserSelfCollect'
					},
					{
						path: '/userMain/userMessage',
						name: 'userMessage',
						label: '通知信息',
						icon: 'message',
						url: 'UserMessage/UserMessage'
					},
					{
						path: '/userMain/fithubEquipment',
						name: 'fithubEquipment',
						label: '健身器材',
						icon: 'bicycle',
						url: 'FithubEquipment/FithubEquipment'
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
					!(this.$route.path === '/userHome' &&
						(item.path === '/userMain'))) {
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