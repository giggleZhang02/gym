<template>
	<div class="register-container">
		<div class="register-background"></div>
		
		<!-- 导航栏 -->
		<div class="nav-header">
			<div class="nav-brand">
				<i class="el-icon-platform-eleme"></i>
				<h1>FitHub 注册中心</h1>
			</div>
			<router-link to="/" class="nav-link">已有账号？登录</router-link>
		</div>

		<!-- 注册主体区域 -->
		<div class="register-box">
			<!-- 左侧欢迎区域 -->
			<div class="register-left">
				<div class="welcome-text">
					<h2>欢迎加入</h2>
					<p>开启您的健身之旅</p>
				</div>
			</div>

			<!-- 右侧注册表单区域 -->
			<div class="register-right">
				<!-- 注册类型选择 -->
				<div class="register-type-selector">
					<el-radio-group v-model="currentType" size="large">
						<el-radio-button label="user">用户注册</el-radio-button>
						<el-radio-button label="coach">教练注册</el-radio-button>
						<el-radio-button label="admin">管理员注册</el-radio-button>
					</el-radio-group>
				</div>

				<!-- 注册表单内容 -->
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

							<el-form-item label="邮箱">
								<div class="email-verification">
									<el-input 
										v-model="admin.email" 
										placeholder="请输入邮箱"
										class="email-input"
									></el-input>
									<el-button 
										type="primary" 
										@click="sendEmailCode('admin')"
										:disabled="adminEmailTimer > 0"
										class="send-code-btn"
									>
										{{ adminEmailTimer > 0 ? `${adminEmailTimer}s后重试` : '发送验证码' }}
									</el-button>
								</div>
							</el-form-item>

							<el-form-item label="验证码">
								<el-input 
									v-model="securityCode" 
									placeholder="请输入邮箱验证码"
								></el-input>
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

							<el-form-item label="邮箱">
								<div class="email-verification">
									<el-input 
										v-model="user.email" 
										placeholder="请输入邮箱"
										class="email-input"
									></el-input>
									<el-button 
										type="primary" 
										@click="sendEmailCode('user')"
										:disabled="userEmailTimer > 0"
										class="send-code-btn"
									>
										{{ userEmailTimer > 0 ? `${userEmailTimer}s后重试` : '发送验证码' }}
									</el-button>
								</div>
							</el-form-item>

							<el-form-item label="验证码">
								<el-input 
									v-model="securityCode" 
									placeholder="请输入邮箱验证码"
								></el-input>
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

							<el-form-item label="邮箱">
								<div class="email-verification">
									<el-input 
										v-model="coach.email" 
										placeholder="请输入邮箱"
										class="email-input"
									></el-input>
									<el-button 
										type="primary" 
										@click="sendEmailCode('coach')"
										:disabled="coachEmailTimer > 0"
										class="send-code-btn"
									>
										{{ coachEmailTimer > 0 ? `${coachEmailTimer}s后重试` : '发送验证码' }}
									</el-button>
								</div>
							</el-form-item>

							<el-form-item label="验证码">
								<el-input 
									v-model="securityCode" 
									placeholder="请输入邮箱验证码"
								></el-input>
							</el-form-item>

							<el-form-item>
								<el-button type="danger" @click="OpendialogVisible1()" :disabled="!coachShow">下一步</el-button>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>

		<!-- 修改用户和教练的弹窗部分 -->

		<!-- 用户信息弹窗 -->
		<el-dialog 
			:visible.sync="dialogVisible" 
			title="完善个人信息" 
			width="400px"
			custom-class="custom-dialog"
		>
			<el-form :model="user" ref="user" label-width="90px" class="info-form">
				<el-form-item label="出生日期" class="form-item">
					<el-date-picker 
						v-model="user.birthday" 
						@blur="CheckUserbirthday()" 
						type="date"
						placeholder="选择日期"
						class="full-width"
					></el-date-picker>
				</el-form-item>

				<el-form-item label="性别" class="form-item">
					<el-radio-group v-model="user.sex">
						<el-radio label="男">男</el-radio>
						<el-radio label="女">女</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="身高" class="form-item">
					<el-input 
						v-model="user.height" 
						@blur="CheckUserHeight()"
						class="with-unit"
					>
						<template slot="append">cm</template>
					</el-input>
				</el-form-item>

				<el-form-item label="体重" class="form-item">
					<el-input 
						v-model="user.weight" 
						@blur="CheckUserWeight()"
						class="with-unit"
					>
						<template slot="append">斤</template>
					</el-input>
				</el-form-item>

				<div class="dialog-footer">
					<el-button @click="CloseDialog()" plain>取消</el-button>
					<el-button 
						type="primary" 
						@click="UserRegister()" 
						:disabled="!userOtherShow"
					>完成注册</el-button>
				</div>
			</el-form>
		</el-dialog>

		<!-- 教练信息弹窗 -->
		<el-dialog 
			:visible.sync="dialogVisible1" 
			title="完善个人信息" 
			width="400px"
			custom-class="custom-dialog"
		>
			<el-form :model="coach" ref="coach" label-width="90px" class="info-form">
				<el-form-item label="出生日期" class="form-item">
					<el-date-picker 
						v-model="coach.birthday" 
						@blur="CheckCoachbirthday()" 
						type="date"
						placeholder="请择日期"
						class="full-width"
					></el-date-picker>
				</el-form-item>

				<el-form-item label="性别" class="form-item">
					<el-radio-group v-model="coach.sex">
						<el-radio label="男">男</el-radio>
						<el-radio label="女">女</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="身高" class="form-item">
					<el-input 
						v-model="coach.height" 
						@blur="CheckCoachHeight()"
						class="with-unit"
					>
						<template slot="append">cm</template>
					</el-input>
				</el-form-item>

				<el-form-item label="体重" class="form-item">
					<el-input 
						v-model="coach.weight" 
						@blur="CheckCoachWeight()"
						class="with-unit"
					>
						<template slot="append">斤</template>
					</el-input>
				</el-form-item>

				<div class="dialog-footer">
					<el-button @click="CloseDialog1()" plain>取消</el-button>
					<el-button 
						type="primary" 
						@click="CoachRegister()" 
						:disabled="!coachOtherShow"
					>完成注册</el-button>
				</div>
			</el-form>
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
					email: '',
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
					email: '',
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
					email: '',
				},
				currentType: 'user', // 默认显示用户注册
				adminEmailTimer: 0,
				userEmailTimer: 0,
				coachEmailTimer: 0,
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
			async sendEmailCode(type) {
				// 获取对应类型的邮箱
				const email = this[type].email;
				
				// 验证邮箱格式
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(email)) {
					this.$notify({
						title: '温馨提示',
						message: '请输入正确的邮箱格式',
						type: 'warning',
						position: 'top-left'
					});
					return;
				}

				try {
					// 调用发送验证码接口
					const response = await this.$api.util.sendEmailCode({ email });
					
					if (response.data.code === 200) {
						this.$notify({
							title: '发送成功',
							message: '验证码已发送到您的邮箱',
							type: 'success',
							position: 'top-left'
						});
						
						// 开始倒计时
						this[`${type}EmailTimer`] = 60;
						const timer = setInterval(() => {
							this[`${type}EmailTimer`]--;
							if (this[`${type}EmailTimer`] <= 0) {
								clearInterval(timer);
							}
						}, 1000);
					} else {
						this.$notify({
							title: '发送失败',
							message: response.data.message || '验证码发送失败，请稍后重试',
							type: 'error',
							position: 'top-left'
						});
					}
				} catch (error) {
					this.$notify({
						title: '发送失败',
						message: '网络错误，请稍后重试',
						type: 'error',
						position: 'top-left'
					});
				}
			},
		}
	}
</script>

<style scoped>
.register-container {
	width: 100vw;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #f5f7fa;
	position: relative;
}

.register-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: 
		linear-gradient(90deg, #f5f7fa 21px, transparent 1%) center,
		linear-gradient(#f5f7fa 21px, transparent 1%) center,
		#e6e8eb;
	background-size: 22px 22px;
	pointer-events: none;
}

.nav-header {
	position: relative;
	z-index: 1;
	padding: 20px 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #ffffff;
	box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.nav-brand {
	display: flex;
	align-items: center;
	gap: 15px;
}

.nav-brand i {
	font-size: 32px;
	color: #2c3e50;
}

.nav-brand h1 {
	font-size: 24px;
	color: #2c3e50;
	margin: 0;
}

.nav-link {
	color: #2c3e50;
	text-decoration: none;
	font-size: 16px;
	transition: color 0.3s ease;
}

.nav-link:hover {
	color: #409EFF;
}

.register-box {
	position: relative;
	z-index: 1;
	display: flex;
	width: 1200px;
	margin: 40px auto;
	background: #ffffff;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
}

.register-left {
	flex: 0 0 400px;
	padding: 40px;
	background-color: #2c3e50;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: white;
}

.welcome-text {
	text-align: center;
}

.welcome-text h2 {
	font-size: 36px;
	margin-bottom: 20px;
	font-weight: 600;
}

.welcome-text p {
	font-size: 18px;
	opacity: 0.8;
	letter-spacing: 1px;
}

.register-right {
	flex: 1;
	padding: 40px;
	background: #ffffff;
}

.register-type-selector {
	text-align: center;
	margin-bottom: 30px;
}

.register-type-selector .el-radio-group {
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.register-type-selector .el-radio-button__inner {
	padding: 12px 25px;
	font-size: 15px;
	border: none;
	background: #f5f7fa;
}

.register-type-selector .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	background-color: #2c3e50;
	color: #ffffff;
	box-shadow: none;
}

/* 表单样式 */
.el-form {
	max-width: 500px;
	margin: 0 auto;
}

.el-form-item {
	margin-bottom: 25px;
}

.el-input__inner {
	height: 45px;
	border-radius: 8px;
	border: 2px solid #edf2f7;
	transition: all 0.3s ease;
}

.el-input__inner:focus {
	border-color: #2c3e50;
	box-shadow: 0 0 0 3px rgba(44,62,80,0.1);
}

.el-button {
	width: 100%;
	height: 45px;
	font-size: 16px;
	font-weight: 600;
	border-radius: 8px;
	letter-spacing: 1px;
	transition: all 0.3s ease;
}

.el-button--primary {
	background-color: #2c3e50;
	border-color: #2c3e50;
}

.el-button--primary:hover {
	background-color: #34495e;
	border-color: #34495e;
	transform: translateY(-2px);
}

/* 邮箱验证码样式 */
.email-verification {
	display: flex;
	gap: 10px;
}

.email-input {
	flex: 1;
}

.send-code-btn {
	width: 120px !important;
}

/* 弹窗样式 */
.custom-dialog {
	border-radius: 15px;
}

.custom-dialog .el-dialog__header {
	background: #2c3e50;
	padding: 20px;
	margin: 0;
}

.custom-dialog .el-dialog__title {
	color: white;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
	.register-box {
		width: 95%;
		flex-direction: column;
	}

	.register-left {
		flex: none;
		padding: 30px;
	}

	.register-right {
		padding: 30px;
	}
}

@media screen and (max-width: 768px) {
	.nav-header {
		padding: 15px 20px;
	}

	.nav-brand h1 {
		font-size: 20px;
	}

	.register-type-selector .el-radio-button__inner {
		padding: 10px 15px;
		font-size: 14px;
	}

	.email-verification {
		flex-direction: column;
	}

	.send-code-btn {
		width: 100% !important;
	}
}
</style>