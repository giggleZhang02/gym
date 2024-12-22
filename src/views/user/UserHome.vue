<template>
	<div class="home-container">
		<!-- 推荐课程部分 -->
		<div class="section-title">
			<h1>推荐课程</h1>
			<div class="title-line"></div>
		</div>

		<!-- 轮播图部分 -->
		<el-carousel :interval="4000" type="card" height="300px" class="carousel-container">
			<el-carousel-item v-for="(item, index) in items" :key="index" class="carousel-item">
				<div class="course-card">
					<img :src="'http://localhost:8081/util/download?name='+item.courseImageName" :alt="item.courseName">
					<div class="course-info">
						<h3>{{item.courseName}}</h3>
					</div>
				</div>
			</el-carousel-item>
		</el-carousel>

		<!-- 内容部分 -->
		<div class="content-container">
			<!-- 统计图表 -->
			<div class="stats-container">
				<div class="echarts-container" ref="echartsContainer"></div>
			</div>

			<!-- 介绍文字 -->
			<div class="intro-container">
				<div class="intro-card">
					<h2>欢迎来到 FitHub</h2>
					<div class="opening-hours">
						<i class="el-icon-time"></i>
						开馆时间：早上六点 - 晚上十点
					</div>
					
					<div class="intro-text">
						<p>在 Fithub，我们致力于为您提供全方位的健康管理服务。无论您是健身新手还是健身达人，我们都为您提供专业的指导和个性化的训练计划。</p>
						
						<p>我们拥有一支经验丰富的健身教练团队，他们将根据您的需求和目标，为您量身定制健身计划，帮助您实现健康目标。我们的健身设备先进而全面，涵盖有氧训练、力量训练、核心训练等各个方面。</p>
						
						<p>除了传统的健身课程，我们还提供多样化的特色课程，如瑜伽、普拉提、有氧舞蹈等，让您在锻炼的同时享受乐趣。</p>
						
						<p>作为 Fithub 的会员，您将享受到更多福利和权益，包括定期的健康讲座、折扣优惠、会员活动等。</p>
						
						<p>无论您是想塑造健康体魄，还是寻求健康生活的新开始，Fithub 都将伴随您一路前行，助您成就更健康、更美好的自己！</p>
					</div>
				</div>
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
				
				const option = {
					title: {
						text: '课程统计',
						textStyle: {
							color: '#333',
							fontSize: 16,
							fontWeight: 'normal'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: ['收藏课程', '购买课程'],
						axisLine: {
							lineStyle: {
								color: '#999'
							}
						}
					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#999'
							}
						}
					},
					series: [{
						name: '数量',
						type: 'bar',
						barWidth: '60%',
						data: [
							{
								value: this.courseStats.collectCourse,
								itemStyle: { color: '#409EFF' }
							},
							{
								value: this.courseStats.purchaseCourse,
								itemStyle: { color: '#67C23A' }
							}
						]
					}]
				};

				chart.setOption(option);
			}
		}
	}
</script>

<style scoped>
.home-container {
	padding: 20px;
	background-color: #f5f7fa;
}

.section-title {
	text-align: center;
	margin-bottom: 30px;
	position: relative;
}

.section-title h1 {
	color: #303133;
	font-size: 28px;
	font-weight: 600;
	margin: 0;
	padding-bottom: 15px;
	display: inline-block;
}

.title-line {
	width: 50px;
	height: 3px;
	background: #409EFF;
	margin: 0 auto;
}

.carousel-container {
	margin: 20px 0 40px;
}

.carousel-item {
	border-radius: 8px;
	overflow: hidden;
}

.course-card {
	height: 100%;
	position: relative;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.course-card img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s;
}

.course-card:hover img {
	transform: scale(1.05);
}

.course-info {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 15px;
	background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
	color: #fff;
}

.course-info h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 500;
}

.content-container {
	display: grid;
	grid-template-columns: 1fr 2fr;
	gap: 30px;
	margin-top: 40px;
}

.stats-container {
	background: #fff;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.echarts-container {
	width: 100%;
	height: 350px;
}

.intro-container {
	background: #fff;
	border-radius: 8px;
	padding: 30px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.intro-card h2 {
	color: #303133;
	margin: 0 0 20px;
	font-size: 24px;
	font-weight: 600;
}

.opening-hours {
	color: #409EFF;
	font-size: 16px;
	margin-bottom: 20px;
	padding: 10px;
	background: #ecf5ff;
	border-radius: 4px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.intro-text p {
	color: #606266;
	line-height: 1.8;
	margin-bottom: 15px;
	text-indent: 2em;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
	.content-container {
		grid-template-columns: 1fr;
	}
}
</style>