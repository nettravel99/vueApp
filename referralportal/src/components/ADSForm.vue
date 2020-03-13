// ADSForm component

<template>
    <div>
          <div>This is the ADSForm</div>
     <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >

          <q-input
      :dense=field.denseSw
      v-for="field in fields"
      :key=field.key
      :label=field.label
      clear-icon="clock"
      :color=field.color
      v-model=formdata[field.key]
      :placeholder=field.placeholder
      :type=field.type
      >
      </q-input>

<div>{{fields}}</div><div>
        <q-btn label="Submit Form" type="submit" color="primary"/>
        <q-btn label="Reset Form" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
  </q-form>
   Title = {{title.a}}
    Title b = {{title.b}}
    </div>
</template>

<script>
export default {
  name: 'ADSForm',
  props: ['title', 'fields'],

  data () {
    return {
      formdata: {}

    }
  },
  methods: {

    async onSubmit () {
      alert('submit called')
      // var json = JSON.stringify(this.formdata)
      const data = await this.$M('saveForm^TKAAforms', this.formdata)
      alert(data)
    },
    onReset () {
      alert('Reset called')
      var temp = Object.keys(this.formdata)
      for (var i = 0; i < temp.length; i++) {
        console.log('form data loop: ', this.formdata[temp[i]])
        this.formdata[temp[i]] = null
      }
      console.log('form data', this.formdata)
    } }
}
</script>
