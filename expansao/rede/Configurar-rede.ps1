$ErrorActionPreference='Stop'
$principal=New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if(-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)){throw 'Confirme a solicitação de administrador do Windows para liberar a rede local.'}
$programFile=Join-Path $PSScriptRoot 'runtime\node.exe'
if(-not(Test-Path -LiteralPath $programFile)){throw 'Runtime do jogo não encontrado.'}
$rule=Get-NetFirewallRule -Name 'MKvsSF-LAN-8765' -ErrorAction SilentlyContinue
if(-not $rule){New-NetFirewallRule -Name 'MKvsSF-LAN-8765' -DisplayName 'Mortal Kombat vs Street Fighter - Rede local' -Direction Inbound -Action Allow -Enabled True -Profile Private -Protocol TCP -LocalPort 8765 -RemoteAddress LocalSubnet -Program $programFile | Out-Null}
$projectRoot=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$dataFolder=Join-Path $projectRoot 'dados\rede'
New-Item -ItemType Directory -Path $dataFolder -Force | Out-Null
@{status='CONFIGURED';rule='MKvsSF-LAN-8765';port=8765;profile='Private';remote='LocalSubnet';program=$programFile} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $dataFolder 'firewall-status.json') -Encoding utf8
