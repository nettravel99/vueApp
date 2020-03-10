<template>
  <v-container fluid grid-list-lg  >
<v-layout>

<v-flex xs3 red>



</v-flex>

<v-flex xs3 red>



</v-flex>

<v-flex xs3 red>



</v-flex><v-flex xs3 red>



</v-flex>
</v-layout>




<v-layout row justify-space-around>
  
  
  <v-flex xs4 class="pl=0 my-0" >
      </v-flex>

     <v-flex xs1 class="pl=0 my-4" >
       <v-card flat>
           <v-text>
          
          <h3>Entity</h3> 
        
      </v-text>
       </v-card>
    </v-flex>


<v-flex xs3 class="pl=0 my-0">
   <v-card-actions>
 <v-radio-group row v-model="EntitySel" class="py-3 my-0"  >
      <v-radio 
      
        class="small-icons"
         off_icon = "fas fa-ban"
         key="All"
         label="All"
         value="ALL"
         
      ></v-radio>
         <v-radio
         class="small-icons" 
         key="Inc"
        label="Include"
        value="I"
      ></v-radio>

       <v-radio  
           class="small-icons"      
         key="Excl"
         label="Exclude"
         value="E"
      ></v-radio>
    </v-radio-group>
    </v-card-actions>
</v-flex>


      <v-flex xs6 class="pl=0 my-0">
             <v-card-actions >
            <v-select v-bind:items="states" v-model="a1" label="" autocomplete multiple chips></v-select>
               </v-card-actions>
     </v-flex>
       <v-flex xs4 class="pl=0 my-0" >
      </v-flex>
     
     </v-layout>





<!-- <v-card>
    <v-container
      fluid
      grid-list-xl
    >
      <v-layout
        align-center
        wrap
      >
        <v-flex xs12 sm6>
          <v-select
            v-model="value"
            :items="states"
            attach
            chips
            label="Chips"
            multiple
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            v-model="value"
            :items="states"
            box
            chips
            label="Chips"
            multiple
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            v-model="value"
            :items="states"
            chips
            label="Chips"
            multiple
            outline
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            v-model="value"
            :items="states"
            chips
            label="Chips"
            multiple
            solo
          ></v-select>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card> -->


  <!-- <v-layout row wrap align-center>
      <v-flex xs12 sm6>
        <v-subheader v-text="'Multiple with persistent hint'"></v-subheader>
      </v-flex>
      <v-flex xs12 sm6>
        <v-select
          :items="states"
          v-model="e6"
          :menu-props="{ maxHeight: '400' }"
          label="Select"
          multiple
          hint="Pick your favorite states"
          persistent-hint
        ></v-select>
      </v-flex> -->

      <!-- <v-flex xs12 sm6>
        <v-subheader v-text="'Multiple (Chips) with persistent hint'"></v-subheader>
      </v-flex>

      <v-flex xs12 sm6>
        <v-select
          :items="states"
          v-model="e7"
          label="Select"
          multiple
          chips
          hint="What are the target regions"
          persistent-hint
        ></v-select>
      </v-flex>
    </v-layout> -->



  </v-container>

  
</template>


<style scope>
.small-icons i.material-icons,
.small-icons i.v-icon {
  font-size: 22px;
  color: #1d09d3 !important;
  caret-color: #82b1ff !important;
  height: 5px;
}

.link {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
}

.card1 {
  color: red;
  height: 0px;
}

.small-icons .v-label {
  font-size: 14px;
  color: black !important;
}
.divx {
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  padding-left: 30px;
  border: 1px solid #4caf50;
}

.inline {
  display: inline-block;
  border: 1px solid red;
  margin: 5px;
}
</style>;



<script>
import axios from "axios";
export default {
  data: () => ({
    name: "EntitySel",
    states: [
      "Alabama",
      "Alaska",
      "American Samoa",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "District of Columbia",
      "Federated States of Micronesia",
      "Florida",
      "Georgia",
      "Guam",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Marshall Islands",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Northern Mariana Islands",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Palau",
      "Pennsylvania",
      "Puerto Rico",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virgin Island",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming"
    ]
  })
};
</script>
