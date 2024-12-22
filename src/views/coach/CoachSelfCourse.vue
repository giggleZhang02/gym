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
							
							<div class="button-group">
								<el-button 
									:type="item.sign === 0 ? 'primary' : 'warning'"
									icon="el-icon-edit"
									@click="CoachPastSign(item.id, item.sign)">
									{{ item.sign === 0 ? '发布签到' : '取消签到' }}
								</el-button>
								<el-button 
									type="success" 
									icon="el-icon-document"
									@click="CheckSignList(item.id)">
									查看签到列表
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

		<!-- 签到列表弹窗 -->
		<el-dialog 
			title="签到列表" 
			:visible.sync="dialogTableVisible"
			width="500px"
			custom-class="sign-dialog">
			<el-table :data="SignList" style="width: 100%">
				<el-table-column prop="name" label="姓名" width="150">
					<template slot-scope="scope">
						<div class="user-name">
							<i class="el-icon-user"></i>
							{{ scope.row.name }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="签到时间" width="200">
					<template slot-scope="scope">
						<div class="sign-time">
							<i class="el-icon-time"></i>
							{{ formatDate(scope.row.signdate) }}
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				SignList: [],
				size: 'medium',
				
				course: [],
				resultcourse: [],
				currentPage: 1,
				everPageNum: 3,
				total: 0,
				dialogTableVisible: false,
			}
		},
		mounted() {
			this.getAllCourseByCoach();
		},
		methods: {
			formatDate(dateString) {
				// 假设日期字符串格式为 'YYYY-MM-DD HH:mm:ss'
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 补齐两位数
				const day = date.getDate().toString().padStart(2, '0'); // 补齐两位数
				return `${year}-${month}-${day}`;
			},
			CheckSignList(courseId) {
				const params = {
					courseId: courseId,
				}
				this.$api.sign.checkSignList(params).then((resp) => {
					if (resp.data.code === 200) {
						this.SignList = resp.data.data;
						console.log(this.SignList)
						// this.SignList.signdate = this.SignList.signdate .toString().join('-');
					}
				})
				this.dialogTableVisible = true;
			},
			CoachPastSign(courseId, sign) {
				const params = {
					courseId: courseId,
					sign: sign
				}
				this.$api.course.coachPastSign(params).then((resp) => {
					if (resp.data.code === 200) {
						if (sign === 0) {
							this.$message({
								type: 'success',
								message: '发布签到成功!'
							})
						} else {
							this.$message({
								type: 'success',
								message: '取消签到成功!'
							})
						}
						this.getAllCourseByCoach();
					}
				})
			},
			getAllCourseByCoach() {
				const params = {
					coachId: this.$store.state.tab.coachData.id,
				}
				this.$api.course.getAllCourseByCoach(params).then((resp) => {
					if (resp.data.code === 200) {
						this.course = resp.data.data;
						this.total = this.course.length;
						this.resultcourse = this.course.slice(0, this.everPageNum)
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
	flex-shrink: 0;
	
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

.button-group {
	display: flex;
	gap: 10px;

	.el-button {
		padding: 10px 20px;
		
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

.sign-dialog {
	.user-name, .sign-time {
		display: flex;
		align-items: center;
		gap: 5px;
		
		i {
			color: #909399;
		}
	}
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
	}
	
	.button-group {
		flex-direction: column;
		
		.el-button {
			width: 100%;
		}
	}
}
</style>