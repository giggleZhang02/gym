<template>
	<div>
		<el-container>

			<el-aside width="auto">
				<UserAside />
			</el-aside>

			<el-container>

				<el-header>
					<UserHeader />
				</el-header>

				<el-main>
					<!-- 路由出口 -->
					<!-- 路由匹配到的组件将渲染在这里 -->
					<router-view></router-view>
				</el-main>

			</el-container>
		</el-container>
	</div>
</template>

<script>
	import UserAside from "../../components/UserAside.vue";
	import UserHeader from "../../components/UserHeader.vue";

	export default {
		data() {
			return {}
		},
		components: {
			UserAside,
			UserHeader
		}
	}
</script>

<style scoped>
	.el-header {
		padding: 0;
	}
</style>