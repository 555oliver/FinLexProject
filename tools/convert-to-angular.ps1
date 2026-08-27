$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root 'index.html'
$html = [System.IO.File]::ReadAllText($sourcePath, [System.Text.Encoding]::UTF8)

function Write-Utf8([string]$relativePath, [string]$content) {
  $path = Join-Path $root $relativePath
  $directory = Split-Path -Parent $path
  [System.IO.Directory]::CreateDirectory($directory) | Out-Null
  [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
}

function Between([string]$start, [string]$end) {
  $startIndex = $html.IndexOf($start)
  if ($startIndex -lt 0) { throw "No se encontró el inicio: $start" }
  $endIndex = $html.IndexOf($end, $startIndex + $start.Length)
  if ($endIndex -lt 0) { throw "No se encontró el final: $end" }
  return $html.Substring($startIndex, $endIndex - $startIndex)
}

function Clean-Template([string]$fragment, [string]$pageName) {
  $fragment = [regex]::Replace($fragment, '(?s)^.*?<section id="page-' + [regex]::Escape($pageName) + '"[^>]*>', '')
  $fragment = [regex]::Replace($fragment, '(?s)\s*</section>\s*$','')
  $fragment = $fragment -replace '\sclass="hidden"', ''
  $fragment = [regex]::Replace($fragment, '\s+onmouseover="[^"]*"', '')
  $fragment = [regex]::Replace($fragment, '\s+onmouseout="[^"]*"', '')
  $fragment = [regex]::Replace($fragment, '\s+onsubmit="[^"]*"', '')
  $fragment = [regex]::Replace($fragment, '\s+onclick="showPublicPage\(''([^'']+)''\)"', ' routerLink="/$1"')
  $fragment = [regex]::Replace($fragment, '\s+onclick="enterPortal\(\)"', ' routerLink="/portal"')
  $fragment = [regex]::Replace($fragment, '\s+onclick="[^"]*"', '')
  return $fragment.Trim()
}

$style = [regex]::Match($html, '(?s)<style>(.*?)</style>').Groups[1].Value
$style = $style -replace '\.hidden\s*\{\s*display:\s*none\s*!important;?\s*\}', ''
$style += @"

.portal-page { min-height: 72vh; padding-top: 84px; background: var(--offwhite); }
.portal-page .login-wrap { margin-top: 56px; }
.portal-page .login-wrap h1 { font-family: var(--font-serif); color: var(--navy); margin: 18px 0 8px; }
.portal-page .login-wrap > p { color: var(--gray); margin-bottom: 28px; }
.portal-page .login-wrap form { display: grid; gap: 18px; }
.portal-page .login-wrap .btn-gold { width: 100%; }
.portal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 36px 0; }
.form-error { color: #a23b3b; font-size: 13px; }
@media (max-width: 800px) { .portal-grid { grid-template-columns: 1fr; } }
"@
Write-Utf8 'src/styles.css' $style

$pages = @(
  @{ Name='home'; Class='HomePageComponent'; Start='<!-- HOME -->'; End='<!-- SERVICES DETAIL -->' },
  @{ Name='services'; Class='ServicesPageComponent'; Start='<!-- SERVICES DETAIL -->'; End='<!-- PRODUCTS -->' },
  @{ Name='products'; Class='ProductsPageComponent'; Start='<!-- PRODUCTS -->'; End='<!-- ABOUT -->' },
  @{ Name='about'; Class='AboutPageComponent'; Start='<!-- ABOUT -->'; End='<!-- TESTIMONIALS -->' },
  @{ Name='testimonials'; Class='TestimonialsPageComponent'; Start='<!-- TESTIMONIALS -->'; End='<!-- CONTACT -->' },
  @{ Name='contact'; Class='ContactPageComponent'; Start='<!-- CONTACT -->'; End='<!-- LEGAL -->' },
  @{ Name='legal'; Class='LegalPageComponent'; Start='<!-- LEGAL -->'; End='<!-- CTA Section -->' }
)

foreach ($page in $pages) {
  $template = Clean-Template (Between $page.Start $page.End) $page.Name
  Write-Utf8 "src/app/pages/$($page.Name)/$($page.Name).component.html" $template
  $ts = @"
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-$($page.Name)-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './$($page.Name).component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class $($page.Class) {}
"@
  Write-Utf8 "src/app/pages/$($page.Name)/$($page.Name).component.ts" $ts
}

$header = Between '<!-- ==================== HEADER ==================== -->' '<!-- ==================== PUBLIC PAGES ==================== -->'
$header = [regex]::Replace($header, '(?s)^.*?<header', '<header')
$header = $header -replace ' onclick="showPublicPage\(''home''\)"', ' routerLink="/inicio"'
$header = [regex]::Replace($header, '<a class="nav-link active" onclick="showPublicPage\(''([^'']+)''\)">', '<a class="nav-link" routerLink="/inicio" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">')
$header = [regex]::Replace($header, '<a class="nav-link" onclick="showPublicPage\(''([^'']+)''\)">', '<a class="nav-link" routerLink="/$1" routerLinkActive="active">')
$header = $header -replace ' onclick="enterPortal\(\)"', ' routerLink="/portal"'
$header = $header -replace ' onclick="showPublicPage\(''contact''\)"', ' routerLink="/contact"'
$header = $header -replace ' onclick="toggleMobileMenu\(\)"', ' (click)="toggleMenu()"'
$header = [regex]::Replace($header, 'onclick="toggleMobileMenu\(\);showPublicPage\(''([^'']+)''\)"', '(click)="closeMenu()" routerLink="/$1"')
$header = $header -replace 'routerLink="/home"', 'routerLink="/inicio"'
$header = $header -replace '<a class="nav-link active" routerLink="/inicio">', '<a class="nav-link" routerLink="/inicio" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">'
$header = $header -replace '<div class="mobile-nav" id="mobileNav" \[class.active\]="menuOpen">', '<div class="mobile-nav" id="mobileNav" [class.open]="menuOpen">'
$header = $header -replace 'onclick="toggleMobileMenu\(\);enterPortal\(\)"', '(click)="closeMenu()" routerLink="/portal"'
$header = $header -replace '<div class="mobile-nav" id="mobileNav">', '<div class="mobile-nav" id="mobileNav" [class.active]="menuOpen">'
Write-Utf8 'src/app/layout/header/header.component.html' $header.Trim()

$footer = Between '<!-- CTA Section -->' '<!-- ==================== CLIENT PORTAL ==================== -->'
$footer = [regex]::Replace($footer, '(?s)</div>\s*$','')
$footer = [regex]::Replace($footer, '\s+onclick="showPublicPage\(''([^'']+)''\)"', ' routerLink="/$1"')
$footer = [regex]::Replace($footer, '\s+onclick="enterPortal\(\)"', ' routerLink="/portal"')
Write-Utf8 'src/app/layout/footer/footer.component.html' $footer.Trim()
