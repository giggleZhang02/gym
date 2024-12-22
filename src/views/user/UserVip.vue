<template>
	<div class="vip-container">
		<!-- VIP 头部 -->
		<div class="vip-header">
			<div class="header-content">
				<img :src="logoLink" alt="Logo" class="vip-logo">
				<div class="header-text">
					<h1>FitHub-Plus 会员</h1>
					<p>开通立享8大会员专属权限，快人一步练成好身体！好身材！</p>
				</div>
			</div>
		</div>

		<div class="vip-content">
			<!-- 特权展示部分 -->
			<div class="privileges-section">
				<h2>会员特权对比</h2>
				<el-table
					:data="tableData"
					style="width: 100%"
					:row-class-name="tableRowClassName"
					class="privilege-table">
					<el-table-column
						prop="privilege"
						label="会员专属特权"
						width="200">
					</el-table-column>
					<el-table-column
						prop="PlusVip"
						label="Plus会员"
						width="200">
						<template slot-scope="scope">
							<span class="vip-feature">{{ scope.row.PlusVip }}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="noVip"
						label="普通用户">
						<template slot-scope="scope">
							<span class="normal-feature">{{ scope.row.noVip }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 会员套餐部分 -->
			<div class="plans-section">
				<h2>会员套餐</h2>
				<div class="plan-cards">
					<!-- 年度会员 -->
					<div class="plan-card">
						<div class="plan-header">
							<h3>年度会员</h3>
							<div class="plan-price">
								<span class="price">¥{{yearmoney}}</span>
								<span class="per-day">¥1.37/天</span>
							</div>
							<div class="plan-duration">365天</div>
						</div>
						<el-button type="primary" @click="purchasePlusVipYear()" class="purchase-btn">立即开通</el-button>
					</div>

					<!-- 半年会员 -->
					<div class="plan-card">
						<div class="plan-header">
							<h3>半年会员</h3>
							<div class="plan-price">
								<span class="price">¥{{seasonmoney}}</span>
								<span class="per-day">¥2.21/天</span>
							</div>
							<div class="plan-duration">180天</div>
						</div>
						<el-button type="primary" @click="purchasePlusVipSeason()" class="purchase-btn">立即开通</el-button>
					</div>

					<!-- 月度会员 -->
					<div class="plan-card">
						<div class="plan-header">
							<h3>月度会员</h3>
							<div class="plan-price">
								<span class="price">¥{{money}}</span>
								<span class="per-day">¥2.63/天</span>
							</div>
							<div class="duration-selector">
								<el-input-number 
									v-model="num" 
									:step="30" 
									:min="30" 
									:max="90" 
									@change="handleChange"
									controls-position="right">
								</el-input-number>
								<span class="days-label">天</span>
							</div>
						</div>
						<el-button type="primary" @click="purchasePlusVipDay()" class="purchase-btn">立即开通</el-button>
					</div>
				</div>
			</div>
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
	.vip-container {
		padding: 20px;
		background-color: #f5f7fa;
		min-height: calc(100vh - 120px);
	}

	.vip-header {
		background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
		border-radius: 8px;
		padding: 30px;
		margin-bottom: 30px;
		color: #fff;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 30px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.vip-logo {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.header-text h1 {
		font-size: 28px;
		margin: 0;
		color: #ffd700;
		margin-bottom: 10px;
	}

	.header-text p {
		font-size: 16px;
		margin: 0;
		opacity: 0.9;
	}

	.vip-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.privileges-section, .plans-section {
		background: #fff;
		border-radius: 8px;
		padding: 30px;
		margin-bottom: 30px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	}

	h2 {
		color: #303133;
		font-size: 24px;
		margin: 0 0 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #ebeef5;
	}

	.privilege-table {
		border-radius: 8px;
		overflow: hidden;
	}

	.vip-feature {
		color: #67c23a;
		font-weight: 500;
	}

	.normal-feature {
		color: #909399;
	}

	.plan-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin-top: 20px;
	}

	.plan-card {
		background: #fff;
		border-radius: 8px;
		padding: 25px;
		text-align: center;
		border: 1px solid #ebeef5;
		transition: all 0.3s;
	}

	.plan-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.plan-header h3 {
		color: #303133;
		font-size: 20px;
		margin: 0 0 15px;
	}

	.plan-price {
		margin: 15px 0;
	}

	.price {
		font-size: 32px;
		color: #f56c6c;
		font-weight: bold;
	}

	.per-day {
		font-size: 14px;
		color: #909399;
		margin-left: 5px;
	}

	.plan-duration {
		font-size: 16px;
		color: #606266;
		margin: 10px 0;
	}

	.duration-selector {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin: 15px 0;
	}

	.days-label {
		color: #606266;
	}

	.purchase-btn {
		width: 100%;
		height: 40px;
		margin-top: 15px;
	}

	/* 表格样式优化 */
	.el-table .warning-row {
		background: #fdf6ec;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}

	/* 响应式布局 */
	@media screen and (max-width: 768px) {
		.plan-cards {
			grid-template-columns: 1fr;
		}
		
		.header-content {
			flex-direction: column;
			text-align: center;
		}
	}
</style>