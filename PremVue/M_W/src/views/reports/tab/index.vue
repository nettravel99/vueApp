<template>
<div class="tab-container" :ref="appRef">
    <el-card shadow="never" class="text">
        <el-tabs v-model="activeName" :before-leave="handleTabChange">
            <el-tab-pane :label="$route.meta.title" name="selections" lazy>
                <div class="app-container">
                    <slot></slot>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Report" name="report" lazy :disabled="reportStatus!=='DONE'">
                <el-row :gutter="0">
                    <el-col :span="3" v-if="reportStatus === 'RUNNING'">
                        <PulseLoader :loading="reportStatus === 'RUNNING'" size="5px" />
                    </el-col>
                    <el-col :span="4" v-if="!hideButtons">

                        <el-button type="info" size="mini" round v-if="reportStatus=='DONE'">
                            <el-tooltip content="Download Report as a PDF" placement="top" effect="light">
                                <a :href="'pdf^mwr?SES='+token+'&EXT=TXT&ID='+reportID">
                                    <b>
                                        <i class="el-icon-download"></i>
                                    </b>
                                </a>
                            </el-tooltip>
                        </el-button>

                        <el-button type="info" size="mini" round v-if="reportStatus=='DONE'" @click="printWindow">
                            <el-tooltip content="Print Current Screen" placement="top" effect="light">
                                <i class="el-icon-printer"></i>
                            </el-tooltip>
                        </el-button>

                    </el-col>
                    <el-col :span="9">
                        <el-pagination v-if="!hideButtons" :class="'pagination_extra'" :page-size="1" :current-page.sync="reportTextCurrentPage" layout="prev, pager, next, jumper, total" :total="reportTextTotalPages" @current-change="handlePageText" :pager-count="5"></el-pagination>
                    </el-col>
                </el-row>
                <el-card class="report-body text">
                    <el-row>
                        <el-col :span="24" :gutter="0">
                            <TableViewer :value="reportText" :ID="reportID" :key="'report'+reportID" v-if="showTable" ref="TableViewer"></TableViewer>
                        </el-col>
                    </el-row>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="Table" name="table" lazy :disabled="reportStatus!=='DONE' || Excel == 0">
                <el-card class="report-body text">
                    <!-- <TableViewer :value="reportTable"></TableViewer> -->
                    <el-row>
                        <el-col :span="24" :gutter="0">
                            <Handsontable :ID="reportID" :key="'table'+reportID" v-if="reportStatus==='DONE'"></Handsontable>
                        </el-col>
                    </el-row>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="Charts" name="charts" lazy :disabled="reportStatus!=='DONE' || Excel == 0">
                <el-card class="report-body text">
                    <TableGraph :ID="reportID" :key="'tablegraph'+reportID" v-if="reportStatus=='DONE'"></TableGraph>
                </el-card>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="Response" :visible.sync="sendDialog">
            <el-card :body-style="{ padding: '0px' }">
                <pre>{{sendResp}}</pre>
            </el-card>

        </el-dialog>
    </el-card>
</div>
</template>

<script>
/*
      <el-card :style="{'max-height':'400px','overflow':'scroll'}">
         <TableViewer :value="reportText"></TableViewer>
        <pre>
{{JSON.stringify(selectionsForm,null,1)}}{{ JSON.stringify(selections,null,1)}}{{ JSON.stringify(reportSettings,null,1)}}
     </pre>
      </el-card>

S @r@("reportTextCurrentPage")= 1

S @r@("reportTextTotalPages")=$S(+$O(^TKAAREPORTSG(+$H,"DATA",ID,EXT,""),-1):$O(^TKAAREPORTSG(+$H,"DATA",ID,EXT,""),-1),1:1)

S @r@("reportStatus")=($G(^TKAAREPORTSG(+$H,"DATA",ID))="DONE")
*/
import moment from "moment";
import {
    Loading
} from 'element-ui';
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import {
    mapGetters
} from "vuex";
import "github-markdown-css";
import {
    getReportSelections,
    runReport,
    remoteLookup,
    getReportTextByID,
    getReportPagesByID,
    getReportTextByIdPage
} from "@/api/reports";
import {
    M
} from "@/api/index";
import TableViewer from "../../../components/TableViewer/index";
import Handsontable from "../../../components/Handsontable/index";
import TableGraph from "../../../components/TableGraph/index";
import AdsDateInput from '@/components/AdsDateInput/index';
import AdsInputTable from '@/components/AdsInputTable/index'
export default {
    name: "Tab",
    components: {
        TableViewer,
        PulseLoader,
        Handsontable,
        TableGraph,
        AdsDateInput,
        AdsInputTable
        // Debug,
    },
    props: ['PROG', 'SERIALIZEFORM', 'ID', 'noSchBTN', 'killLoad', 'setSelectedTab'],
    data() {
        return {
            extraValues: [],
            showTable: true,
            selectedTab: 'selections',
            appRef: this.randID(),
            activeName: "selections",
            reportText: "",
            reportTable: "",
            reportTextCurrentPage: 0,
            reportTextTotalPages: 0,
            reportStatus: 0,
            Excel: 0,
            iframeHeight: window.innerHeight,
            hideButtons: false,
            selections: [],
            reportID: null,
            selectionsString: null,
            reportPRG: null,
            repLoading: false,
            reportSettings: {},
            selectionsForm: {},
            options: {},
            lookupLoading: false,
            reportRef: null,
            broswerOnly: false,
            runPreview: 0,
            allRequiredGood: false,
            SubmitInfo: null,
            submitted: false,
            sendingFile: false,
            sendResp: '',
            sendDialog: false,
        };
    },
    watch: {
        sendingFile(v) {
            if (v) {
                Loading.service({
                    lock: true,
                    text: 'Sending...',
                    spinner: 'el-icon-loading',
                    background:'rgba(0, 0, 0, 0.8)'
                })
            } else {
                 Loading.service().close();
            }
        },
        async SubmitInfo(v) {
            if (!this.submitted && v.indexOf(":") > -1) {
                this.$confirm('Submit File?', '', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(async () => {
                    await this.handleFileSend(v);
                    this.submitted = true;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Submit cancelled'
                    });
                });
            }
        },

        setSelectedTab(val) {
            this.selectedTab = val;
        },
        selectionsForm: {
            immediate: true,
            deep: true,
            handler(selectionsForm) {
                let required = false;
                this.selections.map((selection) => {
                    if (selection.definition[1].length > 1 && this.required(selection) && (!selectionsForm['F' + selection.id]['V0'] && !selectionsForm['F' + selection.id]['V0'].length || !selectionsForm['F' + selection.id]['V0'])) {
                        required = true;
                    }

                    selection.definition[2].map((textbox, oindex) => {
                        if (this.required(textbox) && (selectionsForm['F' + selection.id]['V1']['SV' + oindex] && !selectionsForm['F' + selection.id]['V1']['SV' + oindex].length || !selectionsForm['F' + selection.id]['V1']['SV' + oindex]) && (selection.definition[3][0] && selectionsForm['F' + selection.id]['V0'] !== selection.definition[3][0] || !selection.definition[3][0])) {
                            required = true;
                        }

                    })

                })
                this.allRequiredGood = !required;
            }
        }
    },
    methods: {
        async handleFileSend(keys) {
            let prog = this.$route.meta.PROG || this.PROG;
            let form = prog.split('!')[2];
            this.sendingFile = true;
            let data = await M('SendFile^MWSUB', {
                form: form,
                keys: keys
            })
            this.sendingFile = false;
            this.sendResp = data.data;

            if (this.sendResp[0] == 1) {
                this.$alert(this.sendResp, '', {
                    type: 'success'
                })
            } else {
                this.$alert(this.sendResp, '', {
                    type: 'error'
                })
            }

            //this.sendDialog = true;
        },
        required(frame) {
            if (frame.frame) return frame.frame.split('|')[3].split('�')[5] === "Y";
            return typeof frame === 'string' && frame.split(":")[2] === 'Y';
        },
        handleTabChange(newVal) {
            this.selectedTab = newVal;
        },
        async onRun() {
            this.runPreview = 1;
            await this.onSubmit();
        },
        async onPreview() {
            this.runPreview = 0;
            await this.onSubmit();
        },
        printWindow() {
            this.hideButtons = true;
            this.$nextTick(() => {
                window.print();
                this.hideButtons = false;
            });
        },
        async handlePageText(PAGENO) {
            let vm = this;
            let data = await getReportTextByIdPage(vm.reportID, PAGENO);
            vm.reportText = data.reportText;
        },
        randID() {
            var text = "";
            var possible =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        },
        shallowLen(obj) {
            if (!obj.hasOwnProperty("F1")) {
                return 0;
            }
            let count = 1;
            while (obj.hasOwnProperty("F" + count)) {
                count = count + 1;
            }
            return count;
        },
        async onSubmit() {
            if (!this.ID) return;
            let ref = "ReportSelections" + this.reportRef;
            this.$refs[ref].validate(async valid => {
                if (valid) {
                    this.repLoading = true;
                    this.showTable = false;
                    let md = await runReport(
                        this.reportPRG,
                        this.serializeForm,
                        "",
                        "",
                        this.runPreview
                    );
                    if (md && md.prompt) {
                        this.showTable = true;
                        let message = md.prompt;
                        this.repLoading = false;
                        let response = await this.$confirm(message, "Medics Reports", {
                            confirmButtonText: "OK",
                            cancelButtonText: "Cancel",
                            type: "warning"
                        });
                        if (response === "confirm") {
                            await M("propmtResponse^MWR", {
                                ID: md.reportID
                            });

                            let ndata = await runReport(
                                this.reportPRG,
                                this.serializeForm,
                                md.reportID
                            );
                            this.$nextTick(async () => {
                                this.reportID = ndata.reportID;
                                this.reportTextCurrentPage = 1;
                                await this.handleOnMounted();
                                this.showTable = true;
                                this.activeName = "report";
                            });
                            return;
                        } else {
                            return;
                        }
                    } else if (md && md.alert) {
                        this.repLoading = false;
                        this.$alert(md.alert, "Medics Reports", {
                            confirmButtonText: "OK",
                            callback: () => {}
                        });
                        return;
                    }

                    this.$nextTick(async () => {
                        this.reportID = md.reportID;
                        this.reportTextCurrentPage = 1;
                        await this.handleOnMounted();
                        this.showTable = true;
                        this.activeName = "report";
                    });
                } else {
                    //console.log("error submit!!");
                    return false;
                }
            });
        },
        onClear() {
            let ref = "ReportSelections" + this.reportRef;
            this.$refs[ref].resetFields();
            let field = 1;
            Object.keys(this.selectionsForm).map(Field => {
                let key = 0;
                Object.keys(Field).map(selection => {
                    let subkey = 0;
                    if (typeof selection === "string") {
                        this.selectionsForm["F" + field]["V" + key] = "";
                    } else {
                        Object.keys(selection).map(subSel => {
                            if (typeof subSel === "string") {
                                this.selectionsForm["F" + field]["V" + key]["SV" + subkey] = "";
                            } else {
                                this.selectionsForm["F" + field]["V" + key]["SV" + subkey] = [];
                            }
                            subkey = subkey + 1;
                        });
                    }
                    key = key + 1;
                });
                field = field + 1;
            });
            Object.keys(this.options).map(optionKey => {
                this.options[optionKey] = [];
            });
        },
        remoteQueryLookup(currentValue, lookupType, id, finx, query) {
            let vm = this;
            vm.lookupLoading = true;
            remoteLookup({
                currentValue,
                lookupType,
                query
            }).then(function (data) {
                vm.options[id]["V1"]["SV" + finx] = data.data;
                vm.lookupLoading = false;
            });
        },
        querySearchAsyncLookup() {},
        getTextBoxFrameWidth(box, boxes) {
            if (boxes.length < 2) {
                return 360;
            } else if (box.split(":")[1] == 6) {
                return 180;
            } else if (box.split(":")[1] == 20) {
                return 50;
            } else {
                return box.split(":")[4] * 18;
            }
        },
        getFrameTitle(selection) {
            return selection.definition[0][0].split("^")[1] &&
                selection.definition[0][0].split("^")[1].length ?
                selection.definition[0][0].split("^")[1] :
                selection.definition[0][0].split("^")[0];
        },
        getFrameLabel(selection) {
            return selection.definition[0][0].split("^")[0].length > 24 ?
                selection.definition[0][0].split("^")[0].substring(0, 20) + "..." :
                selection.definition[0][0].split("^")[0];
        },
        padText(text, len, pad) {
            let padding = pad.repeat(len);
            return (text + padding).substring(0, len);
        },
        array_move(arr, old_index, new_index) {
            while (old_index < 0) {
                old_index += arr.length;
            }
            while (new_index < 0) {
                new_index += arr.length;
            }
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing purposes
        },
        async handleForm() {
            let _vm = this;
            await this.$nextTick()
            let data = await getReportSelections(this.$route.meta.PROG || this.PROG);
            if (data.reportSettings && data.reportSettings.BROWSERONLY) {
                _vm.broswerOnly = true;
            }
            if (data.reportSettings && data.reportSettings.EXCEL == 1) {
                _vm.Excel = 1;
            }
            if (data.reportSettings && data.reportSettings.MOVEFRAME && typeof (data.reportSettings.MOVEFRAME) === 'string') {
                let positions = data.reportSettings.MOVEFRAME.split(",");
                positions.forEach(position => {
                    data.selections = this.array_move(
                        data.selections,
                        position.split("-")[0] - 1,
                        position.split("-")[1] - 1
                    );
                });
            }
            let prepareForm = {};
            data &&
                data.selections &&
                data.selections.forEach(function (selection) {
                    prepareForm["F" + selection.id] = {};
                    let mainDelmiter =
                        selection.definition[3][4] &&
                        selection.definition[3][4].split('"')[1];
                    let subDelimiter =
                        selection.definition[2][0].split(":")[7] &&
                        selection.definition[2][0].split(":")[7].split('"')[1];
                    let values = selection.value;
                    if (
                        typeof selection.value === "string" &&
                        selection.value.indexOf(mainDelmiter) > -1
                    ) {
                        values = selection.value.split(mainDelmiter);
                    } else {
                        values = values + mainDelmiter || "^";
                        values = values.split(mainDelmiter);
                    }
                    if (
                        selection.definition[2][0].split(":")[1] == 6 &&
                        values[1] &&
                        values[1].length == 1
                    ) {
                        //console.log('values[1]',values[1])
                        let val = values[1];
                        if (val) {
                            //console.log('before date => ',val);
                            if (val.indexOf("T") > -1 && val.indexOf("+") > -1) {
                                let startdate = moment();
                                startdate = startdate.subtract(val.split("+")[1], "days");
                                startdate = startdate.format("MM/DD/YYYY");
                                val = startdate;
                            } else if (val.indexOf("T") > -1 && val.indexOf("-") > -1) {
                                let startdate = moment();
                                startdate = startdate.subtract(val.split("-")[1], "days");
                                startdate = startdate.format("MM/DD/YYYY");
                                val = startdate;
                            } else if (val.indexOf("T") > -1) {
                                let startdate = moment();
                                //startdate = startdate.subtract(1, "days");
                                startdate = startdate.format("MM/DD/YYYY");
                                val = startdate;
                            }
                            // prepareForm["F" + selection.id]["V1"]["SV" + 0]= val ;
                            values[1] = val;
                        }
                    }
                    prepareForm["F" + selection.id]["V0"] = values[0];
                    prepareForm["F" + selection.id]["V1"] = {};
                    _vm.$set(_vm.options, {});
                    _vm.options[selection.id] = {};
                    _vm.options[selection.id]["V1"] = {};
                    if (
                        values[1] &&
                        values[1].length > 1 &&
                        subDelimiter &&
                        subDelimiter.length
                    ) {
                        //console.log('values[1]',values[1]);
                        //let __values = [];
                        values[1].split(subDelimiter).forEach(function (val, indx) {
                            if (val) {
                                //console.log('before date => ',val);
                                prepareForm["F" + selection.id]["V1"]["SV" + indx] = val;
                                if (val.indexOf("T") > -1 && val.indexOf("+") > -1) {
                                    let startdate = moment();
                                    startdate = startdate.subtract(val.split("+")[1], "days");
                                    startdate = startdate.format("MM/DD/YYYY");
                                    val = startdate;
                                } else if (val.indexOf("T") > -1 && val.indexOf("-") > -1) {
                                    let startdate = moment();
                                    startdate = startdate.subtract(val.split("-")[1], "days");
                                    startdate = startdate.format("MM/DD/YYYY");
                                    val = startdate;
                                } else if (val.indexOf("T") > -1) {
                                    let startdate = moment();
                                    //startdate = startdate.subtract(1, "days");
                                    startdate = startdate.format("MM/DD/YYYY");
                                    val = startdate;
                                }
                                //var date = moment(new Date(val));
                                //console.log('after date => ',val,date.isValid());
                                //__values.push(val)
                                if (!val) val = undefined;
                                prepareForm["F" + selection.id]["V1"]["SV" + indx] = val;
                            }
                            _vm.options[selection.id]["V1"]["SV" + indx] = [];
                        });
                    } else {
                        prepareForm["F" + selection.id]["V1"]["SV0"] =
                            typeof values[1] === "string" &&
                            values[1].indexOf(",") > -1 &&
                            selection.definition[2][0].split(":")[6] ?
                            values[1].split(",") :
                            selection.definition[2][0].split(":")[6] && !!values[1] ? [values[1]] :
                            values[1] && values[1] !== "," ?
                            values[1] :
                            null;
                        _vm.options[selection.id]["V1"]["SV0"] = [];
                    }
                });
            this.selectionsForm = prepareForm;
            this.selections = data.selections;
            this.reportSettings = data.reportSettings;
            this.selectionsString = data.selectionsString;
            this.extraValues = data.ExtraValues
            this.reportPRG = this.$route.meta.PROG || this.PROG;
        },
        async handleOnMounted() {
            if (!this.ID) return;
            let vm = this;
            vm.reportStatus = 'RUNNING';
            let data2 = await getReportTextByID(vm.reportID);
            vm.reportText = data2.reportText;
            vm.reportTable = data2.reportTable;
            vm.reportTextCurrentPage = data2.reportTextCurrentPage;
            vm.reportTextTotalPages = data2.reportTextTotalPages;
            vm.reportStatus = data2.reportStatus;
            vm.Excel = data2.EXCEL;
            vm.SubmitInfo = data2.SubmitInfo;
            let getReportData = async function () {
                let data = await getReportPagesByID(vm.reportID);
                vm.reportTextTotalPages = data.reportTextTotalPages;
                vm.reportStatus = data.reportStatus;
                if (vm.reportStatus === "DONE") {
                    vm.repLoading = false;
                    vm.$emit('repLoaded', true);
                    vm.selectedTab = 'report'
                    vm.activeName = "report";
                    return;
                }
                setTimeout(async function () {
                    await getReportData();
                }, 1000);
            };
            /*
            let initalData = await getReportTextByIdPage(vm.ID, 1);
            vm.reportText = initalData.reportText;
            */
            await getReportData();
        }
    },
    created() {
        if (this.killLoad) {
            // Loading.service().close();
            if (this.$store.state.app.appLoading === true) {
                Loading.service().close();
            }
        }
    },
    async mounted() {

        this.reportID = this.ID;
        await this.handleOnMounted();
        let _vm = this;
        await this.$nextTick();
        let data = await getReportSelections(this.$route.meta.PROG || this.PROG);
        if (data.reportSettings && data.reportSettings.BROWSERONLY) {
            _vm.broswerOnly = true;
        }
        if (data.reportSettings && data.reportSettings.EXCEL == 1) {
            _vm.Excel = 1;
        }
        if (this.$route.meta.NAME !== 'Process Reconciliation') {
            let PROG = this.$route.meta.PROG || this.PROG;
            if (PROG.indexOf('!') > -1) _vm.Excel = false;
        }

        if (data.reportSettings && data.reportSettings.MOVEFRAME && typeof (data.reportSettings.MOVEFRAME) === 'string') {
            let positions = data.reportSettings.MOVEFRAME.split(",");
            positions.forEach(position => {
                data.selections = this.array_move(
                    data.selections,
                    position.split("-")[0] - 1,
                    position.split("-")[1] - 1
                );
            });
        }
        let prepareForm = {};
        data &&
            data.selections &&
            data.selections.forEach(function (selection) {
                prepareForm["F" + selection.id] = {};
                let mainDelmiter =
                    selection.definition[3][4] &&
                    selection.definition[3][4].split('"')[1];
                let subDelimiter =
                    selection.definition[2][0].split(":")[7] &&
                    selection.definition[2][0].split(":")[7].split('"')[1];
                let values = selection.value;
                if (
                    typeof selection.value === "string" &&
                    selection.value.indexOf(mainDelmiter) > -1
                ) {
                    values = selection.value.split(mainDelmiter);
                } else {
                    values = values + mainDelmiter || "^";
                    values = values.split(mainDelmiter);
                }
                prepareForm["F" + selection.id]["V0"] = values[0];
                prepareForm["F" + selection.id]["V1"] = {};
                _vm.$set(_vm.options, {});
                _vm.options[selection.id] = {};
                _vm.options[selection.id]["V1"] = {};
                if (
                    values[1] &&
                    values[1].length > 1 &&
                    subDelimiter &&
                    subDelimiter.length
                ) {
                    values[1].split(subDelimiter).forEach(function (val, indx) {
                        if (val) {
                            prepareForm["F" + selection.id]["V1"]["SV" + indx] = val;
                            if (!val) val = undefined;
                            prepareForm["F" + selection.id]["V1"]["SV" + indx] = val;
                        }
                        _vm.options[selection.id]["V1"]["SV" + indx] = [];
                    });
                } else {
                    prepareForm["F" + selection.id]["V1"]["SV0"] =
                        typeof values[1] === "string" &&
                        values[1].indexOf(",") > -1 &&
                        selection.definition[2][0].split(":")[6] ?
                        values[1].split(",") :
                        selection.definition[2][0].split(":")[6] && !!values[1] ? [values[1]] :
                        values[1] && values[1] !== "," ?
                        values[1] :
                        null;
                    _vm.options[selection.id]["V1"]["SV0"] = [];
                }
            });
        this.selectionsForm = prepareForm;
        this.selections = data.selections;
        this.reportSettings = data.reportSettings;
        this.extraValues = data.ExtraValues
        this.selectionsString = data.selectionsString;
        this.reportPRG = this.$route.meta.PROG || this.PROG;

    },
    computed: {
        ...mapGetters(["token"]),
        serializeForm: {
            get() {
                if (this.SERIALIZEFORM) return this.SERIALIZEFORM;
                let out = [];
                let frameCount = 0;
                let vm = this;
                for (const scratchFrame in vm.selectionsForm) {
                    if (scratchFrame) {
                        frameCount = frameCount + 1;
                    }
                    let frame = vm.selectionsForm["F" + frameCount];
                    let outFrame = {};
                    outFrame.V0 = frame.V0;
                    outFrame.V1 = [];
                    if (frame.V1 && typeof frame.V1 === "object") {
                        let subFrameCount = -1;
                        for (const scratchSubFrame in frame.V1) {
                            if (scratchSubFrame) {
                                subFrameCount = subFrameCount + 1;
                            }
                            let subFrame = frame["V1"]["SV" + subFrameCount];
                            if (subFrame && typeof subFrame === "string") {
                                outFrame.V1.push(subFrame);
                            } else if (subFrame && typeof subFrame === "object") {
                                outFrame.V1.push(subFrame.join(","));
                            }
                        }
                        if (outFrame.V1.length > 1) {
                            outFrame.V1S =
                                vm.selections[Number(frameCount - 1)].definition[2][0].split(
                                    ":"
                                )[7] &&
                                vm.selections[Number(frameCount - 1)].definition[2][0]
                                .split(":")[7]
                                .split('"')[1];
                        }
                    }
                    out.push(outFrame);
                }
                let selections = [];
                for (const selection of out) {
                    let del = selection.V1S || ",";
                    let V1 =
                        selection.V1.length > 1 ? selection.V1.join(del) : selection.V1[0];
                    selections.push(V1 ? [selection.V0, V1].join("^") : [selection.V0]);
                }
                selections.push("");
                return selections.join(":");
            }
        }
    }
};
</script>

<style>
.input-required>input,
.input-required>div>input,
.input-required>label>span>span {
    background-color: #B7DBFF;
    background: #B7DBFF;
}
</style>
