<template>
	<div class="admin-course-container">
		<!-- 搜索和操作区域 -->
		<div class="header-section">
			<div class="search-section">
				<el-autocomplete
					class="search-input"
					popper-class="my-autocomplete"
					v-model="name"
					:fetch-suggestions="querySearch"
					placeholder="搜索课程名称..."
					@select="handleSelect"
					@click.native.prevent="SearchAllCourse()"
					@keydown.enter.native.prevent="SearchCourseByName()"
				>
					<template slot-scope="{ item }">
						<div class="suggestion-item">
							<div class="course-name">{{ item.courseName }}</div>
							<span class="coach-name">{{ item.coachName }}</span>
						</div>
					</template>
					<i class="el-icon-search el-input__icon" slot="suffix"></i>
				</el-autocomplete>
				
				<el-button type="primary" icon="el-icon-search" @click="SearchCourseByName()">
					搜索
				</el-button>

				<el-button type="success" icon="el-icon-plus" @click="openForm1()">
					新增课程
				</el-button>
			</div>
		</div>

		<!-- 课程列表区域 -->
		<div class="course-list">
			<el-card v-for="(item, index) in resultcourse" :key="index" class="course-card">
				<div class="course-content">
					<div class="course-image">
						<el-image
							:src="'http://localhost:8081/util/download?name=' + item.image"
							fit="cover"
							:preview-src-list="['http://localhost:8081/util/download?name=' + item.image]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</div>

					<div class="course-info">
						<div class="course-header">
							<h2 class="course-title">{{ item.name }}</h2>
							<div class="course-actions">
								<el-button type="primary" icon="el-icon-edit" size="small" @click="openForm(item)">
									编辑
								</el-button>
								<el-button type="danger" icon="el-icon-delete" size="small" @click="deleteCourseById(item)">
									删除
								</el-button>
							</div>
						</div>

						<el-descriptions :column="2" border>
							<el-descriptions-item label="上课地点">
								<i class="el-icon-location"></i>
								{{ item.place }}
							</el-descriptions-item>
							<el-descriptions-item label="适用人群">
								<i class="el-icon-user"></i>
								{{ item.applicationgroup }}
							</el-descriptions-item>
							<el-descriptions-item label="课程类型">
								<el-tag size="small">{{ item.type }}</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="课程时长">
								<i class="el-icon-time"></i>
								{{ item.coursetime }} 分钟
							</el-descriptions-item>
							<el-descriptions-item label="价格">
								<div class="price-info">
									<span class="original-price">¥{{ item.price }}</span>
									<el-tag type="danger" size="small">会员价: ¥{{ (item.price * 0.8).toFixed(2) }}</el-tag>
								</div>
							</el-descriptions-item>
						</el-descriptions>

						<div class="course-description">
							<el-tooltip :content="item.description" placement="top">
								<p>{{ item.description }}</p>
							</el-tooltip>
						</div>
					</div>
				</div>
			</el-card>
		</div>

		<!-- 分页区域 -->
		<div class="pagination-section">
			<el-pagination
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[3, 6, 9, 12]"
				:page-size="3"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</div>

		<!-- 编辑课程对话框 -->
		<el-dialog title="修改课程信息" :visible.sync="dialogFormVisible" width="50%">
			<el-form :model="onecourse" label-width="100px">
				<el-form-item label="课程图片">
					<el-upload
						class="avatar-uploader"
						action="http://localhost:8081/util/upload"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
					>
						<img
							v-if="imageLink"
							:src="'http://localhost:8081/util/download?name=' + imageLink"
							class="avatar"
						>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-form-item label="课程名称">
					<el-input v-model="onecourse.name" @blur="onecourse.name = checkLength(onecourse.name,0,50)"></el-input>
				</el-form-item>

				<el-form-item label="上课地点">
					<el-input v-model="onecourse.place" @blur="onecourse.place = checkLength(onecourse.place,0,100)"></el-input>
				</el-form-item>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="课程价格">
							<el-input-number
								v-model="onecourse.price"
								:min="0"
								:precision="2"
								:step="10"
							></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="课程时长">
							<el-input-number
								v-model="onecourse.coursetime"
								:min="0"
								:step="15"
							></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="适用人群">
					<el-input v-model="onecourse.applicationgroup" @blur="onecourse.applicationgroup = checkLength(onecourse.applicationgroup,0,100)"></el-input>
				</el-form-item>

				<el-form-item label="课程描述">
					<el-input
						type="textarea"
						v-model="onecourse.description"
						:rows="4"
						@blur="onecourse.description = checkLength(onecourse.description,0,1000)"
					></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAlert" @click="alterCourse()">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 新增课程对话框 -->
		<el-dialog title="新增课程" :visible.sync="dialogFormVisible1" width="50%">
			<el-form :model="onecourse1" label-width="100px">
				<el-form-item label="课程图片">
					<el-upload
						class="avatar-uploader"
						action="http://localhost:8081/util/upload"
						:show-file-list="false"
						:on-success="handleAvatarSuccess1"
						:before-upload="beforeAvatarUpload"
					>
						<img
							v-if="imageLink1"
							:src="'http://localhost:8081/util/download?name=' + imageLink1"
							class="avatar"
						>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-form-item label="选择教练">
					<el-select v-model="coachId" placeholder="请选择教练">
						<el-option
							v-for="coach in coachArr"
							:key="coach.id"
							:label="coach.name"
							:value="coach.id"
						>
						</el-option>
					</el-select>
				</el-form-item>

				<!-- 其他表单项与编辑对话框类似 -->
				<!-- ... -->
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible1 = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAdd" @click="addCourse()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				coachId: '',
				restaurants: [],
				name: '',
				size: 'medium',
				course: [],
				onecourse: {},
				onecourse1: {},
				coachArr: [],
				resultcourse: [],
				currentPage: 1,
				everPageNum: 3,
				total: 0,
				dialogFormVisible: false,
				dialogFormVisible1: false,
				imageLink: '',
				imageLink1: '',
			}
		},
		mounted() {
			this.fetchCourses();
			this.getAllCourse();
		},
		computed: {
			showAlert() {
				return this.onecourse.name !== '' && this.onecourse.place !== '' && this.onecourse.price !== '' && this
					.onecourse.coursetime !== '' && this.onecourse.applicationgroup !== '' && this.onecourse
					.description !== ''
			},
			showAdd() {
				return this.imageLink1 !== '' && this.coachId !== '' && this.onecourse1.name !== '' && this.onecourse1.place !== '' && this
					.onecourse1.price !== '' && this.onecourse1.coursetime !== '' && this.onecourse1.applicationgroup !==
					'' && this.onecourse1.description !== ''
			}
		},
		methods: {
			alterCourse() {
				this.onecourse.image = this.imageLink;
				const data = this.onecourse;
				this.$api.admin.alterCourse(data).then((resp) => {
					if (resp.data.code === 200) {
						this.$message({
							message: '修改课程信息成功!',
							type: 'info'
						})
					}
				})
				this.dialogFormVisible = false;
			},
			addCourse() {
				this.onecourse1.image = this.imageLink1;
				this.onecourse1.coachid = this.coachId;
				const data = this.onecourse1;
				this.$api.admin.addCourse(data).then((resp) => {
					if (resp.data.code === 200) {
						this.$message({
							message: '增加课程成功!',
							type: 'info'
						})
						this.getAllCourse();
					}
				})
				this.onecourse1 = {};
				this.dialogFormVisible1 = false;
			},
			checkIsNumber(str) {
				if (str === '') {
					return '';
				}
				if (/^\d+$/.test(str)) {
					return str;
				} else {
					this.$message({
						message: '数字不合法!',
						type: 'info'
					});
					return '';
				}
			},
			checkLength(str, minlength, maxLength) {
				if (str !== '') {
					if (str.length < minlength || str.length > maxLength) {
						this.$message({
							message: `字符长��应在[${minlength}-${maxLength}]之间`,
							type: 'info'
						})
						return '';
					}
				}
				return str;
			},
			handleAvatarSuccess(res) {
				this.imageLink = res.data;
			},
			handleAvatarSuccess1(res) {
				this.imageLink1 = res.data;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			openForm(course) {
				this.onecourse = course;
				this.imageLink = course.image;
				this.dialogFormVisible = true;
			},
			openForm1() {
				this.$api.admin.getAllCoachName().then((resp) => {
					if (resp.data.code === 200) {
						this.coachArr = resp.data.data;
					}
				})
				this.dialogFormVisible1 = true;
			},
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
				this.$api.admin.searchCourseByName(params).then((resp) => {
					if (this.name !== '') {
						if (resp.data.code === 200) {
							this.course = resp.data.data;
							this.total = this.course.length;
							this.resultcourse = this.course.slice(0, this.everPageNum)
						}
					}
				})
			},
			deleteCourseById(course) {
				const params = {
					courseId: course.id
				}
				this.$confirm(`此操作将永久删除-${course.name}-课程, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.admin.deleteCourseById(params).then((resp) => {
						if (resp.data.code === 200) {
							this.getAllCourse();
							this.$message({
								message: `删除-${course.name}-课程成功!`,
								type: 'success'
							});
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			SearchAllCourse() {
				this.name = '';
				this.getAllCourse();
			},
			handleSizeChange(val) {
				console.log(`��页 ${val} 条`);
			},
			handleCurrentChange(val) {
				const startIndex = (val - 1) * this.everPageNum;
				const endIndex = startIndex + this.everPageNum;
				this.resultcourse = this.course.slice(startIndex, endIndex);
				this.currentPage = val;
			},
			getAllCourse() {
				this.$api.admin.getAllCourse().then((resp) => {
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
.admin-course-container {
	padding: 20px;
	background-color: #f0f2f5;
	min-height: 100vh;
}

.header-section {
	margin-bottom: 20px;
}

.search-section {
	display: flex;
	gap: 10px;
	align-items: center;
	background: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-input {
	width: 400px;
}

.suggestion-item {
	padding: 8px 0;
}

.course-name {
	font-size: 14px;
	color: #303133;
}

.coach-name {
	font-size: 12px;
	color: #909399;
}

.course-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(800px, 1fr));
	gap: 20px;
	margin-bottom: 20px;
}

.course-card {
	transition: all 0.3s;
}

.course-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-content {
	display: flex;
	gap: 20px;
}

.course-image {
	width: 200px;
	height: 200px;
	flex-shrink: 0;
}

.course-image .el-image {
	width: 100%;
	height: 100%;
	border-radius: 8px;
}

.image-slot {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background: #f5f7fa;
}

.course-info {
	flex: 1;
}

.course-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
}

.course-title {
	margin: 0;
	font-size: 18px;
	color: #303133;
}

.course-actions {
	display: flex;
	gap: 10px;
}

.course-description {
	margin-top: 15px;
	color: #606266;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.price-info {
	display: flex;
	align-items: center;
	gap: 10px;
}

.original-price {
	font-size: 16px;
	font-weight: bold;
	color: #f56c6c;
}

.pagination-section {
	display: flex;
	justify-content: center;
	padding: 20px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 上传组件样式 */
.avatar-uploader {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	width: 200px;
	height: 200px;
}

.avatar-uploader:hover {
	border-color: #409EFF;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 200px;
	height: 200px;
	line-height: 200px;
	text-align: center;
}

.avatar {
	width: 200px;
	height: 200px;
	display: block;
	object-fit: cover;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

::-webkit-scrollbar-thumb {
	background: #dcdfe6;
	border-radius: 3px;
}

::-webkit-scrollbar-track {
	background: #f0f2f5;
}
</style>