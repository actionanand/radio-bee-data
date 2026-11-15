# V2 station artwork inventory — complete coverage

**240 / 240 stations now have an image reference.** Image priority is station-specific external `logoUrl`, station-specific data-repo `logoPath`, network logo URL/path, then the built-in RadioBee fallback for failed image loads.

- **169** station-specific original SVG covers reside in `data/v2/assets/artwork/stations/` and are published at `https://actionanand.github.io/radio-bee-data/v2/assets/artwork/stations/<station-id>.svg`. They depict a station name with radio/music/devotional/etc. illustrations and say `RADIOBEE · EDITORIAL COVER`; **they are not official logos**.
- **19** stations use station-specific third-party photos/illustrations, including Michael Jackson, Ilaiyaraaja, Lord Murugan, and MGR & Sivaji together. Remote sources may fail or change.
- **54** network records have third-party brand or publisher/favicon image references. A generic publisher-domain favicon is a candidate, not guaranteed to be an official radio logo.
- Every station without its own image is covered either by its network image or its data-hosted original editorial cover.

To change an image later, edit only `radio-bee-data/data/v2/stations.json` or `networks.json`: use `logoPath` for local PNG/WebP or editorial SVG, or `logoUrl` for public HTTPS. See `docs/BRAND-ARTWORK-SOURCES.md` for details.

## Stations using original RadioBee editorial covers

| Station ID | Station name | Image path |
| --- | --- | --- |
| `etr-de` | European Tamil Radio | `assets/artwork/stations/etr-de.svg` |
| `tamil-murasam-no` | Tamil Murasam Norway | `assets/artwork/stations/tamil-murasam-no.svg` |
| `star-fm-srilanka` | Star FM Sri Lanka | `assets/artwork/stations/star-fm-srilanka.svg` |
| `ar-radio` | AR Radio Kerala | `assets/artwork/stations/ar-radio.svg` |
| `hello-chennai` | Hello FM Chennai | `assets/artwork/stations/hello-chennai.svg` |
| `quran-tamil-kw` | Quran in Tamil | `assets/artwork/stations/quran-tamil-kw.svg` |
| `hand-of-jesus-tamil-in` | Hand of Jesus Tamil | `assets/artwork/stations/hand-of-jesus-tamil-in.svg` |
| `vaanmalar-fm-in` | Vaanmalar FM | `assets/artwork/stations/vaanmalar-fm-in.svg` |
| `namathu-fm-fr` | Namathu FM France | `assets/artwork/stations/namathu-fm-fr.svg` |
| `inbathamil-oli-au` | Inbathamil Oli | `assets/artwork/stations/inbathamil-oli-au.svg` |
| `pollachi-fm` | Pollachi FM | `assets/artwork/stations/pollachi-fm.svg` |
| `inbam-fm` | Inbam FM | `assets/artwork/stations/inbam-fm.svg` |
| `kodai-city-fm` | Kodai City FM | `assets/artwork/stations/kodai-city-fm.svg` |
| `radio-beat-love` | Radio Beat Love | `assets/artwork/stations/radio-beat-love.svg` |
| `radio-beat-extra` | Radio Beat Extra | `assets/artwork/stations/radio-beat-extra.svg` |
| `vaanam-fm-hd` | Vaanam FM HD | `assets/artwork/stations/vaanam-fm-hd.svg` |
| `tamil-80s-hits` | 80s Tamil Hits | `assets/artwork/stations/tamil-80s-hits.svg` |
| `amr-radio-ca` | AMR Radio | `assets/artwork/stations/amr-radio-ca.svg` |
| `thaalam-in` | Thaalam FM India | `assets/artwork/stations/thaalam-in.svg` |
| `ilangai-vaanoli` | Ilangai Vaanoli | `assets/artwork/stations/ilangai-vaanoli.svg` |
| `kumbakonam-city-fm` | Kumbakonam City FM | `assets/artwork/stations/kumbakonam-city-fm.svg` |
| `ada-ceylon-fm` | ADA Ceylon FM | `assets/artwork/stations/ada-ceylon-fm.svg` |
| `vellore-city-fm` | Vellore City FM | `assets/artwork/stations/vellore-city-fm.svg` |
| `divyavani-sanskrit-in` | Divyavani Sanskrit Radio | `assets/artwork/stations/divyavani-sanskrit-in.svg` |
| `sanskrit-bharati-radio-in` | Radio Sanskrit Bharati | `assets/artwork/stations/sanskrit-bharati-radio-in.svg` |
| `radio-paloma-de` | Radio Paloma | `assets/artwork/stations/radio-paloma-de.svg` |
| `radio-norge-no` | Radio Norge | `assets/artwork/stations/radio-norge-no.svg` |
| `realradio-ireland-ie` | RealRadio Ireland | `assets/artwork/stations/realradio-ireland-ie.svg` |
| `nostalgia-fi` | Nostalgia Finland | `assets/artwork/stations/nostalgia-fi.svg` |
| `suomipop-fi` | SuomiPop | `assets/artwork/stations/suomipop-fi.svg` |
| `radio-r-lt` | Radio-R Lithuania | `assets/artwork/stations/radio-r-lt.svg` |
| `znad-wilii-lt` | Znad Wilii | `assets/artwork/stations/znad-wilii-lt.svg` |
| `pop-fm-dk` | Pop FM Denmark | `assets/artwork/stations/pop-fm-dk.svg` |
| `myrock-dk` | MyRock Denmark | `assets/artwork/stations/myrock-dk.svg` |
| `stad-den-haag-nl` | Radio Stad Den Haag | `assets/artwork/stations/stad-den-haag-nl.svg` |
| `slam-nl` | SLAM! Netherlands | `assets/artwork/stations/slam-nl.svg` |
| `kiss-kiss-italia-it` | Radio Kiss Kiss Italia | `assets/artwork/stations/kiss-kiss-italia-it.svg` |
| `exa-fm-mexico` | Exa FM Mexico | `assets/artwork/stations/exa-fm-mexico.svg` |
| `sveriges-radio-p1-se` | Sveriges Radio P1 | `assets/artwork/stations/sveriges-radio-p1-se.svg` |
| `pirate-rock-se` | Pirate Rock Sweden | `assets/artwork/stations/pirate-rock-se.svg` |
| `radio-dla-doroslych-pl` | Radio dla Dorosłych | `assets/artwork/stations/radio-dla-doroslych-pl.svg` |
| `radio-max-hr` | Radio Max Croatia | `assets/artwork/stations/radio-max-hr.svg` |
| `nagham-fm-eg` | Nagham FM Egypt | `assets/artwork/stations/nagham-fm-eg.svg` |
| `radio-roks-ua` | Radio ROKS Ukraine | `assets/artwork/stations/radio-roks-ua.svg` |
| `radio-nrj-ua` | Radio NRJ Ukraine | `assets/artwork/stations/radio-nrj-ua.svg` |
| `radio-jamaica-jm` | Radio Jamaica | `assets/artwork/stations/radio-jamaica-jm.svg` |
| `telemetro-radio-pa` | Telemetro Radio Panama | `assets/artwork/stations/telemetro-radio-pa.svg` |
| `77h-fm-br` | 77H FM Guarujá SP | `assets/artwork/stations/77h-fm-br.svg` |
| `jazz-radio-blues-fr` | Jazz Radio Blues France | `assets/artwork/stations/jazz-radio-blues-fr.svg` |
| `mahakatha-radio-in` | Mahakatha Radio | `assets/artwork/stations/mahakatha-radio-in.svg` |
| `shaiva-lahari-in` | Shaiva Lahari | `assets/artwork/stations/shaiva-lahari-in.svg` |
| `exclusively-backstreet-boys-ae` | Exclusively Backstreet Boys | `assets/artwork/stations/exclusively-backstreet-boys-ae.svg` |
| `exclusively-taylor-swift-ae` | Exclusively Taylor Swift | `assets/artwork/stations/exclusively-taylor-swift-ae.svg` |
| `hello-telugu-in` | Hello Telugu | `assets/artwork/stations/hello-telugu-in.svg` |
| `radio-malayalam-in` | Radio Malayalam | `assets/artwork/stations/radio-malayalam-in.svg` |
| `bol-punjabi-radio-in` | Bol Punjabi Radio | `assets/artwork/stations/bol-punjabi-radio-in.svg` |
| `radio-mast-marathi-in` | Radio Mast Marathi | `assets/artwork/stations/radio-mast-marathi-in.svg` |
| `freefm-uae-sinhala-ae` | Free FM — UAE Sinhala Radio | `assets/artwork/stations/freefm-uae-sinhala-ae.svg` |
| `radio-amr-kannada-in` | Radio AMR Kannada | `assets/artwork/stations/radio-amr-kannada-in.svg` |
| `kannada-hits-in` | Kannada Hits | `assets/artwork/stations/kannada-hits-in.svg` |
| `hindi-gold-radio-in` | Hindi Gold Radio | `assets/artwork/stations/hindi-gold-radio-in.svg` |
| `radio-mirchi-dubai-ae` | Radio Mirchi Dubai (directory listing) | `assets/artwork/stations/radio-mirchi-dubai-ae.svg` |
| `radio-quarantine-kolkata-in` | Radio Quarantine Kolkata | `assets/artwork/stations/radio-quarantine-kolkata-in.svg` |
| `exclusively-justin-bieber-ae` | Exclusively Justin Bieber | `assets/artwork/stations/exclusively-justin-bieber-ae.svg` |
| `exclusively-shakira-ae` | Exclusively Shakira | `assets/artwork/stations/exclusively-shakira-ae.svg` |
| `exclusively-one-direction-ae` | Exclusively One Direction | `assets/artwork/stations/exclusively-one-direction-ae.svg` |
| `exclusively-adele-ae` | Exclusively Adele | `assets/artwork/stations/exclusively-adele-ae.svg` |
| `exclusively-ed-sheeran-ae` | Exclusively Ed Sheeran | `assets/artwork/stations/exclusively-ed-sheeran-ae.svg` |
| `exclusively-westlife-ae` | Exclusively Westlife | `assets/artwork/stations/exclusively-westlife-ae.svg` |
| `stage29-thenral-world-radio` | Thenral World Radio | `assets/artwork/stations/stage29-thenral-world-radio.svg` |
| `stage29-agaram-tamil-radio` | Agaram Tamil Radio | `assets/artwork/stations/stage29-agaram-tamil-radio.svg` |
| `stage29-clubhouse-tamil-90s-2k-vibes` | Clubhouse Tamil 90s & 2K Vibes | `assets/artwork/stations/stage29-clubhouse-tamil-90s-2k-vibes.svg` |
| `stage29-jipmer-radio` | Jipmer Radio | `assets/artwork/stations/stage29-jipmer-radio.svg` |
| `stage29-kodai-aruvi-fm` | Kodai Aruvi FM | `assets/artwork/stations/stage29-kodai-aruvi-fm.svg` |
| `stage29-saamanthi-fm` | Saamanthi FM | `assets/artwork/stations/stage29-saamanthi-fm.svg` |
| `stage29-tamil-mellisai-fm` | Tamil Mellisai FM | `assets/artwork/stations/stage29-tamil-mellisai-fm.svg` |
| `stage29-madhuram-radio` | Madhuram Radio | `assets/artwork/stations/stage29-madhuram-radio.svg` |
| `stage29-tuticorin-radio` | Tuticorin Radio | `assets/artwork/stations/stage29-tuticorin-radio.svg` |
| `stage29-dindigul-radio` | Dindigul Radio | `assets/artwork/stations/stage29-dindigul-radio.svg` |
| `stage29-vaalai-fm` | Vaalai FM | `assets/artwork/stations/stage29-vaalai-fm.svg` |
| `stage29-jayam-fm-7-1` | Jayam FM 7.1 | `assets/artwork/stations/stage29-jayam-fm-7-1.svg` |
| `stage29-retro-tamil-fm` | Retro Tamil FM | `assets/artwork/stations/stage29-retro-tamil-fm.svg` |
| `stage29-oli-saaral-fm` | Oli Saaral FM | `assets/artwork/stations/stage29-oli-saaral-fm.svg` |
| `stage29-trt-tamil-oli` | TRT Tamil Oli | `assets/artwork/stations/stage29-trt-tamil-oli.svg` |
| `stage29-pasumai-90-4-fm` | Pasumai FM 90.4 | `assets/artwork/stations/stage29-pasumai-90-4-fm.svg` |
| `stage29-tiruvannamalai-city-fm` | Tiruvannamalai City FM | `assets/artwork/stations/stage29-tiruvannamalai-city-fm.svg` |
| `stage29-rockfort-radio` | Rockfort Radio | `assets/artwork/stations/stage29-rockfort-radio.svg` |
| `stage29-i-tamil-media-fm` | I Tamil Media FM | `assets/artwork/stations/stage29-i-tamil-media-fm.svg` |
| `stage29-covai-city-fm` | Covai City FM | `assets/artwork/stations/stage29-covai-city-fm.svg` |
| `stage29-ss-tamil-radio` | SS Tamil Radio | `assets/artwork/stations/stage29-ss-tamil-radio.svg` |
| `stage29-rj-tamil-fm` | Rj Tamil FM | `assets/artwork/stations/stage29-rj-tamil-fm.svg` |
| `stage29-100-love-radio` | 100% Love Radio | `assets/artwork/stations/stage29-100-love-radio.svg` |
| `stage29-100-new-songs` | 100% New Songs | `assets/artwork/stations/stage29-100-new-songs.svg` |
| `stage29-100-sad-songs` | 100% Sad Songs | `assets/artwork/stations/stage29-100-sad-songs.svg` |
| `stage29-tamil-ragam` | Tamil Ragam | `assets/artwork/stations/stage29-tamil-ragam.svg` |
| `stage29-airtamil-90s` | AirTamil 90s | `assets/artwork/stations/stage29-airtamil-90s.svg` |
| `stage29-captain-fm` | Captain FM | `assets/artwork/stations/stage29-captain-fm.svg` |
| `stage29-kaadhal-fm` | Kaadhal FM | `assets/artwork/stations/stage29-kaadhal-fm.svg` |
| `stage29-love-songs-tamil` | Love Songs Tamil | `assets/artwork/stations/stage29-love-songs-tamil.svg` |
| `stage29-love-bites-mohan-songs` | Love bites Mohan songs | `assets/artwork/stations/stage29-love-bites-mohan-songs.svg` |
| `stage29-loveda-fm` | LoveDa FM | `assets/artwork/stations/stage29-loveda-fm.svg` |
| `stage29-sad-songs-fm` | Sad Songs FM | `assets/artwork/stations/stage29-sad-songs-fm.svg` |
| `stage29-rocker-radio-tamil-gold-70s-90s` | Rocker Radio Tamil Gold 70s 90s | `assets/artwork/stations/stage29-rocker-radio-tamil-gold-70s-90s.svg` |
| `stage29-deva-radio` | Deva Radio | `assets/artwork/stations/stage29-deva-radio.svg` |
| `stage29-tms-radio` | TMS Radio | `assets/artwork/stations/stage29-tms-radio.svg` |
| `stage29-mano-radio` | Mano Radio | `assets/artwork/stations/stage29-mano-radio.svg` |
| `stage29-top-news-thamizh-fm` | Top News Thamizh FM | `assets/artwork/stations/stage29-top-news-thamizh-fm.svg` |
| `stage29-ms-viswanathan-hits` | MS Viswanathan Hits | `assets/artwork/stations/stage29-ms-viswanathan-hits.svg` |
| `stage29-simbu-hits` | Simbu Hits | `assets/artwork/stations/stage29-simbu-hits.svg` |
| `stage29-yuvan-shankar-raja-ysr` | Yuvan Shankar Raja YSR | `assets/artwork/stations/stage29-yuvan-shankar-raja-ysr.svg` |
| `stage29-na-muthukumar-hits` | Na Muthukumar Hits | `assets/artwork/stations/stage29-na-muthukumar-hits.svg` |
| `stage29-imman-radio` | Imman Radio | `assets/artwork/stations/stage29-imman-radio.svg` |
| `stage29-thaman-hits` | Thaman Hits | `assets/artwork/stations/stage29-thaman-hits.svg` |
| `stage29-jp-chandrababu-hits` | JP Chandrababu Hits | `assets/artwork/stations/stage29-jp-chandrababu-hits.svg` |
| `stage29-vijay-tamil-radio` | Vijay FM Radio | `assets/artwork/stations/stage29-vijay-tamil-radio.svg` |
| `stage29-isai-manam` | Isai Manam | `assets/artwork/stations/stage29-isai-manam.svg` |
| `stage29-shaivam-radio` | Shaivam Radio | `assets/artwork/stations/stage29-shaivam-radio.svg` |
| `stage29-ayngaran-radio` | Ayngaran Radio | `assets/artwork/stations/stage29-ayngaran-radio.svg` |
| `stage29-aadhi-sivan-fm` | Aadhi Sivan FM | `assets/artwork/stations/stage29-aadhi-sivan-fm.svg` |
| `stage29-om-sakthi-fm` | Om Sakthi FM | `assets/artwork/stations/stage29-om-sakthi-fm.svg` |
| `stage29-ss-devotional-radio` | SS Devotional Radio | `assets/artwork/stations/stage29-ss-devotional-radio.svg` |
| `stage29-guru-raghavendra-radio` | Guru Raghavendra Radio | `assets/artwork/stations/stage29-guru-raghavendra-radio.svg` |
| `stage29-vishnu-fm` | Vishnu FM | `assets/artwork/stations/stage29-vishnu-fm.svg` |
| `stage29-saranam-ayyappa-fm` | Saranam Ayyappa FM | `assets/artwork/stations/stage29-saranam-ayyappa-fm.svg` |
| `stage29-sai-fm-radio` | Sai Radio | `assets/artwork/stations/stage29-sai-fm-radio.svg` |
| `stage29-aanmeega-sudar` | Aanmeega Sudar | `assets/artwork/stations/stage29-aanmeega-sudar.svg` |
| `stage29-sivasubramaniyam-ayyappan-songs-fm` | Sivasubramaniyam Ayyappan FM | `assets/artwork/stations/stage29-sivasubramaniyam-ayyappan-songs-fm.svg` |
| `stage29-sree-kurumba-fm` | Sree Kurumba FM | `assets/artwork/stations/stage29-sree-kurumba-fm.svg` |
| `stage29-dharisanam-fm` | Dharisanam FM | `assets/artwork/stations/stage29-dharisanam-fm.svg` |
| `stage29-singampunari-fm` | Singampunari FM | `assets/artwork/stations/stage29-singampunari-fm.svg` |
| `stage29-yazh-news` | Yazh News | `assets/artwork/stations/stage29-yazh-news.svg` |
| `stage29-kalai-fm` | Kalai FM | `assets/artwork/stations/stage29-kalai-fm.svg` |
| `stage29-kanal-music` | Kanal Music | `assets/artwork/stations/stage29-kanal-music.svg` |
| `stage29-kandhakapookkal-radio` | Kandhakapookkal Radio | `assets/artwork/stations/stage29-kandhakapookkal-radio.svg` |
| `stage29-krishna-fm` | Krishna FM | `assets/artwork/stations/stage29-krishna-fm.svg` |
| `stage32-vividh-bharati-bengaluru` | Vividh Bharati Bengaluru | `assets/artwork/stations/stage32-vividh-bharati-bengaluru.svg` |
| `stage32-bhakti-sangeet` | Bhakti Sangeet | `assets/artwork/stations/stage32-bhakti-sangeet.svg` |
| `stage32-ap9-fm` | AP9 FM | `assets/artwork/stations/stage32-ap9-fm.svg` |
| `stage32-air-telugu-online` | Air Telugu (Mintone) | `assets/artwork/stations/stage32-air-telugu-online.svg` |
| `stage32-fm-rainbow-vijayawada` | FM Rainbow Vijayawada | `assets/artwork/stations/stage32-fm-rainbow-vijayawada.svg` |
| `stage32-retro-bollywood-90s` | Radio Retro Bollywood 90s | `assets/artwork/stations/stage32-retro-bollywood-90s.svg` |
| `stage32-sgpc-gurbani` | Live Gurbani — Sri Darbar Sahib (SGPC) | `assets/artwork/stations/stage32-sgpc-gurbani.svg` |
| `stage32-ran-fm` | Ran FM | `assets/artwork/stations/stage32-ran-fm.svg` |
| `stage32-neth-fm` | NETH FM | `assets/artwork/stations/stage32-neth-fm.svg` |
| `stage32-siyatha-fm` | Siyatha FM | `assets/artwork/stations/stage32-siyatha-fm.svg` |
| `stage32-malayalam-bhakthi` | Malayalam Bhakthi Radio | `assets/artwork/stations/stage32-malayalam-bhakthi.svg` |
| `stage32-digital-malayali` | Radio Digital Malayali | `assets/artwork/stations/stage32-digital-malayali.svg` |
| `stage32-radio-choklate` | Radio Choklate 104 FM | `assets/artwork/stations/stage32-radio-choklate.svg` |
| `stage32-dnyaneshwari` | Dnyaneshwari Radio | `assets/artwork/stations/stage32-dnyaneshwari.svg` |
| `stage33-red-fm-calgary` | RED FM Calgary 106.7 | `assets/artwork/stations/stage33-red-fm-calgary.svg` |


## External image backup covers

The following 19 station entries have an additional data-hosted SVG cover that is used if their external artist/devotional photo fails:

- `ilayaraja-radio` — `assets/artwork/stations/ilayaraja-radio.svg`
- `80s80s-michael-jackson-de` — `assets/artwork/stations/80s80s-michael-jackson-de.svg`
- `exclusively-michael-jackson-ae` — `assets/artwork/stations/exclusively-michael-jackson-ae.svg`
- `exclusively-queen-ae` — `assets/artwork/stations/exclusively-queen-ae.svg`
- `stage29-mgr-sivaji-radio` — `assets/artwork/stations/stage29-mgr-sivaji-radio.svg`
- `stage29-spb-online-radio` — `assets/artwork/stations/stage29-spb-online-radio.svg`
- `stage29-harris-jayaraj-radio` — `assets/artwork/stations/stage29-harris-jayaraj-radio.svg`
- `stage29-ks-chitra-radio` — `assets/artwork/stations/stage29-ks-chitra-radio.svg`
- `stage29-kj-yesudas-radio` — `assets/artwork/stations/stage29-kj-yesudas-radio.svg`
- `stage29-s-janaki-radio` — `assets/artwork/stations/stage29-s-janaki-radio.svg`
- `stage29-spb-old-hits-fm` — `assets/artwork/stations/stage29-spb-old-hits-fm.svg`
- `stage29-ilayaraja-voice-fm` — `assets/artwork/stations/stage29-ilayaraja-voice-fm.svg`
- `stage29-santhosh-narayanan-radio` — `assets/artwork/stations/stage29-santhosh-narayanan-radio.svg`
- `stage29-arrahman-classic` — `assets/artwork/stations/stage29-arrahman-classic.svg`
- `stage29-makkal-thilagam-mgr` — `assets/artwork/stations/stage29-makkal-thilagam-mgr.svg`
- `stage29-maestro-hits` — `assets/artwork/stations/stage29-maestro-hits.svg`
- `stage29-arrahman-classic-hits` — `assets/artwork/stations/stage29-arrahman-classic-hits.svg`
- `stage29-rajini-radio` — `assets/artwork/stations/stage29-rajini-radio.svg`
- `stage29-tamil-kadavul-murugan-fm` — `assets/artwork/stations/stage29-tamil-kadavul-murugan-fm.svg`
