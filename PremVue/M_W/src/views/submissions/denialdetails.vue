<template>
<div>
    <el-row style="margin-bottom: 10px">
        <el-col :span="12">
             <JsonExcel type="csv" 
              :fields="json_fields"
             style="float:left;padding-right:10px;"    
             :name="tab+'.csv'" 
              :fetch="handleDownload"> 
             <el-button type="primary" size="mini" icon="el-icon-download" circle :loading="downloading"></el-button>
             </JsonExcel>
            <el-button  style="float:left;padding:5px;" :disabled="!Object.keys(selected).some(x => selected[x]===true)" type="primary" @click="handleCloseTrans" size="mini">Close {{Object.keys(selected).some(x => selected[x]===true) ? 'Selected ' +Object.keys(selected).filter(i => selected[i]).length + ' Transactions':''}}</el-button>
        </el-col>
        <el-col :span="6" :offset="6">
            <el-input v-model="filters[0].value" size="mini" placeholder="Search Something...">
            </el-input>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <data-tables-server style="width: 100%" :filters="filters" :table-props="{size:'mini',height:'74vh'}" :data="list" :total="total" :loading="loading" @query-change="loadData" :pagination-props="{ pageSizes: [5, 10, 15, 20, 9999] }">
                <el-table-column sortable="custom" fixed prop="id" label="id" width="150">
                    <template slot-scope="scope">
                        <el-checkbox v-model="selected['T'+scope.row.tr]" :key="scope.row.tr" />

                        <el-button @click.native.prevent="showNewTask(scope.row.tr)" type="primary" icon="el-icon-circle-plus-outline" size="mini" circle></el-button>
                  
              <el-tooltip :content="scope.row.cst" placement="top" effect="dark" :disabled="!scope.row.cst">
                        <el-tag size="mini" :type="scope.row.st == 0?'danger':'success'">{{scope.row.st == 0?'Closed':'Open'}}</el-tag>
              </el-tooltip>
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" prop="tr" label="TR#" width="120">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="showDenial(scope.row.tr)" type="text" size="small">
                            {{scope.row.tr}}
                        </el-button>
                    </template>

                </el-table-column>
                <el-table-column sortable="custom" prop="pr" label="Procedure" :show-overflow-tooltip="true">
                             <template slot-scope="scope">
                        <el-button @click.native.prevent="showTransaction(scope.row.tr)" type="text" size="small">
                            {{scope.row.pr}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" prop="dg" label="Diagnosis">
                </el-table-column>
                <el-table-column sortable="custom" prop="nm" label="Name" :show-overflow-tooltip="true">

                                <template slot-scope="scope">
                        <el-button @click.native.prevent="showDemo(scope.row.kk1)" type="text" size="small">
                            {{scope.row.nm}}
                        </el-button>
                    </template>


                </el-table-column>
                <el-table-column sortable="custom" prop="pv" label="Provider" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column sortable="custom" prop="rs" label="Reason" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column sortable="custom" prop="lc" label="Location" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column sortable="custom" prop="py" label="Payer" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column sortable="custom" prop="rm" label="Remark" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column sortable="custom" prop="bl" label="Billed">
                </el-table-column>
                <el-table-column sortable="custom" prop="bn" label="Balance">
                </el-table-column>
            </data-tables-server>
        </el-col>
        <lite-panel v-model="showLite" :lite-type="showLiteType" :lite-value="showLiteValue" />
    </el-row>
</div>
</template>

<script>
import {
    M
} from '@/api/index'
import LitePanel from '@/components/LitePanel/index';
import JsonExcel from 'vue-json-excel'
export default {
    props: ['details','tab'],
    data() {
        return {
            json_fields: {
              'id': 'id',
              'TR#': 'tr',
              'Procedure': 'pr',
              'Diagnosis': 'dg',
              'Name': 'nm',
              'Provider': 'pv',
              'Reason': 'rs',
              'Location': 'lc',
              'Payer': 'py',
              'Remark': 'rm',
              'Billed': 'bl',
              'Balance': 'bn',
            },
            downloading:false,
            selected: {},
            showLiteType: '',
            showLiteValue: '',
            showLite: false,
            list: [],
            loading: false,
            filters: [{
                prop: 'name',
                value: ''
            }],
            total: 0
        }
    },
    async mounted() {

    },
    components: {
        LitePanel,
        JsonExcel
    },
    methods: {
        async handleDownload(){
            this.downloading = true;
            let data = await M('getDLDetails^MWDN',this.details);
             let list = data.data.list
             this.downloading = false;
             return list;
        },
        async handleCloseTrans() {
            let data = await M('closeTrans^MWDN', this.selected);
            if (data.result) {
                Object.keys(this.selected).map((k) => {
                    let tr = k.substring(1, k.length);
                    this.list.find(x => Number(x.tr) === Number(tr)).st = 0;
                    this.selected[k] = false;
                })
                this.$notify({
                    title: 'Medics Denials',
                    message: 'Closed: ' + data.result,
                    type: 'success',
                    duration: '2500',
                    position: 'top-right'

                });

            }
        },
        showDenial(tr){
            this.showLiteValue = tr;
            this.showLiteType = 'DENIAL';
            this.$nextTick(() => {
                this.showLite = true;
            })
        },

        showDemo(kk1){
            this.showLiteType = 'DEMO';
            this.showLiteValue = kk1;
            this.$nextTick(() => {
                this.showLite = true;
            })
        },

        showNewTask(tr) {
            this.showLiteType = 'TASK';
            this.showLiteValue = tr;
            this.$nextTick(() => {
                this.showLite = true;
            })
        },
        showTransaction(tr) {
            this.showLiteValue = tr;
            this.showLiteType = 'T';
            this.$nextTick(() => {
                this.showLite = true;
            })
        },
        async loadData(queryInfo) {
            this.loading = true;
            let data = await M('getDetails^MWDN', Object.assign(this.details, queryInfo));
            this.list = data.data.list
            this.total = Number(data.data.total)
            this.loading = false;
        }
    }
}
</script>

<style>
.el-table--mini th,
.el-table--mini td {
    padding: 0px 0 !important;
}

.el-table--mini {
    font-size: 11px !important;
}

.el-table .cell {

    line-height: 16px !important;
    padding-left: 3px !important;
    padding-right: 3px !important;
}
</style>
