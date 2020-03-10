<template>
<div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened && $route.query.noLayout != 1" class="drawer-bg" @click="handleClickOutside"  />
    <sidebar class="sidebar-container" v-if="$route.query.noLayout != 1"/>
    <div :class="{hasTagsView:needTagsView}" class="main-container" v-if="$route.query.noLayout != 1">
        <div :class="{'fixed-header':fixedHeader}" >
            <navbar />
            <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel v-if="showSettings">
            <settings />
        </right-panel>
    </div>

     

<div v-if="$route.query.noLayout == 1">
<el-row type="flex" class="row-bg" justify="space-between"  style="height:30px;background-color:#545c64;color:#ffd04b;line-height:30px;">
  <!--<el-col :span="6"><AdsLogo style="widht:25px;height:25px" /></el-col>-->
  <el-col :span="6">{{$store.state.user.entities[$store.state.user.entity-1]}}</el-col>
  <el-col :span="6"><div style="float:right;" ><span>{{$store.state.user.name}} </span> <font-awesome-icon :icon="icon" /></div></el-col>
</el-row>
  <app-main />
</div>

</div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import AdsLogo from '@/components/Adslogo/index';
import { faUser } from '@fortawesome/free-solid-svg-icons'

import {
    AppMain,
    Navbar,
    Settings,
    Sidebar,
    TagsView
} from './components'
import ResizeMixin from './mixin/ResizeHandler'
import {
    mapState
} from 'vuex'

export default {
    name: 'Layout',
    components: {
        AppMain,
        Navbar,
        RightPanel,
        Settings,
        Sidebar,
        TagsView,
        AdsLogo,
    },
    mixins: [ResizeMixin],
    created() {
        if (this.getQueryVariable('noLayout')) {
            this.$route.query.noLayout = this.getQueryVariable('noLayout')
        }
    },
    computed: {
        ...mapState({
            sidebar: state => state.app.sidebar,
            device: state => state.app.device,
            showSettings: state => state.settings.showSettings,
            needTagsView: state => state.settings.tagsView,
            fixedHeader: state => state.settings.fixedHeader
        }),
        icon(){
            return faUser
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            }
        }
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
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', {
                withoutAnimation: false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px)
}

.mobile .fixed-header {
    width: 100%;
}
</style>
