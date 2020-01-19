<template>
  <div>
    <el-input
      v-if="inputVisible"
      v-model="inputValue"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
  </div>
</template>

<script>
export default {
  name: "welcome",
  data(){
      return{
          inputVisible:false,
          inputValue:''
      }
  },
  methods:{
      handleInputConfirm(){
          console.log('ok')
      },
      showInput(){
          this.inputVisible = true
      }
  }
};
</script>

<style lang="less" scoped>
</style>