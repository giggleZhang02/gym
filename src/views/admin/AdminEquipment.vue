<template>
	<div class="admin-equipment-container">
		<!-- 搜索和操作区域 -->
		<div class="header-section">
			<div class="search-section">
				<el-input
					v-model="searchInput"
					placeholder="搜索器材名称..."
					prefix-icon="el-icon-search"
					clearable
					@keydown.enter.native.prevent="AdminSearchEquipmentByName"
					@blur="AdminSearchEquipmentByName"
				/>
				<el-button type="primary" icon="el-icon-search" @click="AdminSearchEquipmentByName">
					搜索
				</el-button>
				<el-button type="success" icon="el-icon-plus" @click="openform()">
					新增器材
				</el-button>
			</div>
		</div>

		<!-- 器材列表区域 -->
		<div class="equipment-section">
			<el-card v-for="(item, index) in resultEquipmentData" :key="index" class="equipment-card">
				<div class="equipment-content">
					<div class="equipment-image">
						<el-image
							:src="'http://localhost:8081/util/download?name=' + item.imagelink"
							fit="cover"
							:preview-src-list="['http://localhost:8081/util/download?name=' + item.imagelink]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</div>

					<div class="equipment-info">
						<div class="equipment-header">
							<h2 class="equipment-title">{{ item.name }}</h2>
							<div class="equipment-actions">
								<el-button type="primary" icon="el-icon-edit" size="small" @click="openForm(item)">
									编辑
								</el-button>
								<el-button type="danger" icon="el-icon-delete" size="small" @click="deleteEquipmentById(item)">
									删除
								</el-button>
							</div>
						</div>

						<el-descriptions :column="3" border size="small">
							<el-descriptions-item label="器材类型">
								<el-tag size="small">{{ item.type }}</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="品牌">
								<i class="el-icon-goods"></i>
								{{ item.brand }}
							</el-descriptions-item>
							<el-descriptions-item label="规格">
								{{ item.specification }}
							</el-descriptions-item>
							<el-descriptions-item label="适用部位">
								<i class="el-icon-aim"></i>
								{{ item.applicationarea }}
							</el-descriptions-item>
							<el-descriptions-item label="适用人群">
								<i class="el-icon-user"></i>
								{{ item.applicationgroup }}
							</el-descriptions-item>
							<el-descriptions-item label="当前数量">
								<el-tag type="success">{{ item.num }} 台</el-tag>
							</el-descriptions-item>
						</el-descriptions>

						<div class="equipment-details">
							<div class="price-info">
								<span class="label">购买价格：</span>
								<span class="price">¥{{ item.purchasingprice }}</span>
								<el-divider direction="vertical"></el-divider>
								<span class="label">购买日期：</span>
								<span>{{ formatDate(item.purchasedate) }}</span>
							</div>

							<el-tooltip :content="item.description" placement="top">
								<div class="description">
									<span class="label">器材描述：</span>
									{{ item.description }}
								</div>
							</el-tooltip>

							<el-popover
								placement="top"
								width="300"
								trigger="hover"
							>
								<div class="maintenance-record">{{ item.preserverecord }}</div>
								<div slot="reference" class="record-preview">
									<i class="el-icon-document"></i>
									维护记录
								</div>
							</el-popover>
						</div>
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
				:page-sizes="[3, 6, 9, 12]"
				:page-size="everPageNum"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</div>

		<!-- 编辑对话框 -->
		<el-dialog title="修改器材信息" :visible.sync="dialogFormVisible" width="50%">
			<!-- 保持原有的表单内容，但美化布局 -->
			<el-form :model="equipment" label-width="100px">
				<el-form-item label="器材图片">
					<el-upload
						class="avatar-uploader"
						action="http://localhost:8081/util/upload"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
					>
						<img
							v-if="imageLink"
							:src="'http://localhost:8081/util/download?name=' + imageLink"
							class="avatar"
						>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="器材名称">
							<el-input v-model="equipment.name" @blur="equipment.name = checkLength(equipment.name,0,50)"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="器材类型">
							<el-input v-model="equipment.type" @blur="equipment.type = checkLength(equipment.type,0,50)"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 其他表单项保持不变 -->
				<!-- ... -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAlert" @click="alterEquipment()">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 新增对话框 -->
		<el-dialog title="新增器材" :visible.sync="dialogFormVisible1" width="50%">
			<!-- 与编辑对话框类似的表单布局 -->
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogFormVisible: false,
				dialogFormVisible1: false,
				equipmentData: [],
				resultEquipmentData: [],
				currentPage: 1,
				everPageNum: 3,
				total: 0,
				searchInput: '',
				equipment: {},
				equipment1: {},
				formLabelWidth: 120,
				imageLink: '',
				imageLink1: '',
			}
		},
		mounted() {
			this.getAllEquipment();
		},
		computed: {
			showAdd() {
				return this.equipment1.name !== '' && this.equipment1.type !== '' && this.equipment1.description !== 
					'' && this.equipment1.applicationarea !== '' && this.equipment1.brand !== '' && this.equipment1.applicationgroup !== '' 
					&& this.equipment1.purchasingprice !== '' && this.equipment1.specification !== '' && this.equipment1.purchasedate !== ''
					&& this.equipment1.preserverecord !== '' && this.equipment1.num !== '' && this.imageLink1 !== '';
			},
			showAlert() {
				return this.equipment.name !== '' && this.equipment.type !== '' && this.equipment.description !== 
					'' && this.equipment.applicationarea !== '' && this.equipment.brand !== '' && this.equipment.applicationgroup !== '' 
					&& this.equipment.purchasingprice !== '' && this.equipment.specification !== '' && this.equipment.purchasedate !== ''
					&& this.equipment.preserverecord !== '' && this.equipment.num !== '';
			},
		},
		methods: {
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
			addEquipment() {
				this.equipment1.imagelink = this.imageLink1;
				const data = this.equipment1;
				this.$api.admin.addEquipment(data).then((resp) => {
					if (resp.data.code === 200) {
						this.$message({
							message: '增加通知成功!',
							type: 'info'
						})
						this.getAllEquipment();
					}
				})
				this.onecourse1 = {};
				this.dialogFormVisible1 = false;
			},
			alterEquipment() {
				this.equipment.imagelink = this.imageLink;
				const data = this.equipment;
				this.$api.admin.alterEquipment(data).then((resp) => {
					if (resp.data.code === 200) {
						this.$message({
							message: '修改器材信息成功!',
							type: 'info'
						})
					}
				})
				this.dialogFormVisible = false;
			},
			openform() {
				this.dialogFormVisible1 = true;
			},
			openForm(equipment) {
				this.equipment = equipment;
				this.imageLink = equipment.imagelink;
				this.equipment.purchasedate = new Date(this.equipment.purchasedate);
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
			deleteEquipmentById(row) {
				const params = {
					equipmentId: row.id
				};
				this.$confirm(`此操作将永久删除-${row.name}-器材, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.admin.deleteEquipmentById(params).then((resp) => {
						if (resp.data.code === 200) {
							this.getAllEquipment();
							this.$message({
								message: `删除-${row.name}-器材成功!`,
								type: 'success'
							});
						}
					})
				}).catch(() => {
					this.$equipment({
						type: 'info',
						equipment: '已取消删除'
					});
				});
			},
			AdminSearchEquipmentByName() {
				if (this.searchInput !== '') {
					const params = {
						name: this.searchInput,
					}
					this.$api.admin.adminSearchEquipmentByName(params).then((resp) => {
						if (resp.data.code === 200) {
							this.equipmentData = resp.data.data;
							this.total = this.equipmentData.length;
							this.resultEquipmentData = this.equipmentData.slice(0, this.everPageNum);
						}
					})
				} else {
					this.getAllEquipment();
				}
			},
			formatDate(dateString) {
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			getAllEquipment() {
				this.$api.admin.getAllEquipment().then((resp) => {
					if (resp.data.code === 200) {
						this.equipmentData = resp.data.data;
						this.total = this.equipmentData.length;
						this.resultEquipmentData = this.equipmentData.slice(0, this.everPageNum);
					}
				})
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				const startIndex = (val - 1) * this.everPageNum;
				const endIndex = startIndex + this.everPageNum;
				this.resultEquipmentData = this.equipmentData.slice(startIndex, endIndex);
				this.currentPage = val;
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
		}
	}
</script>

<style scoped>
.admin-equipment-container {
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

.equipment-section {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(800px, 1fr));
	gap: 20px;
	margin-bottom: 20px;
}

.equipment-card {
	transition: all 0.3s;
}

.equipment-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.equipment-content {
	display: flex;
	gap: 20px;
}

.equipment-image {
	width: 200px;
	height: 200px;
	flex-shrink: 0;
}

.equipment-image .el-image {
	width: 100%;
	height: 100%;
	border-radius: 8px;
}

.image-slot {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background: #f5f7fa;
}

.equipment-info {
	flex: 1;
}

.equipment-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
}

.equipment-title {
	margin: 0;
	font-size: 18px;
	color: #303133;
}

.equipment-actions {
	display: flex;
	gap: 10px;
}

.equipment-details {
	margin-top: 15px;
}

.price-info {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}

.price {
	font-size: 16px;
	font-weight: bold;
	color: #f56c6c;
}

.label {
	color: #909399;
	margin-right: 5px;
}

.description {
	margin: 10px 0;
	color: #606266;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.record-preview {
	color: #409EFF;
	cursor: pointer;
}

.maintenance-record {
	max-height: 200px;
	overflow-y: auto;
	line-height: 1.5;
}

.pagination-section {
	display: flex;
	justify-content: center;
	padding: 20px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 上传组件样式 */
.avatar-uploader {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	width: 200px;
	height: 200px;
}

.avatar-uploader:hover {
	border-color: #409EFF;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 200px;
	height: 200px;
	line-height: 200px;
	text-align: center;
}

.avatar {
	width: 200px;
	height: 200px;
	display: block;
	object-fit: cover;
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