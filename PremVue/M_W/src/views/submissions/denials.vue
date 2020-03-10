<template>
<el-card v-loading="loading" :element-loading-text="'Running...'" element-loading-spinner="el-icon-loading" :element-loading-lock="true">
    <el-tabs type="card" v-model="activeName" closable @tab-remove="removeTab">
        <el-tab-pane label="Selections" name="selections">
            <ads-selections v-model="selectionsString" :selections="selections" :Settings="reportSettings" v-if="selections.length>1" :outputType="'date'" />
            <el-button type="primary" @click="handleRun" size="mini">Run</el-button>
        </el-tab-pane>
        <el-tab-pane label="Denials" name="Denials" :disabled="!hideSelections">
            <denials-tab @setTabsDetails="handlesetTabsDetails" @setTab="handleSetTab" @setTabs="handleSetTabs" :job="jobNo" v-if="activeName==='Denials'" mainType="Denials" />
        </el-tab-pane>
        <el-tab-pane label="No Responses" name="No-Responses" :disabled="!hideSelections">
            <denials-tab @setTabsDetails="handlesetTabsDetails" @setTab="handleSetTab" @setTabs="handleSetTabs" :job="jobNo" v-if="activeName==='No-Responses'" mainType="No-Responses" />
        </el-tab-pane>
        <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab">
            <denial-details :details="tabDetails[tab]" :tab=tab></denial-details>
        </el-tab-pane>
    </el-tabs>

</el-card>
</template>

<script>
import {
    M
} from '@/api/index'
import AccountLookup from '@/components/lookups/account'
import GeneralLookup from '@/components/lookups/index';
import AdsSelections from '../reports/selections/index';
import DenialsTab from './DenialsTab';
import DenialDetails from './denialdetails';
export default {
    data() {
        return {
            loading: false,
            selectionsString: '',
            selections: [],
            reportSettings: [],
            hideSelections: false,
            activeName: 'selections',
            jobNo: '',
            tabs: [],
            tabDetails: {}
        }
    },
    components: {
        AccountLookup,
        GeneralLookup,
        AdsSelections,
        DenialsTab,
        DenialDetails
    },
    async mounted() {
        let data = await M("getSelections^MWDN", {
            selections: this.selectionsString
        })
        if (data && data.selections) {
            this.selections = data.selections;
            this.reportSettings = data.reportSettings;
        }
    },
    methods: {
        removeTab(targetName) {
            let tabs = this.tabs;
            let activeName = this.activeName;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab === targetName && (index - 1) >= 0) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab;
                        }
                    } else {
                        activeName = 'No-Responses'
                    }
                });
            }

            this.activeName = activeName;
            this.tabs = tabs.filter(tab => tab !== targetName);
        },
        handlesetTabsDetails(v) {
            Object.assign(this.tabDetails, this.tabDetails, v);
        },
        handleSetTab(v) {
            this.activeName = v;
        },
        handleSetTabs(v) {
            this.tabs = [...new Set([...this.tabs, ...v])]
        },
        async handleRun() {
            this.loading = true;
            this.tabs = [];
            this.tabDetails = {};
            let data = await M('run^MWDN', {
                selections: this.selectionsString
            })
            if (data && data.data && data.data.job) {
              
                this.jobNo = data.data.job
                this.hideSelections = true;
            }
            this.activeName = 'Denials'

            this.$nextTick(()=>{
              this.loading = false;
            })

        }
    }
}
</script>
