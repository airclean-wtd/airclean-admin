<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">

				<el-col :span="24">

					<el-form-item label="房间">
						<el-select v-model="filters.roomNo"  placeholder="房间">
							<el-option :value="type.no" :label="type.name"  v-for="type in roomList" ></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="设备类型">
						<el-select v-model="filters.deviceTp"  placeholder="设备类型">
							<el-option :value="type.value" :label="type.label"  v-for="type in deviceTpList" ></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="数据类型">
						<el-select v-model="filters.dataTp"  @change="dataTpChange" placeholder="数据类型">
							<el-option
									v-for="item in dataTpList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>

					</el-form-item>
				</el-col>

				<el-col :span="24" align="center">
					<el-form-item>
						<el-button type="primary" v-on:click="drawLineChart">查询</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-col>

		<!-- 统计图 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<v-chart :options="myEchartsOption"
					 :init-options="initOptions"
					 auto-resize
					 style="width:100%; height:400px;"
			/>
		</el-col>

	</section>
</template>

<script>
	import util from '../../common/js/util';
	import Echarts from 'vue-echarts'
	import 'echarts/lib/chart/line'
	import {getStatList} from "../../api/stat";
	import {getDeviceTpList} from "../../api/config";
	import {getRoomList} from "../../api/room";

	export default  {
			data() {
			return {
				filters: {
					roomNo:'',deviceTp:'',dataTp:'0'
				},
				dataList: [],
				total: 0,
				page: 1,
				listLoading: false,
				currentSelect: {},//列表选中列
				roomList: [],
				deviceTpList: [],
				dataTpList:[{value:'0',label:"PM2.5"},{value:"1",label:"温度"},{value:"2",label:"湿度"},
					{value:"3",label:"二氧化碳浓度"},{value:"4",label:"TVOC"}],
				//echart
				myEChart:{},
				//标题
				title:'PM2.5历史数据折线图',
				//echarts配置
				myEchartsOption:{},
				//配置值，用于封装数据库查询出的真实数据
				myEchartsOptionValue:{},
				symbolSize:20,
				initOptions: {
					renderer: 'canvas'
				},

			}
		},
		methods: {

			//获得echarts配置值，查询数据库并封装返回
			drawLineChart() {

				// 查询条件
				let para = {
					roomNo:this.filters.roomNo,
					deviceTp:this.filters.deviceTp,
					dataTp:this.filters.dataTp,
				};
				// 查询数据库
				getStatList(para).then((res) => {
					if(res.data.code!=200){
						return;
					}

					let datas = res.data.dataList;

					/**let optionValue = {
					 *	title:'基金净值走势',     		//标题
					 *	xDatas:xDatas,  			    //横坐标数据数组
					 *	yMinValue:minValue.toFixed(1),	//纵坐标最小值
					 *	yMaxValue:maxValue.toFixed(1),	//纵坐标最大值
					 *	dataValues:dayValues,			//数据集合
					 * };
					 * */
					//横坐标数据数组
					let xDatas = [];
					//数据集合
					let dataValues = [];

					if(datas && datas.length!==0){
						//遍历封装
						for (let i =0;i< datas.length;i++) {

							//x轴数据
							let xValue = util.formatDate.format(new Date(datas[i].smplTm), 'yyyy-MM-dd hh:mm:ss');
							xDatas.push(xValue);
							//y轴数据
							let yValue = datas[i].val;
							dataValues.push([xValue,yValue]);

						}

					}

					//封装数据
					this.myEchartsOptionValue={
						xDatas:xDatas,
						dataValues:dataValues
					};

					//根据数据准备Echarts配置项
					this.getEchartsOption(this.myEchartsOptionValue);

				});

			},

			// 获得Echarts配置项
			/**let optionValue = {
			 *	title:'基金净值走势',     		//标题
			 *	xDatas:dayTradeDt,  			//横坐标数据数组
			 *	yMinValue:minValue.toFixed(1),	//纵坐标最小值
			 *	yMaxValue:maxValue.toFixed(1),	//纵坐标最大值
			 *	dataValues:dayValues,			//数据集合
			 * };
			 * */
			getEchartsOption:function(optionValue){

				this.myEchartsOption = {
					title: {
						text: this.title
					},
					tooltip: {
						triggerOn: 'none',
						formatter: function (params) {
							return 'X: ' + params.data[0].toFixed(2) + '<br>Y: ' + params.data[1].toFixed(2);
						}
					},
					grid: {
					},
					xAxis: {
						min:null,
						max:null,
						type: 'category',
						boundaryGap: false,
						//横坐标显示数据
						data: optionValue.xDatas,
						//切割份数
						splitNumber:5,
					},
					yAxis: {
						min:-100,
						max:500,
						type: 'value',
						axisLine:{onZero:false}
					},
					dataZoom: [
						{
							type: 'slider',
							xAxisIndex: 0,
							filterMode: 'empty'
						},
						{
							type: 'slider',
							yAxisIndex: 0,
							filterMode: 'empty'
						},
						{
							type: 'inside',
							xAxisIndex: 0,
							filterMode: 'empty'
						},
						{
							type: 'inside',
							yAxisIndex: 0,
							filterMode: 'empty'
						}
					],
					series: [
						{
							id: 'a',
							type: 'line',
							smooth: true,
							symbolSize: 20,
							// 数据
							data: optionValue.dataValues,
						}
					]
				};

				console.log(this.myEchartsOption);
				//设置配置项
				//this.myEChart.setOption(this.myEchartsOption);

			},

			//房间下拉初始化
			initRoomList: function () {

				let para = {};
				//查询
				getRoomList(para).then((res)=>{
					//条件查询下拉
					for (let resKey of res.data.dataList) {
						this.roomList.push(resKey);
					}
				})
			},

			//数据类型下拉初始化
			initDeviceTpList: function () {

				let para = {key:"DEVICE_TP"};
				//查询常量
				getDeviceTpList(para).then((res)=>{
					//条件查询下拉
					for (let resKey of res.data.dataList) {
						this.deviceTpList.push(resKey);
					}
				})
			},

			//设备类型变换
			dataTpChange: function(){
				//更改title
				let dataTp = this.filters.dataTp;
				if(dataTp==='0'){
					this.title='PM2.5历史数据折线图';
				}
				if(dataTp==='1'){
					this.title='温度历史数据折线图';
				}
				if(dataTp==='2'){
					this.title='湿度历史数据折线图';
				}
				if(dataTp==='3'){
					this.title='二氧化碳浓度历史数据折线图';
				}
				if(dataTp==='4'){
					this.title='TVOC历史数据折线图';
				}
			},


		},
		mounted() {
			//this.drawLineChart();
		},
		created() {
			//初始化下拉数据
			this.initRoomList();
			this.initDeviceTpList();
			this.drawLineChart();
		}
	};


</script>

<style scoped>

</style>