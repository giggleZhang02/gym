<template>
	<div style="overflow-x: auto;height: 600px;">
		<div id="main" style="width: 1000px;height:300px;"></div>
		<br>
		<div id="main1" style="width: 1000px;height:300px;"></div>
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

				let courseNames = this.courseData.map(item => item.courseName);
				let favoriteCounts = this.courseData.map(item => item.favoriteCount);
				let purchaseCounts = this.courseData.map(item => item.purchaseCount);

				let option = {
					title: {
						text: '课程收藏数和购买数量统计',
						subtext: 'Course Favorite Counts and Purchase Counts'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['收藏数', '购买数量']
					},
					xAxis: {
						type: 'category',
						data: courseNames
					},
					yAxis: {
						type: 'value'
					},
					series: [{
							name: '收藏数',
							type: 'line',
							data: favoriteCounts
						},
						{
							name: '购买数量',
							type: 'line',
							data: purchaseCounts
						}
					]
				};

				myChart.setOption(option);
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
</style>