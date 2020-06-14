<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>报警列表</el-breadcrumb-item>
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
      <el-table :row-class-name="tableRowClassName" :header-cell-style="headerRowClass"
        :data="warningTable.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
        <!-- <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>      -->
        <!-- <el-table-column type="selection" width="30" align="center"></el-table-column>        -->
        <!-- <el-table-column 
                    prop="id" 
                    label="设备号"
                    align="center">
                </el-table-column> -->

        <el-table-column prop="deviceId" label="设备编号" align="center">
        </el-table-column>

        <el-table-column prop="locationInfo" label="位置号" align="center">
        </el-table-column>

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
          :total="warningTable.length" prev-text="上一页" next-text="下一页">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tabs',
    data() {
      return {
        pageSize: 10,
        currentPage: 1,
      }
    },
    methods: {
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
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
    },
    computed: {
      warningTable() {
        return this.$store.state.warningTable;
      }
    }
  }
</script>

<style lang="less">
  .legend {
    float: right;
    margin-right: 10px;
    line-height: 100%;

    span {
      margin-right: 10px;
    }
  }
</style>