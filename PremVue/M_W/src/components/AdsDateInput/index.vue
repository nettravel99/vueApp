<template>
  <component :is="component.component" :ref="'adsinput'" v-model="internalValue" v-bind="$props" :value="internalValue" :type="component.type" @blur.native="handleInput" @input.native="handleInput" @change="handleInput" />
</template>
<script>
import moment from 'moment'
export default {
  props: ['value', 'size', 'format', 'valueFormat', 'outputType'],
  data() {
    return {
      internalValue: this.value,
      type: (this.value === '' || this.validDate(this.value)) || this.outputType ==='date' ? 'date' : 'text'
    }
  },
  computed: {
    component() {
      if (this.type === 'date') {
        return {
          component: 'ElDatePicker',
          type: 'date'
        }
      } else if (this.type === 'text') {
        return {
          component: 'el-input',
          type: 'text'
        }
      }
    }
  },
  mounted(){
    let value = this.internalValue;
     if (this.type === 'date') {
          if (value &&value.substring(0, 2) === 'T+' && value.split('T+')[1]) {
            value = moment(new Date()).add(value.split('T+')[1], 'day').format('L')
          } else if (value &&value.substring(0, 2) === 'T-' && value.split('T-')[1]) {
            value = moment(new Date()).subtract(value.split('T-')[1], 'day').format('L')
          } else if (value && value === 'T') {
            value = moment(new Date()).format('L')
          }
          }
    this.internalValue = value;
  },
  watch: {
    value(v) {
      const e = {}
      e.target = {}
      e.target.value = v
      this.handleInput(e)
    },
    internalValue(v) {
      const e = {}
      e.target = {}
      e.target.value = v
      this.handleInput(e)
      this.value = this.internalValue
    },
    outputType(v) {
      this.type = v
      const e = {}
      e.target = {}
      e.target.value = this.internalValue
      this.handleInput(e)
      this.$nextTick(() => {
        this.value = this.internalValue
        this.$emit('input', this.internalValue)
        this.$emit('change', this.internalValue)
      })
    }
  },
  methods: {
    handleInput(e) {
      if (!e || !e.target) return
      let value = e.target.value
      if (/^(T)$|^(T)[-+]$|^T?[-+]*[0-9]*[0-9]$/.test(value)) {
        if (this.type === 'date') {
          if (value && value.substring(0, 2) === 'T+' && value.split('T+')[1]) {
            value = moment(new Date()).add(value.split('T+')[1], 'day').format('L')
          } else if ( value && value.substring(0, 2) === 'T-' && value.split('T-')[1]) {
            value = moment(new Date()).subtract(value.split('T-')[1], 'day').format('L')
          } else if ( value && value === 'T') {
            value = moment(new Date()).format('L')
          }

          this.internalValue = value
          // e.target.value = value;
        }
        // this.internalValue = value;
        // e.target.value = value;
        // e.target.focus();
      } else if (this.validDate(value) || this.outputType==='date') {
        this.type = 'date'
      } else {
        this.type = 'text'
        this.internalValue = ''; 
        this.value='';
        }
      this.$emit('input', this.internalValue)
      this.$emit('change', this.internalValue)
    },
    validDate(value) {
      return moment(value, 'L', true).isValid()
    }
  }
}
</script>

