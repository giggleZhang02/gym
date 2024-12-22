<template>
	<div class="coach-hub">
		<div class="page-header">
			<h2>个人信息管理</h2>
			<div class="header-line"></div>
		</div>

		<div class="form-container">
			<!-- 基本信息部分 -->
			<div class="section-card">
				<h3 class="section-title">
					<i class="el-icon-user"></i>
					基本信息
				</h3>
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="form-item">
							<label>用户名</label>
							<el-input v-model="coach.username" :readonly="true"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="form-item">
							<label>性别</label>
							<div class="gender-buttons">
								<el-button :type="coach.sex === 1 ? 'primary' : ''" @click="setSex(1)">男</el-button>
								<el-button :type="coach.sex === 0 ? 'primary' : ''" @click="setSex(0)">女</el-button>
							</div>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="form-item">
							<label>电话</label>
							<el-input @blur="CheckTel()" v-model="coach.tel"></el-input>
						</div>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="8">
						<div class="form-item">
							<label>真实姓名</label>
							<el-input @blur="CheckName()" v-model="coach.name"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="form-item">
							<label>出生日期</label>
							<el-date-picker
								v-model="coach.birthday"
								type="date"
								placeholder="选择日期"
								@blur="CheckBirthday()">
							</el-date-picker>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="form-item">
							<label>年龄</label>
							<el-input :readonly="true" v-model="coach.age"></el-input>
						</div>
					</el-col>
				</el-row>
			</div>

			<!-- 身体数据部分 -->
			<div class="section-card">
				<h3 class="section-title">
					<i class="el-icon-data-line"></i>
					身体数据
				</h3>
				<el-row :gutter="20">
					<el-col :span="6">
						<div class="form-item">
							<label>身高(m)</label>
							<el-input @blur="CheckHeight()" v-model="coach.height"></el-input>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="form-item">
							<label>体重(斤)</label>
							<el-input @blur="CheckWeight()" v-model="coach.weight"></el-input>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="form-item">
							<label>BMI</label>
							<el-input v-model="coach.bmi" :readonly="true"></el-input>
						</div>
					</el-col>
				</el-row>
			</div>

			<!-- 专业信息部分 -->
			<div class="section-card">
				<h3 class="section-title">
					<i class="el-icon-medal"></i>
					专业信息
				</h3>
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="form-item">
							<label>专业领域</label>
							<el-input @blur="CheckProfessionalField()" v-model="coach.professionalfield"></el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="form-item">
							<label>证书</label>
							<el-input @blur="CheckCertificate()" v-model="coach.certificate"></el-input>
						</div>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<div class="form-item">
							<label>简介</label>
							<el-input type="textarea" rows="3" @blur="CheckIntroduction()" v-model="coach.introduction"></el-input>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="form-item">
							<label>工作经验</label>
							<el-input type="textarea" rows="3" @blur="CheckWorkExperience()" v-model="coach.workexperience"></el-input>
						</div>
					</el-col>
				</el-row>
			</div>

			<!-- 账户信息部分 -->
			<div class="section-card">
				<h3 class="section-title">
					<i class="el-icon-time"></i>
					账户信息
				</h3>
				<el-row :gutter="20">
					<el-col :span="12">
						<div class="form-item">
							<label>注册时间</label>
							<el-input :readonly="true" v-model="enrolldate"></el-input>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="form-item">
							<label>上一次登录时间</label>
							<el-input :readonly="true" v-model="lastlogindate"></el-input>
						</div>
					</el-col>
				</el-row>
			</div>

			<!-- 提交按钮 -->
			<div class="submit-section">
				<el-button 
					type="primary" 
					:disabled="!coachShow"
					@click="updateCoach()"
					icon="el-icon-check">
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
				coach: {
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
					lastlogindate: ''
				},
			}
		},
		mounted() {
			const params = {
				id: this.$store.state.tab.coachData.id,
			}
			this.$api.coach.getCoachById(params).then((resp) => {
				this.$set(this.$data, 'coach', resp.data.data);
				this.coach.bmi = this.coach.bmi.toString().substring(0, 4);
				this.coach.birthday = new Date(this.coach.birthday);
			})
		},
		computed: {
			coachShow() {
				return this.coach.tel !== '' && this.coach.birthday !== '' && this.coach.height !== '' && this.coach
					.name !== '' && this
					.coach.weight !== '' && this.coach.professionalfield !== '' && this.coach.certificate !== '' && this
					.coach.introduction !== '' && this.coach.workexperience !== '';
			},
			enrolldate(){
				return this.coach.enrolldate.toString().replaceAll(',', '-');
			},
			lastlogindate(){
				return this.coach.lastlogindate.toString().replaceAll(',', '-');
			}
		},
		methods: {
			updateCoach() {
				this.$api.coach.updateCoach(this.coach).then((resp) => {
					if (resp.data.code === 200) {
						this.$message({
							message: '修改信息成功!',
							type: 'success'
						});
						this.$store.commit('setCoachData', resp.data.data);
						this.$set(this.$data, 'coach', resp.data.data);
						this.coach.bmi = this.coach.bmi.toString().substring(0, 4);
						this.coach.birthday = new Date(this.coach.birthday);
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
				this.coach.sex = sex;
			},
			CheckTel() {
				if (this.coach.tel !== '') {
					if (!/^\d{11}$/.test(this.coach.tel)) {
						this.Hint('电话长度必须为11且必须为数字');
						this.coach.tel = ''
						return false;
					}
				}
				return true;
			},
			CheckName() {
				if (this.coach.name !== '') {
					const nameLength = this.coach.name.length;
					if (nameLength > 20) {
						this.Hint('真实姓名长度不得超过20');
						this.coach.name = '';
						return false;
					}
				}
				return true;
			},
			CheckBirthday() {
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
						return true;
					} else {
						// 用户年龄不合法
						this.Hint('您输入的出生日期不合法!请确保您的年龄在[14,120]之间!');
						this.coach.birthday = '';
						return false;
					}
				} else {
					return false;
				}
			},
			CheckHeight() {
				if (this.coach.height !== '') {
					const isNumeric = /^[0-9]+$/.test(this.coach.height);
					if (!isNumeric || this.coach.height < 60 || this.coach.height > 250) {
						this.Hint('请您输入正确的身高,不要太离��!');
						this.coach.height = '';
						return false;
					}
				}
				return true;
			},
			CheckWeight() {
				if (this.coach.weight !== '') {
					console.log(this.coach.weight)
					const isNumeric = /^[0-9]+$/.test(this.coach.weight);
					if (!isNumeric || this.coach.weight < 60 || this.coach.weight > 300) {
						this.Hint('请您输入正确的体重,不要太离谱!');
						this.coach.weight = '';
						return false;
					}
				}
				return true;
			},
			CheckProfessionalField() {
				const professionalfield = this.coach.professionalfield;
				if (professionalfield !== '') {
					if (professionalfield.length > 100) {
						this.Hint('长度不要超过100字符!');
						this.coach.professionalfield = '';
					}
				}
			},
			CheckCertificate() {
				const certificate = this.coach.certificate;
				if (certificate !== '') {
					if (certificate.length > 200) {
						this.Hint('长度不要超过200字符!');
						this.coach.certificate = '';
					}
				}
			},
			CheckIntroduction() {
				const introduction = this.coach.introduction;
				if (introduction !== '') {
					if (introduction.length > 1000) {
						this.Hint('长度不要超过1000字符!');
						this.coach.introduction = '';
					}
				}
			},
			CheckWorkExperience() {
				const workexperience = this.coach.workexperience;
				if (workexperience !== '') {
					if (workexperience.length > 1000) {
						this.Hint('长度不要超过1000字符!');
						this.coach.workexperience = '';
					}
				}
			},
		}
	}
</script>

<style lang="less" scoped>
.coach-hub {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: calc(100vh - 120px);
}

.page-header {
	text-align: center;
	margin-bottom: 30px;

	h2 {
		color: #303133;
		font-size: 24px;
		margin-bottom: 10px;
	}

	.header-line {
		width: 50px;
		height: 3px;
		background: #409EFF;
		margin: 0 auto;
	}
}

.form-container {
	max-width: 1200px;
	margin: 0 auto;
}

.section-card {
	background: #fff;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 20px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

	.section-title {
		color: #303133;
		font-size: 18px;
		margin-bottom: 20px;
		display: flex;
		align-items: center;
		gap: 8px;

		i {
			color: #409EFF;
		}
	}
}

.form-item {
	margin-bottom: 20px;

	label {
		display: block;
		color: #606266;
		margin-bottom: 8px;
		font-weight: 500;
	}

	.el-input, .el-date-picker {
		width: 100%;
	}

	.el-textarea {
		font-size: 14px;
	}
}

.gender-buttons {
	display: flex;
	gap: 10px;

	.el-button {
		flex: 1;
	}
}

.submit-section {
	text-align: center;
	margin-top: 30px;

	.el-button {
		padding: 12px 40px;
		font-size: 16px;
	}
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
	.el-col {
		width: 100% !important;
	}

	.section-card {
		padding: 15px;
	}

	.form-item {
		margin-bottom: 15px;
	}
}
</style>