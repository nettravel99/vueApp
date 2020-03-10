<template>
  
          <iframe src="http://127.0.0.1:5099" width=100% height=100% name="iframe_a"></iframe>

<!-- <p><a href="http:127.0.0.1:5099" target="iframe_a">W3Schools.com</a></p> -->




     </template>
            <style scoped>
table.v-table tbody td,
table.v-table tbody th {
  height: 20px;
}
</style>
<script>
import axios from "axios";
export default {
  name: "PremierComponent",

  data: () => ({
    premierLink: '<a href="http://127.0.0.1:5099">John Doe</a>',
    mounted: false
  }),
  mounted() {
    console.log("Mounted called");
    axios.get("http://127.0.0.1:5099/", this.credentials).then(response => {
      this.result = response.data.data;
      console.log("Results from Mounted: ", this.result);
    });
  },

  methods: {
    api() {
      axios
        .post("http://127.0.0.1:5099/A^GJGAXIOS", this.credentials)
        .then(response => {
          this.result = response.data.data;
          console.log("Results: ", this.result);
        });
    },
    // async api() {     const result = await
    // axios.post("http://127.0.0.1:5099/A^GJGAXIOS", this.credentials); this.result
    // = result.data.data;     console.log("Results: ", this.result); },
    buttonClick(xxx) {},
    detail: function(xxx) {
      this.name = xxx;
    }
  }
};
</script>
