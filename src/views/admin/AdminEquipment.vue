<template>
	<div style="text-align: center;">
		<el-input v-model="searchInput" placeholder="请输入名称" @keydown.enter.native.prevent="AdminSearchEquipmentByName"
			@blur="AdminSearchEquipmentByName" style="width: 300px;" />

		<el-button type="primary" style="margin-left: 10px;" @click="AdminSearchEquipmentByName">搜 索</el-button>
		<el-button type="success" style="margin-left: 20px;" @click="openform()">增 加</el-button>

		<el-table :data="resultEquipmentData" border style="width: 100%;margin-top: 10px;">
			<el-table-column fixed prop="targetgroups" label="图片" width="120">
				<template slot-scope="scope">
					<img style="width: 120px;height: 120px;" v-if="scope.row.imagelink"
						:src="'http://localhost:8081/util/download?name=' + scope.row.imagelink" class="avatar">
				</template>
			</el-table-column>
			<el-table-column fixed prop="name" label="器材名称" width="150">
			</el-table-column>
			<el-table-column prop="type" label="器材类型" width="120">
			</el-table-column>
			<el-table-column prop="description" label="器材描述" width="200">
			</el-table-column>
			<el-table-column prop="applicationarea" label="适用部位" width="120">
			</el-table-column>
			<el-table-column prop="brand" label="器材品牌" width="120">
			</el-table-column>
			<el-table-column prop="applicationgroup" label="适用人群" width="120">
			</el-table-column>
			<el-table-column prop="purchasingprice" label="购买价格" width="120">
			</el-table-column>
			<el-table-column prop="specification" label="器材规格" width="120">
			</el-table-column>
			<el-table-column prop="preserverecord" label="维护记录" width="300">
			</el-table-column>
			<el-table-column prop="num" label="目前数量" width="120">
			</el-table-column>
			<el-table-column label="购买日期" width="120">
				<template slot-scope="scope">
					{{ formatDate(scope.row.purchasedate) }}
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="openForm(scope.row)" type="text" size="small">编辑</el-button>
					<el-button @click="deleteEquipmentById(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			:page-sizes="[3, 6, 9, 12]" :page-size="everPageNum" layout="total, sizes, prev, pager, next, jumper"
			:total="total">
		</el-pagination>

		<el-dialog title="修改器材信息" :visible.sync="dialogFormVisible">
			<el-form :model="equipment">
				<el-form-item label="器材图片">
					<br>
					<el-upload class="avatar-uploader" action="http://localhost:8081/util/upload"
						:show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img style="width: 200px;height: 200px;"
							v-if="'http://localhost:8081/util/download?name=' + imageLink"
							:src="'http://localhost:8081/util/download?name=' + imageLink" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="器材名称" :label-width="formLabelWidth">
					<el-input v-model="equipment.name" @blur="equipment.name = checkLength(equipment.name,0,50)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="器材类型" :label-width="formLabelWidth">
					<el-input v-model="equipment.type" @blur="equipment.type = checkLength(equipment.type,0,50)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="器材品牌" :label-width="formLabelWidth">
					<el-input v-model="equipment.brand" @blur="equipment.brand = checkLength(equipment.brand,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="器材描述" :label-width="formLabelWidth">
					<el-input v-model="equipment.description" @blur="equipment.description = checkLength(equipment.description,0,1000)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="适用部位" :label-width="formLabelWidth">
					<el-input v-model="equipment.applicationarea" @blur="equipment.applicationarea = checkLength(equipment.applicationarea,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="适用人群" :label-width="formLabelWidth">
					<el-input v-model="equipment.applicationgroup" @blur="equipment.applicationgroup = checkLength(equipment.applicationgroup,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="购买价格" :label-width="formLabelWidth">
					<el-input v-model="equipment.purchasingprice" @blur="equipment.purchasingprice = checkIsNumber(equipment.purchasingprice)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="器材规格" :label-width="formLabelWidth">
					<el-input v-model="equipment.specification" @blur="equipment.specification = checkLength(equipment.specification,0,50)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="维护记录" :label-width="formLabelWidth">
					<el-input v-model="equipment.preserverecord" @blur="equipment.preserverecord = checkLength(equipment.preserverecord,0,2000)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="目前数量" :label-width="formLabelWidth">
					<el-input v-model="equipment.num" @blur="equipment.num = checkIsNumber(equipment.num)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="购买日期" :label-width="formLabelWidth">
					<el-date-picker v-model="equipment.purchasedate" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAlert" @click="alterEquipment()">修 改</el-button>
			</div>
		</el-dialog>

		<el-dialog title="增加器材信息" :visible.sync="dialogFormVisible1">
			<el-form :model="equipment1">
		
				<el-form-item label="器材图片">
					<br>
					<el-upload class="avatar-uploader" action="http://localhost:8081/util/upload"
						:show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
						<img style="width: 200px;height: 200px;" v-if="imageLink1"
							:src="'http://localhost:8081/util/download?name='+imageLink1" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="器材名称" :label-width="formLabelWidth">
					<el-input v-model="equipment1.name" @blur="equipment1.name = checkLength(equipment1.name,0,50)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="器材类型" :label-width="formLabelWidth">
					<el-input v-model="equipment1.type" @blur="equipment1.type = checkLength(equipment1.type,0,50)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="器材品牌" :label-width="formLabelWidth">
					<el-input v-model="equipment1.brand" @blur="equipment1.brand = checkLength(equipment1.brand,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="器材描述" :label-width="formLabelWidth">
					<el-input v-model="equipment1.description" @blur="equipment1.description = checkLength(equipment1.description,0,1000)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="适用部位" :label-width="formLabelWidth">
					<el-input v-model="equipment1.applicationarea" @blur="equipment1.applicationarea = checkLength(equipment1.applicationarea,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="适用人群" :label-width="formLabelWidth">
					<el-input v-model="equipment1.applicationgroup" @blur="equipment1.applicationgroup = checkLength(equipment1.applicationgroup,0,100)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="购买价格" :label-width="formLabelWidth">
					<el-input v-model="equipment1.purchasingprice" @blur="equipment1.purchasingprice = checkIsNumber(equipment1.purchasingprice)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="器材规格" :label-width="formLabelWidth">
					<el-input v-model="equipment1.specification" @blur="equipment1.specification = checkLength(equipment1.specification,0,50)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="维护记录" :label-width="formLabelWidth">
					<el-input v-model="equipment1.preserverecord" @blur="equipment1.preserverecord = checkLength(equipment1.preserverecord,0,2000)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="目前数量" :label-width="formLabelWidth">
					<el-input v-model="equipment1.num" @blur="equipment1.num = checkIsNumber(equipment1.num)"
						autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="购买日期" :label-width="formLabelWidth">
					<el-date-picker v-model="equipment1.purchasedate" type="date" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible1 = false">取 消</el-button>
				<el-button type="primary" :disabled="!showAdd" @click="addEquipment()">增 加</el-button>
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

</style>