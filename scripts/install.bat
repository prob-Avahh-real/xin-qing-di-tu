@echo off
chcp 65001 >nul
title 龙华·灵境向导 - 自动安装程序

echo ================================================
echo           龙华·灵境向导 自动安装程序
echo ================================================
echo.
echo 🚀 开始安装，请勿关闭此窗口...
echo.
echo ⚠️  需要管理员权限，请点击"是"继续
echo.
pause

:: 以管理员身份重新启动
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 请求管理员权限...
    powershell -Command "Start-Process cmd -ArgumentList '/c', '%~dpnx0' -Verb RunAs"
    exit /b
)

:: 运行 PowerShell 安装脚本
echo.
echo 正在运行安装脚本...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0install.ps1"

echo.
echo ================================================
echo 安装完成！
echo ================================================
echo.
echo 应用应该已经在浏览器中打开
echo 如未打开，请手动访问：http://localhost:5174/
echo.
echo 桌面快捷方式已创建
echo.
pause
