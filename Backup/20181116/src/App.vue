<template>
  <v-app>

<v-toolbar dense>
    <v-toolbar-side-icon></v-toolbar-side-icon>
   <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn  flat v-on:click="vueHome()" >Vue Home</v-btn>
      <v-btn  flat v-on:click="PreparedFiles()" >Prepared Files</v-btn>
      <v-btn  flat v-on:click="Premier()" >Premier</v-btn>
        <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>


   
    <keep-alive>
      
    <component  :is="displayComponent">
     </component>
    </keep-alive>







  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import PreparedFiles from "./components/PreparedFiles";
import Premier from "./components/Premier";
import Entity from "./components/Entity";
export default {
  name: "App",
  components: {
    PreparedFiles,
    HelloWorld,
    Premier,
    Entity
  },
  data() {
    return {
      displayComponent: "HelloWorld"
      //
    };
  },
  methods: {
    vueHome() {
      this.displayComponent = "HelloWorld";
    },
    PreparedFiles() {
      this.displayComponent = "PreparedFiles";
    },
    Premier() {
      this.displayComponent = "Entity";
    }
  }
};
</script>
