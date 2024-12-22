<template>
	<div class="forget-container">
		<div class="forget-background"></div>
		
		<!-- 导航栏 -->
		<div class="nav-header">
			<div class="nav-brand">
				<i class="el-icon-platform-eleme"></i>
				<h1>FitHub 密码找回</h1>
			</div>
			<router-link to="/" class="nav-link">返回登录</router-link>
		</div>

		<!-- 主要内容区域 -->
		<div class="content-box">
			<div class="info-card">
				<div class="card-header">
					<i class="el-icon-warning-outline"></i>
					<h2>密码找回说明</h2>
				</div>

				<div class="card-content">
					<p class="notice-text">
						亲爱的用户，为了保证账号安全，密码找回需要联系管理员进行身份验证。
						请通过以下方式联系我们：
					</p>

					<div class="contact-methods">
						<div class="contact-item">
							<i class="el-icon-message"></i>
							<div class="contact-info">
								<h3>电子邮件</h3>
								<p>steam@qq.com</p>
							</div>
						</div>

						<div class="contact-item">
							<i class="el-icon-mobile-phone"></i>
							<div class="contact-info">
								<h3>客服热线</h3>
								<p>400-888-8888</p>
							</div>
						</div>

						<div class="contact-item">
							<i class="el-icon-chat-dot-round"></i>
							<div class="contact-info">
								<h3>在线客服</h3>
								<p>工作时间: 9:00-18:00</p>
							</div>
						</div>
					</div>

					<div class="steps-info">
						<h3>找回步骤：</h3>
						<el-steps :active="1" simple>
							<el-step title="联系管理员" icon="el-icon-message"></el-step>
							<el-step title="验证身份" icon="el-icon-user"></el-step>
							<el-step title="重置密码" icon="el-icon-key"></el-step>
						</el-steps>
					</div>

					<div class="quick-actions">
						
						<el-button @click="copyEmail" icon="el-icon-document-copy">
							复制邮箱
						</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ForgetPassword',
	methods: {
		startChat() {
			this.$message({
				message: '正在连接客服系统...',
				type: 'success'
			});
		},
		copyEmail() {
			navigator.clipboard.writeText('admin@fithub.com').then(() => {
				this.$message({
					message: '邮箱地址已复制到剪贴板',
					type: 'success'
				});
			});
		}
	}
}
</script>

<style scoped>
.forget-container {
	width: 100vw;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #f5f7fa;
	position: relative;
}

.forget-background {
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

.content-box {
	position: relative;
	z-index: 1;
	padding: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
}

.info-card {
	background: #ffffff;
	border-radius: 20px;
	box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
	width: 100%;
	max-width: 800px;
	overflow: hidden;
}

.card-header {
	background: #2c3e50;
	color: white;
	padding: 30px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 15px;
}

.card-header i {
	font-size: 48px;
}

.card-header h2 {
	margin: 0;
	font-size: 28px;
	font-weight: 600;
}

.card-content {
	padding: 40px;
}

.notice-text {
	font-size: 16px;
	line-height: 1.6;
	color: #2c3e50;
	text-align: center;
	margin-bottom: 40px;
}

.contact-methods {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 30px;
	margin-bottom: 40px;
}

.contact-item {
	display: flex;
	align-items: center;
	gap: 15px;
	padding: 20px;
	background: #f8fafc;
	border-radius: 12px;
	transition: transform 0.3s ease;
}

.contact-item:hover {
	transform: translateY(-5px);
}

.contact-item i {
	font-size: 32px;
	color: #2c3e50;
}

.contact-info h3 {
	margin: 0 0 5px 0;
	font-size: 18px;
	color: #2c3e50;
}

.contact-info p {
	margin: 0;
	color: #64748b;
}

.steps-info {
	margin-bottom: 40px;
}

.steps-info h3 {
	margin-bottom: 20px;
	color: #2c3e50;
}

.quick-actions {
	display: flex;
	gap: 20px;
	justify-content: center;
}

.quick-actions .el-button {
	padding: 12px 30px;
	font-size: 16px;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
	.nav-header {
		padding: 15px 20px;
	}

	.nav-brand h1 {
		font-size: 20px;
	}

	.content-box {
		padding: 20px;
	}

	.card-content {
		padding: 20px;
	}

	.contact-methods {
		grid-template-columns: 1fr;
	}

	.quick-actions {
		flex-direction: column;
	}

	.quick-actions .el-button {
		width: 100%;
	}
}
</style>