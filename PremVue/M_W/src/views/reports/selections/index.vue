
<template>
      <el-form
        :ref="'ReportSelections'"
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
          <el-radio-group
            v-if="selection.definition[1].length > 1"
              :key=" 'FI01'+index+'o'+'-'"
            v-model="selectionsForm['F'+selection.id]['V0']"
            :style="{width:'360px'}"
          >
            <el-radio
              :style="{width:'90px'}"
              v-for="(option,oindex) in selection.definition[1]"
              v-show="option.split(':')[0][0] !== String.fromCharCode(65533)"
              :key=" 'FI0'+index+'o'+oindex+'-'"
              :title="option.split(':')[0]"
              :label="option.split(':')[1]"
            >
              {{(option.split(':')[0].length > 12)
              ? (option.split(':')[0].substring(0,11))
              : ( option.split(':')[0] ) }}
            </el-radio>
          </el-radio-group>
          <div
            v-if="selection.definition[1].length <=1"
            :style="{'width': '360px',display: 'inline-block'}"
          ></div>
          <component
            v-for="(textbox,oindex) in selection.definition[2]"
            :key="'tb'+oindex"
            :id ="'tb'+oindex"
            :is="textbox.split(':')[6]
            ? 'el-select'
            : textbox.split(':')[1] == 6
            ? 'ads-date-input'
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
            :outputType="outputType"
          >
            <template slot="prepend" v-if="!!textbox.split(':')[0]">{{textbox.split(':')[0]}}</template>
            <template v-if="textbox.split(':')[6]" :id="'tb'+index+'opts'+'-'+randID()">
              <el-option
                v-for="(item,index) in options[selection.id]['V1']['SV'+oindex]"
                :key="index+'-'"
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
      </el-form>
</template>

<script>
import AdsDateInput from '@/components/AdsDateInput/index';
  import {
    remoteLookup,
  } from "@/api/reports";
 // import moment from "moment";
export default {
  components:{
    AdsDateInput
  },
  props:['selections','outputType','value','Settings',],
   data(){
    return {
      selectionsForm:{},
      options:{},
      lookupLoading:false,
    }
  },
watch:{
  formString(v){
    this.$emit('input',v);
    this.$emit('change',v);
  }
},


  computed:{
    formString(){
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
  },
   created(){
    let _vm=this;
    //let data = await M('getSelections^MWR');
    //this.selections = data.selections;
  if (this.Settings && this.Settings.MOVEFRAME && typeof(this.Settings.MOVEFRAME)==='string') {
      let positions = this.Settings.MOVEFRAME.split(",");
      positions.forEach(position => {
        this.selections = this.array_move(
          this.selections,
          position.split("-")[0] - 1,
          position.split("-")[1] - 1
        );
      });
    }

 let prepareForm = {};
    this.selections.forEach(function(selection) {
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
          //let val = values[1];

            // prepareForm["F" + selection.id]["V1"]["SV" + 0]= val ;
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
    
  },
  methods:{
      remoteQueryLookup(currentValue, lookupType, id, finx, query) {
        let vm = this;
        vm.lookupLoading = true;
        remoteLookup({
          currentValue,
          lookupType,
          query
        }).then(function(data) {
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
  }
}

</script>