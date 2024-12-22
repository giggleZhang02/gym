<template>
	<div class="course-container">
		<!-- 搜索栏部分 -->
		<div class="search-section">
			<div class="search-wrapper">
				<el-autocomplete
					class="search-input"
					popper-class="my-autocomplete"
					v-model="name"
					:fetch-suggestions="querySearch"
					placeholder="搜索课程..."
					@select="handleSelect"
					@click.native.prevent="SearchAllCourse()"
					@keydown.enter.native.prevent="SearchCourseByName()">
					<i class="el-icon-search el-input__icon" slot="prefix"></i>
					<template slot-scope="{ item }">
						<div class="suggestion-item">
							<div class="course-name">{{ item.courseName }}</div>
							<div class="coach-name">{{ item.coachName }}</div>
						</div>
					</template>
				</el-autocomplete>
				<el-button type="primary" icon="el-icon-search" @click="SearchCourseByName()">搜索</el-button>
			</div>
			
			<div class="balance-section">
				<span class="balance-tip">余额不足?</span>
				<el-button type="success" icon="el-icon-wallet" @click="recharge()">充值</el-button>
			</div>
		</div>

		<!-- 课程列表部分 -->
		<div class="course-list">
			<el-card v-for="(item, index) in resultcourse" :key="index" class="course-card">
				<div class="course-content">
					<div class="course-image">
						<img :src="'http://localhost:8081/util/download?name=' + item.image" :alt="item.name">
					</div>
					
					<div class="course-info">
						<h3 class="course-title">{{item.name}}</h3>
						<el-descriptions :column="2" class="course-details">
							<el-descriptions-item label="上课地点">
								<i class="el-icon-location"></i> {{item.place}}
							</el-descriptions-item>
							<el-descriptions-item label="适用人群">
								<i class="el-icon-user"></i> {{item.applicationgroup}}
							</el-descriptions-item>
							<el-descriptions-item label="类型">
								<i class="el-icon-collection-tag"></i> {{item.type}}
							</el-descriptions-item>
							<el-descriptions-item label="课程时长">
								<i class="el-icon-time"></i> {{item.coursetime}}
							</el-descriptions-item>
						</el-descriptions>
						
						<div class="course-description">
							<p>{{item.description}}</p>
						</div>
						
						<div class="price-section">
							<div class="price-info">
								<div class="original-price">
									<span class="label">原价：</span>
									<span class="amount">¥{{item.price}}</span>
								</div>
								<div class="vip-price">
									<span class="label">会员价：</span>
									<span class="amount">¥{{item.price * 0.8}}</span>
									<el-tag size="small" type="success">会员优惠</el-tag>
								</div>
							</div>
							
							<div class="action-buttons">
								<el-button 
									:type="item.isCollect === 1 ? 'warning' : 'info'"
									icon="el-icon-star-off"
									circle
									@click="toggleStar(item)"
									:title="item.isCollect === 1 ? '取消收藏' : '收藏课程'">
								</el-button>
								<el-button 
									type="primary" 
									:disabled="item.isPurchase === 1"
									@click="userPurchaseCourse(item.id, item.price, item)">
									{{ item.isPurchase === 1 ? '已购买' : '立即购买' }}
								</el-button>
							</div>
						</div>
					</div>
				</div>
			</el-card>
		</div>

		<!-- 分页部分 -->
		<div class="pagination-section">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[3, 6, 9, 12]"
				:page-size="3"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
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

<style lang="less" scoped>
.course-container {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: calc(100vh - 120px);
}

.search-section {
	background: #fff;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	margin-bottom: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.search-wrapper {
	display: flex;
	gap: 10px;
	flex: 1;
	max-width: 600px;
	
	.search-input {
		width: 100%;
	}
}

.balance-section {
	display: flex;
	align-items: center;
	gap: 10px;
	
	.balance-tip {
		color: #e6a23c;
		font-weight: 500;
	}
}

.course-list {
	display: grid;
	gap: 20px;
	margin-bottom: 20px;
}

.course-card {
	border-radius: 8px;
	overflow: hidden;
	transition: all 0.3s;
	
	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}
}

.course-content {
	display: flex;
	gap: 20px;
}

.course-image {
	width: 240px;
	height: 240px;
	border-radius: 8px;
	overflow: hidden;
	
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
		
		&:hover {
			transform: scale(1.05);
		}
	}
}

.course-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.course-title {
	font-size: 20px;
	color: #303133;
	margin: 0 0 15px;
}

.course-details {
	margin-bottom: 15px;
	
	:deep(.el-descriptions-item__label) {
		color: #909399;
	}
	
	i {
		margin-right: 5px;
	}
}

.course-description {
	color: #606266;
	line-height: 1.6;
	margin-bottom: 15px;
	flex: 1;
}

.price-section {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	padding-top: 15px;
	border-top: 1px solid #ebeef5;
}

.price-info {
	.original-price {
		color: #909399;
		text-decoration: line-through;
		margin-bottom: 5px;
	}
	
	.vip-price {
		color: #f56c6c;
		font-size: 20px;
		font-weight: bold;
		
		.el-tag {
			margin-left: 10px;
		}
	}
	
	.label {
		color: #909399;
		font-size: 14px;
	}
}

.action-buttons {
	display: flex;
	gap: 10px;
}

.pagination-section {
	display: flex;
	justify-content: center;
	margin-top: 30px;
}

.suggestion-item {
	.course-name {
		font-size: 14px;
		color: #303133;
	}
	
	.coach-name {
		font-size: 12px;
		color: #909399;
	}
}

/* 响��式布局 */
@media screen and (max-width: 768px) {
	.course-content {
		flex-direction: column;
	}
	
	.course-image {
		width: 100%;
		height: 200px;
	}
	
	.price-section {
		flex-direction: column;
		gap: 15px;
	}
	
	.action-buttons {
		width: 100%;
		justify-content: flex-end;
	}
}
</style>