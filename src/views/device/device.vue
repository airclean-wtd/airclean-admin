<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" label-width="80px">

				<el-col :span="24">
					<el-form-item label="设备编号">
						<el-input v-model="filters.no" placeholder="设备编号"></el-input>
					</el-form-item>
					<el-form-item label="设备类型">
						<el-select v-model="filters.tp"  placeholder="设备类型">
							<el-option :value="type.value" :label="type.label"  v-for="type in tpList" ></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备MAC">
						<el-input v-model="filters.mac" placeholder="设备MAC"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="24">

					<el-form-item label="设备地址">
						<el-input v-model="filters.sid" placeholder="设备地址"></el-input>
					</el-form-item>
					<el-form-item label="设备状态">
						<el-select v-model="filters.st" placeholder="设备状态">
							<el-option label="全部" value=""></el-option>
							<el-option label="开启" value="1"></el-option>
							<el-option label="关闭" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备IP">
						<el-input v-model="filters.ip" placeholder="设备IP"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="24" align="center">
					<el-form-item>
						<el-button type="primary" v-on:click="handleAdd">新增</el-button>
						<el-button type="primary" v-on:click="handleEdit">修改</el-button>
						<el-button type="primary" v-on:click="handleDel">删除</el-button>
						<el-button type="primary" v-on:click="getQueryListPage">查询</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataList" highlight-current-row v-loading="listLoading" @row-click="handleSelect" style="width: 100%;">

			<el-table-column prop="index" label="序号" sortable>
			</el-table-column>
			<el-table-column prop="no" label="设备编号"  sortable>
			</el-table-column>
			<el-table-column prop="tp" label="设备类型"   sortable>
			</el-table-column>
			<el-table-column prop="mac" label="设备MAC"  sortable>
			</el-table-column>
			<el-table-column prop="ip" label="设备IP"  sortable>
			</el-table-column>
			<el-table-column prop="port" label="设备端口"  sortable>
			</el-table-column>
			<el-table-column prop="sid" label="设备地址"  sortable>
			</el-table-column>
			<el-table-column prop="st" label="设备状态" :formatter="statusFormat" sortable>
			</el-table-column>
			<el-table-column prop="roomName" label="关联房间"  sortable>
			</el-table-column>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="设备编号" prop="no">
					<el-input v-model="editForm.no" readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="设备类型">
					<el-input v-model="editForm.tp" readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="设备MAC">
					<el-input v-model="editForm.mac" ></el-input>
				</el-form-item>
				<el-form-item label="设备IP">
					<el-input v-model="editForm.ip" ></el-input>
				</el-form-item>
				<el-form-item label="设备端口">
					<el-input v-model="editForm.port" ></el-input>
				</el-form-item>
				<el-form-item label="设备地址">
					<el-input v-model="editForm.sid" ></el-input>
				</el-form-item>
				<el-form-item label="设备状态">
					<el-switch
							v-model="editForm.st"
							active-text="打开"
							inactive-text="关闭"
							active-value="1"
							inactive-value="0"
							active-color="#13ce66"
							inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
				<el-button @click.native="editFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">

			<el-form :model="addForm" label-width="80px"  :rules="addFormRules" ref="addForm">
				<el-form-item label="设备类型" >
					<el-select v-model="addForm.tp"  placeholder="请选择" width="320px;">
						<el-option :value="type.value" :label="type.label"  v-for="type in tpListForAdd" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="设备MAC" >
					<el-input v-model="addForm.mac" ></el-input>
				</el-form-item>
				<el-form-item label="设备IP" >
					<el-input v-model="addForm.ip" ></el-input>
				</el-form-item>
				<el-form-item label="设备端口">
					<el-input v-model="addForm.port" ></el-input>
				</el-form-item>
				<el-form-item label="设备地址">
					<el-input v-model="addForm.sid"></el-input>
				</el-form-item>
				<el-form-item label="设备状态">
					<el-switch
							v-model="addForm.st"
							active-text="打开"
							inactive-text="关闭"
							active-value="1"
							inactive-value="0"
							active-color="#13ce66"
							inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
				<el-button @click.native="addFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getListPage, dlt, upd, add } from '../../api/device';
	import { getDeviceTpList } from '../../api/config';

	export default {
		data() {
			return {
				filters: {
					name: '',no:'',tp:'',sid:'',mac:'',st:'',index:'',ip:''
				},
				dataList: [],
				tpListForAdd:[],
				tpList: [{value:"",label:"全部"}],
				total: 0,
				page: 1,
				listLoading: false,
				currentSelect: {},//列表选中列

				//编辑界面是否显示
				editFormVisible: false,
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					no:'',tp:'',mac:'',sid:'',st:''
				},

				//新增界面是否显示
				addFormVisible: false,
				addLoading: false,
				addFormRules: {

				},
				//新增界面数据
				addForm: {
					no:'',tp:'',mac:'',sid:'',st:1
				}

			}
		},
		methods: {
			//翻页
			handleCurrentChange(val) {
				this.page = val;
				this.getQueryListPage();
			},
			//状态枚举格式化
			statusFormat(row,column){
				//console.log(row);
				return row.st==='1'?'开启':'关闭'
			},
			//获取查询列表
			getQueryListPage() {
				let para = {
					pageIndex:this.page,
					no: this.filters.no,
					tp: this.filters.tp,
					mac: this.filters.mac,
					ip: this.filters.ip,
					st: this.filters.st,
					sid: this.filters.sid
				};
				this.listLoading = true;
				getListPage(para).then((res) => {
					this.total = res.data.pager.dataCount;
					this.dataList = res.data.pager.list;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function () {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { no: this.currentSelect.no };
					dlt(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getQueryListPage();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function () {
				if(!this.currentSelect){
					return;
				}
				this.editFormVisible = true;
				this.editForm = Object.assign({}, this.currentSelect);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',no:'',tp:'',sid:'',mac:'',st:'1',index:'',ip:''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							upd(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getQueryListPage();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							add(para).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getQueryListPage();
							});
						});
					}
				});
			},
			//选中处理
			handleSelect: function (selected) {

				this.currentSelect = selected;
			},
			//设备类型下拉初始化
			initDeviceTpList: function () {

				let para = {key:"DEVICE_TP"};
				//查询常量
				getDeviceTpList(para).then((res)=>{
					//条件查询下拉
					for (let resKey of res.data.dataList) {
						this.tpList.push(resKey);
					}
					//新增下拉
					this.tpListForAdd = res.data.dataList;
				})
			}
		},
		mounted() {
			this.getQueryListPage();
		},
		created() {
			//初始化下拉数据
			this.initDeviceTpList();
		}
	}

</script>

<style scoped>
	.el-form-item .el-select {
		width: 100%;
	}
</style>