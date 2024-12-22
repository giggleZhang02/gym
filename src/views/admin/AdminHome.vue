<template>
	<div class="admin-home">
		<div class="dashboard-container">
			<!-- 数据概览卡片 -->
			<div class="stat-cards">
				<div class="stat-card">
					<div class="stat-icon">
						<i class="el-icon-s-data"></i>
					</div>
					<div class="stat-info">
						<div class="stat-title">总器材数量</div>
						<div class="stat-value">{{ totalEquipment }}</div>
					</div>
				</div>
				<div class="stat-card">
					<div class="stat-icon">
						<i class="el-icon-reading"></i>
					</div>
					<div class="stat-info">
						<div class="stat-title">总课程数</div>
						<div class="stat-value">{{ totalCourses }}</div>
					</div>
				</div>
			</div>

			<!-- 图表区域 -->
			<div class="charts-container">
				<div class="chart-wrapper">
					<div id="main" class="chart"></div>
				</div>
				<div class="chart-wrapper">
					<div id="main1" class="chart"></div>
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
				EquipmentData: [],
				courseData: [],
			}
		},
		computed: {
			totalEquipment() {
				return this.EquipmentData.reduce((sum, item) => sum + item.value, 0)
			},
			totalCourses() {
				return this.courseData.length
			}
		},
		mounted() {
			this.fetchEquipmentData();
			this.fetchCourseData();
		},
		methods: {
			fetchEquipmentData() {
				this.$api.admin.equipmentChart().then((resp) => {
					if (resp.data.code === 200) {
						this.EquipmentData = resp.data.data;
						this.EquipmentRenderChart();
					}
				});
			},
			fetchCourseData() {
				this.$api.admin.courseChart().then((resp) => {
					if (resp.data.code === 200) {
						this.courseData = resp.data.data;
						this.CourseRenderChart();
					}
				});
			},
			CourseRenderChart() {
				let chartDom = document.getElementById('main1');
				let myChart = echarts.init(chartDom);

				let option = {
					title: {
						text: '课程数据分析',
						textStyle: {
							fontSize: 16,
							fontWeight: 'normal'
						},
						left: 'center'
					},
					tooltip: {
						trigger: 'axis',
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						borderColor: '#eee',
						borderWidth: 1,
						textStyle: {
							color: '#333'
						}
					},
					legend: {
						bottom: '5%',
						data: ['收藏数', '购买数量']
					},
					grid: {
						top: '15%',
						left: '3%',
						right: '4%',
						bottom: '15%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: this.courseData.map(item => item.courseName),
						axisLabel: {
							interval: 0,
							rotate: 30
						}
					},
					yAxis: {
						type: 'value'
					},
					series: [
						{
							name: '收藏数',
							type: 'line',
							smooth: true,
							data: this.courseData.map(item => item.favoriteCount),
							itemStyle: {
								color: '#409EFF'
							},
							areaStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: 'rgba(64,158,255,0.3)' },
									{ offset: 1, color: 'rgba(64,158,255,0.1)' }
								])
							}
						},
						{
							name: '购买数量',
							type: 'line',
							smooth: true,
							data: this.courseData.map(item => item.purchaseCount),
							itemStyle: {
								color: '#67C23A'
							},
							areaStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: 'rgba(103,194,58,0.3)' },
									{ offset: 1, color: 'rgba(103,194,58,0.1)' }
								])
							}
						}
					]
				};

				myChart.setOption(option);
				window.addEventListener('resize', () => myChart.resize());
			},
			EquipmentRenderChart() {
				let chartDom = document.getElementById('main');
				let myChart = echarts.init(chartDom);

				let dataAxis = this.EquipmentData.map(item => item.name);
				let data = this.EquipmentData.map(item => item.value);

				let zoomSize = 6;

				let option = {
					title: {
						text: 'FitHub健身器材数量统计',
						subtext: 'FitHub fitness equipment quantity statistics'
					},
					xAxis: {
						data: dataAxis,
						axisLabel: {
							inside: true,
							color: '#fff'
						},
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						z: 10
					},
					yAxis: {
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							color: '#999'
						}
					},
					dataZoom: [{
						type: 'inside'
					}],
					series: [{
						type: 'bar',
						showBackground: true,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: '#83bff6'
								},
								{
									offset: 0.5,
									color: '#188df0'
								},
								{
									offset: 1,
									color: '#188df0'
								}
							])
						},
						emphasis: {
							itemStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: '#2378f7'
									},
									{
										offset: 0.7,
										color: '#2378f7'
									},
									{
										offset: 1,
										color: '#83bff6'
									}
								])
							}
						},
						data: data
					}]
				};

				myChart.setOption(option);

				myChart.on('click', params => {
					console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
					myChart.dispatchAction({
						type: 'dataZoom',
						startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
						endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
					});
				});
			}
		}
	};
</script>

<style scoped>
	.admin-home {
		padding: 20px;
		background-color: #f0f2f5;
		min-height: 100vh;
	}

	.dashboard-container {
		max-width: 1600px;
		margin: 0 auto;
		overflow-x: auto;
		padding: 0 20px;
	}

	.stat-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 24px;
	}

	.stat-card {
		background: white;
		border-radius: 8px;
		padding: 20px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
		transition: all 0.3s ease;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0,0,0,0.15);
	}

	.stat-icon {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		background: #409EFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16px;
	}

	.stat-icon i {
		font-size: 24px;
		color: white;
	}

	.stat-info {
		flex: 1;
	}

	.stat-title {
		font-size: 14px;
		color: #606266;
		margin-bottom: 8px;
	}

	.stat-value {
		font-size: 24px;
		font-weight: bold;
		color: #303133;
	}

	.charts-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		min-width: 1200px;
		overflow-x: auto;
	}

	.chart-wrapper {
		background: white;
		border-radius: 8px;
		padding: 20px 30px;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
		width: 100%;
	}

	.chart {
		width: 100%;
		height: 400px;
		min-width: 1100px;
	}

	@media (max-width: 768px) {
		.admin-home {
			padding: 10px;
		}
		
		.stat-cards {
			grid-template-columns: 1fr;
		}
		
		.chart {
			height: 300px;
		}
	}
</style>