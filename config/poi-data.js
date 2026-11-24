// 景点详情数据配置
const POI_DATA = {
  longhua_temple: {
    name: "🏯 龙华寺",
    subtitle: "千年古刹 · 弥勒道场 · 心灵治愈地",
    location: "📍 徐汇区龙华路 2853 号",
    time: "🕐 7:00-16:30",
    price: "💰 20 元",
    open: "7:00-16:30",
    transport: "地铁 11/12 号线",
    phone: "021-64561122",
    story: `
      <p>咳咳，老夫从宋代就守护着龙华塔，到现在已经 1764 岁啦！</p>
      <p>你知道吗？龙华寺始建于三国吴赤乌五年，也就是公元 262 年。那时候，孙权还在当皇帝呢！</p>
      <p>传说，孙权为了孝敬他的母亲，建造了这座寺庙。寺里供奉的是弥勒佛，就是那个笑口常开的大肚和尚。</p>
      <p>一千七百多年来，龙华寺见证了无数朝代更迭。隋朝的烽火、唐朝的繁荣、宋朝的文雅、明清的沧桑...老夫都看在眼里。</p>
      <div class="highlight">"龙华千载仰高风，塔影波光映碧空。"</div>
      <p>现在啊，年轻人都不爱听这些老故事了。但是，我觉得，历史是有温度的。每一块砖，每一片瓦，都有自己的故事。</p>
    `,
    photos: [
      {icon:"🏯",title:"天王殿正门",tip:"仰拍，展现寺庙庄严",best:"上午 9 点"},
      {icon:"🐱",title:"福来猫打卡点",tip:"抓拍猫咪，治愈感满分",best:"下午 2 点"},
      {icon:"🌸",title:"桃花树下",tip:"春季限定，汉服绝佳",best:"3 月中旬"},
      {icon:"🏮",title:"红灯笼长廊",tip:"对称构图，古风满满",best:"黄昏时分"}
    ],
    danmus: [
      {user:"小明同学",text:"今天遇到了福来猫，超治愈！它居然让我摸耳朵了～",time:"10 分钟前",color:"#ff6b6b"},
      {user:"文艺少女",text:"红墙真的太出片了！穿汉服来拍，朋友圈炸了",time:"30 分钟前",color:"#4ecdc4"},
      {user:"打工人的日常",text:"EMO 的时候来这里坐一会儿，心情真的会变好",time:"1 小时前",color:"#ffe66d"},
      {user:"上海土著",text:"从小就来这里，素斋馆的素面还是小时候的味道",time:"2 小时前",color:"#95e1d3"}
    ],
    challenges: [
      {icon:"🐱",title:"寻找福来",desc:"找到福来猫并合影",reward:"福来头像框"},
      {icon:"🗼",title:"登高望远",desc:"爬完龙华塔 7 层",reward:"塔顶壁纸"},
      {icon:"🍜",title:"素斋修行",desc:"吃素斋并打卡",reward:"功德 +1"},
      {icon:"🙏",title:"许愿祈福",desc:"在许愿墙写下心愿",reward:"心愿符"}
    ],
    eggs: [
      {icon:"🐉",title:"龙龙的秘密",hint:"在天王殿的某个角落...",content:"龙龙说：'我其实在这里藏了一枚硬币，据说摸到它的人会有好运哦！位置就在...天王殿左侧第三根柱子的基座下。'"},
      {icon:"🐱",title:"福来的宝藏",hint:"福来最喜欢晒太阳的地方...",content:"福来说：'喵～我平时最喜欢在天王殿门口的石阶上晒太阳。如果你在那里等我，我可能会让你摸我的耳朵哦！'"},
      {icon:"🌸",title:"桃花的秘密",hint:"春天盛开的地方...",content:"寺里的师父说：'后院有一棵 300 年的桃花树，据说在树下许愿，桃花运会特别灵验哦！'"}
    ]
  },
  
  longhua_pagoda: {
    name: "🗼 龙华塔",
    subtitle: "宋代古塔 · 镇河安民 · 登高望远",
    location: "📍 龙华寺东侧",
    time: "🕐 8:00-16:00",
    price: "💰 10 元",
    open: "8:00-16:00",
    transport: "地铁 11 号线",
    phone: "021-64561122",
    story: `
      <p>老夫就是龙华塔！从北宋太平兴国二年（977 年）到现在，已经 1049 岁啦！</p>
      <p>我有七层八面，高 40.64 米。在古代，我可是吴淞江上的航标灯！船夫们远远看到我，就知道：哦，龙华镇到了！</p>
      <p>我的每一层，都有佛像。第一层是弥勒佛，第二层是四大天王，第三层...咳咳，太多了记不住了。</p>
      <div class="highlight">"塔影入波清见底，钟声过江远闻名。"</div>
      <p>爬到我顶楼，可以看到整个龙华。年轻人，要不要来挑战一下？7 层而已，不累的！</p>
    `,
    photos: [
      {icon:"🗼",title:"塔身全景",tip:"仰拍，展现古塔雄伟",best:"上午 10 点"},
      {icon:"🌉",title:"塔顶俯瞰",tip:"俯拍龙华全景",best:"下午 4 点"},
      {icon:"🌅",title:"日落剪影",tip:"逆光拍摄",best:"日落时分"},
      {icon:"🏮",title:"夜景灯光",tip:"长曝光",best:"晚上 8 点"}
    ],
    danmus: [
      {user:"登山爱好者",text:"7 层塔爬完气喘吁吁，但景色值得！",time:"20 分钟前",color:"#f38181"},
      {user:"摄影师",text:"日落的逆光剪影太美了，建议带三脚架",time:"1 小时前",color:"#aa96da"},
      {user:"历史迷",text:"宋代建筑，保存这么好，不容易",time:"3 小时前",color:"#fcbad3"},
      {user:"情侣日常",text:"和 TA 一起爬到顶楼，许下了约定",time:"昨天",color:"#a8d8ea"}
    ],
    challenges: [
      {icon:"🗼",title:"登高挑战",desc:"爬完 7 层塔",reward:"登高望远勋章"},
      {icon:"📸",title:"塔顶打卡",desc:"在塔顶拍照",reward:"塔顶壁纸"},
      {icon:"🌅",title:"日落观测",desc:"在塔上看日落",reward:"日落纪念"},
      {icon:"📿",title:"数佛像",desc:"数清每层佛像",reward:"博学勋章"}
    ],
    eggs: [
      {icon:"👑",title:"塔刹秘密",hint:"塔的最顶端...",content:"传说塔刹里藏着佛经，但没人上去验证过。你要不要试试？"},
      {icon:"🐦",title:"燕子窝",hint:"每年春天回来的朋友...",content:"塔的第二层有个燕子窝，每年春天燕子都会回来。它们才是真正的时间旅行者！"},
      {icon:"🌙",title:"月光宝盒",hint:"月圆之夜的特别景观...",content:"中秋节的晚上，月光会透过塔窗照在地面的特定位置，形成一个神奇的图案。"}
    ]
  },
  
  west_bund: {
    name: "🌅 西岸滨江",
    subtitle: "城市阳台 · 日落观测 · 运动休闲",
    location: "📍 徐汇区龙腾大道",
    time: "🕐 全天开放",
    price: "💰 免费",
    open: "全天",
    transport: "地铁 11 号线云锦路",
    phone: "-",
    story: `
      <p>这里是上海的新名片——西岸滨江！曾经的老工业区，现在变成了文艺青年聚集地。</p>
      <p>沿着江边漫步，一边是黄浦江的波光粼粼，一边是美术馆、剧院、咖啡馆...传统与现代，在这里完美融合。</p>
      <p>下午 5 点 20 分，太阳会落在江面上，把天空染成橘红色。这个时候，最适合说"我喜欢你"。</p>
      <div class="highlight">"落霞与孤鹜齐飞，秋水共长天一色。"</div>
      <p>累了就找个咖啡馆坐下，看来往的人群，看江上的船只。时间，在这里慢了下来。</p>
    `,
    photos: [
      {icon:"🌅",title:"日落观景",tip:"逆光剪影绝美",best:"17:20"},
      {icon:"🎨",title:"涂鸦墙",tip:"街头风，色彩丰富",best:"下午 3 点"},
      {icon:"🚴",title:"骑行道",tip:"运动风，活力满满",best:"早晨 7 点"},
      {icon:"☕",title:"江景咖啡",tip:"悠闲下午茶",best:"下午 2 点"}
    ],
    danmus: [
      {user:"跑步达人",text:"每天早上来这里跑 5 公里，江风很舒服",time:"今天早上",color:"#4ecdc4"},
      {user:"情侣约会",text:"日落时分太浪漫了！表白的绝佳地点",time:"2 小时前",color:"#ff6b6b"},
      {user:"摄影爱好者",text:"建议带广角镜头，江景太壮观",time:"昨天",color:"#ffe66d"},
      {user:"文艺青年",text:"在咖啡馆坐了一下午，看人来人往，很治愈",time:"昨天",color:"#95e1d3"}
    ],
    challenges: [
      {icon:"🚴",title:"滨江骑行",desc:"骑行完整条滨江道",reward:"骑行达人"},
      {icon:"🌅",title:"日落打卡",desc:"拍摄日落美景",reward:"日落壁纸"},
      {icon:"☕",title:"咖啡探店",desc:"打卡 3 家咖啡馆",reward:"咖啡达人"},
      {icon:"🎨",title:"艺术巡礼",desc:"参观 3 个美术馆",reward:"艺术护照"}
    ],
    eggs: [
      {icon:"🎭",title:"隐藏雕塑",hint:"在某个不起眼的角落...",content:"江边有个不太起眼的雕塑，是著名艺术家的作品。找到它，你会惊喜的！"},
      {icon:"🌸",title:"樱花大道",hint:"春天的惊喜...",content:"3 月中旬，滨江的樱花大道会盛开，粉色的花海超级美！"},
      {icon:"🎵",title:"街头音乐",hint:"周末的特别演出...",content:"周六下午 3 点，经常有街头艺人在这里表演。有时候还能遇到小型音乐会！"}
    ]
  }
};

// 标签页切换
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// 初始化页面
function initPage(poiId) {
  const data = POI_DATA[poiId];
  if (!data) {
    showToast('❌ 景点不存在');
    return;
  }
  
  document.getElementById('poiName').textContent = data.name;
  document.getElementById('poiSubtitle').textContent = data.subtitle;
  document.getElementById('poiLocation').textContent = data.location;
  document.getElementById('poiTime').textContent = data.time;
  document.getElementById('poiPrice').textContent = data.price;
  document.getElementById('infoOpen').textContent = data.open;
  document.getElementById('infoPrice').textContent = data.price.replace('💰','');
  document.getElementById('infoTransport').textContent = data.transport;
  document.getElementById('infoPhone').textContent = data.phone;
  document.getElementById('storyText').innerHTML = data.story;
  
  // 渲染拍照点
  const photoGrid = document.getElementById('photoGrid');
  photoGrid.innerHTML = data.photos.map(p => `
    <div class="photo-spot">
      <div class="image">${p.icon}</div>
      <div class="title">${p.title}</div>
      <div class="tip">${p.tip}</div>
      <span class="best-time">⏰ ${p.best}</span>
    </div>
  `).join('');
  
  // 渲染弹幕
  const danmuContainer = document.getElementById('danmuContainer');
  danmuContainer.innerHTML = data.danmus.map(d => `
    <div class="danmu" style="background:${d.color}">
      <div class="user">${d.user}</div>
      <div class="text">${d.text}</div>
      <div class="time">${d.time}</div>
    </div>
  `).join('');
  
  // 渲染挑战
  const challengeGrid = document.getElementById('challengeGrid');
  challengeGrid.innerHTML = data.challenges.map((c, i) => `
    <div class="interactive-item" onclick="completeChallenge('challenge_${i}')">
      <div class="icon">${c.icon}</div>
      <div class="title">${c.title}</div>
      <div class="desc">${c.desc}</div>
      <div class="reward">🏆 ${c.reward}</div>
      <div class="progress-bar" style="background:#f0e6de;border-radius:20px;height:6px;margin-top:8px;overflow:hidden">
        <div id="progress_challenge_${i}" style="background:linear-gradient(90deg,#F9B572,#E87A5D);height:100%;width:0%;transition:width 0.5s"></div>
      </div>
    </div>
  `).join('');
  
  // 渲染彩蛋
  const eggContainer = document.getElementById('eggContainer');
  eggContainer.innerHTML = `
    <p style="margin-bottom:12px;opacity:0.9;font-size:0.85rem">${data.eggs.length} 个秘密等你发现！</p>
    ${data.eggs.map((e, i) => `
      <div class="egg-item" onclick="revealEgg('egg_${i}')">
        <div class="egg-header">
          <span class="egg-icon">${e.icon}</span>
          <span class="egg-title">${e.title}</span>
        </div>
        <div class="egg-hint">💡 ${e.hint}</div>
        <div class="egg-content" id="egg_${i}_content">
          <p>${e.content}</p>
          <button onclick="claimEggReward('${e.title}')" style="margin-top:8px;background:#fbbf24;color:#1a1a2e;border:none;padding:6px 12px;border-radius:16px;font-weight:600;cursor:pointer;font-size:0.75rem">🏆 领取奖励</button>
        </div>
      </div>
    `).join('')}
  `;
  
  // 保存到全局变量
  window.currentPoi = data;
}

// 播放故事
function playStory() {
  showToast('🔊 正在播放语音...');
  // 这里可以接入语音合成
}

// 发送弹幕
function sendDanmu() {
  const input = document.getElementById('danmuInput');
  const text = input.value.trim();
  if (!text) return;
  
  const colors = ["#ff6b6b","#4ecdc4","#ffe66d","#95e1d3","#f38181","#aa96da"];
  const danmuContainer = document.getElementById('danmuContainer');
  
  const newDanmu = document.createElement('div');
  newDanmu.className = 'danmu';
  newDanmu.style.background = colors[Math.floor(Math.random() * colors.length)];
  newDanmu.innerHTML = `
    <div class="user">我</div>
    <div class="text">${text}</div>
    <div class="time">刚刚</div>
  `;
  
  danmuContainer.insertBefore(newDanmu, danmuContainer.firstChild);
  input.value = '';
  showToast('✅ 发送成功');
}

// 完成挑战
function completeChallenge(id) {
  const progress = document.getElementById('progress_' + id);
  progress.style.width = '100%';
  showToast('🎉 挑战完成！获得奖励');
}

// 揭示彩蛋
function revealEgg(eggId) {
  const content = document.getElementById(eggId + '_content');
  const item = content.parentElement;
  content.classList.toggle('show');
  item.classList.add('found');
}

// 领取奖励
function claimEggReward(reward) {
  showToast('🏆 已获得：' + reward);
}

// 打卡
function checkIn() {
  const poiId = new URLSearchParams(window.location.search).get('id') || 'longhua_temple';
  const key = 'checkin_' + poiId;
  const lastCheckin = localStorage.getItem(key);
  const now = Date.now();
  
  if (lastCheckin && (now - lastCheckin) < 86400000) {
    showToast('✅ 今天已打卡，明天再来哦');
  } else {
    localStorage.setItem(key, now);
    showToast('✅ 打卡成功！获得纪念勋章');
  }
}

// 提示框
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
  const poiId = new URLSearchParams(window.location.search).get('id') || 'longhua_temple';
  initPage(poiId);
});