<template>
<div :class="className" :style="{height:height * 18.8 + 'px',width:width  * 18.8 + 'px'}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import {
    debounce
} from '@/utils'

const animationDuration = 6000

export default {
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: Number,
            default: 10
        },
        height: {
            type: Number,
            default: 10
        },
        gdata: {
            type: Array
        },
        headers: {
            type: Array
        },
        xaxis: {
            type: Number
        },
        yaxis: {
            type: Number
        },
        ag: {
            type: String
        }
    }, //:gdata="data" :headers="headers" :xaxis="form.xaxis" :yaxis="form.yaxis" :ag="form.ag"
    data() {
        return {
            chart: null,
            xCol: [],
            yCol: []
        }
    },
    mounted() {
        this.initChart()
        this.__resizeHandler = debounce(() => {
            if (this.chart) {
                this.chart.resize()
            }
        }, 100)
        window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        window.removeEventListener('resize', this.__resizeHandler)
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        prepData() {
            let data = this.gdata;
            let xaxis = this.xaxis;
            let yaxis = this.yaxis;
            let type = this.ag;
            let out = {};
            let total=0
            data.map((row) => {
                let key = row[xaxis];
                if (!key) key = 'N/A';
                if (type === 'Sum' || type === 'Average') {
                    let value = Number(row[yaxis]) || 0;
                    out[key] = Number(out[key] || 0) + value
                    total = total + value;
                } else if (type === 'Count') {
                    out[key] = Number(out[key] || 0) + 1;
                }
                if (type === 'Average') {
                    Object.keys(out).map((cell) => {
                        out[cell] = (out[cell] / total);
                    })
                }

            })
            return out;
        },
        getXData() {
            let data = this.prepData();
            return Object.keys(data)
        },

        getYData() {
            let data = this.prepData();
            return Object.keys(data).map((i) => {
                return data[i];
            })
        },
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons')
            const colors = [
                "#66CC99",
                "#4cabce",
                "#e5323e",
                "#E91E63",
                "#9C27B0",
                "#673AB7",
                "#2196F3",
                "#03A9F4",
                "#00BCD4",
                "#009688",
                "#4CAF50",
                "#FF5722"
            ];
            this.chart.setOption({
              resizable:"true",
              color: colors, 
                title: {
                    text: `${this.ag} of ${this.headers[this.yaxis]} vs. ${this.headers[this.xaxis]}`,
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: 10,
                    left: '2%',
                    right: '2%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: this.getXData(),
                    name: this.headers[this.xaxis],
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: true
                    }
                }],
                series: [{
                    name: this.headers[this.yaxis],
                    type: 'bar',
                    data: this.getYData(),
                    animationDuration
                }]
            })
        }
    }
}
</script>
