<template>
  <el-container>
    <el-header>
      <div class="top">
        <div class="container">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="/">发现音乐</el-menu-item>
            <el-menu-item index="/my">我的音乐</el-menu-item>
            <el-menu-item index="/friend">朋友</el-menu-item>
            <el-menu-item index="/store/product">商城</el-menu-item>
            <el-menu-item index="/st/musician">音乐人</el-menu-item>
            <el-menu-item index="/download">下载客户端</el-menu-item>
            <el-input placeholder="音乐/视频/电台/用户" prefix-icon="el-icon-search" v-model="input">
            </el-input>
            <el-button round>创作者中心</el-button>
            <el-dropdown class="head" v-if="loginStatus">
              <div class="el-dropdown-link">
                <img :src="profile.avatarUrl" alt="" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-switch-button" @click.native="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <a href="javascript:;" @click="dialogVisible = true" v-else>登录</a>
          </el-menu>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view @login="dialogVisible=true"></router-view>
    </el-main>
    <audio :src="musicUrl" controls autoplay></audio>
    <el-dialog title="手机号登录" :visible.sync="dialogVisible" width="30%" @close="resetLoginForm">
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="100px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import bus from './eventBus.js'

export default {
  data () {
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('请输入正确的手机号'))
    }
    return {
      activeIndex: '/',
      input: '',
      musicUrl: '',
      dialogVisible: false,
      loginForm: {
        phone: '',
        password: ''
      },
      loginFormRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '请输入正确的登录密码', trigger: 'blur' }
        ]
      },
      account: {}, // 账号信息
      profile: {}, // 用户详情
      loginStatus: 0
    }
  },
  methods: {
    handleSelect (key) {
      switch (key) {
        case '/':
          this.$router.push('/')
          break
        case '/my':
          this.$router.push('/my')
          break
      }
    },
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.get('login/cellphone', { params: this.loginForm }).catch(err => err)
        if (res.code !== 200) return this.$message.error(res.msg)
        // this.$message.success('登录成功')
        this.account = res.account
        window.sessionStorage.setItem('token', res.token)
        this.dialogVisible = false
        this.refreshLogin()
        this.getUserDetail()
      })
    },
    async refreshLogin () {
      const { data: res } = await this.$http.get('login/refresh')
      if (res.code === 200) this.loginStatus = 1
    },
    async getLoginStatus () {
      const { data: res } = await this.$http.get('login/status')
      if (!res.account) this.loginStatus = 0
    },
    async getUserDetail () {
      const { data: res } = await this.$http.get('user/detail', {
        params: { uid: this.account.id }
      })
      if (res.code !== 200) return this.$message.error('获取用户详情失败')
      // this.$message.success('获取用户详情成功')
      this.profile = res.profile
    },
    logout () {
      this.$http.get('logout')
      this.getLoginStatus()
    },
    getPath () {
      this.activeIndex = this.$route.path
    }
  },
  created () {
    bus.$on('musicUrl', val => {
      this.musicUrl = val
    })
    window.sessionStorage.getItem('token')
  },
  mounted () {
    this.getPath()
  },
  watch: {
    $route: 'getPath'
  }
}
</script>

<style lang="less" scoped>
.el-header {
  padding: 0;
}

.el-main {
  padding: 0;
  margin: 0 0 50px;
}

.top {
  background-color: #545c64;
  height: 100%;
  .container {
    width: 984px;
    margin: 0 auto;
    line-height: 60px;
  }
  .el-menu.el-menu--horizontal {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: none;
    width: 100%;
    height: 100%;
    a {
      width: 30px;
      text-align: center;
      font-size: 12px;
      color: #ccc;
      margin-left: 20px;
    }
    .el-input {
      width: 158px;
      margin-left: 66px;
      /deep/ .el-input__inner {
        height: 30px;
        border-radius: 20px;
        font-size: 12px;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
    .el-button.is-round {
      width: 90px;
      height: 30px;
      font-size: 12px;
      margin-left: 10px;
      padding: 9px 15px;
      background-color: transparent;
      color: #ccc;
      border: 1px solid #ccc;
    }
    .el-button.is-round:hover {
      border: 1px solid #fff;
      color: #fff;
    }
    .head {
      margin-left: 20px;
      .el-dropdown-link {
        width: 30px;
        height: 30px;
        line-height: 30px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 15px;
        }
      }
    }
  }
}

audio {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
}
</style>
