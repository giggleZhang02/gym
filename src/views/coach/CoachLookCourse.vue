<template>
	<div class="course-container">
		<div class="page-header">
			<h2>课程管理</h2>
			<div class="header-line"></div>
		</div>

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
			this.getAllLookCourse();
		},
		methods: {
			fetchCourses() {
				this.$api.course.getAllCourseName().then((resp) => {
					if (resp.data.code === 200) {
						this.restaurants = resp.data.data;
					}
				})
			},
			SearchCourseByName() {
				const params = {
					name: this.name
				}
				this.$api.course.searchLookCourseByName(params).then((resp) => {
					if (this.name !== '') {
						if (resp.data.code === 200) {
							this.course = resp.data.data;
							this.total = this.course.length;
							this.resultcourse = this.course.slice(0, this.everPageNum)
						}
					}
				})
			},
			SearchAllCourse() {
				this.name = '';
				this.getAllLookCourse();
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
			getAllLookCourse() {
				this.$api.course.getAllLookCourse().then((resp) => {
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

.search-section {
	margin-bottom: 30px;
	
	.search-wrapper {
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		gap: 10px;
	}

	.search-input {
		flex: 1;
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

.price-section {
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

.pagination-section {
	display: flex;
	justify-content: center;
	margin-top: 30px;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
	.search-wrapper {
		flex-direction: column;
	}
	
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
}
</style>