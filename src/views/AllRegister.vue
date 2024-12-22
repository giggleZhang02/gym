<template>
	<div class="register-container">
		<div class="register-background"></div>
		
		<!-- 导航栏 -->
		<div class="nav-header">
			<div class="nav-brand">
				<img :src="logoLink" alt="Logo">
				<h1>FitHub 注册中心</h1>
			</div>
			<router-link to="/" class="nav-link">已有账号？登录</router-link>
		</div>

		<!-- 注册类型选择 -->
		<div class="register-type-selector">
			<el-radio-group v-model="currentType" size="large">
				<el-radio-button label="user">用户注册</el-radio-button>
				<el-radio-button label="coach">教练注册</el-radio-button>
				<el-radio-button label="admin">管理员注册</el-radio-button>
			</el-radio-group>
		</div>

		<!-- 注册表单区域 -->
		<div class="register-content">
			<!-- 管理员注册 -->
			<div class="register-card admin-card" v-if="currentType === 'admin'">
				<h2>管理员注册</h2>
				<el-form ref="form" :model="admin" label-width="80px">
					<el-form-item label="密钥">
						<el-input type="password" v-model="supperAdminPassword" @blur="CheckSupperAdminPassword()" 
							placeholder="请输入管理员密钥">
						</el-input>
					</el-form-item>

					<el-form-item label="用户名">
						<el-input v-model="admin.username" @blur="isRepetitionAdminUsername()"
							placeholder="请输入用户名">
						</el-input>
					</el-form-item>

					<el-form-item label="密码">
						<el-input type="password" v-model="admin.password" @blur="CheckAdminPassword()"
							placeholder="请输入密码">
						</el-input>
					</el-form-item>

					<el-form-item label="确认密码">
						<el-input type="password" v-model="admin.againPassword" @blur="AgainCheckAdminPassword()"
							placeholder="请确认密码">
						</el-input>
					</el-form-item>

					<el-form-item label="电话">
						<el-input v-model="admin.tel" @blur="CheckAdminTel()"
							placeholder="请输入电话号码">
						</el-input>
					</el-form-item>

					<el-form-item class="verification-group">
						<el-image class="verification-img" :src="imageURL" @click="ChangeVerification()" fit="cover"></el-image>
						<el-input v-model="securityCode" @blur="VerificationCode()" placeholder="请输入验证码"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="AdminRegister()" :disabled="!adminShow">注册</el-button>
					</el-form-item>
				</el-form>
			</div>

			<!-- 用户注册 -->
			<div class="register-card user-card" v-if="currentType === 'user'">
				<h2>用户注册</h2>
				<el-form ref="form" :model="user" label-width="80px">
					<!-- 用户注册表单内容 -->
					<el-form-item label="用户名">
						<el-input v-model="user.username" @blur="isRepetitionUserUsername()"
							placeholder="请输入用户名">
						</el-input>
					</el-form-item>

					<el-form-item label="密码">
						<el-input type="password" v-model="user.passcode" @blur="CheckUserPassword()"
							placeholder="请输入密码">
						</el-input>
					</el-form-item>

					<el-form-item label="确认密码">
						<el-input type="password" v-model="user.againPassword" @blur="AgainCheckUserPassword()"
							placeholder="请确认密码">
						</el-input>
					</el-form-item>

					<el-form-item label="真实姓名">
						<el-input v-model="user.name" @blur="CheckUserName()"
							placeholder="请输入真实姓名">
						</el-input>
					</el-form-item>

					<el-form-item label="电话">
						<el-input v-model="user.tel" @blur="CheckUserTel()"
							placeholder="请输入电话号码">
						</el-input>
					</el-form-item>

					<el-form-item class="verification-group">
						<el-image class="verification-img" :src="imageURL" @click="ChangeVerification()" fit="cover"></el-image>
						<el-input v-model="securityCode" @blur="VerificationCode()" placeholder="请输入验证码"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="success" @click="OpendialogVisible()" :disabled="!userShow">下一步</el-button>
					</el-form-item>
				</el-form>
			</div>

			<!-- 教练注册 -->
			<div class="register-card coach-card" v-if="currentType === 'coach'">
				<h2>教练注册</h2>
				<el-form ref="form" :model="coach" label-width="80px">
					<!-- 教练注册表单内容 -->
					<el-form-item label="用户名">
						<el-input v-model="coach.username" @blur="isRepetitionCoachUsername()"
							placeholder="请输入用户名">
						</el-input>
					</el-form-item>

					<el-form-item label="密码">
						<el-input type="password" v-model="coach.passcode" @blur="CheckCoachPassword()"
							placeholder="请输入密码">
						</el-input>
					</el-form-item>

					<el-form-item label="确认密码">
						<el-input type="password" v-model="coach.againPassword" @blur="AgainCheckCoachPassword()"
							placeholder="请确认密码">
						</el-input>
					</el-form-item>

					<el-form-item label="真实姓名">
						<el-input v-model="coach.name" @blur="CheckCoachName()"
							placeholder="请输入真实姓名">
						</el-input>
					</el-form-item>

					<el-form-item label="电话">
						<el-input v-model="coach.tel" @blur="CheckCoachTel()"
							placeholder="请输入电话号码">
						</el-input>
					</el-form-item>

					<el-form-item class="verification-group">
						<el-image class="verification-img" :src="imageURL" @click="ChangeVerification()" fit="cover"></el-image>
						<el-input v-model="securityCode" @blur="VerificationCode()" placeholder="请输入验证码"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="danger" @click="OpendialogVisible1()" :disabled="!coachShow">下一步</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>

		<!-- 弹窗部分保持不变 -->
		<el-dialog :visible.sync="dialogVisible" title="完善信息" width="30%">
			<!-- 用户额外信息表单 -->
		</el-dialog>

		<el-dialog :visible.sync="dialogVisible1" title="完善信息" width="30%">
			<!-- 教练额外信息表单 -->
		</el-dialog>
	</div>
</template>

<script>
	import '/src/assets/css/register.css';
	export default {
		data() {
			return {
				logoLink: require('../assets/images/backgroundFit.jpg'),
				imageURL: 'http://localhost:8081/util/getVerificationImage',
				countDown: 5,
				toLoginTime: 3000,
				ReFreshVerification: 4 * 60 * 1000,
				securityCode: '',
				dialogVisible: false,
				dialogVisible1: false,
				supperAdminPassword: '',
				admin: {
					username: '',
					password: '',
					againPassword: '',
					tel: '',
				},
				user: {
					username: '',
					passcode: '',
					againPassword: '',
					name: '',
					birthday: '',
					sex: '',
					tel: '',
					height: '',
					weight: '',
				},
				coach: {
					username: '',
					passcode: '',
					againPassword: '',
					name: '',
					birthday: '',
					sex: '',
					tel: '',
					height: '',
					weight: '',
				},
				currentType: 'user', // 默认显示用户注册
			}
		},
		mounted() {
			setInterval(() => {
				this.ChangeVerification();
			}, this.ReFreshVerification);
		},
		computed: {
			adminShow() {
				return this.admin.username !== '' && this.admin.password !== '' && this.admin.againPassword !== '' && this
					.admin.tel !== '' && this.securityCode !== '' && this.supperAdminPassword !== '';
			},
			userOtherShow() {
				return this.user.username !== '' && this.user.passcode !== '' && this.user.againPassword !== '' && this
					.user.name !== '' && this.user.birthday !== '' && this.user.tel !== '' && this.user.height !== '' &&
					this.user.weight && this
					.securityCode !== '';
			},
			userShow() {
				return this.user.username !== '' && this.user.passcode !== '' && this.user.againPassword !== '' && this
					.user.name !== '' && this.user.tel !== '' && this.securityCode !== '';
			},
			coachOtherShow() {
				return this.coach.username !== '' && this.coach.passcode !== '' && this.coach.againPassword !== '' && this
					.coach.name !== '' && this.coach.birthday !== '' && this.coach.tel !== '' && this.coach.height !==
					'' &&
					this.coach.weight && this
					.securityCode !== '';
			},
			coachShow() {
				return this.coach.username !== '' && this.coach.passcode !== '' && this.coach.againPassword !== '' && this
					.coach.name !== '' && this.coach.tel !== '' && this.securityCode !== '';
			}
		},
		methods: {
			HintUsername() {
				this.$notify({
					title: '温馨提示',
					message: '您输入的用户名已经存在!请您重新输入!',
					position: 'top-left'
				});
			},
			HintUserName() {
				this.$notify({
					title: '温馨提示',
					message: '真实姓名长度不得超过20',
					position: 'top-left'
				});
			},
			CheckUsername() {
				this.$notify({
					title: '温馨提示',
					message: '用户名长度不能超过7',
					position: 'top-left'
				});
			},
			CheckVerification() {
				this.$notify({
					title: '温馨提示',
					message: '验证码错误!有效期五分钟!您可以尝试刷新验证码!',
					position: 'top-left'
				});
			},
			HintPassword() {
				this.$notify({
					title: '温馨提示',
					message: '密码长度在 [6,18] 之间',
					position: 'top-left'
				});
			},
			AgainHintPassword() {
				this.$notify({
					title: '温馨提示',
					message: '两次填写密码不一致',
					position: 'top-left'
				});
			},
			HintUserBirthday() {
				this.$notify({
					title: '温馨提示',
					message: '您输入的出生日期不合法!请确保您的年龄在[14,120]之间!',
					position: 'top-left'
				});
			},
			HintTel() {
				this.$notify({
					title: '温馨提示',
					message: '电话长度必须为11且必须为数字',
					position: 'top-left'
				});
			},
			HintUserHeight() {
				this.$notify({
					title: '温馨提示',
					message: '请您输入正确的身高,不要太离谱!',
					position: 'top-left'
				});
			},
			HintUserWeight() {
				this.$notify({
					title: '温馨提示',
					message: '请您输入正确的体重,不要太离谱!',
					position: 'top-left'
				});
			},
			CreateAdminAccountMsg() {
				this.$message({
					message: '恭喜你! 创建管理员账号成功! 三秒后自动跳转到登录页面!',
					type: 'success'
				});
			},
			CreateUserAccountMsg() {
				this.$message({
					message: '恭喜你! 创建用户账号成功! 三秒后自动跳转到登录页面!',
					type: 'success'
				});
			},
			CreateCoachAccountMsg() {
				this.$message({
					message: '恭喜你! 创建教练账号成功! 三秒后自动跳转到登录页面!',
					type: 'success'
				});
			},
			CheckSupperAdminPassWordMsg() {
				this.$message.error('您输入的超级管理员密钥不正确!');
			},
			CheckUserHeight() {
				if (this.user.height !== '') {
					const isNumeric = /^[0-9]+$/.test(this.user.height);
					if (!isNumeric || this.user.height < 60 || this.user.height > 250) {
						this.HintUserHeight();
						this.user.height = '';
					}
				}
			},
			CheckUserWeight() {
				if (this.user.weight !== '') {
					const isNumeric = /^[0-9]+$/.test(this.user.weight);
					if (!isNumeric || this.user.weight < 60 || this.user.weight > 300) {
						this.HintUserWeight();
						this.user.weight = '';
					}
				}
			},
			CheckCoachHeight() {
				if (this.coach.height !== '') {
					const isNumeric = /^[0-9]+$/.test(this.coach.height);
					if (!isNumeric || this.coach.height < 60 || this.coach.height > 250) {
						this.HintUserHeight();
						this.coach.height = '';
					}
				}
			},
			CheckCoachWeight() {
				if (this.coach.weight !== '') {
					const isNumeric = /^[0-9]+$/.test(this.coach.weight);
					if (!isNumeric || this.coach.weight < 60 || this.coach.weight > 300) {
						this.HintUserWeight();
						this.coach.weight = '';
					}
				}
			},
			CheckUserbirthday() {
				if (this.user.birthday !== '') {
					// 将用户生日转换为 Date 对象
					const userBirthday = new Date(this.user.birthday);
					// 获取当前时间
					const currentDate = new Date();

					// 计算用户年龄
					const age = currentDate.getFullYear() - userBirthday.getFullYear();

					// 判断用户年龄是否在指定范围内
					if (age >= 14 && age <= 120 && userBirthday < currentDate) {
						// 用户年龄合法
						return;
					} else {
						// 用户年龄不合法
						this.HintUserBirthday();
						this.user.birthday = '';
					}
				}
			},
			CheckCoachbirthday() {
				if (this.coach.birthday !== '') {
					// 将用户生日转换为 Date 对象
					const userBirthday = new Date(this.coach.birthday);
					// 获取当前时间
					const currentDate = new Date();
			
					// 计算用户年龄
					const age = currentDate.getFullYear() - userBirthday.getFullYear();
			
					// 判断用户年龄是否在指定范围内
					if (age >= 14 && age <= 120 && userBirthday < currentDate) {
						// 用户年龄合法
						return;
					} else {
						// 用户年龄不合法
						this.HintUserBirthday();
						this.coach.birthday = '';
					}
				}
			},
			CheckSupperAdminPassword() {
				if (this.supperAdminPassword !== '') {
					const params = {
						SupperAdminPassword: this.supperAdminPassword,
					}
					this.$api.admin.checkSupperAdminPassword(params).then((resp) => {
						if (resp.data.code === 0) {
							this.CheckSupperAdminPassWordMsg();
							this.supperAdminPassword = '';
						}
					})
				}
			},
			AdminRegister() {
				const data = {
					username: this.admin.username,
					passcode: this.admin.password,
					tel: this.admin.tel,
				}
				this.$api.admin.adminRegister(data).then((resp) => {
					if (resp.data.code === 200) {
						this.CreateAdminAccountMsg();
						setTimeout(() => {
							this.$router.push("/")
						}, this.toLoginTime)
					} else {
						this.$message('未知错误!');
					}
				})
			},
			UserRegister() {
				const gender = this.user.sex === '男' ? 1 : 0;
				const data = {
					username: this.user.username,
					passcode: this.user.passcode,
					name: this.user.name,
					sex: gender,
					birthday: this.user.birthday,
					tel: this.user.tel,
					height: this.user.height,
					weight: this.user.weight,
				}
				this.$api.user.userRegister(data).then((resp) => {
					if (resp.data.code === 200) {
						this.CreateUserAccountMsg();
						setTimeout(() => {
							this.$router.push("/")
						}, this.toLoginTime)
					} else {
						this.$message('未知错误!');
					}
				})
			},
			CoachRegister() {
				const gender = this.coach.sex === '男' ? 1 : 0;
				const data = {
					username: this.coach.username,
					passcode: this.coach.passcode,
					name: this.coach.name,
					sex: gender,
					birthday: this.coach.birthday,
					tel: this.coach.tel,
					height: this.coach.height,
					weight: this.coach.weight,
				}
				this.$api.coach.coachRegister(data).then((resp) => {
					if (resp.data.code === 200) {
						this.CreateCoachAccountMsg();
						setTimeout(() => {
							this.$router.push("/")
						}, this.toLoginTime)
					} else {
						this.$message('未知错误!');
					}
				})
			},
			OpendialogVisible() {
				this.dialogVisible = true;
			},
			CloseDialog() {
				this.dialogVisible = false;
			},
			OpendialogVisible1() {
				this.dialogVisible1 = true;
			},
			CloseDialog1() {
				this.dialogVisible1 = false;
			},
			CheckAdminTel() {
				if (this.admin.tel !== '') {
					if (!/^\d{11}$/.test(this.admin.tel)) {
						this.HintTel();
						this.admin.tel = ''
					}
				}
			},
			CheckUserTel() {
				if (this.user.tel !== '') {
					if (!/^\d{11}$/.test(this.user.tel)) {
						this.HintTel();
						this.user.tel = ''
					}
				}
			},
			CheckCoachTel() {
				if (this.coach.tel !== '') {
					if (!/^\d{11}$/.test(this.coach.tel)) {
						this.HintTel();
						this.coach.tel = ''
					}
				}
			},
			ChangeVerification() {
				var timeNow = new Date().getTime();
				this.imageURL = this.imageURL + "?d=" + timeNow;
			},
			VerificationCode() {
				if (this.securityCode !== '') {
					if (this.securityCode.length !== 4) {
						this.CheckVerification();
						this.securityCode = '';
						return
					}
					const params = {
						verification: this.securityCode,
					}
					this.$api.util.verificationCode(params).then((resp) => {
						if (resp.data.code === 0) {
							this.CheckVerification();
							this.securityCode = '';
						}
					})
				}
			},
			isRepetitionCoachUsername() {
				if (this.coach.username !== '') {
					const username = this.coach.username;
					if (username.length > 7) {
						this.CheckUsername();
						this.coach.username = '';
						return;
					}
					const params = {
						username: this.coach.username
					}
					this.$api.coach.isRepetitionCoachUsername(params).then((resp) => {
						if (resp.data.code === 0) {
							this.HintUsername();
							this.coach.username = '';
						}
					})
				}
			},
			isRepetitionUserUsername() {
				if (this.user.username !== '') {
					const username = this.user.username;
					if (username.length > 7) {
						this.CheckUsername();
						this.user.username = '';
						return;
					}
					const params = {
						username: this.user.username
					}
					this.$api.user.isRepetitionUserUsername(params).then((resp) => {
						if (resp.data.code === 0) {
							this.HintUsername();
							this.user.username = '';
						}
					})
				}
			},
			isRepetitionAdminUsername() {
				if (this.admin.username !== '') {
					const username = this.admin.username;
					if (username.length > 7) {
						this.CheckUsername();
						this.admin.username = '';
						return;
					}
					const params = {
						username: this.admin.username
					}
					this.$api.admin.isRepetitionAdminUsername(params).then((resp) => {
						if (resp.data.code === 0) {
							this.HintUsername();
							this.admin.username = '';
						}
					})
				}
			},
			CheckCoachPassword() {
				if (this.coach.passcode !== '') {
					const passwordLength = this.coach.passcode.length;
					if (passwordLength < 6 || passwordLength > 18) {
						this.HintPassword();
						this.coach.passcode = '';
					}
				}
			},
			AgainCheckCoachPassword() {
				if (this.coach.againPassword !== '') {
					if (this.coach.againPassword !== this.coach.passcode) {
						this.AgainHintPassword();
						this.coach.againPassword = '';
					}
				}
			},
			CheckAdminPassword() {
				if (this.admin.password !== '') {
					const passwordLength = this.admin.password.length;
					if (passwordLength < 6 || passwordLength > 18) {
						this.HintPassword();
						this.admin.password = '';
					}
				}
			},
			AgainCheckAdminPassword() {
				if (this.admin.againPassword !== '') {
					if (this.admin.againPassword !== this.admin.password) {
						this.AgainHintPassword();
						this.admin.againPassword = '';
					}
				}
			},
			CheckUserPassword() {
				if (this.user.passcode !== '') {
					const passwordLength = this.user.passcode.length;
					if (passwordLength < 6 || passwordLength > 18) {
						this.HintPassword();
						this.user.passcode = '';
					}
				}
			},
			AgainCheckUserPassword() {
				if (this.user.againPassword !== '') {
					if (this.user.againPassword !== this.user.passcode) {
						this.AgainHintPassword();
						this.user.againPassword = '';
					}
				}
			},
			CheckUserName() {
				if (this.user.name !== '') {
					const nameLength = this.user.name.length;
					if (nameLength > 20) {
						this.HintUserName();
						this.user.name = '';
					}
				}
			},
			CheckCoachName() {
				if (this.coach.name !== '') {
					const nameLength = this.coach.name.length;
					if (nameLength > 20) {
						this.HintUserName();
						this.coach.name = '';
					}
				}
			},
		}
	}
</script>

<style scoped>
.register-container {
	min-height: 100vh;
	width: 100vw;
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradientBG 15s ease infinite;
	position: relative;
	overflow-x: hidden;
}

.register-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: 
		radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%),
		radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%);
	background-size: 100px 100px;
	pointer-events: none;
	opacity: 0.3;
	z-index: 0;
}

@keyframes gradientBG {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}

.nav-header {
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 40px;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
}

.nav-brand {
	display: flex;
	align-items: center;
	gap: 15px;
}

.nav-brand img {
	height: 40px;
	width: 40px;
	border-radius: 50%;
}

.nav-brand h1 {
	color: white;
	font-size: 24px;
	margin: 0;
}

.nav-link {
	color: white;
	text-decoration: none;
	font-size: 16px;
	transition: all 0.3s ease;
}

.nav-link:hover {
	color: #409EFF;
}

.register-content {
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: center;
	gap: 30px;
	padding: 40px;
	flex-wrap: wrap;
}

.register-card {
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
	border-radius: 15px;
	padding: 30px;
	width: 400px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
}

.register-card:hover {
	transform: translateY(-5px);
}

.register-card h2 {
	text-align: center;
	margin-bottom: 30px;
	color: #303133;
}

.verification-group {
	display: flex;
	gap: 10px;
}

.verification-img {
	width: 120px;
	height: 40px;
	cursor: pointer;
}

/* Element UI 组件样式覆盖 */
.el-form-item {
	margin-bottom: 22px;
}

.el-input__inner {
	height: 40px;
}

.el-button {
	width: 100%;
	height: 40px;
	border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
	.register-content {
		padding: 20px;
	}
	
	.register-card {
		width: 100%;
		max-width: 400px;
	}
}

@media (max-width: 768px) {
	.nav-header {
		padding: 15px 20px;
	}
	
	.nav-brand h1 {
		font-size: 20px;
	}
}

.register-type-selector {
	position: relative;
	z-index: 1;
	text-align: center;
	padding: 20px 0;
}

.register-type-selector .el-radio-group {
	background: rgba(255, 255, 255, 0.1);
	padding: 10px;
	border-radius: 12px;
	backdrop-filter: blur(10px);
}

.register-type-selector .el-radio-button__inner {
	background: transparent;
	border: none;
	color: white;
	padding: 12px 30px;
	transition: all 0.3s ease;
}

.register-type-selector .el-radio-button:first-child .el-radio-button__inner {
	border-radius: 8px 0 0 8px;
}

.register-type-selector .el-radio-button:last-child .el-radio-button__inner {
	border-radius: 0 8px 8px 0;
}

.register-type-selector .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.2);
	box-shadow: none;
	color: #409EFF;
}

.register-card {
	animation: fadeIn 0.5s ease;
	max-width: 500px;
	margin: 0 auto;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 修改注册内容区域的样式 */
.register-content {
	display: block;
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

/* 响应式优化 */
@media (max-width: 768px) {
	.register-type-selector .el-radio-button__inner {
		padding: 10px 20px;
		font-size: 14px;
	}
	
	.register-card {
		margin: 10px;
	}
}
</style>