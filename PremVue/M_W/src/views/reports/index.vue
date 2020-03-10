<template>
  <el-card
      v-loading="repLoading"
      :element-loading-text="'Running...' + ($route.meta.NAME || '')"
      element-loading-spinner="el-icon-loading"
      :element-loading-lock="true"
    >
    <div class="h_iframe">
      <iframe
        v-if="reportID && broswerOnly"
        :key="'ifrm-'+reportID"
        :id="'ifrm-'+reportID"
        :src="'/premier/boreport^mwr?SES='+token+'&EXT=TXT&ID='+reportID"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <Tab v-if="!broswerOnly" v-on:repLoaded="handleRepLoaded" :ID="reportID" :key="reportID" :PROG="PROG" :SERIALIZEFORM="SERIALIZEFORM" :noSchBTN="noSchBTN" :killLoad="killLoad" :setSelectedTab="selectedTab">
    <el-card
      :key="'header-div'"
    >
  
      <el-form
        :ref="'ReportSelections'+reportRef"
        :model="selectionsForm"
        label-width="150px"
        size="mini"
        class="report-form"
        :label-position="'left'"
      >
        <el-form-item
          v-for="(selection,index) in selections"
          :key="'FI'+index"
        >
          <div
            v-if="selection && selection.definition"
            slot="label"
            :title="getFrameTitle(selection)"
          >{{getFrameLabel(selection)}}</div>
          <ads-input-table v-if="selection.definition[4] && selection.definition[4][0] && selection.definition[4][0].indexOf('\t') > -1"
            :extraValues="extraValues"
            :frame="selection.definition[4][0]"
            v-model="selectionsForm['F'+selection.id]['V0']"
            ></ads-input-table>
          <el-radio-group
            v-if="selection.definition[1].length > 1"
            :key="randID() + '-'+new Date().getTime()"
            v-model="selectionsForm['F'+selection.id]['V0']"
            :style="{width:'360px'}"
            :class="{'input-required':required(selection) && (selectionsForm['F'+selection.id]['V0'] && !selectionsForm['F'+selection.id]['V0'].length || !selectionsForm['F'+selection.id]['V0'])}"
          >
            <el-radio
              :style="{width:'90px'}"
              v-for="(option,oindex) in selection.definition[1]"
              v-show="option.split(':')[0][0] !== String.fromCharCode(65533)"
              :key="reportID + 'FI0'+index+'o'+oindex+'-'+randID() +'-' +new Date().getTime()"
              :title="option.split(':')[0]"
              :label="option.split(':')[1]"
            >
              {{(option.split(':')[0].length > 12)
              ? (option.split(':')[0].substring(0,11))
              : ( option.split(':')[0] ) }}
            </el-radio>
          </el-radio-group>
          <!--
          <div
            v-if="selection.definition[1].length <=1 &&!noSchBTN"
            :style="{'width': '360px',display: 'inline-block'}"
          ></div>
          -->
          <component
            :class="{'input-required':required(textbox) && ( selectionsForm['F'+selection.id]['V1']['SV'+oindex] && !selectionsForm['F'+selection.id]['V1']['SV'+oindex].length || !selectionsForm['F'+selection.id]['V1']['SV'+oindex] ) && ( selection.definition[3][0] && selectionsForm['F'+selection.id]['V0'] !== selection.definition[3][0] || !selection.definition[3][0]) }"
            v-for="(textbox,oindex) in selection.definition[2]"
            :key="'tb'+oindex"
            :id ="'tb'+oindex"
            :is="textbox.split(':')[6]
            ? 'el-select'
            : textbox.split(':')[1] == 6
            ? 'el-date-picker'
            : 'el-input'"
            :multiple="textbox.split(':')[6]
            ? true
            : null"
            :multiple-limit="(textbox.split(':')[6] && Number(textbox.split(':')[5]) > 0 )? Number(textbox.split(':')[5]) : null"
            v-model = "selectionsForm['F'+selection.id]['V1']['SV'+oindex]"
            :style="{width: getTextBoxFrameWidth(textbox,selection.definition[2]) + 'px','max-width':'360px'}"
            v-show="!!textbox[0]"
            size="mini"
            :type="textbox.split(':')[1] == 6
            ? 'date'
            : textbox.split(':')[1] == 3 || textbox.split(':')[1] == 4 || textbox.split(':')[1] == 5 || textbox.split(':')[1] == 29
            ? 'number'
            :null"
            :format="textbox.split(':')[1] == 6
            ? 'MM/dd/yyyy' :undefined"
            :value-format="textbox.split(':')[1] == 6
            ? 'MM/dd/yyyy' :undefined"
            :placeholder="textbox.split(':')[1] == 6
            ? textbox.split(':')[0]
            : textbox.split(':')[6]
            ? ('Select ' + textbox.split(':')[6].split('^')[1] && textbox.split(':')[6].split('^')[1] || '')
            : null "
            :disabled="!!selection.definition[3][0] && selectionsForm['F'+selection.id]['V0'] === selection.definition[3][0]"
            clearable
            :collapse-tags="textbox.split(':')[6] && selectionsForm['F'+selection.id]['V1']['SV'+oindex] && selectionsForm['F'+selection.id]['V1']['SV'+oindex].length>5
            ? true
            : null"
            :filterable="textbox.split(':')[6] ? true :false"
            :remote="textbox.split(':')[6] ? true :false"
            :remote-method="textbox.split(':')[6] ? remoteQueryLookup.bind(null,selectionsForm['F'+selection.id]['V1']['SV'+oindex],textbox.split(':')[6],selection.id,oindex ) :false"
            :loading="textbox.split(':')[6] ? lookupLoading : false"
            @focus="textbox.split(':')[6] ? remoteQueryLookup(selectionsForm['F'+selection.id]['V1']['SV'+oindex] || ' ',textbox.split(':')[6],selection.id,oindex ):null"
          >
            <template slot="prepend" v-if="!!textbox.split(':')[0]">{{textbox.split(':')[0]}}</template>
            <template v-if="textbox.split(':')[6]" :id="'tb'+index+'opts'+'-'+randID()">
              <el-option
                v-for="(item,index) in options[selection.id]['V1']['SV'+oindex]"
                :key="'SelectOptions'+index+'-'+new Date().getTime()"
                :label="item.value"
                :value="item.value"
                :title="item.title"
              >
                <b>{{item.value}}&nbsp;</b>
                {{item.label}}
              </el-option>
            </template>
          </component>
        </el-form-item>
        <el-form-item>
        </el-form-item>
          <el-button type="primary"  v-if="!noSchBTN && reportPRG && reportPRG.indexOf('!')<0 " @click="setSchReport" size="mini" >Schedule Report</el-button>
          <el-button type="primary" v-if="this.$route.meta.NAME === 'Process Reconciliation' && this.$route.meta.PROG.indexOf('!')>-1" :loading="gettingFile" @click="downloadFromCarrier" size="mini" >Download from Carrier</el-button>
          <el-button size="mini"  :disabled="!allRequiredGood" v-if="typeof(reportPRG)==='string' && reportPRG && reportPRG.indexOf('!')>-1"   type="primary" @click.prevent="handleOnSubmit">Check/Preview</el-button>
          <el-button size="mini"  :disabled="!allRequiredGood" type="primary" @click.prevent="handleOnRun">Run</el-button>
          <ElCheckbox v-if="submitAtOnceButton" label="Submit At Once" v-model="submitAtOnceVal"></ElCheckbox>
          <slot></slot>
            <!--
            <Debug title="Debug" type="warning" size="mini">
            <JsonEditor
              :style="{'text-align': 'left'}"
              :value="{
             'reportSettings':reportSettings  
            ,'Form String      ':serializeForm  
            ,'SS-Length':Object.keys(selectionsForm).length
            ,'Selections-String':selectionsString
            ,'selectionsForm':selectionsForm
            }"
              style="max-height:65vh;overflow:scroll"
            ></JsonEditor>
          </Debug>
          -->
      </el-form>
    </el-card>
    </Tab>
  </el-card>
</template>
<script>
import {
  getReportSelections,
  runReport,
  remoteLookup,
  getReportTextByID
} from "@/api/reports";
import {M} from '@/api/index';
import Tab from "@/views/reports/tab/index";
import moment from "moment";
import { mapGetters } from "vuex";
import JsonEditor from "../../components/JsonEditor/index";
import Debug from "@/views/reports/debug/index";
import AdsInputTable from '@/components/AdsInputTable/index'

export default {
  components: {
    Tab,
    JsonEditor,
    Debug,
    AdsInputTable
  },

  async mounted() {
    await this.handleMounted();
  },
  props:['PROG','SERIALIZEFORM','noSchBTN'],
  async created() {
    /*
        let entity = this.$route.query.ENTITY || this.getQueryVariable("ENTITY");
        if (entity !== this.$store.state.user.entity){
                await this.onCommandDropdown(entity-1);
        }
        */
  if (this.$route.meta.NAME === 'Prepare Submission' && this.$route.meta.PROG.indexOf('!')>1){
    this.submitAtOnceButton = true;
  }     

 let reportID =  this.$route.query.reportID || this.getQueryVariable("reportID");
    if (reportID){
      this.initID(reportID);
      this.killLoad = true;
    } else {
    let JWT =  this.getQueryVariable("JWT");
    let JOB =  this.getQueryVariable("JOB");
    //let JWT = this.$route.query.JWT || this.getQueryVariable("JOB");

     if (JOB) {

          let data = await M('getReportSelectionsByJob^MWR',{JWT,JOB})
          this.$route.query.serializeForm = data.serializeForm
          this.$route.query.reportPRG = data.reportPRG
    }
    if (this.getQueryVariable("serializeForm")) {
      this.$route.query.serializeForm = this.getQueryVariable("serializeForm");
    }

    if (this.getQueryVariable("reportPRG")) {
      this.$route.query.reportPRG = this.getQueryVariable("reportPRG");
    }

    if (this.getQueryVariable("sideBarCollapsed")) {
      this.$route.query.sideBarCollapsed = this.getQueryVariable(
        "sideBarCollapsed"
      );
    }

    this.reportRef = this.randomId;
    //
    if (this.$route.query.reportPRG && this.$route.query.serializeForm) {
      this.repLoading = true;
      let md = await runReport(
        this.$route.query.reportPRG,
        atob(this.$route.query.serializeForm),
        '',true
      );
          if (md && md.prompt){
          let message = md.prompt
          this.repLoading = false;
           let response = await this.$confirm(message, 'Medics Reports', {
                  confirmButtonText: 'OK',
                  cancelButtonText: 'Cancel',
                  type: 'warning',
                })
           if (response === 'confirm'){
                await M('propmtResponse^MWR',{ID:md.reportID})
                this.repLoading = true;
                let ndata = await runReport(this.reportPRG, this.serializeForm,md.reportID);
                this.initID(ndata.reportID)
                return;
           } else {
             return;
           }    
          } else if (md && md.alert){
              this.repLoading = false;
              this.$alert(md.alert, 'Medics Reports', {
              confirmButtonText: 'OK',
              callback: () => {},
              });
              return
          }
         this.initID(md.reportID)
    }

      
    }
 
 
  },
  data() {
    return {
      selectedTab:'selections',
      killLoad:false,
      selections: [],
      reportID: null,
      selectionsString: null,
      extraValues:[],
      reportPRG: null,
      repLoading: false,
      reportSettings: {},
      selectionsForm: {},
      options: {},
      lookupLoading: false,
      reportRef: null,
      broswerOnly: false,
      reportText: null,
      Excel: null,
      runPreview:0,
      allRequiredGood:false,
      submitAtOnceButton:false,
      submitAtOnceVal:false,
      gettingFile:false
    };
  },
  watch:{
    selectionsForm:{
      immediate:true,
      deep:true,
      handler(selectionsForm){
         let required = false;
      this.selections.map((selection)=>{
          if (selection.definition[1].length > 1 && this.required(selection) && (!selectionsForm['F'+selection.id]['V0'] && !selectionsForm['F'+selection.id]['V0'].length || !selectionsForm['F'+selection.id]['V0'])){
            required = true;
          } 

          selection.definition[2].map((textbox,oindex) =>{
              if (this.required(textbox) && ( selectionsForm['F'+selection.id]['V1']['SV'+oindex] && !selectionsForm['F'+selection.id]['V1']['SV'+oindex].length || !selectionsForm['F'+selection.id]['V1']['SV'+oindex] ) && ( selection.definition[3][0] && selectionsForm['F'+selection.id]['V0'] !== selection.definition[3][0] || !selection.definition[3][0])){
                  required = true;
              }

          })

      })
         this.allRequiredGood = !required;
      }
    }
  },
  computed: {
    ...mapGetters(["token"]),
    randomId: {
      get() {
        var text = "";
        var possible =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      }
    },
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
  },
  methods: {
            initID(reportID){
                    this.repLoading = true;
                    this.reportID = reportID;
                    //this.selectedTab = 'report';  
                    //if (this.repLoading) this.repLoading = false;     
            },
            handleRepLoaded(){
              if (this.repLoading) {
            setTimeout(()=>{
              this.repLoading = false;
          },0)
                } 
            },
             async onCommandDropdown(entity) {
            let data = await M('changeEntity^MW', {
                entity: entity + 1
            })
            if (data && data.data && data.data.result == 1) {
                await this.$store
                    .dispatch('GetUserInfo')
                    .then(res => {
                        this.$store.dispatch('GenerateRoutes', res.data).then(() => {
                            this.$router.addRoutes(this.$store.getters.addRouters)
                        })
                    })
                    .catch(() => {
                    })
                this.$store.dispatch('SetCurrentEntity', entity + 1)
            } else {
                this.$alert(data.data.result, 'Entity Not Changed !', {
                    confirmButtonText: 'OK',
                });
            }
        },
    async handleMounted(){
    let _vm = this;
    
    await this.$nextTick();
    
    let data = await getReportSelections(this.$route.meta.PROG || this.PROG);
    if (data.reportSettings && data.reportSettings.BROWSERONLY) {
      _vm.broswerOnly = true;
    }

    if (data.reportSettings && data.reportSettings.EXCEL == 1) {
      _vm.Excel = true;
    }

    if (this.$route.meta.NAME !== 'Process Reconciliation'){
      let PROG = this.$route.meta.PROG || this.PROG;
       if (PROG.indexOf('!')>-1) _vm.Excel = false;
    }

    if (data.reportSettings && data.reportSettings.MOVEFRAME && typeof(data.reportSettings.MOVEFRAME)==='string') {
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
      data.selections.forEach(function(selection) {
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
          values[1].split(subDelimiter).forEach(function(val, indx) {
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
            selection.definition[2][0].split(":")[6]
              ? values[1].split(",")
              : selection.definition[2][0].split(":")[6] && !!values[1]
              ? [values[1]]
              : values[1] && values[1] !== ","
              ? values[1]
              : null;
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
    async downloadFromCarrier(){

    let prog = this.$route.meta.PROG || this.PROG;
            let form = prog.split('!')[2];
            this.gettingFile = true;
            let data = await M('DownloadFile^MWSUB',{
                form:form,
                prog
            })
            this.gettingFile = false;
            this.sendResp = data.data;
            
        if (data.data[0] == 1 ){
                  this.$alert(data.data,'', {
                  type: 'success'
                 })
               this.$forceUpdate();
        } else {
                this.$alert(data.data, '', {
                  type: 'error'
                 })
        }
         this.$forceUpdate();
            //this.sendDialog = true;
    },
    setSchReport(){
        this.$store.dispatch('addSelectedReport', {
             reportName:this.$route.meta.NAME,
              formSerialized:this.serializeForm,
              reportPRG:this.reportPRG
            });
        setTimeout(()=>{
          this.$router.push('/reports-utils/schreports')
        },500)

    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
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
  async handleOnSubmit(){
        this.runPreview = 0;
        await this.onSubmit();
  },


  async handleOnRun(){
        this.runPreview = 1;
        if (this.submitAtOnceVal === true){
          this.runPreview = 2;
        }
        await this.onSubmit();
  },


    async onSubmit() {
      let ref = "ReportSelections" + this.reportRef;
      this.$refs[ref].validate(async valid => {
        if (valid) {
          setTimeout(()=>{
              this.repLoading = true;
          },0)
          let md = await runReport(this.reportPRG, this.serializeForm,'','',this.runPreview);
          
          if (md && md.prompt){
          let message = md.prompt
          this.repLoading = false;
           let response = await this.$confirm(message, 'Medics Reports', {
                  confirmButtonText: 'OK',
                  cancelButtonText: 'Cancel',
                  type: 'warning',
                })
           if (response === 'confirm'){
                await M('propmtResponse^MWR',{ID:md.reportID})
                this.repLoading = true;
                let ndata = await runReport(this.reportPRG, this.serializeForm,md.reportID);
               this.initID(ndata.reportID);
                return;
           } else {
             return;
           }    
          } else if (md && md.alert){
              this.repLoading = false;
              this.$alert(md.alert, 'Medics Reports', {
              confirmButtonText: 'OK',
              callback: () => {},
              });
              return
          }
          this.initID(md.reportID);
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
      remoteLookup({ currentValue, lookupType, query }).then(function(data) {
        vm.options[id]["V1"]["SV" + finx] = data.data;
        vm.lookupLoading = false;
      });
    },

    querySearchAsyncLookup() {},

    getTextBoxFrameWidth(box, boxes){
      if (boxes.length < 2){
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
      let title = selection.definition[0][0].split("^")[1] &&
        selection.definition[0][0].split("^")[1].length
        ? selection.definition[0][0].split("^")[1]
        : selection.definition[0][0].split("^")[0];
      return title === '�' ? '':title;
    },
    getFrameLabel(selection) {
      let label = selection.definition[0][0].split("^")[0].length > 24
        ? selection.definition[0][0].split("^")[0].substring(0, 20) + "..."
        : selection.definition[0][0].split("^")[0];
      return  label === '�' ? '':label;
    },
    padText(text, len, pad) {
      let padding = pad.repeat(len);
      return (text + padding).substring(0, len);
    },
    async runRep() {
      /*
      let loading = this.$loading({
        lock: true,
        text: "Loading..." + this.$route.meta.NAME,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        body: true,
        fullscreen: false
      });
      */
      //this.repLoading = true;
      let data = await runReport(this.reportPRG, this.serializeForm);
     this.initID(data.reportID)
      if (this.broswerOnly) {
        let data = await getReportTextByID(this.ID);
        this.reportText = data.reportText;
      }
    },
    required(frame){
      if (frame.frame) return frame.frame.split('|')[3].split('�')[5]==="Y";
      return typeof frame === 'string' && frame.split(":")[2]==='Y';
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
    }
  }
};
</script>
<style>
 .input-required > input,
 .input-required > div> input,
 .input-required > label> span>span  {
    background-color : #B7DBFF;
    background : #B7DBFF;
 }
</style>