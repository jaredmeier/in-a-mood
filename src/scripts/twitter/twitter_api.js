const http = require('http');
import HOST from '../host';

export async function getTweets() {
    // console.log("Requesting tweets");
    // console.log(`Process env: ${process.env}`)
    // console.log(`Port: ${process.env.PORT}`);
    const options = {
        host: HOST,
        path: '/tweets',
    }

    if (process.env.NODE_ENV !== "production") {
        options.port = 3000;
    }

    return new Promise(function (resolve, reject) {
        let body = '';
        const req = http.request(options, res => {
            // console.log(`statusCode: ${res.statusCode}`)

            res.on('data', tweets => {
                // console.log(`Data received: ${tweets}`);
                body += String(tweets);
            })

            res.on("end", () => {
                resolve(body);
            })
        })

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    })
}


