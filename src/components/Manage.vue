<template>
    <div class="manage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>设备管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="20" type="flex" justify="center">
                <el-col :span="4"><div class="grid-content"><p>产品数量（个）</p><p>{{productNumber}}</p></div></el-col>
                <el-col :span="10"><div class="grid-content"></div></el-col>
                <el-col :span="10">
                    <div class="grid-content grid-button">
                        <el-button  icon="el-icon-search"  @click="searchDrawer=true,searchForm=false">搜索设备</el-button>
                        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="insert">添加设备</el-button>
                    </div>
                </el-col>
            </el-row>

            <el-drawer title="添加新设备" :visible.sync="drawer" :with-header="false">
                <div class="draw-title"><p>添加新设备</p><i class="el-icon-circle-close" @click="closeDraw"></i></div>
                <div class="equip-info">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="ruleForm">
                        <el-form-item label="设备编号" prop="deviceId">
                            <el-input v-model="ruleForm.deviceId" :disabled="flag"></el-input>
                        </el-form-item>
                        <el-form-item label="位置号" prop="locationInfo">
                            <el-input v-model="ruleForm.locationInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="IMEI码" prop="imeiCode">
                            <el-input v-model="ruleForm.imeiCode"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">{{statement}}</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-drawer>

            <el-drawer title="搜索设备" :visible.sync="searchDrawer" :with-header="false">
                <div class="draw-title"><p>检索设备</p><i class="el-icon-circle-close"  @click="searchDrawer=false"></i></div>
                <el-row class="search-content">
                    <el-col :span="18">
                        <!-- <el-input v-model="ruleForm2.deviceId" placeholder="请输入IMEI号"></el-input> -->
                        <el-autocomplete v-model="searchInput" :fetch-suggestions="querySearch"  placeholder="请输入IMEI号" :trigger-on-focus="false"></el-autocomplete>
                    </el-col>
                    <el-col :span="6"><el-button type="primary" @click="search">搜索</el-button></el-col>
                </el-row>
                <el-form v-show="searchForm" :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="ruleForm">
                    <el-form-item label="设备编号" prop="deviceId">
                        <el-input v-model="ruleForm2.deviceId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="位置号" prop="locationInfo">
                        <el-input v-model="ruleForm2.locationInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="IMEI码" prop="imeiCode">
                        <el-input v-model="ruleForm2.imeiCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm2')">保存更改</el-button>
                        <el-button @click="resetForm('ruleForm2')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-drawer>
        </div>

        <div class="container">
        <el-table
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%" >
                 
                <el-table-column
                    prop="deviceId"
                    label="设备编号"
                    align="center">
                </el-table-column>

                <el-table-column 
                    prop="locationInfo" 
                    label="位置号"
                    align="center">
                </el-table-column>
                
                <el-table-column
                    prop="imeiCode"
                    label="IMEI号"
                    align="center">
                </el-table-column> 

                <el-table-column
                    prop="status"
                    label="启动状态"
                    align="center">
                    <template slot-scope="scope" >
                        <span v-if="scope.row.status=='1'">已经启动</span>
                        <span v-else>未启动</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope" >
                        <el-button type="text" icon="el-icon-edit" size="small" @click="update(scope.row._id)">编辑</el-button>
                        <el-button type="text" icon="el-icon-search" size="small" @click="jumpHistory(scope.row.deviceId)">详情</el-button>                        
                        <el-button type="text" icon="el-icon-delete" style="color:red" size="small" @click="handleDelete(scope.row.deviceId)">删除</el-button>                    
                    </template>
                </el-table-column>             
            </el-table>                         

            <div class="block" style="margin-top:10px;">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length"
                prev-text="上一页"
                next-text="下一页"
                >
                </el-pagination>
            </div>
        </div>

        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data(){
        return{
            searchForm:false,
            searchInput:"",
            drawer:false,
            searchDrawer:false,
            productNumber:0,
            pageSize:10,
            tableData: [],
            flag: false,
            completeData:[],
            currentPage: 1,
            selectDel:[],
            selectedDel:[],
            statement:"添加设备",
            delVisible:false,
            deleteId:'',
            ruleForm:{
                deviceId:"",
                locationInfo:"",
                imeiCode:"",
            },
            ruleForm2:{
                deviceId:"",
                locationInfo:"",
                imeiCode:""
            },
            rules:{
                deviceId:[
                    {required:true,message:"请输入设备编号",trigger:'blur'},
                    {min:3,max:5,message:'长度在3到5之间',trigger:'blur'}
                ],
                locationInfo:[
                    {required:true,message:"请输入设备位置号码",trigger:'blur'}
                ],
                imeiCode:[
                    {required:true,message:"请输入IMEI码",trigger:'blur'},
                    {min:15,max:15,message:'IMEI码应该由15个数字组成',trigger:'blur'}
                ]
            },
            rules2:{
                deviceId:[
                    {required:false},
                ],
                locationInfo:[
                    {required:true,message:"请输入设备位置号码",trigger:'blur'}
                ],
                imeiCode:[
                    {required:true,message:"请输入IMEI码",trigger:'blur'},
                    {min:15,max:15,message:'IMEI码应该由15个数字组成',trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            axios.get('/api/findEquip',{

            }).then(response=>{
                this.tableData = response.data.data;
                this.productNumber = this.tableData.length;
                // console.log(this.tableData);

            })
        },
        querySearch(queryString,cb){
            let results = this.tableData.filter((data)=>{
                return data.deviceId.toString().indexOf(queryString) === 0;
            })
            for(let i = 0; i<results.length;i++){
                results[i].value = results[i].deviceId.toString();
            }
            // console.log(results)
            cb(results)
        },
              handleSelect(item) {
        console.log(item);
      },
        submitForm(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    axios.post('/api/equipRegister',{
                        ruleForm:this.ruleForm
                    }).then(()=>{
                        // let resp = response.data;
                        this.init();
                        // console.log(resp);
                    })
                }
            })
        },
        resetForm(formName) {
        this.$refs[formName].resetFields();
        },
        insert(){
            this.drawer = true;
            this.statement = "添加设备"
            this.rules = {
                deviceId:[
                    {required:true,message:"请输入设备编号",trigger:'blur'},
                    {min:3,max:5,message:'长度在3到5之间',trigger:'blur'}
                ],
                locationInfo:[
                    {required:true,message:"请输入设备位置号码",trigger:'blur'}
                ],
                imeiCode:[
                    {required:true,message:"请输入IMEI码",trigger:'blur'},
                    {min:15,max:15,message:'IMEI码应该由15个数字组成',trigger:'blur'}
                ]
            },
            this.flag = false;
            // this.ruleForm = [];
        },
        update(id){
            this.rules.deviceId[0].required = false;
            axios.post('/api/findEquipById',{
                _id:id
            }).then(response=>{
                this.ruleForm.deviceId = response.data.data.deviceId + "";
                this.ruleForm.locationInfo = response.data.data.locationInfo;
                this.ruleForm.imeiCode = response.data.data.imeiCode + "";
                // console.log(this.ruleForm)
                this.rules = {
                    deviceId:[{required:false},],
                    locationInfo:[
                        {required:true,message:"请输入设备位置号码",trigger:'blur'}
                    ],
                    imeiCode:[
                        {required:true,message:"请输入IMEI码",trigger:'blur'},
                        {min:15,max:15,message:'IMEI码应该由15个数字组成',trigger:'blur'}
                    ]
                }
                // this.rules.deviceId[1] = null;
                this.statement = "保存更改";
                this.drawer = true;
                this.flag = true;
            })
            
        },
        handleSelectionChange(val) {
            this.selectDel = val
            // console.log(this.selectDel)
        },
        handleDelete(id){
            this.deleteId = id;
            this.delVisible = true;
        },
        deleteRow(){
            axios.post('/api/deleteEquip',{
                deviceId:this.deleteId
            }).then(()=>{
                this.delVisible = false;
                this.init();
                // console.log(response.data)
            })

        },
        jumpHistory(deviceId){
            this.$store.commit('updateDevice',deviceId);
            this.$router.push('/history')
        },        
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
        },
        search(){
            axios.post('/api/findEquipById',{
                deviceId:this.searchInput
            }).then(response=>{
                this.ruleForm2.deviceId = response.data.data.deviceId + "";
                this.ruleForm2.locationInfo = response.data.data.locationInfo;
                this.ruleForm2.imeiCode = response.data.data.imeiCode + "";
                // console.log(response.data)
                this.searchForm = true;
            })
        },
        closeDraw(){
            this.searchDrawer = false;
            this.drawer = false;
        }
    },
}
</script>
<style lang="less" scoped>
  .container{
      padding:10px 30px;
  }
  .el-row {
    height: 100px;
    display: flex;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    height: 100%;
    border-radius: 4px;
  }

    .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
//   .bg-purple-light {
//     background: #e5e9f2;
//   }
  .grid-content {
    border-radius: 4px;
    height:100%;
    p{
        height: 50%;
        line-height: 40px;
        text-align: center;
        font-size:18px;
        color:#333333;
        &:first-of-type{
            line-height: 60px;
             color:#666666;
             font-size:14px;
        }
    };
  }

  .grid-button{
      display: flex;
      justify-content: center;
      align-items:center;
      button{
          margin-top:10px
      }
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .before{
    width:100%;
    min-height:100%;
  }

  .draw-title{
      display: flex;
      justify-content: space-between;
      padding:0 30px;
      width:100%;
      height:85px;
    //   min-height:15%;
      line-height: 85px;
      font-size:18px;
      color:#17233d;
      text-align: left;
      border-bottom: 1px solid rgba(112, 112, 112,0.5);
      i{
          line-height:85px;
      }
  }

  .equip-info{
      padding:0 30px;
      width:100%;
    //   min-height:85%;
  }

  .ruleForm{
      margin:20px 20px;
  }

.opetate{
    margin:0;
}

.search-content{
    padding:10px;
}
</style>