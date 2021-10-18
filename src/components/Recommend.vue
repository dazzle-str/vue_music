<template>
  <div>
    <div class="wrap">
      <div class="wrap-left">
        <div class="block">
          <el-carousel trigger="click" height="284px" indicator-position="none">
            <el-carousel-item v-for="item in banner" :key="item.imgageUrl">
              <h3 class="small"><img :src="item.imageUrl" alt=""></h3>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="wrap-right">
        <a href="javascript:;">下载客户端</a>
        <p>PC 安卓 iPhone WP iPad Mac 六大客户端</p>
      </div>
    </div>
    <div class="recommend-content">
      <div class="recommend-left">
        <div class="hot">
          <div class="hot-top">
            <a href="javascript:;" id="hot-title">热门推荐</a>
            <div class="tab">
              <ul>
                <li v-for="item in category.slice(0,5)" :key="item.id"><router-link :to="{path:'/discover/playlist',query:{cat:item.name}}">{{ item.name }}</router-link></li>
              </ul>
            </div>
            <span class="more">
              <router-link to="/discover/playlist">更多</router-link>
            </span>
          </div>
          <div class="hot-content">
            <ul>
              <li v-for="item in hotlist" :key="item.id">
                <div class="cover">
                  <img :src="item.coverImgUrl" alt="">
                  <router-link :to="{path:'/playlist',query:{id:item.id}}">{{ item.name }}</router-link>
                  <div class="bottom">
                    <span class="nb">{{ parseInt(item.playCount/10000) }}万</span>
                  </div>
                </div>
                <p class="dec">
                  <router-link :to="{path:'/playlist',query:{id:item.id}}">{{ item.name }}</router-link>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="recommend-right">
        <div class="singer">
          <div class="singer-top">
            <h3>
              <span id="singer-title">入驻歌手</span>
              <a href="javascript:;">查看全部 ></a>
            </h3>
          </div>
          <div class="singer-content">
            <ul id="singer-list">
              <li v-for="item in singerlist" :key="item.id">
                <a href="javascript:;">
                  <div class="head">
                    <img :src="item.picUrl" alt="">
                  </div>
                  <div class="info">
                    <h4>
                      <span>{{ item.name }}</span>
                    </h4>
                    <p>{{ item.alias[0]||item.trans }}</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      banner: [],
      category: [],
      hotlist: [],
      singerlist: []
    }
  },
  methods: {
    async getBanner () {
      const { data: res } = await this.$http.get('banner')
      if (res.code !== 200) return this.$$message.error('获取轮播图失败')
      // this.$message.success('获取轮播图成功')
      this.banner = res.banners
    },
    async getCategory () {
      const { data: res } = await this.$http.get('playlist/hot')
      if (res.code !== 200) return this.$message.error('获取歌单分类失败')
      // this.$message.success('获取歌单分类成功')
      this.category = res.tags
    },
    async getHotList () {
      const { data: res } = await this.$http.get('top/playlist?limit=8')
      if (res.code !== 200) return this.$message.error('获取热门歌单失败')
      // this.$message.success('获取热门歌单成功')
      this.hotlist = res.playlists
    },
    async getSingerList () {
      const { data: res } = await this.$http.get('artist/list?cat=5001&limit=6')
      if (res.code !== 200) return this.$message.error('获取入驻歌手失败')
      // this.$message.success('获取入驻歌手成功')
      this.singerlist = res.artists
    }
  },
  created () {
    this.getBanner()
    this.getCategory()
    this.getHotList()
    this.getSingerList()
  }
}
</script>

<style lang="less" scoped>
.wrap {
  height: 284px;
  display: flex;
  .wrap-left {
    height: 100%;
    width: 730px;
    .el-carousel__item h3 {
      margin: 0;
      img {
        height: 284px;
      }
    }
  }
  .wrap-right {
    height: 100%;
    width: 254px;
    background-image: url('../assets/download.png');
    a {
      display: block;
      width: 215px;
      height: 56px;
      margin: 186px 0 0 19px;
      text-indent: -9999px;
    }
    p {
      color: #8d8d8d;
      font-size: 12px;
      text-align: center;
      margin: 10px auto;
    }
  }
}

.recommend-content {
  height: 100%;
  display: flex;
  .recommend-left {
    width: 730px;
    height: 100%;
    padding: 20px 20px 0 20px;
    border-right: 1px solid #d3d3d3;
    box-sizing: border-box;
    background-color: #fff;
    .hot {
      height: 100%;
      width: 100%;
      .hot-top {
        width: 690px;
        height: 35px;
        box-sizing: border-box;
        border-bottom: 2px solid #c20c0c;
        margin-bottom: 20px;
        a#hot-title {
          color: #333;
          font-size: 20px;
          line-height: 30px;
          float: left;
          margin-left: 35px;
        }
        .tab {
          float: left;
          ul li {
            float: left;
            color: #666;
            font-size: 12px;
            padding-left: 30px;
            line-height: 38px;
          }
        }
        span {
          line-height: 35px;
          float: right;
          padding-right: 38px;
          a {
            color: #666;
            font-size: 12px;
          }
        }
      }
      .hot-content {
        width: 100%;
        height: 468px;
        ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          li {
            display: block;
            width: 140px;
            height: 234px;
            .cover {
              width: 140px;
              height: 140px;
              position: relative;
              img {
                width: 100%;
                height: 100%;
              }
              a {
                position: absolute;
                left: 0;
                top: 0;
                display: block;
                width: 100%;
                height: 113px;
                text-indent: -9999px;
              }
              .bottom {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 27px;
                font-size: 12px;
                color: #ccc;
                background-color: #333;
                opacity: 0.5;
                .nb {
                  line-height: 27px;
                  margin-left: 8px;
                }
              }
            }
            p {
              width: 140px;
              font-size: 14px;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
  .recommend-right {
    width: 254px;
    height: 544px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    .singer {
      height: 100%;
      width: 100%;
      .singer-top {
        width: 100%;
        height: 20px;
        border-bottom: 1px solid #d3d3d3;
        margin-bottom: 20px;
        box-sizing: border-box;
        span#singer-title {
          float: left;
          color: #333;
          font-size: 12px;
          font-weight: 700;
        }
        a {
          float: right;
          color: #666;
          font-size: 12px;
        }
      }
      .singer-content {
        width: 100%;
        ul#singer-list li {
          width: 100%;
          height: 62px;
          background-color: #fafafa;
          margin-bottom: 15px;
          box-sizing: border-box;
          .head {
            float: left;
            height: 62px;
            width: 62px;
            img {
              height: 100%;
              width: 100%;
            }
          }
          .info {
            float: right;
            height: 100%;
            width: 150px;
            padding-left: 14px;
            border: 1px solid #e9e9e9;
            box-sizing: border-box;
            border-left: none;
            h4 {
              font-size: 14px;
              margin: 8px 0;
            }
            p {
              font-size: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
