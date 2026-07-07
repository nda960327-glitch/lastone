# VocabMaster 로컬 서버 (PowerShell HTTP Server)
$port = 8765
$root = $PSScriptRoot

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "VocabMaster 서버 시작: http://localhost:$port" -ForegroundColor Cyan
Write-Host "종료하려면 이 창을 닫으세요." -ForegroundColor Yellow

# 브라우저 자동 오픈
Start-Process "http://localhost:$port/index.html"

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $urlPath = $req.Url.LocalPath

        # DB 폴더 파일 목록 API
        if ($urlPath -eq "/api/db-list") {
            $dbPath = Join-Path $root "DB"
            if (Test-Path $dbPath) {
                $files = Get-ChildItem -Path $dbPath -Filter "*.txt" |
                         Sort-Object Name |
                         ForEach-Object { '"' + $_.Name + '"' }
                $json = "[" + ($files -join ",") + "]"
            } else {
                $json = "[]"
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $res.ContentType = "application/json; charset=utf-8"
            $res.Headers.Add("Access-Control-Allow-Origin", "*")
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        # 정적 파일 서빙
        else {
            $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))

            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".txt"  { "text/plain; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    default { "application/octet-stream" }
                }
                $res.ContentType = $mime
                $res.Headers.Add("Access-Control-Allow-Origin", "*")
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
                $res.OutputStream.Write($msg, 0, $msg.Length)
            }
        }

        $res.OutputStream.Close()
    } catch {
        # 서버 종료 시 정상 종료
        if ($listener.IsListening) { Write-Host "오류: $_" -ForegroundColor Red }
    }
}
