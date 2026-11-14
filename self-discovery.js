'use strict';

// TIPI item order and scoring follow Gosling, Rentfrow & Swann (2003).
// Wording follows Lu et al.'s Chinese translation, displayed in traditional characters.
const tipiItems = [
  '外向的，熱情的',
  '挑剔的，愛爭論的',
  '可靠的，自律的',
  '焦慮的，易心煩的',
  '願意接觸新事物的，思維複雜的',
  '內斂的，安靜的',
  '有同情心的，溫暖的',
  '缺乏條理的，粗心的',
  '冷靜的，情緒穩定的',
  '循規蹈矩的，缺乏創造性的'
];
const agreementLabels = ['非常不同意','不同意','有點不同意','中立','有點同意','同意','非常同意'];
const personalityDimensions = [
  {id:'openness',name:'開放性',positive:4,reverse:9,left:'偏好熟悉與具體',right:'樂於新奇與想像',
    practices:['從熟悉的例子出發，試一個小變化。','在熟悉的方法與新方法之間，各試一次。','把新點子縮成一次能完成的小嘗試。']},
  {id:'conscientiousness',name:'盡責性',positive:2,reverse:7,left:'偏好彈性與即興',right:'偏好規劃與持續',
    practices:['安排一次十五分鐘時段，只完成最小的一步。','訂一個小目標，並留一段能調整的時間。','先寫下做到什麼程度就足夠，留出休息時間。']},
  {id:'extraversion',name:'外向性',positive:0,reverse:5,left:'偏好安靜與少量互動',right:'偏好活躍與較多互動',
    practices:['先獨自整理，再找一位同學交換想法。','交替試一次獨立思考與一次小組討論。','找一位夥伴一起開始，並留時間聽完他的想法。']},
  {id:'agreeableness',name:'親和性',positive:6,reverse:1,left:'較直接地提出質疑',right:'較重視體諒與合作',
    practices:['提出不同意見前，先確認對方想解決的問題。','練習同時說出自己的需要與對方的考量。','練習在願意幫忙時，也說清楚自己的時間界線。']},
  {id:'stability',name:'情緒穩定性',positive:8,reverse:3,left:'較容易感受情緒波動',right:'較常維持平穩',
    practices:['把任務拆小，記下需要的支持，再開始第一步。','做完一小步，記下當時的感受與需要。','行動後停一下，問問自己與夥伴目前的感受。']}
];
function tipiScore(answers, dimension) {
  const positive = answers[dimension.positive];
  const reverse = answers[dimension.reverse];
  const valid = value => Number.isInteger(value) && value >= 1 && value <= 7;
  if (!valid(positive) || !valid(reverse)) return null;
  return (positive + 8 - reverse) / 2;
}
function personalityPractice(answers, dimension) {
  const score = tipiScore(answers, dimension);
  if (score === null || score === 4) return dimension.practices[1];
  return dimension.practices[score < 4 ? 0 : 2];
}
// The following examples and seven-day practices are original classroom activities.
// Selection is a reflection exercise, not a VIA Survey score or ranking.
const strengthGroups = ['智慧與知識','勇氣','人性','正義','節制','超越'];
const characterStrengths = [
  {id:'creativity',name:'創造力',group:0,example:'為同一個難題想出另一種做法',action:'畫出兩種解決小問題的方法，挑一種試作'},
  {id:'curiosity',name:'好奇心',group:0,example:'遇到不懂的事情，願意多問一句',action:'寫下三個好奇的問題，花十五分鐘找一項答案'},
  {id:'judgment',name:'判斷力',group:0,example:'聽過不同證據後，願意修正看法',action:'比較兩個觀點，記下各自的證據與一個待查問題'},
  {id:'learning',name:'熱愛學習',group:0,example:'為了弄懂一件事，主動延伸閱讀',action:'用十五分鐘學一個新概念，再用自己的話寫下來'},
  {id:'perspective',name:'洞察力',group:0,example:'幫朋友從更完整的角度看事情',action:'從兩種角色的角度看同一件事，寫下新的理解'},
  {id:'bravery',name:'勇敢',group:1,example:'有點緊張，仍願意說出重要想法',action:'在一次討論中，說出一個自己在意的問題'},
  {id:'perseverance',name:'毅力',group:1,example:'碰到卡關，仍完成約定的一小步',action:'連續三天，每天用十分鐘推進同一個小任務'},
  {id:'honesty',name:'誠實',group:1,example:'坦白自己的想法，也承認不確定',action:'寫下自己知道與尚未知道的事，向一位夥伴坦白請教'},
  {id:'zest',name:'熱情',group:1,example:'帶著投入感參與眼前的活動',action:'選一項有興趣的小活動，投入十五分鐘並記下感受'},
  {id:'love',name:'愛與被愛',group:2,example:'在親近關係中互相支持與關心',action:'與一位信任的人聊一件在意的事，也聽聽他的需要'},
  {id:'kindness',name:'仁慈',group:2,example:'留意他人的需要，提供適合的幫助',action:'先問一位同學需要什麼，再提供一項做得到的協助'},
  {id:'social',name:'社會智慧',group:2,example:'留意談話中彼此的感受與處境',action:'在一次談話中先聽完，確認對方的感受再回應'},
  {id:'teamwork',name:'團隊合作',group:3,example:'完成自己的分工，也關心整體進度',action:'與一位夥伴分工完成小任務，結束後互相回饋'},
  {id:'fairness',name:'公平',group:3,example:'讓比較少說話的人也有參與機會',action:'在一次討論中，邀請還沒發言的人表達想法'},
  {id:'leadership',name:'領導力',group:3,example:'協助大家找到共同目標與下一步',action:'邀兩位同學確認一個共同目標，安排一次短討論'},
  {id:'forgiveness',name:'寬恕',group:4,example:'在安全界線內，給修復關係的空間',action:'回想一次小摩擦，寫下願意放下的部分與要保留的界線'},
  {id:'humility',name:'謙遜',group:4,example:'看見自己的貢獻，也肯定別人的功勞',action:'請一位夥伴提供回饋，並具體感謝他的貢獻'},
  {id:'prudence',name:'審慎',group:4,example:'行動前留意可能的影響與代價',action:'寫下小計畫的時間與資源，再選一個可以承擔的步驟'},
  {id:'regulation',name:'自我調節',group:4,example:'察覺分心，幫自己回到想做的事',action:'關掉通知十五分鐘，完成一個事先選定的小任務'},
  {id:'beauty',name:'欣賞美與卓越',group:5,example:'留心自然之美或他人投入的功夫',action:'觀察一處自然細節或一件用心的作品，記下一個發現'},
  {id:'gratitude',name:'感恩',group:5,example:'記得得到的幫助，並表達感謝',action:'向一位幫助過自己的人，說明他的哪個舉動帶來影響'},
  {id:'hope',name:'希望',group:5,example:'相信可以往前走，也願意找方法',action:'寫下一個期待，列出一條可走的路與一個備案'},
  {id:'humor',name:'幽默',group:5,example:'用體貼的幽默讓大家放鬆一點',action:'在不取笑他人的前提下，分享一個讓團隊放鬆的日常趣事'},
  {id:'spirituality',name:'靈性與意義感',group:5,example:'思考日常行動與人生意義的連結',action:'寫下這件事為什麼值得自己投入，再做一個符合這個理由的行動'}
];
