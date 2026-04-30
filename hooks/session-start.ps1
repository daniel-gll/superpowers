# SessionStart hook for superpowers plugin - Windows/PowerShell wrapper.
# VS Code Copilot runs Windows hooks as PowerShell. This wrapper locates
# Git-for-Windows bash and delegates to the existing session-start bash script.

$bashExe = $null
$bashCandidates = @(
    'C:\Program Files\Git\bin\bash.exe',
    'C:\Program Files (x86)\Git\bin\bash.exe'
)

foreach ($candidate in $bashCandidates) {
    if (Test-Path -Path $candidate) {
        $bashExe = $candidate
        break
    }
}

if (-not $bashExe) {
    $bashCommand = Get-Command -Name bash -ErrorAction SilentlyContinue
    if ($bashCommand) {
        $bashExe = $bashCommand.Source
    }
}

if (-not $bashExe) {
    exit 0
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$bashScript = Join-Path -Path $scriptDir -ChildPath 'session-start'

if (-not (Test-Path -Path $bashScript)) {
    exit 0
}

$env:COPILOT_CLI = '1'

& $bashExe $bashScript
exit $LASTEXITCODE
