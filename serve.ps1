# HERIZON Portfolio Local HTTP Server
# Serves static files locally.

$port = 8082
$rootDir = "C:\Users\HP\.gemini\antigravity\scratch\herizon_portfolio"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "HERIZON Portfolio Server started successfully."
    Write-Host "Navigate to: http://localhost:$port/"
    Write-Host "Press Ctrl+C or terminate this process to stop the server."
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        # Resolve path
        $cleanPath = $urlPath.Replace("/", "\").TrimStart('\')
        $filePath = Join-Path $rootDir $cleanPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            switch ($extension) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".css"  { $contentType = "text/css; charset=utf-8" }
                ".js"   { $contentType = "text/javascript; charset=utf-8" }
                ".svg"  { $contentType = "image/svg+xml; charset=utf-8" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                default { $contentType = "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("<h3>404 Not Found</h3><p>File not found: $urlPath</p>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    }
} catch {
    Write-Error $_
} finally {
    if ($listener -ne $null -and $listener.IsListening) {
        $listener.Stop()
    }
}
