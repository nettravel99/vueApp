<template>
<BaseComponent :width="width" :height="height">
    <IEcharts :option="line" :loading="loading" :resizable="true" :style="{width:width * 18.8 * (appScaleX / 100) + 'px',height:height * 18.8 * (appScaleY / 100) + 'px'}" :ref="'Chart'+gIndex" :theme="theme" />

</BaseComponent>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/lite.js";

//import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
//import "echarts/lib/chart/pie";
// import 'echarts/lib/chart/scatter';
// import 'echarts/lib/chart/radar';

// import 'echarts/lib/chart/map';
// import 'echarts/lib/chart/treemap';
// import 'echarts/lib/chart/graph';
// import 'echarts/lib/chart/gauge';
// import 'echarts/lib/chart/funnel';
// import 'echarts/lib/chart/parallel';
// import 'echarts/lib/chart/sankey';
// import 'echarts/lib/chart/boxplot';
// import 'echarts/lib/chart/candlestick';
// import 'echarts/lib/chart/effectScatter';
// import 'echarts/lib/chart/lines';
// import 'echarts/lib/chart/heatmap';

// import 'echarts/lib/component/graphic';
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
// import 'echarts/lib/component/polar';
// import 'echarts/lib/component/geo';
// import 'echarts/lib/component/parallel';
// import 'echarts/lib/component/singleAxis';
// import 'echarts/lib/component/brush';

import "echarts/lib/component/title";

import "echarts/lib/component/dataZoom";
// import 'echarts/lib/component/visualMap';

import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "echarts/lib/component/markArea";

// import 'echarts/lib/component/timeline';
import "echarts/lib/component/toolbox";

// import 'zrender/lib/vml/vml';
import "echarts/theme/dark";
import "echarts/theme/macarons";
import BaseComponent from "./BaseComponent";
import {
    sortBy
} from "underscore";

export default {
    name: "BarChart",
    components: {
        IEcharts,
        BaseComponent
    },
    props: ["gdata", "headers", "xCol", "yCol", "ag", "width", "height", "gIndex", "topTen",'title'],
    computed: {
        darkTheme: {
            get() {
                return this.$store.state.app.darkTheme || false;
            }
        },
        theme: {
            get() {
                if (this.darkTheme === true) {
                    return "dark";
                } else {
                    return "macarons";
                }
            }
        },
        appScaleX: {
            get() {
                return this.$store.state.app.appScaleX;
            }
        },
        appScaleY: {
            get() {
                return this.$store.state.app.appScaleY;
            }
        }
    },
    beforeCreate() {
        // IEcharts.registerTheme("darker", theme);
    },
    created() {},
    watch: {
        /*
        theme: function(val) {
          this.refresh(val);
        }
        */
    },
    methods: {
        top10Text() {
            if (this.topTen) {
                return 'Top 10'
            } else {
                return ''
            }
        },
        getAgrDataByColumns() {
            let gdata = this.gdata;
            let xaxis = this.xCol;
            let yaxis = this.yCol;
            let type = this.ag;
            let out = {};
             let total = {};
           gdata.map((row) => {
                let key = row[xaxis];
               
                if (!key) key = 'N/A';
                if (type === 'Sum' || type === 'Average') {
                    let value = Number(row[yaxis]) || 0;
                    out[key] = Number(out[key] || 0) + value
                    total[key] = Number(total[key] || 0) + 1;
                } else if (type === 'Count') {
                    out[key] = Number(out[key] || 0) + 1;
                }
            })
               if (type === 'Average') {
                    Object.keys(out).map((cell) => {
                        out[cell] = (out[cell] / total[cell]);
                    })
                }
            let fout = [];
            Object.keys(out).map((rec) => {
                let o = {};
                o.value = out[rec];
                o.name = rec
                fout.push(o)
            })

            
            if (this.topTen) {
                if (fout.length > 10) {
                    return sortBy(fout, "value").slice(Math.max(fout.length - 10, 1));
                } else {
                    return sortBy(fout, "value");
                }
            }



            return fout
        },
        ChartOptions() {
            let data = this.getAgrDataByColumns();
            return {
                
                tooltip: {},
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: false
                        },
                        dataView: {
                            show: true,
                            title: "Data View",
                            readOnly: true
                        },
                        restore: {
                            show: false,
                            title: "Restore"
                        },
                        saveAsImage: {
                            show: true,
                            title: "Save"
                        }
                    }
                },
                title: {
                    text: this.title || `${this.top10Text()}  ${this.ag} of ${this.headers[this.yCol]} vs. ${this.headers[this.xCol]}`,
                    subtext: '',
                    left: 'center'
                },
                        grid: {
          top: 85,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
                xAxis: {
                    'axisLabel':{'interval':0,'rotate':90},
                    data: data.map((r) => {
                        return r.name
                    })
                },
                yAxis: {},
                series: [{
                    name: this.headers[this.xCol],
                    type: "bar",
                    data: data,
                          markPoint : {
                data : [
                {type : 'max',label:{color:'black',fontWeight:'bold',fontSize:14}},
                    {type : 'min',label:{color:'black',fontWeight:'bold',fontSize:14}},
                ]
            },
                }]
            }
        },
        refresh(theme) {
            let line = this.$refs["Chart" + this.gIndex];
            line.showLoading({
                text: "Loading…",
                color: "#4ea397",
                maskColor: "rgba(255, 255, 255, 0.4)"
            });
            this.line = this.ChartOptions();
            this.theme = theme;
            line.hideLoading();
            this.$forceUpdate();
        }
    },
    data() {
        return {
            loading: false,
            line: this.ChartOptions(),
            gpdata: {}
        };
    }
};
</script>
