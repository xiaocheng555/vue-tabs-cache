import{u as s}from"./user.f06f5155.js";import{a as b,r as u,c as y,w,z as E,e as n,q as N,o as v,f as S,s as A,j as L,h as o,g as e,m as V,t as j,k as T}from"./index.2f5049a3.js";const U=["onClick"],$=T("\u5220\u9664\u5E76\u5237\u65B0tab1"),q=b({name:"Soon2"}),R=b({...q,setup(z){const c=u(!1),i=u(""),r=u([]),d=u([]),{removeCache:C}=y();function _(){c.value=!0,setTimeout(()=>{c.value=!1,r.value=Array.from(new Set(s.map(a=>a.sport))).map(a=>({name:a})),p()},1e3)}function p(){d.value=s.filter(a=>a.sport===i.value)}function F(a){const m=s.findIndex(t=>t.id===a.id);s.splice(m,1),_(),C("Soon1")}return w(()=>i.value,p),E(()=>{_()}),(a,m)=>{const t=n("el-table-column"),f=n("el-table"),h=n("el-aside"),k=n("el-link"),D=n("el-main"),g=n("el-container"),x=N("loading");return v(),S("div",null,[A((v(),L(g,null,{default:o(()=>[e(h,{width:"300px"},{default:o(()=>[e(f,{data:r.value,border:""},{default:o(()=>[e(t,{label:"\u8FD0\u52A8\u65B9\u5F0F"},{default:o(({row:l})=>[V("a",{href:"javascript:;",onClick:B=>i.value=l.name,style:{display:"block"}},j(l.name),9,U)]),_:1})]),_:1},8,["data"])]),_:1}),e(D,{style:{padding:"0 20px"}},{default:o(()=>[e(f,{data:d.value,border:""},{default:o(()=>[e(t,{prop:"id",label:"id"}),e(t,{prop:"userName",label:"\u7528\u6237\u540D"}),e(t,{prop:"sport",label:"\u8FD0\u52A8\u65B9\u5F0F"}),e(t,{prop:"day",label:"\u7EC3\u4E60\u65F6\u957F\uFF08\u5929\uFF09"}),e(t,{label:"\u64CD\u4F5C"},{default:o(({row:l})=>[e(k,{type:"danger",onClick:B=>F(l)},{default:o(()=>[$]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])]),_:1})]),_:1})),[[x,c.value]])])}}});export{R as default};
