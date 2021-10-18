<template>
  <div class="my">
    <div class="container">
      <el-empty description="登录网易云音乐">
        <el-button type="primary" @click="login">立即登录</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login () {
      this.$emit('login')
    }
  }
}
</script>

<style lang="less" scoped>
.my {
  background-color: #f5f5f5;
  border-bottom: 1px solid #d3d3d3;
  box-sizing: border-box;
  .container {
    width: 984px;
    height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border-left: 1px solid #d3d3d3;
    border-right: 1px solid #d3d3d3;
    box-sizing: border-box;
  }
}
</style>
