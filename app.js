const $=s=>document.querySelector(s),esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fm=n=>Math.round(n).toLocaleString('en-US'),dd=d=>d?d.slice(8)+'/'+d.slice(5,7):'بدون تاريخ';
const addD=(d,n)=>{const t=new Date(d+'T00:00:00Z');t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10)};
const wday=d=>{if(!d)return'بدون تاريخ';try{return new Date(d+'T00:00:00').toLocaleDateString('ar-EG',{weekday:'long'})}catch(e){return''}};
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const S={g:null,name:LS.get('wd_name')||'',from:'',to:'',pr:'all',tab:'ov',wq:'',ws:'rem',wf:'all',lk:'s',lq:'',lsel:'',up:null,src:{}};
const data={};let CH=[];
for(const g in G){let d=null,r=LS.get('wd_'+g);if(r){try{d=JSON.parse(r);S.src[g]=1}catch(e){}}data[g]=d||BASE[g]}

function calc(){
 const D=data[S.g],ok=d=>(!S.from||(d&&d>=S.from))&&(!S.to||(d&&d<=S.to));
 const s=D.s.filter(r=>ok(r[0])),p=D.p.filter(r=>ok(r[0])),c=D.c.filter(r=>ok(r[0])),x=D.x.filter(r=>ok(r[0]));
 const W={},F={},w=n=>W[n]||(W[n]={n,sh:0,h:0,due:0,paid:0}),f=n=>F[n]||(F[n]={n,sh:0,h:0,cost:0,bill:0,col:0});
 s.forEach(r=>{const a=w(r[2]);a.sh++;a.h+=r[3];a.due+=r[4];const b=f(r[1]);b.sh++;b.h+=r[3];b.cost+=r[4];b.bill+=r[5]});
 p.forEach(r=>{w(r[1]).paid+=r[2]});c.forEach(r=>{f(r[1]).col+=r[2]});
 const ws=Object.values(W).map(a=>({...a,rem:a.due-a.paid})),fs=Object.values(F),sm=(a,k)=>a.reduce((t,o)=>t+o[k],0);
 return{s,p,c,x,ws,fs,due:sm(ws,'due'),paid:sm(ws,'paid'),h:sm(ws,'h'),exp:x.reduce((t,r)=>t+r[3],0),bill:sm(fs,'bill'),col:sm(fs,'col'),cost:sm(fs,'cost')};
}
function toast(m){const t=$('#toast');t.innerHTML='<span>'+esc(m)+'</span>';clearTimeout(toast.t);toast.t=setTimeout(()=>t.innerHTML='',2600)}
const pct=(a,b)=>b>0?Math.max(0,Math.min(100,a/b*100)):0;
const av=n=>`<span class="av" aria-hidden="true">${esc(String(n).trim()[0]||'؟')}</span>`;
const fIdx=n=>{const l=[...new Set(data[S.g].s.map(r=>r[1]))],i=l.indexOf(n);return Math.min(i<0?7:i,7)+1};
const fVar=n=>'var(--s'+fIdx(n)+')';
const lastDate=()=>[...data[S.g].s,...data[S.g].p].map(r=>r[0]).filter(Boolean).sort().at(-1)||'';
function setPr(k){S.pr=k;const last=lastDate();
 if(k==='all'){S.from=S.to=''}
 else if(k==='7'||k==='14'){S.from=last?addD(last,-(+k-1)):'';S.to=''}
 else if(k==='c'&&!S.from&&!S.to&&last){S.from=addD(last,-6)}}
function ring(p,sub){const r=46,c=2*Math.PI*r;
 return`<svg class="ring" viewBox="0 0 120 120" role="img" aria-label="${Math.round(p)}%"><circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--fill)" stroke-width="12"/>${p>0?`<circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--paid)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(c*p/100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 60 60)"/>`:''}<text x="60" y="60" text-anchor="middle" class="rt">${Math.round(p)}%</text><text x="60" y="80" text-anchor="middle" class="rs">${sub}</text></svg>`}
const kp=(l,b,s,st)=>`<div class="glass kpi"><small>${l}</small><b${st?` style="color:${st}"`:''}>${b}</b>${s?`<span>${s}</span>`:''}</div>`;

/* gate */
function gate(){
 $('#picks').innerHTML=Object.keys(G).map(g=>{const S0=S.g,sf=S.from,st=S.to;S.g=g;S.from=S.to='';const C=calc();S.g=S0;S.from=sf;S.to=st;
  return`<div class="glass pick" style="--c:${G[g].c}"><button class="ph" data-a="pick" data-g="${g}"><span class="ci">${G[g].t[2]}</span><span><b>${G[g].t}</b>
  <span class="mt"><span><b>${C.ws.length}</b> ${C.ws.length>10?G[g].one:G[g].many}</span><span>المتبقي <b>${fm(C.due-C.paid)}</b> ج</span></span></span></button>
  <div class="go"><button class="btn" data-a="pick" data-g="${g}">افتح لوحة ${G[g].t}</button><button class="btn ghost" data-a="up" data-g="${g}">ارفع ملف محدّث</button></div></div>`}).join('');
}
function needName(){const v=$('#nm').value.trim();if(!v){$('#hint').textContent='اكتب اسمك الأول.';$('#nm').focus();return false}S.name=v;LS.set('wd_name',v);$('#hint').textContent='';return true}
function open_(g){S.g=g;S.tab='ov';S.from=S.to=S.wq=S.lq=S.lsel='';S.pr='all';S.wf='all';S.ws='rem';S.lk='s';document.body.dataset.g=g;$('#gate').hidden=true;$('#app').hidden=false;scrollTo(0,0);render()}

/* render */
function render(){
 CH.forEach(c=>c.destroy());CH=[];
 $('#flt').hidden=S.tab==='en';const C=calc(),g=G[S.g],D=data[S.g];
 $('#ht').textContent='لوحة '+g.t;$('#hs').textContent='أهلاً يا '+S.name+(S.src[S.g]?' · بيانات محفوظة':'');
 document.querySelectorAll('#flt [data-a=pr]').forEach(b=>b.classList.toggle('on',b.dataset.k===S.pr));
 document.querySelectorAll('#nv button').forEach(b=>b.classList.toggle('on',b.dataset.t===S.tab));
 $('#dr').hidden=S.pr!=='c';$('#df').value=S.from;$('#dt').value=S.to;
 const dates=D.s.map(r=>r[0]).filter(Boolean).sort();
 if(dates.length){$('#df').min=$('#dt').min=dates[0];$('#df').max=$('#dt').max=dates.at(-1)}
 $('#rng').textContent=dates.length?(S.from||S.to?'الفترة: '+dd(S.from||dates[0])+' إلى '+dd(S.to||dates.at(-1)):'كل التواريخ المسجلة · '+dd(dates[0])+' إلى '+dd(dates.at(-1))):'';
 const v=$('#vw');
 if(S.tab!=='en'&&!C.s.length&&!C.p.length){v.innerHTML='<div class="glass sec empty">مفيش بيانات في الفترة دي.<br>اختار «كل الفترة» أو غيّر التواريخ.</div>';return}
 if(S.tab==='ov')ov(v,C);else if(S.tab==='wk'){wkShell(v,C);wkList(C)}else if(S.tab==='fc')fc(v,C);else if(S.tab==='en')en(v,C);else lgShell(v,C);
}

/* overview */
function ov(v,C){
 const g=G[S.g],rem=C.due-C.paid,pp=pct(Math.min(C.paid,C.due),C.due),mg=C.bill-C.cost,net=mg-C.exp,mp=C.bill?mg/C.bill*100:0,avg=C.s.length?C.due/C.s.length:0;
 const over=C.ws.filter(w=>w.rem<0).sort((a,b)=>a.rem-b.rem),top=C.ws.filter(w=>w.rem>0).sort((a,b)=>b.rem-a.rem).slice(0,5);
 const ty={};C.p.forEach(r=>{const k=r[3]||'أخرى';ty[k]=(ty[k]||0)+r[2]});
 const tys=Object.entries(ty).sort((a,b)=>b[1]-a[1]),tmax=tys.length?tys[0][1]:1;
 const wr=(w,neg)=>`<button class="wr" data-a="open" data-n="${esc(w.n)}">${av(w.n)}<span class="wm"><b>${esc(w.n)}</b><small>${w.sh} وردية · ${fm(w.h)} ساعة</small></span><span class="wa ${neg?'neg':'due'}">${neg?'سلف '+fm(-w.rem):fm(w.rem)} <small>ج</small></span></button>`;
 v.innerHTML=`<section class="glass hero"><div class="ht"><div class="eyebrow">المتبقي لـ${g.many} عند الشركة</div><div class="big">${fm(rem)} <small>ج</small></div>
 <div class="pills"><span class="pill due"><i></i>مستحق ${fm(C.due)}</span><span class="pill paid"><i></i>مدفوع ${fm(C.paid)}</span></div></div>${ring(pp,'نسبة السداد')}</section>
 ${S.from||S.to?'<p class="note">الأرقام دي للفترة المختارة بس.</p>':''}
 <div class="kpis">${kp(g.many,C.ws.length,'عدد من اشتغل')}${kp('الورديات',C.s.length,fm(C.h)+' ساعة')}${kp('متوسط الوردية',fm(avg)+' <small>ج</small>','تكلفة العمالة للوردية')}${kp('هامش الشركة',fm(mg)+' <small>ج</small>',mp.toFixed(1)+'% من الفوترة')}${kp('مصروفات أخرى',fm(C.exp)+' <small>ج</small>',C.x.length?C.x.length+' بند':'لا يوجد')}${kp('الصافي',fm(net)+' <small>ج</small>','بعد المصروفات',net<0?'var(--neg)':'var(--paid)')}</div>
 ${top.length?`<section class="glass sec"><div class="sh2"><h3>الأعلى مستحقًا</h3><span>اضغط لفتح الكشف</span></div>${top.map(w=>wr(w,false)).join('')}</section>`:''}
 ${over.length?`<section class="glass sec"><div class="sh2"><h3>سلف زائدة تحتاج متابعة</h3><span class="pill neg">${over.length}</span></div>${over.map(w=>wr(w,true)).join('')}</section>`:''}
 <section class="glass sec"><div class="sh2"><h3>المستحق والمدفوع لكل ${g.one}</h3></div><div class="cv" style="height:${Math.max(200,C.ws.length*36+80)}px"><canvas id="c1" role="img" aria-label="المستحق والمدفوع لكل ${g.one}"></canvas></div></section>
 <section class="glass sec"><div class="sh2"><h3>الساعات كل يوم حسب المصنع</h3></div><div class="cv"><canvas id="c2" role="img" aria-label="الساعات اليومية حسب المصنع"></canvas></div></section>
 <section class="glass sec"><div class="sh2"><h3>الفوترة والتكلفة كل يوم</h3><span>بالجنيه</span></div><div class="cv"><canvas id="c3" role="img" aria-label="الفوترة وتكلفة العمالة اليومية"></canvas></div></section>
 <section class="glass sec"><div class="sh2"><h3>المدفوعات حسب النوع</h3><span>${fm(C.paid)} ج</span></div>${tys.length?tys.map(([k,a])=>`<div class="tbar"><span class="tn">${esc(k)}</span><span class="tv"><i style="width:${a/tmax*100}%"></i></span><span class="ta">${fm(a)}</span></div>`).join(''):'<div class="empty">مفيش مدفوعات</div>'}</section>
 ${S.src[S.g]?'<button class="btn ghost" style="width:100%" data-a="reset">استرجاع البيانات الأصلية</button>':''}`;
 charts(C);
}
function mk(id,cfg){const e=document.getElementById(id);if(e)CH.push(new Chart(e,cfg))}
function chartKit(){
 const cs=getComputedStyle(document.body),t=n=>cs.getPropertyValue(n).trim();
 Chart.defaults.font.family="-apple-system,'SF Arabic','IBM Plex Sans Arabic',Tahoma,sans-serif";Chart.defaults.font.size=12;Chart.defaults.color=t('--mut');
 return{t,grid:t('--hair'),surf:t('--surf'),
  tip:{rtl:true,textDirection:'rtl',backgroundColor:t('--ink'),titleColor:t('--bg'),bodyColor:t('--bg'),padding:10,cornerRadius:12,boxPadding:4,usePointStyle:true},
  lg:{rtl:true,position:'bottom',labels:{boxWidth:9,boxHeight:9,usePointStyle:true,pointStyle:'rectRounded',padding:14,color:t('--ink2')}}};
}
function charts(C){
 const K=chartKit(),{t,grid,surf,tip,lg}=K;
 const ws=[...C.ws].sort((a,b)=>b.due-a.due);
 const seg=(label,data,c)=>({label,data,backgroundColor:c,borderColor:surf,borderWidth:2,borderRadius:6,borderSkipped:false,maxBarThickness:18});
 mk('c1',{type:'bar',data:{labels:ws.map(a=>a.n),datasets:[
  seg('مدفوع',ws.map(a=>Math.min(a.paid,Math.max(a.due,0))||null),t('--paid')),
  seg('متبقي',ws.map(a=>Math.max(a.rem,0)||null),t('--due')),
  seg('سلف زائدة',ws.map(a=>Math.max(-a.rem,0)||null),t('--neg'))]},
  options:{indexAxis:'y',maintainAspectRatio:false,interaction:{mode:'index',intersect:false},scales:{x:{stacked:true,reverse:true,grid:{color:grid},border:{display:false},ticks:{callback:v=>fm(v)}},y:{stacked:true,position:'right',grid:{display:false},border:{display:false}}},
   plugins:{tooltip:{...tip,callbacks:{label:c=>' '+c.dataset.label+': '+fm(c.parsed.x)+' ج'}},legend:lg}}});
 const days=[...new Set(C.s.map(r=>r[0]))].sort(),fcs=[...new Set(C.s.map(r=>r[1]))];
 mk('c2',{type:'bar',data:{labels:days.map(dd),datasets:fcs.map(f=>({label:f,backgroundColor:t('--s'+fIdx(f)),borderColor:surf,borderWidth:2,borderRadius:6,borderSkipped:false,maxBarThickness:30,data:days.map(d=>C.s.filter(r=>r[0]===d&&r[1]===f).reduce((a,r)=>a+r[3],0)||null)}))},
  options:{maintainAspectRatio:false,interaction:{mode:'index',intersect:false},scales:{x:{stacked:true,reverse:true,grid:{display:false},border:{display:false}},y:{stacked:true,position:'right',grid:{color:grid},border:{display:false},ticks:{callback:v=>fm(v)}}},
   plugins:{tooltip:{...tip,callbacks:{label:c=>' '+c.dataset.label+': '+fm(c.parsed.y)+' ساعة'}},legend:lg}}});
 const bill=days.map(d=>C.s.filter(r=>r[0]===d).reduce((a,r)=>a+r[5],0)),cost=days.map(d=>C.s.filter(r=>r[0]===d).reduce((a,r)=>a+r[4],0));
 const endPt=a=>a.map((_,i)=>i===a.length-1?5:0),ln=(label,d,c,fill)=>({label,data:d,borderColor:c,backgroundColor:c+'26',fill,borderWidth:2,tension:.35,pointRadius:endPt(d),pointHoverRadius:6,pointBackgroundColor:c,pointBorderColor:surf,pointBorderWidth:2});
 mk('c3',{type:'line',data:{labels:days.map(dd),datasets:[ln('مستحق على المصانع',bill,t('--s1'),true),ln('تكلفة العمالة',cost,t('--s2'),false)]},
  options:{maintainAspectRatio:false,interaction:{mode:'index',intersect:false},scales:{x:{reverse:true,grid:{display:false},border:{display:false}},y:{position:'right',beginAtZero:true,grid:{color:grid},border:{display:false},ticks:{callback:v=>fm(v)}}},
   plugins:{tooltip:{...tip,callbacks:{label:c=>' '+c.dataset.label+': '+fm(c.parsed.y)+' ج'}},legend:lg}}});
}

/* workers */
function wkShell(v,C){
 const g=G[S.g],ch=(k,id,t,cur)=>`<button class="chip${cur===k?' on':''}" data-a="${id}" data-k="${k}">${t}</button>`;
 v.innerHTML=`<div class="glass tools"><div class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg><input id="wq" type="search" placeholder="دوّر باسم ${g.one}" value="${esc(S.wq)}" aria-label="بحث"></div>
 <div class="chips">${ch('rem','ws','الأكثر متبقي',S.ws)+ch('due','ws','الأعلى مستحق',S.ws)+ch('h','ws','الأكثر ساعات',S.ws)+ch('n','ws','أبجدي',S.ws)}</div>
 <div class="chips">${ch('all','wf','الكل',S.wf)+ch('open','wf','له مستحق',S.wf)+ch('neg','wf','عليه سلف زائدة',S.wf)+ch('done','wf','اتسدد',S.wf)}</div></div><div id="wl"></div>`;
}
function wkList(C){
 const q=S.wq.trim();let a=C.ws.filter(w=>(!q||w.n.includes(q))&&(S.wf==='all'||(S.wf==='open'&&w.rem>0)||(S.wf==='neg'&&w.rem<0)||(S.wf==='done'&&w.rem===0)));
 a.sort((x,y)=>S.ws==='n'?x.n.localeCompare(y.n,'ar'):y[S.ws]-x[S.ws]);
 $('#wl').innerHTML=a.length?a.map(w=>{const st=w.rem<0?['neg','سلف زائدة']:w.rem===0?['paid','اتسدد']:['due','له مستحق'];
  return`<button class="glass wk" data-a="open" data-n="${esc(w.n)}"><div class="r1">${av(w.n)}<span class="wm"><b>${esc(w.n)}</b><small>${w.sh} وردية · ${fm(w.h)} ساعة</small></span><span style="text-align:left"><span class="wa ${w.rem<0?'neg':w.rem===0?'ok':'due'}">${fm(Math.abs(w.rem))} <small>ج</small></span><br><span class="pill ${st[0]}" style="min-height:22px;font-size:11.5px">${st[1]}</span></span></div>
  <div class="pb"><i style="width:${pct(w.paid,w.due)}%"></i></div><div class="r2"><span>مستحق ${fm(w.due)}</span><span>مدفوع ${fm(w.paid)}</span></div></button>`}).join(''):'<div class="glass sec empty">مفيش نتائج.</div>';
}
function sheet(n){
 const C=calc(),w=C.ws.find(x=>x.n===n);if(!w)return;
 const by=(a,b)=>(b[0]||'').localeCompare(a[0]||''),s=C.s.filter(r=>r[2]===n).sort(by),p=C.p.filter(r=>r[1]===n).sort(by);
 const fcn={};s.forEach(r=>fcn[r[1]]=(fcn[r[1]]||0)+1);
 const txt=`كشف حساب ${n}\n${S.from||S.to?`الفترة: ${S.from||'—'} إلى ${S.to||'—'}\n`:''}الورديات: ${w.sh} (${fm(w.h)} ساعة)\nالمستحق: ${fm(w.due)} ج\nالمدفوع: ${fm(w.paid)} ج\n${w.rem<0?'سلف زائدة':'المتبقي'}: ${fm(Math.abs(w.rem))} ج`;
 $('#sh').innerHTML=`<div class="grab"></div><div class="top"><h2>${esc(n)}</h2><button class="ib" data-a="close" aria-label="إغلاق"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
 <div class="glass sec"><div class="eyebrow">${w.rem<0?'سلف زائدة':'المتبقي'}</div><div class="big" style="color:${w.rem<0?'var(--neg)':'var(--ink)'};margin-bottom:10px">${fm(Math.abs(w.rem))} <small>ج</small></div><div class="pb" style="margin:0"><i style="width:${pct(w.paid,w.due)}%"></i></div>
 <div class="stat3"><div><b>${fm(w.due)}</b>المستحق</div><div><b>${fm(w.paid)}</b>المدفوع</div><div><b>${w.sh}</b>وردية · ${fm(w.h)} س</div></div></div>
 <div class="acts"><button class="btn" data-a="copy" data-x="${esc(txt)}">انسخ الكشف</button><a class="btn wa-b" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(txt)}">أرسل واتساب</a></div>
 ${Object.keys(fcn).length?`<div class="fchips">${Object.entries(fcn).map(([f,c])=>`<span><i class="dot" style="background:${fVar(f)}"></i>${esc(f)} · ${c}</span>`).join('')}</div>`:''}
 <div class="glass sec"><div class="sh2"><h3>الورديات</h3><span>${s.length}</span></div>${s.map(r=>`<div class="row"><div><b>${esc(r[1])}</b><small>${dd(r[0])}</small></div><div>${fm(r[3])} س<small>${fm(r[4])} ج</small></div></div>`).join('')||'<div class="empty">مفيش ورديات</div>'}</div>
 <div class="glass sec"><div class="sh2"><h3>المدفوعات</h3><span>${p.length}</span></div>${p.map(r=>`<div class="row"><div><b>${esc(r[3]||'دفعة')}</b><small>${dd(r[0])}${r[4]?' · '+esc(r[4]):''}</small></div><div><b>${fm(r[2])} ج</b></div></div>`).join('')||'<div class="empty">مفيش مدفوعات</div>'}</div>`;
 $('#sh').scrollTop=0;$('#ovl').hidden=false;
}

/* factories */
function fc(v,C){
 const mg=C.bill-C.cost,net=mg-C.exp,mp=C.bill?mg/C.bill*100:0,fs=[...C.fs].sort((a,b)=>b.bill-a.bill),remF=C.bill-C.col,cp=pct(C.col,C.bill);
 v.innerHTML=`<section class="glass hero"><div class="ht"><div class="eyebrow">المتبقي على المصانع</div><div class="big">${fm(remF)} <small>ج</small></div>
 <div class="pills"><span class="pill due"><i></i>مستحق ${fm(C.bill)}</span><span class="pill paid"><i></i>محصّل ${fm(C.col)}</span></div></div>${ring(cp,'نسبة التحصيل')}</section>
 <div class="kpis">${kp('تكلفة العمالة',fm(C.cost)+' <small>ج</small>','ما تدفعه الشركة')}${kp('هامش الشركة',fm(mg)+' <small>ج</small>',mp.toFixed(1)+'% من الفوترة')}${kp('مصروفات أخرى',fm(C.exp)+' <small>ج</small>',C.x.length?C.x.length+' بند':'لا يوجد')}${kp('صافي بعد المصروفات',fm(net)+' <small>ج</small>','',net<0?'var(--neg)':'var(--paid)')}${kp('الورديات',C.s.length,fm(C.h)+' ساعة')}${kp('المصانع',C.fs.length,'اشتغلنا معاهم')}</div>
 <section class="glass sec"><div class="sh2"><h3>المستحق والتكلفة والتحصيل لكل مصنع</h3></div><div class="cv"><canvas id="c4" role="img" aria-label="مقارنة المصانع"></canvas></div></section>
 ${fs.map(f=>{const m=f.bill-f.cost,mpf=f.bill?m/f.bill*100:0;return`<section class="glass sec"><div class="r1" style="justify-content:space-between"><span class="fname"><i class="dot" style="background:${fVar(f.n)}"></i>${esc(f.n)}</span><span class="pill ${f.bill-f.col>0?'due':'paid'}">${fm(f.bill-f.col)} ج متبقي</span></div>
 <div class="pb"><i style="width:${pct(f.col,f.bill)}%"></i></div><div class="fg"><div>الورديات<b>${f.sh} · ${fm(f.h)} ساعة</b></div><div>المستحق<b>${fm(f.bill)} ج</b></div><div>المحصّل<b>${fm(f.col)} ج</b></div><div>الهامش<b>${fm(m)} ج · ${mpf.toFixed(0)}%</b></div></div></section>`}).join('')}
 ${C.x.length?`<section class="glass sec"><div class="sh2"><h3>مصروفات أخرى</h3><span>${fm(C.exp)} ج</span></div>${C.x.map(r=>`<div class="row"><div><b>${esc(r[1]||'مصروف')}</b><small>${esc(r[2]||'')}${r[0]?' · '+dd(r[0]):''}</small></div><div><b>${fm(r[3])} ج</b></div></div>`).join('')}</section>`:''}`;
 const K=chartKit(),{t,grid,surf,tip,lg}=K,bar=(l,d,c)=>({label:l,data:d,backgroundColor:c,borderColor:surf,borderWidth:2,borderRadius:6,borderSkipped:false,maxBarThickness:26});
 mk('c4',{type:'bar',data:{labels:fs.map(f=>f.n),datasets:[bar('مستحق على المصنع',fs.map(f=>f.bill),t('--acc')),bar('تكلفة العمالة',fs.map(f=>f.cost),t('--mut')),bar('محصّل',fs.map(f=>f.col||null),t('--paid'))]},
  options:{maintainAspectRatio:false,interaction:{mode:'index',intersect:false},scales:{x:{reverse:true,grid:{display:false},border:{display:false}},y:{position:'right',grid:{color:grid},border:{display:false},ticks:{callback:v=>fm(v)}}},
   plugins:{tooltip:{...tip,callbacks:{label:c=>' '+c.dataset.label+': '+fm(c.parsed.y)+' ج'}},legend:lg}}});
}

/* log */
function lgShell(v,C){
 const opts=S.lk==='s'?[...new Set(C.s.map(r=>r[1]))]:[...new Set(C.p.map(r=>r[3]||'أخرى'))];
 v.innerHTML=`<div class="glass tools"><div class="seg" style="box-shadow:none;border:0;background:var(--fill)"><button data-a="lk" data-k="s" class="${S.lk==='s'?'on':''}">الورديات (${C.s.length})</button><button data-a="lk" data-k="p" class="${S.lk==='p'?'on':''}">المدفوعات (${C.p.length})</button></div>
 <div style="display:flex;gap:8px;margin-top:8px"><div class="search" style="flex:1;min-width:0"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg><input id="lq" type="search" placeholder="دوّر بالاسم" value="${esc(S.lq)}" aria-label="بحث"></div>
 <select class="field" id="lsel" aria-label="تصفية" style="height:44px;width:42%;font-size:15px;border-radius:999px;padding:0 12px"><option value="">${S.lk==='s'?'كل المصانع':'كل الأنواع'}</option>${opts.map(o=>`<option${o===S.lsel?' selected':''}>${esc(o)}</option>`).join('')}</select></div></div><section class="glass sec" id="ll"></section>`;
 lgList(C);
}
function lgList(C){
 const q=S.lq.trim(),sel=S.lsel,srt=(x,y)=>(y[0]||'').localeCompare(x[0]||'');let a,t,key,tot,row;
 if(S.lk==='s'){a=C.s.filter(r=>(!q||r[2].includes(q))&&(!sel||r[1]===sel)).sort(srt);t=`${a.length} وردية · ${fm(a.reduce((s,r)=>s+r[3],0))} ساعة · ${fm(a.reduce((s,r)=>s+r[4],0))} ج`;
  tot=g=>`${g.length} · ${fm(g.reduce((s,r)=>s+r[4],0))} ج`;
  row=r=>`<div class="row"><div><b>${esc(r[2])}</b><small><i class="dot" style="background:${fVar(r[1])};margin-inline-end:6px"></i>${esc(r[1])}</small></div><div>${fm(r[3])} س<small>${fm(r[4])} ج</small></div></div>`}
 else{a=C.p.filter(r=>(!q||r[1].includes(q))&&(!sel||(r[3]||'أخرى')===sel)).sort(srt);t=`${a.length} دفعة · ${fm(a.reduce((s,r)=>s+r[2],0))} ج`;
  tot=g=>`${g.length} · ${fm(g.reduce((s,r)=>s+r[2],0))} ج`;
  row=r=>`<div class="row"><div><b>${esc(r[1])}</b><small>${esc(r[3]||'أخرى')}${r[4]?' · '+esc(r[4]):''}</small></div><div><b>${fm(r[2])} ج</b></div></div>`}
 const grp=new Map();a.forEach(r=>{const k=r[0]||'';if(!grp.has(k))grp.set(k,[]);grp.get(k).push(r)});
 let h='';grp.forEach((g,k)=>{h+=`<div class="day"><b>${wday(k)}${k?' · '+dd(k):''}</b><span>${tot(g)}</span></div>`+g.map(row).join('')});
 $('#ll').innerHTML=`<div class="sh2"><h3>${t}</h3></div>`+(h||'<div class="empty">مفيش نتائج.</div>');
}

/* file reader */
const ser=v=>typeof v==='number'?new Date(Math.round((v-25569)*864e5)).toISOString().slice(0,10):null,num=v=>typeof v==='number'?Math.round(v*100)/100:0;
function parse(wb){
 const R=n=>wb.Sheets[n]?XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:true}).slice(1):[];
 return{s:R('الورديات').filter(r=>r[0]&&r[3]&&r[1]).map(r=>[ser(r[0]),r[1],String(r[3]).trim(),num(r[4]),num(r[7]),num(r[9])]),
  p:R('المدفوعات').filter(r=>r[2]&&r[3]).map(r=>[ser(r[0]),String(r[2]).trim(),num(r[3]),r[4]||'',r[5]||'']),
  c:R('المتحصلات').filter(r=>r[1]&&r[2]).map(r=>[ser(r[0]),r[1],num(r[2]),r[3]||'']),
  x:R('مصروفات أخرى').filter(r=>r[3]).map(r=>[ser(r[0]),r[1]||'',r[2]||'',num(r[3])])};
}
$('#fi').addEventListener('change',async e=>{
 const f=e.target.files[0],g=S.up;e.target.value='';if(!f||!g)return;
 try{const wb=XLSX.read(await f.arrayBuffer(),{type:'array'}),d=parse(wb);
  if(!d.s.length)throw 0;data[g]=d;S.src[g]=1;LS.set('wd_'+g,JSON.stringify(d));
  if(S.g!==g)open_(g);else render();toast('تم تحديث البيانات من الملف')}
 catch(x){toast('الملف مش بنفس الشكل. لازم فيه شيت «الورديات» و«المدفوعات».')}
});

/* events */
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]'),nb=e.target.closest('#nv [data-t]');
 if(nb){S.tab=nb.dataset.t;scrollTo(0,0);render();return}
 if(e.target.id==='ovl'){$('#ovl').hidden=true;return}
 if(!t)return;const a=t.dataset.a,k=t.dataset.k;
 if(a==='pick'){if(needName())open_(t.dataset.g)}
 else if(a==='up'){const g=t.dataset.g||S.g;if(!S.g&&!needName())return;S.up=g;$('#fi').click()}
 else if(a==='back'){S.g=null;delete document.body.dataset.g;$('#app').hidden=true;$('#gate').hidden=false;gate();scrollTo(0,0)}
 else if(a==='pr'){setPr(k);render()}
 else if(a==='ws'){S.ws=k;render()}else if(a==='wf'){S.wf=k;render()}
 else if(a==='lk'){S.lk=k;S.lsel='';S.lq='';render()}
 else if(a==='open')sheet(t.dataset.n);else if(a==='close')$('#ovl').hidden=true;
 else if(a==='reset'){LS.del('wd_'+S.g);delete S.src[S.g];data[S.g]=BASE[S.g];render();toast('رجعت البيانات الأصلية')}
 else if(a==='copy'){const x=t.dataset.x;(navigator.clipboard?navigator.clipboard.writeText(x):Promise.reject()).catch(()=>{const z=document.createElement('textarea');z.value=x;document.body.appendChild(z);z.select();try{document.execCommand('copy')}catch(_){}z.remove()}).finally(()=>toast('اتنسخ'))}
});
document.addEventListener('input',e=>{
 const i=e.target.id;
 if(i==='wq'){S.wq=e.target.value;wkList(calc())}else if(i==='lq'){S.lq=e.target.value;lgList(calc())}
 else if(i==='nm')$('#hint').textContent='';
});
document.addEventListener('change',e=>{const i=e.target.id;if(i==='df'){S.from=e.target.value;S.pr='c';render()}else if(i==='dt'){S.to=e.target.value;S.pr='c';render()}else if(i==='lsel'){S.lsel=e.target.value;lgList(calc())}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#ovl').hidden=true});
$('#nm').value=S.name;gate();
