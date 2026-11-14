'use strict';

const species = [
  {name:'小紫斑蝶',latin:'Euploea tulliolus koxinga',slug:'euploea_tulliolus_koxinga',color:'#6f647e',wash:'#eee8ef',pupa:'綠色型蛹',note:'前翅中央白斑出現在腹面，背面中央沒有同樣的白斑。'},
  {name:'圓翅紫斑蝶',latin:'Euploea eunice hobosoni',slug:'euploea_eunice_hobosoni',color:'#665a83',wash:'#eae6ef',pupa:'帶金屬光澤的懸蛹',note:'前翅中央的白斑在背面與腹面都看得到，雄蝶翅形較圓。'},
  {name:'斯氏紫斑蝶',latin:'Euploea sylvester swinhoei',slug:'euploea_sylvester_swinhoei',color:'#746780',wash:'#eae7ec',pupa:'帶金屬光澤的懸蛹',note:'前翅腹面中室附近有三枚白斑，雄蝶前翅背面有兩條性標。'},
  {name:'端紫斑蝶',latin:'Euploea mulciber barsine',slug:'euploea_mulciber_barsine',color:'#8d6d79',wash:'#efe6e6',pupa:'帶金屬光澤的懸蛹',note:'前翅有多枚白斑，這幅雌蝶的後翅帶有放射狀白紋。'}
];
const speciesSource = butterfly => 'https://purplecrow.org.tw/secret_inside/'+butterfly.slug+'.php';
const butterflyImage = new Image();
butterflyImage.src = 'purplecrow-butterflies.jpg';
// Decode once so the exported card contains the same artwork as the preview.
const butterflyReady = butterflyImage.decode().then(() => true, () => false);
const traits = {
  explore:['探索','用好奇心看見問題','為準備設定一個期限。'],
  act:['行動','從小規模嘗試中學習','嘗試後停下來檢查方向。'],
  connect:['連結','聽見不同人的觀點','聽完建議後，寫下自己最重視的事。'],
  create:['創造','讓不同想法有新的組合','先選一個點子，做一次小實驗。'],
  think:['思考','透過分析和反思釐清方向','用一個小步驟檢驗你的假設。'],
  care:['守護','留意改變能否長久持續','練習分工，也留一點時間照顧自己。']
};
const chapters = [
  ['看見世界','面對一個你還不熟悉的社會議題，什麼最容易吸引你？',[
    ['理解事情為什麼會發生','explore'],['聽見受影響者的故事','connect'],['想出不同的解決方法','create'],['看見自己可以協助的地方','act']]],
  ['第一次伸出翅膀','當你看到校園或社會裡有一件事需要改善，你想先做什麼？',[
    ['找資料確認真正的問題','think'],['邀請願意投入的夥伴','connect'],['發起一場小型實驗或活動','act'],['評估如何讓改變可以持續','care']]],
  ['重新化蛹','假設你已經有熟悉的生活，卻遇到一個需要投入數年、結果也不確定的學習機會。你會怎麼做？',[
    ['先研究這個領域，釐清未知風險','explore'],['先踏出一小步，從實際嘗試中學習','act'],['與信任的人討論，尋求不同觀點','connect'],['先確認自己的核心價值和長期目標','think']]],
  ['飛向更大的世界','如果有機會與不同文化或專業背景的人合作，你想帶去什麼能力？',[
    ['提出新問題與研究方向','explore'],['理解差異並建立信任','connect'],['把想法轉化成可執行的方案','act'],['整合不同專長，創造新方法','create']]]
];
const issues = {
  '文化理解':'找一位不同背景的同學，聽聽一個對他很重要的日常習慣。',
  '環境永續':'記錄一天用過的一次性物品，選一樣在這週試著減少。',
  '教育公平':'找一個開放學習資源，分享給一位可能用得上的同學。',
  '跨域合作':'約一位不同科系的同學聊十分鐘，一起想一個校園問題。',
  '我想再探索':'花十五分鐘讀一個關心的議題，記下一個想繼續追問的問題。'
};
const textLimits = {
  nickname:24, issue:100, action:240, evidence:140, ownStrength:100,
  resources:140, plannedTime:60, location:60, completionEvidence:140, backup:140
};
const moods = ['正在適應新環境','在尋找想走的方向','準備嘗試一件新事','想給自己一點時間'];
const modeSteps = {live:[0,1,2,3,4,5,10,8,9],explore:[0,1,2,3,4,5,6,7,8,9]};
const fresh = () => ({
  flowVersion:5, speciesVersion:2, specimen:null, step:0, mood:'',
  mode:'live', liveStep:0, exploreStep:0, liveStarted:false, exploreStarted:false,
  answers:Array(4).fill(null), nickname:'', issue:'', action:'',
  tipi:Array(10).fill(null), tipiReviewed:false, strengths:[], evidence:'',
  focus:'', practiceStrength:'', ownStrength:'', resources:'', plannedTime:'',
  location:'', completionEvidence:'', backup:''
});
function boundedText(value, limit) {
  if (typeof value !== 'string') return '';
  return Array.from(value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'')).slice(0,limit).join('');
}
function normalizeState(saved) {
  const clean = fresh();
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return clean;
  for (const [key,limit] of Object.entries(textLimits)) clean[key]=boundedText(saved[key],limit);
  if (saved.speciesVersion===2 && Number.isInteger(saved.specimen) && species[saved.specimen]) clean.specimen=saved.specimen;
  if (Number.isInteger(saved.step)) {
    const currentFlow=Number.isInteger(saved.flowVersion) && saved.flowVersion>=3;
    const step=currentFlow ? saved.step : saved.step>=6 ? saved.step+2 : saved.step;
    if (step>=0 && step<=10) clean.step=step;
  }
  if (moods.includes(saved.mood)) clean.mood=saved.mood;
  clean.answers=clean.answers.map((_,index)=>{
    const value=Array.isArray(saved.answers) ? saved.answers[index] : null;
    return Number.isInteger(value) && value>=0 && value<=3 ? value : null;
  });
  clean.tipi=clean.tipi.map((_,index)=>{
    const value=Array.isArray(saved.tipi) ? saved.tipi[index] : null;
    return Number.isInteger(value) && value>=1 && value<=7 ? value : null;
  });
  clean.tipiReviewed=saved.tipiReviewed===true;
  clean.strengths=[...new Set(Array.isArray(saved.strengths) ? saved.strengths : [])]
    .filter(id=>characterStrengths.some(strength=>strength.id===id)).slice(0,3);
  if (personalityDimensions.some(dimension=>dimension.id===saved.focus)) clean.focus=saved.focus;
  if (clean.strengths.includes(saved.practiceStrength)) clean.practiceStrength=saved.practiceStrength;
  if (saved.mode==='live' || saved.mode==='explore') clean.mode=saved.mode;
  if (Number.isInteger(saved.flowVersion) && saved.flowVersion>=5) {
    for (const mode of ['live','explore']) {
      if (modeSteps[mode].includes(saved[mode+'Step'])) clean[mode+'Step']=saved[mode+'Step'];
      clean[mode+'Started']=saved[mode+'Started']===true;
    }
  } else {
    clean.liveStep=modeSteps.live.includes(clean.step) ? clean.step : 5;
    clean.exploreStep=modeSteps.explore.includes(clean.step) ? clean.step : 5;
    clean.liveStarted=clean.step>0 || clean.answers.some(value=>value!==null);
    clean.exploreStarted=clean.tipi.some(value=>value!==null) || clean.strengths.length>0;
  }
  return clean;
}
const storageKey = 'chrysalis-journey-v1';
let storageMessage = '';
let state = fresh();
try {
  state=normalizeState(JSON.parse(localStorage.getItem(storageKey)));
} catch {
  storageMessage='先前紀錄無法讀取，這次可重新填寫。離開前請保存卡片或複製文字。';
}
const get = id => document.getElementById(id);
const stage = get('stage');
const labels = ['序章','第一章','第二章','第三章','第四章','特質拼圖','大五人格','品格優勢','七天計畫','展翅','分組討論'];
function showStorageStatus() {
  get('storage-status').textContent=storageMessage || '作答與計畫僅保存在這個瀏覽器，可使用下方按鈕刪除資料並重新開始。';
}
function save() {
  try {
    localStorage.setItem(storageKey,JSON.stringify(state));
    storageMessage='';
  } catch {
    storageMessage='此瀏覽器目前無法保存進度。離開前請保存卡片或複製文字。';
  }
  showStorageStatus();
}
function butterflyArt(i, kind='adult') {
  return `<span class="butterfly-art ${kind}" role="img" aria-label="${species[i].name}${kind==='pupa' ? '的蛹' : i===3 ? '雌蝶' : '成蝶'}水彩插畫" style="--x:${i%2*100}%;--y:${Math.floor(i/2)*100}%"></span>`;
}
function renderForest() {
  get('specimens').innerHTML = species.map((butterfly,i) =>
    `<div class="specimen"><button data-specimen="${i}" aria-pressed="${state.specimen===i}">${butterflyArt(i,'pupa')}<strong>${butterfly.name}</strong><small>${butterfly.pupa}</small></button><a class="source" href="${speciesSource(butterfly)}" target="_blank" rel="noopener noreferrer">協會物種介紹 ↗</a></div>`).join('');
  get('start').disabled = state.specimen === null;
}
function renderGallery() {
  get('butterflies').innerHTML = species.map((butterfly,i) =>
    `<article class="butterfly-entry">${butterflyArt(i)}<div class="butterfly-caption"><h3>${butterfly.name}${i===3 ? '<small>雌蝶</small>' : ''}</h3><i lang="la">${butterfly.latin}</i><p>${butterfly.note}</p><a class="source" href="${speciesSource(butterfly)}" target="_blank" rel="noopener noreferrer">協會物種介紹 ↗</a><button class="quiet" data-card-species="${i}">帶進我的成長卡 →</button></div></article>`).join('');
}
const stepNames=['prologue','chapter-1','chapter-2','chapter-3','chapter-4','reflection','personality','strengths','plan','epilogue','discussion'];
function routeFor(step,mode) {
  return mode==='explore' ? step===0 ? '#explore' : '#explore/'+stepNames[step] : '#'+stepNames[step];
}
function rememberStep() {
  state[state.mode+'Step']=state.step;
  state[state.mode+'Started']=true;
}
function setHash(hash,replace=false) {
  if (location.hash===hash) return;
  try { history[replace?'replaceState':'pushState'](null,'',hash); }
  catch { location.hash=hash; }
}
function scrollToRoute(target='journey',initial=false) {
  get(target).scrollIntoView({block:'start',behavior:initial?'instant':'auto'});
  if (target==='journey') stage.querySelector('h2').focus({preventScroll:true});
}
function go(step,mode=state.mode) {
  if (!Number.isInteger(step) || step<0 || step>=labels.length) return;
  if (step===6 || step===7) mode='explore';
  if (step===10) mode='live';
  if (!Object.hasOwn(modeSteps,mode) || !modeSteps[mode].includes(step)) return;
  state.mode=mode;
  state.step=step;
  rememberStep();
  setHash(routeFor(step,mode));
  save();
  render();
  scrollToRoute();
}
function heading(kicker,title,copy='') {
  return `<p class="eyebrow"><span></span>${kicker}</p><h2 tabindex="-1">${title}</h2>${copy ? `<p>${copy}</p>` : ''}`;
}
const next = (step,label,secondary=false) => `<button ${secondary?'class="secondary" ':''}data-step="${step}">${label}　→</button>`;
const back = step => `<button class="secondary" data-step="${step}">← 上一步</button>`;
function preferences() {
  const counts = new Map();
  state.answers.forEach((answer,i) => {
    const key = chapters[i][2][answer]?.[1];
    if (key) counts.set(key,(counts.get(key) || 0)+1);
  });
  const ranked = [...counts].sort((a,b) => b[1]-a[1]);
  const mixed = ranked.length > 1 && ranked[0][1] === ranked.at(-1)[1];
  const keys = ranked.slice(0,mixed ? ranked.length : 3).map(([key]) => key);
  return {
    words: keys.map(key => traits[key][0]),
    description: keys.length ? `在這次情境裡，你選擇了${keys.map(key => traits[key][1]).join('、')}。` : '你可以從自己在意的議題開始，慢慢找到想練習的方向。',
    tip: keys.length ? traits[keys[0]][2] : '先選一件七天內能試的小事。',
    mixed
  };
}
function renderPersonality() {
  stage.innerHTML = heading('BIG FIVE · TIPI','認識我的行動習慣','想想一般情況下的自己。每一題的兩個描述請一起考慮，再選擇同意程度。') +
    `<p class="notice">這份 10 題簡短自評提供五個向度的粗略輪廓，適合當作觀察自己的起點。可跳過任何題目，完成兩個對應題目後才會計算該向度。</p>
    <p class="rating-key">1 非常不同意 · 2 不同意 · 3 有點不同意 · 4 中立 · 5 有點同意 · 6 同意 · 7 非常同意</p>
    <div class="tipi-questions">${tipiItems.map((item,index)=>`<fieldset class="tipi-question"><legend>${index+1}. 我認為自己是${item}</legend><div class="rating-options">${agreementLabels.map((label,i)=>`<label><input type="radio" name="tipi-${index}" data-tipi="${index}" value="${i+1}" ${state.tipi[index]===i+1?'checked':''}><span>${i+1}</span><span class="sr-only">${label}</span></label>`).join('')}</div><button class="quiet" data-clear-tipi="${index}">略過／清除這題</button></fieldset>`).join('')}</div>
    <p id="tipi-count" class="notice" role="status"></p>
    <button id="review-tipi">看看我的五個向度</button>
    <div id="personality-results">${state.tipiReviewed ? personalityResults() : ''}</div>
    <details class="source-note"><summary>量表來源與閱讀方式</summary><p>TIPI 由 Gosling、Rentfrow 與 Swann（2003）發展，題目採 Lu 等人中文版，轉為繁體字呈現。每個向度由兩題計算，其中一題反向計分。分數範圍為 1–7，4 是回答刻度的中點；本頁使用原始分數，常模百分位未計算。</p><p>情緒穩定性呈現大五人格中神經質向度的反向。結果受自我理解與作答情境影響，適合搭配具體生活經驗回看。下方練習由本活動設計，可自行調整。</p><a href="https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/" target="_blank" rel="noopener noreferrer">TIPI 作者網站與計分說明 ↗</a><br><a href="https://gosling.psy.utexas.edu/wp-content/uploads/2020/03/Chinese-TIPI.pdf" target="_blank" rel="noopener noreferrer">Lu 等人中文版來源 ↗</a></details>
    <div class="actions">${back(5)}${next(7,'探索我的品格優勢')}</div>`;
  updatePersonality();
}
function updatePersonality() {
  get('tipi-count').textContent = `已回答 ${state.tipi.filter(value=>value!==null).length}／10 題，可隨時繼續。`;
  if (state.tipiReviewed) get('personality-results').innerHTML = personalityResults();
}
function personalityResults() {
  return `<h3 tabindex="-1" id="personality-heading">此刻的五個向度</h3><p class="notice">刻度兩端代表不同傾向。請對照生活經驗，選一個想練習的方向。</p>${personalityDimensions.map(dimension=>{
    const score = tipiScore(state.tipi,dimension);
    const result = score===null ? '<p class="notice">待完成這個向度的兩題，再顯示結果。</p>' : `<div class="dimension-score"><span>自評 ${score.toFixed(1)}／7</span><meter min="1" max="7" value="${score}" aria-label="${dimension.name}自評 ${score.toFixed(1)} 分，共 7 分"></meter></div><div class="dimension-poles"><span>${dimension.left}</span><span>${dimension.right}</span></div><p class="notice">可以嘗試　${personalityPractice(state.tipi,dimension)}</p>`;
    return `<article class="dimension"><h4>${dimension.name}</h4>${result}<button class="quiet" data-focus="${dimension.id}" aria-pressed="${state.focus===dimension.id}">${state.focus===dimension.id?'已選為練習方向':'我想從這裡練習'}</button></article>`;
  }).join('')}`;
}
function renderStrengths() {
  stage.innerHTML = heading('VIA · CHARACTER STRENGTHS','找到可以運用的力量','回想最近一件你真正在意、也付出心力的事。從 24 項品格優勢中，選出最多三項看得到生活例子的優勢。') +
    `<p class="notice">這裡是依 VIA 架構設計的優勢自選活動。選擇會作為你的練習素材。正式 VIA Survey 可由頁面下方的官方入口完成。</p>
    <p id="strength-count" class="notice" role="status"></p>
    <div class="strength-groups">${strengthGroups.map((group,index)=>`<section><h3>${group}</h3><div class="strength-options">${characterStrengths.filter(strength=>strength.group===index).map(strength=>`<button class="strength-choice" data-strength="${strength.id}" aria-pressed="${state.strengths.includes(strength.id)}"><strong>${strength.name}</strong><span>${strength.example}</span></button>`).join('')}</div></section>`).join('')}</div>
    <div class="fields"><label>哪件生活小事，讓你看見其中一項優勢？（選填）<textarea id="strength-evidence" rows="3" maxlength="140" placeholder="例如，我主動問一位新同學，家鄉有哪些習慣和這裡不同。"></textarea></label></div>
    <details class="source-note"><summary>延伸探索與官方問卷</summary><p>VIA 的 24 項品格優勢可在不同情境中展現與練習。此頁的選擇及生活例子由你自己決定。</p><p>VIA 官方免費問卷需到外部網站註冊並同意其條款，約需 10–15 分鐘。你可以課後完成，再回來調整想練習的優勢。</p><a href="https://www.viacharacter.org/character-strengths" target="_blank" rel="noopener noreferrer">VIA 24 項優勢介紹 ↗</a><br><a href="https://www.viacharacter.org/Survey/Account/Register" target="_blank" rel="noopener noreferrer">前往 VIA 官方問卷 ↗</a></details>
    <div class="actions">${back(6)}${next(8,'把了解化成行動')}</div>`;
  get('strength-evidence').value = state.evidence;
  updateStrengths();
}
function updateStrengths(message='') {
  get('strength-count').textContent = message || `已選 ${state.strengths.length}／3 項。再點一次可以取消。`;
  stage.querySelectorAll('[data-strength]').forEach(button=>button.setAttribute('aria-pressed',String(state.strengths.includes(button.dataset.strength))));
}
function selectedStrengths() {
  return state.strengths.map(id=>characterStrengths.find(strength=>strength.id===id));
}
function growthSuggestion() {
  const strength = characterStrengths.find(item=>item.id===state.practiceStrength);
  const dimension = personalityDimensions.find(item=>item.id===state.focus);
  const topic = state.issue || '我在意的事';
  const action = strength ? `這週，針對「${topic}」，我想運用「${strength.name}」，${strength.action}。` : Object.hasOwn(issues,state.issue) ? issues[state.issue] : issues['我想再探索'];
  return action + (dimension ? personalityPractice(state.tipi,dimension) : '');
}
function updateSuggestion() {
  get('suggestion').textContent = growthSuggestion();
}
function renderGrowthCard() {
  stage.innerHTML = heading('MY SEVEN-DAY PLAN','我的七天展翅計畫','先寫下三件事，把在乎的議題化成一個 10–30 分鐘能做的小行動。其他細節可以稍後補充，也可以只為自己保存。') +
    `<div class="actions plan-links"><a class="quiet" href="#discussion">回看 15 分鐘分組引導</a><a class="quiet" href="#explore">課後完整探索</a></div>
    <div class="fields core-fields">
    <label><span class="field-title"><b>01</b> 我在乎什麼</span><input id="issue" list="issue-ideas" maxlength="100" placeholder="一個世界、校園或生活議題，例如校園減塑"><datalist id="issue-ideas">${Object.keys(issues).map(issue=>`<option value="${issue}"></option>`).join('')}</datalist></label>
    <label><span class="field-title"><b>02</b> 我有什麼力量／資源</span><textarea id="ownStrength" rows="2" maxlength="100" placeholder="例如，願意傾聽、同組夥伴、學校資源或 AI"></textarea></label>
    <label><span class="field-title"><b>03</b> 七天之內我要做的第一步</span><textarea id="action" rows="3" maxlength="240" placeholder="例如，花十五分鐘觀察一次性物品的使用，選一種減少使用"></textarea></label></div>
    <details class="plan-details"><summary>想讓計畫更完整 <span>時間、地點、證據與其他力量</span></summary>
    <div class="fields">
    <label>可運用資源／AI 或夥伴（選填）<textarea id="resources" rows="2" maxlength="140" placeholder="例如，同組夥伴、學校國際處、用 AI 練習英文"></textarea></label>
    <label>預定日期或時間（選填）<input id="plannedTime" maxlength="60" placeholder="例如，11 月 20 日午休，花 15 分鐘"></label>
    <label>預定地點（選填）<input id="location" maxlength="60" placeholder="例如，宿舍、圖書館或線上討論"></label>
    <label>完成證據（選填）<textarea id="completionEvidence" rows="2" maxlength="140" placeholder="例如，一份觀察紀錄、完成一次訪談、拍下嘗試的成果"></textarea></label>
    <label>遇到阻礙時的備案（選填）<textarea id="backup" rows="2" maxlength="140" placeholder="例如，約不到夥伴時，先自己觀察十分鐘"></textarea></label></div>
    <div class="source-note exploration-options"><h3>帶入已做過的探索（選填）</h3>
    <p><a href="#explore/personality">大五人格簡短自評</a> · <a href="#explore/strengths">VIA 品格優勢自選</a>。都可留待課後完成，這裡的選擇不會自動改寫你的行動。</p>
    <p>已自選的 VIA 優勢　${selectedStrengths().map(strength=>strength.name).join('、') || '可在課後探索時選擇'}</p>
    <div class="fields"><label>我想練習的向度<select id="growth-focus"><option value="">先從小行動開始</option>${personalityDimensions.map(dimension=>`<option value="${dimension.id}">${dimension.name}</option>`).join('')}</select></label>
    <label>我想運用的優勢<select id="practice-strength"><option value="">先自由練習</option>${selectedStrengths().map(strength=>`<option value="${strength.id}">${strength.name}</option>`).join('')}</select></label></div>
    <div class="feedback"><strong>給這次練習的一個起點</strong><p id="suggestion"></p><button class="quiet" id="use-suggestion">用這個建議起草小行動</button></div></div>
    <div class="fields"><label>暱稱（選填）<input id="nickname" maxlength="24" autocomplete="off"></label>
    <label>卡片蝶種<select id="card-species">${species.map((butterfly,i)=>`<option value="${i}">${butterfly.name}${i===3?'（雌蝶插畫）':''}</option>`).join('')}</select></label></div></details>
    <p class="notice">所有欄位皆可選填，完成自評與優勢自選並非保存卡片的門檻。四種紫斑蝶只決定插畫，不對應人格類型或能力高低。</p>
    <canvas class="card" id="card" width="880" height="1500" aria-label="七天展翅計畫卡片預覽"></canvas>
    <div class="actions"><a class="button" id="download" aria-disabled="true" tabindex="-1">下載 PNG</a><button class="secondary" id="copy">複製文字</button>${next(9,'走向終章')}</div><p class="notice" id="notice" role="status"></p>`;
  for (const key of Object.keys(textLimits)) {
    const field=get(key);
    if (field) field.value=state[key];
  }
  get('growth-focus').value = state.focus;
  get('practice-strength').value = state.practiceStrength;
  get('card-species').value = String(state.specimen ?? 1);
  updateSuggestion();
  drawCard();
}
function renderDiscussion() {
  stage.innerHTML = heading('DISCUSS · PLAN · TAKE FLIGHT','分組討論／七天展翅計畫','聽完兩位學生的分享，現在把注意力帶回自己。3–4 人一組，用 15 分鐘找出七天內能做的第一步。') +
    `<blockquote class="discussion-core">理想是核心，身分是槓桿。<br>行動讓人踏出第一步，學習、AI 與合作讓人走得更遠。</blockquote>
    <div class="discussion-prompts"><h3>帶著三個問題討論</h3><ol><li>我在乎的世界、社會或校園議題是什麼？</li><li>我已經有哪些優勢？能運用哪些 AI、夥伴或學校資源？</li><li>我可以找誰合作？哪裡可能卡住？七天內的第一步可以怎麼做？</li></ol></div>
    <ol class="discussion-flow"><li><strong>2 分鐘 · 獨立思考</strong><p>選一個在乎的議題，先寫下自己的想法。</p></li><li><strong>6 分鐘 · 輪流分享</strong><p>說說自己的優勢與可運用資源，聽聽夥伴不同的選擇。</p></li><li><strong>4 分鐘 · 夥伴建議</strong><p>一起找出合作對象、可能阻礙，以及能做得更小的備案。</p></li><li><strong>3 分鐘 · 個人修訂</strong><p>寫清楚何時、何地、做什麼，以及如何知道完成。</p></li></ol>
    <p class="notice">依自己的意願分享，也可以只記錄或聆聽。測驗分數、家庭與私人經歷可留給自己。</p>
    <details class="source-note"><summary>安排七天的節奏</summary><p>D1–D2 確認議題 · D3–D4 找資源 · D5–D6 行動 · D7 回顧修正。可依實際狀況調整每天的安排。</p></details>
    <div class="actions">${next(8,'填寫七天展翅計畫')}<a class="button secondary" href="#explore">課後完整探索</a></div>`;
}
const directRoutes = new Map();
for (const mode of ['live','explore']) {
  for (const step of modeSteps[mode]) directRoutes.set(routeFor(step,mode),{mode,step,target:'journey',remember:true});
}
directRoutes.set('#forest',{mode:'live',step:0,target:'forest',remember:false});
directRoutes.set('#home',{mode:'live',step:0,target:'home',remember:false});
directRoutes.set('#wings',{mode:null,step:null,target:'wings',remember:false});
function resolveRoute(hash) {
  if (hash==='#resume-live' || hash==='#resume-explore') {
    const mode=hash==='#resume-live'?'live':'explore';
    return {mode,step:state[mode+'Step'],target:'journey',remember:true};
  }
  // The old #journey hash has no chapter or mode: open a safe live prologue.
  return directRoutes.get(hash) || {mode:'live',step:0,target:hash==='#journey'?'journey':'home',remember:false};
}
function openDirectRoute(initial=false) {
  const route=resolveRoute(location.hash);
  if (route.mode) { state.mode=route.mode; state.step=route.step; }
  if (route.remember) { rememberStep(); setHash(routeFor(state.step,state.mode),true); save(); }
  renderForest();
  render();
  if (initial) requestAnimationFrame(()=>scrollToRoute(route.target,true));
  else scrollToRoute(route.target);
}
function renderMode() {
  const live=state.mode==='live';
  get('mode-label').textContent=live?'現場跟著演講走':'課後完整探索';
  get('mode-hint').textContent=live?'隨講者提示操作，空檔可以放下手機聆聽。':'依自己的步調探索，大五人格與品格優勢皆可選填。';
  get('mode-switch').textContent=live?'切換課後探索':'回到現場進度';
  get('mode-switch').href=live?'#explore':'#resume-live';
  get('resume-live').hidden=!state.liveStarted;
  get('resume-live').textContent='繼續上次現場進度 · '+labels[state.liveStep];
  get('resume-explore').hidden=!state.exploreStarted;
  get('resume-explore').textContent='繼續上次課後探索 · '+labels[state.exploreStep];
}

function render() {
  renderMode();
  get('steps').innerHTML = modeSteps[state.mode].map(i => `<button data-step="${i}" ${i===state.step ? 'aria-current="step"' : ''}>${labels[i]}</button>`).join('');
  if (state.step === 0) {
    stage.innerHTML = heading('PROLOGUE','此刻的你在哪裡？','進入大學後，哪一句最接近你現在的感受？')+
      `<p class="notice">這一頁可自由選擇，也可以直接進入第一章。</p><div class="choices">${moods.map((mood,i)=>`<button class="choice" data-mood="${i}" aria-pressed="${state.mood===mood}">${mood}</button>`).join('')}</div><div class="actions">${next(1,'走到第一章')}</div>`;
  } else if (state.step <= 4) {
    const [title,prompt,options] = chapters[state.step-1];
    const answer = state.answers[state.step-1];
    stage.innerHTML = heading('CHAPTER 0'+state.step,title,prompt)+
      `<div class="choices">${options.map(([choice],i)=>`<button class="choice" data-answer="${i}" aria-pressed="${answer===i}"><b>${'ABCD'[i]}</b>${choice}</button>`).join('')}</div>
      <div id="feedback" aria-live="polite"></div><div class="actions">${back(state.step-1)}<button class="secondary" id="skip">跳過這題</button>${next(state.step+1,state.step===4?'整理我的選擇':'下一章')}</div>`;
    showFeedback();
  } else if (state.step === 5) {
    const result = preferences();
    stage.innerHTML = heading('REFLECTION','我的特質拼圖',result.mixed?'這次的選擇呈現了幾種同樣常見的方向。':'回望這次的選擇，想一想你願意帶走哪一種做法。')+
      `<div class="tags">${result.words.map(word=>`<span>${word}</span>`).join('')}</div><p>${result.description}</p>
      <div class="feedback"><strong>可以試試</strong><p>${result.tip}</p></div>
      <p class="notice">這次情境中的選擇傾向；不是心理診斷或正式人格量表。觀察、思考、傾聽與實作，都能成為行動的起點。</p>
      ${state.mode==='live' ? `<aside class="sharing-pause"><p class="eyebrow">先把手機放下</p><h3>聽見別人的選擇，<br>再回到自己的下一步。</h3><p>接下來是兩位同學的分享。先抬頭聆聽，等講者提示後再開始討論；你的選擇會留在這裡。</p></aside><div class="actions reflection-actions">${next(10,'聽完兩位學生分享，開始分組討論')}${next(8,'直接寫七天計畫',true)}${back(4)}</div>` : `<div class="actions">${back(4)}${next(6,'從大五人格認識自己')}${next(8,'回到七天計畫',true)}</div>`}`;
  } else if (state.step === 6) {
    renderPersonality();
  } else if (state.step === 7) {
    renderStrengths();
  } else if (state.step === 8) {
    renderGrowthCard();
  } else if (state.step === 10) {
    renderDiscussion();
  } else {
    stage.innerHTML = heading('EPILOGUE','展翅','化蛹之後，我們不一定飛向相同的地方。每一次選擇，都可能讓我們更接近自己想成為的樣子。')+
      `<div class="final-butterfly">${butterflyArt(state.specimen ?? 1)}<p>${species[state.specimen ?? 1].name}</p></div><h3>I grow in my own way.</h3><p class="notice">把七天的小行動留給自己，也可以課後再回來認識更多自己的力量。</p><div class="actions"><a class="button secondary" href="#wings">遇見四種紫斑蝶 ↓</a>${back(8)}<a class="button" href="#explore">課後完整探索</a><a class="button secondary" href="#forest">回到森林</a></div>`;
  }
}
function showFeedback() {
  const answer = state.answers[state.step-1];
  const box = get('feedback');
  box.className = answer===null ? '' : 'feedback';
  if (answer===null) { box.textContent=''; return; }
  const [label,description,tip] = traits[chapters[state.step-1][2][answer][1]];
  box.innerHTML = `<p><strong>${label}</strong>　這一次，你傾向${description}。</p><p>${tip}</p><details><summary>現場故事</summary><p>先保留你的選擇，聽講者分享當時的考量。留意你們各自在意的是什麼。</p></details>`;
}
async function drawCard() {
  const canvas = get('card');
  if (!canvas) return;
  const ready = await butterflyReady;
  if (get('card') !== canvas) return;
  const ctx = canvas.getContext('2d');
  const result = preferences();
  const index = state.specimen ?? 1;
  const butterfly = species[index];
  const commands = [];
  function line(text,y,size=28,width=728,family='sans-serif') {
    ctx.font = `${size}px ${family}`;
    let part = '';
    for (const character of String(text).replace(/\s+/g,' ').trim()) {
      if (character==='\n' || ctx.measureText(part+character).width>width) {
        commands.push({text:part,y,size,family});
        y+=size*1.5;
        part='';
      }
      if (character!=='\n') part+=character;
    }
    commands.push({text:part,y,size,family});
    return y+size*1.5;
  }
  line('AFTER THE CHRYSALIS',119,23);
  line('我的展翅成長卡',206,55,450,'serif');
  const nicknameEnd=line(state.nickname || 'MY GROWTH WINGS',258,23,430,'serif');
  const speciesY=Math.max(310,nicknameEnd+8);
  line(butterfly.name+(index===3?' · 雌蝶':''),speciesY,21,430,'serif');
  let y=Math.max(395,speciesY+65);
  if (result.words.length) {
    y=line('在故事裡，我選擇了',y,23);
    y=line(result.words.join(' × '),y,29)+24;
  }
  const answeredDimensions=personalityDimensions.filter(dimension=>tipiScore(state.tipi,dimension)!==null);
  if (answeredDimensions.length) {
    y=line('大五人格 · TIPI 自評（1–7）',y,25)+5;
    for (const dimension of answeredDimensions) {
      y=line(dimension.name+'　'+tipiScore(state.tipi,dimension).toFixed(1),y,27);
    }
    y=line('簡短自評，搭配生活經驗理解。',y+5,20)+25;
  }
  if (state.strengths.length) {
    y=line('我的 VIA 自選優勢',y,25);
    y=line(selectedStrengths().map(strength=>strength.name).join(' × '),y,29)+20;
  }
  if (state.evidence.trim()) {
    y=line('我看見優勢的一件小事',y,23);
    y=line(state.evidence,y,27)+20;
  }
  if (state.ownStrength.trim()) {
    y=line('我的力量',y,23);
    y=line(state.ownStrength,y,29)+20;
  }
  const dimension=personalityDimensions.find(item=>item.id===state.focus);
  if (dimension) {
    y=line('我的練習方向 · '+dimension.name,y,23);
    y=line(personalityPractice(state.tipi,dimension),y,27)+20;
  }
  y=line('我關心的議題',y,23);
  y=line(state.issue || '我想再探索',y,29)+20;
  if (state.resources.trim()) {
    y=line('可運用資源／AI 或夥伴',y,23);
    y=line(state.resources,y,27)+20;
  }
  if (state.plannedTime.trim()) {
    y=line('預定日期或時間',y,23);
    y=line(state.plannedTime,y,27)+20;
  }
  if (state.location.trim()) {
    y=line('預定地點',y,23);
    y=line(state.location,y,27)+20;
  }
  y=line('未來七天，我想……',y,23);
  y=line(state.action.trim() || '寫下一件可以實踐的小事',y,29)+25;
  if (state.completionEvidence.trim()) {
    y=line('完成證據',y,23);
    y=line(state.completionEvidence,y,27)+20;
  }
  if (state.backup.trim()) {
    y=line('遇到阻礙時的備案',y,23);
    y=line(state.backup,y,27)+20;
  }
  y=line('I grow in my own way.',y,30,728,'serif');
  canvas.height = Math.ceil(y+65);
  ctx.fillStyle='#fcf7e9'; ctx.fillRect(0,0,880,canvas.height);
  ctx.strokeStyle=butterfly.color; ctx.lineWidth=2; ctx.strokeRect(27,27,826,canvas.height-54);
  if (ready) {
    const width=butterflyImage.naturalWidth/2;
    const height=butterflyImage.naturalHeight/2;
    ctx.drawImage(butterflyImage,index%2*width,Math.floor(index/2)*height,width,height,535,68,285,285);
  }
  for (const command of commands) {
    ctx.fillStyle='#303d2b';
    ctx.font=`${command.size}px ${command.family}`;
    ctx.fillText(command.text,76,command.y);
  }
  const download=get('download');
  download.removeAttribute('href');
  download.setAttribute('aria-disabled','true');
  download.tabIndex=-1;
  try {
    if (!ready) throw new Error('Artwork not loaded');
    download.href=canvas.toDataURL('image/png');
    download.download='我的展翅成長卡_'+butterfly.name+'.png';
    download.setAttribute('aria-disabled','false');
    download.tabIndex=0;
    get('notice').textContent='';
  } catch {
    get('notice').textContent='圖片輸出暫時無法使用，可以複製文字或截圖保存。';
  }
}
get('specimens').addEventListener('click',event=>{
  const button=event.target.closest('[data-specimen]');
  if (!button) return;
  state.specimen=Number(button.dataset.specimen);
  save();
  get('specimens').querySelectorAll('[data-specimen]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  get('start').disabled=false;
  if (get('card-species')) get('card-species').value=String(state.specimen);
  if (state.step>=6) render();
});
get('start').addEventListener('click',()=>go(0,'live'));
get('science').addEventListener('click',()=>get('science-dialog').showModal());
get('reset').addEventListener('click',()=>{
  if (!confirm('要清除這個瀏覽器裡的旅程，重新開始嗎？')) return;
  state=fresh();
  try {
    localStorage.removeItem(storageKey);
    storageMessage='已刪除此瀏覽器的作答與計畫。';
  } catch {
    storageMessage='目前畫面已重設，瀏覽器儲存紀錄仍需透過網站資料設定清除。';
  }
  setHash('#home',true);
  showStorageStatus();
  renderForest();
  render();
  get('forest').scrollIntoView();
});
get('journey').addEventListener('input',event=>{
  const key=event.target.id;
  if (event.target.dataset.tipi !== undefined) {
    state.tipi[Number(event.target.dataset.tipi)]=Number(event.target.value);
    save();
    updatePersonality();
    return;
  }
  if (key==='strength-evidence') {
    state.evidence=boundedText(event.target.value,textLimits.evidence);
    if (event.target.value!==state.evidence) event.target.value=state.evidence;
    save();
    return;
  }
  if (key==='growth-focus' || key==='practice-strength') {
    state[key==='growth-focus'?'focus':'practiceStrength']=event.target.value;
    save();
    updateSuggestion();
    drawCard();
    return;
  }
  if (key==='card-species') {
    state.specimen=Number(event.target.value);
    save();
    renderForest();
    drawCard();
    return;
  }
  if (!Object.hasOwn(textLimits,key)) return;
  state[key]=boundedText(event.target.value,textLimits[key]);
  if (event.target.value!==state[key]) event.target.value=state[key];
  save();
  if (key==='issue') updateSuggestion();
  drawCard();
});
get('journey').addEventListener('click',async event=>{
  const button=event.target.closest('button');
  if (!button) return;
  if ('clearTipi' in button.dataset) {
    const index=Number(button.dataset.clearTipi);
    state.tipi[index]=null;
    stage.querySelectorAll(`[name="tipi-${index}"]`).forEach(input=>input.checked=false);
    updatePersonality();
  }
  if (button.id==='review-tipi') {
    state.tipiReviewed=true;
    updatePersonality();
    get('personality-heading').focus();
  }
  if ('focus' in button.dataset) {
    state.focus=button.dataset.focus;
    updatePersonality();
    stage.querySelector(`[data-focus="${state.focus}"]`).focus({preventScroll:true});
  }
  if ('strength' in button.dataset) {
    const id=button.dataset.strength;
    if (state.strengths.includes(id)) {
      state.strengths=state.strengths.filter(value=>value!==id);
    } else if (state.strengths.length<3) {
      state.strengths.push(id);
    } else {
      updateStrengths('已選三項。可以先取消一項，再換上想探索的優勢。');
      return;
    }
    if (!state.strengths.includes(state.practiceStrength)) state.practiceStrength=state.strengths[0] || '';
    updateStrengths();
  }
  if ('step' in button.dataset) { go(Number(button.dataset.step)); return; }
  if ('mood' in button.dataset) {
    state.mood=moods[Number(button.dataset.mood)];
    rememberStep();
    stage.querySelectorAll('[data-mood]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  }
  if ('answer' in button.dataset) {
    state.answers[state.step-1]=Number(button.dataset.answer);
    stage.querySelectorAll('[data-answer]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    showFeedback();
  }
  if (button.id==='skip') {
    state.answers[state.step-1]=null;
    go(state.step+1);
    return;
  }
  if (button.id==='use-suggestion') {
    if (state.action.trim() && !confirm('要用這個建議取代目前寫好的七天小行動嗎？其他內容會保留。')) return;
    state.action=growthSuggestion();
    get('action').value=state.action;
    drawCard();
  }
  if (button.id==='copy') {
    const result=preferences();
    const scores=personalityDimensions.map(dimension=>{
      const score=tipiScore(state.tipi,dimension);
      return dimension.name+'　'+(score===null?'待完成':score.toFixed(1)+'/7');
    }).join('、');
    const planningFields=[['我的力量',state.ownStrength],['可運用資源／AI 或夥伴',state.resources],['預定日期或時間',state.plannedTime],['預定地點',state.location],['完成證據',state.completionEvidence],['遇到阻礙時的備案',state.backup]];
    const message=['我的七天展翅計畫',state.nickname,species[state.specimen ?? 1].name,result.words.length ? '故事選擇　'+result.words.join(' × ') : '',state.tipi.some(value=>value!==null) ? '大五人格 TIPI 簡短自評　'+scores : '',state.strengths.length ? 'VIA 自選優勢　'+selectedStrengths().map(strength=>strength.name).join('、') : '',state.evidence,state.focus ? personalityPractice(state.tipi,personalityDimensions.find(dimension=>dimension.id===state.focus)) : '',state.issue,state.action,...planningFields.filter(([,value])=>value.trim()).map(([label,value])=>label+'　'+value),'I grow in my own way.'].filter(Boolean).join('\n');
    try {
      await navigator.clipboard.writeText(message);
      if (get('notice')) get('notice').textContent='已複製成長卡文字。';
    } catch {
      if (get('notice')) get('notice').textContent='瀏覽器無法存取剪貼簿，可下載圖片或截圖保留成長卡。';
    }
  }
  save();
});
get('butterflies').addEventListener('click',event=>{
  const button=event.target.closest('[data-card-species]');
  if (!button) return;
  state.specimen=Number(button.dataset.cardSpecies);
  renderForest();
  go(8);
});
renderGallery();
openDirectRoute(true);
showStorageStatus();
window.addEventListener('hashchange',()=>openDirectRoute());
