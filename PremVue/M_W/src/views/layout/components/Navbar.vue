<template>
<div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" v-on:toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
        <div style="font-size: 13px;line-height: 20px;">
            <el-dropdown split-button type="text" size="mini" @command="onCommandDropdown">
                {{$store.state.user.entities[$store.state.user.entity-1]}}
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(ez,i) in $store.state.user.entities" :key="i" :command="i">{{ez}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button type="info" icon="el-icon-close" size="mini" @click="logout" :id="'logout_button'"></el-button>

        </div>
        <template v-if="device!=='mobile'">
            <error-log class="errLog-container right-menu-item hover-effect" />
        </template>

    </div>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import {
    M
} from "@/api/index";
export default {
    components: {
        Breadcrumb,
        Hamburger,
        ErrorLog
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'avatar',
            'device'
        ])
    },
    methods: {
        async onCommandDropdown(entity) {

            let data = await M('changeEntity^MW', {
                entity: entity + 1
            })
            if (data && data.data && data.data.result == 1) {

                this.$store
                    .dispatch('GetUserInfo')
                    .then(res => {
                        this.$store.dispatch('GenerateRoutes', res.data).then(() => {
                            this.$router.addRoutes(this.$store.getters.addRouters) //
                        })
                    })
                    .catch(() => {
                    })

                this.$notify({
                    title: 'Success',
                    message: 'Entity Changed',
                    type: 'success',
                    position: 'bottom-right'
                });
                this.$store.dispatch('SetCurrentEntity', entity + 1)
            } else {
                this.$alert(data.data.result, 'Entity Not Changed !', {
                    confirmButtonText: 'OK',
                });
            }
        },
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        async logout() {
            await this.$store.dispatch('LogOut')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
