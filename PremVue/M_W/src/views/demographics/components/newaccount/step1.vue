<template>
  <div>
    <h2>Basic Info</h2>
    <h5>Please fill the required information below</h5>
    <el-row>
      <el-form ref="form" :inline="true" :model="form" label-width="265px">
        <el-form-item label="Name" size="mini" required prop="name">
          <el-input v-model="form.name" placeholder="Lastname, Firstname" clearable style="width:220px" />
        </el-form-item>
        <el-form-item label="DOB" size="mini" required prop="dob">
          <el-date-picker v-model="form.dob" format="MM/dd/yyyy" type="date" style="width:220px" />
        </el-form-item>
        <el-form-item label="Sex" size="mini" required prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="'M'">Male&nbsp;</el-radio>
            <el-radio :label="'F'">Female</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Insurance" size="mini" prop="ins">
          <el-input v-model="form.ins" placeholder="Insurance" clearable style="width:190px" />
          <generalLookup v-model="form.ins" lookup="IN" title="Insurance" style="float:right" :nested="true" />
        </el-form-item>
        <el-form-item label="Policy" size="mini" prop="policy">
          <el-input v-model="form.policy" placeholder="Policy" clearable style="width:230px" />
        </el-form-item>
      </el-form>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <div v-if="isDubCheck"><span style="color:red;font-size:14px"><b>Duplicates Found </b></span><br><small>Doubleclick on row to navigate to existing account</small></div>
        <hot-table
          :id="'hotTableComponentDupCheck'"
          :key="'hotTableComponent'"
          ref="hotTableComponent"
          :after-on-cell-mouse-down="afterOnCellMouseDown"
          :col-widths="colWidths"
          :data="dupdata"
          :col-headers="dupheaders"
          :read-only="true"
          :height="300"
          license-key="non-commercial-and-evaluation"
          :current-row-class-name="'currentRowDupAcct'"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Handsontable from 'handsontable'
import {
  HotTable
} from '@handsontable/vue'
import {
  M
} from '@/api/index'
import generalLookup from '@/components/lookups/index'
import _ from 'lodash'
export default {
  components: {
    generalLookup,
    HotTable
  },
  data() {
    const _vm = this
    return {
      form: {},
      isDubCheck: false,
      debouncedDupCheck: null,
      dupdata: [],
      dupheaders: [],
      colWidths: [],
      afterOnCellMouseDown: function(event, coords, td) {
        var now = new Date().getTime()
        if (!(td.lastClick && now - td.lastClick < 400)) {
          td.lastClick = now
          return
        }
        var data = this.getDataAtRow(coords.row)
        _vm.isDubCheck = false
        _vm.$store.dispatch('addSelectedAccount', {
          account: data[1]
        })
        /*
                    _vm.$emit('newaccount', {
                        account: data[1]
                    })
                    */
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
        this.dupheaders.map(() => out.push(columRenderer))
        return out
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(f) {
        this.debouncedDupCheck(f)
      } }
  },
  created() {
    this.debouncedDupCheck = _.debounce(this.DupCheck, 300)
  },
  methods: {
    async DupCheck(f) {
      if (f.name && f.dob && !this.isDubCheck) {
        const data = await M('checkDUP^MWD', {
          name: f.name,
          dob: f.dob
        })
        if (data && data.data && data.data.dups) {
          const dups = data.data.dups
          this.dupdata = dups
          this.dupheaders = data.data.headers
          this.colWidths = data.data.colWidths
          if (dups) {
            this.isDubCheck = true
          } else {
            this.dupdata = []
            this.dupheaders = []
            this.colWidths = []
            this.isDubCheck = false
          }
        }
      }
    }
  }
}
</script>
<style>
    @import url("../../../../components/Handsontable/handsontable.css");
    .currentRowDupAcct {
        border-bottom: 1pt solid #4B89FF !important;
        border-top: 1pt solid #4B89FF !important;
    }
    #hotTableComponentDupCheck.handsontable th,
    #hotTableComponentDupCheck.handsontable td {
        color: #000000;
        font-size: 12px !important;
        height: 12px;
        empty-cells: show;
        line-height: 14px;
        padding: 0 2px 0 4px;
    }
</style>
