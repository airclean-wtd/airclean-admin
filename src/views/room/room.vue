<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">

				<el-col :span="24">
					<el-form-item label="房间编号">
						<el-input v-model="filters.no" placeholder="房间编号"></el-input>
					</el-form-item>

					<el-form-item label="房间名称">
						<el-input v-model="filters.name" placeholder="房间名称"></el-input>
					</el-form-item>

					<el-form-item label="楼层">
						<el-select v-model="filters.type"  placeholder="楼层">
							<el-option :value="tp.id" :label="tp.id"  v-for="tp in tpList" ></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24">

					<el-form-item label="设备编号">
						<el-input v-model="filters.deviceNo" placeholder="设备地址"></el-input>
					</el-form-item>
					<el-form-item label="设备MAC">
						<el-input v-model="filters.deviceMac" placeholder="设备MAC"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="24" align="center">
					<el-form-item>
						<el-button type="primary" v-on:click="handleAdd">新增</el-button>
						<el-button type="primary" v-on:click="handleEdit">修改</el-button>
						<el-button type="primary" v-on:click="handleDel">删除</el-button>
						<el-button type="primary" v-on:click="getQueryListPage">查询</el-button>
						<el-button type="primary" v-on:click="handleBind">设备绑定</el-button>
					</el-form-item>
				</el-col>

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataList" highlight-current-row v-loading="listLoading" @row-click="handleSelect" style="width: 100%;">

			<el-table-column prop="no" label="房间编号"  sortable>
			</el-table-column>
			<el-table-column prop="name" label="房间名称"  sortable>
			</el-table-column>
			<el-table-column prop="type" label="楼层"  sortable>
			</el-table-column>
			<el-table-column prop="deviceNo" label="设备编号"  sortable>
			</el-table-column>
			<el-table-column prop="deviceTp" label="设备类型"  sortable>
			</el-table-column>
			<el-table-column prop="deviceMac" label="设备MAC"  sortable>
			</el-table-column>
			<el-table-column prop="deviceSt" label="设备状态"  sortable>
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
				<el-form-item label="房间编号" prop="name">
					<el-input v-model="editForm.no" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="房间名称">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="楼层">
					<el-input v-model="editForm.type" auto-complete="off"></el-input>
<!--					<el-select v-model="editForm.type" placeholder="设备状态">-->
<!--						<el-option label="区域一" value="shanghai"></el-option>-->
<!--						<el-option label="区域二" value="beijing"></el-option>-->
<!--					</el-select>-->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
				<el-button @click.native="editFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="房间编号" prop="name">
					<el-input v-model="addForm.no" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="房间名称">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="楼层">
					<el-input v-model="addForm.type" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
				<el-button @click.native="addFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--设备绑定界面-->
		<el-dialog title="设备绑定" :visible.sync="bindFormVisible" :close-on-click-modal="false">
			<el-form :model="bindForm" label-width="80px"  ref="bindForm">
				<el-form-item label="房间编号" prop="no">
					<el-input v-model="bindForm.no" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="楼层">
					<el-input v-model="bindForm.type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="房间名称">
					<el-input v-model="bindForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备类型">
					<el-input v-model="bindForm.deviceTp" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备编号">
					<el-input v-model="bindForm.deviceNo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备MAC">
					<el-input v-model="bindForm.deviceMac" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="bindSubmit" :loading="editLoading">确定</el-button>
				<el-button @click.native="editFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getListPage, dlt, upd, add } from '../../api/room';

	export default {
		data() {
			return {
				filters: {
					no:'',type:'',name:'',deviceNo:'',deviceMac:''
				},
				dataList: [],
				tpList: [],
				total: 0,
				page: 1,
				listLoading: false,
				currentSelect: {},//列表选中列

				//绑定界面
				bindFormVisible: false,
				bindLoading: false,
				bindFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				bindForm: {
					no:'',type:'',name:'',deviceNo:'',deviceMac:'',deviceTp:''
				},

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
					no:'',name:'',type:''
				},

				//新增界面是否显示
				addFormVisible: false,
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入房间号', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					no:'',name:'',type:''
				}

			}
		},
		methods: {

			handleCurrentChange(val) {
				this.page = val;
				this.getQueryListPage();
			},
			//获取查询列表
			getQueryListPage() {
				let para = {
					pageIndex:this.page,
					no:this.filters.no,
					name:this.filters.name,
					type:this.filters.type,
					deviceNo:this.filters.deviceNo,
					deviceMac:this.filters.deviceMac
				};
				// this.listLoading = true;
				getListPage(para).then((res) => {
					this.total = res.data.pager.dataCount;
					this.dataList = res.data.pager.list;
					this.listLoading = false;
				});
				this.currentSelect = {};
			},
			
			//删除
			handleDel: function () {
				if(!this.currentSelect){
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {no:this.currentSelect.no};
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
			//显示绑定界面
			handleBind: function (index, row) {
				this.bindFormVisible = true;
				this.bindForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					no:'',name:'',type:''
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
			//绑定设备
			bindSubmit: function () {
				this.$refs.bindForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.bindLoading = true;
							let para = Object.assign({}, this.bindForm);

							bind(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['bindForm'].resetFields();
								this.bindFormVisible = false;
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

							//let para = JSON.stringify(this.addForm);
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
			handleSelect: function (selected) {

				this.currentSelect = selected;
			},
		},
		mounted() {
			this.getQueryListPage();
		},
		created() {
			//初始化下拉数据
		}
	}

</script>

<style scoped>

</style>