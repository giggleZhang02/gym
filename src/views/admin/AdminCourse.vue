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

						<el-button type="success" style="height: 40px;width: 80px;margin-left: 40px;"
							@click="openForm1()">增加</el-button>
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
					<el-button type="success" style="height: 40px;width: 80px;margin-top: 80px;margin-left: 60px;"
						@click="openForm(item)">编辑</el-button>
					<el-button type="success" style="height: 40px;width: 80px;margin-top: 80px;margin-left: 20px;"
						@click="deleteCourseById(item)">删除</el-button>
				</div>
			</el-col>

		</el-row>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			:page-sizes="[3, 6, 9, 12]" :page-size="3" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>

		<el-dialog title="修改课程信息" :visible.sync="dialogFormVisible">
			<el-form :model="onecourse">
				<el-form-item label="课程图片">
					<br>
					<el-upload class="avatar-uploader" action="http://localhost:8081/util/upload"
						:show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img style="width: 200px;height: 200px;"
							v-if="'http://localhost:8081/util/download?name=' + imageLink"
							:src="'http://localhost:8081/util/download?name=' + imageLink" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="课程名称" :label-width="formLabelWidth">
					<el-input v-model="onecourse.name" @blur="onecourse.name = checkLength(onecourse.name,0,50)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="上课地点" :label-width="formLabelWidth">
					<el-input v-model="onecourse.place" @blur="onecourse.place = checkLength(onecourse.place,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程价格" :label-width="formLabelWidth">
					<el-input v-model="onecourse.price" @blur="onecourse.price = checkIsNumber(onecourse.price)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程时长" :label-width="formLabelWidth">
					<el-input v-model="onecourse.coursetime"
						@blur="onecourse.coursetime = checkIsNumber(onecourse.coursetime)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="适用人群" :label-width="formLabelWidth">
					<el-input v-model="onecourse.applicationgroup"
						@blur="onecourse.applicationgroup = checkLength(onecourse.applicationgroup,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程描述" :label-width="formLabelWidth">
					<el-input type="textarea" v-model="onecourse.description"
						@blur="onecourse.description = checkLength(onecourse.description,0,1000)" autocomplete="off"
						:row="5"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAlert" @click="alterCourse()">修 改</el-button>
			</div>
		</el-dialog>

		<el-dialog title="增加课程" :visible.sync="dialogFormVisible1">
			<el-form :model="onecourse1">
				<el-form-item label="课程图片">
					<br>
					<el-upload class="avatar-uploader" action="http://localhost:8081/util/upload"
						:show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
						<img style="width: 200px;height: 200px;" v-if="imageLink1"
							:src="'http://localhost:8081/util/download?name='+imageLink1" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-form-item label="选取教练" :label-width="formLabelWidth">
					<br>
					<el-select v-model="coachId" placeholder="请选择教练">
						<el-option v-for="(coach,index) in coachArr" :key="index" :label="coach.name"
							:value="coach.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="课程名称" :label-width="formLabelWidth">
					<el-input v-model="onecourse1.name" @blur="onecourse1.name = checkLength(onecourse1.name,0,50)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="上课地点" :label-width="formLabelWidth">
					<el-input v-model="onecourse1.place" @blur="onecourse1.place = checkLength(onecourse1.place,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程价格" :label-width="formLabelWidth">
					<el-input v-model="onecourse1.price" @blur="onecourse1.price = checkIsNumber(onecourse1.price)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程时长" :label-width="formLabelWidth">
					<el-input v-model="onecourse1.coursetime"
						@blur="onecourse1.coursetime = checkIsNumber(onecourse1.coursetime)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="适用人群" :label-width="formLabelWidth">
					<el-input v-model="onecourse1.applicationgroup"
						@blur="onecourse1.applicationgroup = checkLength(onecourse1.applicationgroup,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程描述" :label-width="formLabelWidth">
					<el-input type="textarea" v-model="onecourse1.description"
						@blur="onecourse1.description = checkLength(onecourse1.description,0,1000)" autocomplete="off"
						:row="5"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible1 = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAdd" @click="addCourse()">增 加</el-button>
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
							message: `字符长度应在[${minlength}-${maxLength}]之间`,
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
				console.log(`每页 ${val} 条`);
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