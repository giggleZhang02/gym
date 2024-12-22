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
				<div class="grid-content bg-purple-light" style="display: flex;height: 205px;">
					<i v-if="item.isCollect === 1" class="el-icon-star-on"
						style="margin-top: 90px; margin-left: 40px; cursor: pointer;" @click="toggleStar(item)"
						title="点击取消收藏"></i>
					<i v-else class="el-icon-star-off" style="margin-top: 90px; margin-left: 40px; cursor: pointer;"
						@click="toggleStar(item)" title="点击收藏"></i>
					<el-button type="success" style="height: 40px;width: 80px;margin-top: 80px;margin-left: 60px;"
						@click="UserSign(item.id)">签到</el-button>
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