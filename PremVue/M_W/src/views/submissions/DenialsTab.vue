<template>
<el-card :body-style="{ padding: '0px' }">
    <JsonExcel :fields="fields_excel" :data="downloadData" type="csv" style="float:left" :name="mainType + '-' +typeSelection + '.csv'"> 
         <el-button type="primary" size="mini" icon="el-icon-download" circle ></el-button>
     </JsonExcel>

    <el-radio-group v-model="typeSelection" @change="handleTypeChange">
        <el-radio v-if="mainType ==='Denials'" style="padding:20px;" :label="'D'">Denials</el-radio>
        <el-radio style="padding:20px;" :label="'AG'">Aging</el-radio>
        <el-radio style="padding:20px;" :label="'PS'">Location</el-radio>
        <el-radio style="padding:20px;" :label="'PV'">Provider</el-radio>
        <el-radio style="padding:20px;" :label="'AR'">A/R</el-radio>
        <el-radio style="padding:20px;" :label="'IN'">Insurance</el-radio>
    </el-radio-group>
    <br><small>Doubleclick on row for more details per row, or doublclick [Total] for everything</small><br>
    <el-row>
        <el-col :span="12">
            <hot-table :hiddenColumns="{
    columns: [0],
    indicators: true
  }" :dropdown-menu="['filter_by_condition','filter_operators','filter_by_condition2','filter_by_value','filter_action_bar']" :columns="columns" v-if="tableData" :column-sorting="true" :filters="true" :id="'hotTableComponentDenials'" :key="'hotTableComponentDenials'" ref="hotTableComponentDenials" :data="tableData" :col-headers="tableHeaders" :read-only="true" :height="400" license-key="non-commercial-and-evaluation" :current-row-class-name="'currentRowDupAcct'" :afterOnCellMouseDown="afterOnCellMouseDown"></hot-table>
        </el-col>
        <el-col :span="12">
            <denial-chart :gdata="tableData" :headers="tableHeaders" :key="tableHeaders.join()" :width="'100%'" :height="'400px'" />
        </el-col>
    </el-row>

</el-card>
</template>

<script>
/* eslint-disable */
import JsonExcel from 'vue-json-excel'
import {
    M
} from '@/api/index'
import {
    HotTable
} from '@handsontable/vue'
import Handsontable from 'handsontable'
import DenialChart from './denialchart'
import NProgress from 'nprogress'
export default {
    data() {
        let vm = this;
        return {
            tabs: [],
            typeSelection: this.mainType === 'Denials' ? 'D' : this.mainType !== 'Denials' ? 'AG':'D',
            tableData: [],
            tableHeaders: [],
            columns: [{
                    renderer: function (
                        instance,
                        td,
                        row,
                        col,
                        prop,
                        value,
                        cellProperties
                    ) {
                        if (row == instance.countRows() - 1) {
                            td.style.fontWeight = 'bold';
                            td.style.textAlign = 'right';
                            td.innerText = ' ';
                            //td.colSpan ="2"
                            return;
                        }
                        Handsontable.renderers.TextRenderer.apply(this, arguments)
                    }
                },
                {
                    renderer: function (
                        instance,
                        td,
                        row,
                        col,
                        prop,
                        value,
                        cellProperties
                    ) {
                        if (row == instance.countRows() - 1) {
                            td.style.fontWeight = 'bold';
                            td.style.textAlign = 'right';
                            td.innerText = 'Total: ';
                            //td.colSpan ="2"
                            return;
                        }
                        Handsontable.renderers.TextRenderer.apply(this, arguments)
                    }
                },
                {
                    renderer: function (
                        instance,
                        td,
                        row,
                        col,
                        prop,
                        value,
                        cellProperties
                    ) {
                        td.style.textAlign = 'right';
                        if (row == instance.countRows() - 1) {
                            td.style.fontWeight = 'bold';
                            td.style.textAlign = 'right';
                            let data = vm.tableData.map(arr => arr[2])
                            td.innerText = data.reduce((total, num) => Number(total) + Number(num))
                            return;
                        }
                        Handsontable.renderers.TextRenderer.apply(this, arguments)
                    }
                },
                {
                    renderer: function (
                        instance,
                        td,
                        row,
                        col,
                        prop,
                        value,
                        cellProperties
                    ) {
                        td.style.textAlign = 'right';
                        if (row == instance.countRows() - 1) {
                            td.style.fontWeight = 'bold';
                            td.style.textAlign = 'right';
                            let data = vm.tableData.map(arr => arr[3])
                            td.innerText = data.reduce((total, num) => Number(total) + Number(num)).toFixed(2)
                            return;
                        }
                        Handsontable.renderers.TextRenderer.apply(this, arguments)
                    }
                },
                {
                    renderer: function (
                        instance,
                        td,
                        row,
                        col,
                        prop,
                        value,
                        cellProperties
                    ) {
                        td.style.textAlign = 'right';
                        if (row == instance.countRows() - 1) {
                            td.style.fontWeight = 'bold';
                            td.style.textAlign = 'right';
                            let data = vm.tableData.map(arr => arr[4])
                            td.innerText = data.reduce((total, num) => Number(total) + Number(num)).toFixed(2)
                            return;
                        }
                        Handsontable.renderers.TextRenderer.apply(this, arguments)
                    }
                },
                {
                    renderer: function (
                        instance,
                        td,
                        row,
                        col,
                        prop,
                        value,
                        cellProperties
                    ) {
                        td.style.textAlign = 'right';
                        if (row == instance.countRows() - 1) {
                            td.style.fontWeight = 'bold';
                            td.style.textAlign = 'right';
                            let billed = vm.tableData.map(arr => arr[3]).reduce((total, num) => Number(total) + Number(num))
                            let balance = vm.tableData.map(arr => arr[4]).reduce((total, num) => Number(total) + Number(num))
                            td.innerText = (((billed - balance) / billed) * 100).toFixed(2)
                            return;
                        }
                        Handsontable.renderers.TextRenderer.apply(this, arguments)
                    }
                }
            ],
            afterOnCellMouseDown: function (event, coords, td) {
                var now = new Date().getTime()
                if (!(td.lastClick && now - td.lastClick < 400)) {
                    td.lastClick = now
                    return
                }
                var data = this.getDataAtRow(coords.row)
                 if (data[0]===null) return;
                let obj = {
                    id: data[0],
                    typeSelection: vm.typeSelection,
                    mainType: vm.mainType
                }
                let tab = obj.mainType + ' by ' + obj.typeSelection + '-' + obj.id
                if (!vm.tabs.includes(tab) && obj.id !==null) {
                    vm.tabs.push(tab)
                    vm.$emit('setTabs', vm.tabs);
                    let emitObj = {};
                    emitObj[tab]=obj
                    vm.$emit('setTabsDetails', emitObj);
                }

                vm.$emit('setTab', tab);
            }
        }
    },
    props: ['job', 'mainType'],
    components: {
        HotTable,
        DenialChart,
        JsonExcel
    },
    async created() {
        await this.handleTypeChange()
    },
    computed:{
        downloadData(){
            let data = [];
            //data.push(this.tableHeaders)
            data = data.concat(this.tableData)
            return data;
        },
        fields_excel(){
            let out = {};
            this.tableHeaders.map((h,i) => {
                out[h]=i
            })
            return out;
        }
    },
    methods: {
        handleDownloadExcel(){
            let data = [];
            data.push(this.tableHeaders)
            data = data.concat(this.tableData)
            console.log(data)
        },
        async handleTypeChange() {
            NProgress.start();
            let data = await M('getSummary^MWDN', {
                job: this.job,
                type: this.typeSelection,
                mainType: this.mainType
            });
            if (data && data.data && data.data.list) {
                this.tableData = data.data.list
            }
            if (data && data.data && data.data.headers) {
                this.tableHeaders = data.data.headers
            }
            this.$nextTick(()=>{
                NProgress.done()
            })
        }
    }
}
</script>

<style>
@import url("../../components/Handsontable/handsontable.css");

.currentRowDupAcctx {
    border-bottom: 1pt solid #4B89FF !important;
    border-top: 1pt solid #4B89FF !important;
}

#hotTableComponentDenials.handsontable th,
#hotTableComponentDenials.handsontable td {
    color: #000000;
    font-size: 14px !important;
    height: 14px;
    empty-cells: show;
    line-height: 18px;
    padding: 0 4px 0 4px;
}
</style>
