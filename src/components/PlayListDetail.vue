<template>
  <div class="playlistdetail">
    <div class="left">
      <div class="info">
        <div class="cover">
          <img :src="playlist.coverImgUrl" alt="">
        </div>
        <div class="content">
          <div class="hd">
            <el-tag type="danger" effect="dark" size="mini">歌单</el-tag>
            <div class="title">
              <h2>{{ playlist.name }}</h2>
            </div>
          </div>
          <div class="user">
            <a href="javascript:;" class="face">
              <img :src="playlist.creator.avatarUrl" alt="">
            </a>
            <span class="name">
              <a href="javascript:;">{{ playlist.creator.nickname }}</a>
            </span>
            <span class="time">{{ playlist.createTime | getDate }} 创建</span>
          </div>
          <div class="operation">
            <el-button size="mini" type="primary"><i class="el-icon-video-play">播放</i></el-button>
            <el-button size="mini"><i class="el-icon-folder-add">({{ playlist.subscribedCount }})</i></el-button>
            <el-button size="mini"><i class="el-icon-share">({{ playlist.shareCount }})</i></el-button>
            <el-button size="mini"><i class="el-icon-download">下载</i></el-button>
            <el-button size="mini"><i class="el-icon-chat-line-square">({{ playlist.commentCount }})</i></el-button>
          </div>
          <div class="tags">
            <span>标签：</span>
            <el-button size="mini" round v-for="item in playlist.tags" :key="item">{{ item }}</el-button>
          </div>
          <p id="desc">
            <span>介绍：</span>{{ playlist.description }}
          </p>
        </div>
      </div>
      <div class="song">
        <div class="title">
          <h3>
            <span>歌曲列表</span>
          </h3>
          <span class="count">{{ playlist.trackCount }}首歌</span>
          <div class="more">播放：<strong>{{ playlist.playCount }}</strong>次</div>
        </div>
        <table class="songlist">
          <thead>
            <tr>
              <th></th>
              <th>歌曲标题</th>
              <th>时长</th>
              <th>歌手</th>
              <th>专辑</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tracks" :key="item.id">
              <td>
                {{ index + 1 }}
                <a href="javascript:;" @click="getSongUrl(item.id)"><i class="el-icon-video-play"></i></a>
              </td>
              <td>
                <router-link :to="{path:'/song',query:{id:item.id}}">{{ item.name }}</router-link>
              </td>
              <td>{{ item.dt | getTime }}</td>
              <td>{{ item.ar[0].name }}</td>
              <td>{{ item.al.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="comment" ref="comment">
        <div class="title">
          <h3>
            <span>评论</span>
          </h3>
          <span class="count">共{{ comment.total }}条评论</span>
        </div>
        <h3 v-if="comment.hotComments.length">精彩评论</h3>
        <ul>
          <li v-for="item in comment.hotComments" :key="item.commentId">
            <div class="head">
              <a href="javascript:;">
                <img :src="item.user.avatarUrl" alt="">
              </a>
            </div>
            <div class="cntwrap">
              <div class="up">
                <a href="">{{ item.user.nickname }}</a> ：{{ item.content }}
              </div>
              <div class="down">
                <div class="time">{{ item.time | getDateTime }}</div>
                <div class="action">
                  <a href="" class="like"><i class="el-icon-star-off"></i> ({{ item.likedCount }})</a>
                  <span>|</span>
                  <a href="javascript:;" class="reply">回复</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <br v-if="comment.hotComments.length">
        <br v-if="comment.hotComments.length">
        <h3 v-if="comment.comments.length">最新评论({{ comment.total }})</h3>
        <ul>
          <li v-for="item in comment.comments" :key="item.commentId">
            <div class="head">
              <a href="javascript:;">
                <img :src="item.user.avatarUrl" alt="">
              </a>
            </div>
            <div class="cntwrap">
              <div class="up">
                <a href="javascript:;">{{ item.user.nickname }}</a> ：{{ item.content }}
              </div>
              <div class="down">
                <div class="time">{{ item.time | getDateTime }}</div>
                <div class="action">
                  <a href="javascript:;" class="like"><i class="el-icon-star-off"></i> ({{ item.likedCount }})</a>
                  <span>|</span>
                  <a href="javascript:;" class="reply">回复</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <h3>喜欢这个歌单的人</h3>
      <ul class="piclist">
        <li v-for="item in playlist.subscribers.slice(0, 8)" :key="item.userId">
          <a href="javascript:;">
            <img :src="item.avatarUrl" alt="">
          </a>
        </li>
      </ul>
      <h3>热门歌单</h3>
      <ul class="hotlist">
        <li v-for="item in hotlist" :key="item.id">
          <div class="cover">
            <router-link :to="{path:'/playlist',query:{id:item.id}}">
              <img :src="item.coverImgUrl" alt="">
            </router-link>
          </div>
          <div class="info">
            <p class="title">
              <router-link :to="{path:'/playlist',query:{id:item.id}}">{{ item.name }}</router-link>
            </p>
            <p class="by">
              <span>by </span>
              <a href="javascript:;">{{ item.creator.nickname }}</a>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import bus from './eventBus.js'

export default {
  data () {
    return {
      // 歌单详情
      playlist: {
        coverImgUrl: '',
        name: '',
        createTime: 0,
        subscribedCount: 0,
        shareCount: 0,
        commentCount: 0,
        description: '',
        trackCount: 0,
        playCount: 0,
        tags: [], // 歌单标签
        tracks: [], // 歌曲,
        subscribers: [], // 喜欢这个歌单的人
        creator: {}, // 歌单作者
        al: {} // 专辑
      },
      // 歌单评论
      comment: {
        total: 0,
        comments: [],
        hotComments: []
      },
      // 热门歌单
      hotlist: [],
      // 歌曲
      tracks: [],
      // 音乐Url
      musicUrl: ''
    }
  },
  methods: {
    async getDetail () {
      const { data: res } = await this.$http.get('playlist/detail', { params: { id: this.$route.query.id } })
      if (res.code !== 200) return this.$message.error('获取歌单详情失败')
      // this.$message.success('获取歌单详情成功')
      this.playlist = res.playlist
      this.tracks = res.playlist.tracks
    },
    async getComment () {
      const { data: res } = await this.$http.get('comment/playlist', { params: { id: this.$route.query.id } })
      if (res.code !== 200) return this.$message.error('获取歌单评论失败')
      // this.$message.success('获取歌单评论成功')
      this.comment.total = res.total
      this.comment.comments = res.comments
      this.comment.hotComments = res.hotComments
    },
    async getHotList () {
      const { data: res } = await this.$http.get('top/playlist?limit=6')
      if (res.code !== 200) return this.$message.error('获取热门歌单失败')
      // this.$message.success('获取热门歌单成功')
      this.hotlist = res.playlists
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
    this.getDetail()
    this.getComment()
    this.getHotList()
  },
  filters: {
    getDate (value) {
      const date = new Date(value)
      const yyyy = date.getFullYear()
      let MM = date.getMonth() + 1
      let dd = date.getDate()
      MM = MM < 10 ? '0' + MM : MM
      dd = dd < 10 ? '0' + dd : dd
      return yyyy + '-' + MM + '-' + dd
    },
    getTime (value) {
      const date = new Date(value)
      let minute = date.getMinutes()
      let second = date.getSeconds()
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      return minute + ':' + second
    },
    getDateTime (value) {
      const date = new Date(value)
      const MM = date.getMonth() + 1
      const dd = date.getDate()
      let HH = date.getHours()
      let mm = date.getMinutes()
      HH = HH < 10 ? '0' + HH : HH
      mm = mm < 10 ? '0' + mm : mm
      return MM + '月' + dd + '日' + ' ' + HH + ':' + mm
    }
  },
  watch: {
    $route: 'getDetail'
  }
}
</script>

<style lang="less" scoped>
.playlistdetail {
  padding: 0 1px;
  background-color: #fff;
  overflow: hidden;
  .left {
    float: left;
    width: 710px;
    height: 100%;
    padding: 40px 30px 40px 35px;
    border-right: 1px solid #e1e1e1;
    box-sizing: border-box;
    .info {
      height: 100%;
      display: flex;
      .cover {
        height: 208px;
        width: 208px;
        padding: 3px;
        border: 1px solid #d5d5d5;
        box-sizing: border-box;
        img {
          height: 200px;
          width: 200px;
        }
      }
      .content {
        flex: 1;
        height: 100%;
        margin-left: 25px;
        .hd {
          display: flex;
          height: 100%;
          margin: 4px 0 12px;
          .el-tag {
            height: 24px;
            line-height: 24px;
            padding: 0 6px;
          }
          .title h2 {
            font-size: 20px;
            font-weight: 400;
            color: #333;
            line-height: 24px;
            margin-left: 10px;
          }
        }
        .user {
          display: flex;
          align-items: center;
          height: 35px;
          margin: 0 0 20px;
          a.face img {
            height: 35px;
            width: 35px;
            transform: translateY(2px);
          }
          .name a {
            color: #0c73c2;
            font-size: 12px;
            margin: 0 10px;
          }
          .time {
            color: #999;
            font-size: 12px;
            transform: translateY(2px);
          }
        }
        .operation {
          display: flex;
          align-items: center;
          height: 30px;
          margin: 0 0 25px;
          .el-button {
            padding: 7px 11px;
            i {
            color: #333;
            font-size: 12px;
            }
          }
          .el-button:first-child i {
            color: #fff;
          }
        }
        .tags {
          display: flex;
          align-items: center;
          height: 28px;
          color: #666;
          font-size: 12px;
          margin: 0 0 5px;
        }
        p#desc {
          color: #666;
          font-size: 12px;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
    .song {
      height: 100%;
      margin: 27px 0;
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
        .more {
          float: right;
          color: #666;
          font-size: 12px;
          margin-top: 9px;
          strong {
            color: #c20c0c;
          }
        }
      }
      .songlist {
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
            width: 75px;
          }
          th:nth-child(2) {
            width: 235px;
          }
          th:nth-child(3) {
            width: 110px;
          }
          th:nth-child(4) {
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
    .comment {
      .title {
        height: 35px;
        border-bottom: 2px solid #c20c0c;
        margin: 0 0 20px;
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
      h3 {
        font-size: 12px;
        margin: 0 0 5px;
      }
      ul li {
        display: flex;
        height: 100%;
        border-top: 1px dotted #cfcfcf;
        box-sizing: border-box;
        .head {
          height: 50px;
          width: 50px;
          margin: 15px 10px 0 0;
          a img {
            height: 50px;
            width: 50px;
          }
        }
        .cntwrap {
          flex: 1;
          margin: 15px 0;
          .up {
            font-size: 12px;
            line-height: 20px;
            a {
              color: #0c73c2;
            }
          }
          .down {
            font-size: 12px;
            margin-top: 15px;
            overflow: hidden;
            .time {
              float: left;
              color: #999;
            }
            .action {
              float: right;
              .like {
                color: #333;
                i {
                  color: #0c73c2;
                }
              }
              span {
                color: #ccc;
                margin: 0 8px;
              }
              .reply {
                color: #666;
              }
            }
          }
        }
      }
      ul li:first-child {
        border-top: 1px solid #cfcfcf;
      }
    }
  }
  .right {
    float: right;
    width: 270px;
    height: 100%;
    padding: 20px 40px 20px 30px;
    box-sizing: border-box;
    h3 {
      color: #333;
      font-size: 12px;
      padding: 0 0 10px;
      border-bottom: 1px solid #ccc;
      margin: 0 0 20px;
    }
    ul.piclist {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 0 25px;
      li {
        padding: 0 0 13px 13px;
        a img {
          width: 40px;
          height: 40px;
        }
      }
      li:nth-child(4n+1) {
        padding: 0;
      }
    }
    ul.hotlist {
      margin: 0 0 25px;
      li {
        height: 50px;
        padding: 0 0 15px;
        .cover {
          float: left;
          width: 50px;
          height: 50px;
          img {
            width: 50px;
            height: 50px;
          }
        }
        .info {
          float: right;
          width: 140px;
          height: 50px;
          margin: 0 0 0 10px;
          p.title {
            height: 25px;
            line-height: 25px;
            font-size: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          p.by {
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            span {
              color: #999;
            }
            a {
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
