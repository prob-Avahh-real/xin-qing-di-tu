@echo off
chcp 65001
echo ========================================
echo 心情地图 - 完整文件包（明亮版）
echo 压缩包文件列表
echo ========================================
echo.

powershell -Command "Add-Type -Assembly System.IO.Compression.FileSystem"
powershell -Command "$zip = [System.IO.Compression.ZipFile]::OpenRead('E:\hackathon-travel-experience-main\心情地图 - 完整文件包（明亮版）.zip')"
powershell -Command "$zip.Entries | ForEach-Object { $_.FullName }"
powershell -Command "$zip.Dispose()"

echo.
echo ========================================
pause
