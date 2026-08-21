$ErrorActionPreference = "Stop"

$siteRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$htmlFiles = Get-ChildItem -LiteralPath $siteRoot -Recurse -Filter "*.html" -File |
  Where-Object { $_.FullName -notmatch "\\tmp\\" }
$issues = [System.Collections.Generic.List[string]]::new()

function Resolve-RouteFile([string]$href) {
  $path = $href.Split("?")[0].Split("#")[0]
  if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "/") {
    return Join-Path $siteRoot "index.html"
  }
  $relative = $path.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
  if ([System.IO.Path]::GetExtension($relative)) {
    return Join-Path $siteRoot $relative
  }
  return Join-Path (Join-Path $siteRoot $relative) "index.html"
}

foreach ($file in $htmlFiles) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  $relative = $file.FullName.Substring($siteRoot.Length + 1)
  $routePath = $relative.Replace("\", "/")
  if ($routePath -eq "index.html") { $routePath = "/" }
  else { $routePath = "/" + $routePath.Substring(0, $routePath.Length - "index.html".Length) }
  $expectedCanonical = "https://fit.frankmercado.com$routePath"

  if ([regex]::Matches($content, "<h1(?:\s|>)", "IgnoreCase").Count -ne 1) { $issues.Add("H1 count: $relative") }
  if ($content -notmatch "<title>.+?</title>") { $issues.Add("Missing title: $relative") }
  if ($content -notmatch 'meta name="description"') { $issues.Add("Missing description: $relative") }
  if ($content -notmatch 'rel="canonical"') { $issues.Add("Missing canonical: $relative") }
  elseif ($content -notmatch ('rel="canonical" href="' + [regex]::Escape($expectedCanonical) + '"')) { $issues.Add("Canonical mismatch: $relative") }
  foreach ($language in @("en-US", "es-US", "x-default")) {
    if ($content -notmatch ('hreflang="' + [regex]::Escape($language) + '"')) { $issues.Add("Missing hreflang $language`: $relative") }
  }

  foreach ($script in [regex]::Matches($content, '<script type="application/ld\+json">([\s\S]*?)</script>', "IgnoreCase")) {
    try { $null = $script.Groups[1].Value | ConvertFrom-Json -ErrorAction Stop }
    catch { $issues.Add("Invalid JSON-LD: $relative") }
  }

  foreach ($match in [regex]::Matches($content, 'href="([^"]+)"', "IgnoreCase")) {
    $href = $match.Groups[1].Value
    if ($href.StartsWith("/") -and -not $href.StartsWith("//")) {
      $target = Resolve-RouteFile $href
      if (-not (Test-Path -LiteralPath $target)) { $issues.Add("Broken internal link in $relative -> $href") }
    }
  }
}

try {
  [xml]$sitemap = Get-Content -LiteralPath (Join-Path $siteRoot "sitemap.xml") -Raw
  $sitemapUrls = @($sitemap.urlset.url.loc | ForEach-Object { [string]$_ })
  $indexableHtmlFiles = @($htmlFiles | Where-Object {
    ([System.IO.File]::ReadAllText($_.FullName) -notmatch 'meta name="robots" content="noindex')
  })
  $expectedUrls = @($indexableHtmlFiles | ForEach-Object {
    $relativePath = $_.FullName.Substring($siteRoot.Length + 1).Replace("\", "/")
    if ($relativePath -eq "index.html") { "https://fit.frankmercado.com/" }
    else { "https://fit.frankmercado.com/" + $relativePath.Substring(0, $relativePath.Length - "index.html".Length) }
  })
  foreach ($url in $expectedUrls) {
    if ($url -notin $sitemapUrls) { $issues.Add("Sitemap missing: $url") }
  }
  foreach ($url in $sitemapUrls) {
    if ($url -notin $expectedUrls) { $issues.Add("Sitemap has unknown URL: $url") }
  }
}
catch { $issues.Add("Invalid sitemap.xml") }

try { $null = Get-Content -LiteralPath (Join-Path $siteRoot "vercel.json") -Raw | ConvertFrom-Json -ErrorAction Stop }
catch { $issues.Add("Invalid vercel.json") }

$blockedPatterns = @(
  "ipapi", "sessionStorage", "Hotmart", "#LINK_BOLD", "500+",
  "200 clientes", "200 clients", "NASM CPT", "certificado NASM",
  "NASM Certified", "ShiftStrong", "6-week", "six weeks", "6 semanas",
  "seis semanas", "modelo OPT", "4-8 kg", "frank@frankmercadofit"
)
$searchableFiles = Get-ChildItem -LiteralPath $siteRoot -Recurse -File |
  Where-Object { $_.FullName -notmatch "\\.git\\|\\tmp\\|\\scripts\\" -and $_.Extension -in @(".html", ".js", ".css", ".xml", ".txt", ".json") }
foreach ($pattern in $blockedPatterns) {
  foreach ($file in $searchableFiles) {
    if ([System.IO.File]::ReadAllText($file.FullName).IndexOf($pattern, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
      $issues.Add("Blocked legacy phrase '$pattern' in $($file.FullName.Substring($siteRoot.Length + 1))")
    }
  }
}

if ($issues.Count -gt 0) {
  $issues | Sort-Object -Unique | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Output "Site QA passed: $($htmlFiles.Count) HTML files, internal links, canonical routes, hreflang, metadata, JSON-LD, complete sitemap, Vercel config, and legacy phrase scan."
