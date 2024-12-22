<template>
	<div class="course-container">
		<div class="page-header">
			<h2>我的课程</h2>
			<div class="header-line"></div>
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
						
						<div class="action-section">
							<div class="collect-info">
								<el-button 
									:type="item.isCollect === 1 ? 'warning' : 'info'"
									icon="el-icon-star-on"
									circle
									@click="toggleStar(item)"
									:title="item.isCollect === 1 ? '取消收藏' : '收藏课程'">
								</el-button>
								<span class="collect-text">{{ item.isCollect === 1 ? '已收藏' : '收藏课程' }}</span>
							</div>
							
							<div class="sign-section">
								<el-button 
									type="success" 
									icon="el-icon-check"
									@click="UserSign(item.id)">
									签到打卡
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
				isAbleSign: true,
			}
		},
		mounted() {
			this.getAllPurchaseCourse();
		},
		methods: {
			UserSign(courseId){
				const params = {
					courseId: courseId,
					userId: this.$store.state.tab.userData.id
				}
				this.$api.sign.userSign(params).then((resp) => {
					if(resp.data.code === 200){
						this.$message({
							message: '恭喜您!签到成功!',
							type: 'success'
						})
					}else {
						if(resp.data.msg === 'msg'){
							this.$message({
								message: '教练还未发布签到!',
								type: 'success'
							})
						}else {
							this.$message({
								message: '请勿重复签到!',
								type: 'success'
							})
						}
					}
				})
			},
			toggleStar(item) {
				item.isCollect = item.isCollect === 1 ? 0 : 1;
				const params = {
					userId: this.$store.state.tab.userData.id,
					courseId: item.id,
					isCollect: item.isCollect
				}
				this.$api.collect.userCollectCourse(params).then((resp) => {
					if (resp.data.code === 200) {
						if (item.isCollect === 0) {
							this.$message({
								type: 'success',
								message: '取消收藏成功!'
							});
						} else {
							this.$message({
								type: 'success',
								message: `收藏-${item.name}-课程成功!`
							});
						}
					}
				})
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				const startIndex = (val - 1) * this.everPageNum;
				const endIndex = startIndex + this.everPageNum;
				this.resultcourse = this.course.slice(startIndex, endIndex);
				this.currentPage = val;
				console.log(this.course);
			},
			getAllPurchaseCourse() {
				const params = {
					userId: this.$store.state.tab.userData.id
				}
				this.$api.purchase.getAllPurchaseCourse(params).then((resp) => {
					if (resp.data.code === 200) {
						this.course = resp.data.data;
						this.total = this.course.length;
						this.resultcourse = this.course.slice(0, this.everPageNum)
					}
				})
			},
		},
	}
</script>

<style lang="less" scoped>
.course-container {
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

.course-list {
	display: grid;
	gap: 20px;
	margin-bottom: 20px;
}

.course-card {
	border-radius: 8px;
	overflow: hidden;
	transition: all 0.3s;
	background: #fff;
	
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

.action-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 15px;
	border-top: 1px solid #ebeef5;
}

.collect-info {
	display: flex;
	align-items: center;
	gap: 10px;

	.collect-text {
		color: #909399;
		font-size: 14px;
	}
}

.sign-section {
	.el-button {
		padding: 12px 25px;
		
		i {
			margin-right: 5px;
		}
	}
}

.pagination-section {
	display: flex;
	justify-content: center;
	margin-top: 30px;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
	.course-content {
		flex-direction: column;
	}
	
	.course-image {
		width: 100%;
		height: 200px;
	}
	
	.action-section {
		flex-direction: column;
		gap: 15px;
		align-items: stretch;
		
		.collect-info {
			justify-content: center;
		}
		
		.sign-section {
			text-align: center;
			
			.el-button {
				width: 100%;
			}
		}
	}
}
</style>