import K from"./DocsAside.65a29f3d.js";import L from"./ProseCodeInline.89d68eef.js";import Q from"./Alert.b01a20b1.js";import U from"./DocsPageBottom.a1b35498.js";import G from"./DocsPrevNext.96553670.js";import{f as J,K as W,I as X,M as Y,v as m,i as $,N as Z,O as oo,P as eo,o as i,c as V,w as h,u as t,e as g,k as c,s as k,j as p,r as to,B as x,t as no,Q as so,l as y,m as ao,R as co,p as lo,q as ro,b as io}from"./entry.ff93715f.js";import po from"./DocsToc.f967a145.js";/* empty css                           *//* empty css                      *//* empty css                            */import"./ContentSlot.360295b4.js";/* empty css                  */import"./ProseA.9a41bfca.js";/* empty css                   */import"./EditOnLink.vue.eab35389.js";/* empty css                           *//* empty css                         */import"./DocsTocLinks.f14ad2d9.js";/* empty css                         *//* empty css                    */const uo=u=>(lo("data-v-d5506efe"),u=u(),ro(),u),_o={class:"page-body"},mo={key:1,class:"toc"},fo={class:"toc-wrapper"},vo=uo(()=>p("span",{class:"title"},"Table of Contents",-1)),ho=J({__name:"DocsPageLayout",setup(u){const{page:s,navigation:A}=W(),{config:f}=X(),M=Y(),j=(o,e=!0)=>{var n;return typeof((n=s.value)==null?void 0:n[o])<"u"?s.value[o]:e},T=m(()=>{var o,e,n;return!s.value||((n=(e=(o=s.value)==null?void 0:o.body)==null?void 0:e.children)==null?void 0:n.length)>0}),P=m(()=>{var o,e,n,_,d;return((o=s.value)==null?void 0:o.toc)!==!1&&((d=(_=(n=(e=s.value)==null?void 0:e.body)==null?void 0:n.toc)==null?void 0:_.links)==null?void 0:d.length)>=2}),S=m(()=>{var o,e;return((o=s.value)==null?void 0:o.aside)!==!1&&((e=A.value)==null?void 0:e.length)>1}),H=m(()=>j("bottom",!0)),l=$(!1),a=$(null),v=()=>M.path.split("/").slice(0,2).join("/"),r=Z("asideScroll",()=>{var o;return{parentPath:v(),scrollTop:((o=a.value)==null?void 0:o.scrollTop)||0}});function b(){a.value&&(a.value.scrollHeight===0&&setTimeout(b,0),a.value.scrollTop=r.value.scrollTop)}return oo(()=>{r.value.parentPath!==v()?(r.value.parentPath=v(),r.value.scrollTop=0):b()}),eo(()=>{a.value&&(r.value.scrollTop=a.value.scrollTop)}),(o,e)=>{var C,B,N,w,D,I;const n=K,_=L,d=Q,O=U,R=G,q=ao,z=po,E=co;return i(),V(E,{fluid:(B=(C=t(f))==null?void 0:C.main)==null?void 0:B.fluid,padded:(w=(N=t(f))==null?void 0:N.main)==null?void 0:w.padded,class:y(["docs-page-content",{fluid:(I=(D=t(f))==null?void 0:D.main)==null?void 0:I.fluid,"has-toc":t(P),"has-aside":t(S)}])},{default:h(()=>[t(S)?(i(),g("aside",{key:0,ref_key:"asideNav",ref:a,class:"aside-nav"},[c(n,{class:"app-aside"})],512)):k("",!0),p("article",_o,[t(T)?to(o.$slots,"default",{key:0},void 0,!0):(i(),V(d,{key:1,type:"info"},{default:h(()=>[x(" Start writing in "),c(_,null,{default:h(()=>[x("content/"+no(t(s)._file),1)]),_:1}),x(" to see this page taking shape. ")]),_:1})),t(T)&&t(s)&&t(H)?(i(),g(so,{key:2},[c(O),c(R)],64)):k("",!0)]),t(P)?(i(),g("div",mo,[p("div",fo,[p("button",{onClick:e[0]||(e[0]=F=>l.value=!t(l))},[vo,c(q,{name:"heroicons-outline:chevron-right",class:y(["icon",[t(l)&&"rotate"]])},null,8,["class"])]),p("div",{class:y(["docs-toc-wrapper",[t(l)&&"opened"]])},[c(z,{onMove:e[1]||(e[1]=F=>l.value=!1)})],2)])])):k("",!0)]),_:3},8,["fluid","padded","class"])}}}),Oo=io(ho,[["__scopeId","data-v-d5506efe"]]);export{Oo as default};
