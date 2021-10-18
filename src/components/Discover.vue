<template>
<el-container>
  <el-header>
    <div class="top">
      <div class="top-container">
        <ul class="nav">
          <li>
            <router-link to="/discover">推荐</router-link>
          </li>
          <li>
            <router-link to="/discover/toplist">排行榜</router-link>
          </li>
          <li>
            <router-link to="/discover/playlist">歌单</router-link>
          </li>
          <li>
            <a>主播电台</a>
          </li>
          <li>
            <a>歌手</a>
          </li>
          <li>
            <a>新碟上架</a>
          </li>
        </ul>
      </div>
    </div>
  </el-header>
  <el-main>
    <div class="container">
      <router-view></router-view>
    </div>
  </el-main>
</el-container>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.el-header,
.el-main {
  padding: 0;
}

.el-header {
  height: 34px!important;
  .top {
    height: 100%;
    background-color: #c20c0c;
    .top-container {
      width: 934px;
      margin: 0 auto;
      .nav li {
        float: left;
        line-height: 34px;
        font-size: 12px;
        color: #fff;
        padding-left: 56px;
        a {
          color: #fff;
        }
      }
    }
  }
}

.el-main {
  background-color: #f5f5f5;
}

.container {
  width: 984px;
  border: 1px solid #d3d3d3;
  border-top: none;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
