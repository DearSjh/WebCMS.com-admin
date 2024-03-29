import ConvertRoutes from './convertRoutes'
import router from '../../router'

/**
 * 动态添加路由
 * author:qlx
 */
const addRoutes = {
  state: {
    rootRoute:[],
    routeParam:[]//这里必须持久化参数,重新生成路由,因为里边的require方法没法持久化
  },
  mutations: {
    add_Routes(state, routeParam) {

      let routeList = [];

      let routeHideList=[];

      //添加默认路由,新用户登陆可以显示首页
      routeList.push( {
            name: 'index',
            path: '/index',
            component: resolve => require(['@/components/index.vue'], resolve),
            meta: {
              title: ''
            }
      });

      // 将后台的路由数据components转化成组件
      ConvertRoutes(routeList, routeHideList,routeParam);

      var rootRoute= [{
        path: '/',
        component: resolve => require(['@/components/Common/Home.vue'], resolve),
        meta: { title: '自述文件' },
        children:routeList
      }];

      //保存路由参数到store中
      state.routeParam=routeParam;
      state.rootRoute=rootRoute;
      //动态添加路由
      router.addRoutes(rootRoute)
    },
    add_Routes_Fresh(state){
      this.commit('add_Routes', state.routeParam)
    }
  },
  actions: {
    add_Routes({commit}, routeParam) {
      commit('add_Routes', routeParam)
    },
    add_Routes_Fresh({commit}) {
      commit('add_Routes_Fresh')
    }
  }
}
export default addRoutes
