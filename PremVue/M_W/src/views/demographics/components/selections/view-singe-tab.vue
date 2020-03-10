<template>

  <table>
    <tr v-for="(line,index) in scase.selections" :key="'tabIndex'+index">
      <td style="text-align:left;width:150px;color:blue;font-size:12px">{{ line.frame.split("|")[0].split('^')[0] }}</td>
      <td style="font-size:12px">{{ line.value }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    scase: Object
  },
  data() {
    return {
    }
  }
}
</script>
