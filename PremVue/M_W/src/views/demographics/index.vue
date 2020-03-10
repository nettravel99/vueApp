<template>
  <div>
    <accountSelector v-model="selectedAccount" @newaccount="handleNewAccount" />
    <el-row>
      <el-col :span="24">
        <transition name="fade-transform" mode="out-in">
          <div v-if="selectedAccount.account" style="float:left; width: 150px;padding-left:5px;height:85vh;">
            <account-photo :account="selectedAccount.account" :age="selectedAccount.age" :sex="selectedAccount.sex" />
            <account-entity :account="selectedAccount.account" />
          </div>
        </transition>
        <transition name="fade-transform" mode="out-in">
          <div v-if="selectedAccount.account" style="margin-left: 150px;">
            <el-tabs v-model="activeTab" :tab-position="'left'">
              <el-tab-pane label="Patient" name="patient">
                <patient-view v-if="activeTab === 'patient'" :cases="selectedAccount.cases" :ins="selectedAccount.ins" :demo-string="selectedAccount.tabs" :selected-account="selectedAccount.account" />
              </el-tab-pane>
              <el-tab-pane label="Notes">
                <span v-if="tabs && tabs[0]==='NOTES=1'" slot="label" style="color:green;">
                  <i class="el-icon-check" style="color:green;" />Notes
                </span>
              </el-tab-pane>
              <el-tab-pane label="SpcProc" />
              <el-tab-pane label="Miscellaneous">
                <span v-if="tabs && tabs[1]==='MISC=1'" slot="label" style="color:green;">
                  <i class="el-icon-check" style="color:green;" />Misc.
                </span>
              </el-tab-pane>
              <el-tab-pane label="Appointments"> <span v-if="tabs && tabs[2]==='APPTS=1'" slot="label" style="color:green;">
                <i class="el-icon-check" style="color:green;" />Appts
              </span></el-tab-pane>
              <el-tab-pane label="Images"> <span v-if="tabs && tabs[3]==='IMAGE=1'" slot="label" style="color:green;">
                <i class="el-icon-check" style="color:green;" />Images
              </span></el-tab-pane>
              <el-tab-pane label="Reports"> <span v-if="tabs && tabs[4]==='REPORTS=1'" slot="label" style="color:green;">
                <i class="el-icon-check" style="color:green;" />Reports
              </span></el-tab-pane>
            </el-tabs>
          </div>
        </transition>
        <transition name="fade-transform" mode="out-in">
          <new-account v-if="!selectedAccount.account && newAccount" />
        </transition>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import accountSelector from './accountselector'
import AccountPhoto from './AccountPhoto'
import AccountEntity from '@/components/demographics/accountEntity'
import PatientView from './patientView'
import NewAccount from './newaccount'
export default {
  components: {
    accountSelector,
    AccountPhoto,
    AccountEntity,
    PatientView,
    NewAccount
  },
  data() {
    return {
      selectedAccount: {},
      tabs: [],
      activeTab: 'patient',
      newAccount: false
    }
  },
  watch: {
    selectedAccount: {
      deep: true,
      async handler(account) {
        if (!account.account) return
        let tabs = account.tabs
        if (tabs && tabs[109] && tabs[109].indexOf('NOTES=') > -1) tabs = tabs[109].split(',')
        this.tabs = tabs
      }
    }
  },
  methods: {
    handleNewAccount() {
      this.$set(this.selectedAccount, 'account', '')
      setTimeout(() => {
        this.newAccount = true
      }, 500)
    }
  }
}
</script>
<style>

</style>
