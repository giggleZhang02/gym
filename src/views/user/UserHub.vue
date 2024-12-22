<template>
	<div style="text-align: center;">

		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark">
					<label>用户信息修改</label>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<label>用户名</label>
					<el-input class="userHubInput" v-model="user.username" :readonly="true"></el-input>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple-light">
					<label>性别</label><br>
					<el-button style="width: 120px;" :type="user.sex === 1 ? 'primary' : ''" @click="setSex(1)">
						男
					</el-button>
					<el-button style="width: 120px;" :type="user.sex === 0 ? 'primary' : ''" @click="setSex(0)">
						女
					</el-button>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<label>电话</label>
					<el-input class="userHubInput" @blur="CheckTel()" v-model="user.tel"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<label>真实姓名</label>
					<el-input class="userHubInput" @blur="CheckName()" v-model="user.name"></el-input>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple-light">
					<div class="block">
						<label>出生日期</label><br>
						<el-date-picker style="margin-top: 7px;width: 350px;" @blur="CheckBirthday()"
							v-model="user.birthday" type="date" placeholder="选择日期">
						</el-date-picker>
					</div>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<label>年龄</label>
					<el-input class="userHubInput" :readonly="true" v-model="user.age"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="5">
				<div class="grid-content bg-purple">
					<label>身高(m)</label>
					<el-input class="userHubInput" @blur="CheckHeight()" v-model="user.height"></el-input>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="grid-content bg-purple-light">
					<label>体重(斤)</label>
					<el-input class="userHubInput" @blur="CheckWeight()" v-model="user.weight"></el-input>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="grid-content bg-purple">
					<label>BMI</label>
					<el-input class="userHubInput" v-model="user.bmi" :readonly="true"></el-input>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="grid-content bg-purple-light">
					<label>账户余额</label>
					<el-input class="userHubInput" :readonly="true" v-model="user.accountbalance"></el-input>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="grid-content bg-purple">
					<label>是否会员</label>
					<el-input class="userHubInput" :readonly="true" v-model="user.vipstatus"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="12">
				<div class="grid-content bg-purple">
					<label>注册时间</label>
					<el-input class="userHubInput" :readonly="true" v-model="user.enrolldate"></el-input>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content bg-purple-light">
					<label style="text-align: center;">上一次登录时间</label>
					<el-input class="userHubInput" :readonly="true" v-model="user.lastlogindate"></el-input>
				</div>
			</el-col>
		</el-row>

		<el-button style="width: 120px;" @click="updateUser()" :disabled="!userShow" type="success">修改</el-button>

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