<template>
	<div class="admin-message-container">
		<!-- 搜索和操作区域 -->
		<div class="header-section">
			<div class="search-section">
				<el-input
					v-model="searchInput"
					placeholder="搜索通告标题..."
					prefix-icon="el-icon-search"
					clearable
					@keydown.enter.native.prevent="AdminSearchMessageByName"
					@blur="AdminSearchMessageByName"
				/>
				<el-button type="primary" icon="el-icon-search" @click="AdminSearchMessageByName">
					搜索
				</el-button>
				<el-button type="success" icon="el-icon-plus" @click="openform()">
					新增通告
				</el-button>
			</div>
		</div>

		<!-- 通告列表区域 -->
		<div class="message-section">
			<el-card v-for="(item, index) in resultMessageData" :key="index" class="message-card">
				<div class="message-header">
					<div class="title-section">
						<el-tag type="primary" effect="dark" size="small">{{ item.targetgroups }}</el-tag>
						<h3 class="message-title">{{ item.title }}</h3>
					</div>
					<div class="action-buttons">
						<el-button type="primary" size="small" icon="el-icon-edit" @click="openForm(item)">
							编辑
						</el-button>
						<el-button type="danger" size="small" icon="el-icon-delete" @click="deleteMessageById(item)">
							删除
						</el-button>
					</div>
				</div>

				<div class="message-content">
					<el-tooltip :content="item.content" placement="top" :open-delay="500">
						<p class="content-text">{{ item.content }}</p>
					</el-tooltip>
				</div>

				<div class="message-footer">
					<div class="date-info">
						<span class="date-item">
							<i class="el-icon-date"></i>
							发布日期：{{ formatDate(item.publishdate) }}
						</span>
						<el-divider direction="vertical"></el-divider>
						<span class="date-item">
							<i class="el-icon-timer"></i>
							截止日期：{{ formatDate(item.pastdate) }}
						</span>
					</div>
					<div class="status-tag">
						<el-tag :type="isActive(item.pastdate) ? 'success' : 'info'" size="small">
							{{ isActive(item.pastdate) ? '进行中' : '已结束' }}
						</el-tag>
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
				:page-sizes="[8, 16, 24, 32]"
				:page-size="everPageNum"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</div>

		<!-- 编辑对话框 -->
		<el-dialog title="修改通告信息" :visible.sync="dialogFormVisible" width="50%">
			<el-form :model="message" label-width="100px">
				<el-form-item label="通告标题">
					<el-input v-model="message.title" @blur="message.title = checkLength(message.title,0,100)"></el-input>
				</el-form-item>

				<el-form-item label="目标群体">
					<el-select v-model="message.targetgroups" placeholder="请选择目标群体">
						<el-option label="全体用户" value="全体用户"></el-option>
						<el-option label="会员用户" value="会员用户"></el-option>
						<el-option label="教练用户" value="教练用户"></el-option>
					</el-select>
				</el-form-item>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="发起时间">
							<el-date-picker
								v-model="message.publishdate"
								type="date"
								placeholder="选择日期"
								style="width: 100%"
							>
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="结束时间">
							<el-date-picker
								v-model="message.pastdate"
								type="date"
								placeholder="选择日期"
								style="width: 100%"
							>
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="通告内容">
					<el-input
						type="textarea"
						:rows="6"
						v-model="message.content"
						@blur="message.content = checkLength(message.content,0,2000)"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAlert" @click="alterMessage()">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 新增对话框 -->
		<el-dialog title="新增通告" :visible.sync="dialogFormVisible1" width="50%">
			<el-form :model="message1" label-width="100px">
				<!-- 与编辑对话框相同的表单结构 -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible1 = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAdd" @click="addMessage()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			dialogFormVisible: false,
			dialogFormVisible1: false,
			messageData: [],
			resultMessageData: [],
			currentPage: 1,
			everPageNum: 8,
			total: 0,
			searchInput: '',
			message: {},
			message1: {},
			formLabelWidth: 120,
		}
	},
	mounted() {
		this.getAllMessage();
	},
	computed: {
		showAdd(){
			return this.message1.title !== '' && this.message1.targetgroups !== '' && this.message1.publishdate !== '' && this
				.message1.pastdate !== '' && this.message1.content !== '';
		},
		showAlert() {
			return this.message.title !== '' && this.message.targetgroups !== '' && this.message.publishdate !== '' && this
				.message.pastdate !== '' && this.message.content !== '';
		},
	},
	methods: {
		addMessage() {
			const data = this.message1;
			this.$api.admin.addMessage(data).then((resp) => {
				if (resp.data.code === 200) {
					this.$message({
						message: '增加通知成功!',
						type: 'info'
					})
					this.getAllMessage();
				}
			})
			this.onecourse1 = {};
			this.dialogFormVisible1 = false;
		},
		alterMessage() {
			const data = this.message;
			this.$api.admin.alterMessage(data).then((resp) => {
				if (resp.data.code === 200) {
					this.$message({
						message: '修改通知信息成功!',
						type: 'info'
					})
				}
			})
			this.dialogFormVisible = false;
		},
		openform() {
			this.dialogFormVisible1 = true;
		},
		openForm(message) {
			this.message = message;
			this.message.publishdate = new Date(this.message.publishdate);
			this.message.pastdate = new Date(this.message.pastdate );
			this.dialogFormVisible = true;
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
		deleteMessageById(row) {
			const params = {
				messageId: row.id
			};
			this.$confirm(`此操作将永久删除-${row.title}-通告, 是否继续?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$api.admin.deleteMessageById(params).then((resp) => {
					if (resp.data.code === 200) {
						this.getAllMessage();
						this.$message({
							message: `删除-${row.title}-通告成功!`,
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
		AdminSearchMessageByName() {
			if (this.searchInput !== '') {
				const params = {
					name: this.searchInput,
				}
				this.$api.admin.adminSearchMessageByName(params).then((resp) => {
					if (resp.data.code === 200) {
						this.messageData = resp.data.data;
						this.total = this.messageData.length;
						this.resultMessageData = this.messageData.slice(0, this.everPageNum);
					}
				})
			} else {
				this.getAllMessage();
			}
		},
		formatDate(dateString) {
			const date = new Date(dateString);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		getAllMessage() {
			this.$api.admin.getAllMessage().then((resp) => {
				if (resp.data.code === 200) {
					this.messageData = resp.data.data;
					this.total = this.messageData.length;
					this.resultMessageData = this.messageData.slice(0, this.everPageNum);
				}
			})
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			const startIndex = (val - 1) * this.everPageNum;
			const endIndex = startIndex + this.everPageNum;
			this.resultMessageData = this.messageData.slice(startIndex, endIndex);
			this.currentPage = val;
		},
		isActive(pastdate) {
			return new Date(pastdate) > new Date();
		},
	}
}
</script>

<style scoped>
.admin-message-container {
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

.search-section .el-input {
	width: 300px;
}

.message-section {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
	gap: 20px;
	margin-bottom: 20px;
}

.message-card {
	transition: all 0.3s;
}

.message-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
}

.title-section {
	display: flex;
	align-items: center;
	gap: 10px;
}

.message-title {
	margin: 0;
	font-size: 16px;
	color: #303133;
}

.action-buttons {
	display: flex;
	gap: 10px;
}

.message-content {
	padding: 15px 0;
	border-top: 1px solid #ebeef5;
	border-bottom: 1px solid #ebeef5;
}

.content-text {
	margin: 0;
	color: #606266;
	line-height: 1.6;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
}

.message-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 15px;
}

.date-info {
	display: flex;
	align-items: center;
	color: #909399;
	font-size: 13px;
}

.date-item {
	display: flex;
	align-items: center;
	gap: 5px;
}

.date-item i {
	font-size: 14px;
}

.pagination-section {
	display: flex;
	justify-content: center;
	padding: 20px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
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