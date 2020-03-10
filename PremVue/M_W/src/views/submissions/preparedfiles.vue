<template>
<el-card :body-style="{ padding: '0px' }" style="padding: 0px 0px;"
>
<el-row>
    <div slot="header" style="padding: 0px 0px;">
        <span>Prepared Submission Files <el-button type="primary" @click="handleMounted" icon="el-icon-refresh" circle></el-button></span>
    </div>
            
        <el-col :span="8">
                    <el-card :body-style="{ padding: '0px' }"
         v-loading="repLoading"
      :element-loading-text="'Running...' + ('Prepared Files')"
      element-loading-spinner="el-icon-loading"
      :element-loading-lock="true"
      element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <hot-table :rowHeights="14" :colWidths="[0,10,75,60,20,20,20,105,75]"  class="prepFilesTableDetails" :hiddenColumns="hiddenColumns" :afterOnCellMouseDown="afterOnCellMouseDown" :id="'hotTableComponentpreparedFiles'" :key="'hotTableComponentpreparedFiles'" ref="hotTableComponentpreparedFiles" :data="list" :col-headers="headers" :read-only="true" :height="'80vh'" :width="'100%'" license-key="non-commercial-and-evaluation" :current-row-class-name="'currentRow'" />
                    </el-card>
        </el-col>
        <el-col :span="16" v-if="keys">
            <runReport :PROG="'EISCP'" :SERIALIZEFORM="keys + ':1^uD2'" :noSchBTN="true" :key="keys" >
                <el-button type="primary" size="mini" @click="handleX12Viewer">{{'X12'}}</el-button>
                <el-button type="primary" size="mini" @click="handleFileDelete">{{'Delete'}}</el-button>
                   <el-button type="primary" size="mini" :loading="sendingFile" @click="handleFileSend">{{sendingFile?'Sending...':'Send File'}}</el-button>
            </runReport>
            <el-card :body-style="{ padding: '10px' }">
                <div slot="header">
                    <span>File Details</span>
                </div>
                <pre>
{{details.join('\n')}}
               </pre>
            </el-card>
            <el-card :body-style="{ padding: '10px' }">
                <div slot="header">
                    <span>Acknowledgment</span>
                </div>
                <div>
                    <pre v-html="ack.split('/n').join('<br>')"></pre>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <el-dialog title="X12 Viewer" :visible.sync="X12dialogTableVisible" width="75%" top="5vh" 
    >
        <TableViewer style="height:70vh;overflow-y:scroll" :value="this.x12.join('\n')" :ID="keys" :key="'report'+keys" ref="X12TableViewer"></TableViewer>
    </el-dialog>
    <el-dialog title="Response" :visible.sync="sendDialog">
        <el-card :body-style="{ padding: '0px' }">
            <pre>{{sendResp}}</pre>
        </el-card>
        
    </el-dialog>
</el-card>
</template>
<script>
import {
    M
} from '@/api/index'
import {
    HotTable
} from '@handsontable/vue'
import runReport from '@/views/reports/index';
import TableViewer from '@/components/TableViewer/index';
export default {
    components: {
        HotTable,
        runReport,
        TableViewer
    },
    data() {
        let vm = this;
        return {
            sendingFile:false,
            list:[],
            form:0,
            headers: [],
            details: [],
            keys: '',
            ack: '',
            sendResp:'',
            sendDialog:false,
            x12:[],
            repLoading:false,
            X12dialogTableVisible:false,
            afterOnCellMouseDown: async function (event, coords, ) {
                var datad = this.getDataAtRow(coords.row)
                let details = datad[0];
                vm.keys = details;
                vm.form = Number(datad[4]) || 0;
                let data = await M('getDetails^MWSUB', {
                    details
                })
                if (data && data.data && data.data.details) {
                    vm.details = data.data.details
                    
                }
                let dataAck = await M('getAck^MWSUB', {
                    details
                })
                if (dataAck && dataAck.data && dataAck.data.ack) {
                    vm.ack = dataAck.data.ack
                } else {
                    vm.ack = "";
                }

            },
            hiddenColumns: {
                columns: [0],
                indicators: true
            }
        }
    },
    async mounted() {
        await this.handleMounted();
    },
    methods: {
        async handleMounted(){
        //let loading = this.$loading({text:'loading...',lock:true,spinner:'el-icon-loading',background:'rgba(0, 0, 0, 0.8)'})
        this.repLoading=true;
        let data = await M('getList^MWSUB');
        if (data && data.data && data.data.list) {
            this.list = data.data.list;
        }
        if (data && data.data && data.data.headers) {
            this.headers = data.data.headers;
        }
        //loading.close();
        this.repLoading=false;
        },
        handlePreview() {

        },
        async handleX12Viewer(){
            let data = await M('X12^MWSUB',{
                keys: this.keys
            })
            this.X12dialogTableVisible = true;
           if (data && data.data && data.data.file){
               this.x12 = data.data.file;
           } else {
               this.x12=['No File Data Available']
           }
         },
        async handleFileSend(){
            this.sendingFile = true;
            let data = await M('SendFile^MWSUB',{
                form:this.form,
                keys:this.keys,
            })
            this.sendingFile = false;
            this.sendResp = data.data;
            //this.sendDialog = true;
         if (this.sendResp[0] == 1 ){
                  this.$alert(this.sendResp, '', {
                  type: 'success'
                 })
        } else {
                this.$alert(this.sendResp, '', {
                  type: 'error'
                 })
        }


             await this.handleMounted();
        },
         async handleFileDelete(){
        this.$confirm('This will permanently delete the selected file. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(async () => {
            let data = await M('DELX12^MWSUB',{
                keys: this.keys
            })
        if (data && data.data && data.data.ack && data.data.ack[0]==0 ){
            this.$message({
            type: 'error',
            message: data.data.ack
          });
        } else {
               this.$message({
            type: 'success',
            message: data.data.ack
          });
        }
          await this.handleMounted();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });          
        });
         }
    },

}
</script>

<style>
@import "../../components/Handsontable/Handsontable.css";

pre {
    white-space: pre-wrap;
    /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;
    /* Mozilla, since 1999 */
    white-space: -pre-wrap;
    /* Opera 4-6 */
    white-space: -o-pre-wrap;
    /* Opera 7 */
    word-wrap: break-word;
    /* Internet Explorer 5.5+ */
}

.currentRow {
    border-bottom: 1pt solid #4B89FF !important;
    border-top: 1pt solid #4B89FF !important;
}
.prepFilesTableDetails >
.handsontable th,.prepFilesTableDetails > .handsontable td {
    border-top-width: 0;
    border-left-width: 0;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    height: 15px !important;
    empty-cells: show;
    line-height: 15px!important;
    font-size: 13px !important;
    color:black !important;
    padding: 0 1px 0 1px;
    background-color: #fff;
    vertical-align: top;
    overflow: hidden;
    outline-width: 0;
    white-space: pre-line;
    background-clip: padding-box;
}


</style>
