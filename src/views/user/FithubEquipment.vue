<template>
	<div>
		<el-row v-for="(item,index) in resultcourse" :key="index">
			<el-col :span="18">
				<div class="grid-content bg-purple" style="display: flex;">
					<div style="margin-right: 20px;">
						<img :src="'http://localhost:8081/util/download?name=' + item.imagelink" alt="图片"
							style="width: 200px; height: 200px;">
					</div>
					<el-descriptions :title="item.name" :column="3" :size="size" style="width: 560px;margin-top: 10px;">
						<el-descriptions-item label="类型">{{item.type}}</el-descriptions-item>
						<el-descriptions-item label="描述">{{item.description}}</el-descriptions-item>
						<el-descriptions-item label="品牌">{{item.brand}}</el-descriptions-item>
						<el-descriptions-item label="适用部位">{{item.applicationarea}}</el-descriptions-item>
						<el-descriptions-item label="适用人群">
							<el-tag size="medium">{{item.applicationgroup}}</el-tag>
						</el-descriptions-item>
						<el-descriptions-item label="购买价格">{{item.purchasingprice}}</el-descriptions-item>
						<el-descriptions-item label="规格">{{item.specification}}</el-descriptions-item>
						<el-descriptions-item label="购买日期">{{item.purchasedate.join('-')}}</el-descriptions-item>
						<el-descriptions-item label="数量">{{item.num}}</el-descriptions-item>
						<el-descriptions-item label="维护记录">{{item.preserverecord}}</el-descriptions-item>
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
			this.getAllEquipment();
		},
		methods: {
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
			getAllEquipment() {
				const params = {
					userId: this.$store.state.tab.userData.id
				}
				this.$api.equipment.getAllEquipment(params).then((resp) => {
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