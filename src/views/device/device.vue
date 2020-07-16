<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">

				<el-col :span="24">
					<el-form-item label="设备编号">
						<el-input v-model="filters.no" placeholder="设备编号"></el-input>
					</el-form-item>
					<el-form-item label="设备类型">
						<el-select v-model="filters.tp"  placeholder="设备类型">
							<el-option :value="tp.id" :label="tp.id"  v-for="tp in tpList" ></el-option>
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
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备IP">
						<el-input v-model="filters.ip" placeholder="设备地址"></el-input>
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
		<el-table :data="dataList" highlight-current-row v-loading="listLoading"  style="width: 100%;">

			<el-table-column prop="index" label="序号" sortable>
			</el-table-column>
			<el-table-column prop="no" label="设备编号"  sortable>
			</el-table-column>
			<el-table-column prop="tp" label="设备类型"   sortable>
			</el-table-column>
			<el-table-column prop="mac" label="设备MAC"  sortable>
			</el-table-column>
			<el-table-column prop="sid" label="设备地址"  sortable>
			</el-table-column>
			<el-table-column prop="st" label="设备状态"  sortable>
			</el-table-column>
			<el-table-column prop="room" label="关联房间"  sortable>
			</el-table-column>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="设备编号" prop="no">
					<el-input v-model="editForm.no" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备类型">
					<el-input v-model="editForm.tp" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备MAC">
					<el-input v-model="editForm.mac" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备IP">
					<el-input v-model="editForm.ip" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备地址">
					<el-input v-model="editForm.sid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备状态">
					<el-input v-model="editForm.st" auto-complete="off"></el-input>
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
				<el-form-item label="设备类型" prop="tp">
					<el-input v-model="addForm.tp" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备MAC">
					<el-input v-model="addForm.mac" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备地址">
					<el-input v-model="addForm.sid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备状态">
					<el-input v-model="addForm.st" auto-complete="off"></el-input>
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

	export default {
		data() {
			return {
				filters: {
					name: '',no:'',tp:'',sid:'',mac:'',st:'',index:'',ip:''
				},
				dataList: [],
				tpList: [{id:'类型1'},{id:'类型2'}],
				total: 0,
				page: 1,
				listLoading: false,

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
					no:'',tp:'',mac:'',sid:'',st:''
				}

			}
		},
		methods: {
			//翻页
			handleCurrentChange(val) {
				this.page = val;
				this.getQueryListPage();
			},
			//获取查询列表
			getQueryListPage() {
				let para = {
					name: this.filters.name
				};
				//this.listLoading = true;
				getListPage(para).then((res) => {
					this.total = res.data.pager.dataCount;
					this.dataList = res.data.pager.list;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
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
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',no:'',tp:'',sid:'',mac:'',st:'',index:'',ip:''
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