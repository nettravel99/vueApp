<template>
  <q-page class="flex flex-center">
    <h1>{{title}}</h1>
    <h2>{{subtitle}}</h2>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  components: {
  },
  data () {
    return {
      title: 'Hello World From Vue',
      subtitle: '!'
    }
  },
  async mounted () {
    setTimeout(async () => {
      let title = await this.$M('getTitle^QUASAR', {
        subtitle: this.subtitle
      })
      if (title.data && title.data.title) {
        this.title = title.data.title
      }
    }, 3000)
  }
}
</script>
