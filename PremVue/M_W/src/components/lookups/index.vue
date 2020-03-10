<template>
  <div>
    <el-button type="primary" size="mini" @click="clickLookup">?</el-button>
    <el-dialog :title="title + ' Codes Lookup'" :visible.sync="dialogFormVisible" append-to-body>
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
            <el-form-item size="mini">
              <el-checkbox v-model="form.deleted">Incl. Deleted</el-checkbox>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <hot-table
            :id="'hotTableComponent'"
            :key="'hotTableComponent'"
            ref="hotTableComponent"
            :data="data"
            :col-headers="headers"
            :columns="tableRenderer"
            :read-only="true"
            :height="300"
            :hidden-columns="hiddenColumns"
            :col-widths="colWidths"
            license-key="non-commercial-and-evaluation"
            :after-selection="afterSelection"
            :after-on-cell-mouse-down="afterOnCellMouseDown"
            :current-row-class-name="currentRowClassName"
          />
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!valid" @click="confirmLookup">OK</el-button>
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import { M } from '@/api/index'
export default {
  components: {
    HotTable
  },
  props: ['value', 'lookup', 'title', 'select'],
  data() {
    const _vm = this
    return {
      dnested: false,
      valid: false,
      lkvalue: '',
      currentValue: '',
      dialogFormVisible: false,
      currentRowClassName: 'currentRow',
      form: {
        type: '1',
        search: '',
        contains: false,
        deleted: false
      },
      data: [],
      headers: [],
      si: this.select || 0,
      hiddenColumns: {
        columns: [0]
      },
      colWidths: [],
      afterSelection: async function(r) {
        var data = this.getDataAtRow(r)
        if (_vm.si === 0) {
          _vm.lkvalue = data[_vm.si]
        } else {
          let value = data[_vm.si] + ''
          value = value.substring(0, value.length - 3)
          _vm.lkvalue = value
        }
        await _vm.checkValid()
      },
      afterOnCellMouseDown: async function(event, coords, td) {
        var now = new Date().getTime()

        if (!(td.lastClick && now - td.lastClick < 400)) {
          td.lastClick = now
          return
        }
        var data = this.getDataAtRow(coords.row)
        if (_vm.si === 0) {
          _vm.lkvalue = data[_vm.si] + ''
        } else {
          let value = data[_vm.si] + ''
          value = value.substring(0, value.length - 3)
          _vm.lkvalue = value
        }

        _vm.confirmLookup()
      }
    }
  },
  computed: {
    tableRenderer: {
      get() {
        const _vm = this
        const columRenderer = {
          renderer: function(
            instance,
            td,
            row,
            col,
            prop,
            value,
            cellProperties
          ) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            // $(td).addClass("wordWrapClass");
            const metatext = td.innerHTML
            td.setAttribute('colSpan', 1)
            const text = metatext.substring(0, metatext.length - 3)
            const meta = metatext.substring(metatext.length - 3, metatext.length)
            td.className += (td.className ? ' ' : '') + 'wordWrapClass'
            if (meta && meta[2] === '2') td.align = 'right'
            if (meta && meta[2] === '1') td.align = 'center'
            if (meta && meta[2] === '0') td.align = 'left'

            if (meta && meta[0] === 'e') td.style.background = '#FFFFB4'
            if (meta && meta[0] === 'K') td.style.background = '#0000C3'
            if (meta && meta[0] === 'X') td.style.background = '#C0C0C0'
            if (meta && meta[0] === 'f') td.style.background = '#B4E1FF'
            if (meta && meta[0] === 'P') td.style.background = '#002054'
            if (meta && meta[0] === 'H') td.style.background = '#FF8D59'
            if (meta && meta[0] === 'i') td.style.background = '#E1FFFF'
            if (meta && meta[0] === 'g') td.style.background = '#FFE1E1'
            if (meta && meta[0] === 'h') td.style.background = '#E1FFE1'
            if (meta && meta[1] === 'Z') td.style.color = 'black'
            if (meta && meta[1] === 'U') td.style.color = 'black'
            if (meta && meta[1] === 'R') td.style.color = 'red'
            if (meta && meta[1] === 'W') td.style.color = 'white'
            if (meta && meta[1] === 'A') td.style.color = 'green'
            if (meta && meta[1] === 'K') td.style.color = '#0000C3'
            if (meta && meta[1] === 'M') td.style.color = '#8d4e85'
            if (meta && meta[0] === 'K' && text.length > 0) {
              td.setAttribute('colSpan', _vm.aiHeaders.length)
              td.align = 'center'
            }

            // if ((meta && meta[0] === "H") && (meta && meta[1] === "W") ) meta[1] = "Z"
            if (meta === 'HW0' && text.length > 0) {
              td.setAttribute('colSpan', _vm.aiHeaders.length)
              td.align = 'center'
            }
            if ((meta === 'fU0' || meta === 'PW0') && text.length > 0) {
              td.setAttribute('colSpan', _vm.aiHeaders.length)
            }

            if (
              _vm.aiColors &&
              _vm.aiColors.charges &&
              meta &&
              meta[0] === 'e'
            ) {
              td.style.background = _vm.aiColors.charges
            }

            if (
              _vm.aiColors &&
              _vm.aiColors.messages &&
              meta &&
              meta[0] === 'W'
            ) {
              td.style.background = _vm.aiColors.messages
            }

            if (
              _vm.aiColors &&
              _vm.aiColors.payments &&
              meta &&
              meta[0] === 'X'
            ) {
              td.style.background = _vm.aiColors.payments
            }
            /*
            if (meta === 'WK0' && text.length > 10){
              td.setAttribute("colSpan", 3);
            }
            */

            td.title = text + ' ' + meta
            td.innerHTML = meta
            td.innerHTML = text

            return cellProperties
          }
        }
        const out = []
        this.headers.map(() => out.push(columRenderer))
        return out
      }
    }
  },
  watch: {
    value(val) {
      this.lkvalue = val
    }
  },
  async mounted() {
    this.si = this.select || 0
    this.dnested = this.nested

    this.lkvalue = this.value
    await this.initLookup()
  },
  methods: {
    async checkValid() {
      const data = await M('valid^MWLK', {
        type: this.lookup,
        code: this.lkvalue
      })
      this.valid = data.data.valid
    },
    async clickLookup() {
      this.lkvalue = this.value
      await this.initLookup()
      this.dialogFormVisible = true
      setTimeout(async() => {
        await this.handleLookup()
      }, 0)
    },
    async initLookup() {
      const data = await M('lookup^MWLK', {
        lookup: this.lookup
      })
      if (data && data.data && data.data.lookup) {
        this.data = data.data.lookup
      }
      if (data && data.data && data.data.headers) {
        this.headers = data.data.headers
      }
      if (data && data.data && data.data.colWidths) {
        this.colWidths = data.data.colWidths
      }
    },

    async handleLookup() {
      const data = await M('lookup^MWLK', {
        form: {
          type: this.form.type,
          contains: this.form.contains,
          search: this.lkvalue,
          deleted: this.form.deleted
        },
        lookup: this.lookup
      })
      if (data && data.data && data.data.lookup) {
        this.data = data.data.lookup
      }
      if (data && data.data && data.data.headers) {
        this.headers = data.data.headers
      }
      if (data && data.data && data.data.colWidths) {
        this.colWidths = data.data.colWidths
      }
      await this.checkValid()
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
  border-bottom: 1pt solid #4B89FF !important;
  border-top: 1pt solid #4B89FF !important;
}
</style>
