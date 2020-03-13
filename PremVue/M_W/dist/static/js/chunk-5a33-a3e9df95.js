(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-5a33"],{L7K0:function(t,e,n){},O1P1:function(t,e,n){"use strict";var o=n("L7K0");n.n(o).a},c11S:function(t,e,n){"use strict";var o=n("gTgX");n.n(o).a},gTgX:function(t,e,n){},ntYl:function(t,e,n){"use strict";n.r(e);var o=n("Yfch"),i=n("Pa2x"),r=n("XJYT"),a={name:"Login",components:{Adslogo:i.a},data:function(){return{loginForm:{username:"",password:"",entity:1},loginRules:{username:[{required:!0,trigger:"blur",validator:function(t,e,n){Object(o.b)(e)?n():n(new Error("Please a valid operator code"))}}],password:[{required:!0,trigger:"blur",validator:function(t,e,n){e.length<1?n(new Error("Password cannot be empty")):n()}}],entity:[{required:!0,trigger:"blur",validator:function(t,e,n){e.length<1?n(new Error("Entity cannot be empty")):n()}}]},passwordType:"password",loading:0,showDialog:!1,redirect:void 0}},watch:{$route:{handler:function(t){this.redirect=t.query&&t.query.redirect},immediate:!0}},mounted:function(){},destroyed:function(){},created:function(){var t=this,e=this.$route.query.SES||this.getQueryVariable("SES"),n=this.$route.query.JWT||this.getQueryVariable("JWT");e?(this.loading=!0,this.$loading(),this.$store.dispatch("LoginBySES",e).then(function(){t.loading=!1,t.$router.push({path:t.redirect||"/",query:t.$route.query})}).catch(function(){t.loading=!1})):n&&(this.loading=1,r.Loading.service({lock:!0,text:"Loading",spinner:"el-icon-loading"}),this.$store.dispatch("app/setAppLoading",!0),this.$store.dispatch("LoginByJWT",n).then(function(){t.loading=2,t.$router.push({path:t.redirect||"/",query:t.$route.query})}).catch(function(){t.loading=3}))},methods:{getQueryVariable:function(t){for(var e=window.location.search.substring(1).split("&"),n=0;n<e.length;n++){var o=e[n].split("=");if(decodeURIComponent(o[0])==t)return decodeURIComponent(o[1])}},showPwd:function(){"password"===this.passwordType?this.passwordType="":this.passwordType="password"},handleLogin:function(){var t=this;this.$refs.loginForm.validate(function(e){if(!e)return!1;t.loading=1,t.$store.dispatch("LoginByUsername",t.loginForm).then(function(){t.loading=2,t.$router.push({path:t.redirect||"/"})}).catch(function(){t.loading=3,setTimeout(function(){t.loading=0},1e3)})})},afterQRScan:function(){}}},s=(n("c11S"),n("O1P1"),n("KHd+")),l=Object(s.a)(a,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"login-container"},[t.loading>0?n("el-alert",{attrs:{title:1===t.loading?"Logging In...":2===t.loading?"Successfully Logged In":"Loggin Error",type:1===t.loading?"warning":2===t.loading?"success":3===t.loading?"error":"",effect:"dark"}}):t._e(),t._v(" "),n("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:t.loginForm,rules:t.loginRules,"auto-complete":"on","label-position":"left"}},[n("div",{staticClass:"title-container"},[n("center",[n("Adslogo",{staticStyle:{margin:"0 0"},attrs:{width:250,height:250}})],1)],1),t._v(" "),n("el-form-item",{attrs:{prop:"username"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"user"}})],1),t._v(" "),n("el-input",{attrs:{placeholder:"Operator",name:"username",type:"text","auto-complete":"on"},model:{value:t.loginForm.username,callback:function(e){t.$set(t.loginForm,"username",e)},expression:"loginForm.username"}})],1),t._v(" "),n("el-form-item",{attrs:{prop:"password"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"password"}})],1),t._v(" "),n("el-input",{attrs:{type:t.passwordType,placeholder:"Password",name:"password","auto-complete":"on"},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.handleLogin(e):null}},model:{value:t.loginForm.password,callback:function(e){t.$set(t.loginForm,"password",e)},expression:"loginForm.password"}}),t._v(" "),n("span",{staticClass:"show-pwd",on:{click:t.showPwd}},[n("svg-icon",{attrs:{"icon-class":"password"===t.passwordType?"eye":"eye-open"}})],1)],1),t._v(" "),n("el-form-item",{attrs:{prop:"entity"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"building"}})],1),t._v(" "),n("el-input",{attrs:{placeholder:"Entity",name:"entity",type:"number",max:"99","auto-complete":"on"},model:{value:t.loginForm.entity,callback:function(e){t.$set(t.loginForm,"entity",e)},expression:"loginForm.entity"}})],1),t._v(" "),n("el-button",{staticStyle:{width:"100%","margin-bottom":"10px"},attrs:{id:"login_button",loading:t.loading>0,type:"primary"},nativeOn:{click:function(e){return e.preventDefault(),t.handleLogin(e)}}},[t._v(t._s(0===t.loading?"Log In":1===t.loading?"Logging In...":2===t.loading?"Successfully Logged In":"Loggin Error"))]),t._v(" "),n("div",{staticClass:"title-container"},[n("h3",{staticClass:"title"},[t._v("Advanced Data Systems")])])],1)],1)},[],!1,null,"5efc89c4",null);l.options.__file="index.vue";e.default=l.exports}}]);