<template>
	<div class="user-main">
		<el-container class="container">
			<el-aside width="auto" class="aside">
				<UserAside />
			</el-aside>

			<el-container class="right-container">
				<el-header class="header">
					<UserHeader />
				</el-header>

				<el-main class="main">
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
	.user-main {
		width: 100vw;
		height: 100vh;
		background-color: #f0f2f5;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	.container {
		height: 100%;
		width: 100%;
	}

	.aside {
		box-shadow: 2px 0 6px rgba(0, 21, 41, 0.12);
		z-index: 999;
		height: 100vh;
	}

	.right-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100%;
	}

	.header {
		padding: 0;
		background: #fff;
		box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	}

	.main {
		padding: 20px;
		background: #f0f2f5;
		flex: 1;
		overflow-y: auto;
		height: calc(100vh - 60px);
	}
</style>