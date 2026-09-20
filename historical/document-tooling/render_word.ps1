param([string]$FilePattern='*.docx',[switch]$SourceOnly,[string]$InputFolder='outputs',[string]$WorkFolder=(Join-Path (Get-Location) 'work'))
$ErrorActionPreference='Stop'
$taskRoot=Split-Path $WorkFolder -Parent
$taskQa=Join-Path $WorkFolder 'qa'
New-Item -ItemType Directory -Path $taskQa -Force | Out-Null
$taskWord=New-Object -ComObject Word.Application
$taskWord.Visible=$false
$taskWord.DisplayAlerts=0
try {
 if($SourceOnly){$taskFiles=@(Get-Item -LiteralPath (Join-Path $WorkFolder 'source-master.docx'))}
 else {$taskFiles=Get-ChildItem -LiteralPath (Join-Path $taskRoot $InputFolder) -Recurse -Filter $FilePattern}
 foreach($taskFile in $taskFiles){
  $taskPdf=Join-Path $taskQa ($taskFile.BaseName+'.pdf')
  $taskDoc=$null
  try {
   Write-Output ('Opening '+$taskFile.Name)
   $taskDoc=$taskWord.Documents.Open($taskFile.FullName,$false,$true,$false)
   Write-Output ('Paginating '+$taskFile.Name)
   $taskPages=$taskDoc.ComputeStatistics(2)
   Write-Output ('Exporting '+$taskFile.Name+' pages '+$taskPages)
   $taskTempPdf=Join-Path $taskQa 'current-render.pdf'
   $taskDoc.SaveAs2($taskTempPdf,17)
   Copy-Item -LiteralPath $taskTempPdf -Destination $taskPdf -Force
   [pscustomobject]@{file=$taskFile.Name;pages=$taskPages;pdf=$taskPdf}|ConvertTo-Json -Compress
  } finally {if($null -ne $taskDoc){$taskDoc.Close(0)}}
 }
} finally {$taskWord.Quit()}
