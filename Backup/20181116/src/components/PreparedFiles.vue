
<template>


    <v-container fluid grid-list-xl>


      <v-layout row wrap>


        <v-flex flex >


          <v-card class="box1 clearfix" >


            <v-card-text>  
     <v-data-table
    :headers="headers"
    :items="result"
     style="height: 19px"
    class="elevation-1"
    hide-actions
 
 
  >
   
         <template slot="items" slot-scope="props"  >
           <tr   @click="detail(props.index)"> 
            <td>{{props.index}}</td>
            <td>{{props.item.date}}</td>
            <td>{{props.item.entity}}</td>
            <td>{{props.item.entitysel}}</td>
            <td>{{props.item.errors}}</td>
            <td>{{props.item.form}}</td>
            <td>{{props.item.groupprov}}</td>
            <td>{{props.item.status}}</td>
            <td>{{props.item.time}}</td>
   
  
      <v-icon
        class="mr-2"
        slot="activator"
        color="primary"
        dark
        @click="detail(props.index)"
        medium
      >pageview</v-icon>
    
 
        
    </tr>

       </template>
     
   </v-data-table></v-card-text>


          </v-card>


        </v-flex>


               <v-layout row justify-space-between>    


         <v-flex flex >


          <v-card class="box2">


            <v-card-text>   <table>

     <tr> <td>File Name</td>
            <td>{{fileInfo.billingdate}}</td>      
    </tr>

     <tr> <td>Submitter ID</td>
            <td>{{fileInfo.submitterid}}</td>      
    </tr>
    
     <tr> <td>Sender ID</td>
            <td>{{fileInfo.senderid}}</td>      
    </tr>
    
     <tr> <td>File ID</td>
            <td>{{fileInfo.fileid}}</td>      
    </tr>
    
     <tr> <td>File Size</td>
            <td>{{fileInfo.filesize}}</td>      
    </tr>
    
     <tr> <td>Billing Date</td>
            <td>{{fileInfo.billingdate}}</td>      
    </tr>
    
     <tr> <td>Submit with Errors</td>
            <td>{{fileInfo.submitwitherror}}</td>      
    </tr>
         <tr> <td>Total Claims</td>
            <td>{{fileInfo.totalclaims}}</td>      
    </tr>
    
         <tr> <td>Total Amount</td>
            <td>{{fileInfo.totalamt}}</td>      
    </tr>
    
         <tr> <td>Number of Segments</td>
            <td>{{fileInfo.nosegment}}</td>      
    </tr>
        
         <tr> <td>Type of Claims</td>
            <td>{{fileInfo.typeclaims}}</td>      
    </tr>
    
   </table></v-card-text>


          </v-card>


        </v-flex>        


        


        <v-flex flex >


          <v-card class="box2 "  >


            <v-card-text>  <table>

     <tr> <td>Created</td>
            <td>{{ackInfo.created}}</td>      
    </tr>

     <tr> <td>ITS</td>
            <td>{{ackInfo.ITS}}</td>      
    </tr>
    
     <tr> <td>Number</td>
            <td>{{ackInfo.NO}}</td>      
    </tr>
    
     <tr> <td>File</td>
            <td>{{ackInfo.file}}</td>      
    </tr>
    
     <tr> <td>Sent by Operator</td>
            <td>{{ackInfo.operator}}</td>      
    </tr>
         <tr> <td>Sent</td>
            <td>{{ackInfo.sent}}</td>      
    </tr>
    
     <tr> <td>Acknowledgement</td>
            <td>{{ackInfo.result}}</td>      
    </tr>
    

         <tr> <td>ID</td>
            <td>{{ackInfo.ID}}</td>      
    </tr>

   </table>

</v-card-text>


          </v-card>


        </v-flex>


           </v-layout>


      </v-layout>


    </v-container>


</template>


<style scope>
.box1 {
  width: 100%;

  height: 500px;
}

.box2 {
  width: 100%;

  height: 300px;
}

table.v-table tbody td,
table.v-table tbody th {
  height: 20px;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 1px;
}

tr {
  line-height: 16px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.container {
  width: 100%;

  height: 600px;

  margin: auto;

  padding: 2px;
}

.clearfix {
  overflow: auto;
}

.clearfixNew::after {
  content: "";

  clear: both;

  display: table;
}

.clearfix::after {
  content: "";

  clear: both;

  display: table;
}

.one {
  width: 100%;

  height: 100%;

  background: rgb(6, 99, 240);
}

.two {
  width: 50%;

  background: rgb(112, 231, 152);

  float: left;

  padding: 2px;
}

.three {
  width: 49%;

  background: rgb(112, 231, 152);

  float: right;

  padding: 2px;
}
</style>

<script>
import axios from "axios";
export default {
  data: () => ({
    name: "George",
    FORM:
      '<template> <v-form v-model="valid"><v-text-field v-model="name" :rules="nameRules"       :counter="10"       label="Name"       required     ></v-text-field>     <v-text-field       v-model="email"       :rules="emailRules"       label="E-mail"       required     ></v-text-field>   </v-form> </template>',

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
      { text: "Time", value: "time" },
      { text: "Detail", value: "detail" }
    ],
    credentials: {
      user: "john"
    },
    fileInfo: [],
    ackInfo: {},
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
      .post(
        "http://127.0.0.1:5099/A^GJGAXIOS?P1=LIST&MODULE=EISCP",
        this.credentials
      )
      .then(response => {
        this.result = response.data.data;
        console.log("Results from Mounted: ", this.result);
        if (0 in this.result) {
          this.ackInfo = JSON.parse(this.result[0].ACK);
          this.fileInfo = JSON.parse(this.result[0].FILEINFO);

          // checks if 0 is an index of result
          //   axios
          //     .post(
          //       "http://127.0.0.1:5099/A^GJGAXIOS?P1=DET&MODULE=EISCP&P2=" +
          //         this.result[0].DATETIMENO,
          //       this.credentials
          //     )
          //     .then(response => {
          //       this.fileInfo = response.data.data;
          //       console.log("Results from file details: ", this.fileInfo);
          //     });
        }
      });
  },

  methods: {
    api() {
      axios
        .post(
          "http://127.0.0.1:5099/A^GJGAXIOS?P1=LIST&MODULE=EISCP",
          this.credentials
        )
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
    detail: function(idx) {
      console.log("before: ", this.result[idx].ACK);
      this.ackInfo = JSON.parse(this.result[idx].ACK);
      this.fileInfo = JSON.parse(this.result[idx].FILEINFO);

      //   axios
      //     .post(
      //       "http://127.0.0.1:5099/A^GJGAXIOS?P1=DET&MODULE=EISCP&P2=" +
      //         this.result[xxx].DATETIMENO,
      //       this.credentials
      //     )
      //     .then(response => {
      //       this.fileInfo = response.data.data;
      //       console.log("Results from file details: ", this.fileInfo);
      //     });
    }
  }
};
</script>




