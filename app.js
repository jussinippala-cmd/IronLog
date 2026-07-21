// ═══════════════════════════════════════════════════════════════════
// STORAGE (must be first — everything else depends on ls)
// ═══════════════════════════════════════════════════════════════════
const SK={weights:"il_weights",history:"il_history",nextDay:"il_nextDay",blockStart:"il_blockStart",blockIdx:"il_blockIdx",customWorkouts:"il_customworkouts",wupGoal:"il_wup_goal",wupWeek:"il_wup_week",wupAnchor:"il_wup_anchor",failStreaks:"il_failstreaks",activeSession:"il_activesession",bodyweight:"il_bodyweight"};
const ls={
  get(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
};

// ═══════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════
function getProfile(){return ls.get("il_profile")||null;}
function getMode(){const p=getProfile();return p&&p.mode==='log'?'log':'program';}
function saveProfile(p){ls.set("il_profile",p);}
function getSettings(){return ls.get("il_settings")||{restSeconds:90};}
function saveSetting(key,val){const s=getSettings();s[key]=val;ls.set("il_settings",s);}
function getRestDuration(){const s=getSettings();return s.restSeconds!==undefined?s.restSeconds:90;}
function getProgressionPct(){const s=getSettings();return s.progressionPct!==undefined?s.progressionPct:2.5;}
function getFailStreak(libId){const fs=ls.get(SK.failStreaks)||{};return fs[libId]||0;}
function updateFailStreak(libId,succeeded){
  if(!libId)return;
  const fs=ls.get(SK.failStreaks)||{};
  if(succeeded){fs[libId]=0;}else{fs[libId]=(fs[libId]||0)+1;}
  ls.set(SK.failStreaks,fs);
}


let BLOCKS=[];
function reloadBlocks(){
  const p=getProfile();
  if(p)BLOCKS=generateBlocks(p);
}
reloadBlocks();

// ═══════════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════
// Sessions needed per block = frequency × 2 (roughly 2 weeks of training)
function sessionsPerBlock(){
  const p=getProfile();
  return p?(p.freq*2):6;
}
function initAndGetBlockIdx(){
  if(!BLOCKS.length)return 0;
  const saved=ls.get(SK.blockIdx);
  if(saved!==null&&saved>=0&&saved<BLOCKS.length)return saved;
  ls.set(SK.blockIdx,0);
  return 0;
}
function getBlockSessionCount(){
  const idx=initAndGetBlockIdx();
  if(!BLOCKS.length)return 0;
  const blockId=BLOCKS[idx].id;
  // Count sessions done in current block (by matching blockId)
  return A.history.filter(h=>h.blockId===blockId).length;
}
function getSessionsUntilSwap(){
  return Math.max(0,sessionsPerBlock()-getBlockSessionCount());
}
function advanceBlockIfNeeded(){
  if(!BLOCKS.length)return 0;
  if(getBlockSessionCount()>=sessionsPerBlock()){
    const next=(initAndGetBlockIdx()+1)%BLOCKS.length;
    ls.set(SK.blockIdx,next);
    return next;
  }
  return initAndGetBlockIdx();
}
function getNextDayId(){return ls.get(SK.nextDay)||"A";}
function getHistory(){return ls.get(SK.history)||[];}
function getCustomWorkouts(){return ls.get(SK.customWorkouts)||[];}
function saveCustomWorkout(name,exerciseIds){
  const list=getCustomWorkouts();
  const now=Date.now();
  list.push({id:"custom_"+now,name:name,exerciseIds:exerciseIds,createdAt:now});
  ls.set(SK.customWorkouts,list);
}
function deleteCustomWorkout(id){
  ls.set(SK.customWorkouts,getCustomWorkouts().filter(w=>w.id!==id));
}
function confirmDeleteCustomWorkout(id){
  const cw=getCustomWorkouts().find(w=>w.id===id);
  if(!cw)return;
  if(confirm(t('free_delete_confirm')+' '+cw.name+'?')){deleteCustomWorkout(id);render();}
}
function getLastWeight(id){const w=(ls.get(SK.weights)||{})[id];return w!==undefined?w:null;}
function saveWeight(id,w,libId){const ws=ls.get(SK.weights)||{};ws[id]=w;if(libId)ws[libId]=w;ls.set(SK.weights,ws);}
function advanceDay(cur){
  const p=getProfile();
  const dayIds=BLOCKS.length>0?BLOCKS[0].days.map(d=>d.id):["A","B","C"];
  const idx=dayIds.indexOf(cur);
  ls.set(SK.nextDay,dayIds[(idx+1)%dayIds.length]);
}
function getExerciseHistory(id,libId){
  return getHistory().map(s=>s.exercises&&s.exercises.find(e=>e.id===id||(libId&&e.libId===libId))).filter(Boolean).slice(-5);
}
function shouldIncrease(id,topRep,libId){
  const h=getExerciseHistory(id,libId);
  return h.length>0&&h[h.length-1].sets.every(s=>parseInt(s.reps)>=topRep);
}
function getExercisesWithHistory(){
  const seen=new Map();
  A.history.forEach(s=>{
    (s.exercises||[]).forEach(ex=>{
      const key=exerciseKey(ex);
      if(!key||seen.has(key))return;
      if((ex.sets||[]).some(st=>parseFloat(st.weight)>0))seen.set(key,true);
    });
  });
  return[...seen.keys()];
}
function getProgressData(key){
  const points=[];
  A.history.forEach(s=>{
    const ex=(s.exercises||[]).find(e=>exerciseKey(e)===key);
    if(!ex)return;
    const wts=(ex.sets||[]).map(st=>parseFloat(st.weight)||0).filter(w=>w>0);
    if(!wts.length)return;
    points.push({date:s.date,max:Math.max(...wts)});
  });
  return points;
}
function getWeeklySetsByMuscle(){
  const now=new Date();
  const day=(now.getDay()+6)%7; // ma=0
  const weekStart=new Date(now);
  weekStart.setDate(now.getDate()-day);
  weekStart.setHours(0,0,0,0);
  const weekEnd=new Date(weekStart);
  weekEnd.setDate(weekStart.getDate()+7);
  const result={};
  (A.history||[]).forEach(session=>{
    const d=new Date(session.date);
    if(d>=weekStart&&d<weekEnd){
      (session.exercises||[]).forEach(ex=>{
        const m=ex.muscle||'Other';
        result[m]=(result[m]||0)+(ex.sets||[]).length;
      });
    }
  });
  return result;
}
function getPRs(){
  const counts={};
  const bests={};
  (A.history||[]).forEach(session=>{
    (session.exercises||[]).forEach(ex=>{
      const key=exerciseKey(ex);
      if(!key)return;
      counts[key]=(counts[key]||0)+1;
      (ex.sets||[]).forEach(st=>{
        const w=parseFloat(st.weight)||0;
        const r=parseInt(st.reps)||0;
        if(w>0&&r>0){
          if(!bests[key]||w>bests[key].weight){
            bests[key]={weight:w,reps:r,muscle:ex.muscle,date:session.date,libId:ex.libId,name:ex.name};
          }
        }
      });
    });
  });
  return Object.entries(bests)
    .filter(([key])=>(counts[key]||0)>=2)
    .map(([key,b])=>({
      key,libId:b.libId,name:b.name,weight:b.weight,reps:b.reps,
      est1rm:est1RM(b.weight,b.reps),
      muscle:b.muscle,date:b.date
    }));
}
// Weights beaten in this session vs all previous history (only counts
// exercises that already have logged data — first-ever entry isn't a "PR")
function detectNewPRs(session){
  const prevBest={};
  A.history.forEach(s=>(s.exercises||[]).forEach(ex=>{
    const key=exerciseKey(ex);
    if(!key)return;
    (ex.sets||[]).forEach(st=>{
      const w=parseFloat(st.weight)||0;
      if(w>(prevBest[key]||0))prevBest[key]=w;
    });
  }));
  const prs=[];
  (session.exercises||[]).forEach(ex=>{
    const key=exerciseKey(ex);
    if(!key||!(key in prevBest))return;
    const w=Math.max(...(ex.sets||[]).filter(s=>s.done).map(s=>parseFloat(s.weight)||0),0);
    if(w>prevBest[key])prs.push({key,libId:ex.libId,name:ex.name,weight:w,prev:prevBest[key]});
  });
  return prs;
}

function renderProgressChart(libId){return renderLineChart(getProgressData(libId));}
function renderLineChart(data){
  if(!data.length)return`<div style="text-align:center;color:#9090b0;font-size:13px;padding:20px 0">${t('chart_no_data')}</div>`;
  const W=390,H=200,ml=45,mr=15,mt=15,mb=30;
  const pw=W-ml-mr,ph=H-mt-mb;
  if(data.length===1){
    const cx=ml+pw/2,cy=mt+ph/2;
    return`<svg viewBox="0 0 ${W} ${H}" width="100%" height="200" style="display:block">
      <circle cx="${cx}" cy="${cy}" r="5" fill="#d4a846"/>
      <text x="${cx}" y="${cy-14}" text-anchor="middle" fill="#f2f0ea" font-size="14" font-weight="700">${data[0].max}kg</text>
      <text x="${cx}" y="${cy+20}" text-anchor="middle" fill="#9090b0" font-size="10">${fmtDate(data[0].date)}</text>
    </svg>`;
  }
  const maxes=data.map(d=>d.max);
  let yMin=Math.min(...maxes),yMax=Math.max(...maxes);
  if(yMax-yMin<5){const mid=(yMin+yMax)/2;yMin=mid-2.5;yMax=mid+2.5;}
  yMin=Math.floor(yMin/5)*5;yMax=Math.ceil(yMax/5)*5;
  if(yMax<=yMin)yMax=yMin+5;
  const yRange=yMax-yMin;
  function x(i){return ml+(i/(data.length-1))*pw;}
  function y(v){return mt+ph-(((v-yMin)/yRange)*ph);}
  const pts=data.map((d,i)=>`${x(i).toFixed(1)},${y(d.max).toFixed(1)}`);
  const line=pts.join(' ');
  const area=`${pts.join(' ')} ${x(data.length-1).toFixed(1)},${(mt+ph).toFixed(1)} ${ml.toFixed(1)},${(mt+ph).toFixed(1)}`;
  // Y-axis: 4-5 ticks
  const tickCount=4;
  let gridLines='',yLabels='';
  for(let i=0;i<=tickCount;i++){
    const val=yMin+(yRange*i/tickCount);
    const yy=y(val);
    gridLines+=`<line x1="${ml}" y1="${yy.toFixed(1)}" x2="${W-mr}" y2="${yy.toFixed(1)}" stroke="#1c1c2e" stroke-dasharray="4,4"/>`;
    yLabels+=`<text x="${ml-6}" y="${(yy+3).toFixed(1)}" text-anchor="end" fill="#9090b0" font-size="10">${Math.round(val)}</text>`;
  }
  // X-axis: max 6 labels
  let xLabels='';
  const maxLabels=Math.min(6,data.length);
  const step=Math.max(1,Math.floor((data.length-1)/(maxLabels-1)));
  for(let i=0;i<data.length;i+=step){
    xLabels+=`<text x="${x(i).toFixed(1)}" y="${H-4}" text-anchor="middle" fill="#9090b0" font-size="9">${fmtDate(data[i].date)}</text>`;
  }
  if((data.length-1)%step!==0){
    xLabels+=`<text x="${x(data.length-1).toFixed(1)}" y="${H-4}" text-anchor="middle" fill="#9090b0" font-size="9">${fmtDate(data[data.length-1].date)}</text>`;
  }
  const dots=data.map((d,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(d.max).toFixed(1)}" r="3.5" fill="#d4a846" stroke="#10101a" stroke-width="2"/>`).join('');
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" height="200" style="display:block">
    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4a846" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#d4a846" stop-opacity="0"/>
    </linearGradient></defs>
    ${gridLines}
    <polygon points="${area}" fill="url(#cg)"/>
    <polyline points="${line}" fill="none" stroke="#d4a846" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
    ${yLabels}
    ${xLabels}
  </svg>`;
}
function isThisISOWeek(dateStr){
  const d=new Date(dateStr),now=new Date();
  const day=now.getDay();
  const mon=new Date(now);
  mon.setDate(now.getDate()+(day===0?-6:1-day));
  mon.setHours(0,0,0,0);
  return d>=mon;
}
function getISOWeekKey(date=new Date()){
  const d=new Date(date);
  const day=d.getDay();
  d.setDate(d.getDate()+(day===0?-6:1-day));
  d.setHours(0,0,0,0);
  return`${d.getFullYear()}-W${String(isoWeekNumber(d)).padStart(2,'0')}`;
}
function getWupState(){
  return{
    goal:localStorage.getItem(SK.wupGoal)||"hypertrophy",
    week:parseInt(localStorage.getItem(SK.wupWeek))||1,
    anchor:localStorage.getItem(SK.wupAnchor)||getISOWeekKey()
  };
}
function isDeloadWeek(){return getWupState().week===4;}
function setWupGoal(goal){
  localStorage.setItem(SK.wupGoal,goal);
  localStorage.setItem(SK.wupWeek,"1");
  localStorage.setItem(SK.wupAnchor,getISOWeekKey());
}
function applyWupToExercises(exercises){
  const{goal,week}=getWupState();
  return exercises.map(ex=>({...ex,wupTargetReps:getWeekReps(ex.repRange,week,goal)}));
}
function maybeAdvanceWupWeek(){
  const{week,anchor}=getWupState();
  const current=getISOWeekKey();
  if(current!==anchor){
    const next=(week%4)+1;
    localStorage.setItem(SK.wupWeek,String(next));
    localStorage.setItem(SK.wupAnchor,current);
  }
}
function fmtTime(s){return`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function fmtDate(iso){return new Date(iso).toLocaleDateString(getLang()==='fi'?'fi-FI':'en-GB',{day:'numeric',month:'short'});}
function today(){return new Date().toLocaleDateString(getLang()==='fi'?'fi-FI':'en-GB',{weekday:'short',day:'numeric',month:'short'});}

// ═══════════════════════════════════════════════════════════════════
// APP STATE  (single mutable object — we call render() after changes)
// ═══════════════════════════════════════════════════════════════════
const A={
  view:"home",
  blockIdx:initAndGetBlockIdx(),
  activeDayId:getNextDayId(),
  previewBlockIdx:initAndGetBlockIdx(),
  history:getHistory(),
  // Workout session
  sessionExercises:[],
  sessionSets:{},      // {exId:[{reps,weight,done,editing}]}
  sessionStart:null,
  elapsed:0,
  restTimer:null,
  completedSession:null,
  freeExerciseIds:[],
  freeFilter:"All",
  isFreeWorkout:false,
  isLogWorkout:false,
  swapTarget:null,
  prOpen:false,
  weeklyOpen:false,
  chartOpen:false,
  sessionsOpen:false,
  currentNotes:"",
  chartExercise:null,
  bwOpen:false,
  newPRs:[],
  _askedNotif:false,
  _openSessions:new Set(),
  _openHistEx:new Set(),
  // Internal timers
  _elapsedInterval:null,
  _restInterval:null,
  _restEndTime:null,
};

// ═══════════════════════════════════════════════════════════════════
// TIMER MANAGEMENT (timestamp-based — survives phone sleep)
// ═══════════════════════════════════════════════════════════════════
function elapsedLabel(){
  if(A.isFreeWorkout)return`${t('free_workout_label')} · ${fmtTime(A.elapsed)}`;
  if(A.isLogWorkout)return`${t('log_workout_label')} · ${fmtTime(A.elapsed)}`;
  const blk=BLOCKS[A.blockIdx];
  return blk?`${t('block_label')} ${blk.id} · ${t('home_day')} ${A.activeDayId} · ${fmtTime(A.elapsed)}`:'';
}
function startElapsed(){
  clearInterval(A._elapsedInterval);
  A._elapsedInterval=setInterval(()=>{
    A.elapsed=Math.floor((Date.now()-A.sessionStart)/1000);
    const el=document.getElementById('elapsed-txt');
    if(el)el.textContent=elapsedLabel();
  },1000);
}
function stopElapsed(){clearInterval(A._elapsedInterval);A.elapsed=0;}

// ── Rest-over alert: vibration + beep + notification when backgrounded ──
let _audioCtx=null;
function ensureAudio(){
  try{
    _audioCtx=_audioCtx||new(window.AudioContext||window.webkitAudioContext)();
    if(_audioCtx.state==='suspended')_audioCtx.resume();
  }catch{}
}
function beep(){
  if(!_audioCtx)return;
  try{
    const now=_audioCtx.currentTime;
    [0,0.22].forEach(off=>{
      const o=_audioCtx.createOscillator(),g=_audioCtx.createGain();
      o.type='sine';o.frequency.value=880;
      g.gain.setValueAtTime(0.0001,now+off);
      g.gain.exponentialRampToValueAtTime(0.28,now+off+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,now+off+0.18);
      o.connect(g);g.connect(_audioCtx.destination);
      o.start(now+off);o.stop(now+off+0.2);
    });
  }catch{}
}
function restFinishedAlert(){
  if(navigator.vibrate)navigator.vibrate([200,100,200]);
  ensureAudio();
  beep();
  if(document.hidden&&'Notification'in window&&Notification.permission==='granted'){
    const opts={body:t('rest_done'),tag:'rest-timer'};
    // Android Chrome throws on the page-context Notification constructor;
    // notifications must go through the service worker registration there.
    if(navigator.serviceWorker){
      navigator.serviceWorker.ready
        .then(reg=>reg.showNotification('Rautaloki',opts))
        .catch(()=>{try{new Notification('Rautaloki',opts);}catch{}});
    }else{
      try{new Notification('Rautaloki',opts);}catch{}
    }
  }
}

// ── Screen wake lock while a workout is running ──
let _wakeLock=null;
async function requestWakeLock(){
  try{if('wakeLock'in navigator)_wakeLock=await navigator.wakeLock.request('screen');}catch{}
}
function releaseWakeLock(){
  try{if(_wakeLock){_wakeLock.release();_wakeLock=null;}}catch{}
}

function startRest(secs){
  if(!secs)return;
  ensureAudio();
  if('Notification'in window&&Notification.permission==='default'&&!A._askedNotif){
    A._askedNotif=true;
    try{Notification.requestPermission();}catch{}
  }
  clearInterval(A._restInterval);
  A._restEndTime=Date.now()+secs*1000;
  A.restTimer=secs;
  refreshRestBar();
  A._restInterval=setInterval(tickRest,250);
}
function tickRest(){
  const remaining=Math.ceil((A._restEndTime-Date.now())/1000);
  if(remaining>0){
    A.restTimer=remaining;
    refreshRestBar();
  }else{
    const overdue=A._restEndTime?Date.now()-A._restEndTime:0;
    clearInterval(A._restInterval);
    A.restTimer=null;
    A._restEndTime=null;
    refreshRestBar();
    if(shouldRestAlert(overdue))restFinishedAlert();
  }
}
function skipRest(){clearInterval(A._restInterval);A.restTimer=null;A._restEndTime=null;refreshRestBar();}
function refreshRestBar(){
  const bar=document.getElementById('rest-bar');
  if(!bar)return;
  if(A.restTimer!==null&&A.restTimer>0){
    bar.classList.add('visible');
    const el=bar.querySelector('#rest-time');
    if(el)el.textContent=`${t('workout_rest')} · ${fmtTime(A.restTimer)}`;
  }else{
    bar.classList.remove('visible');
  }
}
// Sync timers when page becomes visible again (after phone sleep)
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'){
    if(A.sessionStart&&A.view==='workout')requestWakeLock();
    if(A._restEndTime)tickRest();
    if(A.sessionStart){
      A.elapsed=Math.floor((Date.now()-A.sessionStart)/1000);
      const el=document.getElementById('elapsed-txt');
      if(el)el.textContent=elapsedLabel();
    }
  }
});

// ═══════════════════════════════════════════════════════════════════
// SESSION LOGIC
// ═══════════════════════════════════════════════════════════════════
function startWeightFor(ex){
  const lw=getLastWeight(ex.libId)??getLastWeight(ex.id);
  return computeStartWeight(lw,{
    deload:isDeloadWeek(),
    failStreak:getFailStreak(ex.libId||ex.id),
    bump:shouldIncrease(ex.id,ex.repRange[1],ex.libId),
    pct:getProgressionPct()
  });
}
function buildInitialSets(exercises){
  const init={};
  exercises.forEach(ex=>{
    const w=startWeightFor(ex);
    init[ex.id]=Array.from({length:ex.sets},()=>({reps:"",weight:w,done:false,editing:false}));
  });
  return init;
}

// ── Active-session persistence: survive the app/tab being killed mid-workout ──
function persistSession(){
  if(!A.sessionStart)return;
  ls.set(SK.activeSession,{
    exercises:A.sessionExercises,sets:A.sessionSets,start:A.sessionStart,
    dayId:A.activeDayId,blockIdx:A.blockIdx,isFree:A.isFreeWorkout,isLog:A.isLogWorkout
  });
}
function clearActiveSession(){try{localStorage.removeItem(SK.activeSession);}catch{}}
function restoreSession(){
  const s=ls.get(SK.activeSession);
  if(!s||!s.start||!Array.isArray(s.exercises)||!s.exercises.length)return false;
  if(Date.now()-s.start>12*3600*1000){clearActiveSession();return false;}
  A.sessionExercises=s.exercises;
  A.sessionSets=s.sets||{};
  A.sessionStart=s.start;
  A.activeDayId=s.dayId||A.activeDayId;
  A.isFreeWorkout=!!s.isFree;
  A.isLogWorkout=!!s.isLog;
  A.elapsed=Math.floor((Date.now()-s.start)/1000);
  startElapsed();
  requestWakeLock();
  A.view="workout";
  return true;
}

function startWorkout(dayId,block){
  block=block||BLOCKS[A.blockIdx];
  const day=block.days.find(d=>d.id===dayId);
  A.activeDayId=dayId;
  A.sessionExercises=applyWupToExercises(day.exercises.map(e=>({...e})));
  A.sessionSets=buildInitialSets(A.sessionExercises);
  A.sessionStart=Date.now();
  A.elapsed=0;
  A.restTimer=null;
  clearInterval(A._restInterval);A._restEndTime=null;
  startElapsed();
  requestWakeLock();
  persistSession();
  navigate("workout");
}

function openFreeBuilder(){
  A.freeExerciseIds=[];
  A.freeFilter="All";
  navigate("freeBuilder");
}
function toggleFreeExercise(libId){
  if(A.freeExerciseIds.includes(libId)){
    A.freeExerciseIds=A.freeExerciseIds.filter(id=>id!==libId);
  }else{
    A.freeExerciseIds=[...A.freeExerciseIds,libId];
  }
  render();
}
function setFreeFilter(muscle){
  A.freeFilter=muscle;
  render();
}
function startFreeWorkout(exerciseIds){
  if(!exerciseIds||!exerciseIds.length)return;
  A.sessionExercises=applyWupToExercises(exerciseIds.map(libId=>Ex(0,libId)).filter(Boolean));
  A.sessionSets=buildInitialSets(A.sessionExercises);
  A.sessionStart=Date.now();
  A.elapsed=0;
  A.restTimer=null;
  A.isFreeWorkout=true;
  A.freeExerciseIds=[];
  clearInterval(A._restInterval);A._restEndTime=null;
  startElapsed();
  requestWakeLock();
  persistSession();
  navigate("workout");
}
// ── Log-only mode: no program, freely typed exercises ──
function startLogWorkout(){
  A.sessionExercises=[];
  A.sessionSets={};
  A.sessionStart=Date.now();
  A.elapsed=0;
  A.restTimer=null;
  A.isFreeWorkout=false;
  A.isLogWorkout=true;
  clearInterval(A._restInterval);A._restEndTime=null;
  startElapsed();
  requestWakeLock();
  persistSession();
  navigate("workout");
}
// Own past exercise names (log-mode entries only — no libId), for autocomplete.
function getLoggedExerciseNames(){
  const seen=new Set();
  A.history.forEach(s=>(s.exercises||[]).forEach(ex=>{if(!ex.libId&&ex.name)seen.add(ex.name);}));
  return[...seen];
}
// Most recent weight logged under this exact name — own data, not a suggestion.
function logPrefillWeight(name){
  const nl=name.toLowerCase();
  for(let i=A.history.length-1;i>=0;i--){
    const ex=(A.history[i].exercises||[]).find(e=>!e.libId&&(e.name||'').toLowerCase()===nl);
    if(ex){
      const wts=(ex.sets||[]).map(s=>parseFloat(s.weight)||0).filter(w=>w>0);
      if(wts.length)return String(Math.max(...wts));
    }
  }
  return'';
}
function addLogExercise(){
  const inp=document.getElementById('log-ex-inp');
  if(!inp)return;
  const name=inp.value.trim();
  if(!name)return;
  const id='log'+Date.now()+Math.random().toString(36).slice(2,6);
  const w=logPrefillWeight(name);
  const ex={id,name,muscle:'Other',repRange:[1,15],sets:3};
  A.sessionExercises=[...A.sessionExercises,ex];
  A.sessionSets[ex.id]=Array.from({length:3},()=>({reps:"",weight:w,done:false,editing:false}));
  persistSession();
  render();
}
function addLogSet(exId){
  const sets=A.sessionSets[exId];
  if(!sets)return;
  const lastW=sets.length?sets[sets.length-1].weight:"";
  sets.push({reps:"",weight:lastW,done:false,editing:false});
  const ex=A.sessionExercises.find(e=>e.id===exId);
  if(ex)ex.sets=sets.length;
  persistSession();
  render();
}
function removeLogSet(exId){
  const sets=A.sessionSets[exId];
  if(!sets||sets.length<=1)return;
  sets.pop();
  const ex=A.sessionExercises.find(e=>e.id===exId);
  if(ex)ex.sets=sets.length;
  persistSession();
  render();
}
function removeLogExercise(exId){
  A.sessionExercises=A.sessionExercises.filter(e=>e.id!==exId);
  delete A.sessionSets[exId];
  persistSession();
  render();
}

function swapExercise(oldId,newEx){
  closeSwap();
  const wupNew=applyWupToExercises([newEx])[0];
  A.sessionExercises=A.sessionExercises.map(e=>e.id===oldId?{...wupNew}:e);
  delete A.sessionSets[oldId];
  const w=startWeightFor(wupNew);
  A.sessionSets[wupNew.id]=Array.from({length:wupNew.sets},()=>({reps:"",weight:w,done:false,editing:false}));
  A.swapTarget=null;
  persistSession();
  render();
}

function cycleReps(exId,idx,repRange,wupTarget=null){
  const sets=A.sessionSets[exId];
  if(!sets)return;
  const current=sets[idx].reps?parseInt(sets[idx].reps):NaN;
  const[lo]=repRange;
  const hi=wupTarget!==null?wupTarget:repRange[1];
  const next=nextCycleReps(current,lo,hi);
  sets[idx]={...sets[idx],reps:String(next)};
  // Only re-render the specific rep button to avoid full page flicker
  const btn=document.getElementById(`rep-btn-${exId}-${idx}`);
  if(btn){
    btn.textContent=String(next);
    btn.classList.add('has-val');
    btn.classList.remove('editing');
    btn.classList.toggle('below-min',next<lo);
    // Update check button opacity
    const chk=document.getElementById(`chk-btn-${exId}-${idx}`);
    if(chk){chk.disabled=false;chk.classList.remove('dim');}
  }
  persistSession();
}

function markSetDone(exId,idx){
  const sets=A.sessionSets[exId];
  if(!sets||!sets[idx].reps)return;
  const w=parseFloat(sets[idx].weight);
  const ex=A.sessionExercises.find(e=>e.id===exId);
  sets[idx]={...sets[idx],done:true,editing:false};
  if(!isNaN(w)&&w>0)saveWeight(exId,w,ex&&ex.libId);
  if(navigator.vibrate)navigator.vibrate(30);
  persistSession();
  startRest(getRestDuration());
  renderSetRow(exId,idx);
  updateProgress();
  updateFinishBtn();
}

function enterEditMode(exId,idx){
  A.sessionSets[exId][idx]={...A.sessionSets[exId][idx],editing:true};
  skipRest();
  renderSetRow(exId,idx);
}

function saveEdit(exId,idx){
  const set=A.sessionSets[exId][idx];
  if(!set.reps)return;
  const w=parseFloat(set.weight);
  const ex=A.sessionExercises.find(e=>e.id===exId);
  if(!isNaN(w)&&w>0)saveWeight(exId,w,ex&&ex.libId);
  A.sessionSets[exId][idx]={...set,done:true,editing:false};
  persistSession();
  renderSetRow(exId,idx);
  updateProgress();
  updateFinishBtn();
}

function updateKg(exId,idx,val){
  const sets=A.sessionSets[exId];
  if(!sets)return;
  sets[idx]={...sets[idx],weight:val};
  // Auto-fill forward to all subsequent undone sets
  for(let i=idx+1;i<sets.length;i++){
    if(!sets[i].done){
      sets[i]={...sets[i],weight:val};
      const el=document.getElementById(`kg-inp-${exId}-${i}`);
      if(el)el.value=val;
    }
  }
  persistSession();
}

function finishWorkout(){
  if(!allDone())return;
  const isFree=A.isFreeWorkout;
  const isLog=A.isLogWorkout;
  const block=(!isFree&&!isLog)?(BLOCKS[A.blockIdx]||BLOCKS[0]):null;
  const session={
    id:Date.now(),
    date:new Date().toISOString(),
    blockId:isFree?"free":isLog?"log":block.id,
    blockLabel:isFree?"Free":isLog?"Log":block.label,
    dayId:isFree?"free":isLog?"log":A.activeDayId,
    dayLabel:isFree?t('free_workout_label'):isLog?t('log_workout_label'):(block.days.find(d=>d.id===A.activeDayId)||{label:A.activeDayId}).label,
    duration:Math.round((Date.now()-A.sessionStart)/60000),
    exercises:A.sessionExercises.map(ex=>({
      id:ex.id,libId:ex.libId,name:ex.name,muscle:ex.muscle,
      sets:(A.sessionSets[ex.id]||[]).map(s=>({reps:s.reps,weight:s.weight,done:s.done}))
    }))
  };
  stopElapsed();
  clearInterval(A._restInterval);A._restEndTime=null;
  A.restTimer=null;
  A.completedSession=session;
  A.newPRs=detectNewPRs(session);
  clearActiveSession();
  releaseWakeLock();
  if(isFree){
    navigate("freeComplete");
    return;
  }
  A.history=[...A.history,session];
  ls.set(SK.history,A.history);
  if(isLog){
    A.isLogWorkout=false;
    navigate("complete");
    return;
  }
  A.sessionExercises.forEach(ex=>{
    const sets=A.sessionSets[ex.id]||[];
    const targetReps=ex.wupTargetReps||ex.repRange[1];
    const succeeded=sets.length>0&&sets.every(s=>parseInt(s.reps)>=targetReps);
    updateFailStreak(ex.libId||ex.id,succeeded);
  });
  advanceDay(A.activeDayId);
  A.blockIdx=advanceBlockIfNeeded();
  A.previewBlockIdx=A.blockIdx;
  A.activeDayId=getNextDayId();
  maybeAdvanceWupWeek();
  navigate("complete");
}

function saveNotesAndGoHome(){
  const notes=(A.currentNotes||'').trim();
  if(notes&&A.completedSession&&A.history.length>0){
    const idx=A.history.findIndex(s=>s.id===A.completedSession.id);
    if(idx>=0){A.history[idx]={...A.history[idx],notes};ls.set(SK.history,A.history);}
  }
  A.currentNotes='';
  navigate('home');
}
// ═══════════════════════════════════════════════════════════════════
// DERIVED
// ═══════════════════════════════════════════════════════════════════
function doneSets(){return Object.values(A.sessionSets).flat().filter(s=>s.done).length;}
function totalSets(){return Object.values(A.sessionSets).flat().length;}
function allDone(){
  return A.sessionExercises.length>0&&
    A.sessionExercises.every(ex=>{
      const sets=A.sessionSets[ex.id]||[];
      return sets.length>0&&sets.every(s=>s.done);
    });
}

// ═══════════════════════════════════════════════════════════════════
// PARTIAL DOM UPDATES (avoid full re-render during workout)
// ═══════════════════════════════════════════════════════════════════
function renderSetRow(exId,idx){
  const container=document.getElementById(`set-row-${exId}-${idx}`);
  if(!container)return;
  const ex=A.sessionExercises.find(e=>e.id===exId);
  if(!ex)return;
  container.innerHTML=buildSetRowHTML(ex,idx,A.sessionSets[exId][idx]);
  bindSetRowEvents(ex,idx);
}

function updateProgress(){
  const done=doneSets(),total=totalSets();
  const pct=total?Math.round(done/total*100):0;
  const fill=document.getElementById('progress-fill');
  if(fill)fill.style.width=pct+'%';
}

function updateFinishBtn(){
  const btn=document.getElementById('finish-btn');
  if(!btn)return;
  const done=doneSets(),total=totalSets();
  if(allDone()){
    btn.disabled=false;
    btn.textContent=t('workout_finish');
  }else{
    btn.disabled=true;
    btn.textContent=`${done} / ${total} ${t('workout_sets_done')}`;
  }
}

// ═══════════════════════════════════════════════════════════════════
// HTML BUILDERS
// ═══════════════════════════════════════════════════════════════════
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// ── Inline SVG icons (stroke follows currentColor) ──
const _ICONS={
  home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  list:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  play:'<path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none"/>',
  dumbbell:'<path d="M6.5 6.5l11 11"/><path d="M21 21l-1-1"/><path d="M3 3l1 1"/><path d="M18 22l4-4"/><path d="M2 6l4-4"/><path d="M3 10l7-7"/><path d="M14 21l7-7"/>',
};
function icon(name,size=18){return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${_ICONS[name]}</svg>`;}

function buildSetRowHTML(ex,si,set,prevReps=0){
  const targetReps=ex.wupTargetReps||null;
  const repLabel=set.reps?set.reps:(targetReps?String(targetReps):(ex.repRange[0]===ex.repRange[1]?`${ex.repRange[0]}`:`${ex.repRange[0]}–${ex.repRange[1]}`));
  const isPlaceholder=!set.reps;
  const isEditing=set.editing===true;
  const floorMin=Math.min(ex.repRange[0],targetReps||ex.repRange[0]);
  const isBelowMin=set.reps&&parseInt(set.reps)<floorMin;

  // Set number cell
  const numCell=set.done&&!isEditing
    ?`<div class="set-num done">✓</div>`
    :`<div class="set-num">${si+1}</div>`;

  // Reps cell
  let repsCell;
  if(!set.done||isEditing){
    const cls='rep-btn'+(isPlaceholder?'':' has-val')+(isEditing?' editing':'')+(isBelowMin?' below-min':'');
    const prevHint=(!set.done&&prevReps>0&&prevReps<ex.repRange[0])
      ?`<span style="display:block;font-size:9px;color:#e05555;margin-top:2px;line-height:1">${t('reps_prev_low')} ${prevReps}</span>`
      :'';
    repsCell=`<div style="display:flex;flex-direction:column;align-items:center"><button id="rep-btn-${ex.id}-${si}" class="${cls}" onclick="cycleReps('${ex.id}',${si},[${ex.repRange}],${targetReps!==null?targetReps:'null'})">${repLabel}</button>${prevHint}</div>`;
  }else{
    repsCell=`<div class="rep-display${isBelowMin?' below-min':''}">${esc(set.reps)}</div>`;
  }

  // KG cell
  let kgCell;
  if(!set.done||isEditing){
    const cls='kg-inp'+(isEditing?' editing':'');
    kgCell=`<input id="kg-inp-${ex.id}-${si}" class="${cls}" type="number" placeholder="kg" value="${esc(set.weight)}"
      oninput="updateKg('${ex.id}',${si},this.value)">`;
  }else{
    kgCell=`<div class="kg-display">${esc(set.weight)}kg</div>`;
  }

  // Action cell
  let actionCell;
  if(isEditing){
    const dim=set.reps?'':'dim';
    actionCell=`<button id="chk-btn-${ex.id}-${si}" class="btn-check ${dim}" onclick="saveEdit('${ex.id}',${si})" ${set.reps?'':'disabled'}>✓</button>`;
  }else if(!set.done){
    const dim=set.reps?'':'dim';
    actionCell=`<button id="chk-btn-${ex.id}-${si}" class="btn-check ${dim}" onclick="markSetDone('${ex.id}',${si})" ${set.reps?'':'disabled'}>✓</button>`;
  }else{
    // Done — double-tap emoji to enter edit mode
    // Use a tap counter approach for mobile double-tap
    actionCell=`<button class="btn-emoji" id="emoji-btn-${ex.id}-${si}" onclick="handleEmojiTap('${ex.id}',${si})" aria-label="${esc(t('workout_hint_edit'))}"><span class="done-chip pop-in">${icon('check',14)}</span></button>`;
  }

  return`${numCell}${repsCell}${kgCell}${actionCell}`;
}

function bindSetRowEvents(ex,idx){
  // kg input — bind imperatively since we can't use oninput with escaped IDs safely
  const kgEl=document.getElementById(`kg-inp-${ex.id}-${idx}`);
  if(kgEl){
    kgEl.oninput=function(){updateKg(ex.id,idx,this.value);};
  }
}

// Double-tap detection for emoji button
const _tapTimers={};
function handleEmojiTap(exId,idx){
  const key=`${exId}-${idx}`;
  if(_tapTimers[key]){
    clearTimeout(_tapTimers[key]);
    delete _tapTimers[key];
    enterEditMode(exId,idx);
  }else{
    _tapTimers[key]=setTimeout(()=>{delete _tapTimers[key];},350);
  }
}

function buildExerciseCard(ex,ei){
  const sets=A.sessionSets[ex.id]||[];
  const exDone=sets.length>0&&sets.every(s=>s.done);
  const isLogEx=!ex.libId&&A.isLogWorkout;
  const bump=!isLogEx&&shouldIncrease(ex.id,ex.repRange[1],ex.libId);
  const prev=getExerciseHistory(ex.id,ex.libId);
  const lastS=prev.length?prev[prev.length-1]:null;
  const wts=lastS?lastS.sets.map(s=>parseFloat(s.weight)||0).filter(w=>w>0):[];
  const lastW=wts.length?Math.max(...wts):0;
  const lastR=lastS&&lastS.sets.length?Math.round(lastS.sets.reduce((a,s)=>a+(parseInt(s.reps)||0),0)/lastS.sets.length):0;

  const deload=!isLogEx&&isDeloadWeek();
  const bumpBadge=bump&&!exDone&&!deload?`<span class="badge" style="background:#d4a84622;color:#d4a846">${t('workout_load')}</span>`:
    deload&&!exDone?`<span class="badge" style="background:#e8c55a22;color:#e8c55a">📉 ${t('wup_deload_label')}</span>`:'';
  const swapBtn=(isLogEx||exDone)?'':`<button class="btn-swap" onclick="openSwap('${ex.id}','${ex.muscle}')">${t('workout_swap')}</button>`;
  const removeBtn=isLogEx?`<button class="btn-swap" onclick="removeLogExercise('${ex.id}')">✕</button>`:'';
  const doneIcon=exDone?'<span style="color:#d4a846">✓ </span>':'';
  const cueText=ex.libId?esc(t('cue_'+ex.libId)):'';
  const ytUrl=ex.libId&&YOUTUBE[ex.libId];
  const ytBtn=ytUrl?`<a class="yt-btn" href="${ytUrl}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('yt_aria'))}">${icon('play',10)}</a>`:'';
  const repDisplay=ex.wupTargetReps?(deload?`${ex.wupTargetReps} 📉`:`${ex.wupTargetReps}`):`${ex.repRange[0]}–${ex.repRange[1]}`;
  const weightSuggest=isLogEx?'':(deload?` <span style="color:#e8c55a;font-weight:700">📉 ${Math.round(lastW*0.6*2)/2}kg</span>`:
    (bump?` <span style="color:#d4a846;font-weight:700">${t('workout_try')} ${Math.round(lastW*1.025*2)/2}kg</span>`:''));
  const lastInfo=lastW>0
    ?`<div class="last-info">${t('workout_last')} <span style="color:#f2f0ea;font-weight:600">${lastW}kg × ~${lastR} ${t('workout_reps')}</span>${weightSuggest}</div>`
    :'';

  const lastSetReps=lastS?lastS.sets.map(s=>parseInt(s.reps)||0):[];
  let setsHTML='';
  sets.forEach((set,si)=>{
    setsHTML+=`<div id="set-row-${ex.id}-${si}" class="set-grid">${buildSetRowHTML(ex,si,set,lastSetReps[si]||0)}</div>`;
  });
  const addSetBtn=isLogEx?`<div style="display:flex;gap:8px;margin-top:8px">
    <button class="btn-ghost" style="flex:1;padding:8px" onclick="addLogSet('${ex.id}')">${t('log_add_set')}</button>
    ${sets.length>1?`<button class="btn-ghost" style="flex:1;padding:8px" onclick="removeLogSet('${ex.id}')">${t('log_remove_set')}</button>`:''}
  </div>`:'';

  return`
  <div class="card ex-card" style="animation-delay:${ei*0.04}s;opacity:${exDone?0.45:1}" id="ex-card-${ex.id}">
    <div class="ex-header">
      <div class="ex-title-area">
        <div class="ex-title">${doneIcon}${esc(ex.libId?t(ex.libId):ex.name)}${ytBtn}<span class="mtag">${esc(t('muscle_'+ex.muscle))}</span></div>
        <div class="ex-meta">${ex.sets} ${t('workout_sets')} · ${repDisplay} ${t('workout_reps')}</div>
      </div>
      <div class="ex-actions">${bumpBadge}${swapBtn}${removeBtn}</div>
    </div>
    ${cueText?`<div class="cue-box">💡 ${cueText}</div>`:''}
    ${lastInfo}
    <div class="set-col-hdr"><span>${t('workout_col_set')}</span><span>${t('workout_col_reps')}</span><span>${t('workout_col_kg')}</span><span></span></div>
    <div class="hint-text">${t('workout_hint_edit')}</div>
    ${setsHTML}
    ${addSetBtn}
  </div>`;
}

// ═══════════════════════════════════════════════════════════════════
// SWAP MODAL
// ═══════════════════════════════════════════════════════════════════
function openSwap(exId,muscle){
  A.swapTarget={exId,muscle};
  const alts=LIBRARY[muscle]||[];
  // Current session exercise IDs (to detect "in use")
  const currentIds=A.sessionExercises.map(e=>e.libId||e.id);
  const currentEx=A.sessionExercises.find(e=>e.id===exId);
  const currentLibId=currentEx?(currentEx.libId||currentEx.id):'';
  let items='';
  alts.forEach(alt=>{
    const isActive=alt.id===currentLibId;
    const inUse=!isActive&&currentIds.includes(alt.id);
    const lw=getLastWeight(alt.id);
    const cls='swap-item'+(isActive?' active':inUse?' in-use':' available');
    const click=inUse||isActive?'':`onclick="doSwap('${esc(exId)}','${esc(muscle)}','${esc(alt.id)}')"`;
    const altName=esc(t(alt.id));
    const label=isActive?`✓ ${altName}`:altName;
    const status=isActive?`<div style="font-size:10px;color:#9090b0">${t('workout_current')}</div>`:inUse?`<div style="font-size:10px;color:#9090b0">${t('workout_in_use')}</div>`:'';
    const altCue=esc(t('cue_'+alt.id));
    const cueRow=(!inUse&&!isActive)?`<div class="swap-cue">💡 ${altCue}</div>`:'';
    items+=`<div class="${cls}" ${click}>
      <div class="swap-row">
        <div>
          <div style="font-weight:700;font-size:14px;color:${isActive?'#d4a846':'#f2f0ea'}">${label}</div>
          <div style="font-size:11px;color:#9090b0;margin-top:2px">${alt.sets} ${t('workout_sets')} · ${alt.repRange[0]}–${alt.repRange[1]} ${t('workout_reps')}</div>
        </div>
        <div style="text-align:right">${lw?`<div style="font-size:12px;font-weight:700;color:#d4a846">${lw}kg</div>`:''}${status}</div>
      </div>${cueRow}
    </div>`;
  });
  const modal=document.createElement('div');
  modal.className='modal-overlay';
  modal.id='swap-modal';
  modal.innerHTML=`
    <div class="modal-sheet">
      <div class="modal-hdr">
        <div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px">${t('workout_swap_title')}</div>
          <div style="font-size:12px;color:#9090b0;margin-top:2px">${t('workout_muscle')} <span style="color:#d4a846;font-weight:700">${esc(t('muscle_'+muscle))}</span></div>
        </div>
        <button class="btn-back" style="width:44px;height:44px;font-size:20px;display:flex;align-items:center;justify-content:center" onclick="closeSwap()">✕</button>
      </div>
      <div class="modal-body">${items}</div>
    </div>`;
  document.body.appendChild(modal);
}
// Swap handler: builds a proper session exercise from library entry
function doSwap(oldId,muscle,libId){
  const libEx=LIBRARY[muscle].find(x=>x.id===libId);
  if(!libEx)return;
  const oldEx=A.sessionExercises.find(e=>e.id===oldId);
  // Build a new exercise with a unique session ID
  const bn=oldId.match(/^b(\d+)/);
  const blockNum=bn?bn[1]:'0';
  const newEx={
    id:`b${blockNum}_${libId.replace('lib_','')}`,
    libId:libId,
    name:libEx.name,
    muscle:muscle,
    sets:libEx.sets,
    repRange:libEx.repRange,
    cues:libEx.cues
  };
  swapExercise(oldId,newEx);
}
function closeSwap(){
  const m=document.getElementById('swap-modal');
  if(m)m.remove();
  A.swapTarget=null;
}

// ═══════════════════════════════════════════════════════════════════
// PLATE CALCULATOR
// ═══════════════════════════════════════════════════════════════════
let _plateBar=20;
function openPlateCalc(){
  const modal=document.createElement('div');
  modal.className='modal-overlay';
  modal.id='plate-modal';
  modal.innerHTML=`
    <div class="modal-sheet" style="padding:18px 20px 36px">
      <div class="modal-hdr" style="padding:0 0 14px;border-bottom:none">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px">${t('plate_title')}</div>
        <button class="btn-back" style="width:44px;height:44px;font-size:20px;display:flex;align-items:center;justify-content:center" onclick="closePlateCalc()">✕</button>
      </div>
      <input id="plate-total" type="number" inputmode="decimal" class="kg-inp" style="margin-bottom:12px" placeholder="${t('plate_total')}" oninput="updatePlateCalc()">
      <div id="plate-bars" style="display:flex;gap:6px;margin-bottom:18px">
        ${[20,15,10].map(b=>`<button class="free-pill${b===_plateBar?' active':''}" data-bar="${b}" onclick="selectPlateBar(${b})">${t('plate_bar')} ${b}kg</button>`).join('')}
      </div>
      <div id="plate-result" style="min-height:64px"></div>
    </div>`;
  document.body.appendChild(modal);
  updatePlateCalc();
  const inp=document.getElementById('plate-total');
  if(inp)inp.focus();
}
function selectPlateBar(b){
  _plateBar=b;
  document.querySelectorAll('#plate-bars .free-pill').forEach(el=>el.classList.toggle('active',+el.dataset.bar===b));
  updatePlateCalc();
}
function updatePlateCalc(){
  const el=document.getElementById('plate-result');
  if(!el)return;
  const inp=document.getElementById('plate-total');
  const total=parseFloat(String(inp?inp.value:'').replace(',','.'));
  if(!total||isNaN(total)){
    el.innerHTML=`<div style="color:#9090b0;font-size:13px;text-align:center">${t('plate_hint')}</div>`;
    return;
  }
  const r=plateBreakdown(total,_plateBar);
  if(!r){
    el.innerHTML=`<div style="color:#e05555;font-size:13px;text-align:center">${t('plate_too_light')}</div>`;
    return;
  }
  const chips=r.plates.length
    ?r.plates.map(p=>`<span class="plate-chip">${p}</span>`).join('')
    :`<span style="color:#9090b0;font-size:13px">${t('plate_bar_only')}</span>`;
  el.innerHTML=`<div style="text-align:center">
    <div style="font-size:12px;color:#9090b0;margin-bottom:10px">${t('plate_per_side')} (${r.perSide}kg)</div>
    <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">${chips}</div>
    ${r.remainder>0.01?`<div style="font-size:11px;color:#e8c55a;margin-top:10px">${t('plate_leftover')} ${r.remainder}kg</div>`:''}
  </div>`;
}
function closePlateCalc(){
  const m=document.getElementById('plate-modal');
  if(m)m.remove();
}

// ═══════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════
function viewHomeLog(){
  const totalS=A.history.length;
  const weekS=A.history.filter(h=>isThisISOWeek(h.date)).length;
  const streak=getWeekStreak();
  const recent=[...A.history].slice(-3).reverse();
  const recentHTML=recent.length?`
    <div class="sec-title" style="margin-top:20px">${t('log_recent')}</div>
    ${recent.map(s=>`<div class="card" style="cursor:pointer" onclick="navigate('history')">
      <div class="row">
        <div style="font-weight:700;font-size:14px">${esc(dayLabelText(s.dayLabel))}</div>
        <div style="font-size:11px;color:#d4a846;font-weight:700">${fmtDate(s.date)}</div>
      </div>
      <div style="font-size:12px;color:#9090b0;margin-top:4px">${s.duration} ${t('complete_min')} · ${(s.exercises||[]).length} ${t('history_ex')}</div>
    </div>`).join('')}`:'';
  return`
  <div class="hdr">
    <div><div class="logo">RAUTALOKI</div><div class="hdr-sub">${today()}</div></div>
  </div>
  <div class="page">
    <div class="h1">${t('home_ready')}</div>
    <div class="stats-row">
      <div class="stat-box"><div class="stat-val">${totalS}</div><div class="stat-lbl">${t('stat_sessions')}</div></div>
      <div class="stat-box"><div class="stat-val">${weekS}</div><div class="stat-lbl">${t('stat_this_week')}</div></div>
      <div class="stat-box"><div class="stat-val">${streak}</div><div class="stat-lbl">${t('streak_label')}</div></div>
    </div>
    <div class="acard">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:900;margin-bottom:14px">✏️ ${t('ob_mode_log')}</div>
      <button class="btn-primary" onclick="startLogWorkout()">${t('home_start')}</button>
    </div>
    ${recentHTML}
  </div>
  ${navHTML("home")}`;
}
function viewHome(){
  if(getMode()==='log')return viewHomeLog();
  const block=BLOCKS[A.blockIdx]||BLOCKS[0];
  if(!block)return`<div class="page"><div class="h1">No program</div><button class="btn-primary" onclick="navigate('onboarding')">${t('home_start')}</button></div>`;
  const nextB=BLOCKS[(A.blockIdx+1)%BLOCKS.length];
  const stu=getSessionsUntilSwap();
  const nextDay=block.days.find(d=>d.id===A.activeDayId)||block.days[0];
  if(nextDay!==block.days.find(d=>d.id===A.activeDayId)){A.activeDayId=nextDay.id;}
  const totalS=A.history.length;
  const weekS=A.history.filter(h=>isThisISOWeek(h.date)).length;

  const pillsHTML=nextDay.exercises.map(ex=>{
    const lw=getLastWeight(ex.libId)??getLastWeight(ex.id);
    const bump=shouldIncrease(ex.id,ex.repRange[1],ex.libId);
    return`<span class="ex-pill"><span style="font-size:12px;color:#f2f0ea">${esc(t(ex.libId||ex.name))}</span>${lw?`<span style="font-size:12px;font-weight:700;color:${bump?'#d4a846':'#9090b0'}">${bump?'↑':''}${lw}kg</span>`:''}</span>`;
  }).join('');

  const swapAlert=stu<=2?`
    <div class="scard" style="margin-top:4px">
      <div style="font-size:11px;color:#e8c55a;font-weight:700;letter-spacing:.08em;margin-bottom:3px">🔄 ${t('home_block_swap_in')} ${stu} ${stu!==1?t('home_sessions'):t('home_session')}</div>
      <div style="font-size:13px;color:#f2f0ea">${t('home_coming_up')} <strong>${t('block_label')} ${nextB.id} — ${t('theme_'+nextB.theme)}</strong></div>
    </div>`:'';

  const dayListHTML=block.days.map(day=>{
    const isNext=day.id===A.activeDayId;
    const badge=isNext?`<span class="badge" style="background:#d4a84622;color:#d4a846">${t('home_next')}</span>`:'';
    return`<div class="card day-card" onclick="startWorkout('${day.id}')">
      <div>
        <div style="font-weight:700;font-size:15px">${day.emoji} ${esc(t('day_'+day.label))}</div>
        <div style="font-size:12px;color:#9090b0">${esc(t('focus_'+day.focus))}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">${badge}<span class="day-arrow">›</span></div>
    </div>`;
  }).join('');

  const freq=(getProfile()||{freq:3}).freq;
  return`
  <div class="hdr">
    <div><div class="logo">RAUTALOKI</div><div class="hdr-sub">${today()}</div></div>
    <div style="text-align:right">
      <div style="font-size:10px;color:#e8c55a;font-weight:700;letter-spacing:.06em">${t('block_label')} ${block.id}</div>
      <div style="font-size:10px;color:#9090b0;margin-top:1px">${stu} ${stu!==1?t('home_sessions_left'):t('home_session_left')}</div>
    </div>
  </div>
  <div class="page">
    <div class="h1">${t('home_ready')}</div>
    <div class="sub">${freq} ${t('home_days_week')} ${freq<=3?t('home_full_body'):t('home_split')} ${BLOCKS.length} ${t('home_blocks_variation')}</div>
    <div class="stats-row">
      <div class="stat-box"><div class="stat-val">${totalS}</div><div class="stat-lbl">${t('stat_sessions')}</div></div>
      <div class="stat-box"><div class="stat-val">${weekS}<span>/${freq}</span></div><div class="stat-lbl">${t('stat_this_week')}</div></div>
      <div class="stat-box"><div class="stat-val">${stu}</div><div class="stat-lbl">${t('stat_to_swap')}</div></div>
    </div>
    ${(()=>{const{goal,week}=getWupState();const dl=week===4;return`<div style="display:flex;gap:8px;align-items:center;margin-bottom:16px;flex-wrap:wrap"><span style="background:#1c1c2e;border-radius:99px;padding:3px 10px;font-size:11px;color:#d4a846;font-weight:700">${t('goal_'+goal)} · ${t('wup_week')} ${week}/4</span>${dl?`<span style="font-size:11px;color:#e8c55a;font-weight:700">📉 ${t('wup_deload_label')}</span>`:''}</div>`;})()}
    <div class="acard">
      <div style="font-size:11px;color:#d4a846;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">
        ${t('home_up_next')} · ${t('block_label')} ${block.id} · ${t('home_day')} ${nextDay.id}
      </div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:900;margin-bottom:2px">${nextDay.emoji} ${esc(t('day_'+nextDay.label))}</div>
      <div style="font-size:13px;color:#9090b0;margin-bottom:14px">${esc(t('focus_'+nextDay.focus))}</div>
      <div style="display:flex;flex-wrap:wrap;margin-bottom:16px">${pillsHTML}</div>
      <button class="btn-primary" onclick="startWorkout('${A.activeDayId}')">${t('home_start')}</button>
      <button class="btn-ghost" style="margin-top:8px" onclick="openFreeBuilder()">${t('free_open_builder')}</button>
    </div>
    ${swapAlert}
    ${(()=>{
      const cws=getCustomWorkouts();
      if(!cws.length)return'';
      const listHTML=cws.map(cw=>`
        <div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;">
          <div style="flex:1;cursor:pointer" onclick="startFreeWorkout(${JSON.stringify(cw.exerciseIds)})">
            <div style="font-weight:600;font-size:14px">▶ ${esc(cw.name)}</div>
            <div style="font-size:11px;color:#9090b0">${cw.exerciseIds.length} ${t('free_exercises')}</div>
          </div>
          <button class="icon-btn" aria-label="${esc(t('history_delete'))}" onclick="event.stopPropagation();confirmDeleteCustomWorkout('${cw.id}')">${icon('trash',16)}</button>
        </div>`).join('');
      return`<div class="sec-title" style="margin-top:20px">${t('free_my_workouts')}</div>${listHTML}`;
    })()}
    <div class="sec-title" style="margin-top:20px">${t('home_all_days')} ${t('block_label')} ${block.id}</div>
    ${dayListHTML}
  </div>
  ${navHTML("home")}`;
}

function logExerciseInputHTML(){
  const ownNames=getLoggedExerciseNames();
  const currentNames=A.sessionExercises.map(e=>e.name).filter(Boolean);
  const options=matchExerciseNames(ownNames,'',currentNames).map(n=>`<option value="${esc(n)}">`).join('');
  return`<div class="card" style="margin-bottom:12px">
    <div style="display:flex;gap:8px">
      <input id="log-ex-inp" type="text" list="log-ex-names" placeholder="${esc(t('log_ex_placeholder'))}"
        style="flex:1;box-sizing:border-box;background:#1c1c2e;color:#f2f0ea;border:1px solid #333;border-radius:8px;padding:10px;font-size:14px;font-family:inherit"
        onkeydown="if(event.key==='Enter'){event.preventDefault();addLogExercise();}">
      <button class="btn-primary" style="width:auto;padding:10px 16px" onclick="addLogExercise()">${t('log_add_exercise')}</button>
    </div>
    <datalist id="log-ex-names">${options}</datalist>
  </div>`;
}
function viewWorkout(){
  const exercisesHTML=A.sessionExercises.map((ex,ei)=>buildExerciseCard(ex,ei)).join('');
  const done=doneSets(),total=totalSets();
  const pct=total?Math.round(done/total*100):0;
  const isDone=allDone();
  const someStarted=done>0&&!isDone;
  const deloadBanner=(!A.isLogWorkout&&isDeloadWeek())?`<div style="background:#1a1810;border:1px solid #e8c55a44;border-radius:12px;padding:10px 14px;margin-bottom:12px;font-size:13px;color:#e8c55a">📉 <strong>${t('wup_deload_week')}</strong> — ${t('wup_deload_desc')}</div>`:'';
  return`
  <div id="workout-hdr" class="hdr" style="padding-top:48px">
    <div>
      <div class="logo">RAUTALOKI</div>
      <div id="elapsed-txt" class="hdr-sub">${elapsedLabel()}</div>
    </div>
    <div style="display:flex;gap:8px">
      <button style="background:none;border:1px solid #1c1c2e;color:#9090b0;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center" aria-label="${esc(t('plate_title'))}" onclick="openPlateCalc()">${icon('dumbbell',20)}</button>
      <button style="background:none;border:1px solid #1c1c2e;color:#d4a846;font-weight:700;font-size:18px;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center" onclick="cancelWorkout()">✕</button>
    </div>
  </div>
  <div class="page">
    <div class="progress-track"><div id="progress-fill" class="progress-fill" style="width:${pct}%"></div></div>
    ${deloadBanner}
    ${A.isLogWorkout?logExerciseInputHTML():''}
    ${exercisesHTML}
    <div style="height:12px"></div>
    <button id="finish-btn" class="btn-primary" onclick="finishWorkout()" ${isDone?'':'disabled'}>
      ${isDone?t('workout_finish'):`${done} / ${total} ${t('workout_sets_done')}`}
    </button>
    ${isDone?'':`<div style="text-align:center;font-size:12px;color:#9090b0;margin-top:8px">${t('workout_complete_all')}</div>`}
    ${someStarted?`<button class="btn-ghost" style="margin-top:10px;color:#9090b0;border-color:#1c1c2e" onclick="quitWithoutCompleting()">${t('workout_quit')}</button>`:''}
  </div>
  <div id="rest-bar" class="rest-bar">
    <div id="rest-time" class="rest-pulse" style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;color:#d4a846;letter-spacing:.04em">${t('workout_rest')} · 1:30</div>
    <button class="btn-tiny" style="color:#d4a846;border-color:#d4a846;padding:10px 24px;font-size:14px;font-weight:700" onclick="skipRest()">${t('workout_skip')}</button>
  </div>`;
}

function viewComplete(){
  const s=A.completedSession;
  if(!s)return viewHome();
  const vol=s.exercises.reduce((a,e)=>a+e.sets.reduce((b,st)=>b+(parseFloat(st.weight)||0)*(parseFloat(st.reps)||0),0),0);
  const curBlock=BLOCKS[A.blockIdx]||BLOCKS[0];
  const nd=curBlock?curBlock.days.find(d=>d.id===getNextDayId()):null;
  const blockSwapped=curBlock&&curBlock.id!==s.blockId&&s.blockId!=="free";
  const swapNote=blockSwapped?`
    <div class="scard" style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:#e8c55a;margin-bottom:4px;text-transform:uppercase;letter-spacing:.1em">🔄 ${t('complete_switch')}</div>
      <div style="font-size:14px;color:#f2f0ea">${t('complete_now_starting')} <strong>${t('block_label')} ${curBlock.id} — ${t('theme_'+curBlock.theme)}</strong>.</div>
    </div>`:'';
  const prCard=(A.newPRs&&A.newPRs.length)?`
    <div class="acard pop-in" style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:#d4a846;margin-bottom:6px;text-transform:uppercase;letter-spacing:.1em">🎉 ${t('pr_new')}</div>
      ${A.newPRs.map(p=>`<div style="display:flex;justify-content:space-between;padding:3px 0"><span style="font-size:14px">${esc(p.libId?t(p.libId):p.name||p.key)}</span><span style="font-size:14px;font-weight:700;color:#d4a846">${p.prev}kg → ${p.weight}kg</span></div>`).join('')}
    </div>`:'';
  const dayLabel=dayLabelText(s.dayLabel);
  return`
  <div class="page">
    <div class="complete-center">
      <div class="pop-in" style="font-size:72px">🏆</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:52px;font-weight:900;color:#d4a846;margin-top:12px">${t('complete_done')}</div>
      <div style="color:#9090b0;font-size:14px;margin-top:4px">${esc(dayLabel)} · ${s.duration} ${t('complete_min')}</div>
    </div>
    <div class="stats-row">
      <div class="stat-box"><div class="stat-val">${s.duration}m</div><div class="stat-lbl">${t('stat_duration')}</div></div>
      <div class="stat-box"><div class="stat-val">${s.exercises.length}</div><div class="stat-lbl">${t('stat_exercises')}</div></div>
      <div class="stat-box"><div class="stat-val">${vol>0?Math.round(vol/100)/10+'k':'—'}</div><div class="stat-lbl">${t('stat_volume')}</div></div>
    </div>
    ${swapNote}
    ${prCard}
    ${nd?`<div class="card" style="margin-bottom:16px">
      <div style="font-size:12px;color:#9090b0;margin-bottom:6px;text-transform:uppercase;letter-spacing:.08em;font-weight:700">${t('complete_up_next')}</div>
      <div style="font-weight:700;font-size:16px">${nd.emoji} ${esc(t('day_'+nd.label)||nd.label)}</div>
      <div style="font-size:13px;color:#9090b0;margin-top:2px">${esc(t('focus_'+nd.focus)||nd.focus)}</div>
    </div>`:''}
    <div class="card" style="margin-bottom:16px">
      <div style="font-size:12px;color:#9090b0;margin-bottom:8px;text-transform:uppercase;letter-spacing:.08em;font-weight:700">${t('notes_label')}</div>
      <textarea placeholder="${t('notes_placeholder')}" rows="3" oninput="A.currentNotes=this.value" style="width:100%;box-sizing:border-box;background:#1c1c2e;color:#f2f0ea;border:1px solid #d4a84660;border-radius:8px;padding:10px;font-size:14px;font-family:inherit;resize:none;outline:none">${esc(A.currentNotes||'')}</textarea>
    </div>
    <button class="btn-primary" onclick="saveNotesAndGoHome()">${t('complete_back')}</button>
  </div>`;
}

// ── Activity heatmap + weekly streak ──
// Day label for display: translated program-day key when one exists,
// otherwise the stored label as-is (free/custom workout names).
function dayLabelText(l){if(!l)return'';const k='day_'+l,s=t(k);return s===k?l:s;}
function getSessionsByDay(){
  const m={};
  A.history.forEach(h=>{const d=new Date(h.date);const k=`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;(m[k]=m[k]||[]).push(h);});
  return m;
}
function hmSelect(key){
  A._hmSel=A._hmSel===key?null:key;
  render();
}
function positionHmTip(){
  const tip=document.getElementById('hm-tip'),cell=document.querySelector('.hm-cell.sel'),wrap=document.querySelector('.hm-wrap');
  if(!tip||!cell||!wrap)return;
  const wr=wrap.getBoundingClientRect(),cr=cell.getBoundingClientRect(),tr=tip.getBoundingClientRect();
  const center=cr.left-wr.left+cr.width/2;
  tip.style.left=`${tipLeft(center,tr.width,wr.width)}px`;
  let top=cr.top-wr.top-tr.height-6;
  if(top<0)top=cr.bottom-wr.top+6;
  tip.style.top=`${top}px`;
  tip.classList.add('pos');
}
function getWeekStreak(){
  const weeks=new Set(A.history.map(h=>getISOWeekKey(new Date(h.date))));
  let streak=0;
  const cursor=new Date();
  if(!weeks.has(getISOWeekKey(cursor)))cursor.setDate(cursor.getDate()-7);
  while(weeks.has(getISOWeekKey(cursor))){streak++;cursor.setDate(cursor.getDate()-7);}
  return streak;
}
function buildHeatmapHTML(){
  const byDay=getSessionsByDay();
  const now=new Date();now.setHours(0,0,0,0);
  const dow=(now.getDay()+6)%7;
  const end=new Date(now);end.setDate(now.getDate()+(6-dow));
  const WEEKS=16;
  let cols='';
  for(let w=WEEKS-1;w>=0;w--){
    const monday=new Date(end);monday.setDate(end.getDate()-w*7-6);
    let col=`<div class="hm-wk">${isoWeekNumber(monday)}</div>`;
    for(let d=6;d>=0;d--){
      const cur=new Date(end);cur.setDate(end.getDate()-w*7-d);
      const key=`${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
      const hit=!!byDay[key];
      col+=`<div class="hm-cell${hit?' hit':''}${cur>now?' future':''}${A._hmSel===key?' sel':''}"${hit?` onclick="hmSelect('${key}')"`:''}></div>`;
    }
    cols+=`<div class="hm-col">${col}</div>`;
  }
  const dayLabels=[0,1,2,3,4,5,6].map(i=>`<div class="hm-day">${t('dow_'+i)}</div>`).join('');
  let tip='';
  const sel=A._hmSel&&byDay[A._hmSel];
  if(sel){
    const[y,mo,da]=A._hmSel.split('-').map(Number);
    const ds=new Date(y,mo,da).toLocaleDateString(getLang()==='fi'?'fi-FI':'en-GB',{weekday:'short',day:'numeric',month:'short'});
    const rows=sel.map(s=>`<div>${esc(dayLabelText(s.dayLabel))}${(s.blockLabel&&s.blockId!=='free'&&s.blockId!=='log')?` · ${t('block_label')} ${s.blockId}`:''}</div>`).join('');
    tip=`<div class="hm-tip" id="hm-tip"><div class="hm-tip-date">${ds}</div>${rows}</div>`;
  }
  return`<div class="hm-wrap">
    <div class="hm-days"><div class="hm-wk"></div>${dayLabels}</div>
    <div class="hm-grid">${cols}</div>
    ${tip}
  </div>`;
}

// ── Body weight log ──
function getBodyweightLog(){return ls.get(SK.bodyweight)||[];}
function addBodyweight(){
  const inp=document.getElementById('bw-inp');
  if(!inp)return;
  const v=parseFloat(String(inp.value).replace(',','.'));
  if(isNaN(v)||v<=0||v>400)return;
  const log=getBodyweightLog();
  const todayKey=new Date().toISOString().slice(0,10);
  const idx=log.findIndex(e=>String(e.date).slice(0,10)===todayKey);
  const entry={date:new Date().toISOString(),kg:v};
  if(idx>=0)log[idx]=entry;else log.push(entry);
  ls.set(SK.bodyweight,log);
  render();
}

function selectChartExercise(libId){A.chartExercise=libId;render();}
function toggleSession(i){if(A._openSessions.has(i))A._openSessions.delete(i);else A._openSessions.add(i);render();}
function toggleHistEx(key){if(A._openHistEx.has(key))A._openHistEx.delete(key);else A._openHistEx.add(key);render();}
function viewHistory(){
  const hist=[...A.history].reverse();
  const streak=getWeekStreak();
  const streakSection=hist.length?`<div class="card" style="margin-bottom:16px">
    <div class="row" style="margin-bottom:10px">
      <div class="sec-title" style="margin:0">${t('heatmap_title')}</div>
      ${streak>0?`<div style="font-size:12px;font-weight:700;color:#d4a846">🔥 ${streak} ${t('streak_label')}</div>`:''}
    </div>
    ${buildHeatmapHTML()}
  </div>`:'';
  const bwLog=getBodyweightLog();
  const bwSection=`<div class="card" style="margin-bottom:16px">
    <div class="row" style="cursor:pointer;user-select:none" onclick="A.bwOpen=!A.bwOpen;render()">
      <div class="sec-title">${t('bw_title')}${bwLog.length?` · <span style="color:#d4a846">${bwLog[bwLog.length-1].kg}kg</span>`:''}</div>
      <div style="font-size:12px;color:#9090b0;transition:transform .2s;transform:rotate(${A.bwOpen?'180':'0'}deg)">▼</div>
    </div>
    ${A.bwOpen?`
      <div style="display:flex;gap:8px;margin:10px 0 12px">
        <input id="bw-inp" type="number" inputmode="decimal" step="0.1" class="kg-inp" style="flex:1" placeholder="${t('bw_placeholder')}" value="">
        <button class="btn-check" style="width:auto;padding:11px 18px" onclick="addBodyweight()">${t('bw_add')}</button>
      </div>
      ${bwLog.length?renderLineChart(bwLog.map(e=>({date:e.date,max:e.kg}))):''}`:''}
  </div>`;
  // Progress chart
  let chartSection='';
  const chartExList=getExercisesWithHistory();
  if(chartExList.length>0){
    if(!A.chartExercise||!chartExList.includes(A.chartExercise))A.chartExercise=chartExList[0];
    const pills=chartExList.map(lid=>
      `<button class="chart-pill${A.chartExercise===lid?' active':''}" onclick="selectChartExercise('${lid}')">${t(lid)}</button>`
    ).join('');
    chartSection=`<div class="card" style="margin-bottom:16px">
      <div class="row" style="cursor:pointer;user-select:none" onclick="A.chartOpen=!A.chartOpen;render()">
        <div class="sec-title">${t('chart_title')}</div>
        <div style="font-size:12px;color:#9090b0;transition:transform .2s;transform:rotate(${A.chartOpen?'180':'0'}deg)">▼</div>
      </div>
      ${A.chartOpen?`<div class="chart-pills">${pills}</div>${renderProgressChart(A.chartExercise)}`:''}
    </div>`;
  }
  let weeklySection='';
  const weekSets=getWeeklySetsByMuscle();
  const activeMuscles=Object.keys(weekSets).filter(m=>weekSets[m]>0);
  if(activeMuscles.length>0){
    const MUSCLE_ORDER=['Quads','Hamstrings','Glutes','Calves','Chest','Back','Shoulders','Biceps','Triceps'];
    const sorted=MUSCLE_ORDER.filter(m=>weekSets[m]>0).concat(activeMuscles.filter(m=>!MUSCLE_ORDER.includes(m)&&weekSets[m]>0));
    const maxSets=Math.max(...sorted.map(m=>weekSets[m]),20);
    const TARGET=10;
    const bars=sorted.map(m=>{
      const sets=weekSets[m];
      const pct=Math.min(100,Math.round(sets/maxSets*100));
      const targetPct=Math.min(100,Math.round(TARGET/maxSets*100));
      const met=sets>=TARGET;
      return`<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
        <div style="width:76px;font-size:12px;color:#9090b0;flex-shrink:0">${t('muscle_'+m)}</div>
        <div style="flex:1;position:relative;height:10px;background:#1c1c2e;border-radius:5px;overflow:visible">
          <div style="position:absolute;left:0;top:0;height:100%;width:${pct}%;background:${met?'#d4a846':'#4a4a70'};border-radius:5px"></div>
          <div style="position:absolute;left:${targetPct}%;top:-2px;height:14px;width:2px;background:#d4a84680;border-radius:1px"></div>
        </div>
        <div style="width:22px;font-size:12px;font-weight:700;color:${met?'#d4a846':'#9090b0'};text-align:right">${sets}</div>
      </div>`;
    }).join('');
    weeklySection=`<div class="card" style="margin-bottom:16px">
      <div class="row" style="cursor:pointer;user-select:none" onclick="A.weeklyOpen=!A.weeklyOpen;render()">
        <div class="sec-title">${t('weekly_volume_title')}</div>
        <div style="font-size:12px;color:#9090b0;transition:transform .2s;transform:rotate(${A.weeklyOpen?'180':'0'}deg)">▼</div>
      </div>
      ${A.weeklyOpen?`${bars}<div style="font-size:11px;color:#9090b0;margin-top:6px">${t('weekly_target')}</div>`:''}
    </div>`;
  }
  let prSection='';
  const prs=getPRs();
  if(prs.length>0){
    const MUSCLE_ORDER=['Quads','Hamstrings','Glutes','Calves','Chest','Back','Shoulders','Biceps','Triceps'];
    const grouped={};
    prs.forEach(pr=>{const m=pr.muscle||'Other';if(!grouped[m])grouped[m]=[];grouped[m].push(pr);});
    const muscleKeys=MUSCLE_ORDER.filter(m=>grouped[m]).concat(Object.keys(grouped).filter(m=>!MUSCLE_ORDER.includes(m)&&grouped[m]));
    const muscleRows=muscleKeys.map(m=>{
      const rows=grouped[m].map(pr=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-top:1px solid #1c1c2e">
          <div style="font-size:13px;color:#9090b0">${esc(pr.libId?t(pr.libId):pr.name||pr.key)}</div>
          <div style="text-align:right">
            <div style="font-size:14px;font-weight:700;color:#f2f0ea">${pr.weight}kg <span style="font-size:11px;color:#9090b0">× ${pr.reps}</span></div>
            <div style="font-size:10px;color:#9090b0">${t('pr_est_1rm')} <span style="color:#d4a846;font-weight:700">${pr.est1rm}kg</span></div>
          </div>
        </div>`).join('');
      return`<div style="margin-bottom:10px">
        <div style="font-size:10px;font-weight:700;color:#d4a846;text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px">${(T[getLang()]||T.en)['muscle_'+m]||m}</div>
        ${rows}
      </div>`;
    }).join('');
    prSection=`<div class="card" style="margin-bottom:16px">
      <div class="row" style="cursor:pointer;user-select:none" onclick="A.prOpen=!A.prOpen;render()">
        <div class="sec-title">🏆 ${t('pr_title')}</div>
        <div style="font-size:12px;color:#9090b0;transition:transform .2s;transform:rotate(${A.prOpen?'180':'0'}deg)">▼</div>
      </div>
      ${A.prOpen?muscleRows:''}
    </div>`;
  }
  let content='';
  if(!hist.length){
    content=`<div style="color:#9090b0;text-align:center;padding-top:40px">${t('history_empty')}</div>`;
  }else{
    hist.forEach((session,si)=>{
      const vol=(session.exercises||[]).reduce((a,e)=>a+(e.sets||[]).reduce((b,st)=>b+(parseFloat(st.weight)||0)*(parseFloat(st.reps)||0),0),0);
      const ds=fmtDate(session.date);
      let exRows='';
      (session.exercises||[]).forEach((ex,ei)=>{
        const wts=(ex.sets||[]).map(st=>parseFloat(st.weight)||0).filter(w=>w>0);
        const maxW=wts.length?Math.max(...wts):0;
        if(maxW<=0)return;
        const exName=ex.libId?t(ex.libId):esc(ex.name);
        const exKey=`${si}_${ei}`;
        const exOpen=A._openHistEx.has(exKey);
        const setRows=(ex.sets||[]).map((st,sti)=>{
          const r=st.reps!==undefined&&st.reps!==''?st.reps:'–';
          const w=st.weight!==undefined&&st.weight!==''?`${st.weight}kg`:'–';
          return`<div style="display:flex;justify-content:space-between;padding:4px 0 4px 12px;font-size:12px;color:#9090b0">
            <span>${sti+1}.</span><span>${r} × ${w}</span>
          </div>`;
        }).join('');
        exRows+=`<div style="border-top:1px solid #1c1c2e;margin-top:5px;padding-top:5px;cursor:pointer" onclick="event.stopPropagation();toggleHistEx('${exKey}')">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:13px;color:#9090b0">${exName}</div>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="font-size:13px;font-weight:700">${maxW}kg</div>
              <div style="font-size:10px;color:#9090b0;transition:transform .2s;transform:rotate(${exOpen?'180':'0'}deg)">▼</div>
            </div>
          </div>
          ${exOpen?setRows:''}
        </div>`;
      });
      const sessionDayLabel=dayLabelText(session.dayLabel);
      const open=A._openSessions&&A._openSessions.has(si);
      content+=`<div style="border-top:1px solid #1c1c2e;padding:10px 0 ${open?'6px':'10px'};cursor:pointer" onclick="toggleSession(${si})">
        <div class="row">
          <div style="font-weight:700;font-size:14px">${esc(sessionDayLabel||'')}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="font-size:11px;color:#d4a846;font-weight:700">${ds}</div>
            ${(session.blockLabel&&session.blockId!=='free'&&session.blockId!=='log')?`<div style="font-size:10px;color:#9090b0">${t('block_label')} ${session.blockId}</div>`:''}
            <div style="font-size:12px;color:#9090b0;transition:transform .2s;transform:rotate(${open?'180':'0'}deg)">▼</div>
          </div>
        </div>
        ${open?`<div style="margin-top:8px">
          <div style="font-size:12px;color:#9090b0;display:flex;gap:6px;flex-wrap:wrap">
            <span class="tag">${session.duration} ${t('complete_min')}</span>
            <span class="tag">${(session.exercises||[]).length} ${t('history_ex')}</span>
            ${vol>0?`<span class="tag">${Math.round(vol)}kg ${t('history_vol')}</span>`:''}
            ${session.partial?`<span class="tag" style="color:#ff4455;border:1px solid #ff445533">${t('history_partial')}</span>`:''}
          </div>
          <div style="margin-top:6px">${exRows}</div>
          ${(session.notes&&session.notes.trim())?`<div style="font-size:13px;color:#9090b0;font-style:italic;margin-top:10px;padding-top:8px;border-top:1px solid #1c1c2e">"${esc(session.notes)}"</div>`:''}
          <button class="btn-tiny" style="color:#ff4455;border-color:#ff445533;margin-top:12px" onclick="event.stopPropagation();deleteSession(${hist.length-1-si})">${t('history_delete')}</button>
        </div>`:''}
      </div>`;
    });
  }
  return`
  <div class="hdr"><div class="logo">RAUTALOKI</div></div>
  <div class="page">
    <div class="h2">${t('history_title')}</div>
    ${streakSection}
    ${weeklySection}
    ${prSection}
    ${chartSection}
    ${bwSection}
    ${hist.length?`<div class="card" style="margin-bottom:16px">
      <div class="row" style="cursor:pointer;user-select:none" onclick="A.sessionsOpen=!A.sessionsOpen;render()">
        <div class="sec-title">${t('stat_sessions')}</div>
        <div style="font-size:12px;color:#9090b0;transition:transform .2s;transform:rotate(${A.sessionsOpen?'180':'0'}deg)">▼</div>
      </div>
      ${A.sessionsOpen?`<div style="margin-top:10px">${content}</div>`:''}
    </div>`:content}
  </div>
  ${navHTML("history")}`;
}

function viewProgram(){
  if(!BLOCKS.length)return`<div class="page"><div class="h2">${t('program_title')}</div><div class="sub">No program yet.</div></div>${navHTML("program")}`;
  const block=BLOCKS[A.blockIdx]||BLOCKS[0];
  const nextB=BLOCKS[(A.blockIdx+1)%BLOCKS.length];
  const stu=getSessionsUntilSwap();
  const pb=BLOCKS[A.previewBlockIdx]||BLOCKS[0];

  const tabsHTML=BLOCKS.map((b,i)=>{
    const isPreview=i===A.previewBlockIdx;
    const isActive=i===A.blockIdx;
    return`<button class="block-tab"
      style="background:${isPreview?'#d4a846':'#1c1c30'};color:${isPreview?'#080810':'#9090b0'};border-color:${isActive?'#d4a846':'transparent'}"
      onclick="setPreviewBlock(${i})">${t('block_label')} ${b.id}${isActive?' ✓':''}</button>`;
  }).join('');

  const daysHTML=pb.days.map(day=>{
    let exRows='';
    day.exercises.forEach(ex=>{
      const lw=getLastWeight(ex.id);
      exRows+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-top:1px solid #1c1c2e">
        <div>
          <div style="font-size:13px;font-weight:600">${esc(t(ex.libId||ex.name))}<span class="mtag">${esc(t('muscle_'+ex.muscle))}</span></div>
          <div style="font-size:11px;color:#9090b0">${ex.sets} ${t('workout_sets')} · ${ex.repRange[0]}–${ex.repRange[1]} ${t('workout_reps')}</div>
        </div>
        ${lw?`<div style="font-size:13px;font-weight:700;color:#d4a846">${lw}kg</div>`:''}
      </div>`;
    });
    return`<div class="card" style="margin-bottom:10px">
      <div class="row" style="margin-bottom:10px">
        <div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px">${day.emoji} ${esc(t('day_'+day.label))}</div>
          <div style="font-size:11px;color:#9090b0">${esc(t('focus_'+day.focus))}</div>
        </div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;color:#1c1c2e">${day.id}</div>
      </div>
      ${exRows}
    </div>`;
  }).join('');

  const freq=(getProfile()||{freq:3}).freq;
  return`
  <div class="hdr"><div class="logo">RAUTALOKI</div></div>
  <div class="page">
    <div class="h2">${t('program_title')}</div>
    <div class="acard" style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:#d4a846;letter-spacing:.1em;margin-bottom:6px">${freq<=3?t('program_full_body'):t('program_split')} · ${freq}${t('program_per_week')} · ${BLOCKS.length} ${t('program_blocks')}</div>
      <div style="font-size:13px;color:#9090b0;line-height:1.6">
        ${BLOCKS.length} ${t('program_desc_1')} ${sessionsPerBlock()} ${t('program_desc_2')}
        ${t('program_desc_swap')}
      </div>
    </div>
    <div class="scard" style="margin-bottom:16px;display:flex;align-items:center;gap:14px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:38px;font-weight:900;color:#e8c55a;line-height:1">${stu}</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#e8c55a">${stu!==1?t('program_sessions_until'):t('program_session_until')} ${t('block_label')} ${nextB.id}</div>
        <div style="font-size:12px;color:#9090b0;margin-top:2px">${esc(t('theme_'+nextB.theme))}</div>
      </div>
    </div>
    <div class="block-grid">${tabsHTML}</div>
    <div style="font-size:12px;color:#e8c55a;font-weight:700;margin-bottom:12px">
      ${esc(t('theme_'+pb.theme))}${A.blockIdx===A.previewBlockIdx?` · ${t('program_active')}`:''}
    </div>
    ${daysHTML}
  </div>
  ${navHTML("program")}`;
}

function viewOnboarding(){
  if(!_obState.mode){
    return`
    <div class="ob-page">
      <div class="ob-title">RAUTALOKI</div>
      <div style="font-size:14px;color:#9090b0;margin-bottom:8px">${t('ob_tagline')}</div>
      <div class="ob-sub">${t('ob_mode_title')}</div>
      <div class="card" style="cursor:pointer;text-align:left;margin-bottom:12px" onclick="obSelectMode('program')">
        <div style="font-weight:700;font-size:16px">📋 ${t('ob_mode_program')}</div>
        <div style="font-size:13px;color:#9090b0;margin-top:4px">${t('ob_mode_program_desc')}</div>
      </div>
      <div class="card" style="cursor:pointer;text-align:left" onclick="obSelectMode('log')">
        <div style="font-weight:700;font-size:16px">✏️ ${t('ob_mode_log')}</div>
        <div style="font-size:13px;color:#9090b0;margin-top:4px">${t('ob_mode_log_desc')}</div>
      </div>
      <div style="font-size:11px;color:#9090b0;margin-top:12px">${t('ob_change_later')}</div>
    </div>`;
  }
  return`
  <div class="ob-page">
    <div class="ob-title">RAUTALOKI</div>
    <div style="font-size:14px;color:#9090b0;margin-bottom:8px">${t('ob_tagline')}</div>
    <div class="ob-sub">${t('ob_subtitle')}</div>

    <div class="ob-section">
      <div class="ob-label">${t('ob_freq')}</div>
      <div class="ob-options" id="ob-freq">
        <div class="ob-opt" data-val="2" onclick="obSelect('freq',2)"><div class="ob-opt-big">2</div><div class="ob-opt-sm">${t('ob_full_body')}</div></div>
        <div class="ob-opt" data-val="3" onclick="obSelect('freq',3)"><div class="ob-opt-big">3</div><div class="ob-opt-sm">${t('ob_full_body')}</div></div>
        <div class="ob-opt" data-val="4" onclick="obSelect('freq',4)"><div class="ob-opt-big">4</div><div class="ob-opt-sm">${t('ob_upper_lower')}</div></div>
        <div class="ob-opt" data-val="5" onclick="obSelect('freq',5)"><div class="ob-opt-big">5</div><div class="ob-opt-sm">${t('ob_ppl')}</div></div>
      </div>
    </div>

    <div class="ob-section">
      <div class="ob-label">${t('ob_iam')}</div>
      <div class="ob-sex" id="ob-sex">
        <div class="ob-opt" data-val="male" onclick="obSelect('sex','male')"><div class="ob-emoji">🧔</div><div style="font-weight:700">${t('ob_male')}</div></div>
        <div class="ob-opt" data-val="female" onclick="obSelect('sex','female')"><div class="ob-emoji">👩</div><div style="font-weight:700">${t('ob_female')}</div></div>
      </div>
    </div>

    <div class="ob-section">
      <div class="ob-label">${t('ob_goal')}</div>
      <div class="ob-options" id="ob-goal">
        <div class="ob-opt" data-val="hypertrophy" onclick="obSelect('goal','hypertrophy')"><div class="ob-opt-big">💪</div><div class="ob-opt-sm">${t('ob_goal_hypertrophy')}</div></div>
        <div class="ob-opt" data-val="strength" onclick="obSelect('goal','strength')"><div class="ob-opt-big">🏋</div><div class="ob-opt-sm">${t('ob_goal_strength')}</div></div>
        <div class="ob-opt" data-val="fat_loss" onclick="obSelect('goal','fat_loss')"><div class="ob-opt-big">🔥</div><div class="ob-opt-sm">${t('ob_goal_fat_loss')}</div></div>
      </div>
    </div>

    <button class="btn-primary ob-start" id="ob-start-btn" onclick="obFinish()" disabled>
      ${t('ob_start')}
    </button>
    <div style="font-size:11px;color:#9090b0;margin-top:12px">${t('ob_change_later')}</div>
  </div>`;
}

const _obState={mode:null,freq:null,sex:null,goal:null};
function obSelectMode(mode){
  if(mode==='log'){
    saveProfile({...(getProfile()||{}),mode:'log'});
    _obState.mode=null;
    navigate('home');
    return;
  }
  _obState.mode='program';
  render();
}
function obSelect(key,val){
  _obState[key]=val;
  // Update UI
  const containerId=key==='freq'?'ob-freq':key==='sex'?'ob-sex':'ob-goal';
  const container=document.getElementById(containerId);
  if(container){
    container.querySelectorAll('.ob-opt').forEach(el=>{
      el.classList.toggle('selected',el.getAttribute('data-val')==String(val));
    });
  }
  // Enable start button if all three selected
  const btn=document.getElementById('ob-start-btn');
  if(btn)btn.disabled=!(_obState.freq&&_obState.sex&&_obState.goal);
}
function obFinish(){
  if(!_obState.freq||!_obState.sex||!_obState.goal)return;
  saveProfile({freq:_obState.freq,sex:_obState.sex,mode:'program'});
  _obState.mode=null;
  setWupGoal(_obState.goal);
  reloadBlocks();
  ls.set(SK.blockIdx,0);
  A.blockIdx=0;
  A.previewBlockIdx=0;
  A.activeDayId=getNextDayId();
  navigate("home");
}
// Switch profile mode without touching program/history data (settings).
function switchToLogMode(){
  saveProfile({...(getProfile()||{}),mode:'log'});
  navigate('home');
}
function switchToProgramMode(){
  const p=getProfile()||{};
  if(p.freq&&p.sex){
    saveProfile({...p,mode:'program'});
    if(!BLOCKS.length)reloadBlocks();
    navigate('home');
  }else{
    _obState.mode='program';
    navigate('onboarding');
  }
}
function resetProfile(){
  if(!confirm(t('confirm_reset_profile')))return;
  localStorage.removeItem("il_profile");
  localStorage.removeItem(SK.blockIdx);
  ls.set(SK.nextDay,"A");
  ls.set(SK.history,[]);
  A.history=[];
  BLOCKS=[];
  navigate("onboarding");
}

function viewSettings(){
  const s=getSettings();
  const rest=s.restSeconds!==undefined?s.restSeconds:90;
  const restEnabled=rest>0;
  const profile=getProfile();
  const restOptions=[30,45,60,90,120,150,180];

  const restBtns=restOptions.map(sec=>{
    const active=sec===rest;
    const label=sec<60?`${sec}s`:`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
    return`<button class="ob-opt${active?' selected':''}" style="min-width:52px;flex:0 0 auto;padding:10px 6px"
      onclick="setRestTimer(${sec})">${label}</button>`;
  }).join('');

  const lang=getLang();
  const langBtns=`
    <button class="ob-opt${lang==='en'?' selected':''}" style="min-width:80px;flex:0 0 auto;padding:10px 6px" onclick="setLang('en')">English</button>
    <button class="ob-opt${lang==='fi'?' selected':''}" style="min-width:80px;flex:0 0 auto;padding:10px 6px" onclick="setLang('fi')">Suomi</button>`;

  const mode=getMode();
  const modeBtns=`
    <button class="ob-opt${mode==='program'?' selected':''}" style="min-width:120px;flex:0 0 auto;padding:10px 6px" onclick="switchToProgramMode()">📋 ${t('ob_mode_program')}</button>
    <button class="ob-opt${mode==='log'?' selected':''}" style="min-width:120px;flex:0 0 auto;padding:10px 6px" onclick="switchToLogMode()">✏️ ${t('ob_mode_log')}</button>`;

  const howToUse=`
    <div class="card" style="margin-top:16px">
      <div style="font-weight:700;font-size:15px;margin-bottom:10px">${t('settings_how_to')}</div>
      <div style="font-size:13px;color:#9090b0;line-height:1.7">
        <strong style="color:#f2f0ea">${t('settings_how_1')}</strong> ${t('settings_how_1b')}<br><br>
        <strong style="color:#f2f0ea">${t('settings_how_2')}</strong> ${t('settings_how_2b')}<br><br>
        <strong style="color:#f2f0ea">${t('settings_how_3')}</strong> ${t('settings_how_3b')}<br><br>
        <strong style="color:#f2f0ea">${t('settings_how_4')}</strong> ${t('settings_how_4b')}<br><br>
        <strong style="color:#f2f0ea">${t('settings_how_5')}</strong> ${t('settings_how_5b')}<br><br>
        <strong style="color:#f2f0ea">${t('settings_how_6')}</strong> ${t('settings_how_6b')}<br><br>
        <strong style="color:#f2f0ea">${t('settings_how_7')}</strong> ${t('settings_how_7b')}
      </div>
    </div>`;

  return`
  <div class="hdr"><div class="logo">RAUTALOKI</div></div>
  <div class="page">
    <div class="h2">${t('settings_title')}</div>

    <div class="sec-title">${t('settings_language')} / Kieli</div>
    <div class="card">
      <div style="display:flex;gap:6px;flex-wrap:wrap">${langBtns}</div>
    </div>

    <div class="sec-title" style="margin-top:20px">${t('settings_mode')}</div>
    <div class="card">
      <div style="display:flex;gap:6px;flex-wrap:wrap">${modeBtns}</div>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:20px">
      <div class="sec-title" style="margin:0">${t('settings_rest')}</div>
      <label class="toggle"><input type="checkbox" ${restEnabled?'checked':''} onchange="toggleRestTimer(this.checked)"><span class="slider"></span></label>
    </div>
    <div class="card" ${restEnabled?'':`style="opacity:0.4;pointer-events:none"`}>
      <div style="font-size:13px;color:#9090b0;margin-bottom:10px">${t('settings_rest_desc')}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${restBtns}</div>
    </div>

    ${mode==='program'?`<div class="sec-title" style="margin-top:20px">${t('settings_setup')}</div>
    <div class="card" style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:14px;font-weight:700">${profile?profile.freq:'3'}× ${t('settings_per_week')} · ${profile&&profile.sex==='female'?t('settings_female'):t('settings_male')}</div>
        <div style="font-size:12px;color:#9090b0;margin-top:2px">${profile&&profile.freq<=3?t('settings_full_body'):t('settings_split')} ${t('settings_program')}</div>
      </div>
      <button class="btn-tiny" style="color:#d4a846;border-color:#d4a846" onclick="resetProfile()">${t('settings_change')}</button>
    </div>`:''}

    <div class="sec-title" style="margin-top:20px">${t('settings_progression_title')}</div>
    <div class="card">
      <div style="font-size:13px;color:#9090b0;margin-bottom:10px">${t('settings_progression_desc')}</div>
      <div style="display:flex;align-items:center;gap:12px">
        <label style="font-size:13px;color:#f2f0ea;flex:1">${t('settings_progression_pct')}</label>
        <input type="number" min="0.5" max="20" step="0.5"
          style="width:70px;background:#0a0a18;border:1px solid #333;border-radius:8px;color:#d4a846;padding:8px;font-size:15px;font-weight:700;text-align:center;font-family:inherit"
          value="${getProgressionPct()}"
          onchange="setProgressionPct(this.value)">
      </div>
    </div>

    <div class="sec-title" style="margin-top:20px">${t('wup_goal_title')}</div>
    <div class="card">
      <div style="font-size:13px;color:#9090b0;margin-bottom:10px">${t('wup_goal_desc')}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${['hypertrophy','strength','fat_loss'].map(g=>{const active=getWupState().goal===g;return`<button class="ob-opt${active?' selected':''}" style="min-width:90px;flex:1;padding:10px 6px" onclick="setWupGoal('${g}');render()"><div style="font-size:20px">${g==='hypertrophy'?'💪':g==='strength'?'🏋':'🔥'}</div><div style="font-size:11px;margin-top:2px">${t('goal_'+g)}</div></button>`;}).join('')}
      </div>
      <div style="font-size:11px;color:#9090b0;margin-top:10px">${t('wup_current_week')} ${getWupState().week}/4</div>
    </div>

    ${howToUse}

    <div class="sec-title" style="margin-top:20px">${t('settings_export_import')}</div>
    <div class="card">
      <button class="btn-ghost" style="margin-bottom:8px;color:#d4a846;border-color:#d4a84644" onclick="exportJSON()">${t('backup_export')}</button>
      <button class="btn-ghost" style="margin-bottom:8px;color:#9090b0;border-color:#1c1c2e" onclick="importJSON()">${t('backup_import')}</button>
      <div style="font-size:11px;color:#9090b0;margin-bottom:14px">${t('backup_desc')}</div>
      <button class="btn-ghost" style="margin-bottom:8px;color:#d4a846;border-color:#d4a84644" onclick="exportCSV()">${t('settings_export')}</button>
      <button class="btn-ghost" style="color:#9090b0;border-color:#1c1c2e" onclick="importCSV()">${t('settings_import')}</button>
    </div>

    <div class="sec-title" style="margin-top:20px">${t('settings_data')}</div>
    <div class="card">
      <button class="btn-ghost" style="color:#ff4455;border-color:#ff445533;margin-bottom:8px" onclick="clearAllData()">${t('settings_reset')}</button>
      <div style="font-size:11px;color:#9090b0">${t('settings_reset_warn')}</div>
    </div>
  </div>
  ${navHTML("settings")}`;
}

function setProgressionPct(pct){
  const v=parseFloat(pct);
  if(!isNaN(v)&&v>=0.5&&v<=20){saveSetting('progressionPct',v);render();}
}
function setRestTimer(sec){
  saveSetting('restSeconds',sec);
  render();
}
function toggleRestTimer(on){
  if(on){
    const s=getSettings();
    const prev=s._lastRestSeconds||90;
    saveSetting('restSeconds',prev);
  }else{
    const s=getSettings();
    if(s.restSeconds>0)saveSetting('_lastRestSeconds',s.restSeconds);
    saveSetting('restSeconds',0);
  }
  render();
}

function deleteSession(idx){
  if(!confirm(t('history_delete_confirm')))return;
  A.history.splice(idx,1);
  ls.set(SK.history,A.history);
  A._openSessions.clear();
  A._openHistEx.clear();
  render();
}
function exportCSV(){
  const rows=[['Date','Day','Block','Exercise','Set','Reps','Weight(kg)','Duration(min)','Partial','Notes']];
  A.history.forEach(s=>{
    (s.exercises||[]).forEach(ex=>{
      (ex.sets||[]).forEach((st,si)=>{
        rows.push([s.date,s.dayLabel||s.dayId,s.blockId||'',ex.name||ex.libId,si+1,st.reps,st.weight,s.duration,s.partial?'yes':'',si===0?s.notes||'':'']);
      });
    });
  });
  const csv=rows.map(r=>r.map(c=>`"${String(c??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`rautaloki_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function importCSV(){
  const input=document.createElement('input');
  input.type='file';input.accept='.csv';
  input.onchange=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const lines=ev.target.result.split('\n').filter(l=>l.trim());
        if(lines.length<2)throw 0;
        const hdr=lines[0];
        const sessions={};
        for(let i=1;i<lines.length;i++){
          const cols=[];
          let m,re=/(".*?"|[^,]*)(,|$)/g;
          while((m=re.exec(lines[i]))!==null){cols.push(m[1]);if(m[2]==='')break;}
          const clean=cols.map(c=>c.replace(/^"|"$/g,'').replace(/""/g,'"'));
          const [date,day,block,exName,setNum,reps,weight,duration,partial,notes]=clean;
          const key=date+'|'+day+'|'+block;
          if(!sessions[key])sessions[key]={id:Date.now()+i,date,dayId:day,dayLabel:day,blockId:block,blockLabel:block,
            duration:parseInt(duration)||0,partial:partial==='yes',notes:notes||'',exercises:{}};
          if(!sessions[key].exercises[exName])sessions[key].exercises[exName]={id:exName,libId:exName,name:exName,muscle:'',sets:[]};
          sessions[key].exercises[exName].sets.push({reps:reps||'',weight:weight||'',done:true});
        }
        const imported=Object.values(sessions).map(s=>({...s,exercises:Object.values(s.exercises)}));
        A.history=[...A.history,...imported];
        ls.set(SK.history,A.history);
        alert(`${t('settings_import_done')} ${imported.length} ${t('settings_import_sessions')}`);
        render();
      }catch(err){alert(t('settings_import_error'));}
    };
    reader.readAsText(file);
  };
  input.click();
}
// Full JSON backup: every il_* key as raw localStorage strings.
function exportJSON(){
  const storage={};
  const keys=[...new Set([...Object.values(SK),'il_profile','il_settings'])];
  keys.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)storage[k]=v;});
  const blob=new Blob([JSON.stringify({app:'rautaloki',version:1,exportedAt:new Date().toISOString(),storage},null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`rautaloki_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function importJSON(){
  const input=document.createElement('input');
  input.type='file';input.accept='.json,application/json';
  input.onchange=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(!data||data.app!=='rautaloki'||typeof data.storage!=='object')throw 0;
        if(!confirm(t('backup_confirm')))return;
        Object.entries(data.storage).forEach(([k,v])=>{
          if(k.startsWith('il_')&&typeof v==='string')localStorage.setItem(k,v);
        });
        location.reload();
      }catch(err){alert(t('backup_error'));}
    };
    reader.readAsText(file);
  };
  input.click();
}

function clearAllData(){
  if(!confirm(t('confirm_clear_1')))return;
  if(!confirm(t('confirm_clear_2')))return;
  localStorage.removeItem(SK.weights);
  localStorage.removeItem(SK.history);
  localStorage.removeItem(SK.nextDay);
  localStorage.removeItem(SK.blockStart);
  localStorage.removeItem(SK.blockIdx);
  localStorage.removeItem(SK.customWorkouts);
  localStorage.removeItem(SK.wupGoal);
  localStorage.removeItem(SK.wupWeek);
  localStorage.removeItem(SK.wupAnchor);
  localStorage.removeItem(SK.failStreaks);
  localStorage.removeItem(SK.activeSession);
  localStorage.removeItem(SK.bodyweight);
  localStorage.removeItem("il_settings");
  localStorage.removeItem("il_profile");
  A.history=[];
  BLOCKS=[];
  navigate("onboarding");
}

function navHTML(active){
  const items=[
    {id:"home",icon:"home",labelKey:"nav_home"},
    {id:"history",icon:"list",labelKey:"nav_log"},
    {id:"program",icon:"calendar",labelKey:"nav_program"},
    {id:"settings",icon:"sliders",labelKey:"nav_settings"},
  ].filter(it=>it.id!=='program'||getMode()!=='log');
  return`<nav class="nav">${items.map(it=>`
    <button class="nav-btn${active===it.id?' active':''}" onclick="navigate('${it.id}')">
      ${icon(it.icon,20)}<span>${t(it.labelKey)}</span>
    </button>`).join('')}</nav>`;
}

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION & RENDER
// ═══════════════════════════════════════════════════════════════════
function navigate(view){
  A.view=view;
  render();
  window.scrollTo(0,0);
}

function setPreviewBlock(idx){
  A.previewBlockIdx=idx;
  render();
}

function cancelWorkout(){
  const done=doneSets();
  if(done>0){
    quitWithoutCompleting();
  }else{
    if(!confirm(t('workout_cancel')))return;
    clearActiveSession();
    releaseWakeLock();
    stopElapsed();
    clearInterval(A._restInterval);A._restEndTime=null;
    A.restTimer=null;
    A.sessionStart=null;
    A.isFreeWorkout=false;
    A.isLogWorkout=false;
    navigate("home");
  }
}

const _quitLines={
  en:[
    "Are you sure? The weights won't lift themselves.",
    "Quitting? Your muscles just filed a complaint.",
    "Leaving already? Even the dumbbells are disappointed.",
    "Really? You were doing so well\u2026",
    "Your future self just shed a single tear.",
    "The iron remembers. It always remembers.",
  ],
  fi:[
    "Oletko varma? Painot eivät nosta itseään.",
    "Lopetat? Lihaksesi jättivät juuri valituksen.",
    "Lähdetkö jo? Käsipainotkin ovat pettyneitä.",
    "Oikeasti? Meni niin hyvin\u2026",
    "Tuleva sinäsi vuodatti juuri kyyneleen.",
    "Rauta muistaa. Se muistaa aina.",
  ]
};
function quitWithoutCompleting(){
  const lines=_quitLines[getLang()]||_quitLines.en;
  const line=lines[Math.floor(Math.random()*lines.length)];
  const modal=document.createElement('div');
  modal.className='modal-overlay';
  modal.id='quit-modal';
  modal.innerHTML=`
    <div class="modal-sheet" style="padding:28px 24px 36px;text-align:center">
      <div style="font-size:48px;margin-bottom:12px">🏳️</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:900;color:#f2f0ea;margin-bottom:8px">${t('quit_title')}</div>
      <div style="font-size:14px;color:#9090b0;margin-bottom:24px;line-height:1.5">${esc(line)}</div>
      <div style="font-size:12px;color:#9090b0;margin-bottom:20px">${t('quit_save_info')}</div>
      <button class="btn-primary" style="background:#ff4455;margin-bottom:10px" onclick="confirmQuit()">${t('quit_confirm')}</button>
      <button class="btn-ghost" onclick="closeQuit()">${t('quit_keep')}</button>
    </div>`;
  document.body.appendChild(modal);
}
function closeQuit(){
  const m=document.getElementById('quit-modal');
  if(m)m.remove();
}
function confirmQuit(){
  closeQuit();
  // Save partial session
  const isFree=A.isFreeWorkout;
  const isLog=A.isLogWorkout;
  const block=(!isFree&&!isLog)?BLOCKS[A.blockIdx]:null;
  const day=block?block.days.find(d=>d.id===A.activeDayId):null;
  const session={
    id:Date.now(),
    date:new Date().toISOString(),
    blockId:isFree?"free":isLog?"log":block.id,blockLabel:isFree?"Free":isLog?"Log":block.label,
    dayId:isFree?"free":isLog?"log":A.activeDayId,dayLabel:isFree?t('free_workout_label'):isLog?t('log_workout_label'):day?day.label:'',
    duration:Math.round((Date.now()-A.sessionStart)/60000),
    partial:true,
    exercises:A.sessionExercises.map(ex=>({
      id:ex.id,libId:ex.libId,name:ex.name,muscle:ex.muscle,
      sets:(A.sessionSets[ex.id]||[]).filter(s=>s.done).map(s=>({reps:s.reps,weight:s.weight,done:s.done}))
    })).filter(ex=>ex.sets.length>0)
  };
  if(session.exercises.length>0){
    A.history=[...A.history,session];
    ls.set(SK.history,A.history);
  }
  clearActiveSession();
  releaseWakeLock();
  stopElapsed();
  clearInterval(A._restInterval);A._restEndTime=null;
  A.restTimer=null;
  A.sessionStart=null;
  A.isFreeWorkout=false;
  A.isLogWorkout=false;
  navigate("home");
}

function viewFreeBuilder(){
  const muscles=["All",...Object.keys(LIBRARY)];
  const pillsHTML=muscles.map(m=>`<button class="free-pill${A.freeFilter===m?' active':''}" onclick="setFreeFilter('${m}')">${m==='All'?t('free_all'):t('muscle_'+m)}</button>`).join('');
  const filtered=A.freeFilter==="All"
    ?Object.entries(LIBRARY).flatMap(([muscle,exs])=>exs.map(e=>({...e,muscle})))
    :(LIBRARY[A.freeFilter]||[]).map(e=>({...e,muscle:A.freeFilter}));
  const listHTML=filtered.map(e=>{
    const sel=A.freeExerciseIds.includes(e.id);
    return`<div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;${sel?'background:#1a3a1a;border:1px solid #2d6b2d;':''}" onclick="toggleFreeExercise('${e.id}')">
      <div>
        <div style="font-weight:600;font-size:14px">${esc(t(e.id))}</div>
        <div style="font-size:11px;color:#9090b0">${e.sets} × ${e.repRange[0]}–${e.repRange[1]} · ${esc(t('muscle_'+e.muscle))}</div>
      </div>
      <span style="font-size:${sel?18:22}px;color:${sel?'#4caf50':'#d4a846'}">${sel?'✓':'＋'}</span>
    </div>`;
  }).join('');
  const selectedHTML=A.freeExerciseIds.length>0?`
    <div style="background:#1a1a2e;border-radius:10px;padding:12px;margin-bottom:14px;border:1px solid #333;">
      <div style="color:#d4a846;font-size:12px;font-weight:700;margin-bottom:8px">${t('free_selected')} (${A.freeExerciseIds.length})</div>
      ${A.freeExerciseIds.map((id,i)=>{const b=_libFind(id);return`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><span style="font-size:13px">${i+1}. ${esc(b?t(b.id):id)}</span><span style="color:#888;font-size:18px;cursor:pointer;" onclick="event.stopPropagation();toggleFreeExercise('${id}')">✕</span></div>`;}).join('')}
    </div>`:'';
  return`
  <div class="hdr">
    <div style="display:flex;align-items:center;gap:10px">
      <button style="background:none;border:none;color:#9090b0;font-size:22px;cursor:pointer;padding:0" onclick="navigate('home')">←</button>
      <div class="logo" style="font-size:16px">${t('free_build_title')}</div>
    </div>
  </div>
  <div class="page">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">${pillsHTML}</div>
    ${listHTML}
    ${selectedHTML}
    <button class="btn-primary" ${A.freeExerciseIds.length===0?'disabled':''} onclick="startFreeWorkout(A.freeExerciseIds)">${t('free_start_btn')} (${A.freeExerciseIds.length})</button>
  </div>`;
}

function viewFreeComplete(){
  if(!A.completedSession)return viewHome();
  return`
  <div class="hdr"><div class="logo">RAUTALOKI</div></div>
  <div class="page">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:64px">🏋</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:900;color:#d4a846;margin-top:8px">${t('free_complete_title')}</div>
    </div>
    <div class="scard" style="margin-bottom:12px">
      <div style="font-size:14px;font-weight:700;margin-bottom:12px">${t('free_save_as_template')}</div>
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:10px">
        <input type="checkbox" id="free-save-cb" style="width:18px;height:18px" onchange="document.getElementById('free-name-row').style.display=this.checked?'block':'none'">
        <span style="font-size:14px">${t('free_save_yes')}</span>
      </label>
      <div id="free-name-row" style="display:none">
        <input id="free-name-inp" type="text" style="width:100%;box-sizing:border-box;background:#0a0a18;border:1px solid #333;border-radius:8px;color:#f2f0ea;padding:10px;font-size:14px;font-family:inherit" placeholder="${t('free_name_placeholder')}" value="">
      </div>
    </div>
    <div class="scard" style="margin-bottom:20px">
      <div style="font-size:14px;font-weight:700;margin-bottom:12px">${t('free_count_progress')}</div>
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
        <input type="checkbox" id="free-count-cb" style="width:18px;height:18px">
        <span style="font-size:14px">${t('free_count_yes')}</span>
      </label>
    </div>
    <button class="btn-primary" onclick="confirmFreeWorkout()">${t('free_continue')}</button>
  </div>`;
}
function confirmFreeWorkout(){
  const saveCb=document.getElementById('free-save-cb');
  const nameInp=document.getElementById('free-name-inp');
  const countCb=document.getElementById('free-count-cb');
  const wantsCount=countCb&&countCb.checked;
  const s=A.completedSession;
  if(s){
    // Assign blockId based on progression choice
    s.blockId=wantsCount?BLOCKS[A.blockIdx].id:"free";
    s.blockLabel=wantsCount?BLOCKS[A.blockIdx].label:"Free";
    A.history=[...A.history,s];
    ls.set(SK.history,A.history);
    A.sessionExercises.forEach(ex=>{
      const sets=A.sessionSets[ex.id]||[];
      const targetReps=ex.wupTargetReps||ex.repRange[1];
      const succeeded=sets.length>0&&sets.every(s=>parseInt(s.reps)>=targetReps);
      updateFailStreak(ex.libId||ex.id,succeeded);
    });
  }
  if(saveCb&&saveCb.checked&&s){
    const name=(nameInp&&nameInp.value.trim())||t('free_workout_label');
    saveCustomWorkout(name,s.exercises.map(e=>e.libId).filter(Boolean));
  }
  if(wantsCount){
    advanceDay(A.activeDayId);
    A.blockIdx=advanceBlockIfNeeded();
    A.previewBlockIdx=A.blockIdx;
    A.activeDayId=getNextDayId();
    maybeAdvanceWupWeek();
  }
  A.isFreeWorkout=false;
  navigate("complete");
}
function render(){
  const app=document.getElementById('app');
  if(!app)return;
  // Show onboarding if no profile
  if(!getProfile()&&A.view!=='onboarding'){A.view='onboarding';}
  let html='';
  if(A.view==='onboarding')html=viewOnboarding();
  else if(A.view==='home')html=viewHome();
  else if(A.view==='workout')html=viewWorkout();
  else if(A.view==='complete')html=viewComplete();
  else if(A.view==='history')html=viewHistory();
  else if(A.view==='program')html=viewProgram();
  else if(A.view==='settings')html=viewSettings();
  else if(A.view==='freeBuilder')html=viewFreeBuilder();
  else if(A.view==='freeComplete')html=viewFreeComplete();
  app.innerHTML=html;
  if(A.view==='history'&&A._hmSel)requestAnimationFrame(positionHmTip);
  // After render, bind kg inputs (oninput in HTML attr can't pass complex args)
  if(A.view==='workout'){
    A.sessionExercises.forEach(ex=>{
      (A.sessionSets[ex.id]||[]).forEach((_,idx)=>{
        const el=document.getElementById(`kg-inp-${ex.id}-${idx}`);
        if(el){
          const exId=ex.id;
          const i=idx;
          el.oninput=function(){updateKg(exId,i,this.value);};
        }
      });
    });
    // Re-attach rest bar state
    refreshRestBar();
  }
}

// ═══════════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════════
restoreSession(); // resume an in-progress workout if the app was killed mid-session
render();
if('serviceWorker'in navigator){navigator.serviceWorker.register('sw.js');}
