<template>
  <span>
    <el-button type="primary" icon="el-icon-check" circle @click="dialogFilter = true" />
    <el-dialog title="Linked Charges" :visible.sync="dialogFilter">
      <el-form :model="formFilter">
        <el-form-item size="mini" label="Transactions">
          <el-radio-group v-model="formFilter.type">
            <el-radio :label="0">By Check Number</el-radio>
            <br>
            <el-radio :label="1">By Claim Number</el-radio>
            <br>
            <el-radio :label="2">By Roster</el-radio>
            <br>
            <el-radio :label="3">By Encounter</el-radio>
            <br>
            <el-radio :label="4">By Task</el-radio>
            <br>
          </el-radio-group>
        </el-form-item>
        <br>
        <el-form-item size="mini">
          <el-input v-model="formFilter.search" placeholder="Search" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFilter = false">Cancel</el-button>
        <el-button type="primary" @click="getValue">Run</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>
import { M } from '@/api/index'
export default {
  props: ['value'],
  data() {
    return {
      dialogFilter: false,
      formFilter: {
      },
      checkLinkedAccounts: ''
    }
  },
  methods: {
    async getValue() {
      const data = await M('checkLinkedAccounts^MWAI', this.formFilter)
      this.checkLinkedAccounts = data.data.resp
      if (this.checkLinkedAccounts[0] == 0) {
        this.$alert(this.checkLinkedAccounts.split(':')[1], 'Account Inquiry', {
          confirmButtonText: 'OK' })
        return
      }
      this.$emit('input', this.formFilter)
      this.$emit('reload')
      this.dialogFilter = false
      this.formFilter = {}
      setTimeout(() => {
        this.$emit('input', this.formFilter)
      }, 500)
    }
  }
}
</script>
