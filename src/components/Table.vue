<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>设备总表</el-breadcrumb-item>
            <div class="legend">
                <span style="font-size:18px">图例:</span>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-ok"></use>
                </svg>
                <span>正常</span>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-low_battery"></use>
                </svg>    
                <span>电量低</span>            
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-sharpicons_warning"></use>
                </svg>
                <span>计数器内部故障</span>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-warning"></use>
                </svg>
                <span>计数器网络故障</span>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-ava_error"></use>
                </svg>
                <span>卡阻</span>
            </div>
            </el-breadcrumb>
        </div>
        <div class="container">


            <el-table
            :row-class-name="tableRowClassName"
            :header-cell-style="headerRowClass"
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%" @selection-change="handleSelectionChange" >
                    <!-- <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>      -->
                <el-table-column type="selection" width="55" align="center"></el-table-column>       
                <el-table-column 
                    prop="id" 
                    label="Id"
                    align="center">
                </el-table-column>
                 
                <el-table-column
                    prop="deviceId"
                    label="IMEI Code"
                    align="center">
                </el-table-column>

                <el-table-column
                    prop="count"
                    label="Move Count"
                    align="center">
                </el-table-column>

                <el-table-column
                    prop="battery"
                    label="Battery"
                    align="center">
                </el-table-column>   

                <el-table-column
                    prop="date"
                    label="Time"
                    align="center">
                </el-table-column>

                <el-table-column
                    prop="status"
                    label="Status"
                    align="center">
                    <template slot-scope="scope">
                        <svg v-if = "scope.row.battery<'3.00'" class="icon" aria-hidden="true">
                            <use xlink:href="#icon-low_battery"></use>
                        </svg>
                        &nbsp;
                        <svg v-if = "scope.row.status=='0'" class="icon" aria-hidden="true">
                            <use xlink:href="#icon-ok"></use>
                        </svg>
                        <svg v-if="scope.row.status=='1'" class="icon" aria-hidden="true">
                            <use xlink:href="#icon-sharpicons_warning"></use>
                        </svg>
                        <svg v-else-if="scope.row.status=='2'" class="icon" aria-hidden="true">
                            <use xlink:href="#icon-warning"></use>
                        </svg>
                        <svg v-else class="icon handlefull" aria-hidden="true">
                            <use xlink:href="#icon-ava_error"></use>
                        </svg>
                                                             
                    </template>
                </el-table-column>

                <el-table-column label="Operation">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-search" class="blue" size="small" @click="jumpHistory(scope.row.deviceId)">历史</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" size="small" @click="handleDelete(scope.row.id)">删除</el-button>                    
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
            <br>
            <el-button type="primary" icon="el-icon-delete" @click="handleDeleteMany">批量删除</el-button>
            <!-- <el-button type="primary" icon="el-icon-download" @click = "export2Excel">导出表格</el-button> -->
            <br/>
            <br/>
            
            <!-- <el-button @click="test">test</el-button> -->
        </div>
        

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="delManyVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delManyVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteMany">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'basetable',
        data() {
            return {
                delVisible:false,
                delManyVisible:false,
                pageSize:10,
                tableData: [],
                completeData:[],
                // select_word:'',
                currentPage: 1,
                selectDel:[],
                selectedDel:[],
                len:0
            }
        },
        mounted(){
            this.init();
            this.initTimer = setInterval(()=>{
                this.init();
            },60000);
        },
        beforeDestroy(){
            clearInterval(this.initTimer);
            this.initTimer = null;
        },
        methods: {
                init(){
                    axios.get('/api').then((response)=>{
                        // let date = new date();
                        let res = response.data;
                        
                        this.tableData = [];
                        // console.log(res)
                        if(res.status=="0"){
                            
                            this.len = res.data.length;
                            let date = new Date();
                            for(let jj=0;jj<this.len;jj++){
                                let status = res.data[jj].lastData.lastStatus;
                                let rdate = res.data[jj].lastData.lastDate
                                if(status=='0'||status=='1'){
                                    let date2 = new Date(rdate)
                                    if(date-date2>86400000){
                                        status = '2'
                                    }
                                }
                                // res.data[jj].id=jj;
                                
                                this.tableData.push({
                                    id:jj,
                                    deviceId:res.data[jj].deviceId,
                                    count:res.data[jj].lastData.lastCount,
                                    battery:res.data[jj].lastData.lastBattery,
                                    date:rdate,
                                    status:status
                                })
                                this.completeData[jj] = res.data[jj]._id;
                            }
                            // this.tableData = res.data;
                        }else{
                            this.tableData = [];
                        }
                    })                    
                },
                tableRowClassName({row, rowIndex}) {
                    if(row);
                    if (rowIndex%2 == 1) {
                    return 'success-row';
                    } else{
                        return '';
                    }
                },
                headerRowClass({row, column, rowIndex, columnIndex}){
                //表头的背景颜色
                    if(row||column||columnIndex);

                    if(rowIndex==0){
                        return 'background:oldlace'
                    }
                },
                handleSelectionChange(val) {
                    this.selectDel = val
                    // console.log(this.selectDel)
                },
                handleDelete(id){
                    this.delVisible = true;
                    this.selectId = this.completeData[id]
                },
                handleDeleteMany(){
                    this.selectedDel = this.selectDel;
                    this.delManyVisible = true;
                },
                // handleDeleteAll(){
                //     this.allVisible = true;
                // },
                handleSizeChange(val) {
                    // console.log(`每页 ${val} 条`);
                    this.pageSize = val;
                },
                handleCurrentChange(val) {
                    // console.log(`当前页: ${val}`);
                    this.currentPage = val;
                },
                jumpHistory(deviceId){
                    this.$store.commit('updateDevice',deviceId);
                    this.$router.push('/history')
                },
                checkTime(i){
                    if (i < 10) { i = "0" + i }
                    return i
                },
                transDate(date){
                    let d = new Date(date);
                    let y = d.getFullYear(),
                        m = d.getMonth() + 1,
                        day = d.getDate();
                    m = this.checkTime(m);
                    day = this.checkTime(day);
                    return y + '-' + m + '-' + day
                },
                transTime(time){
                    let t = new Date(time);
                    let h = t.getHours(),
                        m = t.getMinutes(),
                        s = t.getSeconds()
                    h = this.checkTime(h);
                    m = this.checkTime(m);
                    s = this.checkTime(s);
                    return h + ":" + m + ":" + s
                },
                find(data){
                    for(let ite=0;ite<this.len;ite++){
                        if(this.completeData[ite]==data)
                            return ite;
                    }
                },
                deleteRow(){
                    this.delVisible = false;
                    console.log(this.selectId)
                    if(this.selectId!=''){
                        axios.get('/api/delete',{
                            params:{
                                _id:this.selectId
                            }
                        }).then(()=>{
                            this.delVisible = false;
                            this.$message.success('删除成功');
                            this.init();
                        })
                    }              
                },
                deleteMany(){
                    this.$message.success('删除成功');
                    // console.log(this.selectDel)
                    // this.allVisible = false;
                    // console.log(this.selectDel)
                    if(this.selectedDel.length != 0){
                        let delArray = [];
                        
                        for(let i=0;i<this.selectedDel.length;i++){
                            delArray.push(this.selectedDel[i].deviceId)
                        }

                        axios.post("/api/dm",{
                            delArray:delArray
                        }).then((response)=>{
                            
                            let res = response.data;
                            if(res.status == '0'){
                                this.delManyVisible = false
                                this.$message.success("批量删除成功")
                                this.init();
                            }
                        })
                    }         
                },
            //     export2Excel() {
            //         require.ensure([], () => {

            //             let types;
            //             if (this.searchState == 1){
            //                 types = ['id','deviceId','forcex','torque','buttery','temperature','date','time']
            //             }else{
            //                 types = ['id'].concat(this.selectType)
            //             }
            //             const { export_json_to_excel } = require('../excel/Export2Excel');
            //             const tHeader = types;  // 设置Excel的表格第一行的标题
            //             const filterVal = types;  // index、nickName、name是tableData里对象的属性
            //             const list = this.tableData;  //把data里的tableData存到list
            //             const data = this.formatJson(filterVal, list);
            //             export_json_to_excel(tHeader, data, '远传数据');  //导出Excel 文件名
            //         })
            //     },
            //     formatJson(filterVal, jsonData) {
            //         return jsonData.map(v => filterVal.map(j => v[j]))  
            //     }
                
            }
    }

</script>

<style lang="less">
  .el-table .success-row {
    background: #f0f9eb;
  }
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 50%;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .blue{
        color:blue
    }
    .mr10{
        margin-right: 10px;
    }
    .legend{
        float:right;
        margin-right:10px;
        line-height: 100%;
        span{
            margin-right: 10px;
        }
    }
</style>