<template>
	<div>
		<h1 style="text-align: center;color: #FF0000;">推荐课程</h1>
		<el-carousel :interval="4000" type="card" height="250px" style="margin-top: 10px;">
			<el-carousel-item v-for="(item, index) in items" :key="index" style="text-align: center;">
				<h4>{{item.courseName}}</h4><br>
				<img :src="'http://localhost:8081/util/download?name='+item.courseImageName" alt="图片"
					style="width: 540px;height:210px">
			</el-carousel-item>
		</el-carousel>
		<div style="display: flex;">
			<div class="echarts-container" ref="echartsContainer" style="flex: 1; width: 300px; height: 350px;"></div>
			<div>
				<p style="text-indent: 2em;margin-top: 10px;">
					欢迎来到 FitHub。<b>开馆时间 早上六点-晚上十点!</b>
				</p>
				<p style="text-indent: 2em;margin-top: 10px;">
					在 Fithub，我们致力于为您提供全方位的健康管理服务。无论您是健身新手还是健身达人，我们都为您提供专业的指导和个性化的训练计划。
				</p>
				<p style="text-indent: 2em;margin-top: 10px;">
					我们拥有一支经验丰富的健身教练团队，他们将根据您的需求和目标，为您量身定制健身计划，帮助您实现健康目标。我们的健身设备先进而全面，涵盖有氧训练、力量训练、核心训练等各个方面。
				</p>
				<p style="text-indent: 2em;margin-top: 10px;">
					除了传统的健身课程，我们还提供多样化的特色课程，如瑜伽、普拉提、有氧舞蹈等，让您在锻炼的同时享受乐趣。
				</p>
				<p style="text-indent: 2em;margin-top: 10px;">
					作为 Fithub 的会员，您将享受到更多福利和权益，包括定期的健康讲座、折扣优惠、会员活动等。
				</p>
				<p style="text-indent: 2em;margin-top: 10px;">
					无论您是想塑造健康体魄，还是寻求健康生活的新开始，Fithub 都将伴随您一路前行，助您成就更健康、更美好的自己！
				</p>
			</div>
		</div>
	</div>
</template>


<script>
	import * as echarts from 'echarts';

	export default {
		data() {
			return {
				items: [],
				courseStats: {
					collectCourse: 0,
					purchaseCourse: 0
				} // 默认值，可以根据实际情况设置
			}
		},
		mounted() {
			// 获取推荐课程数据
			this.$api.course.getRecommendCourse().then((resp) => {
				if (resp.data.code === 200) {
					this.items = resp.data.data;
				}
			});

			const params = {
				userId: this.$store.state.tab.userData.id
			}
			// 获取收藏和购买课程的统计数据
			this.$api.user.getCourseStats(params).then((resp) => {
				if (resp.data.code === 200) {
					this.courseStats = resp.data.data;
					// 在获取到数据后更新图表
					this.updateChart();
				}
			});
		},
		methods: {
			updateChart() {
				const chart = echarts.init(this.$refs.echartsContainer);

				// 使用获取到的统计数据更新图表配置项
				const option = {
					title: {
						text: '收藏/购买课程统计'
					},
					tooltip: {},
					xAxis: {
						data: ['收藏课程', '购买课程']
					},
					yAxis: {},
					series: [{
						name: '数值',
						type: 'bar',
						data: [this.courseStats.collectCourse, this.courseStats.purchaseCourse]
					}]
				};

				// 将更新后的配置项设置到图表中
				chart.setOption(option);
			}
		}
	}
</script>


<style scoped>
	.el-carousel__item h3 {
		color: #475669;
		font-size: 14px;
		opacity: 0.75;
		line-height: 200px;
		margin: 0;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n+1) {
		background-color: #d3dce6;
	}
</style>