param([switch]$Abrir)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$nodeFile=Join-Path $PSScriptRoot 'runtime\node.exe'
$serverFile=Join-Path $PSScriptRoot 'server.cjs'
$dataFolder=Join-Path $projectRoot 'dados\rede'
New-Item -ItemType Directory -Path $dataFolder -Force | Out-Null
$alreadyRunning=$false
try {$info=Invoke-RestMethod -Uri 'http://127.0.0.1:8765/api/info' -TimeoutSec 2; $alreadyRunning=$info.build -eq 'rede-8.1'} catch {}
if(-not $alreadyRunning){
    $child=Start-Process -FilePath $nodeFile -ArgumentList ('"'+$serverFile+'"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $dataFolder 'servidor.log') -RedirectStandardError (Join-Path $dataFolder 'erros.log')
    Set-Content -LiteralPath (Join-Path $dataFolder 'servidor.pid') -Value $child.Id -Encoding ascii
    for($attempt=0;$attempt -lt 120;$attempt++){
        Start-Sleep -Milliseconds 250
        try {$info=Invoke-RestMethod -Uri 'http://127.0.0.1:8765/api/info' -TimeoutSec 1;if($info.build -eq 'rede-8.1'){$alreadyRunning=$true;break}} catch {}
        if($child.HasExited){throw 'O servidor encerrou. Consulte dados\rede\erros.log.'}
    }
    if(-not $alreadyRunning){throw 'O servidor não respondeu. Consulte dados\rede\erros.log.'}
}
Write-Output 'Servidor de rede local ativo.'
foreach($address in $info.urls){Write-Output ('Outros aparelhos: '+$address)}
if($Abrir){
    $edgeFile='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
    $browserData=Join-Path $projectRoot 'dados\navegador-rede'
    Start-Process -FilePath $edgeFile -ArgumentList ('--user-data-dir="'+$browserData+'" --no-first-run --app="http://localhost:8765/"')
}
