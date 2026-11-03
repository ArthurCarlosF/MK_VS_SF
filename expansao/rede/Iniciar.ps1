param([switch]$Abrir,[switch]$AbrirLocal)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$nodeFile=Join-Path $PSScriptRoot 'runtime\node.exe'
$serverFile=Join-Path $PSScriptRoot 'server.cjs'
$dataFolder=Join-Path $projectRoot 'dados\rede'
New-Item -ItemType Directory -Path $dataFolder -Force | Out-Null
function Read-LocalServerInfo([int]$milliseconds){
    $request=[System.Net.HttpWebRequest]::Create('http://127.0.0.1:8765/api/info')
    $request.Proxy=$null
    $request.Timeout=$milliseconds
    $response=$request.GetResponse()
    try {
        $reader=[System.IO.StreamReader]::new($response.GetResponseStream())
        try {return ($reader.ReadToEnd() | ConvertFrom-Json)} finally {$reader.Dispose()}
    } finally {$response.Dispose()}
}
$alreadyRunning=$false
try {$info=Read-LocalServerInfo 5000; $alreadyRunning=$info.build -eq 'rede-8.1'} catch {}
if(-not $alreadyRunning){
    $child=Start-Process -FilePath $nodeFile -ArgumentList ('"'+$serverFile+'"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $dataFolder 'servidor.log') -RedirectStandardError (Join-Path $dataFolder 'erros.log')
    Set-Content -LiteralPath (Join-Path $dataFolder 'servidor.pid') -Value $child.Id -Encoding ascii
    for($attempt=0;$attempt -lt 120;$attempt++){
        Start-Sleep -Milliseconds 250
        try {$info=Read-LocalServerInfo 1500;if($info.build -eq 'rede-8.1'){$alreadyRunning=$true;break}} catch {}
        if($child.HasExited){throw 'O servidor encerrou. Consulte dados\rede\erros.log.'}
    }
    if(-not $alreadyRunning){throw 'O servidor não respondeu. Consulte dados\rede\erros.log.'}
}
Write-Output 'Servidor de rede local ativo.'
foreach($address in $info.urls){Write-Output ('Outros aparelhos: '+$address)}
if($Abrir -or $AbrirLocal){
    $edgeFile='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
    $profile=if($AbrirLocal){'dados\navegador-expansao'}else{'dados\navegador-rede'}
    $entry=if($AbrirLocal){'http://localhost:8765/expansao/index.html'}else{'http://localhost:8765/'}
    $browserData=Join-Path $projectRoot $profile
    Start-Process -FilePath $edgeFile -ArgumentList ('--user-data-dir="'+$browserData+'" --no-first-run --app="'+$entry+'"')
}
