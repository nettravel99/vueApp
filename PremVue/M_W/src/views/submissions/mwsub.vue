<template>
<div>
 
   <el-row type="flex" class="row-bg" justify="space-between"  style="height:30px;font-size:12;background-color:#545c64;color:#ffd04b;line-height:30px;">
  <el-col :span="12">
       <span style="font-size:13px;font-color:white;color:white;">{{$store.state.user.entities[$store.state.user.entity-1]}}<span v-if="$route.meta && $route.meta.FOLDER">&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;{{$route.meta && $route.meta.FOLDER ? $route.meta.FOLDER : ''}}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;{{$route.meta.NAME}}</span></span>
        <!--
           <el-dropdown split-button type="text" size="mini" @command="onCommandDropdown">
                <span style="font-size:13px;font-color:white;color:white;">{{$store.state.user.entities[$store.state.user.entity-1]}}</span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(ez,i) in $store.state.user.entities" :key="i" :command="i">{{ez}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            -->
  </el-col>
  <el-col :span="6"><div style="float:right;" >
          <div style="font-size: 13px;">
            <el-button type="info" icon="el-icon-close" size="mini" @click="logout"></el-button>
        </div>
      </div>
  </el-col>
</el-row> 
    
 <el-menu
  :default-active="activeIndex2"
  mode="horizontal"
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-submenu :index="''+i" v-for="(route,i) in routes" :key="route.path" :item="route" :base-path="route.path">
    <template slot="title">&nbsp;&nbsp;&nbsp;{{route.meta.title}}&nbsp;&nbsp;&nbsp;</template>
    
   
    <el-menu-item :index="'/lite-submissions/'+route.path+'/?noLayout=1'" v-if="!route.children" >
         {{route.meta.title}}
    </el-menu-item>
    
    <el-submenu :index="String(i)" v-if="route.children && route.children[0].children">
      <template slot="title" >{{route.name}}</template>
    <el-submenu v-for="(rcc,rcic) in route.children"  :key="i+'-'+rcic" :index="i+'-'+rcic">
        <template slot="title" >{{rcc.meta.title}}</template>
         <el-menu-item v-for="(rccc,rccic) in rcc.children"  :key="i+'-'+rcic + '-'+rccic+'-'+i" :index="'/lite-submissions/'+route.path+'/'+rcc.path +'/' +rccc.path + '/?noLayout=1'">
             {{rccc.meta.title}}
         </el-menu-item>
    </el-submenu>
    </el-submenu>



    <el-submenu :index="String(i)" v-if="route.children && !route.children[0].children">
      <template slot="title">{{route.name}}</template>
        <el-menu-item v-for="(rcc,rcic) in route.children"  v-show="rcc.path !== 'EISCP' && rcc.path !== 'WEB^TKVBEOBR'" :key="i+'-'+rcic" :index="'/lite-submissions/electronic-submissions-reports/'+rcc.path+'/?noLayout=1'">
         {{rcc.meta.title}}
        </el-menu-item>
    </el-submenu>




  </el-submenu>
</el-menu>
<router-view :key="key" />
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import {
    M
} from "@/api/index";
  export default {
      components:{
          faUser
      },
     async created(){
          if (this.$store.state.app.appLoading === true ){
          Loading.service().close();
        }
            let entity = this.getQueryVariable("ENTITY");
            if ( !isNaN(Number(entity)) && ( Number(entity) !== Number(this.$store.state.user.entity)) ){
                await this.onCommandDropdown(entity-1);
            } else {
                    let route = this.permission_routers.find(r => r.name === 'Submissions').children[0];
                    let lvl0 = '/lite-submissions/'
                    let lvl1 = route.path;
                    let lvl2 = route.children[0].path
                    let lvl3 = route.children[0].children[0].path
                    this.$router.push(lvl0 + lvl1 + '/' + lvl2 + '/' + lvl3  +'?noLayout=1')
            }
      },
    data() {
      return {
          activeIndex2: '1',
          key:this.getRoutekey()
      };
    },
      computed: {
    ...mapGetters([
      'permission_routers',
    ]),
    routes(){
        return this.permission_routers.find(r => r.name === 'lite-submissions').children
    },
      },
      async beforeDestroy(){
     this.$store.dispatch('LogOut')
            window.close();
      },
    methods: {
   getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
        },
     getRoutekey(){
              let prog = this.$route.meta.PROG || '';
              let folder = this.$route.meta.FOLDER || '';
              let ts = new Date().getTime();
                return `${prog}-${folder}-${ts}`
          },
     handleSelect(key) {
         this.key = this.getRoutekey();
        this.$router.push(key);
      },        async logout() {
            await this.$store.dispatch('LogOut')
            window.close();
        },
         async onCommandDropdown(entity) {
            let data = await M('changeEntity^MW', {
                entity: entity + 1
            })
            if (data && data.data && data.data.result == 1) {
                await this.$store
                    .dispatch('GetUserInfo')
                    .then(res => {
                        this.$store.dispatch('GenerateRoutes', res.data).then(() => {
                            this.$router.addRoutes(this.$store.getters.addRouters)
                        })
                    })
                    .catch(() => {
                    })
                this.$store.dispatch('SetCurrentEntity', entity + 1)
                this.key = this.getRoutekey();
         setTimeout(()=>{
                    let route = this.permission_routers.find(r => r.name === 'Submissions').children[0];
                    let lvl0 = '/lite-submissions/'
                    let lvl1 = route.path;
                    let lvl2 = route.children[0].path
                    let lvl3 = route.children[0].children[0].path
                    this.$router.push(lvl0 + lvl1 + '/' + lvl2 + '/' + lvl3  +'?noLayout=1')
          },50)
            } else {
                this.$alert(data.data.result, 'Entity Not Changed !', {
                    confirmButtonText: 'OK',
                });
            }
        },
    }
  }
</script>