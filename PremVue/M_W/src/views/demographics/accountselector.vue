<template>
  <el-row type="flex" align="top" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: rgb(84, 92, 100);">
    <el-col :span="24">
      <table style="display: inline-block;">
        <tr>
          <td>
            <el-select
              v-model="selectedAccount"
              style="vertical-align:top;padding-top: 0px;width:145px"
              filterable
              remote
              placeholder="Account Lookup"
              size="mini"
              :remote-method="remoteAccountLookup"
              :loading="loadingAccount"
              class="AccountLookUpClass"
              clearable
              @change="handleAccountChange"
            >
              <el-option v-for="(item) in returnedAccounts" :key="item.id" :label="item.id + '  ' +item.name" :value="item.id">
                <tr>
                  <td width="100">{{ item.account }}</td>
                  <td width="150">{{ item.name.substring(0,16) }}</td>
                </tr>
              </el-option>
            </el-select>
          </td>
          <td>
            <accountLookup v-model="selectedAccount" style="vertical-align:top;padding-top: 0px;" @change="handleAccountChange" />
          </td>
          <td>
            <el-button type="warning" size="mini" @click="signalNewAccount">New</el-button>
          </td>
        </tr>
      </table>
      <table v-if="selectedAccount" style="vertical-align:top;font-size:12px;display: inline-block; ">
        <tbody>
          <tr>
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>Name:</b></td>
            <td style="color:white">{{ banner[2] }}</td>
            <td colspan="2" style="color: rgb(255, 208, 75);width:15px" />
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>DOB:</b></td>
            <td style="color:white">{{ banner[11] }}</td>
            <td colspan="2" style="color: rgb(255, 208, 75);width:30px;" />
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>PBal:</b></td>
            <td style="color:white">{{ banner[47] }}</td>
            <td colspan="2" style="color: rgb(255, 208, 75);width:30px;" />
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>Notes:</b></td>
            <td style="color:white">{{ banner[17] }}</td>
            <td colspan="2" style="color: rgb(255, 208, 75);width:30px;" />
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>Insurance:</b></td>
            <td style="color:white">{{ typeof(banner[44])==='string' && banner[44].indexOf(' ')>-1?banner[44].split(' ')[0]:banner[44] }}</td>
            <td style="color: rgb(255, 208, 75);width:15px" align="right"><b>LastChrg:</b></td>
            <td style="color:white">{{ banner[51] }}</td>
          </tr>
          <tr>
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>A/R:</b></td>
            <td style="color:white">{{ typeof(banner[56])==='string' && banner[56].indexOf(' ')>-1?banner[56].split(' ')[0]:banner[56] }}</td>
            <td colspan="2" style="color: rgb(255, 208, 75);width:15px;" />
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>Age:</b></td>
            <td style="color:white">{{ banner[24] }}</td>
            <td colspan="2" style="color: rgb(255, 208, 75);width:30px;" />
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>SS#:</b></td>
            <td style="color:white">{{ banner[8] }}</td>
            <td colspan="2" style="color: rgb(255, 208, 75);width:30px;" />
            <td style="color: rgb(255, 208, 75);width:15px;" align="right"><b>Sex:</b></td>
            <td style="color:white">{{ banner[9] }}</td>
            <td colspan="2" style="color: rgb(255, 208, 75);width:30px;" />
            <td style="color: rgb(255, 208, 75);width:15px" align="right"><b>Elgibilty:</b></td>
            <td style="color:white">{{ banner[131] }}</td>
            <td style="color: rgb(255, 208, 75);width:15px" align="right"><b>LastStmt:</b></td>
            <td style="color:white">{{ banner[52] }}</td>
          </tr>
        </tbody>
      </table>
    </el-col>
  </el-row>
</template>
<script>
import {
  M
} from '@/api/index'
import accountLookup from '@/components/lookups/account'
export default {
  components: {
    accountLookup
  },
  props: ['value'],
  data() {
    return {
      selectedAccount: this.$store.state.account.account,
      loadingAccount: false,
      returnedAccounts: [],
      banner: [],
      tabs: []
    }
  },
  computed: {
    stateAccount() {
      return this.$store.state.account.account
    }
  },
  watch: {
    async stateAccount(v, o) {
      if (v === o || this.selectedAccount === v) return
      this.selectedAccount = v
      await this.handleAccountChange()
    },
    value(val) {
      this.selectedAccount = val.account
    },
    selectedAccount: {
      handler(v, o) {
        if (v === o) return
        setTimeout(() => {
          this.$store.dispatch('addSelectedAccount', {
            account: v
          })
        }, 500)
      }
    }
  },
  async mounted() {
    this.selectedAccount = this.$store.state.account.account
    await this.handleAccountChange()
  },
  methods: {
    transformRem(rem) {
      const list = rem
      let out = ''
      for (const i in list) {
        if (list[i] === 'Post Op Limits' ||
            list[i] === 'Referrals' ||
            list[i] === 'Reminders' ||
            list[i] === 'Patient Reminders'
        ) out = out + '<br><b>' + list[i] + '</b><br>'
        else {
          out = out + list[i] + '<br>'
        }
      }
      return out
    },
    async handleAccountChange() {
      if (this.selectedAccount === '' || !this.selectedAccount) {
        this.$emit('input', {
          account: null,
          age: null,
          sex: null,
          tabs: null,
          ins: null,
          cases: null
        })
        return
      }
      const data = await M('getDemo^MWD', {
        k: this.selectedAccount
      })
      const caseData = await M('getCaseSelections^MWD', {
        account: this.selectedAccount
      })

      let cases
      if (caseData && caseData.data && caseData.data.cases) {
        cases = caseData.data.cases
      }
      const insData = await M('getINS^MWD')
      let ins
      if (insData && insData.data && insData.data.insData) {
        ins = insData.data.insData
      }
      if (data && data.data && data.data.details) {
        this.banner = data.data.details.split(':')
        // let tabs = this.banner[113].split(',')
        this.tabs = this.banner
      }
      if (data && data.data && data.data.rem) {
        this.$notify({
          title: 'Account ' + this.selectedAccount + ' Alerts',
          message: '<span style="font-size:12px">' + this.transformRem(data.data.rem) + '</span>',
          type: 'info',
          duration: 10000,
          dangerouslyUseHTMLString: true,
          position: 'top-right'
        })
      }
      this.$emit('input', {
        account: this.selectedAccount,
        age: this.banner[31],
        sex: this.banner[16],
        tabs: this.tabs,
        ins: ins,
        cases: cases
      })
      this.$emit('reload')
    },
    signalNewAccount() {
      this.selectedAccount = ''
      this.$emit('newaccount')
    },
    async remoteAccountLookup(query) {
      this.loadingAccount = true
      const data = await M('getDemoLookup^MWAI', {
        query
      })
      this.loadingAccount = false
      this.returnedAccounts = data.data.returnedAccounts
      return
    }
  }
}
</script>
<style>
  .svg-icon-ai {
    width: 35px !important;
    height: 35px !important;
    fill: currentColor;
    overflow: hidden;
  }
</style>
