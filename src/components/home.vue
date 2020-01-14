<template>
    <div>
        <el-button @click="logout" type="info">退出</el-button>
    </div>
</template>

<script>
    export default {
        name:'home',
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push('/login')
            }
        }
    }
</script>

<style lang="less" scoped>

</style>