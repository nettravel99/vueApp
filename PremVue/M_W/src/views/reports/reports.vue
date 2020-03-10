<template>
  <div>
    <el-row
      type="flex"
      align="top"
      style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: rgb(84, 92, 100);padding:5px;"
    >
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 3px;">
            <el-button size="mini" type="warning" @click="$router.push('/reports-utils/schreports')">Scheduled Reports</el-button>
            <el-input size="mini" style="width:600px;" placeholder="Type something to search reports" v-model="searchedReport">
              <template slot="prepend">Search Medics Reports:</template>
            </el-input>
            
            <div class="bottom clearfix">
              <el-collapse v-model="activeNames">
                <el-collapse-item
                  v-for="(selection,index) in Object.keys(list)"
                  :key="index"
                  :name="selection"
                  :title="selection"
                >
                  <el-table :data="list[selection]" height="250" style="width: 100%" >
                    <el-table-column prop="LIST" label="List" width="160"></el-table-column>
                    <el-table-column label="Name">
                      <template slot-scope="scope">
                        <router-link :to="'/reports/'+scope.row.LIST+'/'+scope.row.PROG">
                          <a :style="{'color':'#4eb3e5'}">{{scope.row.NAME}}</a>
                        </router-link>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
.svg-icon-ai {
   padding-top: 5px;
  padding-bottom: 5px;
   padding-left: 5px;
   padding-right: 5px;
  width: 5em !important;
  height: 5em !important;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 16px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
}
.h_iframe iframe {
  width: 100%;
  height: 100%;
  min-height: 90vh !important;
}
.h_iframe {
  height: 100%;
  width: 100%;
}

.el-collapse-item__header {
 
  color: #303133;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
 font-size: 13px;
 font-weight: 600;
     height: 28px;
    line-height: 28px;
}

</style>

<script>
import { M } from "@/api/index";

export default {
  computed: {
    list: {
      get() {
        let _vm = this;
        if (this.searchedReport) {
          let list = this.LIST;
          let final = {};
          list &&
            Object.keys(list).map(function(key) {
              return list[key].map(function(report) {
                if (
                  report.NAME.toLowerCase().indexOf(
                    _vm.searchedReport.toLowerCase()
                  ) > -1
                ) {
                  final[key] = final[key] || [];
                  final[key].push(report);
                }
              });
            });
          return final;
        } else {
          return this.LIST;
        }
      }
    }
  },

  data() {
    return {
      LIST: {},
      activeNames: [],
      searchedReport: ""
    };
  },
  async mounted() {
    let data = await M("getRepList^MWR");
    this.LIST = data.LIST;
  }
};
</script>