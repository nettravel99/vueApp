<template>
  <div>
    <el-dialog :id="'apptdlg'" :title="'Book Appointment'" :visible="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" append-to-body top="1vh" width="61%">
      <el-form ref="form" :inline="true" :model="form" label-width="65px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="Name" size="mini" required prop="name">
              <el-input v-model="form.name" placeholder="Lastname, Firstname" clearable style="width:220px" />
            </el-form-item>
            <el-form-item label="DOB" size="mini" required prop="dob">
              <el-date-picker v-model="form.dob" format="MM/dd/yyyy" type="date" style="width:220px" />
            </el-form-item>
            <el-form-item label="SSN" size="mini" prop="ssn">
              <el-input v-model="form.ssn" v-mask="'###-##-####'" placeholder="SSN" clearable style="width:220px" />
            </el-form-item>
            <el-form-item label="Address1" size="mini" prop="ad1">
              <el-input v-model="form.ad1" placeholder="Address1" clearable style="width:220px" />
            </el-form-item>
            <el-form-item label="Address2" size="mini" prop="ad2">
              <el-input v-model="form.ad2" placeholder="Address2" clearable style="width:220px" />
            </el-form-item>
            <el-form-item label="Zip" size="mini" prop="zip">
              <el-input v-model="form.zip" v-mask="'#####'" clearable placeholder="ZipCode" style="width:180px" @change="handleZip" />
              <generalLookup v-model="form.zip" lookup="ZP" title="Zip Code" style="float:right" :nested="true" @change="handleZip" />
            </el-form-item>
            <el-form-item label="City, State" size="mini" prop="citystate">
              <el-input v-model="form.citystate" placeholder="City, State" clearable style="width:180px" />
              <generalLookup v-model="form.citystate" :select="2" lookup="ZP" title="City" style="float:right" :nested="true" />
            </el-form-item>
            <el-form-item label="Sex" size="mini" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :label="'M'">Male&nbsp;</el-radio>
                <el-radio :label="'F'">Female</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Cell" size="mini" prop="cell">
              <el-input v-model="form.cell" v-mask="'(###)-###-####'" placeholder="Cellphone" clearable style="width:135px" />
              <el-select v-model="form.preferred" placeholder="Preferred Contact Method" style="width:80px">
                <el-option label="Home" value="home" />
                <el-option label="Cell" value="cell" />
                <el-option label="work" value="work" />
                <el-option label="Email" value="email" />
              </el-select>
            </el-form-item>
            <el-form-item label="Home Tel" size="mini" prop="home">
              <el-input v-model="form.home" v-mask="'(###)-###-####'" placeholder="Home Tel" clearable style="width:220px" />
            </el-form-item>
            <el-form-item label="Work" size="mini" prop="work">
              <el-input v-model="form.work" v-mask="'(###)-###-####'" placeholder="Work Tel" clearable style="width:150px" />
              <el-checkbox v-model="form.nosms">NoTxt</el-checkbox>
            </el-form-item>
            <el-form-item label="Emergency" size="mini" prop="emergency">
              <el-input v-model="form.emergency" v-mask="'(###)-###-####'" placeholder="Emergency Tel" clearable style="width:225px" />
            </el-form-item>
            <el-form-item label="Ref. Dr." size="mini" prop="ref">
              <el-input v-model="form.ref" placeholder="Referring Dr." clearable style="width:190px" />
              <generalLookup v-model="form.ref" lookup="RF" title="Referring Dr." style="float:right" :nested="true" />
            </el-form-item>
            <el-form-item label="Insurance" size="mini" prop="ins">
              <el-input v-model="form.ins" placeholder="Insurance" clearable style="width:190px" />
              <generalLookup v-model="form.ins" lookup="IN" title="Insurance" style="float:right" :nested="true" />
            </el-form-item>
            <el-form-item label="Policy" size="mini" prop="policy">
              <el-input v-model="form.policy" placeholder="Policy" clearable style="width:230px" />
            </el-form-item>
            <el-form-item label="Group" size="mini" prop="group">
              <el-input v-model="form.group" placeholder="Group" clearable style="width:230px" />
            </el-form-item>
            <el-form-item label="Language" size="mini" prop="lang">
              <el-input v-model="form.lang" placeholder="Language" clearable style="width:190px" />
              <generalLookup v-model="form.lang" lookup="PREFLANG" title="Langauge" style="float:right" :nested="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Account" size="mini" prop="account">
              <el-input v-model="form.account" clearable placeholder="Account#" style="width:180px" />
              <accountLookup v-model="form.account" style="float:right" :nested="true" @change="handleAccountChange" />
            </el-form-item>
            <el-form-item label="Date/Time" size="mini" required prop="date">
              <el-date-picker v-model="form.date" type="date" style="width:122px" />
              <el-time-picker v-model="form.time" :format="'HH:mm A'" :value-format="'HH:mm A'" style="width:95px" placeholder="Select time" />
            </el-form-item>
            <el-form-item size="mini">
              <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </el-form-item>
            <el-form-item label="Appt. Type" size="mini" prop="apptType">
              <el-input v-model="form.apptType" placeholder="Appt. Type" clearable style="width:190px" />
              <apptTypeLookup v-model="form.apptType" style="float:right" :nested="true" />
            </el-form-item>
            <el-form-item label="Place" size="mini" prop="place">
              <el-input v-model="form.place" placeholder="Place of Service" clearable style="width:190px" />
              <generalLookup v-model="form.place" lookup="PS" title="Place" style="float:right" :nested="true" />
            </el-form-item>
            <el-form-item label="Procedure" size="mini" prop="proc">
              <el-input v-model="form.proc" placeholder="Procedure" clearable style="width:190px" />
              <generalLookup v-model="form.proc" lookup="PC" title="Procedure" style="float:right" :nested="true" />
            </el-form-item>
            <el-form-item label="Diagnosis" size="mini" prop="dg">
              <el-input v-model="form.dg" placeholder="Diagnosis" clearable style="width:190px" />
              <diagnosisLookup v-model="form.dg" style="float:right" />
            </el-form-item>
            <el-form-item label="Length" size="mini" prop="length">
              <el-select v-model="form.length" placeholder="Length" style="width:228px">
                <el-option v-for="i in 144" :key="'length-'+i" :label="i*5" :value="i*5" />
              </el-select>
            </el-form-item>
            <el-form-item label="Dept." size="mini" prop="dp">
              <el-input v-model="form.dp" placeholder="Department" clearable style="width:190px" />
              <generalLookup v-model="form.dp" lookup="DP" title="Department" style="float:right" :nested="true" />
            </el-form-item>
            <el-form-item size="mini">
              <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </el-form-item>
            <el-form-item label="App. Notes" size="mini" prop="notes">
              <el-input v-model="form.notes" type="textarea" :rows="11" placeholder="Appointment Notes" clearable style="width:230px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" label="Resource" prop="resource">
              <el-select v-model="form.resource" style="width:220px" filterable reserve-keyword placeholder="Resources" size="mini">
                <el-option v-for="(item,index) in resources" :key="'resource-'+index" :label="item.name.substring(0,13)" :value="item.id">
                  <span :style="{'background-color':item.color}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span>{{ item.id }} {{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" prop="chkin">
              <el-checkbox v-model="form.chkin">Check In</el-checkbox>
              <el-checkbox v-model="form.noshow">No Show</el-checkbox>
            </el-form-item>
            <el-form-item sizw="mini">
              <br>
            </el-form-item>
            <el-form-item label="Notes" size="mini" prop="pnotes">
              <el-input v-model="form.pnotes" type="textarea" :rows="5" placeholder="Patient Notes" clearable style="width:230px" />
            </el-form-item>
            <el-form-item label="Comments" size="mini" prop="comments">
              <el-input v-model="form.comments" type="textarea" :rows="5" placeholder="Patient Comments" clearable style="width:230px" />
            </el-form-item>
            <el-form-item size="mini" label=" ">
              <br>
              <br>
              <br>
              <h3>{{ this.form.date && new Date(this.form.date).toDateString() }} - {{ this.form.time }}</h3>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  M
} from '@/api/index'
import generalLookup from '@/components/lookups/index'
import accountLookup from '@/components/lookups/account'
import apptTypeLookup from '@/components/lookups/apptType'
import diagnosisLookup from '@/components/lookups/diagnosis'
export default {
  components: {
    generalLookup,
    accountLookup,
    apptTypeLookup,
    diagnosisLookup
  },
  props: ['value', 'args', 'resource', 'resources', 'date', 'id', 'dp'],
  data() {
    return {
      dialogFormVisible: false,
      form: {
        id: '',
        account: '',
        apptType: '',
        chkin: '',
        citystate: '',
        comments: '',
        date: '',
        dg: '',
        dob: '',
        dp: '',
        group: '',
        ins: '',
        lang: '',
        length: 15,
        noshow: '',
        nosms: '',
        notes: '',
        place: '',
        pnotes: '',
        policy: '',
        preferred: '',
        proc: '',
        ref: '',
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
        resource: ''
      }
    }
  },
  computed: {
    zip: {
      get() {
        return this.form.zip
      }
    },
    apptID: {
      get() {
        return this.$store.state.scheduler.id
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      async handler(val) {
        const type = this.$store.state.scheduler.new
        this.form = {
          id: '',
          account: '',
          apptType: '',
          chkin: '',
          citystate: '',
          comments: '',
          date: '',
          dg: '',
          dob: '',
          dp: '',
          group: '',
          ins: '',
          lang: '',
          length: 15,
          noshow: '',
          nosms: '',
          notes: '',
          place: '',
          pnotes: '',
          policy: '',
          preferred: '',
          proc: '',
          ref: '',
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
          resource: ''
        }
        if (type == true) {
          this.form.resource = this.$store.state.scheduler.resource
          this.form.id = ''
          try {
            this.form.date = new Date(this.$store.state.scheduler.start)
            this.form.time = this.getTime(this.$store.state.scheduler.start)
          } catch (e) {
            // console.log
          }
        } else {
          const data = await M('BOOKDET^MWS', {
            id: this.$store.state.scheduler.id
          })
          if (data && data.data && data.data.form) {
            const cfrom = this.form
            const nfrom = data.data.form
            this.form = { ...cfrom,
              ...nfrom
            }
            this.form.id = this.$store.state.scheduler.id
          }
        }
        setTimeout(() => {
          this.dialogFormVisible = val
        }, 100)
      }
    }
  },
  methods: {
    async handleAccountChange() {
      const data = await M('getDemoDetails^MWS', {
        account: this.form.account
      })
      if (data && data.data && data.data.form) {
        const cfrom = this.form
        const nfrom = data.data.form
        this.form = { ...cfrom,
          ...nfrom
        }
      }
    },
    getTime(t) {
      let ap = 'AM'
      let hours = new Date(t).getHours() + ''
      if (hours >= 12) {
        hours = hours - 12
        ap = 'PM'
      }
      if (hours == 0) hours = 12
      if (hours.length == 1) hours = '0' + hours
      let minutes = new Date(t).getMinutes() + ''
      if (minutes.length == 1) minutes = '0' + minutes
      return `${hours}:${minutes} ${ap}`
    },
    async handleZip() {
      const zip = this.zip
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
    },
    async handleSave() {
      const data = await M('book^MWS', this.form)
      if (data && data.data && data.data.status) {
        const status = data.data.status
        if (status !== 'BOOKED') {
          this.$alert(status)
        } else {
          if (data && data.data && data.data.seqn) {
            setTimeout(() => {
              this.$emit('message', `Appointment ${data.data.seqn} Saved`)
            }, 1000)
            /*
              setTimeout(() => {
                this.$notify({
                  title: "Success",
                  message: `Appointment ${data.data.seqn} Saved`,
                  type: "success"
                });
              });
              */
            this.dialogFormVisible = false
            this.$refs.form.resetFields()
            this.$emit('input', this.dialogFormVisible)
            this.$emit('reload', this.dialogFormVisible)
          } else {
            this.$alert(status)
          }
        }
      }
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.$refs.form.resetFields()
      this.$emit('input', this.dialogFormVisible)
      this.$emit('reload', this.dialogFormVisible)
    }
  }
}
</script>
<style>
  .el-dialog__bodyx {
    padding: 5px 5px;
    color: #606266;
    font-size: 13px;
  }
  .el-form-item__label {
    white-space: nowrap;
    text-align: right;
    float: left;
    font-size: 12px;
    line-height: 20px;
    /* padding: 0 12px 0 0; */
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 2px;
  }
  .el-radio+.el-radio {
    margin-left: 0px;
  }
  .el-radio__label {
    font-size: 12px;
    padding-left: 5px;
  }
</style>
