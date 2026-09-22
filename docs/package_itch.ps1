# Script para empacotar o jogo para o Itch.io
$itchDir = $PSScriptRoot
$renderPublic = Join-Path $PSScriptRoot "..\render_deploy\public"
$zipOutput = Join-Path $itchDir "jogo_web_itch_io.zip"

if (Test-Path $zipOutput) {
    Remove-Item $zipOutput -Force
}

$sourceDir = ""
if (Test-Path (Join-Path $itchDir "index.html")) {
    $sourceDir = $itchDir
} elseif (Test-Path (Join-Path $renderPublic "index.html")) {
    $sourceDir = $renderPublic
}

if ($sourceDir -ne "") {
    # Ensure coi-serviceworker.js exists in target
    if (-not (Test-Path (Join-Path $sourceDir "coi-serviceworker.js"))) {
        Copy-Item -Path (Join-Path $itchDir "coi-serviceworker.js") -Destination $sourceDir -Force
    }
    Write-Host "📦 Compactando arquivos exportados de '$sourceDir' para o Itch.io..."
    
    # Get all html, js, wasm, pck, png, etc files excluding the zip itself
    $files = Get-ChildItem -Path $sourceDir -File | Where-Object { $_.Name -ne "jogo_web_itch_io.zip" -and $_.Name -ne "package_itch.ps1" }
    Compress-Archive -Path $files.FullName -DestinationPath $zipOutput -Force
    Write-Host "✅ SUCESSO: Arquivo '$zipOutput' criado e pronto para subir no Itch.io!"
} else {
    Write-Host "⚠️ Atenção: Exporte o jogo no Godot (Projeto -> Exportar -> Web) para 'itch_io_deploy/index.html' antes de rodar este script."
}
