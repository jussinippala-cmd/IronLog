// ═══════════════════════════════════════════════════════════════════
// DATA — LIBRARY & BLOCKS
// ═══════════════════════════════════════════════════════════════════
const LIBRARY={
  Quads:[
    {id:"lib_squat",name:"Squat",sets:4,repRange:[6,10],cues:"Full depth, knees track toes, brace hard"},
    {id:"lib_hack_squat",name:"Hack Squat",sets:4,repRange:[8,12],cues:"Feet high on platform, full depth"},
    {id:"lib_leg_press",name:"Leg Press",sets:3,repRange:[10,15],cues:"Shoulder-width feet, don't lock out"},
    {id:"lib_leg_press_n",name:"Leg Press (narrow)",sets:3,repRange:[10,15],cues:"Narrow feet, emphasises outer quad"},
    {id:"lib_leg_ext",name:"Leg Extension",sets:3,repRange:[12,15],cues:"Full range, hard squeeze at top"},
    {id:"lib_split_squat",name:"Bulgarian Split Squat",sets:3,repRange:[8,12],cues:"Front foot forward, torso upright"},
    {id:"lib_lunge",name:"Walking Lunge",sets:3,repRange:[10,14],cues:"Long stride, knee tracks over toes"},
    {id:"lib_goblet_squat",name:"Goblet Squat",sets:3,repRange:[12,15],cues:"Elbows inside knees, chest tall"},
    {id:"lib_step_up",name:"Step-Up",sets:3,repRange:[10,12],cues:"Drive through heel of front foot"},
  ],
  Hamstrings:[
    {id:"lib_deadlift",name:"Deadlift",sets:4,repRange:[5,8],cues:"Lats tight, drive floor away"},
    {id:"lib_rdl",name:"Romanian Deadlift",sets:3,repRange:[8,12],cues:"Push hips back, feel the stretch"},
    {id:"lib_trap_dl",name:"Trap Bar Deadlift",sets:4,repRange:[6,10],cues:"Hips down to start, chest tall"},
    {id:"lib_sumo_dl",name:"Sumo Deadlift",sets:4,repRange:[5,8],cues:"Wide stance, toes out, drive knees out"},
    {id:"lib_leg_curl",name:"Lying Leg Curl",sets:3,repRange:[10,15],cues:"Full ROM, slow 3s eccentric"},
    {id:"lib_seated_curl",name:"Seated Leg Curl",sets:3,repRange:[10,15],cues:"Full stretch, pause at peak"},
    {id:"lib_nordic",name:"Nordic Curl",sets:3,repRange:[6,10],cues:"Slow eccentric, brace core"},
    {id:"lib_good_morning",name:"Good Morning",sets:3,repRange:[10,12],cues:"Soft knees, hinge at hips"},
  ],
  Glutes:[
    {id:"lib_hip_thrust",name:"Hip Thrust",sets:3,repRange:[10,15],cues:"Drive through heels, squeeze at top"},
    {id:"lib_glute_bridge",name:"Barbell Glute Bridge",sets:3,repRange:[12,15],cues:"Feet flat, drive hips to ceiling"},
    {id:"lib_cable_kickback",name:"Cable Kickback",sets:3,repRange:[12,15],cues:"Squeeze glute at top, control down"},
    {id:"lib_abduction",name:"Hip Abduction Machine",sets:3,repRange:[15,20],cues:"Full ROM, don't use momentum"},
  ],
  Calves:[
    {id:"lib_standing_calf",name:"Standing Calf Raise",sets:4,repRange:[12,15],cues:"Full stretch at bottom, pause at top"},
    {id:"lib_seated_calf",name:"Seated Calf Raise",sets:4,repRange:[12,15],cues:"Loaded stretch, pause at top"},
    {id:"lib_leg_press_calf",name:"Leg Press Calf Raise",sets:3,repRange:[15,20],cues:"Toes on edge, full ROM"},
  ],
  Chest:[
    {id:"lib_bench",name:"Bench Press",sets:4,repRange:[8,12],cues:"1s pause at chest, drive through heels"},
    {id:"lib_incline_db",name:"Incline DB Press",sets:3,repRange:[10,15],cues:"Elbows 45°, feel upper chest stretch"},
    {id:"lib_db_bench",name:"DB Bench Press",sets:4,repRange:[8,12],cues:"Greater ROM than barbell, stretch at bottom"},
    {id:"lib_cable_fly",name:"Cable Fly",sets:3,repRange:[12,15],cues:"Slight elbow bend, hard squeeze at center"},
    {id:"lib_pec_deck",name:"Pec Deck",sets:3,repRange:[12,15],cues:"Control the opening, squeeze at center"},
    {id:"lib_db_pullover",name:"DB Pullover",sets:3,repRange:[12,15],cues:"Feel rib cage expand, lats and chest stretch"},
    {id:"lib_dips",name:"Dips (chest focus)",sets:3,repRange:[8,12],cues:"Lean forward, elbows flared slightly"},
    {id:"lib_pushup_weighted",name:"Weighted Push-Up",sets:3,repRange:[10,15],cues:"Weight plate on back, full ROM"},
    {id:"lib_low_cable_fly",name:"Low-to-High Cable Fly",sets:3,repRange:[12,15],cues:"Pull upward arc, squeeze upper chest"},
  ],
  Back:[
    {id:"lib_cable_row",name:"Cable Row",sets:4,repRange:[8,12],cues:"Pull to lower chest, squeeze shoulder blades"},
    {id:"lib_db_row",name:"DB Row",sets:4,repRange:[8,12],cues:"Elbow close to body, full stretch"},
    {id:"lib_chest_row",name:"Chest-Supported Row",sets:4,repRange:[8,12],cues:"Chest on pad, pull elbows hard"},
    {id:"lib_lat_pull",name:"Lat Pulldown",sets:3,repRange:[10,15],cues:"Lean back slightly, pull to upper chest"},
    {id:"lib_pullup",name:"Pull-Up / Chin-Up",sets:3,repRange:[6,12],cues:"Dead hang start, chin over bar"},
    {id:"lib_sa_cable_row",name:"Single-Arm Cable Row",sets:4,repRange:[8,12],cues:"Full rotation, stretch then row to hip"},
    {id:"lib_pullover_cable",name:"Cable Straight-Arm Pullover",sets:3,repRange:[12,15],cues:"Slight elbow bend, feel lats at top"},
    {id:"lib_bb_row",name:"Barbell Row",sets:4,repRange:[6,10],cues:"Hinge 45°, pull to belly button"},
    {id:"lib_tbar_row",name:"T-Bar Row",sets:4,repRange:[8,12],cues:"Neutral grip, chest tall, squeeze"},
  ],
  Shoulders:[
    {id:"lib_ohp",name:"Overhead Press",sets:4,repRange:[6,10],cues:"Straight bar path, brace core"},
    {id:"lib_db_ohp",name:"DB Shoulder Press",sets:4,repRange:[8,12],cues:"Neutral grip, full lockout"},
    {id:"lib_lat_raise",name:"Lateral Raise",sets:3,repRange:[15,20],cues:"Lead with elbows, slight forward lean"},
    {id:"lib_cable_raise",name:"Cable Lateral Raise",sets:3,repRange:[15,20],cues:"Elbow leads, don't shrug"},
    {id:"lib_face_pull",name:"Face Pull",sets:3,repRange:[15,20],cues:"Pull to forehead, external rotate"},
    {id:"lib_rear_delt",name:"Rear Delt Fly",sets:3,repRange:[15,20],cues:"Lead with elbows, avoid traps"},
    {id:"lib_upright_row",name:"Upright Row",sets:3,repRange:[10,15],cues:"Wide grip, elbows high, cable preferred"},
    {id:"lib_arnold_press",name:"Arnold Press",sets:3,repRange:[10,12],cues:"Rotate palm out as you press"},
  ],
  Biceps:[
    {id:"lib_bb_curl",name:"Barbell Curl",sets:3,repRange:[10,15],cues:"No swinging, full ROM"},
    {id:"lib_hammer",name:"Hammer Curl",sets:3,repRange:[10,15],cues:"Neutral grip, no swinging"},
    {id:"lib_incline_curl",name:"Incline DB Curl",sets:3,repRange:[10,15],cues:"Arms behind torso for extra stretch"},
    {id:"lib_spider_curl",name:"Spider Curl",sets:3,repRange:[10,15],cues:"Chest on incline, elbows forward"},
    {id:"lib_cable_curl",name:"Cable Curl",sets:3,repRange:[12,15],cues:"Constant tension, squeeze at top"},
    {id:"lib_conc_curl",name:"Concentration Curl",sets:3,repRange:[12,15],cues:"Elbow on inner thigh, strict form"},
    {id:"lib_reverse_curl",name:"Reverse Curl",sets:3,repRange:[10,15],cues:"Overhand grip, targets brachialis"},
  ],
  Triceps:[
    {id:"lib_skull",name:"Skullcrusher",sets:3,repRange:[10,15],cues:"Upper arms vertical, full extension"},
    {id:"lib_pushdown",name:"Cable Pushdown",sets:3,repRange:[12,15],cues:"Elbows locked at sides, full extension"},
    {id:"lib_overhead_tri",name:"Overhead Tricep Extension",sets:3,repRange:[10,15],cues:"Elbows forward, stretch at bottom"},
    {id:"lib_dips_tri",name:"Tricep Dips",sets:3,repRange:[8,12],cues:"Upright torso, elbows close"},
    {id:"lib_kickback",name:"DB Kickback",sets:3,repRange:[12,15],cues:"Upper arm parallel to floor, full extension"},
    {id:"lib_close_bench",name:"Close-Grip Bench Press",sets:3,repRange:[8,12],cues:"Hands shoulder-width, elbows tight"},
  ],
};

// ═══════════════════════════════════════════════════════════════════
// YOUTUBE — tutorial video links keyed by libId
// ═══════════════════════════════════════════════════════════════════
const YT_SHORTS="EgIYAQ%3D%3D";
const YTS=q=>`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=${YT_SHORTS}`;
// Search queries are derived from exercise names; overrides only where the name
// isn't a good search term on its own.
const YT_QUERY_OVERRIDES={
  lib_leg_press_n:"narrow leg press",
  lib_step_up:"step up exercise",
  lib_good_morning:"good morning exercise",
  lib_dips:"chest dips",
  lib_dips_tri:"tricep dips",
  lib_pullup:"pull up",
  lib_skull:"skull crusher",
};
const YOUTUBE={};
Object.values(LIBRARY).flat().forEach(ex=>{
  const q=YT_QUERY_OVERRIDES[ex.id]||ex.name.toLowerCase().replace(/[()\/·]/g,' ').replace(/\s+/g,' ').trim();
  YOUTUBE[ex.id]=YTS(q+" form tutorial");
});

// I18N — Language / Kieli
// ═══════════════════════════════════════════════════════════════════
function getLang(){return getSettings().lang||'en';}
function setLang(lang){saveSetting('lang',lang);document.documentElement.lang=lang;render();}
function t(key){return(T[getLang()]||T.en)[key]||T.en[key]||key;}

const T={
en:{
// Muscle groups
muscle_Quads:"Quads",muscle_Hamstrings:"Hamstrings",muscle_Glutes:"Glutes",muscle_Calves:"Calves",
muscle_Chest:"Chest",muscle_Back:"Back",muscle_Shoulders:"Shoulders",muscle_Biceps:"Biceps",muscle_Triceps:"Triceps",
// Block themes
"theme_Barbell Compounds":"Barbell Compounds","theme_Dumbbell & Machine":"Dumbbell & Machine",
"theme_Strength Focus":"Strength Focus","theme_Volume & Isolation":"Volume & Isolation",
"theme_Power & Strength":"Power & Strength","theme_Isolation & Volume":"Isolation & Volume",
"theme_Cable & Unilateral":"Cable & Unilateral","theme_Hybrid Strength–Hypertrophy":"Hybrid Strength–Hypertrophy",
"theme_Barbell Foundation":"Barbell Foundation","theme_Dumbbell & Cable":"Dumbbell & Cable",
"theme_Strength Phase":"Strength Phase","theme_Volume & Pump":"Volume & Pump",
// Day labels
"day_Full Body A":"Full Body A","day_Full Body B":"Full Body B","day_Full Body C":"Full Body C",
"day_Upper A":"Upper A","day_Upper B":"Upper B","day_Lower A":"Lower A","day_Lower B":"Lower B",
"day_Push":"Push","day_Pull":"Pull","day_Legs":"Legs","day_Upper":"Upper","day_Lower":"Lower",
// Day focuses
"focus_Squat · Push · Pull · Arms":"Squat · Push · Pull · Arms",
"focus_Hinge · Press · Row · Glutes":"Hinge · Press · Row · Glutes",
"focus_Machine Legs · DB Push · Pull":"Machine Legs · DB Push · Pull",
"focus_Hinge · Shoulders · Back · Iso":"Hinge · Shoulders · Back · Iso",
"focus_Heavy Squat · Bench · Row":"Heavy Squat · Bench · Row",
"focus_Heavy Hinge · OHP · Pull":"Heavy Hinge · OHP · Pull",
"focus_High-Rep Legs · Push · Pull":"High-Rep Legs · Push · Pull",
"focus_High-Rep Hinge · Shoulders · Arms":"High-Rep Hinge · Shoulders · Arms",
"focus_Squat · Push · Pull":"Squat · Push · Pull",
"focus_Hinge · Vertical Push · Triceps":"Hinge · Vertical Push · Triceps",
"focus_Unilateral · Arms · Glutes":"Unilateral · Arms · Glutes",
"focus_Heavy Squat · Push · Pull":"Heavy Squat · Push · Pull",
"focus_Heavy Hinge · OHP · Row":"Heavy Hinge · OHP · Row",
"focus_Unilateral · Strength · Glutes":"Unilateral · Strength · Glutes",
"focus_High-Rep Squat · Push · Pull":"High-Rep Squat · Push · Pull",
"focus_Unilateral · Pump · Glutes":"Unilateral · Pump · Glutes",
"focus_Unilateral Squat · Cable Push/Pull":"Unilateral Squat · Cable Push/Pull",
"focus_Hinge · Press · Row · Triceps":"Hinge · Press · Row · Triceps",
"focus_Unilateral · Pump · Calves":"Unilateral · Pump · Calves",
"focus_Hinge · OHP · Row · Triceps":"Hinge · OHP · Row · Triceps",
"focus_Horizontal Push/Pull":"Horizontal Push/Pull",
"focus_Squat · Glutes · Hamstrings":"Squat · Glutes · Hamstrings",
"focus_Vertical Push/Pull · Arms":"Vertical Push/Pull · Arms",
"focus_Hinge · Unilateral · Calves":"Hinge · Unilateral · Calves",
"focus_DB Press · Machine Row":"DB Press · Machine Row",
"focus_Machine Squat · Glutes":"Machine Squat · Glutes",
"focus_DB Shoulders · Cable Work":"DB Shoulders · Cable Work",
"focus_Hinge · Unilateral":"Hinge · Unilateral",
"focus_Heavy Bench · Row":"Heavy Bench · Row",
"focus_Heavy Squat · Glutes":"Heavy Squat · Glutes",
"focus_Heavy OHP · Pull":"Heavy OHP · Pull",
"focus_Heavy Hinge · Unilateral":"Heavy Hinge · Unilateral",
"focus_Push Volume":"Push Volume",
"focus_Quad & Glute Volume":"Quad & Glute Volume",
"focus_Pull Volume · Arms":"Pull Volume · Arms",
"focus_Hinge Volume · Unilateral":"Hinge Volume · Unilateral",
"focus_Chest · Shoulders · Triceps":"Chest · Shoulders · Triceps",
"focus_Back · Biceps · Rear Delts":"Back · Biceps · Rear Delts",
"focus_Squat · Hinge · Glutes · Calves":"Squat · Hinge · Glutes · Calves",
"focus_Compound Push/Pull · Arms":"Compound Push/Pull · Arms",
"focus_DB Press · Flies · Delts":"DB Press · Flies · Delts",
"focus_Rows · Pulldowns · Curls":"Rows · Pulldowns · Curls",
"focus_Machine Squat · Glutes · Hams":"Machine Squat · Glutes · Hams",
"focus_Press · Row · Accessories":"Press · Row · Accessories",
"focus_Hinge · Unilateral · Glutes":"Hinge · Unilateral · Glutes",
"focus_Heavy Press · Shoulders":"Heavy Press · Shoulders",
"focus_Heavy Row · Pull-Up":"Heavy Row · Pull-Up",
"focus_Heavy Squat · Deadlift":"Heavy Squat · Deadlift",
"focus_Strength Accessories":"Strength Accessories",
"focus_High-Rep Chest · Delts":"High-Rep Chest · Delts",
"focus_High-Rep Rows · Curls":"High-Rep Rows · Curls",
"focus_High-Rep Quads · Glutes":"High-Rep Quads · Glutes",
"focus_Pump Push/Pull · Arms":"Pump Push/Pull · Arms",
"focus_Volume Hinge · Unilateral":"Volume Hinge · Unilateral",
// Navigation
nav_home:"Home",nav_log:"Log",nav_program:"Program",nav_settings:"Settings",
// Home view
home_ready:"Ready to<br>build?",home_days_week:"days/week.",home_full_body:"Full body.",home_split:"Split training.",
home_blocks_variation:"blocks of variation.",stat_sessions:"Sessions",stat_this_week:"This week",stat_to_swap:"To swap",
home_up_next:"UP NEXT",home_day:"DAY",home_start:"START WORKOUT →",
home_block_swap_in:"BLOCK SWAP IN",home_session:"SESSION",home_sessions:"SESSIONS",
home_coming_up:"Coming up:",home_sessions_left:"sessions left",home_session_left:"session left",
home_next:"NEXT",home_all_days:"All days —",
// Workout view
workout_sets_done:"SETS DONE",workout_finish:"✓ FINISH WORKOUT",workout_complete_all:"Complete all sets to finish",
workout_quit:"Quit without completing",workout_rest:"REST",workout_skip:"SKIP",workout_load:"↑ LOAD",
workout_swap:"⇄ Swap",workout_sets:"sets",workout_reps:"reps",workout_last:"Last:",workout_try:"→ try",
workout_col_reps:"Reps ↕",workout_col_set:"#",workout_col_kg:"kg",
workout_hint_edit:"Double-tap ✓ on a done set to edit it",workout_swap_title:"Swap Exercise",
workout_muscle:"Muscle:",workout_current:"current",workout_in_use:"in use",workout_cancel:"Cancel workout?",
// Complete view
complete_done:"DONE!",complete_min:"min",stat_duration:"Duration",stat_exercises:"Exercises",
stat_volume:"kg Vol.",complete_switch:"Block Switch!",complete_now_starting:"Now starting",
complete_up_next:"Up next",complete_back:"← BACK TO HOME",
// History view
history_title:"History",history_empty:"No sessions yet. Start today! 💪",
history_ex:"ex",history_vol:"vol.",history_partial:"partial",
// Program view
program_title:"The Program",program_full_body:"FULL BODY",program_split:"SPLIT",
program_per_week:"×/WEEK",program_blocks:"BLOCKS",
program_desc_1:"training blocks that auto-swap every",program_desc_2:"sessions.",
program_desc_swap:"Tap ⇄ Swap during any workout to replace an unavailable exercise.",
program_sessions_until:"sessions until",program_session_until:"session until",program_active:"Active now",
// Settings view
settings_title:"Settings",settings_language:"Language",settings_rest:"Rest Timer",
settings_rest_desc:"Time between sets after marking done",settings_rest_off:"Off",settings_setup:"Your Setup",
settings_per_week:"per week",settings_female:"Female",settings_male:"Male",
settings_full_body:"Full Body",settings_split:"Split",settings_program:"program",
settings_change:"CHANGE",settings_how_to:"How to Use",settings_data:"Data",
settings_reset:"Reset All Data",settings_reset_warn:"Clears all history, weights, and settings. Cannot be undone.",
settings_how_1:"Tap a rep number",settings_how_1b:"to cycle through the rep range (starts at top, counts down).",
settings_how_2:"Enter weight in kg",settings_how_2b:"— filling one set auto-fills forward to all undone sets.",
settings_how_3:"Tap ✓",settings_how_3b:"to mark a set done. A rest timer starts automatically.",
settings_how_4:"Double-tap ✓",settings_how_4b:"on a completed set to edit it.",
settings_how_5:"⇄ Swap",settings_how_5b:"lets you swap any exercise for another in the same muscle group.",
settings_how_6:"↑ LOAD",settings_how_6b:"means you hit top reps last time — try adding weight.",
settings_progression_title:"Auto-Progression",settings_progression_desc:"Weight increase after hitting all reps. Failure twice in a row triggers a 10% deload.",settings_progression_pct:"Increment (%)",
settings_how_7:"Quit without completing",settings_how_7b:"saves your done sets to history.",
history_delete:"Delete",history_delete_confirm:"Delete this session from history?",
chart_title:"Progress",chart_no_data:"Not enough data yet",
settings_export:"Export History (CSV)",settings_import:"Import History (CSV)",settings_import_done:"Imported",settings_import_sessions:"sessions",settings_import_error:"Invalid CSV file",settings_export_import:"Export / Import",
// Onboarding view
ob_tagline:"Your gym. Your rules.",ob_subtitle:"Set up your training plan in 2 taps.",
ob_freq:"How many days per week?",ob_iam:"I am",ob_full_body:"Full Body",ob_upper_lower:"Upper/Lower",
ob_ppl:"PPL + U/L",ob_male:"Male",ob_female:"Female",ob_start:"LET'S GO →",
ob_change_later:"You can change this anytime in Settings.",
// Quit modal
quit_title:"Quit workout?",quit_save_info:"Completed sets will be saved to your history.",
quit_confirm:"YEAH, I'M OUT",quit_keep:"KEEP GOING 💪",
// Confirm dialogs
confirm_reset_profile:"Reset your profile? Your workout history and weights will be kept, but the program will be regenerated.",
confirm_clear_1:"This will permanently delete ALL your workout history, saved weights, and settings. Are you sure?",
confirm_clear_2:"Really? This cannot be undone.",
// Block label
block_label:"Block",
// Free workout builder
free_build_title:"Build Workout",free_all:"All",free_selected:"SELECTED",
free_start_btn:"▶ Start Workout",free_workout_label:"Free Workout",
free_open_builder:"✏️ Build your own workout",free_my_workouts:"My Workouts",
free_exercises:"exercises",free_delete_confirm:"Delete",
free_complete_title:"Workout done!",free_save_as_template:"Save this workout as a template?",
free_save_yes:"Yes, save",free_name_placeholder:"Workout name",
free_count_progress:"Count this toward program progress?",free_count_yes:"Yes, count toward progress",
free_continue:"Continue →",
reps_prev_low:"↓ prev.",
yt_aria:"Watch tutorial",
// WUP / Goal
wup_week:"Week",wup_deload_week:"Deload Week",wup_deload_label:"Deload",
wup_deload_desc:"Light session — 60% weight, easy reps",
wup_goal_label:"Goal",wup_goal_title:"Training Goal",
wup_goal_desc:"Sets your weekly rep pattern. Changing resets the cycle to Week 1.",
wup_current_week:"Cycle week:",
goal_hypertrophy:"Hypertrophy",goal_strength:"Strength",goal_fat_loss:"Fat Loss",
ob_goal:"Training goal?",ob_goal_hypertrophy:"Build muscle",ob_goal_strength:"Get strong",ob_goal_fat_loss:"Lose fat",
weekly_volume_title:"This Week",weekly_sets_label:"sets",weekly_target:"Target: 10+ sets / muscle group",
notes_placeholder:"How did it feel? Any notes...",notes_label:"Session notes",
pr_title:"Personal Records",pr_est_1rm:"est. 1RM",pr_new:"New PR!",
rest_done:"Rest over — next set!",
plate_title:"Plate Calculator",plate_total:"Total weight (kg)",plate_bar:"Bar",
plate_per_side:"Plates per side",plate_bar_only:"Bar only — no plates",plate_too_light:"Less than the bar weight",
plate_leftover:"Left over:",plate_hint:"Enter total weight to see plates per side",
heatmap_title:"Activity",streak_label:"week streak",
dow_0:"Mon",dow_1:"Tue",dow_2:"Wed",dow_3:"Thu",dow_4:"Fri",dow_5:"Sat",dow_6:"Sun",
ob_mode_title:"How do you want to use the app?",
ob_mode_program:"Ready-made program",ob_mode_program_desc:"The app plans workouts and progression for you",
ob_mode_log:"Just a log",ob_mode_log_desc:"No suggestions — type your own exercises and log sets yourself",
log_workout_label:"Workout",log_add_exercise:"Add exercise",log_ex_placeholder:"Exercise name",
log_add_set:"+ set",log_remove_set:"− set",log_recent:"Recent workouts",settings_mode:"Mode",muscle_Other:"Other",
bw_title:"Body Weight",bw_add:"Save",bw_placeholder:"kg today",
backup_export:"Export backup (JSON)",backup_import:"Import backup (JSON)",
backup_desc:"Full backup: history, weights, settings & profile. Data never leaves your device unless you share the file yourself.",
backup_confirm:"Replace current data with the backup file? This overwrites existing data.",
backup_error:"Invalid backup file",
},
fi:{
// Exercise names
lib_squat:"Kyykky",lib_hack_squat:"Hack-kyykky",lib_leg_press:"Jalkaprässi",lib_leg_press_n:"Jalkaprässi (kapea)",
lib_leg_ext:"Polven ojennus",lib_split_squat:"Bulgarialainen askelkyykky",lib_lunge:"Kävelyaskelkyykky",
lib_goblet_squat:"Goblet-kyykky",lib_step_up:"Penkille nousu",lib_deadlift:"Maastaveto",
lib_rdl:"Romania-maastaveto",lib_trap_dl:"Maastaveto trap-tangolla",lib_sumo_dl:"Sumomaastaveto",
lib_leg_curl:"Jalkakoukistus maaten",lib_seated_curl:"Jalkakoukistus istuen",
lib_nordic:"Pohjoismainen takareisikoukistus",lib_good_morning:"Hyvää huomenta -liike",
lib_hip_thrust:"Lantionnosto",lib_glute_bridge:"Pakarasilta tangolla",lib_cable_kickback:"Pakarapotku taljassa",
lib_abduction:"Lonkan loitonnus koneella",lib_standing_calf:"Pohjenousu seisten",
lib_seated_calf:"Pohjenousu istuen",lib_leg_press_calf:"Pohjenousu jalkaprässissä",
lib_bench:"Penkkipunnerrus",lib_incline_db:"Vinopenkkipunnerrus käsipainoilla",
lib_db_bench:"Penkkipunnerrus käsipainolla",lib_cable_fly:"Ristitaljapunnerrus",lib_pec_deck:"Pec deck",
lib_db_pullover:"Pullover käsipainolla",lib_dips:"Dippi (rinta)",lib_pushup_weighted:"Etunojapunnerrus lisäpainolla",
lib_low_cable_fly:"Ristitaljavipunosto alhaalta",lib_cable_row:"Alataljasoutu",
lib_db_row:"Kulmasoutu käsipainolla",lib_chest_row:"Rintanojasoutu",lib_lat_pull:"Ylätaljaveto",
lib_pullup:"Leuanveto myötä-/vastaotteella",lib_sa_cable_row:"Taljasoutu yhdellä kädellä",
lib_pullover_cable:"Suorin käsin veto taljassa",lib_bb_row:"Kulmasoutu tangolla",lib_tbar_row:"T-tankosoutu",
lib_ohp:"Pystypunnerrus tangolla",lib_db_ohp:"Pystypunnerrus käsipainoilla",lib_lat_raise:"Vipunosto sivulle",
lib_cable_raise:"Vipunosto sivulle taljassa",lib_face_pull:"Face pull",lib_rear_delt:"Vipunosto taakse",
lib_upright_row:"Pystysoutu",lib_arnold_press:"Arnold-punnerrus",lib_bb_curl:"Hauiskääntö tangolla",
lib_hammer:"Vasarakääntö",lib_incline_curl:"Hauiskääntö vinopenkillä",lib_spider_curl:"Spider-kääntö",
lib_cable_curl:"Hauiskääntö taljassa",lib_conc_curl:"Concentration Curl",
lib_reverse_curl:"Hauiskääntö myötäotteella",lib_skull:"Ranskalainen punnerrus",
lib_pushdown:"Ojentajapunnerrus taljassa",lib_overhead_tri:"Ojentajapunnerrus pään yläpuolelta",
lib_dips_tri:"Dippi (ojentajat)",lib_kickback:"Ojentajapotku käsipainolla",
lib_close_bench:"Kapea penkkipunnerrus",
// Cues
cue_lib_squat:"Täysi syvyys, polvet varpaiden suuntaan, keskivartalo tiukkana",
cue_lib_hack_squat:"Jalat ylös alustalla, täysi syvyys",
cue_lib_leg_press:"Jalat hartianlevyisesti, älä lukitse polvia",
cue_lib_leg_press_n:"Kapea asento, korostaa ulompaa etureidettä",
cue_lib_leg_ext:"Täysi liikerata, purista ylhäällä",
cue_lib_split_squat:"Etummainen jalka eteen, ylävartalo pystyyn",
cue_lib_lunge:"Pitkä askel, polvi varpaiden suuntaan",
cue_lib_goblet_squat:"Kyynärpäät polvien sisäpuolelle, rinta ylös",
cue_lib_step_up:"Ponnista etummaisen jalan kantapäällä",
cue_lib_deadlift:"Leveät tiukkana, työnnä lattia pois",
cue_lib_rdl:"Työnnä lantio taakse, tunne venytys",
cue_lib_trap_dl:"Lantio alas alkuasennossa, rinta ylös",
cue_lib_sumo_dl:"Leveä asento, varpaat ulos, polvet auki",
cue_lib_leg_curl:"Täysi liikerata, hidas 3s jarruttava",
cue_lib_seated_curl:"Täysi venytys, tauko ylhäällä",
cue_lib_nordic:"Hidas jarruttava, keskivartalo tiukkana",
cue_lib_good_morning:"Polvet hieman koukussa, taita lantiosta",
cue_lib_hip_thrust:"Ponnista kantapäillä, purista ylhäällä",
cue_lib_glute_bridge:"Jalat tasaisesti, työnnä lantio kohti kattoa",
cue_lib_cable_kickback:"Purista pakara ylhäällä, hallittu lasku",
cue_lib_abduction:"Täysi liikerata, älä käytä vauhtia",
cue_lib_standing_calf:"Täysi venytys alhaalla, tauko ylhäällä",
cue_lib_seated_calf:"Painotettu venytys, tauko ylhäällä",
cue_lib_leg_press_calf:"Varpaat reunalla, täysi liikerata",
cue_lib_bench:"1s tauko rinnalla, ponnista kantapäillä",
cue_lib_incline_db:"Kyynärpäät 45°, tunne ylärinnan venytys",
cue_lib_db_bench:"Suurempi liikerata kuin tangolla, venytys alhaalla",
cue_lib_cable_fly:"Kevyt kyynärpään koukistus, purista keskellä",
cue_lib_pec_deck:"Hallitse avaus, purista keskellä",
cue_lib_db_pullover:"Tunne rintakehän avautuvan, leveät ja rinta venyvät",
cue_lib_dips:"Nojaa eteenpäin, kyynärpäät hieman auki",
cue_lib_pushup_weighted:"Painolevy selkään, täysi liikerata",
cue_lib_low_cable_fly:"Vedä ylöspäin kaarella, purista ylärintaa",
cue_lib_cable_row:"Vedä alavatsaan, purista lapaluut yhteen",
cue_lib_db_row:"Kyynärpää lähellä vartaloa, täysi venytys",
cue_lib_chest_row:"Rinta tyynyä vasten, vedä kyynärpäistä",
cue_lib_lat_pull:"Nojaa hieman taakse, vedä ylärintaan",
cue_lib_pullup:"Aloita suorista käsistä, leuka tangon yli",
cue_lib_sa_cable_row:"Täysi kierto, venytä ja soutu lantioon",
cue_lib_pullover_cable:"Kevyt kyynärpään koukistus, tunne leveät ylhäällä",
cue_lib_bb_row:"Taita 45°, vedä napaan",
cue_lib_tbar_row:"Neutraali ote, rinta ylös, purista",
cue_lib_ohp:"Suora tangon rata, keskivartalo tiukkana",
cue_lib_db_ohp:"Neutraali ote, täysi ojennus",
cue_lib_lat_raise:"Johda kyynärpäillä, kevyt eteen nojaus",
cue_lib_cable_raise:"Kyynärpää johtaa, älä kohota olkapäitä",
cue_lib_face_pull:"Vedä otsalle, ulkokierto",
cue_lib_rear_delt:"Johda kyynärpäillä, vältä epäkäslihasta",
cue_lib_upright_row:"Leveä ote, kyynärpäät ylös, talja suositeltava",
cue_lib_arnold_press:"Kierrä kämmen ulos punnerruksen aikana",
cue_lib_bb_curl:"Ei heilumista, täysi liikerata",
cue_lib_hammer:"Neutraali ote, ei heilumista",
cue_lib_incline_curl:"Kädet vartalon takana lisävenytystä varten",
cue_lib_spider_curl:"Rinta vinopenkillä, kyynärpäät eteen",
cue_lib_cable_curl:"Jatkuva jännitys, purista ylhäällä",
cue_lib_conc_curl:"Kyynärpää sisäreidellä, tarkka tekniikka",
cue_lib_reverse_curl:"Myötäote, kohdistuu olkavarseen",
cue_lib_skull:"Olkavarret pystysuoraan, täysi ojennus",
cue_lib_pushdown:"Kyynärpäät kiinni kyljissä, täysi ojennus",
cue_lib_overhead_tri:"Kyynärpäät eteen, venytys alhaalla",
cue_lib_dips_tri:"Pysty ylävartalo, kyynärpäät lähellä",
cue_lib_kickback:"Olkavarsi lattian suuntaisesti, täysi ojennus",
cue_lib_close_bench:"Kädet hartianlevyisesti, kyynärpäät tiukasti",
// Muscle groups
muscle_Quads:"Etureidet",muscle_Hamstrings:"Takareidet",muscle_Glutes:"Pakarat",muscle_Calves:"Pohkeet",
muscle_Chest:"Rinta",muscle_Back:"Selkä",muscle_Shoulders:"Olkapäät",muscle_Biceps:"Hauikset",muscle_Triceps:"Ojentajat",
// Block themes
"theme_Barbell Compounds":"Tankoliikkeet","theme_Dumbbell & Machine":"Käsipainot & koneet",
"theme_Strength Focus":"Voimaharjoittelu","theme_Volume & Isolation":"Volyymi & eristö",
"theme_Power & Strength":"Voima & räjähtävyys","theme_Isolation & Volume":"Eristö & volyymi",
"theme_Cable & Unilateral":"Talja & toispuoleiset","theme_Hybrid Strength–Hypertrophy":"Voima–hypertrofia",
"theme_Barbell Foundation":"Tankoperusta","theme_Dumbbell & Cable":"Käsipainot & talja",
"theme_Strength Phase":"Voimavaihe","theme_Volume & Pump":"Volyymi & pumppi",
// Day labels
"day_Full Body A":"Koko keho A","day_Full Body B":"Koko keho B","day_Full Body C":"Koko keho C",
"day_Upper A":"Ylävartalo A","day_Upper B":"Ylävartalo B","day_Lower A":"Alavartalo A","day_Lower B":"Alavartalo B",
"day_Push":"Työntö","day_Pull":"Veto","day_Legs":"Jalat","day_Upper":"Ylävartalo","day_Lower":"Alavartalo",
// Day focuses
"focus_Squat · Push · Pull · Arms":"Kyykky · Punnerrus · Veto · Kädet",
"focus_Hinge · Press · Row · Glutes":"Lantio · Punnerrus · Soutu · Pakarat",
"focus_Machine Legs · DB Push · Pull":"Konejalat · KP punnerrus · Veto",
"focus_Hinge · Shoulders · Back · Iso":"Lantio · Olkapäät · Selkä · Eristö",
"focus_Heavy Squat · Bench · Row":"Raskas kyykky · Penkki · Soutu",
"focus_Heavy Hinge · OHP · Pull":"Raskas lantio · Pystypunnerrus · Veto",
"focus_High-Rep Legs · Push · Pull":"Monitoisto jalat · Punnerrus · Veto",
"focus_High-Rep Hinge · Shoulders · Arms":"Monitoisto lantio · Olkapäät · Kädet",
"focus_Squat · Push · Pull":"Kyykky · Punnerrus · Veto",
"focus_Hinge · Vertical Push · Triceps":"Lantio · Pystypunnerrus · Ojentajat",
"focus_Unilateral · Arms · Glutes":"Toispuoleiset · Kädet · Pakarat",
"focus_Heavy Squat · Push · Pull":"Raskas kyykky · Punnerrus · Veto",
"focus_Heavy Hinge · OHP · Row":"Raskas lantio · Pystypunnerrus · Soutu",
"focus_Unilateral · Strength · Glutes":"Toispuoleiset · Voima · Pakarat",
"focus_High-Rep Squat · Push · Pull":"Monitoisto kyykky · Punnerrus · Veto",
"focus_Unilateral · Pump · Glutes":"Toispuoleiset · Pumppi · Pakarat",
"focus_Unilateral Squat · Cable Push/Pull":"Toispuoleinen kyykky · Talja",
"focus_Hinge · Press · Row · Triceps":"Lantio · Punnerrus · Soutu · Ojentajat",
"focus_Unilateral · Pump · Calves":"Toispuoleiset · Pumppi · Pohkeet",
"focus_Hinge · OHP · Row · Triceps":"Lantio · Pystypunnerrus · Soutu · Ojentajat",
"focus_Horizontal Push/Pull":"Vaakatasopunnerrus/-veto",
"focus_Squat · Glutes · Hamstrings":"Kyykky · Pakarat · Takareidet",
"focus_Vertical Push/Pull · Arms":"Pystypunnerrus/-veto · Kädet",
"focus_Hinge · Unilateral · Calves":"Lantio · Toispuoleiset · Pohkeet",
"focus_DB Press · Machine Row":"KP punnerrus · Konesoutu",
"focus_Machine Squat · Glutes":"Konekyykky · Pakarat",
"focus_DB Shoulders · Cable Work":"KP olkapäät · Taljatyö",
"focus_Hinge · Unilateral":"Lantio · Toispuoleiset",
"focus_Heavy Bench · Row":"Raskas penkki · Soutu",
"focus_Heavy Squat · Glutes":"Raskas kyykky · Pakarat",
"focus_Heavy OHP · Pull":"Raskas pystypunnerrus · Veto",
"focus_Heavy Hinge · Unilateral":"Raskas lantio · Toispuoleiset",
"focus_Push Volume":"Punnerrusvolyymi",
"focus_Quad & Glute Volume":"Etureidet & pakarat volyymi",
"focus_Pull Volume · Arms":"Vetovolyymi · Kädet",
"focus_Hinge Volume · Unilateral":"Lantiovolyymi · Toispuoleiset",
"focus_Chest · Shoulders · Triceps":"Rinta · Olkapäät · Ojentajat",
"focus_Back · Biceps · Rear Delts":"Selkä · Hauikset · Takaolkapäät",
"focus_Squat · Hinge · Glutes · Calves":"Kyykky · Lantio · Pakarat · Pohkeet",
"focus_Compound Push/Pull · Arms":"Yhdistelmäliikkeet · Kädet",
"focus_DB Press · Flies · Delts":"KP punnerrus · Vipunostot · Olkapäät",
"focus_Rows · Pulldowns · Curls":"Soudut · Ylätaljavedot · Hauiskääntö",
"focus_Machine Squat · Glutes · Hams":"Konekyykky · Pakarat · Takareidet",
"focus_Press · Row · Accessories":"Punnerrus · Soutu · Lisäliikkeet",
"focus_Hinge · Unilateral · Glutes":"Lantio · Toispuoleiset · Pakarat",
"focus_Heavy Press · Shoulders":"Raskas punnerrus · Olkapäät",
"focus_Heavy Row · Pull-Up":"Raskas soutu · Leuanveto",
"focus_Heavy Squat · Deadlift":"Raskas kyykky · Maastaveto",
"focus_Strength Accessories":"Voimalisäliikkeet",
"focus_High-Rep Chest · Delts":"Monitoisto rinta · Olkapäät",
"focus_High-Rep Rows · Curls":"Monitoisto soudut · Hauiskääntö",
"focus_High-Rep Quads · Glutes":"Monitoisto etureidet · Pakarat",
"focus_Pump Push/Pull · Arms":"Pumppi punnerrus/veto · Kädet",
"focus_Volume Hinge · Unilateral":"Volyymi lantio · Toispuoleiset",
// Navigation
nav_home:"Koti",nav_log:"Loki",nav_program:"Ohjelma",nav_settings:"Asetukset",
// Home view
home_ready:"Valmis<br>treeniin?",home_days_week:"päivää/viikko.",home_full_body:"Koko keho.",home_split:"Jaettu ohjelma.",
home_blocks_variation:"vaihtelublokkia.",stat_sessions:"Treenit",stat_this_week:"Tällä viikolla",stat_to_swap:"Vaihtoon",
home_up_next:"SEURAAVA",home_day:"PÄIVÄ",home_start:"ALOITA TREENI →",
home_block_swap_in:"BLOKKI VAIHTUU",home_session:"TREENIN",home_sessions:"TREENIN",
home_coming_up:"Seuraavaksi:",home_sessions_left:"treeniä jäljellä",home_session_left:"treeni jäljellä",
home_next:"SEURAAVA",home_all_days:"Kaikki päivät —",
// Workout view
workout_sets_done:"SARJAA TEHTY",workout_finish:"✓ LOPETA TREENI",workout_complete_all:"Tee kaikki sarjat lopettaaksesi",
workout_quit:"Lopeta kesken",workout_rest:"LEPO",workout_skip:"OHITA",workout_load:"↑ NOSTA",
workout_swap:"⇄ Vaihda",workout_sets:"sarjaa",workout_reps:"toistoa",workout_last:"Edellinen:",workout_try:"→ kokeile",
workout_col_reps:"Toistot ↕",workout_col_set:"#",workout_col_kg:"kg",
workout_hint_edit:"Tuplanapauta tehdyn sarjan ✓ muokataksesi",workout_swap_title:"Vaihda liike",
workout_muscle:"Lihasryhmä:",workout_current:"nykyinen",workout_in_use:"käytössä",workout_cancel:"Peruuta treeni?",
// Complete view
complete_done:"VALMIS!",complete_min:"min",stat_duration:"Kesto",stat_exercises:"Liikkeet",
stat_volume:"kg Vol.",complete_switch:"Blokki vaihtui!",complete_now_starting:"Aloitetaan nyt",
complete_up_next:"Seuraava",complete_back:"← TAKAISIN",
// History view
history_title:"Historia",history_empty:"Ei treenejä vielä. Aloita tänään! 💪",
history_ex:"liikettä",history_vol:"vol.",history_partial:"kesken",
// Program view
program_title:"Ohjelma",program_full_body:"KOKO KEHO",program_split:"JAETTU",
program_per_week:"×/VIIKKO",program_blocks:"BLOKKIA",
program_desc_1:"treeniblokkia, jotka vaihtuvat automaattisesti joka",program_desc_2:"treenin jälkeen.",
program_desc_swap:"Napauta ⇄ Vaihda treenin aikana vaihtaaksesi liikettä.",
program_sessions_until:"treeniä jäljellä blokkiin",program_session_until:"treeni jäljellä blokkiin",program_active:"Aktiivinen",
// Settings view
settings_title:"Asetukset",settings_language:"Kieli",settings_rest:"Lepoajastin",
settings_rest_desc:"Aika sarjojen välissä",settings_rest_off:"Pois",settings_setup:"Profiilisi",
settings_per_week:"kertaa viikossa",settings_female:"Nainen",settings_male:"Mies",
settings_full_body:"Koko keho",settings_split:"Jaettu",settings_program:"ohjelma",
settings_change:"VAIHDA",settings_how_to:"Käyttöohje",settings_data:"Tiedot",
settings_reset:"Nollaa kaikki tiedot",settings_reset_warn:"Poistaa kaiken historian, painot ja asetukset. Ei voi peruuttaa.",
settings_how_1:"Napauta toistomäärää",settings_how_1b:"selataksesi toistoaluetta (alkaa ylhäältä, laskee alas).",
settings_how_2:"Syötä paino kiloina",settings_how_2b:"— yhden sarjan täyttäminen täyttää automaattisesti seuraavat sarjat.",
settings_how_3:"Napauta ✓",settings_how_3b:"merkitäksesi sarjan tehdyksi. Lepoajastin käynnistyy automaattisesti.",
settings_how_4:"Tuplanapauta ✓",settings_how_4b:"muokataksesi tehtyä sarjaa.",
settings_how_5:"⇄ Vaihda",settings_how_5b:"vaihtaa liikkeen toiseen samasta lihasryhmästä.",
settings_how_6:"↑ NOSTA",settings_how_6b:"tarkoittaa, että teit maksimireppit viimeksi — kokeile lisäpainoa.",
settings_progression_title:"Automaattinen progressio",settings_progression_desc:"Paino nousee kun teet kaikki toistot. Kaksi peräkkäistä epäonnistumista laukaisee 10% deloadin.",settings_progression_pct:"Nousu (%)",
settings_how_7:"Lopeta kesken",settings_how_7b:"tallentaa tehdyt sarjat historiaan.",
history_delete:"Poista",history_delete_confirm:"Poistetaanko tämä treeni historiasta?",
chart_title:"Kehitys",chart_no_data:"Ei vielä tarpeeksi dataa",
settings_export:"Vie historia (CSV)",settings_import:"Tuo historia (CSV)",settings_import_done:"Tuotiin",settings_import_sessions:"treeniä",settings_import_error:"Virheellinen CSV-tiedosto",settings_export_import:"Vienti / Tuonti",
// Onboarding view
ob_tagline:"Sinun salisi. Sinun sääntösi.",ob_subtitle:"Aseta treeniohjelma kahdella napautuksella.",
ob_freq:"Montako päivää viikossa?",ob_iam:"Olen",ob_full_body:"Koko keho",ob_upper_lower:"Ylä/ala",
ob_ppl:"PPL + Y/A",ob_male:"Mies",ob_female:"Nainen",ob_start:"ALOITETAAN →",
ob_change_later:"Voit muuttaa tämän milloin tahansa Asetuksista.",
// Quit modal
quit_title:"Lopeta treeni?",quit_save_info:"Tehdyt sarjat tallennetaan historiaasi.",
quit_confirm:"JOO, LOPETAN",quit_keep:"JATKAN 💪",
// Confirm dialogs
confirm_reset_profile:"Nollaa profiilisi? Treenihistoria ja painot säilyvät, mutta ohjelma luodaan uudelleen.",
confirm_clear_1:"Tämä poistaa pysyvästi KAIKEN treenihistorian, tallennetut painot ja asetukset. Oletko varma?",
confirm_clear_2:"Oikeasti? Tätä ei voi peruuttaa.",
// Block label
block_label:"Blokki",
// Free workout builder
free_build_title:"Rakenna harjoitus",free_all:"Kaikki",free_selected:"VALITUT",
free_start_btn:"▶ Aloita harjoitus",free_workout_label:"Vapaa harjoitus",
free_open_builder:"✏️ Rakenna oma harjoitus",free_my_workouts:"Omat harjoitukset",
free_exercises:"liikettä",free_delete_confirm:"Poistetaanko",
free_complete_title:"Harjoitus valmis!",free_save_as_template:"Haluatko tallentaa tämän harjoituksen mallipohjana?",
free_save_yes:"Kyllä, tallenna",free_name_placeholder:"Harjoituksen nimi",
free_count_progress:"Lasketaanko tämä ohjelman etenemiseen?",free_count_yes:"Kyllä, laske etenemiseen",
free_continue:"Jatka →",
reps_prev_low:"↓ ed.",
yt_aria:"Katso ohjevideo",
// WUP / Tavoite
wup_week:"Viikko",wup_deload_week:"Deload-viikko",wup_deload_label:"Deload",
wup_deload_desc:"Kevyt sessio — 60% painot, helpot toistot",
wup_goal_label:"Tavoite",wup_goal_title:"Treenitavoite",
wup_goal_desc:"Määrittää viikoittaisen toistomallin. Muuttaminen nollaa syklin viikkoon 1.",
wup_current_week:"Syklin viikko:",
goal_hypertrophy:"Lihasmassa",goal_strength:"Voima",goal_fat_loss:"Rasvanpoltto",
ob_goal:"Treenitavoite?",ob_goal_hypertrophy:"Kasvata lihasta",ob_goal_strength:"Kehitä voimaa",ob_goal_fat_loss:"Polta rasvaa",
weekly_volume_title:"Tämä viikko",weekly_sets_label:"sarjaa",weekly_target:"Tavoite: 10+ sarjaa / lihasryhmä",
notes_placeholder:"Miltä tuntui? Muistiinpanoja...",notes_label:"Treenin muistiinpanot",
pr_title:"Ennätykset",pr_est_1rm:"est. 1RM",pr_new:"Uusi ennätys!",
rest_done:"Lepo ohi — seuraava sarja!",
plate_title:"Levylaskuri",plate_total:"Kokonaispaino (kg)",plate_bar:"Tanko",
plate_per_side:"Levyt per puoli",plate_bar_only:"Pelkkä tanko — ei levyjä",plate_too_light:"Vähemmän kuin tangon paino",
plate_leftover:"Jää yli:",plate_hint:"Syötä kokonaispaino nähdäksesi levyt per puoli",
heatmap_title:"Aktiivisuus",streak_label:"viikon putki",
dow_0:"Ma",dow_1:"Ti",dow_2:"Ke",dow_3:"To",dow_4:"Pe",dow_5:"La",dow_6:"Su",
ob_mode_title:"Miten haluat käyttää appia?",
ob_mode_program:"Valmis ohjelma",ob_mode_program_desc:"Appi suunnittelee treenit ja progression puolestasi",
ob_mode_log:"Pelkkä loki",ob_mode_log_desc:"Ei ehdotuksia — kirjaat omat liikkeet ja sarjat itse",
log_workout_label:"Treeni",log_add_exercise:"Lisää liike",log_ex_placeholder:"Liikkeen nimi",
log_add_set:"+ sarja",log_remove_set:"− sarja",log_recent:"Viimeisimmät treenit",settings_mode:"Käyttötapa",muscle_Other:"Muu",
bw_title:"Kehonpaino",bw_add:"Tallenna",bw_placeholder:"kg tänään",
backup_export:"Vie varmuuskopio (JSON)",backup_import:"Tuo varmuuskopio (JSON)",
backup_desc:"Täysi varmuuskopio: historia, painot, asetukset ja profiili. Data ei poistu laitteeltasi ellet itse jaa tiedostoa.",
backup_confirm:"Korvataanko nykyiset tiedot varmuuskopiolla? Tämä ylikirjoittaa olemassa olevat tiedot.",
backup_error:"Virheellinen varmuuskopiotiedosto",
}
};

// ═══════════════════════════════════════════════════════════════════
// PROGRAM GENERATOR — builds blocks based on profile (freq + sex)
// ═══════════════════════════════════════════════════════════════════

// Helper: pick from library by id
function _libFind(id){
  for(const g of Object.values(LIBRARY)){const x=g.find(e=>e.id===id);if(x)return x;}
  return null;
}
// Auto-detect muscle group from library
function _muscleOf(libId){
  for(const[g,arr]of Object.entries(LIBRARY)){if(arr.find(e=>e.id===libId))return g;}
  return"";
}
// Build exercise entry: Ex(blockNumber, libraryId, optionalOverrides)
function Ex(bn,libId,ov){
  const base=_libFind(libId);if(!base)return null;
  const o=ov||{};
  return{id:`b${bn}_${libId.replace('lib_','')}`,libId:libId,name:base.name,muscle:_muscleOf(libId),
    sets:o.sets!==undefined?o.sets:base.sets,repRange:o.repRange||base.repRange,cues:o.cues||base.cues};
}

function generateBlocks(profile){
  const f=profile.freq;  // 2-5
  const isFemale=profile.sex==="female";

  if(f===2) return gen2Day(isFemale);
  if(f===3) return gen3Day(isFemale);
  if(f===4) return gen4Day(isFemale);
  return gen5Day(isFemale);
}

function gen2Day(fem){
  // 2 days/week: Full Body A & B, higher volume per session, 4 blocks
  const blocks=[];
  const themes=["Barbell Compounds","Dumbbell & Machine","Strength Focus","Volume & Isolation"];
  const dayLabels=[{id:"A",label:"Full Body A",emoji:"💪"},{id:"B",label:"Full Body B",emoji:"⚡"}];

  // Block 1: Barbell Compounds
  blocks.push({id:1,label:"Block 1",theme:themes[0],days:[
    {id:"A",label:"Full Body A",focus:"Squat · Push · Pull · Arms",emoji:"💪",exercises:fem?[
      Ex(1,"lib_squat"),Ex(1,"lib_hip_thrust",{sets:4}),Ex(1,"lib_bench",{sets:3}),Ex(1,"lib_cable_row",{sets:4}),
      Ex(1,"lib_rdl"),Ex(1,"lib_lat_pull"),Ex(1,"lib_lat_raise"),Ex(1,"lib_abduction"),Ex(1,"lib_bb_curl")
    ]:[
      Ex(1,"lib_squat"),Ex(1,"lib_bench"),Ex(1,"lib_cable_row",{sets:4}),Ex(1,"lib_incline_db"),
      Ex(1,"lib_lat_pull"),Ex(1,"lib_rdl"),Ex(1,"lib_lat_raise"),Ex(1,"lib_bb_curl"),Ex(1,"lib_skull")
    ]},
    {id:"B",label:"Full Body B",focus:"Hinge · Press · Row · Glutes",emoji:"⚡",exercises:fem?[
      Ex(1,"lib_deadlift"),Ex(1,"lib_leg_press"),Ex(1,"lib_db_ohp"),Ex(1,"lib_db_row",{sets:4}),
      Ex(1,"lib_leg_curl"),Ex(1,"lib_cable_fly"),Ex(1,"lib_glute_bridge"),Ex(1,"lib_face_pull"),Ex(1,"lib_standing_calf")
    ]:[
      Ex(1,"lib_deadlift"),Ex(1,"lib_ohp"),Ex(1,"lib_db_row",{sets:4}),Ex(1,"lib_leg_press"),
      Ex(1,"lib_cable_fly"),Ex(1,"lib_face_pull"),Ex(1,"lib_skull"),Ex(1,"lib_hammer"),Ex(1,"lib_standing_calf")
    ]}
  ]});

  // Block 2: Dumbbell & Machine
  blocks.push({id:2,label:"Block 2",theme:themes[1],days:[
    {id:"A",label:"Full Body A",focus:"Machine Legs · DB Push · Pull",emoji:"💪",exercises:fem?[
      Ex(2,"lib_hack_squat"),Ex(2,"lib_hip_thrust",{sets:4}),Ex(2,"lib_db_bench"),Ex(2,"lib_chest_row",{sets:4}),
      Ex(2,"lib_seated_curl"),Ex(2,"lib_pec_deck"),Ex(2,"lib_cable_raise"),Ex(2,"lib_cable_kickback"),Ex(2,"lib_seated_calf")
    ]:[
      Ex(2,"lib_hack_squat"),Ex(2,"lib_db_bench"),Ex(2,"lib_chest_row",{sets:4}),Ex(2,"lib_pec_deck"),
      Ex(2,"lib_pullover_cable"),Ex(2,"lib_seated_curl"),Ex(2,"lib_cable_raise"),Ex(2,"lib_incline_curl"),Ex(2,"lib_pushdown")
    ]},
    {id:"B",label:"Full Body B",focus:"Hinge · Shoulders · Back · Iso",emoji:"⚡",exercises:fem?[
      Ex(2,"lib_trap_dl"),Ex(2,"lib_leg_press"),Ex(2,"lib_db_ohp"),Ex(2,"lib_sa_cable_row",{sets:4}),
      Ex(2,"lib_leg_ext"),Ex(2,"lib_db_pullover"),Ex(2,"lib_rear_delt"),Ex(2,"lib_abduction"),Ex(2,"lib_leg_press_calf")
    ]:[
      Ex(2,"lib_trap_dl"),Ex(2,"lib_db_ohp"),Ex(2,"lib_sa_cable_row",{sets:4}),Ex(2,"lib_leg_press"),
      Ex(2,"lib_db_pullover"),Ex(2,"lib_rear_delt"),Ex(2,"lib_pushdown"),Ex(2,"lib_spider_curl"),Ex(2,"lib_seated_calf")
    ]}
  ]});

  // Block 3: Strength
  blocks.push({id:3,label:"Block 3",theme:themes[2],days:[
    {id:"A",label:"Full Body A",focus:"Heavy Squat · Bench · Row",emoji:"💪",exercises:fem?[
      Ex(3,"lib_squat",{sets:4,repRange:[4,8]}),Ex(3,"lib_hip_thrust",{sets:4,repRange:[6,10]}),Ex(3,"lib_bench",{sets:4,repRange:[6,8]}),
      Ex(3,"lib_bb_row",{sets:4,repRange:[6,8]}),Ex(3,"lib_leg_curl"),Ex(3,"lib_lat_raise"),Ex(3,"lib_cable_kickback"),Ex(3,"lib_standing_calf",{sets:4})
    ]:[
      Ex(3,"lib_squat",{sets:5,repRange:[4,6]}),Ex(3,"lib_bench",{sets:5,repRange:[4,6]}),Ex(3,"lib_bb_row",{sets:4,repRange:[6,8]}),
      Ex(3,"lib_dips",{sets:3,repRange:[6,10]}),Ex(3,"lib_pullup"),Ex(3,"lib_lat_raise"),Ex(3,"lib_cable_curl"),Ex(3,"lib_standing_calf",{sets:4})
    ]},
    {id:"B",label:"Full Body B",focus:"Heavy Hinge · OHP · Pull",emoji:"⚡",exercises:fem?[
      Ex(3,"lib_deadlift",{sets:4,repRange:[3,6]}),Ex(3,"lib_leg_press",{sets:3,repRange:[8,12]}),Ex(3,"lib_db_ohp",{sets:4}),
      Ex(3,"lib_chest_row",{sets:4}),Ex(3,"lib_leg_ext"),Ex(3,"lib_face_pull"),Ex(3,"lib_abduction"),Ex(3,"lib_seated_calf",{sets:4})
    ]:[
      Ex(3,"lib_deadlift",{sets:5,repRange:[3,5]}),Ex(3,"lib_ohp",{sets:5,repRange:[4,6]}),Ex(3,"lib_tbar_row",{sets:4,repRange:[6,8]}),
      Ex(3,"lib_leg_press",{sets:3,repRange:[8,12]}),Ex(3,"lib_incline_db"),Ex(3,"lib_face_pull"),Ex(3,"lib_close_bench"),Ex(3,"lib_hammer")
    ]}
  ]});

  // Block 4: Volume
  blocks.push({id:4,label:"Block 4",theme:themes[3],days:[
    {id:"A",label:"Full Body A",focus:"High-Rep Legs · Push · Pull",emoji:"💪",exercises:fem?[
      Ex(4,"lib_goblet_squat"),Ex(4,"lib_hip_thrust",{sets:4,repRange:[12,15]}),Ex(4,"lib_db_bench",{sets:3,repRange:[12,15]}),
      Ex(4,"lib_cable_row",{sets:4,repRange:[12,15]}),Ex(4,"lib_leg_ext",{sets:4}),Ex(4,"lib_arnold_press"),Ex(4,"lib_cable_kickback"),Ex(4,"lib_leg_press_calf")
    ]:[
      Ex(4,"lib_goblet_squat"),Ex(4,"lib_db_bench",{sets:4,repRange:[10,15]}),Ex(4,"lib_cable_row",{sets:4,repRange:[10,15]}),
      Ex(4,"lib_cable_fly"),Ex(4,"lib_lat_pull",{repRange:[12,15]}),Ex(4,"lib_arnold_press"),Ex(4,"lib_conc_curl"),Ex(4,"lib_overhead_tri")
    ]},
    {id:"B",label:"Full Body B",focus:"High-Rep Hinge · Shoulders · Arms",emoji:"⚡",exercises:fem?[
      Ex(4,"lib_rdl",{sets:4,repRange:[10,15]}),Ex(4,"lib_leg_press",{repRange:[15,20]}),Ex(4,"lib_db_ohp",{repRange:[10,15]}),
      Ex(4,"lib_db_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_seated_curl"),Ex(4,"lib_cable_raise",{sets:4}),Ex(4,"lib_glute_bridge"),Ex(4,"lib_seated_calf",{sets:4})
    ]:[
      Ex(4,"lib_rdl",{sets:4,repRange:[10,15]}),Ex(4,"lib_db_ohp",{repRange:[10,15]}),Ex(4,"lib_db_row",{sets:4,repRange:[10,15]}),
      Ex(4,"lib_leg_press",{repRange:[15,20]}),Ex(4,"lib_pec_deck"),Ex(4,"lib_cable_raise",{sets:4}),Ex(4,"lib_reverse_curl"),Ex(4,"lib_overhead_tri")
    ]}
  ]});

  return blocks;
}

function gen3Day(fem){
  // 3 days/week: Full Body A/B/C — the classic layout
  const blocks=[];

  // Block 1: Barbell Compounds
  blocks.push({id:1,label:"Block 1",theme:"Barbell Compounds",days:[
    {id:"A",label:"Full Body A",focus:"Squat · Push · Pull",emoji:"💪",exercises:fem?[
      Ex(1,"lib_squat"),Ex(1,"lib_hip_thrust",{sets:4}),Ex(1,"lib_bench",{sets:3}),Ex(1,"lib_cable_row",{sets:4}),
      Ex(1,"lib_lat_pull"),Ex(1,"lib_lat_raise"),Ex(1,"lib_bb_curl")
    ]:[
      Ex(1,"lib_squat"),Ex(1,"lib_bench"),Ex(1,"lib_cable_row",{sets:4}),Ex(1,"lib_incline_db"),
      Ex(1,"lib_lat_pull"),Ex(1,"lib_lat_raise"),Ex(1,"lib_bb_curl")
    ]},
    {id:"B",label:"Full Body B",focus:"Hinge · Vertical Push · Triceps",emoji:"⚡",exercises:fem?[
      Ex(1,"lib_deadlift"),Ex(1,"lib_ohp",{sets:3}),Ex(1,"lib_db_row",{sets:4}),Ex(1,"lib_leg_press"),
      Ex(1,"lib_cable_fly",{sets:3}),Ex(1,"lib_face_pull"),Ex(1,"lib_cable_kickback")
    ]:[
      Ex(1,"lib_deadlift"),Ex(1,"lib_ohp"),Ex(1,"lib_db_row",{sets:4}),Ex(1,"lib_leg_press"),
      Ex(1,"lib_cable_fly"),Ex(1,"lib_face_pull"),Ex(1,"lib_skull")
    ]},
    {id:"C",label:"Full Body C",focus:"Unilateral · Arms · Glutes",emoji:"🔱",exercises:fem?[
      Ex(1,"lib_split_squat"),Ex(1,"lib_rdl"),Ex(1,"lib_leg_curl"),Ex(1,"lib_leg_ext"),
      Ex(1,"lib_glute_bridge"),Ex(1,"lib_abduction"),Ex(1,"lib_standing_calf",{sets:4})
    ]:[
      Ex(1,"lib_split_squat"),Ex(1,"lib_rdl"),Ex(1,"lib_leg_curl"),Ex(1,"lib_leg_ext"),
      Ex(1,"lib_hammer"),Ex(1,"lib_hip_thrust"),Ex(1,"lib_standing_calf",{sets:4})
    ]}
  ]});

  // Block 2: Dumbbell & Machine
  blocks.push({id:2,label:"Block 2",theme:"Dumbbell & Machine",days:[
    {id:"A",label:"Full Body A",focus:"Squat · Push · Pull",emoji:"💪",exercises:fem?[
      Ex(2,"lib_hack_squat"),Ex(2,"lib_hip_thrust",{sets:4}),Ex(2,"lib_db_bench",{sets:3}),Ex(2,"lib_chest_row",{sets:4}),
      Ex(2,"lib_pullover_cable"),Ex(2,"lib_cable_raise"),Ex(2,"lib_incline_curl")
    ]:[
      Ex(2,"lib_hack_squat"),Ex(2,"lib_db_bench"),Ex(2,"lib_chest_row",{sets:4}),Ex(2,"lib_pec_deck"),
      Ex(2,"lib_pullover_cable"),Ex(2,"lib_cable_raise"),Ex(2,"lib_incline_curl")
    ]},
    {id:"B",label:"Full Body B",focus:"Hinge · Vertical Push · Triceps",emoji:"⚡",exercises:fem?[
      Ex(2,"lib_trap_dl"),Ex(2,"lib_db_ohp"),Ex(2,"lib_sa_cable_row",{sets:4}),Ex(2,"lib_leg_press_n"),
      Ex(2,"lib_db_pullover"),Ex(2,"lib_rear_delt"),Ex(2,"lib_cable_kickback")
    ]:[
      Ex(2,"lib_trap_dl"),Ex(2,"lib_db_ohp"),Ex(2,"lib_sa_cable_row",{sets:4}),Ex(2,"lib_leg_press_n"),
      Ex(2,"lib_db_pullover"),Ex(2,"lib_rear_delt"),Ex(2,"lib_pushdown")
    ]},
    {id:"C",label:"Full Body C",focus:"Unilateral · Arms · Glutes",emoji:"🔱",exercises:fem?[
      Ex(2,"lib_lunge"),Ex(2,"lib_nordic"),Ex(2,"lib_seated_curl"),Ex(2,"lib_leg_ext"),
      Ex(2,"lib_glute_bridge"),Ex(2,"lib_abduction"),Ex(2,"lib_seated_calf",{sets:4})
    ]:[
      Ex(2,"lib_lunge"),Ex(2,"lib_nordic"),Ex(2,"lib_seated_curl"),Ex(2,"lib_leg_ext"),
      Ex(2,"lib_spider_curl"),Ex(2,"lib_glute_bridge"),Ex(2,"lib_seated_calf",{sets:4})
    ]}
  ]});

  // Block 3: Power & Strength
  blocks.push({id:3,label:"Block 3",theme:"Power & Strength",days:[
    {id:"A",label:"Full Body A",focus:"Heavy Squat · Push · Pull",emoji:"💪",exercises:fem?[
      Ex(3,"lib_squat",{sets:4,repRange:[4,8]}),Ex(3,"lib_hip_thrust",{sets:4,repRange:[6,10]}),Ex(3,"lib_bench",{sets:4,repRange:[6,8]}),
      Ex(3,"lib_bb_row",{sets:4,repRange:[6,8]}),Ex(3,"lib_lat_pull"),Ex(3,"lib_lat_raise"),Ex(3,"lib_cable_curl")
    ]:[
      Ex(3,"lib_squat",{sets:5,repRange:[4,6]}),Ex(3,"lib_bench",{sets:5,repRange:[4,6]}),Ex(3,"lib_bb_row",{sets:4,repRange:[6,8]}),
      Ex(3,"lib_dips",{repRange:[6,10]}),Ex(3,"lib_pullup"),Ex(3,"lib_lat_raise"),Ex(3,"lib_cable_curl")
    ]},
    {id:"B",label:"Full Body B",focus:"Heavy Hinge · OHP · Row",emoji:"⚡",exercises:fem?[
      Ex(3,"lib_deadlift",{sets:4,repRange:[3,6]}),Ex(3,"lib_db_ohp",{sets:4}),Ex(3,"lib_tbar_row",{sets:4,repRange:[6,8]}),
      Ex(3,"lib_leg_press"),Ex(3,"lib_cable_fly"),Ex(3,"lib_face_pull"),Ex(3,"lib_cable_kickback")
    ]:[
      Ex(3,"lib_deadlift",{sets:5,repRange:[3,5]}),Ex(3,"lib_ohp",{sets:5,repRange:[4,6]}),Ex(3,"lib_tbar_row",{sets:4,repRange:[6,8]}),
      Ex(3,"lib_leg_press"),Ex(3,"lib_incline_db",{repRange:[8,10]}),Ex(3,"lib_face_pull"),Ex(3,"lib_close_bench")
    ]},
    {id:"C",label:"Full Body C",focus:"Unilateral · Strength · Glutes",emoji:"🔱",exercises:fem?[
      Ex(3,"lib_split_squat",{sets:4,repRange:[6,10]}),Ex(3,"lib_sumo_dl",{sets:4}),Ex(3,"lib_leg_curl"),
      Ex(3,"lib_step_up"),Ex(3,"lib_hip_thrust",{sets:4,repRange:[8,12]}),Ex(3,"lib_abduction"),Ex(3,"lib_standing_calf",{sets:4})
    ]:[
      Ex(3,"lib_split_squat",{sets:4,repRange:[6,10]}),Ex(3,"lib_sumo_dl",{sets:4}),Ex(3,"lib_leg_curl"),
      Ex(3,"lib_step_up"),Ex(3,"lib_hammer",{repRange:[8,12]}),Ex(3,"lib_hip_thrust",{sets:4}),Ex(3,"lib_standing_calf",{sets:4})
    ]}
  ]});

  // Block 4: Isolation & Volume
  blocks.push({id:4,label:"Block 4",theme:"Isolation & Volume",days:[
    {id:"A",label:"Full Body A",focus:"High-Rep Squat · Push · Pull",emoji:"💪",exercises:fem?[
      Ex(4,"lib_goblet_squat"),Ex(4,"lib_hip_thrust",{sets:4,repRange:[12,15]}),Ex(4,"lib_db_bench",{sets:3,repRange:[10,15]}),
      Ex(4,"lib_cable_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_lat_pull",{repRange:[12,15]}),Ex(4,"lib_arnold_press"),Ex(4,"lib_cable_kickback")
    ]:[
      Ex(4,"lib_goblet_squat"),Ex(4,"lib_db_bench",{repRange:[10,15]}),Ex(4,"lib_cable_row",{sets:4,repRange:[10,15]}),
      Ex(4,"lib_cable_fly"),Ex(4,"lib_lat_pull",{repRange:[12,15]}),Ex(4,"lib_arnold_press"),Ex(4,"lib_conc_curl")
    ]},
    {id:"B",label:"Full Body B",focus:"High-Rep Hinge · Shoulders · Arms",emoji:"⚡",exercises:fem?[
      Ex(4,"lib_rdl",{sets:4,repRange:[10,15]}),Ex(4,"lib_leg_press",{repRange:[15,20]}),Ex(4,"lib_db_ohp",{repRange:[10,15]}),
      Ex(4,"lib_db_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_cable_raise",{sets:4}),Ex(4,"lib_glute_bridge",{repRange:[15,20]}),Ex(4,"lib_seated_calf",{sets:4})
    ]:[
      Ex(4,"lib_rdl",{sets:4,repRange:[10,15]}),Ex(4,"lib_db_ohp",{repRange:[10,15]}),Ex(4,"lib_db_row",{sets:4,repRange:[10,15]}),
      Ex(4,"lib_leg_press",{repRange:[15,20]}),Ex(4,"lib_pec_deck"),Ex(4,"lib_cable_raise",{sets:4}),Ex(4,"lib_overhead_tri")
    ]},
    {id:"C",label:"Full Body C",focus:"Unilateral · Pump · Glutes",emoji:"🔱",exercises:fem?[
      Ex(4,"lib_lunge",{repRange:[12,16]}),Ex(4,"lib_good_morning"),Ex(4,"lib_seated_curl",{sets:4}),Ex(4,"lib_leg_ext",{sets:4,repRange:[15,20]}),
      Ex(4,"lib_abduction"),Ex(4,"lib_cable_kickback"),Ex(4,"lib_seated_calf",{sets:4})
    ]:[
      Ex(4,"lib_lunge",{repRange:[12,16]}),Ex(4,"lib_good_morning"),Ex(4,"lib_seated_curl",{sets:4}),Ex(4,"lib_leg_ext",{sets:4,repRange:[15,20]}),
      Ex(4,"lib_reverse_curl"),Ex(4,"lib_hip_thrust"),Ex(4,"lib_seated_calf",{sets:4})
    ]}
  ]});

  // Block 5: Cable & Unilateral
  blocks.push({id:5,label:"Block 5",theme:"Cable & Unilateral",days:[
    {id:"A",label:"Full Body A",focus:"Unilateral Squat · Cable Push/Pull",emoji:"💪",exercises:fem?[
      Ex(5,"lib_split_squat",{sets:4}),Ex(5,"lib_hip_thrust",{sets:4}),Ex(5,"lib_cable_fly",{sets:4}),Ex(5,"lib_sa_cable_row",{sets:4}),
      Ex(5,"lib_pullover_cable"),Ex(5,"lib_cable_raise",{sets:4}),Ex(5,"lib_cable_kickback")
    ]:[
      Ex(5,"lib_split_squat",{sets:4}),Ex(5,"lib_cable_fly",{sets:4}),Ex(5,"lib_sa_cable_row",{sets:4}),
      Ex(5,"lib_low_cable_fly"),Ex(5,"lib_pullover_cable"),Ex(5,"lib_cable_raise",{sets:4}),Ex(5,"lib_cable_curl")
    ]},
    {id:"B",label:"Full Body B",focus:"Hinge · Press · Row · Triceps",emoji:"⚡",exercises:fem?[
      Ex(5,"lib_rdl",{sets:4}),Ex(5,"lib_leg_press"),Ex(5,"lib_db_ohp"),Ex(5,"lib_tbar_row",{sets:4}),
      Ex(5,"lib_db_pullover"),Ex(5,"lib_face_pull"),Ex(5,"lib_abduction")
    ]:[
      Ex(5,"lib_rdl",{sets:4}),Ex(5,"lib_db_ohp"),Ex(5,"lib_tbar_row",{sets:4}),Ex(5,"lib_leg_press"),
      Ex(5,"lib_db_pullover"),Ex(5,"lib_face_pull"),Ex(5,"lib_pushdown")
    ]},
    {id:"C",label:"Full Body C",focus:"Unilateral · Pump · Calves",emoji:"🔱",exercises:fem?[
      Ex(5,"lib_step_up"),Ex(5,"lib_good_morning"),Ex(5,"lib_leg_curl"),Ex(5,"lib_leg_ext"),
      Ex(5,"lib_glute_bridge"),Ex(5,"lib_cable_kickback"),Ex(5,"lib_leg_press_calf")
    ]:[
      Ex(5,"lib_step_up"),Ex(5,"lib_good_morning"),Ex(5,"lib_leg_curl"),Ex(5,"lib_leg_ext"),
      Ex(5,"lib_spider_curl"),Ex(5,"lib_hip_thrust"),Ex(5,"lib_leg_press_calf")
    ]}
  ]});

  // Block 6: Hybrid Strength–Hypertrophy
  blocks.push({id:6,label:"Block 6",theme:"Hybrid Strength–Hypertrophy",days:[
    {id:"A",label:"Full Body A",focus:"Squat · Push · Pull",emoji:"💪",exercises:fem?[
      Ex(6,"lib_squat",{sets:4,repRange:[6,10]}),Ex(6,"lib_hip_thrust",{sets:4,repRange:[8,12]}),Ex(6,"lib_incline_db",{sets:3}),
      Ex(6,"lib_bb_row",{sets:4,repRange:[6,10]}),Ex(6,"lib_pec_deck"),Ex(6,"lib_arnold_press"),Ex(6,"lib_hammer")
    ]:[
      Ex(6,"lib_squat",{sets:4,repRange:[6,10]}),Ex(6,"lib_incline_db"),Ex(6,"lib_bb_row",{sets:4,repRange:[6,10]}),
      Ex(6,"lib_pec_deck"),Ex(6,"lib_pullup"),Ex(6,"lib_arnold_press"),Ex(6,"lib_hammer")
    ]},
    {id:"B",label:"Full Body B",focus:"Hinge · OHP · Row · Triceps",emoji:"⚡",exercises:fem?[
      Ex(6,"lib_deadlift",{sets:4,repRange:[4,6]}),Ex(6,"lib_leg_press"),Ex(6,"lib_ohp",{sets:3}),
      Ex(6,"lib_chest_row",{sets:4}),Ex(6,"lib_cable_fly"),Ex(6,"lib_upright_row"),Ex(6,"lib_cable_kickback")
    ]:[
      Ex(6,"lib_deadlift",{sets:4,repRange:[4,6]}),Ex(6,"lib_ohp",{sets:4,repRange:[6,10]}),Ex(6,"lib_chest_row",{sets:4}),
      Ex(6,"lib_hack_squat"),Ex(6,"lib_cable_fly"),Ex(6,"lib_upright_row"),Ex(6,"lib_dips_tri")
    ]},
    {id:"C",label:"Full Body C",focus:"Unilateral · Strength · Glutes",emoji:"🔱",exercises:fem?[
      Ex(6,"lib_split_squat",{sets:4,repRange:[6,10]}),Ex(6,"lib_sumo_dl"),Ex(6,"lib_nordic"),Ex(6,"lib_leg_ext"),
      Ex(6,"lib_hip_thrust",{sets:4}),Ex(6,"lib_abduction"),Ex(6,"lib_standing_calf",{sets:4})
    ]:[
      Ex(6,"lib_split_squat",{sets:4,repRange:[6,10]}),Ex(6,"lib_sumo_dl"),Ex(6,"lib_nordic"),Ex(6,"lib_leg_ext"),
      Ex(6,"lib_conc_curl"),Ex(6,"lib_hip_thrust",{sets:4}),Ex(6,"lib_standing_calf",{sets:4})
    ]}
  ]});

  return blocks;
}

function gen4Day(fem){
  // 4 days/week: Upper/Lower split, 4 blocks
  const blocks=[];

  // Block 1
  blocks.push({id:1,label:"Block 1",theme:"Barbell Compounds",days:[
    {id:"A",label:"Upper A",focus:"Horizontal Push/Pull",emoji:"💪",exercises:fem?[
      Ex(1,"lib_bench",{sets:3}),Ex(1,"lib_cable_row",{sets:4}),Ex(1,"lib_incline_db",{sets:3}),
      Ex(1,"lib_lat_pull"),Ex(1,"lib_lat_raise"),Ex(1,"lib_face_pull"),Ex(1,"lib_bb_curl")
    ]:[
      Ex(1,"lib_bench"),Ex(1,"lib_cable_row",{sets:4}),Ex(1,"lib_incline_db"),
      Ex(1,"lib_lat_pull"),Ex(1,"lib_lat_raise"),Ex(1,"lib_bb_curl"),Ex(1,"lib_skull")
    ]},
    {id:"B",label:"Lower A",focus:"Squat · Glutes · Hamstrings",emoji:"🦵",exercises:fem?[
      Ex(1,"lib_squat"),Ex(1,"lib_hip_thrust",{sets:4}),Ex(1,"lib_rdl"),Ex(1,"lib_leg_ext"),
      Ex(1,"lib_leg_curl"),Ex(1,"lib_abduction"),Ex(1,"lib_standing_calf",{sets:4})
    ]:[
      Ex(1,"lib_squat"),Ex(1,"lib_rdl"),Ex(1,"lib_leg_press"),Ex(1,"lib_leg_ext"),
      Ex(1,"lib_leg_curl"),Ex(1,"lib_hip_thrust"),Ex(1,"lib_standing_calf",{sets:4})
    ]},
    {id:"C",label:"Upper B",focus:"Vertical Push/Pull · Arms",emoji:"⚡",exercises:fem?[
      Ex(1,"lib_ohp",{sets:3}),Ex(1,"lib_db_row",{sets:4}),Ex(1,"lib_cable_fly"),
      Ex(1,"lib_pullover_cable"),Ex(1,"lib_rear_delt"),Ex(1,"lib_hammer"),Ex(1,"lib_pushdown")
    ]:[
      Ex(1,"lib_ohp"),Ex(1,"lib_db_row",{sets:4}),Ex(1,"lib_cable_fly"),
      Ex(1,"lib_pullover_cable"),Ex(1,"lib_rear_delt"),Ex(1,"lib_hammer"),Ex(1,"lib_pushdown")
    ]},
    {id:"D",label:"Lower B",focus:"Hinge · Unilateral · Calves",emoji:"🔱",exercises:fem?[
      Ex(1,"lib_deadlift"),Ex(1,"lib_split_squat"),Ex(1,"lib_glute_bridge"),Ex(1,"lib_seated_curl"),
      Ex(1,"lib_step_up"),Ex(1,"lib_cable_kickback"),Ex(1,"lib_seated_calf",{sets:4})
    ]:[
      Ex(1,"lib_deadlift"),Ex(1,"lib_split_squat"),Ex(1,"lib_leg_press"),Ex(1,"lib_seated_curl"),
      Ex(1,"lib_step_up"),Ex(1,"lib_hip_thrust"),Ex(1,"lib_seated_calf",{sets:4})
    ]}
  ]});

  // Block 2
  blocks.push({id:2,label:"Block 2",theme:"Dumbbell & Machine",days:[
    {id:"A",label:"Upper A",focus:"DB Press · Machine Row",emoji:"💪",exercises:fem?[
      Ex(2,"lib_db_bench"),Ex(2,"lib_chest_row",{sets:4}),Ex(2,"lib_pec_deck"),
      Ex(2,"lib_lat_pull"),Ex(2,"lib_cable_raise"),Ex(2,"lib_rear_delt"),Ex(2,"lib_incline_curl")
    ]:[
      Ex(2,"lib_db_bench"),Ex(2,"lib_chest_row",{sets:4}),Ex(2,"lib_pec_deck"),
      Ex(2,"lib_lat_pull"),Ex(2,"lib_cable_raise"),Ex(2,"lib_incline_curl"),Ex(2,"lib_pushdown")
    ]},
    {id:"B",label:"Lower A",focus:"Machine Squat · Glutes",emoji:"🦵",exercises:fem?[
      Ex(2,"lib_hack_squat"),Ex(2,"lib_hip_thrust",{sets:4}),Ex(2,"lib_leg_curl"),Ex(2,"lib_leg_ext"),
      Ex(2,"lib_lunge"),Ex(2,"lib_abduction"),Ex(2,"lib_leg_press_calf")
    ]:[
      Ex(2,"lib_hack_squat"),Ex(2,"lib_leg_press"),Ex(2,"lib_leg_curl"),Ex(2,"lib_leg_ext"),
      Ex(2,"lib_lunge"),Ex(2,"lib_hip_thrust"),Ex(2,"lib_leg_press_calf")
    ]},
    {id:"C",label:"Upper B",focus:"DB Shoulders · Cable Work",emoji:"⚡",exercises:fem?[
      Ex(2,"lib_db_ohp"),Ex(2,"lib_sa_cable_row",{sets:4}),Ex(2,"lib_cable_fly"),
      Ex(2,"lib_db_pullover"),Ex(2,"lib_face_pull"),Ex(2,"lib_spider_curl"),Ex(2,"lib_overhead_tri")
    ]:[
      Ex(2,"lib_db_ohp"),Ex(2,"lib_sa_cable_row",{sets:4}),Ex(2,"lib_cable_fly"),
      Ex(2,"lib_db_pullover"),Ex(2,"lib_face_pull"),Ex(2,"lib_spider_curl"),Ex(2,"lib_overhead_tri")
    ]},
    {id:"D",label:"Lower B",focus:"Hinge · Unilateral",emoji:"🔱",exercises:fem?[
      Ex(2,"lib_trap_dl"),Ex(2,"lib_split_squat"),Ex(2,"lib_glute_bridge"),Ex(2,"lib_seated_curl"),
      Ex(2,"lib_nordic"),Ex(2,"lib_cable_kickback"),Ex(2,"lib_seated_calf",{sets:4})
    ]:[
      Ex(2,"lib_trap_dl"),Ex(2,"lib_split_squat"),Ex(2,"lib_leg_press_n"),Ex(2,"lib_seated_curl"),
      Ex(2,"lib_nordic"),Ex(2,"lib_good_morning"),Ex(2,"lib_seated_calf",{sets:4})
    ]}
  ]});

  // Block 3: Strength
  blocks.push({id:3,label:"Block 3",theme:"Strength Focus",days:[
    {id:"A",label:"Upper A",focus:"Heavy Bench · Row",emoji:"💪",exercises:fem?[
      Ex(3,"lib_bench",{sets:4,repRange:[6,8]}),Ex(3,"lib_bb_row",{sets:4,repRange:[6,8]}),Ex(3,"lib_incline_db"),
      Ex(3,"lib_lat_pull"),Ex(3,"lib_lat_raise"),Ex(3,"lib_face_pull"),Ex(3,"lib_cable_curl")
    ]:[
      Ex(3,"lib_bench",{sets:5,repRange:[4,6]}),Ex(3,"lib_bb_row",{sets:4,repRange:[6,8]}),Ex(3,"lib_dips",{repRange:[6,10]}),
      Ex(3,"lib_pullup"),Ex(3,"lib_lat_raise"),Ex(3,"lib_cable_curl"),Ex(3,"lib_close_bench")
    ]},
    {id:"B",label:"Lower A",focus:"Heavy Squat · Glutes",emoji:"🦵",exercises:fem?[
      Ex(3,"lib_squat",{sets:4,repRange:[4,8]}),Ex(3,"lib_hip_thrust",{sets:4,repRange:[6,10]}),Ex(3,"lib_leg_press"),
      Ex(3,"lib_leg_curl"),Ex(3,"lib_leg_ext"),Ex(3,"lib_abduction"),Ex(3,"lib_standing_calf",{sets:4})
    ]:[
      Ex(3,"lib_squat",{sets:5,repRange:[4,6]}),Ex(3,"lib_leg_press"),Ex(3,"lib_leg_curl"),
      Ex(3,"lib_leg_ext"),Ex(3,"lib_hip_thrust"),Ex(3,"lib_standing_calf",{sets:4})
    ]},
    {id:"C",label:"Upper B",focus:"Heavy OHP · Pull",emoji:"⚡",exercises:fem?[
      Ex(3,"lib_db_ohp",{sets:4}),Ex(3,"lib_chest_row",{sets:4}),Ex(3,"lib_cable_fly"),
      Ex(3,"lib_pullover_cable"),Ex(3,"lib_rear_delt"),Ex(3,"lib_hammer"),Ex(3,"lib_pushdown")
    ]:[
      Ex(3,"lib_ohp",{sets:5,repRange:[4,6]}),Ex(3,"lib_tbar_row",{sets:4,repRange:[6,8]}),Ex(3,"lib_incline_db"),
      Ex(3,"lib_pullover_cable"),Ex(3,"lib_face_pull"),Ex(3,"lib_hammer"),Ex(3,"lib_pushdown")
    ]},
    {id:"D",label:"Lower B",focus:"Heavy Hinge · Unilateral",emoji:"🔱",exercises:fem?[
      Ex(3,"lib_deadlift",{sets:4,repRange:[3,6]}),Ex(3,"lib_split_squat",{sets:4,repRange:[6,10]}),Ex(3,"lib_glute_bridge"),
      Ex(3,"lib_nordic"),Ex(3,"lib_step_up"),Ex(3,"lib_cable_kickback"),Ex(3,"lib_seated_calf",{sets:4})
    ]:[
      Ex(3,"lib_deadlift",{sets:5,repRange:[3,5]}),Ex(3,"lib_split_squat",{sets:4,repRange:[6,10]}),Ex(3,"lib_sumo_dl"),
      Ex(3,"lib_nordic"),Ex(3,"lib_step_up"),Ex(3,"lib_hip_thrust"),Ex(3,"lib_seated_calf",{sets:4})
    ]}
  ]});

  // Block 4: Volume
  blocks.push({id:4,label:"Block 4",theme:"Volume & Pump",days:[
    {id:"A",label:"Upper A",focus:"Push Volume",emoji:"💪",exercises:fem?[
      Ex(4,"lib_db_bench",{sets:3,repRange:[10,15]}),Ex(4,"lib_cable_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_cable_fly"),
      Ex(4,"lib_lat_pull",{repRange:[12,15]}),Ex(4,"lib_arnold_press"),Ex(4,"lib_rear_delt"),Ex(4,"lib_bb_curl")
    ]:[
      Ex(4,"lib_db_bench",{sets:4,repRange:[10,15]}),Ex(4,"lib_cable_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_cable_fly"),
      Ex(4,"lib_lat_pull",{repRange:[12,15]}),Ex(4,"lib_arnold_press"),Ex(4,"lib_conc_curl"),Ex(4,"lib_overhead_tri")
    ]},
    {id:"B",label:"Lower A",focus:"Quad & Glute Volume",emoji:"🦵",exercises:fem?[
      Ex(4,"lib_goblet_squat"),Ex(4,"lib_hip_thrust",{sets:4,repRange:[12,15]}),Ex(4,"lib_rdl"),Ex(4,"lib_leg_ext",{sets:4}),
      Ex(4,"lib_seated_curl",{sets:4}),Ex(4,"lib_abduction"),Ex(4,"lib_leg_press_calf")
    ]:[
      Ex(4,"lib_goblet_squat"),Ex(4,"lib_rdl"),Ex(4,"lib_leg_press",{repRange:[15,20]}),Ex(4,"lib_leg_ext",{sets:4}),
      Ex(4,"lib_seated_curl",{sets:4}),Ex(4,"lib_hip_thrust"),Ex(4,"lib_leg_press_calf")
    ]},
    {id:"C",label:"Upper B",focus:"Pull Volume · Arms",emoji:"⚡",exercises:fem?[
      Ex(4,"lib_db_ohp",{repRange:[10,15]}),Ex(4,"lib_db_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_pec_deck"),
      Ex(4,"lib_pullover_cable"),Ex(4,"lib_cable_raise",{sets:4}),Ex(4,"lib_hammer"),Ex(4,"lib_pushdown")
    ]:[
      Ex(4,"lib_db_ohp",{repRange:[10,15]}),Ex(4,"lib_db_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_pec_deck"),
      Ex(4,"lib_pullover_cable"),Ex(4,"lib_cable_raise",{sets:4}),Ex(4,"lib_spider_curl"),Ex(4,"lib_pushdown")
    ]},
    {id:"D",label:"Lower B",focus:"Hinge Volume · Unilateral",emoji:"🔱",exercises:fem?[
      Ex(4,"lib_rdl",{sets:4,repRange:[10,15]}),Ex(4,"lib_lunge"),Ex(4,"lib_glute_bridge",{repRange:[15,20]}),
      Ex(4,"lib_good_morning"),Ex(4,"lib_leg_curl"),Ex(4,"lib_cable_kickback"),Ex(4,"lib_seated_calf",{sets:4})
    ]:[
      Ex(4,"lib_rdl",{sets:4,repRange:[10,15]}),Ex(4,"lib_lunge"),Ex(4,"lib_leg_press",{repRange:[15,20]}),
      Ex(4,"lib_good_morning"),Ex(4,"lib_leg_curl"),Ex(4,"lib_hip_thrust"),Ex(4,"lib_seated_calf",{sets:4})
    ]}
  ]});

  return blocks;
}

function gen5Day(fem){
  // 5 days/week: Push / Pull / Legs / Upper / Lower, 4 blocks
  const blocks=[];

  // Block 1
  blocks.push({id:1,label:"Block 1",theme:"Barbell Foundation",days:[
    {id:"A",label:"Push",focus:"Chest · Shoulders · Triceps",emoji:"💪",exercises:fem?[
      Ex(1,"lib_bench",{sets:3}),Ex(1,"lib_incline_db",{sets:3}),Ex(1,"lib_ohp",{sets:3}),
      Ex(1,"lib_cable_fly"),Ex(1,"lib_lat_raise"),Ex(1,"lib_pushdown")
    ]:[
      Ex(1,"lib_bench"),Ex(1,"lib_incline_db"),Ex(1,"lib_ohp",{sets:3}),
      Ex(1,"lib_cable_fly"),Ex(1,"lib_lat_raise"),Ex(1,"lib_skull")
    ]},
    {id:"B",label:"Pull",focus:"Back · Biceps · Rear Delts",emoji:"⚡",exercises:fem?[
      Ex(1,"lib_cable_row",{sets:4}),Ex(1,"lib_lat_pull"),Ex(1,"lib_db_row",{sets:3}),
      Ex(1,"lib_face_pull"),Ex(1,"lib_rear_delt"),Ex(1,"lib_bb_curl")
    ]:[
      Ex(1,"lib_cable_row",{sets:4}),Ex(1,"lib_lat_pull"),Ex(1,"lib_db_row",{sets:3}),
      Ex(1,"lib_face_pull"),Ex(1,"lib_rear_delt"),Ex(1,"lib_bb_curl"),Ex(1,"lib_hammer")
    ]},
    {id:"C",label:"Legs",focus:"Squat · Hinge · Glutes · Calves",emoji:"🦵",exercises:fem?[
      Ex(1,"lib_squat"),Ex(1,"lib_hip_thrust",{sets:4}),Ex(1,"lib_rdl"),Ex(1,"lib_leg_ext"),
      Ex(1,"lib_leg_curl"),Ex(1,"lib_abduction"),Ex(1,"lib_standing_calf",{sets:4})
    ]:[
      Ex(1,"lib_squat"),Ex(1,"lib_rdl"),Ex(1,"lib_leg_press"),Ex(1,"lib_leg_ext"),
      Ex(1,"lib_leg_curl"),Ex(1,"lib_hip_thrust"),Ex(1,"lib_standing_calf",{sets:4})
    ]},
    {id:"D",label:"Upper",focus:"Compound Push/Pull · Arms",emoji:"🔱",exercises:fem?[
      Ex(1,"lib_db_bench",{sets:3}),Ex(1,"lib_chest_row",{sets:4}),Ex(1,"lib_db_ohp",{sets:3}),
      Ex(1,"lib_pullover_cable"),Ex(1,"lib_cable_raise"),Ex(1,"lib_hammer")
    ]:[
      Ex(1,"lib_db_bench"),Ex(1,"lib_chest_row",{sets:4}),Ex(1,"lib_db_ohp"),
      Ex(1,"lib_pullover_cable"),Ex(1,"lib_cable_raise"),Ex(1,"lib_incline_curl"),Ex(1,"lib_pushdown")
    ]},
    {id:"E",label:"Lower",focus:"Hinge · Unilateral · Calves",emoji:"🏋️",exercises:fem?[
      Ex(1,"lib_deadlift"),Ex(1,"lib_split_squat"),Ex(1,"lib_glute_bridge"),Ex(1,"lib_seated_curl"),
      Ex(1,"lib_step_up"),Ex(1,"lib_cable_kickback"),Ex(1,"lib_seated_calf",{sets:4})
    ]:[
      Ex(1,"lib_deadlift"),Ex(1,"lib_split_squat"),Ex(1,"lib_leg_press"),Ex(1,"lib_seated_curl"),
      Ex(1,"lib_step_up"),Ex(1,"lib_good_morning"),Ex(1,"lib_seated_calf",{sets:4})
    ]}
  ]});

  // Block 2
  blocks.push({id:2,label:"Block 2",theme:"Dumbbell & Cable",days:[
    {id:"A",label:"Push",focus:"DB Press · Flies · Delts",emoji:"💪",exercises:fem?[
      Ex(2,"lib_db_bench"),Ex(2,"lib_pec_deck"),Ex(2,"lib_db_ohp",{sets:3}),
      Ex(2,"lib_cable_fly"),Ex(2,"lib_cable_raise"),Ex(2,"lib_overhead_tri")
    ]:[
      Ex(2,"lib_db_bench"),Ex(2,"lib_pec_deck"),Ex(2,"lib_db_ohp"),
      Ex(2,"lib_cable_fly"),Ex(2,"lib_cable_raise"),Ex(2,"lib_pushdown"),Ex(2,"lib_overhead_tri")
    ]},
    {id:"B",label:"Pull",focus:"Rows · Pulldowns · Curls",emoji:"⚡",exercises:fem?[
      Ex(2,"lib_chest_row",{sets:4}),Ex(2,"lib_sa_cable_row",{sets:3}),Ex(2,"lib_pullover_cable"),
      Ex(2,"lib_rear_delt"),Ex(2,"lib_face_pull"),Ex(2,"lib_incline_curl")
    ]:[
      Ex(2,"lib_chest_row",{sets:4}),Ex(2,"lib_sa_cable_row",{sets:3}),Ex(2,"lib_pullover_cable"),
      Ex(2,"lib_rear_delt"),Ex(2,"lib_face_pull"),Ex(2,"lib_incline_curl"),Ex(2,"lib_spider_curl")
    ]},
    {id:"C",label:"Legs",focus:"Machine Squat · Glutes · Hams",emoji:"🦵",exercises:fem?[
      Ex(2,"lib_hack_squat"),Ex(2,"lib_hip_thrust",{sets:4}),Ex(2,"lib_leg_curl"),Ex(2,"lib_leg_ext"),
      Ex(2,"lib_lunge"),Ex(2,"lib_abduction"),Ex(2,"lib_leg_press_calf")
    ]:[
      Ex(2,"lib_hack_squat"),Ex(2,"lib_leg_press"),Ex(2,"lib_leg_curl"),Ex(2,"lib_leg_ext"),
      Ex(2,"lib_lunge"),Ex(2,"lib_hip_thrust"),Ex(2,"lib_leg_press_calf")
    ]},
    {id:"D",label:"Upper",focus:"Press · Row · Accessories",emoji:"🔱",exercises:fem?[
      Ex(2,"lib_bench",{sets:3}),Ex(2,"lib_db_row",{sets:4}),Ex(2,"lib_arnold_press"),
      Ex(2,"lib_lat_pull"),Ex(2,"lib_cable_fly"),Ex(2,"lib_bb_curl")
    ]:[
      Ex(2,"lib_bench",{sets:3}),Ex(2,"lib_db_row",{sets:4}),Ex(2,"lib_arnold_press"),
      Ex(2,"lib_lat_pull"),Ex(2,"lib_cable_fly"),Ex(2,"lib_hammer"),Ex(2,"lib_close_bench")
    ]},
    {id:"E",label:"Lower",focus:"Hinge · Unilateral · Glutes",emoji:"🏋️",exercises:fem?[
      Ex(2,"lib_trap_dl"),Ex(2,"lib_split_squat"),Ex(2,"lib_glute_bridge"),Ex(2,"lib_nordic"),
      Ex(2,"lib_seated_curl"),Ex(2,"lib_cable_kickback"),Ex(2,"lib_seated_calf",{sets:4})
    ]:[
      Ex(2,"lib_trap_dl"),Ex(2,"lib_split_squat"),Ex(2,"lib_leg_press_n"),Ex(2,"lib_nordic"),
      Ex(2,"lib_seated_curl"),Ex(2,"lib_good_morning"),Ex(2,"lib_seated_calf",{sets:4})
    ]}
  ]});

  // Block 3: Strength
  blocks.push({id:3,label:"Block 3",theme:"Strength Phase",days:[
    {id:"A",label:"Push",focus:"Heavy Press · Shoulders",emoji:"💪",exercises:fem?[
      Ex(3,"lib_bench",{sets:4,repRange:[6,8]}),Ex(3,"lib_incline_db"),Ex(3,"lib_ohp",{sets:3,repRange:[6,10]}),
      Ex(3,"lib_cable_fly"),Ex(3,"lib_lat_raise"),Ex(3,"lib_pushdown")
    ]:[
      Ex(3,"lib_bench",{sets:5,repRange:[4,6]}),Ex(3,"lib_incline_db",{repRange:[8,10]}),Ex(3,"lib_ohp",{sets:3,repRange:[4,8]}),
      Ex(3,"lib_dips",{repRange:[6,10]}),Ex(3,"lib_lat_raise"),Ex(3,"lib_close_bench")
    ]},
    {id:"B",label:"Pull",focus:"Heavy Row · Pull-Up",emoji:"⚡",exercises:fem?[
      Ex(3,"lib_bb_row",{sets:4,repRange:[6,8]}),Ex(3,"lib_lat_pull"),Ex(3,"lib_chest_row",{sets:3}),
      Ex(3,"lib_face_pull"),Ex(3,"lib_rear_delt"),Ex(3,"lib_cable_curl")
    ]:[
      Ex(3,"lib_bb_row",{sets:4,repRange:[6,8]}),Ex(3,"lib_pullup"),Ex(3,"lib_tbar_row",{sets:3}),
      Ex(3,"lib_face_pull"),Ex(3,"lib_rear_delt"),Ex(3,"lib_bb_curl"),Ex(3,"lib_hammer")
    ]},
    {id:"C",label:"Legs",focus:"Heavy Squat · Deadlift",emoji:"🦵",exercises:fem?[
      Ex(3,"lib_squat",{sets:4,repRange:[4,8]}),Ex(3,"lib_hip_thrust",{sets:4,repRange:[6,10]}),Ex(3,"lib_rdl"),
      Ex(3,"lib_leg_ext"),Ex(3,"lib_leg_curl"),Ex(3,"lib_abduction"),Ex(3,"lib_standing_calf",{sets:4})
    ]:[
      Ex(3,"lib_squat",{sets:5,repRange:[4,6]}),Ex(3,"lib_rdl"),Ex(3,"lib_leg_press"),
      Ex(3,"lib_leg_ext"),Ex(3,"lib_leg_curl"),Ex(3,"lib_hip_thrust"),Ex(3,"lib_standing_calf",{sets:4})
    ]},
    {id:"D",label:"Upper",focus:"Strength Accessories",emoji:"🔱",exercises:fem?[
      Ex(3,"lib_db_bench"),Ex(3,"lib_sa_cable_row",{sets:4}),Ex(3,"lib_db_ohp"),
      Ex(3,"lib_pullover_cable"),Ex(3,"lib_cable_raise"),Ex(3,"lib_hammer")
    ]:[
      Ex(3,"lib_db_bench"),Ex(3,"lib_sa_cable_row",{sets:4}),Ex(3,"lib_db_ohp"),
      Ex(3,"lib_pullover_cable"),Ex(3,"lib_cable_raise"),Ex(3,"lib_incline_curl"),Ex(3,"lib_overhead_tri")
    ]},
    {id:"E",label:"Lower",focus:"Heavy Hinge · Unilateral",emoji:"🏋️",exercises:fem?[
      Ex(3,"lib_deadlift",{sets:4,repRange:[3,6]}),Ex(3,"lib_split_squat",{sets:4,repRange:[6,10]}),Ex(3,"lib_glute_bridge"),
      Ex(3,"lib_nordic"),Ex(3,"lib_step_up"),Ex(3,"lib_cable_kickback"),Ex(3,"lib_seated_calf",{sets:4})
    ]:[
      Ex(3,"lib_deadlift",{sets:5,repRange:[3,5]}),Ex(3,"lib_split_squat",{sets:4,repRange:[6,10]}),Ex(3,"lib_sumo_dl"),
      Ex(3,"lib_nordic"),Ex(3,"lib_step_up"),Ex(3,"lib_good_morning"),Ex(3,"lib_seated_calf",{sets:4})
    ]}
  ]});

  // Block 4: Volume
  blocks.push({id:4,label:"Block 4",theme:"Volume & Pump",days:[
    {id:"A",label:"Push",focus:"High-Rep Chest · Delts",emoji:"💪",exercises:fem?[
      Ex(4,"lib_db_bench",{sets:3,repRange:[10,15]}),Ex(4,"lib_pec_deck"),Ex(4,"lib_arnold_press"),
      Ex(4,"lib_cable_fly"),Ex(4,"lib_cable_raise",{sets:4}),Ex(4,"lib_overhead_tri")
    ]:[
      Ex(4,"lib_db_bench",{repRange:[10,15]}),Ex(4,"lib_pec_deck"),Ex(4,"lib_arnold_press"),
      Ex(4,"lib_cable_fly"),Ex(4,"lib_cable_raise",{sets:4}),Ex(4,"lib_pushdown"),Ex(4,"lib_overhead_tri")
    ]},
    {id:"B",label:"Pull",focus:"High-Rep Rows · Curls",emoji:"⚡",exercises:fem?[
      Ex(4,"lib_cable_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_lat_pull",{repRange:[12,15]}),Ex(4,"lib_db_row",{sets:3,repRange:[10,15]}),
      Ex(4,"lib_rear_delt"),Ex(4,"lib_face_pull"),Ex(4,"lib_incline_curl")
    ]:[
      Ex(4,"lib_cable_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_lat_pull",{repRange:[12,15]}),Ex(4,"lib_db_row",{sets:3,repRange:[10,15]}),
      Ex(4,"lib_rear_delt"),Ex(4,"lib_face_pull"),Ex(4,"lib_conc_curl"),Ex(4,"lib_spider_curl")
    ]},
    {id:"C",label:"Legs",focus:"High-Rep Quads · Glutes",emoji:"🦵",exercises:fem?[
      Ex(4,"lib_goblet_squat"),Ex(4,"lib_hip_thrust",{sets:4,repRange:[12,15]}),Ex(4,"lib_rdl",{repRange:[10,15]}),
      Ex(4,"lib_leg_ext",{sets:4,repRange:[15,20]}),Ex(4,"lib_seated_curl",{sets:4}),Ex(4,"lib_abduction"),Ex(4,"lib_leg_press_calf")
    ]:[
      Ex(4,"lib_goblet_squat"),Ex(4,"lib_rdl",{repRange:[10,15]}),Ex(4,"lib_leg_press",{repRange:[15,20]}),
      Ex(4,"lib_leg_ext",{sets:4,repRange:[15,20]}),Ex(4,"lib_seated_curl",{sets:4}),Ex(4,"lib_hip_thrust"),Ex(4,"lib_leg_press_calf")
    ]},
    {id:"D",label:"Upper",focus:"Pump Push/Pull · Arms",emoji:"🔱",exercises:fem?[
      Ex(4,"lib_bench",{sets:3,repRange:[10,15]}),Ex(4,"lib_chest_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_db_ohp",{repRange:[10,15]}),
      Ex(4,"lib_pullover_cable"),Ex(4,"lib_lat_raise"),Ex(4,"lib_bb_curl")
    ]:[
      Ex(4,"lib_bench",{sets:3,repRange:[10,15]}),Ex(4,"lib_chest_row",{sets:4,repRange:[10,15]}),Ex(4,"lib_db_ohp",{repRange:[10,15]}),
      Ex(4,"lib_pullover_cable"),Ex(4,"lib_lat_raise"),Ex(4,"lib_hammer"),Ex(4,"lib_pushdown")
    ]},
    {id:"E",label:"Lower",focus:"Volume Hinge · Unilateral",emoji:"🏋️",exercises:fem?[
      Ex(4,"lib_rdl",{sets:4,repRange:[10,15]}),Ex(4,"lib_lunge"),Ex(4,"lib_glute_bridge",{repRange:[15,20]}),
      Ex(4,"lib_good_morning"),Ex(4,"lib_leg_curl"),Ex(4,"lib_cable_kickback"),Ex(4,"lib_seated_calf",{sets:4})
    ]:[
      Ex(4,"lib_rdl",{sets:4,repRange:[10,15]}),Ex(4,"lib_lunge"),Ex(4,"lib_leg_press",{repRange:[15,20]}),
      Ex(4,"lib_good_morning"),Ex(4,"lib_leg_curl"),Ex(4,"lib_hip_thrust"),Ex(4,"lib_seated_calf",{sets:4})
    ]}
  ]});

  return blocks;
}

// Active blocks — generated from profile or default

// English exercise names & cues come straight from LIBRARY — single source of truth.
Object.values(LIBRARY).flat().forEach(ex=>{
  if(!(ex.id in T.en))T.en[ex.id]=ex.name;
  if(!(('cue_'+ex.id) in T.en))T.en['cue_'+ex.id]=ex.cues;
});
