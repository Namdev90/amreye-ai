param([Parameter(Mandatory=$true)][string]$SourceRoot)
$ErrorActionPreference='Stop'
$p=Join-Path $SourceRoot 'Manager.ps1'
$s=[IO.File]::ReadAllText($p)
if (!$s.Contains('$home=if ($env:CODEX_HOME)')) { throw 'Unexpected source revision.' }
$s=$s.Replace('$home=if ($env:CODEX_HOME)','$codexHome=if ($env:CODEX_HOME)').Replace('$conf=Join-Path $home ''config.toml''','$conf=Join-Path $codexHome ''config.toml''')
$helper=@'
function Protect-Object($Value) {
    if ($null -eq $Value) { return $null }
    if ($Value -is [string]) { return (Protect-Text $Value) }
    if ($Value -is [Collections.IDictionary]) {
        $result=[ordered]@{}
        foreach ($key in $Value.Keys) { $result[[string]$key]=Protect-Object $Value[$key] }
        return $result
    }
    if ($Value -is [pscustomobject]) {
        $result=[ordered]@{}
        foreach ($prop in $Value.PSObject.Properties) { $result[$prop.Name]=Protect-Object $prop.Value }
        return $result
    }
    if ($Value -is [Collections.IEnumerable]) {
        $items=@(foreach ($item in $Value) { Protect-Object $item })
        return ,$items
    }
    return $Value
}
'@
$s=$s.Replace('function Save-Report([string]$Status) {',$helper+"`nfunction Save-Report([string]`$Status) {")
$s=$s.Replace('$json=Protect-Text ($report | ConvertTo-Json -Depth 12)','$json=(Protect-Object $report) | ConvertTo-Json -Depth 12').Replace('2.0.0-preview.2','2.0.0-preview.3')
[IO.File]::WriteAllText($p,$s,[Text.UTF8Encoding]::new($false))
$p=Join-Path $SourceRoot 'tests.ps1'
$s=[IO.File]::ReadAllText($p)
$extra=@'
$fixture=[ordered]@{url='https://example.test/?token=PRIVATE';next='preserved';nested=@('test@example.com','plain')}
$clean=Protect-Object $fixture
$roundtrip=($clean | ConvertTo-Json -Depth 8) | ConvertFrom-Json
Assert ($roundtrip.next -eq 'preserved') 'Redaction preserves adjacent JSON fields'
Assert ($roundtrip.url -notmatch 'PRIVATE') 'Nested URL secret removed before serialization'
Assert ($roundtrip.nested.Count -eq 2) 'Redaction preserves array structure'
if ($env:OS -eq 'Windows_NT') {
    $tmp=Join-Path $env:TEMP ('odm-inventory-'+[guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory $tmp | Out-Null
    $script:RunDir=$tmp; $script:Inventory=[ordered]@{}; $script:Commands=New-Object Collections.ArrayList
    try {
        Get-Inventory | Out-Null
        Assert ($script:Inventory.Contains('codexConfigExists')) 'Inventory does not overwrite the read-only HOME variable'
        $DataRoot=$tmp; $RunId='test'; $script:IsAudit=$true
        $script:Inventory=$fixture; $script:Results=@(); $script:Endpoints=@(); $script:Selected=@()
        Save-Report 'TEST'
        $report=Get-Content (Join-Path $tmp 'Report.json') -Raw | ConvertFrom-Json
        Assert ($report.inventory.next -eq 'preserved') 'Complete report JSON round trip'
        Assert ($report.inventory.url -notmatch 'PRIVATE') 'Complete report token redaction'
    } finally { Remove-Item -LiteralPath $tmp -Recurse -Force }
}
'@
$s=$s.Replace('Write-Output "PASS: $n offline tests;',$extra+"`n"+'Write-Output "PASS: $n offline tests;')
[IO.File]::WriteAllText($p,$s,[Text.UTF8Encoding]::new($false))
Write-Output 'Applied inventory and structured report fixes with regression tests.'
