/**
 * 社交分享工具 - 朋友圈分享 + PK 功能
 * 支持生成分享文案、邀请好友 PK
 */

import type { ExperienceRoute } from '../stores/route'

/**
 * 生成朋友圈分享文案
 * @param route 路线数据
 * @param options 选项
 */
export function generateShareText(
  route: ExperienceRoute,
  options: {
    includeLink?: boolean
    includeScore?: boolean
    customText?: string
  } = {}
): string {
  const { includeLink = true, includeScore = true, customText } = options
  
  // 基础文案模板
  const templates = [
    `今天在${route.points[0]?.name || '龙华'}, ${route.points[1]?.name || '这里'}太治愈了～ #龙华灵境向导`,
    `${route.theme} 🎯 发现${route.points.length}个宝藏打卡点，快来一起探索！`,
    `在龙华遇见${route.points[0]?.name}，${route.points[0]?.whyItHeals || '这里超美'} #上海拍照 #龙华灵境向导`,
    `今日份快乐是${route.points.map(p => p.name).join(' + ')}给的～ 📸`,
    `一个人也可以很浪漫✨ ${route.theme}，${route.totalDuration}分钟治愈之旅`
  ]
  
  // 选择文案（如果有自定义则使用自定义）
  let shareText = customText || templates[Math.floor(Math.random() * templates.length)]
  
  // 添加评分信息
  if (includeScore) {
    shareText += `\n⭐ 体验评分：${route.experienceScore}/10`
  }
  
  // 添加链接（如果启用）
  if (includeLink) {
    shareText += `\n🔗 来自「龙华·灵境向导」`
  }
  
  // 添加话题标签
  shareText += `\n#龙华灵境向导 #上海CityWalk #情绪出行`
  
  return shareText
}

/**
 * 生成分享图片（需要 html2canvas 配合）
 * @param elementId 要截图的 DOM 元素 ID
 * @param route 路线数据
 */
export async function generateShareImage(
  elementId: string,
  route: ExperienceRoute
): Promise<Blob | null> {
  try {
    // 动态导入 html2canvas
    const html2canvas = (await import('html2canvas')).default
    
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('找不到要截图的元素:', elementId)
      return null
    }
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#fef4ed',
      scale: 2, // 高清截图
      useCORS: true,
      logging: false
    })
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/png')
    })
  } catch (err) {
    console.error('生成分享图片失败:', err)
    return null
  }
}

/**
 * 分享到微信好友
 * @param text 分享文案
 * @param imageBlob 分享图片（可选）
 */
export async function shareToWeChat(text: string, imageBlob?: Blob | null) {
  // 尝试使用微信 JSSDK（如果在微信环境中）
  if ((window as any).wx) {
    try {
      await (window as any).wx.updateAppMessageShareData({
        title: '龙华·灵境向导',
        desc: text,
        link: window.location.href,
        imgUrl: imageBlob ? URL.createObjectURL(imageBlob) : ''
      })
      return true
    } catch (err) {
      console.warn('微信 JSSDK 分享失败:', err)
    }
  }
  
  // 降级方案：复制文案到剪贴板
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('复制失败:', err)
    return false
  }
}

/**
 * 分享到朋友圈
 * @param text 分享文案
 * @param imageBlob 分享图片（可选）
 */
export async function shareToWeChatMoments(text: string, imageBlob?: Blob | null) {
  // 朋友圈分享需要用户手动操作
  // 这里提供文案复制和图片下载
  
  // 1. 复制文案
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.warn('复制文案失败:', err)
  }
  
  // 2. 如果有图片，触发下载
  if (imageBlob) {
    const url = URL.createObjectURL(imageBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `龙华灵境向导_${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return true
}

/**
 * 分享到微博
 * @param text 分享文案
 * @param imageUrl 图片 URL（可选）
 */
export function shareToWeibo(text: string, imageUrl?: string) {
  const shareUrl = new URL('https://service.weibo.com/share/share.php')
  shareUrl.searchParams.set('title', text)
  shareUrl.searchParams.set('url', window.location.href)
  if (imageUrl) {
    shareUrl.searchParams.set('pic', imageUrl)
  }
  
  window.open(shareUrl.toString(), '_blank', 'width=600,height=400')
}

/**
 * 分享到 QQ
 * @param text 分享文案
 * @param imageUrl 图片 URL（可选）
 */
export function shareToQQ(text: string, imageUrl?: string) {
  const shareUrl = new URL('https://connect.qq.com/widget/shareqq/index.html')
  shareUrl.searchParams.set('url', window.location.href)
  shareUrl.searchParams.set('title', '龙华·灵境向导')
  shareUrl.searchParams.set('desc', text)
  if (imageUrl) {
    shareUrl.searchParams.set('pics', imageUrl)
  }
  
  window.open(shareUrl.toString(), '_blank', 'width=600,height=400')
}

/**
 * 发起 PK 挑战
 * @param route 路线数据
 * @param friendName 好友昵称
 */
export function createPKChallenge(
  route: ExperienceRoute,
  friendName: string = '好友'
): {
  title: string
  description: string
  rules: string[]
  reward: string
} {
  return {
    title: `🏆 龙华竞速 PK`,
    description: `邀请${friendName}一起走${route.theme}，打卡更多者胜！`,
    rules: [
      `1. 两人分别完成同一条路线`,
      `2. 打卡景点数量多者获胜`,
      `3. 用时短者加分`,
      `4. 上传照片质量高者加分`
    ],
    reward: `🎁 获胜者获得双倍积分 + ${route.points[0]?.name || '景点'}周边礼品`
  }
}

/**
 * 生成 PK 邀请文案
 * @param pkChallenge PK 挑战数据
 * @param friendName 好友昵称
 */
export function generatePKInvitation(
  pkChallenge: ReturnType<typeof createPKChallenge>,
  friendName: string = '好友'
): string {
  return `@${friendName} ${pkChallenge.title}\n\n${pkChallenge.description}\n\n规则：\n${pkChallenge.rules.join('\n')}\n\n奖励：${pkChallenge.reward}\n\n👉 点击接受挑战：${window.location.href}?pk=challenge\n\n#龙华灵境向导 #PK 挑战`
}

/**
 * 分享链接生成
 * @param route 路线数据
 * @param params 额外参数
 */
export function generateShareLink(
  route: ExperienceRoute,
  params: Record<string, string> = {}
): string {
  const url = new URL(window.location.href)
  
  // 添加路线 ID
  url.searchParams.set('route', route.id)
  
  // 添加其他参数
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  
  // 添加时间戳防止缓存
  url.searchParams.set('t', Date.now().toString())
  
  return url.toString()
}

/**
 * 一键分享（智能选择平台）
 * @param route 路线数据
 * @param options 分享选项
 */
export async function quickShare(
  route: ExperienceRoute,
  options: {
    platform?: 'wechat' | 'moments' | 'weibo' | 'qq'
    customText?: string
    includeImage?: boolean
  } = {}
) {
  const { platform, customText, includeImage = true } = options
  
  // 生成分享文案
  const shareText = generateShareText(route, { customText })
  
  // 生成分享图片（如果需要）
  let imageBlob: Blob | null = null
  if (includeImage) {
    imageBlob = await generateShareImage('routeDisplay', route)
  }
  
  // 根据平台分享
  switch (platform) {
    case 'wechat':
      return await shareToWeChat(shareText, imageBlob)
    case 'moments':
      return await shareToWeChatMoments(shareText, imageBlob)
    case 'weibo':
      shareToWeibo(shareText)
      return true
    case 'qq':
      shareToQQ(shareText)
      return true
    default:
      // 使用系统分享（移动端）
      if (navigator.share) {
        try {
          await navigator.share({
            title: '龙华·灵境向导',
            text: shareText,
            url: window.location.href
          })
          return true
        } catch (err) {
          console.warn('系统分享失败:', err)
        }
      }
      
      // 降级：复制文案
      await navigator.clipboard.writeText(shareText)
      return true
  }
}

/**
 * 分享成功回调处理
 * @param platform 分享平台
 * @param success 是否成功
 */
export function onShareSuccess(platform: string, success: boolean) {
  if (success) {
    console.log(`分享到${platform}成功`)
    // 可以在这里添加积分奖励等逻辑
    // 例如：给分享者 +10 积分
  } else {
    console.warn(`分享到${platform}失败`)
  }
}
