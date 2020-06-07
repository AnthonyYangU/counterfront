<template>
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
</template>

<script>
export default {
    
}
</script>

<style scoped>
    .legend{
        float:right;
        margin-right:10px;
        line-height: 20px;
    }   
    .legend  span{
            font-size:16px;
            display: inline-block;
            line-height:20px;
            text-align: center;
            margin-right: 10px;
        } 
</style>
