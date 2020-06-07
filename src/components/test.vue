<template>
    <div>
        <el-button type="primary" @click="flush">test</el-button>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    methods:{
        flush(){
            axios.post('/api/meteoInsertById',{
                imeiId:518,
                time:563,
                version:1,
                sequenceNumber:2,
                messageTime:569,
                messageType:"test",
                sensord:23,
                locationId:"20R"
            }).then(response=>{
                console.log(response)
            })
        }
    }
}
</script>