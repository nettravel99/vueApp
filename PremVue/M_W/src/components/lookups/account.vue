<template>
  <div>
    <el-button type="primary" size="mini" @click="clickLookup">?</el-button>
    <el-dialog :title="'Patient Lookup'" :visible.sync="dialogFormVisible" append-to-body>
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
                <el-radio :label="'&ACCT#'">Acct</el-radio>
                <el-radio :label="'&PAT NAME'">Name</el-radio>
                <el-radio :label="'&GUAR'">Guar</el-radio>
                <el-radio :label="'&DOB'">DOB</el-radio>
                <el-radio :label="'P&OLICY#'">Policy</el-radio>
                <el-radio :label="'&SS#'">SS</el-radio>
                <el-radio :label="'&TRANS#'">Trans</el-radio>
                <el-radio :label="'&MR#'">MR</el-radio>
                <el-radio :label="'P&HONE#'">Phone</el-radio>
                <el-radio :label="'&CLAIM#'">Claim</el-radio>
                <el-radio :label="'&ENC'">Enc</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <hot-table
            :id="'hotTableComponentAccount'"
            :key="'hotTableComponentAccount'"
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
            :before-on-cell-mouse-down="beforeOnCellMouseDown"
            :current-row-class-name="currentRowClassName"
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
      currentRowClassName: 'currentRow',
      lkvalue: this.value,
      dialogFormVisible: false,
      form: {
        type: '&PAT NAME'
      },
      data: [],
      hiddenColumns: {
        columns: [0]
      },
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
      },
      beforeOnCellMouseDown: function(e, coords) {
        var row = coords.row
        var col = coords.col

        if (row === 0 && col === 0) {
          e.stopImmediatePropagation()
        }
      }
    }
  },
  computed: {
    colWidths: {
      get() {
        if (
          this.form.type === '&TRANS#' ||
          this.form.type === '&ENC' ||
          this.form.type === 'P&OLICY#'
        ) {
          return [40, 205, 60, 85, 60, 60, 110, 100, 100, 35, 60, 60, 25]
        } else {
          return [40, 205, 60, 85, 60, 110, 100, 100, 35, 60, 60, 25]
        }
      }
    },
    headers: {
      get() {
        if (this.form.type === '&TRANS#') {
          return [
            'id',
            'Patient Name',
            'Account#',
            'SS#',
            'MR#',
            'TRANS',
            'DOB',
            'Telephone#',
            'Cell#',
            'AR',
            'Balance',
            'Pat Balance'
          ]
        } else if (this.form.type === '&ENC') {
          return [
            'id',
            'Patient Name',
            'Account#',
            'SS#',
            'MR#',
            'Encounter',
            'DOB',
            'Telephone#',
            'Cell#',
            'AR',
            'Balance',
            'Pat Balance'
          ]
        } else if (this.form.type === 'P&OLICY#') {
          return [
            'id',
            'Patient Name',
            'Account#',
            'SS#',
            'MR#',
            'Policy',
            'DOB',
            'Telephone#',
            'Cell#',
            'AR',
            'Balance',
            'Pat Balance'
          ]
        } else {
          return [
            'id',
            'Patient Name',
            'Account#',
            'SS#',
            'MR#',
            'DOB',
            'Telephone#',
            'Cell#',
            'AR',
            'Balance',
            'Pat Balance'
          ]
        }
      }
    }
  },
  watch: {
    lkvalue(newval) {
      if (newval && isNaN(newval[0]) && this.form.type === '&ACCT#') {
        this.form.type = '&PAT NAME'
      } else if (
        newval &&
        !isNaN(newval[0]) &&
        this.form.type === '&PAT NAME'
      ) {
        this.form.type = '&ACCT#'
      }
    },
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
      setTimeout(async() => {
        await this.handleLookup()
      }, 0)
      this.dialogFormVisible = true
    },
    async initLookup() {
      const data = await M('account^MWLK')
      if (data && data.data && data.data.lookup) {
        this.data = data.data.lookup
      }
      this.initTable()
    },

    async handleLookup() {
      const data = await M('account^MWLK', {
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
@import url("../Handsontable/handsontable.css");
.currentRow {
  color:back;
  border-bottom: 1pt solid #4B89FF !important;
  border-top: 1pt solid #4B89FF !important;
}
#hotTableComponentAccount > .handsontable .htDimmed {
    color: #000000 !important;
}
</style>
