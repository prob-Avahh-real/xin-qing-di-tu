# =====================================================
# 心情地图 - 打包清单生成脚本
# =====================================================
# 用途：生成最终打包文件列表，排除测试/临时文件
# 时间：2026-04-24 22:40
# =====================================================

$sourceDir = "E:\hackathon-travel-experience-main"
$outputDir = "E:\心情地图 - 最终提交版"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  心情地图 - 打包清单生成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 核心文件列表（必须打包）
$coreFiles = @(
    # 统一导航
    "心情地图 - 统一导航.html",
    "门票预订 - 完整版.html",
    
    # 主 APP
    "business-pro-rich-routes.html",
    
    # 积分系统
    "points-mall-app-fixed.html",
    
    # 特色功能
    "wishing-pool.html",
    "knowledge-base.html",
    "poi-detail.html",
    
    # 商户端
    "merchant-partnership.html",
    "admin-dashboard.html",
    
    # 演示专用
    "demo-judge-fixed.html",
    "开发者工具 - 隐藏入口.html",
    
    # 实用工具
    "停车引导 - 极简版.html",
    "嵌入式导航.html",
    
    # 导航中心
    "使用指南 - 按场景分类.html",
    "全局导航中心 - 重新设计.html",
    "产品架构总览.html",
    
    # 文档
    "产品架构地图.md",
    "功能检查报告.md",
    "团队协作指南.md",
    "USER_MANUAL.md",
    "MERCHANT_SYSTEM.md",
    "POINTS_RULES.md"
)

# 排除的文件模式
$excludePatterns = @(
    "*test*",
    "*backup*",
    "*fixed*",
    "*old*",
    "*v2*",
    "*demo*",
    "*auto*",
    "*voice-test*",
    "*music-test*",
    "*optimized*",
    "*cartoon*",
    "*cute-child*",
    "*young*",
    "*youth*",
    "*multi-voice*",
    "*emotional-tts*",
    "*icon-generator*",
    "*poster*",
    "*PPT*",
    "*share-generator*",
    "*smart-parking*",
    "*parking-stats*",
    "*test-amap*",
    "*test-navigation*",
    "*music-player*",
    "*music-test*",
    "*fulai-ai*",
    "*brand-story*",
    "*business-pro.html",
    "*business-pro-12emotions*",
    "*business-pro-personalized*",
    "*mobile-full*",
    "*mobile-lite*",
    "*mobile-ultra*",
    "*points-mall.html",
    "*points-mall-v2*",
    "*points-mall-mobile*",
    "*ultimate-full*",
    "*emotion*",
    "*emoji*",
    "*roadshow*",
    "*路演*",
    "*接福来*",
    "*通用导航*",
    "*路线对比*",
    "*团队任务*",
    "*餐厅菜单*"
)

Write-Host "📦 核心文件检查：" -ForegroundColor Green
Write-Host ""

$foundCount = 0
$missingCount = 0

foreach ($file in $coreFiles) {
    $filePath = Join-Path $sourceDir $file
    if (Test-Path $filePath) {
        $fileSize = (Get-Item $filePath).Length
        Write-Host "  ✅ $file ($([math]::Round($fileSize/1KB, 1)) KB)" -ForegroundColor Green
        $foundCount++
    } else {
        Write-Host "  ❌ $file (未找到)" -ForegroundColor Red
        $missingCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  统计" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  找到：$foundCount 个文件" -ForegroundColor Green
Write-Host "  缺失：$missingCount 个文件" -ForegroundColor Red
Write-Host ""

# 显示排除的文件
Write-Host "🗑️  排除的文件（不打包）：" -ForegroundColor Yellow
Write-Host ""

$allHtmlFiles = Get-ChildItem $sourceDir -Filter "*.html"
$excludedCount = 0

foreach ($file in $allHtmlFiles) {
    foreach ($pattern in $excludePatterns) {
        if ($file.Name -like $pattern) {
            Write-Host "  ❌ $($file.Name)" -ForegroundColor Gray
            $excludedCount++
            break
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  打包建议" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 核心文件：$foundCount 个" -ForegroundColor White
Write-Host "2. 排除文件：$excludedCount 个" -ForegroundColor Gray
Write-Host "3. 总大小：约 $([math]::Round(($foundCount * 20)/1024, 1)) MB" -ForegroundColor White
Write-Host ""
Write-Host "💡 建议：" -ForegroundColor Yellow
Write-Host "  - 只打包核心文件" -ForegroundColor White
Write-Host "  - 测试文件、临时文件不要打包" -ForegroundColor White
Write-Host "  - 确保所有核心文件都能正常访问" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  打包完成提示" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "打包后请测试：" -ForegroundColor White
Write-Host "  1. 打开「心情地图 - 统一导航.html」" -ForegroundColor White
Write-Host "  2. 测试所有功能入口" -ForegroundColor White
Write-Host "  3. 检查龙华寺评分是否为 5.0" -ForegroundColor White
Write-Host "  4. 检查语音播放是否正常" -ForegroundColor White
Write-Host ""

# 生成打包清单文件
$manifestPath = Join-Path $sourceDir "打包清单.txt"
$manifestContent = @"
# 心情地图 - 打包清单
# 生成时间：$(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# 
# 使用说明：
# 1. 只打包"✅ 核心文件"列表中的文件
# 2. 不要打包测试文件、临时文件、备份文件
# 3. 确保所有核心文件都在同一个目录
#

========================================
✅ 核心文件（必须打包）
========================================

$(foreach ($file in $coreFiles) { if (Test-Path (Join-Path $sourceDir $file)) { "✅ $file" } else { "❌ $file (缺失)" } })

========================================
🗑️  排除的文件（不要打包）
========================================

测试文件：
  - *test*.html
  - *voice-test*.html
  - *music-test*.html
  - *optimized-voice*.html
  - *cartoon-voice*.html
  - *cute-child*.html
  - *young-voice*.html
  - *multi-voice*.html
  - *emotional-tts*.html
  - *test-amap*.html
  - *test-navigation*.html
  - *auto-test-report*.html

备份文件：
  - *backup*.html
  - *fixed*.html
  - *v2*.html
  - *old*.html

临时文件：
  - *demo*.html (demo-judge-fixed.html 除外)
  - *icon-generator*.html
  - *share-generator*.html
  - *poster*.html
  - *PPT*.html

旧版本：
  - business-pro.html
  - business-pro-12emotions.html
  - business-pro-personalized.html
  - mobile-full.html
  - mobile-lite.html
  - mobile-ultra-lite.html
  - points-mall.html
  - points-mall-v2.html
  - points-mall-mobile.html
  - ultimate-full.html
  - smart-parking.html
  - parking-stats.html

其他：
  - brand-story.html
  - fulai-ai-doubao.html
  - emoji*
  - roadshow*
  - 路演*
  - 接福来*
  - 餐厅菜单*

========================================
📦 打包后测试清单
========================================

1. 打开 "心情地图 - 统一导航.html"
   - 检查所有功能入口是否正常
   - 检查底部 5 Tab 导航

2. 测试主 APP
   - 打开 "business-pro-rich-routes.html"
   - 选择心情生成路线
   - 检查龙华寺评分是否为 ⭐⭐⭐⭐⭐ (5.0)

3. 测试门票系统
   - 打开 "门票预订 - 完整版.html"
   - 选择门票类型
   - 填写订单

4. 测试积分商城
   - 打开 "points-mall-app-fixed.html"
   - 检查 4 个页面（首页/任务/订单/我的）

5. 测试许愿池
   - 打开 "wishing-pool.html"
   - 创建许愿瓶
   - 设置开启时间

6. 测试知识库
   - 打开 "knowledge-base.html"
   - 检查 6 个分类
   - 检查图片是否正常

7. 测试评委演示
   - 打开 "demo-judge-fixed.html"
   - 点击情绪按钮
   - 检查 AI 对话
   - 扫描二维码

8. 测试语音播放
   - 打开任意有语音的页面
   - 点击"🔊 听龙龙讲"
   - 检查声音是否正常

========================================
✅ 打包完成！
========================================
"@

$manifestContent | Out-File -FilePath $manifestPath -Encoding UTF8
Write-Host "📄 打包清单已生成：$manifestPath" -ForegroundColor Cyan
Write-Host ""
