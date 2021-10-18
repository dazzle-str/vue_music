<template>
  <div class="playlist">
    <div class="all">
      <div class="title">
        <h3>
          <span>{{ this.$route.query.cat || '全部' }}</span>
          <div class="block">
            <el-cascader v-model="value" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange" size="mini"></el-cascader>
          </div>
        </h3>
      </div>
      <div class="content">
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
            <p class="by">
              <span>by </span>
              <a href="javascript:;">{{ item.creator.nickname }}</a>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: [],
      options: [],
      catlist: [],
      hotlist: []
    }
  },
  methods: {
    async getCatList () {
      const { data: res } = await this.$http.get('playlist/catlist')
      if (res.code !== 200) return this.$message.error('获取歌单分类失败')
      // this.$message.success('获取歌单分类成功')
      Object.keys(res.categories).forEach(value => {
        this.catlist[value] = {}
        this.catlist[value].value = res.categories[value]
        this.catlist[value].label = res.categories[value]
        this.catlist[value].children = []
        const arr = res.sub.filter(element => element.category.toString() === value)
        arr.forEach((item, index) => {
          const catlist2 = {}
          catlist2.value = item.name
          catlist2.label = item.name
          this.catlist[value].children.push(catlist2)
        })
      })
      const all = { value: '全部', label: '全部' }
      this.catlist.unshift(all)
      this.options = this.catlist
    },
    async getHotList () {
      const { data: res } = await this.$http.get('top/playlist', { params: { limit: 35, cat: this.$route.query.cat } })
      if (res.code !== 200) return this.$message.error(`获取${this.$route.query.cat || '全部'}热门歌单失败`)
      // this.$message.success(`获取${this.$route.query.cat || '全部'}热门歌单成功`)
      this.hotlist = res.playlists
      this.total = res.total
    },
    async handleChange (value) {
      if (value[1] !== this.$route.query.cat && value[0] !== this.$route.query.cat) {
        this.$router.push(`/discover/playlist?cat=${value[1] || value[0]}`)
      }
      this.value = []
      // const { data: res } = await this.$http.get(`top/playlist?limit=35&cat=${value[1]}`)
      // if (res.code !== 200) return this.$message.error(`获取${value[1]}歌单失败`)
      // this.$message.success(`获取${value[1]}歌单成功`)
      // this.hotlist = res.playlists
      // this.total = res.total
    }
  },
  created () {
    this.getCatList()
    this.getHotList()
  },
  watch: {
    $route: 'getHotList'
  }
}
</script>

<style lang="less" scoped>
.playlist {
  background-color: #fff;
  padding: 41px;
  .all {
    .title {
      height: 35px;
      border-bottom: 2px solid #c20c0c;
      box-sizing: border-box;
      h3 {
        display: flex;
        float: left;
        font-weight: 400;
        line-height: 28px;
        font-size: 24px;
        color: #333;
        .block {
          margin-left: 10px;
          line-height: 20px;
        }
      }
    }
    .content {
      height:100%;
      margin-top: 30px;
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          display: block;
          width: 140px;
          height: 218px;
          padding: 0 0 0 50px;
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
          p.dec {
            width: 140px;
            font-size: 14px;
            margin: 8px 0 3px 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          p.by {
            font-size: 12px;
            margin: 0;
            span {
              color: #999;
            }
            a {
              color: #666;
            }
          }
        }
        li:nth-child(5n+1) {
          padding: 0;
        }
      }
    }
  }
}
</style>
