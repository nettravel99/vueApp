<template>
  <el-row v-if="account">
    <el-col :span="24">
      <svg-icon v-if="!imgData" :icon-class="icon" class="svg-icon-dm" />
      <img v-if="imgData" :class="{ full: fullWidthImage }" :src="imgData" @click="fullWidthImage = !fullWidthImage">
    </el-col>
  </el-row>
</template>
<script>
import { M } from '@/api/index'
export default {
  components: {

  },
  props: ['account', 'age', 'sex'],
  data() {
    return {
      imgData: '',
      fullWidthImage: false
    }
  },
  computed: {
    icon: {
      get() {
        if (this.sex === 'M' && this.age.indexOf('<') == -1 && this.age > 18) return 'man'
        if (this.sex === 'F' && this.age.indexOf('<') == -1 && this.age > 18) return 'woman'
        if (this.sex === 'M' && this.age.indexOf('<') == -1 && this.age <= 18 && this.age > 1) return 'teen-boy'
        if (this.sex === 'F' && this.age.indexOf('<') == -1 && this.age <= 18 && this.age > 1) return 'teen-girl'
        if (this.age.indexOf('<') > -1) return 'baby'
        return 'man'
      }
    }
  },
  watch: {
    account: {
      immediate: true,
      async handler() {
        this.imgData = await this.getImage()
      }
    }
  },

  methods: {
    async getImage() {
      if (!this.account) return ''
      else {
        const data = await M('getAccountPic^MWD', {
          account: this.account
        })
        if (data && data.data && data.data.image) {
          return data.data.image
        }
      }
    }
  }
}
</script>
<style>
.svg-icon-dm {
   padding-top: 5px;
   padding-bottom: 5px;
   padding-left: 5px;
   padding-right: 5px;
  width: 140px !important;
  height: 140px !important;
  fill: 'currentColor';
  overflow: hidden;
}

.fullx {
  width: 420px;
  height: auto;
  z-index: 2147483647 !important;
border-radius: 2px;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.5);
  transition: width 1s, height 1s;
  z-index: 2147483647 !important;

}

img {
  width: 140px;
  height: auto;

}
img:hoverx {
  cursor: pointer;
}

</style>
