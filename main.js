// auto-youtube-music
'use strict'

const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')
const wget = require('node-wget')
const unzip = require('unzip')

const setting = require('./setting.json')

let youtubedlUrl = setting.youtubedlExe
let youtubedl = "youtube-dl.exe"
let ffmepgUrl = setting.ffmpegExe
let ffmpeg = "ffmpeg.exe"
let ffprobe = "ffprobe.exe"


if (process.platform === "linux") {
    youtubedlUrl = setting.youtubedlLinux
    youtubedl = "youtube-dl"
    ffmpeg = "ffmpeg"
    ffprobe = "ffprobe"
}

let commandOptions = {'nc': false, 'ff': false, 'h':false, 'nm': false};
let playlist = false;
let modifyOptions = '';

(function(){

    console.log('\u001b[36m******************************************************************\u001b[0m\n'+
        ' \u001b[41m \> \u001b[0m Auto You\u001b[41mTube\u001b[0m Music Downloader\n'+
        '\u001b[36m******************************************************************\u001b[0m\n')

    process.argv.forEach(function(url){

        if (url.substr(0, 4, url == "http")) {
            playlist = url

        } else if (url == "-h") {
            commandOptions.h = true
            commandlineOptions()
            process.exit()

        } else if (url == "-nc") {
            commandOptions.nc = true

        } else if (url == "-nm") {
            commandOptions.nm = true
        }
        
        return false;

    })

    if (!playlist) {
        error('Missing Donwload URL');
        return;
    }

    msg('Download URL: ' + playlist);

    if (commandOptions.nc && isExistsFile('youtube-dl.exe')){
        msg('Enable Skip UpdateCheck Option ...', 'yellow')
        download()
    } else {
        updateCheck()
        download()
    }

})();

function downloadFFmpeg () {

    const filename = ffmepg.split('/').pop();
    const directory = path.basename(filename, path.extname(filename))

    msg(directory.toString())

    fs.createReadStream('./lib/' + filename).pipe(unzip.Extract({ path: './lib/' }))

    msg('Copying ffmpeg.exe ...')
    fs.copyFileSync('./lib/' + directory + '/bin/ffmpeg.exe', './lib/ffmpeg.exe')

    msg('Copying ffprobe.exe ...')
    fs.copyFileSync('./lib/' + directory + '/bin/ffprobe.exe', './lib/ffprobe.exe')

    if (isExistsFile('ffprobe.exe') && isExistsFile('ffmpeg.exe')) {
        msg('Found ffmepg & ffprobe.exe')
        download()
    }

    return false;

}

function updateCheck () {

    msg('Checking ' + youtubedl + ' ...')

    if (!isExistsFile(youtubedl)) {
        msg('Missing youtube-dl', 'yellow')
        msg('Downloading ' + youtubedl + ' ...', 'blue')
        wget({url:youtubedlUrl, dest: './lib/'})

    } else {
        msg('Found ' + youtubedl)
        msg('Checking update ' + youtubedl + ' ...', 'yellow')

        let date = new Date()

        if (parseInt(fs.statSync('./lib/' + youtubedl).ctimeMs/1000) < parseInt(date.getTime/1000)-(2*24*60*60)) {
            msg(youtubedl + ' is Too old. try update ' + youtubedl + ' ...', 'yellow')
            wget({url:youtubedlUrl, dest: './lib/'})
        } else {
            msg(youtubedl + ' is Fresh. using library ...', 'yellow')
        }

        return;
        
    }

    if (!commandOptions.ffmpeg) {
        return;
    }

    if (!isExistsFile(ffmpeg) || !isExistsFile(ffprobe)) {
        msg('Not found ' + ffmpeg + ' or ' + ffprobe, 'yellow')
        msg('Downloading ' + ffmpeg + ' package ...', 'blue')

        wget({url:ffmepgUrl, dest: './lib/'}, downloadFFmpeg)
        downloadFFmpeg()

    } else {
        msg('Found ' + ffmpeg + ' & ' + ffprobe)
    }

    return;

}

function download () {

    if (process.argv[2]) {
        msg('Starting Download ...')
    } else {
        return;
    }

    msg('youtube-dl Options: ' + setting.downloadQuality)

    let downloadOptions = [
        setting.downloadQuality,
        "-x",
        "--audio-format",
        "best",
        "-o",
        setting.downloadFolder + setting.renameOptions
    ]

    // not copy the mtime
    if (commandlineOptions.nm) {
        downloadOptions.push('--no-mtime')
    }

    downloadOptions.push(playlist)

    let proc = childProcess.spawn(youtubedl, downloadOptions,
        { cwd: __dirname + '/lib', stdio: 'inherit'}
    )

}

function isExistsFile (file) {
    if (fs.existsSync('./lib/' + file)) {
        return true;
    } else {
        return false;
    }
}

function commandlineOptions () {

    const argv = [
        {
            name: '-nc',
            description :'Skip library software update',
            example: "'main.js -nc {someYouTubeURL}'"
        },
        {
            name: '-ff',
            description :'check exists ffmpeg. for youtube-dl uses ffmpeg option',
            example: "'main.js --ff {someYouTubeURL}'"
        },
        {
            name: '-h',
            description :'this.',
            example: "'main.js -h'"
        }
    ]

    msg("Usage: aym.(bat|sh) https://www.youtube.com/watch?v=6Olt-ZtV_CE [options]", 'white', false)
    msg("Usage: aym.(bat|sh) https://music.youtube.com/playlist?list=OLAK5uy_kaI5BH61jKTr2m6Ys8YuxuCYMNGrdAaEI [options]", 'white', false)
    msg("Options:", 'white', false)
    argv.forEach(function(cmd){
        msg('  '+cmd.name + '\t\t' + cmd.description, 'white', false)
    })

    return argv;

}

function msg (msg, color=null, head=true) {

    let msgHeader = ''

    if (head) {
        msgHeader = '[AYM] '
    }

    const pallet = {
        "black": '\u001b[30m',
        "red": '\u001b[31m',
        "green": '\u001b[32m',
        "yellow": '\u001b[33m',
        "blue": '\u001b[34m',
        "purple": '\u001b[35m',
        "cyan": '\u001b[36m',
        "white": '\u001b[37m',
        "reset": '\u001b[0m'
    }

    if (color !== null) {
        console.log(pallet[color] + msgHeader + msg + pallet['reset'])
    } else {
        console.log(pallet['green'] + msgHeader + msg + pallet['reset'])
    }
    
}

function error (err) {
    msg('[ERROR] + ' + err, 'red')
}
