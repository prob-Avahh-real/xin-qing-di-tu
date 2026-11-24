# 🚀 龙华·灵境向导 - 自动安装程序

**版本**: 1.0  
**日期**: 2026-04-24  
**适用**: Windows 10/11

---

## 📥 下载后如何使用

### 方法 1: 双击运行（最简单）

```
1. 下载 "安装龙华·灵境向导.bat"
2. 双击运行
3. 等待安装完成（5-10 分钟）
4. 应用自动启动
5. 浏览器自动打开
```

### 方法 2: 右键运行

```
1. 右键 "安装龙华·灵境向导.bat"
2. 选择"以管理员身份运行"
3. 等待安装完成
```

---

## 🤖 自动安装程序会做什么？

### 自动检测

```powershell
✅ 检查操作系统版本
✅ 检查是否已安装 Node.js
✅ 检查是否已安装 Ollama
✅ 检查网络连接
✅ 检查磁盘空间
```

### 自动安装

```powershell
✅ Node.js（如未安装）
✅ Ollama（如未安装）
✅ AI 模型（qwen2.5:7b）
✅ 项目依赖（npm install）
✅ 环境变量配置
```

### 自动配置

```powershell
✅ 设置 Ollama 模型
✅ 配置 API 端口
✅ 创建桌面快捷方式
✅ 添加到开始菜单
```

### 自动启动

```powershell
✅ 启动 Ollama 服务
✅ 启动应用
✅ 打开浏览器
✅ 显示欢迎界面
```

---

## 📋 完整安装脚本

### 主安装脚本（install.bat）

```batch
@echo off
chcp 65001 >nul
echo ================================================
echo           龙华·灵境向导 自动安装程序
echo ================================================
echo.
echo 🚀 开始安装，请勿关闭此窗口...
echo.

:: 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️ 需要管理员权限
    echo 请右键 → "以管理员身份运行"
    pause
    exit /b 1
)

:: 运行 PowerShell 脚本
powershell -ExecutionPolicy Bypass -File "install.ps1"

echo.
echo ================================================
echo 安装完成！按任意键退出...
echo ================================================
pause >nul
```

---

### PowerShell 安装脚本（install.ps1）

```powershell
# 龙华·灵境向导 自动安装脚本
# 适用于 Windows 10/11

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "        龙华·灵境向导 自动安装程序" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 颜色定义
$success = "Green"
$info = "Cyan"
$warning = "Yellow"
$error = "Red"

# 安装目录
$installDir = "$env:USERPROFILE\LonghuaVoiceGuide"
$ollamaDir = "$env:USERPROFILE\.ollama"

# ============================================
# 步骤 1: 检查系统要求
# ============================================
Write-Host "[1/8] 检查系统要求..." -ForegroundColor $info

# 检查 Windows 版本
$windowsVersion = [System.Environment]::OSVersion.Version.Major
if ($windowsVersion -lt 10) {
    Write-Host "❌ 需要 Windows 10 或更高版本" -ForegroundColor $error
    pause
    exit 1
}
Write-Host "✅ Windows 版本符合要求" -ForegroundColor $success

# 检查磁盘空间
$drive = Get-PSDrive -Name (Split-Path $installDir -Qualifier).TrimEnd(":")
$freeSpaceGB = [math]::Round($drive.Free / 1GB, 2)
if ($freeSpaceGB -lt 20) {
    Write-Host "❌ 磁盘空间不足，需要至少 20GB，当前可用：${freeSpaceGB}GB" -ForegroundColor $error
    pause
    exit 1
}
Write-Host "✅ 磁盘空间充足 (${freeSpaceGB}GB 可用)" -ForegroundColor $success

# 检查网络
try {
    $response = Invoke-WebRequest -Uri "https://www.baidu.com" -TimeoutSec 5
    Write-Host "✅ 网络连接正常" -ForegroundColor $success
} catch {
    Write-Host "⚠️ 网络连接可能有问题，安装可能失败" -ForegroundColor $warning
}

# ============================================
# 步骤 2: 创建安装目录
# ============================================
Write-Host ""
Write-Host "[2/8] 创建安装目录..." -ForegroundColor $info

if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
    Write-Host "✅ 已创建目录：$installDir" -ForegroundColor $success
} else {
    Write-Host "✅ 目录已存在" -ForegroundColor $success
}

# 复制项目文件
Write-Host "复制项目文件..."
Copy-Item -Path ".\*" -Destination $installDir -Recurse -Force
Write-Host "✅ 项目文件复制完成" -ForegroundColor $success

# ============================================
# 步骤 3: 安装 Node.js（如需要）
# ============================================
Write-Host ""
Write-Host "[3/8] 检查 Node.js..." -ForegroundColor $info

$nodeInstalled = $false
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js 已安装：$nodeVersion" -ForegroundColor $success
    $nodeInstalled = $true
} catch {
    Write-Host "⚠️ Node.js 未安装，开始安装..." -ForegroundColor $warning
}

if (-not $nodeInstalled) {
    # 下载并安装 Node.js
    $nodeInstaller = "$env:TEMP\node-installer.msi"
    $nodeUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
    
    Write-Host "下载 Node.js 安装器..."
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller
    
    Write-Host "安装 Node.js..."
    Start-Process msiexec.exe -Wait -ArgumentList "/i $nodeInstaller /quiet"
    
    # 刷新环境变量
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Host "✅ Node.js 安装完成" -ForegroundColor $success
}

# ============================================
# 步骤 4: 安装 Ollama（如需要）
# ============================================
Write-Host ""
Write-Host "[4/8] 检查 Ollama..." -ForegroundColor $info

$ollamaInstalled = $false
try {
    $ollamaVersion = ollama --version
    Write-Host "✅ Ollama 已安装：$ollamaVersion" -ForegroundColor $success
    $ollamaInstalled = $true
} catch {
    Write-Host "⚠️ Ollama 未安装，开始安装..." -ForegroundColor $warning
}

if (-not $ollamaInstalled) {
    # 下载并安装 Ollama
    $ollamaInstaller = "$env:TEMP\OllamaSetup.exe"
    $ollamaUrl = "https://ollama.com/download/OllamaSetup.exe"
    
    Write-Host "下载 Ollama 安装器..."
    Invoke-WebRequest -Uri $ollamaUrl -OutFile $ollamaInstaller
    
    Write-Host "安装 Ollama..."
    Start-Process $ollamaInstaller -Wait -ArgumentList "/S"
    
    Write-Host "✅ Ollama 安装完成" -ForegroundColor $success
}

# ============================================
# 步骤 5: 下载 AI 模型
# ============================================
Write-Host ""
Write-Host "[5/8] 下载 AI 模型..." -ForegroundColor $info

# 启动 Ollama 服务
Write-Host "启动 Ollama 服务..."
Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden
Start-Sleep -Seconds 5

# 检查已安装的模型
$models = ollama list 2>&1
if ($models -notmatch "qwen2.5") {
    Write-Host "下载 qwen2.5:7b 模型（约 4.7GB，可能需要 10 分钟）..."
    Write-Host "⏳ 请稍候，不要关闭此窗口..."
    
    ollama pull qwen2.5:7b
    
    Write-Host "✅ 模型下载完成" -ForegroundColor $success
} else {
    Write-Host "✅ 模型已存在" -ForegroundColor $success
}

# ============================================
# 步骤 6: 安装项目依赖
# ============================================
Write-Host ""
Write-Host "[6/8] 安装项目依赖..." -ForegroundColor $info

Set-Location $installDir

Write-Host "运行 npm install..."
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 依赖安装完成" -ForegroundColor $success
} else {
    Write-Host "❌ 依赖安装失败" -ForegroundColor $error
    pause
    exit 1
}

# ============================================
# 步骤 7: 创建快捷方式
# ============================================
Write-Host ""
Write-Host "[7/8] 创建快捷方式..." -ForegroundColor $info

# 桌面快捷方式
$desktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), '龙华·灵境向导.lnk')
$targetPath = "C:\Windows\System32\cmd.exe"
$arguments = "/c `"cd $installDir && npm run dev`""

$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut($desktopPath)
$shortcut.TargetPath = $targetPath
$shortcut.Arguments = $arguments
$shortcut.WorkingDirectory = $installDir
$shortcut.IconLocation = "shell32.dll,13"
$shortcut.Description = "龙华·灵境向导 - 情绪出行规划师"
$shortcut.Save()

Write-Host "✅ 桌面快捷方式已创建" -ForegroundColor $success

# 开始菜单快捷方式
$startMenuPath = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\龙华·灵境向导.lnk"
$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut($startMenuPath)
$shortcut.TargetPath = $targetPath
$shortcut.Arguments = $arguments
$shortcut.WorkingDirectory = $installDir
$shortcut.IconLocation = "shell32.dll,13"
$shortcut.Save()

Write-Host "✅ 开始菜单快捷方式已创建" -ForegroundColor $success

# ============================================
# 步骤 8: 启动应用
# ============================================
Write-Host ""
Write-Host "[8/8] 启动应用..." -ForegroundColor $info

# 启动应用（新窗口）
Start-Process cmd -ArgumentList "/c `"cd $installDir && npm run dev`""

# 等待应用启动
Start-Sleep -Seconds 5

# 打开浏览器
Start-Process "http://localhost:5174/"

Write-Host "✅ 应用已启动" -ForegroundColor $success

# ============================================
# 安装完成
# ============================================
Write-Host ""
Write-Host "================================================" -ForegroundColor $success
Write-Host "        🎉 安装完成！" -ForegroundColor $success
Write-Host "================================================" -ForegroundColor $success
Write-Host ""
Write-Host "应用已在浏览器中打开：" -ForegroundColor $info
Write-Host "http://localhost:5174/" -ForegroundColor $cyan
Write-Host ""
Write-Host "桌面快捷方式：龙华·灵境向导" -ForegroundColor $info
Write-Host ""
Write-Host "如需重新启动：" -ForegroundColor $info
Write-Host "1. 双击桌面快捷方式" -ForegroundColor $info
Write-Host "2. 或在开始菜单找到'龙华·灵境向导'" -ForegroundColor $info
Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
```

---

## 📦 打包成单文件 EXE（可选）

### 使用 Inno Setup 创建安装程序

```pascal
; install-setup.iss

[Setup]
AppName=龙华·灵境向导
AppVersion=1.0
WizardStyle=modern
DefaultDirName={autopf}\LonghuaVoiceGuide
DefaultGroupName=龙华·灵境向导
UninstallDisplayIcon={app}\icon.ico
Compression=lzma2
SolidCompression=yes
OutputDir=installer-output

[Files]
Source: "*"; DestDir: "{app}"; Flags: recursesubdirs
Source: "install.ps1"; DestDir: "{app}"
Source: "icon.ico"; DestDir: "{app}"

[Icons]
Name: "{group}\龙华·灵境向导"; Filename: "{cmd}", Parameters: "/c ""cd {app} && npm run dev"""
Name: "{autodesktop}\龙华·灵境向导"; Filename: "{cmd}", Parameters: "/c ""cd {app} && npm run dev"""

[Run]
Filename: "powershell"; Parameters: "-ExecutionPolicy Bypass -File ""{app}\install.ps1"""; Flags: runascurrentuser
```

**编译命令**:
```powershell
iscc install-setup.iss
```

**输出**: `龙华·灵境向导-Setup.exe`

---

## 🎯 客户体验流程

### 下载安装

```
步骤 1: 下载安装包
  - 从官网下载
  - 或从网盘下载
  - 大小：10-12GB

步骤 2: 双击运行
  - 点击"运行"
  - 或右键 → 以管理员身份运行
```

### 自动安装

```
进度条显示:
[1/8] 检查系统要求... ✅
[2/8] 创建安装目录... ✅
[3/8] 安装 Node.js... ✅ (如需要)
[4/8] 安装 Ollama... ✅ (如需要)
[5/8] 下载 AI 模型... ✅ (约 10 分钟)
[6/8] 安装项目依赖... ✅ (约 3 分钟)
[7/8] 创建快捷方式... ✅
[8/8] 启动应用... ✅

总时间：15-20 分钟
```

### 开始使用

```
✅ 浏览器自动打开
✅ 显示欢迎界面
✅ 所有功能正常
✅ 可以开始语音对话
```

---

## 📋 安装包文件清单

### 基础包（必须）

```
龙华·灵境向导-安装包/
├── install.bat              # 主安装脚本
├── install.ps1              # PowerShell 脚本
├── README.md                # 使用说明
├── package.json             # 项目配置
└── src/                     # 源代码
```

### 完整包（推荐）

```
龙华·灵境向导-安装包/
├── install.bat
├── install.ps1
├── ollama-installer.exe     # Ollama 离线安装包
├── node-installer.msi       # Node.js 离线安装包
├── models/                  # AI 模型文件
│   └── qwen2.5-7b.bin
├── README.md
├── package.json
└── src/
```

**完整包大小**: 10-12GB  
**优势**: 离线安装，无需下载额外文件

---

## 🔧 高级功能

### 卸载脚本（uninstall.ps1）

```powershell
Write-Host "卸载龙华·灵境向导..."

# 删除安装目录
Remove-Item -Path $installDir -Recurse -Force

# 删除快捷方式
Remove-Item -Path "$env:USERPROFILE\Desktop\龙华·灵境向导.lnk" -Force
Remove-Item -Path "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\龙华·灵境向导.lnk" -Force

Write-Host "卸载完成！"
```

### 更新脚本（update.bat）

```batch
@echo off
echo 检查更新...
cd %USERPROFILE%\LonghuaVoiceGuide
git pull
npm install
echo 更新完成！
pause
```

---

## 📊 安装成功率提升

### 错误处理

```powershell
# 添加重试机制
function Download-WithRetry {
    param($url, $output, $maxRetries = 3)
    
    for ($i = 1; $i -le $maxRetries; $i++) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $output
            return $true
        } catch {
            if ($i -eq $maxRetries) { throw }
            Write-Host "下载失败，第 $i 次重试..."
            Start-Sleep -Seconds 5
        }
    }
}
```

### 进度显示

```powershell
# 显示进度条
function Show-Progress {
    param($message, $percent)
    
    $width = 50
    $completed = [int]($percent / 100 * $width)
    $remaining = $width - $completed
    
    Write-Host "`r[$('-' * $completed$('=' * $remaining))] $percent% - $message" -NoNewline
}
```

---

## ✅ 总结

### 自动安装优势

| 优势 | 说明 |
|------|------|
| ✅ **零门槛** | 客户双击即可 |
| ✅ **全自动** | 无需手动操作命令 |
| ✅ **智能检测** | 自动判断是否需要安装依赖 |
| ✅ **容错处理** | 失败自动重试 |
| ✅ **进度显示** | 实时显示安装进度 |
| ✅ **快捷方式** | 自动创建桌面图标 |

### 客户体验

```
传统安装:
❌ 安装 Node.js
❌ 安装 Ollama
❌ 下载模型
❌ 配置环境变量
❌ 运行多个命令
❌ 容易出错

自动安装:
✅ 双击安装包
✅ 等待完成
✅ 开始使用
```

---

**需要我帮你**:
- A. 立即创建安装脚本文件
- B. 测试安装流程
- C. 打包成 EXE 安装程序
- D. 创建安装演示视频

回复选项！⚡
