<template>
	<div class="equipment-container">
		<div class="page-header">
			<h2>健身器材</h2>
			<div class="header-line"></div>
		</div>

		<!-- 器材列表部分 -->
		<div class="equipment-list">
			<el-card v-for="(item, index) in resultcourse" :key="index" class="equipment-card">
				<div class="equipment-content">
					<div class="equipment-image">
						<img :src="'http://localhost:8081/util/download?name=' + item.imagelink" :alt="item.name">
					</div>
					
					<div class="equipment-info">
						<div class="info-header">
							<h3 class="equipment-title">{{item.name}}</h3>
							<el-tag type="primary">{{item.brand}}</el-tag>
						</div>

						<div class="info-grid">
							<div class="info-item">
								<i class="el-icon-collection-tag"></i>
								<span class="label">类型：</span>
								<span>{{item.type}}</span>
							</div>
							
							<div class="info-item">
								<i class="el-icon-user"></i>
								<span class="label">适用人群：</span>
								<el-tag size="small" type="success">{{item.applicationgroup}}</el-tag>
							</div>

							<div class="info-item">
								<i class="el-icon-aim"></i>
								<span class="label">适用部位：</span>
								<span>{{item.applicationarea}}</span>
							</div>

							<div class="info-item">
								<i class="el-icon-money"></i>
								<span class="label">购买价格：</span>
								<span class="price">¥{{item.purchasingprice}}</span>
							</div>

							<div class="info-item">
								<i class="el-icon-date"></i>
								<span class="label">购买日期：</span>
								<span>{{item.purchasedate.join('-')}}</span>
							</div>

							<div class="info-item">
								<i class="el-icon-document"></i>
								<span class="label">规格：</span>
								<span>{{item.specification}}</span>
							</div>

							<div class="info-item">
								<i class="el-icon-goods"></i>
								<span class="label">数量：</span>
								<el-tag size="small" type="warning">{{item.num}} 台</el-tag>
							</div>
						</div>

						<div class="equipment-description">
							<div class="description-title">
								<i class="el-icon-info"></i>
								<span>器材描述</span>
							</div>
							<p>{{item.description}}</p>
						</div>

						<div class="maintenance-record">
							<div class="record-title">
								<i class="el-icon-time"></i>
								<span>维护记录</span>
							</div>
							<p>{{item.preserverecord}}</p>
						</div>
					</div>
				</div>
			</el-card>
		</div>

		<!-- 分页部分 -->
		<div class="pagination-section">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[3, 6, 9, 12]"
				:page-size="3"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
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

<style lang="less" scoped>
.equipment-container {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: calc(100vh - 120px);
}

.page-header {
	text-align: center;
	margin-bottom: 30px;

	h2 {
		color: #303133;
		font-size: 24px;
		margin-bottom: 10px;
	}

	.header-line {
		width: 50px;
		height: 3px;
		background: #409EFF;
		margin: 0 auto;
	}
}

.equipment-list {
	display: grid;
	gap: 20px;
	margin-bottom: 20px;
}

.equipment-card {
	border-radius: 8px;
	overflow: hidden;
	transition: all 0.3s;
	
	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}
}

.equipment-content {
	display: flex;
	gap: 20px;
}

.equipment-image {
	width: 240px;
	height: 240px;
	border-radius: 8px;
	overflow: hidden;
	flex-shrink: 0;
	
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
		
		&:hover {
			transform: scale(1.05);
		}
	}
}

.equipment-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.info-header {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.equipment-title {
		font-size: 20px;
		color: #303133;
		margin: 0;
	}
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 15px;
	padding: 15px;
	background: #f8f9fa;
	border-radius: 6px;
}

.info-item {
	display: flex;
	align-items: center;
	gap: 8px;

	i {
		color: #909399;
	}

	.label {
		color: #606266;
		font-weight: 500;
	}

	.price {
		color: #f56c6c;
		font-weight: bold;
	}
}

.equipment-description, .maintenance-record {
	.description-title, .record-title {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
		color: #303133;
		font-weight: 500;

		i {
			color: #409EFF;
		}
	}

	p {
		color: #606266;
		line-height: 1.6;
		margin: 0;
		padding: 10px;
		background: #f8f9fa;
		border-radius: 4px;
	}
}

.pagination-section {
	display: flex;
	justify-content: center;
	margin-top: 30px;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
	.equipment-content {
		flex-direction: column;
	}
	
	.equipment-image {
		width: 100%;
		height: 200px;
	}
	
	.info-grid {
		grid-template-columns: 1fr;
	}
}
</style>