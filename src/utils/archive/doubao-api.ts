/**
 * 豆包 AI API 工具
 * 
 * 功能：
 * - AI 智能对话
 * - 情绪路线推荐
 * - 智能问答
 * 
 * 使用前需要：
 * 1. 注册豆包账号：https://www.volcengine.com/products/doubao
 * 2. 获取 API Key
 * 3. 配置到 .env 文件
 */

// API 配置（从环境变量读取）
const DOUBAO_API_KEY = import.meta.env.VITE_DOUBAO_API_KEY || 'your_api_key_here';
const DOUBAO_APP_ID = import.meta.env.VITE_DOUBAO_APP_ID || 'your_app_id_here';
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

/**
 * AI 对话
 * @param {string} userInput - 用户输入
 * @param {string} context - 上下文（可选）
 * @returns {Promise<string>} AI 回复
 */
export async function chatWithAI(userInput, context = '') {
  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`
      },
      body: JSON.stringify({
        model: 'doubao-pro-4k',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(context)
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API 错误：${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('豆包 API 调用失败:', error);
    throw error;
  }
}

/**
 * 生成情绪路线推荐
 * @param {string} emotion - 情绪类型
 * @param {string} customInput - 自定义输入
 * @returns {Promise<Object>} 路线推荐
 */
export async function generateRouteRecommendation(emotion, customInput = '') {
  const prompt = `请根据用户的情绪"${emotion}"${customInput ? '和需求"' + customInput + '"' : ''}，推荐一条龙华地区的旅游路线。

请按照以下 JSON 格式返回：
{
  "title": "路线名称",
  "score": 8.5,
  "photos": 5,
  "save": 50,
  "points": [
    {"name": "景点名", "desc": "简短描述"},
    {"name": "景点名", "desc": "简短描述"}
  ]
}

龙华地区主要景点包括：
- 龙华寺（千年古刹）
- 龙华塔（宋代古塔）
- 龙华烈士陵园（红色教育基地）
- 塔影空间（网红咖啡馆）
- 龙美术馆（艺术展览）
- 西岸大剧院（现代建筑）
- 西岸滨江（江景休闲）
- 龙华老街（传统美食）

请推荐 3-5 个景点，确保路线合理。`;

  try {
    const aiResponse = await chatWithAI(prompt);
    
    // 尝试解析 JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // 如果解析失败，返回预设路线
    return getFallbackRoute(emotion);
  } catch (error) {
    console.error('路线生成失败，使用预设路线:', error);
    return getFallbackRoute(emotion);
  }
}

/**
 * 获取预设路线（降级方案）
 */
function getFallbackRoute(emotion) {
  const routes = {
    relax: {
      title: '治愈放松之旅',
      score: 8.5,
      photos: 5,
      save: 50,
      points: [
        { name: '龙华寺', desc: '千年古刹，静心祈福' },
        { name: '塔影空间', desc: '网红打卡，文艺咖啡' },
        { name: '西岸滨江', desc: '江风拂面，日落晚霞' }
      ]
    },
    heal: {
      title: '心灵疗愈之路',
      score: 9.0,
      photos: 4,
      save: 30,
      points: [
        { name: '龙华烈士陵园', desc: '缅怀先烈，铭记历史' },
        { name: '龙华寺', desc: '听钟声，品素面' },
        { name: '西岸美术馆', desc: '艺术治愈心灵' }
      ]
    },
    photo: {
      title: '网红打卡专线',
      score: 9.2,
      photos: 10,
      save: 80,
      points: [
        { name: '塔影空间', desc: '最佳机位：3 楼露台' },
        { name: '龙美术馆', desc: '工业风拍照圣地' },
        { name: '西岸大剧院', desc: '现代建筑美学' }
      ]
    },
    social: {
      title: '社交聚会路线',
      score: 8.8,
      photos: 6,
      save: 100,
      points: [
        { name: '龙华老街', desc: '小吃聚集地' },
        { name: '塔影空间', desc: '下午茶聊天' },
        { name: '西岸营地', desc: '户外活动社交' }
      ]
    }
  };

  return routes[emotion] || routes.relax;
}

/**
 * 获取系统提示词
 */
function getSystemPrompt(context) {
  return `你是龙华·灵境向导的 AI 助手，专业提供龙华地区的旅游路线推荐。

${context ? '上下文信息：' + context : ''}

请：
1. 根据用户情绪和需求推荐路线
2. 回答用户关于龙华的问题
3. 提供实用建议（交通、美食、最佳时间等）
4. 语气友好、专业、有帮助

不要：
- 提供虚假信息
- 推荐龙华以外的景点
- 涉及政治、宗教敏感话题`;
}

/**
 * 语音识别（使用浏览器原生 API）
 */
export function startVoiceRecognition(onResult, onError) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError(new Error('浏览器不支持语音识别'));
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'zh-CN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    onError(new Error(event.error));
  };

  recognition.start();
  return recognition;
}

/**
 * 语音合成（TTS，使用豆包 API）
 */
export async function textToSpeech(text, onAudio, onError) {
  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`
      },
      body: JSON.stringify({
        model: 'doubao-tts',
        input: text,
        voice: 'zh_female_qingchun'
      })
    });

    if (!response.ok) {
      throw new Error(`TTS API 错误：${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    onAudio(audioUrl);
  } catch (error) {
    console.error('TTS 失败:', error);
    // 降级方案：使用浏览器原生 TTS
    fallbackTTS(text, onAudio, onError);
  }
}

/**
 * 降级 TTS（浏览器原生）
 */
function fallbackTTS(text, onAudio, onError) {
  if (!('speechSynthesis' in window)) {
    onError(new Error('浏览器不支持 TTS'));
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 1;
  
  // 直接播放，不返回音频 URL
  speechSynthesis.speak(utterance);
  onAudio(null); // 表示使用原生播放
}

/**
 * 智能问答
 */
export async function askQuestion(question) {
  const prompt = `请回答用户关于龙华的问题：${question}

要求：
- 简洁明了（100 字以内）
- 实用信息
- 友好语气`;

  return await chatWithAI(prompt);
}

/**
 * 检查 API 状态
 */
export async function checkAPIHealth() {
  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`
      },
      body: JSON.stringify({
        model: 'doubao-pro-4k',
        messages: [{ role: 'user', content: '你好' }],
        max_tokens: 10
      })
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 使用统计（用于成本核算）
 */
export function logAPICall(endpoint, tokens) {
  const logs = JSON.parse(localStorage.getItem('doubao_api_logs') || '[]');
  logs.push({
    endpoint,
    tokens,
    cost: tokens * 0.008 / 1000, // 按豆包定价计算
    timestamp: Date.now()
  });
  localStorage.setItem('doubao_api_logs', JSON.stringify(logs.slice(-100))); // 只保留最近 100 条
}

/**
 * 获取使用统计
 */
export function getUsageStats() {
  const logs = JSON.parse(localStorage.getItem('doubao_api_logs') || '[]');
  const today = new Date().setHours(0, 0, 0, 0);
  
  const todayLogs = logs.filter(log => log.timestamp >= today);
  const totalCost = todayLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalCalls = todayLogs.length;

  return {
    todayCalls: totalCalls,
    todayCost: totalCost.toFixed(4),
    totalCalls: logs.length
  };
}
