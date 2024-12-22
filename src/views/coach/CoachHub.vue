<template>
	<div style="text-align: center;">

		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<label>教练信息修改</label>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<label>用户名</label>
					<el-input class="userHubInput" v-model="coach.username" :readonly="true"></el-input>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple-light">
					<label>性别</label><br>
					<el-button style="width: 120px;" :type="coach.sex === 1 ? 'primary' : ''" @click="setSex(1)">
						男
					</el-button>
					<el-button style="width: 120px;" :type="coach.sex === 0 ? 'primary' : ''" @click="setSex(0)">
						女
					</el-button>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<label>电话</label>
					<el-input class="userHubInput" @blur="CheckTel()" v-model="coach.tel"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<label>真实姓名</label>
					<el-input class="userHubInput" @blur="CheckName()" v-model="coach.name"></el-input>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple-light">
					<div class="block">
						<label>出生日期</label><br>
						<el-date-picker style="margin-top: 7px;width: 350px;" @blur="CheckBirthday()"
							v-model="coach.birthday" type="date" placeholder="选择日期">
						</el-date-picker>
					</div>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<label>年龄</label>
					<el-input class="userHubInput" :readonly="true" v-model="coach.age"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="5">
				<div class="grid-content bg-purple">
					<label>身高(m)</label>
					<el-input class="userHubInput" @blur="CheckHeight()" v-model="coach.height"></el-input>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="grid-content bg-purple-light">
					<label>体重(斤)</label>
					<el-input class="userHubInput" @blur="CheckWeight()" v-model="coach.weight"></el-input>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="grid-content bg-purple">
					<label>BMI</label>
					<el-input class="userHubInput" v-model="coach.bmi" :readonly="true"></el-input>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="grid-content bg-purple-light">
					<label>专业领域</label>
					<el-input class="userHubInput" @blur="CheckProfessionalField()"
						v-model="coach.professionalfield"></el-input>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="grid-content bg-purple">
					<label>证书</label>
					<el-input class="userHubInput" @blur="CheckCertificate()" v-model="coach.certificate"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="12">
				<div class="grid-content bg-purple">
					<label>简介</label>
					<el-input class="userHubInput" @blur="CheckIntroduction()" v-model="coach.introduction"></el-input>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content bg-purple-light">
					<label style="text-align: center;">工作经验</label>
					<el-input class="userHubInput" @blur="CheckWorkExperience()"
						v-model="coach.workexperience"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="12">
				<div class="grid-content bg-purple">
					<label>注册时间</label>
					<el-input class="userHubInput" :readonly="true" v-model="enrolldate"></el-input>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content bg-purple-light">
					<label style="text-align: center;">上一次登录时间</label>
					<el-input class="userHubInput" :readonly="true" v-model="lastlogindate"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-button style="width: 120px;" @click="updateCoach()" :disabled="!coachShow" type="success">修改</el-button>

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
						this.Hint('请您输入正确的身高,不要太离谱!');
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

<style scoped>
	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.bg-purple-dark {
		padding-top: 20px;
		;
		text-align: center;
		height: 70px;
		background: #99a9bf;
	}

	.userHubInput {
		margin-top: 7px;
	}

	.bg-purple {
		padding-top: 5px;
		text-align: center;
		margin-left: 5px;
		height: 70px;
		background: #d3dce6;
	}

	.bg-purple-light {
		padding-top: 5px;
		text-align: center;
		margin-left: 5px;
		height: 70px;
		background: #e5e9f2;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
</style>