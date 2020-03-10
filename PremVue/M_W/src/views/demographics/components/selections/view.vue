<template>
  <div>
    <el-select v-model="selectedCase" placeholder="Select Case" size="mini" @change="handleCaseChange">
      <el-option v-for="(item,index) in cases.casesDetails" :key="'csdetails'+index" :label="item[0]+'-'+item[1]" :value="item[0]" />
    </el-select>
    <el-tabs v-model="activeName" size="mini">
      <el-tab-pane v-for="tab in Cases" :key="tab" :label="tab">
        <view-single-tab v-if="tab !== 'casesDetails'" :scase="CaseObject[tab]" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  M
} from '@/api/index'
import ViewSingleTab from './view-singe-tab'
export default {
  components: {
    ViewSingleTab
  },
  props: {
    cases: Object,
    selectedAccount: String
  },
  data() {
    return {
      activeName: 0,
      selectedCase: this.cases && this.cases.casesDetails && this.cases.casesDetails[0][0],
      CASES: {}
    }
  },
  computed: {
    CaseObject() {
      if (Object.keys(this.CASES) && Object.keys(this.CASES).length) {
        return this.CASES
      } else {
        return this.cases
      }
    },
    Cases() {
      return Object.keys(this.cases).filter(sc => {
        return sc !== 'casesDetails'
      })
    }
  },
  mounted() {},
  methods: {
    async handleCaseChange() {
      const caseData = await M('getCaseSelectionsByCase^MWD', {
        account: this.selectedAccount,
        Case: this.selectedCase
      })
      let cases
      if (caseData && caseData.data && caseData.data.cases) {
        cases = caseData.data.cases
      }
      this.CASES = cases
      // this.$set('CASES',cases);
    }
  }
}
</script>
<style>
    .el-card__body {
        padding: 5px;
    }
</style>
