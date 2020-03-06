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
       <div v-for='(x,key) in formdata' :key=key>

         data = {{x}}
         idx = {{key}}
  </div>
    </div>
  </div>
      </div>
    </div>

    </q-page-container>
  </q-layout>
</template>
<script>
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      denseSw: true,
      firstname: null,
      typeofscan: null,
      modality: null,
      formdata: {},
      temp: {},
      exportdata: {},
      fields: [
        {
          label: 'First',
          data: 'data[1]',
          filledSw: true,
          key: 'first',
          color: 'red',
          denseSw: false,
          placeholder: 'place1xxxxx',
          type: 'text'
        },
        {
          label: 'Second',
          data: 'data[2]',
          filledSw: false,
          key: 'second',
          color: 'blue',
          densSw: false,
          placeholder: 'places2yyyyy',
          type: 'text'
        }
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
      console.log('database called')
      const data = await this.$M('count^TKAAforms', this.exportData)

      console.log('Call count^ChartG:', data)

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
    }
  }
}
</script>
