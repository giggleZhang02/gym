<template>
	<div style="text-align: center;">
		<el-input v-model="searchInput" placeholder="请输入名称" @keydown.enter.native.prevent="AdminSearchMessageByName"
			@blur="AdminSearchMessageByName" style="width: 300px;" />

		<el-button type="primary" style="margin-left: 10px;" @click="AdminSearchMessageByName">搜 索</el-button>
		<el-button type="success" style="margin-left: 20px;" @click="openform()">增 加</el-button>

		<el-table :data="resultMessageData" border style="width: 100%;margin-top: 10px;">
			<el-table-column fixed prop="title" label="名称" width="150">
			</el-table-column>
			<el-table-column prop="content" label="主体内容" width="500">
			</el-table-column>
			<el-table-column prop="targetgroups" label="目标群体" width="120">
			</el-table-column>
			<el-table-column label="发起时间" width="120">
				<template slot-scope="scope">
					{{ formatDate(scope.row.publishdate) }}
				</template>
			</el-table-column>
			<el-table-column label="结束时间" width="120">
				<template slot-scope="scope">
					{{ formatDate(scope.row.pastdate) }}
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="openForm(scope.row)" type="text" size="small">编辑</el-button>
					<el-button @click="deleteMessageById(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			:page-sizes="[8, 16, 24, 32]" :page-size="everPageNum" layout="total, sizes, prev, pager, next, jumper"
			:total="total">
		</el-pagination>

		<el-dialog title="修改通告信息" :visible.sync="dialogFormVisible">
			<el-form :model="message">
				<el-form-item label="通告标题" :label-width="formLabelWidth">
					<el-input v-model="message.title" @blur="message.title = checkLength(message.title,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="目标群体" :label-width="formLabelWidth">
					<el-input v-model="message.targetgroups"
						@blur="message.targetgroups = checkLength(message.targetgroups,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="发起时间" :label-width="formLabelWidth">
					<el-date-picker v-model="message.publishdate" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" :label-width="formLabelWidth">
					<el-date-picker v-model="message.pastdate" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>

				<el-form-item label="通告内容" :label-width="formLabelWidth">
					<el-input type="textarea" :rows="10" v-model="message.content"
						@blur="message.content = checkLength(message.content,0,2000)" autocomplete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAlert" @click="alterMessage()">修 改</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="增加通告信息" :visible.sync="dialogFormVisible1">
			<el-form :model="message1">
				<el-form-item label="通告标题" :label-width="formLabelWidth">
					<el-input v-model="message1.title" @blur="message1.title = checkLength(message1.title,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="目标群体" :label-width="formLabelWidth">
					<el-input v-model="message1.targetgroups"
						@blur="message1.targetgroups = checkLength(message1.targetgroups,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
		
				<el-form-item label="发起时间" :label-width="formLabelWidth">
					<el-date-picker v-model="message1.publishdate" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" :label-width="formLabelWidth">
					<el-date-picker v-model="message1.pastdate" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
		
				<el-form-item label="通告内容" :label-width="formLabelWidth">
					<el-input type="textarea" :rows="10" v-model="message1.content"
						@blur="message1.content = checkLength(message1.content,0,2000)" autocomplete="off"></el-input>
				</el-form-item>
		
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible1 = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAdd" @click="addMessage()">增 加</el-button>
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
		}
	}
</script>

<style scoped>

</style>