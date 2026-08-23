/* ==========================================================================
   HINSON ENG ADVENTURE — app.js
   Vanilla JS. No frameworks. All data in LocalStorage. Offline-first.
   ========================================================================== */
"use strict";

/* ======================================================================
   0. SHORTHAND HELPERS
   ====================================================================== */
function $(sel, root){ return (root||document).querySelector(sel); }
function $all(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
function uid(prefix){ return (prefix||'q') + '_' + Date.now().toString(36) + '_' + Math.floor(Math.random()*10000).toString(36); }
function todayStr(){ var d = new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function daysBetween(a,b){ var da=new Date(a+'T00:00:00'), db=new Date(b+'T00:00:00'); return Math.round((db-da)/86400000); }
function normalize(s){ return (s||'').toString().trim().toLowerCase().replace(/[.,!?;:"'()‘’“”]/g,'').replace(/\s+/g,' '); }
function shuffle(arr){ var a = arr.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }

/* ======================================================================
   1. MODULE METADATA + NOTES CONTENT (溫習重點 sourced from Light Up Grammar Book 11)
   ====================================================================== */
var MODULES = {
  u1l1: { unit:'Unit 1', title:'Zero Conditional 零條件句', icon:'🌦️',
    notes: '<h4>📌 核心概念</h4><p>用於描述「永遠成立的事實或自然規律」。</p>'+
      '<div class="formula">If + simple present, simple present　或　Simple present + if + simple present</div>'+
      '<p>兩個子句均用 Simple Present Tense。If-clause 放句首時，後面必須加逗號（,）；If-clause 放句尾時，不加逗號。</p>'+
      '<h4>✏️ 例句</h4>'+
      '<p class="example">If you mix red and yellow, you get orange.</p>'+
      '<p class="example">Plants die if you do not water them.</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：漏加逗號 — If-clause 開頭時必須加逗號，否則扣分。</p>'+
      '<p class="trap">陷阱②：用了 will/would — Zero conditional 不用 will，用 simple present。</p>'+
      '<p class="trap">陷阱③：混淆 Zero vs First conditional — Zero＝永遠真實；First＝將來可能發生。</p>'+
      '<div class="mnemonic">🧠 「零條件，兩個present，如自然科學fact！」</div>' },
  u1l2: { unit:'Unit 1', title:'too / enough 太／足夠', icon:'📏',
    notes: '<h4>📌 核心概念</h4>'+
      '<p>too + adjective：過多，帶負面意思。 adjective + enough：剛好足夠。 not + adjective + enough：不夠。</p>'+
      '<div class="formula">too + adj　／　adj + enough　／　not + adj + enough</div>'+
      '<h4>✏️ 例句</h4>'+
      '<p class="example">The box is too small.</p>'+
      '<p class="example">It is not big enough.</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：語序錯誤 — 必須 adj + enough，不可 enough + adj。</p>'+
      '<p class="trap">陷阱②：too = negative meaning，不能用於正面語境。</p>'+
      '<p class="trap">陷阱③：「not big enough」＝「too small」，兩者可互換，考試常考對換。</p>'+
      '<div class="mnemonic">🧠 「too 放前面，enough 跟後面，not...enough = too...反義詞！」</div>' },
  u2l1: { unit:'Unit 2', title:'First Conditional 第一條件句', icon:'🌧️',
    notes: '<h4>📌 核心概念</h4><p>用於描述「將來可能發生的事情及其結果」。</p>'+
      '<div class="formula">If + simple present, will / may / might / can / could + base verb</div>'+
      '<p>If-clause 用 Simple Present（不用 will）；Main clause 用 will / may / might / can / could；If-clause 在句首時加逗號。</p>'+
      '<h4>✏️ 例句</h4>'+
      '<p class="example">If it rains, I will stay at home.</p>'+
      '<p class="example">You may get tooth decay if you do not brush your teeth.</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：if-clause 用了 will — 常見錯誤！if-clause 必須用 present tense。</p>'+
      '<p class="trap">陷阱②：混淆 zero vs first — 一般事實用 zero；未來可能用 first。</p>'+
      '<p class="trap">陷阱③：modal 選擇錯誤 — will（確定）／ may、might（不確定）／ can（能力）。</p>'+
      '<div class="mnemonic">🧠 「If present，result用will/may/might，if後唔可以用will！」</div>' },
  u2l2: { unit:'Unit 2', title:'although 對比句', icon:'⚖️',
    notes: '<h4>📌 核心概念</h4><p>連接兩個對比的概念。</p>'+
      '<div class="formula">Although + clause, main clause　／　Main clause, although + clause</div>'+
      '<p>Although-clause 在句首時，兩句之間加逗號；Although-clause 在句尾時，主句後加逗號。</p>'+
      '<h4>✏️ 例句</h4>'+
      '<p class="example">Although I have a cold, I do not want to see the doctor.</p>'+
      '<p class="example">Jane does not go to bed early, although she is sleepy.</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：漏逗號 — although 位置不同，逗號位置也不同。</p>'+
      '<p class="trap">陷阱②：although vs but — although 連接兩個完整句子；but 用法不同，不可與 although 同用。</p>'+
      '<p class="trap">陷阱③：although 不可隨意替換為 even though（程度不同）。</p>'+
      '<div class="mnemonic">🧠 「although 講對比，逗號係關鍵！」</div>' },
  u3l1: { unit:'Unit 3', title:'Adjective / Adverb 形容詞與副詞', icon:'🎯',
    notes: '<h4>📌 核心概念</h4>'+
      '<p>Adjective：描述名詞，放在名詞前（a polite girl）。Adverb：描述動詞，通常放在動詞後（speaks politely）。</p>'+
      '<div class="formula">adj + -ly = adverb　|　happy → happily　|　calm → calmly</div>'+
      '<p>例外（不變）：fast → fast　|　hard → hard</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：hard vs hardly — hard＝努力；hardly＝幾乎不（意思完全不同！）。</p>'+
      '<p class="trap">陷阱②：形容詞不能放在動詞後代替副詞。</p>'+
      '<p class="trap">陷阱③：fast 用作 adj 和 adv 相同，不需加 -ly。</p>'+
      '<div class="mnemonic">🧠 「名詞前用形容詞，動詞後用副詞，hard/fast 兩用不變形！」</div>' },
  u3l2: { unit:'Unit 3', title:'be going to / might 計劃與可能', icon:'🔮',
    notes: '<h4>📌 be going to — 確定計劃</h4>'+
      '<div class="formula">am / is / are + going to + base verb</div>'+
      '<p class="example">I am going to meet a client.</p>'+
      '<h4>📌 might — 未確定可能性</h4>'+
      '<div class="formula">might + base verb（動詞原形，不加 -s/-ed）</div>'+
      '<p class="example">The architect might build the tallest building.</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：be going to 忘記配對 be verb。</p>'+
      '<p class="trap">陷阱②：might 後加 -s — 錯！might 後永遠用 base verb。</p>'+
      '<p class="trap">陷阱③：混淆 going to（計劃）vs might（可能）。</p>'+
      '<div class="mnemonic">🧠 「going to 係計劃，might 係可能；might 後永遠原形，唔加 s！」</div>' },
  u4l1: { unit:'Unit 4', title:'since / for 時間長度', icon:'⏳',
    notes: '<h4>📌 核心概念</h4>'+
      '<p>since：後接過去某一時間點，配搭 present perfect。for：後接一段時間長度，配搭 present perfect。</p>'+
      '<div class="formula">since + 時間點（since 2001）　|　for + 時間段（for three years）</div>'+
      '<h4>✏️ 例句</h4>'+
      '<p class="example">Martin has worked for the Mars Film Company since 2001.</p>'+
      '<p class="example">The actor has studied the script for three months.</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：since 後接時間段 — 錯！</p>'+
      '<p class="trap">陷阱②：for 後接時間點 — 錯！</p>'+
      '<p class="trap">陷阱③：漏用 present perfect — since/for 通常配 have/has + past participle。</p>'+
      '<div class="mnemonic">🧠 「since 點（時間點），for 段（時間段）；present perfect 唔可少！」</div>' },
  u4l2: { unit:'Unit 4', title:'To-infinitives 不定詞', icon:'➡️',
    notes: '<h4>📌 用法一：某些動詞後直接接 to-infinitive</h4>'+
      '<p>want / decide / refuse / love / hate / pretend / like</p>'+
      '<p class="example">I want to make a film.</p>'+
      '<h4>📌 用法二：報告別人說的話</h4>'+
      '<div class="formula">ask / tell / remind / encourage + someone + to + verb</div>'+
      '<p class="example">The director told the stuntman to jump higher.</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：否定式漏 not — 要說 not to do，不是 to not do。</p>'+
      '<p class="trap">陷阱②：told/asked 後忘加 object。</p>'+
      '<p class="trap">陷阱③：love/hate 後考試通常要求 to-infinitive。</p>'+
      '<div class="mnemonic">🧠 「want/decide/refuse 直接加 to；tell/ask/remind 要有人在中間！」</div>' },
  u5l1: { unit:'Unit 5', title:'Passive Voice 被動語態', icon:'🏭',
    notes: '<h4>📌 核心概念</h4><p>著重「動作」而非「做動作的人」。</p>'+
      '<div class="formula">am / is / are + past participle　(+ by + person)</div>'+
      '<p class="example">Old bottles are collected.</p>'+
      '<p class="example">The park is tidied by the children.</p>'+
      '<h4>Be verb 配對表</h4><p>I → am + pp　|　He/She/It → is + pp　|　You/We/They → are + pp</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：忘用 past participle。</p>'+
      '<p class="trap">陷阱②：be verb 用錯（單複數配對）。</p>'+
      '<p class="trap">陷阱③：不規則動詞 past participle：give→given / cut→cut / fill→filled。</p>'+
      '<div class="mnemonic">🧠 「被動 = am/is/are + pp；做動作的人用 by 加在後面！」</div>' },
  u5l2: { unit:'Unit 5', title:'made in / by / from 製造來源', icon:'🏷️',
    notes: '<h4>📌 三者分別</h4>'+
      '<p>made in：地點（made in China）。made by：製造商／品牌（made by Lovely Gift Company）。made from：物料（made from recycled paper）。</p>'+
      '<h4>✏️ 例句</h4>'+
      '<p class="example">The fan is made in China.</p>'+
      '<p class="example">The trousers are made by Andy&#39;s Fashion.</p>'+
      '<p class="example">The box is made from an old oak tree.</p>'+
      '<h4>⚠️ 呈分試常考陷阱</h4>'+
      '<p class="trap">陷阱①：混淆 made by vs made from。</p>'+
      '<p class="trap">陷阱②：made in 後接城市/國家，不可接人名。</p>'+
      '<p class="trap">陷阱③：考試常三選一，要先判斷空格需要「地點」「製造者」還是「材料」。</p>'+
      '<div class="mnemonic">🧠 「in = 地點；by = 品牌/人；from = 材料。三揀一，睇context！」</div>' },
  verb: { unit:'特別關卡', title:'VERB 動詞天地', icon:'📖',
    notes: '<h4>📌 核心概念</h4><p>英文動詞有三種主要形式：base form（原形）、past simple（過去式）、past participle（過去分詞）。規則動詞加 -ed，不規則動詞要死記！</p>'+
      '<div class="formula">go → went → gone　|　eat → ate → eaten　|　write → wrote → written</div>'+
      '<h4>⚠️ 常見陷阱</h4>'+
      '<p class="trap">陷阱①：modal（can/will/might）後必須用 base verb，唔可加 -s 或 -ed。</p>'+
      '<p class="trap">陷阱②：規則動詞串法變化：study → studied（y→ied）；stop → stopped（重複字尾子音）。</p>'+
      '<div class="mnemonic">🧠 「唔規則動詞冇公式，靠多讀多記！」</div>' },
  tense: { unit:'特別關卡', title:'TENSE 時態魔法', icon:'📝',
    notes: '<h4>📌 核心概念</h4><p>睇「時間訊號詞」揀啱時態：</p>'+
      '<div class="formula">every day/usually → Simple Present　|　now/look! → Present Continuous</div>'+
      '<div class="formula">already/just/since/for → Present Perfect　|　yesterday/last year → Simple Past</div>'+
      '<div class="formula">tomorrow/next week → Future (will / be going to)</div>'+
      '<h4>⚠️ 常見陷阱</h4>'+
      '<p class="trap">陷阱①：見到 already／yet／since／for，通常要用 present perfect（have/has + pp）。</p>'+
      '<p class="trap">陷阱②：事實／自然規律用 simple present，唔好用 continuous。</p>'+
      '<div class="mnemonic">🧠 「睇清楚時間訊號詞，先揀時態！」</div>' },
  reading: { unit:'特別關卡', title:'閱讀理解 Reading Room', icon:'📚',
    notes: '<h4>📌 點做閱讀理解？</h4><p>1. 先睇晒文章一次　2. 睇問題　3. 返去文章搵答案　4. 用廣東話讀出文章幫助理解。</p>'+
      '<div class="mnemonic">🧠 「先睇全文，再答問題，答案通常喺文章入面！」</div>' }
};

var MODULE_ORDER = ['u1l1','u1l2','u2l1','u2l2','u3l1','u3l2','u4l1','u4l2','u5l1','u5l2','verb','tense','reading'];

/* ======================================================================
   2. QUESTION BANK — transcribed from "Light Up Grammar Book 11" mock exam
   ====================================================================== */
var QUESTION_BANK = {
  u1l1: [
    { id:'u1l1-q1', type:'mcq',
      q:'Choose the correct sentence.',
      options:['If you will mix red and blue, you get purple.','If you mix red and blue, you will get purple.','If you mix red and blue, you get purple.','You get purple when you will mix red and blue.'],
      answerIndex:2,
      explanation:'答案係 (C)！Zero conditional 兩個子句都要用 simple present，唔可以用 will。',
      wrongNotes:{0:'if-clause 唔可以用 will。',1:'main clause 都唔可以用 will，Zero conditional 全部用 simple present。',3:'同樣犯咗用 will 嘅錯誤。'} },
    { id:'u1l1-q2', type:'fill',
      q:'Rewrite the sentence by moving the \'if\'-clause to the beginning. Change punctuation where necessary：The soil becomes wet if it rains.',
      acceptableAnswers:['If it rains, the soil becomes wet'],
      explanation:'將 if-clause 搬去句首時要記得加逗號：「If it rains, the soil becomes wet.」' },
    { id:'u1l1-q3', type:'fill',
      q:'找出錯誤並改正：If you throw a stone in water, it sinks. Although if you throw wood, it floats. 請寫出改正後嘅第二句。',
      acceptableAnswers:['Although you throw wood, it floats','If you throw wood, it floats'],
      explanation:'「Although if」唔可以連用！Although 和 if 各有獨立用法，只可以二選一：「Although you throw wood, it floats.」或「If you throw wood, it floats.」' },
    { id:'u1l1-q6', type:'fill',
      q:'用括號入面嘅詞完成 zero conditional 句子：(you / not wear sunscreen / your skin / burn)',
      acceptableAnswers:['If you do not wear sunscreen, your skin burns','Your skin burns if you do not wear sunscreen'],
      explanation:'兩種語序都啱：「If you do not wear sunscreen, your skin burns.」／「Your skin burns if you do not wear sunscreen.」If-clause 在前要加逗號，兩個子句均用 simple present。' },
    { id:'u1l1-q7', type:'mcq',
      q:'Identify which sentence is INCORRECT.',
      options:['If water reaches 100°C, it boils.','Ice melts if you heat it.','If you are too hungry, you should not eating too quickly.','The coffee is not sweet enough if you do not add sugar.'],
      answerIndex:2,
      explanation:'答案係 (C)！錯誤在於 "should not eating"，modal (should) 後面一定要用 base verb，應該係 "should not eat"。',
      wrongNotes:{0:'呢句啱，屬於自然規律。',1:'呢句啱，兩個子句都係 simple present。',3:'呢句都啱，too/enough 用法正確。'} }
  ],
  u1l2: [
    { id:'u1l2-q4', type:'fill',
      q:'Fill in the blank with \'too\' or \'enough\' and the word in brackets：The ladder is _____________ (short) to reach the top shelf. No one can use it.',
      acceptableAnswers:['too short'],
      explanation:'too + adjective（short）帶負面意思，意指梯子唔夠長，唔達要求，所以答案係「too short」。' },
    { id:'u1l2-q5', type:'mcq',
      q:'Two sentences have the SAME meaning. Which pair is correct?',
      options:['The bag is too heavy. / The bag is not light enough.','The bag is too heavy. / The bag is not heavy enough.','The bag is too heavy. / The bag is enough heavy.','The bag is too heavy. / The bag is too not light.'],
      answerIndex:0,
      explanation:'答案係 (A)！「too heavy」＝「not light enough」，即係反義詞互換：too + adj = not + 反義詞 + enough。',
      wrongNotes:{1:'意思變咗相反，唔啱。',2:'語序錯誤，應該係 adj + enough，唔可以係 enough + adj。',3:'語序完全錯誤。'} }
  ],
  u2l1: [
    { id:'u2l1-q8', type:'mcq',
      q:'Choose the correct first conditional sentence.',
      options:['If it will rain, I will stay at home.','If it rains, I stay at home.','If it rains, I will stay at home.','If it will rain, I stay at home.'],
      answerIndex:2,
      explanation:'答案係 (C)！First conditional = If + simple present, will + base verb。if-clause 唔可以有 will！',
      wrongNotes:{0:'if-clause 用咗 will，錯！',1:'main clause 冇用 will，唔算 first conditional 嘅標準講法。',3:'if-clause 又用咗 will，錯！'} },
    { id:'u2l1-q9', type:'fill',
      q:'Rewrite using \'if\'. Do NOT change the order of the sentences：Ken goes to sleep early. He will feel less tired. (will)',
      acceptableAnswers:['If Ken goes to sleep early, he will feel less tired'],
      explanation:'If-clause 用 simple present（goes）；main clause 用 will + base verb（feel）。句首 if-clause 要加逗號。' },
    { id:'u2l1-q10', type:'fill',
      q:'Choose the correct modal verb to complete the sentence（表示確定性）：If you study hard, you _______________ (will / might / can) pass the exam easily.',
      acceptableAnswers:['will'],
      explanation:'will = certain result（確定）；might = possibility（不確定）；can = ability（能力）。題目要求確定，所以選 will。' },
    { id:'u2l1-q14a', type:'fill',
      q:'情境：It is raining. / Ann does not bring an umbrella. / She will get wet. 請寫出 First conditional 句子。',
      acceptableAnswers:['If it rains and Ann does not bring an umbrella, she will get wet','If it rains, she will get wet'],
      explanation:'示例答案：「If it rains and Ann does not bring an umbrella, she will get wet.」if-clause 用 simple present，main clause 用 will。' }
  ],
  u2l2: [
    { id:'u2l2-q11', type:'fill',
      q:'Join the two sentences using \'although\'. Start with the word given：Helen is ill. She still goes to school. (Although...)',
      acceptableAnswers:['Although Helen is ill, she still goes to school'],
      explanation:'Although 在句首 → 後面加逗號。兩個子句對比：ill vs goes to school。' },
    { id:'u2l2-q12', type:'fill',
      q:'Join the two sentences using \'although\'. Start with the SECOND sentence：I am full. I cannot stop eating chocolate.',
      acceptableAnswers:['I cannot stop eating chocolate, although I am full'],
      explanation:'以第二句開頭，although 放中間，前面要加逗號：「I cannot stop eating chocolate, although I am full.」' },
    { id:'u2l2-q13', type:'mcq',
      q:'Identify the sentence with the WRONG use of \'although\'.',
      options:['Although potato chips are tasty, they are not good for our health.','Tina is very thin although she eats a lot of food.','Although my muscles ache, but I continue to run.','My skin becomes sore, although I have put on sunblock.'],
      answerIndex:2,
      explanation:'答案係 (C)！「Although...but」唔可以連用 — although 本身已經係連詞，唔需要 but。Although＝but（功能相同），二選其一！',
      wrongNotes:{0:'用法正確。',1:'用法正確。',3:'用法正確。'} },
    { id:'u2l2-q14b', type:'fill',
      q:'情境：It is raining. / Ann does not bring an umbrella. 請用 although 寫一句。',
      acceptableAnswers:['Although it is raining, Ann does not bring an umbrella','Ann does not bring an umbrella although it is raining'],
      explanation:'示例答案：「Although it is raining, Ann does not bring an umbrella.」' }
  ],
  u3l1: [
    { id:'u3l1-q15', type:'fill',
      q:'Choose the correct word：The nervous reporter interviewed the president _____________ (calm / calmly), although he could not think of creative questions.',
      acceptableAnswers:['calmly'],
      explanation:'動詞 interviewed 後面需要副詞來描述動作方式，所以用 calmly（副詞）。' },
    { id:'u3l1-q16', type:'fill',
      q:'There is ONE mistake in the sentence. 請寫出改正後嘅字：Pilots need to concentrate hardly so that they can land the plane safely.',
      acceptableAnswers:['hard'],
      explanation:'「hardly」＝幾乎不（意思完全唔啱！）concentrate hard＝努力集中，hard 本身就係 adj 又係 adv，唔加 -ly！' },
    { id:'u3l1-q17', type:'fill',
      q:'Complete using the correct form (adjective or adverb)，用逗號分隔兩個答案：Helen can speak French _____________ (fluent). Her pronunciation is very _____________ (accurate).',
      acceptableAnswers:['fluently, accurate','fluently accurate'],
      explanation:'speak + adverb → fluently；be verb + adjective → accurate（不加 -ly）。' }
  ],
  u3l2: [
    { id:'u3l2-q18', type:'fill',
      q:'Write a sentence using \'be going to\'：Simon / meet three clients / next month',
      acceptableAnswers:['Simon is going to meet three clients next month'],
      explanation:'Simon＝he → is going to + base verb（meet）。' },
    { id:'u3l2-q19', type:'mcq',
      q:'Choose the correct sentence about future possibility.',
      options:['The architect might builds the tallest building in the world.','The architect mights build the tallest building in the world.','The architect might build the tallest building in the world.','The architect is might to build the tallest building in the world.'],
      answerIndex:2,
      explanation:'答案係 (C)！might + base verb（build）— 唔加 -s、唔加 -ing、唔加 to。',
      wrongNotes:{0:'might 後面唔可以加 -s。',1:'might 本身唔會變化，冇 mights 呢個字。',3:'might 唔可以同 be verb / to 一齊用。'} },
    { id:'u3l2-q20', type:'fill',
      q:'Fill in the blanks with \'is going to\' or \'might\'，用逗號分隔兩個答案：Maggie has already bought her plane ticket. She _____________ fly to Europe next month. She _____________ also visit a friend in Taiwan, but she is not sure yet.',
      acceptableAnswers:['is going to, might','is going to might'],
      explanation:'已買機票＝確定計劃 → is going to fly；唔確定嘅計劃 → might visit。' },
    { id:'u3l2-q21', type:'fill',
      q:'Correct all mistakes in the sentence (there are 2)：Although the lawyer work busily, he might wins the case if he tries hard.',
      acceptableAnswers:['Although the lawyer works busily, he might win the case if he tries hard'],
      explanation:'錯誤①：work → works（第三人稱單數現在式）；錯誤②：might wins → might win（might 後面一定要用 base verb）。' }
  ],
  u4l1: [
    { id:'u4l1-q22', type:'fill',
      q:'Choose \'since\' or \'for\'：Diana has worked as a make-up artist _______________ 2009.',
      acceptableAnswers:['since'],
      explanation:'2009 係一個時間點（point in time）→ 用 since 2009。' },
    { id:'u4l1-q23', type:'fill',
      q:'Choose \'since\' or \'for\'：The director has not taken a rest _______________ twenty hours.',
      acceptableAnswers:['for'],
      explanation:'twenty hours 係一段時間長度（period of time）→ 用 for twenty hours。' },
    { id:'u4l1-q24', type:'fill',
      q:'Write a sentence using the present perfect with \'since\' or \'for\'：Kenny / be a stuntman / 4 years',
      acceptableAnswers:['Kenny has been a stuntman for four years','Kenny has been a stuntman for 4 years'],
      explanation:'時間段（4 years）→ 用 for；present perfect: has been（be 嘅 past participle = been）。' },
    { id:'u4l1-q25', type:'fill',
      q:'Identify and correct the mistake：I have studied Putonghua since four years.',
      acceptableAnswers:['I have studied Putonghua for four years'],
      explanation:'「four years」係時間段，應該用 for。since 後面一定要接時間點，例如 since 2010。' }
  ],
  u4l2: [
    { id:'u4l2-q26', type:'fill',
      q:'Complete using a to-infinitive：The make-up artist told the actress _____________ (not / move).',
      acceptableAnswers:['not to move'],
      explanation:'told + object + not to + base verb（否定 to-infinitive = not to + verb）。' },
    { id:'u4l2-q27', type:'fill',
      q:'Rewrite using a to-infinitive and the verb in brackets：\'Please try acting,\' the drama teacher said to Gary. (encourage)',
      acceptableAnswers:['The drama teacher encouraged Gary to try acting'],
      explanation:'encourage + someone + to + base verb（try）— 呢個係 reported speech 嘅 to-infinitive 用法。' },
    { id:'u4l2-q28', type:'mcq',
      q:'Choose the INCORRECT sentence.',
      options:['Emma decided to put on the green costume.','Joe refuses to add special effects to the film.','The cameraman reminded the extras not to look at the camera.','Leon likes discuss his fashion ideas with the costume designer.'],
      answerIndex:3,
      explanation:'答案係 (D)！錯誤在於 "likes discuss"，應該係 "likes to discuss" 或 "likes discussing"（不可以省略 to 或 -ing）。',
      wrongNotes:{0:'decide + to-infinitive，正確。',1:'refuse + to-infinitive，正確。',2:'remind + someone + not to + verb，正確。'} }
  ],
  u5l1: [
    { id:'u5l1-q29', type:'fill',
      q:'Change to passive voice：People recycle old bottles.',
      acceptableAnswers:['Old bottles are recycled'],
      explanation:'bottles（複數）→ are + past participle（recycled）。' },
    { id:'u5l1-q30', type:'fill',
      q:'Change to passive voice. Add \'by\' where needed：Lorries give off exhaust fumes.',
      acceptableAnswers:['Exhaust fumes are given off by lorries'],
      explanation:'fumes（複數）→ are given off；做動作者 lorries 要用 by 連接。' },
    { id:'u5l1-q31', type:'fill',
      q:'用被動語態完成，依序用逗號分隔三個答案：Black City: The rivers (cover) ________ in oil spills. The sky (fill) ________ with smog. Litter (throw) ________ everywhere.',
      acceptableAnswers:['are covered, is filled, is thrown','are covered is filled is thrown'],
      explanation:'rivers（複數）→ are covered；sky（單數）→ is filled；litter（不可數，作單數）→ is thrown。' }
  ],
  u5l2: [
    { id:'u5l2-q32', type:'fill',
      q:'"Where is this vase from?" 用逗號分隔三個答案（made in / made by / made from）："It\'s ______ Hong Kong. It\'s ______ Tin Can Company. It\'s ______ recycled cans."',
      acceptableAnswers:['made in, made by, made from','made in made by made from'],
      explanation:'香港（地點）→ made in；Tin Can Company（品牌）→ made by；recycled cans（材料）→ made from。' },
    { id:'u5l2-q33', type:'mcq',
      q:'Identify the sentence with the WRONG preposition.',
      options:['The shirt is made by Victory Fashion.','The toy bus is made from a drink carton.','The cushion is made by Malaysia.','The fan is made in China.'],
      answerIndex:2,
      explanation:'答案係 (C)！Malaysia 係地點，應該用 made in Malaysia。made by 後面要接人／品牌，唔可以接地名。',
      wrongNotes:{0:'品牌名，用 made by 正確。',1:'材料，用 made from 正確。',3:'地點，用 made in 正確。'} },
    { id:'u5l2-q34', type:'fill',
      q:'Write THREE sentences about a product using \'made in\', \'made by\' and \'made from\'：Product: a handbag　Country: Italy　Brand: Bella Fashion　Material: old leather',
      matchMode:'contains-all',
      requiredPhrases:['made in italy','made by bella fashion','made from old leather'],
      explanation:'The handbag is made in Italy. / The handbag is made by Bella Fashion. / The handbag is made from old leather.' },
    { id:'u5l2-q35', type:'fill',
      q:'🌟 挑戰題（Mixed all units）：呢段有 3 個錯誤，請重寫改正：\n"Although the teacher is too patiently, the students does not listen careful. If you will study hard, you might passes the exam. The pencils are made by wood."',
      matchMode:'contains-threshold', threshold:3,
      requiredPhrases:['too patient','listen carefully','if you study hard','might pass the exam','made from wood'],
      explanation:'正確版本：「Although the teacher is too patient, the students do not listen carefully. If you study hard, you might pass the exam. The pencils are made from wood.」錯誤①：too patiently → too patient（too + 形容詞，唔用副詞）；錯誤②：will study → study（first conditional 嘅 if-clause 唔用 will）；錯誤③：made by wood → made from wood（wood 係材料，要用 made from）。' }
  ],
  verb: [
    { id:'verb-q1', type:'mcq', q:'"go" 嘅過去式 (past simple) 係咩？',
      options:['goed','went','gone','going'], answerIndex:1,
      explanation:'go 係不規則動詞：go（原形）→ went（過去式）→ gone（過去分詞）。',
      wrongNotes:{0:'go 唔規則，冇 goed 呢個字。',2:'gone 係過去分詞，唔係過去式。',3:'going 係現在分詞。'} },
    { id:'verb-q2', type:'mcq', q:'"eat" 嘅過去分詞 (past participle) 係咩？',
      options:['ate','eaten','eating','eats'], answerIndex:1,
      explanation:'eat → ate（過去式）→ eaten（過去分詞）。過去分詞常用喺 has/have/had 或被動語態後面。',
      wrongNotes:{0:'ate 係過去式，唔係過去分詞。',2:'eating 係現在分詞。',3:'eats 係第三人稱單數現在式。'} },
    { id:'verb-q3', type:'mcq', q:'"write" 嘅過去式係咩？',
      options:['writed','wrote','written','writing'], answerIndex:1,
      explanation:'write → wrote（過去式）→ written（過去分詞）。',
      wrongNotes:{0:'write 唔規則，冇 writed 呢個字。',2:'written 係過去分詞。',3:'writing 係現在分詞。'} },
    { id:'verb-q4', type:'fill', q:'"study" 嘅過去式係咩？（提示：y 變 ied）',
      acceptableAnswers:['studied'], explanation:'子音字母 + y 結尾嘅動詞，過去式要將 y 變做 ied：study → studied。' },
    { id:'verb-q5', type:'fill', q:'"stop" 嘅過去式係咩？（提示：重複字尾子音）',
      acceptableAnswers:['stopped'], explanation:'短母音 + 單一子音結尾嘅動詞，過去式要重複字尾子音再加 ed：stop → stopped。' },
    { id:'verb-q6', type:'mcq', q:'邊個係啱嘅 base verb 用法？',
      options:['can goes','can go','can going','can went'], answerIndex:1,
      explanation:'modal verb（can/will/might等）後面一定要用 base verb（原形），唔加 -s、-ing 或變過去式：can go 正確。',
      wrongNotes:{0:'can 後面唔可以加 -s。',2:'can 後面唔可以加 -ing。',3:'can 後面唔可以用過去式。'} },
    { id:'verb-q7', type:'fill', q:'"buy" 嘅過去式同過去分詞都係咩？',
      acceptableAnswers:['bought'], explanation:'buy → bought → bought。過去式同過去分詞係同一個字，屬於不規則動詞。' },
    { id:'verb-q8', type:'mcq', q:'"take" 嘅過去分詞係咩？',
      options:['took','taken','taking','takes'], answerIndex:1,
      explanation:'take → took（過去式）→ taken（過去分詞）。',
      wrongNotes:{0:'took 係過去式。',2:'taking 係現在分詞。',3:'takes 係第三人稱單數現在式。'} },
    { id:'verb-q9', type:'mcq', q:'"give" 嘅過去分詞係咩？',
      options:['gave','given','giving','gives'], answerIndex:1,
      explanation:'give → gave（過去式）→ given（過去分詞）。',
      wrongNotes:{0:'gave 係過去式。',2:'giving 係現在分詞。',3:'gives 係第三人稱單數現在式。'} },
    { id:'verb-q10', type:'fill', q:'完成句子：He _____ (break) the vase yesterday.',
      acceptableAnswers:['broke'], explanation:'"yesterday" 提示要用過去式：break → broke。' },
    { id:'verb-q11', type:'mcq', q:'"see" 嘅過去分詞係咩？',
      options:['saw','seen','seeing','sees'], answerIndex:1,
      explanation:'see → saw（過去式）→ seen（過去分詞）。',
      wrongNotes:{0:'saw 係過去式。',2:'seeing 係現在分詞。',3:'sees 係第三人稱單數現在式。'} },
    { id:'verb-q12', type:'fill', q:'"catch" 嘅過去式係咩？',
      acceptableAnswers:['caught'], explanation:'catch → caught → caught，屬於不規則動詞。' }
  ],
  tense: [
    { id:'tense-q1', type:'mcq', q:'I _____ to school every day.',
      options:['go','went','am going','have gone'], answerIndex:0,
      explanation:'"every day" 係習慣性動作嘅訊號詞，要用 simple present：go。',
      wrongNotes:{1:'went 係過去式，同 "every day" 唔夾。',2:'am going 係現在進行式，用喺此刻正在發生嘅事。',3:'have gone 係現在完成式。'} },
    { id:'tense-q2', type:'mcq', q:'Look! It _____ (rain).',
      options:['rains','rained','is raining','has rained'], answerIndex:2,
      explanation:'"Look!" 提示緊係「此刻正在發生」，要用 present continuous：is raining。',
      wrongNotes:{0:'rains 係一般現在式，用喺習慣性動作。',1:'rained 係過去式。',3:'has rained 係現在完成式。'} },
    { id:'tense-q3', type:'mcq', q:'She _____ (finish) her homework already.',
      options:['finishes','finished','is finishing','has finished'], answerIndex:3,
      explanation:'"already" 係 present perfect 嘅訊號詞：has finished。',
      wrongNotes:{0:'finishes 係一般現在式。',1:'finished 係一般過去式，冇同 already 一齊用嘅慣例。',2:'is finishing 係現在進行式。'} },
    { id:'tense-q4', type:'mcq', q:'They _____ (visit) Japan last year.',
      options:['visit','visited','have visited','are visiting'], answerIndex:1,
      explanation:'"last year" 係明確過去時間點，要用 simple past：visited。',
      wrongNotes:{0:'visit 係一般現在式。',2:'have visited 唔會同明確過去時間（last year）一齊用。',3:'are visiting 係現在進行式。'} },
    { id:'tense-q5', type:'mcq', q:'We _____ (go) to the cinema tomorrow.',
      options:['go','went','will go','have gone'], answerIndex:2,
      explanation:'"tomorrow" 係未來時間訊號詞，要用未來式：will go。',
      wrongNotes:{0:'go 係一般現在式。',1:'went 係過去式。',3:'have gone 係現在完成式。'} },
    { id:'tense-q6', type:'mcq', q:'邊個字係 present perfect 嘅常見訊號詞？',
      options:['yesterday','already','next week','now'], answerIndex:1,
      explanation:'already（已經）係 present perfect 嘅典型訊號詞。',
      wrongNotes:{0:'yesterday 係 simple past 嘅訊號詞。',2:'next week 係未來式嘅訊號詞。',3:'now 通常用喺 present continuous。'} },
    { id:'tense-q7', type:'mcq', q:'He _____ (play) football every Sunday.',
      options:['plays','played','is playing','has played'], answerIndex:0,
      explanation:'"every Sunday" 係習慣性動作，要用 simple present：plays（第三人稱單數加 -s）。',
      wrongNotes:{1:'played 係過去式。',2:'is playing 係現在進行式。',3:'has played 係現在完成式。'} },
    { id:'tense-q8', type:'mcq', q:'I _____ (do) my homework now.',
      options:['do','did','am doing','have done'], answerIndex:2,
      explanation:'"now" 提示此刻正在發生，要用 present continuous：am doing。',
      wrongNotes:{0:'do 係一般現在式。',1:'did 係過去式。',3:'have done 係現在完成式。'} },
    { id:'tense-q9', type:'fill', q:'She has lived here _____ 2010.',
      acceptableAnswers:['since'], explanation:'2010 係時間點，present perfect 配時間點要用 since。' },
    { id:'tense-q10', type:'mcq', q:'Water _____ (boil) at 100°C.',
      options:['boils','boiled','is boiling','will boil'], answerIndex:0,
      explanation:'呢句講緊自然規律／科學事實，要用 simple present：boils。',
      wrongNotes:{1:'boiled 係過去式，唔啱用嚟講永恆事實。',2:'is boiling 係現在進行式。',3:'will boil 係未來式。'} },
    { id:'tense-q11', type:'mcq', q:'I _____ (see) that movie already.',
      options:['see','saw','have seen','am seeing'], answerIndex:2,
      explanation:'"already" 提示要用 present perfect：have seen。',
      wrongNotes:{0:'see 係一般現在式。',1:'saw 係過去式，冇同 already 一齊用嘅慣例。',3:'am seeing 係現在進行式。'} },
    { id:'tense-q12', type:'fill', q:'They _____ (not / finish) the project yet.',
      acceptableAnswers:['have not finished','havent finished','have not finished the project'],
      explanation:'"yet" 係 present perfect 否定句嘅訊號詞：have not finished。' }
  ]
};

/* ======================================================================
   3. READING COMPREHENSION PASSAGES
   ====================================================================== */
var READING_PASSAGES = [
  { id:'reading1', title:'The Grammar Spell of Hogwarts',
    text:'Tommy was a young wizard at Hogwarts School of Witchcraft and Wizardry. Every Monday, Professor McGrammar taught a special class called "Spells of Sentences". In this class, students learned magic words that could fix broken sentences.\n\n'+
      'One day, Professor McGrammar gave Tommy a challenge. "If you mix the Potion of Present and the Potion of Past correctly," she said, "you will create the strongest spell in the school." Tommy was very nervous, but he practiced every night in the library.\n\n'+
      'On the day of the test, Tommy stood in front of the whole class. Although his hands were shaking, he did not give up. He said the magic words slowly and clearly. Suddenly, a beautiful golden light appeared above his wand!\n\n'+
      '"Well done, Tommy!" said Professor McGrammar. "You have practiced hard since September, and now you are the best young grammar wizard in your class." Tommy smiled proudly. He knew that practice, not luck, made him a true wizard.',
    questions:[
      { id:'r1-q1', type:'mcq', q:'Who is Tommy\'s teacher?',
        options:['Professor McGonagall','Professor McGrammar','Professor Dumbledore','Professor Snape'], answerIndex:1,
        explanation:'文章第一段講到 "Professor McGrammar taught a special class"，所以答案係 Professor McGrammar。' },
      { id:'r1-q2', type:'mcq', q:'What day is the special class held?',
        options:['Sunday','Monday','Friday','Saturday'], answerIndex:1,
        explanation:'文章話 "Every Monday, Professor McGrammar taught a special class"。' },
      { id:'r1-q3', type:'mcq', q:'What did Tommy do to prepare for the test?',
        options:['He slept all day.','He practiced every night in the library.','He asked his friends to do it for him.','He read comic books.'], answerIndex:1,
        explanation:'文章第二段講到 "he practiced every night in the library"。' },
      { id:'r1-q4', type:'mcq', q:'What happened after Tommy said the magic words?',
        options:['Nothing happened.','A golden light appeared above his wand.','He fell asleep.','The classroom disappeared.'], answerIndex:1,
        explanation:'文章話 "Suddenly, a beautiful golden light appeared above his wand!"' },
      { id:'r1-q5', type:'mcq', q:'According to the teacher, what made Tommy a true wizard?',
        options:['Luck','Magic potions','Practice','A magic wand'], answerIndex:2,
        explanation:'文章結尾話 "He knew that practice, not luck, made him a true wizard."' },
      { id:'r1-q6', type:'fill', q:'Complete the sentence from the passage: "Although his hands were shaking, he did not _____."',
        acceptableAnswers:['give up'], explanation:'文章原句：「Although his hands were shaking, he did not give up.」呢個亦係 although 對比句嘅例子！' }
    ] }
];

/* ======================================================================
   3b. DICTATION SETS (默書) — audio-only, self-checked on paper
   ====================================================================== */
var DICTATION_SETS = [
  { id:'dictset1', title:'核心生字默書 Unit 1-5', icon:'🖋️', type:'word',
    items:[
      { id:'dictset1-w1', text:'umbrella' }, { id:'dictset1-w2', text:'sunscreen' },
      { id:'dictset1-w3', text:'shelf' }, { id:'dictset1-w4', text:'director' },
      { id:'dictset1-w5', text:'stuntman' }, { id:'dictset1-w6', text:'costume' },
      { id:'dictset1-w7', text:'exhaust' }, { id:'dictset1-w8', text:'recycled' },
      { id:'dictset1-w9', text:'leather' }, { id:'dictset1-w10', text:'architect' },
      { id:'dictset1-w11', text:'client' }, { id:'dictset1-w12', text:'artist' },
      { id:'dictset1-w13', text:'encourage' }, { id:'dictset1-w14', text:'decide' },
      { id:'dictset1-w15', text:'remind' }
    ] },
  { id:'dictset2', title:'佳句默書 Unit 1-5', icon:'📜', type:'sentence',
    items:[
      { id:'dictset2-s1', text:'If you mix red and yellow, you get orange.' },
      { id:'dictset2-s2', text:'The bag is too heavy to carry.' },
      { id:'dictset2-s3', text:'Although Helen is ill, she still goes to school.' },
      { id:'dictset2-s4', text:'Diana has worked here since 2009.' },
      { id:'dictset2-s5', text:'The director told the stuntman to jump higher.' },
      { id:'dictset2-s6', text:'Old bottles are recycled every day.' },
      { id:'dictset2-s7', text:'The shirt is made by Victory Fashion.' },
      { id:'dictset2-s8', text:'If it rains, I will stay at home.' }
    ] }
];
function getAllDictationSets(){ return DICTATION_SETS.concat(state.dictationSets); }
function findDictationSet(setId){ return getAllDictationSets().find(function(s){ return s.id===setId; }); }

/* ======================================================================
   4. BADGES
   ====================================================================== */
var ALL_BADGES = [
  { id:'first_steps', emoji:'🥇', name:'第一步' },
  { id:'perfect_score', emoji:'🌟', name:'完美挑戰' },
  { id:'level5', emoji:'🔥', name:'5級魔法師' },
  { id:'level10', emoji:'👑', name:'10級大魔法師' },
  { id:'streak3', emoji:'📅', name:'連續3天' },
  { id:'streak7', emoji:'🏅', name:'連續7天' },
  { id:'all_units', emoji:'🧙', name:'十關全通' },
  { id:'wrong_master', emoji:'🧹', name:'錯題清零' },
  { id:'reading_master', emoji:'📚', name:'閱讀高手' }
];

/* ======================================================================
   5. STATE MANAGEMENT
   ====================================================================== */
var STORAGE_KEY = 'hea_state_v1';
var state = null;

function defaultState(){
  return {
    profile: { name:'', house:'gryffindor', level:1, xp:0, coins:0, streak:0, lastLoginDate:null, badges:[], createdAt: todayStr() },
    settings: { musicOn:false, musicVolume:50, sfxOn:true, ttsRate:90, timerMode:false },
    progress: {},
    wrongQuestions: [],
    customQuestions: [],
    dailyLog: [],
    parent: { pin:'0000' },
    dailyRewardClaimedDate: null,
    dictationSets: [],
    dictationProgress: {},
    dictationWrong: []
  };
}

function loadState(){
  try{
    var raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    var parsed = JSON.parse(raw);
    var def = defaultState();
    return Object.assign(def, parsed, {
      profile: Object.assign(def.profile, parsed.profile||{}),
      settings: Object.assign(def.settings, parsed.settings||{}),
      progress: parsed.progress || {},
      wrongQuestions: parsed.wrongQuestions || [],
      customQuestions: parsed.customQuestions || [],
      dailyLog: parsed.dailyLog || [],
      parent: Object.assign(def.parent, parsed.parent||{}),
      dictationSets: parsed.dictationSets || [],
      dictationProgress: parsed.dictationProgress || {},
      dictationWrong: parsed.dictationWrong || []
    });
  }catch(e){ return defaultState(); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

/* ======================================================================
   6. AUDIO ENGINE — Web Audio API (no external files, fully offline)
   ====================================================================== */
var AudioEngine = (function(){
  var ctx = null;
  var musicGain = null;
  var musicTimer = null;
  var musicStep = 0;
  var melody = [392,440,494,523,494,440,392,330,349,392,440,392,330,294,330,392];

  function ensureCtx(){
    if(!ctx){
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      musicGain = ctx.createGain();
      musicGain.gain.value = (state.settings.musicVolume/100) * 0.18;
      musicGain.connect(ctx.destination);
    }
    if(ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playTone(freq, dur, type, vol, delay){
    try{
      var c = ensureCtx();
      var osc = c.createOscillator();
      var g = c.createGain();
      osc.type = type || 'square';
      osc.frequency.value = freq;
      var t0 = c.currentTime + (delay||0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime((vol||0.15), t0+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
      osc.connect(g); g.connect(c.destination);
      osc.start(t0); osc.stop(t0+dur+0.02);
    }catch(e){}
  }

  function sfx(name){
    if(!state.settings.sfxOn) return;
    if(name==='correct'){ playTone(523,0.12,'square',0.16,0); playTone(659,0.12,'square',0.16,0.1); playTone(784,0.18,'square',0.18,0.2); }
    else if(name==='wrong'){ playTone(180,0.25,'sawtooth',0.15,0); playTone(140,0.3,'sawtooth',0.15,0.12); }
    else if(name==='coin'){ playTone(988,0.08,'square',0.15,0); playTone(1318,0.14,'square',0.16,0.07); }
    else if(name==='levelup'){ playTone(523,0.12,'triangle',0.18,0); playTone(659,0.12,'triangle',0.18,0.12); playTone(784,0.12,'triangle',0.18,0.24); playTone(1046,0.25,'triangle',0.2,0.36); }
    else if(name==='click'){ playTone(440,0.05,'square',0.08,0); }
    else if(name==='tick'){ playTone(880,0.04,'sine',0.06,0); }
  }

  function startMusic(){
    if(!state.settings.musicOn) return;
    ensureCtx();
    if(musicTimer) return;
    musicTimer = setInterval(function(){
      if(!state.settings.musicOn) return;
      var note = melody[musicStep % melody.length];
      musicStep++;
      try{
        var c = ensureCtx();
        var osc = c.createOscillator();
        var g = c.createGain();
        osc.type = 'triangle';
        osc.frequency.value = note;
        var t0 = c.currentTime;
        var vol = (state.settings.musicVolume/100) * 0.2;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol+0.001, t0+0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t0+0.55);
        osc.connect(g); g.connect(c.destination);
        osc.start(t0); osc.stop(t0+0.6);
      }catch(e){}
    }, 420);
  }
  function stopMusic(){ if(musicTimer){ clearInterval(musicTimer); musicTimer=null; } }
  function setVolume(v){ if(musicGain) musicGain.gain.value = (v/100)*0.18; }

  return { sfx:sfx, startMusic:startMusic, stopMusic:stopMusic, setVolume:setVolume, ensureCtx:ensureCtx };
})();

function speakText(text){
  try{
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    var hkVoice = voices.find(function(v){ return /zh-HK/i.test(v.lang); }) ||
                  voices.find(function(v){ return /yue/i.test(v.lang); }) ||
                  voices.find(function(v){ return /zh-TW/i.test(v.lang); }) ||
                  voices.find(function(v){ return /zh/i.test(v.lang); });
    if(hkVoice) utter.voice = hkVoice;
    utter.lang = (hkVoice && hkVoice.lang) || 'zh-HK';
    utter.rate = clamp((state.settings.ttsRate||90)/100, 0.5, 1.5);
    window.speechSynthesis.speak(utter);
  }catch(e){}
}

function speakEnglish(text, rate){
  try{
    if(!('speechSynthesis' in window)) { showToast('呢部裝置唔支援語音朗讀'); return; }
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    var enVoice = voices.find(function(v){ return /en-GB/i.test(v.lang); }) ||
                  voices.find(function(v){ return /en-US/i.test(v.lang); }) ||
                  voices.find(function(v){ return /^en/i.test(v.lang); });
    if(enVoice) utter.voice = enVoice;
    utter.lang = (enVoice && enVoice.lang) || 'en-US';
    utter.rate = clamp(rate || 0.8, 0.4, 1.2);
    window.speechSynthesis.speak(utter);
  }catch(e){}
}

/* ======================================================================
   7. PARTICLE EFFECTS (canvas)
   ====================================================================== */
var ParticleFX = (function(){
  var canvas, ctx, particles = [], running = false;
  function init(){
    canvas = $('#particle-canvas');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }
  function resize(){
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth+'px';
    canvas.style.height = window.innerHeight+'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  var colors = ['#ffd45e','#3ec46d','#e6473f','#1a5c3a','#ffffff','#ff9f4a'];
  function burst(x,y,count){
    for(var i=0;i<(count||40);i++){
      var angle = Math.random()*Math.PI*2;
      var speed = 2 + Math.random()*5;
      particles.push({
        x:x, y:y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed - 2,
        size: 4+Math.random()*5, life: 1, color: colors[Math.floor(Math.random()*colors.length)],
        rot: Math.random()*360, vr:(Math.random()-0.5)*20
      });
    }
    if(!running){ running=true; requestAnimationFrame(loop); }
  }
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var alive = [];
    for(var i=0;i<particles.length;i++){
      var p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.018; p.rot += p.vr;
      if(p.life > 0){
        ctx.save();
        ctx.globalAlpha = clamp(p.life,0,1);
        ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
        ctx.restore();
        alive.push(p);
      }
    }
    particles = alive;
    if(particles.length>0){ requestAnimationFrame(loop); } else { running=false; }
  }
  return { init:init, burst:burst };
})();

/* ======================================================================
   8. TOASTS
   ====================================================================== */
function showToast(msg){
  var c = $('#toast-container');
  var t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 3200);
}

/* ======================================================================
   9. SCREEN NAVIGATION
   ====================================================================== */
function showScreen(id){
  $all('.screen').forEach(function(s){ s.classList.remove('active'); });
  var target = $('#'+id);
  if(target) target.classList.add('active');
  window.scrollTo(0,0);
  var t = target; if(t) t.scrollTop = 0;
  adjustTopbarPadding();
}

function adjustTopbarPadding(){
  var topbar = $('#topbar');
  var frames = $all('.game-frame');
  if(!topbar || topbar.classList.contains('hidden')){
    $all('.screen').forEach(function(s){ s.style.paddingTop = ''; });
    frames.forEach(function(f){ f.style.height = window.innerHeight+'px'; });
    return;
  }
  var h = topbar.getBoundingClientRect().height;
  $all('.screen').forEach(function(s){ s.style.paddingTop = (h+12)+'px'; });
  frames.forEach(function(f){ f.style.height = (window.innerHeight - h - 12)+'px'; });
}
window.addEventListener('resize', function(){ adjustTopbarPadding(); });

/* ======================================================================
   10. XP / LEVEL / COINS / BADGES
   ====================================================================== */
function xpForLevel(level){ return 100 + (level-1)*50; }

function updateTopbar(){
  $('#player-name').textContent = state.profile.name || '巫師';
  var houseIcons = { gryffindor:'🦁', slytherin:'🐍', ravenclaw:'🦅', hufflepuff:'🦡' };
  $('#player-house-icon').textContent = houseIcons[state.profile.house] || '🦁';
  $('#player-level').textContent = state.profile.level;
  var need = xpForLevel(state.profile.level);
  $('#xp-fill').style.width = clamp((state.profile.xp/need)*100,0,100) + '%';
  $('#xp-text').textContent = state.profile.xp + ' / ' + need + ' XP';
  $('#player-coins').textContent = state.profile.coins;
  $('#player-streak').textContent = state.profile.streak;
  adjustTopbarPadding();
}

function addXP(amount){
  state.profile.xp += amount;
  var leveledUp = false;
  while(state.profile.xp >= xpForLevel(state.profile.level)){
    state.profile.xp -= xpForLevel(state.profile.level);
    state.profile.level++;
    leveledUp = true;
  }
  if(leveledUp){
    AudioEngine.sfx('levelup');
    $('#levelup-new-level').textContent = state.profile.level;
    $('#modal-levelup').classList.remove('hidden');
    if(state.profile.level>=5) unlockBadge('level5');
    if(state.profile.level>=10) unlockBadge('level10');
  }
  saveState();
  updateTopbar();
}
function addCoins(amount){
  state.profile.coins += amount;
  if(amount>0) AudioEngine.sfx('coin');
  saveState();
  updateTopbar();
}
function unlockBadge(id){
  if(state.profile.badges.indexOf(id) === -1){
    state.profile.badges.push(id);
    saveState();
    var b = ALL_BADGES.find(function(x){ return x.id===id; });
    if(b) showToast('🏅 解鎖新徽章：'+b.name+'！');
  }
}

/* ======================================================================
   11. DAILY LOGIN REWARDS
   ====================================================================== */
function checkDailyLogin(){
  var today = todayStr();
  var last = state.profile.lastLoginDate;
  if(last === today) return;
  if(last){
    var diff = daysBetween(last, today);
    if(diff === 1){ state.profile.streak++; }
    else if(diff > 1){ state.profile.streak = 1; }
  } else {
    state.profile.streak = 1;
  }
  state.profile.lastLoginDate = today;
  saveState();
  if(state.profile.streak>=3) unlockBadge('streak3');
  if(state.profile.streak>=7) unlockBadge('streak7');
  updateTopbar();
  if(state.dailyRewardClaimedDate !== today){
    openDailyRewardModal();
  }
}
function openDailyRewardModal(){
  var day = ((state.profile.streak-1) % 7) + 1;
  $('#daily-reward-day-text').textContent = '連續登入第 '+state.profile.streak+' 天';
  var track = $('#daily-reward-track');
  track.innerHTML = '';
  for(var i=1;i<=7;i++){
    var div = document.createElement('div');
    div.className = 'reward-day' + (i<day ? ' claimed' : '') + (i===day ? ' today' : '');
    div.innerHTML = '<span>Day '+i+'</span><span>'+(i===7?'🎁🎁':'🪙')+'</span>';
    track.appendChild(div);
  }
  var coinReward = 10 + day*5;
  var xpReward = 5 + day*3;
  $('#daily-reward-earned').textContent = '今日獎勵： +'+coinReward+' 金幣　+'+xpReward+' 經驗值'+(day===7?'　🎉加碼獎勵！':'');
  $('#modal-daily-reward').dataset.coin = coinReward;
  $('#modal-daily-reward').dataset.xp = xpReward;
  $('#modal-daily-reward').classList.remove('hidden');
}

/* ======================================================================
   12. PROGRESS TRACKING
   ====================================================================== */
function getModuleQuestions(moduleId){
  var built = QUESTION_BANK[moduleId] || [];
  var custom = state.customQuestions.filter(function(q){ return q.module === moduleId; });
  return built.concat(custom);
}
function recordAnswer(moduleId, isCorrect){
  if(!state.progress[moduleId]) state.progress[moduleId] = { attempted:0, correct:0 };
  state.progress[moduleId].attempted++;
  if(isCorrect) state.progress[moduleId].correct++;
  saveState();
}
function moduleAccuracy(moduleId){
  var p = state.progress[moduleId];
  if(!p || p.attempted===0) return null;
  return Math.round((p.correct/p.attempted)*100);
}

/* ======================================================================
   12b. DAILY ACTIVITY LOG
   ====================================================================== */
function recordDailyLog(moduleId, total, correct, durationSec){
  state.dailyLog.push({
    date: todayStr(),
    module: moduleId,
    total: total,
    correct: correct,
    durationSec: durationSec,
    ts: Date.now()
  });
  pruneDailyLog();
  saveState();
}
function pruneDailyLog(){
  var today = todayStr();
  state.dailyLog = state.dailyLog.filter(function(e){ return daysBetween(e.date, today) <= 90; });
}

/* ======================================================================
   13. WRONG QUESTION SYSTEM
   ====================================================================== */
function recordWrongQuestion(q, moduleId){
  var existing = state.wrongQuestions.find(function(w){ return w.qId === q.id; });
  if(existing){ existing.timesWrong++; existing.mastered = false; existing.lastWrongAt = Date.now(); }
  else {
    state.wrongQuestions.push({ qId:q.id, module:moduleId, timesWrong:1, mastered:false, lastWrongAt: Date.now() });
  }
  saveState();
}
function markWrongMastered(qId){
  var w = state.wrongQuestions.find(function(x){ return x.qId===qId; });
  if(w) w.mastered = true;
  saveState();
}
function findQuestionById(qId){
  for(var mod in QUESTION_BANK){
    var found = QUESTION_BANK[mod].find(function(q){ return q.id===qId; });
    if(found) return found;
  }
  for(var i=0;i<READING_PASSAGES.length;i++){
    var found2 = READING_PASSAGES[i].questions.find(function(q){ return q.id===qId; });
    if(found2) return found2;
  }
  var custom = state.customQuestions.find(function(q){ return q.id===qId; });
  if(custom) return custom;
  return null;
}

/* ======================================================================
   14. QUIZ ENGINE
   ====================================================================== */
var quizSession = null;

function startQuiz(moduleId, questions, opts){
  opts = opts || {};
  quizSession = {
    moduleId: moduleId,
    questions: shuffle(questions),
    index: 0,
    correctCount: 0,
    xpEarned: 0,
    coinsEarned: 0,
    sessionWrong: [],
    timerMode: opts.timerMode || false,
    timerInterval: null,
    passage: opts.passage || null,
    isWrongRetry: opts.isWrongRetry || false,
    startTime: Date.now()
  };
  showScreen('screen-quiz');
  renderQuestion();
}

function currentQuestion(){ return quizSession.questions[quizSession.index]; }

function renderQuestion(){
  var q = currentQuestion();
  var total = quizSession.questions.length;
  $('#quiz-progress-text').textContent = '第 '+(quizSession.index+1)+' / '+total+' 題';
  $('#quiz-progress-fill').style.width = Math.round((quizSession.index/total)*100)+'%';
  $('#quiz-question-text').textContent = q.q;
  $('#feedback-box').classList.add('hidden');
  $('#quiz-card').classList.remove('flash-correct','flash-wrong');

  var passageBox = $('#quiz-passage-box');
  if(quizSession.passage){
    passageBox.classList.remove('hidden');
    passageBox.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">'+
      '<div style="white-space:pre-line;">'+quizSession.passage.text+'</div>'+
      '<button class="icon-btn speaker-btn" id="btn-speak-passage" title="讀出文章">🔊</button></div>';
    $('#btn-speak-passage').onclick = function(){ speakText(quizSession.passage.text); };
  } else {
    passageBox.classList.add('hidden');
    passageBox.innerHTML = '';
  }

  var optsWrap = $('#quiz-options');
  var fillWrap = $('#quiz-fill-wrap');
  optsWrap.innerHTML = '';
  if(q.type === 'mcq'){
    fillWrap.classList.add('hidden');
    optsWrap.classList.remove('hidden');
    q.options.forEach(function(opt, idx){
      var btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = String.fromCharCode(65+idx) + '. ' + opt;
      btn.dataset.idx = idx;
      btn.onclick = function(){
        AudioEngine.sfx('click');
        $all('.quiz-option-btn', optsWrap).forEach(function(b){ b.classList.remove('selected'); });
        btn.classList.add('selected');
        optsWrap.dataset.selected = idx;
      };
      optsWrap.appendChild(btn);
    });
  } else {
    optsWrap.classList.add('hidden');
    fillWrap.classList.remove('hidden');
    $('#quiz-fill-input').value = '';
  }

  $('#btn-submit-answer').classList.remove('hidden');
  $('#btn-submit-answer').disabled = false;

  if(quizSession.timerMode){
    $('#timer-wrap').classList.remove('hidden');
    startTimer();
  } else {
    $('#timer-wrap').classList.add('hidden');
  }
}

function startTimer(){
  clearInterval(quizSession.timerInterval);
  var timeLeft = 30;
  var timerFill = $('#timer-fill');
  var timerText = $('#timer-text');
  timerFill.style.width = '100%';
  timerFill.classList.remove('warn','danger');
  timerText.textContent = timeLeft;
  quizSession.timerInterval = setInterval(function(){
    timeLeft--;
    timerText.textContent = timeLeft;
    timerFill.style.width = (timeLeft/30*100)+'%';
    if(timeLeft<=10) timerFill.classList.add('warn');
    if(timeLeft<=5){ timerFill.classList.add('danger'); AudioEngine.sfx('tick'); }
    if(timeLeft<=0){
      clearInterval(quizSession.timerInterval);
      submitAnswer(true);
    }
  }, 1000);
}

function submitAnswer(timedOut){
  clearInterval(quizSession.timerInterval);
  var q = currentQuestion();
  var isCorrect = false;
  var userAnswerText = '';

  if(timedOut){
    isCorrect = false;
  } else if(q.type === 'mcq'){
    var optsWrap = $('#quiz-options');
    var selected = optsWrap.dataset.selected;
    if(selected === undefined){ showToast('請先選擇一個答案！'); return; }
    isCorrect = parseInt(selected,10) === q.answerIndex;
    userAnswerText = q.options[parseInt(selected,10)];
    $all('.quiz-option-btn', optsWrap).forEach(function(b){
      b.disabled = true;
      var idx = parseInt(b.dataset.idx,10);
      if(idx === q.answerIndex) b.classList.add('correct');
      else if(idx === parseInt(selected,10) && !isCorrect) b.classList.add('wrong');
    });
  } else {
    userAnswerText = $('#quiz-fill-input').value;
    if(!userAnswerText.trim() && !timedOut){ showToast('請輸入答案！'); return; }
    isCorrect = checkFillAnswer(q, userAnswerText);
  }

  $('#btn-submit-answer').classList.add('hidden');
  var fb = $('#feedback-box');
  fb.classList.remove('hidden');
  var resultEl = $('#feedback-result');
  var quizCard = $('#quiz-card');

  if(isCorrect){
    resultEl.textContent = timedOut ? '⏰ 時間到！' : '🎉 答對了！';
    resultEl.className = 'feedback-result is-correct';
    quizCard.classList.add('flash-correct');
    AudioEngine.sfx('correct');
    var rect = quizCard.getBoundingClientRect();
    ParticleFX.burst(rect.left+rect.width/2, rect.top+rect.height/2, 50);
    quizSession.correctCount++;
    var xpGain = 10, coinGain = 5;
    quizSession.xpEarned += xpGain; quizSession.coinsEarned += coinGain;
    addXP(xpGain); addCoins(coinGain);
    if(quizSession.isWrongRetry) markWrongMastered(q.id);
  } else {
    resultEl.textContent = timedOut ? '⏰ 時間到！答錯咗～' : '❌ 答錯咗，唔緊要，睇下解釋！';
    resultEl.className = 'feedback-result is-wrong';
    quizCard.classList.add('flash-wrong');
    AudioEngine.sfx('wrong');
    quizSession.sessionWrong.push(q.id);
    recordWrongQuestion(q, quizSession.moduleId);
    addXP(2);
  }
  recordAnswer(quizSession.moduleId, isCorrect);

  var explanationText = q.explanation || '';
  if(q.type === 'fill' && !isCorrect){
    var correctDisplay = (q.acceptableAnswers && q.acceptableAnswers[0]) || (q.requiredPhrases && q.requiredPhrases.join('; ')) || '';
    if(correctDisplay) explanationText = '參考答案：「'+correctDisplay+'」\n'+explanationText;
  }
  if(q.type === 'mcq' && q.wrongNotes && optsWrapSelectedWrong(q, userAnswerText, isCorrect)){
    var idx = $('#quiz-options').dataset.selected;
    if(idx !== undefined && q.wrongNotes[idx]) explanationText += '\n\n你揀嘅答案錯喺：'+q.wrongNotes[idx];
  }
  $('#teacher-explanation').textContent = explanationText;
}
function optsWrapSelectedWrong(q,userAnswerText,isCorrect){ return !isCorrect; }

function checkFillAnswer(q, userInput){
  var norm = normalize(userInput);
  if(!norm) return false;
  if(q.matchMode === 'contains-all'){
    return q.requiredPhrases.every(function(p){ return norm.indexOf(normalize(p)) !== -1; });
  }
  if(q.matchMode === 'contains-threshold'){
    var count = q.requiredPhrases.filter(function(p){ return norm.indexOf(normalize(p)) !== -1; }).length;
    return count >= q.threshold;
  }
  return (q.acceptableAnswers||[]).some(function(a){
    var an = normalize(a);
    if(an === norm) return true;
    if(an.length>10 && (norm.indexOf(an)!==-1 || an.indexOf(norm)!==-1)) return true;
    return false;
  });
}

function nextQuestion(){
  quizSession.index++;
  if(quizSession.index >= quizSession.questions.length){
    finishQuiz();
  } else {
    delete $('#quiz-options').dataset.selected;
    renderQuestion();
  }
}

function finishQuiz(){
  var total = quizSession.questions.length;
  var accuracy = total>0 ? Math.round((quizSession.correctCount/total)*100) : 0;
  $('#result-score').textContent = quizSession.correctCount + ' / ' + total;
  $('#result-accuracy').textContent = accuracy + '%';
  $('#result-xp').textContent = '+' + quizSession.xpEarned;
  $('#result-coins').textContent = '+' + quizSession.coinsEarned;

  var durationSec = Math.round((Date.now() - quizSession.startTime)/1000);
  recordDailyLog(quizSession.moduleId, total, quizSession.correctCount, durationSec);

  var badgeBox = $('#result-badge');
  badgeBox.classList.add('hidden');
  if(!state.progress.__firstDone){
    state.progress.__firstDone = true;
    unlockBadge('first_steps');
    saveState();
  }
  if(accuracy === 100 && total>0){
    unlockBadge('perfect_score');
    addXP(20); addCoins(10);
    badgeBox.classList.remove('hidden');
    $('#result-badge-text').textContent = '完美挑戰！全部答對，額外獎勵 +20 XP +10 金幣！';
  }
  var allDone = MODULE_ORDER.slice(0,10).every(function(m){ return state.progress[m] && state.progress[m].attempted>0; });
  if(allDone) unlockBadge('all_units');
  if(quizSession.moduleId === 'reading') unlockBadge('reading_master');
  if(state.wrongQuestions.length>0 && state.wrongQuestions.every(function(w){ return w.mastered; })) unlockBadge('wrong_master');

  showScreen('screen-result');
  renderDashboard();
}

/* ======================================================================
   14b. DICTATION ENGINE (默書) — audio playback only, self-checked on paper
   ====================================================================== */
var dictSession = null;

function dictationAccuracy(setId){
  var p = state.dictationProgress[setId];
  if(!p || p.attempted===0) return null;
  return Math.round((p.correct/p.attempted)*100);
}

function renderDictionSetList(){
  var wrap = $('#dictation-set-list');
  wrap.innerHTML = '';
  var sets = getAllDictationSets();
  sets.forEach(function(s){
    var acc = dictationAccuracy(s.id);
    var btn = document.createElement('button');
    btn.className = 'module-card special';
    btn.innerHTML = '<span class="module-icon">'+(s.icon||'✍️')+'</span>'+
      '<span class="module-title">'+s.title+'<br>'+(s.type==='sentence'?'句子':'詞語')+' x '+s.items.length+'</span>'+
      '<span class="module-progress"><span class="bar"><span class="bar-fill" style="width:'+(acc===null?0:acc)+'%"></span></span></span>';
    btn.onclick = function(){ startDictation(s.id, s.items); };
    wrap.appendChild(btn);
  });
  if(sets.length===0){
    wrap.innerHTML = '<p class="dash-sub">暫時未有默書表，請叫家長喺「家長模式 → 默書表」新增！</p>';
  }
}

function startDictation(setId, items){
  dictSession = {
    setId: setId,
    items: items.slice(),
    index: 0,
    marks: items.map(function(){ return null; }),
    playCount: 0,
    startTime: Date.now()
  };
  showScreen('screen-dictation-play');
  renderDictItem();
}

function renderDictItem(){
  var total = dictSession.items.length;
  $('#dict-progress-text').textContent = '第 '+(dictSession.index+1)+' / '+total+' 題';
  $('#dict-progress-fill').style.width = Math.round((dictSession.index/total)*100)+'%';
  dictSession.playCount = 0;
  $('#dict-play-count').textContent = '';
  $('#btn-dict-next').textContent = (dictSession.index === total-1) ? '✅ 完成，去對答案' : '➡️ 下一題';
}

function playCurrentDictItem(){
  var item = dictSession.items[dictSession.index];
  var slow = $('#chk-dict-slow').checked;
  speakEnglish(item.text, slow ? 0.55 : 0.8);
  dictSession.playCount++;
  $('#dict-play-count').textContent = '已播放 '+dictSession.playCount+' 次';
}

function nextDictItem(){
  dictSession.index++;
  if(dictSession.index >= dictSession.items.length){
    renderDictCheckList();
    showScreen('screen-dictation-check');
  } else {
    renderDictItem();
  }
}

function renderDictCheckList(){
  var wrap = $('#dict-check-list');
  wrap.innerHTML = '';
  $('#dict-check-result').classList.add('hidden');
  $('#dict-check-actions').classList.remove('hidden');
  $('#dict-result-actions').classList.add('hidden');
  dictSession.items.forEach(function(item, i){
    var div = document.createElement('div');
    div.className = 'wrong-item dict-check-row';
    div.innerHTML = '<div class="wrong-item-info">'+
      '<span class="wrong-item-tag">第 '+(i+1)+' 題</span>'+
      '<div class="wrong-item-q dict-check-text">'+item.text+'</div></div>'+
      '<div class="dict-check-actions">'+
      '<button class="icon-btn speaker-btn" data-dict-replay="'+i+'" title="再聽一次">🔊</button>'+
      '<button class="dict-mark-btn dict-mark-correct" data-dict-mark="'+i+'" data-val="1">✅</button>'+
      '<button class="dict-mark-btn dict-mark-wrong" data-dict-mark="'+i+'" data-val="0">❌</button>'+
      '</div>';
    wrap.appendChild(div);
  });
  $all('[data-dict-replay]', wrap).forEach(function(btn){
    btn.onclick = function(){ var item = dictSession.items[parseInt(btn.dataset.dictReplay,10)]; speakEnglish(item.text, 0.8); };
  });
  $all('[data-dict-mark]', wrap).forEach(function(btn){
    btn.onclick = function(){
      var idx = parseInt(btn.dataset.dictMark,10);
      var val = btn.dataset.val === '1';
      dictSession.marks[idx] = val;
      var row = btn.closest('.dict-check-row');
      $all('.dict-mark-btn', row).forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    };
  });
}

function markAllDictCorrect(){
  dictSession.items.forEach(function(item, i){ dictSession.marks[i] = true; });
  $all('.dict-check-row').forEach(function(row){
    $all('.dict-mark-correct', row).forEach(function(b){ b.classList.add('active'); });
    $all('.dict-mark-wrong', row).forEach(function(b){ b.classList.remove('active'); });
  });
}

function recordDictationWrong(item, setId){
  var existing = state.dictationWrong.find(function(w){ return w.itemId === item.id; });
  if(existing){ existing.timesWrong++; existing.mastered = false; existing.lastWrongAt = Date.now(); }
  else {
    state.dictationWrong.push({ id: uid('dw'), itemId: item.id, setId: setId, text: item.text, timesWrong:1, mastered:false, lastWrongAt: Date.now() });
  }
}
function markDictationMastered(itemId){
  var w = state.dictationWrong.find(function(x){ return x.itemId===itemId; });
  if(w) w.mastered = true;
}

function submitDictCheck(){
  if(dictSession.marks.some(function(m){ return m===null; })){
    showToast('請將每一題都標為 ✅ 或 ❌ 先可以提交！');
    return;
  }
  var total = dictSession.items.length;
  var correctCount = dictSession.marks.filter(Boolean).length;
  var xpEarned = 0, coinsEarned = 0;

  dictSession.items.forEach(function(item, i){
    if(dictSession.marks[i]){ xpEarned += 10; coinsEarned += 5; markDictationMastered(item.id); }
    else { xpEarned += 2; recordDictationWrong(item, dictSession.setId); }
  });
  addXP(xpEarned); addCoins(coinsEarned);

  if(!state.dictationProgress[dictSession.setId]) state.dictationProgress[dictSession.setId] = { attempted:0, correct:0 };
  state.dictationProgress[dictSession.setId].attempted += total;
  state.dictationProgress[dictSession.setId].correct += correctCount;

  var durationSec = Math.round((Date.now() - dictSession.startTime)/1000);
  recordDailyLog('dict:'+dictSession.setId, total, correctCount, durationSec);

  if(!state.progress.__firstDone){ state.progress.__firstDone = true; unlockBadge('first_steps'); }

  var accuracy = total>0 ? Math.round((correctCount/total)*100) : 0;
  var bonusText = '';
  if(accuracy === 100 && total>0){
    unlockBadge('perfect_score');
    addXP(20); addCoins(10);
    xpEarned += 20; coinsEarned += 10;
    bonusText = '🎉 完美默書！額外 +20 XP +10 金幣！';
  }
  saveState();

  $('#dict-check-actions').classList.add('hidden');
  $('#dict-result-actions').classList.remove('hidden');
  var resultBox = $('#dict-check-result');
  resultBox.classList.remove('hidden');
  resultBox.innerHTML =
    '<div class="result-stat"><span class="stat-num">'+correctCount+' / '+total+'</span><span>分數</span></div>'+
    '<div class="result-stat"><span class="stat-num">'+accuracy+'%</span><span>準確率</span></div>'+
    '<div class="result-stat"><span class="stat-num">+'+xpEarned+'</span><span>經驗值</span></div>'+
    '<div class="result-stat"><span class="stat-num">+'+coinsEarned+'</span><span>金幣</span></div>';
  if(bonusText){
    var bonusEl = document.createElement('p');
    bonusEl.className = 'dash-sub dict-bonus-text';
    bonusEl.textContent = bonusText;
    resultBox.appendChild(bonusEl);
  }
  AudioEngine.sfx(accuracy>=70?'correct':'wrong');
}

function retryDictationWrong(){
  var items = state.dictationWrong.filter(function(w){ return !w.mastered; }).map(function(w){ return { id:w.itemId, text:w.text }; });
  if(items.length===0){ showToast('冇默書錯字要重溫啦！'); return; }
  startDictation('dict-wrong-review', items);
}

function renderDictWrongList(){
  var list = $('#dict-wrong-list');
  list.innerHTML = '';
  var items = state.dictationWrong.filter(function(w){ return !w.mastered; });
  if(items.length===0){
    list.innerHTML = '<p class="dash-sub">暫時冇待複習嘅默書錯字，繼續保持！🎉</p>';
    return;
  }
  items.forEach(function(w){
    var set = findDictationSet(w.setId);
    var div = document.createElement('div');
    div.className = 'wrong-item';
    div.innerHTML = '<div class="wrong-item-info">'+
      '<span class="wrong-item-tag">'+(set?set.title:'默書')+'</span>'+
      '<div class="wrong-item-q">'+w.text+'</div>'+
      '<div class="wrong-item-meta">錯咗 '+w.timesWrong+' 次</div></div>';
    list.appendChild(div);
  });
}

function renderDictChart(containerEl){
  containerEl.innerHTML = '';
  var sets = getAllDictationSets();
  if(sets.length===0){ containerEl.innerHTML = '<p class="dash-sub">未有默書表。</p>'; return; }
  sets.forEach(function(s){
    var pct = dictationAccuracy(s.id);
    var row = document.createElement('div');
    row.className = 'topic-bar-row';
    var fillClass = pct===null ? '' : (pct<50?'low':(pct<75?'mid':''));
    row.innerHTML = '<span class="topic-bar-label">'+(s.icon||'✍️')+' '+s.title+'</span>'+
      '<div class="topic-bar-track"><div class="topic-bar-fill '+fillClass+'" style="width:'+(pct===null?0:pct)+'%"></div></div>'+
      '<span class="topic-bar-pct">'+(pct===null?'—':pct+'%')+'</span>';
    containerEl.appendChild(row);
  });
}

/* ======================================================================
   15. DASHBOARD RENDERING
   ====================================================================== */
function renderDashboard(){
  $('#dash-welcome').textContent = '歡迎回來，' + (state.profile.name||'小巫師') + '！';
  MODULE_ORDER.forEach(function(m){
    var pct = moduleAccuracy(m);
    var el = $('.bar-fill[data-bar="'+m+'"]');
    if(el) el.style.width = (pct===null?0:pct) + '%';
  });
  var wrongActive = state.wrongQuestions.filter(function(w){ return !w.mastered; });
  $('#wrong-count-badge').textContent = wrongActive.length + ' 題待複習';
}

/* ======================================================================
   16. NOTES SCREEN
   ====================================================================== */
var currentModuleId = null;
function openNotes(moduleId){
  currentModuleId = moduleId;
  var mod = MODULES[moduleId];
  $('#notes-title').textContent = mod.icon + ' ' + mod.unit + ' — ' + mod.title;
  $('#notes-body').innerHTML = mod.notes;
  $('#chk-timer-mode').checked = state.settings.timerMode;
  showScreen('screen-notes');
}

/* ======================================================================
   17. WRONG QUESTION CENTER
   ====================================================================== */
function renderWrongCenter(){
  var select = $('#wrong-filter-module');
  select.innerHTML = '<option value="all">全部單元</option>';
  MODULE_ORDER.forEach(function(m){
    var opt = document.createElement('option');
    opt.value = m; opt.textContent = MODULES[m].icon + ' ' + MODULES[m].title;
    select.appendChild(opt);
  });

  var list = $('#wrong-list');
  list.innerHTML = '';
  var filterVal = select.value || 'all';
  var items = state.wrongQuestions.filter(function(w){ return !w.mastered && (filterVal==='all' || w.module===filterVal); });
  if(items.length===0){
    list.innerHTML = '<p class="dash-sub">暫時冇待複習嘅錯題，繼續保持！🎉</p>';
    return;
  }
  items.forEach(function(w){
    var q = findQuestionById(w.qId);
    if(!q) return;
    var div = document.createElement('div');
    div.className = 'wrong-item';
    div.innerHTML = '<div class="wrong-item-info">'+
      '<span class="wrong-item-tag">'+(MODULES[w.module]?MODULES[w.module].title:w.module)+'</span>'+
      '<div class="wrong-item-q">'+q.q+'</div>'+
      '<div class="wrong-item-meta">錯咗 '+w.timesWrong+' 次</div></div>';
    list.appendChild(div);
  });
}
function retryWrongQuestions(filterVal){
  var items = state.wrongQuestions.filter(function(w){ return !w.mastered && (filterVal==='all' || w.module===filterVal); });
  if(items.length===0){ showToast('冇錯題可以重測啦！'); return; }
  var questions = items.map(function(w){ return findQuestionById(w.qId); }).filter(Boolean);
  startQuiz('mixed-wrong', questions, { timerMode:false, isWrongRetry:true });
}

/* ======================================================================
   18. REPORT CENTER
   ====================================================================== */
function computeOverallStats(){
  var totalAttempted=0, totalCorrect=0;
  MODULE_ORDER.forEach(function(m){
    var p = state.progress[m];
    if(p){ totalAttempted+=p.attempted; totalCorrect+=p.correct; }
  });
  return { totalAttempted:totalAttempted, totalCorrect:totalCorrect,
    accuracy: totalAttempted>0 ? Math.round((totalCorrect/totalAttempted)*100) : 0 };
}
function renderTopicChart(containerEl){
  containerEl.innerHTML = '';
  MODULE_ORDER.forEach(function(m){
    var pct = moduleAccuracy(m);
    var row = document.createElement('div');
    row.className = 'topic-bar-row';
    var fillClass = pct===null ? '' : (pct<50?'low':(pct<75?'mid':''));
    row.innerHTML = '<span class="topic-bar-label">'+MODULES[m].icon+' '+MODULES[m].title+'</span>'+
      '<div class="topic-bar-track"><div class="topic-bar-fill '+fillClass+'" style="width:'+(pct===null?0:pct)+'%"></div></div>'+
      '<span class="topic-bar-pct">'+(pct===null?'—':pct+'%')+'</span>';
    containerEl.appendChild(row);
  });
}
function renderWeakness(containerEl){
  containerEl.innerHTML = '';
  var weak = MODULE_ORDER.filter(function(m){
    var p = state.progress[m];
    return p && p.attempted>=3 && moduleAccuracy(m)<70;
  });
  if(weak.length===0){
    containerEl.innerHTML = '<p class="dash-sub">暫時未發現明顯弱點，做多啲題目先會有更準確嘅分析喔！</p>';
    return;
  }
  weak.forEach(function(m){
    var div = document.createElement('div');
    div.className = 'weakness-item';
    div.textContent = '⚠️ ' + MODULES[m].title + '　準確率 '+moduleAccuracy(m)+'%　建議重溫此單元筆記同重做練習';
    containerEl.appendChild(div);
  });
}
function formatDuration(sec){
  if(sec<60) return sec+'秒';
  var m = Math.floor(sec/60), s = sec%60;
  return m+'分'+(s>0 ? s+'秒' : '');
}
function moduleDisplayName(moduleId){
  if(MODULES[moduleId]) return MODULES[moduleId].icon+' '+MODULES[moduleId].title;
  if(moduleId === 'mixed-wrong') return '🏆 錯題重溫';
  if(typeof moduleId === 'string' && moduleId.indexOf('dict:')===0){
    var setId = moduleId.slice(5);
    if(setId === 'dict-wrong-review') return '✍️ 默書錯字重溫';
    var set = findDictationSet(setId);
    return set ? '✍️ '+set.title : '✍️ 默書';
  }
  return moduleId;
}
function renderDailyLog(containerEl){
  containerEl.innerHTML = '';
  if(!state.dailyLog.length){
    containerEl.innerHTML = '<p class="dash-sub">仲未有練習紀錄，完成一次挑戰就會喺度顯示喇！</p>';
    return;
  }
  var byDate = {};
  state.dailyLog.forEach(function(e){
    if(!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  });
  var dates = Object.keys(byDate).sort(function(a,b){ return b.localeCompare(a); }).slice(0,14);
  var today = todayStr();
  dates.forEach(function(date){
    var dayDiv = document.createElement('div');
    dayDiv.className = 'daily-log-day';
    var label = '📅 ' + date + (date===today ? '（今日）' : '');
    var entries = byDate[date].slice().sort(function(a,b){ return b.ts - a.ts; });
    var entriesHtml = entries.map(function(e){
      var acc = e.total>0 ? Math.round((e.correct/e.total)*100) : 0;
      return '<div class="daily-log-entry"><span class="dle-module">'+moduleDisplayName(e.module)+'</span>'+
        '<span class="dle-stats">'+e.correct+'/'+e.total+' 題　'+acc+'%　⏱️ '+formatDuration(e.durationSec)+'</span></div>';
    }).join('');
    dayDiv.innerHTML = '<span class="daily-log-date">'+label+'</span>'+entriesHtml;
    containerEl.appendChild(dayDiv);
  });
}
function renderReportCenter(){
  var stats = computeOverallStats();
  $('#report-total-attempted').textContent = stats.totalAttempted;
  $('#report-overall-accuracy').textContent = stats.accuracy+'%';
  $('#report-level').textContent = state.profile.level;
  $('#report-badges-count').textContent = state.profile.badges.length;
  renderDailyLog($('#report-daily-log'));
  renderTopicChart($('#report-topic-chart'));
  renderDictChart($('#report-dict-chart'));
  renderWeakness($('#report-weakness'));
  var badgesEl = $('#report-badges');
  badgesEl.innerHTML = '';
  ALL_BADGES.forEach(function(b){
    var unlocked = state.profile.badges.indexOf(b.id) !== -1;
    var div = document.createElement('div');
    div.className = 'badge-chip' + (unlocked?'':' locked');
    div.innerHTML = '<span class="badge-emoji">'+b.emoji+'</span><span>'+b.name+'</span>';
    badgesEl.appendChild(div);
  });
}

/* ======================================================================
   19. READING ROOM
   ====================================================================== */
function renderReadingList(){
  var wrap = $('#reading-passage-list');
  wrap.innerHTML = '';
  READING_PASSAGES.forEach(function(p){
    var btn = document.createElement('button');
    btn.className = 'module-card special';
    btn.innerHTML = '<span class="module-icon">📖</span><span class="module-title">'+p.title+'</span>';
    btn.onclick = function(){
      currentModuleId = 'reading';
      startQuiz('reading', p.questions, { timerMode:false, passage:p });
    };
    wrap.appendChild(btn);
  });
}

/* ======================================================================
   20. PARENT MODE
   ====================================================================== */
function openParentPin(){
  $('#parent-pin-input').value = '';
  $('#parent-pin-error').classList.add('hidden');
  showScreen('screen-parent-pin');
}
function submitParentPin(){
  var val = $('#parent-pin-input').value;
  if(val === state.parent.pin){
    showScreen('screen-parent-dash');
    populateModuleSelect();
    renderParentStats();
    renderParentQuestionList();
    renderParentDictSetList();
  } else {
    $('#parent-pin-error').classList.remove('hidden');
  }
}
function renderParentStats(){
  var stats = computeOverallStats();
  $('#parent-stats-summary').innerHTML =
    '<div class="report-summary-card"><span class="stat-num">'+stats.totalAttempted+'</span><span>已做題目</span></div>'+
    '<div class="report-summary-card"><span class="stat-num">'+stats.accuracy+'%</span><span>整體準確率</span></div>'+
    '<div class="report-summary-card"><span class="stat-num">'+state.profile.level+'</span><span>目前等級</span></div>'+
    '<div class="report-summary-card"><span class="stat-num">'+state.profile.coins+'</span><span>累積金幣</span></div>';
  renderTopicChart($('#parent-topic-accuracy'));
  renderWeakness($('#parent-weakness'));
}
function populateModuleSelect(){
  var sel = $('#q-module');
  sel.innerHTML = '';
  MODULE_ORDER.forEach(function(m){
    var opt = document.createElement('option');
    opt.value = m; opt.textContent = MODULES[m].icon+' '+MODULES[m].title;
    sel.appendChild(opt);
  });
}
function renderParentQuestionList(){
  var wrap = $('#parent-question-list');
  wrap.innerHTML = '';
  if(state.customQuestions.length===0){
    wrap.innerHTML = '<p class="dash-sub">暫時未有自訂題目。</p>';
    return;
  }
  state.customQuestions.forEach(function(q){
    var div = document.createElement('div');
    div.className = 'parent-question-item';
    div.innerHTML = '<div><span class="wrong-item-tag">'+(MODULES[q.module]?MODULES[q.module].title:q.module)+'</span><div>'+q.q+'</div></div>'+
      '<div class="pq-actions"><button class="btn-secondary" data-del="'+q.id+'">🗑️ 刪除</button></div>';
    wrap.appendChild(div);
  });
  $all('[data-del]', wrap).forEach(function(btn){
    btn.onclick = function(){
      var id = btn.dataset.del;
      state.customQuestions = state.customQuestions.filter(function(q){ return q.id!==id; });
      saveState();
      renderParentQuestionList();
      showToast('已刪除題目');
    };
  });
}
function addCustomQuestion(data){
  data.id = uid('custom');
  state.customQuestions.push(data);
  saveState();
  renderParentQuestionList();
  showToast('已新增題目！');
}

function renderParentDictSetList(){
  var wrap = $('#parent-dictset-list');
  wrap.innerHTML = '';
  if(state.dictationSets.length===0){
    wrap.innerHTML = '<p class="dash-sub">暫時未有自訂默書表。</p>';
    return;
  }
  state.dictationSets.forEach(function(s){
    var div = document.createElement('div');
    div.className = 'parent-question-item';
    div.innerHTML = '<div><span class="wrong-item-tag">'+(s.type==='sentence'?'句子':'詞語')+'</span><div>'+s.title+'（'+s.items.length+' 項）</div></div>'+
      '<div class="pq-actions"><button class="btn-secondary" data-del-dictset="'+s.id+'">🗑️ 刪除</button></div>';
    wrap.appendChild(div);
  });
  $all('[data-del-dictset]', wrap).forEach(function(btn){
    btn.onclick = function(){
      var id = btn.dataset.delDictset;
      state.dictationSets = state.dictationSets.filter(function(s){ return s.id!==id; });
      saveState();
      renderParentDictSetList();
      showToast('已刪除默書表');
    };
  });
}
function addCustomDictSet(title, type, lines){
  var setId = uid('dictset');
  var items = lines.map(function(line, i){ return { id: setId+'-'+i, text: line }; });
  state.dictationSets.push({ id:setId, title:title, icon: type==='sentence' ? '📜' : '🖋️', type:type, items:items });
  saveState();
  renderParentDictSetList();
  return items.length;
}

/* ---- import pipeline ---- */
var MODULE_KEYWORDS = {
  u1l1: ['if','mix','boil','melt','sink','float','zero'],
  u1l2: ['too','enough'],
  u2l1: ['will','may','might','can','could'],
  u2l2: ['although'],
  u3l1: ['ly','adverb','adjective','hard','hardly'],
  u3l2: ['going to','might'],
  u4l1: ['since','for'],
  u4l2: ['to-infinitive','told','asked','reminded','encouraged','decided','refuse'],
  u5l1: ['passive','collected','recycled','given off','tidied'],
  u5l2: ['made in','made by','made from']
};
function classifyText(text){
  var norm = text.toLowerCase();
  var bestModule = 'u1l1', bestScore = -1;
  for(var m in MODULE_KEYWORDS){
    var score = MODULE_KEYWORDS[m].reduce(function(acc,kw){ return acc + (norm.indexOf(kw)!==-1?1:0); }, 0);
    if(score>bestScore){ bestScore=score; bestModule=m; }
  }
  return bestModule;
}
function parseImportText(text){
  var lines = text.split('\n').map(function(l){ return l.trim(); }).filter(Boolean);
  var blocks = [];
  var current = null;
  lines.forEach(function(line){
    if(/^Q?\d+[.):]/i.test(line)){
      if(current) blocks.push(current);
      current = { raw:[line] };
    } else if(current){
      current.raw.push(line);
    } else {
      current = { raw:[line] };
    }
  });
  if(current) blocks.push(current);

  return blocks.map(function(block){
    var full = block.raw.join(' ');
    var optionMatches = full.match(/\([A-D]\)\s*[^()]+?(?=\([A-D]\)|$)/g);
    var qText = full;
    var options = null, answerIndex = 0;
    if(optionMatches && optionMatches.length>=2){
      qText = full.substring(0, full.indexOf(optionMatches[0])).trim();
      options = optionMatches.map(function(o){ return o.replace(/^\([A-D]\)\s*/,'').trim(); });
    }
    var module = classifyText(full);
    return { qText:qText, options:options, answerIndex:answerIndex, module:module, type: options?'mcq':'fill' };
  });
}
var importPreviewData = [];
function renderImportPreview(){
  var wrap = $('#import-preview-list');
  wrap.innerHTML = '';
  importPreviewData.forEach(function(item, i){
    var div = document.createElement('div');
    div.className = 'parent-question-item';
    var selectHtml = '<select data-preview-module="'+i+'">' + MODULE_ORDER.map(function(m){
      return '<option value="'+m+'"'+(m===item.module?' selected':'')+'>'+MODULES[m].title+'</option>';
    }).join('') + '</select>';
    var answerHtml = item.options
      ? '<div class="wrong-item-meta">選項：'+item.options.join(' / ')+'</div>'+
        '<label style="font-size:12px;font-weight:bold;">正確選項：</label>'+
        '<select data-preview-answer="'+i+'">' + item.options.map(function(o,oi){
          return '<option value="'+oi+'"'+(oi===item.answerIndex?' selected':'')+'>'+String.fromCharCode(65+oi)+'. '+o+'</option>';
        }).join('') + '</select>'
      : '<label style="font-size:12px;font-weight:bold;">正確答案：</label>'+
        '<input type="text" data-preview-fillanswer="'+i+'" placeholder="請輸入正確答案" style="padding:6px;border:2px solid var(--parchment-line);border-radius:6px;">';
    div.innerHTML = '<div style="flex:1"><div>'+item.qText+'</div>'+
      '<div style="margin-top:6px">'+answerHtml+'</div>'+
      '<div style="margin-top:6px">'+selectHtml+'</div></div>';
    wrap.appendChild(div);
  });
  $all('[data-preview-module]', wrap).forEach(function(sel){
    sel.onchange = function(){ importPreviewData[parseInt(sel.dataset.previewModule,10)].module = sel.value; };
  });
  $all('[data-preview-answer]', wrap).forEach(function(sel){
    sel.onchange = function(){ importPreviewData[parseInt(sel.dataset.previewAnswer,10)].answerIndex = parseInt(sel.value,10); };
  });
  $all('[data-preview-fillanswer]', wrap).forEach(function(inp){
    inp.oninput = function(){ importPreviewData[parseInt(inp.dataset.previewFillanswer,10)].fillAnswer = inp.value; };
  });
}

/* ======================================================================
   21. EVENT WIRING / INIT
   ====================================================================== */
function attachEvents(){

  /* ---- login screen ---- */
  $all('.house-card').forEach(function(card){
    card.onclick = function(){
      $all('.house-card').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
      state.profile.house = card.dataset.house;
    };
  });
  $('#house-grid').querySelector('[data-house="gryffindor"]').classList.add('selected');

  $('#btn-start-adventure').onclick = function(){
    var name = $('#input-name').value.trim();
    if(!name){ showToast('請輸入你的名字！'); return; }
    state.profile.name = name;
    saveState();
    $('#topbar').classList.remove('hidden');
    checkDailyLogin();
    updateTopbar();
    renderDashboard();
    showScreen('screen-dashboard');
  };

  /* ---- topbar ---- */
  $('#btn-home').onclick = function(){ renderDashboard(); showScreen('screen-dashboard'); };
  $('#btn-daily-reward').onclick = function(){ openDailyRewardModal(); };
  $('#btn-music-toggle').onclick = function(){
    state.settings.musicOn = !state.settings.musicOn;
    saveState();
    if(state.settings.musicOn){ AudioEngine.startMusic(); $('#btn-music-toggle').textContent='🎵'; }
    else { AudioEngine.stopMusic(); $('#btn-music-toggle').textContent='🔇'; }
  };
  $('#btn-settings').onclick = function(){
    $('#input-rename').value = state.profile.name;
    $('#chk-music-on').checked = state.settings.musicOn;
    $('#range-music-volume').value = state.settings.musicVolume;
    $('#chk-sfx-on').checked = state.settings.sfxOn;
    $('#range-tts-rate').value = state.settings.ttsRate;
    $('#modal-settings').classList.remove('hidden');
  };
  $('#btn-close-settings').onclick = function(){ $('#modal-settings').classList.add('hidden'); };
  $('#btn-parent-mode').onclick = function(){ openParentPin(); };

  /* ---- settings modal ---- */
  $('#btn-save-rename').onclick = function(){
    var newName = $('#input-rename').value.trim();
    if(!newName){ showToast('請輸入名字！'); return; }
    state.profile.name = newName;
    saveState();
    updateTopbar();
    renderDashboard();
    showToast('已改名為「'+newName+'」！');
  };
  $('#chk-music-on').onchange = function(e){
    state.settings.musicOn = e.target.checked; saveState();
    if(state.settings.musicOn) AudioEngine.startMusic(); else AudioEngine.stopMusic();
  };
  $('#range-music-volume').oninput = function(e){
    state.settings.musicVolume = parseInt(e.target.value,10); saveState();
    AudioEngine.setVolume(state.settings.musicVolume);
  };
  $('#chk-sfx-on').onchange = function(e){ state.settings.sfxOn = e.target.checked; saveState(); };
  $('#range-tts-rate').oninput = function(e){ state.settings.ttsRate = parseInt(e.target.value,10); saveState(); };

  /* ---- daily reward modal ---- */
  $('#btn-claim-daily-reward').onclick = function(){
    var coin = parseInt($('#modal-daily-reward').dataset.coin,10)||10;
    var xp = parseInt($('#modal-daily-reward').dataset.xp,10)||5;
    addCoins(coin); addXP(xp);
    state.dailyRewardClaimedDate = todayStr();
    saveState();
    $('#modal-daily-reward').classList.add('hidden');
    showToast('獲得 +'+coin+' 金幣　+'+xp+' 經驗值！');
  };
  $('#btn-close-levelup').onclick = function(){ $('#modal-levelup').classList.add('hidden'); };

  /* ---- dashboard module cards ---- */
  $all('.module-card[data-module]').forEach(function(card){
    card.onclick = function(){
      var m = card.dataset.module;
      if(m === 'reading'){ renderReadingList(); showScreen('screen-reading-list'); }
      else if(m === 'verb'){ showScreen('screen-verb-game'); }
      else if(m === 'adjadv'){ showScreen('screen-adjadv-game'); }
      else if(m === 'dictation'){ renderDictionSetList(); showScreen('screen-dictation-list'); }
      else { openNotes(m); }
    };
  });
  $('#btn-wrong-center').onclick = function(){ renderWrongCenter(); renderDictWrongList(); showScreen('screen-wrongcenter'); };
  $('#btn-report-center').onclick = function(){ renderReportCenter(); showScreen('screen-report'); };

  /* ---- notes screen ---- */
  $('#chk-timer-mode').onchange = function(e){ state.settings.timerMode = e.target.checked; saveState(); };
  $('#btn-start-quiz').onclick = function(){
    var questions = getModuleQuestions(currentModuleId);
    if(questions.length===0){ showToast('呢個關卡暫時未有題目！'); return; }
    startQuiz(currentModuleId, questions, { timerMode: state.settings.timerMode });
  };

  /* ---- quiz screen ---- */
  $('#btn-speak-question').onclick = function(){ speakText(currentQuestion().q); };
  $('#btn-submit-answer').onclick = function(){ submitAnswer(false); };
  $('#btn-next-question').onclick = function(){ nextQuestion(); };

  /* ---- result screen ---- */
  $('#btn-retry-wrong').onclick = function(){
    if(quizSession.sessionWrong.length===0){ showToast('呢輪冇答錯題目，好嘢！'); return; }
    var qs = quizSession.sessionWrong.map(findQuestionById).filter(Boolean);
    startQuiz(quizSession.moduleId, qs, { timerMode:false, isWrongRetry:true, passage:quizSession.passage });
  };
  $('#btn-retry-all').onclick = function(){
    var questions = quizSession.moduleId==='mixed-wrong'
      ? state.wrongQuestions.filter(function(w){return !w.mastered;}).map(function(w){return findQuestionById(w.qId);}).filter(Boolean)
      : getModuleQuestions(quizSession.moduleId);
    startQuiz(quizSession.moduleId, questions, { timerMode: state.settings.timerMode, passage: quizSession.passage });
  };
  $('#btn-back-dashboard').onclick = function(){ renderDashboard(); showScreen('screen-dashboard'); };

  /* ---- wrong center ---- */
  $('#wrong-filter-module').onchange = function(){ renderWrongCenter(); };
  $('#btn-retry-filtered').onclick = function(){ retryWrongQuestions($('#wrong-filter-module').value); };
  $('#btn-clear-mastered').onclick = function(){
    state.wrongQuestions = state.wrongQuestions.filter(function(w){ return !w.mastered; });
    saveState(); renderWrongCenter(); showToast('已清除已掌握嘅題目');
  };

  /* ---- dictation ---- */
  $('#btn-dict-play').onclick = function(){ playCurrentDictItem(); };
  $('#btn-dict-next').onclick = function(){ nextDictItem(); };
  $('#btn-dict-cancel').onclick = function(){ renderDictionSetList(); showScreen('screen-dictation-list'); };
  $('#btn-dict-mark-all').onclick = function(){ markAllDictCorrect(); };
  $('#btn-dict-submit').onclick = function(){ submitDictCheck(); };
  $('#btn-dict-retry').onclick = function(){
    var set = findDictationSet(dictSession.setId);
    startDictation(dictSession.setId, set ? set.items : dictSession.items);
  };
  $('#btn-dict-home').onclick = function(){ renderDashboard(); showScreen('screen-dashboard'); };
  $('#btn-dict-retry-wrong').onclick = function(){ retryDictationWrong(); };
  $('#btn-dict-clear-mastered').onclick = function(){
    state.dictationWrong = state.dictationWrong.filter(function(w){ return !w.mastered; });
    saveState(); renderDictWrongList(); showToast('已清除已掌握嘅默書錯字');
  };

  /* ---- parent mode ---- */
  $('#btn-parent-pin-cancel').onclick = function(){ renderDashboard(); showScreen('screen-dashboard'); };
  $('#btn-parent-pin-submit').onclick = function(){ submitParentPin(); };
  $('#parent-pin-input').onkeydown = function(e){ if(e.key==='Enter') submitParentPin(); };
  $('#btn-parent-exit').onclick = function(){ renderDashboard(); showScreen('screen-dashboard'); };

  $all('.parent-tab').forEach(function(tab){
    tab.onclick = function(){
      $all('.parent-tab').forEach(function(t){ t.classList.remove('active'); });
      $all('.parent-tab-content').forEach(function(c){ c.classList.remove('active'); });
      tab.classList.add('active');
      $('#parent-tab-'+tab.dataset.tab).classList.add('active');
    };
  });

  $('#q-type').onchange = function(e){
    if(e.target.value==='mcq'){ $('#q-mcq-options').classList.remove('hidden'); $('#q-fill-answer').classList.add('hidden'); }
    else { $('#q-mcq-options').classList.add('hidden'); $('#q-fill-answer').classList.remove('hidden'); }
  };
  $('#form-add-question').onsubmit = function(e){
    e.preventDefault();
    var module = $('#q-module').value;
    var type = $('#q-type').value;
    var qText = $('#q-text').value.trim();
    var explanation = $('#q-explanation').value.trim();
    if(!qText){ showToast('請輸入題目內容！'); return; }
    var data = { module:module, type:type, q:qText, explanation:explanation };
    if(type==='mcq'){
      var opts = $all('.q-opt').map(function(i){ return i.value.trim(); });
      if(opts.some(function(o){ return !o; })){ showToast('請填寫全部四個選項！'); return; }
      data.options = opts;
      data.answerIndex = parseInt($('#q-correct-idx').value,10);
    } else {
      var ans = $('#q-fill-answer-input').value.trim();
      if(!ans){ showToast('請輸入正確答案！'); return; }
      data.acceptableAnswers = ans.split('，').concat(ans.split(',')).map(function(s){return s.trim();}).filter(Boolean);
    }
    addCustomQuestion(data);
    e.target.reset();
    $('#q-mcq-options').classList.remove('hidden');
    $('#q-fill-answer').classList.add('hidden');
  };

  /* ---- dictation set management ---- */
  $('#form-add-dictset').onsubmit = function(e){
    e.preventDefault();
    var title = $('#ds-title').value.trim();
    var type = $('#ds-type').value;
    var lines = $('#ds-items').value.split('\n').map(function(l){ return l.trim(); }).filter(Boolean);
    if(!title){ showToast('請輸入默書表名稱！'); return; }
    if(lines.length===0){ showToast('請輸入至少一項內容！'); return; }
    var count = addCustomDictSet(title, type, lines);
    showToast('已新增默書表「'+title+'」，共 '+count+' 項！');
    e.target.reset();
  };

  /* ---- import ---- */
  $('#import-file-input').onchange = function(e){
    var file = e.target.files[0];
    if(!file) return;
    var preview = $('#import-preview');
    preview.innerHTML = '';
    if(/image\//.test(file.type)){
      var img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      preview.appendChild(img);
      var note = document.createElement('p');
      note.className = 'dash-sub';
      note.textContent = '📷 已上載圖片。本版本未內建圖片文字識別（OCR）引擎，請睇住上面張圖，將題目內容手動輸入落下面文字框，然後按「自動分類」。';
      preview.appendChild(note);
    } else if(/text\/plain/.test(file.type) || /\.txt$/i.test(file.name)){
      var reader = new FileReader();
      reader.onload = function(ev){ $('#import-textarea').value = ev.target.result; };
      reader.readAsText(file);
      preview.innerHTML = '<p class="dash-sub">📄 已讀取文字檔內容到下面文字框。</p>';
    } else {
      preview.innerHTML = '<p class="dash-sub">📎 已選擇「'+file.name+'」。本版本未能直接解析 PDF / Word 二進位內容，請將題目內容複製貼上落下面文字框，然後按「自動分類」。</p>';
    }
  };
  $('#btn-auto-categorize').onclick = function(){
    var text = $('#import-textarea').value.trim();
    if(!text){ showToast('請先輸入題目內容！'); return; }
    importPreviewData = parseImportText(text);
    renderImportPreview();
    showToast('已自動分類 '+importPreviewData.length+' 條題目，請檢查後確認匯入！');
  };
  $('#btn-confirm-import').onclick = function(){
    if(importPreviewData.length===0){ showToast('請先按「自動分類」！'); return; }
    var missingAnswer = importPreviewData.some(function(item){ return item.type==='fill' && !(item.fillAnswer && item.fillAnswer.trim()); });
    if(missingAnswer){ showToast('有填充題未輸入正確答案，請檢查每條題目下方嘅「正確答案」欄！'); return; }
    importPreviewData.forEach(function(item){
      var data = { module:item.module, type:item.type, q:item.qText, explanation:'家長匯入題目' };
      if(item.type==='mcq'){ data.options = item.options; data.answerIndex = item.answerIndex||0; }
      else { data.acceptableAnswers = [item.fillAnswer.trim()]; }
      data.id = uid('import');
      state.customQuestions.push(data);
    });
    saveState();
    showToast('已匯入 '+importPreviewData.length+' 條題目！');
    importPreviewData = [];
    $('#import-preview-list').innerHTML = '';
    $('#import-textarea').value = '';
    renderParentQuestionList();
  };

  /* ---- parent settings ---- */
  $('#btn-change-pin').onclick = function(){
    var pin = $('#new-parent-pin').value;
    if(!/^\d{4}$/.test(pin)){ showToast('密碼必須係4位數字！'); return; }
    state.parent.pin = pin; saveState();
    $('#new-parent-pin').value = '';
    showToast('家長密碼已更新！');
  };
  $('#btn-reset-progress').onclick = function(){
    if(confirm('確定要重設所有學習進度嗎？呢個動作無法復原。')){
      state.progress = {}; state.wrongQuestions = [];
      state.profile.xp = 0; state.profile.level = 1; state.profile.coins = 0; state.profile.badges = [];
      saveState();
      showToast('已重設所有學習進度');
      updateTopbar();
    }
  };
}

/* ======================================================================
   22. INIT
   ====================================================================== */
document.addEventListener('DOMContentLoaded', function(){
  state = loadState();
  ParticleFX.init();
  attachEvents();
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = function(){};

  if(state.profile.name){
    $('#input-name').value = state.profile.name;
    $('#topbar').classList.remove('hidden');
    checkDailyLogin();
    updateTopbar();
    renderDashboard();
    showScreen('screen-dashboard');
    if(state.settings.musicOn) AudioEngine.startMusic();
  } else {
    showScreen('screen-login');
  }
});
