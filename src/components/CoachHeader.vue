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

		<div class="center">
			<img class="logo" :src="logoLink" alt="Logo">
		</div>

		<div class="right">
			<span class="welcome">欢迎您! {{name}} - 教练</span>
			
			<el-dropdown trigger="click">
				<span class="avatar-wrapper">
					<img class="user-avatar" :src="imageLink" @click="OpenDialog()">
					<i class="el-icon-caret-bottom"></i>
				</span>

				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="logout()">
						<i class="el-icon-switch-button"></i> 退出
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>

		<el-dialog :visible.sync="dialogVisible" title="修改头像">

			<el-upload class="avatar-uploader" action="http://localhost:8081/util/upload" :show-file-list="false"
				:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>

			<el-button type="primary" @click="alterCoachImage()" :disabled="imageUrl === ''">修改</el-button>
			<el-button @click="CloseDialog()">取消</el-button>


		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				logoLink: require('../assets/images/backgroundFit.jpg'),
				dialogVisible: false,
				imageUrl: '',
				imageTrueLink: ''
			}
		},
		mounted() {
			this.name = this.$store.state.tab.coachData.name;
		},
		computed: {
			imageLink() {
				return this.$store.state.tab.baseUrl + this.$store.state.tab.coachData.imagelink;
			}
		},
		methods: {
			logout() {
				this.$router.push({
					path: '/',
				});
			},
			MessageAlert(message) {
				this.$message({
					message: message,
					type: 'success'
				});
			},
			handleMenu() {
				this.$store.commit('collapseMenu')
			},
			OpenDialog() {
				this.imageUrl = '';
				this.dialogVisible = true;
			},
			CloseDialog() {
				this.dialogVisible = false;
			},
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
				this.imageTrueLink = res.data;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				// 确保在验证失败时返回 false
				return isJPG && isLt2M;
			},
			alterCoachImage() {
				const imageUrl = this.imageUrl;
				if (imageUrl !== '') {
					const params = {
						id: this.$store.state.tab.coachData.id,
						imageUrl: this.imageTrueLink,
					}
					this.$api.coach.alterCoachImage(params).then((resp) => {
						if (resp.data.code === 200) {
							this.dialogVisible = false;
							this.MessageAlert('您的头像修改成功');
							this.$store.commit('setCoachImageLink', this.imageTrueLink);
						} else {
							this.MessageAlert('未知错误');
						}
					})
				}
			},
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

	.center {
		.logo {
			height: 40px;
			object-fit: contain;
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

.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.avatar-uploader .el-upload:hover {
	border-color: #409EFF;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}

.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>