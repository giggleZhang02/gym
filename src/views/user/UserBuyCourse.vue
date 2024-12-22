<template>
	<div>
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark" style="display: flex; text-align: center;">
					<div style="flex: 1;">
						<el-autocomplete popper-class="my-autocomplete" v-model="name" :fetch-suggestions="querySearch"
							placeholder="请输入课程名称" @select="handleSelect" style="width: 500px;"
							@click.native.prevent="SearchAllCourse()"
							@keydown.enter.native.prevent="SearchCourseByName()">
							<i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick">
							</i>
							<template slot-scope="{ item }">
								<div class="name">{{ item.courseName }}</div>
								<span style="font-size: 12px;color: #b4b4b4;">{{ item.coachName }}</span>
							</template>
						</el-autocomplete>
						<el-button style="margin-left: 10px;" type="primary" icon="el-icon-search"
							@click="SearchCourseByName()">搜索</el-button>
						<span style="margin-left: 100px;color: #FFFF00;">余额不足?</span>
						<el-button style="margin-left: 10px;" type="success" @click="recharge()">充值</el-button>
					</div>

				</div>
			</el-col>
		</el-row>

		<el-row v-for="(item,index) in resultcourse" :key="index">
			<el-col :span="18">
				<div class="grid-content bg-purple" style="display: flex;">
					<div style="margin-right: 20px;">
						<img :src="'http://localhost:8081/util/download?name=' + item.image" alt="图片"
							style="width: 200px; height: 200px;">
					</div>
					<el-descriptions :title="item.name" :column="3" :size="size" style="width: 560px;margin-top: 10px;">
						<el-descriptions-item label="上课地点">{{item.place}}</el-descriptions-item>
						<el-descriptions-item label="适用人群">{{item.applicationgroup}}</el-descriptions-item>
						<el-descriptions-item label="类型">{{item.type}}</el-descriptions-item>
						<el-descriptions-item label="价格">{{item.price}}</el-descriptions-item>
						<el-descriptions-item label="会员价格">
							<el-tag size="medium">{{item.price * 0.8}}</el-tag>
						</el-descriptions-item>
						<el-descriptions-item label="课程时长">{{item.coursetime}}</el-descriptions-item>
						<el-descriptions-item label="描述">{{item.description}}</el-descriptions-item>
					</el-descriptions><br>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple-light" style="display: flex;height: 205px;">
					<i v-if="item.isCollect === 1" class="el-icon-star-on"
						style="margin-top: 90px; margin-left: 40px; cursor: pointer;" @click="toggleStar(item)" title="点击取消收藏"></i>
					<i v-else class="el-icon-star-off" style="margin-top: 90px; margin-left: 40px; cursor: pointer;"
						@click="toggleStar(item)"  title="点击收藏"></i>
					<el-button type="success" style="height: 40px;width: 80px;margin-top: 80px;margin-left: 60px;"
						:disabled="item.isPurchase === 1"
						@click="userPurchaseCourse(item.id,item.price,item)">购买</el-button>
				</div>
			</el-col>

		</el-row>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			:page-sizes="[3, 6, 9, 12]" :page-size="3" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				restaurants: [],
				name: '',
				size: 'medium',
				course: [],
				resultcourse: [],
				currentPage: 1,
				everPageNum: 3,
				total: 0,
			}
		},
		mounted() {
			this.fetchCourses();
			this.getAllCourse();
		},
		methods: {
			fetchCourses() {
				this.$api.course.getAllCourseName().then((resp) => {
					if (resp.data.code === 200) {
						this.restaurants = resp.data.data;
					}
				})
			},
			toggleStar(item){
				item.isCollect = item.isCollect === 1?0:1;
				const params = {
					userId: this.$store.state.tab.userData.id,
					courseId: item.id,
					isCollect: item.isCollect
				}
				this.$api.collect.userCollectCourse(params).then((resp) => {
					if(resp.data.code === 200){
						if(item.isCollect === 0){
							this.$message({
								type: 'success',
								message: '取消收藏成功!'
							});
						}else {
							this.$message({
								type: 'success',
								message: `收藏-${item.name}-课程成功!`
							});
						}
					}
				})
			},
			userPurchaseCourse(courseId, price, item) {
				const accountBalance = this.$store.state.tab.userData.accountbalance;
				const vipStatus = this.$store.state.tab.userData.vipstatus;
				price = vipStatus === 1 ? price * 0.8 : price;
				const balance = accountBalance - price;
				const msg = `您确定购买该课程吗?您的余额为${accountBalance}元购买该课程(${price})元后您的余额为${balance}元`;
				if (balance < 0) {
					this.$notify.info({
						title: '余额不足',
						message: `您的余额为${accountBalance}元购买该课程(${price})元后您的余额为${balance}元!`
					});
				} else {
					this.$confirm(msg, '提示', {
						confirmButtonText: '购买',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						const userId = this.$store.state.tab.userData.id
						const data = {
							userid: userId,
							courseid: courseId,
							purchaseprice: price
						}
						this.$api.purchase.userPurchaseCourse(data).then((resp) => {
							if (resp.data.code === 200) {
								this.$message({
									type: 'success',
									message: '购买成功!'
								});
								this.$store.state.tab.userData.accountbalance = balance;
								item.isPurchase = 1;
							}
							if (resp.data.code === 0) {
								this.$notify.info({
									title: '重复购买',
									message: `您已经购买过该课程了,请勿重复购买!`
								});
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消购买'
						});
					});
				}
			},
			SearchCourseByName() {
				const params = {
					userId: this.$store.state.tab.userData.id,
					name: this.name
				}
				this.$api.course.searchCourseByName(params).then((resp) => {
					if (this.name !== '') {
						if (resp.data.code === 200) {
							this.course = resp.data.data;
							this.total = this.course.length;
							this.resultcourse = this.course.slice(0, this.everPageNum)
						}
					}
				})
			},
			recharge() {
				this.$prompt('请输入充值金额', '提示', {
					confirmButtonText: '充值',
					cancelButtonText: '取消',
					inputPattern: /^[1-9]\d{0,3}$/,
					inputErrorMessage: '请输入大于0小于10000的金额'
				}).then(({
					value
				}) => {
					const userId = this.$store.state.tab.userData.id;
					const params = {
						userId: userId,
						rechargeAmount: value
					}
					this.$api.user.recharge(params).then((resp) => {
						if (resp.data.code === 200) {
							this.$message({
								type: 'success',
								message: '恭喜您!充值成功!充值金额为' + value + '!您的余额为' + resp.data.msg
							});
							this.$store.commit('setUserData', resp.data.data);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消充值'
					});
				});
			},
			SearchAllCourse() {
				this.name = '';
				this.getAllCourse();
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				const startIndex = (val - 1) * this.everPageNum;
				const endIndex = startIndex + this.everPageNum;
				this.resultcourse = this.course.slice(startIndex, endIndex);
				this.currentPage = val;
			},
			getAllCourse() {
				const params = {
					userId: this.$store.state.tab.userData.id
				}
				this.$api.course.getAllCourse(params).then((resp) => {
					if (resp.data.code === 200) {
						this.course = resp.data.data;
						this.total = this.course.length;
						this.resultcourse = this.course.slice(0, this.everPageNum)
					}
				})
			},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				cb(results);
			},
			createFilter(queryString) {
				return (restaurant) => {
					return (restaurant.courseName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			handleSelect(item) {
				this.name = item.courseName;
				this.SearchCourseByName();
			},
			handleIconClick(ev) {
				console.log(ev);
			}
		},
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

	.my-autocomplete {
		li {
			line-height: normal;
			padding: 7px;

			.name {
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.highlighted .addr {
				color: #ddd;
			}
		}
	}
</style>