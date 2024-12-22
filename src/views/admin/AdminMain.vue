<template>
	<div>
		<el-container>

			<el-aside width="auto">
				<AdminAside />
			</el-aside>

			<el-container>

				<el-header>
					<AdminHeader />
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
	import AdminAside from "../../components/AdminAside.vue";
	import AdminHeader from "../../components/AdminHeader.vue";

	export default {
		data() {
			return {}
		},
		components: {
			AdminAside,
			AdminHeader
		}
	}
</script>

<style scoped>
	.el-header {
		padding: 0;
	}
</style>