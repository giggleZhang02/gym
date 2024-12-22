<template>
	<div class="admin-coach-container">
		<!-- 搜索区域 -->
		<div class="search-section">
			<el-input
				v-model="searchInput"
				placeholder="请输入教练姓名搜索"
				prefix-icon="el-icon-search"
				clearable
				@keydown.enter.native.prevent="AdminSearchCoachByName"
				@blur="AdminSearchCoachByName"
			/>
			<el-button type="primary" icon="el-icon-search" @click="AdminSearchCoachByName">
				搜索
			</el-button>
		</div>

		<!-- 表格区域 -->
		<div class="table-section">
			<el-table
				:data="resultCoachData"
				border
				stripe
				highlight-current-row
				style="width: 100%"
			>
				<el-table-column fixed prop="name" label="姓名" min-width="120">
					<template slot-scope="scope">
						<div class="coach-name">
							<el-avatar :size="30" icon="el-icon-user-solid"></el-avatar>
							<span style="margin-left: 10px">{{ scope.row.name }}</span>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="基本信息" width="400">
					<template slot-scope="scope">
						<div class="basic-info">
							<el-tag :type="scope.row.sex === 1 ? 'primary' : 'success'" size="small">
								{{ scope.row.sex === 1 ? '男' : '女' }}
							</el-tag>
							<el-divider direction="vertical"></el-divider>
							<span>
								<i class="el-icon-date"></i>
								{{ formatDate(scope.row.birthday) }}
							</span>
							<el-divider direction="vertical"></el-divider>
							<span>{{ scope.row.age }}岁</span>
							<el-divider direction="vertical"></el-divider>
							<span>
								<i class="el-icon-phone"></i>
								{{ scope.row.tel }}
							</span>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="身体数据" width="200">
					<template slot-scope="scope">
						<div class="body-data">
							<el-tooltip content="身高" placement="top">
								<span>{{ scope.row.height }}cm</span>
							</el-tooltip>
							<el-divider direction="vertical"></el-divider>
							<el-tooltip content="体重" placement="top">
								<span>{{ scope.row.weight }}kg</span>
							</el-tooltip>
							<el-divider direction="vertical"></el-divider>
							<el-tooltip content="BMI" placement="top">
								<span>BMI: {{ scope.row.bmi }}</span>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="专业资质" width="200">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.certificate" placement="top">
							<el-tag type="warning" effect="plain">
								<i class="el-icon-medal"></i>
								{{ scope.row.certificate }}
							</el-tag>
						</el-tooltip>
					</template>
				</el-table-column>

				<el-table-column label="专业领域" width="200">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.professionalfield" placement="top">
							<div class="professional-field">
								<i class="el-icon-star-on"></i>
								{{ scope.row.professionalfield }}
							</div>
						</el-tooltip>
					</template>
				</el-table-column>

				<el-table-column label="工作经验" width="200">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.workexperience" placement="top">
							<div class="work-experience">
								<i class="el-icon-suitcase"></i>
								{{ scope.row.workexperience }}
							</div>
						</el-tooltip>
					</template>
				</el-table-column>

				<el-table-column label="个人简介" width="300">
					<template slot-scope="scope">
						<el-popover
							placement="top"
							width="300"
							trigger="hover"
						>
							<div class="introduction-popover">{{ scope.row.introduction }}</div>
							<div slot="reference" class="introduction-preview">
								<i class="el-icon-document"></i>
								{{ scope.row.introduction.substring(0, 20) }}...
							</div>
						</el-popover>
					</template>
				</el-table-column>

				<el-table-column label="注册/登录信息" width="240">
					<template slot-scope="scope">
						<div class="date-info">
							<div>
								<i class="el-icon-time"></i>
								注册：{{ formatDate(scope.row.enrolldate) }}
							</div>
							<div>
								<i class="el-icon-timer"></i>
								最后登录：{{ formatDate(scope.row.lastlogindate) }}
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column fixed="right" label="操作" width="120">
					<template slot-scope="scope">
						<el-button
							type="danger"
							size="mini"
							icon="el-icon-delete"
							@click="deleteCoachById(scope.row)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 分页区域 -->
		<div class="pagination-section">
			<el-pagination
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[8, 16, 24, 32]"
				:page-size="everPageNum"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				coachData: [],
				resultCoachData: [],
				currentPage: 1,
				everPageNum: 8,
				total: 0,
				searchInput: ''
			}
		},
		mounted() {
			this.getAllCoach();
		},
		computed: {

		},
		methods: {
			deleteCoachById(row) {
				const params = {
					coachId: row.id
				};
				this.$confirm(`此操作将永久删除-${row.name}-教练, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.admin.deleteCoachById(params).then((resp) => {
						if (resp.data.code === 200) {
							this.getAllCoach();
							this.$message({
								message: `删除-${row.name}-教练成功!`,
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
			AdminSearchCoachByName() {
				if (this.searchInput !== '') {
					const params = {
						name: this.searchInput,
					}
					this.$api.admin.adminSearchCoachByName(params).then((resp) => {
						if (resp.data.code === 200) {
							this.coachData = resp.data.data;
							this.total = this.coachData.length;
							this.resultCoachData = this.coachData.slice(0, this.everPageNum);
						}
					})
				} else {
					this.getAllCoach();
				}
			},
			formatDate(dateString) {
				// 假设日期字符串格式为 'YYYY-MM-DD HH:mm:ss'
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 补齐两位数
				const day = date.getDate().toString().padStart(2, '0'); // 补齐两位数
				return `${year}-${month}-${day}`;
			},
			getAllCoach() {
				this.$api.admin.getAllCoach().then((resp) => {
					if (resp.data.code === 200) {
						this.coachData = resp.data.data;
						this.total = this.coachData.length;
						this.resultCoachData = this.coachData.slice(0, this.everPageNum);
					}
				})
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				const startIndex = (val - 1) * this.everPageNum;
				const endIndex = startIndex + this.everPageNum;
				this.resultCoachData = this.coachData.slice(startIndex, endIndex);
				this.currentPage = val;
			},
		}
	}
</script>

<style scoped>
.admin-coach-container {
	padding: 20px;
	background-color: #f0f2f5;
	min-height: 100vh;
}

.search-section {
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
	background: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-section .el-input {
	width: 300px;
}

.table-section {
	background: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
	margin-bottom: 20px;
	overflow-x: auto;
}

.pagination-section {
	display: flex;
	justify-content: center;
	padding: 20px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.coach-name {
	display: flex;
	align-items: center;
}

.basic-info {
	display: flex;
	align-items: center;
	gap: 8px;
}

.body-data {
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.professional-field, .work-experience {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.professional-field i, .work-experience i {
	margin-right: 5px;
	color: #E6A23C;
}

.introduction-preview {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
}

.introduction-preview i {
	margin-right: 5px;
	color: #909399;
}

.introduction-popover {
	max-height: 200px;
	overflow-y: auto;
	line-height: 1.5;
}

.date-info {
	display: flex;
	flex-direction: column;
	gap: 5px;
	font-size: 13px;
	color: #606266;
}

.date-info i {
	margin-right: 5px;
}

.el-table {
	margin-bottom: 20px;
}

/* 表格hover效果 */
.el-table tbody tr:hover > td {
	background-color: #f5f7fa !important;
}

/* 自定义滚动条样式 */
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