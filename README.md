# Auto Youtube Music

youtube-dl front end for Specialized YouTube Music.

[![Build Status](https://travis-ci.org/japankun/auto-youtube-music.svg?branch=master)](https://travis-ci.org/japankun/auto-youtube-music)

## Features

- Auto Update youtube-dl
- Enhanced ffmpeg Options [Experimentally]
- Delete movie, only save Music file

## Usage

### install

```
git https://github.com/japankun/auto-youtube-music.git
cd auto-youtube-music
npm install
```

#### single track

```aym.bat https://www.youtube.com/watch?v=6Olt-ZtV_CE```

#### playlist
```aym.bat https://music.youtube.com/playlist?list=OLAK5uy_kaI5BH61jKTr2m6Ys8YuxuCYMNGrdAaEI```

___*include escape charactor(s) URL is not support a normaly eg:(&)___

```aym.bat https://music.youtube.com/watch?v=3BR7-AzE2dQ&list=OLAK5uy_kaI5BH61jKTr2m6Ys8YuxuCYMNGrdAaEI```

but it enclosed URL double quotation (") is work fine.
it limit of windows command prompt application.

```aym.bat "https://music.youtube.com/watch?v=3BR7-AzE2dQ&list=OLAK5uy_kaI5BH61jKTr2m6Ys8YuxuCYMNGrdAaEI"```

#### Search Mode

sometimes do not want to browse youtube search page. you can use this awesome option
```aym.bat -q "What A Wonderful World"

******************************************************************
  >  Auto YouTube Music Downloader
******************************************************************

[AYM]Search Mode - Keyword:What a Wonderful World
A3yCcXgbKrE     Louis Armstrong - What A Wonderful World (Lyrics)
CWzrABouyeE     Louis Armstrong - What a wonderful world  ( 1967 )
2nGKqH26xlg     Louis Armstrong - What A Wonderful World (Original Spoken Intro Version) ABC Records 1967, 1970
ddLd0QRf7Vg     What a Wonderful World | Playing For Change | Song Around The World
XBIYD3h1olY     What A Wonderful World x Can't Help Falling In Love (mashup cover) Reneé Domi

R0xoMhCT-7A     OFFICIAL  Israel "IZ" Kamakawiwoʻole - "What A Wonderful World" Video
ltVOXz4mxOo     What a Wonderful World
RstOpZi54L8     Rod Stewart - What A Wonderful World
FNp8329unFU     Jackie Evancho - What a Wonderful World (from Music of the Movies)
qdp1LfUkaY4     Okaïdi & Playing for Change : "What a Wonderful World"
odaJvMzycDg     WHAT A WONDERFUL WORLD. - Louie Armstrong Cover by Abby Ward
BlDgQOd3p-0     Louis Armstrong "What A Wonderful World" LIVE 1970 (Reelin' In The Years Arch

9zCwOmt8GwQ     SKY-HI / What a Wonderful World!! (Prod. SKY-HI) -Music Video-
Mw_tC8vfdUE     THE ROCK SINGING - WHAT A WONDERFUL WORLD IN JOURNEY 2 THE MYSTERIOUS ISLAND

nHuI_SnqlWE     Jon Batiste Performs "What A Wonderful World"
V1bFr2SWP1I     OFFICIAL Somewhere over the Rainbow - Israel "IZ" Kamakawiwoʻole
4zxQ9_axkGo     Madagascar 1 - What a Wonderful World
0ssvlzGY_bs     Single Mom Stacey Solomon Sings What A Wonderful World - The X Factor
m5TwT69i1lU     Louis Armstrong  What A Wonderful World
rPuW7T25Yuw     Madagascar (2005) - What a Wonderful World Scene (8/10) | Movieclips
TF_0qwUlQ14     Kaitlyn Maher - What A Wonderful World (Louis Armstrong) - Semi Final America

76x2pVGsaME     Rod Stewart - What A Wonderful World ft. Stevie Wonder
61zsUcnKAKs     Michael Buble - What A Wonderful World
21LGv8Cf0us     Louis Armstrong - What A Wonderful World [HQ]
7CedY_9Zl24     The Walls Group Jesus Oh What A Wonderful Child World Premiere Video
```


#### Direct VideoId Mode

Seach → Direct VideoId Mode → Fun :)

```aym.bat -v 07mz-EBnR20```

## Disclaimer

- this program is not for piracy.
- Great NEWS! YOU might be attention traffic of YouTube. keep slow ___*ーcaptain slow*___
