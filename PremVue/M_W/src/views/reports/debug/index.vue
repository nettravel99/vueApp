
<template>
<el-button :type="type" @click="dialog = true">{{title}}
<el-dialog title="Debug" :visible.sync="dialog" :width="'90%'" :center="false" >
<slot></slot>
</el-dialog>
</el-button>
</template>
<script>
  export default {
      props:['title','type'],
    data() {
      return {
        dialog: false,
      };
    }
  };
</script>