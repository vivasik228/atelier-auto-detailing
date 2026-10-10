$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
node --check app.js
if ($LASTEXITCODE -ne 0) { throw 'JavaScript verification failed' }
node --test tests/domain.test.mjs
if ($LASTEXITCODE -ne 0) { throw 'Tests failed' }
gh auth status
if ($LASTEXITCODE -ne 0) { throw 'Run gh auth login first' }
if (-not (Test-Path -LiteralPath '.git')) { git init -b main }
git add index.html style.css app.js domain.js config.js server.mjs package.json .gitignore .nojekyll assets tests docs README.md PHOTO-CREDITS.md photo-credits.html publish.ps1 robots.txt sitemap.xml
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -m 'Build ATELIER automotive detailing experience' }
$repoOwner = gh api user --jq .login
gh repo view "$repoOwner/atelier-auto-detailing" --json url 2>$null
if ($LASTEXITCODE -ne 0) { gh repo create atelier-auto-detailing --public --source . --remote origin --description 'ATELIER — Automotive Haute Couture' }
if ($LASTEXITCODE -ne 0) { throw 'Repository creation failed' }
git push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'Push failed' }
gh api "repos/$repoOwner/atelier-auto-detailing/pages" --method POST -f 'source[branch]=main' -f 'source[path]=/'
Write-Host "Repository: https://github.com/$repoOwner/atelier-auto-detailing"
Write-Host "Website: https://$repoOwner.github.io/atelier-auto-detailing/"
