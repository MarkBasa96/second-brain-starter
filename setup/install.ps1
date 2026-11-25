<#
.SYNOPSIS
  Installs Second Brain Starter into an Obsidian vault folder (Windows PowerShell 5.1+).

.DESCRIPTION
  -Mode New      Fresh brain. Copies the starter vault (folders, skills, helper agents,
                 concept notes) into an EMPTY folder, plus the Brain Graph plugin.
  -Mode Connect  You already have a vault. Adds ONLY the plugin, the brain-connect skill and a
                 hidden kit folder. It never moves, renames or deletes any of your notes.

  Nothing is ever overwritten except this project's own plugin files. Files that already
  exist are skipped and listed. Settings files it must edit are backed up first.

.PARAMETER Vault     Folder of the vault (created in New mode if missing).
.PARAMETER Mode      New | Connect
.PARAMETER NoHotkey  Do not make Ctrl+G open the brain graph.
.PARAMETER DryRun    Print what would happen and change nothing.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File setup\install.ps1 -Vault "$HOME\Documents\My Brain" -Mode New
  powershell -ExecutionPolicy Bypass -File setup\install.ps1 -Vault "D:\Notes\MyVault" -Mode Connect -DryRun
#>
param(
  [Parameter(Mandatory = $true)][string]$Vault,
  [ValidateSet('New', 'Connect')][string]$Mode = 'New',
  [switch]$NoHotkey,
  [switch]$DryRun
)
$ErrorActionPreference = 'Stop'
$Repo = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$script:skipped = New-Object System.Collections.ArrayList
$script:added = 0

function Say($t) { Write-Host $t }
function Do-Or-Say($what, [scriptblock]$act) {
  if ($DryRun) { Say "  [dry run] $what" } else { & $act }
}

# Copy a folder tree. $overwrite=$false skips files that already exist (and records them).
function Copy-Tree($src, $dst, [bool]$overwrite) {
  Get-ChildItem -LiteralPath $src -Recurse -Force -File | ForEach-Object {
    $rel = $_.FullName.Substring($src.Length).TrimStart('\', '/')
    $to = Join-Path $dst $rel
    if ((Test-Path -LiteralPath $to) -and -not $overwrite) { [void]$script:skipped.Add($rel); return }
    Do-Or-Say "add $rel" {
      New-Item -ItemType Directory -Force -Path (Split-Path -Parent $to) | Out-Null
      if ($rel -match '\.(md|json|html|js|txt)$|\.gitkeep$') {
        # normalise to LF: CRLF in an agent file can silently drop it from the roster
        $text = [IO.File]::ReadAllText($_.FullName) -replace "`r`n", "`n"
        [IO.File]::WriteAllText($to, $text, $utf8)
      } else { Copy-Item -LiteralPath $_.FullName -Destination $to -Force }
    }
    $script:added++
  }
}

function Backup($path) {
  if (-not (Test-Path -LiteralPath $path)) { return }
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $dir = Join-Path $Vault ".brain-connect-backup\$stamp"
  Do-Or-Say "back up $path" {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Copy-Item -LiteralPath $path -Destination (Join-Path $dir (Split-Path -Leaf $path))
  }
}

# ---- 1. check the vault folder ----
$Vault = [IO.Path]::GetFullPath($Vault)
Say "Second Brain Starter installer ($Mode mode)"
Say "Vault: $Vault"
if ($Mode -eq 'New') {
  if (Test-Path -LiteralPath $Vault) {
    $existing = @(Get-ChildItem -LiteralPath $Vault -Force | Where-Object { $_.Name -notin '.obsidian', '.git' })
    if ($existing.Count -gt 0) {
      Say ""
      Say "That folder already has files in it. New mode only installs into an empty folder."
      Say "If this is a vault you already use, re-run with -Mode Connect (it never touches your notes)."
      exit 2
    }
  } else { Do-Or-Say "create $Vault" { New-Item -ItemType Directory -Force -Path $Vault | Out-Null } }
} else {
  if (-not (Test-Path -LiteralPath $Vault)) { Say "Connect mode needs an existing vault folder: $Vault"; exit 2 }
  $hasNotes = @(Get-ChildItem -LiteralPath $Vault -Recurse -Filter *.md -File -ErrorAction SilentlyContinue | Select-Object -First 1).Count
  if (-not (Test-Path -LiteralPath (Join-Path $Vault '.obsidian')) -and $hasNotes -eq 0) {
    Say "That folder has no notes and no .obsidian folder. Is it the right one? (Use -Mode New for an empty folder.)"
    exit 2
  }
}

# ---- 2. the plugin (ours, so overwriting our own files is fine) ----
Say ""; Say "Installing the Brain Graph plugin..."
Copy-Tree (Join-Path $Repo 'plugin\brain-graph') (Join-Path $Vault '.obsidian\plugins\brain-graph') $true

# ---- 3. switch the plugin on in the vault's list ----
$cp = Join-Path $Vault '.obsidian\community-plugins.json'
$list = @()
if (Test-Path -LiteralPath $cp) {
  try {
    # foreach, not @(...|ConvertFrom-Json): Windows PowerShell 5.1 would wrap a 1-item array as one object
    $parsed = ConvertFrom-Json -InputObject ([IO.File]::ReadAllText($cp))
    $list = @(); foreach ($i in $parsed) { $list += [string]$i }
  } catch { $list = @() }
}
if ($list -notcontains 'brain-graph') {
  Backup $cp
  $list = @($list) + 'brain-graph'
  Do-Or-Say "enable brain-graph in community-plugins.json" {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $cp) | Out-Null
    [IO.File]::WriteAllText($cp, (ConvertTo-Json -InputObject @($list)), $utf8)
  }
}

# ---- 4. Ctrl+G opens the brain graph (unless the user opted out or it would clash) ----
if (-not $NoHotkey) {
  $hk = Join-Path $Vault '.obsidian\hotkeys.json'
  $map = [ordered]@{}
  if (Test-Path -LiteralPath $hk) {
    try { (([IO.File]::ReadAllText($hk)) | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $map[$_.Name] = $_.Value } } catch { $map = [ordered]@{} }
  }
  $clash = $false
  foreach ($k in $map.Keys) {
    if ($k -in 'brain-graph:open', 'graph:open') { continue }
    foreach ($b in @($map[$k])) { if ($b.key -eq 'G' -and (@($b.modifiers) -contains 'Mod') -and @($b.modifiers).Count -eq 1) { $clash = $true } }
  }
  if ($clash) { Say "  Ctrl+G is already used by another command in this vault, so I left your hotkeys alone." }
  else {
    Backup $hk
    $map['brain-graph:open'] = @(@{ modifiers = @('Mod'); key = 'G' })
    $map['graph:open'] = @()
    Do-Or-Say "bind Ctrl+G to the brain graph (the old graph stays in the command palette)" {
      [IO.File]::WriteAllText($hk, (ConvertTo-Json -InputObject $map -Depth 6), $utf8)
    }
  }
}

# ---- 5. the brain itself ----
if ($Mode -eq 'New') {
  Say ""; Say "Copying the starter vault..."
  Copy-Tree (Join-Path $Repo 'template') $Vault $false
} else {
  Say ""; Say "Adding the connect skill and the optional kit (hidden folders, so your graph stays yours)..."
  Copy-Tree (Join-Path $Repo 'connect\.claude') (Join-Path $Vault '.claude') $false
  $kit = Join-Path $Vault '.brain-connect-kit'
  Copy-Tree (Join-Path $Repo 'template\.claude') (Join-Path $kit '.claude') $false
  Copy-Tree (Join-Path $Repo 'template\07-memory') (Join-Path $kit '07-memory') $false
  Copy-Tree (Join-Path $Repo 'template\08-concepts') (Join-Path $kit '08-concepts') $false
}

# ---- 6. report ----
Say ""
Say ("Done." + $(if ($DryRun) { " (dry run: nothing was changed)" } else { "" }))
Say "  files added: $script:added"
if ($script:skipped.Count -gt 0) {
  Say "  already existed, left untouched: $($script:skipped.Count)"
  $script:skipped | Select-Object -First 8 | ForEach-Object { Say "    - $_" }
}
Say ""
Say "NEXT (two clicks, one command):"
Say "  1. In Obsidian: 'Open folder as vault' -> choose: $Vault"
Say "  2. If Obsidian asks, click 'Turn on community plugins'. Then press Ctrl+G."
if ($Mode -eq 'New') { Say "  3. In a terminal:  cd `"$Vault`"; claude    then say:  set me up" }
else { Say "  3. In a terminal:  cd `"$Vault`"; claude    then say:  connect my brain" }
