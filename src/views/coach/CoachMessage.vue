<template>
	<div class="message-container">
		<div class="page-header">
			<h2>通知公告</h2>
			<div class="header-line"></div>
		</div>

		<div class="message-list">
			<el-card 
				v-for="(message, index) in messageArr" 
				:key="index" 
				class="message-card"
				:class="{ 'message-card-expired': isExpired(message.pastdate) }">
				
				<div class="message-header">
					<div class="title-section">
						<i class="el-icon-bell"></i>
						<h3>{{message.title}}</h3>
					</div>
					<el-tag type="warning" size="small">#{{message.id}}</el-tag>
				</div>

				<div class="message-content">
					<p>{{message.content}}</p>
				</div>

				<div class="message-footer">
					<div class="message-info">
						<div class="info-item">
							<i class="el-icon-user"></i>
							<span>面向用户：{{message.targetgroups}}</span>
						</div>
						<div class="date-info">
							<div class="info-item">
								<i class="el-icon-date"></i>
								<span>发布时间：</span>
								<el-tag size="small" type="success">{{message.publishdate.join('-')}}</el-tag>
							</div>
							<div class="info-item">
								<i class="el-icon-time"></i>
								<span>截止时间：</span>
								<el-tag 
									size="small" 
									:type="isExpired(message.pastdate) ? 'danger' : 'info'">
									{{message.pastdate.join('-')}}
								</el-tag>
							</div>
						</div>
					</div>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				messageArr: [],
			}
		},
		mounted() {
			this.getAllMessage();
		},
		methods: {
			getAllMessage(){
				this.$api.message.getAllMessage().then((resp) => {
					if(resp.data.code === 200){
						this.messageArr = resp.data.data;
					}
				})
			},
			isExpired(pastdate) {
				const endDate = new Date(pastdate.join('-'));
				return endDate < new Date();
			}
		}
	}
</script>

<style lang="less" scoped>
.message-container {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: calc(100vh - 120px);
	max-height: 100vh;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #dcdfe6;
		border-radius: 3px;
	}
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

.message-list {
	max-width: 800px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.message-card {
	border-radius: 8px;
	transition: all 0.3s;
	
	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	&.message-card-expired {
		opacity: 0.8;
		border-left: 4px solid #f56c6c;
	}
}

.message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
	padding-bottom: 15px;
	border-bottom: 1px solid #ebeef5;

	.title-section {
		display: flex;
		align-items: center;
		gap: 10px;

		i {
			color: #e6a23c;
			font-size: 20px;
		}

		h3 {
			color: #303133;
			margin: 0;
			font-size: 18px;
		}
	}
}

.message-content {
	color: #606266;
	line-height: 1.8;
	margin-bottom: 20px;
	text-indent: 2em;
	font-size: 14px;
}

.message-footer {
	.message-info {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #909399;
		font-size: 13px;

		i {
			font-size: 14px;
		}
	}

	.date-info {
		display: flex;
		gap: 20px;
	}
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
	.message-list {
		padding: 0 10px;
	}

	.message-footer {
		.date-info {
			flex-direction: column;
			gap: 10px;
		}
	}
}
</style>