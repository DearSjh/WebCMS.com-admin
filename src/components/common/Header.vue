<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">{{$t("home.title")}}</div>
        <div class="header-right">
            <div class="header-user-con">
                <marquee onMouseOver="this.start()" style="font-size:18px;padding-bottom:4px;width:100px;" scrollamount="1">{{getlev}}</marquee>
                <div style="font-size:18px;padding-bottom:4px;width:60px;">{{getlev}}</div>
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!--<div class="btn-bell">-->
                    <!--<el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">-->
                        <!--<router-link to="/tabs">-->
                            <!--<i class="el-icon-bell"></i>-->
                        <!--</router-link>-->
                    <!--</el-tooltip>-->
                    <!--<span class="btn-bell-badge" v-if="message"></span>-->
                <!--</div>-->
                <!-- 用户头像 -->
                <div class="user-avator"><img :src="languageImg"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>

                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="language in languageBarData" :key="language.value" divided>
                          <div style="display: flex" @click="languageCookie(language)">
                            <div>
                              <img :src="'//cms.com'+language.pic" alt="" style="width: 40px;padding-right: 10px">
                            </div>
                            <div>{{language.name}}</div>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from './bus';
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'admin',
                lev:'王者级',
                message: 2,

                languageBarData:[],

                img:'static/img/0.jpg',
            }
        },
        computed:{
            username(){
                let username = this.$common.getSessionStorage('langname');
                return username ? username : this.name;
            },
            languageImg(){
              let languageImg = this.$common.getSessionStorage('languageImg');
              return languageImg ? languageImg : this.img;
            },

            getlev(){

                let levList = this.$common.getSessionStorage('lev',true);
                let lev='';
                if(levList){
                    for(var i=0;i<levList.length;i++){
                        lev+=levList[i].roleName;
                    }
                }

                return lev ? lev : this.lev;
            }
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                  this.$confirm('确认退出吗?', '提示', {
                    type: 'warning'
                  }).then(() => {
                    this.$common.removeSessionStorage('token');
                    this.$router.push('/login');
                  }).catch(() => {

                  });
                }
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },

            //语言栏
            languageBar () {
              this.$ajax({
                method: "post",
                url: "//cms.com/admin/webInfo/languageValue",
                data: {}
              }).then(res => {
                this.languageBarData = res.data.data.data
              });
            },
            //语言保存cookie
            languageCookie(item){
              console.log(item)
              if (item !== undefined){
                this.$common.setSessionStorage('langname',item.name)
                this.$common.setSessionStorage('lang',item.value)
                this.$common.setSessionStorage('languageImg','//cms.com'+item.pic)
                document.cookie="lang="+item.value;
                window.location.reload()
              } else {
                this.$common.setSessionStorage('langname','中文（简体）')
                this.$common.setSessionStorage('lang',1)
                this.$common.setSessionStorage('languageImg','//cms.com/assets/img/lang/china.gif')
                document.cookie="lang=1;path=/";
              }
            },
        },
        created() {
          window.languageBar = this.languageBar
        },
        mounted(){
            if(document.body.clientWidth < 1366){
                this.collapseChage();
            }

            this.languageBar ()
            this.languageCookie()
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
