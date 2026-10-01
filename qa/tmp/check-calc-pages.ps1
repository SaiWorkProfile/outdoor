$ErrorActionPreference = 'Stop'
$slugs = 'gravel-calculator','mulch-calculator','topsoil-calculator','soil-calculator','sand-calculator','pea-gravel-calculator','landscape-rock-calculator','paver-base-calculator','driveway-gravel-calculator','concrete-calculator','paver-calculator','paver-patio-calculator','fence-calculator','fence-cost-calculator','fence-post-calculator','deck-material-calculator'
$issues = @()
$titles = @{}
$descs = @{}

$sm = (Invoke-WebRequest 'http://localhost:3100/sitemap.xml' -UseBasicParsing).Content
$sitemapCount = ([regex]::Matches($sm, '<loc>(.*?)</loc>')).Count
Write-Host "sitemap urls: $sitemapCount (expected 53)"
if ($sitemapCount -ne 53) { $issues += "sitemap has $sitemapCount urls, expected 53" }

foreach ($s in $slugs) {
  $r = Invoke-WebRequest -Uri "http://localhost:3100/calculators/$s" -UseBasicParsing
  $h = $r.Content
  if ($r.StatusCode -ne 200) { $issues += "$s status $($r.StatusCode)" }

  $t = [regex]::Match($h, '<title>(.*?)</title>').Groups[1].Value
  $d = [regex]::Match($h, 'name="description" content="(.*?)"').Groups[1].Value
  $can = [regex]::Matches($h, '<link rel="canonical" href="(.*?)"')
  $h1 = [regex]::Matches($h, '<h1[ >]')
  $og = [regex]::Match($h, 'property="og:title" content="(.*?)"').Groups[1].Value
  $ogd = [regex]::Match($h, 'property="og:description" content="(.*?)"').Groups[1].Value
  $rob = [regex]::Match($h, 'name="robots" content="(.*?)"').Groups[1].Value
  $canon = [regex]::Match($h, '<link rel="canonical" href="(.*?)"').Groups[1].Value

  if ([string]::IsNullOrWhiteSpace($t)) { $issues += "$s missing title" }
  if ([string]::IsNullOrWhiteSpace($d)) { $issues += "$s missing description" }
  if ($titles.ContainsKey($t)) { $issues += "duplicate title: $t" } else { $titles[$t] = $s }
  if ($descs.ContainsKey($d)) { $issues += "duplicate description on $s" } else { $descs[$d] = $s }
  if ($can.Count -ne 1) { $issues += "$s canonical count $($can.Count)" }
  if ($h1.Count -ne 1) { $issues += "$s h1 count $($h1.Count)" }
  if (-not $og -or -not $ogd) { $issues += "$s missing og" }
  if ($rob -notmatch 'index') { $issues += "$s robots $rob" }
  if ($canon -notmatch "/calculators/$s$") { $issues += "$s canonical wrong: $canon" }

  foreach ($sec in 'What this calculator calculates','Projects this calculator covers','Reading the results','Frequently asked questions','Planning guides','Related calculators','Common mistakes','Important limitations') {
    if ($h -notmatch [regex]::Escape($sec)) { $issues += "$s missing section: $sec" }
  }

  $links = [regex]::Matches($h, 'href="(/[^\s"#]*)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  if (-not ($links | Where-Object { $_ -like '/projects/*' })) { $issues += "$s no project guide link" }
  if (-not ($links | Where-Object { $_ -like '/materials/*' })) { $issues += "$s no material guide link" }
  if (-not ($links | Where-Object { $_ -like '/costs/*' })) { $issues += "$s no cost guide link" }
  if (-not ($links | Where-Object { $_ -like '/calculators/*' -and $_ -ne "/calculators/$s" })) { $issues += "$s no related calculator link" }
  if (-not ($links | Where-Object { $_ -eq '/projects' })) { $issues += "$s no Project Mode link" }

  $faq = [regex]::Matches($h, '<details[ >]').Count
  Write-Host ("{0,-28} title={1}c desc={2}c h1={3} faq={4} links={5}" -f $s, $t.Length, $d.Length, $h1.Count, $faq, $links.Count)
}

Write-Host ("unique titles: {0}  unique descriptions: {1}" -f $titles.Count, $descs.Count)
if ($issues.Count) { Write-Host 'ISSUES:'; $issues | ForEach-Object { Write-Host " - $_" }; exit 1 }
Write-Host 'ALL CALCULATOR PAGE CHECKS PASSED'
