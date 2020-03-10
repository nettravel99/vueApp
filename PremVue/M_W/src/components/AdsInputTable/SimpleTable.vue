<template>
<div>
    <el-button size="mini" type="text" @click="Dvalue = true">{{row[col.prop]}}</el-button>
    <el-dialog
  :title="col.label"
  :visible.sync="Dvalue"
  width="30%"
  center>
  <span><pre>{{row['Type'+col.prop+'D'].join('\n')}}</pre></span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="Dvalue = false">Ok</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
    props:['row','col'],
    data(){
        return {
            Dvalue :false
        }
    }
}
</script>

<style>

</style>
