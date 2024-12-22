<template>
	<div>
		<el-container>

			<el-aside width="auto">
				<CoachAside />
			</el-aside>

			<el-container>

				<el-header>
					<CoachHeader />
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
	import CoachAside from "../../components/CoachAside.vue";
	import CoachHeader from "../../components/CoachHeader.vue";

	export default {
		data() {
			return {}
		},
		components: {
			CoachAside,
			CoachHeader
		}
	}
</script>

<style scoped>
	.el-header {
		padding: 0;
	}
</style>