# Original RadioBee illustrations, MIT licensed. No broadcaster marks or copied imagery.
# Optional editorial authoring tool; no dependencies and never invoked by CI/build.
param([switch]$Overwrite)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$palettes = [ordered]@{
    'akashvani' = @('#143A58', '#297FA6', '#8DE3E8')
    'hello-fm' = @('#46264F', '#9861A8', '#F6C6FA')
    'suryan-in' = @('#4B3019', '#B86B29', '#FFD88A')
    'sooriyan-lk' = @('#233C32', '#438D6C', '#B9EDCB')
    'mirchi' = @('#492B3A', '#A34C71', '#F8BDD3')
    'radio-city' = @('#213854', '#4E74B7', '#BCD8FF')
    'big-fm' = @('#423A20', '#92803A', '#F1E7A3')
    'red-fm' = @('#492C29', '#AC6259', '#FFD5BD')
    'shaivam' = @('#293A4C', '#607E98', '#D8E8F7')
    'star-fm-lk' = @('#30314F', '#7776B4', '#DDDAFF')
    'boom-tamil' = @('#234444', '#498D89', '#BEF3E6')
}
function Color($hex) { [Drawing.ColorTranslator]::FromHtml($hex) }
function RoundPath([single]$x,[single]$y,[single]$w,[single]$h,[single]$r) {
    $p = [Drawing.Drawing2D.GraphicsPath]::new()
    $d = $r * 2
    $p.AddArc($x,$y,$d,$d,180,90); $p.AddArc(($x+$w-$d),$y,$d,$d,270,90)
    $p.AddArc(($x+$w-$d),($y+$h-$d),$d,$d,0,90); $p.AddArc($x,($y+$h-$d),$d,$d,90,90)
    $p.CloseFigure(); return ,$p
}
$folder = Join-Path $root 'data/v1/assets/logos/networks'
New-Item -ItemType Directory -Path $folder -Force | Out-Null
# Reject existing assets before generating anything.
foreach ($id in $palettes.Keys) {
    if ((Test-Path -LiteralPath (Join-Path $folder "$id-radio.png")) -and -not $Overwrite) {
        throw "Asset exists for $id; use -Overwrite for an intentional regeneration."
    }
}
$inventory = @()
foreach ($id in $palettes.Keys) {
    $colors = $palettes[$id]
    $bitmap = [Drawing.Bitmap]::new(512,512)
    $g = [Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([Drawing.Color]::Transparent)
    $brushes = [Collections.Generic.List[IDisposable]]::new()
    try {
        $back = [Drawing.Drawing2D.LinearGradientBrush]::new([Drawing.Point]::new(70,50),[Drawing.Point]::new(440,460),(Color $colors[1]),(Color $colors[0]))
        $brushes.Add($back); $g.FillEllipse($back,28,28,456,456)
        $light = [Drawing.SolidBrush]::new((Color $colors[2])); $brushes.Add($light)
        $white = [Drawing.SolidBrush]::new((Color '#F0F5FA')); $brushes.Add($white)
        $dark = [Drawing.SolidBrush]::new((Color $colors[0])); $brushes.Add($dark)
        $shadow = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(65,0,0,0)); $brushes.Add($shadow)
        $p = RoundPath 102 216 316 186 36; $g.FillPath($shadow,$p); $p.Dispose()
        $antenna = [Drawing.Pen]::new((Color $colors[2]),10); $antenna.StartCap='Round'; $antenna.EndCap='Round'; $brushes.Add($antenna)
        $g.DrawLine($antenna,160,205,213,119)
        $wave = [Drawing.Pen]::new((Color $colors[2]),8); $wave.StartCap='Round'; $wave.EndCap='Round'; $brushes.Add($wave)
        $g.DrawArc($wave,205,111,90,90,272,67); $g.DrawArc($wave,187,91,130,130,272,67)
        $p = RoundPath 94 202 316 186 36; $g.FillPath($white,$p); $p.Dispose()
        $p = RoundPath 115 224 178 142 22; $g.FillPath($dark,$p); $p.Dispose()
        $grille = [Drawing.Pen]::new((Color $colors[2]),5); $grille.StartCap='Round'; $grille.EndCap='Round'; $brushes.Add($grille)
        foreach ($y in 246,262,278,294,310,326,342) { $g.DrawLine($grille,140,$y,268,$y) }
        $g.FillEllipse($dark,314,234,72,72); $g.FillEllipse($light,325,245,50,50)
        $needle = [Drawing.Pen]::new((Color $colors[0]),5); $needle.EndCap='Round'; $brushes.Add($needle)
        $g.DrawLine($needle,350,270,362,256)
        $p = RoundPath 315 325 70 17 8; $g.FillPath($dark,$p); $p.Dispose()
        $g.FillEllipse($light,325,329,9,9)
        $file = Join-Path $folder "$id-radio.png"
        $bitmap.Save($file,[Drawing.Imaging.ImageFormat]::Png)
    } finally { $g.Dispose(); $bitmap.Dispose(); foreach ($b in $brushes) { $b.Dispose() } }
    # Decode the entire raster through the platform codec, not only its header.
    $decoded = [Drawing.Bitmap]::new($file)
    try {
        if ($decoded.Width -ne 512 -or $decoded.Height -ne 512) { throw 'Invalid dimensions' }
        for ($y=0;$y -lt 512;$y++) { for ($x=0;$x -lt 512;$x++) { $null=$decoded.GetPixel($x,$y) } }
    } finally { $decoded.Dispose() }
    $size = (Get-Item -LiteralPath $file).Length
    if ($size -gt 262144) { throw 'Asset exceeds size contract' }
    $inventory += [pscustomobject][ordered]@{networkId=$id; path="assets/logos/networks/$id-radio.png"; bytes=$size; width=512; height=512; officialBranding=$false; usageBasis='Original unbranded RadioBee illustration; MIT'; generator='scripts/create-radio-artwork.ps1'; rasterDecode='System.Drawing full pixel traversal'; palette=$colors}
}
New-Item -ItemType Directory -Path (Join-Path $root 'docs/stage12') -Force | Out-Null
$inventory | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $root 'docs/stage12/artwork.json') -Encoding utf8NoBOM
$inventory | Select-Object networkId,bytes,width,height | Format-Table
