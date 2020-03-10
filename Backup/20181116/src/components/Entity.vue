<template>
  <v-container fluid px-0>
   <component  :is="EntitySel">
     </component>


    {{Text}}

  </v-container>
</template>

<script>
import EntitySel from "./selections/EntitySel";

export default {
    name: "Entity",
    components : {
        EntitySel
    },
  data: () => ({
    name: "Entity",
    Text: "This is a test",
    EntitySel:"EntitySel"
  })
};
</script>