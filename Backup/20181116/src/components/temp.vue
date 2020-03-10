<template>
    <v-container>
    <div>
    <p> Good Morning {{name}}</p>
    <button v-on:click="buttonClick">Button</button>

   <v-data-table
    :headers="headers"
    :items="result"
     style="height: 19px"
    class="elevation-1"
 
 
  >
   
         <template slot="items" slot-scope="props"  >
           <tr> 
            <td>{{props.index}}</td>
            <td>{{props.item.date}}</td>
            <td>{{props.item.entity}}</td>
            <td>{{props.item.entitysel}}</td>
            <td>{{props.item.errors}}</td>
            <td>{{props.item.form}}</td>
            <td>{{props.item.groupprov}}</td>
            <td>{{props.item.status}}</td>
            <td>{{props.item.time}}</td>
   
   <v-tooltip top>
      <v-icon
        class="mr-2"
        slot="activator"
        color="primary"
        dark
        @click="detail(props.index)"
        medium
      >pageview</v-icon>
      <span>Details</span>
    </v-tooltip>
        
    </tr>

       </template>
     
   </v-data-table>
    </div>
  </v-container>




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
  data: () => ({
    name: "George",
    headers: [
      {
        text: "Index",
        value: "index"
      },
      {
        text: "Date",
        align: "left",
        sortable: false,
        value: "date"
      },
      { text: "Entity", value: "entity" },
      { text: "Entity Sel", value: "entitysel" },
      { text: "Errors", value: "errors" },
      { text: "Form", value: "form" },
      { text: "Group Prov", value: "groupprov" },
      { text: "Status", value: "status" },
      { text: "Time", value: "time" }
    ],
    credentials: {
      user: "john"
    },
    result: [],
    items: [
      {
        message: "Foo"
      },
      {
        message: "Bar"
      }
    ]
  }),
  mounted() {
    console.log("Mounted called");
    axios
      .post("http://127.0.0.1:5099/A^GJGAXIOS", this.credentials)
      .then(response => {
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
    buttonClick(xxx) {
      alert("Button click", xxx);
    },
    detail: function(xxx) {
      this.name = xxx;
    }
  }
};
</script>
