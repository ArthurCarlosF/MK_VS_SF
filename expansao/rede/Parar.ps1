$ErrorActionPreference='Stop'
$projectRoot=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$pidFile=Join-Path $projectRoot 'dados\rede\servidor.pid'
if(-not(Test-Path -LiteralPath $pidFile)){Write-Output 'Não há servidor registrado.';exit}
$serverProcessId=[int](Get-Content -LiteralPath $pidFile)
$serverProcess=Get-Process -Id $serverProcessId -ErrorAction SilentlyContinue
$expectedExe=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'runtime\node.exe'))
if($serverProcess -and $serverProcess.Path -eq $expectedExe){Stop-Process -Id $serverProcessId;Write-Output 'Servidor encerrado.'}
elseif($serverProcess){throw 'O número registrado pertence a outro programa. Nenhum processo foi encerrado.'}
else{Write-Output 'O servidor já está encerrado.'}
