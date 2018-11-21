if [-e /usr/bin/ffmpeg] -o [-e /usr/bin/ffprobe; then
    echo 'require ffmpeg package ffmpeg/ffprobe'
    exit 1;
fi

node main.js $@