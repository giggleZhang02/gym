<template>
	<div class="login-container">
		<div class="login-background"></div>
		
		<div class="login-box">
			<div class="login-left">
				<div class="brand">
					<el-icon class="el-icon-platform-eleme"></el-icon>
					<h1>FitHub</h1>
				</div>
				<div class="welcome-text">
					<h2>欢迎回来</h2>
					<p>开启您的健身之旅</p>
				</div>
			</div>

			<div class="login-right">
				<div class="login-form">
					<h2>用户登录</h2>
					<div class="error-msg" v-if="loginMsg">{{ loginMsg }}</div>
					
					<form @submit.prevent="login">
						<div class="form-group">
							<el-input 
								v-model="loginInfo.username"
								@focus="LoginUsernameShow"
								placeholder="请输入用户名"
								prefix-icon="el-icon-user"
							>
							</el-input>
						</div>

						<div class="form-group">
							<el-input 
								type="password"
								v-model="loginInfo.password"
								@focus="LoginPasswordShow"
								placeholder="请输入密码"
								prefix-icon="el-icon-lock"
							>
							</el-input>
						</div>

						<div class="form-options">
							<el-radio-group v-model="loginInfo.type" size="medium">
								<el-radio label="用户">用户</el-radio>
								<el-radio label="管理员">管理员</el-radio>
								<el-radio label="教练">教练</el-radio>
							</el-radio-group>
						</div>

						<div class="remember-me">
							<el-switch
								v-model="loginInfo.delivery"
								active-text="记住密码"
							/>
						</div>

						<div class="form-buttons">
							<el-button 
								type="primary" 
								class="login-btn"
								:disabled="!isShow"
								native-type="submit"
							>登录</el-button>
							
							<div class="other-options">
								<el-button type="text" @click="register">注册账号</el-button>
								<el-button type="text" @click="forget">忘记密码？</el-button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LoginView',
	data() {
		return {
			name: '',
			echoTime: 60 * 60,
			loginMsg: '',
			loginInfo: {
				type: '',
				username: '',
				password: '',
				delivery: false,
			},
		}
	},
	mounted() {
		this.echo();
	},
	computed: {
		isShow() {
			return this.loginInfo.username !== '' && this.loginInfo.password !== '' && this.loginInfo.type !== ''
		}
	},
	methods: {
		login() {
			if (this.loginInfo.type === '管理员') {
				this.$api.admin.login(this.loginInfo).then((resp) => {
					if (resp.data.code === 0) this.loginMsg = '用户名或密码错误';
					else {
						localStorage.setItem('type', '管理员');
						localStorage.setItem('AdminToken', resp.data.data.token);
						this.remeber();
						this.$store.commit('setAdminData', resp.data.data);
						this.$router.push({
							path: '/adminMain',
						});
					}
				})
			} else if (this.loginInfo.type === '用户') {
				this.$api.user.login(this.loginInfo).then((resp) => {
					if (resp.data.code === 0) this.loginMsg = '用户名或密码错误';
					else {
						localStorage.setItem('type', '用户');
						localStorage.setItem('UserToken', resp.data.data.token);
						this.remeber();
						this.$store.commit('setUserData', resp.data.data);
						this.$router.push({
							path: '/userMain',
						});
					}
				})
			} else {
				this.$api.coach.login(this.loginInfo).then((resp) => {
					if (resp.data.code === 0) this.loginMsg = '用户名或密码错误';
					else {
						localStorage.setItem('type', '教练');
						localStorage.setItem('CoachToken', resp.data.data.token);
						this.remeber();
						this.$store.commit('setCoachData', resp.data.data);
						this.$router.push({
							path: '/coachMain',
						});
					}
				})
			}
		},
		echo() {
			const username = this.getCookie('username');
			const password = this.getCookie('password');
			if (username && password) {
				this.loginInfo.username = username;
				this.loginInfo.password = password;
				this.loginInfo.delivery = true;
			}
		},
		remeber() {
			if (this.loginInfo.delivery) {
				this.setCookie('username', this.loginInfo.username, this.echoTime);
				this.setCookie('password', this.loginInfo.password, this.echoTime);
			} else {
				this.deleteCookie('username');
				this.deleteCookie('password');
			}
		},
		setCookie(name, value, seconds) {
			const date = new Date();
			date.setTime(date.getTime() + (seconds * 1000));
			const expires = '; expires=' + date.toUTCString();
			document.cookie = name + '=' + value + expires + '; path=/';
		},
		deleteCookie(name) {
			document.cookie = name + '=; Max-Age=-99999999;';
		},
		getCookie(name) {
			const cookies = document.cookie.split('; ');
			for (let cookie of cookies) {
				const [cookieName, cookieValue] = cookie.split('=');
				if (cookieName === name) {
					return cookieValue;
				}
			}
			return null;
		},
		LoginUsernameShow() {
			this.loginMsg = '';
			this.loginInfo.username = '';
		},
		LoginPasswordShow() {
			this.loginMsg = '';
			this.loginInfo.password = '';
		},
		register() {
			this.$router.push({
				path: '/allRegister',
			});
		},
		forget() {
			this.$router.push({
				path: '/allForget',
			});
		}
	}
}
</script>

<style>
/* 添加全局样式重置 */
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
</style>

<style scoped>
/* 移除 html, body 的样式（因为在 scoped 中不会生效），改为在上面的全局样式中设置 */

.login-container {
	min-height: 100vh;
	width: 100vw;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradientBG 15s ease infinite;
	position: relative;
	overflow: hidden;
	/* 移除 margin 和 padding */
	margin: 0;
	padding: 0;
	/* 添加以下属性 */
	position: fixed;
	top: 0;
	left: 0;
}

.login-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100vw;
	height: 100vh;
	background-image: 
		radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%),
			radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%);
	background-size: 100px 100px;
	pointer-events: none;
	opacity: 0.3;
	z-index: 0;
}

.login-box {
	position: relative;
	z-index: 1;
	display: flex;
	width: 1000px;
	height: 600px;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	animation: boxFadeIn 0.8s ease-out;
}

@keyframes boxFadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.login-left {
	flex: 1;
	padding: 40px;
	background: linear-gradient(135deg, #00B4DB, #0083B0);
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: white;
	position: relative;
	overflow: hidden;
}

/* 添加左侧装饰效果 */
.login-left::before {
	content: '';
	position: absolute;
	top: -50%;
	left: -50%;
	width: 200%;
	height: 200%;
	background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
	animation: rotate 30s linear infinite;
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.brand {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 40px;
}

.brand i {
	font-size: 40px;
}

.brand h1 {
	font-size: 36px;
	font-weight: 700;
}

.welcome-text h2 {
	font-size: 32px;
	margin-bottom: 20px;
}

.welcome-text p {
	font-size: 18px;
	opacity: 0.8;
}

.login-right {
	flex: 1;
	padding: 40px;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
}

.login-form {
	max-width: 400px;
	margin: 0 auto;
}

.login-form h2 {
	color: #303133;
	text-align: center;
	margin-bottom: 30px;
	font-size: 24px;
}

.form-group {
	margin-bottom: 20px;
}

.form-group .el-input__inner {
	height: 45px;
	border-radius: 8px;
	border: 1px solid rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.form-group .el-input__inner:focus {
	border-color: #409EFF;
	box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.form-options {
	margin: 20px 0;
}

.remember-me {
	margin: 20px 0;
}

.login-btn {
	width: 100%;
	height: 45px;
	font-size: 16px;
	border-radius: 8px;
	background: linear-gradient(135deg, #00B4DB, #0083B0);
	border: none;
	transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(0, 180, 219, 0.3);
}

.other-options {
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
}

.error-msg {
	color: #F56C6C;
	text-align: center;
	margin-bottom: 20px;
}

@media (max-width: 768px) {
	.login-box {
		width: 90%;
		flex-direction: column;
		height: auto;
		margin: 20px;
	}

	.login-left {
		padding: 30px;
	}

	.login-right {
		padding: 30px;
	}

	.form-group .el-input__inner {
		height: 40px;
	}
}

/* 覆盖 Element UI 的一些默认样式 */
.el-button--text {
	color: #606266;
}

.el-button--text:hover {
	color: #409EFF;
}

.el-radio {
	margin-right: 20px;
}

.el-radio__label {
	color: #606266;
}
</style>