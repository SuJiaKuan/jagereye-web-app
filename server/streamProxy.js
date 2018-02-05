const httpError = require('http-errors')
const killPort = require('kill-port');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const Promise = require('bluebird');
const { spawn } = require('child_process');

const includes = require('lodash/includes');
const find = require('lodash/find');

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

function sendError(res, status, message, origErrObj) {
    const error = new Error();

    error.status = status

    if (message) {
        error.message = message;
    } else {
        error.message = httpError(status).message;
    }

    if (origErrObj) {
        if (origErrObj.kind === 'ObjectId') {
            error.status = 400;
            error.message = 'Invalid ObjectId format';
        }
        error.stack = origErrObj.stack;
    }

    return res.status(status).send(error);
}

export default function streamProxy(prefix, port) {
    const streamUrl = `${prefix}:${port}/stream.mjpg`;

    return (req, res) => {
        const { url } = req.body;

        if (ffserver && !ffserver.killed) {
            ffserver.stdout.destroy();
            ffserver.stderr.destroy();
            ffserver.kill();
        }

        ffprobe(url)
        .then(metadata => {
            let width;
            let height;
            let stream;

            stream = find(metadata.streams, (stream) => (
                stream.width > 0 && stream.height > 0
            ));

            if (stream) {
                width = stream.coded_width;
                height = stream.coded_height;
            } else {
                stream = find(metadata.streams, (stream) => (
                    stream.coded_width > 0 && stream.coded_height > 0
                ));

                if (!stream) {
                    return sendError(res, 500, `Can not get video size for ${url}`);
                }

                width = stream.coded_width;
                height = stream.coded_height;
            }

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
                console.log(data.toString());

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

            ffserver.stderr.on('data', (data) => {
                console.error(data.toString());
            });

        })
        .catch(err => {
            console.error(err.stack);

            if (includes(err.stack, 'method DESCRIBE failed: 404 Not Found')) {
                return sendError(res, 404, `URL: ${url} not found`, err);
            } else if (includes(err.stack, 'Failed to resolve hostname')) {
                return sendError(res, 404, `Failed to resolve ${url}`, err);
            } else {
                return sendError(res, 500, err.message, err);
            }
        });
    }
}
