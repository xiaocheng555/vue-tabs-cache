"use strict";(self["webpackChunkvue2"]=self["webpackChunkvue2"]||[]).push([[425],{7425:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var r=function(){var e=this,t=e._self._c;return t("div",[t("el-container",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}]},[t("el-aside",{attrs:{width:"300px"}},[t("el-table",{attrs:{data:e.cateList,border:""}},[t("el-table-column",{attrs:{label:"运动方式"},scopedSlots:e._u([{key:"default",fn:function({row:a}){return[t("a",{staticStyle:{display:"block"},attrs:{href:"javascript:;"},on:{click:function(t){e.curCate=a.name}}},[e._v(e._s(a.name))])]}}])})],1)],1),t("el-main",{staticStyle:{padding:"0 20px"}},[t("el-table",{attrs:{data:e.userList,border:""}},[t("el-table-column",{attrs:{prop:"id",label:"id"}}),t("el-table-column",{attrs:{prop:"userName",label:"用户名"}}),t("el-table-column",{attrs:{prop:"sport",label:"运动方式"}}),t("el-table-column",{attrs:{prop:"day",label:"练习时长（天）"}}),t("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function({row:a}){return[t("el-link",{attrs:{type:"danger"},on:{click:function(t){return e.delUserData(a)}}},[e._v("删除并刷新tab2")])]}}])})],1)],1)],1)],1)},s=[],i=a(5040),d=a(3822),o={name:"Soon2",data(){return{loading:!1,curCate:"",cateList:[],userList:[]}},methods:{...(0,d.nv)("cache",["removeCache"]),getData(){this.loading=!0,setTimeout((()=>{this.loading=!1,this.cateList=Array.from(new Set(i.map((e=>e.sport)))).map((e=>({name:e}))),this.getUserList()}),1e3)},getUserList(){this.userList=i.filter((e=>e.sport===this.curCate))},delUserData(e){const t=i.findIndex((t=>t.id===e.id));i.splice(t,1),this.getData(),this.removeCache("Soon1")}},watch:{curCate(){this.getUserList()}},created(){this.getData()}},l=o,u=a(1001),n=(0,u.Z)(l,r,s,!1,null,"14c9c37f",null),p=n.exports},5040:function(e){e.exports=JSON.parse('[{"id":1,"userName":"谢敏","day":109,"sport":"rap"},{"id":2,"userName":"谢敏","day":227,"sport":"唱"},{"id":3,"userName":"谢敏","day":143,"sport":"跑步"},{"id":4,"userName":"乔桂英","day":217,"sport":"爬山"},{"id":5,"userName":"乔桂英","day":134,"sport":"跑步"},{"id":6,"userName":"乔桂英","day":63,"sport":"篮球"},{"id":7,"userName":"乔桂英","day":262,"sport":"爬山"},{"id":8,"userName":"邱霞","day":66,"sport":"爬山"},{"id":9,"userName":"邱霞","day":31,"sport":"跑步"},{"id":10,"userName":"邱霞","day":128,"sport":"唱"},{"id":11,"userName":"孙勇","day":159,"sport":"rap"},{"id":12,"userName":"孙勇","day":79,"sport":"跑步"},{"id":13,"userName":"冯磊","day":71,"sport":"唱"},{"id":14,"userName":"冯磊","day":179,"sport":"篮球"},{"id":15,"userName":"冯磊","day":171,"sport":"足球"},{"id":16,"userName":"冯磊","day":126,"sport":"爬山"},{"id":17,"userName":"贺明","day":274,"sport":"唱"},{"id":18,"userName":"贺明","day":250,"sport":"篮球"},{"id":19,"userName":"贺明","day":234,"sport":"足球"},{"id":20,"userName":"贺明","day":113,"sport":"跑步"}]')}}]);
//# sourceMappingURL=425.658fbaaa.js.map