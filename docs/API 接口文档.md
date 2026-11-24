# 🔌 心情地图 - API 接口文档

**版本**: v1.0.0  
**更新日期**: 2026-04-24  
**基础 URL**: `http://localhost:5173/api` (开发环境)

---

## 📖 接口说明

本 API 提供情绪路线规划、景点推荐、积分商城等功能，支持第三方项目调用。

---

## 🔑 认证方式

当前为演示版本，无需认证。

生产环境建议添加：
```javascript
headers: {
  'Authorization': 'Bearer YOUR_API_KEY'
}
```

---

## 🎭 核心接口

### 1. 生成情绪路线

**POST** `/api/route/generate`

根据用户情绪生成个性化路线。

#### 请求参数

```json
{
  "emotion": "sad",
  "routeType": "medium",
  "customQuery": "",
  "preferences": {
    "avoidCrowds": false,
    "preferIndoors": false
  }
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| emotion | string | ✅ | 情绪类型：sad/relax/photo/social/art/date/family/explore/food/lucky/fitness/chill |
| routeType | string | ❌ | 路线长度：short(3-4 个)/medium(6-8 个)/full(10-12 个)，默认 medium |
| customQuery | string | ❌ | 自定义描述，如"想找个安静的地方喝咖啡" |
| preferences | object | ❌ | 偏好设置 |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "routeId": "route_20260424_001",
    "theme": "治愈疗愈之旅",
    "emotion": "sad",
    "match": "难过的时候，让美食和猫咪治愈你",
    "totalPoints": 6,
    "totalTime": "3.5",
    "totalCost": 150,
    "points": [
      {
        "id": "poi_001",
        "name": "龙华寺",
        "lat": 31.180147,
        "lng": 121.444807,
        "why": "千年古刹，听钟声静心",
        "score": "⭐⭐⭐⭐⭐",
        "hook": "免费领香",
        "tip": "寺里有只大橘猫",
        "time": 60,
        "cost": 0,
        "voiceUrl": "/api/voice/tts?text=龙华寺..."
      }
    ],
    "bgm": {
      "name": "遇见",
      "url": "https://cdn.pixabay.com/download/audio/xxx.mp3"
    }
  }
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "参数错误：emotion 不能为空"
}
```

---

### 2. 获取景点详情

**GET** `/api/poi/{poiId}`

获取单个景点的详细信息。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| poiId | string | 景点 ID，如 `longhua_temple` |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "longhua_temple",
    "name": "龙华寺",
    "description": "龙华寺是上海地区历史最悠久、规模最大的古刹...",
    "lat": 31.180147,
    "lng": 121.444807,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Longhua_Temple_Shanghai.jpg/640px-Longhua_Temple_Shanghai.jpg"
    ],
    "story": "龙华寺始建于三国吴赤乌十年（公元 247 年）...",
    "tips": [
      "免费领香",
      "素斋馆 11 点前不排队",
      "寺里有只大橘猫"
    ],
    "openingHours": "7:00-17:00",
    "ticketPrice": 0,
    "tags": ["寺庙", "祈福", "历史", "免费"]
  }
}
```

---

### 3. 语音合成

**GET** `/api/voice/tts`

将文本转换为语音（用于景点讲解）。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| text | string | ✅ | 要合成的文本 |
| voice | string | ❌ | 语音角色：longlong(龙龙)/fulai(福来猫)，默认 fulai |
| rate | number | ❌ | 语速：0.5-2.0，默认 1.0 |
| pitch | number | ❌ | 音调：0.5-2.0，默认 1.0 |

#### 响应

- **Content-Type**: `audio/mpeg`
- **返回**: MP3 音频文件二进制数据

#### 示例

```bash
curl "http://localhost:5173/api/voice/tts?text=欢迎来到龙华寺&voice=fulai" \
  --output voice.mp3
```

---

### 4. 积分商城 - 获取任务列表

**GET** `/api/points/tasks`

获取所有可完成的任务。

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "task_001",
      "title": "每日签到",
      "description": "每天首次打开 APP",
      "points": 10,
      "progress": 0,
      "target": 1,
      "status": "incomplete"
    },
    {
      "id": "task_002",
      "title": "分享路线",
      "description": "分享一条情绪路线到朋友圈",
      "points": 50,
      "progress": 0,
      "target": 1,
      "status": "incomplete"
    }
  ]
}
```

---

### 5. 积分商城 - 兑换商品

**POST** `/api/points/exchange`

使用积分兑换商品。

#### 请求参数

```json
{
  "userId": "user_001",
  "productId": "product_001",
  "quantity": 1
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "兑换成功！消耗 500 积分",
  "data": {
    "orderId": "order_20260424_001",
    "productId": "product_001",
    "productName": "龙华寺素面券",
    "pointsUsed": 500,
    "remainingPoints": 1200,
    "status": "success"
  }
}
```

---

### 6. 许愿池 - 投入愿望

**POST** `/api/wish/submit`

将愿望投入许愿池。

#### 请求参数

```json
{
  "userId": "user_001",
  "bottleType": "classic",
  "wish": "希望家人健康平安",
  "email": "user@example.com",
  "openDate": "2026-05-01"
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "愿望已投入许愿池！",
  "data": {
    "wishId": "wish_20260424_001",
    "bottleType": "classic",
    "openDate": "2026-05-01",
    "daysRemaining": 7,
    "status": "pending"
  }
}
```

---

### 7. 获取当前活动列表

**GET** `/api/events`

获取龙华地区当前活动。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| startDate | string | ❌ | 开始日期（YYYY-MM-DD） |
| endDate | string | ❌ | 结束日期（YYYY-MM-DD） |
| type | string | ❌ | 活动类型：all/culture/food/art |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "event_001",
      "title": "龙华庙会",
      "description": "农历三月初三，传统庙会活动",
      "startDate": "2026-05-01",
      "endDate": "2026-05-03",
      "location": "龙华寺广场",
      "type": "culture",
      "image": "https://xxx.com/temple-fair.jpg"
    }
  ]
}
```

---

### 8. AI 智能问答（核心亮点）⭐

**POST** `/api/agent/chat`

与 AI 助手对话（福来猫/龙龙）。

#### 请求参数

```json
{
  "message": "我想找个安静的地方散心，有什么推荐？",
  "character": "fulai",
  "context": {
    "currentEmotion": "relax",
    "location": "longhua"
  }
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | ✅ | 用户消息 |
| character | string | ❌ | 角色：fulai(福来猫)/longlong(龙龙)，默认 fulai |
| context | object | ❌ | 上下文信息 |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "reply": "喵～想散心的话，我推荐你去塔影空间哦！那里的窗边位置特别安静，点一杯咖啡可以看一本书发呆一下午呢～☕️",
    "suggestions": [
      "塔影空间",
      "西岸滨江草坪",
      "龙华寺"
    ],
    "emotion": "empathy"
  }
}
```

---

## 🔌 第三方项目接入示例

### 示例 1：在 Vue 项目中调用

```javascript
// 调用路线生成 API
async function generateRoute(emotion) {
  const response = await fetch('/api/route/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emotion: emotion,
      routeType: 'medium'
    })
  });
  
  const result = await response.json();
  return result.data;
}

// 使用
const route = await generateRoute('sad');
console.log(route.theme); // "治愈疗愈之旅"
```

### 示例 2：在 React 项目中调用

```jsx
function App() {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    fetch('/api/route/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({emotion: 'relax'})
    })
    .then(res => res.json())
    .then(data => setRoute(data.data));
  }, []);

  return (
    <div>
      {route && <h1>{route.theme}</h1>}
    </div>
  );
}
```

### 示例 3：在 Python 中调用

```python
import requests

# 调用路线生成 API
response = requests.post('http://localhost:5173/api/route/generate', json={
    'emotion': 'sad',
    'routeType': 'medium'
})

data = response.json()
print(f"路线主题：{data['data']['theme']}")
print(f"景点数量：{data['data']['totalPoints']}")
```

### 示例 4：在 PPT 中嵌入（iframe）

```html
<iframe 
  src="http://localhost:5173/demo-light.html?emotion=sad"
  width="800"
  height="600"
  frameborder="0"
></iframe>
```

---

## 🎭 评委演示场景

### 场景 1：现场调用 API

**步骤**：
1. 打开 Postman 或 API 测试工具
2. 调用 `POST /api/route/generate`
3. 传入 `emotion: "sad"`
4. 展示返回的完整路线
5. 强调："这是 AI 实时生成的个性化路线"

### 场景 2：对比不同情绪

**步骤**：
1. 第一次调用：`emotion: "sad"` → 展示治愈路线
2. 第二次调用：`emotion: "date"` → 展示浪漫路线
3. 强调："千人千面，每个情绪都有专属路线"

### 场景 3：AI 对话演示

**步骤**：
1. 调用 `POST /api/agent/chat`
2. 输入："我失恋了，好难过"
3. 展示 AI 的共情回复和推荐
4. 强调："AI 不只是推荐，还会情感陪伴"

---

## 🛠️ API 测试工具

### 方案 A：Postman 集合

**导入以下 JSON**：

```json
{
  "info": {
    "name": "心情地图 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "生成情绪路线",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"emotion\":\"sad\",\"routeType\":\"medium\"}"
        },
        "url": {
          "raw": "http://localhost:5173/api/route/generate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5173",
          "path": ["api", "route", "generate"]
        }
      }
    }
  ]
}
```

### 方案 B：在线测试页面

**创建文件**: `api-test-page.html`

功能：
- 图形化界面
- 一键测试所有接口
- 显示请求/响应
- 可复制 cURL 命令

### 方案 C：cURL 命令

**生成路线**：
```bash
curl -X POST http://localhost:5173/api/route/generate \
  -H "Content-Type: application/json" \
  -d '{"emotion":"sad","routeType":"medium"}'
```

**AI 对话**：
```bash
curl -X POST http://localhost:5173/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"我失恋了，好难过","character":"fulai"}'
```

---

## 📦 后端实现方案

### 方案 1：Node.js + Express（推荐）⭐

**优点**：
- ✅ 轻量快速
- ✅ 与前端同源（无需 CORS）
- ✅ 易于部署

**安装**：
```bash
npm install express cors body-parser
```

**代码** (`server.js`):
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 模拟数据库
const ROUTES_DB = {...};

// 生成路线 API
app.post('/api/route/generate', (req, res) => {
  const {emotion, routeType} = req.body;
  const route = generateRoute(emotion, routeType);
  res.json({code: 200, data: route});
});

// AI 对话 API
app.post('/api/agent/chat', async (req, res) => {
  const {message, character} = req.body;
  const reply = await callAIAPI(message, character);
  res.json({code: 200, data: reply});
});

app.listen(5173, () => {
  console.log('API 服务运行在 http://localhost:5173');
});
```

### 方案 2：Vite 代理（最简单）⭐⭐⭐

**优点**：
- ✅ 无需额外服务器
- ✅ 开发环境即可用
- ✅ 配置简单

**配置** (`vite.config.js`):
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}
```

### 方案 3：云函数（生产环境）

**平台**：
- 阿里云函数计算
- 腾讯云云函数
- Vercel Serverless

**优点**：
- ✅ 自动扩缩容
- ✅ 按量付费
- ✅ 无需运维

---

## 🎯 给评委的轻量演示页面

### 创建文件：`demo-judge.html`

**特点**：
- 单页面（<100KB）
- 无需安装
- 扫码即开
- 突出 AI 能力

**内容**：
1. **情绪选择器** - 12 个情绪按钮
2. **AI 对话窗口** - 与福来猫聊天
3. **路线展示** - 地图 + 景点卡片
4. **API 调用日志** - 实时显示请求/响应

**访问方式**：
```
http://localhost:5173/demo-judge.html
```

---

## 📋 下一步行动

### 今天完成（2026-04-24）

- [ ] 创建 API 接口文档 ✅（本文件）
- [ ] 创建后端服务（Node.js/Express）
- [ ] 实现核心 API（路线生成、AI 对话）
- [ ] 创建评委演示页面（demo-judge.html）
- [ ] 创建 API 测试页面（api-test-page.html）

### 明天完成（2026-04-25）

- [ ] 测试所有 API 接口
- [ ] 准备 Postman 集合
- [ ] 准备 cURL 命令示例
- [ ] 在 PPT 中添加 API 演示环节
- [ ] 准备演示脚本

---

## 💡 我的建议

### 推荐方案：**Vite 代理 + 轻量演示页**

**理由**：
1. ✅ 无需额外部署
2. ✅ 开发环境即可测试
3. ✅ 评委可直接访问
4. ✅ 代码量最小

**实施**：
1. 在 `vite.config.js` 添加 API 代理
2. 创建 `api/` 目录存放路由处理
3. 创建 `demo-judge.html` 演示页面
4. PPT 中放入二维码，评委扫码即可测试

---

**现在请告诉我**：
- A. **立即创建后端服务**（Node.js/Express）
- B. **先创建评委演示页面**（demo-judge.html）
- C. **先创建 API 测试页面**（api-test-page.html）
- D. **其他需求**

我会根据你的选择立即开始！🚀

---

*文档版本：v1.0.0*  
*更新时间：2026-04-24 22:06*  
*下次更新：等待用户反馈*
