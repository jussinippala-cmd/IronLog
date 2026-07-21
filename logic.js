// ═══════════════════════════════════════════════════════════════════
// PURE LOGIC — no DOM, no localStorage. Shared by app.js and tests/.
// ═══════════════════════════════════════════════════════════════════
function roundToHalf(w){return Math.round(w/0.5)*0.5;}

// Starting weight for a session set, given last saved weight and progression state.
// Priority: deload week > fail-streak deload (-10%) > progression bump (+pct%) > last weight.
function computeStartWeight(lastWeight,{deload=false,failStreak=0,bump=false,pct=2.5}={}){
  if(!lastWeight)return"";
  if(deload)return String(roundToHalf(lastWeight*0.6));
  if(failStreak>=2)return String(roundToHalf(lastWeight*0.9));
  if(bump)return String(roundToHalf(lastWeight*(1+pct/100)));
  return String(lastWeight);
}

// Weekly undulating periodization: target reps for week 1-4 of the cycle.
function getWeekReps(repRange,weekInCycle,goal){
  const[lo,hi]=repRange;
  const tables={
    hypertrophy:[hi,hi+2,lo,Math.max(hi+5,15)],
    strength:[lo+2,lo+1,lo,hi],
    fat_loss:[hi,hi+3,hi+1,Math.max(hi+5,15)]
  };
  const tbl=tables[goal]||tables.hypertrophy;
  return Math.max(1,tbl[weekInCycle-1]||hi);
}

// Whether the rest-over alert should still fire, given how late it was noticed (ms).
// Overdue exceeds a few seconds only when the page was suspended (phone locked /
// app backgrounded) and just woke up — alert then too, but drop absurdly stale ones.
function shouldRestAlert(overdueMs){return overdueMs>=0&&overdueMs<600000;}

// ISO-8601 week number (1-53) of the given date. Anchors on the week's
// Thursday, which decides the ISO year — Monday-anchoring gets year
// boundaries wrong (e.g. Mon 2024-12-30 is week 1 of 2025).
function isoWeekNumber(date){
  const d=new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate()+3-((d.getDay()+6)%7));
  const week1=new Date(d.getFullYear(),0,4);
  return 1+Math.round(((d-week1)/86400000-3+((week1.getDay()+6)%7))/7);
}

// Horizontal position for a tooltip centered on `center`, clamped so a
// tip of width tipW stays `pad` px inside a container of width containerW.
function tipLeft(center,tipW,containerW,pad=4){
  return Math.max(pad,Math.min(center-tipW/2,containerW-tipW-pad));
}

// Autocomplete for log-mode exercise entry: the user's own past exercise
// names matching the query (case-insensitive substring), minus exclusions.
function matchExerciseNames(names,query,exclude=[]){
  const q=String(query||'').toLowerCase();
  const ex=new Set(exclude.map(n=>n.toLowerCase()));
  return names.filter(n=>!ex.has(n.toLowerCase())&&n.toLowerCase().includes(q));
}

// Grouping key for charts/PRs: library id when present, typed name otherwise.
function exerciseKey(ex){return ex.libId||ex.name||'';}

// Next value when tapping the rep-cycle button: counts down from hi, dips
// up to 2 reps below lo to show a "missed by N" state, then wraps to hi.
// Never surfaces reps below 1 — programmed ranges never have lo<3 so this
// never bit before, but log-mode's wide-open range can start at lo=1.
function nextCycleReps(current,lo,hi){
  const floor=Math.max(lo-2,1);
  if(current===null||Number.isNaN(current)||current<=floor)return hi;
  return current-1;
}

// Which item of a rotating list to show today — stable all day, changes
// tomorrow. Day-of-year mod list length, so it cycles predictably.
function dailyPhraseIndex(date,count){
  const start=new Date(date.getFullYear(),0,0);
  const dayOfYear=Math.floor((date-start)/86400000);
  return dayOfYear%count;
}

// Epley estimate
function est1RM(weight,reps){return Math.round(weight*(1+reps/30));}

// Plates per side for a barbell load. Returns null if total < bar.
function plateBreakdown(total,barWeight,plateSizes){
  const sizes=plateSizes||[25,20,15,10,5,2.5,1.25,0.5];
  const perSide=(total-barWeight)/2;
  if(perSide<0)return null;
  const plates=[];
  let rem=perSide;
  for(const p of sizes){
    while(rem>=p-1e-9){plates.push(p);rem=Math.round((rem-p)*100)/100;}
  }
  return{perSide,plates,remainder:rem};
}

if(typeof module!=='undefined'&&module.exports){
  module.exports={roundToHalf,computeStartWeight,getWeekReps,est1RM,plateBreakdown,shouldRestAlert,isoWeekNumber,tipLeft,matchExerciseNames,exerciseKey,nextCycleReps,dailyPhraseIndex};
}
