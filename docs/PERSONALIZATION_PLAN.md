# 🎯 千人千面实现方案

*最后更新：2026-04-24 | 版本：v1.0*

---

## 📊 核心思路

```
用户画像 + 实时情境 → 个性化路线生成
```

---

## 🗂️ 数据维度

| 维度 | 采集方式 | 用途 | 示例 |
|------|---------|------|------|
| **基础信息** | 用户填写 | 称呼、同行人员 | 小王、情侣 |
| **兴趣偏好** | 多选标签 | 推荐匹配景点 | 拍照/美食/文艺 |
| **预算水平** | 下拉选择 | 筛选消费范围 | 省钱/舒适/豪华 |
| **体力水平** | 下拉选择 | 调整路线长度 | 轻松/正常/充沛 |
| **历史行为** | localStorage | 学习偏好、去重 | 去过的地方、评分 |
| **实时情境** | 传感器/时间 | 动态调整 | 天气、时间、心情 |

---

## 🔧 技术实现

### 方案 A：本地智能（当前实现）

**原理**: JavaScript + localStorage 实现用户画像

**数据结构**:
```javascript
// 用户画像（存储在 localStorage）
const userProfile = {
  name: "小王",                    // 称呼
  companion: "couple",             // 同行人员
  interests: ["photo", "food"],    // 兴趣标签
  budget: "medium",                // 预算水平
  energy: "medium",                // 体力水平
  visitedPlaces: ["龙华寺", "塔影空间"],  // 去过的地方
  historicalRatings: [             // 历史评分
    { place: "龙华寺", rating: 5, date: "2026-04-20" },
    { place: "塔影空间", rating: 4, date: "2026-04-22" }
  ],
  usageCount: 3                    // 使用次数
};
```

**推荐算法**:
```javascript
function generatePersonalRoute(emotion, userProfile) {
  const allPoints = ALL_POIS[emotion];
  
  // 1. 排除去过的地方
  let candidates = allPoints.filter(p => 
    !userProfile.visitedPlaces.includes(p.name)
  );
  
  // 2. 根据兴趣标签加分
  candidates.forEach(p => {
    p.matchScore = 50; // 基础分
    userProfile.interests.forEach(interest => {
      if (p.tags.includes(interest)) p.matchScore += 20;
    });
  });
  
  // 3. 根据预算筛选
  const budgetLimits = { low: 100, medium: 300, high: 1000 };
  const limit = budgetLimits[userProfile.budget];
  candidates = candidates.filter(p => p.cost <= limit / 5);
  
  // 4. 根据体力调整长度
  const energyMap = { low: 3, medium: 6, high: 10 };
  const count = energyMap[userProfile.energy];
  
  // 5. 按匹配度排序
  candidates.sort((a, b) => b.matchScore - a.matchScore);
  
  // 6. 返回前 N 个
  return candidates.slice(0, count);
}
```

**优势**:
- ✅ 无需后端
- ✅ 隐私安全（数据在本地）
- ✅ 即时响应
- ✅ 黑客松可演示

**劣势**:
- ⚠️ 数据仅限于当前设备
- ⚠️ 无法跨设备同步
- ⚠️ 算法相对简单

---

### 方案 B：云端 AI（豆包 API）

**原理**: 用豆包大模型分析用户画像生成路线

**API 调用**:
```javascript
const prompt = `
你是一个专业的旅行规划师。请根据以下用户画像，推荐 5 个适合的龙华景点：

用户画像：
- 称呼：小王
- 年龄：28 岁
- 职业：程序员
- 同行：情侣
- 兴趣：拍照、咖啡、文艺
- 去过的地方：龙华寺、塔影空间
- 预算：中等（100-300 元）
- 体力：正常
- 今天心情：EMO 求治愈
- 特别需求：想看日落

请返回 JSON 格式：
{
  "route": [
    {
      "name": "景点名称",
      "why": "推荐理由（结合用户画像）",
      "matchReason": "为什么适合这个用户",
      "cost": 预估消费，
      "time": 预计时长
    }
  ]
}
`;

const response = await callDoubaoAPI(prompt);
```

**优势**:
- ✅ 真正的 AI 推荐
- ✅ 可以理解复杂需求
- ✅ 推荐理由更人性化
- ✅ 越用越懂你

**劣势**:
- ⚠️ 需要 API Key
- ⚠️ 有调用成本
- ⚠️ 响应速度较慢

---

### 方案 C：混合方案（最佳体验）

**原理**: 本地快速推荐 + 云端深度分析

**流程**:
```
第 1 次访问 → 本地快速推荐（基于简单问卷）
   ↓
第 3 次访问 → 本地智能推荐（基于历史行为）
   ↓
第 10 次访问 → 云端深度分析（AI 学习偏好）
   ↓
持续学习 → 每次评分后更新画像
```

**实现**:
```javascript
async function generateRoute() {
  const userProfile = loadProfile();
  
  // 根据使用次数选择策略
  if (userProfile.usageCount < 3) {
    // 新用户：简单推荐
    return quickRecommend(emotion, userProfile);
  } else if (userProfile.usageCount < 10) {
    // 中级用户：本地智能推荐
    return smartRecommend(emotion, userProfile);
  } else {
    // 高级用户：云端 AI 推荐
    return aiRecommend(emotion, userProfile);
  }
}
```

---

## 📋 当前实现功能

### 1. 用户信息收集

```
✅ 称呼（可选）
✅ 同行人员（一个人/情侣/家人/朋友）
✅ 兴趣偏好（拍照/美食/文艺/历史/自然/运动）
✅ 预算范围（省钱/舒适/豪华）
✅ 体力水平（轻松/正常/充沛）
✅ 特别需求（自由输入）
```

### 2. 用户画像展示

```
✅ 欢迎横幅（显示称呼）
✅ 兴趣标签展示
✅ 学习次数统计
✅ 已探索景点数
✅ 平均评分
✅ 资料完整度进度条
```

### 3. 个性化推荐算法

```
✅ 根据兴趣标签匹配景点
✅ 根据预算筛选景点
✅ 根据体力调整路线长度
✅ 排除已去过的景点
✅ 计算匹配度百分比
✅ 显示个性化推荐理由
```

### 4. 历史学习机制

```
✅ 记录去过的景点
✅ 记录路线评分
✅ 累计使用次数
✅ 平均评分计算
✅ 数据持久化（localStorage）
```

### 5. 个性化 UI 展示

```
✅ 个人专属徽章
✅ 匹配度显示
✅ 个性化推荐理由
✅ AI 分析标识
✅ 欢迎弹窗（首次使用）
```

---

## 🎯 推荐算法详解

### 匹配度计算

```javascript
function calculateMatchScore(poi, userProfile) {
  let score = 50; // 基础分 50
  
  // 兴趣匹配（+20 每项）
  userProfile.interests.forEach(interest => {
    if (poi.tags.includes(interest)) score += 20;
  });
  
  // 预算匹配
  const avgCost = userProfile.budget === 'low' ? 30 : 
                  userProfile.budget === 'medium' ? 100 : 300;
  if (poi.cost <= avgCost * 0.5) score += 15;
  else if (poi.cost <= avgCost) score += 10;
  
  // 同行人员匹配
  if (userProfile.companion === 'alone' && poi.tags.includes('quiet')) score += 10;
  if (userProfile.companion === 'couple' && poi.tags.includes('romantic')) score += 10;
  if (userProfile.companion === 'family' && poi.tags.includes('family')) score += 10;
  if (userProfile.companion === 'friends' && poi.tags.includes('social')) score += 10;
  
  // 体力匹配
  const energyMap = { low: 30, medium: 60, high: 120 };
  if (poi.time <= energyMap[userProfile.energy]) score += 5;
  
  // 特别需求匹配
  if (userProfile.specialRequest && 
      (poi.why.includes(userProfile.specialRequest) || 
       poi.name.includes(userProfile.specialRequest))) {
    score += 25;
  }
  
  return Math.min(score, 100); // 最高 100 分
}
```

### 路线生成流程

```
1. 获取用户画像
   ↓
2. 根据情绪获取候选景点池
   ↓
3. 排除已去过的景点
   ↓
4. 计算每个景点的匹配度
   ↓
5. 根据预算筛选
   ↓
6. 根据体力确定数量
   ↓
7. 按匹配度排序
   ↓
8. 返回前 N 个景点
   ↓
9. 计算总时长和总消费
   ↓
10. 生成个性化推荐理由
```

---

## 📊 演示场景

### 场景 1：首次使用

```
用户：小王，程序员，第一次来
填写：兴趣=拍照 + 美食，预算=舒适，体力=正常，心情=EMO
推荐：龙华寺（撸猫治愈）→ 素斋馆（美食）→ 塔影空间（拍照）
匹配度：78%
话术："为你量身定制的治愈路线，结合了你的拍照和美食兴趣"
```

### 场景 2：第 5 次使用

```
用户：小王，已去过 5 个景点，平均评分 4.2
填写：兴趣=拍照 + 文艺，预算=舒适，体力=充沛，心情=想拍照
推荐：龙美术馆（没去过）→ 西岸大剧院（没去过）→ 油罐艺术中心（没去过）
匹配度：85%
话术："基于你之前的偏好，推荐这些你没去过的高分拍照点"
```

### 场景 3：情侣约会

```
用户：小李，和女朋友一起
填写：同行=情侣，兴趣=文艺 + 拍照，预算=豪华，体力=正常，心情=约会
推荐：塔影空间（情侣套餐）→ 西岸滨江（日落告白）→ 法式餐厅（烛光晚餐）
匹配度：92%
话术："浪漫约会专线，适合情侣的打卡点和晚餐安排"
```

---

## 🚀 黑客松演示流程

### Step 1: 首次体验（30 秒）

```
1. 打开页面 → 显示欢迎弹窗
2. 填写简单信息：称呼=小王，兴趣=拍照 + 美食
3. 选择心情：EMO 求治愈
4. 点击生成 → 展示个性化路线
5. 强调："这是为你量身定制的！"
```

### Step 2: 展示学习能力（30 秒）

```
1. 给路线评分：⭐⭐⭐⭐⭐
2. 点击"加入收藏"
3. 刷新页面 → 显示"已学习 1 次，已探索 3 个景点"
4. 再次生成 → 排除已去过的景点
5. 强调："我记住了你去过的地方，不会重复推荐！"
```

### Step 3: 对比展示（30 秒）

```
1. 切换不同兴趣：文艺 vs 运动
2. 生成路线 → 展示完全不同的景点
3. 强调："不同兴趣，不同推荐，这就是千人千面！"
```

### Step 4: 技术亮点（30 秒）

```
1. 打开控制台 → 展示用户画像数据
2. 解释算法：兴趣匹配 + 预算筛选 + 体力调整
3. 强调："所有数据存在本地，隐私安全！"
```

---

## 💡 技术亮点总结

| 亮点 | 说明 | 黑客松得分点 |
|------|------|-------------|
| **个性化推荐** | 基于用户画像生成专属路线 | 技术可行性 +25% |
| **持续学习** | 每次使用都学习用户偏好 | 创新性 +15% |
| **隐私保护** | 数据存储在本地 | 安全性 +10% |
| **智能去重** | 不重复推荐去过的地方 | 产品完整度 +10% |
| **匹配度计算** | 量化推荐质量 | 技术可行性 +10% |

---

## 🔮 未来扩展

### 短期（黑客松后）

- [ ] 添加天气 API（根据天气调整推荐）
- [ ] 添加时间感知（根据时间段推荐）
- [ ] 添加社交分享（分享个人路线）
- [ ] 添加路线收藏（保存喜欢的路线）

### 中期（1-3 个月）

- [ ] 云端同步（跨设备使用）
- [ ] 豆包 AI 集成（更智能推荐）
- [ ] 用户社区（分享路线给他人）
- [ ] 数据分析（用户行为分析）

### 长期（3-6 个月）

- [ ] 商业合作（基于推荐引流）
- [ ] 会员系统（高级个性化功能）
- [ ] 多城市扩展（复制到其他城市）
- [ ] AI 对话（语音交互规划路线）

---

## 📁 文件清单

| 文件 | 大小 | 说明 |
|------|------|------|
| `business-pro-personalized.html` | 19KB | 千人千面版本体 |
| `PERSONALIZATION_PLAN.md` | 本文档 | 实现方案说明 |
| `COMPLETE_ROUTE_LIBRARY.md` | 11KB | 完整路线库 |

---

## 🎯 核心代码片段

### 用户画像加载
```javascript
function loadUserProfile() {
  const saved = localStorage.getItem('pathjoy_profile');
  return saved ? JSON.parse(saved) : {
    name: '',
    interests: [],
    budget: 'medium',
    energy: 'medium',
    visitedPlaces: [],
    historicalRatings: [],
    usageCount: 0
  };
}
```

### 保存学习数据
```javascript
function saveToHistory() {
  const profile = loadUserProfile();
  const route = currentRouteData;
  
  // 记录去过的地方
  route.points.forEach(p => {
    if (!profile.visitedPlaces.includes(p.name)) {
      profile.visitedPlaces.push(p.name);
    }
  });
  
  // 增加使用次数
  profile.usageCount++;
  
  // 保存到 localStorage
  localStorage.setItem('pathjoy_profile', JSON.stringify(profile));
  
  // 更新 UI
  updateProfileUI(profile);
  
  showToast('已加入收藏，我会记住你的偏好！');
}
```

### 个性化推荐
```javascript
function generatePersonalRoute(emotion, profile) {
  const allPoints = ALL_POIS[emotion];
  
  // 排除去过的地方
  let candidates = allPoints.filter(p => 
    !profile.visitedPlaces.includes(p.name)
  );
  
  // 计算匹配度
  candidates.forEach(p => {
    p.matchScore = calculateMatchScore(p, profile);
  });
  
  // 排序
  candidates.sort((a, b) => b.matchScore - a.matchScore);
  
  // 根据体力确定数量
  const countMap = { low: 3, medium: 6, high: 10 };
  const count = countMap[profile.energy];
  
  return candidates.slice(0, count);
}
```

---

## ✅ 黑客松检查清单

- [x] 用户信息收集表单
- [x] 用户画像展示
- [x] 个性化推荐算法
- [x] 匹配度计算
- [x] 历史学习机制
- [x] 智能去重
- [x] 个性化 UI 展示
- [x] 评分功能
- [x] 收藏功能
- [ ] 豆包 AI 集成（可选）
- [ ] 天气 API 集成（可选）

---

*千人千面，越用越懂你！*
