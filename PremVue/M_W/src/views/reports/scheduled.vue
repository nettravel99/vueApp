<template>
<el-card class="box-card" style="padding:5px" :body-style="{ padding: '0px' }">
    <div slot="header" class="clearfix">
        <span>Scheduled Reports</span>
        <el-button size="mini" @click="checkRunningStatus" :type="status?'success':'danger'" style="float:right">{{status?'RUNNING':'STOPPED'}}</el-button>
    </div>
    <el-row>
        <el-col :span="5" style="padding:10px;">
            <el-table style="padding:5px;width:100%" size="mini" :data="listTable" :height="400" @current-change="showDetails" highlight-current-row>
                <el-table-column prop="name" label="Groups">
                    <template slot="header" slot-scope="scope">
                        <span>Groups</span>
                        <div style="float:right">

                            <el-button style="padding:5px" size="mini" type="warning" icon="el-icon-tickets" circle @click="getReportPending"></el-button>
                            <el-button style="padding:5px" size="mini" type="success" icon="el-icon-refresh" circle @click="refreshMainList"></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <h3>{{list && list[selected] && list[selected][0]}}</h3><br>
            <div style="padding:20px;border: 1px solid grey">{{list[selected] && list[selected][4] && list[selected][4].split('\n')[0]}}
                <br><br> ***Run as Entity {{list[selected] && list[selected][8]}}</div>
            <h5>Add to current Group</h5>
            <el-input style="width:300px" size="mini" :disabled="newAddDisbled" placeholder="Add to group" v-model="newAddToGroup"></el-input>
            <el-button type="success" size="mini" :disabled="newAddDisbled" @click="onAdd">Add</el-button>
        </el-col>
        <el-col :span="5" style="padding:10px;border-left: 1px solid grey">
            <el-table-draggable>
                <el-table ref="detailTable" style="padding:5px;width:100%" size="mini" :data="detailListTable" :height="200" highlight-current-row @current-change="handleSelectionChange" @selection-change="handleSelectChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="name" label="Already in This Group">
                        <template slot="header" slot-scope="scope">
                            <span>Already in This Group</span>
                            <div style="float:right">
                                <el-button style="padding:5px" size="mini" type="primary" @click="saveList" icon="el-icon-check" circle></el-button>
                                <el-button :disabled="!(groupSelection &&groupSelection[selectedDetailedReport] && groupSelection[selectedDetailedReport][1])" style="padding:5px" size="mini" type="danger" icon="el-icon-close" circle @click="deleteReport"></el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-table-draggable>
            <br><br>
            <el-form :model="form" ref="form" size="mini" :inline="true" label-width="80px">

                <el-form-item label="Run" prop="run">
                    <el-select v-model="form.run" placeholder="Select Day" style="width:200px">
                        <el-option :label="'Daily'" :value="'D'">
                        </el-option>
                        <el-option :label="'Weekly'" :value="'W'">
                        </el-option>
                        <el-option :label="'Monthly'" :value="'M'">
                        </el-option>
                        <el-option :label="'Once'" :value="'O'">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="At" prop="at" label-width="80px">
                    <el-time-picker v-model="form.at" :format="'HH:mm A'" :value-format="'HH:mm A'" style="width:200px" placeholder="Select time"></el-time-picker>
                </el-form-item>

                <el-form-item v-if="form.run==='M' || form.run==='W' || form.run==='D'" label="StartDate" prop="startdate" label-width="80px">
                    <el-date-picker v-model="form.startdate" type="date" placeholder="Start Date" style="width:200px">
                    </el-date-picker>
                </el-form-item>

                <el-form-item v-if="form.run==='M' || form.run==='W' || form.run==='D'" label="EndDate" prop="enddate" label-width="80px">
                    <el-date-picker v-model="form.startend" type="date" placeholder="End Date" style="width:200px">
                    </el-date-picker>
                </el-form-item>

                <el-form-item v-if="form.run==='D'" label="Every" prop="every" label-width="80px">
                    <el-input-number v-model="form.every" :min="1" :max="1000" style="width:200px"></el-input-number> Days
                </el-form-item>
                <el-form-item v-if="form.run==='W'" label="Every" prop="weekevery" label-width="80px">
                    <el-input-number v-model="form.every" :min="1" :max="1000" style="width:200px"></el-input-number> Week
                </el-form-item>

                <el-form-item v-if="form.run==='W'" label="Weekdays" prop="dayweekevery" label-width="80px">

                    <el-select v-model="form.dayweekevery" placeholder="Select Day" style="width:200px" :multiple="true">
                        <el-option :label="'Monday'" :value="'1'">
                        </el-option>
                        <el-option :label="'Tuesday'" :value="'2'">
                        </el-option>
                        <el-option :label="'Wednesday'" :value="'3'">
                        </el-option>
                        <el-option :label="'Thursday'" :value="'4'">
                        </el-option>
                        <el-option :label="'Friday'" :value="'5'">
                        </el-option>
                        <el-option :label="'Saturday'" :value="'6'">
                        </el-option>
                        <el-option :label="'Sunday'" :value="'7'">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.run==='O'" label="Run On" prop="runonceday" label-width="80px">
                    <el-date-picker v-model="form.runonceday" type="date" placeholder="Run on Date" style="width:200px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="form.run==='M'" label=" " prop="daymonthly" label-width="80px">
                    <el-radio v-model="form.daymonthlyc" label="Day" style="width:80px"></el-radio>
                    <el-input-number :disabled="form.daymonthlyc !== 'Day'" v-model="form.daymonthlyd" :min="1" :max="1000" style="width:100px"></el-input-number> of the month
                </el-form-item>
                <el-form-item v-if="form.run==='M'" label=" " prop="bdayweekevery" label-width="80px">
                    <el-radio v-model="form.daymonthlyc" label="The" style="width:80px"></el-radio>

                    <el-select :disabled="form.daymonthlyc !== 'The'" v-model="form.bdayweekevery" placeholder="Select Day" style="width:190px">
                        <el-option :label="'first'" :value="'1'">
                        </el-option>
                        <el-option :label="'second'" :value="'2'">
                        </el-option>
                        <el-option :label="'third'" :value="'3'">
                        </el-option>
                        <el-option :label="'fourth'" :value="'4'">
                        </el-option>
                        <el-option :label="'last'" :value="'0'">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.run==='M'" label=" " prop="edayweekevery" label-width="80px">

                    <el-select :disabled="form.daymonthlyc !== 'The'" v-model="form.edayweekevery" placeholder="Select Day" style="width:120px">
                        <el-option :label="'Monday'" :value="'1'">
                        </el-option>
                        <el-option :label="'Tuesday'" :value="'2'">
                        </el-option>
                        <el-option :label="'Wednesday'" :value="'3'">
                        </el-option>
                        <el-option :label="'Thursday'" :value="'4'">
                        </el-option>
                        <el-option :label="'Friday'" :value="'5'">
                        </el-option>
                        <el-option :label="'Saturday'" :value="'6'">
                        </el-option>
                        <el-option :label="'Sunday'" :value="'7'">
                        </el-option>
                    </el-select> of the month
                </el-form-item>
                <el-form-item v-if="form.run==='M'" label=" " prop="smdayweekevery" label-width="80px">

                    <el-select v-model="form.smdayweekevery" placeholder="Select Month" style="width:190px" :multiple="true">
                        <el-option :label="'January'" :value="'1'">
                        </el-option>
                        <el-option :label="'Feburary'" :value="'2'">
                        </el-option>
                        <el-option :label="'March'" :value="'3'">
                        </el-option>
                        <el-option :label="'April'" :value="'4'">
                        </el-option>
                        <el-option :label="'May'" :value="'5'">
                        </el-option>
                        <el-option :label="'June'" :value="'6'">
                        </el-option>
                        <el-option :label="'July'" :value="'7'">
                        </el-option>
                        <el-option :label="'August'" :value="'8'">
                        </el-option>
                        <el-option :label="'September'" :value="'9'">
                        </el-option>
                        <el-option :label="'October'" :value="'10'">
                        </el-option>
                        <el-option :label="'November'" :value="'11'">
                        </el-option>
                        <el-option :label="'December'" :value="'12'">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" " v-if="false">
                    <el-radio v-model="form.pf" label="Printer">Printer</el-radio>
                    <el-radio v-model="form.pf" label="File">File</el-radio>
                </el-form-item>
                <br>
                <el-form-item label=" ">
                    <el-checkbox v-model="form.oexcel">Overwrite Excel File</el-checkbox>
                </el-form-item>
                <br>
                <el-form-item label=" ">
                    <el-checkbox v-model="form.ooutput">Overwrite Output File</el-checkbox>
                </el-form-item>
                <br>
                <el-form-item label=" ">
                    <el-input placeholder="Filename" v-model="form.file"></el-input>
                </el-form-item>
                <br>

                <el-form-item>
                    <el-checkbox v-model="form.suspend">Suspend Group</el-checkbox>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="danger" @click="handleDelete">Delete Group</el-button>
                    <el-button type="warning" @click="handleRunNow">Run Now</el-button>
                    <el-button type="primary" @click="newSelection">New</el-button>
                    <el-button type="success" @click="onSubmit">Save</el-button>
                </el-form-item>
            </el-form>

        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="12" class="report-form" style="border-left: 1px solid grey ;padding:10px;">
            <h4>{{groupSelection && groupSelection[selectedDetailedReport] && groupSelection[selectedDetailedReport][1]}}</h4>
            <ads-selections v-model="serializeForm" style="font-size:12px;min-height:50vh" :key="groupSelection[selectedDetailedReport][4]+'-'+TableKey" v-if="groupSelection &&  groupSelection[selectedDetailedReport] && groupSelection[selectedDetailedReport][4]" :selections="selections" :Settings="reportSettings" />
            <el-button style="float:right" size="mini" type="success" @click="saveSelections">Save Selections</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="4">

        </el-col>

    </el-row>

</el-card>
</template>

<script>
import {
    M
} from "@/api/index";
import AdsSelections from './selections/index';
import ElTableDraggable from 'element-ui-el-table-draggable';
export default {
    components: {
        AdsSelections,
        ElTableDraggable
    },
    data() {
        return {
            status: false,
            list: [],
            textBox: '',
            selected: 0,
            groupSelection: [],
            selectedDetailedReport: '',
            reportSettings: {},
            selections: [],
            TableKey: new Date().getTime(),
            serializeForm: '',
            repSelections: [],
            form: {
                every: 1
            },
            newAddToGroup: '',
            newAddDisbled: true
        }
    },
    watch: {
        reportName: {
            async handler(v) {
                if (!v) {
                    this.newAddDisbled = true;
                    return;
                }
                this.newAddToGroup = v;
                this.newAddDisbled = false;
            },
            immediate:true
        }
    },
    computed: {
        reportName() {
            return this.$store.state.reports.reportName;
        },

        listTable() {
            return this.list.map((item, index) => {
                return {
                    name: item[0],
                    id: index
                }
            });
        },
        detailListTable() {
            return this.groupSelection.map((item, index) => {
                return {
                    name: item[1],
                    id: index,
                    checked: item[5] == 1,
                    group: this.list[this.selected][0],
                    act: item[5]
                }
            });
        }
    },
    async created() {
        await this.checkRunningStatus()
        await this.getReportList();
        this.selectedDetailedReport = 0
        await this.getGroupSelection();
        this.toggleTable();
        await this.getReportSelections(0);
        this.initForm();
    },
    methods: {
        async onAdd() {
            let groupname = this.list[this.selected][0];
            let data = await M('onAdd^MWR', {
                groupname,
                prg: this.$store.state.reports.reportPRG,
                selections: this.$store.state.reports.formSerialized,
                name: this.newAddToGroup
            })
            if (data && data.data && data.data.result == 1) {
                this.$notify({
                    title: 'Success',
                    message: 'Report Added',
                    type: 'success'
                });
                await this.refreshMainList();
            } else {
                this.$alert(data.data.result, 'Group is not running!', {
                    confirmButtonText: 'OK',
                });
            }
        },
        async handleDelete() {
            this.$confirm('Are you sure you want to delete ' + this.list[this.selected][0], 'Warning', {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning',
                callback: async (action) => {
                    if (action === 'cancel') return
                    let groupname = this.list[this.selected][0];
                    let data = await M('deleteNow^MWR', {
                        groupname
                    })
                    if (data && data.data && data.data.result == 1) {
                        this.$notify({
                            title: 'Success',
                            message: 'Group Deleted',
                            type: 'success'
                        });

                    } else {
                        this.$alert(data.data.result, 'Group is not deleted!', {
                            confirmButtonText: 'OK',
                        });
                    }
                    await this.refreshMainList();
                }
            });

        },
        async handleRunNow() {
            let groupname = this.list[this.selected][0];
            let data = await M('runNow^MWR', {
                groupname
            })
            if (data && data.data && data.data.result == 1) {
                this.$notify({
                    title: 'Success',
                    message: 'Group Running',
                    type: 'success'
                });
            } else {
                this.$alert(data.data.result, 'Group is not running!', {
                    confirmButtonText: 'OK',
                });
            }
        },
        async newSelection() {
            this.$prompt('Please input new group name', 'New Group', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
            }).then(async ({
                value
            }) => {
                if (!value) {
                    this.$alert('Group name is required', 'Group not saved!', {
                        confirmButtonText: 'OK',
                    });
                }

                this.form.groupname = value
                this.form.act = !this.form.suspend ? '1' : '0';
                let data = await M('saveGroupDetails^MWR', this.form)
                if (data && data.data && data.data.result == 1) {
                    this.$notify({
                        title: 'Success',
                        message: 'Group Saved',
                        type: 'success'
                    });
                    await this.refreshMainList();
                } else {
                    this.$alert(data.data.result, 'Group not saved!', {
                        confirmButtonText: 'OK',
                    });
                }

            }).catch(() => {

            });
        },
        async onSubmit() {

            this.form.groupname = this.list[this.selected][0];
            this.form.act = !this.form.suspend ? '1' : '0';
            let data = await M('saveGroupDetails^MWR', this.form)
            if (data && data.data && data.data.result == 1) {
                this.$notify({
                    title: 'Success',
                    message: 'Group Saved',
                    type: 'success'
                });
                await this.refreshMainList();
            } else {
                this.$alert(data.data.result, 'Group not saved!', {
                    confirmButtonText: 'OK',
                });
            }
        },
        async refreshMainList() {
            this.groupSelection = [];
            await this.checkRunningStatus()
            await this.getReportList();
            await this.getGroupSelection();
            this.toggleTable();
            if (this.groupSelection) await this.getReportSelections(0);
            this.initForm();
        },
        initForm() {
            this.form = {
                run: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[1] || 'D',
                startdate: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[2] || '',
                enddate: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[3] || '',
                at: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[4] || '',
                every: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[5] || 1,
                dayweekevery: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[6].split(',') || [],
                daymonthlyd: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[7] || '',
                bdayweekevery: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[8] || '',
                edayweekevery: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[9] || '',
                smdayweekevery: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[10].split(',') || [],
                runonceday: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[11],
                daymonthlyc: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][4].split(String.fromCharCode(10))[7] ?
                    'Day' : 'The',
                suspend: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][3] === 1 ? false : true,
                file: this.list && this.list[this.selected] && this.list[this.selected][4] && this.list[this.selected][0],
                ooutput: this.list && this.list[this.selected] && this.list[this.selected][5] && this.list[this.selected][5].split(String.fromCharCode(10))[2],
                oexcel: this.list && this.list[this.selected] && this.list[this.selected][5] && this.list[this.selected][5].split(String.fromCharCode(10))[3],

            }
        },
        handleSelectChange(val) {
            this.repSelections = val;
        },
        async getReportPending() {
            let data = await M('getReportPending^MWR');
            if (data && data.data && data.data.pending) {
                this.$alert(data.data.pending, 'Pending', {
                    confirmButtonText: 'OK',
                });
            }
        },
        async deleteGroup() {
            this.$confirm(this.list[this.selected][0] + ' will be deleted. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(async () => {
                let data = await M('deleteSelections^MWR', {
                    group: this.list[this.selected][0],
                });
                if (data && data.data && data.data.result == 1) {
                    this.$notify({
                        title: 'Success',
                        message: 'Group Deleted',
                        type: 'success'
                    });
                    await this.refreshMainList();
                } else {
                    this.$notify({
                        title: 'Error',
                        message: 'Group not deleted',
                        type: 'warning'
                    });
                }
            }).catch(() => {
                this.$notify({
                    title: 'Error',
                    message: 'Group not deleted',
                    type: 'warning'
                });
            });
        },
        async deleteReport() {
            this.$confirm(this.groupSelection[this.selectedDetailedReport][1] + ' will be deleted. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(async () => {
                let data = await M('deleteReport^MWR', {
                    group: this.list[this.selected][0],
                    name: this.groupSelection[this.selectedDetailedReport][1]
                });
                if (data && data.data && data.data.result == 1) {
                    this.$notify({
                        title: 'Success',
                        message: 'Report Deleted',
                        type: 'success'
                    });
                    await this.refreshMainList();
                } else {
                    this.$notify({
                        title: 'Error',
                        message: 'Report not deleted',
                        type: 'warning'
                    });
                }
            }).catch(() => {
                this.$notify({
                    title: 'Error',
                    message: 'Report not deleted',
                    type: 'warning'
                });
            });
        },
        async saveSelections() {
            let data = await M('saveSelections^MWR', {
                name: this.groupSelection[this.selectedDetailedReport][1],
                group: this.list[this.selected][0],
                program: this.groupSelection[this.selectedDetailedReport][4],
                act: this.groupSelection[this.selectedDetailedReport][5],
                selections: this.serializeForm
            });
            if (data && data.data && data.data.result == 1) {
                this.$notify({
                    title: 'Success',
                    message: 'Report saved',
                    type: 'success'
                });
                await this.getGroupSelection();
                this.toggleTable();
                await this.getReportSelections(0);
            } else {
                this.$notify({
                    title: 'Error',
                    message: 'Report not saved',
                    type: 'warning'
                });
            }
        },
        async saveList() {
            let checked = [];
            this.repSelections.map((item) => {
                checked.push(item.id)
            })
            let out = this.groupSelection.map((item, index) => {
                return {
                    name: item[1],
                    id: index,
                    checked: checked.includes(index),
                    group: this.list[this.selected][0],
                    act: item[5]
                }
            });
            let out2 = checked.map((i) => {
                return {
                    name: out[i]['name'],
                    id: i,
                    checked: true,
                    group: this.list[this.selected][0],
                    act: out[i]['act']
                }
            })
            out.map((i) => {
                if (i.checked == false) {
                    out2.push(i);
                }
            })
            let data = await M('saveReportSet^MWR', out2);
            if (data && data.data && data.data.result == 1) {
                this.$notify({
                    title: 'Success',
                    message: 'Set saved',
                    type: 'success'
                });
                await this.getGroupSelection();
                this.toggleTable();
                await this.getReportSelections(0);
            } else {
                this.$notify({
                    title: 'Error',
                    message: 'Set not saved',
                    type: 'warning'
                });
            }
        },
        toggleTable() {
            this.detailListTable.map((item) => {
                if (item.checked) {
                    this.$refs.detailTable.toggleRowSelection(item, true)
                } else {
                    this.$refs.detailTable.toggleRowSelection(item, false)
                }
            })
        },
        async showDetails(row) {
            if (!row) return;
            this.selected = row.id;
            this.selectedDetailedReport = 0
            this.groupSelection = [];
            await this.checkRunningStatus()
            await this.getGroupSelection();
            this.toggleTable();
            if (this.groupSelection) await this.getReportSelections(0);
            this.initForm();
        },
        async checkRunningStatus() {
            let data = await M('GetSchReportStatus^MWR');
            if (data && data.data && data.data.status == true) {
                this.status = true
            } else {
                this.status = false;
            }
        },
        async getReportList() {
            let data = await M('GetSchReportList^MWR');
            if (data && data.data && data.data.list) {
                this.list = data.data.list;
            }
        },
        async handleSelectionChange(row) {
            if (!row) return;
            if (!(this.groupSelection && this.groupSelection[row.id] && this.groupSelection[row.id][4])) {
                this.selections = [];
                this.TableKey = new Date().getTime();
                return;
            }
            this.TableKey = new Date().getTime()
            this.selectedDetailedReport = row.id;
            await this.getReportSelections(row.id)
        },
        async getGroupSelection() {
            let selected = this.list[this.selected][0];
            let data = await M('getGroupSelection^MWR', {
                name: selected
            })
            if (data && data.data && data.data.groupList) {
                this.groupSelection = data.data.groupList
            }
        },
        async getReportSelections(i) {
            if (!(this.groupSelection && this.groupSelection[i] && this.groupSelection[i][4])) {
                return
            }
            let program = this.groupSelection[i][4];
            let selections = this.groupSelection[i][6];
            let data = await M('getSchReportSelections^MWR', {
                report: program,
                selections
            })
            this.reportSettings = data.reportSettings;
            this.selections = data.selections
            this.TableKey = new Date().getTime();
        }
    }
}
</script>

<style>
tr.current-row td {
    border-top: 1px solid black !important;
    border-bottom: 1px solid black !important;
}

.el-card__header {
    padding: 5px 5px;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.report-form {
    min-width: 200px;
    max-width: 980px;
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

th.el-table_2_column_3,
th.el-table_1_column_1 {
    font-size: 13px !important;
    font-weight: 800;
}
</style>
