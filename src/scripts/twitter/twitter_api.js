const http = require('http');
import HOST from '../host';

export async function getTweets() {
    console.log("Requesting tweets");
    console.log(`Port: ${port}`);
    const options = {
        host: HOST,
        port: process.env.PORT || 3000,
        path: '/tweets',
    }

    return new Promise(function (resolve, reject) {
        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', tweets => {
                console.log(`Data received: ${tweets}`);
                resolve(tweets);
            })
        })

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    })
}


