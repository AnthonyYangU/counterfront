<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>报警列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="warningTable.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                style="width: 100%">
        <el-table-column prop="deviceId"
                         label="DeviceId"
                         align="center">
        </el-table-column>

        <el-table-column prop="count"
                         label="Count"
                         align="center">
        </el-table-column>

        <el-table-column prop="battery"
                         label="Battery"
                         align="center">
        </el-table-column>

        <el-table-column prop="date"
                         label="Date"
                         align="center">
        </el-table-column>

        <el-table-column prop="status"
                         label="Status"
                         align="center">
          <template slot-scope="scope">
            <svg v-if="scope.row.status=='0'"
                 class="icon"
                 aria-hidden="true">
              <use xlink:href="#icon-ok"></use>
            </svg>
            <svg v-else-if="scope.row.status=='1'"
                 class="icon"
                 aria-hidden="true">
              <use xlink:href="#icon-sharpicons_warning"></use>
            </svg>
            <svg v-else-if="scope.row.status=='2'"
                 class="icon"
                 aria-hidden="true">
              <use xlink:href="#icon-warning"></use>
            </svg>
            <svg v-else
                 class="icon handlefull"
                 aria-hidden="true">
              <use xlink:href="#icon-ava_error"></use>
            </svg>
          </template>
        </el-table-column>
      </el-table>

      <div class="block"
           style="margin-top:10px;">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[10, 20, 30]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="warningTable.length"
                       prev-text="上一页"
                       next-text="下一页">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data () {
    return {
      pageSize: 10,
      currentPage: 1,
    }
  },
  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
  },
  computed: {
    warningTable () {
      return this.$store.state.warningTable;
    }
  }
}

</script>
