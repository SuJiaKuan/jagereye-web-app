const killPort = require('kill-port');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const Promise = require('bluebird');
const { spawn } = require('child_process');

const includes = require('lodash/includes');

const ffprobe = Promise.promisify(ffmpeg.ffprobe);
const writeFile = Promise.promisify(fs.writeFile);

const FFSERVER_CONFIG_NAME = '/tmp/ffserver.conf';

let ffserver;

function renderFFServerConfig(stream, port) {
    return (`
        HTTPPort ${port}
        HTTPBindAddress 0.0.0.0
        MaxHTTPConnections 10
        MaxClients 10
        MaxBandwidth 1000000
        CustomLog -

        <Feed feed1.ffm>
            File /tmp/feed1.ffm
            FileMaxSize 20M
            Launch ffmpeg -i "${stream.url}"
        </Feed>

        <Stream stream.mjpg>
            Feed feed1.ffm
            Format mpjpeg
            VideoBitRate 10000
            VideoFrameRate 15
            VideoSize ${stream.width}x${stream.height}
            VideoIntraOnly
            NoAudio
            Strict -1
            NoDefaults
        </Stream>
    `);
}

export default function streamProxy(prefix, port) {
    const streamUrl = `${prefix}:${port}/stream.mjpg`;

    return (req, res) => {
        const { url } = req.body;

        if (ffserver && !ffserver.killed) {
            ffserver.stdout.destroy();
            ffserver.kill();
        }

        ffprobe(url)
        .then(metadata => {
            const { width, height } = metadata.streams[0];
            const ffserverConfig = renderFFServerConfig({
                url,
                width,
                height
            }, port);

            return writeFile(FFSERVER_CONFIG_NAME, ffserverConfig);
        })
        .then(() => {
            ffserver = spawn('ffserver', ['-f', FFSERVER_CONFIG_NAME]);

            ffserver.stdout.on('data', (data) => {
                // Send response when ffserver is ready.
                if (includes(data.toString(), '[GET] "/feed1.ffm')) {
                    ffserver.stdout.destroy();
                    return res.send({
                        streamUrl
                    });
                }
                // Kill by port when ffserver could not be started.
                // TODO(JiaKuan Su): Reply with error.
                if (includes(data.toString(), 'Could not start server')) {
                    killPort(port)
                    .catch(() => {})
                }
            });

        })
        .catch(err => {
            console.error(err.stack);
            res.end(err.message);
        });
    }
}
