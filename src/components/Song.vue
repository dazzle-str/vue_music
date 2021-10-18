<template>
  <div class="song">
    <div class="left">
      <div class="info">
        <div class="cover">
          <img :src="song.al.picUrl" alt="">
        </div>
        <div class="content">
          <div class="hd">
            <el-tag type="danger" effect="dark" size="mini">单曲</el-tag>
            <div class="title">
              <h2>{{ song.name }}</h2>
            </div>
          </div>
          <p class="singer">
            歌手：
            <span><a href="javascript:;">{{ singer[0].name }}</a></span>
          </p>
          <p class="album">
            所属专辑：
            <span><a href="javascript:;">{{ song.al.name }}</a></span>
          </p>
          <div class="operation">
            <el-button size="mini" type="primary" @click="sendMusic"><i class="el-icon-video-play">播放</i></el-button>
            <el-button size="mini"><i class="el-icon-folder-add">收藏</i></el-button>
            <el-button size="mini"><i class="el-icon-share">分享</i></el-button>
            <el-button size="mini"><i class="el-icon-download">下载</i></el-button>
            <el-button size="mini"><i class="el-icon-chat-line-square">评论</i></el-button>
          </div>
          <div class="lyric">
            {{ lyric }}
          </div>
        </div>
      </div>
      <!-- <p class="contribution">
        贡献歌词：<a href="">{{ lyric.lyricUser.nickname }}</a>&nbsp;&nbsp;&nbsp;&nbsp;贡献翻译：<a href="">{{ lyric.transUser.nickname }}</a>
      </p> -->
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
      <h3>相似歌曲</h3>
      <ul class="songlist">
        <li v-for="item in simisong" :key="item.id">
          <div class="txt">
            <div class="name">
              <router-link :to="{path:'/song',query:{id:item.id}}">{{ item.name }}</router-link>
            </div>
            <div class="artist">
              <a href="javascript:;">{{ item.artists[0].name }}</a>
            </div>
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
      // 歌曲
      song: {
        name: '', // 歌名
        al: {} // 专辑
      },
      // 歌手
      singer: [{ name: '' }],
      // 歌词
      lyric: {},
      // 歌曲评论
      comment: {
        total: 0,
        comments: [],
        hotComments: []
      },
      // 相似歌曲
      simisong: [],
      // 音乐Url
      musicUrl: ''
    }
  },
  methods: {
    async getSong () {
      const { data: res } = await this.$http.get('song/detail', { params: { ids: this.$route.query.id } })
      if (res.code !== 200) return this.$message.error('获取歌曲详情失败')
      // this.$message.success('获取歌曲详情成功')
      this.song = res.songs[0]
      this.singer = res.songs[0].ar
    },
    async getLyric () {
      const { data: res } = await this.$http.get('lyric', { params: { id: this.$route.query.id } })
      if (res.code !== 200) return this.$message.error('获取歌词失败')
      // this.$message.success('获取歌词成功')
      if (res.nolyric && res.nolyric === true) this.lyric = '纯音乐，无歌词'
      else if (res.uncollected && res.uncollected === true) this.lyric = '暂时没有歌词'
      else this.lyric = res.lrc.lyric
    },
    async getComment () {
      const { data: res } = await this.$http.get('comment/music', { params: { id: this.$route.query.id } })
      if (res.code !== 200) return this.$message.error('获取歌曲评论失败')
      // this.$message.success('获取歌曲评论成功')
      this.comment.total = res.total
      this.comment.comments = res.comments
      this.comment.hotComments = res.hotComments
    },
    async getSimiSong () {
      const { data: res } = await this.$http.get('simi/song', { params: { id: this.$route.query.id } })
      if (res.code !== 200) return this.$message.error('获取相似歌曲失败')
      // this.$message.success('获取相似歌曲成功')
      this.simisong = res.songs
    },
    async getSongUrl () {
      const { data: res } = await this.$http.get('song/url', { params: { id: this.$route.query.id } })
      if (res.code !== 200) return this.$message.error('获取音乐失败')
      // this.$message.success('获取音乐成功')
      this.musicUrl = res.data[0].url
    },
    sendMusic () {
      bus.$emit('musicUrl', this.musicUrl)
    }
  },
  created () {
    this.getSong()
    this.getLyric()
    this.getComment()
    this.getSimiSong()
    this.getSongUrl()
  },
  filters: {
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
    $route: ['getSong', 'getLyric', 'getComment', 'getSimiSong', 'getSongUrl']
  }
}
</script>

<style lang="less" scoped>
.song {
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
        border: 31px solid #222;
        border-radius: 104px;
        box-shadow: 0 0 5px #000;
        box-sizing: border-box;
        background-color: #000;
        img {
          height: 140px;
          width: 140px;
          border-radius: 104px;
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
            margin-top: 4px;
          }
          .title h2 {
            font-size: 24px;
            font-weight: 400;
            color: #333;
            margin-left: 10px;
          }
        }
        p {
          color: #999;
          font-size: 12px;
          margin: 10px 0;
          span a {
            color: #0c73c2;
          }
        }
        .operation {
          display: flex;
          align-items: center;
          height: 30px;
          margin: 0 0 25px;
          .el-button i {
            color: #333;
            font-size: 12px;
          }
          .el-button:first-child i {
            color: #fff;
          }
        }
        .lyric {
          color: #333;
          font-size: 12px;
          margin: 13px 0 0;
        }
      }
    }
    p.contribution {
      height: 30px;
      line-height: 30px;
      color: #666;
      font-size: 12px;
      text-align: right;
      margin-top: 48px;
      a {
        color: #0c73c2;
        text-decoration: underline;
      }
    }
    .comment {
      margin-top: 40px;
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
    ul.songlist {
      margin: 0 0 25px;
      li {
        height: 32px;
        padding: 0 0 15px;
        .txt {
          height: 32px;
          font-size: 12px;
          .name {
            height: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            a {
              color: #333;
            }
            a:hover {
              text-decoration: underline;
            }
          }
          .artist {
            height: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            a {
              color: #999;
            }
            a:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
