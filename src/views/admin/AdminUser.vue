<template>
	<div class="admin-user-container">
		<!-- 搜索区域 -->
		<div class="search-section">
			<el-input
				v-model="searchInput"
				placeholder="请输入用户姓名搜索"
				prefix-icon="el-icon-search"
				clearable
				@clear="clearSearch"
				@keydown.enter.native.prevent="AdminSearchUserByName"
				@blur="AdminSearchUserByName"
			/>
			<el-button type="primary" icon="el-icon-search" @click="AdminSearchUserByName">
				搜索
			</el-button>
		</div>

		<!-- 表格区域 -->
		<div class="table-section">
			<el-table
				:data="resultUserData"
				border
				stripe
				highlight-current-row
				style="width: 100%"
			>
				<el-table-column fixed prop="name" label="姓名" min-width="100">
					<template slot-scope="scope">
						<div class="user-name">
							<el-avatar :size="30" icon="el-icon-user"></el-avatar>
							<span style="margin-left: 10px">{{ scope.row.name }}</span>
						</div>
					</template>
				</el-table-column>
				
				<el-table-column label="性别" width="80">
					<template slot-scope="scope">
						<el-tag :type="scope.row.sex === 1 ? 'primary' : 'success'" size="small">
							{{ scope.row.sex === 1 ? '男' : '女' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="出生日期" width="120">
					<template slot-scope="scope">
						<i class="el-icon-date"></i>
						{{ formatDate(scope.row.birthday) }}
					</template>
				</el-table-column>

				<el-table-column prop="age" label="年龄" width="80">
					<template slot-scope="scope">
						{{ scope.row.age }} 岁
					</template>
				</el-table-column>

				<el-table-column prop="tel" label="电话" width="140">
					<template slot-scope="scope">
						<i class="el-icon-phone"></i>
						{{ scope.row.tel }}
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

				<el-table-column label="会员状态" width="100">
					<template slot-scope="scope">
						<el-tag :type="scope.row.vipstatus === 1 ? 'warning' : 'info'" effect="dark">
							{{ scope.row.vipstatus === 1 ? 'VIP会员' : '普通用户' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="accountbalance" label="账户余额" width="120">
					<template slot-scope="scope">
						<span style="color: #f56c6c; font-weight: bold">
							¥ {{ scope.row.accountbalance }}
						</span>
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
							@click="deleteUserById(scope.row)"
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
				userData: [],
				resultUserData: [],
				currentPage: 1,
				everPageNum: 8,
				total: 0,
				searchInput: ''
			}
		},
		mounted() {
			this.getAllUser();
		},
		computed: {

		},
		methods: {
			deleteUserById(row) {
				const params = {
					userId: row.id
				};
				this.$confirm(`此操作将永久删除-${row.name}-用户, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.admin.deleteUserById(params).then((resp) => {
						if (resp.data.code === 200) {
							this.getAllUser();
							this.$message({
								message: `删除-${row.name}-用户成功!`,
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
			AdminSearchUserByName() {
				if (this.searchInput !== '') {
					const params = {
						name: this.searchInput,
					}
					this.$api.admin.adminSearchUserByName(params).then((resp) => {
						if (resp.data.code === 200) {
							this.userData = resp.data.data;
							this.total = this.userData.length;
							this.resultUserData = this.userData.slice(0, this.everPageNum);
						}
					})
				} else {
					this.getAllUser();
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
			getAllUser() {
				this.$api.admin.getAllUser().then((resp) => {
					if (resp.data.code === 200) {
						this.userData = resp.data.data;
						this.total = this.userData.length;
						this.resultUserData = this.userData.slice(0, this.everPageNum);
					}
				})
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				const startIndex = (val - 1) * this.everPageNum;
				const endIndex = startIndex + this.everPageNum;
				this.resultUserData = this.userData.slice(startIndex, endIndex);
				this.currentPage = val;
			},
		}
	}
</script>

<style scoped>
.admin-user-container {
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
}

.pagination-section {
	display: flex;
	justify-content: center;
	padding: 20px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.user-name {
	display: flex;
	align-items: center;
}

.body-data {
	display: flex;
	align-items: center;
	justify-content: space-around;
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