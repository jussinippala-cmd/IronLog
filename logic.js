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
  module.exports={roundToHalf,computeStartWeight,getWeekReps,est1RM,plateBreakdown};
}
