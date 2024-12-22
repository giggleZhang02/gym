<template>
	<div>
		<div>
			<el-row>
				<el-col :span="24">
					<div class="grid-content bg-purple-dark" style="display: flex; align-items: center;">
						<img style="width: 100px; height: 100px;" :src="logoLink" alt="Logo">
						<div style="margin-left: 20px;">
							<h2 style="color: #f2a53f;">FitHub-Plus会员</h2>
							<h4 style="color: #409EFF;margin-top: 10px;">开通立享8大会员专属权限，快人一步练成好身体!好身材!</h4>
						</div>
					</div>
				</el-col>

			</el-row>
			<el-row>
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
							<el-table-column prop="privilege" label="会员专属特权" width="180">
							</el-table-column>
							<el-table-column prop="PlusVip" label="Plus会员" width="180">
							</el-table-column>
							<el-table-column prop="noVip" label="无会员">
							</el-table-column>
						</el-table>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content">
						<div style="width: 265px;height: 160px;text-align: center;border: 2px solid #FF0000;border-radius: 10px;">
							<h5 style="padding-top: 20px;">365天</h5><br>
							<h1 style="color: #FF0000;">￥{{yearmoney}}</h1><br>
							<h5>仅￥1.37/天</h5><br>
						</div>
						<div style="width: 265px;height: 160px;text-align: center;border: 2px solid #FF0000;border-radius: 10px;margin-top: 10px;">
							<h5 style="padding-top: 20px;">180天</h5><br>
							<h1 style="color: #FF0000;">￥{{seasonmoney}}</h1><br>
							<h5>仅￥2.21/天</h5><br>
						</div>
						<div style="width: 265px;height: 160px;text-align: center;border: 2px solid #FF0000;border-radius: 10px;margin-top: 10px;">
							<h5 style="padding-top: 10px;">包月</h5><br>
							<el-input-number v-model="num" :step="30" :min="30" :max="90" @change="handleChange"></el-input-number>
							<h1 style="padding-top: 3px; color: #FF0000;height: 20px;">￥{{money}}</h1><br>
							<h5>仅￥2.63/天</h5><br>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content">
						<div style="width: 265px;height: 160px;text-align: center;" >
							<el-button @click="purchasePlusVipYear()" type="success" style="margin-top: 60px;width: 80px;height: 40px;" >购买</el-button>
						</div>
						<div style="width: 265px;height: 160px;text-align: center;" >
							<el-button @click="purchasePlusVipSeason()" type="success" style="margin-top: 60px;width: 80px;height: 40px;" >购买</el-button>
						</div>
						<div style="width: 265px;height: 160px;text-align: center;" >
							<el-button @click="purchasePlusVipDay()" type="success" style="margin-top: 60px;width: 80px;height: 40px;" >购买</el-button>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				num: 30,
				money: 79,
				yearmoney: 499,
				seasonmoney: 398,
				everyDayMoney: 2.63,
				logoLink: require('../../assets/images/backgroundFit.jpg'),
				tableData: [{
					privilege: '设施使用权',
					PlusVip: '免费使用有氧器械',
					noVip: '一些设备不可使用',
				}, {
					privilege: '洗浴权',
					PlusVip: '每天可免费洗浴一次',
					noVip: '洗浴需缴纳一定费用'
				}, {
					privilege: '游泳权',
					PlusVip: '可免费使用游泳馆',
					noVip: '游泳需缴纳一定费用',
				}, {
					privilege: '个人指导权',
					PlusVip: '可享受个人指导服务',
					noVip: '不能享受个人指导服务'
				}, {
					privilege: '活动特权',
					PlusVip: '可免费参加健身馆举办的有奖活动',
					noVip: '参加有奖活动需交报名费'
				}, {
					privilege: '优惠权',
					PlusVip: '购买课程可享八折优惠',
					noVip: '购买课程需全价'
				}, {
					privilege: '健康评估权',
					PlusVip: '每月可免费进行一次健身馆提供的体检服务和健康评估服务',
					noVip: '进行健身馆提供的体检服务和健康评估服务需缴纳一定费用'
				}, {
					privilege: '按摩权',
					PlusVip: '每天可免费进行一次健身馆提供的康复按摩服务',
					noVip: '每次使用康复按摩服务需缴纳一定费用'
				}]
			}
		},
		methods: {
			info(accountBalance,money){
				this.$notify.info({
					title: '余额不足',
					message: `您的余额为${accountBalance}元，充值该会员需要${money}元`
				});
			},
			puchaseVip(money,numberdays){
				const params = {
					userId: this.$store.state.tab.userData.id,
					money: money,
					numberDays: numberdays
				}
				this.$api.vip.purchaseVip(params).then((resp) => {
					if(resp.data.code === 200){
						this.$message({
							type: 'success',
							message: '购买成功!您的Plus会员到期时间为' + resp.data.msg
						});
						this.$store.commit('setUserData', resp.data.data);
					}
				})
			},
			purchasePlusVipYear(){
				const accountBalance = this.$store.state.tab.userData.accountbalance;
				const price = this.yearmoney;
				const balance = accountBalance - price;
				const msg = `您确定购买该类型会员吗?您的余额为${accountBalance}元购买该课程(${price})元后您的余额为${balance}元`;
				if(accountBalance < this.yearmoney){
					this.info(accountBalance,this.yearmoney)
				}else{
					this.$confirm(msg, '提示', {
						confirmButtonText: '购买',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.puchaseVip(this.yearmoney,365);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消购买'
						});
					});
				}
			},
			purchasePlusVipSeason(){
				const accountBalance = this.$store.state.tab.userData.accountbalance;
				const price = this.seasonmoney;
				const balance = accountBalance - price;
				const msg = `您确定购买该类型会员吗?您的余额为${accountBalance}元购买该课程(${price})元后您的余额为${balance}元`;
				if(accountBalance < this.seasonmoney){
					this.info(accountBalance,this.seasonmoney)
				}else{
					this.$confirm(msg, '提示', {
						confirmButtonText: '购买',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.puchaseVip(this.seasonmoney,180);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消购买'
						});
					});
				}
			},
			purchasePlusVipDay(){
				const accountBalance = this.$store.state.tab.userData.accountbalance;
				const price = this.money;
				const balance = accountBalance - price;
				const msg = `您确定购买该类型会员吗?您的余额为${accountBalance}元购买该课程(${price})元后您的余额为${balance}元`;
				if(accountBalance < this.money){
					this.info(accountBalance,this.money)
				}else{
					this.$confirm(msg, '提示', {
						confirmButtonText: '购买',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.puchaseVip(this.money,this.num);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消购买'
						});
					});
				}
			},
			handleChange(value) {
				this.num = value ;
				this.money = Math.round(this.num * this.everyDayMoney);
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (rowIndex === 1) {
					console.log(row)
					return 'warning-row';
				} else if (rowIndex === 3) {
					return 'success-row';
				}
				return '';
			}
		}
	}
</script>

<style scoped>
	.el-table .warning-row {
		background: oldlace;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}

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
		background: #99a9bf;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
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