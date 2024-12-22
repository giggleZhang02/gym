<template>
	<div>
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
				<div class="grid-content bg-purple-light"
					style="display: flex; flex-direction: column; align-items: center; height: 205px;">
					<el-button :type="item.sign === 0 ? 'primary' : 'info'"
						style="height: 40px; width: 120px; margin-top: 50px;" @click="CoachPastSign(item.id,item.sign)">
						{{ item.sign === 0 ? '发布签到' : '取消签到' }}
					</el-button>
					<el-button type="success" style="height: 40px; width: 120px; margin-top: 20px;margin-right: 10px;"
						@click="CheckSignList(item.id)">
						查看签到列表
					</el-button>
				</div>
			</el-col>
		</el-row>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			:page-sizes="[3, 6, 9, 12]" :page-size="3" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>

		<el-dialog title="签到列表" :visible.sync="dialogTableVisible">
			<el-table :data="SignList">
				<el-table-column property="name" label="姓名" width="150"></el-table-column>
				<el-table-column label="签到时间" width="200">
					<template slot-scope="scope">
						{{ formatDate(scope.row.signdate) }}
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