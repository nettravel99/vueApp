<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
html {
  line-height: 1;
}

.navbar {
    height: 25px !important;
    overflow: hidden;
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.tags-view-container .tags-view-wrapper .tags-view-item{
    height: 20px !important;
    line-height: 20px !important;
}

.navbar .hamburger-container {
    line-height: 25px !important;
}

.hasTagsView .fixed-header + .app-main{
    padding-top: 57px!important;
}

.hasTagsView .app-main {
    min-height: calc(100vh - 57px)!important;
}

.sidebar-container > .el-menu--collapse.el-menu{
  width:25px !important;
}

.el-menu-item, .el-submenu__title {
    height: 37px !important;
    line-height: 37px !important;
}
.el-submenu .el-menu-item {
  height: 35px!important;
  line-height: 35px!important;

}
.el-menu-item {
  font-size: 12px!important;
  padding-left: 20px !important;
}
.el-submenu__title {
  font-size: 13px!important;
  padding-left: 10px !important;
  height: 35px!important;
  line-height: 35px!important;
}
#app.hideSidebar.sidebar-container {
    width: 20px !important;
}
#app.main-container.hasTagsView{
   margin-left: 20px !important;
}

#app.main-container {
    min-height: 100%;
    -webkit-transition: margin-left .28s;
    transition: margin-left .28s;
    margin-left: 170px !important;
    position: relative;
}

.hideSidebar .fixed-header {
    width: calc(100% - 35px) !important;
}
.tags-view-container .tags-view-wrapper .tags-view-item.active {
    background-color: #4796FC !important;
    border-color: #4796FC!important;
}

  .text {
    font-size: 12px !important;
    font-weight: 700 !important;
    padding: 0px !important;
  }
  .markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 0px;
  }
  .pagination_extra {
    width: 980px;
    height: 20px;
    margin: 0 auto;
  }
  @media (max-width: 767px) {
    .markdown-body {
      padding: 15px;
    }
    .pagination_extra {
      margin: 0 auto;
    }
    .report-body {
      padding: 7px;
    }
  }
  .el-card__body {
    padding: 7px !important;
  }
  .el-card {
    border: 0px solid #ebeef5 !important;;
  }
  .app-container {
    padding: 0px !important;
  }
  .el-tabs__header {
    padding: 0 !important;;
    margin: 0 0 0 !important;;
  }
  .el-tabs__item {
    padding: 0 10px;
    height: 25px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 25px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
  }
  html,
  body {
    height: 100% !important;;
    width: 100% !important;;
    margin: 0 !important;;
  }
  .h_iframe iframe {
    width: 100%;
    height: 100%;
    min-height: 87vh !important;
  }
  .h_iframe {
    height: 100%;
    width: 100%;
  }
.report-form {
  min-width: 200px;
  max-width: 980px;
}

.el-form-item__label {
  white-space: nowrap;
  text-align: right;
  float: left;
  font-size: 12px !important;
  line-height: 20px;
  /* padding: 0 12px 0 0; */
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 2px !important;;
}

.el-radio + .el-radio {
  margin-left: 0px !important;;
}

.el-radio__label {
  font-size: 12px !important;;
  padding-left: 5px !important;
}

</style>
