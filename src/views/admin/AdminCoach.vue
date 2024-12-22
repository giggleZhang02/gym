<template>
	<div style="text-align: center;">
		<el-input v-model="searchInput" placeholder="请输入姓名" @keydown.enter.native.prevent="AdminSearchCoachByName"
			@blur="AdminSearchCoachByName" style="width: 300px;" />

		<el-button type="primary" style="margin-left: 10px;" @click="AdminSearchCoachByName">搜索</el-button>

		<el-table :data="resultCoachData" border style="width: 100%;margin-top: 10px;">
			<el-table-column fixed prop="name" label="姓名" width="150">
			</el-table-column>
			<el-table-column label="性别" width="120">
				<template slot-scope="scope">
					{{ scope.row.sex === 1?'男':'女' }}
				</template>
			</el-table-column>
			<el-table-column label="出生日期" width="120">
				<template slot-scope="scope">
					{{ formatDate(scope.row.birthday) }}
				</template>
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="120">
			</el-table-column>
			<el-table-column prop="tel" label="电话" width="300">
			</el-table-column>
			<el-table-column prop="height" label="身高" width="120">
			</el-table-column>
			<el-table-column prop="weight" label="体重" width="120">
			</el-table-column>
			<el-table-column prop="bmi" label="BMI" width="120">
			</el-table-column>
			<el-table-column prop="certificate" label="证书" width="200">
			</el-table-column>
			<el-table-column prop="introduction" label="简介" width="1000">
			</el-table-column>
			<el-table-column prop="professionalfield" label="专业领域" width="1000">
			</el-table-column>
			<el-table-column prop="workexperience" label="工作经验" width="1000">
			</el-table-column>
			<el-table-column label="注册日期" width="120">
				<template slot-scope="scope">
					{{ formatDate(scope.row.enrolldate) }}
				</template>
			</el-table-column>
			<el-table-column label="最后登录时间" width="120">
				<template slot-scope="scope">
					{{ formatDate(scope.row.lastlogindate) }}
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope"> 
					<el-button @click="deleteCoachById(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			:page-sizes="[8, 16, 24, 32]" :page-size="everPageNum" layout="total, sizes, prev, pager, next, jumper"
			:total="total">
		</el-pagination>
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

</style>