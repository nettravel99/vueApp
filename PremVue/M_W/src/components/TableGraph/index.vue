<template>
<el-card class="box-card">
    <PulseLoader v-if="loading" :loading="reportStatus!=='DONE'" size="5px" />
    <el-progress v-if="loading" :text-inside="true" :stroke-width="10" :percentage="(Math.floor((reportTableCurrentRows/reportTableTotalRows) * 100))" status="success" />

    <el-row type="flex" align="top" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);" v-if="reportStatus === 'DONE'">
        <el-col :span="24" style="vertical-align:top;font-size:12px;display: inline-block; ">

            <el-radio-group v-model="selectedSet" @change="handleSetChange">
                <el-radio v-for="(set,i) in Object.keys(chartSets)" :key="'chartSet-'+i" :label="set">{{set}}</el-radio>
            </el-radio-group>
            <div style="float:right;padding:5px">
                <el-button type="info" size="mini" :disabled="!selectedSet && layout && layout.length < 1" @click="handleDelete">Delete</el-button>
                <el-button type="info" size="mini" :disabled="layout && layout.length < 1" @click="handleSaveCurrentSet">Save Current Set</el-button>
                <el-button type="info" size="mini" :disabled="layout && layout.length < 1" @click="handleSaveSet"> Save As a New Set</el-button>
                <el-button type="info" size="mini" @click="dialogFormVisible = true">Add New Component</el-button>
            </div>
        </el-col>
        <el-dialog title="Add Chart" :visible.sync="dialogFormVisible">
            <el-row>
                <el-col :span="24">
                    <el-form label-width="100px" :model="form" ref="form">
                        <el-form-item  :show-message="false" label="Chart Type" prop="type" required error="required!"> 
                            <el-select v-model="form.type" placeholder="Select">
                                <el-option :label="'Bar Chart'" :value="'BarChart'"></el-option>
                                <el-option :label="'Pie Chart'" :value="'PieChart'"></el-option>
                                <el-option :label="'Multi Chart'" :value="'TimeSeries'"></el-option>
                            </el-select>
                            <small>1st select the type of chart you'd like to add. </small>
                        </el-form-item>
                        <el-form-item :show-message="false" :label="form.type==='TimeSeries'?'Y-axis':'X-axis'" :prop="form.type==='TimeSeries'?'xaxisa':'xaxis'" required error="required!">
                            <el-select v-model="form.xaxis" placeholder="Select X-axis" v-if="form.type!=='TimeSeries'"> 
                                <el-option v-for="(h,i) in headers" :key="'xaxis'+i" :label="h" :value="i"></el-option>
                            </el-select>
                            <el-select v-model="form.xaxisa" placeholder="Select Y-axis" v-if="form.type==='TimeSeries'" multiple>
                                <el-option v-for="(h,i) in headers" :key="'xaxisa'+i" :label="h" :value="i"></el-option>
                            </el-select>
                            <small v-if="form.type!=='TimeSeries'">2nd select a category column (A/R,Ins,Sex,Debartment,etc.) </small>
                        <small v-if="form.type==='TimeSeries'">2nd select one or more numeric columns (Amount,Paid,Count,etc.) </small>
                      
                        </el-form-item>
                        <el-form-item :show-message="false" :label="form.type==='TimeSeries'?'X-axis':'Y-axis'" prop="yaxis" required error="required!">

                            <el-select v-model="form.yaxis" placeholder="Select Y-axis">
                                <el-option v-for="(h,i) in headers" :key="'yaxis'+i" :label="h" :value="i"></el-option>
                            </el-select>
                            <small v-if="form.type!=='TimeSeries'">3rd select a column to aggregate the data against. If you're aggregating by Sum or Average, this column has to be <b>numeric</b> </small>
                             <small v-if="form.type==='TimeSeries'">3rd select a category column (A/R,Ins,Sex,Debartment,etc.) </small>
                        </el-form-item>
                        <el-form-item :show-message="false" label="Aggregate" prop="ag" required error="required!">
                            <el-select v-model="form.ag" placeholder="Select Aggregate">
                                <el-option :label="'Sum'" :value="'Sum'"></el-option>
                                <el-option :label="'Average'" :value="'Average'"></el-option>
                                <el-option :label="'Count'" :value="'Count'"></el-option>
                            </el-select>
                            <small>Lastly, select the type of aggregate: Sum, Average or Count</small>
                        </el-form-item>
                        <el-form-item :show-message="false" label="Title" prop="title">
                            <el-input style="width:220px" v-model="form.title" placeholder="Type a Title">
                            </el-input>
                            <small>Type a Title</small>
                        </el-form-item>
                        <el-form-item :show-message="false" label="Top 10" v-if="form.type!=='TimeSeries'">
                            <el-checkbox v-model="form.top10" ></el-checkbox>
                            <small>Limit to only the top 10 values</small>
                        </el-form-item>

                        <el-form-item :show-message="false" label="Type" v-if="form.type==='TimeSeries'" :required="form.type==='TimeSeries'">
                             <el-select v-model="form.tsType" placeholder="Select Type">
                                <el-option :label="'Bar'" :value="'bar'"></el-option>
                                <el-option :label="'Line'" :value="'line'"></el-option>
                            </el-select>
                        </el-form-item>

                    </el-form>

                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="handleAddComponent">Add</el-button>
  </span>
        </el-dialog>
    </el-row>
    <el-row :gutter="0">
        <grid-layout @layout-updated="layoutUpdatedEvent" v-if="reportStatus === 'DONE'" :layout.sync="layout" :col-num="100" :row-height="10" :is-draggable="true" :is-resizable="true" :is-mirrored="false" :margin="[10, 10]" :use-css-transforms="true">
            <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
                <component :is="item.type" :topTen="item.top10" :gdata="data" :headers="headers" :xCol="item.xCol" :xColA="item.xColA" :yCol="item.yCol" :ag="item.ag" :width="item.w" :height="item.h" :gIndex="item.i" :title="item.title" :tsType="item.tsType"/>
            </grid-item>
        </grid-layout>
    </el-row>
</el-card>
</template>

<script>
import {
    getReportTable
} from '@/api/reports'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VueGridLayout from 'vue-grid-layout';
import BarChart from './BarChart';
import PieChart from './PieChart';
import TimeSeries from './TimeSeries';
import {
    M
} from "@/api/index";
export default {
    components: {
        PulseLoader,
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        BarChart,
        PieChart,
        TimeSeries
    },
    props: ['ID'],
    data: function () {
        return {
            form: {
                xaxisa: [],
                type: '',
                xaxis: '',
                yaxis: '',
                ag: '',
                top10: '',
                title:'',
                tsType:''
            },
            layout: [],
            dialogFormVisible: false,
            sets: [],
            setName: '',
            selectedHeaderSet: [],
            rerender: true,
            headers: [],
            data: [],
            Hdata: [],
            oHeader: [],
            Hheaders: [],
            selectedSet: '',
            reportTableCurrentRows: 0,
            reportTableTotalRows: 1,
            reportStatus: null,
            loading: true,
            saveSetDialogVisible: false,
            chartSets: {},
        }
    },
    computed: {
        headerSelect() {
            return this.oHeader.map(function (v, i) {
                return {
                    'key': i,
                    'label': v
                }
            })
        }
    },
    watch: {
        ID: {
            immediate: true,
            handler() {
                this.headers = []
                this.data = []
                this.Hdata = []
                this.Hheaders = []
                this.oHeader = []
                this.sets = []
                this.reportTableCurrentRows = 0
                this.reportTableTotalRows = 1
                this.reportStatus = null
                this.loading = true
                this.reportStatus = ''
                this.rerender = false
                this.$nextTick(async () => {
                    await this.handleMounted();
                })
            }
        }
    },
    async mounted() {
        await this.handleMounted();
        let data = await this.getChartSets();
        if (data && data.data && data.data.sets) {
            this.chartSets = data.data.sets;
            this.selectedSet = (Object.keys(this.chartSets)[0])
            this.handleSetChange()
        }
    },
    methods: {
        async handleDelete() {
            if (this.layout && this.layout.length > 0) {
                this.layout.pop();
            } else {
                this.$confirm('Are you sure you want to delete selected set ?', 'Delete Set', {
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    type: 'success',
                    callback: async (action) => {
                        if (action === 'cancel') return;
                        let data = await M('deleteSet^MWR', {
                            set: this.selectedSet,
                            id: this.ID
                        })
                        if (data && data.data && data.data.result == 1) {
                            let cdata = await this.getChartSets();
                            if (cdata && cdata.data && cdata.data.sets) {
                                this.chartSets = cdata.data.sets;
                            } else {
                                 this.chartSets=[];
                            }
                            if (this.chartSets) {
                                this.selectedSet = (Object.keys(this.chartSets)[0])
                            }
                            this.handleSetChange()
                            this.$notify({
                                title: 'Success',
                                message: 'Chart Set Deleted!',
                                type: 'success'
                            });
                        } else {
                            this.$alert(data.data.result, 'Chart not deleted!', {
                                confirmButtonText: 'OK',
                            });
                        }

                    }
                });
                this.layout = this.layout || [];
            }

        },
        handleAddComponent() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let y = Number(this.layout[this.layout.length - 1] && this.layout[this.layout.length - 1].y || 0) + 1 || 1;
                    let x = 1
                    let i = Number(this.layout[this.layout.length - 1] && this.layout[this.layout.length - 1].i || 0) + 1 || 1
                    let w = 45
                    let h = 26
                    this.layout.push({
                        x,
                        y,
                        i,
                        w,
                        h,
                        xCol: this.form.xaxis,
                        yCol: this.form.yaxis,
                        xColA: this.form.xaxisa,
                        ag: this.form.ag,
                        top10: this.form.top10,
                        type: this.form.type,
                        title: this.form.title,
                        tsType:this.form.tsType
                    })
                } else {
                    this.$alert('Please fill in required fields', 'Warning!', {
                        confirmButtonText: 'OK',
                    });
                    return false;
                }
            });
            this.dialogFormVisible = false
        },
        getLayout() {},
        async handleSaveCurrentSet() {
            let data = await M('saveChartSet^MWR', {
                name: this.selectedSet,
                layout: this.layout,
                id: this.ID
            })

            if (data && data.data && data.data.result == 1) {
                let cdata = await this.getChartSets();
                if (cdata && cdata.data && cdata.data.sets) {
                    this.chartSets = cdata.data.sets;
                }
                this.$notify({
                    title: 'Success',
                    message: 'Chart Set Saved!',
                    type: 'success'
                });
            } else {
                this.$alert(data.data.result, 'Chart Set not Saved!', {
                    confirmButtonText: 'OK',
                });
            }
        },
        handleSetChange() {
            let set = this.selectedSet;
            let layout = this.chartSets[set];
            if (layout){
                this.$set(this.$data, 'layout', layout);
            } else {
                this.$set(this.$data, 'layout', []);
            }
       },
        async getChartSets() {
            return await M('getChartSets^MWR', {
                id: this.ID
            })
        },
        async handleSaveSet() {

            this.$prompt('Please choose a set name', 'Save Set', {
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
            }).then(async ({
                value
            }) => {
                if (!value) return;
                let data = await M('saveChartSet^MWR', {
                    name: value,
                    layout: this.layout,
                    id: this.ID
                })

                if (data && data.data && data.data.result == 1) {
                    let cdata = await this.getChartSets();
                    if (cdata && cdata.data && cdata.data.sets) {
                        this.chartSets = cdata.data.sets;
                    }
                    this.selectedSet = (value)
                    this.handleSetChange()
                    this.$notify({
                        title: 'Success',
                        message: 'Chart Set Saved!',
                        type: 'success'
                    });
                } else {
                    this.$alert(data.data.result, 'Chart Set not Saved!', {
                        confirmButtonText: 'OK',
                    });
                }
            }).catch(() => {

            })
        },
        layoutUpdatedEvent(newLayout) {
            this.$set(this.$data, 'layout', newLayout);
        },
        async handleMounted() {
            const vm = this
            this.headers = []
            this.data = []
            this.Hdata = []
            this.Hheaders = []
            this.reportTableCurrentRows = 0
            this.reportTableTotalRows = 1
            this.reportStatus = null
            this.loading = true
            this.reportStatus = 'RUNNING'
            const getReportData = async function () {
                let FULL = true;
                const Rdata = await getReportTable(vm.ID, vm.reportTableCurrentRows, FULL)
                vm.oHeader = Rdata.rows.oheaders
                vm.sets = Rdata.sets
                vm.reportTableCurrentRows = Rdata.reportTableCurrentRows
                vm.reportTableTotalRows = Rdata.reportTableTotalRows
                vm.Hheaders = Rdata.rows.headers
                vm.Hdata = vm.Hdata.concat(Rdata.rows.data)
                vm.reportStatus = Rdata.reportStatus
              if ( vm.$store.state.reports.cachedReports && vm.$store.state.reports.cachedReports[vm.ID]){
                   vm.loading = false
                    vm.headers = vm.oHeader
                    vm.data = vm.$store.state.reports.cachedReports[vm.ID]
                    vm.reportStatus = 'DONE';
                    return;
                }
                if (vm.reportStatus === 'DONE') {
                   vm.$store.dispatch('addCachedReport',{
                    ID:vm.ID,
                    data: vm.Hdata
                    });
                    vm.loading = false
                    vm.headers = vm.Hheaders
                    vm.data = vm.Hdata
                    return
                }
                setTimeout(async function () {
                    await getReportData()
                }, 5)
            }
            await getReportData()
        }
    }
}
</script>

<style>
</style>
