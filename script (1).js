'use strict';
/* ===== 데이터: 모든 문제는 '창작 문제'(공식 기출 아님). 보기 첫 항목이 정답이며 실행 시 섞는다 ===== */
const LV=[
["PLC 기본 개념","PLC는 입력→CPU 연산→출력 순으로 동작한다.","입력부가 신호를 받고 CPU가 프로그램을 스캔해 출력부로 결과를 낸다.","공장 라인의 설비 제어"],
["NO·NC 접점","NO는 평상시 열림, NC는 평상시 닫힘 접점이다.","NO는 입력 ON일 때 도통, NC는 입력 ON일 때 차단된다.","비상정지 스위치(NC)"],
["자기유지 회로","출력 접점을 시작 접점과 병렬로 연결해 스스로 ON을 유지한다.","시작→코일 ON→보조접점 닫힘→손을 떼도 유지, 정지(NC)로 해제.","컨베이어 운전/정지"],
["인터록 회로","상대 출력의 NC 접점을 직렬로 넣어 동시 ON을 막는다.","한쪽 출력이 ON이면 다른 쪽 회로가 끊긴다.","모터 정/역 전환 보호"],
["AND·OR·NOT","AND는 직렬, OR는 병렬, NOT은 NC(반전)이다.","직렬은 모두 ON이어야, 병렬은 하나만 ON이어도 출력된다.","두 손 조작 안전장치"],
["타이머 TON/TOF","TON은 입력 ON 후 설정시간 뒤 ON, TOF는 입력 OFF 후 설정시간 뒤 OFF.","TON은 입력이 설정시간 전에 끊기면 현재값이 0으로 리셋된다.","송풍기 지연 정지"],
["카운터","CTU는 입력 상승 펄스를 세어 현재값≥설정값이면 ON, 리셋 입력으로 0이 된다.","펄스 1회마다 현재값 +1, 도달하면 접점 ON.","포장 수량 계수"],
["정·역회전 시퀀스","정/역 접촉기는 인터록과 자기유지를 함께 쓴다.","한 방향이 ON이면 반대 방향 입력은 무시된다.","호이스트·셔터 모터"],
["센서 복합 시퀀스","센서·리밋스위치 접점을 직렬/병렬로 조합해 조건 제어한다.","정지용 리밋은 NC 직렬, 동시 조건은 AND.","실린더 전·후진 제어"],
["종합 응용","자기유지+타이머+카운터+비상정지를 조합한다.","비상정지(NC)는 모든 회로 앞에 직렬로 둔다.","자동 생산 라인"]];
const R=[ // [단계, 문제, 래더, "정답~오답~오답~오답", 풀이]
[0,"외부 스위치·센서 신호를 받아들이는 PLC 부분은?","","입력부~출력부~전원부~통신부","신호 흐름: 입력부→CPU→출력부"],
[0,"PLC 출력부에 연결하는 기기는?","","솔레노이드 밸브~푸시버튼~리밋스위치~근접센서","출력부는 부하(밸브, 모터, 램프)를 구동한다."],
[0,"프로그램을 반복 스캔하며 연산하는 장치는?","","CPU~입력 모듈~릴레이~퓨즈","CPU가 입력을 읽고 연산해 출력을 갱신한다."],
[1,"평상시 열려 있다가 입력 ON이면 닫히는 접점은?","X0 (Y0)","NO 접점~NC 접점~코일~타이머","NO = Normally Open."],
[1,"X0 NO와 X1 NC가 직렬이다. X0 ON, X1 ON이면 Y0은?","X0 /X1 (Y0)","OFF~ON~점멸~유지","X1(NC)이 ON이면 열리므로 경로가 끊긴다."],
[1,"X0(NO)→Y0 회로에서 X0이 OFF일 때 Y0은?","X0 (Y0)","OFF~ON~점멸~반전","NO는 입력이 없으면 열려 있다."],
[2,"자기유지에서 Y0 보조접점은 시작 버튼과 어떻게 연결하나?","[X0|Y0] /X1 (Y0)","병렬~직렬~코일과 직렬~연결하지 않음","병렬이어야 시작 입력이 사라져도 경로가 유지된다."],
[2,"자기유지 해제에 주로 쓰는 정지 버튼 접점은?","[X0|Y0] /X1 (Y0)","NC 직렬~NO 병렬~NO 직렬~NC 병렬","정지(NC)가 눌리면 회로가 끊겨 출력이 꺼진다."],
[2,"시작 버튼을 눌렀다 뗀 뒤 Y0은? (자기유지 회로)","[X0|Y0] /X1 (Y0)","ON 유지~즉시 OFF~점멸~반전","Y0 접점이 닫혀 경로가 유지된다."],
[3,"인터록 회로의 목적은?","/Y1 X0 (Y0)","두 출력의 동시 ON 방지~출력 유지~시간 지연~횟수 계수","상대 출력이 ON이면 내 회로가 끊긴다."],
[3,"정회전 회로(Y0)에 넣는 인터록 접점은?","[X0|Y0] /Y1 (Y0)","역회전 출력 Y1의 NC~Y1의 NO~Y0의 NC~X0의 NC","상대 출력의 NC를 직렬로 넣는다."],
[3,"Y0이 ON이면 Y1 입력이 무시되게 하려면 Y1 회로에?","/Y0 X1 (Y1)","Y0 NC 직렬~Y0 NO 직렬~Y0 NO 병렬~Y1 NC 병렬","Y0이 ON이면 NC가 열려 Y1 회로가 차단된다."],
[4,"AND 논리를 래더로 구현하면?","X0 X1 (Y0)","접점 직렬~접점 병렬~NC만 사용~코일 병렬","직렬은 모두 ON이어야 통전."],
[4,"OR 논리를 래더로 구현하면?","[X0|X1] (Y0)","접점 병렬~접점 직렬~타이머~카운터","병렬은 하나만 ON이어도 통전."],
[4,"NOT(반전) 논리에 해당하는 접점은?","/X0 (Y0)","NC 접점~NO 접점~병렬 접점~코일","NC는 입력 ON일 때 OFF가 된다."],
[5,"TON 5초 설정, 입력이 3초 ON 후 OFF되면 출력은?","X0 TON:5s (Y0)","OFF 유지~ON~3초 ON~점멸","설정시간 전에 입력이 끊기면 현재값이 리셋된다."],
[5,"TON 입력이 계속 ON이고 설정시간이 지나면 출력은?","X0 TON:5s (Y0)","ON~OFF~점멸~리셋","설정시간 도달 시 출력이 ON된다."],
[5,"TOF의 동작으로 옳은 것은?","X0 TOF:5s (Y0)","입력 OFF 후 설정시간 뒤 OFF~입력 ON 후 설정시간 뒤 ON~입력과 동시 점멸~카운트 증가","TOF는 OFF 지연 타이머이다."],
[6,"CTU 설정값 5, 입력 펄스 5회 후 출력은?","X0 CTU:5 (Y0)","ON~OFF~점멸~리셋","현재값이 설정값에 도달하면 ON."],
[6,"CTU 리셋 입력이 ON되면 현재값은?","X0 CTU:5 (Y0)","0으로 초기화~유지~설정값으로 증가~1 증가","리셋은 현재값을 0으로 만든다."],
[6,"설정 5, 현재 3일 때 펄스 2회 더 입력하면?","X0 CTU:5 (Y0)","출력 ON~출력 OFF~현재값 0~설정값 감소","3+2=5로 도달한다."],
[7,"모터 정/역 전환 시 반드시 필요한 회로는?","[X0|Y0] /Y1 (Y0)","인터록~타이머~카운터~병렬 OR","동시 ON은 단락 사고를 일으킨다."],
[7,"정회전(Y0) 중 역회전 버튼(X1)을 누르면?","[X0|Y0] /Y1 (Y0) /Y0 X1 (Y1)","Y1은 ON되지 않는다~Y1이 ON~둘 다 ON~Y0 OFF 후 Y1 ON","Y0 NC가 열려 있어 Y1 회로가 차단된다."],
[7,"Y1이 Y0 ON 후에만 동작하는 순차 기동은?","Y0 X1 (Y1)","Y0 NO를 Y1 회로에 직렬~Y0 NC 직렬~Y0 NO 병렬~Y1 NO 병렬","선행 출력 NO를 직렬로 넣는다."],
[8,"상한 리밋 도달 시 실린더를 멈추려면?","X0 /LS1 (Y0)","LS1 NC를 직렬~LS1 NO를 직렬~LS1 NO 병렬~LS1 NC 병렬","정지용 센서는 NC 직렬."],
[8,"센서 A, B가 모두 감지될 때만 출력하려면?","A B (Y0)","A, B 직렬~A, B 병렬~A만 사용~B NC 직렬","AND 조건."],
[8,"리밋스위치에 도달하면 모터를 자동 정지시키려면?","[X0|Y0] /LS (Y0)","LS NC 직렬~LS NO 병렬~LS NO 직렬~LS NC 병렬","리밋 NC가 열리면 자기유지가 해제된다."],
[9,"컨베이어: 시작 후 5초 뒤 Y1 ON. 정지(X1) 누르면?","[X0|Y0] /X1 (Y0) Y0 TON:5s (Y1)","Y0과 Y1 모두 OFF~Y0만 OFF~Y1만 OFF~모두 유지","Y0이 꺼지면 타이머 입력도 끊겨 Y1도 꺼진다."],
[9,"물체 10개를 세고 컨베이어를 정지하려면 카운터 접점을 어디에?","[X0|Y0] /X1 /C0 (Y0) PX CTU:10 (C0)","자기유지 회로에 NC 직렬~Y0 코일과 병렬~시작 버튼과 병렬~출력부에 직렬 NO","카운트 완료 접점을 정지 조건(NC)으로 둔다."],
[9,"비상정지 NC가 끊기면 안전하게 동작하려면 어떻게 배치?","/EMG [X0|Y0] (Y0)","회로 맨 앞 직렬 배치~Y0과 병렬~시작 버튼과 병렬~코일 뒤 배치","EMG가 열리면 모든 출력이 차단된다."]];
const TY=[["릴레이형","#39ff88"],["회로형","#2ee6d6"],["기어형","#c06bff"]];
const ST=["전기 알","작은 회로 슬라임","릴레이 꼬마","센서 몬스터","시퀀스 전사","타이머 골렘","카운터 비스트","자동화 기사","PLC 수호자","궁극의 자동화 몬스터"];
const KEY='plcpet_v1',$=s=>document.querySelector(s);
const def=()=>({name:'',type:0,xp:0,unlock:1,rec:{},streak:0,best:0,tot:0,ok:0,badges:[],cfg:{base:20,first:10,combo:15}});
let S=load(),cur=null,busy=false;
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));return d&&d.cfg&&d.rec?d:def()}catch(e){return def()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const lvl=()=>1+Math.floor(S.xp/35),stage=()=>Math.min(10,1+Math.floor(S.xp/70));
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',1800)}
/* ===== 픽셀 펫 SVG: 단계가 오를수록 크기·장식 증가 ===== */
function pet(n,t,sil){const c=sil?'#000':TY[t][1],d=sil?'#000':'#0a0d1f',z=60+n*10,g=[];
g.push(`<rect x="20" y="${60-n*2}" width="${40+n*2}" height="${30+n*2}" fill="${c}"/>`);
if(n>1)g.push(`<rect x="30" y="68" width="6" height="8" fill="${d}"/><rect x="48" y="68" width="6" height="8" fill="${d}"/>`);
if(n>2)g.push(`<rect x="38" y="${52-n}" width="4" height="10" fill="${c}"/><rect x="36" y="${48-n}" width="8" height="4" fill="#ffd23f"/>`);
if(n>3)g.push(`<rect x="8" y="70" width="12" height="6" fill="${c}"/><rect x="${60+n*2}" y="70" width="12" height="6" fill="${c}"/>`);
if(n>4)g.push(`<rect x="22" y="${50-n}" width="6" height="8" fill="#ff5c8a"/><rect x="52" y="${50-n}" width="6" height="8" fill="#ff5c8a"/>`);
if(n>5)g.push(`<rect x="34" y="82" width="12" height="12" fill="#ffd23f"/>`);
if(n>6)g.push(`<polygon points="20,56 28,44 36,56 44,44 52,56 60,44 66,56" fill="#7a3cff"/>`);
if(n>7)g.push(`<rect x="20" y="88" width="${40+n*2}" height="6" fill="#7f8bb8"/>`);
if(n>8)g.push(`<polygon points="20,${40-n} 30,${28-n} 40,${40-n} 50,${28-n} 60,${40-n}" fill="#ffd23f"/>`);
if(n>9)g.push(`<circle cx="45" cy="75" r="60" fill="none" stroke="#fff" stroke-dasharray="4 6" opacity=".5"/>`);
return `<svg viewBox="-10 0 110 110" width="${z+60}" height="${z+60}" shape-rendering="crispEdges">${g.join('')}</svg>`}
/* ===== 래더 다이어그램: 접점 토큰을 HTML로 렌더링 (표기 기준: 미쓰비시/LS 공통 개념) ===== */
function parse(s){const o=[];let i=0;while(i<s.length){if(s[i]==' '){i++;continue}let j=i;if(s[i]=='['){j=s.indexOf(']',i)+1}else{while(j<s.length&&s[j]!=' ')j++}o.push(s.slice(i,j));i=j}return o}
function el(t){if(t[0]=='[')return '<div class="par">'+t.slice(1,-1).split('|').map(b=>'<div>'+parse(b).map(el).join('')+'</div>').join('')+'</div><span class="w"></span>';
if(t[0]=='(')return `<span class="e c">${t}</span>`;if(/^(TON|TOF|CTU)/.test(t))return `<span class="e">${t}</span><span class="w"></span>`;
return `<span class="e">${t[0]=='/'?'┤/├ '+t.slice(1):'┤ ├ '+t}</span><span class="w"></span>`}
const ladder=s=>s?`<div class="lad"><b class="good">┃</b><span class="w"></span>${parse(s).map(el).join('')}<b class="good">┃</b></div><small class="dim">L┃ 전원 레일 ┃R · 창작 문제</small>`:'';
/* ===== 화면 전환 ===== */
function scr(id){document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('on',e.id==id))}
function hud(){$('#hp').textContent=`${S.name} Lv.${lvl()}`;$('#hs').textContent=`${stage()}단계 ${ST[stage()-1]}`;$('#xpb').style.width=(S.xp%35)/35*100+'%';$('#petbox').innerHTML=pet(stage(),S.type);say('문제를 풀어 성장해 보자!')}
function say(m){$('#say').textContent=`${S.name}: ${m}`}
function home(){scr('main');hud()}
function sub(h){scr('sub');$('#view').innerHTML=h}
const qs=l=>R.map((q,i)=>({q,i})).filter(o=>o.q[0]==l);
/* ===== 훈련: 단계 선택 ===== */
function train(){sub('<h2>PLC 훈련하기</h2>'+LV.map((l,i)=>{const k=qs(i),d=k.filter(o=>S.rec[o.i]&&S.rec[o.i].ok).length,lock=i+1>S.unlock;
return `<button class="lv opt" ${lock?'disabled':''} data-l="${i}">${lock?'🔒':'▶'} ${i+1}단계 ${l[0]} (${d}/${k.length}) ${S.badges.includes(i)?'🏅':''}</button>`}).join(''));
document.querySelectorAll('.lv').forEach(b=>b.onclick=()=>ask(+b.dataset.l,0))}
function ask(l,n){const k=qs(l);if(n>=k.length)return train();const o=k[n],q=o.q;
const opts=q[3].split('~').map((t,i)=>({t,c:i==0}));for(let i=opts.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[opts[i],opts[j]]=[opts[j],opts[i]]}
cur={l,n,id:o.i,opts,pick:-1,done:false};busy=false;
sub(`<div class="card"><span class="pill">${l+1}단계</span> 문제 ${n+1}/${k.length} · <span class="dim">창작 문제</span><h3>${q[1]}</h3>${ladder(q[2])}
<div>${opts.map((p,i)=>`<button class="opt" data-i="${i}">${i+1}. ${p.t}</button>`).join('')}</div>
<button id="sb" class="btn" disabled>정답 제출</button><div id="fb"></div></div>`);
document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(cur.done)return;cur.pick=+b.dataset.i;document.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');$('#sb').disabled=false});
$('#sb').onclick=submit}
function explain(id){const q=R[id],l=LV[q[0]];return `<p><b>정답:</b> ${q[3].split('~')[0]}</p><p><b>핵심 개념:</b> ${l[1]}</p><p><b>동작 원리:</b> ${l[2]}</p><p><b>단계별 풀이:</b> ${q[4]}</p><p><b>실무 예시:</b> ${l[3]}</p>`}
function submit(){if(busy||cur.done||cur.pick<0)return;busy=true;cur.done=true;const c=cur.opts[cur.pick].c,r=S.rec[cur.id]||(S.rec[cur.id]={w:0,ok:false,t:0}),first=r.t==0;r.t++;S.tot++;
document.querySelectorAll('.opt').forEach((b,i)=>{if(cur.opts[i].c)b.classList.add('ok');else if(i==cur.pick)b.classList.add('no')});let h='';
if(c){S.ok++;S.streak++;S.best=Math.max(S.best,S.streak);let g=0;if(!r.ok){g=S.cfg.base+(first?S.cfg.first:0);if(S.streak%3==0)g+=S.cfg.combo;r.ok=true}
const a=stage();S.xp+=g;h=`<p class="good">✔ 정답! +${g}XP · 연속 ${S.streak}콤보</p>`;say('와! 기분 최고야!');if(S.streak%5==0)toast('✨ 5연속 정답 이펙트!');
const done=qs(cur.l).every(o=>S.rec[o.i]&&S.rec[o.i].ok);if(done&&!S.badges.includes(cur.l)){S.badges.push(cur.l);toast(`🏅 ${cur.l+1}단계 배지 획득!`)}
const ok=qs(cur.l).filter(o=>S.rec[o.i]&&S.rec[o.i].ok).length;if(ok>=2&&cur.l+2>S.unlock&&cur.l<9){S.unlock=cur.l+2;toast(`🔓 ${cur.l+2}단계 해금!`)}
if(R.every((_,i)=>S.rec[i]&&S.rec[i].ok)&&!S.badges.includes('all')){S.badges.push('all');toast('🏆 연구소 업적: 모든 문제 완료!')}
if(stage()>a)evolve();h+=`<button class="btn" id="nx">다음 문제</button>`}
else{S.streak=0;r.w++;r.ok=false;say('괜찮아, 해설을 보고 다시 도전!');h=`<p class="bad">✘ 오답 (XP 없음)</p>${explain(cur.id)}<button class="btn" id="rt">다시 풀기</button>`}
save();$('#fb').innerHTML=h;$('#sb').disabled=true;
if($('#nx'))$('#nx').onclick=()=>ask(cur.l,cur.n+1);if($('#rt'))$('#rt').onclick=()=>ask(cur.l,cur.n)}
function evolve(){const n=stage();setTimeout(()=>{home();$('#petbox').classList.add('ev');say(`진화! ${ST[n-1]}`);toast(`🎉 ${n}단계 ${ST[n-1]} 진화!`+(n==10?' 칭호: 전설의 자동화 연구원':''))},1200)}
/* ===== 도감·오답노트·통계·설정 ===== */
function dex(){sub('<h2>진화 도감</h2><div class="row">'+ST.map((s,i)=>{const u=stage()>=i+1;return `<div class="card" style="width:46%;text-align:center">${pet(i+1,S.type,!u)}<br>${u?`${i+1}. ${s}`:'???'}<br><small class="dim">조건: 누적 ${i*70}XP</small></div>`}).join('')+'</div>')}
function wrong(){const w=Object.keys(S.rec).filter(i=>S.rec[i].w>0);sub('<h2>오답 노트</h2>'+(w.length?w.map(i=>`<div class="card"><b>${R[i][1]}</b><br>오답 ${S.rec[i].w}회 ${S.rec[i].ok?'<span class="good">✔복습 완료</span>':''}<details><summary>정답·해설</summary>${explain(i)}</details><button class="btn rv" data-i="${i}">다시 풀기</button></div>`).join(''):'<p>아직 틀린 문제가 없어요.</p>'));
document.querySelectorAll('.rv').forEach(b=>b.onclick=()=>{const q=R[b.dataset.i];ask(q[0],qs(q[0]).findIndex(o=>o.i==b.dataset.i))})}
function stat(){const a=LV.map((_,l)=>{const k=qs(l).map(o=>S.rec[o.i]).filter(Boolean),t=k.reduce((s,r)=>s+r.t,0),w=k.reduce((s,r)=>s+r.w,0);return{l,t,p:t?Math.round((t-w)/t*100):null}}),wk=a.filter(x=>x.p!==null).sort((x,y)=>x.p-y.p)[0];
sub(`<h2>학습 통계</h2><div class="card">전체 풀이 ${S.tot}회 · 정답률 ${S.tot?Math.round(S.ok/S.tot*100):0}%<br>연속 정답 ${S.streak} (최고 ${S.best})<br>가장 약한 단계: ${wk?`${wk.l+1}단계 ${LV[wk.l][0]}`:'데이터 없음'}</div>`+a.map(x=>`<div>${x.l+1}단계 ${x.p===null?'-':x.p+'%'}</div>`).join(''))}
function set(){const c=S.cfg;sub(`<h2>설정</h2><div class="card">기본 XP <input id="c1" type="number" value="${c.base}"> 첫 시도 보너스 <input id="c2" type="number" value="${c.first}"> 3연속 보너스 <input id="c3" type="number" value="${c.combo}"><button class="btn" id="cs">저장</button></div><button class="btn" id="rs">진행 데이터 초기화</button>`);
$('#cs').onclick=()=>{S.cfg={base:Math.max(0,+$('#c1').value|0),first:Math.max(0,+$('#c2').value|0),combo:Math.max(0,+$('#c3').value|0)};save();toast('저장됨')};
$('#rs').onclick=()=>{if(confirm('모든 진행 데이터를 삭제할까요?')){localStorage.removeItem(KEY);S=def();start()}}}
/* ===== 시작 화면 ===== */
function start(){scr('start');let t=S.type;$('#startPets').innerHTML=TY.map((p,i)=>`<div class="pc ${i==t?'sel':''}" data-t="${i}">${pet(3,i)}<br>${p[0]}</div>`).join('');
document.querySelectorAll('.pc').forEach(e=>e.onclick=()=>{t=+e.dataset.t;S.type=t;document.querySelectorAll('.pc').forEach(x=>x.classList.toggle('sel',x==e))});
$('#nm').value=S.name;$('#go').onclick=()=>{const n=$('#nm').value.trim();if(!n)return toast('펫 이름을 입력하세요');S.name=n;S.type=t;save();home()}}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>({train,dex,wrong,stat,set})[b.dataset.s]());
$('#back').onclick=home;
S.name?home():start();
