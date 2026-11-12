# Stage 29 — Tamil radio expansion (v2.8.0)

The user's 101 supplied references contained 99 distinct station-page slugs. The two repeated links were Pasumai FM 90.4 and Ilayaraja Voice FM. After excluding already-catalogued, repeated, mismatched, HTTP-only and video references, 82 distinct HTTPS streams were probed using FFmpeg and FFprobe in [CI run 43308964538](https://github.com/actionanand/radio-bee-data/actions/runs/43308964538). **81 passed**, **Imai FM timed out and was excluded**.

The update adds 81 stream-bearing candidate stations (+81 URLs) with confirmed audio codecs. Catalogue v2.8.0 has 225 stations, 229 streams and zero discovery-only entries; it preserves all previous 144 stations/148 URLs and leaves v1 unchanged.

Broadcast identity, country metadata, actual in-app playback and copyright permissions require separate verification. All new streams remain unverified and rights-unconfirmed; no recording or redistribution approvals. New genres: {"music":37,"artist-hits":25,"news":2,"devotional":17}.

| Station | Country (provisional) | Codec | Direct HTTPS URL |
|---|---|---|---|
| Thenral World Radio | DE | mp3 | https://thenralw.radioca.st/LiveStream |
| Agaram Tamil Radio | CA | mp3 | https://stream.zeno.fm/ynuoddjfosluv |
| Clubhouse Tamil 90s & 2K Vibes | IN | mp3 | https://liveradio.swaggerbeat.com:8100/stream |
| Jipmer Radio | IN | hls | https://d1d1ao70vmf9ux.cloudfront.net/jipmer.m3u8 |
| Kodai Aruvi FM | IN | aac | https://cast6.asurahosting.com/proxy/kodaiaruvifm/stream |
| Saamanthi FM | IN | aac | https://cast6.asurahosting.com/proxy/saamanthifm/stream |
| Tamil Mellisai FM | IN | aac | https://stream.zeno.fm/e9hsbbbey4zuv |
| Madhuram Radio | IN | aac | https://cast6.asurahosting.com/proxy/madhuramradio/stream |
| Tuticorin Radio | IN | aac | https://cast6.asurahosting.com/proxy/tuticorinradio/stream |
| Dindigul Radio | IN | aac | https://cast6.asurahosting.com/proxy/dglradio/stream |
| Vaalai FM | IN | aac | https://cast6.asurahosting.com/proxy/vaalaifm/stream |
| Jayam FM 7.1 | IN | mp3 | https://jayamfm-prabak78.radioca.st/stream |
| Retro Tamil FM | IN | aac | https://cast6.asurahosting.com/proxy/retrotamil/stream |
| Oli Saaral FM | IN | aac | https://cast6.asurahosting.com/proxy/olisaaral/stream |
| TRT Tamil Oli | FR | mp3 | https://radio13.pro-fhi.net:19236/stream.mp3 |
| Pasumai FM 90.4 | IN | aac | https://cast6.asurahosting.com/proxy/pasumaifm/stream |
| Tiruvannamalai City FM | IN | aac | https://cast6.asurahosting.com/proxy/tirucityfm/stream |
| Rockfort Radio | IN | aac | https://cast6.asurahosting.com/proxy/rockfortradio/stream |
| I Tamil Media FM | IN | mp3 | https://streams.radio.co/s937ac5492/listen |
| Covai City FM | IN | aac | https://cast6.asurahosting.com/proxy/ccfm/stream |
| SS Tamil Radio | IN | aac | https://cast6.asurahosting.com/proxy/sstamilradio/stream |
| Rj Tamil FM | IN | aac | https://cast6.asurahosting.com/proxy/rjtamil/stream |
| 100% Love Radio | IN | mp3 | https://stream.zeno.fm/48kgynhuutzuv |
| 100% New Songs | IN | mp3 | https://stream.zeno.fm/8hx0ftvm0wzuv |
| 100% Sad Songs | IN | mp3 | https://stream.zeno.fm/ven997gqvtzuv |
| Tamil Ragam | IN | mp3 | https://cast4.asurahosting.com/proxy/neville/stream |
| AirTamil 90s | IN | mp3 | https://stream.zeno.fm/06ar0cnafwzuv |
| Captain FM | IN | mp3 | https://stream.zeno.fm/ae0r72huttzuv |
| Kaadhal FM | IN | mp3 | https://stream.zeno.fm/sc3uzmkd0xhvv |
| Love Songs Tamil | IN | mp3 | https://stream.zeno.fm/027dtnhuutzuv |
| Love bites Mohan songs | IN | mp3 | https://stream.zeno.fm/uhgvxy3yr2nuv |
| LoveDa FM | IN | mp3 | https://stream.zeno.fm/nmdrk7ah7yzuv |
| Sad Songs FM | IN | mp3 | https://stream.zeno.fm/xbmq57gqvtzuv |
| Rocker Radio Tamil Gold 70s 90s | IN | mp3 | https://stream.zenolive.com/sr40tbbq2nhvv |
| MGR & Sivaji Radio | IN | mp3 | https://stream.zeno.fm/pq4yq4qri9yvv |
| SPB Online Radio | IN | mp3 | https://stream-159.zeno.fm/9adkzdcqi4jvv |
| Harris Jayaraj Radio | IN | mp3 | https://stream-158.zeno.fm/0bhsthssutzuv |
| KS Chitra Radio | IN | aac | https://stream.zeno.fm/aad4e51qz7zuv |
| Deva Radio | IN | mp3 | https://stream.zeno.fm/ijpae65onobuv |
| K. J. Yesudas Radio | IN | mp3 | https://stream.zeno.fm/trtwuyqdmrgtv |
| TMS Radio | IN | mp3 | https://stream.zeno.fm/qvonezatdxytv |
| S. Janaki Radio | IN | mp3 | https://stream.zeno.fm/nnhhfe4bv1uuv |
| Mano Radio | IN | aac | https://stream.zeno.fm/maokuvdskhnuv |
| SPB Old Hits | IN | mp3 | https://stream.zeno.fm/lgukkevrihmvv |
| IlayaRaja Voice | IN | mp3 | https://stream.zeno.fm/qfd4vokvu3dvv |
| Top News Thamizh FM | IN | mp3 | https://stream.zeno.fm/0z336oe9ivauv |
| Santhosh Narayanan Radio | IN | mp3 | https://stream.zeno.fm/wkqvzsg1238uv |
| ARRahman Classic | IN | mp3 | https://stream.zeno.fm/ttisib8fr6kuv |
| Makkal Thilagam MGR | IN | mp3 | https://stream.zeno.fm/qqeac1w55qzuv |
| MS Viswanathan Hits | IN | mp3 | https://stream.zeno.fm/mxihfpmksk8uv |
| Simbu Hits | IN | mp3 | https://stream.zeno.fm/01p3nvuq538uv |
| Maestro Hits | IN | mp3 | https://stream.zenolive.com/zngnvwy9bm8uv |
| Yuvan Shankar Raja YSR | IN | mp3 | https://stream.zeno.fm/bni50mpqxjeuv |
| ARRahman Classic Hits | IN | mp3 | https://stream.zeno.fm/j3cntml3iulvv |
| Rajini Radio | IN | mp3 | https://stream.zeno.fm/g20bs7hu0uhvv |
| Na Muthukumar Hits | IN | mp3 | https://stream-172.zeno.fm/v7d1g1hvfy8uv? |
| Imman Radio | IN | mp3 | https://stream.zeno.fm/6apkrxlnxudtv |
| Thaman Hits | IN | mp3 | https://stream.zenolive.com/tqhegaztqfhvv |
| JP Chandrababu Hits | IN | mp3 | https://stream.zeno.fm/knuruqv62d0uv |
| Vijay FM Radio | IN | mp3 | https://vijayfm-prabak78.radioca.st/stream |
| Isai Manam | IN | mp3 | https://stream.zeno.fm/iqpqyzwsinxtv |
| Tamil Kadavul Murugan | IN | aac | https://cast6.asurahosting.com/proxy/tkmradio/stream |
| Shaivam Radio | IN | mp3 | https://samcloud.spacial.com/api/listen?sid=107848 |
| Ayngaran Radio | IN | aac | https://cast6.asurahosting.com/proxy/ayngaranradio/stream |
| Aadhi Sivan FM | IN | aac | https://cast6.asurahosting.com/proxy/aadhisivam/stream |
| Om Sakthi FM | IN | aac | https://cast6.asurahosting.com/proxy/omsakthifm/stream |
| SS Devotional Radio | IN | aac | https://cast6.asurahosting.com/proxy/ssdevotional/stream |
| Guru Raghavendra Radio | IN | mp3 | https://cast5.asurahosting.com/proxy/gururayar/stream |
| Vishnu FM | IN | aac | https://cast6.asurahosting.com/proxy/vishnufm/stream |
| Saranam Ayyappa FM | IN | aac | https://cast6.asurahosting.com/proxy/saranamayyappa/stream |
| Sai Radio | IN | aac | https://cast6.asurahosting.com/proxy/sairadio/stream |
| Aanmeega Sudar | IN | mp3 | https://stream.zeno.fm/ymkr7th4f2zuv |
| Sivasubramaniyam Ayyappan FM | IN | mp3 | https://stream.zeno.fm/zesshz81ry8uv |
| Sree Kurumba FM | IN | mp3 | https://stream.zeno.fm/b35ge5nuv7guv |
| Dharisanam FM | IN | mp3 | https://stream.zeno.fm/b741tfumhm8uv |
| Singampunari FM | IN | mp3 | https://stream.zeno.fm/imeknggtwattv |
| Yazh News | LK | mp3 | https://stream.zeno.fm/zek2rcdrua0uv |
| Kalai FM | IN | mp3 | https://stream.zeno.fm/2vghnwshsqzuv |
| Kanal Music | IN | mp3 | https://stream.zeno.fm/yy5bpv2vk2zuv |
| Kandhakapookkal Radio | IN | mp3 | https://stream.zenolive.com/050irbonp6auv |
| Krishna FM | IN | mp3 | https://stream.zeno.fm/gdpufetpuy8uv |
