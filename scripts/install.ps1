# 龙华·灵境向导 - PowerShell 自动安装脚本
# 适用于 Windows 10/11

param(
    [switch]$SkipOllama,
    [switch]$SkipModel
)

# 颜色定义
$success = "Green"
$info = "Cyan"
$warning = "Yellow"
$error = "Red"

# 安装目录
$installDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ollamaDir = "$env:USERPROFILE\.ollama"

# ============================================
# 辅助函数
# ============================================

function Write-Step {
    param($number, $message)
    Write-Host ""
    Write-Host "[$number] $message" -ForegroundColor $info
}

function Write-Success {
    param($message)
    Write-Host "✅ $message" -ForegroundColor $success
}

function Write-Warning-Custom {
    param($message)
    Write-Host "⚠️  $message" -ForegroundColor $warning
}

function Write-Error-Custom {
    param($message)
    Write-Host "❌ $message" -ForegroundColor $error
}

# ============================================
# 步骤 1: 检查系统要求
# ============================================
Write-Step 1 "检查系统要求..."

# 检查 Windows 版本
try {
    $windowsVersion = [System.Environment]::OSVersion.Version.Major
    if ($windowsVersion -lt 10) {
        Write-Error-Custom "需要 Windows 10 或更高版本，当前版本：$windowsVersion"
        pause
        exit 1
    }
    Write-Success "Windows 版本符合要求 (Windows $windowsVersion)"
} catch {
    Write-Error-Custom "无法检测 Windows 版本"
}

# 检查磁盘空间
try {
    $drive = Get-PSDrive -Name (Split-Path $installDir -Qualifier).TrimEnd(":")
    $freeSpaceGB = [math]::Round($drive.Free / 1GB, 2)
    if ($freeSpaceGB -lt 15) {
        Write-Warning-Custom "磁盘空间较少，建议至少 15GB，当前可用：${freeSpaceGB}GB"
    } else {
        Write-Success "磁盘空间充足 (${freeSpaceGB}GB 可用)"
    }
} catch {
    Write-Warning-Custom "无法检测磁盘空间"
}

# 检查网络
try {
    $response = Invoke-WebRequest -Uri "https://www.baidu.com" -TimeoutSec 5 -UseBasicParsing
    Write-Success "网络连接正常"
} catch {
    Write-Warning-Custom "网络连接可能有问题，安装可能失败"
}

# ============================================
# 步骤 2: 检查 Node.js
# ============================================
Write-Step 2 "检查 Node.js..."

$nodeInstalled = $false
try {
    $nodeVersion = node -v 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Node.js 已安装：$nodeVersion"
        $nodeInstalled = $true
    }
} catch {
    # Node.js 未安装
}

if (-not $nodeInstalled) {
    Write-Warning-Custom "Node.js 未安装"
    Write-Host "💡 请先安装 Node.js:" -ForegroundColor $info
    Write-Host "   1. 访问：https://nodejs.org/" -ForegroundColor $info
    Write-Host "   2. 下载 LTS 版本" -ForegroundColor $info
    Write-Host "   3. 安装后重新运行此脚本" -ForegroundColor $info
    Write-Host ""
    
    $autoInstall = Read-Host "是否自动下载 Node.js 安装器？(Y/N)"
    if ($autoInstall -eq "Y" -or $autoInstall -eq "y") {
        $nodeInstaller = "$env:TEMP\node-installer.msi"
        $nodeUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
        
        Write-Host "下载 Node.js 安装器..."
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller -UseBasicParsing
        Write-Success "下载完成：$nodeInstaller"
        
        $runInstaller = Read-Host "是否立即安装？(Y/N)"
        if ($runInstaller -eq "Y" -or $runInstaller -eq "y") {
            Write-Host "安装 Node.js..."
            Start-Process msiexec.exe -Wait -ArgumentList "/i $nodeInstaller /quiet"
            Write-Success "Node.js 安装完成"
            
            # 刷新环境变量
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        }
    } else {
        pause
        exit 1
    }
}

# ============================================
# 步骤 3: 检查 Ollama
# ============================================
if (-not $SkipOllama) {
    Write-Step 3 "检查 Ollama..."
    
    $ollamaInstalled = $false
    try {
        $ollamaVersion = ollama --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Ollama 已安装：$ollamaVersion"
            $ollamaInstalled = $true
        }
    } catch {
        # Ollama 未安装
    }
    
    if (-not $ollamaInstalled) {
        Write-Warning-Custom "Ollama 未安装"
        Write-Host "💡 正在自动安装 Ollama..." -ForegroundColor $info
        
        $ollamaInstaller = "$env:TEMP\OllamaSetup.exe"
        $ollamaUrl = "https://ollama.com/download/OllamaSetup.exe"
        
        try {
            Write-Host "下载 Ollama 安装器..."
            Invoke-WebRequest -Uri $ollamaUrl -OutFile $ollamaInstaller -UseBasicParsing
            Write-Success "下载完成"
            
            Write-Host "安装 Ollama..."
            Start-Process $ollamaInstaller -Wait -ArgumentList "/S"
            Write-Success "Ollama 安装完成"
            
            # 等待服务启动
            Write-Host "等待 Ollama 服务启动..."
            Start-Sleep -Seconds 10
        } catch {
            Write-Error-Custom "Ollama 安装失败"
            Write-Host "请手动安装：https://ollama.com/" -ForegroundColor $warning
        }
    }
} else {
    Write-Step 3 "跳过 Ollama 检查（--SkipOllama）"
}

# ============================================
# 步骤 4: 下载 AI 模型
# ============================================
if (-not $SkipModel -and -not $SkipOllama) {
    Write-Step 4 "检查 AI 模型..."
    
    # 启动 Ollama 服务
    Write-Host "启动 Ollama 服务..."
    $ollamaProcess = Start-Process ollama -ArgumentList "serve" -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 5
    
    # 检查已安装的模型
    $models = ollama list 2>&1
    if ($models -notmatch "qwen2.5") {
        Write-Warning-Custom "未检测到 qwen2.5 模型"
        Write-Host "💡 正在下载 qwen2.5:7b 模型（约 4.7GB）..." -ForegroundColor $info
        Write-Host "⏳ 这可能需要 10-15 分钟，请耐心等待..." -ForegroundColor $info
        Write-Host ""
        
        $downloadModel = Read-Host "是否现在下载？(Y/N，选择 N 可稍后手动下载)"
        if ($downloadModel -eq "Y" -or $downloadModel -eq "y") {
            try {
                ollama pull qwen2.5:7b
                Write-Success "模型下载完成"
            } catch {
                Write-Error-Custom "模型下载失败"
                Write-Host "可稍后手动运行：ollama pull qwen2.5:7b" -ForegroundColor $warning
            }
        } else {
            Write-Host "稍后可手动运行：ollama pull qwen2.5:7b" -ForegroundColor $info
        }
    } else {
        Write-Success "AI 模型已存在"
    }
    
    # 停止 Ollama 进程（稍后会随应用启动）
    if ($ollamaProcess) {
        Stop-Process -Id $ollamaProcess.Id -Force -ErrorAction SilentlyContinue
    }
} elseif ($SkipModel) {
    Write-Step 4 "跳过 AI 模型检查（--SkipModel）"
} else {
    Write-Step 4 "跳过 AI 模型检查（Ollama 未安装）"
}

# ============================================
# 步骤 5: 安装项目依赖
# ============================================
Write-Step 5 "安装项目依赖..."

Set-Location $installDir

Write-Host "运行 npm install..."
npm install --loglevel=error

if ($LASTEXITCODE -eq 0) {
    Write-Success "依赖安装完成"
} else {
    Write-Error-Custom "依赖安装失败"
    Write-Host "请检查网络连接或手动运行：npm install" -ForegroundColor $warning
    pause
    exit 1
}

# ============================================
# 步骤 6: 创建快捷方式
# ============================================
Write-Step 6 "创建快捷方式..."

try {
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
    
    Write-Success "桌面快捷方式已创建"
    
    # 开始菜单快捷方式
    $startMenuPath = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\龙华·灵境向导.lnk"
    $WshShell = New-Object -ComObject WScript.Shell
    $shortcut = $WshShell.CreateShortcut($startMenuPath)
    $shortcut.TargetPath = $targetPath
    $shortcut.Arguments = $arguments
    $shortcut.WorkingDirectory = $installDir
    $shortcut.IconLocation = "shell32.dll,13"
    $shortcut.Save()
    
    Write-Success "开始菜单快捷方式已创建"
} catch {
    Write-Warning-Custom "创建快捷方式失败，可手动创建"
}

# ============================================
# 步骤 7: 启动应用
# ============================================
Write-Step 7 "启动应用..."

Write-Host "启动龙华·灵境向导..."

# 检查端口是否被占用
$portInUse = netstat -ano | Select-String ":5173"
if ($portInUse) {
    Write-Warning-Custom "端口 5173 已被占用，应用可能在其他端口运行"
}

# 启动应用
Start-Process cmd -ArgumentList "/c `"cd $installDir && npm run dev`"" -WindowStyle Normal

Write-Host "等待应用启动..."
Start-Sleep -Seconds 8

# 打开浏览器
try {
    Start-Process "http://localhost:5174/"
    Write-Success "应用已启动，浏览器已打开"
} catch {
    Write-Warning-Custom "无法自动打开浏览器"
    Write-Host "请手动访问：http://localhost:5174/" -ForegroundColor $info
}

# ============================================
# 安装完成
# ============================================
Write-Host ""
Write-Host "================================================" -ForegroundColor $success
Write-Host "        🎉 安装完成！" -ForegroundColor $success
Write-Host "================================================" -ForegroundColor $success
Write-Host ""
Write-Host "✅ 应用已在浏览器中打开" -ForegroundColor $success
Write-Host "📍 地址：http://localhost:5174/" -ForegroundColor $info
Write-Host ""
Write-Host "📌 桌面快捷方式：龙华·灵境向导" -ForegroundColor $info
Write-Host ""
Write-Host "💡 提示:" -ForegroundColor $info
Write-Host "   - 双击桌面快捷方式可重新启动应用" -ForegroundColor $info
Write-Host "   - 如使用语音对话功能，请确保 Ollama 已安装并运行" -ForegroundColor $info
Write-Host "   - 首次启动可能需要等待几秒钟" -ForegroundColor $info
Write-Host ""
Write-Host "如需帮助，请查看 README.md 或 AUTO_INSTALL_GUIDE.md" -ForegroundColor $info
Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
