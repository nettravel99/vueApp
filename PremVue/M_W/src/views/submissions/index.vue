<template>
     <runReport :PROG="$route.meta.PROG" :noSchBTN="true" :key="$route.meta.path"> </runReport>
</template>
<script>
import runReport from '@/views/reports/index';
export default {
  components:{
    runReport
  },
  mounted(){
    //console.log(this.$route)
  },
  data() {
    return {}
  }
}

</script>
