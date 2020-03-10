<template>
  <span>
    <el-button type="primary" icon="el-icon-edit" circle @click="dialogFilter = true" />
    <el-dialog title="Account Inquiry Colors" :visible.sync="dialogFilter">
      <el-form :model="colors">
        <el-form-item size="mini" label="Charges">
          <el-color-picker v-model="colors.charges" />
        </el-form-item>

        <el-form-item size="mini" label="Payments">
          <el-color-picker v-model="colors.payments" />
        </el-form-item>

        <el-form-item size="mini" label="Messages">
          <el-color-picker v-model="colors.messages" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFilter = false">Cancel</el-button>
        <el-button type="primary" @click="saveColor">Save</el-button>
        <el-button type="primary" @click="previewColor">Preview</el-button>
        <el-button type="primary" @click="resetColor">Reset</el-button>
        <el-button type="primary" @click="dialogFilter = false">Close</el-button>

      </span>
    </el-dialog>
  </span>
</template>
<script>
import { M } from '@/api/index'
export default {
  name: 'AIColor',
  props: ['value'],
  data() {
    return {
      dialogFilter: false,
      formFilter: {},
      checkLinkedAccounts: '',
      colors: {
        charges: '#FFFFB4',
        payments: '#C0C0C0',
        messages: '#FFFFFF'
      },
      preview: false
    }
  },
  async mounted() {
    const data = await M('getAIColors^MWAI')
    if (data && data.data && data.data.colors) {
      this.colors = data.data.colors
    }
  },
  methods: {
    async setValue() {
      let data

      data = await M('saveAIColors^MWAI', {
        colors: this.colors
      })
      if (data && data.data && data.data.status && data.data.status === 'saved') {
        this.$message({
          type: 'info',
          message: `Account Inquiry Colors Saved Successfully`
        })
      }
      this.$emit('input', this.colors)
    },
    async saveColor() {
      await this.setValue()
      this.$emit('reload')
      this.dialogFilter = false
    },

    async previewColor() {
      this.$emit('input', {})

      this.$emit('input', this.colors)
    },
    resetColor() {
      this.colors = {
        charges: '#FFFFB4',
        payments: '#C0C0C0',
        messages: '#FFFFFF'
      }
    }
  }
}
</script>
