import{_ as v,u as f,e as _,h as y,z as b,c as h,a as l,b as t,t as k,w as s,d as r,n as o,r as u,x as S,T as z,C as w,E as C,P as D,o as m}from"./index-Clrnze2-.js";const $={class:"superadmin-dashboard"},A={class:"text-center text-2xl font-bold my-8 text-gray-800"},B={class:"dashboard-nav bg-gray-50 rounded-lg p-2 mb-8"},M={__name:"SuperadminDashboard",setup(I){const c=f(),d=D(),i=_({}),p=y(()=>{var a;return((a=c.user)==null?void 0:a.role)==="superadmin"});return b(d,()=>{const a=["manage-admins","manage-users","manage-products","manage-orders"].findIndex(e=>d.path.includes(e));i.value={transform:`translateX(${a*100}%)`,width:"25%"}},{immediate:!0}),(a,e)=>{const n=u("router-link"),g=u("router-view");return m(),h("div",$,[l("h1",A,k(p.value?"Superadmin":"Admin")+" Dashboard ",1),l("nav",B,[t(n,{to:"/admin/manage-admins",class:o(["nav-link flex-1 text-center py-3 text-gray-500 relative z-10 transition-colors duration-300",{"text-blue-500":a.$route.path.includes("manage-admins")}])},{default:s(()=>e[0]||(e[0]=[r(" Manage Admins ")])),_:1},8,["class"]),t(n,{to:"/admin/manage-users",class:o(["nav-link flex-1 text-center py-3 text-gray-500 relative z-10 transition-colors duration-300",{"text-blue-500":a.$route.path.includes("manage-users")}])},{default:s(()=>e[1]||(e[1]=[r(" Manage Users ")])),_:1},8,["class"]),t(n,{to:"/admin/manage-products",class:o(["nav-link flex-1 text-center py-3 text-gray-500 relative z-10 transition-colors duration-300",{"text-blue-500":a.$route.path.includes("manage-products")}])},{default:s(()=>e[2]||(e[2]=[r(" Manage Products ")])),_:1},8,["class"]),t(n,{to:"/admin/manage-orders",class:o(["nav-link flex-1 text-center py-3 text-gray-500 relative z-10 transition-colors duration-300",{"text-blue-500":a.$route.path.includes("manage-orders")}])},{default:s(()=>e[3]||(e[3]=[r(" Manage Orders ")])),_:1},8,["class"]),l("div",{class:"nav-indicator",style:S(i.value)},null,4)]),t(g,null,{default:s(({Component:x})=>[t(z,{name:"fade",mode:"out-in"},{default:s(()=>[(m(),w(C(x)))]),_:2},1024)]),_:1})])}}},T=v(M,[["__scopeId","data-v-00794663"]]);export{T as default};
