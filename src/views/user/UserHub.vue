<template>
	<div class="user-hub">
		<div class="page-header">
			<h2>个人信息管理</h2>
			<div class="header-line"></div>
		</div>

		<div class="info-container">
			<!-- 基本信息部分 -->
			<div class="info-section">
				<h3>基本信息</h3>
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="info-item">
							<label>用户名</label>
							<el-input v-model="user.username" :readonly="true" class="info-input"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="info-item">
							<label>性别</label>
							<div class="gender-buttons">
								<el-button :type="user.sex === 1 ? 'primary' : ''" @click="setSex(1)">男</el-button>
								<el-button :type="user.sex === 0 ? 'primary' : ''" @click="setSex(0)">女</el-button>
							</div>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="info-item">
							<label>电话</label>
							<el-input @blur="CheckTel()" v-model="user.tel" class="info-input"></el-input>
						</div>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="8">
						<div class="info-item">
							<label>真实姓名</label>
							<el-input @blur="CheckName()" v-model="user.name" class="info-input"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="info-item">
							<label>出生日期</label>
							<el-date-picker
								v-model="user.birthday"
								type="date"
								placeholder="选择日期"
								@blur="CheckBirthday()"
								class="info-input">
							</el-date-picker>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="info-item">
							<label>年龄</label>
							<el-input v-model="user.age" :readonly="true" class="info-input"></el-input>
						</div>
					</el-col>
				</el-row>
			</div>

			<!-- 身体数据部分 -->
			<div class="info-section">
				<h3>身体数据</h3>
				<el-row :gutter="20">
					<el-col :span="6">
						<div class="info-item">
							<label>身高(m)</label>
							<el-input @blur="CheckHeight()" v-model="user.height" class="info-input"></el-input>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="info-item">
							<label>体重(斤)</label>
							<el-input @blur="CheckWeight()" v-model="user.weight" class="info-input"></el-input>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="info-item">
							<label>BMI</label>
							<el-input v-model="user.bmi" :readonly="true" class="info-input"></el-input>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="info-item">
							<label>会员状态</label>
							<el-tag :type="user.vipstatus === '是' ? 'success' : 'info'" class="vip-tag">
								{{ user.vipstatus }}
							</el-tag>
						</div>
					</el-col>
				</el-row>
			</div>

			<!-- 账户信息部分 -->
			<div class="info-section">
				<h3>账户信息</h3>
				<el-row :gutter="20">
					<el-col :span="12">
						<div class="info-item">
							<label>注册时间</label>
							<el-input v-model="user.enrolldate" :readonly="true" class="info-input"></el-input>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="info-item">
							<label>上次登录时间</label>
							<el-input v-model="user.lastlogindate" :readonly="true" class="info-input"></el-input>
						</div>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<div class="info-item balance-item">
							<label>账户余额</label>
							<span class="balance-amount">¥ {{ user.accountbalance }}</span>
						</div>
					</el-col>
				</el-row>
			</div>

			<div class="actions">
				<el-button 
					type="primary" 
					@click="updateUser()" 
					:disabled="!userShow"
					icon="el-icon-check"
					class="submit-btn">
					保存修改
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					username: '',
					passcode: '',
					name: '',
					sex: '',
					age: '',
					tel: '',
					height: '',
					weight: '',
					bmi: '',
					birthday: '',
					enrolldate: '',
					accountbalance: 0,
					vipstatus: '',
					lastlogindate: ''
				},
			}
		},
		mounted() {
			const params = {
				id: this.$store.state.tab.userData.id,
			}
			this.$api.user.getUserById(params).then((resp) => {
				this.$set(this.$data, 'user', resp.data.data);
				this.user.vipstatus = this.user.vipstatus.toString() === '1' ? '是' : '否';
				this.user.enrolldate = this.user.enrolldate.toString().replaceAll(',', '-');
				this.user.lastlogindate = this.user.lastlogindate.toString().replaceAll(',', '-');
				this.user.bmi = this.user.bmi.toString().substring(0, 4);
				this.user.birthday = new Date(this.user.birthday);
			})
		},
		computed: {
			userShow() {
				return this.user.tel !== '' && this.user.birthday !== '' && this.user.height !== '' && this.user.name !==
					'' && this
					.user.weight !== '';
			}
		},
		methods: {
			updateUser() {
				const data = {
					name: this.user.name,
					tel: this.user.tel,
					birthday: this.user.birthday,
					height: this.user.height,
					weight: this.user.weight,
					id: this.user.id,
					sex: this.user.sex
				}
				this.$api.user.updateUser(data).then((resp) => {
					if (resp.data.code === 200) {
						this.$message({
							message: '修改信息成功!',
							type: 'success'
						});
						this.$store.commit('setUserData', resp.data.data);
						this.$set(this.$data, 'user', resp.data.data);
						this.user.vipstatus = this.user.vipstatus.toString() === '1' ? '是' : '否';
						this.user.enrolldate = this.user.enrolldate.toString().replaceAll(',', '-');
						this.user.lastlogindate = this.user.lastlogindate.toString().replaceAll(',', '-');
						this.user.bmi = this.user.bmi.toString().substring(0, 4);
						this.user.birthday = new Date(this.user.birthday);
					} else {
						this.$message({
							message: '未知错误!',
							type: 'success'
						});
					}
				})
			},
			Hint(msg) {
				this.$notify({
					title: '温馨提示',
					message: msg,
					position: 'top-left'
				});
			},
			setSex(sex) {
				this.user.sex = sex;
			},
			CheckTel() {
				if (this.user.tel !== '') {
					if (!/^\d{11}$/.test(this.user.tel)) {
						this.Hint('电话长度必须为11且必须为数字');
						this.user.tel = ''
						return false;
					}
				}
				return true;
			},
			CheckName() {
				if (this.user.name !== '') {
					const nameLength = this.user.name.length;
					if (nameLength > 20) {
						this.Hint('真实姓名长度不得超过20');
						this.user.name = '';
						return false;
					}
				}
				return true;
			},
			CheckBirthday() {
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
						return true;
					} else {
						// 用户年龄不合法
						this.Hint('您输入的出生日期不合法!请确保您的年龄在[14,120]之间!');
						this.user.birthday = '';
						return false;
					}
				} else {
					return false;
				}
			},
			CheckHeight() {
				if (this.user.height !== '') {
					const isNumeric = /^[0-9]+$/.test(this.user.height);
					if (!isNumeric || this.user.height < 60 || this.user.height > 250) {
						this.Hint('请您输入正确的身高,不要太离谱!');
						this.user.height = '';
						return false;
					}
				}
				return true;
			},
			CheckWeight() {
				if (this.user.weight !== '') {
					console.log(this.user.weight)
					const isNumeric = /^[0-9]+$/.test(this.user.weight);
					if (!isNumeric || this.user.weight < 60 || this.user.weight > 300) {
						this.Hint('请您输入正确的体重,不要太离谱!');
						this.user.weight = '';
						return false;
					}
				}
				return true;
			},
		}
	}
</script>

<style scoped>
.user-hub {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: calc(100vh - 120px);
}

.page-header {
	margin-bottom: 30px;
	text-align: center;
}

.page-header h2 {
	color: #303133;
	font-size: 24px;
	font-weight: 600;
	margin: 0;
	padding-bottom: 15px;
}

.header-line {
	width: 50px;
	height: 3px;
	background: #409EFF;
	margin: 0 auto;
}

.info-container {
	max-width: 1200px;
	margin: 0 auto;
}

.info-section {
	background: #fff;
	border-radius: 8px;
	padding: 25px;
	margin-bottom: 20px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
	color: #303133;
	font-size: 18px;
	font-weight: 600;
	margin: 0 0 20px;
	padding-bottom: 10px;
	border-bottom: 1px solid #ebeef5;
}

.info-item {
	margin-bottom: 20px;
}

.info-item label {
	display: block;
	color: #606266;
	font-size: 14px;
	margin-bottom: 8px;
}

.info-input {
	width: 100%;
}

.info-input :deep(.el-input__inner) {
	height: 40px;
	line-height: 40px;
}

.gender-buttons {
	display: flex;
	gap: 10px;
}

.gender-buttons .el-button {
	flex: 1;
	height: 40px;
}

.vip-tag {
	font-size: 14px;
	padding: 8px 15px;
}

.balance-item {
	text-align: center;
}

.balance-amount {
	font-size: 24px;
	color: #67C23A;
	font-weight: bold;
}

.actions {
	text-align: center;
	margin-top: 30px;
}

.submit-btn {
	width: 180px;
	height: 45px;
	font-size: 16px;
}

.el-row {
	margin-bottom: 20px;
	&:last-child {
		margin-bottom: 0;
	}
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
	.el-col {
		width: 100% !important;
	}
	
	.info-section {
		padding: 15px;
	}
}
</style>