<template>
  <div class="toplist">
    <div class="ranking">
      <div class="title">
        <h3>
          <span>歌曲列表</span>
        </h3>
        <span class="count">100首歌</span>
      </div>
      <table class="rank">
        <thead>
          <tr>
            <th></th>
            <th>标题</th>
            <th>时长</th>
            <th>歌手</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in songlist" :key="item.id">
            <td>
              {{ index + 1 }}
              <a href="javascript:;" @click="getSongUrl(item.id)"><i class="el-icon-video-play"></i></a>
            </td>
            <td>
              <router-link :to="{path:'/song',query:{id:item.id}}">{{ item.name }}</router-link>
            </td>
            <td>{{ item.duration | getTime }}</td>
            <td>{{ item.artists[0].name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import bus from './eventBus.js'

export default {
  data () {
    return {
      songlist: []
    }
  },
  methods: {
    async getSongList () {
      const { data: res } = await this.$http.get('top/song?type=0')
      if (res.code !== 200) return this.$message.error('获取歌曲列表失败')
      // this.$message.success('获取歌曲列表成功')
      this.songlist = res.data
    },
    async getSongUrl (id) {
      const { data: res } = await this.$http.get('song/url', { params: { id: id } })
      if (res.code !== 200) return this.$message.error('获取音乐失败')
      // this.$message.success('获取音乐成功')
      this.musicUrl = res.data[0].url
      this.sendMusic()
    },
    sendMusic () {
      bus.$emit('musicUrl', this.musicUrl)
    }
  },
  created () {
    this.getSongList()
  },
  filters: {
    getTime (value) {
      const date = new Date(value)
      let minute = date.getMinutes()
      let second = date.getSeconds()
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      return minute + ':' + second
    }
  }
}
</script>

<style lang="less" scoped>
.toplist {
  overflow: hidden;
  background-color: #fff;
  .ranking {
    width: 670px;
    height: 100%;
    margin: 40px auto;
    .title {
      height: 35px;
      border-bottom: 2px solid #c20c0c;
      box-sizing: border-box;
      h3 {
        float: left;
        font-weight: 400;
        line-height: 28px;
        span {
          font-size: 20px;
          color: #333;
        }
      }
      span.count {
        float: left;
        font-size: 12px;
        color: #666;
        margin: 9px 0 0 20px;
      }
    }
    .rank {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      thead {
        height: 38px;
        th {
          color: #666;
          font-size: 12px;
          font-weight: 400;
          text-align: left;
          padding-left: 10px;
          border: 1px solid #d9d9d9;
          box-sizing: border-box;
        }
        th:first-child {
          width: 80px;
        }
        th:nth-child(2) {
          width: 325px;
        }
        th:nth-child(3) {
          width: 90px;
        }
      }
      tbody {
        border: 1px solid #d9d9d9;
        tr {
          height: 30px;
          td {
            color: #333;
            font-size: 12px;
            padding-left: 10px;
            box-sizing: border-box;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          td:first-child {
            color: #999;
            line-height: 30px;
            a {
              float: right;
              font-size: 16px;
              padding-right: 10px;
            }
          }
          td:nth-child(3) {
            color: #666;
          }
        }
        tr:nth-child(2n + 1) {
          background-color: #f7f7f7;
        }
      }
    }
  }
}
</style>
