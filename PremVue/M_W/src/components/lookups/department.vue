<template>
  <div>
    <el-button type="primary" size="mini" @click="clickLookup">?</el-button>
    <el-dialog :title="'Department Codes Lookup'" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="form">
            <el-form-item label="Look For" size="mini">
              <el-input v-model="lkvalue" placeholder clearable @input="handleLookup" />
            </el-form-item>
            <el-form-item size="mini">
              <el-button type="primary" size="mini" @click="handleLookup">Search</el-button>
            </el-form-item>
            <el-form-item size="mini">
              <el-radio-group v-model="form.type">
                <el-radio :label="'1'">Code</el-radio>
                <el-radio :label="'2'">Description</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item size="mini">
              <el-checkbox v-model="form.contains">Contains</el-checkbox>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <hot-table
            :id="'hotTableComponent'"
            :key="'hotTableComponent' + new Date().getTime()"
            ref="hotTableComponent"
            :data="data"
            :col-headers="headers"
            :read-only="true"
            :height="300"
            :hidden-columns="hiddenColumns"
            :col-widths="colWidths"
            license-key="non-commercial-and-evaluation"
            :after-selection="afterSelection"
            :after-on-cell-mouse-down="afterOnCellMouseDown"
            :current-row-class-name="'currentRow'"
          />
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmLookup">OK</el-button>
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import { M } from '@/api/index'
export default {
  components: {
    HotTable
  },
  props: ['value'],
  data() {
    const _vm = this
    return {
      lkvalue: '',
      currentValue: '',
      dialogFormVisible: false,
      form: {
        type: '1',
        search: '',
        contains: false
      },
      data: [],
      headers: ['id', 'Code', 'Description'],
      hiddenColumns: {
        columns: [0]
      },
      colWidths: [40, 170, 730],
      afterSelection: function(r) {
        var data = this.getDataAtRow(r)
        _vm.lkvalue = data[0]
      },
      afterOnCellMouseDown: async function(event, coords, td) {
        var now = new Date().getTime()

        if (!(td.lastClick && now - td.lastClick < 400)) {
          td.lastClick = now
          return
        }
        var data = this.getDataAtRow(coords.row)
        _vm.lkvalue = data[0]
        _vm.confirmLookup()
      }
    }
  },
  watch: {
    value(val) {
      this.lkvalue = val
    }
  },
  async mounted() {
    this.lkvalue = this.value
    await this.initLookup()
  },
  methods: {
    initTable() {
      if (
        this.$refs.hotTableComponent &&
        this.$refs.hotTableComponent.hotInstance
      ) {
        this.$refs.hotTableComponent.hotInstance.deselectCell(0, 0)
      }
    },
    async clickLookup() {
      this.lkvalue = this.value
      await this.initLookup()
      await this.handleLookup()
      this.dialogFormVisible = true
    },
    async initLookup() {
      const data = await M('department^MWLK')
      if (data && data.data && data.data.lookup) {
        this.data = data.data.lookup
      }
      this.initTable()
    },

    async handleLookup() {
      const data = await M('department^MWLK', {
        form: {
          type: this.form.type,
          contains: this.form.contains,
          search: this.lkvalue
        }
      })
      if (data && data.data && data.data.lookup) {
        this.data = data.data.lookup
      }
    },
    confirmLookup() {
      this.$emit('input', this.lkvalue)
      this.$emit('change', this.lkvalue)
      this.dialogFormVisible = false
    }
  }
}
</script>

<style>
@import url("../handsontable/handsontable.css");
</style>
