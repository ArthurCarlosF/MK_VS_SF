param([int]$AnalysisId,[long]$ExpectedStart)
$root='D:\projetos\Mortal Kombat vs Street Fighter\engenharia-reversa'
$log=Join-Path $root 'pausa-desligamento.log'
"Iniciado em $(Get-Date -Format o). Aguardando o comando atual." | Set-Content -LiteralPath $log -Encoding UTF8
$target=Get-Process -Id $AnalysisId -ErrorAction SilentlyContinue
if($target -and $target.StartTime.ToUniversalTime().Ticks -eq $ExpectedStart){
 $target.WaitForExit()
 "Processo de análise finalizado em $(Get-Date -Format o)." | Add-Content -LiteralPath $log -Encoding UTF8
}else{
 "O processo original já terminou; nenhuma análise nova será iniciada." | Add-Content -LiteralPath $log -Encoding UTF8
}
Start-Sleep -Milliseconds 1000
$summary=Join-Path $root 'ssf2t\resumo-ghidra.json'
if(Test-Path -LiteralPath $summary){Get-Content -Raw -LiteralPath $summary | Add-Content -LiteralPath $log -Encoding UTF8}else{"Exportação sem resumo final; consultar evidencias\ghidra-ssf2t.log ao retomar." | Add-Content -LiteralPath $log -Encoding UTF8}
"Pausa registrada. Solicitando desligamento normal em $(Get-Date -Format o)." | Add-Content -LiteralPath $log -Encoding UTF8
& "$env:SystemRoot\System32\shutdown.exe" /s /t 0
"Resultado do pedido de desligamento: $LASTEXITCODE" | Add-Content -LiteralPath $log -Encoding UTF8
