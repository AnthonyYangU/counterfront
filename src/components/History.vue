<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>历史数据</el-breadcrumb-item>
        <div class="legend">
          <!-- <span style="font-size:18px">图例:</span> -->
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-ok"></use>
          </svg>
          <span>正常</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-discharged-battery"></use>
          </svg>
          &nbsp;
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
      <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        :row-class-name="tableRowClassName" :header-cell-style="headerRowClass" style="width: 100%">

        <el-table-column prop="count" label="动作次数" align="center">
        </el-table-column>

        <el-table-column prop="battery" label="电池电量（V）" align="center">
        </el-table-column>

        <el-table-column prop="date" label="时间" align="center">
        </el-table-column>

        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <svg v-if="scope.row.battery<'2.70'" class="icon" aria-hidden="true">
              <use xlink:href="#icon-discharged-battery"></use>
            </svg>
            &nbsp;
            <svg v-if="scope.row.status=='0'" class="icon" aria-hidden="true">
              <use xlink:href="#icon-ok"></use>
            </svg>
            <svg v-else-if="scope.row.status=='1'" class="icon" aria-hidden="true">
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
      </el-table>

      <div class="block" style="margin-top:10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length" prev-text="上一页" next-text="下一页">
        </el-pagination>
      </div>

      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span='12'>
            <div ref="myChart" class="echart"></div>
          </el-col>
          <el-col :span='12'>
            <div ref="myChart2" class="echart"></div>
          </el-col>
        </el-row>
      </el-card>

      <div class="title">设备号：{{deviceId}} &nbsp;， 位置号：{{locationInfo}}</div>

      <el-row :gutter='20' type="flex" justify="center" style="margin-top:20px">
        <el-col :span='6'>
          <el-input placeholder="deviceId" suffix-icon="el-icon-cherry" v-model="selectDevice"></el-input>
        </el-col>
        <el-col :span='2'>
          <el-button type="primary" icon="el-icon-search search" @click="search">搜索</el-button>
        </el-col>
      </el-row>
      <br>
      <!-- <button @click="drawChart">test</button> -->
    </div>
    <!-- <button @click="searchDetail">test</button> -->
  </div>
</template>
<script>
  import axios from 'axios';
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/bar')
  // 以下的组件按需引入
  require('echarts/lib/component/tooltip') // tooltip组件
  require('echarts/lib/component/title') //  title组件
  require('echarts/lib/component/legend') // legend组件

  export default {
    data() {
      return {
        tableData: [],
        pageSize: 10,
        currentPage: 1,
        selectDevice: '',
        deviceId: '',
        locationInfo: '',
      }
    },
    computed: {},
    methods: {
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (row);
        if (rowIndex % 2 == 1) {
          return 'success-row';
        } else {
          return '';
        }
      },
      headerRowClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        //表头的背景颜色
        if (row || column || columnIndex);

        if (rowIndex == 0) {
          return 'background:oldlace'
        }
      },
      search() {
        if (this.selectDevice == '') {
          return
        }
        axios.get('/api/detail', {
          params: {
            deviceId: this.selectDevice
          }
        }).then(response => {
          let res = response.data;
          let cdata = res.data
          if (res.status == '0') {
            // for (let i = 0; i < cdata.data.length; i++) {
            //   cdata.data[i].locationInfo = cdata.locationInfo;
            // }
            // console.log(cdata)
            this.deviceId = cdata.deviceId;
            this.locationInfo = cdata.locationInfo;
            this.tableData = cdata.data;
            // this.tableData.locationInfo = cdata.locationInfo;
          }
          // console.log(this.tableData)
          this.drawChart();

        }).catch((err) => {
          console.log(err)
          this.$message.error("设备号输入错误")
        })
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      drawChart() {
        let idArray = [],
          batteryArray = [],
          countArray = [];
        for (let i = 0; i < this.tableData.length; i++) {
          idArray.push(this.tableData[i].date);
          batteryArray.push(this.tableData[i].battery);
          countArray.push(this.tableData[i].count);
        }
        let option2 = {
          title: {
            text: "电池电量"
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: idArray
          },
          yAxis: {
            type: 'value'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          series: [{
            name: '电池电量',
            data: batteryArray,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }]
        }


        let option = {
          title: {
            text: '动作次数'
          },
          tooltip: {
            trigger: 'axis'
          },
          // legend: {
          //   data: ['Count', 'Battery']
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: idArray
          },
          yAxis: {
            type: 'value'
          },
          series: [{
              name: '动作次数',
              type: 'line',
              data: countArray
            },
            // {
            //   name: 'Battery',
            //   type: 'line',
            //   data: batteryArray
            // },
          ]
        };
        let mychart = echarts.init(this.$refs.myChart);
        // mychart.clear();
        mychart.setOption(option);
        // console.log(option)

        let mychart2 = echarts.init(this.$refs.myChart2);
        mychart2.setOption(option2);
      }
    },
    mounted() {
      this.selectDevice = this.$store.state.device;
      if (this.selectDevice == '') {
        axios.get('/api/findEquip').then(response => {
          let res = response.data;
          this.selectDevice = res.data[0].deviceId;
          this.search();
        })
      } else {
        this.search();
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 18px;
    color: #1f2f3d;
  }

  .echart {
    width: 100%;
    height: 500px;
  }

  .legend {
    float: right;
    margin-right: 10px;
    line-height: 100%;

    span {
      margin-right: 10px;
    }
  }
</style>