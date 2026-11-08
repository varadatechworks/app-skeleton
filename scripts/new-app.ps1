param(
  [Parameter(Mandatory=$true)][string]$Project,
  [Parameter(Mandatory=$true)][string]$Modules,
  [string]$Out = ".",
  [string]$Adapters = "",
  [ValidateSet("","postgres","d1")][string]$Db = "",
  [switch]$AdminUi
)
$ErrorActionPreference = 'Stop'
$tool = Join-Path $PSScriptRoot '..\tools\create-app.mjs'
$argsList = @($tool, '--project', $Project, '--modules', $Modules, '--out', $Out)
if ($Adapters) { $argsList += @('--adapters', $Adapters) }
if ($Db) { $argsList += @('--db', $Db) }
if ($AdminUi) { $argsList += @('--ui', 'next-admin') }
& node @argsList
if ($LASTEXITCODE -ne 0) { throw "App generation failed with code $LASTEXITCODE" }
