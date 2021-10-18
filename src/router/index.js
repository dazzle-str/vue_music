import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/Home.vue'
import Discover from '@/components/Discover.vue'
import Recommend from '@/components/Recommend.vue'
import TopList from '@/components/TopList.vue'
import PlayList from '@/components/PlayList.vue'
import PlayListDetail from '@/components/PlayListDetail.vue'
import Song from '@/components/Song.vue'
import My from '@/components/My.vue'

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: Home,
    children: [
      {
        path: '',
        component: Discover,
        children: [
          { path: '', component: Recommend },
          { path: 'discover', component: Recommend },
          { path: 'discover/toplist', component: TopList },
          { path: 'discover/playlist', component: PlayList },
          { path: '/playlist', component: PlayListDetail },
          { path: '/song', component: Song }
        ]
      },
      { path: 'my', component: My }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
