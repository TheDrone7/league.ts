import{a6 as s,u as i,v as p,f as c,aa as u,i as l,G as e,b as d}from"./entry.ff93715f.js";import{u as f}from"./asyncData.590c97d5.js";import y from"./Ellipsis.c33a6ab2.js";import g from"./ComponentPlaygroundData.d0f46aee.js";/* empty css                                *//* empty css                     */import"./TabsHeader.7d7596ca.js";/* empty css                       */import"./ComponentPlaygroundProps.e6a68f04.js";import"./ProseH4.bb51a356.js";/* empty css                    */import"./ProseCodeInline.89d68eef.js";/* empty css                            */import"./Badge.f936056e.js";import"./ContentSlot.360295b4.js";/* empty css                  */import"./ProseP.44bba1da.js";/* empty css                   */import"./index.e4a96010.js";/* empty css                                     */import"./ComponentPlaygroundSlots.vue.07a6bd5a.js";import"./ComponentPlaygroundTokens.vue.dd1d1f4b.js";/* empty css                                    */async function h(o){s();const t=i(o);{const{data:n}=await f(`nuxt-component-meta${t?`-${t}`:""}`,()=>$fetch(`/api/component-meta${t?`/${t}`:""}`));return p(()=>n.value)}}const v=c({props:{component:{type:String,required:!0},props:{type:Object,required:!1,default:()=>({})}},async setup(o){const t=p(()=>u(o.component)),n=l({...o.props}),r=await h(o.component);return{as:t,formProps:n,componentData:r}},render(o){const t=Object.entries(this.$slots).reduce((n,[r,a])=>{if(r.startsWith("component-")){const m=r.replace("component-","");n[m]=a}return n},{});return e("div",{class:"component-playground"},[e("div",{class:"component-playground-wrapper"},[e(y,{class:"component-playground-ellipsis",blur:"5vw",height:"100%",width:"100%"}),e(o.as,{...o.formProps,class:"component-playground-component"},{...t})]),e(g,{modelValue:o.formProps,componentData:o.componentData,"onUpdate:modelValue":n=>o.formProps=n})])}}),B=d(v,[["__scopeId","data-v-9ca9b996"]]);export{B as default};
