<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn"
         @click="collapseChage">
      <i v-if="!collapse"
         class="el-icon-s-fold"></i>
      <i v-else
         class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">计数器管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen"
             @click="handleFullScreen">
          <el-tooltip effect="dark"
                      :content="fullscreen?`取消全屏`:`全屏`"
                      placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark"
                      :content="message?`有${message}条未处理警报`:`报警列表`"
                      placement="bottom">
            <i class="el-icon-bell"
               @click="jumpMessage"></i>
          </el-tooltip>
          <span class="btn-bell-badge"
                v-if="message>2"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../assets/img/timg.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name"
                     trigger="click"
                     @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <a href="https://github.com/" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a> -->
            <el-dropdown-item divided
                              command="loginout">退出登录</el-dropdown-item>
            <el-dropdown-item divided
                              command="returnFirstPage">返回首页</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import bus from './bus';
export default {
  data () {
    return {
      collapse: false,
      fullscreen: false,
      name: '',
      message: 0,
      // warningTimer:''
    };
  },
  computed: {
    username () {
      let username = sessionStorage.getItem('ms_username');
      return username ? username : this.name;
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand (command) {
      if (command == 'loginout') {
        sessionStorage.removeItem('ms_username');
        sessionStorage.setItem('loginstate', 1);
        this.$router.push('/login');
      }
      if (command == 'returnFirstPage') {
        //sessionStorage.removeItem('loginstate');
        this.$router.push('/login');
      }
    },
    // 侧边栏折叠
    collapseChage () {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    jumpMessage () {
      this.$router.push('/tabs')
    },
    warningFlash () {
      var warningTable = [];
      // let tableData = [];
      axios.get('/api').then(response => {
        let res = response.data;
        if (res.status == '0') {
          let date = new Date();
          for (let jj = 0; jj < res.data.length; jj++) {
            let status = res.data[jj].lastData.lastStatus;
            let rdate = res.data[jj].lastData.lastDate
            if (status == '0' || status == '1') {
              let date2 = new Date(rdate)
              if (date - date2 > 86400000) {
                status = '2'
              }
            }
            if (status == '1' || status == '2' || status == '3') {
              warningTable.push({
                deviceId: res.data[jj].deviceId,
                count: res.data[jj].lastData.lastCount,
                battery: res.data[jj].lastData.lastBattery,
                date: rdate,
                status: status,
                locationInfo:res.data[jj].locationInfo
              })
            }
          }
          this.message = warningTable.length;
          //   console.log(warningTable)
          this.$store.commit('updateWarningTable', warningTable)
        }
      })
    },
    warningListener () {
      this.warningFlash()
      this.warningTimer = setInterval(() => {
        this.warningFlash();
      }, 60000);
    }
  },
  mounted () {
    if (document.body.clientWidth < 1000) {
      this.collapseChage();
    }
    this.warningListener()
  },
  beforeDestroy () {
    clearInterval(this.warningTimer);
    this.warningTimer = null;
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  font-size: 22px;
  color: #fff;
  background-color: rgab(255, 255, 255, 0.2);
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 50px;
}
.header .logo {
  float: left;
  width: 180px;
  line-height: 50px;
}
.header-right {
  float: right;
  /* padding-right: -50px; */
  width: 250px;
  /* background-color: red; */
}
.header-user-con {
  display: flex;
  height: 50px;
  align-items: center;
  /* background:hotpink */
}
.btn-fullscreen {
  float: right;
  transform: rotate(45deg);
  font-size: 24px;
  /* background-color: hotpink; */
  margin-top: 2px;
  margin-right: -18px;
}

.btn-bell {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  margin-top: 5px;
  /* border-radius: 15px; */
  cursor: pointer;
  margin-left: 40px;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  /* top: -2px; */
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 20px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
