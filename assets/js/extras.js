/* إضافات: إدخال البيانات، حاسبة الحساب، موقف الشركة، تصدير Excel */
const td=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const uniq=a=>[...new Set(a.filter(Boolean))];
let EK='s';const EV={s:{},p:{},c:{},x:{}};S.hist=[];
function persist(){S.src[S.g]=1;LS.set('wd_'+S.g,JSON.stringify(data[S.g]))}

/* ---------- تبويب الإدخال ---------- */
function en(v){
 const D=data[S.g],g=G[S.g],E=EV[EK],val=(k,d)=>esc(E[k]!=null?E[k]:(d||''));
 const fl=uniq(D.s.map(r=>r[1])),wl=uniq([...D.s.map(r=>r[2]),...D.p.map(r=>r[1])]),pt=uniq([...D.p.map(r=>r[3]),'سلف','تصفية','تحويل','علاج']);
 const f=(id,l,ex,cls)=>`<label class="fl ${cls||''}">${l}<input id="${id}" class="field" ${ex||''}></label>`;
 const dt=f('e_d','التاريخ',`type="date" value="${val('e_d',td())}"`);
 const T={s:'وردية',p:'دفعة',c:'تحصيل',x:'مصروف'};
 const forms={
  s:`${dt}${f('e_f','المصنع',`list="lf" value="${val('e_f')}"`)}${f('e_h','الساعات',`type="number" inputmode="decimal" value="${val('e_h',8)}"`)}${f('e_c','أجر الوردية للفرد (ج)',`type="number" inputmode="decimal" value="${val('e_c')}"`)}${f('e_b','فوترة المصنع للفرد (ج)',`type="number" inputmode="decimal" value="${val('e_b')}"`,'full')}
   <label class="fl full">الأسماء (اسم في كل سطر — كل اسم بيتسجل له وردية)<textarea id="e_n" class="field" placeholder="اكتب الأسماء هنا"></textarea></label>`,
  p:`${dt}${f('e_w',g.one,'list="lw"')}${f('e_a','المبلغ (ج)',`type="number" inputmode="decimal"`)}${f('e_t','النوع',`list="lt" value="${val('e_t','سلف')}"`)}${f('e_o','ملاحظة','','full')}`,
  c:`${dt}${f('e_f','المصنع',`list="lf" value="${val('e_f')}"`)}${f('e_a','المبلغ المحصّل (ج)',`type="number" inputmode="decimal"`,'full')}${f('e_o','ملاحظة','','full')}`,
  x:`${dt}${f('e_i','البند',`value="${val('e_i')}"`)}${f('e_a','المبلغ (ج)',`type="number" inputmode="decimal"`)}${f('e_o','ملاحظة','','full')}`};
 const lab={s:'سجّل الورديات',p:'سجّل الدفعة (اللي خدته)',c:'سجّل التحصيل من المصنع',x:'سجّل المصروف'};
 const h=S.hist.length;
 v.innerHTML=`<section class="glass sec"><div class="sh2"><h3>إدخال بيانات ${g.t}</h3></div>
 <div class="seg" style="margin-bottom:14px">${Object.keys(T).map(k=>`<button data-a="ek" data-k="${k}" class="${EK===k?'on':''}">${T[k]}</button>`).join('')}</div>
 <div class="fgrid">${forms[EK]}</div>
 <button class="btn" style="width:100%" data-a="esave">${lab[EK]}</button>
 ${h?`<button class="btn ghost" style="width:100%;margin-top:10px" data-a="eundo">تراجع عن آخر إدخال (${S.hist[h-1].rows.length} سطر)</button>`:''}
 <datalist id="lf">${fl.map(x=>`<option value="${esc(x)}">`).join('')}</datalist><datalist id="lw">${wl.map(x=>`<option value="${esc(x)}">`).join('')}</datalist><datalist id="lt">${pt.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></section>
 <section class="glass sec"><div class="sh2"><h3>نسخة احتياطية</h3></div><p class="note" style="margin:0 0 10px">البيانات بتتحفظ في المتصفح ده. صدّر ملف Excel بشكل دوري، وتقدر ترفعه تاني من زرار الرفع.</p>
 <button class="btn ghost" style="width:100%" data-a="xl">تصدير Excel لـ${g.t}</button></section>`;
}
function enSave(){
 const D=data[S.g],q=id=>(($('#'+id)||{}).value||'').trim(),n=id=>+q(id)||0,d=q('e_d')||td();let rows=[];
 if(EK==='s'){const ns=q('e_n').split(/[\n,،]+/).map(x=>x.trim()).filter(Boolean),fa=q('e_f'),h=n('e_h'),c=n('e_c'),b=n('e_b');
  if(!fa||!ns.length||!h||!c)return toast('كمّل المصنع والأسماء والساعات والأجر');
  rows=ns.map(x=>[d,fa,x,h,c,b]);Object.assign(EV.s,{e_d:d,e_f:fa,e_h:h,e_c:c,e_b:b})}
 else if(EK==='p'){const w=q('e_w'),a=n('e_a');if(!w||!a)return toast('اكتب الاسم والمبلغ');rows=[[d,w,a,q('e_t')||'سلف',q('e_o')]];Object.assign(EV.p,{e_d:d,e_t:q('e_t')})}
 else if(EK==='c'){const fa=q('e_f'),a=n('e_a');if(!fa||!a)return toast('اكتب المصنع والمبلغ');rows=[[d,fa,a,q('e_o')]];Object.assign(EV.c,{e_d:d,e_f:fa})}
 else{const i=q('e_i'),a=n('e_a');if(!i||!a)return toast('اكتب البند والمبلغ');rows=[[d,i,q('e_o'),a]];Object.assign(EV.x,{e_d:d})}
 D[EK].push(...rows);S.hist.push({k:EK,rows});persist();render();toast('اتسجّل '+rows.length+' سطر ✓');
}
function enUndo(){const h=S.hist.pop();if(!h)return;const D=data[S.g];h.rows.forEach(r=>{const i=D[h.k].indexOf(r);if(i>-1)D[h.k].splice(i,1)});persist();render();toast('تم التراجع')}

/* ---------- حاسبة الحساب داخل كشف الفرد ---------- */
function calcCard(w,p){
 const took={};p.forEach(r=>{const k=r[3]||'أخرى';took[k]=(took[k]||0)+r[2]});
 return`<div class="glass sec" data-w="${esc(w.n)}" data-rem="${w.rem}"><div class="sh2"><h3>حاسبة الحساب</h3><span>خدت إيه</span></div>
 ${Object.entries(took).map(([k,a])=>`<div class="tbar"><span class="tn">${esc(k)}</span><span class="tv"><i style="width:${pct(a,w.paid)}%"></i></span><span class="ta">${fm(a)}</span></div>`).join('')||'<div class="empty" style="padding:8px">لسه ماخدتش حاجة</div>'}
 <div style="display:flex;gap:8px;margin-top:12px"><input id="cc_a" class="field" type="number" inputmode="decimal" placeholder="اكتب مبلغ" style="flex:1;height:48px"><button class="btn ghost" data-a="full">الباقي كله</button></div>
 <div id="cc_o" class="note" style="margin:10px 4px;min-height:20px"></div>
 <div class="acts" style="margin:0"><button class="btn" data-a="cpay" data-ty="سلف">سجّل سلفة</button><button class="btn ghost" data-a="cpay" data-ty="تصفية">سجّل تصفية</button></div></div>`}

/* ---------- موقف الشركة (البنات + الشباب، كل الفترة) ---------- */
function posCard(){
 let owe=0,adv=0,rf=0,cost=0,bill=0,exp=0;
 for(const g in G){const S0=S.g,sf=S.from,st=S.to;S.g=g;S.from=S.to='';const C=calc();S.g=S0;S.from=sf;S.to=st;
  C.ws.forEach(w=>{if(w.rem>0)owe+=w.rem;else adv-=w.rem});rf+=C.bill-C.col;cost+=C.cost;bill+=C.bill;exp+=C.exp}
 const has=rf+adv,net=has-owe,mg=bill-cost,pr=mg-exp,cl=x=>x<0?'var(--neg)':'var(--paid)';
 return`<section class="glass sec" style="margin-top:14px"><div class="sh2"><h3>موقف الشركة</h3><span>كل الفترة · البنات + الشباب</span></div>
 <div class="kpis" style="margin:0">${kp('الشركة عليها',fm(owe)+' <small>ج</small>','مستحقات العمال')}${kp('الشركة ليها',fm(has)+' <small>ج</small>','عند المصانع + سلف زيادة')}${kp('الصافي',fm(net)+' <small>ج</small>','ليها − عليها',cl(net))}${kp('هامش الفوترة',fm(mg)+' <small>ج</small>','فوترة − تكلفة عمالة')}${kp('مصروفات أخرى',fm(exp)+' <small>ج</small>')}${kp('صافي الربح',fm(pr)+' <small>ج</small>','بعد المصروفات',cl(pr))}</div></section>`}

/* ---------- تصدير Excel بنفس شكل الرفع ---------- */
function xlExport(){
 const D=data[S.g],dv=d=>d?new Date(d+'T00:00:00Z'):'',wb=XLSX.utils.book_new(),
 add=(n,h,r)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([h,...r],{cellDates:true}),n);
 add('الورديات',['التاريخ','المصنع','','العامل','الساعات','','','أجر الوردية','','فوترة المصنع'],D.s.map(r=>[dv(r[0]),r[1],'',r[2],r[3],'','',r[4],'',r[5]]));
 add('المدفوعات',['التاريخ','','العامل','المبلغ','النوع','ملاحظة'],D.p.map(r=>[dv(r[0]),'',r[1],r[2],r[3],r[4]]));
 add('المتحصلات',['التاريخ','المصنع','المبلغ','ملاحظة'],D.c.map(r=>[dv(r[0]),r[1],r[2],r[3]]));
 add('مصروفات أخرى',['التاريخ','البند','ملاحظة','المبلغ'],D.x.map(r=>[dv(r[0]),r[1],r[2],r[3]]));
 XLSX.writeFile(wb,'rakhaa-'+G[S.g].t+'-'+td()+'.xlsx');
}

/* ---------- أحداث الإضافات ---------- */
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a;
 if(a==='ek'){EK=t.dataset.k;render()}
 else if(a==='esave')enSave();else if(a==='eundo')enUndo();else if(a==='xl')xlExport();
 else if(a==='full'){const r=+t.closest('[data-rem]').dataset.rem;$('#cc_a').value=r>0?r:'';$('#cc_a').dispatchEvent(new Event('input',{bubbles:true}))}
 else if(a==='cpay'){const n=t.closest('[data-w]').dataset.w,v=+$('#cc_a').value;if(!(v>0))return toast('اكتب المبلغ الأول');
  const row=[td(),n,v,t.dataset.ty,''];data[S.g].p.push(row);S.hist.push({k:'p',rows:[row]});persist();render();sheet(n);toast('اتسجّل '+t.dataset.ty+' '+fm(v)+' ج')}
});
document.addEventListener('input',e=>{if(e.target.id!=='cc_a')return;const s=e.target.closest('[data-rem]'),a=+e.target.value||0,r=+s.dataset.rem-a;
 $('#cc_o').innerHTML=a?(r<0?'سلف زيادة بعد الدفع: <b>'+fm(-r)+' ج</b>':r===0?'الحساب هيتصفّى بالكامل':'المتبقي بعد الدفع: <b>'+fm(r)+' ج</b>'):''});
document.addEventListener('change',e=>{if(e.target.id!=='e_f'&&e.target.id!=='e_h')return;if(EK!=='s')return;
 const f=$('#e_f').value.trim(),h=+$('#e_h').value,r=[...data[S.g].s].reverse().find(r=>r[1]===f&&r[3]===h);if(r){$('#e_c').value=r[4];$('#e_b').value=r[5]}});

/* تشغيل */
$('#nm').value=S.name;gate();
