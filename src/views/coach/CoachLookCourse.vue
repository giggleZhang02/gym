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
					</div>
				</div>
			</el-col>
		</el-row>

		<el-row v-for="(item,index) in resultcourse" :key="index">
			<el-col :span="24">
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