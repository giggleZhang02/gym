<template>
	<div style="overflow-y: auto;max-height: 600px;">
		<el-row v-for="(message,index) in messageArr" :key="index">
			<el-col :span="6">
				<div class="grid-content bg-purple-dark">
					
				</div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content bg-purple-dark" style="border: 2px solid #FF0000;border-radius: 10px;">
					<h1 style="text-align: center;color: #FF0000;margin-top: 10px;">FitHub健身馆通告</h1>
					<el-descriptions  column="2" style="padding-left: 60px;">
						<el-descriptions-item label="发布时间">
							<el-tag size="small">{{message.publishdate.join('-')}}</el-tag>
						</el-descriptions-item>
						<el-descriptions-item label="截止时间">
							<el-tag size="small">{{message.pastdate.join('-')}}</el-tag>
						</el-descriptions-item><br>
						<el-descriptions-item label="面向用户">{{message.targetgroups}}</el-descriptions-item>
						<el-descriptions-item label="编号">{{message.id}}</el-descriptions-item>
					</el-descriptions>
					<h4 style="text-align: center;color: blueviolet;">{{message.title}}</h4>
					<p style="margin-top: 10px;text-indent: 35px; margin-left: 60px; margin-right: 60px; font-size: 16px; font-family: 宋体;"><b>{{message.content}}</b></p>
				</div>
			</el-col>
			
			<el-col :span="6">
				<div class="grid-content bg-purple-dark">
					
				</div>
			</el-col>
		</el-row>
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
			}
		}
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
		background: #ffffff;
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
</style>