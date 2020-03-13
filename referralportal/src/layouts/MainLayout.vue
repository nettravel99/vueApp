<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">ADS Referral Portal</q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
    <div class="row">
      <div class="col">
       <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">

      <!-- equivalent -->
      <!-- <q-input :dense=denseSw color="orange" filled v-model="typeofscan"  label="Type Of Scan">
        <template v-if="typeofscan" v-slot:append>
             <q-icon name="cancel" @click.stop="typeofscan = null" class="cursor-pointer" />
        </template>
      </q-input> -->

      <!-- clear-icon -->
      <!-- <q-input
        :dense=denseSw
        clearable
        clear-icon="close"
        filled
        color="red"
        v-model="text"
        label = "Location"
      /> -->
        <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <!-- <q-input
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
      </q-input> -->
       <!-- <div v-for='(x,key) in formdata' :key=key>

         data = {{x}}
         idx = {{key}}
  </div> -->
  <div v-for="form in forms" :key=form.key>

{{form[0].name}}  </div>
  <ADSForm v-for="form in forms" :key=form.key title="LIST OF FORMS" :fields='form'>
 </ADSForm>

  <!-- <ADSForm :title='xTitle' :fields='fieldsXX'></ADSForm>
  <ADSForm></ADSForm>
    <ADSForm :title='xTitle' :fields='fieldsXX'></ADSForm>
    <ADSForm :title='xTitle' :fields='fields'></ADSForm> -->
       <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
  </q-form>
    </div>
  </div>
      </div>
    </div>

    </q-page-container>
  </q-layout>
</template>
<script>
import EssentialLink from 'components/EssentialLink'
import ADSForm from 'components/ADSForm'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    ADSForm
  },

  data () {
    return {
      xTitle: { 'a': 'aa', 'b': 'bb' },
      leftDrawerOpen: false,
      denseSw: true,
      firstname: null,
      typeofscan: null,
      modality: null,
      formdata: {},
      temp: {},
      exportData: { view: 'REFPORTAL' },
      fieldsXX: [
        {
          label: 'First',
          data: 'data[1]',
          filledSw: true,
          key: 'first',
          color: 'brown',
          denseSw: false,
          placeholder: 'place1xxxxx',
          type: 'text'
        },
        {
          label: 'Second',
          data: 'data[2]',
          filledSw: false,
          key: 'second',
          color: 'black',
          densSw: false,
          placeholder: 'places2yyyyy',
          type: 'text'
        }
      ],
      forms: [],
      formdetails: [],
      fields: [
        // {
        //   label: 'First',
        //   data: 'data[1]',
        //   filledSw: true,
        //   key: 'first',
        //   color: 'red',
        //   denseSw: false,
        //   placeholder: 'place1xxxxx',
        //   type: 'text'
        // },
        // {
        //   label: 'Second',
        //   data: 'data[2]',
        //   filledSw: false,
        //   key: 'second',
        //   color: 'blue',
        //   densSw: false,
        //   placeholder: 'places2yyyyy',
        //   type: 'text'
        // }
      ],
      essentialLinks: [
        {
          title: 'Scheduling',
          caption: '',
          icon: 'schedule',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Medical Records',
          caption: '',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Emergency Access',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'About',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        }
      ]
    }
  },

  async created () {
    // Gets the number of charts

    // this.exportData.dashname = this.$route.query.dashname // window.location.pathname;

    await this.getCount()

    // await this.register()
  },

  methods: {
    async getCount () {
      console.log('database called with dataX ', this.exportData)
      const data = await this.$M('getForm^TKAAforms', this.exportData)

      console.log('Call getForm^TKAAforms:', data)
      this.fields = { ...data.data.result.FORMS.FIRSTFORM }
      this.forms = { ...data.data.result.FORMS }
      this.formdetails = { ...data.data.result.FORMDETAILS }
      console.log('data.results', data.data.result)
      console.log('Forms', this.forms)
      console.log('FormDetails', this.formdetails)
      // this.temp = data.result.dashboards

      // this.NumberOfCharts = data.result.count
      // this.charttable = data.result.charttable

    // for (var i = 0; i < data.result.count; i++) {
    //   this.chartSize[i] = 'col-md-' + data.result.size[i]
    //   if (data.result.html !== undefined) {
    //     this.htmlSize[i] = data.result.html.size[i]
    //   }
    //   if (data.result.header !== undefined) {
    //     this.headerClass[i] = data.result.header[i]
    //   }
    // }
    },
    async onSubmit () {
      alert('submit called')
      // var json = JSON.stringify(this.formdata)
      const data = await this.$M('saveForm^TKAAforms', this.formdata)
      alert(data)
      this.fieldsXX[0].label = 'New label name'
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
