<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">

				<el-col :span="24">
					<el-form-item label="配置键">
						<el-input v-model="filters.key" placeholder="配置键"></el-input>
					</el-form-item>
					<el-form-item label="配置名称">
						<el-input v-model="filters.name" placeholder="配置名称"></el-input>
					</el-form-item>
					<el-form-item label="配置值">
						<el-input v-model="filters.value" placeholder="配置值"></el-input>
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
		<el-table :data="dataList" highlight-current-row v-loading="listLoading"  @row-click="handleSelect" style="width: 100%;">

			<el-table-column prop="cfgNo" label="主键" v-if="false" sortable>
			</el-table-column>
			<el-table-column prop="index" label="序号" sortable>
			</el-table-column>
			<el-table-column prop="key" label="配置键"  sortable>
			</el-table-column>
			<el-table-column prop="name" label="配置名称"   sortable>
			</el-table-column>
			<el-table-column prop="value" label="配置值"  sortable>
			</el-table-column>
			<el-table-column prop="order" label="顺序"  sortable>
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
				<el-form-item label="常量键" prop="key">
					<el-input v-model="editForm.cfgNo" v-if="false" ></el-input>
					<el-input v-model="editForm.key" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="常量名称">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="常量值">
					<el-input v-model="editForm.value" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="顺序">
					<el-input v-model="editForm.order" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
				<el-button @click.native="editFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="常量键" prop="key">
					<el-input v-model="addForm.key" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="常量名称">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="常量值">
					<el-input v-model="addForm.value" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="顺序">
					<el-input v-model="addForm.order" auto-complete="off"></el-input>
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
	import { getListPage, dlt, upd, add } from '../../api/config';

	export default {
		data() {
			return {
				filters: {
					key:'',name:'',value:''
				},
				dataList: [],
				total: 0,
				page: 1,
				listLoading: false,
				currentSelect: {},//列表选中列

				//编辑界面是否显示
				editFormVisible: false,
				editLoading: false,
				editFormRules: {

				},
				//编辑界面数据
				editForm: {
					key:'',name:'',value:'',odr:''
				},

				//新增界面是否显示
				addFormVisible: false,
				addLoading: false,
				addFormRules: {

				},
				//新增界面数据
				addForm: {
					key:'',name:'',value:'',odr:''
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
					key: this.filters.key,
					name: this.filters.name,
					value: this.filters.value
				};
				this.listLoading = true;
				getListPage(para).then((res) => {
					if(res.data.code!=200){
						this.listLoading = false;
						return;
					}
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
					let para = { cfgNo: this.currentSelect.cfgNo };
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
					key:'',name:'',value:'',odr:''
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