// auto-youtube-music
'use strict'

const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')
const wget = require('node-wget')
const unzip = require('unzip')
const request = require('request')

const setting = require('./setting.json')
const isWindows = (process.platform === 'win32')
const youtubedlExpires = 7*24*60*60

let lib = 
{
    'youtubedlUrl': setting.ytDlLinux,
    'youtubedl': "youtube-dl",
    'ffmpegUrl': "",
    'ffmpeg': "ffmpeg",
    'ffprobe': "ffprobe"
}

if (isWindows) {
    lib.youtubedlUrl = setting.ytDlExe
    lib.youtubedl = "youtube-dl.exe"
    lib.ffmepgUrl = setting.ffmpegExe
    lib.ffmpeg = "ffmpeg.exe"
    lib.ffprobe = "ffprobe.exe"
}

let commandOptions = {'nc': false, 'ff': false, 'h':false, 'nm': false, 'q': false, 'v': false};
let playlist = false;
let modifyOptions = '';
let queryString = '';

(function(){

    console.log('\u001b[36m******************************************************************\u001b[0m\n'+
        ' \u001b[41m \> \u001b[0m Auto You\u001b[41mTube\u001b[0m Music Downloader\n'+
        '\u001b[36m******************************************************************\u001b[0m\n')

    process.argv.forEach(argvHandler)

    // Search Mode
    if (commandOptions.q && 0 < commandOptions.q.length) {
        msg('Search Mode - Keyword:' + commandOptions.q);
        search(commandOptions.q)
        return;
    }

    // Direct Download Mode
    if (commandOptions.v && 0 < commandOptions.v.length) {

        msg('Direct Download Mode')

        if (commandOptions.v == '')
            err('Missing videoId')

        playlist = "http://www.youtube.com/watch?v=" + commandOptions.v

    }

    if (!playlist) {
        error('Missing Donwload URL');
        return;
    }

    msg('Download URL: ' + playlist);

    main()

})();

function main () {

    if (commandOptions.nc && isExistsFile(lib.youtubedl)){
        msg('Enable Skip UpdateCheck Option ...', 'yellow')
        download()
    } else {
        updateCheck()
    }

}

function downloadFFmpeg () {

    const filename = ffmepg.split('/').pop();
    const directory = path.basename(filename, path.extname(filename))

    msg(directory.toString())

    fs.createReadStream('./lib/' + filename).pipe(unzip.Extract({ path: './lib/' }))

    msg('Copying ' + lib.ffmpeg + ' ...')
    fs.copyFileSync('./lib/' + directory + '/bin/' + lib.ffmpeg, './lib/' + lib.ffmpeg)

    msg('Copying ' + lib.ffprobe + ' ...')
    fs.copyFileSync('./lib/' + directory + '/bin/' + lib.ffprobe, './lib/' + lib.ffprobe)

    if (isExistsFile(lib.ffmpeg) && isExistsFile(lib.ffprobe)) {
        msg('Found ' + lib.ffmpeg + ' & ' + lib.ffprobe)
        download()
    }

    return false;

}

function updateCheck () {

    msg('Checking ' + lib.youtubedl + ' ...')

    if (!isExistsFile(lib.youtubedl)) {
        msg('Missing ' + lib.youtubedl, 'yellow')
        msg('Downloading ' + lib.youtubedl + ' ...', 'blue')
        wget({"url":lib.youtubedlUrl, "dest": './lib/'}, function (data, err) {
            setTimeout(download, 1000)
            fs.chmodSync('./lib/' + lib.youtubedl, 0o755)
        })

    } else {

        msg('Found ' + lib.youtubedl)
        msg('Checking update ' + lib.youtubedl + ' ...', 'yellow')

        let date = new Date()

        // refresh youtube-dl 1 week
        if (parseInt(fs.statSync('./lib/' + lib.youtubedl).ctimeMs/1000) < parseInt(date.getTime/1000)-youtubedlExpires) {
            msg(lib.youtubedl + ' is Too old. try update ' + lib.youtubedl + ' ...', 'yellow')
            wget({"url":lib.youtubedlUrl, "dest": './lib/'}, function (data, err) {
                setTimeout(download, 1000)
            })

        } else {
            msg(lib.youtubedl + ' is Fresh. using library ...', 'yellow')
            download()

        }
        
    }

    if (!commandOptions.ffmpeg) {
        return;
    }

    msg('Checking ' + lib.ffmpeg + ' ...')
    if (!isExistsFile(lib.ffmpeg) || !isExistsFile(lib.ffprobe)) {
        msg('Not found ' + lib.fmpeg + ' or ' + lib.ffprobe, 'yellow')
        msg('Downloading ' + lib.ffmpeg + ' package ...', 'blue')

        wget({"ur": lib.ffmepgUrl, "dest": './lib/'}, function (data, err) {
            setTimeout(downloadFFmpeg, 1000)
        })
        
    } else {
        msg('Found ' + lib.ffmpeg + ' & ' + lib.ffprobe)

    }

}

function download () {

    if (process.argv[2]) {
        msg('Starting Download ...')
    } else {
        return;
    }

    msg('youtube-dl Options: ' + setting.downloadQuality)

    // -x: extract audio with ffmpeg
    // --audio-format best: 
    // -o: output filepath
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

    // using local library ffmpeg
    if (!isWindows && setting.ffmpegPath) {
        downloadOptions.push("--ffmpeg-location")
        downloadOptions.push(__dirname +  setting.ffmpegPath)
    }

    downloadOptions.push(playlist)

    // call youtube-dl
    let proc = childProcess.spawn(__dirname + '/lib/' + lib.youtubedl, downloadOptions,
        { cwd: __dirname + '/lib', stdio: 'inherit'}
    )

    return;

}

// file: string, filepath
function isExistsFile (file) {

    if (fs.existsSync('./lib/' + file))
        return true;

    return false;

}

function commandlineOptions () {

    const argv = [
        {
            name: '-nc',
            description :'Skip library software update',
            example: "'main.js -nc {someYouTubeURL}'"
        },
        {
            name: '-h',
            description :'this.',
            example: "'main.js -h'"
        },
        {
            name: '-q',
            description :'Cli video search mode',
            example: "'main.js -q \"{keyword}\"'"
        },
        {
            name: '-v',
            description :'direct VideoId download mode',
            example: "'main.js -v {VideoId}'"
        }
    ]

    if (isWindows) {
        msg("Usage: aym.bat https://www.youtube.com/watch?v=6Olt-ZtV_CE [options]", 'white', false)
        msg("Usage: aym.bat https://music.youtube.com/playlist?list=OLAK5uy_kaI5BH61jKTr2m6Ys8YuxuCYMNGrdAaEI [options]", 'white', false)
    } else {
        msg("Usage: aym.sh https://www.youtube.com/watch?v=6Olt-ZtV_CE [options]", 'white', false)
        msg("Usage: aym.sh https://music.youtube.com/playlist?list=OLAK5uy_kaI5BH61jKTr2m6Ys8YuxuCYMNGrdAaEI [options]", 'white', false)
    }
    msg("Options:", 'white', false)
    argv.forEach(function(cmd){
        msg('  '+cmd.name + '\t\t' + cmd.description, 'white', false)
    })

    return argv;

}

// msg: string, message
// color: string, [black, red, green, yellow, blue, purple, cyan, white]
// head: boolean, no print header text
function msg (msg, color=null, head=true) {

    let msgHeader = ''

    if (!head) {
        msgHeader = '[AYM] '
    } else {
        msgHeader = '[AYM]'
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

    return 0;
    
}

// err: stirng, error message
function error (err) {
    msg('[ERROR] ' + err, 'red')
    return 0;
}

// qStr: string, search query string
function search (qStr) {

    let options = {
        url: 'https://www.googleapis.com/youtube/v3/search?type=video&part=snippet' +
        '&maxResults=25&q=' + qStr + '&key=AIzaSyDgF9bO9NLLZRToopglOd9G8N5vbm46ZUg',
        method: 'GET',
        headers: [{'Content-Type':'application/json'}],
        json: true
    }

    request(options, function (error, response, body) {

        body.items.forEach (function (result) {
            console.log(result.id.videoId + '\t'+ result.snippet.title+ '\t' + '')
        })

    })

    if (error) {
        return false;
    } else {
        return true;
    }

}

// str: string, splited space argument string
function argvHandler (str) {

    if (str.substr(0, 4, str) === "http") {
        playlist = str

    } else if (str == "-h") {
        commandOptions.h = true
        commandlineOptions()
        process.exit()

    } else if (str == "-nc") {
        commandOptions.nc = true

    } else if (str == "-nm") {
        commandOptions.nm = true

    } else if (str == "-q") {
        commandOptions.q = true

    } else if (commandOptions.q) {
        commandOptions.q = str

    } else if (str == "-v") {
        commandOptions.v = true
        
    } else if (commandOptions.v) {
        commandOptions.v = str
    }
    
    return 0;
    
}