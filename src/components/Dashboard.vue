<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="@/assets/img/timg.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">Lights will guide you home and ignite your bone</div>
                </el-card>
            </el-col>
        </el-row>

        <!-- <el-button type="primary" icon="el-icon-download" @click = "userGuide">测试</el-button> -->

        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    // import axios from 'axios'
    //import bus from './bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                // name: localStorage.getItem('ms_username'),
                name:'',
                data: [{
                        name: '2019/12/16',
                        value: 83
                    },
                    {
                        name: '2019/12/17',
                        value: 41
                    },
                    {
                        name: '2019/12/18',
                        value: 39
                    },
                    {
                        name: '2019/12/19',
                        value: 16
                    },
                    {
                        name: '2019/12/20',
                        value: 27
                    },
                    {
                        name: '2019/12/21',
                        value: 28
                    },
                    {
                        name: '2019/12/22',
                        value: 65
                    }
                ],
                options: {
                    title: '最近七天论文格式检测次数',
                    showValue: false,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30
                },
                options2: {
                    title: '最近七天论文格式检测次数变化',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD', 
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'Admin' ? '超级管理员' : '普通用户';
            }
        },
        mounted(){
            this.name=sessionStorage.getItem("ms_username")
        },
        methods: {            
            // userGuide(){
            //     // axios({
            //     //     method:'post',
            //     //     url:'api/download/',
            //     //     responseType:'blob'
            //     // }).then(response=>{
            //     //     this.download(response.data)
            //     // }).catch((error)=>{
            //     //     console.log(error)
            //     // })
            //     axios.get('/api/test').then((res)=>{
            //         console.log(res)
            //     })
            // },
            // download(data){
            //     if(!data){
            //         return
            //     }
            //     let url = window.URL.createObjectURL(new Blob([data]));
            //     let link = document.createElement('a');
            //     // link.style.display = url;
            //     link.href=url;
            //     link.setAttribute('download','UserGuild.pdf');
            //     document.body.appendChild(link);
            //     link.click();
            // }    
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
