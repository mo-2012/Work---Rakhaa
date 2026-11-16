/* إضافات: تبويب الإدخال + حاسبة العامل + موقف الشركة + تصدير Excel */
const today=()=>new Date().toISOString().slice(0,10);
const own=g=>{if(data[g]===BASE[g])data[g]=JSON.parse(JSON.stringify(BASE[g]));return data[g]};
const save=()=>{LS.set('wd_'+S.g,JSON.stringify(data[S.g]));S.src[S.g]=1};
function allC(g){const o=[S.g,S.from,S.to];S.g=g;S.from=S.to='';const C=calc();[S.g,S.from,S.to]=o;return C}
const posOf=C=>({owe:C.due-C.paid,fac:C.bill-C.col,exp:C.exp,now:C.col-C.paid-C.exp,fin:C.bill-C.due-C.exp});
function posCard(g){
 const T={owe:0,fac:0,exp:0,now:0,fin:0};(g?[g]:Object.keys(G)).forEach(k=>{const p=posOf(allC(k));for(const x in T)T[x]+=p[x]});
 const K=[['عليها للعمال',T.owe,'var(--due)'],['ليها عند المصانع',T.fac,'var(--paid)'],['مصروفات أخرى',T.exp,'var(--ink)'],['الصافي النقدي دلوقتي',T.now,T.now<0?'var(--neg)':'var(--ink)']];
 return`<section class="glass sec" id="pos"><div class="sh2"><h3>موقف الشركة${g?'':' · كل الأقسام'}</h3><span>كل الفترة</span></div><div class="kpis" style="margin:0">${K.map(k=>`<div class="glass kpi"><small>${k[0]}</small><b style="color:${k[2]}">${fm(k[1])} ج</b></div>`).join('')}</div><p class="note" style="margin:10px 4px 0">الصافي بعد سداد كل المستحقات وتحصيل كل الفواتير: <b>${fm(T.fin)} ج</b></p></section>`}
const opt=a=>a.map(x=>`<option value="${esc(x)}">`).join('');
const fld=(id,ph,ty,val,l)=>`<input class="field" id="${id}" type="${ty||'text'}" placeholder="${ph}" value="${esc(val||'')}" ${l?`list="${l}"`:''} ${ty==='number'?'inputmode="decimal"':''}>`;
const TY={s:'وردية',p:'دفعة لعامل',c:'تحصيل من مصنع',x:'مصروف'};
function en(v){
 const t=S.et||'s',D=data[S.g],A=allC(S.g),ws=A.ws.map(w=>w.n).sort(),fs=[...new Set([...D.s.map(r=>r[1]),...D.c.map(r=>r[1])])].sort();
 const cw=A.ws.find(w=>w.n===S.cw)||null,H=(S.hist||[]).filter(h=>h.g===S.g).slice(-8).reverse();
 const F={s:`${fld('e_f','المصنع','text','','fl')}${fld('e_n','اسم العامل (أكتر من اسم بفاصلة ،)','text','','wl')}<div class="fg">${fld('e_h','الساعات','number','8')}${fld('e_w','أجر العامل (للفرد)','number')}</div>${fld('e_b','حساب المصنع (للفرد)','number')}`,
  p:`${fld('e_n','العامل','text','','wl')}${fld('e_a','المبلغ','number')}<select class="field" id="e_k"><option>سلفة</option><option>دفعة</option><option>تصفية</option></select>${fld('e_t','ملاحظة (اختياري)')}`,
  c:`${fld('e_f','المصنع','text','','fl')}${fld('e_a','المبلغ المحصّل','number')}${fld('e_t','ملاحظة (اختياري)')}`,
  x:`${fld('e_i','البند (مواصلات، أكل...)')}${fld('e_t','تفاصيل (اختياري)')}${fld('e_a','المبلغ','number')}`};
 v.innerHTML=`${posCard(S.g)}
 <section class="glass sec"><div class="sh2"><h3>إدخال بيانات</h3><span>${esc(G[S.g].t)}</span></div>
 <div class="seg" style="margin-bottom:12px">${Object.keys(TY).map(k=>`<button data-e="t" data-k="${k}" class="${k===t?'on':''}">${TY[k]}</button>`).join('')}</div>
 <div style="display:grid;gap:10px">${fld('e_d','','date',today())}${F[t]}<button class="btn" data-e="add">حفظ</button></div>
 <datalist id="wl">${opt(ws)}</datalist><datalist id="fl">${opt(fs)}</datalist><div class="hint" id="eh"></div></section>
 <section class="glass sec"><div class="sh2"><h3>حاسبة العامل</h3><span>خد إيه ولسه له إيه</span></div>
 <select class="field" id="cw"><option value="">اختار العامل</option>${ws.map(n=>`<option ${n===S.cw?'selected':''}>${esc(n)}</option>`).join('')}</select>
 ${cw?`<div class="kpis" style="margin:12px 0"><div class="glass kpi"><small>مستحق</small><b>${fm(cw.due)} ج</b></div><div class="glass kpi"><small>اتدفع له</small><b>${fm(cw.paid)} ج</b></div></div>
 <div class="row"><div><b>${cw.rem<0?'سلف زائدة عليه':'الباقي له'}</b><small>${cw.sh} وردية · ${fm(cw.h)} ساعة</small></div><div><b style="color:${cw.rem<0?'var(--neg)':'var(--due)'}">${fm(Math.abs(cw.rem))} ج</b></div></div>
 <div style="display:grid;gap:10px;margin-top:12px">${fld('ca','مبلغ الدفعة','number',cw.rem>0?Math.round(cw.rem):'')}<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="btn ghost" data-e="pay">سجّل دفعة</button><button class="btn" data-e="settle" ${cw.rem>0?'':'disabled'}>تصفية كاملة</button></div></div>`:''}</section>
 <section class="glass sec"><div class="sh2"><h3>آخر الإدخالات</h3><span>للتراجع</span></div>${H.length?H.map(h=>`<div class="row"><div><b>${esc(h.l)}</b><small>${TY[h.k]} · ${h.r[0]?dd(h.r[0]):'بدون تاريخ'}</small></div><button class="btn ghost" style="min-height:38px;padding:0 14px" data-e="del" data-i="${S.hist.indexOf(h)}">حذف</button></div>`).join(''):'<div class="empty">لسه مفيش إدخالات في الجلسة دي.</div>'}</section>
 <section class="glass sec"><button class="btn ghost" style="width:100%" data-e="xl">تصدير Excel لـ ${esc(G[S.g].t)}</button></section>`}
function add(k,r,l){const D=own(S.g);D[k].push(r);(S.hist=S.hist||[]).push({g:S.g,k,r,l});save()}
function submit(){
 const V=i=>(document.getElementById(i)||{}).value||'',n=i=>parseFloat(V(i))||0,t=S.et||'s',d=V('e_d')||null,eh=$('#eh'),bad=m=>{eh.textContent=m};
 if(t==='s'){const f=V('e_f').trim(),ns=V('e_n').split(/[،,]/).map(x=>x.trim()).filter(Boolean);if(!f||!ns.length||!n('e_h'))return bad('اكتب المصنع والعامل والساعات.');
  ns.forEach(x=>add('s',[d,f,x,n('e_h'),n('e_w'),n('e_b')],x+' · '+f));toast('اتسجّلت '+ns.length+' وردية')}
 else if(t==='p'){const x=V('e_n').trim();if(!x||!n('e_a'))return bad('اكتب العامل والمبلغ.');add('p',[d,x,n('e_a'),V('e_k'),V('e_t')],x+' · '+fm(n('e_a'))+' ج');toast('اتسجلت الدفعة')}
 else if(t==='c'){const f=V('e_f').trim();if(!f||!n('e_a'))return bad('اكتب المصنع والمبلغ.');add('c',[d,f,n('e_a'),V('e_t')],f+' · '+fm(n('e_a'))+' ج');toast('اتسجل التحصيل')}
 else{const i=V('e_i').trim();if(!i||!n('e_a'))return bad('اكتب البند والمبلغ.');add('x',[d,i,V('e_t'),n('e_a')],i+' · '+fm(n('e_a'))+' ج');toast('اتسجل المصروف')}
 render()}
function pay(settle){
 const w=allC(S.g).ws.find(x=>x.n===S.cw);if(!w)return;const a=settle?Math.round(w.rem*100)/100:parseFloat($('#ca').value)||0;
 if(a<=0)return toast('اكتب مبلغ صحيح');add('p',[today(),w.n,a,settle?'تصفية':'دفعة',''],w.n+' · '+fm(a)+' ج');toast('اتسجلت الدفعة');render()}
function xl(g){
 const D=data[g],wb=XLSX.utils.book_new(),z=d=>d?Math.round(Date.parse(d+'T00:00:00Z')/864e5)+25569:'',
 A=(n,h,rows)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([h,...rows]),n);
 A('الورديات',['التاريخ','المصنع','','العامل','الساعات','','','أجر العامل','','حساب المصنع'],D.s.map(r=>[z(r[0]),r[1],'',r[2],r[3],'','',r[4],'',r[5]]));
 A('المدفوعات',['التاريخ','','العامل','المبلغ','النوع','ملاحظة'],D.p.map(r=>[z(r[0]),'',r[1],r[2],r[3],r[4]]));
 A('المتحصلات',['التاريخ','المصنع','المبلغ','ملاحظة'],D.c.map(r=>[z(r[0]),r[1],r[2],r[3]]));
 A('مصروفات أخرى',['التاريخ','البند','التفاصيل','المبلغ'],D.x.map(r=>[z(r[0]),r[1],r[2],r[3]]));
 XLSX.writeFile(wb,'مستحقات-'+G[g].t+'.xlsx')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-e]');if(!b)return;const a=b.dataset.e;
 if(a==='t'){S.et=b.dataset.k;render()}else if(a==='add')submit();else if(a==='pay')pay(0);else if(a==='settle')pay(1);
 else if(a==='xl')xl(S.g);
 else if(a==='del'){const h=S.hist[+b.dataset.i];if(!h)return;const D=own(h.g),i=D[h.k].indexOf(h.r);if(i>-1)D[h.k].splice(i,1);S.hist.splice(+b.dataset.i,1);save();render();toast('اتحذف')}});
document.addEventListener('change',e=>{if(e.target.id==='cw'){S.cw=e.target.value;render()}});
const _render=render;render=function(){_render();if(S.tab==='ov'&&S.g){const v=$('#vw');if(v)v.insertAdjacentHTML('afterbegin',posCard(S.g))}};
const _gate=gate;gate=function(){_gate();const o=$('#pos');if(o)o.remove();$('#picks').insertAdjacentHTML('afterend',posCard())};
gate();
