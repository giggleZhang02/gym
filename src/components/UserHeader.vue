<template>
	<div class="header-container">

		<div class="l-content">
			<el-button @click="handleMenu" icon="el-icon-menu" size="mini"></el-button>
			<span class="text">首页</span>
		</div>

		<img style="margin-right: 400px;margin-top: 1px;" id="logo" :src="logoLink" alt="Logo">
		<div style="width: 200px;color: #aaff00;">
			<h3>欢迎您! {{name}}</h3>
		</div>
		<div class="r-content">

			<el-dropdown>
				<span class="el-dropdown-link">
					<img class="user" :src="imageLink" @click="OpenDialog()">
				</span>

				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.prevent.native="recharge()">充值</el-dropdown-item>
					<el-dropdown-item @click.prevent.native="logout()">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>

		<el-dialog :visible.sync="dialogVisible" title="修改头像">

			<el-upload class="avatar-uploader" action="http://localhost:8081/util/upload" :show-file-list="false"
				:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>

			<el-button type="primary" @click="alterUserImage()" :disabled="imageUrl === ''">修改</el-button>
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
				imageUrl: '',
				dialogVisible: false,
				imageTrueLink: ''
			}
		},
		mounted() {
			this.name = this.$store.state.tab.userData.name;
		},
		computed: {
			imageLink() {
				return this.$store.state.tab.baseUrl + this.$store.state.tab.userData.imagelink;
			}
		},
		methods: {
			MessageAlert(message) {
				this.$message({
					message: message,
					type: 'success'
				});
			},
			recharge() {
				this.$prompt('请输入充值金额', '提示', {
					confirmButtonText: '充值',
					cancelButtonText: '取消',
					inputPattern: /^[1-9]\d{0,3}$/, 
					inputErrorMessage: '请输入大于0小于10000的金额'
				}).then(({
					value
				}) => {
					const userId = this.$store.state.tab.userData.id;
					const params = {
						userId: userId,
						rechargeAmount: value
					}
					this.$api.user.recharge(params).then((resp) => {
						if(resp.data.code === 200){
							this.$message({
								type: 'success',
								message: '恭喜您!充值成功!充值金额为' + value + '!您的余额为' + resp.data.msg
							});
							this.$store.commit('setUserData', resp.data.data);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消充值'
					});
				});
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
			alterUserImage() {
				const imageUrl = this.imageUrl;
				if (imageUrl !== '') {
					const params = {
						id: this.$store.state.tab.userData.id,
						imageUrl: this.imageTrueLink,
					}
					this.$api.user.alterUserImage(params).then((resp) => {
						if (resp.data.code === 200) {
							this.dialogVisible = false;
							this.MessageAlert('您的头像修改成功');
							this.$store.commit('setUserImageLink', this.imageTrueLink);
						} else {
							this.MessageAlert('未知错误');
						}
					})
				}
			},
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
		padding: 0 20px;
		background-color: #333;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.text {
			color: #fff;
			font-size: 14px;
			margin-left: 10px;
		}

		.r-content {
			.user {
				width: 40px;
				height: 40px;
				border-radius: 50%;
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