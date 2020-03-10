<template>
  <div>
    <el-row style="padding-top:10px;" :gutter="12">
      <el-col :span="5">
        <el-card class="box-card" style="padding:5px">
          <div slot="header">
            <span>Patient</span><span style="float:right">
              <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit" /></span>
          </div>
          <el-form v-if="patientEdit" ref="form" :inline="true" :model="form" label-width="50px">
            <el-form-item label="Name" size="mini" required prop="name">
              <el-input v-model="form.name" placeholder="Lastname, Firstname" clearable style="width:200px" />
            </el-form-item>
            <el-form-item label="DOB" size="mini" required prop="dob">
              <el-date-picker v-model="form.dob" format="MM/dd/yyyy" type="date" style="width:200px" />
            </el-form-item>
            <el-form-item label="Rel." size="mini" prop="relationship">

              <el-select v-model="form.relationship" placeholder="Relationship" style="width:200px">
                <el-option label="Self" value="S" />
                <el-option label="Spouse" value="P" />
                <el-option label="Dependent" value="D" />
                <el-option label="Child" value="C" />
                <el-option label="Other" value="O" />
              </el-select>
            </el-form-item>
            <el-form-item label="SSN" size="mini" prop="ssn">
              <el-input v-model="form.ssn" v-mask="'###-##-####'" placeholder="SSN" clearable style="width:200px" />
            </el-form-item>
            <el-form-item label="Add1" size="mini" prop="ad1">
              <el-input v-model="form.ad1" placeholder="Address1" clearable style="width:200px" />
            </el-form-item>
            <el-form-item label="Add2" size="mini" prop="ad2">
              <el-input v-model="form.ad2" placeholder="Address2" clearable style="width:200px" />
            </el-form-item>
            <el-form-item label="Zip" size="mini" prop="zip">
              <el-input v-model="form.zip" v-mask="'#####'" clearable placeholder="ZipCode" style="width:160px" @change="handleZip" />
              <generalLookup v-model="form.zip" lookup="ZP" title="Zip Code" style="float:right" :nested="true" @change="handleZip" />
            </el-form-item>
            <el-form-item label="City,St" size="mini" prop="citystate">
              <el-input v-model="form.citystate" placeholder="City, State" clearable style="width:160px" />
              <generalLookup v-model="form.citystate" :select="2" lookup="ZP" title="City" style="float:right" :nested="true" />
            </el-form-item>
            <el-form-item label="Sex" size="mini" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :label="'M'">Male&nbsp;</el-radio>
                <el-radio :label="'F'">Female</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Cell#" size="mini" prop="cell">
              <el-input v-model="form.cell" v-mask="'(###)-###-####'" placeholder="Cellphone" clearable style="width:125px" />
              <el-select v-model="form.preferred" placeholder="Preferred Contact Method" style="width:70px">
                <el-option label="Home" value="home" />
                <el-option label="Cell" value="cell" />
                <el-option label="work" value="work" />
                <el-option label="Email" value="email" />
              </el-select>
            </el-form-item>
            <el-form-item label="Home#" size="mini" prop="home">
              <el-input v-model="form.home" v-mask="'(###)-###-####'" placeholder="Home Tel" clearable style="width:200px" />
            </el-form-item>
            <el-form-item label="Work#" size="mini" prop="work">
              <el-input v-model="form.work" v-mask="'(###)-###-####'" placeholder="Work Tel" clearable style="width:120px" />
              <el-checkbox v-model="form.nosms">NoText</el-checkbox>
            </el-form-item>
            <el-form-item label="Emrg.#" size="mini" prop="emergency">
              <el-input v-model="form.emergency" v-mask="'(###)-###-####'" placeholder="Emergency Tel" clearable style="width:200px" />
            </el-form-item>
            <el-form-item label="Email" size="mini" prop="email">
              <el-input v-model="form.email" placeholder="Email" clearable style="width:200px" />
            </el-form-item>
            <el-form-item label="MR#" size="mini" prop="mr">
              <el-input v-model="form.mr" placeholder="MR#" clearable style="width:200px" />
            </el-form-item>
            <el-button size="mini" style="float:right" type="success" @click="handleSave">Save</el-button>
                        &nbsp;&nbsp;
            <el-button size="mini" style="float:right" type="warning" @click="handleCancel">Cancel</el-button>
          </el-form>
          <table v-if="!patientEdit">
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Name</td>
              <td style="font-size:12px">{{ demoString[2] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">DOB</td>
              <td style="font-size:12px">{{ demoString[11] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Age</td>
              <td style="font-size:12px">{{ demoString[24] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">SS#</td>
              <td style="font-size:12px">{{ demoString[8] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Relationship</td>
              <td style="font-size:12px">{{ demoString[20] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Sex</td>
              <td style="font-size:12px">{{ demoString[9] }}</td>
            </tr>
            <tr>
              <td span="2"><br></td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Address1</td>
              <td style="font-size:12px">{{ demoString[3] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Address2</td>
              <td style="font-size:12px">{{ demoString[4] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">City</td>
              <td style="font-size:12px">{{ demoString[5] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">State</td>
              <td style="font-size:12px">{{ demoString[104] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Zip</td>
              <td style="font-size:12px"> {{ demoString[6] }}</td>
            </tr>
            <tr>
              <td span="2"><br></td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Cell</td>
              <td style="font-size:12px">{{ demoString[7].split('^')[2] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Home</td>
              <td style="font-size:12px">{{ demoString[7].split('^')[0] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Work</td>
              <td style="font-size:12px">{{ demoString[7].split('^')[1] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Emergency</td>
              <td style="font-size:12px">{{ demoString[7].split('^')[3] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Email</td>
              <td style="font-size:12px">{{ demoString[7].split('^')[4] }}</td>
            </tr>
            <!--
                                                            <tr>
                                                                <td style="text-align:left;width:100px;color:blue;font-size:12px">No Text</td>
                                                                <td style="font-size:12px">{{demoString[7].split('^')[6]}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="text-align:left;width:100px;color:blue;font-size:12px">Preferred</td>
                                                                <td style="font-size:12px">{{demoString[7].split('^')[7]}}</td>
                                                            </tr> -->
            <tr>
              <td span="2"><br></td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">MR#</td>
              <td style="font-size:12px">{{ demoString[10] }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="box-card" style="padding:5px">
          <div slot="header">
            <span>Guarantor</span>
          </div>
          <table>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Name</td>
              <td style="font-size:12px">{{ demoString[31] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">DOB</td>
              <td style="font-size:12px">{{ demoString[29] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Age</td>
              <td style="font-size:12px">{{ demoString[77] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">SS#</td>
              <td style="font-size:12px">{{ demoString[30] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Type</td>
              <td style="font-size:12px">{{ demoString[27] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Sex</td>
              <td style="font-size:12px">{{ demoString[28] }}</td>
            </tr>
            <tr>
              <td span="2"><br></td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Address1</td>
              <td style="font-size:12px">{{ demoString[32] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Address2</td>
              <td style="font-size:12px">{{ demoString[33] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">City</td>
              <td style="font-size:12px">{{ demoString[34] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">State</td>
              <td style="font-size:12px">{{ demoString[105] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Zip</td>
              <td style="font-size:12px"> {{ demoString[35] }}</td>
            </tr>
            <tr>
              <td span="2"><br></td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Cell</td>
              <td style="font-size:12px">{{ demoString[36].split('^')[2] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Home</td>
              <td style="font-size:12px">{{ demoString[36].split('^')[0] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Work</td>
              <td style="font-size:12px">{{ demoString[36].split('^')[1] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Emergency</td>
              <td style="font-size:12px">{{ demoString[36].split('^')[3] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Email</td>
              <td style="font-size:12px">{{ demoString[36].split('^')[4] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Preferred</td>
              <td style="font-size:12px">{{ demoString[36].split('^')[7] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Misc</td>
              <td style="font-size:12px">{{ demoString[43] }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="box-card" style="padding:5px">
          <div slot="header">
            <span>Other</span>
          </div>
          <table>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">A/R</td>
              <td style="font-size:12px">{{ demoString[56] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Status</td>
              <td style="font-size:12px">{{ demoString[123] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Special Field A</td>
              <td style="font-size:12px">{{ demoString[58] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Special Field B</td>
              <td style="font-size:12px">{{ demoString[59] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Special Field C</td>
              <td style="font-size:12px">{{ demoString[60] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Notes</td>
              <td style="font-size:12px">{{ demoString[17] }}</td>
            </tr>
            <tr>
              <td span="2"><br></td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Provider</td>
              <td style="font-size:12px">{{ demoString[12] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Diagnosis</td>
              <td style="font-size:12px">{{ demoString[16] && demoString[16].length ? demoString[16].substring(0,35):demoString[16] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Admit/Discharge</td>
              <td style="font-size:12px">{{ demoString[13] }} - {{ demoString[14] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Place</td>
              <td style="font-size:12px">{{ demoString[120] }}</td>
            </tr>
            <tr>
              <td span="2"><br></td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Language</td>
              <td style="font-size:12px">{{ demoString[126] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Race</td>
              <td style="font-size:12px">{{ demoString[124] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Ethnicity</td>
              <td style="font-size:12px">{{ demoString[125] }}</td>
            </tr>
            <tr>
              <td span="2"><br></td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Emp.Name</td>
              <td style="font-size:12px">{{ demoString[37].split('^')[0] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Emp.Contact</td>
              <td style="font-size:12px">{{ demoString[37].split('^')[1] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Emp.Phone</td>
              <td style="font-size:12px">{{ demoString[37].split('^')[2] }}</td>
            </tr>
            <tr>
              <td style="text-align:left;width:100px;color:blue;font-size:12px">Emp.Email</td>
              <td style="font-size:12px">{{ demoString[37].split('^')[3] }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card class="box-card" style="padding:5px">
          <div slot="header">
            <span>Case</span><span style="float:right" />
          </div>
          <ViewTemp :cases="cases" :selected-account="selectedAccount" style="height:330px;overflow-y:scroll" />

        </el-card>
      </el-col>

    </el-row>
    <el-row v-if="list && list.length" style="padding-top:10px;" :gutter="12">
      <el-col :span="15">
        <el-card class="box-card" style="padding:5px">
          <div slot="header">
            <span>Insurance</span>&nbsp;&nbsp;&nbsp;<span>
              <el-select v-model="insType" placeholder="Select" size="mini">
                <el-option
                  v-for="item in Object.keys(types)"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </span>
          </div>
          <hot-table
            :id="'hotTableComponentins'"
            :key="'hotTableComponent'"
            ref="hotTableComponent"
            :columns="tableRenderer"
            :col-widths="[1,1,50,170,20,80,80,80,60,60,65,65,40,135]"
            :data="list"
            :col-headers="ins.header"
            :read-only="true"
            :height="250"
            :width="'100%'"
            license-key="non-commercial-and-evaluation"
            :current-row-class-name="'currentRow'"
          />
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card class="box-card" style="padding:5px">
          <div slot="header">
            <span>Cases</span>&nbsp;&nbsp;&nbsp;<span />
          </div>
          <hot-table
            :id="'hotTableComponentcases'"
            :key="'hotTableComponentcases'"
            ref="hotTableComponentcases"
            :data="cases.casesDetails"
            :columns="caseRenderer"
            :col-headers="['Case#','Description','StartDate','EndDate','Closed?','A/R Class']"
            :read-only="true"
            :height="250"
            :width="'100%'"
            license-key="non-commercial-and-evaluation"
            :current-row-class-name="'currentRowCase'"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  HotTable
} from '@handsontable/vue'
import Handsontable from 'handsontable'
import {
  M
} from '@/api/index'
import generalLookup from '@/components/lookups/index'
import ViewTemp from './components/selections/view'
export default {
  components: {
    HotTable,
    generalLookup,
    ViewTemp
  },
  props: {
    selectedAccount: String,
    demoString: Array,
    ins: Object,
    cases: Object
  },
  data() {
    return {
      insType: ' 02-Guarantor',
      patientEdit: false,
      form: {
        id: '',
        account: '',
        citystate: '',
        dg: '',
        dob: '',
        ins: '',
        lang: '',
        nosms: '',
        notes: '',
        place: '',
        preferred: '',
        sex: '',
        ssn: '',
        time: '',
        work: '',
        zip: '',
        ad1: '',
        ad2: '',
        cell: '',
        home: '',
        emergency: '',
        name: '',
        mr: '',
        relationship: '',
        email: ''
      }
    }
  },
  computed: {
    tableRenderer: {
      get() {
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
            if (instance.getCell(row, 1).innerHTML == 'Y') {
              instance.getCell(row, 0).style.background = '#FFFFE1'
              td.style.background = '#FFFFE1'
            } else {
              td.style.background = '#E1E1FF'
            }
            return cellProperties
          }
        }
        const out = []
        this.ins.header.map(() => out.push(columRenderer))
        return out
      }
    },
    caseRenderer: {
      get() {
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
            td.style.background = '#FFFFE1'
            return cellProperties
          }
        }
        const out = [];
        [0, 1, 2, 3, 4, 5, 6].map(() => out.push(columRenderer))
        return out
      }
    },
    list() {
      const insType = this.insType
      const types = this.ins.types
      return this.ins.details.filter(item => {
        const order = item[0]
        if (types && types[insType] && types[insType].includes(order)) {
          return true
        } else {
          return false
        }
      })
    },
    types() {
      return this.ins.types || {
        ' 01-All Insurance': '',
        ' 02-Guarantor': ''
      }
    }
  },
  methods: {
    handleEdit() {
      this.form = {
        id: this.selectedAccount,
        account: this.selectedAccount,
        citystate: this.demoString[5] + ',' + this.demoString[104],
        dob: this.demoString[11],
        nosms: '',
        preferred: '',
        sex: this.demoString[9],
        ssn: this.demoString[8],
        work: this.demoString[7].split('^')[1],
        zip: this.demoString[6],
        ad1: this.demoString[3],
        ad2: this.demoString[4],
        cell: this.demoString[7].split('^')[2],
        home: this.demoString[7].split('^')[0],
        emergency: this.demoString[7].split('^')[3],
        email: this.demoString[7].split('^')[4],
        name: this.demoString[2],
        mr: this.demoString[10],
        relationship: this.demoString[20]
      }

      this.patientEdit = true
    },

    handleSave() {
      this.form = {
        id: this.selectedAccount,
        account: this.selectedAccount,
        citystate: this.demoString[5] + ',' + this.demoString[104],
        dob: this.demoString[11],
        nosms: '',
        preferred: '',
        sex: this.demoString[9],
        ssn: this.demoString[8],
        work: this.demoString[7].split('^')[1],
        zip: this.demoString[6],
        ad1: this.demoString[3],
        ad2: this.demoString[4],
        cell: this.demoString[7].split('^')[2],
        home: this.demoString[7].split('^')[0],
        emergency: this.demoString[7].split('^')[3],
        email: this.demoString[7].split('^')[4],
        name: this.demoString[2],
        mr: this.demoString[10],
        relationship: this.demoString[20]
      }

      this.patientEdit = true
    },
    handleCancel() {
      this.form = {
        id: this.selectedAccount,
        account: this.selectedAccount,
        citystate: this.demoString[5] + ',' + this.demoString[104],
        dob: this.demoString[11],
        nosms: '',
        preferred: '',
        sex: this.demoString[9],
        ssn: this.demoString[8],
        work: this.demoString[7].split('^')[1],
        zip: this.demoString[6],
        ad1: this.demoString[3],
        ad2: this.demoString[4],
        cell: this.demoString[7].split('^')[2],
        home: this.demoString[7].split('^')[0],
        emergency: this.demoString[7].split('^')[3],
        email: this.demoString[7].split('^')[4],
        name: this.demoString[2],
        mr: this.demoString[10],
        relationship: this.demoString[20]
      }

      this.patientEdit = false
    },

    async handleZip() {
      const zip = this.form.zip
      const data = await M('getCitySate^MWS', {
        zip
      })
      if (data && data.data && data.data.citystate) {
        this.form.citystate = ''
        this.form.zip = ''
        setTimeout(() => {
          this.form.citystate = data.data.citystate
          this.form.zip = zip
        })
      } else {
        // this.form.citystate = '';
      }
    }
  }
}
</script>
<style>
    #hotTableComponentcases.handsontable th,
    #hotTableComponentcases.handsontable td {
        color: #000000;
        font-size: 12px !important;
        height: 12px;
        empty-cells: show;
        line-height: 13px;
        padding: 0 10px 0 4px;
    }

    #hotTableComponentins.handsontable th,
    #hotTableComponentins.handsontable td {
        color: #000000;
        font-size: 12px !important;
        height: 12px;
        empty-cells: show;
        line-height: 13px;
        padding: 0 10px 0 4px;
    }
    .currentRow {
        border-bottom: 1pt solid #4B89FF !important;
        border-top: 1pt solid #4B89FF !important;
    }

    .currentRowCase{
              border-bottom: 1pt solid #4B89FF !important;
        border-top: 1pt solid #4B89FF !important;
    }

    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
        margin-bottom: 15px;
    }
    .el-form-item__label{
        font-size: 12px !important;
    }
</style>
