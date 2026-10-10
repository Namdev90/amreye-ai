param([Parameter(Mandatory=$true)][string]$SourceRoot)
$ErrorActionPreference='Stop'
$p=Join-Path $SourceRoot 'Manager.ps1'
$s=[IO.File]::ReadAllText($p)
$old=@'
    $quoted=@($Argv | ForEach-Object { Quote-Literal $_ }) -join ','
    $code='$ErrorActionPreference="Continue"; & '+(Quote-Literal $Exe)+' @('+ $quoted +'); if($null -ne $LASTEXITCODE){exit $LASTEXITCODE}'
    $engine=Join-Path $PSHOME 'powershell.exe'; if (!(Test-Path $engine)) { $engine=Join-Path $PSHOME 'pwsh.exe' }
    $psi=New-Object Diagnostics.ProcessStartInfo
    $psi.FileName=$engine; $psi.Arguments='-NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand '+[Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($code))
'@
$new=@'
    $psi=New-Object Diagnostics.ProcessStartInfo
    if ($Exe -match '(?i)\.(cmd|bat)$') {
        if ($Exe -match '[%!"^&|<>\r\n]' -or @($Argv | Where-Object { $_ -match '[%!"^&|<>\r\n]' }).Count -gt 0) { throw 'Batch launcher contains unsupported shell metacharacters; use a native executable.' }
        $psi.FileName=$env:ComSpec
        $psi.Arguments='/d /s /c ""'+$Exe+'" '+((@($Argv | ForEach-Object { '"'+$_+'"' })) -join ' ')+'"'
    } elseif ($Exe -match '(?i)\.ps1$') {
        $quoted=@($Argv | ForEach-Object { Quote-Literal $_ }) -join ','
        $code='$ErrorActionPreference="Stop"; & '+(Quote-Literal $Exe)+' @('+ $quoted +'); if($null -ne $LASTEXITCODE){exit $LASTEXITCODE}'
        $psi.FileName=Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
        $psi.Arguments='-NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand '+[Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($code))
    } else {
        $psi.FileName=$Exe
        $psi.Arguments=(@($Argv | ForEach-Object { '"'+[regex]::Replace([regex]::Replace($_,'(\\*)"','$1$1\"'),'(\\+)$','$1$1')+'"' }) -join ' ')
    }
'@
if (!$s.Contains($old)) { throw 'Expected command wrapper was not found; refusing ambiguous patch.' }
$s=$s.Replace($old,$new).Replace('2.0.0-preview.1','2.0.0-preview.2')
[IO.File]::WriteAllText($p,$s,[Text.UTF8Encoding]::new($false))
Write-Output 'Applied Windows-native argument preservation fix.'
