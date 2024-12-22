<template>
	<div class="header-container">
		<div class="left">
			<el-button
				@click="handleMenu"
				icon="el-icon-menu"
				class="collapse-btn"
				type="text">
			</el-button>
			<span class="breadcrumb">首页</span>
		</div>

		<div class="right">
			<span class="welcome">管理员</span>
			<el-dropdown trigger="click">
				<span class="avatar-wrapper">
					<img class="user-avatar" src="../assets/images/(97).png" alt="">
					<i class="el-icon-caret-bottom"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="logout()">
						<i class="el-icon-switch-button"></i> 退出
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			logout() {
				this.$router.push({
					path: '/',
				});
			},
			handleMenu() {
				this.$store.commit('collapseMenu')
			}
		}
	}
</script>

<style lang="less" scoped>
.header-container {
	height: 64px;
	padding: 0 24px;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

	.left {
		display: flex;
		align-items: center;

		.collapse-btn {
			font-size: 20px;
			color: #666;
			margin-right: 15px;
		}

		.breadcrumb {
			font-size: 14px;
			color: #666;
		}
	}

	.right {
		display: flex;
		align-items: center;
		gap: 20px;

		.welcome {
			color: #666;
			font-size: 14px;
		}

		.avatar-wrapper {
			cursor: pointer;
			display: flex;
			align-items: center;
			gap: 4px;

			.user-avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				border: 2px solid #f0f0f0;
				transition: all 0.3s;

				&:hover {
					transform: scale(1.1);
				}
			}

			.el-icon-caret-bottom {
				color: #666;
				font-size: 12px;
			}
		}
	}
}
</style>