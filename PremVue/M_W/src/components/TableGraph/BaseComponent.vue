<template>
    <el-card :body-style="{ padding: '0px' }"  :style="{width:width * 18.8 * (appScaleX / 100) + 'px',height:height * 18.8 * (appScaleY / 100) + 'px'}" >
       <slot></slot>
    </el-card>
</template>
<script>
export default {
  name: "BaseComponent",
  props: ["width", "height"],
  data() {
    return {};
  },
  computed: {
    appScaleX: {
      get() {
        return this.$store.state.app.appScaleX;
      }
    },
    appScaleY: {
      get() {
        return this.$store.state.app.appScaleY;
      }
    }
  }
};
</script>
