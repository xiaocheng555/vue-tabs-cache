"use strict";(self["webpackChunkvue2"]=self["webpackChunkvue2"]||[]).push([[918],{1918:function(e,a,t){t.r(a),t.d(a,{default:function(){return o}});var c=function(){var e=this,a=e._self._c;return a("div",[a("el-tabs",{attrs:{type:"card"},on:{"tab-click":e.clickTab},model:{value:e.curTabName,callback:function(a){e.curTabName=a},expression:"curTabName"}},[a("el-tab-pane",{attrs:{label:"tab1",name:"/soon1"}}),a("el-tab-pane",{attrs:{label:"tab2",name:"/soon2"}})],1),a("keep-alive",{attrs:{include:e.caches}},[a("router-view")],1)],1)},r=[],n=t(3822),u={name:"Child",keepScroll:!0,data(){return{curTabName:this.$route.path}},computed:{...(0,n.rn)("cache",["caches"])},methods:{clickTab(e){"string"===typeof e.paneName&&this.$route.path!==e.paneName&&this.$router.push(e.paneName)}},watch:{"$route.path":{immediate:!0,handler(e){this.curTabName=e}}}},l=u,s=t(1001),i=(0,s.Z)(l,c,r,!1,null,"6705dc48",null),o=i.exports}}]);
//# sourceMappingURL=918.fb6984cd.js.map