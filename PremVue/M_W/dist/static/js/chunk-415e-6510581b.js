(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-415e"],{"7BsA":function(t,a,e){t.exports=function(t){function a(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,a),n.l=!0,n.exports}var e={};return a.m=t,a.c=e,a.i=function(t){return t},a.d=function(t,e,i){a.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,a){return Object.prototype.hasOwnProperty.call(t,a)},a.p="/dist/",a(a.s=2)}([function(t,a,e){var i=e(4)(e(1),e(5),null,null);t.exports=i.exports},function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=e(3);a.default={props:{startVal:{type:Number,required:!1,default:0},endVal:{type:Number,required:!1,default:2017},duration:{type:Number,required:!1,default:3e3},autoplay:{type:Boolean,required:!1,default:!0},decimals:{type:Number,required:!1,default:0,validator:function(t){return t>=0}},decimal:{type:String,required:!1,default:"."},separator:{type:String,required:!1,default:","},prefix:{type:String,required:!1,default:""},suffix:{type:String,required:!1,default:""},useEasing:{type:Boolean,required:!1,default:!0},easingFn:{type:Function,default:function(t,a,e,i){return e*(1-Math.pow(2,-10*t/i))*1024/1023+a}}},data:function(){return{localStartVal:this.startVal,displayValue:this.formatNumber(this.startVal),printVal:null,paused:!1,localDuration:this.duration,startTime:null,timestamp:null,remaining:null,rAF:null}},computed:{countDown:function(){return this.startVal>this.endVal}},watch:{startVal:function(){this.autoplay&&this.start()},endVal:function(){this.autoplay&&this.start()}},mounted:function(){this.autoplay&&this.start(),this.$emit("mountedCallback")},methods:{start:function(){this.localStartVal=this.startVal,this.startTime=null,this.localDuration=this.duration,this.paused=!1,this.rAF=(0,i.requestAnimationFrame)(this.count)},pauseResume:function(){this.paused?(this.resume(),this.paused=!1):(this.pause(),this.paused=!0)},pause:function(){(0,i.cancelAnimationFrame)(this.rAF)},resume:function(){this.startTime=null,this.localDuration=+this.remaining,this.localStartVal=+this.printVal,(0,i.requestAnimationFrame)(this.count)},reset:function(){this.startTime=null,(0,i.cancelAnimationFrame)(this.rAF),this.displayValue=this.formatNumber(this.startVal)},count:function(t){this.startTime||(this.startTime=t),this.timestamp=t;var a=t-this.startTime;this.remaining=this.localDuration-a,this.useEasing?this.countDown?this.printVal=this.localStartVal-this.easingFn(a,0,this.localStartVal-this.endVal,this.localDuration):this.printVal=this.easingFn(a,this.localStartVal,this.endVal-this.localStartVal,this.localDuration):this.countDown?this.printVal=this.localStartVal-(this.localStartVal-this.endVal)*(a/this.localDuration):this.printVal=this.localStartVal+(this.localStartVal-this.startVal)*(a/this.localDuration),this.countDown?this.printVal=this.printVal<this.endVal?this.endVal:this.printVal:this.printVal=this.printVal>this.endVal?this.endVal:this.printVal,this.displayValue=this.formatNumber(this.printVal),a<this.localDuration?this.rAF=(0,i.requestAnimationFrame)(this.count):this.$emit("callback")},isNumber:function(t){return!isNaN(parseFloat(t))},formatNumber:function(t){t=t.toFixed(this.decimals);var a=(t+="").split("."),e=a[0],i=a.length>1?this.decimal+a[1]:"",n=/(\d+)(\d{3})/;if(this.separator&&!this.isNumber(this.separator))for(;n.test(e);)e=e.replace(n,"$1"+this.separator+"$2");return this.prefix+e+i+this.suffix}},destroyed:function(){(0,i.cancelAnimationFrame)(this.rAF)}}},function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=e(0),n=function(t){return t&&t.__esModule?t:{default:t}}(i);a.default=n.default,"undefined"!=typeof window&&window.Vue&&window.Vue.component("count-to",n.default)},function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=0,n="webkit moz ms o".split(" "),s=void 0,r=void 0;if("undefined"==typeof window)a.requestAnimationFrame=s=function(){},a.cancelAnimationFrame=r=function(){};else{a.requestAnimationFrame=s=window.requestAnimationFrame,a.cancelAnimationFrame=r=window.cancelAnimationFrame;for(var l=void 0,o=0;o<n.length&&(!s||!r);o++)l=n[o],a.requestAnimationFrame=s=s||window[l+"RequestAnimationFrame"],a.cancelAnimationFrame=r=r||window[l+"CancelAnimationFrame"]||window[l+"CancelRequestAnimationFrame"];s&&r||(a.requestAnimationFrame=s=function(t){var a=(new Date).getTime(),e=Math.max(0,16-(a-i)),n=window.setTimeout(function(){t(a+e)},e);return i=a+e,n},a.cancelAnimationFrame=r=function(t){window.clearTimeout(t)})}a.requestAnimationFrame=s,a.cancelAnimationFrame=r},function(t,a){t.exports=function(t,a,e,i){var n,s=t=t||{},r=typeof t.default;"object"!==r&&"function"!==r||(n=t,s=t.default);var l="function"==typeof s?s.options:s;if(a&&(l.render=a.render,l.staticRenderFns=a.staticRenderFns),e&&(l._scopeId=e),i){var o=Object.create(l.computed||null);Object.keys(i).forEach(function(t){var a=i[t];o[t]=function(){return a}}),l.computed=o}return{esModule:n,exports:s,options:l}}},function(t,a){t.exports={render:function(){var t=this,a=t.$createElement;return(t._self._c||a)("span",[t._v("\n  "+t._s(t.displayValue)+"\n")])},staticRenderFns:[]}}])},"9urc":function(t,a,e){"use strict";var i=e("OE1H");e.n(i).a},OE1H:function(t,a,e){},lAbF:function(t,a,e){"use strict";e.r(a);var i=e("7BsA"),n={components:{CountTo:e.n(i).a},methods:{handleSetLineChartData:function(t){this.$emit("handleSetLineChartData",t)}}},s=(e("sXbT"),e("KHd+")),r=Object(s.a)(n,function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("el-row",{staticClass:"panel-group",attrs:{gutter:40}},[e("el-col",{staticClass:"card-panel-col",attrs:{xs:12,sm:12,lg:6}},[e("div",{staticClass:"card-panel",on:{click:function(a){t.handleSetLineChartData("newVisitis")}}},[e("div",{staticClass:"card-panel-icon-wrapper icon-people"},[e("svg-icon",{attrs:{"icon-class":"peoples","class-name":"card-panel-icon"}})],1),t._v(" "),e("div",{staticClass:"card-panel-description"},[e("div",{staticClass:"card-panel-text"},[t._v("\n          New Visits\n        ")]),t._v(" "),e("count-to",{staticClass:"card-panel-num",attrs:{"start-val":0,"end-val":102400,duration:2600}})],1)])]),t._v(" "),e("el-col",{staticClass:"card-panel-col",attrs:{xs:12,sm:12,lg:6}},[e("div",{staticClass:"card-panel",on:{click:function(a){t.handleSetLineChartData("messages")}}},[e("div",{staticClass:"card-panel-icon-wrapper icon-message"},[e("svg-icon",{attrs:{"icon-class":"message","class-name":"card-panel-icon"}})],1),t._v(" "),e("div",{staticClass:"card-panel-description"},[e("div",{staticClass:"card-panel-text"},[t._v("\n          Messages\n        ")]),t._v(" "),e("count-to",{staticClass:"card-panel-num",attrs:{"start-val":0,"end-val":81212,duration:3e3}})],1)])]),t._v(" "),e("el-col",{staticClass:"card-panel-col",attrs:{xs:12,sm:12,lg:6}},[e("div",{staticClass:"card-panel",on:{click:function(a){t.handleSetLineChartData("purchases")}}},[e("div",{staticClass:"card-panel-icon-wrapper icon-money"},[e("svg-icon",{attrs:{"icon-class":"money","class-name":"card-panel-icon"}})],1),t._v(" "),e("div",{staticClass:"card-panel-description"},[e("div",{staticClass:"card-panel-text"},[t._v("\n          Purchases\n        ")]),t._v(" "),e("count-to",{staticClass:"card-panel-num",attrs:{"start-val":0,"end-val":9280,duration:3200}})],1)])]),t._v(" "),e("el-col",{staticClass:"card-panel-col",attrs:{xs:12,sm:12,lg:6}},[e("div",{staticClass:"card-panel",on:{click:function(a){t.handleSetLineChartData("shoppings")}}},[e("div",{staticClass:"card-panel-icon-wrapper icon-shopping"},[e("svg-icon",{attrs:{"icon-class":"shopping","class-name":"card-panel-icon"}})],1),t._v(" "),e("div",{staticClass:"card-panel-description"},[e("div",{staticClass:"card-panel-text"},[t._v("\n          Shoppings\n        ")]),t._v(" "),e("count-to",{staticClass:"card-panel-num",attrs:{"start-val":0,"end-val":13600,duration:3600}})],1)])])],1)},[],!1,null,"20999406",null);r.options.__file="PanelGroup.vue";var l=r.exports,o=e("MT78"),c=e.n(o),u=e("7Qib");e("gX0l");var h={props:{className:{type:String,default:"chart"},width:{type:String,default:"100%"},height:{type:String,default:"350px"},autoResize:{type:Boolean,default:!0},chartData:{type:Object,required:!0}},data:function(){return{chart:null,sidebarElm:null}},watch:{chartData:{deep:!0,handler:function(t){this.setOptions(t)}}},mounted:function(){var t=this;this.initChart(),this.autoResize&&(this.__resizeHandler=Object(u.a)(function(){t.chart&&t.chart.resize()},100),window.addEventListener("resize",this.__resizeHandler)),this.sidebarElm=document.getElementsByClassName("sidebar-container")[0],this.sidebarElm&&this.sidebarElm.addEventListener("transitionend",this.sidebarResizeHandler)},beforeDestroy:function(){this.chart&&(this.autoResize&&window.removeEventListener("resize",this.__resizeHandler),this.sidebarElm&&this.sidebarElm.removeEventListener("transitionend",this.sidebarResizeHandler),this.chart.dispose(),this.chart=null)},methods:{sidebarResizeHandler:function(t){"width"===t.propertyName&&this.__resizeHandler()},setOptions:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=t.expectedData,e=t.actualData;this.chart.setOption({xAxis:{data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],boundaryGap:!1,axisTick:{show:!1}},grid:{left:10,right:10,bottom:20,top:30,containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"cross"},padding:[5,10]},yAxis:{axisTick:{show:!1}},legend:{data:["expected","actual"]},series:[{name:"expected",itemStyle:{normal:{color:"#FF005A",lineStyle:{color:"#FF005A",width:2}}},smooth:!0,type:"line",data:a,animationDuration:2800,animationEasing:"cubicInOut"},{name:"actual",smooth:!0,type:"line",itemStyle:{normal:{color:"#3888fa",lineStyle:{color:"#3888fa",width:2},areaStyle:{color:"#f3f8ff"}}},data:e,animationDuration:2800,animationEasing:"quadraticOut"}]})},initChart:function(){this.chart=c.a.init(this.$el,"macarons"),this.setOptions(this.chartData)}}},d=Object(s.a)(h,function(){var t=this.$createElement;return(this._self._c||t)("div",{class:this.className,style:{height:this.height,width:this.width}})},[],!1,null,null,null);d.options.__file="LineChart.vue";var p=d.exports;e("gX0l");var m={props:{className:{type:String,default:"chart"},width:{type:String,default:"100%"},height:{type:String,default:"300px"}},data:function(){return{chart:null}},mounted:function(){var t=this;this.initChart(),this.__resizeHandler=Object(u.a)(function(){t.chart&&t.chart.resize()},100),window.addEventListener("resize",this.__resizeHandler)},beforeDestroy:function(){this.chart&&(window.removeEventListener("resize",this.__resizeHandler),this.chart.dispose(),this.chart=null)},methods:{initChart:function(){this.chart=c.a.init(this.$el,"macarons"),this.chart.setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{top:10,left:"2%",right:"2%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],axisTick:{alignWithLabel:!0}}],yAxis:[{type:"value",axisTick:{show:!1}}],series:[{name:"pageA",type:"bar",stack:"vistors",barWidth:"60%",data:[79,52,200,334,390,330,220],animationDuration:6e3},{name:"pageB",type:"bar",stack:"vistors",barWidth:"60%",data:[80,52,200,334,390,330,220],animationDuration:6e3},{name:"pageC",type:"bar",stack:"vistors",barWidth:"60%",data:[30,52,200,334,390,330,220],animationDuration:6e3}]})}}},f=Object(s.a)(m,function(){var t=this.$createElement;return(this._self._c||t)("div",{class:this.className,style:{height:this.height,width:this.width}})},[],!1,null,null,null);f.options.__file="BarChart.vue";var v=f.exports;e("gX0l");var g={props:{className:{type:String,default:"chart"},width:{type:String,default:"100%"},height:{type:String,default:"300px"}},data:function(){return{chart:null}},mounted:function(){var t=this;this.initChart(),this.__resizeHandler=Object(u.a)(function(){t.chart&&t.chart.resize()},100),window.addEventListener("resize",this.__resizeHandler)},beforeDestroy:function(){this.chart&&(window.removeEventListener("resize",this.__resizeHandler),this.chart.dispose(),this.chart=null)},methods:{initChart:function(){this.chart=c.a.init(this.$el,"macarons"),this.chart.setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{top:10,left:"2%",right:"2%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],axisTick:{alignWithLabel:!0}}],yAxis:[{type:"value",axisTick:{show:!1}}],series:[{name:"pageA",type:"bar",data:[79,52,200,334,390,330,220],animationDuration:6e3},{name:"pageB",type:"bar",data:[80,52,200,334,390,330,220],animationDuration:6e3},{name:"pageC",type:"bar",data:[30,52,200,334,390,330,220],animationDuration:6e3}]})}}},w=Object(s.a)(g,function(){var t=this.$createElement;return(this._self._c||t)("div",{class:this.className,style:{height:this.height,width:this.width}})},[],!1,null,null,null);w.options.__file="SingleBarChart.vue";var y=w.exports;e("gX0l");var _={props:{className:{type:String,default:"chart"},width:{type:String,default:"100%"},height:{type:String,default:"300px"}},data:function(){return{chart:null}},mounted:function(){var t=this;this.initChart(),this.__resizeHandler=Object(u.a)(function(){t.chart&&t.chart.resize()},100),window.addEventListener("resize",this.__resizeHandler)},beforeDestroy:function(){this.chart&&(window.removeEventListener("resize",this.__resizeHandler),this.chart.dispose(),this.chart=null)},methods:{initChart:function(){this.chart=c.a.init(this.$el,"macarons"),this.chart.setOption({tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{left:"center",bottom:"10",data:["Industries","Technology","Forex","Gold","Forecasts"]},calculable:!0,series:[{name:"WEEKLY WRITE ARTICLES",type:"pie",roseType:"radius",radius:[15,95],center:["50%","38%"],data:[{value:320,name:"Industries"},{value:240,name:"Technology"},{value:149,name:"Forex"},{value:100,name:"Gold"},{value:59,name:"Forecasts"}],animationEasing:"cubicInOut",animationDuration:2600}]})}}},b=Object(s.a)(_,function(){var t=this.$createElement;return(this._self._c||t)("div",{class:this.className,style:{height:this.height,width:this.width}})},[],!1,null,null,null);b.options.__file="PieChart.vue";var x={expectedData:[100,120,161,134,105,160,165],actualData:[120,82,91,154,162,140,145]},C={components:{LineChart:p,BarChart:v,PanelGroup:l,PieChart:b.exports,SingleBarChart:y},data:function(){return{lineChartData:x}}},V=(e("9urc"),Object(s.a)(C,function(){var t=this.$createElement,a=this._self._c||t;return a("div",[a("el-row",[a("el-col",{attrs:{span:24}},[a("el-card",{attrs:{"body-style":{padding:"0px"}}},[a("div",{attrs:{slot:"header"},slot:"header"},[a("span",[this._v("Dashboard")])]),this._v(" "),a("panel-group")],1)],1)],1),this._v(" "),a("el-row",{attrs:{gutter:32}},[a("el-col",{attrs:{xs:24,sm:24,lg:24}},[a("div",{staticClass:"chart-wrapper"},[a("line-chart",{attrs:{"chart-data":this.lineChartData}})],1)])],1),this._v(" "),a("el-row",{attrs:{gutter:32}},[a("el-col",{attrs:{xs:24,sm:24,lg:8}},[a("div",{staticClass:"chart-wrapper"},[a("bar-chart")],1)]),this._v(" "),a("el-col",{attrs:{xs:24,sm:24,lg:8}},[a("div",{staticClass:"chart-wrapper"},[a("pie-chart")],1)]),this._v(" "),a("el-col",{attrs:{xs:24,sm:24,lg:8}},[a("div",{staticClass:"chart-wrapper"},[a("single-bar-chart")],1)])],1)],1)},[],!1,null,"7511dac8",null));V.options.__file="index.vue";a.default=V.exports},mZHw:function(t,a,e){},sXbT:function(t,a,e){"use strict";var i=e("mZHw");e.n(i).a}}]);