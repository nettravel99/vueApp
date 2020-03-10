<template>
  <span>
    <el-button type="primary" icon="el-icon-search" circle @click="dialogFilter = true" />
    <el-dialog title="Filter Account Inquiry" :visible.sync="dialogFilter">
      <el-form :model="formFilter">
        <el-form-item label="Transactions">
          <el-radio-group v-model="formFilter.transactions">
            <el-radio :label="0">Charges</el-radio><br>
            <el-radio :label="1">Payments</el-radio><br>
            <el-radio :label="2">Charges with Related Payments</el-radio><br>
            <el-radio :label="3">Payments with Related Charges</el-radio><br>
            <el-radio :label="4">Charges and Payments in Date Order</el-radio><br>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Order">
          <el-radio-group v-model="formFilter.order">
            <el-radio :label="0">Service Date Ascending</el-radio><br>
            <el-radio :label="1">Service Date Descending</el-radio><br>
            <el-radio :label="2">Posting Date Ascending</el-radio><br>
            <el-radio :label="3">Posting Date Descending</el-radio><br>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Display">
          <el-checkbox-group v-model="formFilter.display">
            <el-checkbox :label="0">All Entities</el-checkbox><br>
            <el-checkbox :label="1">All Patients</el-checkbox><br>
            <el-checkbox :label="2">Include Zero Balances</el-checkbox><br>
            <el-checkbox :label="3">Message Transactions</el-checkbox><br>
            <el-checkbox :label="4">Sub Totals</el-checkbox><br>
            <el-checkbox :label="5">Totals</el-checkbox><br>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Group By Case" />
        <el-checkbox v-model="formFilter.gbCase">Group By Case</el-checkbox>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFilter = false">Cancel</el-button>
        <el-button type="primary" @click="getValue">Run</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>
export default {
  props: ['value'],
  data() {
    return {
      dialogFilter: false,
      formFilter: {
        display: [2, 3],
        transactions: 0,
        order: 2
      },
      formString: ''
    }
  },
  methods: {
    getValue() {
      const str = '0`0`0:`0:`0:  /  /    :`0:`0:`0:G`0`0`0`0``0``0`0'.split('`')
      str[0] = this.formFilter.transactions
      str[1] = this.formFilter.order
      if (this.formFilter.display.includes(0)) str[8] = '1' // ALL ENT
      if (this.formFilter.display.includes(1)) str[16] = '1'// ALL PAT
      if (this.formFilter.display.includes(2)) str[9] = '1'// INCLUDE ZERO
      if (this.formFilter.display.includes(3)) str[10] = '1'// MESSAGES
      if (this.formFilter.display.includes(4)) str[11] = '1'// SUB TOTAL
      if (this.formFilter.display.includes(5)) str[13] = '1'// TOTALS
      if (this.formFilter.gbCase) str[15] = '1'
      this.formString = ';' + str.join('`')
      this.$emit('input', this.formString)
      this.$emit('reload')
      this.dialogFilter = false
    }
  }
}
</script>
