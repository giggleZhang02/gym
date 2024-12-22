<template>
	<div class="login-container">
		<div class="login-background"></div>
		
		<div class="login-box">
			<div class="login-left">
				<div class="brand">
					<i class="el-icon-platform-eleme"></i>
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

<style lang="less" scoped>
.login-container {
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f5f7fa;
	position: relative;
}

.login-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100vw;
	height: 100vh;
	background: 
		linear-gradient(90deg, #f5f7fa 21px, transparent 1%) center,
		linear-gradient(#f5f7fa 21px, transparent 1%) center,
		#e6e8eb;
	background-size: 22px 22px;
	pointer-events: none;
}

.login-box {
	position: relative;
	z-index: 1;
	display: flex;
	width: 1000px;
	height: 600px;
	background: #ffffff;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

.login-left {
	flex: 1;
	padding: 40px;
	background-color: #2c3e50;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: white;
	position: relative;
}

.brand {
	display: flex;
	align-items: center;
	gap: 15px;
	margin-bottom: 60px;

	i {
		font-size: 48px;
	}

	h1 {
		font-size: 42px;
		font-weight: 700;
		letter-spacing: 1px;
	}
}

.welcome-text {
	h2 {
		font-size: 36px;
		margin-bottom: 20px;
		font-weight: 600;
	}

	p {
		font-size: 18px;
		opacity: 0.8;
		letter-spacing: 1px;
	}
}

.login-right {
	flex: 1;
	padding: 40px;
	background: #ffffff;
}

.login-form {
	max-width: 400px;
	margin: 0 auto;

	h2 {
		color: #2c3e50;
		text-align: center;
		margin-bottom: 40px;
		font-size: 28px;
		font-weight: 600;
	}
}

.form-group {
	margin-bottom: 25px;

	.el-input__inner {
		height: 50px;
		border-radius: 10px;
		border: 2px solid #edf2f7;
		padding-left: 45px;
		font-size: 15px;
		transition: all 0.3s ease;

		&:focus {
			border-color: #2c3e50;
			box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
		}
	}

	.el-input__prefix {
		left: 15px;
		font-size: 18px;
		color: #2c3e50;
	}
}

.form-options {
	margin: 25px 0;
	display: flex;
	justify-content: center;
}

.remember-me {
	margin: 25px 0;
}

.login-btn {
	width: 100%;
	height: 50px;
	font-size: 16px;
	font-weight: 600;
	border-radius: 10px;
	background-color: #2c3e50;
	border: none;
	letter-spacing: 1px;
	transition: all 0.3s ease;

	&:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(44, 62, 80, 0.2);
	}

	&:disabled {
		background-color: #a0aec0;
	}
}

.other-options {
	display: flex;
	justify-content: space-between;
	margin-top: 25px;
}

.error-msg {
	color: #e53e3e;
	text-align: center;
	margin-bottom: 20px;
	font-size: 14px;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
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

	.brand {
		margin-bottom: 30px;
		
		i {
			font-size: 36px;
		}

		h1 {
			font-size: 32px;
		}
	}

	.welcome-text {
		h2 {
			font-size: 28px;
		}

		p {
			font-size: 16px;
		}
	}
}

/* Element UI 样式覆盖 */
.el-radio {
	margin-right: 25px;
	
	.el-radio__label {
		font-size: 15px;
		color: #2c3e50;
	}
}

.el-button--text {
	color: #2c3e50;
	font-size: 14px;
	font-weight: 500;

	&:hover {
		color: #34495e;
	}
}

.el-switch__label {
	color: #2c3e50;
}
</style>